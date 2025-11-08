
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

    // Obtener estadísticas del chat
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Total de mensajes del usuario
    const totalMessages = await prisma.chatMessage.count({
      where: {
        user_id: user.id,
        role: 'user'
      }
    })

    // Mensajes en los últimos 7 días
    const messagesThisWeek = await prisma.chatMessage.count({
      where: {
        user_id: user.id,
        role: 'user',
        created_at: { gte: sevenDaysAgo }
      }
    })

    // Mensajes en los últimos 30 días
    const messagesThisMonth = await prisma.chatMessage.count({
      where: {
        user_id: user.id,
        role: 'user',
        created_at: { gte: thirtyDaysAgo }
      }
    })

    // Días únicos con actividad en la última semana
    const messagesWithDates = await prisma.chatMessage.findMany({
      where: {
        user_id: user.id,
        role: 'user',
        created_at: { gte: sevenDaysAgo }
      },
      select: {
        created_at: true
      }
    })

    const uniqueDays = new Set(
      messagesWithDates.map((msg: any) => msg.created_at.toISOString().split('T')[0])
    )
    const activeDaysThisWeek = uniqueDays.size

    // Análisis de riesgo (últimos 7 días)
    const riskMessages = await prisma.chatMessage.count({
      where: {
        user_id: user.id,
        role: 'user',
        created_at: { gte: sevenDaysAgo },
        is_risk_detected: true
      }
    })

    // Primera vez usando el chat
    const firstMessage = await prisma.chatMessage.findFirst({
      where: {
        user_id: user.id,
        role: 'user'
      },
      orderBy: {
        created_at: 'asc'
      }
    })

    // Calcular racha (días consecutivos)
    const recentMessages = await prisma.chatMessage.findMany({
      where: {
        user_id: user.id,
        role: 'user',
        created_at: { gte: thirtyDaysAgo }
      },
      orderBy: {
        created_at: 'desc'
      },
      select: {
        created_at: true
      }
    })

    let currentStreak = 0
    const today = new Date().toISOString().split('T')[0]
    const messageDates = Array.from(new Set(
      recentMessages.map((msg: any) => msg.created_at.toISOString().split('T')[0])
    )).sort().reverse()

    if (messageDates.length > 0 && (messageDates[0] === today || 
        new Date(String(messageDates[0] || today)).getTime() >= new Date(today).getTime() - 24 * 60 * 60 * 1000)) {
      for (let i = 0; i < messageDates.length; i++) {
        const date = new Date(String(messageDates[i] || today))
        const expectedDate = new Date(today)
        expectedDate.setDate(expectedDate.getDate() - i)
        const expectedDateStr = expectedDate.toISOString().split('T')[0]
        
        if (messageDates[i] === expectedDateStr) {
          currentStreak++
        } else {
          break
        }
      }
    }

    // Mensajes por día de la semana (últimos 7 días)
    const messagesByDay = await prisma.chatMessage.groupBy({
      by: ['created_at'],
      where: {
        user_id: user.id,
        role: 'user',
        created_at: { gte: sevenDaysAgo }
      },
      _count: {
        id: true
      }
    })

    // Agrupar por día
    const dayMap: Record<string, number> = {}
    messagesByDay.forEach((item: any) => {
      const day = item.created_at.toISOString().split('T')[0]
      dayMap[day] = (dayMap[day] || 0) + item._count.id
    })

    const chartData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      const dateStr = date.toISOString().split('T')[0]
      return {
        day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        count: dayMap[dateStr] || 0,
        date: dateStr
      }
    })

    return NextResponse.json({
      totalMessages,
      messagesThisWeek,
      messagesThisMonth,
      activeDaysThisWeek,
      riskMessages,
      currentStreak,
      joinedDate: firstMessage?.created_at || now,
      chartData
    })

  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
