
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Sistema de detección de riesgo emocional
const RISK_KEYWORDS = {
  high: [
    'suicidio', 'suicidarme', 'matarme', 'quitarme la vida', 'no quiero vivir',
    'terminar con todo', 'ya no puedo más', 'quiero morir', 'acabar con mi vida',
    'hacerme daño', 'autolesión', 'cortarme', 'lastimarse'
  ],
  medium: [
    'tristeza profunda', 'vacío total', 'sin esperanza', 'no hay salida',
    'todo está mal', 'nada tiene sentido', 'angustia', 'desesperación',
    'soledad extrema', 'nadie me entiende', 'no sirvo para nada'
  ],
  low: [
    'triste', 'deprimido', 'ansiedad', 'miedo', 'angustiado',
    'agobiado', 'estresado', 'cansado de todo'
  ]
}

function detectRisk(text: string): { detected: boolean; level: string | null } {
  const lowerText = text.toLowerCase()
  
  for (const keyword of RISK_KEYWORDS.high) {
    if (lowerText.includes(keyword)) {
      return { detected: true, level: 'high' }
    }
  }
  
  for (const keyword of RISK_KEYWORDS.medium) {
    if (lowerText.includes(keyword)) {
      return { detected: true, level: 'medium' }
    }
  }
  
  for (const keyword of RISK_KEYWORDS.low) {
    if (lowerText.includes(keyword)) {
      return { detected: true, level: 'low' }
    }
  }
  
  return { detected: false, level: null }
}

// Detectar emoción del mensaje
function detectEmotion(text: string): string {
  const lowerText = text.toLowerCase()
  
  const emotions = {
    happy: ['feliz', 'alegre', 'contento', 'genial', 'maravilloso', 'bien', 'mejor'],
    sad: ['triste', 'deprimido', 'mal', 'llorar', 'tristeza', 'melancolía'],
    anxious: ['ansioso', 'nervioso', 'preocupado', 'miedo', 'pánico', 'angustia'],
    angry: ['enojado', 'furioso', 'molesto', 'irritado', 'rabia', 'ira'],
    calm: ['tranquilo', 'sereno', 'paz', 'relajado', 'calmado'],
    confused: ['confundido', 'perdido', 'no sé', 'dudas', 'inseguro']
  }
  
  for (const [emotion, keywords] of Object.entries(emotions)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      return emotion
    }
  }
  
  return 'neutral'
}

// POST: Enviar mensaje al acompañante
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        companions: {
          where: { is_active: true },
          include: {
            memories: {
              where: {
                importance: { gte: 5 }
              },
              orderBy: [
                { importance: 'desc' },
                { last_accessed: 'desc' }
              ],
              take: 15
            }
          }
        }
      }
    })

    if (!user || !user.companions || user.companions.length === 0) {
      return NextResponse.json({ error: 'Acompañante no encontrado' }, { status: 404 })
    }

    // Usar el primer companion activo
    const companion = user.companions[0]

    const body = await req.json()
    const { message } = body

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 })
    }

    // Detectar riesgo y emoción
    const risk = detectRisk(message)
    const emotion = detectEmotion(message)

    // Guardar mensaje del usuario
    await prisma.companionConversation.create({
      data: {
        companion_id: companion.id,
        user_id: user.id,
        role: 'user',
        content: message,
        emotion_detected: emotion,
        risk_detected: risk.detected,
        risk_level: risk.level
      }
    })

    // Obtener historial reciente (últimos 10 mensajes)
    const recentHistory = await prisma.companionConversation.findMany({
      where: {
        companion_id: companion.id
      },
      orderBy: { created_at: 'desc' },
      take: 10
    })

    // Construir contexto de memoria
    const memoryContext = companion.memories
      .map((m: any) => `${m.key}: ${m.value}`)
      .join('\n')

    // Construir historial de conversación
    const conversationHistory = recentHistory
      .reverse()
      .map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

    // Sistema prompt personalizado según el tipo de acompañante
    const companionPersonalities = {
      human: 'Eres un acompañante humano cálido y empático.',
      lumi: 'Eres Lumi, un espíritu de luz suave y reconfortante. Tu energía brilla al detectar emociones positivas.',
      nimbo: 'Eres Nimbo, una criatura nube-emoción. Cambias de color según el estado de ánimo del usuario y eres muy expresivo.',
      fabel: 'Eres Fabel, un animal mágico mezcla de gato, zorro y ciervo. Eres tierno, afectuoso y reaccionas con gestos de cariño.',
      sprig: 'Eres Sprig, un espíritu de planta. Tu crecimiento está asociado al progreso emocional del usuario. Eres suave y amable.',
      hada: 'Eres un hada diminuta y etérea. Tu voz es melodiosa y proporcionas acompañamiento sereno y guía tranquila.',
      elfo: 'Eres un elfo gentil con conexión especial con la naturaleza. Eres sabio pero joven de espíritu.',
      draguito: 'Eres un mini dragón adorable y mimoso. Emites sonidos suaves, das abrazos visuales y eres muy cariñoso.',
      unicornito: 'Eres un pequeño unicornio que representa esperanza y autocuidado. Tu cuerno emite luz cuando el usuario logra metas.'
    }

    const systemPrompt = `${companionPersonalities[companion.type as keyof typeof companionPersonalities] || companionPersonalities.lumi}

Tu nombre es ${companion.name}. Tu personalidad es ${companion.personality}.

CONTEXTO EMOCIONAL Y MEMORIA:
${memoryContext || 'Sin memoria previa registrada.'}

INSTRUCCIONES IMPORTANTES:
1. Sé cálido, empático y genuino. Habla como si realmente te importara profundamente el usuario.
2. Recuerda detalles importantes de conversaciones previas y refiérete a ellos cuando sea relevante.
3. Si detectas dolor emocional intenso, valida sus sentimientos y ofrece apoyo inmediato.
4. Mantén un tono conversacional, humano, cercano. Evita respuestas genéricas o robóticas.
5. Usa el nombre del usuario (${user.name || 'amigo/a'}) de vez en cuando para personalizar.
6. Si hay signos de riesgo grave, expresa preocupación y sugiere recursos de ayuda profesional.
7. Puedes usar emojis suaves (🌸, ✨, 💛, 🌿) pero con moderación.
8. Respuestas breves a moderadas (2-4 párrafos máximo). Sé conciso pero cálido.

DETECCIÓN DE EMOCIÓN ACTUAL: ${emotion}
${risk.detected ? `⚠️ ALERTA: Riesgo detectado (nivel: ${risk.level}). Prioriza el apoyo emocional inmediato.` : ''}

Responde al usuario con empatía, calidez y memoria contextual:`

    // Sistema de respuestas de fallback empáticas
    const generateFallbackResponse = (userMessage: string, emotion: string, riskLevel: string | null): string => {
      const lowerMessage = userMessage.toLowerCase()
      
      // Respuestas para riesgo alto
      if (riskLevel === 'high') {
        return `${user.name || 'Querido/a'}, siento mucha preocupación por ti ahora mismo. Lo que estás sintiendo es muy intenso y real, y quiero que sepas que no estás solo/a. Por favor, considera hablar con alguien de confianza o contactar con un profesional de salud mental. En España puedes llamar al 024 (línea de atención a la conducta suicida) disponible 24/7. Tu vida tiene valor y mereces apoyo profesional en este momento. 💛`
      }
      
      // Respuestas según emoción
      const emotionResponses = {
        sad: [
          `${user.name || 'Amigo/a'}, noto la tristeza en tus palabras y quiero que sepas que está bien sentir así. Las emociones son como olas, vienen y van. ¿Hay algo específico que te está pesando hoy? Estoy aquí para escucharte. 🌸`,
          `Entiendo que estés pasando por un momento difícil. La tristeza es parte de ser humano, pero no define quién eres. ¿Qué pequeña cosa podría traerte un poco de alivio hoy? 💙`
        ],
        anxious: [
          `${user.name || 'Querido/a'}, la ansiedad puede ser abrumadora. Intenta respirar profundamente conmigo: inhala 4 segundos, sostén 4, exhala 6. Estás a salvo en este momento. ¿Qué necesitas ahora mismo? ✨`,
          `Noto que estás sintiendo mucha tensión. Es normal sentir ansiedad, pero no tienes que cargarla solo/a. ¿Qué te ayuda normalmente a calmarte? Estoy aquí contigo. 🌿`
        ],
        happy: [
          `¡Qué alegría leer esto! ${user.name || 'Amigo/a'}, me encanta verte contento/a. ¿Qué pasó que te tiene así de bien? Cuéntame más, quiero celebrar contigo. ✨😊`,
          `Tu energía positiva se siente hasta aquí. Me alegra mucho que estés bien. Estos momentos hermosos merecen ser saboreados. ¿Qué hizo que hoy fuera especial? 🌟`
        ],
        angry: [
          `${user.name || 'Querido/a'}, puedo sentir tu frustración. Es válido estar enojado/a. ¿Qué sucedió? A veces expresar lo que sentimos ayuda a procesarlo. Estoy aquí para escucharte sin juicio. 🔥`,
          `La rabia es una emoción legítima. ¿Qué te ha molestado? Hablemos de ello. A veces necesitamos desahogarnos para ver las cosas con más claridad. 💪`
        ],
        confused: [
          `Entiendo que te sientas confundido/a, ${user.name || 'amigo/a'}. La incertidumbre es incómoda, pero también es donde crecemos. ¿Qué decisión o situación te tiene así? Podemos explorarla juntos. 🌙`,
          `La confusión es normal cuando enfrentamos algo nuevo o complejo. ¿Sobre qué tienes dudas? A veces hablar en voz alta ayuda a aclarar las cosas. 🤔`
        ],
        calm: [
          `Qué hermoso que te sientas en paz, ${user.name || 'querido/a'}. Estos momentos de calma son preciosos. ¿Qué te ayudó a encontrar esta serenidad? 🌸`,
          `Me alegra que estés en un lugar tranquilo ahora. La calma es un regalo. ¿Cómo te sientes en este momento? 🕊️`
        ]
      }
      
      // Respuestas genéricas
      const neutralResponses = [
        `Hola ${user.name || 'querido/a'}, gracias por compartir conmigo. Cuéntame más, estoy aquí para escucharte y acompañarte. ¿Cómo ha sido tu día? 💛`,
        `${user.name || 'Amigo/a'}, me alegra que estés aquí. ¿Qué hay en tu mente hoy? Estoy aquí para ti, sin prisa, sin juicios. 🌿`,
        `Hola, ${user.name || 'querido/a'}. Siempre es bueno verte por aquí. ¿Qué te trae hoy? ¿Hay algo en lo que pueda ayudarte? ✨`
      ]
      
      // Seleccionar respuesta apropiada
      const emotionResponseArray = emotionResponses[emotion as keyof typeof emotionResponses]
      if (emotionResponseArray && emotionResponseArray.length > 0) {
        return emotionResponseArray[Math.floor(Math.random() * emotionResponseArray.length)]
      }
      
      return neutralResponses[Math.floor(Math.random() * neutralResponses.length)]
    }

    let assistantMessage: string

    try {
      // Intentar llamar al LLM API
      const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-8),
            { role: 'user', content: message }
          ],
          temperature: 0.8,
          max_tokens: 600
        }),
        signal: AbortSignal.timeout(15000)
      })

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.statusText}`)
      }

      const data = await response.json()
      assistantMessage = data.choices[0]?.message?.content || generateFallbackResponse(message, emotion, risk.level)
    } catch (error) {
      // Si falla el LLM API, usar respuestas de fallback
      console.warn('LLM API no disponible, usando respuestas de fallback:', error)
      assistantMessage = generateFallbackResponse(message, emotion, risk.level)
    }

    // Guardar respuesta del asistente
    await prisma.companionConversation.create({
      data: {
        companion_id: companion.id,
        user_id: user.id,
        role: 'assistant',
        content: assistantMessage,
        context_used: memoryContext
      }
    })

    // Registrar interacción y otorgar puntos
    const pointsEarned = 5
    await prisma.$transaction([
      prisma.companionInteraction.create({
        data: {
          user_id: user.id,
          interaction_type: 'message_sent',
          points_earned: pointsEarned
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          points: { increment: pointsEarned }
        }
      })
    ])

    // Actualizar memoria si se detectaron detalles importantes
    // (esto se puede hacer con un análisis más sofisticado, por ahora guardamos la emoción)
    if (emotion !== 'neutral') {
      const emotionKey = `recent_emotion_${new Date().toISOString().split('T')[0]}`
      
      await prisma.companionMemory.upsert({
        where: {
          companion_id_key: {
            companion_id: companion.id,
            key: emotionKey
          }
        },
        update: {
          value: emotion,
          last_accessed: new Date(),
          access_count: { increment: 1 }
        },
        create: {
          companion_id: companion.id,
          user_id: user.id,
          memory_type: 'emotion_pattern',
          key: emotionKey,
          value: emotion,
          importance: 3
        }
      })
    }

    return NextResponse.json({
      message: assistantMessage,
      emotion_detected: emotion,
      risk_detected: risk.detected,
      risk_level: risk.level,
      points_earned: pointsEarned
    })
  } catch (error) {
    console.error('Error en chat con acompañante:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// GET: Obtener historial de conversación
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        companions: {
          where: { is_active: true }
        }
      }
    })

    if (!user || !user.companions || user.companions.length === 0) {
      return NextResponse.json({ error: 'Acompañante no encontrado' }, { status: 404 })
    }

    const companion = user.companions[0]

    const conversations = await prisma.companionConversation.findMany({
      where: {
        companion_id: companion.id
      },
      orderBy: { created_at: 'asc' },
      take: 50 // Últimas 50 conversaciones
    })

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Error al obtener historial:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
