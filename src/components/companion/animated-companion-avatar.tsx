
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'

interface AnimatedCompanionAvatarProps {
  companionType: string
  companionName: string
  isListening: boolean
  isSpeaking: boolean
  audioAnalyser?: AnalyserNode | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  emotion?: string
}

export function AnimatedCompanionAvatar({
  companionType,
  companionName,
  isListening,
  isSpeaking,
  audioAnalyser,
  size = 'md',
  emotion = 'neutral'
}: AnimatedCompanionAvatarProps) {
  const controls = useAnimation()
  const mouthControls = useAnimation()
  const bodyControls = useAnimation()
  const [mouthOpenness, setMouthOpenness] = useState(0)
  const animationFrameRef = useRef<number>()
  
  const sizeClasses = {
    sm: 'w-16 h-16',
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

  // Análisis de audio en tiempo real para sincronización de labios
  useEffect(() => {
    if (!isSpeaking || !audioAnalyser) {
      setMouthOpenness(0)
      return
    }

    const bufferLength = audioAnalyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const updateMouth = () => {
      audioAnalyser.getByteFrequencyData(dataArray)
      
      // Calcular el promedio de las frecuencias medias (voz humana)
      const start = Math.floor(bufferLength * 0.1)
      const end = Math.floor(bufferLength * 0.4)
      let sum = 0
      for (let i = start; i < end; i++) {
        sum += dataArray[i]
      }
      const average = sum / (end - start)
      
      // Normalizar entre 0 y 1
      const normalized = Math.min(average / 150, 1)
      setMouthOpenness(normalized)
      
      animationFrameRef.current = requestAnimationFrame(updateMouth)
    }

    updateMouth()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isSpeaking, audioAnalyser])

  // Animación de respiración idle - EXAGERADAMENTE VISIBLE
  useEffect(() => {
    if (!isSpeaking && !isListening) {
      bodyControls.start({
        scale: [1, 1.25, 1, 1.15, 1],
        y: [0, -20, 0, -10, 0],
        rotate: [0, 5, -5, 3, -3, 0],
        transition: {
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.3, 0.5, 0.7, 1]
        }
      })
    } else {
      bodyControls.stop()
    }
  }, [isSpeaking, isListening, bodyControls])

  // Animación de escucha - SUPER INTENSA Y EXPRESIVA
  useEffect(() => {
    if (isListening) {
      controls.start({
        scale: [1, 1.2, 1, 1.15, 1],
        rotate: [0, -8, 8, -6, 6, 0],
        transition: {
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      })
    } else {
      controls.stop()
      controls.set({ scale: 1, rotate: 0 })
    }
  }, [isListening, controls])

  // Animación de boca basada en audio - MUCHO MÁS VISIBLE Y EXAGERADA
  useEffect(() => {
    if (isSpeaking) {
      mouthControls.start({
        scaleY: 1 + (mouthOpenness * 0.8),
        scaleX: 1 + (mouthOpenness * 0.4),
        transition: {
          duration: 0.08,
          ease: 'easeOut'
        }
      })
    } else {
      mouthControls.set({ scaleY: 1, scaleX: 1 })
    }
  }, [isSpeaking, mouthOpenness, mouthControls])

  const getEmotionGlow = () => {
    const glowColors: { [key: string]: string } = {
      happy: '#FFD700',
      sad: '#6B8EC6',
      anxious: '#9B59B6',
      angry: '#E74C3C',
      calm: '#2ECC71',
      excited: '#F39C12',
      neutral: '#D4AF37'
    }
    return glowColors[emotion] || glowColors.neutral
  }

  return (
    <div className="relative">
      {/* Glow exterior animado - MUY VISIBLE */}
      <motion.div
        animate={{
          scale: isSpeaking ? [1, 1.4, 1] : isListening ? [1, 1.3, 1] : [1, 1.2, 1],
          opacity: isSpeaking ? [0.6, 0.9, 0.6] : isListening ? [0.5, 0.8, 0.5] : [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: isSpeaking ? 0.5 : isListening ? 0.8 : 1.8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute inset-0 rounded-full blur-3xl -z-10"
        style={{ backgroundColor: getEmotionGlow() }}
      />

      {/* Segundo glow para más profundidad */}
      <motion.div
        animate={{
          scale: isSpeaking ? [1, 1.2, 1] : isListening ? [1, 1.15, 1] : [1, 1.1, 1],
          opacity: isSpeaking ? [0.4, 0.7, 0.4] : isListening ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: isSpeaking ? 0.7 : isListening ? 1 : 2.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.3
        }}
        className="absolute inset-0 rounded-full blur-2xl -z-10"
        style={{ backgroundColor: getEmotionGlow() }}
      />

      {/* Anillos de pulso al hablar - MÁS VISIBLES */}
      {isSpeaking && (
        <>
          <motion.div
            initial={{ scale: 1, opacity: 0.9 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeOut'
            }}
            className="absolute inset-0 rounded-full border-4"
            style={{ borderColor: getEmotionGlow() }}
          />
          <motion.div
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.4
            }}
            className="absolute inset-0 rounded-full border-3"
            style={{ borderColor: getEmotionGlow() }}
          />
        </>
      )}

      {/* Avatar principal con animaciones de cuerpo - SOLO SILUETA SIN FONDO */}
      <motion.div
        animate={bodyControls}
        className={`relative ${sizeClasses[size]}`}
      >
        {/* Imagen del companion - FONDO TRANSPARENTE */}
        <motion.div
          animate={controls}
          className="relative w-full h-full"
        >
          <Image
            src={companionImage}
            alt={companionName}
            fill
            className="object-contain drop-shadow-2xl"
            style={{ filter: `drop-shadow(0 10px 20px ${getEmotionGlow()})` }}
            priority
          />
        </motion.div>

        {/* Overlay de boca animada - MUCHO MÁS GRANDE Y VISIBLE */}
        {isSpeaking && (
          <motion.div
            animate={mouthControls}
            className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-[35%] h-[18%] bg-gradient-to-b from-pink-400/80 to-pink-600/80 rounded-full shadow-lg"
            style={{
              transformOrigin: 'center center',
              filter: 'blur(2px)'
            }}
          />
        )}

        {/* Partículas al hablar - EXAGERADAMENTE VISIBLES Y ABUNDANTES */}
        {isSpeaking && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 2.5, 0],
                  x: [0, (Math.random() - 0.5) * 120],
                  y: [0, -60 - Math.random() * 80],
                  opacity: [1, 0.95, 0]
                }}
                transition={{
                  duration: 1.5 + Math.random() * 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeOut'
                }}
                className="absolute bottom-[30%] left-1/2 w-4 h-4 rounded-full shadow-2xl"
                style={{ 
                  backgroundColor: getEmotionGlow(),
                  boxShadow: `0 0 20px ${getEmotionGlow()}, 0 0 40px ${getEmotionGlow()}`
                }}
              />
            ))}
          </>
        )}

        {/* Ondas de sonido al escuchar - SUPER VISIBLES Y POTENTES */}
        {isListening && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0.9 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.35,
                  ease: 'easeOut'
                }}
                className="absolute inset-0 rounded-full border-[6px] border-red-500 shadow-2xl"
                style={{
                  boxShadow: `0 0 30px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.4)`
                }}
              />
            ))}
            {/* Partículas pulsantes al escuchar - MÁS GRANDES Y VISIBLES */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 360) / 12
              const x = Math.cos((angle * Math.PI) / 180) * 70
              const y = Math.sin((angle * Math.PI) / 180) * 70
              return (
                <motion.div
                  key={`particle-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.8, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.12,
                    ease: 'easeInOut'
                  }}
                  className="absolute w-3 h-3 rounded-full bg-red-400"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(${x}px, ${y}px)`,
                    boxShadow: '0 0 15px rgba(239, 68, 68, 1), 0 0 30px rgba(239, 68, 68, 0.6)'
                  }}
                />
              )
            })}
          </>
        )}

        {/* Indicador de estado - MÁS SUTIL SIN FONDO SÓLIDO */}
        <motion.div
          animate={{
            scale: isSpeaking || isListening ? [1, 1.3, 1] : [1, 1.1, 1],
            opacity: isSpeaking || isListening ? [0.8, 1, 0.8] : [0.6, 0.8, 0.6]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
            isSpeaking ? 'bg-green-400/80 shadow-[0_0_15px_rgba(74,222,128,0.8)]' :
            isListening ? 'bg-red-400/80 shadow-[0_0_15px_rgba(248,113,113,0.8)]' :
            'bg-gray-400/60 shadow-[0_0_10px_rgba(156,163,175,0.6)]'
          }`}
        />
      </motion.div>

      {/* Texto de estado flotante */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        <div className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
          isSpeaking ? 'bg-green-500 text-white' :
          isListening ? 'bg-red-500 text-white' :
          'bg-gray-100 text-gray-600'
        }`}>
          {isSpeaking ? '🗣️ Hablando' : isListening ? '👂 Escuchando' : '😊 Esperando'}
        </div>
      </motion.div>
    </div>
  )
}
