import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar acceso Premium (Admin o suscripción activa)
    const isPremium = user.role === 'admin' || user.subscription?.status === 'active'
    if (!isPremium) {
      return NextResponse.json({ error: 'Acceso Premium requerido' }, { status: 403 })
    }

    const body = await req.json()
    const { title, content, mood } = body

    const entry = await prisma.journal.findFirst({
      where: {
        id: params.id,
        user_id: user.id,
      },
    })

    if (!entry) {
      return NextResponse.json({ error: 'Entrada no encontrada' }, { status: 404 })
    }

    const updated = await prisma.journal.update({
      where: { id: params.id },
      data: {
        title,
        content,
        mood,
      },
    })

    return NextResponse.json({
      id: updated.id,
      type: updated.type,
      title: updated.title,
      content: updated.content,
      mood: updated.mood,
      date: updated.created_at.toISOString(),
    })
  } catch (error) {
    console.error('Error al actualizar entrada:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar acceso Premium (Admin o suscripción activa)
    const isPremium = user.role === 'admin' || user.subscription?.status === 'active'
    if (!isPremium) {
      return NextResponse.json({ error: 'Acceso Premium requerido' }, { status: 403 })
    }

    const entry = await prisma.journal.findFirst({
      where: {
        id: params.id,
        user_id: user.id,
      },
    })

    if (!entry) {
      return NextResponse.json({ error: 'Entrada no encontrada' }, { status: 404 })
    }

    await prisma.journal.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar entrada:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
