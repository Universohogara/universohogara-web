
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  priceFrom?: boolean; // Mostrar "desde X€"
  variants?: ProductVariant[];
  images: string[];
  category: 'planner' | 'kit' | 'accessory' | 'pack' | 'tracker';
  inStock: boolean;
  featured: boolean;
  templatePdf?: string; // Ruta al PDF de plantilla
  templatePages?: number;
  thumbnailsFolder?: string; // Carpeta con las miniaturas con marca de agua
  highlights?: string[];
}

// Función helper para generar rutas de miniaturas
export function getThumbnailPaths(product: Product): string[] {
  if (!product.thumbnailsFolder || !product.templatePages) {
    return []
  }
  
  const thumbnails: string[] = []
  for (let i = 1; i <= product.templatePages; i++) {
    const pageNum = i.toString().padStart(2, '0')
    thumbnails.push(`/images/products/thumbnails/${product.thumbnailsFolder}/page-${pageNum}.png`)
  }
  return thumbnails
}

export const products: Product[] = [
  {
    id: '7',
    name: 'AGENDA EDICIÓN HOGARA ROSA',
    slug: 'agenda-edicion-hogara-rosa',
    description: 'Agendas diseñadas íntegramente por mí. No existe ninguna igual en el mundo. Cada modelo es único, artesanal y de edición limitada.',
    longDescription: `Esta agenda es el resultado de meses de dedicación, amor y atención al detalle. Agendas diseñadas íntegramente por mí. No existe ninguna igual en el mundo. Cada modelo es único, artesanal y de edición limitada.

No es solo una agenda: es una obra de arte funcional que te acompaña en tu día a día con belleza, calma y exclusividad. Su diseño único en rosa y crema, con ondas suaves que simbolizan la serenidad, la convierte en una joya artesanal.

Cuando sostienes esta agenda en tus manos, sientes que algo especial está a punto de suceder. Porque mereces planificar tu vida rodeada de belleza.`,
    price: 59.95,
    images: ['/images/products/agenda-rosa-hogara.png', '/images/products/caja-presentacion-hogara.png'],
    category: 'planner',
    inStock: true,
    featured: true,
    highlights: [
      'Diseñada íntegramente con mucho mimo y dedicación',
      'Modelo único y artesanal: no existe ninguna igual en el mundo',
      'Edición limitada con acabados de alta calidad',
      'Diseño exclusivo en rosa y crema con detalles ondulados',
      'Cierre magnético y materiales premium',
      'Presentada en caja regalo con acabado de lujo',
    ],
  },
  {
    id: '8',
    name: 'AGENDA EDICIÓN HOGARA AZUL',
    slug: 'agenda-edicion-hogara-azul',
    description: 'Agendas diseñadas íntegramente por mí. No existe ninguna igual en el mundo. Cada modelo es único, artesanal y de edición limitada.',
    longDescription: `Esta agenda es el reflejo de mi visión más personal del diseño: elegancia, calma y belleza atemporal. Agendas diseñadas íntegramente por mí. No existe ninguna igual en el mundo. Cada modelo es único, artesanal y de edición limitada.

Su combinación de azul sereno y crema suave, con líneas onduladas que evocan paz y armonía, la convierte en una pieza única. No la encontrarás en ningún otro lugar porque nace de mi corazón y de mi experiencia ayudando a mujeres a organizarse con belleza.

Esta agenda es para ti si buscas algo más que funcionalidad: buscas una compañera de viaje que te inspire cada día.`,
    price: 59.95,
    images: ['/images/products/agenda-azul-hogara.png', '/images/products/caja-presentacion-hogara.png'],
    category: 'planner',
    inStock: true,
    featured: true,
    highlights: [
      'Diseñada íntegramente con mucho mimo y dedicación',
      'Modelo único y artesanal: no existe ninguna igual en el mundo',
      'Edición limitada con acabados de alta calidad',
      'Diseño exclusivo en azul sereno y crema',
      'Cierre magnético y materiales premium',
      'Presentada en caja regalo con acabado de lujo',
    ],
  },
  {
    id: '1',
    name: 'Diario de Agradecimiento + Planner A5',
    slug: 'diario-agradecimiento-planner',
    description: 'Despierta cada día con el corazón lleno de luz',
    longDescription: `Tu Diario de Agradecimiento es mucho más que un cuaderno: es tu refugio sagrado donde transformas lo ordinario en extraordinario. Con 73 páginas cuidadosamente diseñadas (37 hojas impresas a doble cara), cada mañana se convierte en una oportunidad para reconectar con lo que realmente importa.

Cuando escribes lo que agradeces, no solo estás llenando páginas... estás reprogramando tu mente para ver magia donde antes solo había rutina. Este diario te acompaña en tu viaje hacia una vida más consciente, más plena, más tuya.`,
    price: 42.95,
    priceFrom: true,
    variants: [
      { id: 'hojas', name: 'Solo hojas (37 hojas = 73 páginas)', price: 42.95, description: 'Pack digital de 73 páginas (37 hojas impresas a doble cara)' },
      { id: 'planner', name: 'Con Planner A5 + Bolígrafo', price: 64.95, description: 'Planner físico artesanal + bolígrafo premium + plantillas' },
      { id: 'pack', name: 'Pack Completo con Detalles', price: 89.95, description: 'Incluye planner, bolígrafo, vela aromática, pulsera y más detalles exclusivos' },
    ],
    images: ['/images/products/agradecimiento-01.png', '/images/products/agradecimiento-02.png'],
    category: 'planner',
    inStock: true,
    featured: true,
    templatePdf: '/PACK AGRADECIMIENTO.pdf',
    templatePages: 73,
    thumbnailsFolder: 'pack-agradecimiento',
    highlights: [
      '73 páginas de gratitud (37 hojas impresas a doble cara)',
      'Prompts inspiradores que te guían en tu práctica diaria',
      'Diseño elegante y funcional',
      'Disponible en 3 versiones: solo hojas, con planner, o pack completo con detalles',
      'Acabados premium que hacen de cada página una experiencia sensorial',
    ],
  },
  {
    id: '2',
    name: 'Kit Redes Sociales + Planner A5',
    slug: 'kit-redes-sociales-planner',
    description: 'Crea contenido con alma, no con prisa',
    longDescription: `¿Cansada de sentir que las redes sociales te controlan a ti y no al revés? Este Kit Redes Sociales es tu aliado perfecto para recuperar el poder sobre tu presencia digital.

Con 36 páginas de planificación estratégica (18 hojas impresas a doble cara), podrás diseñar tu contenido con calma, creatividad y coherencia. Ya no más improvisación de último momento ni estrés por "qué publicar hoy". Ahora tendrás un plan claro que refleja tu esencia y te permite brillar sin agotarte.`,
    price: 19.95,
    priceFrom: true,
    variants: [
      { id: 'hojas', name: 'Solo hojas (18 hojas = 36 páginas)', price: 19.95, description: 'Pack digital de 36 páginas (18 hojas impresas a doble cara)' },
      { id: 'planner', name: 'Con Planner A5 + Bolígrafo', price: 54.95, description: 'Planner físico artesanal + bolígrafo premium + plantillas' },
    ],
    images: ['/images/products/redes-01.png', '/images/products/redes-02.png'],
    category: 'kit',
    inStock: true,
    featured: true,
    templatePdf: '/KIT REDES SOCIALES.pdf',
    templatePages: 36,
    thumbnailsFolder: 'kit-redes',
    highlights: [
      '36 páginas de planificación (18 hojas impresas a doble cara)',
      'Plantillas para Facebook, Instagram, TikTok, YouTube, Pinterest, Twitter',
      'Calendarios de contenido mensuales y semanales',
      'Trackers de engagement y crecimiento',
      'Disponible en 2 versiones: solo hojas digitales o con planner físico',
      'Diseño premium que facilita tu organización',
    ],
  },
  {
    id: '3',
    name: 'Trackers Anuales (Kit 23 hojas)',
    slug: 'trackers-anuales-planner',
    description: 'Haz visible tu progreso, celebra tu constancia',
    longDescription: `Los hábitos no se construyen con motivación pasajera, se construyen con seguimiento amoroso. Estos Trackers Anuales te permiten ver, día a día, cómo te estás convirtiendo en la persona que deseas ser.

¿Quieres caminar más? ¿Beber agua? ¿Leer? ¿Meditar? Con 23 hojas de trackers personalizables (cada hoja = 1 página impresa por una sola cara), podrás seguir hasta 23 hábitos diferentes durante todo el año. Y cuando veas esas cuadrículas llenándose de color, entenderás que cada pequeño paso cuenta.`,
    price: 2.50,
    priceFrom: true,
    variants: [
      { id: 'individual', name: 'Tracker Individual (1 hoja)', price: 2.50, description: 'Una hoja impresa por una sola cara en papel de alta calidad' },
      { id: 'individual-plastificado', name: 'Tracker Individual Plastificado', price: 3.50, description: 'Una hoja con acabado plastificado premium (impresa por una cara)' },
      { id: 'kit-23', name: 'Kit Completo (23 hojas)', price: 32.95, description: 'Colección completa de 23 hojas impresas por una cara (23 trackers diferentes)' },
    ],
    images: [
      '/images/products/trackers-01.png',
      '/images/products/trackers-02.png',
      '/images/products/trackers-03.png',
    ],
    category: 'tracker',
    inStock: true,
    featured: true,
    templatePdf: '/TRACKERS ANUALES.pdf',
    templatePages: 23,
    thumbnailsFolder: 'trackers-anuales',
    highlights: [
      '23 hojas de trackers (cada hoja = 1 página impresa por una sola cara)',
      'Un tracker anual por cada hábito que quieras seguir',
      'Sistema visual intuitivo con niveles de cumplimiento',
      'Diseño minimalista que te motiva sin abrumarte',
      'Disponible desde 1 hoja individual hasta kit completo',
      'Opción de plastificado para mayor durabilidad',
    ],
  },

  {
    id: '9',
    name: 'Kit de Limpieza y Organización + Planner A5',
    slug: 'kit-limpieza-organizacion',
    description: 'Limpia tu Espacio, Libera tu Mente',
    longDescription: `¿Alguna vez has sentido que el desorden de tu casa refleja el desorden de tu mente? Este kit es tu aliado para crear espacios que respiren paz, orden y claridad.

No se trata solo de limpiar. Se trata de soltar lo que ya no necesitas, de crear espacio para lo nuevo, de convertir tu hogar en un santuario que te cuide tanto como tú lo cuidas a él.

Con este kit aprenderás a limpiar conscientemente cada rincón mientras liberas emociones estancadas, organizar por áreas emocionales (no solo físicas), crear rituales de mantenimiento que nutran tu bienestar, desapegarte de objetos que cargas por culpa, no por amor, y transformar la limpieza en un acto de amor propio.`,
    price: 18.95,
    priceFrom: true,
    variants: [
      { id: 'hojas', name: 'Solo hojas (40+ páginas)', price: 18.95, description: 'Guía impresa de Limpieza Consciente con método paso a paso' },
      { id: 'kit', name: 'Kit (Hojas + Boli + Planner A5)', price: 37.95, description: 'Guía impresa + bolígrafo premium + planner A5 artesanal' },
      { id: 'pack', name: 'Pack Completo (Kit + Guantes + Extras)', price: 69.95, description: 'Kit completo + guantes premium + mini producto ecológico + tarjetas + etiquetas + embalaje sostenible' },
    ],
    images: ['/images/products/kit-limpieza-01.png'],
    category: 'kit',
    inStock: true,
    featured: true,
    templatePdf: '/KIT.pdf',
    templatePages: 30,
    thumbnailsFolder: 'kit-limpieza',
    highlights: [
      'Guía completa de 40+ páginas con método de organización consciente',
      'Checklists imprimibles para cada espacio de tu hogar',
      'Ejercicios de desapego: qué conservar, qué soltar',
      'Ritual de cierre energético de cada espacio',
      'Calendario de mantenimiento mensual',
      'Disponible en 3 versiones: HOJAS → KIT → PACK',
    ],
  },
  {
    id: '10',
    name: 'Pack CSI (Citas Altamente Sospechosas) + Planner A5',
    slug: 'pack-csi-citas-altamente-sospechosas',
    description: 'Investiga tus relaciones, descubre patrones, libérate de lo que no te sirve',
    longDescription: `¿Y si pudieras ser la detective de tu propia vida amorosa? ¿Y si, en lugar de repetir los mismos patrones dolorosos, pudieras identificarlos, comprenderlos y romperlos para siempre?

**El Pack CSI (Citas Altamente Sospechosas)** es tu herramienta de investigación emocional. No es solo un cuaderno de reflexión: es un sistema completo para analizar tus relaciones pasadas, presentes y futuras con claridad, humor y muchísimo auto-conocimiento.

Con este pack aprenderás a detectar red flags antes de que se conviertan en dramas, reconocer patrones de comportamiento que se repiten en tus relaciones, entender qué tipo de personas te atraen y por qué, establecer límites claros desde el primer momento, y construir relaciones desde la consciencia, no desde la necesidad.

**🔍 ¿Qué incluye tu Pack CSI?**

📖 **Guía CSI completa de 40+ páginas**: Tu manual de detective emocional con ejercicios, cuestionarios y análisis profundos de tus relaciones.

🕵️‍♀️ **Expedientes de Relaciones Pasadas**: Plantillas para documentar y analizar qué funcionó, qué no, y qué aprendiste.

🚩 **Detector de Red Flags**: Checklists para identificar señales de alerta temprano (antes de que sea demasiado tarde).

💭 **Journaling Guiado**: Prompts que te ayudan a reflexionar sobre tus patrones, creencias y expectativas.

📊 **Análisis de Patrones**: Ejercicios para visualizar qué se repite en tus relaciones y cómo romper esos ciclos.

✨ **Plan de Acción**: Cómo usar todo lo que has descubierto para elegir mejor en el futuro.

---

**¿Por qué este pack es diferente?**

Porque no te juzga. No te dice "elegiste mal". Te ayuda a entender por qué elegiste lo que elegiste, qué necesidad emocional estabas intentando cubrir, y cómo puedes tomar decisiones más conscientes desde hoy.

Es como tener una sesión de terapia infinita en tus manos, pero sin el drama y con mucho humor negro incluido.

**Este pack es para ti si:**
- Sientes que siempre atraes al mismo tipo de persona (spoiler: no es coincidencia)
- Quieres entender tus patrones antes de entrar en otra relación
- Necesitas cerrar ciclos con claridad y auto-compasión
- Estás lista para dejar de repetir la misma película romántica con diferentes actores

Ponte la lupa, detective. Es hora de investigar.`,
    price: 16.95,
    priceFrom: true,
    variants: [
      { id: 'hojas', name: 'Hojas Sueltas (40+ páginas)', price: 16.95, description: 'Guía CSI impresa completa con todos los ejercicios y plantillas' },
      { id: 'kit', name: 'Kit Planner + Boli', price: 36.50, description: 'Guía CSI + Planner A5 artesanal Hogara + bolígrafo premium' },
      { id: 'pack', name: 'Pack CSI Completo', price: 64.95, description: 'Todo lo anterior + lupa decorativa + guantes detective simbólicos + tarjetas de afirmaciones + embalaje especial con sobre confidencial' },
    ],
    images: ['/images/products/postcita-01.png', '/images/products/postcita-02.png'],
    category: 'pack',
    inStock: true,
    featured: true,
    templatePdf: '/KIT POST CITA.pdf',
    templatePages: 13,
    thumbnailsFolder: 'kit-csi',
    highlights: [
      'Guía CSI completa de 40+ páginas con método de análisis emocional',
      'Expedientes de Relaciones Pasadas para documentar y aprender',
      'Detector de Red Flags con checklists detalladas',
      'Journaling guiado con prompts profundos',
      'Análisis de Patrones para visualizar ciclos repetitivos',
      'Plan de Acción para elegir mejor en el futuro',
      'Disponible en 3 versiones: HOJAS → KIT → PACK CSI COMPLETO',
    ],
  },
  {
    id: '11',
    name: 'Pack 21 Días de Ruptura: Ritual de Sanación',
    slug: 'pack-21-dias-ruptura',
    description: 'Sana tu corazón, recupera tu poder, renace desde el amor propio',
    longDescription: `Una ruptura no es solo el final de una relación. Es el inicio de tu proceso de transformación más profundo.

**El Pack 21 Días de Ruptura** es tu compañero de sanación emocional durante las 3 semanas más importantes de tu vida: aquellas en las que eliges soltar el dolor, honrar tu duelo y regresar a ti misma con más fuerza que nunca.

Este no es un cuaderno cualquiera. Es un ritual de 21 días diseñado con amor, ciencia emocional y mucha compasión para ayudarte a:

✨ **Procesar el dolor sin quedarte atrapada en él**  
💔 **Soltar lo que fue sin negar lo que significó**  
🌱 **Reconstruirte desde la raíz, sin prisa pero sin pausa**  
💎 **Recuperar tu poder personal y tu autoestima**  
🔥 **Redescubrir quién eres más allá de esa relación**

---

**🌙 ¿Qué incluye tu Pack de Ruptura?**

📖 **Guía de Sanación de 21 Días (40+ páginas)**: Un viaje paso a paso que te acompaña cada día con ejercicios, reflexiones y rituales de cierre.

💭 **Journaling Profundo**: Preguntas guiadas para procesar emociones, identificar patrones y liberar lo que cargas.

🧘‍♀️ **Ejercicios de Autocuidado Emocional**: Técnicas de respiración, visualización y reconexión contigo misma.

📊 **Tracker de Progreso Emocional**: Para ver cómo avanzas día a día (porque el duelo no es lineal, pero sí tiene movimiento).

✍️ **Cartas de Liberación**: Espacios para escribir lo que necesitas decir (y que tal vez nunca enviarás, pero que tu alma necesita soltar).

🔮 **Ritual de Cierre de Ciclo**: Un ejercicio ceremonial para honrar lo que fue y abrirte a lo que viene.

---

**💎 ¿Qué diferencia a este pack de otros métodos de sanación?**

Porque no te dice "olvídalo y sigue adelante". Te da permiso para sentir todo lo que necesitas sentir, mientras te guía con ternura hacia tu propia reconstrucción.

No es autoayuda tóxica de "supéralo ya". Es sanación real, profunda, respetuosa con tu proceso y con tu dolor.

**Este pack es para ti si:**
- Acabas de terminar una relación y te sientes perdida
- Necesitas un método estructurado para procesar tu duelo
- Quieres sanar sin quedarte atrapada en el victimismo ni en la rabia
- Estás lista para soltar con amor y empezar de nuevo desde tu centro

**Los 21 días más importantes de tu vida comienzan hoy.**`,
    price: 18.95,
    priceFrom: true,
    variants: [
      { 
        id: 'hojas', 
        name: 'Hojas Sueltas (40+ páginas)', 
        price: 18.95, 
        description: 'Guía completa de 21 Días de Ruptura impresa con todos los ejercicios, journaling y rituales' 
      },
      { 
        id: 'kit', 
        name: 'Kit Planner + Boli', 
        price: 39.95, 
        description: 'Guía de Ruptura + Planner A5 artesanal Hogara + bolígrafo premium para tu proceso' 
      },
      { 
        id: 'pack', 
        name: 'Pack Completo Ritual de Sanación', 
        price: 76.95, 
        description: 'Todo lo anterior + vela aromática de sanación + pendientes de autocuidado + cuarzo rosa en forma de corazón + tarjetas de afirmaciones + embalaje especial con mensaje de amor propio' 
      },
    ],
    images: ['/images/products/ruptura-portada.png'],
    category: 'pack',
    inStock: true,
    featured: true,
    templatePdf: '/kit ruptura.pdf',
    templatePages: 21,
    thumbnailsFolder: 'kit-ruptura',
    highlights: [
      'Guía de Sanación de 21 Días completa (40+ páginas)',
      'Journaling profundo con preguntas guiadas',
      'Ejercicios de autocuidado emocional y respiración',
      'Tracker de progreso emocional día a día',
      'Cartas de liberación para soltar lo que cargas',
      'Ritual de cierre de ciclo ceremonial',
      'Disponible en 3 versiones: HOJAS → KIT → PACK COMPLETO RITUAL DE SANACIÓN',
      'Pack completo incluye: vela aromática + pendientes de autocuidado + cuarzo rosa en forma de corazón',
    ],
  },
  {
    id: '5',
    name: 'Tarjeta de los Deseos',
    slug: 'tarjeta-deseos',
    description: 'Dale alas a tus sueños más secretos',
    longDescription: `La magia existe cuando crees en ella. Esta Tarjeta de los Deseos no es un simple papel decorativo: es un ritual, un acto de fe en tus propios sueños.

Escribe tu deseo más profundo, guárdala bajo tu almohada y deja que el universo conspire a tu favor. Con su diseño encantador de unicornio mágico y acabado premium, esta tarjeta es el recordatorio perfecto de que mereces todo lo que anhelas.`,
    price: 8.95,
    images: ['/images/products/tarjeta-deseos.png'],
    category: 'accessory',
    inStock: true,
    featured: false,
    highlights: [
      'Tarjeta de los Deseos en papel de alta calidad',
      'Diseño artesanal con ilustración exclusiva',
      'Espacio para escribir tu deseo más importante',
      'Instrucciones del ritual de manifestación',
    ],
  },

];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter((p) => p.category === category);
}
