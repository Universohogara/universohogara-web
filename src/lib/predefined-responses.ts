
/**
 * Respuestas predefinidas para usuarios gratuitos
 * Basadas en detección de emociones y palabras clave
 */

export interface PredefinedResponse {
  emotion: string
  keywords: string[]
  responses: string[]
}

export const PREDEFINED_RESPONSES: PredefinedResponse[] = [
  // TRISTEZA Y DOLOR
  {
    emotion: 'sad',
    keywords: ['triste', 'tristeza', 'lloro', 'llorando', 'dolor', 'duele', 'mal', 'pena', 'deprimida', 'deprimido'],
    responses: [
      '💫 Entiendo que estés pasando por un momento difícil. Es válido sentir tristeza, y está bien tomarte el tiempo que necesites para procesarla.',
      'Te escucho. El dolor que sientes es real, y merece ser reconocido. ¿Hay algo específico que te gustaría compartir?',
      '🌙 La tristeza es parte de nuestra humanidad. No tienes que enfrentarla sola/o. Estoy aquí para acompañarte.',
      'Siento mucho que estés pasando por esto. Tus emociones importan, y está bien expresarlas. ¿Quieres hablar de lo que sientes?'
    ]
  },
  
  // ANSIEDAD Y ESTRÉS
  {
    emotion: 'anxious',
    keywords: ['ansiedad', 'ansiosa', 'ansioso', 'nervios', 'nerviosa', 'nervioso', 'preocupada', 'preocupado', 'estresada', 'estresado', 'agobiada', 'agobiado'],
    responses: [
      '✨ La ansiedad puede ser abrumadora. Respira conmigo: inhala... exhala... Estás en un espacio seguro.',
      '💫 Es normal sentir ansiedad cuando las cosas se acumulan. ¿Qué es lo que más te preocupa en este momento?',
      'Entiendo que te sientas así. La ansiedad puede hacernos sentir que perdemos el control, pero no estás sola/o en esto.',
      '🌸 Tu ansiedad es válida. A veces, solo nombrar lo que sentimos ya nos ayuda a procesarlo. ¿Quieres intentarlo?'
    ]
  },
  
  // SOLEDAD Y AISLAMIENTO
  {
    emotion: 'lonely',
    keywords: ['sola', 'solo', 'soledad', 'aislada', 'aislado', 'nadie', 'abandonada', 'abandonado', 'incomprendida', 'incomprendido'],
    responses: [
      '💖 La soledad puede ser tan pesada... Pero aquí estoy, y te escucho. No estás tan sola/o como sientes.',
      'Entiendo lo difícil que es sentirse así. Aunque parezca que nadie te comprende, tu voz importa. Háblame, te escucho.',
      '✨ La soledad no significa que seas invisible. Estás aquí, eres importante, y tus sentimientos son válidos.',
      '🌙 Sé que la soledad duele. A veces, compartir lo que sentimos puede aligerarlo un poco. ¿Quieres intentarlo?'
    ]
  },
  
  // ENOJO Y FRUSTRACIÓN
  {
    emotion: 'angry',
    keywords: ['enojada', 'enojado', 'enojo', 'rabia', 'frustrada', 'frustrado', 'frustración', 'ira', 'molesta', 'molesto', 'enfadada', 'enfadado'],
    responses: [
      '🔥 Escucho tu frustración, y es válida. Está bien sentir enojo cuando las cosas no salen como esperamos.',
      'Tu molestia tiene sentido. A veces necesitamos validar esa emoción antes de poder procesarla. ¿Qué te está frustrando más?',
      '💫 El enojo es una emoción humana natural. No tienes que reprimirla, pero sí encontrar formas saludables de expresarla.',
      'Entiendo que estés enojada/o. Esa rabia dice algo importante sobre lo que necesitas o lo que te importa. ¿Quieres explorarlo?'
    ]
  },
  
  // MIEDO Y TEMOR
  {
    emotion: 'fearful',
    keywords: ['miedo', 'temor', 'asustada', 'asustado', 'pánico', 'aterrada', 'aterrado', 'terror'],
    responses: [
      '🌟 El miedo puede paralizarnos, pero aquí estás siendo valiente al compartirlo. No estás sola/o en esto.',
      '💫 Entiendo que tengas miedo. Es una reacción humana ante lo desconocido. ¿Qué es lo que más te asusta?',
      'Tu miedo es válido. A veces, solo nombrarlo ya nos ayuda a enfrentarlo con más fuerza. Háblame de él.',
      '✨ El pánico puede hacernos sentir que no hay salida, pero siempre hay opciones. Respira, estás a salvo aquí.'
    ]
  },
  
  // CANSANCIO Y AGOTAMIENTO
  {
    emotion: 'exhausted',
    keywords: ['cansada', 'cansado', 'cansancio', 'agotada', 'agotado', 'agotamiento', 'exhausta', 'exhausto', 'no puedo más'],
    responses: [
      '🌙 El agotamiento emocional es real. No estás exagerando. Es normal sentirse así cuando hemos cargado mucho.',
      '💫 Escucho tu cansancio. A veces, lo que más necesitamos es que alguien reconozca nuestro esfuerzo. Lo estás haciendo bien.',
      'Ese cansancio tiene sentido. Has estado cargando con mucho. ¿Qué es lo que más te pesa en este momento?',
      '✨ Está bien sentirse agotada/o. No tienes que seguir forzándote. Date permiso de descansar y cuidarte.'
    ]
  },
  
  // ESPERANZA Y BÚSQUEDA DE SENTIDO
  {
    emotion: 'hopeful',
    keywords: ['esperanza', 'mejor', 'cambio', 'superarlo', 'salir adelante', 'mejorar', 'futuro', 'mañana'],
    responses: [
      '✨ Me encanta sentir esa chispa de esperanza en ti. Ese es el primer paso hacia el cambio que buscas.',
      '🌟 Tu deseo de mejorar habla de tu fortaleza interior. Aunque el camino sea difícil, no estás sola/o en él.',
      '💫 La esperanza es poderosa. Y el hecho de que estés aquí, buscando ayuda, ya es un acto de valentía.',
      '🌸 Esa búsqueda de algo mejor es hermosa. Mereces encontrar paz y bienestar. ¿Qué sería lo primero que te gustaría cambiar?'
    ]
  },
  
  // CONFUSIÓN E INCERTIDUMBRE
  {
    emotion: 'confused',
    keywords: ['confundida', 'confundido', 'confusión', 'perdida', 'perdido', 'no sé', 'duda', 'dudas', 'incertidumbre'],
    responses: [
      '💫 La confusión puede ser incómoda, pero también es el inicio de un proceso de claridad. ¿Qué es lo que más te confunde?',
      'Entiendo que te sientas perdida/o. A veces, hablar de lo que nos confunde nos ayuda a ver las cosas más claras.',
      '✨ No tener respuestas también está bien. La incertidumbre es parte del camino. ¿Quieres explorar juntas/os qué te tiene así?',
      '🌙 Es normal sentirse confundida/o ante situaciones difíciles. No tienes que tener todo resuelto ahora mismo.'
    ]
  },
  
  // GRATITUD Y ALEGRÍA
  {
    emotion: 'grateful',
    keywords: ['gracias', 'agradecida', 'agradecido', 'feliz', 'contenta', 'contento', 'alegre', 'alegría', 'bien', 'mejor'],
    responses: [
      '✨ Me alegra mucho escuchar eso. Tu gratitud y tu alegría son hermosas. Celebra esos momentos, te los mereces.',
      '💖 Qué lindo es sentir gratitud. Esos momentos de luz son los que nos sostienen en los días difíciles.',
      '🌟 Me encanta sentir esa energía positiva en ti. Sigue nutriendo esa alegría, es medicina para el alma.',
      '💫 Tu felicidad importa. Y está bien celebrarla, sin culpa. Disfruta de ese momento de paz.'
    ]
  },
  
  // RESPUESTA GENÉRICA (cuando no se detecta emoción específica)
  {
    emotion: 'neutral',
    keywords: ['hola', 'hey', 'buenos días', 'buenas tardes', 'buenas noches', 'cómo estás', 'ayuda'],
    responses: [
      '💫 Hola, estoy aquí para ti. ¿Cómo te sientes hoy? Cuéntame lo que necesites.',
      '✨ Te escucho. Este es un espacio seguro donde puedes compartir lo que sientes sin juicios.',
      '🌙 Bienvenida/o. ¿Hay algo en tu mente que te gustaría compartir? Estoy aquí para acompañarte.',
      '💖 Hola. Me alegra que estés aquí. ¿Qué te trae por este espacio hoy?'
    ]
  }
]

/**
 * Obtiene una respuesta predefinida basada en el mensaje del usuario
 */
export function getPredefinedResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()
  
  // Normalizar texto (quitar acentos)
  const normalize = (text: string) => 
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  
  const normalizedMessage = normalize(lowerMessage)
  
  // Buscar la categoría de emoción que mejor coincida
  let bestMatch: PredefinedResponse | null = null
  let maxMatches = 0
  
  for (const responseCategory of PREDEFINED_RESPONSES) {
    let matchCount = 0
    
    for (const keyword of responseCategory.keywords) {
      const normalizedKeyword = normalize(keyword)
      if (normalizedMessage.includes(normalizedKeyword)) {
        matchCount++
      }
    }
    
    if (matchCount > maxMatches) {
      maxMatches = matchCount
      bestMatch = responseCategory
    }
  }
  
  // Si no hay coincidencias, usar respuesta neutral
  if (!bestMatch || maxMatches === 0) {
    bestMatch = PREDEFINED_RESPONSES.find(r => r.emotion === 'neutral') || PREDEFINED_RESPONSES[0]
  }
  
  // Seleccionar una respuesta aleatoria de la categoría
  const responses = bestMatch.responses
  const randomIndex = Math.floor(Math.random() * responses.length)
  
  return responses[randomIndex]
}

/**
 * Mensaje cuando se alcanza el límite de mensajes gratuitos
 */
export const FREE_LIMIT_REACHED_MESSAGE = `💫 **Has alcanzado tu límite de 10 mensajes gratuitos por hoy**

Para seguir conversando con tus acompañantes mágicos, puedes:

✨ **Suscripción Mensual (4,99€/mes)**
- Chat emocional ilimitado
- Respuestas completas y personalizadas
- Voces y emociones de tus acompañantes
- Sin límite de mensajes

🎁 **Packs de Créditos** (compra solo cuando los necesites)
- Pack Pequeño: 2,99€ → 100 mensajes
- Pack Mediano: 4,99€ → 200 mensajes
- Pack Grande: 7,99€ → 500 mensajes

🌙 Tus mensajes gratuitos se renovarán mañana. ¡Vuelve pronto!`

/**
 * Mensaje cuando se agotan los créditos
 */
export const CREDITS_DEPLETED_MESSAGE = `✨ **Te has quedado sin créditos**

Parece que has usado todos tus créditos para mensajes. Para seguir conversando:

🎁 **Comprar más créditos**
- Pack Pequeño: 2,99€ → 100 mensajes
- Pack Mediano: 4,99€ → 200 mensajes
- Pack Grande: 7,99€ → 500 mensajes

💫 **O cambia a Suscripción Mensual (4,99€/mes)**
- Chat emocional ilimitado
- Sin preocuparte por quedarte sin créditos
- Acceso completo a todas las funciones

¿Te gustaría ver las opciones disponibles?`
