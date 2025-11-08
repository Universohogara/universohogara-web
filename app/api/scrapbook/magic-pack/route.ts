
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        premium_packs: {
          where: {
            pack_type: 'scrapbook_magic',
            is_active: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const hasMagicPack = user.premium_packs.length > 0
    const packInfo = user.premium_packs[0] || null

    return NextResponse.json({
      hasMagicPack,
      packInfo,
      pricing: {
        monthly: 2.99,
        oneTime: 19.99
      },
      features: [
        'Páginas ilimitadas',
        'Acceso a todos los stickers (200+)',
        'Bolsillo secreto cifrado',
        'Página de manifestación',
        'Modo ritual/noche',
        'Efectos mágicos premium',
        'Exportar a PDF de alta calidad',
        'Música ambiental exclusiva'
      ]
    })
  } catch (error) {
    console.error('Error al obtener info del pack:', error)
    return NextResponse.json(
      { error: 'Error al obtener información' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { purchaseType } = await req.json() // 'monthly' o 'one_time'

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar si ya tiene el pack activo
    const existingPack = await prisma.userPremiumPack.findFirst({
      where: {
        user_id: user.id,
        pack_type: 'scrapbook_magic',
        is_active: true
      }
    })

    if (existingPack) {
      return NextResponse.json({ 
        error: 'Ya tienes el Pack Scrapbook Mágico activo' 
      }, { status: 400 })
    }

    // Calcular fecha de expiración
    let expiresAt = null
    if (purchaseType === 'monthly') {
      const now = new Date()
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 días
    }
    // Si es one_time, expiresAt = null (permanente)

    // Crear el pack premium
    const pack = await prisma.userPremiumPack.create({
      data: {
        user_id: user.id,
        pack_type: 'scrapbook_magic',
        expires_at: expiresAt,
        is_active: true
      }
    })

    return NextResponse.json({
      success: true,
      pack,
      message: purchaseType === 'one_time' 
        ? '¡Pack Scrapbook Mágico adquirido para siempre! ✨'
        : '¡Pack Scrapbook Mágico activado por 30 días! ✨'
    })
  } catch (error) {
    console.error('Error al activar pack:', error)
    return NextResponse.json(
      { error: 'Error al activar pack' },
      { status: 500 }
    )
  }
}
