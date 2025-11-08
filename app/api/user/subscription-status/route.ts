
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Admin siempre tiene acceso completo
    if (session.user.role === 'admin') {
      return NextResponse.json({
        hasBasePlan: true,
        basePlanTier: 'admin',
        magicalCompanionsActive: true,
        magicalCompanionsPlanType: 'addon'
      })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { user_id: session.user.id }
    })

    const hasBasePlan = subscription?.status === 'active' && 
      (subscription?.plan_tier === 'basic_7' || subscription?.plan_tier === 'complete_15')

    const magicalCompanionsActive = subscription?.magical_companions_enabled && 
      subscription?.magical_companions_status === 'active'

    return NextResponse.json({
      hasBasePlan,
      basePlanTier: subscription?.plan_tier || 'none',
      magicalCompanionsActive,
      magicalCompanionsPlanType: subscription?.magical_companions_plan_type || 'none'
    })
  } catch (error) {
    console.error('Error al obtener estado de suscripción:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
