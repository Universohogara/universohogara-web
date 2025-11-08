
/**
 * Limpiador de texto avanzado para TTS
 * Elimina TODOS los emojis, símbolos y caracteres especiales
 * para que la voz solo transmita el mensaje, no los iconos
 */

export function cleanTextForSpeech(text: string): string {
  if (!text) return ''

  let cleaned = text

  // 1. ELIMINAR TODOS LOS EMOJIS (rangos Unicode completos)
  // Emojis básicos y símbolos
  cleaned = cleaned.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
  // Símbolos y pictogramas
  cleaned = cleaned.replace(/[\u{2600}-\u{26FF}]/gu, '')
  // Símbolos decorativos
  cleaned = cleaned.replace(/[\u{2700}-\u{27BF}]/gu, '')
  // Banderas
  cleaned = cleaned.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
  // Símbolos adicionales
  cleaned = cleaned.replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')
  // Emojis extendidos
  cleaned = cleaned.replace(/[\u{1F000}-\u{1F02F}]/gu, '')
  
  // 2. ELIMINAR SÍMBOLOS DECORATIVOS ESPECÍFICOS
  const decorativeSymbols = [
    '✨', '💛', '✓', '💫', '🌙', '⭐', '🔥', '💚', '💙', '❤️', '🧡', '💜', 
    '🤍', '🖤', '💖', '💗', '💓', '💕', '💘', '💝', '💞', '💟', '☀️', '🌟', 
    '⚡', '🌈', '🦋', '🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '💐', '🌼', '🏵️',
    '✅', '❌', '⚠️', '💯', '🎯', '🎉', '🎊', '🎈', '🎀', '🎁', '🎭', '🎨',
    '🍀', '🌱', '🌿', '🍃', '🍂', '🌾', '☘️', '🌳', '🌲', '🌴', '🌵', '🌾'
  ]
  decorativeSymbols.forEach(symbol => {
    cleaned = cleaned.replace(new RegExp(symbol, 'g'), '')
  })
  
  // 3. ELIMINAR CARAS Y GESTOS EMOCIONALES
  const emotionalFaces = [
    '😊', '😄', '😃', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😇',
    '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜',
    '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶',
    '😏', '😒', '🙄', '😬', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨',
    '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱',
    '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺'
  ]
  emotionalFaces.forEach(face => {
    cleaned = cleaned.replace(new RegExp(face, 'g'), '')
  })
  
  // 4. ELIMINAR FORMATO MARKDOWN
  cleaned = cleaned.replace(/\*\*/g, '') // Negritas **
  cleaned = cleaned.replace(/\*/g, '')   // Cursivas *
  cleaned = cleaned.replace(/__/g, '')   // Negritas __
  cleaned = cleaned.replace(/_/g, '')    // Cursivas _
  cleaned = cleaned.replace(/~~(.*?)~~/g, '$1') // Tachado ~~texto~~
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1') // Código inline
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '') // Bloques de código
  
  // 5. LIMPIAR FORMATO DE LISTAS
  cleaned = cleaned.replace(/^[\s]*[-•]\s+/gm, '') // Bullets
  cleaned = cleaned.replace(/^\d+\.\s+/gm, '')     // Listas numeradas
  cleaned = cleaned.replace(/^>\s+/gm, '')         // Citas
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '')    // Headers markdown
  
  // 6. ELIMINAR URLS Y MENCIONES
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '') // URLs
  cleaned = cleaned.replace(/@\w+/g, '')              // Menciones
  cleaned = cleaned.replace(/#\w+/g, '')              // Hashtags
  
  // 7. LIMPIAR PUNTUACIÓN EXCESIVA
  cleaned = cleaned.replace(/([.!?]){2,}/g, '$1')     // Múltiples puntos/exclamaciones
  cleaned = cleaned.replace(/\.{3,}/g, '...')          // Puntos suspensivos
  
  // 8. ELIMINAR CARACTERES ESPECIALES QUE NO APORTAN AL HABLA
  cleaned = cleaned.replace(/[<>{}[\]]/g, '')         // Corchetes y llaves
  cleaned = cleaned.replace(/[|\\\/]/g, '')           // Barras
  cleaned = cleaned.replace(/[@#$%^&*+=]/g, '')       // Símbolos especiales
  
  // 9. CONVERTIR SALTOS DE LÍNEA A ESPACIOS (para fluidez en voz)
  cleaned = cleaned.replace(/\n+/g, ' ')              // Todos los saltos de línea a espacios
  cleaned = cleaned.replace(/\r+/g, ' ')              // Retornos de carro a espacios
  
  // 10. NORMALIZAR ESPACIOS
  cleaned = cleaned.replace(/\s{2,}/g, ' ')           // Espacios múltiples
  cleaned = cleaned.replace(/\t+/g, ' ')              // Tabs
  
  // 11. LIMPIAR ESPACIOS ANTES DE PUNTUACIÓN
  cleaned = cleaned.replace(/\s+([.,!?;:])/g, '$1')
  
  // 12. AGREGAR ESPACIO DESPUÉS DE PUNTUACIÓN SI NO LO HAY (para pausas naturales)
  cleaned = cleaned.replace(/([.,!?;:])([^\s.,!?;:])/g, '$1 $2')
  
  // 13. ELIMINAR PUNTUACIÓN DUPLICADA INNECESARIA
  cleaned = cleaned.replace(/([.!?])+/g, '$1')        // Máximo un signo de puntuación
  
  // 14. UNIR FRASES CORTAS CON COMAS (para evitar pausas abruptas)
  // Esto ayuda a que las frases fluyan mejor
  cleaned = cleaned.replace(/\.\s+([a-záéíóúñ])/gi, ', $1') // Punto + minúscula → coma
  
  // 15. TRIM FINAL
  cleaned = cleaned.trim()
  
  // 16. Si después de limpiar queda vacío, retornar mensaje genérico
  if (!cleaned || cleaned.length < 2) {
    return 'Estoy aquí contigo.'
  }
  
  console.log('🧹 Texto limpiado para voz:')
  console.log('Original:', text.substring(0, 100) + '...')
  console.log('Limpio:', cleaned.substring(0, 100) + '...')
  
  return cleaned
}

/**
 * Verifica si un texto contiene principalmente emojis
 */
export function isEmojiOnlyText(text: string): boolean {
  const cleaned = cleanTextForSpeech(text)
  return cleaned.length < 5
}
