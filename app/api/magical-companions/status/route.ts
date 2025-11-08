
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

/**
 * API para obtener el estado de la extensión de Personajes Mágicos
 * GET /api/magical-companions/status
 */
export async function GET(req: NextRequest) {
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

    if (!subscription) {
      return NextResponse.json({
        enabled: false,
        type: 'none',
        hasBasePlan: false
      })
    }

    return NextResponse.json({
      enabled: subscription.magical_companions_enabled,
      type: subscription.magical_companions_plan_type,
      subscriptionId: subscription.magical_companions_subscription_id,
      hasBasePlan: subscription.status === 'active'
    })
  } catch (error) {
    console.error("Error al obtener estado de Personajes Mágicos:", error)
    return NextResponse.json(
      { error: "Error al obtener el estado" },
      { status: 500 }
    )
  }
}
