'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface KenCompanionProps {
  size?: number
  showAura?: boolean
  interactive?: boolean
  emotion?: 'calm' | 'happy' | 'alert' | 'protective'
}

// ✅ Ken usa la imagen 4 estática (ken_guardian_004.png)
const KEN_IMAGE_PATH = '/images/companions/ken/ken_guardian_004.png'

export function KenCompanion({ 
  size = 300, 
  showAura = true, 
  interactive = true,
  emotion = 'calm'
}: KenCompanionProps) {
  const [kenState, setKenState] = useState<'calm' | 'happy' | 'alert' | 'protective'>(emotion)

  // Cambiar estados emocionales cada 8-12 segundos (más tranquilo)
  useEffect(() => {
    const states: Array<'calm' | 'happy' | 'alert' | 'protective'> = ['calm', 'happy', 'alert', 'protective']
    
    const changeState = () => {
      const randomState = states[Math.floor(Math.random() * states.length)]
      setKenState(randomState)
    }

    const interval = setInterval(changeState, Math.random() * 4000 + 8000)

    return () => clearInterval(interval)
  }, [])

  // Colores de aura según estado
  const auraColors = {
    calm: { glow: 'rgb(255,200,100)', shadow: 'rgba(255,200,100,0.6)' },
    happy: { glow: 'rgb(255,220,120)', shadow: 'rgba(255,220,120,0.7)' },
    alert: { glow: 'rgb(255,180,80)', shadow: 'rgba(255,180,80,0.7)' },
    protective: { glow: 'rgb(255,160,60)', shadow: 'rgba(255,160,60,0.8)' }
  }

  const currentAura = auraColors[kenState]

  // Configuración de animación según estado - MÁS SUTIL como los demás companions
  const getAnimationConfig = () => {
    switch (kenState) {
      case 'happy':
        return { 
          y: [-3, 3, -3], 
          scale: [1, 1.02, 1], 
          duration: 3 
        }
      case 'alert':
        return { 
          y: [-2, 2, -2], 
          scale: [1, 1.01, 1], 
          duration: 2.5 
        }
      case 'protective':
        return { 
          y: [0, -2, 0], 
          scale: [1, 1.015, 1], 
          duration: 3.5 
        }
      default: // calm
        return { 
          y: [-2, 2, -2], 
          scale: [1, 1.01, 1], 
          duration: 4.5 
        }
    }
  }

  const animation = getAnimationConfig()

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Aura mágica dorada pulsante - MÁS SUTIL */}
      {showAura && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full blur-3xl -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ 
              backgroundColor: currentAura.glow,
              filter: 'blur(25px)'
            }}
          />
          
          {/* Partículas doradas flotantes - MENOS Y MÁS SUTILES */}
          {[...Array(4)].map((_, i) => {
            const angle = (i * 360) / 4
            const distance = size * 0.5
            const x = Math.cos((angle * Math.PI) / 180) * distance
            const y = Math.sin((angle * Math.PI) / 180) * distance
            
            return (
              <motion.div
                key={`particle-${i}`}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: currentAura.glow }}
                animate={{
                  x: [0, x * 0.2, 0],
                  y: [0, y * 0.2, 0],
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            )
          })}
        </>
      )}

      {/* Ken - Imagen 4 estática con movimiento sutil */}
      <motion.div
        className="relative w-full h-full"
        animate={{
          y: animation.y,
          scale: animation.scale,
          rotate: kenState === 'happy' ? [-1, 1, -1] : [0, 0, 0]
        }}
        transition={{
          duration: animation.duration,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={interactive ? { 
          scale: 1.05,
          filter: 'brightness(1.05)'
        } : {}}
      >
        <div className="relative w-full h-full">
          <Image
            src={KEN_IMAGE_PATH}
            alt="Ken el Guardian"
            fill
            className="object-contain"
            style={{ 
              filter: `drop-shadow(0 0 10px ${currentAura.shadow})`
            }}
            unoptimized
            priority
          />
        </div>
      </motion.div>

      {/* Indicador de estado en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500">
          Ken: {kenState}
        </div>
      )}
    </div>
  )
}

export default KenCompanion
