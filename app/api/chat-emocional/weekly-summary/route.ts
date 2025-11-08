
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
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

    // Obtener mensajes de la última semana
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const messages = await prisma.chatMessage.findMany({
      where: {
        user_id: user.id,
        role: 'user',
        created_at: { gte: sevenDaysAgo }
      },
      orderBy: {
        created_at: 'asc'
      }
    })

    // Análisis de emociones y temas
    const emotionKeywords = {
      tristeza: ['triste', 'deprimida', 'deprimido', 'melancolía', 'lloro', 'llorar'],
      ansiedad: ['ansiosa', 'ansioso', 'nervios', 'preocupada', 'preocupado', 'estrés', 'estresada'],
      soledad: ['sola', 'solo', 'aislada', 'aislado', 'nadie', 'abandonada', 'abandonado'],
      ira: ['enfadada', 'enfadado', 'rabia', 'ira', 'molesta', 'molesto', 'frustrada', 'frustrado'],
      esperanza: ['esperanza', 'mejor', 'mejorando', 'positiva', 'positivo', 'ilusión'],
      gratitud: ['agradecida', 'agradecido', 'gracias', 'afortunada', 'afortunado']
    }

    const emotionCounts: Record<string, number> = {}
    let totalMessages = messages.length
    let riskMessages = 0

    messages.forEach((msg: any) => {
      const content = msg.content.toLowerCase()
      
      if (msg.is_risk_detected) {
        riskMessages++
      }

      Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
        const hasEmotion = keywords.some(keyword => content.includes(keyword))
        if (hasEmotion) {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
        }
      })
    })

    // Emoción predominante
    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral'

    // Generar recomendaciones personalizadas
    const recommendations = generateRecommendations(dominantEmotion, riskMessages > 0, totalMessages)

    // Calcular progreso
    const previousWeekStart = new Date(sevenDaysAgo)
    previousWeekStart.setDate(previousWeekStart.getDate() - 7)
    
    const previousWeekMessages = await prisma.chatMessage.count({
      where: {
        user_id: user.id,
        role: 'user',
        created_at: {
          gte: previousWeekStart,
          lt: sevenDaysAgo
        }
      }
    })

    const improvement = totalMessages > previousWeekMessages

    return NextResponse.json({
      period: {
        start: sevenDaysAgo.toISOString(),
        end: new Date().toISOString()
      },
      summary: {
        totalMessages,
        activeDays: messages.length > 0 ? new Set(messages.map((m: any) => 
          m.created_at.toISOString().split('T')[0]
        )).size : 0,
        dominantEmotion,
        emotionBreakdown: emotionCounts,
        riskMessages,
        improvement
      },
      recommendations,
      message: generateWeeklySummaryMessage(dominantEmotion, totalMessages, improvement)
    })

  } catch (error) {
    console.error('Error al generar resumen semanal:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function generateRecommendations(emotion: string, hasRisk: boolean, messageCount: number): any[] {
  const recommendations = []

  if (hasRisk) {
    recommendations.push({
      type: 'professional_help',
      title: '🆘 Considera apoyo profesional',
      description: 'Detectamos momentos de intensidad emocional. Un profesional puede ayudarte.',
      action: {
        label: 'Ver recursos',
        link: '/recursos-ayuda'
      },
      priority: 'high'
    })
  }

  switch (emotion) {
    case 'tristeza':
      recommendations.push({
        type: 'template',
        title: '📝 Diario de gratitud',
        description: 'Escribir sobre momentos positivos puede ayudar a equilibrar la perspectiva.',
        action: {
          label: 'Ir a Plantillas',
          link: '/premium/plantillas'
        },
        priority: 'medium'
      })
      recommendations.push({
        type: 'music',
        title: '🎵 Música relajante',
        description: 'Prueba nuestra colección de música para calmar la mente.',
        action: {
          label: 'Explorar música',
          link: '/premium/musica'
        },
        priority: 'low'
      })
      break

    case 'ansiedad':
      recommendations.push({
        type: 'exercise',
        title: '🧘‍♀️ Ejercicio de respiración',
        description: 'Técnicas de respiración profunda pueden reducir la ansiedad.',
        action: {
          label: 'Empezar ejercicio',
          link: '/premium/desahogo?exercise=breathing'
        },
        priority: 'high'
      })
      recommendations.push({
        type: 'challenge',
        title: '🌟 Reto de 21 días',
        description: 'Construye hábitos que te ayuden a manejar la ansiedad.',
        action: {
          label: 'Ver retos',
          link: '/premium/retos'
        },
        priority: 'medium'
      })
      break

    case 'soledad':
      recommendations.push({
        type: 'community',
        title: '💬 Comunidad Hogara',
        description: 'Conéctate con otras personas que comparten tu camino.',
        action: {
          label: 'Ir a Comunidad',
          link: '/comunidad'
        },
        priority: 'high'
      })
      recommendations.push({
        type: 'scrapbook',
        title: '🎨 Scrapbook creativo',
        description: 'Expresa tus emociones a través del arte.',
        action: {
          label: 'Crear página',
          link: '/premium/scrapbook'
        },
        priority: 'medium'
      })
      break

    case 'esperanza':
    case 'gratitud':
      recommendations.push({
        type: 'journal',
        title: '✨ Celebra tu progreso',
        description: 'Documenta este momento positivo en tu diario.',
        action: {
          label: 'Escribir diario',
          link: '/mis-diarios'
        },
        priority: 'medium'
      })
      break

    default:
      recommendations.push({
        type: 'explore',
        title: '🌈 Explora herramientas',
        description: 'Descubre todas las funcionalidades premium disponibles.',
        action: {
          label: 'Ver dashboard',
          link: '/premium/dashboard'
        },
        priority: 'low'
      })
  }

  if (messageCount >= 7) {
    recommendations.push({
      type: 'achievement',
      title: '🏆 ¡Racha de 7 días!',
      description: '¡Felicidades! Has usado el espacio de desahogo toda la semana.',
      action: {
        label: 'Ver logros',
        link: '/premium/gamificacion'
      },
      priority: 'low'
    })
  }

  return recommendations.slice(0, 4) // Máximo 4 recomendaciones
}

function generateWeeklySummaryMessage(emotion: string, messageCount: number, improvement: boolean): string {
  const emotionMessages: Record<string, string> = {
    tristeza: '💙 Esta semana ha sido difícil emocionalmente. Es valiente permitirte sentir y expresar tu tristeza.',
    ansiedad: '🌊 Notamos que la ansiedad ha estado presente. Respirar y validar lo que sientes es un paso importante.',
    soledad: '🤗 La soledad puede ser muy pesada. Recuerda que no estás sola en este camino.',
    ira: '🔥 Las emociones intensas como la frustración son válidas. Expresarlas es parte del proceso.',
    esperanza: '✨ Esta semana has mostrado señales de esperanza y crecimiento. ¡Continúa así!',
    gratitud: '🌟 Tu enfoque en la gratitud es hermoso. Sigue cultivando esa luz interior.',
    neutral: '🌙 Esta semana has usado este espacio para conectar contigo misma. Eso es valioso.'
  }

  const improvementMessage = improvement
    ? ' Has compartido más que la semana pasada, lo cual muestra tu compromiso con tu bienestar.'
    : ' Recuerda que este espacio está aquí para ti siempre que lo necesites.'

  return (emotionMessages[emotion] || emotionMessages.neutral) + improvementMessage
}
