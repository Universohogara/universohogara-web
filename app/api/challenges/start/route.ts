
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
    const { challengeId } = body

    if (!challengeId) {
      return NextResponse.json(
        { error: 'Challenge ID es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el reto existe
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId }
    })

    if (!challenge) {
      return NextResponse.json(
        { error: 'Reto no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el usuario no tenga ya este reto activo
    const existingChallenge = await prisma.userChallenge.findUnique({
      where: {
        user_id_challenge_id: {
          user_id: session.user.id,
          challenge_id: challengeId
        }
      }
    })

    if (existingChallenge && !existingChallenge.completed_at) {
      return NextResponse.json(
        { error: 'Ya tienes este reto activo' },
        { status: 400 }
      )
    }

    // Crear el nuevo reto para el usuario
    const userChallenge = await prisma.userChallenge.create({
      data: {
        user_id: session.user.id,
        challenge_id: challengeId,
        current_day: 1,
        started_at: new Date()
      },
      include: {
        challenge: true
      }
    })

    return NextResponse.json({ 
      success: true,
      userChallenge 
    })
  } catch (error) {
    console.error('Error starting challenge:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
