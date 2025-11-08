
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createBillingPortalSession } from "@/lib/stripe"
import { prisma } from "@/lib/db"

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

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No se encontró información de suscripción" },
        { status: 404 }
      )
    }

    // Get origin dynamically from request headers
    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000"

    const portalSession = await createBillingPortalSession(
      subscription.stripe_customer_id,
      origin
    )

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("Error creating portal session:", error)
    return NextResponse.json(
      { error: "Error al crear el portal de facturación" },
      { status: 500 }
    )
  }
}
