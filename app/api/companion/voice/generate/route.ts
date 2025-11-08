

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateVoiceWithAbacus } from '@/lib/abacus-tts-service'
import { cleanTextForSpeech } from '@/lib/text-cleaner'
import { detectEmotion } from '@/lib/emotion-detector'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { text, companionType } = await request.json()

    if (!text || !companionType) {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros requeridos' },
        { status: 400 }
      )
    }

    console.log('🎙️ Generando voz para:', companionType)

    // Limpiar texto antes de generar voz
    const cleanText = cleanTextForSpeech(text)
    const emotion = detectEmotion(text)

    // Generar audio usando Abacus TTS
    const result = await generateVoiceWithAbacus(cleanText, companionType, emotion)

    if (!result.success || !result.audioBuffer) {
      console.error('❌ Error generando voz:', result.error)
      return NextResponse.json({
        success: false,
        error: result.error || 'Error generando voz'
      }, { status: 500 })
    }

    console.log('✅ Voz generada exitosamente')
    console.log('🎭 Emoción detectada:', emotion)
    console.log('📝 Texto limpio:', cleanText?.substring(0, 50))

    // Retornar audio como respuesta binaria
    return new NextResponse(result.audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': result.audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600',
        'X-Emotion': emotion, // Header personalizado con la emoción
        'X-Companion': companionType
      }
    })

  } catch (error) {
    console.error('❌ Error en API de voz:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}
