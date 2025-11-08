
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Sistema de recompensas por acciones específicas
const REWARDS = {
  FIRST_CHAT_MESSAGE: { points: 50, description: 'Primera vez usando el chat' },
  DAILY_CHAT: { points: 10, description: 'Usar el chat hoy' },
  CHAT_STREAK_3: { points: 30, description: '3 días seguidos usando el chat' },
  CHAT_STREAK_7: { points: 100, description: '7 días seguidos usando el chat' },
  CHAT_STREAK_30: { points: 500, description: '30 días seguidos usando el chat' },
  CHAT_10_MESSAGES: { points: 50, description: '10 mensajes enviados' },
  CHAT_50_MESSAGES: { points: 150, description: '50 mensajes enviados' },
  CHAT_100_MESSAGES: { points: 300, description: '100 mensajes enviados' },
  COMPLETE_EXERCISE: { points: 25, description: 'Completar ejercicio de desahogo' }
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

    const { action, metadata } = await request.json()

    let pointsEarned = 0
    let achievements: string[] = []

    // Calcular recompensas basadas en la acción
    switch (action) {
      case 'SEND_MESSAGE':
        // Obtener total de mensajes del usuario
        const totalMessages = await prisma.chatMessage.count({
          where: {
            user_id: user.id,
            role: 'user'
          }
        })

        // Primera vez
        if (totalMessages === 1) {
          pointsEarned += REWARDS.FIRST_CHAT_MESSAGE.points
          achievements.push('🎉 Primera conversación')
        }

        // Verificar si ya recibió la recompensa diaria
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const todayTransaction = await prisma.transaction.findFirst({
          where: {
            user_id: user.id,
            type: 'points_earned',
            description: REWARDS.DAILY_CHAT.description,
            created_at: { gte: today }
          }
        })

        if (!todayTransaction) {
          pointsEarned += REWARDS.DAILY_CHAT.points
          achievements.push('✨ Chat diario completado')
        }

        // Milestones de mensajes
        if (totalMessages === 10) {
          pointsEarned += REWARDS.CHAT_10_MESSAGES.points
          achievements.push('🎯 10 mensajes enviados')
        } else if (totalMessages === 50) {
          pointsEarned += REWARDS.CHAT_50_MESSAGES.points
          achievements.push('🏆 50 mensajes enviados')
        } else if (totalMessages === 100) {
          pointsEarned += REWARDS.CHAT_100_MESSAGES.points
          achievements.push('👑 100 mensajes enviados')
        }

        // Verificar racha
        const streak = metadata?.streak || 0
        if (streak === 3) {
          pointsEarned += REWARDS.CHAT_STREAK_3.points
          achievements.push('🔥 3 días seguidos')
        } else if (streak === 7) {
          pointsEarned += REWARDS.CHAT_STREAK_7.points
          achievements.push('🔥 7 días seguidos')
        } else if (streak === 30) {
          pointsEarned += REWARDS.CHAT_STREAK_30.points
          achievements.push('🔥 30 días seguidos')
        }
        break

      case 'COMPLETE_EXERCISE':
        pointsEarned += REWARDS.COMPLETE_EXERCISE.points
        achievements.push('💪 Ejercicio completado')
        break

      default:
        return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 })
    }

    if (pointsEarned > 0) {
      // Actualizar puntos del usuario
      await prisma.user.update({
        where: { id: user.id },
        data: {
          points: { increment: pointsEarned },
          experience: { increment: pointsEarned }
        }
      })

      // Registrar transacción
      await prisma.transaction.create({
        data: {
          user_id: user.id,
          type: 'points_earned',
          points_change: pointsEarned,
          description: `Recompensas: ${achievements.join(', ')}`,
          status: 'completed'
        }
      })

      // Verificar si subió de nivel
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id }
      })

      const newLevel = Math.floor((updatedUser?.experience || 0) / 100) + 1
      if (newLevel > (updatedUser?.level || 1)) {
        await prisma.user.update({
          where: { id: user.id },
          data: { level: newLevel }
        })
        achievements.push(`🎊 ¡Nivel ${newLevel} alcanzado!`)
      }
    }

    return NextResponse.json({
      success: true,
      pointsEarned,
      achievements,
      totalPoints: (user.points || 0) + pointsEarned
    })

  } catch (error) {
    console.error('Error al procesar recompensas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
