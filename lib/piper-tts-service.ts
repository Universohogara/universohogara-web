
/**
 * 🎙️ Servicio de Piper TTS - Voces Naturales Femeninas
 * 
 * Piper TTS ofrece voces más naturales y expresivas que Web Speech API
 * Especialmente para personajes femeninos que necesitan sonar claramente como mujeres
 */

export interface PiperVoiceModel {
  name: string;
  language: string;
  gender: 'female' | 'male';
  quality: 'low' | 'medium' | 'high';
  description: string;
}

/**
 * Modelos de voz femenina de alta calidad en español
 * 
 * FUENTE: https://github.com/rhasspy/piper
 * Descargamos los mejores modelos de voz femenina en español
 */
export const PIPER_FEMALE_VOICES: Record<string, PiperVoiceModel> = {
  // Voz femenina española - Clara y expresiva
  'es_ES-sharvard-medium': {
    name: 'Sharvard',
    language: 'es-ES',
    gender: 'female',
    quality: 'medium',
    description: 'Voz femenina española clara y natural'
  },
  
  // Voz femenina mexicana - Cálida y dulce
  'es_MX-claude-high': {
    name: 'Claude',
    language: 'es-MX',
    gender: 'female',
    quality: 'high',
    description: 'Voz femenina mexicana cálida y expresiva'
  }
};

/**
 * Mapeo de personajes femeninos a modelos de voz Piper
 */
export const CHARACTER_VOICE_MAP: Record<string, string> = {
  'hada': 'es_ES-sharvard-medium', // Ada - voz clara y mágica
  'lumi': 'es_MX-claude-high',     // Luna - voz cálida y maternal
  'nimbo': 'es_ES-sharvard-medium', // Coral - voz misteriosa
  'human': 'es_MX-claude-high'      // Aurora - voz joven y optimista
};

/**
 * Generar audio usando Piper TTS
 */
export async function generatePiperAudio(
  text: string, 
  characterType: string,
  emotion?: string
): Promise<Blob> {
  // Obtener modelo de voz para el personaje
  const voiceModel = CHARACTER_VOICE_MAP[characterType] || 'es_ES-sharvard-medium';
  
  // Llamar al API de Piper TTS en el servidor
  const response = await fetch('/api/tts/piper', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      voiceModel,
      characterType,
      emotion
    })
  });
  
  if (!response.ok) {
    throw new Error('Error generando audio con Piper TTS');
  }
  
  return await response.blob();
}

/**
 * Reproducir audio de Piper TTS
 */
export async function playPiperAudio(
  text: string,
  characterType: string,
  emotion?: string
): Promise<void> {
  try {
    // Generar audio
    const audioBlob = await generatePiperAudio(text, characterType, emotion);
    
    // Crear URL para reproducir
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Crear elemento de audio
    const audio = new Audio(audioUrl);
    
    // Reproducir
    await audio.play();
    
    // Limpiar URL cuando termine
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
    
  } catch (error) {
    console.error('Error reproduciendo audio Piper:', error);
    throw error;
  }
}

/**
 * Verificar si un personaje usa Piper TTS
 */
export function usesPiperTTS(characterType: string): boolean {
  return characterType in CHARACTER_VOICE_MAP;
}
