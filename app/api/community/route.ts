
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET all community posts
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

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

    const posts = await prisma.communityPost.findMany({
      where: { is_approved: true },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      take: 50,
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching community posts:", error)
    return NextResponse.json(
      { error: "Error al cargar las publicaciones" },
      { status: 500 }
    )
  }
}

// POST create new community post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

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

    const body = await req.json()
    const { content, image_url } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "El contenido es requerido" },
        { status: 400 }
      )
    }

    const post = await prisma.communityPost.create({
      data: {
        user_id: session.user.id,
        content: content.trim(),
        image_url: image_url || null,
        is_approved: true, // Auto-approve for now
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Error creating community post:", error)
    return NextResponse.json(
      { error: "Error al crear la publicación" },
      { status: 500 }
    )
  }
}
