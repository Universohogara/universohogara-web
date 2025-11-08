
// Servicio para integración con Eleven Labs API
// Control de minutos y fallback a idiomas mágicos

import fs from 'fs'
import path from 'path'

interface ElevenLabsVoiceConfig {
  voice_id: string
  model_id: string
  stability: number
  similarity_boost: number
  style?: number
  use_speaker_boost?: boolean
}

// Mapeo de personajes a Voice IDs de Eleven Labs
// NOTA: Estos IDs deben ser voces específicas de tu cuenta de Eleven Labs
// Puedes obtenerlos desde https://api.elevenlabs.io/v1/voices
export const COMPANION_VOICES: Record<string, ElevenLabsVoiceConfig> = {
  ada: {
    voice_id: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Soft, sweet voice (hada)
    model_id: 'eleven_multilingual_v2',
    stability: 0.5,
    similarity_boost: 0.8,
    style: 0.3,
    use_speaker_boost: true
  },
  ken: {
    voice_id: '21m00Tcm4TlvDq8ikWAM', // Rachel - Calm, warm voice adaptada para Ken
    model_id: 'eleven_multilingual_v2',
    stability: 0.6,
    similarity_boost: 0.75,
    style: 0.2,
    use_speaker_boost: true
  },
  lumi: {
    voice_id: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Bright, cheerful
    model_id: 'eleven_multilingual_v2',
    stability: 0.4,
    similarity_boost: 0.85,
    style: 0.4,
    use_speaker_boost: true
  },
  nimbo: {
    voice_id: '21m00Tcm4TlvDq8ikWAM', // Rachel - Calm, maternal
    model_id: 'eleven_multilingual_v2',
    stability: 0.75,
    similarity_boost: 0.7,
    style: 0.1,
    use_speaker_boost: true
  },
  fabel: {
    voice_id: 'XB0fDUnXU5powFXDhCwa', // Charlotte - Warm, playful
    model_id: 'eleven_multilingual_v2',
    stability: 0.5,
    similarity_boost: 0.8,
    style: 0.25,
    use_speaker_boost: true
  },
  sprig: {
    voice_id: 'jsCqWAovK2LkecY7zXl4', // Freya - Natural, grounded
    model_id: 'eleven_multilingual_v2',
    stability: 0.65,
    similarity_boost: 0.75,
    style: 0.15,
    use_speaker_boost: true
  },
  hada: {
    voice_id: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Ethereal, magical
    model_id: 'eleven_multilingual_v2',
    stability: 0.45,
    similarity_boost: 0.85,
    style: 0.35,
    use_speaker_boost: true
  },
  elfo: {
    voice_id: 'pNInz6obpgDQGcFmaJgB', // Adam - Wise, deep (masculino)
    model_id: 'eleven_multilingual_v2',
    stability: 0.7,
    similarity_boost: 0.7,
    style: 0.1,
    use_speaker_boost: true
  },
  draguito: {
    voice_id: 'XB0fDUnXU5powFXDhCwa', // Charlotte - Energetic, bold
    model_id: 'eleven_multilingual_v2',
    stability: 0.5,
    similarity_boost: 0.8,
    style: 0.3,
    use_speaker_boost: true
  },
  unicornito: {
    voice_id: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Sweet, hopeful
    model_id: 'eleven_multilingual_v2',
    stability: 0.5,
    similarity_boost: 0.85,
    style: 0.3,
    use_speaker_boost: true
  },
  human: {
    voice_id: '21m00Tcm4TlvDq8ikWAM', // Rachel - Empathetic, authentic
    model_id: 'eleven_multilingual_v2',
    stability: 0.6,
    similarity_boost: 0.75,
    style: 0.2,
    use_speaker_boost: true
  }
}

// Idiomas mágicos para cada personaje (fallback cuando se acaban minutos)
export const MAGICAL_LANGUAGES: Record<string, string[]> = {
  ken: [
    'Woof woof! 🐕',
    'Arf arf! 🐾',
    'Grrrr... 💙',
    'Wuuf! ✨',
    'Bark bark! 🌙'
  ],
  ada: [
    '✨ Tinkle tinkle... 🌟',
    '💫 Shimmer shimmer... ✨',
    '🌙 Whiiiish... 💫',
    '✨ Sparkle sparkle... 🌟',
    '💖 Glimmer glimmer... ✨'
  ],
  lumi: [
    '✨ Buzz buzz! 🌟',
    '💫 Glow glow! ✨',
    '🌟 Shine shine! 💫',
    '✨ Twinkle twinkle! 🌙',
    '💛 Flash flash! ✨'
  ],
  nimbo: [
    '☁️ Whooosh... 💙',
    '💨 Swiiish... ☁️',
    '🌫️ Floooat... 💫',
    '☁️ Driiift... 💙',
    '💨 Breeeze... ☁️'
  ],
  fabel: [
    '🦊 Yip yip! 🌳',
    '🐾 Chirp chirp! 🍃',
    '🌿 Rustle rustle! 🦊',
    '🍂 Skip skip! 🐾',
    '🌳 Bounce bounce! 🦊'
  ],
  sprig: [
    '🌿 Whistle whistle... 🍃',
    '🌱 Click click... 🌿',
    '🍃 Rustle rustle... 🌱',
    '🌳 Creak creak... 🍂',
    '🌿 Snap snap... 🌱'
  ],
  hada: [
    '✨ Tinkle bell... 🧚‍♀️',
    '💫 Shimmer dust... ✨',
    '🌟 Sparkle magic... 💫',
    '✨ Chime chime... 🌙',
    '💖 Glitter glow... ✨'
  ],
  elfo: [
    '🌳 Hmmmmm... 🍃',
    '🌲 Whoooosh... 🌳',
    '🍂 Creeeak... 🌲',
    '🌿 Whisper whisper... 🍃',
    '🌳 Ruuuumble... 🍂'
  ],
  draguito: [
    '🔥 Roar roar! 🐉',
    '💨 Whoooosh! 🔥',
    '⚡ Graaawl! 🐉',
    '🔥 Snarl! ⚡',
    '🐉 RAWR! 🔥'
  ],
  unicornito: [
    '🦄 Neigh neigh... 💖',
    '✨ Whinny whinny... 🦄',
    '💫 Nickle nickle... ✨',
    '🌙 Snort snort... 🦄',
    '💖 Trot trot... ✨'
  ],
  human: [
    '💙 Hmm... 💭',
    '💫 Ah... 💙',
    '💭 Mhm... 💫',
    '💙 Oh... 💭',
    '💫 Yes... 💙'
  ]
}

// Mensaje cuando se agota la magia
export const MAGIC_DEPLETED_MESSAGE = 'Mi magia se ha agotado... ahora solo podré hablar en mi idioma secreto hasta la próxima luna 🌙✨'

// Leer API Key de forma segura (compartida de la app)
function getSharedElevenLabsApiKey(): string {
  try {
    const secretsPath = path.join('/home/ubuntu/.config/abacusai_auth_secrets.json')
    if (fs.existsSync(secretsPath)) {
      const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf-8'))
      return secrets['eleven labs']?.secrets?.api_key?.value || ''
    }
  } catch (error) {
    console.error('❌ Error leyendo API key de Eleven Labs:', error)
  }
  return process.env.ELEVENLABS_API_KEY || ''
}

// Obtener API key (prioriza la del usuario sobre la compartida)
function getElevenLabsApiKey(userApiKey?: string | null): string {
  // Si el usuario tiene su propia API key, usarla
  if (userApiKey) {
    return userApiKey
  }
  
  // Sino, usar la compartida de la app
  return getSharedElevenLabsApiKey()
}

interface VoiceGenerationResult {
  success: boolean
  audioBuffer?: ArrayBuffer
  error?: string
  charactersUsed?: number
  minutesUsed?: number
}

/**
 * Ajusta la configuración de voz según la emoción detectada
 */
function adjustVoiceForEmotion(
  baseConfig: ElevenLabsVoiceConfig,
  emotion?: string
): { stability: number; similarity_boost: number; style: number } {
  // Si no hay emoción, usar valores base
  if (!emotion) {
    return {
      stability: baseConfig.stability,
      similarity_boost: baseConfig.similarity_boost,
      style: baseConfig.style || 0
    }
  }

  // Ajustar parámetros según emoción
  switch (emotion) {
    case 'excited': // Emocionado/Alegre
      return {
        stability: Math.max(0.2, baseConfig.stability - 0.2), // Menos estable = más variación
        similarity_boost: baseConfig.similarity_boost,
        style: Math.min(1.0, (baseConfig.style || 0) + 0.3) // Más expresivo
      }
    
    case 'energetic': // Energético
      return {
        stability: Math.max(0.3, baseConfig.stability - 0.1),
        similarity_boost: Math.min(1.0, baseConfig.similarity_boost + 0.1),
        style: Math.min(1.0, (baseConfig.style || 0) + 0.2)
      }
    
    case 'warm': // Cariñoso/Cálido
      return {
        stability: Math.min(0.8, baseConfig.stability + 0.1), // Más estable
        similarity_boost: Math.min(1.0, baseConfig.similarity_boost + 0.1),
        style: Math.min(1.0, (baseConfig.style || 0) + 0.15)
      }
    
    case 'sad': // Triste
      return {
        stability: Math.min(0.9, baseConfig.stability + 0.2), // Muy estable = voz más suave
        similarity_boost: Math.max(0.5, baseConfig.similarity_boost - 0.1),
        style: Math.max(0, (baseConfig.style || 0) - 0.1) // Menos expresivo
      }
    
    case 'calm': // Calmado
    default:
      return {
        stability: baseConfig.stability,
        similarity_boost: baseConfig.similarity_boost,
        style: baseConfig.style || 0
      }
  }
}

/**
 * Genera audio usando Eleven Labs API
 * @param text Texto a convertir en voz (ya debe estar limpio, sin emojis)
 * @param companionType Tipo de companion (ken, ada, lumi, etc.)
 * @param userApiKey API key personal del usuario (opcional, usa BYOK si está presente)
 * @param emotion Emoción detectada para ajustar el tono (excited, warm, calm, sad, energetic)
 */
export async function generateVoiceWithElevenLabs(
  text: string,
  companionType: string,
  userApiKey?: string | null,
  emotion?: string
): Promise<VoiceGenerationResult> {
  const apiKey = getElevenLabsApiKey(userApiKey)
  
  if (!apiKey) {
    return {
      success: false,
      error: 'API key de Eleven Labs no configurada'
    }
  }

  const voiceConfig = COMPANION_VOICES[companionType.toLowerCase()] || COMPANION_VOICES.ada
  
  // Ajustar configuración de voz según emoción
  const emotionalSettings = adjustVoiceForEmotion(voiceConfig, emotion)
  
  console.log(`🎭 Generando voz con emoción: ${emotion || 'calm'}`)
  console.log(`🎚️ Settings: stability=${emotionalSettings.stability.toFixed(2)}, style=${emotionalSettings.style.toFixed(2)}`)
  
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voice_id}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: voiceConfig.model_id,
          voice_settings: {
            stability: emotionalSettings.stability,
            similarity_boost: emotionalSettings.similarity_boost,
            style: emotionalSettings.style,
            use_speaker_boost: voiceConfig.use_speaker_boost
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error de Eleven Labs API:', response.status, errorText)
      return {
        success: false,
        error: `Error ${response.status}: ${errorText}`
      }
    }

    const audioBuffer = await response.arrayBuffer()
    
    // Calcular minutos aproximados (basado en caracteres)
    // Eleven Labs cobra por caracteres, aproximadamente 1000 caracteres = ~1 minuto
    const charactersUsed = text.length
    const minutesUsed = Math.ceil(charactersUsed / 1000)

    console.log(`✅ Voz generada: ${charactersUsed} caracteres, ~${minutesUsed} min`)

    return {
      success: true,
      audioBuffer,
      charactersUsed,
      minutesUsed
    }
  } catch (error) {
    console.error('❌ Error generando voz con Eleven Labs:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Obtiene un mensaje aleatorio en el idioma mágico del personaje
 */
export function getMagicalLanguageMessage(companionType: string): string {
  const messages = MAGICAL_LANGUAGES[companionType.toLowerCase()] || MAGICAL_LANGUAGES.ada
  return messages[Math.floor(Math.random() * messages.length)]
}

/**
 * Verifica cuota disponible de Eleven Labs
 * @param userApiKey API key personal del usuario (opcional)
 */
export async function checkElevenLabsQuota(userApiKey?: string | null): Promise<{
  character_count: number
  character_limit: number
  can_use_api: boolean
}> {
  const apiKey = getElevenLabsApiKey(userApiKey)
  
  if (!apiKey) {
    return {
      character_count: 0,
      character_limit: 0,
      can_use_api: false
    }
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: {
        'xi-api-key': apiKey
      }
    })

    if (!response.ok) {
      console.error('❌ Error verificando cuota de Eleven Labs:', response.status)
      return {
        character_count: 0,
        character_limit: 0,
        can_use_api: false
      }
    }

    const data = await response.json()
    const subscription = data.subscription || {}
    
    return {
      character_count: subscription.character_count || 0,
      character_limit: subscription.character_limit || 0,
      can_use_api: subscription.character_count < subscription.character_limit
    }
  } catch (error) {
    console.error('❌ Error verificando cuota:', error)
    return {
      character_count: 0,
      character_limit: 0,
      can_use_api: false
    }
  }
}
