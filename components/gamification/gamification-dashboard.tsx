
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Trophy, Star, TrendingUp, Gift } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface GamificationProfile {
  user: {
    id: string
    name: string
    email: string
    points: number
    level: number
    experience: number
    experienceForNextLevel: number
    experienceProgress: number
  }
  achievements: Array<{
    id: string
    achievement: {
      id: string
      name: string
      description: string
      icon: string
      points_reward: number
      category: string
    }
    is_new: boolean
    unlocked_at: string
  }>
  statistics: {
    total_journal_entries: number
    total_templates_completed: number
    total_challenges_completed: number
    active_days: number
    streak_days: number
  } | null
}

export function GamificationDashboard() {
  const [profile, setProfile] = useState<GamificationProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showNewAchievement, setShowNewAchievement] = useState(false)
  const [newAchievements, setNewAchievements] = useState<any[]>([])

  useEffect(() => {
    loadProfile()
    checkNewAchievements()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/gamification/profile')
      const data = await res.json()
      setProfile(data)
    } catch (error) {
      console.error('Error al cargar perfil:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkNewAchievements = async () => {
    try {
      const res = await fetch('/api/gamification/check-achievements', {
        method: 'POST'
      })
      const data = await res.json()
      if (data.newAchievements && data.newAchievements.length > 0) {
        setNewAchievements(data.newAchievements)
        setShowNewAchievement(true)
        // Recargar perfil para actualizar puntos
        loadProfile()
      }
    } catch (error) {
      console.error('Error al verificar logros:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8956A]"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-500">No se pudo cargar el perfil de gamificación</p>
      </div>
    )
  }

  const { user, achievements, statistics } = profile

  return (
    <div className="space-y-6">
      {/* Notificación de nuevo logro */}
      <AnimatePresence>
        {showNewAchievement && newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <Card className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white p-6 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="text-4xl">
                  {newAchievements[0].icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    ¡Nuevo Logro!
                  </h3>
                  <p className="text-sm font-semibold mt-1">{newAchievements[0].name}</p>
                  <p className="text-xs opacity-90 mt-1">{newAchievements[0].description}</p>
                  <p className="text-sm font-bold mt-2">
                    +{newAchievements[0].points_reward} puntos ✨
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowNewAchievement(false)}
                  className="text-white hover:bg-white/20"
                >
                  ×
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Nivel</p>
              <p className="text-3xl font-bold">{user.level}</p>
            </div>
            <Star className="h-12 w-12 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Puntos</p>
              <p className="text-3xl font-bold">{user.points}</p>
            </div>
            <Sparkles className="h-12 w-12 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-400 to-cyan-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Racha</p>
              <p className="text-3xl font-bold">{statistics?.streak_days || 0}</p>
            </div>
            <TrendingUp className="h-12 w-12 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Logros</p>
              <p className="text-3xl font-bold">{achievements.length}</p>
            </div>
            <Trophy className="h-12 w-12 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Progreso de nivel */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">Progreso al Nivel {user.level + 1}</h3>
          <span className="text-sm text-gray-600">
            {user.experienceProgress}/{user.experienceForNextLevel} XP
          </span>
        </div>
        <Progress value={(user.experienceProgress / user.experienceForNextLevel) * 100} className="h-3" />
      </Card>

      {/* Logros recientes */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Logros Desbloqueados
        </h3>
        {achievements.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aún no has desbloqueado logros. ¡Comienza tu viaje! ✨
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.slice(0, 6).map((ua) => (
              <div
                key={ua.id}
                className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200"
              >
                <div className="text-3xl">{ua.achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{ua.achievement.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{ua.achievement.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      +{ua.achievement.points_reward} puntos
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {ua.achievement.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Estadísticas */}
      {statistics && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Gift className="h-5 w-5 text-pink-500" />
            Tus Estadísticas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{statistics.total_journal_entries}</p>
              <p className="text-xs text-gray-600 mt-1">Diarios</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{statistics.total_templates_completed}</p>
              <p className="text-xs text-gray-600 mt-1">Plantillas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{statistics.total_challenges_completed}</p>
              <p className="text-xs text-gray-600 mt-1">Retos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{statistics.active_days}</p>
              <p className="text-xs text-gray-600 mt-1">Días Activos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">{statistics.streak_days}</p>
              <p className="text-xs text-gray-600 mt-1">Racha Actual</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
