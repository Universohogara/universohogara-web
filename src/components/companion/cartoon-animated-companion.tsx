
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface CartoonAnimatedCompanionProps {
  companion: 'lumi' | 'koa' | 'nova'
  emotion: 'neutral' | 'happy' | 'sad' | 'excited' | 'thinking' | 'anxious' | 'angry'
  isSpeaking: boolean
  size?: number
}

export default function CartoonAnimatedCompanion({
  companion,
  emotion,
  isSpeaking,
  size = 200
}: CartoonAnimatedCompanionProps) {
  const [blinkState, setBlinkState] = useState(false)
  const [mouthState, setMouthState] = useState(0)

  // Parpadeo aleatorio
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true)
      setTimeout(() => setBlinkState(false), 150)
    }, Math.random() * 3000 + 2000)
    return () => clearInterval(blinkInterval)
  }, [])

  // Movimiento de boca al hablar
  useEffect(() => {
    if (isSpeaking) {
      const mouthInterval = setInterval(() => {
        setMouthState(Math.random())
      }, 100)
      return () => clearInterval(mouthInterval)
    } else {
      setMouthState(0)
    }
  }, [isSpeaking])

  // Colores según personaje
  const colors = {
    lumi: {
      primary: '#FFD700',
      secondary: '#FFA500',
      accent: '#FFEB3B',
      glow: 'rgba(255, 215, 0, 0.6)'
    },
    koa: {
      primary: '#98D8C8',
      secondary: '#6FB3A0',
      accent: '#B5E7D8',
      glow: 'rgba(152, 216, 200, 0.6)'
    },
    nova: {
      primary: '#E6B8FF',
      secondary: '#C084FC',
      accent: '#F0D9FF',
      glow: 'rgba(230, 184, 255, 0.6)'
    }
  }

  const color = colors[companion] || colors.lumi // Valor por defecto si no se encuentra el companion

  // Estados emocionales
  const getEyeShape = () => {
    switch (emotion) {
      case 'happy':
        return 'M 10 15 Q 15 10 20 15' // Ojos en forma de arco feliz
      case 'sad':
        return 'M 10 10 Q 15 15 20 10' // Ojos caídos
      case 'excited':
        return 'circle' // Ojos bien abiertos
      case 'anxious':
        return 'M 10 13 Q 15 10 20 13' // Ojos preocupados
      case 'angry':
        return 'M 10 12 Q 15 8 20 12' // Ojos enfadados
      default:
        return 'ellipse' // Ojos normales
    }
  }

  const getMouthShape = () => {
    if (isSpeaking) {
      return `M 35 ${55 + mouthState * 10} Q 50 ${65 + mouthState * 15} 65 ${55 + mouthState * 10}`
    }
    switch (emotion) {
      case 'happy':
        return 'M 35 55 Q 50 65 65 55'
      case 'sad':
        return 'M 35 60 Q 50 50 65 60'
      case 'excited':
        return 'M 35 50 Q 50 70 65 50'
      case 'anxious':
        return 'M 35 58 Q 50 56 65 58' // Boca preocupada (línea ondulada)
      case 'angry':
        return 'M 35 62 Q 50 58 65 62' // Boca enfadada
      default:
        return 'M 35 58 Q 50 60 65 58'
    }
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Aura de energía pulsante */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(circle, ${color.glow} 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />

      {/* Personaje SVG animado */}
      <motion.svg
        viewBox="0 0 100 100"
        className="relative z-10"
        animate={{
          y: [0, -5, 0],
          rotate: isSpeaking ? [-2, 2, -2] : 0,
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          rotate: {
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        {/* Cuerpo principal */}
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          fill={color.primary}
          stroke={color.secondary}
          strokeWidth="2"
          animate={{
            scale: isSpeaking ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
          }}
        />

        {/* Brillo en el cuerpo */}
        <ellipse
          cx="40"
          cy="40"
          rx="12"
          ry="8"
          fill={color.accent}
          opacity="0.4"
        />

        {/* Orejas/detalles superiores */}
        {companion === 'lumi' && (
          <>
            <motion.circle
              cx="30"
              cy="25"
              r="8"
              fill={color.secondary}
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ originX: '30px', originY: '25px' }}
            />
            <motion.circle
              cx="70"
              cy="25"
              r="8"
              fill={color.secondary}
              animate={{ rotate: [10, -10, 10] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ originX: '70px', originY: '25px' }}
            />
          </>
        )}

        {companion === 'koa' && (
          <>
            <motion.ellipse
              cx="25"
              cy="30"
              rx="6"
              ry="12"
              fill={color.secondary}
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <motion.ellipse
              cx="75"
              cy="30"
              rx="6"
              ry="12"
              fill={color.secondary}
              animate={{ rotate: [5, -5, 5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </>
        )}

        {companion === 'nova' && (
          <>
            <motion.path
              d="M 50 15 L 55 25 L 50 22 L 45 25 Z"
              fill={color.accent}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ originX: '50px', originY: '20px' }}
            />
          </>
        )}

        {/* Ojos */}
        <AnimatePresence>
          {!blinkState ? (
            <>
              {getEyeShape() === 'circle' ? (
                <>
                  <motion.circle
                    cx="40"
                    cy="45"
                    r="4"
                    fill="white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                  <circle cx="40" cy="45" r="2" fill="#333" />
                  <motion.circle
                    cx="60"
                    cy="45"
                    r="4"
                    fill="white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                  <circle cx="60" cy="45" r="2" fill="#333" />
                </>
              ) : getEyeShape() === 'ellipse' ? (
                <>
                  <motion.ellipse
                    cx="40"
                    cy="45"
                    rx="5"
                    ry="6"
                    fill="white"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }}
                  />
                  <ellipse cx="40" cy="45" rx="2" ry="3" fill="#333" />
                  <motion.ellipse
                    cx="60"
                    cy="45"
                    rx="5"
                    ry="6"
                    fill="white"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }}
                  />
                  <ellipse cx="60" cy="45" rx="2" ry="3" fill="#333" />
                </>
              ) : (
                <>
                  <motion.path
                    d={getEyeShape()}
                    stroke="#333"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                  />
                  <motion.path
                    d={getEyeShape().replace('10', '40')}
                    stroke="#333"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <motion.line
                x1="35"
                y1="45"
                x2="45"
                y2="45"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <motion.line
                x1="55"
                y1="45"
                x2="65"
                y2="45"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}
        </AnimatePresence>

        {/* Mejillas */}
        {(emotion === 'happy' || emotion === 'excited') && (
          <>
            <circle cx="28" cy="52" r="4" fill="#FF6B9D" opacity="0.4" />
            <circle cx="72" cy="52" r="4" fill="#FF6B9D" opacity="0.4" />
          </>
        )}

        {/* Lágrimas si está triste */}
        {emotion === 'sad' && (
          <>
            <motion.path
              d="M 38 50 Q 37 55 38 58"
              stroke="#6BB6FF"
              strokeWidth="2"
              fill="none"
              animate={{ pathLength: [0, 1], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="38"
              cy="58"
              r="1.5"
              fill="#6BB6FF"
              animate={{ y: [0, 10], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}

        {/* Boca */}
        <motion.path
          d={getMouthShape()}
          stroke={emotion === 'sad' ? '#666' : '#333'}
          strokeWidth="2"
          fill={isSpeaking || emotion === 'excited' ? 'rgba(0,0,0,0.1)' : 'none'}
          strokeLinecap="round"
          animate={{
            d: isSpeaking ? [getMouthShape(), 'M 35 50 Q 50 70 65 50', getMouthShape()] : getMouthShape(),
          }}
          transition={{
            duration: 0.2,
            repeat: isSpeaking ? Infinity : 0,
          }}
        />

        {/* Patitas/extremidades */}
        <motion.g
          animate={{
            rotate: isSpeaking ? [-5, 5, -5] : 0,
          }}
          transition={{
            duration: 0.4,
            repeat: Infinity,
          }}
          style={{ originX: '30px', originY: '70px' }}
        >
          <ellipse cx="30" cy="70" rx="8" ry="4" fill={color.secondary} />
          <circle cx="28" cy="74" r="3" fill={color.primary} />
          <circle cx="32" cy="74" r="3" fill={color.primary} />
        </motion.g>

        <motion.g
          animate={{
            rotate: isSpeaking ? [5, -5, 5] : 0,
          }}
          transition={{
            duration: 0.4,
            repeat: Infinity,
          }}
          style={{ originX: '70px', originY: '70px' }}
        >
          <ellipse cx="70" cy="70" rx="8" ry="4" fill={color.secondary} />
          <circle cx="68" cy="74" r="3" fill={color.primary} />
          <circle cx="72" cy="74" r="3" fill={color.primary} />
        </motion.g>

        {/* Bracitos */}
        <motion.ellipse
          cx="20"
          cy="50"
          rx="4"
          ry="10"
          fill={color.secondary}
          animate={{
            rotate: emotion === 'excited' ? [0, -20, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
          style={{ originX: '20px', originY: '50px' }}
        />
        <motion.ellipse
          cx="80"
          cy="50"
          rx="4"
          ry="10"
          fill={color.secondary}
          animate={{
            rotate: emotion === 'excited' ? [0, 20, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
          style={{ originX: '80px', originY: '50px' }}
        />
      </motion.svg>

      {/* Partículas de energía */}
      <AnimatePresence>
        {isSpeaking && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 4,
                  height: 4,
                  background: color.accent,
                  top: '50%',
                  left: '50%',
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 2 * Math.PI) / 5) * 50,
                  y: Math.sin((i * 2 * Math.PI) / 5) * 50,
                }}
                exit={{ scale: 0 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
