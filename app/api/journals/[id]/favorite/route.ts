
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

interface RouteContext {
  params: Promise<{ id: string }>
}

// PATCH toggle favorite
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    const params = await context.params

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    // Verificar acceso Premium (Admin o suscripción activa)
    const isPremium = user.role === 'admin' || user.subscription?.status === 'active'
    if (!isPremium) {
      return NextResponse.json(
        { error: "Acceso Premium requerido" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { is_favorite } = body

    const journal = await prisma.journal.findFirst({
      where: {
        id: params.id,
        user_id: user.id,
      },
    })

    if (!journal) {
      return NextResponse.json(
        { error: "Diario no encontrado" },
        { status: 404 }
      )
    }

    const updatedJournal = await prisma.journal.update({
      where: { id: params.id },
      data: { is_favorite },
    })

    return NextResponse.json({ journal: updatedJournal })
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return NextResponse.json(
      { error: "Error al actualizar favorito" },
      { status: 500 }
    )
  }
}
