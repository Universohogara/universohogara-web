
/**
 * Configuraciones de animaciones emocionales para companions
 * Define cómo se ven las partículas, auras y efectos según cada emoción
 */

import { DetectedEmotion } from './emotion-detector'

export interface EmotionVisualConfig {
  auraColor: string
  glowIntensity: number
  particles: {
    type: 'stars' | 'hearts' | 'sparkles' | 'none'
    color: string
    count: number
    speed: number
  }
  pulseSpeed: number
  description: string
}

/**
 * Configuraciones visuales para cada emoción
 * Define automáticamente cómo se ve cada estado emocional
 */
export const EMOTION_VISUALS: Record<DetectedEmotion, EmotionVisualConfig> = {
  // 💛 Emocionado / Sorprendido
  excited: {
    auraColor: '#FFD700',
    glowIntensity: 0.8,
    particles: {
      type: 'stars',
      color: '#FFD700',
      count: 15,
      speed: 1.5
    },
    pulseSpeed: 1.5,
    description: 'Emocionado y brillante'
  },

  // 💖 Cariñoso / Tierno
  warm: {
    auraColor: '#FF69B4',
    glowIntensity: 0.6,
    particles: {
      type: 'hearts',
      color: '#FF69B4',
      count: 10,
      speed: 1.0
    },
    pulseSpeed: 1.2,
    description: 'Cariñoso y cálido'
  },

  // 😊 Feliz / Contento
  happy: {
    auraColor: '#FFD700',
    glowIntensity: 0.7,
    particles: {
      type: 'sparkles',
      color: '#FFD700',
      count: 12,
      speed: 1.3
    },
    pulseSpeed: 1.4,
    description: 'Feliz y radiante'
  },

  // ⚡ Energético / Activo
  energetic: {
    auraColor: '#00FF00',
    glowIntensity: 0.75,
    particles: {
      type: 'sparkles',
      color: '#00FF00',
      count: 18,
      speed: 2.0
    },
    pulseSpeed: 1.8,
    description: 'Lleno de energía'
  },

  // 😢 Triste / Melancólico
  sad: {
    auraColor: '#4169E1',
    glowIntensity: 0.3,
    particles: {
      type: 'none',
      color: '#4169E1',
      count: 0,
      speed: 0.5
    },
    pulseSpeed: 0.6,
    description: 'Triste y reflexivo'
  },

  // 😰 Ansioso / Preocupado
  anxious: {
    auraColor: '#FF4500',
    glowIntensity: 0.5,
    particles: {
      type: 'sparkles',
      color: '#FF4500',
      count: 8,
      speed: 1.8
    },
    pulseSpeed: 2.0,
    description: 'Ansioso y alerta'
  },

  // 🛡️ Protector / De apoyo
  protective: {
    auraColor: '#4B0082',
    glowIntensity: 0.65,
    particles: {
      type: 'sparkles',
      color: '#4B0082',
      count: 8,
      speed: 0.8
    },
    pulseSpeed: 1.0,
    description: 'Protector y firme'
  },

  // 😌 Tranquilo / Sereno
  calm: {
    auraColor: '#87CEEB',
    glowIntensity: 0.4,
    particles: {
      type: 'sparkles',
      color: '#87CEEB',
      count: 5,
      speed: 0.7
    },
    pulseSpeed: 0.8,
    description: 'Tranquilo y sereno'
  }
}

/**
 * Obtiene la configuración visual para una emoción
 */
export function getEmotionVisual(emotion: DetectedEmotion): EmotionVisualConfig {
  return EMOTION_VISUALS[emotion] || EMOTION_VISUALS.calm
}

/**
 * Obtiene una descripción legible de la emoción
 */
export function getEmotionDescription(emotion: DetectedEmotion): string {
  return EMOTION_VISUALS[emotion]?.description || 'En calma'
}

/**
 * Genera partículas emocionales según el tipo
 */
export function generateEmotionalParticles(
  type: 'stars' | 'hearts' | 'sparkles' | 'none',
  count: number
): Array<{ x: number; y: number; delay: number; scale: number }> {
  if (type === 'none') return []

  const particles = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * 100 - 50, // -50 a 50
      y: Math.random() * 100 - 50,
      delay: Math.random() * 2,
      scale: 0.5 + Math.random() * 0.5
    })
  }
  return particles
}

/**
 * Renderiza el icono correcto según el tipo de partícula
 */
export function getParticleIcon(type: 'stars' | 'hearts' | 'sparkles' | 'none'): string {
  switch (type) {
    case 'stars':
      return '⭐'
    case 'hearts':
      return '💖'
    case 'sparkles':
      return '✨'
    default:
      return ''
  }
}

// ====== FUNCIONES DE COMPATIBILIDAD CON VERSIONES ANTERIORES ======

/**
 * Obtiene la animación para una emoción (compatibilidad)
 * @deprecated Usar getEmotionVisual en su lugar
 */
export function getEmotionAnimation(emotion: DetectedEmotion) {
  const visual = getEmotionVisual(emotion)
  return {
    particleType: visual.particles.type,
    particleColor: visual.particles.color,
    particleCount: visual.particles.count,
    auraColor: visual.auraColor,
    glowIntensity: visual.glowIntensity,
    pulseSpeed: visual.pulseSpeed
  }
}

/**
 * Calcula el movimiento de una partícula (compatibilidad)
 * @deprecated Usar generateEmotionalParticles en su lugar
 */
export function calculateParticleMotion(index: number, total: number, speed: number) {
  const angle = (index / total) * Math.PI * 2
  const distance = 50 + Math.random() * 30
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    delay: index * 0.1,
    duration: 2 / speed
  }
}

/**
 * Obtiene la clase CSS para el aura de color (compatibilidad)
 * @deprecated Usar getEmotionVisual().auraColor en su lugar
 */
export function getAuraColorClass(emotion: DetectedEmotion): string {
  return getEmotionVisual(emotion).auraColor
}
