
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import {
  generateVoiceWithElevenLabs,
  getMagicalLanguageMessage,
  checkElevenLabsQuota,
  MAGIC_DEPLETED_MESSAGE
} from '@/lib/elevenlabs-service'
import { cleanTextForSpeech } from '@/lib/text-cleaner'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Funciones de desencriptación (mismas que en voice-config/route.ts)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'hogara-voice-encryption-key-32ch'
const ALGORITHM = 'aes-256-cbc'

function decrypt(text: string): string {
  const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest()
  const parts = text.split(':')
  const iv = Buffer.from(parts[0], 'hex')
  const encryptedText = parts[1]
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { text, companionType, emotion } = await req.json()

    if (!text || !companionType) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      )
    }
    
    console.log(`🎭 Generando voz para ${companionType} con emoción: ${emotion || 'calm'}`)

    // Obtener el usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        role: true,
        voice_minutes_used: true,
        voice_minutes_limit: true,
        voice_reset_date: true,
        elevenLabsApiKey: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Solo usuarios premium pueden usar voces realistas de ElevenLabs
    // Los usuarios no premium usarán voces de Abacus AI directamente
    if (user.role !== 'premium' && user.role !== 'admin') {
      console.log(`🎤 Usuario no premium, usando voces de Abacus AI para ${companionType}`)
      
      const cleanedText = cleanTextForSpeech(text)
      
      if (!cleanedText || cleanedText.trim().length === 0) {
        return NextResponse.json({
          success: false,
          error: 'empty_text',
          silentError: true
        }, { status: 400 })
      }

      try {
        const abacusResponse = await fetch(`${req.nextUrl.origin}/api/tts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: cleanedText,
            companionType,
            emotion: emotion || 'calm'
          })
        })

        if (abacusResponse.ok) {
          const audioBuffer = await abacusResponse.arrayBuffer()
          const audioBase64 = Buffer.from(audioBuffer).toString('base64')

          return NextResponse.json({
            success: true,
            audioBase64,
            provider: 'abacus',
            reason: 'not_premium'
          })
        }
      } catch (error) {
        console.error('❌ Error generando voz con Abacus:', error)
      }

      return NextResponse.json({
        success: false,
        error: 'voice_generation_failed',
        silentError: true
      }, { status: 500 })
    }

    // Desencriptar API key del usuario si existe
    let userApiKey: string | null = null
    if (user.elevenLabsApiKey) {
      try {
        userApiKey = decrypt(user.elevenLabsApiKey)
      } catch (error) {
        console.error('❌ Error desencriptando API key del usuario:', error)
      }
    }

    // Si el usuario tiene API key propia, usarla sin límites
    const usingOwnApiKey = !!userApiKey
    
    // Verificar si necesitamos resetear el contador mensual (solo si NO tiene API key propia)
    const now = new Date()
    const resetDate = user.voice_reset_date ? new Date(user.voice_reset_date) : new Date()
    const daysSinceReset = Math.floor((now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24))
    
    let minutesUsed = user.voice_minutes_used || 0
    let minutesLimit = user.voice_minutes_limit || 100

    // Si pasaron más de 30 días, resetear contador
    if (daysSinceReset >= 30 && !usingOwnApiKey) {
      minutesUsed = 0
      await prisma.user.update({
        where: { id: user.id },
        data: {
          voice_minutes_used: 0,
          voice_reset_date: now
        }
      })
    }

    // Verificar límites solo si usa cuota compartida
    let useAbacusFallback = false
    let fallbackReason = ''
    
    if (!usingOwnApiKey) {
      // Verificar si tiene minutos disponibles
      if (minutesUsed >= minutesLimit) {
        console.log('⚠️ Minutos de usuario agotados, usando voces de Abacus como fallback')
        useAbacusFallback = true
        fallbackReason = 'user_quota_exceeded'
      }

      // Verificar cuota de Eleven Labs compartida
      if (!useAbacusFallback) {
        const quota = await checkElevenLabsQuota()
        if (!quota.can_use_api) {
          console.log('⚠️ Cuota de Eleven Labs agotada, usando voces de Abacus como fallback')
          useAbacusFallback = true
          fallbackReason = 'api_quota_exceeded'
        }
      }
    }

    // Si se debe usar fallback, generar voz con Abacus AI
    if (useAbacusFallback) {
      console.log(`🎤 Generando voz con Abacus AI (fallback) para ${companionType}`)
      
      // Limpiar el texto
      const cleanedText = cleanTextForSpeech(text)
      
      if (!cleanedText || cleanedText.trim().length === 0) {
        // Si el texto está vacío, devolver error silencioso
        return NextResponse.json({
          success: false,
          error: 'empty_text',
          silentError: true
        }, { status: 400 })
      }

      try {
        // Llamar al endpoint de TTS de Abacus
        const abacusResponse = await fetch(`${req.nextUrl.origin}/api/tts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: cleanedText,
            companionType,
            emotion: emotion || 'calm'
          })
        })

        if (abacusResponse.ok) {
          const audioBuffer = await abacusResponse.arrayBuffer()
          const audioBase64 = Buffer.from(audioBuffer).toString('base64')
          
          // Actualizar última vez usado
          await prisma.user.update({
            where: { id: user.id },
            data: { voice_last_used: now }
          })

          // Registrar uso en log
          await prisma.$executeRaw`
            INSERT INTO voice_usage_logs (id, user_id, companion_type, text_length, minutes_used, provider, success, created_at)
            VALUES (
              ${crypto.randomUUID()},
              ${user.id},
              ${companionType},
              ${text.length},
              0,
              'abacus_fallback',
              true,
              NOW()
            )
          `

          return NextResponse.json({
            success: true,
            audioBase64,
            usedFallback: true,
            provider: 'abacus',
            fallbackReason,
            minutesUsed,
            minutesLimit,
            nextResetDate: new Date(resetDate.getTime() + 30 * 24 * 60 * 60 * 1000)
          })
        } else {
          console.error('❌ Error generando voz con Abacus')
          return NextResponse.json({
            success: false,
            error: 'abacus_tts_failed',
            silentError: true
          }, { status: 500 })
        }
      } catch (error) {
        console.error('❌ Error al llamar a Abacus TTS:', error)
        return NextResponse.json({
          success: false,
          error: 'abacus_tts_error',
          silentError: true
        }, { status: 500 })
      }
    }

    // IMPORTANTE: Limpiar el texto de emojis y caracteres especiales
    // para que ElevenLabs no intente leer "estrella brillante", "chispa", etc.
    const cleanedText = cleanTextForSpeech(text)
    
    console.log('📝 Texto original:', text.substring(0, 100))
    console.log('🧹 Texto limpio:', cleanedText.substring(0, 100))
    
    if (!cleanedText || cleanedText.trim().length === 0) {
      console.warn('⚠️ Texto limpio está vacío')
      return NextResponse.json({
        success: false,
        error: 'empty_text',
        silentError: true
      }, { status: 400 })
    }
    
    // Generar voz con Eleven Labs (con API key del usuario si existe)
    const result = await generateVoiceWithElevenLabs(cleanedText, companionType, userApiKey, emotion)

    if (!result.success || !result.audioBuffer) {
      console.error('❌ Error generando voz con ElevenLabs, intentando Abacus como fallback')
      
      // Intentar con Abacus como fallback
      try {
        const abacusResponse = await fetch(`${req.nextUrl.origin}/api/tts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: cleanedText,
            companionType,
            emotion: emotion || 'calm'
          })
        })

        if (abacusResponse.ok) {
          const audioBuffer = await abacusResponse.arrayBuffer()
          const audioBase64 = Buffer.from(audioBuffer).toString('base64')
          
          // Actualizar última vez usado
          await prisma.user.update({
            where: { id: user.id },
            data: { voice_last_used: now }
          })

          // Registrar uso en log
          await prisma.$executeRaw`
            INSERT INTO voice_usage_logs (id, user_id, companion_type, text_length, minutes_used, provider, success, created_at)
            VALUES (
              ${crypto.randomUUID()},
              ${user.id},
              ${companionType},
              ${text.length},
              0,
              'abacus_fallback',
              true,
              NOW()
            )
          `

          return NextResponse.json({
            success: true,
            audioBase64,
            usedFallback: true,
            provider: 'abacus'
          })
        }
      } catch (fallbackError) {
        console.error('❌ Error con fallback de Abacus:', fallbackError)
      }
      
      // Si todo falla, devolver error silencioso
      return NextResponse.json({
        success: false,
        error: result.error || 'voice_generation_failed',
        silentError: true
      }, { status: 500 })
    }

    // Actualizar contador de minutos (solo si usa cuota compartida)
    const minutesUsedNow = result.minutesUsed || 0.1 // Mínimo 0.1 minutos
    let newMinutesUsed = minutesUsed

    if (!usingOwnApiKey) {
      newMinutesUsed = minutesUsed + minutesUsedNow
      await prisma.user.update({
        where: { id: user.id },
        data: {
          voice_minutes_used: newMinutesUsed,
          voice_last_used: now
        }
      })
      console.log(`✅ Voz generada para ${companionType}: ${minutesUsedNow} minutos usados (Total: ${newMinutesUsed}/${minutesLimit})`)
    } else {
      // Solo actualizar last_used
      await prisma.user.update({
        where: { id: user.id },
        data: {
          voice_last_used: now
        }
      })
      console.log(`✅ Voz generada para ${companionType} usando API key personal del usuario`)
    }

    // Registrar uso en log
    await prisma.$executeRaw`
      INSERT INTO voice_usage_logs (id, user_id, companion_type, text_length, minutes_used, provider, success, created_at)
      VALUES (
        ${crypto.randomUUID()},
        ${user.id},
        ${companionType},
        ${text.length},
        ${minutesUsedNow},
        ${usingOwnApiKey ? 'elevenlabs_byok' : 'elevenlabs_shared'},
        true,
        NOW()
      )
    `

    // Convertir el audio a base64 para enviar al cliente
    const audioBase64 = Buffer.from(result.audioBuffer).toString('base64')

    return NextResponse.json({
      success: true,
      audioBase64,
      usingOwnApiKey,
      minutesUsed: newMinutesUsed,
      minutesLimit,
      minutesRemaining: usingOwnApiKey ? -1 : (minutesLimit - newMinutesUsed), // -1 = ilimitado
      charactersUsed: result.charactersUsed
    })

  } catch (error) {
    console.error('❌ Error en generate-voice:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'internal_server_error',
        silentError: true
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Endpoint para verificar el estado de la cuota
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        role: true,
        voice_minutes_used: true,
        voice_minutes_limit: true,
        voice_reset_date: true,
        elevenLabsApiKey: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const hasOwnApiKey = !!user.elevenLabsApiKey
    const minutesUsed = user.voice_minutes_used || 0
    const minutesLimit = user.voice_minutes_limit || 100
    const resetDate = user.voice_reset_date ? new Date(user.voice_reset_date) : new Date()
    const nextResetDate = new Date(resetDate.getTime() + 30 * 24 * 60 * 60 * 1000)

    return NextResponse.json({
      isPremium: user.role === 'premium' || user.role === 'admin',
      hasOwnApiKey,
      minutesUsed,
      minutesLimit,
      minutesRemaining: hasOwnApiKey ? -1 : Math.max(0, minutesLimit - minutesUsed), // -1 = ilimitado
      percentageUsed: hasOwnApiKey ? 0 : Math.min(100, Math.round((minutesUsed / minutesLimit) * 100)),
      nextResetDate,
      canUseVoice: hasOwnApiKey || minutesUsed < minutesLimit
    })

  } catch (error) {
    console.error('❌ Error obteniendo estado de voz:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
