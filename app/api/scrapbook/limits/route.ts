
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getScrapbookLimits, getPlanUpgradeMessage } from '@/lib/scrapbook-limits'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscription: true,
        scrapbook_pages: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Nueva lógica: solo basada en el plan de suscripción
    const subscriptionTier = user.subscription?.plan_tier || null
    const limits = getScrapbookLimits(user.role, subscriptionTier)
    const currentPages = user.scrapbook_pages.length

    return NextResponse.json({
      limits,
      currentPages,
      canCreatePage: currentPages < limits.maxPages,
      userRole: user.role,
      subscriptionTier,
      upgradeMessage: getPlanUpgradeMessage(subscriptionTier)
    })
  } catch (error) {
    console.error('Error al obtener límites:', error)
    return NextResponse.json(
      { error: 'Error al obtener límites' },
      { status: 500 }
    )
  }
}
