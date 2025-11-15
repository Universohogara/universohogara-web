
/**
 * Gestor del estado de voz mágica para el sistema narrativo de Hogara
 */

export type VoiceState = 'basic' | 'awakening' | 'awakened'

export interface VoiceStatus {
  state: VoiceState
  hasOwnApiKey: boolean
  minutesUsed: number
  minutesLimit: number
  isPremium: boolean
  canUseRealisticVoice: boolean
}

/**
 * Tipos para los mensajes narrativos
 */
export interface BasicNarrative {
  title: string
  description: string
  ctaText: string
  ctaAction: string
}

export interface AwakeningNarrative {
  title: string
  description: string
  ctaText: string
  ctaAction: string
  note: string
}

export interface AwakenedNarrative {
  title: string
  message: string
  icon: string
}

/**
 * Mensajes narrativos para cada estado de voz
 */
export const VOICE_NARRATIVES = {
  // Estado 1: Voz básica/terrenal
  basic: {
    title: '🩶 Voz Terrenal',
    description: 'Tu compañero usa su voz terrenal, suave pero inestable. A veces su magia se distorsiona un poco cuando habla demasiado seguido…',
    ctaText: '✨ Despertar su voz mágica',
    ctaAction: 'show_awakening'
  } as BasicNarrative,
  
  // Estado 2: Explicación del portal mágico
  awakening: {
    title: '💫 Despertar la Voz Mágica',
    description: 'Cada compañero tiene una voz única en el Reino de las Voces Eternas. Para despertar la suya, debes abrirle un portal mágico. Ese portal se conecta a la fuente de las voces, donde cada usuario puede crear y guardar su propia voz.',
    ctaText: '🔗 Abrir portal mágico',
    ctaAction: 'open_portal',
    note: 'Este portal te llevará a configurar tu conexión personal con el Reino de las Voces Eternas (ElevenLabs). Una vez conectado, tu compañero hablará con su voz verdadera, sin límites.'
  } as AwakeningNarrative,
  
  // Estado 3: Voz despertada
  awakened: {
    title: '🌟 Voz Despertada',
    message: 'Has despertado la voz verdadera de tu compañero. Desde ahora, te hablará con su tono original, inconfundible y lleno de magia.',
    icon: '✨'
  } as AwakenedNarrative
}

/**
 * Mensajes personalizados para animales (como Ken)
 */
export const ANIMAL_VOICE_NARRATIVES = {
  ken: {
    basic: {
      description: 'Ken usa su ladrido terrenal, pero a veces se escucha distorsionado cuando ladra mucho…'
    },
    awakened: {
      message: 'Ken ha recuperado su ladrido original del Reino de las Voces Eternas. Ahora podrás escuchar su voz verdadera, llena de lealtad y magia.'
    }
  },
  draguito: {
    basic: {
      description: 'Tu pequeño dragón usa su rugido terrenal, pero a veces se escucha como un chillido cuando ruge demasiado…'
    },
    awakened: {
      message: 'Tu dragón ha recuperado su rugido original del Reino de las Voces Eternas. Ahora sus gruñidos y ronroneos suenan mágicos y auténticos.'
    }
  },
  fabel: {
    basic: {
      description: 'Fabel usa sus sonidos terrenales, pero a veces se distorsionan sus maullidos y chillidos mágicos…'
    },
    awakened: {
      message: 'Fabel ha recuperado sus sonidos originales del Reino de las Voces Eternas. Ahora sus maullidos, chillidos y ronroneos son perfectamente expresivos.'
    }
  },
  unicornito: {
    basic: {
      description: 'Tu unicornio usa su relincho terrenal, pero a veces suena desafinado cuando intenta comunicarse…'
    },
    awakened: {
      message: 'Tu unicornio ha recuperado su relincho original del Reino de las Voces Eternas. Ahora cada sonido que emite brilla con esperanza y magia.'
    }
  }
}

/**
 * Determina el estado de voz basado en la configuración del usuario
 */
export function determineVoiceState(status: VoiceStatus): VoiceState {
  // Si tiene su propia API key, está despertada
  if (status.hasOwnApiKey) {
    return 'awakened'
  }
  
  // Si no es premium, está en básico
  if (!status.isPremium) {
    return 'basic'
  }
  
  // Si es premium pero no tiene minutos, está en básico
  if (status.minutesUsed >= status.minutesLimit) {
    return 'basic'
  }
  
  // Si es premium y tiene minutos, puede usar voz compartida (no mostrar narrativa)
  return 'awakened'
}

/**
 * Obtiene el mensaje narrativo apropiado según el tipo de companion
 */
export function getVoiceNarrative(
  state: VoiceState,
  companionType: string
): BasicNarrative | AwakeningNarrative | AwakenedNarrative {
  const narrative = VOICE_NARRATIVES[state]
  
  // Personalizar para animales
  if (state === 'basic') {
    const animalNarrative = ANIMAL_VOICE_NARRATIVES[companionType as keyof typeof ANIMAL_VOICE_NARRATIVES]
    if (animalNarrative?.basic) {
      return {
        ...narrative,
        description: animalNarrative.basic.description
      } as BasicNarrative
    }
  }
  
  if (state === 'awakened') {
    const animalNarrative = ANIMAL_VOICE_NARRATIVES[companionType as keyof typeof ANIMAL_VOICE_NARRATIVES]
    if (animalNarrative?.awakened) {
      return {
        ...narrative,
        message: animalNarrative.awakened.message
      } as AwakenedNarrative
    }
  }
  
  return narrative
}
