
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

/**
 * Suscribe a un usuario a Personajes Mágicos
 * 
 * OPCIONES:
 * - addon: Complemento (requiere plan base) - Acceso completo
 * - standalone: Independiente (sin plan base) - Acceso limitado
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { planType } = await request.json()

    if (!planType || !['addon', 'standalone'].includes(planType)) {
      return NextResponse.json(
        { error: 'Tipo de plan inválido' },
        { status: 400 }
      )
    }

    // Verificar requisitos
    const subscription = await prisma.subscription.findUnique({
      where: { user_id: session.user.id }
    })

    const hasBasePlan = subscription?.status === 'active' && 
      (subscription?.plan_tier === 'basic_7' || subscription?.plan_tier === 'complete_15')

    // Si es addon, requiere plan base
    if (planType === 'addon' && !hasBasePlan && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Plan base requerido para esta extensión' },
        { status: 400 }
      )
    }

    // Verificar si ya tiene Stripe configurado
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe no configurado. Por favor, añade tus claves de Stripe.' },
        { status: 500 }
      )
    }

    // TODO: Implementar integración con Stripe
    // Por ahora, retornamos un mensaje de configuración pendiente
    
    return NextResponse.json(
      { 
        error: 'Stripe pendiente de configuración',
        message: 'Para activar pagos, necesitas configurar Stripe con tus claves API.'
      },
      { status: 503 }
    )

  } catch (error) {
    console.error('Error suscribiendo a personajes mágicos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
