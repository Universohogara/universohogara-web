
'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar,
  CheckCircle2,
  Sparkles,
  Target,
  Trophy,
  Heart,
  Flame
} from 'lucide-react'
import { toast } from 'sonner'
import RewardAnimation from './reward-animation'

interface Challenge {
  id: string
  title: string
  description: string
  duration: number
  category: string
}

interface UserChallenge {
  id: string
  challenge_id: string
  started_at: string
  current_day: number
  completed_at: string | null
  challenge: Challenge
}

interface DailyChallengeWidgetProps {
  userChallenge: UserChallenge
  onUpdate?: () => void
}

export default function DailyChallengeWidget({
  userChallenge,
  onUpdate
}: DailyChallengeWidgetProps) {
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [rewards, setRewards] = useState({ points: 0, stickers: [], achievements: [] })
  const [canComplete, setCanComplete] = useState(true)

  const progress = Math.round((userChallenge.current_day / userChallenge.challenge.duration) * 100)
  const isCompleted = userChallenge.completed_at !== null

  // Verificar si ya completó hoy
  useEffect(() => {
    const lastCompleted = localStorage.getItem(`challenge_${userChallenge.id}_last_completed`)
    if (lastCompleted) {
      const lastDate = new Date(lastCompleted)
      const today = new Date()
      const isSameDay = 
        lastDate.getDate() === today.getDate() &&
        lastDate.getMonth() === today.getMonth() &&
        lastDate.getFullYear() === today.getFullYear()
      
      setCanComplete(!isSameDay)
    }
  }, [userChallenge.id])

  const handleCompleteDay = async () => {
    if (!note.trim()) {
      toast.error('Por favor, escribe una reflexión del día')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/challenges/complete-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userChallengeId: userChallenge.id,
          note: note.trim()
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Guardar fecha de completado
        localStorage.setItem(
          `challenge_${userChallenge.id}_last_completed`,
          new Date().toISOString()
        )
        
        // Mostrar recompensas
        setRewards(data.rewards)
        setShowReward(true)
        
        // Limpiar nota
        setNote('')
        setCanComplete(false)
        
        // Notificar al padre
        if (onUpdate) {
          setTimeout(() => onUpdate(), 3000)
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al completar el día')
      }
    } catch (error) {
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysRemaining = () => {
    return userChallenge.challenge.duration - userChallenge.current_day + 1
  }

  const getStreakEmoji = () => {
    const day = userChallenge.current_day
    if (day >= 21) return '🏆'
    if (day >= 14) return '🔥'
    if (day >= 7) return '⭐'
    return '💪'
  }

  return (
    <>
      <Card className="border-2 border-hogara-gold/30 overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-hogara-gold/10 via-hogara-pink/10 to-purple-50 p-6 border-b border-hogara-gold/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-hogara-gold" />
                <span className="text-sm font-medium text-hogara-gold uppercase">
                  Reto en progreso
                </span>
              </div>
              <h3 className="text-2xl font-serif text-hogara-gray mb-2">
                {userChallenge.challenge.title}
              </h3>
              <p className="text-sm text-hogara-gray/70">
                {userChallenge.challenge.description}
              </p>
            </div>
            <div className="text-center ml-4">
              <div className="text-4xl mb-1">{getStreakEmoji()}</div>
              <div className="text-2xl font-bold text-hogara-gold">
                {userChallenge.current_day}
              </div>
              <div className="text-xs text-hogara-gray/70">
                de {userChallenge.challenge.duration}
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-hogara-gray/70 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Progreso
              </span>
              <span className="font-medium text-hogara-gold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            {!isCompleted && (
              <p className="text-xs text-center text-hogara-gray/70">
                <Flame className="h-3 w-3 inline mr-1 text-orange-500" />
                {getDaysRemaining()} días para completar el reto
              </p>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {isCompleted ? (
            <div className="text-center py-8 space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <Trophy className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-hogara-gray mb-2">
                  ¡Reto Completado!
                </h4>
                <p className="text-hogara-gray/70">
                  Has completado los {userChallenge.challenge.duration} días del reto.
                  ¡Increíble trabajo! 🎉
                </p>
              </div>
            </div>
          ) : canComplete ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-hogara-gray flex items-center gap-2">
                  <Heart className="h-4 w-4 text-hogara-gold" />
                  Reflexión del día {userChallenge.current_day}
                </label>
                <Textarea
                  placeholder="¿Cómo te has sentido hoy? ¿Qué has aprendido?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-hogara-gray/60">
                  Escribe al menos una línea para completar el día
                </p>
              </div>

              <Button
                onClick={handleCompleteDay}
                disabled={isLoading || !note.trim()}
                className="w-full bg-gradient-to-r from-hogara-gold to-yellow-600 hover:from-hogara-gold/90 hover:to-yellow-600/90 text-white h-12 text-base"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Completar Día {userChallenge.current_day}
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-hogara-gray mb-1">
                  ¡Día completado!
                </h4>
                <p className="text-sm text-hogara-gray/70">
                  Ya completaste el reto de hoy. Vuelve mañana para continuar.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <RewardAnimation
        isVisible={showReward}
        rewards={rewards}
        onClose={() => setShowReward(false)}
      />
    </>
  )
}
