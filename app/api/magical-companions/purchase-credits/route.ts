
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

/**
 * DEPRECATED: Este endpoint ya no se usa.
 * El sistema de créditos fue reemplazado por suscripciones directas.
 * 
 * Ver /api/magical-companions/subscribe en su lugar.
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Endpoint deprecado',
      message: 'El sistema de créditos ya no está disponible. Usa suscripciones directas.'
    },
    { status: 410 } // Gone
  )
}
