
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener retos activos del usuario
    const userChallenges = await prisma.userChallenge.findMany({
      where: {
        user_id: session.user.id
      },
      include: {
        challenge: true
      },
      orderBy: {
        started_at: 'desc'
      }
    })

    return NextResponse.json({ challenges: userChallenges })
  } catch (error) {
    console.error('Error fetching user challenges:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
