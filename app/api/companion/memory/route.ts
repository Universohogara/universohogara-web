
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST: Crear o actualizar memoria
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { companions: { where: { is_active: true } } }
    })

    if (!user || !user.companions || user.companions.length === 0) {
      return NextResponse.json({ error: 'Acompañante no encontrado' }, { status: 404 })
    }
    const companion = user.companions[0]


    const body = await req.json()
    const { memory_type, key, value, importance } = body

    if (!memory_type || !key || !value) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const memory = await prisma.companionMemory.upsert({
      where: {
        companion_id_key: {
          companion_id: companion.id,
          key
        }
      },
      update: {
        value,
        importance: importance || 5,
        last_accessed: new Date(),
        access_count: { increment: 1 }
      },
      create: {
        companion_id: companion.id,
        user_id: user.id,
        memory_type,
        key,
        value,
        importance: importance || 5
      }
    })

    return NextResponse.json({ memory })
  } catch (error) {
    console.error('Error al guardar memoria:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// GET: Obtener memorias
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { companions: { where: { is_active: true } } }
    })

    if (!user || !user.companions || user.companions.length === 0) {
      return NextResponse.json({ error: 'Acompañante no encontrado' }, { status: 404 })
    }
    const companion = user.companions[0]


    const memories = await prisma.companionMemory.findMany({
      where: {
        companion_id: companion.id
      },
      orderBy: [
        { importance: 'desc' },
        { last_accessed: 'desc' }
      ]
    })

    return NextResponse.json({ memories })
  } catch (error) {
    console.error('Error al obtener memorias:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE: Eliminar memoria
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { companions: { where: { is_active: true } } }
    })

    if (!user || !user.companions || user.companions.length === 0) {
      return NextResponse.json({ error: 'Acompañante no encontrado' }, { status: 404 })
    }

    const companion = user.companions[0]

    const { searchParams } = new URL(req.url)
    const memoryId = searchParams.get('id')

    if (!memoryId) {
      return NextResponse.json({ error: 'ID de memoria no proporcionado' }, { status: 400 })
    }

    await prisma.companionMemory.delete({
      where: {
        id: memoryId,
        companion_id: companion.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar memoria:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
