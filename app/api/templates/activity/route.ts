
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { templateId, activity, timestamp } = body

    // Registrar actividad sospechosa (podrías guardar esto en la base de datos)
    console.log('[SECURITY LOG]', {
      user: session.user.email,
      templateId,
      activity,
      timestamp,
      userAgent: request.headers.get('user-agent')
    })

    // Aquí podrías guardar en la base de datos si quieres un historial permanente
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging activity:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
