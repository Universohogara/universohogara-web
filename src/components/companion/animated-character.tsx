
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { soundManager } from '@/lib/sound-manager'

interface AnimatedCharacterProps {
  companionType: string
  companionName: string
  emotion?: 'neutral' | 'happy' | 'sad' | 'excited' | 'thinking' | 'sleeping'
  action?: 'idle' | 'walking' | 'jumping' | 'waving' | 'dancing' | 'crying' | 'laughing'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onClick?: () => void
  className?: string
}

export function AnimatedCharacter({
  companionType,
  companionName,
  emotion = 'neutral',
  action = 'idle',
  size = 'md',
  onClick,
  className = ''
}: AnimatedCharacterProps) {
  const [currentAction, setCurrentAction] = useState(action)
  const [showEffect, setShowEffect] = useState(false)

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
    xl: 'w-72 h-72'
  }

  const companionImage = `/images/companions/companion-${companionType}-${
    companionType === 'human' ? 'warm' :
    companionType === 'lumi' ? 'light' :
    companionType === 'nimbo' ? 'cloud' :
    companionType === 'fabel' ? 'animal' :
    companionType === 'sprig' ? 'plant' :
    companionType === 'hada' ? 'fairy' :
    companionType === 'elfo' ? 'elf' :
    companionType === 'draguito' ? 'dragon' :
    'unicorn'
  }.png`

  // Reproducir sonido cuando cambia la acción
  useEffect(() => {
    if (currentAction !== 'idle') {
      switch (currentAction) {
        case 'jumping':
          soundManager.playJump()
          break
        case 'waving':
          soundManager.playWave()
          break
        case 'dancing':
          soundManager.playDance()
          break
        case 'laughing':
          soundManager.playLaugh()
          break
        case 'crying':
          soundManager.playCry()
          break
      }
    }
  }, [currentAction])

  // Cambiar acción automáticamente para simular vida
  useEffect(() => {
    const actions = ['idle', 'walking', 'waving', 'dancing']
    const interval = setInterval(() => {
      if (action === 'idle') {
        const randomAction = actions[Math.floor(Math.random() * actions.length)]
        setCurrentAction(randomAction as any)
        
        setTimeout(() => {
          setCurrentAction('idle')
        }, 3000)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [action])

  // Efectos visuales según emoción
  useEffect(() => {
    if (emotion !== 'neutral') {
      setShowEffect(true)
      const timer = setTimeout(() => setShowEffect(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [emotion])

  // Obtener animación según la acción
  const getActionAnimation = () => {
    switch (currentAction) {
      case 'idle':
        return {
          y: [0, -10, 0],
          rotate: [0, -2, 2, 0],
          scale: [1, 1.02, 1],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        }
      case 'walking':
        return {
          x: [0, 50, 0, -50, 0],
          y: [0, -5, 0, -5, 0],
          rotate: [0, 5, 0, -5, 0],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        }
      case 'jumping':
        return {
          y: [0, -80, -40, -60, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
          rotate: [0, -10, 5, -5, 0],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut" as const
          }
        }
      case 'waving':
        return {
          rotate: [0, -15, 15, -10, 10, 0],
          scale: [1, 1.05, 1.05, 1.05, 1.05, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        }
      case 'dancing':
        return {
          rotate: [0, -20, 20, -20, 20, 0],
          y: [0, -15, 0, -15, 0],
          scale: [1, 1.1, 0.95, 1.1, 0.95, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        }
      case 'crying':
        return {
          y: [0, 5, 0, 5, 0],
          scale: [1, 0.98, 1, 0.98, 1],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        }
      case 'laughing':
        return {
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
          rotate: [0, -10, 10, -5, 5, 0],
          transition: {
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        }
      default:
        return {}
    }
  }

  // Colores y efectos según emoción
  const emotionEffects = {
    neutral: { color: '#D4AF37', glow: 'rgba(212, 175, 55, 0.3)', emoji: '✨' },
    happy: { color: '#FFD700', glow: 'rgba(255, 215, 0, 0.5)', emoji: '😊' },
    sad: { color: '#6B8EC6', glow: 'rgba(107, 142, 198, 0.4)', emoji: '😢' },
    excited: { color: '#FF6B9D', glow: 'rgba(255, 107, 157, 0.5)', emoji: '🎉' },
    thinking: { color: '#9B59B6', glow: 'rgba(155, 89, 182, 0.4)', emoji: '🤔' },
    sleeping: { color: '#95A5A6', glow: 'rgba(149, 165, 166, 0.3)', emoji: '😴' }
  }

  const currentEmotion = emotionEffects[emotion]

  const handleClick = () => {
    soundManager.playClick()
    onClick?.()
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Sombra del personaje */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-3 bg-black/20 rounded-full blur-md"
        animate={{
          scale: currentAction === 'jumping' ? [1, 0.7, 1] : [1, 1.05, 1],
          opacity: currentAction === 'jumping' ? [0.2, 0.1, 0.2] : [0.2, 0.25, 0.2]
        }}
        transition={{
          duration: currentAction === 'jumping' ? 1.5 : 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Partículas de emoción */}
      <AnimatePresence>
        {showEffect && (
          <>
            {[...Array(8)].map((_, i) => {
              const angle = (i * 360) / 8
              const distance = 60
              const x = Math.cos((angle * Math.PI) / 180) * distance
              const y = Math.sin((angle * Math.PI) / 180) * distance
              
              return (
                <motion.div
                  key={`emotion-particle-${i}`}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    x: [0, x],
                    y: [0, y],
                    opacity: [1, 0.8, 0]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute top-1/2 left-1/2 text-2xl pointer-events-none"
                >
                  {currentEmotion.emoji}
                </motion.div>
              )
            })}
          </>
        )}
      </AnimatePresence>

      {/* Aura/Glow del personaje según emoción */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl -z-10"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ backgroundColor: currentEmotion.glow }}
      />

      {/* Personaje principal - SIN RECUADROS NI BURBUJAS, SOLO SILUETA */}
      <motion.div
        className="relative w-full h-full cursor-pointer"
        animate={getActionAnimation()}
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Imagen del personaje - FONDO TRANSPARENTE, SOLO LA SILUETA */}
        <div className="relative w-full h-full">
          <Image
            src={companionImage}
            alt={companionName}
            fill
            className="object-contain drop-shadow-2xl"
            style={{ filter: `drop-shadow(0 10px 20px ${currentEmotion.glow})` }}
            priority
          />
        </div>

        {/* Efectos especiales según acción */}
        {currentAction === 'laughing' && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`laugh-${i}`}
                className="absolute text-3xl"
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                  x: [(Math.random() - 0.5) * 100],
                  y: [-50 - Math.random() * 50]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeOut"
                }}
                style={{
                  top: '20%',
                  left: '50%'
                }}
              >
                😂
              </motion.div>
            ))}
          </>
        )}

        {currentAction === 'crying' && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`tear-${i}`}
                className="absolute text-2xl"
                initial={{ y: 0, opacity: 1 }}
                animate={{
                  y: [0, 60],
                  opacity: [1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeIn"
                }}
                style={{
                  top: '30%',
                  left: `${40 + i * 10}%`
                }}
              >
                💧
              </motion.div>
            ))}
          </>
        )}

        {currentAction === 'dancing' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`music-${i}`}
                className="absolute text-xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 360],
                  x: [(Math.random() - 0.5) * 80],
                  y: [-40 - Math.random() * 40]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
                style={{
                  top: '50%',
                  left: '50%'
                }}
              >
                {['🎵', '🎶', '✨', '⭐', '💫', '🌟'][i]}
              </motion.div>
            ))}
          </>
        )}

        {/* Corazones cuando está contento */}
        {emotion === 'happy' && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`heart-${i}`}
                className="absolute text-2xl"
                initial={{ scale: 0, opacity: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [-60]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: "easeOut"
                }}
                style={{
                  top: '20%',
                  left: `${30 + i * 20}%`
                }}
              >
                ❤️
              </motion.div>
            ))}
          </>
        )}
      </motion.div>
    </div>
  )
}
