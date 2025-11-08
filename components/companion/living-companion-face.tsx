
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

interface LivingCompanionFaceProps {
  companionType: string
  companionName: string
  emotion?: 'neutral' | 'happy' | 'sad' | 'excited' | 'thinking' | 'sleeping' | 'anxious' | 'angry'
  isListening?: boolean
  isSpeaking?: boolean
  audioAnalyser?: AnalyserNode | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function LivingCompanionFace({
  companionType,
  companionName,
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  audioAnalyser = null,
  size = 'xl',
  className = ''
}: LivingCompanionFaceProps) {
  const [isBlinking, setIsBlinking] = useState(false)
  const [mouthOpenness, setMouthOpenness] = useState(0)
  const [headTilt, setHeadTilt] = useState(0)
  const [eyeMovement, setEyeMovement] = useState({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
    xl: 'w-80 h-80'
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

  // PESTAÑEO AUTOMÁTICO REALISTA
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150) // Duración del pestañeo
    }

    // Pestañear cada 3-6 segundos (aleatorio para parecer más natural)
    const scheduleNextBlink = () => {
      const delay = 3000 + Math.random() * 3000
      return setTimeout(blink, delay)
    }

    let blinkTimeout = scheduleNextBlink()

    // Después de cada pestañeo, programar el siguiente
    const blinkInterval = setInterval(() => {
      clearTimeout(blinkTimeout)
      blinkTimeout = scheduleNextBlink()
    }, 6000)

    return () => {
      clearTimeout(blinkTimeout)
      clearInterval(blinkInterval)
    }
  }, [])

  // SINCRONIZACIÓN LABIAL CON AUDIO TTS
  useEffect(() => {
    if (!isSpeaking || !audioAnalyser) {
      setMouthOpenness(0)
      return
    }

    const bufferLength = audioAnalyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const updateMouth = () => {
      audioAnalyser.getByteFrequencyData(dataArray)
      
      // Analizar frecuencias de voz humana (200-3000 Hz aproximadamente)
      const start = Math.floor(bufferLength * 0.1)
      const end = Math.floor(bufferLength * 0.5)
      let sum = 0
      for (let i = start; i < end; i++) {
        sum += dataArray[i]
      }
      const average = sum / (end - start)
      
      // Normalizar y aplicar suavizado
      const normalized = Math.min(average / 120, 1)
      setMouthOpenness(prev => prev * 0.7 + normalized * 0.3) // Suavizado
      
      animationFrameRef.current = requestAnimationFrame(updateMouth)
    }

    updateMouth()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isSpeaking, audioAnalyser])

  // MOVIMIENTO DE CABEZA SEGÚN EMOCIÓN
  useEffect(() => {
    const headMovements = {
      neutral: { tilt: 0, speed: 4000 },
      happy: { tilt: 5, speed: 2000 },
      sad: { tilt: -8, speed: 6000 },
      excited: { tilt: 10, speed: 1000 },
      thinking: { tilt: 15, speed: 3000 },
      anxious: { tilt: -5, speed: 1500 },
      angry: { tilt: -10, speed: 800 },
      sleeping: { tilt: 20, speed: 8000 }
    }

    const movement = headMovements[emotion]
    
    const interval = setInterval(() => {
      setHeadTilt(prev => {
        const target = movement.tilt + (Math.random() - 0.5) * 3
        return prev * 0.8 + target * 0.2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [emotion])

  // MOVIMIENTO SUTIL DE OJOS
  useEffect(() => {
    if (isListening) {
      // Mirar hacia donde "escucha"
      const interval = setInterval(() => {
        setEyeMovement({
          x: (Math.random() - 0.5) * 15,
          y: (Math.random() - 0.5) * 10
        })
      }, 800)
      return () => clearInterval(interval)
    } else {
      // Movimiento aleatorio sutil
      const interval = setInterval(() => {
        setEyeMovement({
          x: (Math.random() - 0.5) * 5,
          y: (Math.random() - 0.5) * 3
        })
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isListening])

  // COLORES DE AURA SEGÚN EMOCIÓN
  const emotionGlow = {
    neutral: '#D4AF37',
    happy: '#FFD700',
    sad: '#6B8EC6',
    excited: '#FF6B9D',
    thinking: '#9B59B6',
    anxious: '#E74C3C',
    angry: '#C0392B',
    sleeping: '#95A5A6'
  }

  const currentGlow = emotionGlow[emotion]

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* AURA EMOCIONAL - SIN BORDES NI FONDOS SÓLIDOS */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl -z-10 opacity-40"
        animate={{
          scale: isSpeaking ? [1, 1.4, 1] : isListening ? [1, 1.3, 1] : [1, 1.15, 1],
          opacity: isSpeaking ? [0.5, 0.8, 0.5] : isListening ? [0.4, 0.7, 0.4] : [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: isSpeaking ? 0.6 : isListening ? 1 : 2.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{ backgroundColor: currentGlow }}
      />

      {/* ANILLOS DE PULSO AL HABLAR */}
      {isSpeaking && (
        <>
          {[0, 0.3, 0.6].map((delay) => (
            <motion.div
              key={delay}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
                delay
              }}
              className="absolute inset-0 rounded-full border-4 pointer-events-none"
              style={{ borderColor: currentGlow }}
            />
          ))}
        </>
      )}

      {/* ONDAS AL ESCUCHAR */}
      {isListening && (
        <>
          {[0, 0.25, 0.5, 0.75].map((delay) => (
            <motion.div
              key={delay}
              initial={{ scale: 0.95, opacity: 0.7 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay
              }}
              className="absolute inset-0 rounded-full border-[5px] pointer-events-none"
              style={{
                borderColor: '#EF4444',
                boxShadow: `0 0 20px rgba(239, 68, 68, 0.6)`
              }}
            />
          ))}
        </>
      )}

      {/* ROSTRO PRINCIPAL - SOLO SILUETA, SIN CONTENEDORES */}
      <motion.div
        className="relative w-full h-full"
        animate={{
          rotate: headTilt,
          y: isSpeaking ? [0, -8, 0] : isListening ? [0, -5, 0] : [0, -3, 0],
          scale: isSpeaking ? [1, 1.05, 1] : isListening ? [1, 1.03, 1] : [1, 1.02, 1]
        }}
        transition={{
          rotate: { duration: 0.8, ease: 'easeInOut' },
          y: { duration: isSpeaking ? 0.8 : isListening ? 1.2 : 2.5, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: isSpeaking ? 0.8 : isListening ? 1.2 : 2.5, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        {/* IMAGEN DEL COMPANION - TRANSPARENTE */}
        <div className="relative w-full h-full">
          <Image
            src={companionImage}
            alt={companionName}
            fill
            className="object-contain drop-shadow-2xl pointer-events-none"
            style={{ 
              filter: `drop-shadow(0 10px 25px ${currentGlow})`,
              transform: `translate(${eyeMovement.x}px, ${eyeMovement.y}px)`
            }}
            priority
          />
        </div>

        {/* OJOS - PESTAÑEO REALISTA */}
        <AnimatePresence>
          {isBlinking && (
            <motion.div
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0.1 }}
              exit={{ scaleY: 1 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              className="absolute top-[35%] left-[30%] right-[30%] h-[8%] rounded-full bg-gradient-to-b from-gray-800/80 to-gray-900/80 blur-sm"
            />
          )}
        </AnimatePresence>

        {/* BOCA - SINCRONIZACIÓN LABIAL */}
        {isSpeaking && mouthOpenness > 0.1 && (
          <motion.div
            animate={{
              scaleY: 1 + mouthOpenness * 1.5,
              scaleX: 1 + mouthOpenness * 0.6
            }}
            transition={{
              duration: 0.08,
              ease: 'easeOut'
            }}
            className="absolute bottom-[32%] left-1/2 -translate-x-1/2 w-[28%] h-[12%] rounded-full"
            style={{
              background: `radial-gradient(ellipse at center, rgba(240, 100, 140, ${0.7 + mouthOpenness * 0.3}) 0%, rgba(200, 50, 90, ${0.5 + mouthOpenness * 0.4}) 100%)`,
              filter: 'blur(3px)',
              transformOrigin: 'center center'
            }}
          />
        )}

        {/* PARTÍCULAS EMOCIONALES AL HABLAR */}
        {isSpeaking && (
          <>
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                animate={{
                  scale: [0, 2, 0],
                  x: [(Math.random() - 0.5) * 100],
                  y: [-40 - Math.random() * 60],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.12,
                  ease: 'easeOut'
                }}
                className="absolute bottom-[35%] left-1/2 w-3 h-3 rounded-full"
                style={{
                  backgroundColor: currentGlow,
                  boxShadow: `0 0 15px ${currentGlow}`
                }}
              />
            ))}
          </>
        )}

        {/* PARTÍCULAS AL ESCUCHAR */}
        {isListening && (
          <>
            {[...Array(10)].map((_, i) => {
              const angle = (i * 360) / 10
              const distance = 65
              const x = Math.cos((angle * Math.PI) / 180) * distance
              const y = Math.sin((angle * Math.PI) / 180) * distance
              
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 0.9, 0]
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut'
                  }}
                  className="absolute w-2.5 h-2.5 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(${x}px, ${y}px)`,
                    backgroundColor: '#EF4444',
                    boxShadow: '0 0 12px rgba(239, 68, 68, 0.9)'
                  }}
                />
              )
            })}
          </>
        )}
      </motion.div>

      {/* INDICADOR DE ESTADO - PEQUEÑO Y FLOTANTE */}
      <motion.div
        animate={{
          scale: isSpeaking || isListening ? [1, 1.4, 1] : [1, 1.15, 1],
          opacity: isSpeaking || isListening ? [0.8, 1, 0.8] : [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 0.9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute top-3 right-3 w-3.5 h-3.5 rounded-full ${
          isSpeaking ? 'bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.9)]' :
          isListening ? 'bg-red-400 shadow-[0_0_15px_rgba(248,113,113,0.9)]' :
          'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.7)]'
        }`}
      />
    </div>
  )
}
