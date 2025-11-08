
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"

/**
 * API para cancelar la extensión de Personajes Mágicos
 * POST /api/magical-companions/cancel
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      )
    }

    const subscription = await prisma.subscription.findUnique({
      where: { user_id: session.user.id },
    })

    if (!subscription || !subscription.magical_companions_enabled) {
      return NextResponse.json(
        { error: "No tienes una extensión de Personajes Mágicos activa" },
        { status: 400 }
      )
    }

    // Si es una suscripción de Stripe, cancelarla
    if (subscription.magical_companions_plan_type === 'subscription' && subscription.magical_companions_subscription_id) {
      await stripe.subscriptions.update(subscription.magical_companions_subscription_id, {
        cancel_at_period_end: true
      })
    }

    // Actualizar la base de datos
    await prisma.subscription.update({
      where: { user_id: session.user.id },
      data: {
        magical_companions_enabled: false,
        magical_companions_plan_type: 'none',
      }
    })

    return NextResponse.json({ 
      success: true,
      message: "Extensión de Personajes Mágicos cancelada correctamente" 
    })
  } catch (error) {
    console.error("Error al cancelar Personajes Mágicos:", error)
    return NextResponse.json(
      { error: "Error al cancelar la extensión" },
      { status: 500 }
    )
  }
}
