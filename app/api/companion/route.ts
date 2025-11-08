
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * Mapeo de IDs modernos (UI) a IDs legacy (DB)
 * UI usa: ada, luna, ember, sage, sprig, coral, orion, aurora, ken, willow
 * DB tiene: hada, lumi, draguito, elfo, fabel, nimbo, unicornito, human, ken, willow
 */
const ID_TO_DB_TYPE: Record<string, string> = {
  'ada': 'hada',
  'luna': 'lumi',
  'ember': 'draguito',
  'sage': 'elfo',
  'sprig': 'fabel',
  'coral': 'nimbo',
  'orion': 'unicornito',
  'aurora': 'human',
  'ken': 'ken',
  'willow': 'willow'
}

// Mapeo inverso: de DB a UI
const DB_TYPE_TO_ID: Record<string, string> = {
  'hada': 'ada',
  'lumi': 'luna',
  'draguito': 'ember',
  'elfo': 'sage',
  'fabel': 'sprig',
  'nimbo': 'coral',
  'unicornito': 'orion',
  'human': 'aurora',
  'ken': 'ken',
  'willow': 'willow'
}

/**
 * Convierte un companion de DB a formato UI
 */
function companionToUI(companion: any) {
  if (!companion) return null
  return {
    ...companion,
    type: DB_TYPE_TO_ID[companion.type] || companion.type
  }
}

/**
 * Convierte un type de UI a formato DB
 */
function typeToDBType(type: string): string {
  return ID_TO_DB_TYPE[type] || type
}

// GET: Obtener acompañante activo del usuario
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        companions: {
          where: { is_active: true },
          include: {
            memories: {
              orderBy: { importance: 'desc' },
              take: 10
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const companionDB = user.companions.length > 0 ? user.companions[0] : null
    const companion = companionToUI(companionDB)

    return NextResponse.json({ companion })
  } catch (error) {
    console.error('Error al obtener acompañante:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST: Activar un companion específico (desactiva los demás)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      console.error('❌ API Companion POST: No autenticado')
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      console.error('❌ API Companion POST: Usuario no encontrado')
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const body = await req.json()
    const { type } = body
    
    if (!type) {
      return NextResponse.json({ error: 'El campo "type" es requerido' }, { status: 400 })
    }

    // Convertir el type de UI a DB
    const dbType = typeToDBType(type)
    
    console.log('📥 API Companion POST - Activando companion')
    console.log('  Type UI:', type)
    console.log('  Type DB:', dbType)

    // Desactivar todos los companions del usuario
    await prisma.companion.updateMany({
      where: { user_id: user.id },
      data: { is_active: false }
    })

    // Activar el companion específico (buscar en DB con el type convertido)
    const companion = await prisma.companion.updateMany({
      where: { 
        user_id: user.id,
        type: dbType  // Usar el type convertido
      },
      data: { is_active: true }
    })

    if (companion.count === 0) {
      console.error(`❌ Companion no encontrado con type: ${dbType}`)
      return NextResponse.json({ error: 'Companion no encontrado' }, { status: 404 })
    }

    // Obtener el companion activado con sus memories
    const activeCompanionDB = await prisma.companion.findFirst({
      where: {
        user_id: user.id,
        type: dbType  // Usar el type convertido
      },
      include: {
        memories: {
          orderBy: { importance: 'desc' },
          take: 10
        }
      }
    })

    // Convertir a formato UI antes de devolver
    const activeCompanion = companionToUI(activeCompanionDB)

    console.log('✅ Companion activado:', activeCompanion?.type, activeCompanion?.name)

    return NextResponse.json({ 
      success: true,
      companion: activeCompanion,
      message: `Companion ${activeCompanion?.name} activado correctamente`
    })
  } catch (error) {
    console.error('❌ Error al activar companion:', error)
    return NextResponse.json({ error: 'Error interno del servidor', details: String(error) }, { status: 500 })
  }
}

// PUT: Actualizar propiedades de un companion específico
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const body = await req.json()
    const { type, position_x, position_y, voice_tone, personality, is_active } = body

    if (!type) {
      return NextResponse.json({ error: 'El campo "type" es requerido' }, { status: 400 })
    }

    // Convertir el type de UI a DB
    const dbType = typeToDBType(type)

    // Construir el objeto de actualización solo con campos definidos
    const updateData: any = {}
    if (position_x !== undefined) updateData.position_x = position_x
    if (position_y !== undefined) updateData.position_y = position_y
    if (voice_tone !== undefined) updateData.voice_tone = voice_tone
    if (personality !== undefined) updateData.personality = personality
    if (is_active !== undefined) {
      // Si se está activando este companion, desactivar los demás
      if (is_active) {
        await prisma.companion.updateMany({
          where: { user_id: user.id },
          data: { is_active: false }
        })
      }
      updateData.is_active = is_active
    }

    const companion = await prisma.companion.updateMany({
      where: { 
        user_id: user.id,
        type: dbType  // Usar el type convertido
      },
      data: updateData
    })

    if (companion.count === 0) {
      return NextResponse.json({ error: 'Companion no encontrado' }, { status: 404 })
    }

    // Obtener el companion actualizado
    const updatedCompanionDB = await prisma.companion.findFirst({
      where: {
        user_id: user.id,
        type: dbType  // Usar el type convertido
      }
    })

    // Convertir a formato UI antes de devolver
    const updatedCompanion = companionToUI(updatedCompanionDB)

    return NextResponse.json({ companion: updatedCompanion })
  } catch (error) {
    console.error('Error al actualizar estado del acompañante:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
