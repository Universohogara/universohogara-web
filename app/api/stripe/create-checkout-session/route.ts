
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

/**
 * Crea una sesión de checkout de Stripe para planes base
 * 
 * PLANES BASE:
 * - basic_7: 7€/mes - Música, descargas, chat emocional limitado
 * - complete_15: 15€/mes - Todo el contenido digital, plantillas, scrapbook
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { planTier } = await request.json()

    if (!planTier || !['basic_7', 'complete_15'].includes(planTier)) {
      return NextResponse.json(
        { error: 'Plan inválido' },
        { status: 400 }
      )
    }

    // Verificar si ya tiene Stripe configurado
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe no configurado. Por favor, añade tus claves de Stripe.' },
        { status: 500 }
      )
    }

    // TODO: Implementar integración con Stripe
    // Por ahora, retornamos un mensaje de configuración pendiente
    
    return NextResponse.json(
      { 
        error: 'Stripe pendiente de configuración',
        message: 'Para activar pagos, necesitas configurar Stripe con tus claves API.'
      },
      { status: 503 }
    )

  } catch (error) {
    console.error('Error creando sesión de checkout:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
