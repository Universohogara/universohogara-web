
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Obtener o crear estadísticas del usuario
    const statistics = await prisma.userStatistics.upsert({
      where: {
        user_id: session.user.id
      },
      update: {},
      create: {
        user_id: session.user.id,
        total_journal_entries: 0,
        total_templates_completed: 0,
        total_challenges_completed: 0,
        active_days: 0,
        streak_days: 0
      }
    })

    return NextResponse.json({ statistics })
  } catch (error) {
    console.error('Error fetching user statistics:', error)
    return NextResponse.json({ error: 'Error al cargar estadísticas' }, { status: 500 })
  }
}
