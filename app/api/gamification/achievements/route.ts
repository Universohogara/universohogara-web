
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

    // Obtener todos los logros
    const allAchievements = await prisma.achievement.findMany({
      where: {
        OR: [
          { tier: 'all' },
          { tier: user.role }
        ]
      },
      orderBy: { created_at: 'asc' }
    })

    // Obtener logros desbloqueados por el usuario
    const userAchievements = await prisma.userAchievement.findMany({
      where: { user_id: user.id },
      include: { achievement: true },
      orderBy: { unlocked_at: 'desc' }
    })

    const unlockedIds = new Set(userAchievements.map((ua: any) => ua.achievement_id))

    // Combinar información
    const achievements = allAchievements.map((achievement: any) => ({
      ...achievement,
      unlocked: unlockedIds.has(achievement.id),
      unlocked_at: userAchievements.find((ua: any) => ua.achievement_id === achievement.id)?.unlocked_at
    }))

    return NextResponse.json({ achievements })

  } catch (error) {
    console.error('Error al obtener logros:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
