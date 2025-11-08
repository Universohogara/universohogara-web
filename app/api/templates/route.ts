
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

    // Determinar qué plantillas puede ver el usuario
    const userTier = user.subscription?.plan_tier || 'free'
    
    let templates: any[] = []
    if (userTier === 'total' || user.role === 'admin') {
      // Plan Total o Admin: ver todas las plantillas
      templates = await prisma.template.findMany({
        orderBy: { order: 'asc' }
      })
    } else if (userTier === 'standard') {
      // Plan Standard: solo plantillas standard
      templates = await prisma.template.findMany({
        where: { tier: 'standard' },
        orderBy: { order: 'asc' }
      })
    }

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
