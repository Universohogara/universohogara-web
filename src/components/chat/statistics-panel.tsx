
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, MessageCircle, Calendar, Award, Flame } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChatStatistics {
  totalMessages: number
  messagesThisWeek: number
  messagesThisMonth: number
  activeDaysThisWeek: number
  riskMessages: number
  currentStreak: number
  joinedDate: string
  chartData: Array<{
    day: string
    count: number
    date: string
  }>
}

export function StatisticsPanel() {
  const [stats, setStats] = useState<ChatStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      const res = await fetch('/api/chat-emocional/statistics')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#B8956A]" />
        </div>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  const joinDate = new Date(stats.joinedDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-serif text-[#1a1a1a] mb-2">
          Tu Progreso Emocional
        </h2>
        <p className="text-gray-600 text-sm">
          Iniciaste tu viaje el {joinDate}
        </p>
      </div>

      {/* Grid de estadísticas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-0 bg-gradient-to-br from-rose-50 to-rose-100">
          <div className="flex flex-col items-center text-center">
            <MessageCircle className="h-8 w-8 text-rose-500 mb-2" />
            <p className="text-2xl font-bold text-rose-700">{stats.totalMessages}</p>
            <p className="text-sm text-rose-600">Mensajes totales</p>
          </div>
        </Card>

        <Card className="p-4 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex flex-col items-center text-center">
            <Calendar className="h-8 w-8 text-purple-500 mb-2" />
            <p className="text-2xl font-bold text-purple-700">{stats.activeDaysThisWeek}</p>
            <p className="text-sm text-purple-600">Días activos (7d)</p>
          </div>
        </Card>

        <Card className="p-4 border-0 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex flex-col items-center text-center">
            <Flame className="h-8 w-8 text-orange-500 mb-2" />
            <p className="text-2xl font-bold text-orange-700">{stats.currentStreak}</p>
            <p className="text-sm text-orange-600">Racha actual</p>
          </div>
        </Card>

        <Card className="p-4 border-0 bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="flex flex-col items-center text-center">
            <TrendingUp className="h-8 w-8 text-amber-500 mb-2" />
            <p className="text-2xl font-bold text-amber-700">{stats.messagesThisWeek}</p>
            <p className="text-sm text-amber-600">Esta semana</p>
          </div>
        </Card>
      </div>

      {/* Gráfico de actividad semanal */}
      <Card className="p-6 border-0 bg-white shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#B8956A]" />
          Actividad de los últimos 7 días
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={stats.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              stroke="#999"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#999"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#B8956A" 
              strokeWidth={3}
              dot={{ fill: '#B8956A', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Logros y badges */}
      <Card className="p-6 border-0 bg-gradient-to-br from-purple-50 to-rose-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-500" />
          Logros Desbloqueados
        </h3>
        <div className="flex flex-wrap gap-2">
          {stats.totalMessages >= 1 && (
            <Badge className="bg-gradient-to-r from-rose-400 to-purple-400 text-white px-3 py-1">
              🎉 Primera conversación
            </Badge>
          )}
          {stats.totalMessages >= 10 && (
            <Badge className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-3 py-1">
              🎯 10 mensajes
            </Badge>
          )}
          {stats.totalMessages >= 50 && (
            <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-3 py-1">
              🏆 50 mensajes
            </Badge>
          )}
          {stats.totalMessages >= 100 && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1">
              👑 100 mensajes
            </Badge>
          )}
          {stats.currentStreak >= 3 && (
            <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1">
              🔥 Racha de 3 días
            </Badge>
          )}
          {stats.currentStreak >= 7 && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1">
              🔥 Racha de 7 días
            </Badge>
          )}
          {stats.currentStreak >= 30 && (
            <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1">
              🔥 Racha de 30 días
            </Badge>
          )}
          {stats.activeDaysThisWeek >= 5 && (
            <Badge className="bg-gradient-to-r from-teal-400 to-blue-400 text-white px-3 py-1">
              💪 Muy activa esta semana
            </Badge>
          )}
        </div>
        {stats.totalMessages === 0 && (
          <p className="text-gray-500 text-sm">
            Envía tu primer mensaje para comenzar a desbloquear logros 🌟
          </p>
        )}
      </Card>

      {/* Nota de motivación */}
      {stats.currentStreak > 0 && (
        <Card className="p-4 border-0 bg-gradient-to-r from-amber-100 to-orange-100">
          <p className="text-center text-amber-800">
            <span className="text-2xl mr-2">🔥</span>
            <strong>¡Increíble!</strong> Llevas {stats.currentStreak} días seguidos cuidando tu bienestar emocional.
            Sigue así, cada día cuenta. 💫
          </p>
        </Card>
      )}
    </div>
  )
}
