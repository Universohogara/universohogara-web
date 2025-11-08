
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
      where: { email: session.user.email },
      include: {
        achievements: {
          include: { achievement: true },
          orderBy: { unlocked_at: 'desc' }
        },
        statistics: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Calcular nivel basado en experiencia
    const level = Math.floor(user.experience / 100) + 1
    const experienceForNextLevel = level * 100
    const experienceProgress = user.experience % 100

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        points: user.points,
        level,
        experience: user.experience,
        experienceForNextLevel,
        experienceProgress
      },
      achievements: user.achievements,
      statistics: user.statistics
    })

  } catch (error) {
    console.error('Error al obtener perfil de gamificación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
