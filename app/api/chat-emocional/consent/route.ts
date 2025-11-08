
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

    const consent = await prisma.chatConsent.findUnique({
      where: { user_id: user.id }
    })

    return NextResponse.json({ hasConsent: consent?.accepted || false })

  } catch (error) {
    console.error('Error al obtener consentimiento:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

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

    const { accepted } = await request.json()

    await prisma.chatConsent.upsert({
      where: { user_id: user.id },
      update: {
        accepted,
        accepted_at: accepted ? new Date() : null
      },
      create: {
        user_id: user.id,
        accepted,
        accepted_at: accepted ? new Date() : null
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error al guardar consentimiento:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
