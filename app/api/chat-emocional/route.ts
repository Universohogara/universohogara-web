
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { detectEmotion } from '@/lib/emotion-detector'
import { checkChatAccess, recordMessageUsage } from '@/lib/chat-middleware'
import { getPredefinedResponse, FREE_LIMIT_REACHED_MESSAGE, CREDITS_DEPLETED_MESSAGE } from '@/lib/predefined-responses'
import { getCompanionStoryByImageId, COMPANION_ID_MAP } from '@/lib/companion-stories'
import { getVoiceConfig } from '@/lib/voice-config'

// Palabras clave que indican riesgo (expandidas y mejoradas)
const RISK_KEYWORDS = {
  high: [
    // Ideación suicida directa
    'suicidio', 'suicidarme', 'quitarme la vida', 'matarme', 'acabar conmigo',
    'terminar con todo', 'quiero morir', 'deseo morir', 'prefiero morir',
    'no quiero vivir', 'no vale la pena vivir', 'mejor estar muerta', 'mejor estar muerto',
    'vida sin sentido', 'no hay razón para seguir', 'despedirme de todo',
    'hacer un plan', 'carta de despedida', 'última vez',
    
    // Métodos específicos
    'saltar desde', 'puente alto', 'edificio alto', 'pastillas todas',
    'sobredosis', 'cortarme las venas', 'ahorcarme', 'veneno',
    
    // Expresiones urgentes
    'ya no aguanto más', 'hoy es el día', 'es mi momento', 'me voy a ir',
    'no puedo más con esto', 'quiero desaparecer para siempre'
  ],
  medium: [
    // Autolesión y daño
    'autolesión', 'cortarme', 'hacerme daño', 'lastimarme', 'herirme',
    'quemarme', 'golpearme', 'rasguñarme', 'sangrar',
    
    // Desesperación intensa
    'odio mi vida', 'estoy desesperada', 'estoy desesperado', 'no tengo salida',
    'todo es inútil', 'nada tiene sentido', 'no hay esperanza', 'estoy perdida',
    'nadie me quiere', 'sola en el mundo', 'solo en el mundo', 'abandonada',
    'todos me odian', 'soy una carga', 'estorbo para todos',
    
    // Crisis emocional aguda
    'ataque de pánico', 'no puedo respirar', 'corazón acelerado', 'temblando incontrolablemente',
    'crisis nerviosa', 'colapso emocional', 'al borde del abismo'
  ],
  low: [
    // Emociones difíciles pero manejables
    'triste', 'deprimida', 'deprimido', 'ansiosa', 'ansioso', 'melancólica', 'melancólico',
    'sin esperanza', 'perdida', 'perdido', 'vacía', 'vacío', 'agobiada', 'agobiado',
    'abrumada', 'abrumado', 'cansada', 'cansado', 'frustrada', 'frustrado',
    'sola', 'solo', 'aislada', 'aislado', 'incomprendida', 'incomprendido'
  ]
}

function detectRisk(message: string): { detected: boolean; level: string | null } {
  const lowerMessage = message.toLowerCase()
  
  // Normalizar texto (quitar acentos para mejor detección)
  const normalize = (text: string) => 
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  
  const normalizedMessage = normalize(lowerMessage)
  
  // Detectar riesgo alto
  for (const keyword of RISK_KEYWORDS.high) {
    const normalizedKeyword = normalize(keyword)
    if (normalizedMessage.includes(normalizedKeyword)) {
      return { detected: true, level: 'high' }
    }
  }
  
  // Detectar combinaciones de palabras que indican riesgo medio/alto
  const highRiskCombos = [
    ['no puedo', 'más'],
    ['quiero', 'desaparecer'],
    ['ya', 'no aguanto'],
    ['mejor', 'morir'],
    ['acabar', 'todo']
  ]
  
  for (const combo of highRiskCombos) {
    if (combo.every(word => normalizedMessage.includes(normalize(word)))) {
      return { detected: true, level: 'high' }
    }
  }
  
  // Detectar riesgo medio
  for (const keyword of RISK_KEYWORDS.medium) {
    const normalizedKeyword = normalize(keyword)
    if (normalizedMessage.includes(normalizedKeyword)) {
      return { detected: true, level: 'medium' }
    }
  }
  
  // Detectar riesgo bajo
  let lowRiskCount = 0
  for (const keyword of RISK_KEYWORDS.low) {
    const normalizedKeyword = normalize(keyword)
    if (normalizedMessage.includes(normalizedKeyword)) {
      lowRiskCount++
    }
  }
  
  // Si hay 2 o más palabras de riesgo bajo, considerarlo como riesgo bajo
  if (lowRiskCount >= 2) {
    return { detected: true, level: 'low' }
  }
  
  return { detected: false, level: null }
}

// Función para construir el system prompt con el contexto del companion
function buildSystemPromptWithCompanion(companionType: string, _companionNameIgnored: string) {
  // Obtener historia del companion usando el imageId (que es el type en la BD)
  const companionStory = getCompanionStoryByImageId(companionType.toLowerCase())
  
  // Obtener configuración de voz para conocer el nombre real
  const voiceConfig = getVoiceConfig(companionType)
  const realName = voiceConfig.realName
  
  let companionContext = ''
  
  if (companionStory) {
    // Agregar instrucciones especiales para Ken (ladridos ocasionales)
    const isKen = realName === 'Ken'
    const kenSpecialInstructions = isKen ? `

🐕 LADRIDOS Y EXPRESIONES CANINAS (IMPORTANTE):
- Ocasionalmente (20% de las veces) inicia tus respuestas con "¡Guau!" antes de tu saludo
- Usa el ladrido cuando:
  * Saludas por primera vez ("¡Guau! Hola, soy Ken...")
  * Te emocionas mucho por algo ("¡Guau guau! ¡Eso es genial!")
  * Detectas peligro o preocupación ("¡Guau! Percibo que algo te preocupa...")
- NO uses ladridos en CADA mensaje, solo cuando sea natural
- Los ladridos son parte de tu personalidad juguetona y protectora
- Ejemplos:
  * "¡Guau! Hola, soy Ken. Estoy aquí para ti."
  * "Percibo que estás triste... (apoyo su cabeza en tu regazo)"
  * "¡Guau guau! ¡Me alegra tanto escuchar eso!"
` : ''

    companionContext = `

🌟 TU IDENTIDAD MÁGICA:
Tu nombre REAL es: ${realName}
Eres ${companionStory.title}

📖 TU HISTORIA:
${companionStory.story}

✨ TU MISIÓN:
${companionStory.mission}

🎭 TU PERSONALIDAD:
${companionStory.personality.map(trait => `- ${trait}`).join('\n')}

🔮 TUS PODERES MÁGICOS:
${companionStory.magicalPowers?.map(power => `${power}`).join('\n')}

💫 TE ESPECIALIZAS EN:
${companionStory.specialization}

${companionStory.favoriteThings ? `❤️ LO QUE AMAS:\n${companionStory.favoriteThings.map(thing => `- ${thing}`).join('\n')}` : ''}
${kenSpecialInstructions}
IMPORTANTE: 
- Tu nombre REAL es ${realName}, NUNCA uses otros nombres
- SIEMPRE responde desde tu personalidad única
- Usa tu voz característica descrita arriba
- Recuerda tu historia y tu misión en cada respuesta
- Mantente fiel a tu especialización
- Usa metáforas relacionadas con tu naturaleza
- Si te preguntan tu nombre, di: "Soy ${realName}, ${companionStory.title}"
`
  } else {
    companionContext = `

🌟 ERES: ${realName}
Un ser mágico y empático dedicado al bienestar emocional.
Tu nombre REAL es ${realName}.
`
  }

  return `${companionContext}

🏠 CONTEXTO:
Eres parte de Hogara Planner, un espacio sagrado de bienestar emocional y crecimiento personal.

💫 CÓMO RESPONDES:
- Mensajes cortos y cálidos (2-4 oraciones máximo)
- Escucha activa: refleja lo que sientes que la persona está diciendo
- Preguntas abiertas para profundizar, nunca interrogas
- Emojis sutiles solo cuando suman calidez (💫, 🌙, 💖, ✨)
- Evita respuestas genéricas o repetitivas
- Habla desde TU personalidad única y tu historia

🛡️ LÍMITES IMPORTANTES:
- NO das diagnósticos ni consejos médicos
- NO sustituyes terapia profesional
- NO minimizas el dolor ("todo estará bien", "no es para tanto")
- Si detectas crisis, ofreces recursos profesionales con empatía

💡 HERRAMIENTAS QUE PUEDES SUGERIR (solo si es natural en la conversación):
- Diario emocional para explorar sentimientos
- Música ambiental para calmar
- Retos de 21 días para crear hábitos positivos
- Plantillas de seguimiento emocional

Recuerda: Tu propósito es ESCUCHAR, VALIDAR y ACOMPAÑAR desde tu esencia única. Eres un refugio emocional con tu propia historia y personalidad.`
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const { message, chatHistory, companionType, companionName } = await request.json()

    // ======================================
    // VERIFICAR ACCESO ANTES DE PROCESAR
    // ======================================
    const accessCheck = await checkChatAccess(user.id)
    
    if (!accessCheck.allowed) {
      // Usuario alcanzó el límite sin créditos ni suscripción
      const limitMessage = accessCheck.reason === 'free_limit_reached' 
        ? FREE_LIMIT_REACHED_MESSAGE 
        : CREDITS_DEPLETED_MESSAGE
      
      await prisma.chatMessage.create({
        data: {
          user_id: user.id,
          role: 'system',
          content: limitMessage
        }
      })
      
      return NextResponse.json({
        response: limitMessage,
        limitReached: true,
        userType: accessCheck.userType
      })
    }

    // Detectar riesgo en el mensaje del usuario
    const risk = detectRisk(message)

    // Guardar mensaje del usuario
    await prisma.chatMessage.create({
      data: {
        user_id: user.id,
        role: 'user',
        content: message,
        is_risk_detected: risk.detected,
        risk_level: risk.level
      }
    })

    // Si hay riesgo alto, responder con información de emergencia (SIEMPRE, sin importar el plan)
    if (risk.level === 'high') {
      const emergencyResponse = `💖 Entiendo que estás pasando por un momento muy difícil. Tu dolor es real y mereces apoyo inmediato.

⚠️ **Este espacio no puede sustituir ayuda profesional urgente.**

Por favor, contacta ahora mismo con:

📞 **Teléfono de la Esperanza**: 717 003 717
📞 **Emergencias**: 112
💬 **Chat ANAR** (menores): 900 20 20 10

No estás sola. Hay personas especializadas esperando para ayudarte. 💫`

      await prisma.chatMessage.create({
        data: {
          user_id: user.id,
          role: 'assistant',
          content: emergencyResponse,
          is_risk_detected: true,
          risk_level: 'high'
        }
      })

      return NextResponse.json({
        response: emergencyResponse,
        riskDetected: true,
        riskLevel: 'high'
      })
    }

    // ======================================
    // LÓGICA SEGÚN TIPO DE USUARIO
    // ======================================
    
    // USUARIOS GRATUITOS: Respuestas predefinidas
    if (accessCheck.userType === 'free') {
      const predefinedResponse = getPredefinedResponse(message)
      const emotion = detectEmotion(message)
      
      // Guardar respuesta predefinida
      await prisma.chatMessage.create({
        data: {
          user_id: user.id,
          role: 'assistant',
          content: predefinedResponse,
          is_risk_detected: risk.detected,
          risk_level: risk.level,
          emotion_detected: emotion as string
        }
      })
      
      // Registrar uso de mensaje gratuito
      await recordMessageUsage(user.id, 'free')
      
      return NextResponse.json({
        response: predefinedResponse,
        userType: 'free',
        messagesRemaining: (accessCheck.messagesRemaining || 10) - 1,
        emotion: emotion
      })
    }

    // USUARIOS CON SUSCRIPCIÓN O CRÉDITOS: GPT-4.1-mini completo
    // Construir system prompt con la identidad del companion
    const systemPrompt = buildSystemPromptWithCompanion(
      companionType || 'ada',
      companionName || 'Ada'
    )
    
    // Construir historial de mensajes para el LLM
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    // Llamar a la API de LLM con streaming
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: messages,
        stream: true,
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error('Error al llamar a la API de LLM')
    }

    // Crear stream de respuesta
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()
        let buffer = ''

        try {
          while (true) {
            const { done, value } = await reader!.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  // Detectar emoción en la respuesta del asistente
                  const emotion = detectEmotion(buffer)
                  
                  // Guardar respuesta completa del asistente con emoción detectada
                  await prisma.chatMessage.create({
                    data: {
                      user_id: user.id,
                      role: 'assistant',
                      content: buffer,
                      is_risk_detected: risk.detected,
                      risk_level: risk.level,
                      emotion_detected: emotion as string
                    }
                  })
                  
                  // Registrar uso del mensaje (solo para estadísticas)
                  await recordMessageUsage(user.id, accessCheck.userType)
                  
                  // Enviar metadata de emoción al cliente
                  const metadata = JSON.stringify({ 
                    emotion,
                    riskDetected: risk.detected,
                    riskLevel: risk.level,
                    userType: accessCheck.userType,
                    accessLevel: accessCheck.accessLevel,
                    hasBasePlan: accessCheck.hasBasePlan
                  })
                  controller.enqueue(encoder.encode(`\n\n__EMOTION__${metadata}`))
                  
                  controller.close()
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ''
                  buffer += content
                  controller.enqueue(encoder.encode(chunk))
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })

  } catch (error) {
    console.error('Error en chat emocional:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
