
/**
 * Detector de emociones avanzado para companions
 * Analiza el texto del usuario y detecta automáticamente la emoción
 * para ajustar la voz y las animaciones del personaje
 */

export type DetectedEmotion = 
  | 'calm'        // Tranquilo, neutral
  | 'happy'       // Feliz, contento
  | 'sad'         // Triste, melancólico
  | 'excited'     // Emocionado, sorprendido
  | 'anxious'     // Ansioso, preocupado
  | 'protective'  // Protector, de apoyo
  | 'warm'        // Cariñoso, tierno
  | 'energetic'   // Energético, activo

interface EmotionSignals {
  keywords: string[]
  patterns: RegExp[]
  weight: number
  intensifiers: string[]
}

/**
 * Patrones de detección de emociones expandidos
 */
const emotionPatterns: Record<DetectedEmotion, EmotionSignals> = {
  happy: {
    keywords: [
      'feliz', 'alegre', 'genial', 'excelente', 'maravilloso', 'perfecto', 
      'contento', 'bien', 'mejor', 'bueno', 'gracias', 'graciosísimo',
      'divino', 'hermoso', 'precioso', 'encantador', 'fascinante',
      'radiante', 'brillante', 'espléndido'
    ],
    patterns: [
      /me siento (muy )?(bien|feliz|contento|alegre)/i,
      /qué (bueno|genial|bien)/i,
      /estoy (súper|muy )?(feliz|contento|alegre)/i
    ],
    weight: 1.0,
    intensifiers: ['muy', 'súper', 'ultra', 'mega', 're']
  },

  sad: {
    keywords: [
      'triste', 'mal', 'deprimido', 'llorar', 'lloro', 'dolor', 'duele',
      'perdí', 'perdido', 'solo', 'sola', 'difícil', 'duro', 'problema',
      'preocupado', 'preocupada', 'desanimado', 'melancólico', 'nostálgico',
      'angustia', 'pena', 'sufrimiento', 'vacío', 'soledad'
    ],
    patterns: [
      /me siento (muy )?(triste|mal|solo|deprimido)/i,
      /no puedo (más|soportar)/i,
      /estoy (muy )?(triste|deprimido|mal)/i,
      /quiero llorar/i
    ],
    weight: 1.3, // Mayor peso porque es importante detectar tristeza
    intensifiers: ['muy', 'demasiado', 'tan']
  },

  excited: {
    keywords: [
      'increíble', 'wow', 'espectacular', 'asombroso', 'alucinante',
      'flipante', 'impresionante', 'extraordinario', 'fantástico',
      'fabuloso', 'sensacional', 'brutal', 'bestial', 'épico',
      'no puedo creer', 'no lo creo', 'qué sorpresa'
    ],
    patterns: [
      /!{2,}/,  // Múltiples exclamaciones
      /no puedo creer/i,
      /qué (increíble|genial|asombroso)/i,
      /me encanta/i
    ],
    weight: 1.2,
    intensifiers: ['súper', 'mega', 'ultra', 'hiper']
  },

  anxious: {
    keywords: [
      'preocupado', 'preocupada', 'nervioso', 'nerviosa', 'ansiedad',
      'ansioso', 'ansiosa', 'estrés', 'estresado', 'agobiado', 'agobiada',
      'presión', 'angustia', 'tensión', 'inquieto', 'intranquilo',
      'no sé qué hacer', 'no puedo', 'miedo', 'pánico', 'temor'
    ],
    patterns: [
      /no sé (qué hacer|cómo)/i,
      /tengo (mucho )?miedo/i,
      /me preocupa/i,
      /estoy (muy )?(nervioso|ansioso|estresado)/i
    ],
    weight: 1.4, // Alto peso para detectar ansiedad
    intensifiers: ['muy', 'demasiado', 'muchísimo']
  },

  protective: {
    keywords: [
      'necesito', 'ayuda', 'ayúdame', 'apoyo', 'apóyame', 'consejo',
      'guía', 'acompáñame', 'acompaña', 'estoy aquí', 'cuéntame',
      'escucho', 'compañía', 'comprensión', 'entender'
    ],
    patterns: [
      /(necesito|quiero) (ayuda|apoyo|consejo)/i,
      /puedes (ayudarme|aconsejarme)/i,
      /acompáñame/i
    ],
    weight: 1.1,
    intensifiers: ['por favor', 'realmente']
  },

  warm: {
    keywords: [
      'amor', 'amo', 'quiero', 'cariño', 'cariñoso', 'gracias', 'agradezco',
      'aprecio', 'valoro', 'dulce', 'tierno', 'abrazo', 'beso',
      'adorable', 'precioso', 'hermoso', 'te quiero', 'te amo'
    ],
    patterns: [
      /te (quiero|amo|adoro)/i,
      /gracias por/i,
      /eres (increíble|genial|maravilloso)/i,
      /un abrazo/i
    ],
    weight: 1.0,
    intensifiers: ['mucho', 'muchísimo', 'tanto']
  },

  energetic: {
    keywords: [
      'vamos', 'adelante', 'ánimo', 'fuerza', 'energía', 'activo',
      'mover', 'hacer', 'acción', 'motivado', 'motivada', 'empezar',
      'comenzar', 'listo', 'lista', 'preparado', 'preparada', 'a por ello'
    ],
    patterns: [
      /vamos( a)?/i,
      /a por ello/i,
      /con ganas/i,
      /lleno de energía/i
    ],
    weight: 1.0,
    intensifiers: ['mucha', 'toda', 'full']
  },

  calm: {
    keywords: [
      'tranquilo', 'tranquila', 'sereno', 'serena', 'paz', 'relajado',
      'relajada', 'calma', 'meditación', 'respiro', 'respira', 'pausado'
    ],
    patterns: [
      /estoy (tranquilo|calmado|sereno)/i,
      /en paz/i,
      /me relajo/i
    ],
    weight: 0.8,
    intensifiers: ['muy', 'completamente']
  }
}

/**
 * Detecta la emoción predominante en un texto
 */
export function detectEmotion(text: string): DetectedEmotion {
  if (!text || text.trim().length === 0) {
    return 'calm'
  }

  const lowerText = text.toLowerCase()
  const scores: Record<DetectedEmotion, number> = {
    calm: 0,
    happy: 0,
    sad: 0,
    excited: 0,
    anxious: 0,
    protective: 0,
    warm: 0,
    energetic: 0
  }

  // Analizar cada emoción
  for (const [emotion, signals] of Object.entries(emotionPatterns)) {
    let emotionScore = 0
    
    // 1. Buscar palabras clave
    for (const keyword of signals.keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      const matches = lowerText.match(regex)
      if (matches) {
        let keywordScore = matches.length
        
        // 2. Aplicar intensificadores (aumentan el score)
        for (const intensifier of signals.intensifiers) {
          const intensifierRegex = new RegExp(`${intensifier}\\s+${keyword}`, 'gi')
          if (intensifierRegex.test(lowerText)) {
            keywordScore *= 1.5
          }
        }
        
        emotionScore += keywordScore
      }
    }
    
    // 3. Buscar patrones complejos
    for (const pattern of signals.patterns) {
      if (pattern.test(text)) {
        emotionScore += 2 // Los patrones valen más
      }
    }
    
    // 4. Aplicar peso de la emoción
    scores[emotion as DetectedEmotion] = emotionScore * signals.weight
  }

  // Logging para depuración
  console.log('🔍 Análisis emocional:', scores)

  // Encontrar la emoción con mayor puntuación
  let maxEmotion: DetectedEmotion = 'calm'
  let maxScore = 0

  for (const [emotion, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      maxEmotion = emotion as DetectedEmotion
    }
  }

  // Si no hay puntuación significativa, retornar calm
  const detectedEmotion = maxScore > 0 ? maxEmotion : 'calm'
  
  console.log(`🎭 Emoción detectada: ${detectedEmotion} (score: ${maxScore.toFixed(2)})`)
  
  return detectedEmotion
}

/**
 * Analiza el contexto emocional de múltiples mensajes
 * Útil para detectar patrones emocionales a lo largo de una conversación
 */
export function analyzeEmotionalContext(messages: string[], limit = 5): DetectedEmotion {
  const recentMessages = messages.slice(-limit)
  
  if (recentMessages.length === 0) {
    return 'calm'
  }

  const emotions = recentMessages.map(detectEmotion)
  
  // Contar frecuencia de cada emoción
  const emotionCounts: Record<string, number> = {}
  emotions.forEach((emotion, index) => {
    // Mensajes más recientes tienen más peso
    const weight = index + 1
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + weight
  })

  // La última emoción tiene peso extra
  const lastEmotion = emotions[emotions.length - 1]
  emotionCounts[lastEmotion] = (emotionCounts[lastEmotion] || 0) + 3

  // Encontrar la emoción más frecuente/importante
  let mostFrequentEmotion: DetectedEmotion = 'calm'
  let maxCount = 0

  for (const [emotion, count] of Object.entries(emotionCounts)) {
    if (count > maxCount) {
      maxCount = count
      mostFrequentEmotion = emotion as DetectedEmotion
    }
  }

  console.log('📊 Contexto emocional:', emotionCounts)
  console.log(`🎭 Emoción predominante: ${mostFrequentEmotion}`)

  return mostFrequentEmotion
}

/**
 * Determina si una emoción necesita atención urgente
 */
export function needsImmediateSupport(emotion: DetectedEmotion): boolean {
  return emotion === 'anxious' || emotion === 'sad'
}

/**
 * Obtiene un mensaje de apoyo según la emoción
 */
export function getSupportMessage(emotion: DetectedEmotion): string {
  const messages: Record<DetectedEmotion, string> = {
    anxious: 'Respira profundo. Estoy aquí contigo. Todo va a estar bien.',
    sad: 'Te acompaño en este momento. No estás solo. Puedes contar conmigo.',
    protective: 'Siempre estaré aquí para apoyarte. Cuéntame qué necesitas.',
    calm: 'Disfruta este momento de paz. Estoy aquí si me necesitas.',
    happy: 'Me alegra verte tan feliz. Celebremos juntos este momento.',
    excited: 'Qué emoción! Comparte conmigo todo lo que sientes.',
    warm: 'Tu cariño me llena de luz. Gracias por compartir conmigo.',
    energetic: 'Me encanta tu energía! Vamos a aprovecharla al máximo.'
  }
  
  return messages[emotion] || messages.calm
}
