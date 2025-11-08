
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Obtener la plantilla
    const template = await prisma.template.findUnique({
      where: { id: params.id }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Plantilla no encontrada' },
        { status: 404 }
      )
    }

    // Verificar acceso
    const userTier = user.subscription?.plan_tier || 'free'
    const isAdmin = user.role === 'admin'
    
    // Admin siempre tiene acceso
    if (isAdmin) {
      return NextResponse.json({ template })
    }

    // Verificar si el usuario tiene el tier adecuado
    if (template.tier === 'standard' && (userTier === 'standard' || userTier === 'total')) {
      return NextResponse.json({ template })
    }

    if (template.tier === 'total' && userTier === 'total') {
      return NextResponse.json({ template })
    }

    // Sin acceso
    return NextResponse.json(
      { error: 'No tienes acceso a esta plantilla' },
      { status: 403 }
    )
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
