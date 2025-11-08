/**
 * Sistema Completo de Diarios Profesionales - Estilo Hogara
 * Inspirado en HardPeach pero con identidad única
 */

// ============= TIPOS DE DIARIOS =============
export type DiaryType = 
  | 'reading'        // Diario de Lectura (300+ libros)
  | 'movies'         // Diario de Películas y Series
  | 'exercise'       // Diario de Ejercicio y Progreso
  | 'finance'        // Diario de Finanzas
  | 'wellness'       // Diario de Bienestar
  | 'dreams'         // Diario de Sueños (expandido)
  | 'gratitude'      // Diario de Gratitud (expandido)
  | 'manifestation'  // Diario de Manifestación
  | 'tracker';       // Sistema de Trackers Personalizables

// ============= TRACKERS PERSONALIZABLES =============
export interface TrackerLegendItem {
  id: string;
  label: string;      // "Hecho", "No hecho", "Sí", "No", etc.
  color: string;      // Color personalizado
  shortLabel?: string; // Ej: "H", "NH", "S", "N"
}

export interface TrackerCell {
  id: string;
  date: Date;
  legendItemId: string | null; // Referencia al item de leyenda
  color: string | null;
  notes?: string;
}

export interface TrackerConfig {
  id: string;
  name: string;       // "Agua", "Sueño", "Humor", "Ejercicio", etc.
  icon: string;
  type: 'monthly' | 'yearly';
  legend: TrackerLegendItem[];
  cells: TrackerCell[];
}

// ============= VISTAS DE NAVEGACIÓN =============
export type DiaryView = 'yearly' | 'monthly' | 'weekly' | 'daily';

export interface DiaryNavigation {
  currentView: DiaryView;
  currentDate: Date;
  year: number;
  month?: number;
  week?: number;
  day?: number;
}

// ============= ENTRADAS ESPECÍFICAS POR TIPO =============

// Diario de Lectura
export interface ReadingEntry {
  id: string;
  userId: string;
  date: Date;
  bookTitle: string;
  author: string;
  pages: number;
  totalPages?: number;
  rating?: number;
  genre?: string;
  status: 'reading' | 'completed' | 'paused' | 'abandoned';
  review?: string;
  quotes?: string[];
  coverImage?: string;
  startDate?: Date;
  endDate?: Date;
}

// Diario de Películas/Series
export interface MovieEntry {
  id: string;
  userId: string;
  date: Date;
  title: string;
  type: 'movie' | 'series';
  genre?: string;
  rating?: number;
  director?: string;
  year?: number;
  season?: number;
  episode?: number;
  review?: string;
  quotes?: string[];
  posterImage?: string;
  watchedWith?: string;
}

// Diario de Ejercicio
export interface ExerciseEntry {
  id: string;
  userId: string;
  date: Date;
  type: string; // "Cardio", "Fuerza", "Yoga", etc.
  duration: number; // minutos
  intensity: 'light' | 'moderate' | 'high';
  calories?: number;
  weight?: number;
  bodyMeasurements?: Record<string, number>;
  personalRecords?: Record<string, any>;
  mood?: string;
  notes?: string;
}

// Diario de Finanzas
export interface FinanceEntry {
  id: string;
  userId: string;
  date: Date;
  type: 'income' | 'expense' | 'saving' | 'investment';
  amount: number;
  category: string;
  description: string;
  paymentMethod?: string;
  recurring?: boolean;
  tags?: string[];
}

// Diario de Bienestar
export interface WellnessEntry {
  id: string;
  userId: string;
  date: Date;
  mood: number; // 1-10
  energy: number; // 1-10
  sleep: {
    hours: number;
    quality: number; // 1-10
  };
  water: number; // vasos
  meditation?: number; // minutos
  gratitude?: string[];
  achievements?: string[];
  challenges?: string[];
  notes?: string;
}

// Diario de Sueños (Expandido)
export interface DreamEntry {
  id: string;
  userId: string;
  date: Date;
  title: string;
  description: string;
  category: 'lucid' | 'nightmare' | 'recurring' | 'prophetic' | 'normal';
  emotions: string[];
  symbols?: string[];
  people?: string[];
  places?: string[];
  colors?: string[];
  intensity: number; // 1-10
  clarity: number; // 1-10
  interpretation?: string;
  tags?: string[];
}

// Diario de Gratitud (Expandido)
export interface GratitudeEntry {
  id: string;
  userId: string;
  date: Date;
  items: string[]; // 3-5 cosas por las que está agradecido
  highlight?: string; // Lo mejor del día
  learnings?: string; // Aprendizajes
  tomorrow?: string; // Intención para mañana
  mood: number; // 1-10
  photos?: string[];
}

// Diario de Manifestación
export interface ManifestationEntry {
  id: string;
  userId: string;
  date: Date;
  goal: string;
  affirmations: string[];
  visualizations?: string;
  actions: string[]; // Acciones concretas
  feelings?: string; // Cómo se siente al manifestar
  gratitudeForIt?: string; // Gratitud como si ya lo tuviera
  progress?: number; // 1-100
  achieved?: boolean;
  achievedDate?: Date;
}

// ============= ESTRUCTURA PRINCIPAL DE DIARIO =============
export interface DiarySection {
  id: string;
  label: string;
  icon: string;
  color: string;
  view: DiaryView;
}

export interface Diary {
  id: string;
  type: DiaryType;
  title: string;
  subtitle: string;
  description: string;
  coverColor: string;
  coverGradient: string;
  coverPattern?: string;
  icon: string;
  maxEntries?: number; // Ej: 300 para lectura
  sections: DiarySection[];
  features: string[];
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============= DIARIOS PREDEFINIDOS COMPLETOS =============
export const PREDEFINED_DIARIES: Omit<Diary, 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'reading-diary',
    type: 'reading',
    title: 'Diario de Lectura',
    subtitle: 'Tu biblioteca personal',
    description: 'Registra hasta 300 libros con reseñas, citas favoritas y análisis de géneros',
    coverColor: '#D8B4E2',
    coverGradient: 'linear-gradient(135deg, #D8B4E2 0%, #B494C2 100%)',
    icon: '📚',
    maxEntries: 300,
    sections: [
      { id: 'yearly', label: 'Vista Anual', icon: '📅', color: '#D8B4E2', view: 'yearly' },
      { id: 'monthly', label: 'Este Mes', icon: '📖', color: '#C4A4D2', view: 'monthly' },
      { id: 'currently', label: 'Leyendo Ahora', icon: '📕', color: '#B494C2', view: 'daily' },
      { id: 'completed', label: 'Completados', icon: '✓', color: '#A484B2', view: 'yearly' },
      { id: 'stats', label: 'Estadísticas', icon: '📊', color: '#9474A2', view: 'yearly' },
    ],
    features: [
      '300+ espacios para libros',
      'Análisis de géneros y autores',
      'Banco de citas favoritas',
      'Estadísticas de lectura',
      'Desafíos mensuales',
      'Biblioteca personal',
    ],
  },
  {
    id: 'movies-diary',
    type: 'movies',
    title: 'Diario de Cine y Series',
    subtitle: 'Tu cartelera personal',
    description: 'Registra películas y series con valoraciones, reseñas y análisis',
    coverColor: '#FFB4B4',
    coverGradient: 'linear-gradient(135deg, #FFB4B4 0%, #E49494 100%)',
    icon: '🎬',
    maxEntries: 200,
    sections: [
      { id: 'yearly', label: 'Vista Anual', icon: '📅', color: '#FFB4B4', view: 'yearly' },
      { id: 'monthly', label: 'Este Mes', icon: '🎥', color: '#F4A4A4', view: 'monthly' },
      { id: 'movies', label: 'Películas', icon: '🎞️', color: '#E49494', view: 'yearly' },
      { id: 'series', label: 'Series', icon: '📺', color: '#D48484', view: 'yearly' },
      { id: 'stats', label: 'Estadísticas', icon: '📊', color: '#C47474', view: 'yearly' },
    ],
    features: [
      '200+ espacios para contenido',
      'Separación películas/series',
      'Valoraciones y reseñas',
      'Análisis por género',
      'Frases memorables',
      'Estadísticas visuales',
    ],
  },
  {
    id: 'exercise-diary',
    type: 'exercise',
    title: 'Diario de Ejercicio',
    subtitle: 'Tu progreso fitness',
    description: 'Monitorea entrenamientos, medidas, récords personales y evolución',
    coverColor: '#B4E4D4',
    coverGradient: 'linear-gradient(135deg, #B4E4D4 0%, #94C4B4 100%)',
    icon: '💪',
    sections: [
      { id: 'yearly', label: 'Vista Anual', icon: '📅', color: '#B4E4D4', view: 'yearly' },
      { id: 'monthly', label: 'Este Mes', icon: '🗓️', color: '#A4D4C4', view: 'monthly' },
      { id: 'weekly', label: 'Esta Semana', icon: '📍', color: '#94C4B4', view: 'weekly' },
      { id: 'workouts', label: 'Entrenamientos', icon: '🏋️', color: '#84B4A4', view: 'daily' },
      { id: 'progress', label: 'Progreso', icon: '📈', color: '#74A494', view: 'yearly' },
      { id: 'records', label: 'Récords', icon: '🏆', color: '#649484', view: 'yearly' },
    ],
    features: [
      'Registro de entrenamientos',
      'Seguimiento de peso',
      'Medidas corporales',
      'Récords personales',
      'Gráficos de progreso',
      'Objetivos y logros',
    ],
  },
  {
    id: 'finance-diary',
    type: 'finance',
    title: 'Diario de Finanzas',
    subtitle: 'Tu economía personal',
    description: 'Control completo de ingresos, gastos, ahorros e inversiones',
    coverColor: '#D4C4B4',
    coverGradient: 'linear-gradient(135deg, #D4C4B4 0%, #B4A494 100%)',
    icon: '💰',
    sections: [
      { id: 'yearly', label: 'Vista Anual', icon: '📅', color: '#D4C4B4', view: 'yearly' },
      { id: 'monthly', label: 'Este Mes', icon: '💵', color: '#C4B4A4', view: 'monthly' },
      { id: 'income', label: 'Ingresos', icon: '💚', color: '#B4E4B4', view: 'monthly' },
      { id: 'expenses', label: 'Gastos', icon: '❤️', color: '#E4B4B4', view: 'monthly' },
      { id: 'savings', label: 'Ahorros', icon: '🏦', color: '#B4D4E4', view: 'yearly' },
      { id: 'stats', label: 'Análisis', icon: '📊', color: '#B4A494', view: 'yearly' },
    ],
    features: [
      'Control de ingresos/gastos',
      'Categorización automática',
      'Seguimiento de ahorros',
      'Presupuestos mensuales',
      'Gráficos y tendencias',
      'Reportes detallados',
    ],
  },
  {
    id: 'wellness-diary',
    type: 'wellness',
    title: 'Diario de Bienestar',
    subtitle: 'Tu salud integral',
    description: 'Monitorea humor, sueño, energía, hidratación y hábitos saludables',
    coverColor: '#FFE4B4',
    coverGradient: 'linear-gradient(135deg, #FFE4B4 0%, #E4C494 100%)',
    icon: '🌸',
    sections: [
      { id: 'yearly', label: 'Vista Anual', icon: '📅', color: '#FFE4B4', view: 'yearly' },
      { id: 'monthly', label: 'Este Mes', icon: '🗓️', color: '#F4D4A4', view: 'monthly' },
      { id: 'daily', label: 'Hoy', icon: '☀️', color: '#E4C494', view: 'daily' },
      { id: 'mood', label: 'Estado de Ánimo', icon: '😊', color: '#D4B484', view: 'monthly' },
      { id: 'habits', label: 'Hábitos', icon: '✓', color: '#C4A474', view: 'monthly' },
      { id: 'stats', label: 'Tendencias', icon: '📈', color: '#B49464', view: 'yearly' },
    ],
    features: [
      'Tracker de humor diario',
      'Monitoreo de sueño',
      'Niveles de energía',
      'Hidratación (agua)',
      'Meditación y mindfulness',
      'Análisis de patrones',
    ],
  },
  {
    id: 'dreams-diary',
    type: 'dreams',
    title: 'Diario de Sueños',
    subtitle: 'Tu mundo onírico',
    description: 'Registra, analiza y descubre patrones en tus sueños con detalle profesional',
    coverColor: '#B4B4E4',
    coverGradient: 'linear-gradient(135deg, #B4B4E4 0%, #9494C4 100%)',
    icon: '🌙',
    maxEntries: 365,
    sections: [
      { id: 'yearly', label: 'Vista Anual', icon: '📅', color: '#B4B4E4', view: 'yearly' },
      { id: 'monthly', label: 'Este Mes', icon: '🌛', color: '#A4A4D4', view: 'monthly' },
      { id: 'recent', label: 'Recientes', icon: '💭', color: '#9494C4', view: 'daily' },
      { id: 'patterns', label: 'Patrones', icon: '🔮', color: '#8484B4', view: 'yearly' },
      { id: 'symbols', label: 'Símbolos', icon: '🔯', color: '#7474A4', view: 'yearly' },
      { id: 'analysis', label: 'Análisis', icon: '📊', color: '#646494', view: 'yearly' },
    ],
    features: [
      '365 espacios para sueños',
      'Categorización detallada',
      'Registro de emociones',
      'Símbolos y arquetipos',
      'Patrones recurrentes',
      'Interpretaciones',
    ],
  },
  {
    id: 'gratitude-diary',
    type: 'gratitude',
    title: 'Diario de Gratitud',
    subtitle: 'Tu práctica diaria',
    description: 'Cultiva la gratitud con registro diario, reflexiones y momentos especiales',
    coverColor: '#FFD4E4',
    coverGradient: 'linear-gradient(135deg, #FFD4E4 0%, #E4B4C4 100%)',
    icon: '🙏',
    sections: [
      { id: 'yearly', label: 'Vista Anual', icon: '📅', color: '#FFD4E4', view: 'yearly' },
      { id: 'monthly', label: 'Este Mes', icon: '🗓️', color: '#F4C4D4', view: 'monthly' },
      { id: 'weekly', label: 'Esta Semana', icon: '💝', color: '#E4B4C4', view: 'weekly' },
      { id: 'today', label: 'Hoy', icon: '✨', color: '#D4A4B4', view: 'daily' },
      { id: 'highlights', label: 'Momentos Especiales', icon: '⭐', color: '#C494A4', view: 'yearly' },
    ],
    features: [
      'Registro diario estructurado',
      'Highlights del día',
      'Aprendizajes semanales',
      'Galería de momentos',
      'Revisiones mensuales',
      'Evolución emocional',
    ],
  },
  {
    id: 'manifestation-diary',
    type: 'manifestation',
    title: 'Diario de Manifestación',
    subtitle: 'Tus metas y sueños',
    description: 'Convierte sueños en realidad con afirmaciones, visualizaciones y seguimiento',
    coverColor: '#E4D4FF',
    coverGradient: 'linear-gradient(135deg, #E4D4FF 0%, #C4B4E4 100%)',
    icon: '✨',
    sections: [
      { id: 'yearly', label: 'Metas Anuales', icon: '🎯', color: '#E4D4FF', view: 'yearly' },
      { id: 'monthly', label: 'Este Mes', icon: '🌟', color: '#D4C4F4', view: 'monthly' },
      { id: 'active', label: 'En Progreso', icon: '🚀', color: '#C4B4E4', view: 'daily' },
      { id: 'affirmations', label: 'Afirmaciones', icon: '💫', color: '#B4A4D4', view: 'daily' },
      { id: 'achieved', label: 'Logrado', icon: '🏆', color: '#A494C4', view: 'yearly' },
    ],
    features: [
      'Definición de objetivos',
      'Afirmaciones diarias',
      'Visualizaciones guiadas',
      'Acciones concretas',
      'Seguimiento de progreso',
      'Celebración de logros',
    ],
  },
  {
    id: 'tracker-system',
    type: 'tracker',
    title: 'Sistema de Trackers',
    subtitle: 'Personalización total',
    description: 'Crea trackers ilimitados con colores y leyendas 100% personalizables',
    coverColor: '#D8B480',
    coverGradient: 'linear-gradient(135deg, #D8B480 0%, #B8956A 100%)',
    icon: '📊',
    sections: [
      { id: 'yearly', label: 'Trackers Anuales', icon: '📅', color: '#D8B480', view: 'yearly' },
      { id: 'monthly', label: 'Trackers Mensuales', icon: '🗓️', color: '#C8A470', view: 'monthly' },
      { id: 'custom', label: 'Crear Tracker', icon: '✏️', color: '#B8956A', view: 'daily' },
    ],
    features: [
      'Trackers horizontales personalizables',
      'Selector de colores por celda',
      'Leyendas customizables',
      'Múltiples categorías',
      'Estadísticas automáticas',
      'Exportación de datos',
    ],
  },
];
