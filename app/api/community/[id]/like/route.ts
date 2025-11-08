
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

interface RouteContext {
  params: Promise<{ id: string }>
}

// POST like a community post
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    const params = await context.params

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      )
    }

    if (!session.user.isPremium) {
      return NextResponse.json(
        { error: "Requiere suscripción premium" },
        { status: 403 }
      )
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: params.id },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Publicación no encontrada" },
        { status: 404 }
      )
    }

    // Increment likes count
    const updatedPost = await prisma.communityPost.update({
      where: { id: params.id },
      data: {
        likes_count: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ post: updatedPost })
  } catch (error) {
    console.error("Error liking post:", error)
    return NextResponse.json(
      { error: "Error al dar like" },
      { status: 500 }
    )
  }
}
