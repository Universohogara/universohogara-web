
/**
 * 🎨 COLORES PERSONALIZADOS PARA CADA COMPANION
 * Basados en las tarjetas de presentación y la identidad visual de cada personaje
 */

export interface CompanionColorScheme {
  primary: string // Color principal del personaje
  secondary: string // Color secundario complementario
  gradient: string // Gradiente de fondo para burbujas
  text: string // Color de texto
  border: string // Color del borde
  glow: string // Color del brillo mágico (rgba)
}

/**
 * Esquema de colores por tipo de companion
 * Basado en las tarjetas de presentación visibles en /public/images/companions/
 */
export const companionColors: Record<string, CompanionColorScheme> = {
  // Ada (Hada) - Rosa/Púrpura mágico
  hada: {
    primary: '#FF1493', // Rosa fucsia brillante
    secondary: '#FFB6D9', // Rosa claro
    gradient: 'from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20',
    text: 'text-purple-900 dark:text-purple-100',
    border: 'border-pink-300 dark:border-pink-700',
    glow: 'rgba(255, 20, 147, 0.5)'
  },
  
  // Luna (Lumi) - Azul lunar sereno
  lumi: {
    primary: '#9370DB', // Púrpura/Lavanda
    secondary: '#E6E6FA', // Lavanda claro
    gradient: 'from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20',
    text: 'text-blue-900 dark:text-blue-100',
    border: 'border-blue-300 dark:border-blue-700',
    glow: 'rgba(147, 112, 219, 0.5)'
  },
  
  // Coral (Nimbo) - Turquesa/Aqua oceánico
  nimbo: {
    primary: '#00CED1', // Turquesa/Coral
    secondary: '#AFEEEE', // Aguamarina claro
    gradient: 'from-cyan-100 to-teal-100 dark:from-cyan-900/20 dark:to-teal-900/20',
    text: 'text-cyan-900 dark:text-cyan-100',
    border: 'border-cyan-300 dark:border-cyan-700',
    glow: 'rgba(0, 206, 209, 0.5)'
  },
  
  // Aurora (Human) - Dorado/Amarillo amanecer
  human: {
    primary: '#FFD700', // Dorado/Amanecer
    secondary: '#FFA500', // Naranja dorado
    gradient: 'from-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20',
    text: 'text-amber-900 dark:text-amber-100',
    border: 'border-yellow-300 dark:border-yellow-700',
    glow: 'rgba(255, 215, 0, 0.5)'
  },
  
  // Sprig (Fabel) - Verde naturaleza
  fabel: {
    primary: '#228B22', // Verde naturaleza
    secondary: '#90EE90', // Verde claro
    gradient: 'from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20',
    text: 'text-green-900 dark:text-green-100',
    border: 'border-green-300 dark:border-green-700',
    glow: 'rgba(34, 139, 34, 0.5)'
  },
  
  // Ember (Draguito) - Rojo/Naranja fuego
  draguito: {
    primary: '#FF4500', // Rojo/Naranja
    secondary: '#FFD700', // Dorado
    gradient: 'from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20',
    text: 'text-orange-900 dark:text-orange-100',
    border: 'border-orange-300 dark:border-orange-700',
    glow: 'rgba(255, 69, 0, 0.5)'
  },
  
  // Sage (Elfo) - Verde bosque sabio
  elfo: {
    primary: '#2E8B57', // Verde bosque
    secondary: '#98FB98', // Verde pálido
    gradient: 'from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20',
    text: 'text-emerald-900 dark:text-emerald-100',
    border: 'border-emerald-300 dark:border-emerald-700',
    glow: 'rgba(46, 139, 87, 0.5)'
  },
  
  // Orion (Unicornito) - Índigo/Violeta estelar
  unicornito: {
    primary: '#4169E1', // Azul real
    secondary: '#B0C4DE', // Azul acero claro
    gradient: 'from-violet-100 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/20',
    text: 'text-violet-900 dark:text-violet-100',
    border: 'border-violet-300 dark:border-violet-700',
    glow: 'rgba(65, 105, 225, 0.5)'
  },
  
  // Ken (Perro Guardián) - Rojo intenso
  ken: {
    primary: '#DC143C', // Rojo (como su pañuelo)
    secondary: '#FF6B6B', // Rojo claro
    gradient: 'from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20',
    text: 'text-amber-900 dark:text-amber-100',
    border: 'border-amber-300 dark:border-amber-700',
    glow: 'rgba(220, 20, 60, 0.5)'
  },
  
  // Willow (El Sauce de la Flexibilidad) - Verde sabio ancestral
  willow: {
    primary: '#16A34A', // Verde sauce
    secondary: '#86EFAC', // Verde claro
    gradient: 'from-green-100 to-lime-100 dark:from-green-900/20 dark:to-lime-900/20',
    text: 'text-green-900 dark:text-green-100',
    border: 'border-green-300 dark:border-green-700',
    glow: 'rgba(22, 163, 74, 0.5)'
  }
}

/**
 * Obtener colores de un companion por su tipo
 */
export function getCompanionColors(companionType: string): CompanionColorScheme {
  const normalized = companionType.toLowerCase()
  return companionColors[normalized] || companionColors['hada'] // Fallback a Ada
}

/**
 * Alias para compatibilidad
 */
export const colorAliases: Record<string, string> = {
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
}
