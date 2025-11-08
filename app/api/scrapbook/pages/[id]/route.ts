
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const page = await prisma.scrapbookPage.findFirst({
      where: {
        id: resolvedParams.id,
        user_id: user.id
      }
    })

    if (!page) {
      return NextResponse.json(
        { error: 'Página no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ page })

  } catch (error) {
    console.error('Error al obtener página:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const { title, description, canvas_data, thumbnail, is_favorite } = await request.json()

    const page = await prisma.scrapbookPage.update({
      where: {
        id: resolvedParams.id,
        user_id: user.id
      },
      data: {
        title,
        description,
        canvas_data: canvas_data ? JSON.stringify(canvas_data) : undefined,
        thumbnail,
        is_favorite,
        updated_at: new Date()
      }
    })

    return NextResponse.json({ page })

  } catch (error) {
    console.error('Error al actualizar página:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    await prisma.scrapbookPage.delete({
      where: {
        id: resolvedParams.id,
        user_id: user.id
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error al eliminar página:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
