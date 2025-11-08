import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
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

    const entries = await prisma.journal.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json(entries.map((e: any) => ({
      id: e.id,
      type: e.type,
      title: e.title,
      content: e.content,
      mood: e.mood,
      date: e.created_at.toISOString(),
    })))
  } catch (error) {
    console.error('Error al obtener diarios:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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
    const { type, title, content, mood } = body

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Tipo y contenido son requeridos' },
        { status: 400 }
      )
    }

    // Crear entrada y otorgar puntos/actualizar estadísticas en una transacción
    const pointsEarned = 10 // Puntos por crear un diario
    
    const [entry, , , ,] = await prisma.$transaction([
      // Crear entrada
      prisma.journal.create({
        data: {
          user_id: user.id,
          type,
          title: title || `Entrada ${new Date().toLocaleDateString()}`,
          content,
          mood,
        },
      }),
      // Otorgar puntos
      prisma.user.update({
        where: { id: user.id },
        data: {
          points: { increment: pointsEarned },
          experience: { increment: pointsEarned }
        }
      }),
      // Actualizar estadísticas
      prisma.userStatistics.upsert({
        where: { user_id: user.id },
        update: {
          total_journal_entries: { increment: 1 },
          last_active: new Date()
        },
        create: {
          user_id: user.id,
          total_journal_entries: 1,
          last_active: new Date()
        }
      }),
      // Registrar transacción de puntos
      prisma.transaction.create({
        data: {
          user_id: user.id,
          type: 'points_earned',
          points_change: pointsEarned,
          description: 'Diario creado'
        }
      })
    ])

    return NextResponse.json({
      id: entry.id,
      type: entry.type,
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      date: entry.created_at.toISOString(),
      pointsEarned
    })
  } catch (error) {
    console.error('Error al crear entrada de diario:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
