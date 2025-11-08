
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
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

    // Obtener todos los stickers
    const allStickers = await prisma.sticker.findMany({
      orderBy: { category: 'asc' }
    })

    // Obtener stickers desbloqueados por el usuario
    const unlockedStickers = await prisma.userSticker.findMany({
      where: { user_id: user.id }
    })

    const unlockedIds = new Set(unlockedStickers.map((us: any) => us.sticker_id))

    const stickers = allStickers.map((sticker: any) => ({
      ...sticker,
      unlocked: unlockedIds.has(sticker.id)
    }))

    return NextResponse.json({ stickers, userPoints: user.points })

  } catch (error) {
    console.error('Error al obtener stickers:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
