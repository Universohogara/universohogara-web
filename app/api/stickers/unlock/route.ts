
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
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

    const { stickerId, method } = await request.json()

    // Verificar que el sticker existe
    const sticker = await prisma.sticker.findUnique({
      where: { id: stickerId }
    })

    if (!sticker) {
      return NextResponse.json(
        { error: 'Sticker no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que no esté ya desbloqueado
    const existing = await prisma.userSticker.findUnique({
      where: {
        user_id_sticker_id: {
          user_id: user.id,
          sticker_id: stickerId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Sticker ya desbloqueado' },
        { status: 400 }
      )
    }

    // Si es con puntos, verificar que tenga suficientes
    if (method === 'points') {
      if (user.points < sticker.price_points) {
        return NextResponse.json(
          { error: 'Puntos insuficientes' },
          { status: 400 }
        )
      }

      // Desbloquear sticker y descontar puntos
      await prisma.$transaction([
        prisma.userSticker.create({
          data: {
            user_id: user.id,
            sticker_id: stickerId,
            unlock_method: 'points'
          }
        }),
        prisma.user.update({
          where: { id: user.id },
          data: {
            points: { decrement: sticker.price_points }
          }
        }),
        prisma.transaction.create({
          data: {
            user_id: user.id,
            type: 'sticker_purchase',
            points_change: -sticker.price_points,
            description: `Sticker desbloqueado: ${sticker.name}`
          }
        })
      ])

      return NextResponse.json({
        success: true,
        pointsSpent: sticker.price_points
      })
    }

    // Si es compra con dinero (se manejará con Stripe después)
    if (method === 'purchase') {
      return NextResponse.json(
        { error: 'Método de pago no implementado aún' },
        { status: 501 }
      )
    }

    return NextResponse.json(
      { error: 'Método inválido' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error al desbloquear sticker:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
