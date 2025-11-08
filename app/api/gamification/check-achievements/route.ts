
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

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
      where: { email: session.user.email },
      include: {
        statistics: true,
        achievements: { include: { achievement: true } }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const unlockedIds = new Set(user.achievements.map((ua: any) => ua.achievement_id))
    const newlyUnlocked = []

    // Obtener todos los logros
    const allAchievements = await prisma.achievement.findMany()

    // Revisar logros basados en journals
    const journalCount = user.statistics?.total_journal_entries || 0
    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.id)) continue

      if (achievement.category === 'journals') {
        if (achievement.requirement === 'Completa 1 diario' && journalCount >= 1) {
          newlyUnlocked.push(achievement)
        } else if (achievement.requirement === 'Completa 7 diarios' && journalCount >= 7) {
          newlyUnlocked.push(achievement)
        } else if (achievement.requirement === 'Completa 30 diarios' && journalCount >= 30) {
          newlyUnlocked.push(achievement)
        }
      }

      if (achievement.category === 'challenges') {
        const completedChallenges = user.statistics?.total_challenges_completed || 0
        if (achievement.requirement === 'Completa 1 reto' && completedChallenges >= 1) {
          newlyUnlocked.push(achievement)
        } else if (achievement.requirement === 'Completa 3 retos' && completedChallenges >= 3) {
          newlyUnlocked.push(achievement)
        }
      }

      if (achievement.category === 'streaks') {
        const streak = user.statistics?.streak_days || 0
        if (achievement.requirement === 'Racha de 7 días' && streak >= 7) {
          newlyUnlocked.push(achievement)
        } else if (achievement.requirement === 'Racha de 21 días' && streak >= 21) {
          newlyUnlocked.push(achievement)
        }
      }
    }

    // Desbloquear logros y dar recompensas
    for (const achievement of newlyUnlocked) {
      await prisma.userAchievement.create({
        data: {
          user_id: user.id,
          achievement_id: achievement.id,
          is_new: true
        }
      })

      await prisma.user.update({
        where: { id: user.id },
        data: {
          points: { increment: achievement.points_reward },
          experience: { increment: achievement.points_reward }
        }
      })

      await prisma.transaction.create({
        data: {
          user_id: user.id,
          type: 'points_earned',
          points_change: achievement.points_reward,
          description: `Logro desbloqueado: ${achievement.name}`
        }
      })
    }

    return NextResponse.json({
      newAchievements: newlyUnlocked,
      totalPointsEarned: newlyUnlocked.reduce((sum, a) => sum + a.points_reward, 0)
    })

  } catch (error) {
    console.error('Error al verificar logros:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
