
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
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const { points, reason } = await request.json()

    if (!points || points <= 0) {
      return NextResponse.json(
        { error: 'Puntos inválidos' },
        { status: 400 }
      )
    }

    // Calcular nuevos valores
    const newPoints = user.points + points
    const newExperience = user.experience + points
    
    // Calcular nivel (cada 100 XP = 1 nivel)
    const newLevel = Math.floor(newExperience / 100) + 1

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        points: newPoints,
        experience: newExperience,
        level: newLevel
      }
    })

    // Registrar transacción
    await prisma.transaction.create({
      data: {
        user_id: user.id,
        type: 'points_earned',
        points_change: points,
        description: reason || 'Puntos ganados',
        status: 'completed'
      }
    })

    // Verificar y desbloquear logros
    const newAchievements = await checkAndUnlockAchievements(user.id, {
      totalPoints: newPoints,
      totalActions: Math.floor(newExperience / 5), // Aproximado
      level: newLevel
    })

    return NextResponse.json({
      success: true,
      newPoints,
      newLevel,
      newExperience,
      newAchievements
    })

  } catch (error) {
    console.error('Error al otorgar puntos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

async function checkAndUnlockAchievements(
  userId: string,
  stats: { totalPoints: number; totalActions: number; level: number }
) {
  const newAchievements = []

  // Definir logros
  const achievements = [
    {
      name: 'Primera Creación',
      requirement: stats.totalActions >= 10,
      points: 50,
      icon: '🎨',
      description: 'Completa 10 acciones en tu scrapbook'
    },
    {
      name: 'Artista Dedicada',
      requirement: stats.totalActions >= 50,
      points: 100,
      icon: '🖌️',
      description: 'Completa 50 acciones en tu scrapbook'
    },
    {
      name: 'Maestra del Scrapbook',
      requirement: stats.totalActions >= 100,
      points: 200,
      icon: '👑',
      description: 'Completa 100 acciones en tu scrapbook'
    },
    {
      name: 'Coleccionista de Puntos',
      requirement: stats.totalPoints >= 500,
      points: 100,
      icon: '💎',
      description: 'Acumula 500 puntos'
    },
    {
      name: 'Nivel 5 Alcanzado',
      requirement: stats.level >= 5,
      points: 150,
      icon: '⭐',
      description: 'Alcanza el nivel 5'
    }
  ]

  for (const achievement of achievements) {
    if (achievement.requirement) {
      // Verificar si el logro ya existe en la DB
      let dbAchievement = await prisma.achievement.findUnique({
        where: { name: achievement.name }
      })

      // Si no existe, crearlo
      if (!dbAchievement) {
        dbAchievement = await prisma.achievement.create({
          data: {
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            points_reward: achievement.points,
            category: 'scrapbook',
            requirement: achievement.description
          }
        })
      }

      // Verificar si el usuario ya lo tiene
      const userHasAchievement = await prisma.userAchievement.findUnique({
        where: {
          user_id_achievement_id: {
            user_id: userId,
            achievement_id: dbAchievement.id
          }
        }
      })

      // Si no lo tiene, desbloquearlo
      if (!userHasAchievement) {
        await prisma.userAchievement.create({
          data: {
            user_id: userId,
            achievement_id: dbAchievement.id,
            is_new: true
          }
        })

        // Otorgar puntos del logro
        await prisma.user.update({
          where: { id: userId },
          data: {
            points: { increment: achievement.points }
          }
        })

        newAchievements.push({
          ...dbAchievement,
          unlocked: true
        })
      }
    }
  }

  return newAchievements
}
