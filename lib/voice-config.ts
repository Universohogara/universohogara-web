
// Configuración de voces personalizadas para cada companion con expresividad emocional

export type EmotionType = 'happy' | 'calm' | 'sad' | 'excited' | 'angry' | 'neutral' | 'thoughtful';

export interface VoiceConfig {
  realName: string; // Nombre REAL del personaje (Ada, Luna, Aurora, etc.)
  pitch: number; // 0-2, donde 1 es normal
  rate: number; // 0.1-10, donde 1 es normal
  volume: number; // 0-1
  lang: string;
  emotion: string; // Emoción base del companion
  expressiveness: number; // 0-1, nivel de expresividad
  gender: 'female' | 'male'; // Género del personaje
  usePiper?: boolean; // Si usar Piper TTS (voces más naturales)
  usePuter?: boolean; // Si usar Puter.js TTS (experimental, 100% gratis e ilimitado)
}

// Ajustes de voz según la emoción detectada (se aplican sobre la config base)
export interface EmotionAdjustment {
  pitchMultiplier: number;
  rateMultiplier: number;
  pauseMultiplier: number; // Multiplica las pausas entre frases
}

export const emotionAdjustments: Record<EmotionType, EmotionAdjustment> = {
  happy: {
    pitchMultiplier: 1.1,
    rateMultiplier: 1.15,
    pauseMultiplier: 0.7
  },
  calm: {
    pitchMultiplier: 0.97,
    rateMultiplier: 0.92,
    pauseMultiplier: 1.4
  },
  sad: {
    pitchMultiplier: 0.93,
    rateMultiplier: 0.82,
    pauseMultiplier: 1.6
  },
  excited: {
    pitchMultiplier: 1.15,
    rateMultiplier: 1.25,
    pauseMultiplier: 0.5
  },
  angry: {
    pitchMultiplier: 0.98,
    rateMultiplier: 1.2,
    pauseMultiplier: 0.6
  },
  neutral: {
    pitchMultiplier: 1.0,
    rateMultiplier: 1.0,
    pauseMultiplier: 1.0
  },
  thoughtful: {
    pitchMultiplier: 0.96,
    rateMultiplier: 0.88,
    pauseMultiplier: 1.5
  }
};

/**
 * CONFIGURACIÓN DE VOCES POR PERSONAJE
 * 
 * IMPORTANTE: Los "type" en la base de datos (hada, lumi, nimbo, etc.) se mapean a nombres REALES:
 * - hada → Ada (El Hada de los Sueños) - FEMENINA
 * - lumi → Luna (La Guardiana de la Serenidad) - FEMENINA
 * - nimbo → Coral (El Alma del Océano) - FEMENINA
 * - human → Aurora (El Espíritu del Amanecer) - FEMENINA
 * - fabel → Sprig (El Brote de la Paciencia) - MASCULINO
 * - draguito → Ember (El Espíritu del Coraje) - MASCULINO
 * - elfo → Sage (El Elfo de la Reflexión) - MASCULINO
 * - unicornito → Orion (El Guardián de las Constelaciones) - MASCULINO
 * - ken → Ken (El Guardián de Cuatro Patas) - MASCULINO
 */
export const companionVoices: Record<string, VoiceConfig> = {
  // ==========================================
  // PERSONAJES FEMENINOS - Voces de MUJER
  // ✨ TODAS USAN PUTER.JS (100% GRATIS, VOCES REALES)
  // ==========================================
  
  hada: {
    realName: 'Ada',
    pitch: 1.9, // ✨ Voz de hada muy femenina y mágica
    rate: 1.12,
    volume: 0.95,
    lang: 'es-MX', // México - Voz Mia (generative)
    emotion: 'cheerful',
    expressiveness: 0.95,
    gender: 'female',
    usePiper: false,
    usePuter: true // ✨ PUTER.JS: Mia (generative) - La más mágica y expresiva
  },
  
  lumi: {
    realName: 'Luna',
    pitch: 1.7, // 💙 Voz FEMENINA suave y maternal
    rate: 0.88,
    volume: 0.9,
    lang: 'es-ES', // España - Voz Lucia (neural)
    emotion: 'calm',
    expressiveness: 0.8,
    gender: 'female',
    usePiper: false,
    usePuter: true // ✨ PUTER.JS: Lucia (neural) - Suave y maternal
  },
  
  nimbo: {
    realName: 'Coral',
    pitch: 1.7, // 🌊 Voz FEMENINA misteriosa del océano
    rate: 0.92,
    volume: 0.88,
    lang: 'es-ES', // España - Voz Conchita (neural)
    emotion: 'serene',
    expressiveness: 0.85,
    gender: 'female',
    usePiper: false,
    usePuter: true // ✨ PUTER.JS: Conchita (neural) - Misteriosa y profunda
  },
  
  human: {
    realName: 'Aurora',
    pitch: 1.85, // ☀️ Voz FEMENINA joven y optimista
    rate: 1.08,
    volume: 0.92,
    lang: 'es-US', // EE.UU - Voz Lupe (neural)
    emotion: 'hopeful',
    expressiveness: 0.9,
    gender: 'female',
    usePiper: false,
    usePuter: true // ✨ PUTER.JS: Lupe (neural) - Energética y optimista
  },
  
  // ==========================================
  // PERSONAJES MASCULINOS - Voces de HOMBRE
  // (NO usan Puter.js, usan Web Speech API)
  // ==========================================
  
  fabel: {
    realName: 'Sprig',
    pitch: 0.85, // Masculino medio
    rate: 1.1,
    volume: 0.95,
    lang: 'es-ES',
    emotion: 'cheerful',
    expressiveness: 0.95,
    gender: 'male',
    usePiper: false,
    usePuter: false // NO usar Puter.js (es masculino)
  },
  
  draguito: {
    realName: 'Ember',
    pitch: 0.85, // Masculino profundo y enérgico
    rate: 1.15,
    volume: 0.95,
    lang: 'es-US',
    emotion: 'energetic',
    expressiveness: 0.95,
    gender: 'male',
    usePiper: false,
    usePuter: false
  },
  
  elfo: {
    realName: 'Sage',
    pitch: 0.75, // Masculino grave y sabio
    rate: 0.85,
    volume: 0.88,
    lang: 'es-ES',
    emotion: 'wise',
    expressiveness: 0.75,
    gender: 'male',
    usePiper: false,
    usePuter: false
  },
  
  unicornito: {
    realName: 'Orion',
    pitch: 0.9, // Masculino medio, inspirador
    rate: 0.95,
    volume: 0.9,
    lang: 'es-US',
    emotion: 'inspiring',
    expressiveness: 0.88,
    gender: 'male',
    usePiper: false,
    usePuter: false
  },
  
  ken: {
    realName: 'Ken',
    pitch: 0.55, // ⚠️ VOZ MUY GRAVE - Perro guardián protector (voz profunda y robusta)
    rate: 0.92,
    volume: 0.98,
    lang: 'es-ES',
    emotion: 'protective',
    expressiveness: 0.9,
    gender: 'male',
    usePiper: false,
    usePuter: true // ✨ PUTER.JS: Enrique (neural) - Voz robusta de guardián + ladridos ocasionales
  },
  
  willow: {
    realName: 'Willow',
    pitch: 0.8, // 🌳 VOZ MASCULINA sabia y profunda de 800 años
    rate: 0.88,
    volume: 0.9,
    lang: 'es-ES', // España - Voz masculina sabia y tranquila
    emotion: 'wise',
    expressiveness: 0.82,
    gender: 'male',
    usePiper: false,
    usePuter: true // ✨ PUTER.JS: Voz masculina profunda - Espíritu ancestral sabio
  }
};

/**
 * Alias para mantener compatibilidad con código anterior
 */
export const voiceAliases: Record<string, string> = {
  // Nombres antiguos → type correcto
  'ada': 'hada',
  'luna': 'lumi',
  'coral': 'nimbo',
  'aurora': 'human',
  'sprig': 'fabel',
  'ember': 'draguito',
  'sage': 'elfo',
  'orion': 'unicornito',
  'ken': 'ken',
  'willow': 'willow'
};

/**
 * Obtener configuración de voz por type o nombre
 */
export function getVoiceConfig(companionType: string): VoiceConfig {
  // Normalizar a minúsculas
  const normalized = companionType.toLowerCase();
  
  // Buscar por alias primero
  const type = voiceAliases[normalized] || normalized;
  
  // Retornar configuración o default
  return companionVoices[type] || companionVoices['hada'];
}

/**
 * Obtener todas las voces femeninas
 */
export function getFemaleVoices(): Record<string, VoiceConfig> {
  return Object.fromEntries(
    Object.entries(companionVoices).filter(([_, config]) => config.gender === 'female')
  );
}

/**
 * Obtener todas las voces masculinas
 */
export function getMaleVoices(): Record<string, VoiceConfig> {
  return Object.fromEntries(
    Object.entries(companionVoices).filter(([_, config]) => config.gender === 'male')
  );
}
