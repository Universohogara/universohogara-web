
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userChallengeId, note } = body

    if (!userChallengeId) {
      return NextResponse.json(
        { error: 'User Challenge ID es requerido' },
        { status: 400 }
      )
    }

    // Obtener el reto del usuario
    const userChallenge = await prisma.userChallenge.findUnique({
      where: { id: userChallengeId },
      include: { challenge: true, user: true }
    })

    if (!userChallenge) {
      return NextResponse.json(
        { error: 'Reto no encontrado' },
        { status: 404 }
      )
    }

    if (userChallenge.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado para este reto' },
        { status: 403 }
      )
    }

    // Verificar que no esté completado
    if (userChallenge.completed_at) {
      return NextResponse.json(
        { error: 'Este reto ya está completado' },
        { status: 400 }
      )
    }

    const currentDay = userChallenge.current_day
    const nextDay = currentDay + 1
    const isLastDay = nextDay > userChallenge.challenge.duration

    // Guardar nota del día si existe
    let notes: Record<string, string> = {}
    try {
      notes = userChallenge.notes ? JSON.parse(userChallenge.notes) : {}
    } catch (e) {
      notes = {}
    }
    notes[`day_${currentDay}`] = note || 'Completado'

    // Actualizar el reto
    const updatedChallenge = await prisma.userChallenge.update({
      where: { id: userChallengeId },
      data: {
        current_day: isLastDay ? currentDay : nextDay,
        notes: JSON.stringify(notes),
        completed_at: isLastDay ? new Date() : undefined,
        updated_at: new Date()
      }
    })

    // Calcular recompensas
    const rewards = {
      points: 0,
      stickers: [] as any[],
      achievements: [] as string[]
    }

    // Puntos por día completado
    rewards.points = 10
    
    // Bonus cada 7 días
    if (currentDay % 7 === 0) {
      rewards.points += 50
      rewards.achievements.push('Semana completada')
    }

    // Recompensa final
    if (isLastDay) {
      rewards.points += 200
      rewards.achievements.push('Reto de 21 días completado')
      
      // Actualizar estadísticas
      await prisma.userStatistics.upsert({
        where: { user_id: session.user.id },
        create: {
          user_id: session.user.id,
          total_challenges_completed: 1,
          active_days: 1,
          streak_days: 1,
          last_active: new Date()
        },
        update: {
          total_challenges_completed: { increment: 1 },
          active_days: { increment: 1 },
          last_active: new Date()
        }
      })

      // Desbloquear stickers especiales
      const premiumStickers = await prisma.sticker.findMany({
        where: { 
          is_premium: true,
          category: 'logros'
        },
        take: 3
      })

      for (const sticker of premiumStickers) {
        await prisma.userSticker.upsert({
          where: {
            user_id_sticker_id: {
              user_id: session.user.id,
              sticker_id: sticker.id
            }
          },
          create: {
            user_id: session.user.id,
            sticker_id: sticker.id
          },
          update: {}
        })
        rewards.stickers.push(sticker)
      }
    }

    // Otorgar puntos
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        points: { increment: rewards.points }
      }
    })

    // Registrar logros
    if (rewards.achievements.length > 0) {
      for (const achievementName of rewards.achievements) {
        // Buscar o crear el logro
        const achievement = await prisma.achievement.upsert({
          where: {
            name: achievementName
          },
          create: {
            name: achievementName,
            description: `Logro desbloqueado: ${achievementName}`,
            icon: 'trophy',
            points_reward: rewards.points,
            category: 'challenges',
            requirement: achievementName,
            tier: 'all'
          },
          update: {}
        })

        // Asignar el logro al usuario
        await prisma.userAchievement.upsert({
          where: {
            user_id_achievement_id: {
              user_id: session.user.id,
              achievement_id: achievement.id
            }
          },
          create: {
            user_id: session.user.id,
            achievement_id: achievement.id,
            is_new: true
          },
          update: {}
        })
      }
    }

    return NextResponse.json({ 
      success: true,
      userChallenge: updatedChallenge,
      rewards,
      isLastDay,
      currentDay: nextDay
    })
  } catch (error) {
    console.error('Error completing challenge day:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
