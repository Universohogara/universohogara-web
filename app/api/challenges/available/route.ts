
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

    // Obtener el usuario con su suscripción
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Determinar qué retos puede ver el usuario
    const userTier = user.subscription?.plan_tier || 'free'
    
    let challenges: any[] = []
    if (userTier === 'total' || user.role === 'admin') {
      // Plan Total o Admin: ver todos los retos
      challenges = await prisma.challenge.findMany({
        where: { is_active: true },
        orderBy: { created_at: 'asc' }
      })
    } else if (userTier === 'standard') {
      // Plan Standard: solo retos standard
      challenges = await prisma.challenge.findMany({
        where: { 
          tier: 'standard',
          is_active: true
        },
        orderBy: { created_at: 'asc' }
      })
    }

    return NextResponse.json({ challenges })
  } catch (error) {
    console.error('Error fetching available challenges:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
