
/**
 * Sistema de detección de triggers emocionales
 * Analiza el contexto de la conversación y determina cuándo activar voces emocionales
 */

export type EmotionType = 'bienvenida' | 'consolo' | 'animo' | 'felicitacion';

interface TriggerResult {
  shouldTrigger: boolean;
  emotionType: EmotionType | null;
  confidence: number; // 0-1
  reason: string;
}

interface ConversationContext {
  userMessage: string;
  previousMessages?: Array<{ role: string; content: string }>;
  userMood?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  isFirstInteractionToday?: boolean;
  recentAchievements?: string[];
  userRequestedSupport?: boolean;
}

/**
 * Palabras clave para cada tipo de emoción
 */
const emotionKeywords = {
  consolo: {
    strong: [
      'triste', 'llorar', 'dolor', 'perdida', 'duelo', 'muerte', 'sufro', 
      'deprimido', 'angustia', 'ansiedad', 'miedo', 'solo', 'sola',
      'desesperado', 'desesperada', 'no puedo', 'ayuda', 'mal'
    ],
    medium: [
      'difícil', 'complicado', 'preocupado', 'preocupada', 'cansado', 'cansada',
      'agotado', 'agotada', 'estrés', 'abrumado', 'abrumada'
    ]
  },
  animo: {
    strong: [
      'necesito ánimo', 'dame fuerzas', 'motivame', 'no sé si puedo',
      'voy a intentar', 'es difícil pero', 'ayúdame', 'apoyo'
    ],
    medium: [
      'intentando', 'esfuerzo', 'luchar', 'seguir', 'continuar',
      'no me rindo', 'puedo lograrlo', 'voy a', 'quiero'
    ]
  },
  felicitacion: {
    strong: [
      'lo logré', 'lo conseguí', 'completé', 'terminé', 'éxito',
      'victoria', 'gané', 'bien', 'feliz', 'alegre', 'contento', 'contenta'
    ],
    medium: [
      'hice', 'avancé', 'mejor', 'progreso', 'logro'
    ]
  },
  bienvenida: {
    strong: [
      'hola', 'buenos días', 'buenas tardes', 'buenas noches',
      'qué tal', 'cómo estás', 'hey', 'hi'
    ],
    medium: []
  }
};

/**
 * Emojis y símbolos que indican emociones
 */
const emotionEmojis = {
  consolo: ['😢', '😭', '😔', '💔', '😞', '😟', '😥', '🥺'],
  animo: ['💪', '🌟', '✨', '⭐', '🔥'],
  felicitacion: ['🎉', '🎊', '🥳', '😊', '😄', '❤️', '💖', '✅', '🏆'],
  bienvenida: ['👋', '🖐️', '✋']
};

/**
 * Analiza el contexto y determina si debe activarse un trigger emocional
 */
export function analyzeTrigger(context: ConversationContext): TriggerResult {
  const { userMessage, isFirstInteractionToday, userRequestedSupport, recentAchievements, userMood } = context;
  
  const messageLower = userMessage.toLowerCase();

  // 1. BIENVENIDA: Primera interacción del día o saludo explícito
  if (isFirstInteractionToday || isGreeting(messageLower)) {
    return {
      shouldTrigger: true,
      emotionType: 'bienvenida',
      confidence: 0.9,
      reason: isFirstInteractionToday ? 'Primera interacción del día' : 'Saludo detectado'
    };
  }

  // 2. FELICITACIÓN: Logros recientes o mensajes de éxito
  if (recentAchievements && recentAchievements.length > 0) {
    return {
      shouldTrigger: true,
      emotionType: 'felicitacion',
      confidence: 0.95,
      reason: 'Logro reciente completado'
    };
  }

  const felicitacionScore = detectEmotion(messageLower, 'felicitacion');
  if (felicitacionScore.confidence > 0.6) {
    return {
      shouldTrigger: true,
      emotionType: 'felicitacion',
      confidence: felicitacionScore.confidence,
      reason: felicitacionScore.reason
    };
  }

  // 3. CONSUELO: Solicitud explícita de apoyo o emociones negativas fuertes
  if (userRequestedSupport) {
    return {
      shouldTrigger: true,
      emotionType: 'consolo',
      confidence: 1.0,
      reason: 'Usuario solicitó apoyo explícitamente'
    };
  }

  const consoloScore = detectEmotion(messageLower, 'consolo');
  if (consoloScore.confidence > 0.65) {
    return {
      shouldTrigger: true,
      emotionType: 'consolo',
      confidence: consoloScore.confidence,
      reason: consoloScore.reason
    };
  }

  // 4. ÁNIMO: Intentos de superación o solicitud de motivación
  const animoScore = detectEmotion(messageLower, 'animo');
  if (animoScore.confidence > 0.6) {
    return {
      shouldTrigger: true,
      emotionType: 'animo',
      confidence: animoScore.confidence,
      reason: animoScore.reason
    };
  }

  // 5. Mood del usuario (si está disponible)
  if (userMood) {
    const moodTrigger = detectMoodTrigger(userMood);
    if (moodTrigger.shouldTrigger) {
      return moodTrigger;
    }
  }

  // No se detectó ningún trigger fuerte
  return {
    shouldTrigger: false,
    emotionType: null,
    confidence: 0,
    reason: 'No se detectó contexto emocional significativo'
  };
}

/**
 * Detecta si el mensaje es un saludo
 */
function isGreeting(message: string): boolean {
  const greetings = emotionKeywords.bienvenida.strong;
  return greetings.some(greeting => 
    message.startsWith(greeting) || message.includes(` ${greeting}`)
  );
}

/**
 * Detecta la intensidad de una emoción específica en el mensaje
 */
function detectEmotion(message: string, emotion: EmotionType): { confidence: number; reason: string } {
  const keywords = emotionKeywords[emotion];
  const emojis = emotionEmojis[emotion] || [];
  
  let score = 0;
  let matchedKeywords: string[] = [];
  let matchedEmojis: string[] = [];

  // Buscar keywords fuertes
  keywords.strong.forEach(keyword => {
    if (message.includes(keyword)) {
      score += 0.4;
      matchedKeywords.push(keyword);
    }
  });

  // Buscar keywords medias
  keywords.medium.forEach(keyword => {
    if (message.includes(keyword)) {
      score += 0.2;
      matchedKeywords.push(keyword);
    }
  });

  // Buscar emojis
  emojis.forEach(emoji => {
    if (message.includes(emoji)) {
      score += 0.3;
      matchedEmojis.push(emoji);
    }
  });

  // Normalizar score
  const confidence = Math.min(score, 1.0);

  let reason = '';
  if (matchedKeywords.length > 0) {
    reason += `Palabras clave: ${matchedKeywords.slice(0, 3).join(', ')}`;
  }
  if (matchedEmojis.length > 0) {
    if (reason) reason += '. ';
    reason += `Emojis: ${matchedEmojis.slice(0, 2).join(', ')}`;
  }

  return { confidence, reason: reason || 'Análisis contextual' };
}

/**
 * Detecta trigger basado en el mood del usuario
 */
function detectMoodTrigger(mood: string): TriggerResult {
  const moodLower = mood.toLowerCase();

  if (['sad', 'anxious', 'stressed', 'triste', 'ansioso', 'estresado'].includes(moodLower)) {
    return {
      shouldTrigger: true,
      emotionType: 'consolo',
      confidence: 0.8,
      reason: `Mood del usuario: ${mood}`
    };
  }

  if (['happy', 'excited', 'joyful', 'feliz', 'emocionado', 'alegre'].includes(moodLower)) {
    return {
      shouldTrigger: true,
      emotionType: 'felicitacion',
      confidence: 0.75,
      reason: `Mood del usuario: ${mood}`
    };
  }

  return {
    shouldTrigger: false,
    emotionType: null,
    confidence: 0,
    reason: 'Mood neutral'
  };
}

/**
 * Analiza una secuencia de mensajes para detectar patrones emocionales
 */
export function analyzeConversationPattern(
  messages: Array<{ role: string; content: string }>
): TriggerResult {
  if (messages.length < 3) {
    return {
      shouldTrigger: false,
      emotionType: null,
      confidence: 0,
      reason: 'No hay suficiente historial'
    };
  }

  // Obtener últimos 5 mensajes del usuario
  const userMessages = messages
    .filter(m => m.role === 'user')
    .slice(-5)
    .map(m => m.content.toLowerCase());

  // Analizar cada mensaje y acumular scores
  const emotionScores: Record<EmotionType, number> = {
    bienvenida: 0,
    consolo: 0,
    animo: 0,
    felicitacion: 0
  };

  userMessages.forEach((msg, index) => {
    // Mensajes más recientes tienen más peso
    const weight = (index + 1) / userMessages.length;

    Object.keys(emotionScores).forEach(emotion => {
      const score = detectEmotion(msg, emotion as EmotionType);
      emotionScores[emotion as EmotionType] += score.confidence * weight;
    });
  });

  // Encontrar la emoción dominante
  const dominantEmotion = Object.entries(emotionScores)
    .sort(([, a], [, b]) => b - a)[0] as [EmotionType, number];

  const [emotion, score] = dominantEmotion;
  const normalizedScore = Math.min(score / userMessages.length, 1.0);

  if (normalizedScore > 0.5) {
    return {
      shouldTrigger: true,
      emotionType: emotion,
      confidence: normalizedScore,
      reason: 'Patrón emocional detectado en la conversación'
    };
  }

  return {
    shouldTrigger: false,
    emotionType: null,
    confidence: 0,
    reason: 'No se detectó patrón emocional claro'
  };
}

/**
 * Determina si es un buen momento para activar una voz emocional
 * (evita activar voces muy frecuentemente)
 */
export function shouldThrottleTrigger(
  lastTriggerTime: Date | null,
  minimumIntervalMinutes: number = 5
): boolean {
  if (!lastTriggerTime) {
    return false; // No hay throttle si nunca se ha activado
  }

  const now = new Date();
  const diffMinutes = (now.getTime() - lastTriggerTime.getTime()) / (1000 * 60);

  return diffMinutes < minimumIntervalMinutes;
}
