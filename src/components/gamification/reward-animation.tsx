
'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Trophy, 
  Star, 
  Gift,
  Zap,
  Heart,
  Crown,
  Award,
  CheckCircle2
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface Reward {
  points: number
  stickers: any[]
  achievements: string[]
}

interface RewardAnimationProps {
  isVisible: boolean
  rewards: Reward
  onClose: () => void
}

const ACHIEVEMENT_ICONS: Record<string, any> = {
  'Semana completada': Trophy,
  'Reto de 21 días completado': Crown,
  'Primera entrada': Star,
  'Streak de 7 días': Zap
}

export default function RewardAnimation({
  isVisible,
  rewards,
  onClose
}: RewardAnimationProps) {
  const [showPoints, setShowPoints] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showStickers, setShowStickers] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // Confetti inicial
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B8956A', '#E8DDD2', '#FFB6C1', '#87CEEB']
      })

      // Secuencia de animaciones
      setTimeout(() => setShowPoints(true), 500)
      setTimeout(() => setShowAchievements(true), 1500)
      setTimeout(() => setShowStickers(true), 2500)

      // Confetti adicional si hay logros importantes
      if (rewards.achievements.length > 0) {
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FFD700', '#FFA500']
          })
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#FFD700', '#FFA500']
          })
        }, 2000)
      }
    } else {
      setShowPoints(false)
      setShowAchievements(false)
      setShowStickers(false)
    }
  }, [isVisible, rewards])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-lg w-full"
        >
          <Card className="p-8 bg-gradient-to-br from-white via-hogara-cream/30 to-hogara-pink/10 border-2 border-hogara-gold/30 shadow-2xl">
            {/* Icono principal */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-hogara-gold/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-hogara-gold to-yellow-600 p-6 rounded-full">
                  <Gift className="h-12 w-12 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Título */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-serif text-center text-hogara-gray mb-2"
            >
              ¡Felicidades!
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-hogara-gray/70 mb-8"
            >
              Has completado el día. Estas son tus recompensas:
            </motion.p>

            {/* Puntos */}
            {showPoints && rewards.points > 0 && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring' }}
                className="mb-6"
              >
                <Card className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500 rounded-lg">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-hogara-gray">Puntos ganados</p>
                        <p className="text-sm text-hogara-gray/70">Sigue así!</p>
                      </div>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="text-3xl font-bold text-yellow-600"
                    >
                      +{rewards.points}
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Logros */}
            {showAchievements && rewards.achievements.length > 0 && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring' }}
                className="mb-6 space-y-3"
              >
                {rewards.achievements.map((achievement, index) => {
                  const Icon = ACHIEVEMENT_ICONS[achievement] || Award
                  return (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: index * 0.1 }}
                    >
                      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-hogara-gray">{achievement}</p>
                            <p className="text-sm text-hogara-gray/70">Logro desbloqueado</p>
                          </div>
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {/* Stickers desbloqueados */}
            {showStickers && rewards.stickers.length > 0 && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring' }}
                className="mb-6"
              >
                <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <p className="font-medium text-hogara-gray">Stickers desbloqueados</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {rewards.stickers.map((sticker, index) => (
                      <motion.div
                        key={sticker.id}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', delay: index * 0.1 }}
                        className="p-3 bg-white rounded-lg border-2 border-blue-200"
                      >
                        {sticker.image_url.length <= 4 ? (
                          <span className="text-3xl">{sticker.image_url}</span>
                        ) : (
                          <img src={sticker.image_url} alt={sticker.name} className="h-10 w-10" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Botón de cerrar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
            >
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-hogara-gold to-yellow-600 hover:from-hogara-gold/90 hover:to-yellow-600/90 text-white text-lg py-6"
              >
                <Heart className="h-5 w-5 mr-2" />
                ¡Continuar mi viaje!
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
