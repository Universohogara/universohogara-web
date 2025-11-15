
export const blogCategories = {
  'hogara-planner': {
    name: 'Hogara Planner',
    slug: 'hogara-planner',
    description: 'Organiza tu vida con el poder de la planificación mágica',
    color: '#E8B4F7', // Púrpura suave
    icon: '📋',
    gradient: 'from-purple-400 to-pink-300',
    image: '/images/logos/hogara-planner.png'
  },
  'hogara-pet': {
    name: 'Hogara Pet',
    slug: 'hogara-pet',
    description: 'Cuida y conecta con tus compañeros animales',
    color: '#A8D5BA', // Verde menta
    icon: '🐾',
    gradient: 'from-green-400 to-emerald-300',
    image: '/images/logos/hogara-pet.png'
  },
  'hogara-mind': {
    name: 'Hogara Mind',
    slug: 'hogara-mind',
    description: 'Expande tu conciencia y potencial mental',
    color: '#A8C8E1', // Azul cielo
    icon: '🧠',
    gradient: 'from-blue-400 to-cyan-300',
    image: '/images/logos/hogara-mind.png'
  },
  'hogara-home': {
    name: 'Hogara Home',
    slug: 'hogara-home',
    description: 'Transforma tu espacio en un santuario de paz',
    color: '#F5D9A8', // Dorado suave
    icon: '🏡',
    gradient: 'from-amber-400 to-yellow-300',
    image: '/images/logos/hogara-home.png'
  },
  'hogara-luz': {
    name: 'Hogara Luz',
    slug: 'hogara-luz',
    description: 'Ilumina tu camino con sabiduría interior',
    color: '#FFE6A8', // Amarillo luminoso
    icon: '✨',
    gradient: 'from-yellow-400 to-amber-200',
    image: '/images/logos/hogara-luz.png'
  },
  'hogara-esencia': {
    name: 'Hogara Esencia',
    slug: 'hogara-esencia',
    description: 'Descubre tu verdadera naturaleza y propósito',
    color: '#E8A8C8', // Rosa místico
    icon: '🌸',
    gradient: 'from-pink-400 to-rose-300',
    image: '/images/logos/hogara-esencia.png'
  },
  'hogara-app': {
    name: 'Hogara App',
    slug: 'hogara-app',
    description: 'Explora todas las herramientas del universo digital',
    color: '#B8A8E8', // Violeta cósmico
    icon: '📱',
    gradient: 'from-violet-400 to-purple-300',
    image: '/images/logos/hogara-app-logo-square.png'
  }
} as const;

export type BlogCategorySlug = keyof typeof blogCategories;

export const getAllCategories = () => Object.values(blogCategories);

export const getCategoryBySlug = (slug: string) => {
  return blogCategories[slug as BlogCategorySlug] || null;
};
