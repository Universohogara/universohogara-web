
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { DetectedEmotion } from '@/lib/emotion-detector'

interface EmotionParticlesProps {
  emotion: DetectedEmotion
  companionType: string
}

/**
 * AURA EMOCIONAL SUTIL Y DESENFOCADA
 * Ya no usa partículas, solo una luz suave que envuelve la silueta
 */
export default function EmotionParticles({ emotion }: EmotionParticlesProps) {
  // Colores de aura según emoción (intensidades aumentadas para mejor visibilidad)
  const auraColors: Record<DetectedEmotion, { color: string; intensity: number }> = {
    happy: { color: '#FFD700', intensity: 1.2 },      // Dorado alegre
    excited: { color: '#FF69B4', intensity: 1.4 },    // Rosa vibrante
    calm: { color: '#87CEEB', intensity: 0.9 },       // Azul sereno
    sad: { color: '#6495ED', intensity: 1.0 },        // Azul grisáceo
    anxious: { color: '#9370DB', intensity: 1.2 },    // Púrpura inquieto
    protective: { color: '#4682B4', intensity: 1.2 }, // Azul protector
    warm: { color: '#FFA500', intensity: 1.1 },       // Naranja cálido
    energetic: { color: '#FFEB3B', intensity: 1.3 }   // Amarillo energético
  }

  const { color, intensity } = auraColors[emotion] || { color: '#E0E0E0', intensity: 0.8 }

  // Velocidad de pulsación según emoción
  const pulseSpeed = 
    emotion === 'anxious' ? 0.8 :
    emotion === 'excited' ? 1.2 :
    emotion === 'calm' ? 3.5 :
    2.5

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {/* Capa 1: Aura interna brillante */}
      <motion.div
        className="absolute inset-0"
        style={{
          filter: `blur(25px)`,
          background: `radial-gradient(circle, ${color} 0%, transparent 55%)`,
          opacity: Math.min(intensity * 0.85, 1),
        }}
        animate={{
          scale: [0.85, 1.1, 0.85],
          opacity: [Math.min(intensity * 0.7, 1), Math.min(intensity * 0.95, 1), Math.min(intensity * 0.7, 1)],
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Capa 2: Aura media difuminada */}
      <motion.div
        className="absolute inset-0"
        style={{
          filter: `blur(45px)`,
          background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
          opacity: Math.min(intensity * 0.65, 1),
        }}
        animate={{
          scale: [0.95, 1.2, 0.95],
          opacity: [Math.min(intensity * 0.5, 1), Math.min(intensity * 0.75, 1), Math.min(intensity * 0.5, 1)],
        }}
        transition={{
          duration: pulseSpeed * 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2
        }}
      />

      {/* Capa 3: Aura externa sutil */}
      <motion.div
        className="absolute inset-0"
        style={{
          filter: `blur(70px)`,
          background: `radial-gradient(circle, ${color} 0%, transparent 75%)`,
          opacity: Math.min(intensity * 0.5, 1),
        }}
        animate={{
          scale: [1.05, 1.3, 1.05],
          opacity: [Math.min(intensity * 0.3, 1), Math.min(intensity * 0.55, 1), Math.min(intensity * 0.3, 1)],
        }}
        transition={{
          duration: pulseSpeed * 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.4
        }}
      />
    </div>
  )
}
