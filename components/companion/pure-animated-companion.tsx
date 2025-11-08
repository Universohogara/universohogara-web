
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'

interface PureAnimatedCompanionProps {
  companionType: string
  companionName: string
  emotion?: 'neutral' | 'happy' | 'sad' | 'excited' | 'thinking' | 'sleeping' | 'anxious' | 'angry' | 'laughing' | 'crying'
  isListening?: boolean
  isSpeaking?: boolean
  audioAnalyser?: AnalyserNode | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function PureAnimatedCompanion({
  companionType,
  companionName,
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  audioAnalyser = null,
  size = 'xl',
  className = ''
}: PureAnimatedCompanionProps) {
  const [audioLevel, setAudioLevel] = useState(0)
  const animationFrameRef = useRef<number>()

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
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

  // Análisis de audio en tiempo real
  useEffect(() => {
    if (!audioAnalyser) {
      setAudioLevel(0)
      return
    }

    const bufferLength = audioAnalyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const updateAudioLevel = () => {
      audioAnalyser.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / bufferLength
      const normalized = Math.min(average / 80, 1)
      setAudioLevel(normalized)
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
    }

    updateAudioLevel()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [audioAnalyser])

  // Colores del aura según emoción
  const emotionAura = {
    neutral: { color: '#D4AF37', glow: '#E8C547', intensity: 0.6 },
    happy: { color: '#FFD700', glow: '#FFA500', intensity: 0.8 },
    sad: { color: '#6B8EC6', glow: '#4A6FA5', intensity: 0.5 },
    excited: { color: '#FF6B9D', glow: '#FF1493', intensity: 0.9 },
    thinking: { color: '#9B59B6', glow: '#8E44AD', intensity: 0.6 },
    anxious: { color: '#E74C3C', glow: '#C0392B', intensity: 0.7 },
    angry: { color: '#FF4500', glow: '#DC143C', intensity: 0.8 },
    sleeping: { color: '#95A5A6', glow: '#7F8C8D', intensity: 0.3 },
    laughing: { color: '#FFD700', glow: '#FF8C00', intensity: 0.9 },
    crying: { color: '#4682B4', glow: '#5F9EA0', intensity: 0.6 }
  }

  const currentAura = emotionAura[emotion]
  const audioMultiplier = isSpeaking ? 1 + audioLevel * 0.5 : 1

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* AURA DE ENERGÍA - CAPA 1 (MÁS GRANDE) */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          filter: 'blur(40px)',
          background: `radial-gradient(circle, ${currentAura.color}90 0%, ${currentAura.glow}70 40%, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.3 * audioMultiplier, 1],
          opacity: [currentAura.intensity, currentAura.intensity * 1.3, currentAura.intensity],
          rotate: [0, 360]
        }}
        transition={{
          scale: { duration: isSpeaking ? 0.3 : 2, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: isSpeaking ? 0.3 : 2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 10, repeat: Infinity, ease: 'linear' }
        }}
      />

      {/* AURA DE ENERGÍA - CAPA 2 (MEDIA) */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          filter: 'blur(25px)',
          background: `radial-gradient(circle, ${currentAura.glow}95 0%, ${currentAura.color}75 50%, transparent 70%)`
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [currentAura.intensity * 0.8, currentAura.intensity * 1.2, currentAura.intensity * 0.8],
          rotate: [360, 0]
        }}
        transition={{
          scale: { duration: isSpeaking ? 0.4 : 2.5, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: isSpeaking ? 0.4 : 2.5, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 8, repeat: Infinity, ease: 'linear' }
        }}
      />

      {/* AURA DE ENERGÍA - CAPA 3 (PEQUEÑA E INTENSA) */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          filter: 'blur(15px)',
          background: `radial-gradient(circle, ${currentAura.color}FF 0%, ${currentAura.glow}90 30%, transparent 60%)`
        }}
        animate={{
          scale: [0.9, 1.1 * audioMultiplier, 0.9],
          opacity: [currentAura.intensity * 0.9, currentAura.intensity * 1.4, currentAura.intensity * 0.9]
        }}
        transition={{
          scale: { duration: isSpeaking ? 0.25 : 1.5, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: isSpeaking ? 0.25 : 1.5, repeat: Infinity, ease: 'easeInOut' }
        }}
      />

      {/* ANILLO DE ENERGÍA PULSANTE */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: `2px solid ${currentAura.color}80`,
          boxShadow: `0 0 25px ${currentAura.color}90, inset 0 0 25px ${currentAura.glow}60`
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* ONDAS AL HABLAR */}
      {isSpeaking && (
        <>
          {[0, 0.2, 0.4].map((delay) => (
            <motion.div
              key={`wave-${delay}`}
              className="absolute inset-0 rounded-full border-4 pointer-events-none"
              style={{
                borderColor: currentAura.color,
                boxShadow: `0 0 20px ${currentAura.color}`
              }}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeOut',
                delay
              }}
            />
          ))}
        </>
      )}

      {/* ONDAS AL ESCUCHAR */}
      {isListening && (
        <>
          {[0, 0.3, 0.6].map((delay) => (
            <motion.div
              key={`listen-${delay}`}
              className="absolute inset-0 rounded-full border-3 pointer-events-none"
              style={{
                borderColor: '#EF4444',
                boxShadow: `0 0 20px rgba(239, 68, 68, 0.7)`
              }}
              initial={{ scale: 0.95, opacity: 0.7 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeOut',
                delay
              }}
            />
          ))}
        </>
      )}

      {/* COMPANION - SOLO LA SILUETA CON TRANSPARENCIA */}
      <motion.div
        className="relative w-full h-full"
        animate={{
          y: isSpeaking ? [0, -8, 0] : isListening ? [0, -5, 0] : [0, -4, 0],
          scale: isSpeaking ? [1, 1.04 * audioMultiplier, 1] : [1, 1.02, 1],
          rotate: emotion === 'excited' ? [-3, 3, -3] : [-1, 1, -1]
        }}
        transition={{
          y: { duration: isSpeaking ? 0.6 : 2, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: isSpeaking ? 0.6 : 2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: emotion === 'excited' ? 1 : 3, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        <div className="relative w-full h-full">
          <Image
            src={companionImage}
            alt={companionName}
            fill
            className="object-contain pointer-events-none"
            style={{
              filter: `drop-shadow(0 10px 40px ${currentAura.color}CC) drop-shadow(0 0 25px ${currentAura.glow}AA)`,
            }}
            priority
          />
        </div>
      </motion.div>

      {/* PARTÍCULAS FLOTANTES DE ENERGÍA */}
      {(isSpeaking || emotion === 'excited') && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: currentAura.glow,
                boxShadow: `0 0 12px ${currentAura.glow}`,
                left: '50%',
                top: '50%'
              }}
              initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                x: [(Math.random() - 0.5) * 120],
                y: [-30 - Math.random() * 70],
                opacity: [0, 0.9, 0]
              }}
              transition={{
                duration: 1.5 + Math.random() * 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeOut'
              }}
            />
          ))}
        </>
      )}

      {/* INDICADOR DE ESTADO */}
      <motion.div
        className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
          isSpeaking ? 'bg-green-400' :
          isListening ? 'bg-red-400' :
          'bg-amber-400'
        }`}
        style={{
          boxShadow: isSpeaking 
            ? '0 0 15px rgba(74, 222, 128, 0.9)' 
            : isListening 
            ? '0 0 15px rgba(248, 113, 113, 0.9)' 
            : '0 0 10px rgba(251, 191, 36, 0.7)'
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}
