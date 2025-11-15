
/**
 * Servicio de Text-to-Speech usando Abacus AI
 * Voces profesionales, expresivas y emocionales para cada companion
 */

export interface VoiceConfig {
  voiceId: string
  name: string
  personality: string
  emotionalRange: 'high' | 'medium' | 'low'
}

// Configuración de voces únicas para cada personaje usando Abacus AI
// Voces disponibles en OpenAI TTS:
// - alloy: neutral, versátil
// - echo: masculino, cálido
// - fable: masculino, juguetón, narrativo
// - onyx: masculino, profundo, sabio
// - nova: femenino, suave, empático
// - shimmer: femenino, brillante, energético

export const COMPANION_VOICES: Record<string, VoiceConfig> = {
  // Ken - Pastor Alemán guardián (voz masculina profunda y protectora)
  ken: {
    voiceId: 'onyx', // Voz masculina profunda y protectora (mejor para guardián)
    name: 'Ken Guardian Voice',
    personality: 'protective, deep, loyal, commanding',
    emotionalRange: 'high'
  },
  'ken-guardian': {
    voiceId: 'onyx',
    name: 'Ken Guardian Voice',
    personality: 'protective, deep, loyal, commanding',
    emotionalRange: 'high'
  },
  
  // Aurora (Ada) - Hada de luz (voz femenina etérea y dulce)
  ada: {
    voiceId: 'nova', // Voz suave, empática y dulce
    name: 'Aurora Fairy Voice',
    personality: 'ethereal, sweet, magical, gentle',
    emotionalRange: 'high'
  },
  
  // Lumi - Luciérnaga energética (voz alegre y chispeante)
  lumi: {
    voiceId: 'shimmer', // Voz brillante y energética (PERFECTA para Lumi)
    name: 'Lumi Firefly Voice',
    personality: 'energetic, bright, playful, joyful',
    emotionalRange: 'high'
  },
  'lumi-light': {
    voiceId: 'shimmer',
    name: 'Lumi Firefly Voice',
    personality: 'energetic, bright, playful, joyful',
    emotionalRange: 'high'
  },
  
  // Nimbo - Nube tranquila (voz serena y calmada)
  nimbo: {
    voiceId: 'alloy', // Voz neutral, calmada y maternal
    name: 'Nimbo Cloud Voice',
    personality: 'calm, maternal, soothing, peaceful',
    emotionalRange: 'medium'
  },
  'nimbo-cloud': {
    voiceId: 'alloy',
    name: 'Nimbo Cloud Voice',
    personality: 'calm, maternal, soothing, peaceful',
    emotionalRange: 'medium'
  },
  
  // Fabel - Zorro del bosque (voz juguetona y narrativa)
  fabel: {
    voiceId: 'fable', // Voz narrativa, cálida y juguetona (PERFECTA para zorro)
    name: 'Fabel Fox Voice',
    personality: 'playful, natural, curious, storyteller',
    emotionalRange: 'high'
  },
  'fabel-animal': {
    voiceId: 'fable',
    name: 'Fabel Fox Voice',
    personality: 'playful, natural, curious, storyteller',
    emotionalRange: 'high'
  },
  
  // Sprig - Espíritu vegetal (voz terrenal y sabia)
  sprig: {
    voiceId: 'nova', // Voz suave y terrenal (más femenina para espíritu de naturaleza)
    name: 'Sprig Plant Voice',
    personality: 'grounded, wise, patient, nurturing',
    emotionalRange: 'medium'
  },
  'sprig-plant': {
    voiceId: 'nova',
    name: 'Sprig Plant Voice',
    personality: 'grounded, wise, patient, nurturing',
    emotionalRange: 'medium'
  },
  
  // Hada - Hada clásica (voz mágica y encantadora)
  hada: {
    voiceId: 'shimmer', // Voz brillante y mágica (más etérea que Nova)
    name: 'Fairy Magic Voice',
    personality: 'magical, enchanting, gentle, mystical',
    emotionalRange: 'high'
  },
  'hada-fairy': {
    voiceId: 'shimmer',
    name: 'Fairy Magic Voice',
    personality: 'magical, enchanting, gentle, mystical',
    emotionalRange: 'high'
  },
  
  // Elfo - Elfo sabio (voz masculina profunda y antigua)
  elfo: {
    voiceId: 'echo', // Voz masculina cálida y sabia (mejor que onyx para elfo)
    name: 'Elf Wise Voice',
    personality: 'wise, ancient, calm, knowledgeable',
    emotionalRange: 'medium'
  },
  'elfo-elf': {
    voiceId: 'echo',
    name: 'Elf Wise Voice',
    personality: 'wise, ancient, calm, knowledgeable',
    emotionalRange: 'medium'
  },
  
  // Draguito - Dragón pequeño (voz enérgica y valiente)
  draguito: {
    voiceId: 'fable', // Voz energética y aventurera (perfecta para dragón)
    name: 'Dragon Bold Voice',
    personality: 'bold, energetic, brave, adventurous',
    emotionalRange: 'high'
  },
  'draguito-dragon': {
    voiceId: 'fable',
    name: 'Dragon Bold Voice',
    personality: 'bold, energetic, brave, adventurous',
    emotionalRange: 'high'
  },
  
  // Unicornito - Unicornio mágico (voz dulce y esperanzadora)
  unicornito: {
    voiceId: 'nova', // Voz dulce, empática y esperanzadora
    name: 'Unicorn Hope Voice',
    personality: 'hopeful, sweet, magical, dreamy',
    emotionalRange: 'high'
  },
  'unicornito-unicorn': {
    voiceId: 'nova',
    name: 'Unicorn Hope Voice',
    personality: 'hopeful, sweet, magical, dreamy',
    emotionalRange: 'high'
  },
  
  // Human - Persona empática (voz humana auténtica)
  human: {
    voiceId: 'alloy', // Voz neutral, auténtica y versátil
    name: 'Human Empathy Voice',
    personality: 'empathetic, authentic, warm, relatable',
    emotionalRange: 'high'
  },
  'human-warm': {
    voiceId: 'alloy',
    name: 'Human Empathy Voice',
    personality: 'empathetic, authentic, warm, relatable',
    emotionalRange: 'high'
  }
}

export type EmotionType = 'happy' | 'sad' | 'excited' | 'calm' | 'anxious' | 'protective' | 'warm' | 'energetic'

/**
 * Genera audio usando OpenAI TTS a través de Abacus AI
 * @param text Texto limpio (sin emojis)
 * @param companionType Tipo de companion
 * @param emotion Emoción detectada para ajustar expresividad
 */
export async function generateVoiceWithAbacus(
  text: string,
  companionType: string,
  emotion: EmotionType = 'calm'
): Promise<{
  success: boolean
  audioBuffer?: ArrayBuffer
  error?: string
}> {
  try {
    const voiceConfig = COMPANION_VOICES[companionType.toLowerCase()] || COMPANION_VOICES.ada
    
    console.log(`🎭 Generando voz para ${companionType} con emoción: ${emotion}`)
    console.log(`🎤 Usando voz OpenAI: ${voiceConfig.voiceId}`)
    
    // Ajustar velocidad según emoción
    const voiceSettings = getEmotionalVoiceSettings(emotion, voiceConfig)
    
    // Usar API de Abacus para generación de voz
    const response = await fetch('https://apps.abacus.ai/api/v0/generateSpeech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        text: text,
        voice: voiceConfig.voiceId,
        speed: voiceSettings.speed,
        model: 'tts-1-hd' // Modelo de alta calidad
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error de OpenAI TTS:', response.status, errorText)
      return {
        success: false,
        error: `Error ${response.status}: ${errorText}`
      }
    }

    // OpenAI devuelve el audio directamente como MP3
    const audioBuffer = await response.arrayBuffer()
    
    console.log(`✅ Voz OpenAI generada exitosamente (${audioBuffer.byteLength} bytes)`)
    
    return {
      success: true,
      audioBuffer
    }
  } catch (error) {
    console.error('❌ Error generando voz con OpenAI:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Ajusta configuración de voz según emoción
 * Ajustes MUY expresivos para voces naturales y mágicas
 */
function getEmotionalVoiceSettings(
  emotion: EmotionType,
  voiceConfig: VoiceConfig
): {
  speed: number
} {
  // Velocidades base optimizadas por rango emocional
  // High: Personajes muy expresivos y enérgicos
  // Medium: Personajes moderados y equilibrados
  // Low: Personajes calmados y contemplativos
  const baseSpeed = voiceConfig.emotionalRange === 'high' ? 1.0 : 
                    voiceConfig.emotionalRange === 'medium' ? 0.95 : 0.90

  switch (emotion) {
    case 'excited':
      return {
        speed: Math.min(1.4, baseSpeed * 1.25) // ¡MUY rápido, emoción desbordante!
      }
    
    case 'happy':
      return {
        speed: Math.min(1.25, baseSpeed * 1.15) // Alegría contagiosa y notoria
      }
    
    case 'energetic':
      return {
        speed: Math.min(1.35, baseSpeed * 1.20) // Energía vibrante y dinámica
      }
    
    case 'sad':
      return {
        speed: Math.max(0.70, baseSpeed * 0.78) // Muy pausado, profunda melancolía
      }
    
    case 'anxious':
      return {
        speed: Math.min(1.20, baseSpeed * 1.12) // Apresurado, nervioso, inquieto
      }
    
    case 'protective':
      return {
        speed: Math.max(0.85, baseSpeed * 0.88) // Firme, seguro, tranquilizador
      }
    
    case 'warm':
      return {
        speed: baseSpeed * 0.92 // Cálido, acogedor, reconfortante
      }
    
    case 'calm':
    default:
      return {
        speed: baseSpeed * 0.98 // Velocidad natural y serena
      }
  }
}

/**
 * Verifica si el servicio de Abacus TTS está disponible
 */
export async function checkAbacusTTSAvailability(): Promise<boolean> {
  try {
    // Verificar que existe la API key
    if (!process.env.ABACUSAI_API_KEY) {
      console.error('❌ ABACUSAI_API_KEY no configurada')
      return false
    }
    
    return true
  } catch (error) {
    console.error('❌ Error verificando disponibilidad de Abacus TTS:', error)
    return false
  }
}
