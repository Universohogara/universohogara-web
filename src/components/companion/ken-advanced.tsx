
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface KenAdvancedProps {
  size?: number
  showAura?: boolean
  interactive?: boolean
  allowMovement?: boolean // Permitir movimiento libre
  command?: 'YET' | 'NUN' | 'TWIST' | 'WALK' | null // Comando actual
  onCommandComplete?: () => void
}

// Secuencias de frames para cada acción
const FRAME_SEQUENCES = {
  // YET = TUMBADO (frames del inicio cuando está más relajado)
  YET: {
    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    fps: 8,
    loop: true
  },
  // NUN = SENTADO (frames del medio)
  NUN: {
    frames: [10, 11, 12, 13, 14, 15, 16, 17, 18],
    fps: 10,
    loop: true
  },
  // TWIST = DANDO VUELTAS (usar todos los frames rápido)
  TWIST: {
    frames: Array.from({ length: 39 }, (_, i) => i),
    fps: 30,
    loop: true
  },
  // WALK = CAMINANDO (frames del medio-final que tienen más movimiento)
  WALK: {
    frames: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    fps: 20,
    loop: true
  },
  // IDLE = Estado normal (mezcla suave)
  IDLE: {
    frames: [15, 16, 17, 18, 19, 20, 21],
    fps: 12,
    loop: true
  }
}

export const KenAdvanced: React.FC<KenAdvancedProps> = ({ 
  size = 300, 
  showAura = true,
  interactive = true,
  allowMovement = false,
  command = null,
  onCommandComplete
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [currentMood, setCurrentMood] = useState<'calm' | 'happy' | 'alert' | 'protective'>('calm')
  const [currentFrame, setCurrentFrame] = useState(0)
  const [currentAction, setCurrentAction] = useState<keyof typeof FRAME_SEQUENCES>('IDLE')
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Cambiar acción según comando
  useEffect(() => {
    if (command) {
      setCurrentAction(command)
      setCurrentFrame(0) // Resetear al primer frame de la nueva acción
      
      // Si es TWIST, volver a IDLE después de 3 segundos
      if (command === 'TWIST') {
        setTimeout(() => {
          setCurrentAction('IDLE')
          onCommandComplete?.()
        }, 3000)
      }
    }
  }, [command, onCommandComplete])

  // ANIMACIÓN: Ciclar entre los frames de la acción actual
  useEffect(() => {
    const sequence = FRAME_SEQUENCES[currentAction]
    const frameDelay = 1000 / sequence.fps
    
    frameIntervalRef.current = setInterval(() => {
      setCurrentFrame(prev => {
        const currentSequenceIndex = prev % sequence.frames.length
        const nextIndex = (currentSequenceIndex + 1) % sequence.frames.length
        return sequence.frames[nextIndex]
      })
    }, frameDelay)

    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current)
      }
    }
  }, [currentAction])

  // Movimiento libre por la página
  useEffect(() => {
    if (allowMovement && currentAction === 'WALK') {
      const moveInterval = setInterval(() => {
        // Generar nueva posición objetivo
        const maxX = window.innerWidth - size
        const maxY = window.innerHeight - size
        
        setTargetPosition({
          x: Math.random() * maxX,
          y: Math.random() * maxY
        })
      }, 5000) // Nueva posición cada 5 segundos

      return () => clearInterval(moveInterval)
    }
  }, [allowMovement, currentAction, size])

  // Animar hacia la posición objetivo
  useEffect(() => {
    if (allowMovement) {
      setPosition(targetPosition)
    }
  }, [targetPosition, allowMovement])

  // Cambiar estado aleatoriamente cuando está en IDLE
  useEffect(() => {
    if (currentAction === 'IDLE') {
      const moods: Array<'calm' | 'happy' | 'alert' | 'protective'> = ['calm', 'happy', 'alert', 'protective']
      
      const interval = setInterval(() => {
        const randomMood = moods[Math.floor(Math.random() * moods.length)]
        setCurrentMood(randomMood)
      }, 6000 + Math.random() * 4000)

      return () => clearInterval(interval)
    }
  }, [currentAction])

  // Colores de aura según el estado
  const auraColors = {
    calm: { outer: 'rgba(255,200,100,0.4)', inner: 'rgba(255,180,80,0.3)', glow: 'rgb(255,200,100)' },
    happy: { outer: 'rgba(255,220,120,0.5)', inner: 'rgba(255,200,100,0.4)', glow: 'rgb(255,220,120)' },
    alert: { outer: 'rgba(255,180,80,0.5)', inner: 'rgba(255,160,60,0.4)', glow: 'rgb(255,180,80)' },
    protective: { outer: 'rgba(255,160,60,0.6)', inner: 'rgba(255,140,40,0.5)', glow: 'rgb(255,160,60)' }
  }

  const colors = auraColors[currentMood]

  // Animaciones según el estado
  const breathingSpeed = currentMood === 'alert' ? 2 : currentMood === 'happy' ? 2.5 : 3.5
  const floatHeight = currentMood === 'happy' ? 12 : currentMood === 'alert' ? 8 : 10
  const rotationAmount = currentMood === 'happy' ? 3 : currentMood === 'protective' ? 2 : 1

  // Formatear número de frame con ceros a la izquierda (los frames van de 1 a 39)
  const frameNumber = String(currentFrame + 1).padStart(3, '0')
  const frameSrc = `/images/companions/ken/ken_frame_${frameNumber}_transparent.png`

  return (
    <motion.div 
      ref={containerRef}
      className="ken-advanced-container"
      style={{ 
        position: allowMovement ? 'fixed' : 'relative',
        width: size, 
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: allowMovement ? 99999 : 'auto',
        pointerEvents: 'auto'
      }}
      animate={allowMovement ? {
        x: position.x,
        y: position.y
      } : {}}
      transition={{
        type: 'spring',
        stiffness: 50,
        damping: 20
      }}
      onMouseEnter={() => {
        if (interactive) {
          setIsHovered(true)
          setCurrentMood('happy')
        }
      }}
      onMouseLeave={() => {
        if (interactive) {
          setIsHovered(false)
          setCurrentMood('calm')
        }
      }}
    >
      {/* Aura exterior mágica */}
      {showAura && (
        <motion.div
          className="ken-aura-outer"
          animate={{
            scale: [1.0, 1.15, 1.0],
            opacity: [0.5, 0.25, 0.5]
          }}
          transition={{
            duration: breathingSpeed,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.outer} 0%, ${colors.inner} 50%, rgba(255,160,60,0) 100%)`,
            filter: 'blur(20px)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Capa de brillo */}
      {showAura && (
        <motion.div
          className="ken-glow"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1.0, 1.05, 1.0]
          }}
          transition={{
            duration: breathingSpeed * 1.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '85%',
            height: '85%',
            borderRadius: '50%',
            background: colors.glow,
            filter: 'blur(15px)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* KEN ANIMADO con TODAS las patitas visibles */}
      <motion.div
        className="ken-character"
        animate={{
          y: currentAction === 'TWIST' ? 0 : [-floatHeight/2, floatHeight/2, -floatHeight/2],
          scale: currentAction === 'TWIST' ? [1.0, 1.1, 1.0] : [1.0, 1.05, 1.0],
          rotate: currentAction === 'TWIST' ? [0, 360] : [-rotationAmount, rotationAmount, -rotationAmount]
        }}
        transition={{
          y: {
            duration: currentAction === 'TWIST' ? 0.5 : breathingSpeed,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: {
            duration: currentAction === 'TWIST' ? 0.5 : breathingSpeed * 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: currentAction === 'TWIST' ? 1.5 : breathingSpeed * 1.5,
            repeat: Infinity,
            ease: currentAction === 'TWIST' ? "linear" : "easeInOut"
          }
        }}
        style={{
          position: 'relative',
          width: '120%', // MÁS GRANDE para ver TODAS las patitas
          height: '120%',
          zIndex: 3,
          cursor: interactive ? 'pointer' : 'default'
        }}
      >
        {/* Usando img estándar para mejor rendimiento */}
        <img
          src={frameSrc}
          alt="Ken - Guardian Companion"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: isHovered 
              ? 'brightness(1.15) drop-shadow(0 0 25px rgba(255,200,100,0.9))' 
              : currentMood === 'protective'
              ? 'brightness(1.08) drop-shadow(0 0 18px rgba(255,180,80,0.7))'
              : 'drop-shadow(0 0 12px rgba(255,200,100,0.6))'
          }}
        />
      </motion.div>

      {/* Partículas mágicas flotantes */}
      {showAura && (
        <div
          className="ken-sparkles"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 4,
            pointerEvents: 'none'
          }}
        >
          {(currentMood === 'happy' || currentMood === 'protective' || currentAction === 'TWIST'
            ? [
                { x: '15%', y: '15%', delay: 0 },
                { x: '85%', y: '20%', delay: 0.3 },
                { x: '20%', y: '80%', delay: 0.6 },
                { x: '80%', y: '75%', delay: 0.9 },
                { x: '50%', y: '10%', delay: 1.2 },
                { x: '10%', y: '50%', delay: 1.5 }
              ]
            : [
                { x: '25%', y: '25%', delay: 0 },
                { x: '75%', y: '30%', delay: 0.5 },
                { x: '30%', y: '70%', delay: 1.0 },
                { x: '70%', y: '65%', delay: 1.5 }
              ]
          ).map((sparkle, idx) => (
            <motion.div
              key={`sparkle-${idx}`}
              style={{
                position: 'absolute',
                left: sparkle.x,
                top: sparkle.y,
                width: currentAction === 'TWIST' ? 6 : currentMood === 'happy' ? 4 : 3,
                height: currentAction === 'TWIST' ? 6 : currentMood === 'happy' ? 4 : 3,
                borderRadius: '50%',
                background: colors.glow,
                boxShadow: `0 0 8px ${colors.glow}`
              }}
              animate={{
                opacity: [0.9, 0.3, 0.9],
                scale: [1, 1.5, 1],
                y: [0, -8, 0]
              }}
              transition={{
                duration: currentAction === 'TWIST' ? 1.0 : 2.0 + sparkle.delay,
                repeat: Infinity,
                ease: "easeInOut",
                delay: sparkle.delay
              }}
            />
          ))}
        </div>
      )}

      {/* Indicador de acción actual */}
      <AnimatePresence>
        {currentAction !== 'IDLE' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute',
              bottom: -40,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 14,
              fontWeight: 'bold',
              color: colors.glow,
              background: 'rgba(255,255,255,0.95)',
              padding: '6px 12px',
              borderRadius: '8px',
              zIndex: 10,
              whiteSpace: 'nowrap',
              border: `2px solid ${colors.glow}`,
              boxShadow: `0 0 12px ${colors.glow}`
            }}
          >
            {currentAction === 'YET' && '😴 Tumbado'}
            {currentAction === 'NUN' && '🐕 Sentado'}
            {currentAction === 'TWIST' && '🌀 Dando vueltas!'}
            {currentAction === 'WALK' && '🚶 Caminando'}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default KenAdvanced
