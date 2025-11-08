
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { templateId, data } = body

    if (!templateId || !data) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    // Guardar o actualizar el progreso de la plantilla
    const progress = await prisma.templateProgress.upsert({
      where: {
        user_id_template_id: {
          user_id: session.user.id,
          template_id: templateId
        }
      },
      update: {
        drawing_data: JSON.stringify(data),
        last_accessed: new Date(),
        updated_at: new Date()
      },
      create: {
        user_id: session.user.id,
        template_id: templateId,
        drawing_data: JSON.stringify(data),
        completed: false
      }
    })

    return NextResponse.json({ 
      success: true,
      progress 
    })
  } catch (error) {
    console.error('Error saving template progress:', error)
    return NextResponse.json(
      { error: 'Error al guardar' },
      { status: 500 }
    )
  }
}
