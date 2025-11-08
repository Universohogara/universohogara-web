import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar si es Premium o Admin
    if (!session.user.isPremium && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    // Obtener suscripción del usuario para determinar el tier
    const subscription = await prisma.subscription.findUnique({
      where: { user_id: session.user.id },
    })

    const userTier = subscription?.plan_tier || 'standard'

    // Obtener contenido multimedia
    const media = await prisma.mediaContent.findMany({
      where: {
        is_premium: true,
        tier: userTier === 'total' ? { in: ['standard', 'total'] } : 'standard',
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return NextResponse.json(media)
  } catch (error) {
    console.error('Error al obtener contenido multimedia:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
