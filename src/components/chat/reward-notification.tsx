
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Sparkles, X } from 'lucide-react'

interface RewardNotificationProps {
  achievements: string[]
  points: number
  onClose: () => void
}

export function RewardNotification({ achievements, points, onClose }: RewardNotificationProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (achievements.length > 0) {
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(onClose, 300)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [achievements, onClose])

  if (achievements.length === 0) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4"
        >
          <Card className="border-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-2xl">
            <div className="p-6 relative">
              <button
                onClick={() => {
                  setShow(false)
                  setTimeout(onClose, 300)
                }}
                className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-8 w-8" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">¡Recompensa Desbloqueada!</h3>
                  <p className="text-white/90 text-sm">+{points} puntos ganados</p>
                </div>
              </div>

              <div className="space-y-2">
                {achievements.map((achievement, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2"
                  >
                    <p className="font-medium">{achievement}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 text-center text-sm text-white/80">
                Sigue así, cada paso cuenta ✨
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
