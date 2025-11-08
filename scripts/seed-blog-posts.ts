import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const blogPosts = [
  // Hogara Planner (3 artículos)
  {
    title: '5 Hábitos Matutinos para Transformar tu Día',
    slug: '5-habitos-matutinos-transformar-dia',
    category: 'hogara-planner',
    excerpt: 'La ciencia confirma que los primeros 60 minutos después de despertar pueden definir la calidad de tu día completo. Descubre los hábitos matutinos respaldados por investigación que transformarán tu productividad y bienestar.',
    content: `
      <p>La forma en que comienzas tu día no es solo una cuestión de rutina, es neurociencia pura. Durante los primeros 60 minutos después de despertar, tu cerebro se encuentra en un estado especialmente receptivo, donde los hábitos que implementas tienen un impacto desproporcionado en tu día completo.</p>
      
      <h2>1. Hidratación Consciente: Despierta tu Sistema</h2>
      <p>Después de 7-8 horas de ayuno nocturno, tu cuerpo está en un estado de deshidratación leve. Investigaciones muestran que incluso una deshidratación del 1-2% puede reducir significativamente tu función cognitiva, energía y estado de ánimo.</p>
      <p><strong>La práctica:</strong> Bebe 500ml de agua (preferiblemente a temperatura ambiente o tibia) en los primeros 30 minutos después de despertar. Si quieres potenciar el efecto, añade jugo de medio limón para activar tu sistema digestivo y proporcionar vitamina C.</p>
      <p><strong>Por qué funciona:</strong> El agua rehidrata tus células, activa tu metabolismo (aumentándolo hasta un 30% durante la siguiente hora) y ayuda a eliminar toxinas acumuladas durante la noche.</p>
      
      <h2>2. Movimiento Matutino: Activa tu Energía Natural</h2>
      <p>No necesitas una hora en el gimnasio. Estudios demuestran que solo 10-15 minutos de movimiento matutino tienen efectos profundos: aumentan la producción de endorfinas, mejoran la circulación cerebral y elevan tu energía natural sin necesidad de cafeína.</p>
      <p><strong>La práctica:</strong> Elige cualquier forma de movimiento que disfrutes: yoga suave, estiramientos, una caminata corta o ejercicios de movilidad. La clave es la consistencia, no la intensidad.</p>
      <p><strong>El efecto dominó:</strong> Las personas que se mueven por la mañana reportan mejor calidad de sueño por la noche, menor estrés durante el día y mayor adherencia a otros hábitos saludables.</p>
      
      <h2>3. Exposición a Luz Natural: Resetea tu Ritmo Circadiano</h2>
      <p>Este es uno de los hábitos más subestimados y científicamente respaldados. La exposición a luz natural en las primeras 30-60 minutos después de despertar sincroniza tu reloj biológico interno, suprime la melatonina (hormona del sueño) y aumenta el cortisol matutino (que en este contexto es beneficioso para la energía).</p>
      <p><strong>La práctica:</strong> Pasa al menos 10-15 minutos al aire libre sin lentes de sol, o junto a una ventana abierta. En días nublados, necesitarás un poco más de tiempo; en días soleados, 5-10 minutos son suficientes.</p>
      <p><strong>Beneficios comprobados:</strong> Mejora del estado de ánimo, mayor energía diurna, mejor calidad de sueño nocturno y regulación del apetito.</p>
      
      <h2>4. Planificación Intencional: Prioriza lo que Importa</h2>
      <p>Brian Tracy, experto en productividad, popularizó el concepto de "comer ese sapo" – hacer tu tarea más importante primero. La ciencia lo respalda: tu fuerza de voluntad y capacidad de toma de decisiones son más altas por la mañana y se agotan a lo largo del día (fatiga de decisión).</p>
      <p><strong>La práctica:</strong> Dedica 5-10 minutos cada mañana a identificar tus 3 tareas más importantes del día. No simplemente urgentes, sino verdaderamente importantes para tus metas a largo plazo. Usa la técnica 1-3-5: 1 tarea grande, 3 tareas medianas, 5 tareas pequeñas.</p>
      <p><strong>El poder del "MIT":</strong> Identifica tu Most Important Task (MIT) y comprométete a completarla antes de revisar email o redes sociales.</p>
      
      <h2>5. Momento de Conexión Interior: Cultiva la Presencia</h2>
      <p>Ya sea meditación, journaling, lectura inspiradora o simplemente disfrutar tu café en silencio, crear un espacio matutino para conectar contigo mismo tiene efectos profundos en tu bienestar mental y emocional.</p>
      <p><strong>La práctica:</strong> Elige una actividad contemplativa y dedícale 5-15 minutos sin distracciones (teléfono en otro cuarto). Puede ser meditación, escribir 3 cosas por las que estás agradecido, o simplemente sentarte en silencio observando tus pensamientos.</p>
      <p><strong>Investigación:</strong> Un estudio de 2018 mostró que las personas que practican gratitud matutina reportan un 25% más de satisfacción vital y menor prevalencia de síntomas depresivos.</p>
      
      <h2>El Poder del Efecto Dominó</h2>
      <p>Lo fascinante de los hábitos matutinos no es solo su impacto directo, sino el efecto dominó que crean. Cuando comienzas el día con intención, es más probable que tomes decisiones conscientes el resto del día. Es lo que los investigadores llaman "consistencia en cascada".</p>
      
      <h2>Cómo Implementarlos (Sin Abrumarte)</h2>
      <p>No intentes incorporar los 5 hábitos de inmediato. Elige UNO y practícalo durante 2 semanas hasta que se vuelva automático. Luego añade el siguiente. La transformación sostenible es gradual, no dramática.</p>
      
      <p><strong>Recuerda:</strong> El objetivo no es la perfección, es la consistencia. Un hábito matutino imperfecto que practicas regularmente supera ampliamente a una rutina perfecta que abandonas después de una semana.</p>
    `,
    meta_description: 'Descubre los 5 hábitos matutinos respaldados por ciencia que transformarán tu productividad, energía y bienestar desde la primera hora del día.',
    tags: 'productividad, rutina matutina, hábitos, neurociencia, bienestar, organización',
    featured: true,
    published: true,
  },
  {
    title: 'Cómo Usar tu Planner para Alcanzar tus Sueños',
    slug: 'como-usar-planner-alcanzar-suenos',
    category: 'hogara-planner',
    excerpt: 'Tu planner es más que un calendario: es tu mapa hacia la vida que deseas crear.',
    content: `
      <p>Un planner no es solo una herramienta de organización, es un espacio sagrado donde tus sueños se encuentran con la acción.</p>
      
      <h2>Convierte Sueños en Metas</h2>
      <p>Empieza escribiendo tus sueños más grandes. Luego, desglósalos en metas mensuales, semanales y diarias. Cada pequeño paso cuenta.</p>
      
      <h2>Tracking Visual</h2>
      <p>Usa colores, stickers y trackers para hacer visible tu progreso. Ver tus avances te motivará a continuar.</p>
      
      <h2>Reflexión Semanal</h2>
      <p>Dedica tiempo cada semana para revisar qué funcionó y qué puedes mejorar. La planificación es un proceso vivo.</p>
      
      <h2>Celebra Cada Victoria</h2>
      <p>No esperes alcanzar la meta final para celebrar. Cada paso completado merece reconocimiento.</p>
    `,
    meta_description: 'Aprende a usar tu planner como una herramienta poderosa para alcanzar tus sueños y metas',
    tags: 'planner, metas, sueños, planificación, organización',
    featured: false,
    published: true,
  },

  // Hogara Pet
  {
    title: 'El Lenguaje Secreto de los Gatos: Guía Completa',
    slug: 'lenguaje-secreto-gatos-guia-completa',
    category: 'hogara-pet',
    excerpt: 'Aprende a entender lo que tu gato realmente te está diciendo con cada maullido, ronroneo y movimiento.',
    content: `
      <p>Los gatos son maestros de la comunicación no verbal. Cada movimiento de cola, posición de orejas y tipo de maullido tiene un significado específico.</p>
      
      <h2>Los Maullidos</h2>
      <p>Contrario a la creencia popular, los gatos adultos rara vez maúllan entre ellos. Este comportamiento está reservado principalmente para comunicarse con humanos. Un maullido corto suele ser un saludo, mientras que uno prolongado puede indicar hambre o demanda de atención.</p>
      
      <h2>El Ronroneo</h2>
      <p>Aunque generalmente asociamos el ronroneo con felicidad, los gatos también ronronean cuando están estresados o enfermos. Es su forma de autocalmarse.</p>
      
      <h2>La Cola Habla</h2>
      <p>Una cola erguida con la punta ligeramente curvada indica un gato feliz y confiado. Una cola esponjada señala miedo o agresión. Una cola que se mueve rápidamente de lado a lado significa irritación.</p>
      
      <h2>Las Orejas</h2>
      <p>Las orejas hacia adelante muestran curiosidad. Hacia los lados indican inquietud. Hacia atrás y aplanadas son señal de miedo o agresión inminente.</p>
      
      <h2>El Parpadeo Lento</h2>
      <p>Cuando tu gato te mira y parpadea lentamente, es su forma de decir "te quiero". Responde de la misma manera para fortalecer vuestro vínculo.</p>
    `,
    meta_description: 'Guía completa para entender el lenguaje corporal y vocal de tu gato',
    tags: 'gatos, comportamiento felino, comunicación animal, mascotas',
    featured: true,
    published: true,
  },
  {
    title: 'Cómo Crear un Jardín Seguro para tus Mascotas',
    slug: 'crear-jardin-seguro-mascotas',
    category: 'hogara-pet',
    excerpt: 'Transforma tu jardín en un espacio seguro y estimulante para tus compañeros peludos.',
    content: `
      <p>Un jardín puede ser un paraíso para tus mascotas, pero es importante hacerlo seguro y enriquecedor.</p>
      
      <h2>Plantas Seguras</h2>
      <p>Evita plantas tóxicas como lirios, azaleas y tulipanes. Opta por hierbas seguras como romero, albahaca y menta, que además pueden enriquecer su experiencia sensorial.</p>
      
      <h2>Zonas de Exploración</h2>
      <p>Crea diferentes áreas con texturas variadas: césped, piedras lisas, arena. Esto estimula sus sentidos y les da opciones para diferentes actividades.</p>
      
      <h2>Refugios y Sombra</h2>
      <p>Asegúrate de tener áreas con sombra y refugios donde puedan descansar y sentirse seguros.</p>
      
      <h2>Cerca Segura</h2>
      <p>Verifica que tu cerca sea suficientemente alta y sin huecos por donde puedan escapar.</p>
    `,
    meta_description: 'Crea un jardín seguro y estimulante para tus mascotas con estos consejos prácticos',
    tags: 'mascotas, jardín, seguridad, perros, gatos',
    featured: false,
    published: true,
  },

  // Hogara Mind
  {
    title: 'Meditación para Principiantes: Tu Primer Paso',
    slug: 'meditacion-principiantes-primer-paso',
    category: 'hogara-mind',
    excerpt: 'La meditación no requiere horas de práctica ni perfección. Comienza hoy mismo con esta guía simple.',
    content: `
      <p>La meditación es una de las herramientas más poderosas para el bienestar mental, pero muchos se sienten intimidados al comenzar. La verdad es que no necesitas ser un monje ni tener la mente en blanco para meditar.</p>
      
      <h2>Qué es (y qué no es) Meditar</h2>
      <p>Meditar no es detener tus pensamientos. Es observarlos sin juzgarlos. Es crear un espacio entre el estímulo y tu respuesta.</p>
      
      <h2>Tu Primera Meditación (5 minutos)</h2>
      <p>1. Encuentra un lugar cómodo donde no te interrumpan.</p>
      <p>2. Siéntate con la espalda recta pero relajada.</p>
      <p>3. Cierra los ojos o mantén una mirada suave hacia el suelo.</p>
      <p>4. Respira naturalmente y lleva tu atención a la sensación del aire entrando y saliendo.</p>
      <p>5. Cuando tu mente divague (y lo hará), simplemente nota "estoy pensando" y vuelve suavemente a tu respiración.</p>
      
      <h2>Consejos para Mantener la Práctica</h2>
      <p>- Empieza con 5 minutos y aumenta gradualmente</p>
      <p>- Medita a la misma hora cada día</p>
      <p>- No te juzgues si tu mente está inquieta</p>
      <p>- Usa apps o música si te ayuda al principio</p>
      
      <p>La consistencia es más importante que la duración. Cinco minutos diarios tienen más impacto que una hora ocasional.</p>
    `,
    meta_description: 'Guía simple y práctica para comenzar tu práctica de meditación hoy mismo',
    tags: 'meditación, mindfulness, bienestar mental, principiantes',
    featured: true,
    published: true,
  },
  {
    title: 'Neuroplasticidad: Tu Cerebro Puede Cambiar',
    slug: 'neuroplasticidad-cerebro-puede-cambiar',
    category: 'hogara-mind',
    excerpt: 'Descubre cómo tu cerebro tiene la capacidad de transformarse a cualquier edad.',
    content: `
      <p>Durante décadas, se creía que el cerebro adulto era estático. Hoy sabemos que tu cerebro es maleable como la arcilla, capaz de crear nuevas conexiones y fortalecer las existentes a lo largo de toda tu vida.</p>
      
      <h2>¿Qué es la Neuroplasticidad?</h2>
      <p>Es la capacidad del cerebro de reorganizarse formando nuevas conexiones neuronales. Cada vez que aprendes algo nuevo, tu cerebro cambia físicamente.</p>
      
      <h2>Cómo Aprovechar la Neuroplasticidad</h2>
      <p>- Aprende nuevas habilidades regularmente</p>
      <p>- Desafía tu mente con actividades complejas</p>
      <p>- Mantén una práctica de mindfulness</p>
      <p>- Duerme bien (es cuando tu cerebro consolida el aprendizaje)</p>
      <p>- Mantente físicamente activo</p>
      
      <h2>Nunca es Tarde</h2>
      <p>Ya tengas 25 o 75 años, tu cerebro conserva su capacidad de cambio. Los hábitos que parecían imposibles de romper pueden transformarse. Las habilidades que creías inalcanzables pueden desarrollarse.</p>
      
      <p>Tu cerebro es tu aliado más poderoso en cualquier proceso de transformación personal.</p>
    `,
    meta_description: 'Explora la neuroplasticidad y cómo aprovecharla para transformar tu vida',
    tags: 'neuroplasticidad, cerebro, aprendizaje, transformación personal',
    featured: false,
    published: true,
  },

  // Hogara Home
  {
    title: 'Minimalismo: Menos es Más en tu Hogar',
    slug: 'minimalismo-menos-mas-hogar',
    category: 'hogara-home',
    excerpt: 'El minimalismo no es vacío, es espacio para lo que realmente importa.',
    content: `
      <p>El minimalismo no se trata de vivir con lo mínimo indispensable, sino de crear espacio para lo que verdaderamente añade valor a tu vida.</p>
      
      <h2>Por Dónde Empezar</h2>
      <p>Elige una zona pequeña: un cajón, un estante, una superficie. Pregúntate por cada objeto: ¿Me sirve? ¿Me hace feliz? ¿Lo usé en el último año?</p>
      
      <h2>El Método de las 4 Cajas</h2>
      <p>- Conservar: Objetos que usas y amas</p>
      <p>- Donar: En buen estado pero no los necesitas</p>
      <p>- Tirar: Rotos o en mal estado</p>
      <p>- Decidir después: Si dudas, guárdalos 6 meses. Si no los usaste, déjalos ir.</p>
      
      <h2>Mantenimiento Diario</h2>
      <p>Por cada objeto nuevo que entre, uno debe salir. Dedica 10 minutos al día a mantener el orden.</p>
      
      <h2>Los Beneficios</h2>
      <p>- Menos tiempo limpiando</p>
      <p>- Más claridad mental</p>
      <p>- Espacio para nuevas experiencias</p>
      <p>- Mayor apreciación por lo que tienes</p>
      
      <p>Un hogar minimalista es un hogar que respira, y cuando tu espacio respira, tú también.</p>
    `,
    meta_description: 'Guía práctica para aplicar el minimalismo en tu hogar y transformar tu espacio',
    tags: 'minimalismo, hogar, organización, estilo de vida',
    featured: true,
    published: true,
  },
  {
    title: 'Feng Shui Básico para Principiantes',
    slug: 'feng-shui-basico-principiantes',
    category: 'hogara-home',
    excerpt: 'Aprende los principios básicos del Feng Shui para armonizar la energía de tu hogar.',
    content: `
      <p>El Feng Shui es el antiguo arte chino de armonizar la energía en los espacios. No necesitas ser experto para aplicar sus principios básicos.</p>
      
      <h2>La Entrada: Tu Primera Impresión</h2>
      <p>Mantén tu entrada despejada y bien iluminada. Es por donde entra la energía (y la abundancia) a tu hogar.</p>
      
      <h2>El Bagua: Mapa Energético</h2>
      <p>Divide mentalmente tu hogar en 9 áreas que representan diferentes aspectos de tu vida: carrera, relaciones, salud, etc.</p>
      
      <h2>Los 5 Elementos</h2>
      <p>- Madera: Crecimiento (plantas, verde)</p>
      <p>- Fuego: Pasión (velas, rojo)</p>
      <p>- Tierra: Estabilidad (cerámica, amarillo)</p>
      <p>- Metal: Claridad (metales, blanco)</p>
      <p>- Agua: Fluidez (fuentes, azul)</p>
      
      <h2>Tips Rápidos</h2>
      <p>- Mantén espejos alejados de la cama</p>
      <p>- Coloca plantas en el área de salud</p>
      <p>- Repara todo lo que esté roto</p>
      <p>- Abre ventanas diariamente</p>
    `,
    meta_description: 'Principios básicos de Feng Shui para armonizar la energía de tu hogar',
    tags: 'feng shui, hogar, energía, armonía, decoración',
    featured: false,
    published: true,
  },

  // Hogara Luz
  {
    title: 'Rituales de Luna Nueva: Manifestación y Nuevos Comienzos',
    slug: 'rituales-luna-nueva-manifestacion',
    category: 'hogara-luz',
    excerpt: 'La Luna Nueva es el momento perfecto para plantar las semillas de tus intenciones.',
    content: `
      <p>La Luna Nueva representa nuevos comienzos, es el momento de oscuridad antes del crecimiento. Es el momento ideal para establecer intenciones y comenzar nuevos proyectos.</p>
      
      <h2>Por Qué la Luna Nueva</h2>
      <p>En astrología, la Luna Nueva marca el inicio de un ciclo lunar de 29.5 días. Es un momento de energía receptiva, perfecta para la reflexión interna y la manifestación.</p>
      
      <h2>Ritual Simple de Luna Nueva</h2>
      
      <h3>1. Preparación</h3>
      <p>Limpia tu espacio con salvia o palo santo. Enciende una vela blanca. Prepara tu diario y un bolígrafo.</p>
      
      <h3>2. Meditación</h3>
      <p>Cierra los ojos y respira profundamente. Visualiza tus deseos como si ya fueran realidad. Siente las emociones que te producirían.</p>
      
      <h3>3. Escritura de Intenciones</h3>
      <p>Escribe entre 3 y 10 intenciones en presente: "Soy...", "Tengo...", "Creo...". Sé específico pero flexible en el cómo.</p>
      
      <h3>4. Cierre</h3>
      <p>Lee tus intenciones en voz alta. Agradece como si ya se hubieran manifestado. Guarda tus intenciones en un lugar sagrado.</p>
      
      <h2>Después del Ritual</h2>
      <p>Revisa tus intenciones en la Luna Llena (14 días después) para evaluar el progreso. Toma acciones alineadas con tus deseos.</p>
      
      <p>La magia real sucede cuando la intención se encuentra con la acción.</p>
    `,
    meta_description: 'Ritual completo de Luna Nueva para manifestar tus intenciones y comenzar nuevos ciclos',
    tags: 'luna nueva, rituales, manifestación, intenciones, espiritualidad',
    featured: true,
    published: true,
  },
  {
    title: 'Cristales para Principiantes: Guía Básica',
    slug: 'cristales-principiantes-guia-basica',
    category: 'hogara-luz',
    excerpt: 'Descubre el poder de los cristales y cómo incorporarlos en tu vida diaria.',
    content: `
      <p>Los cristales han sido utilizados durante milenios por diversas culturas para sanación, protección y manifestación.</p>
      
      <h2>Los 7 Cristales Esenciales</h2>
      
      <h3>Cuarzo Transparente</h3>
      <p>El "maestro sanador". Amplifica energía y claridad. Versátil para cualquier intención.</p>
      
      <h3>Amatista</h3>
      <p>Protección, intuición y conexión espiritual. Perfecta para meditación.</p>
      
      <h3>Cuarzo Rosa</h3>
      <p>El cristal del amor propio y las relaciones. Abre el chakra del corazón.</p>
      
      <h3>Citrino</h3>
      <p>Abundancia, manifestación y alegría. El cristal del "dinero".</p>
      
      <h3>Obsidiana Negra</h3>
      <p>Protección poderosa. Absorbe energías negativas.</p>
      
      <h3>Labradorita</h3>
      <p>Transformación y despertar espiritual. Protege el aura.</p>
      
      <h3>Selenita</h3>
      <p>Limpieza y carga de otros cristales. Alta vibración.</p>
      
      <h2>Cómo Usarlos</h2>
      <p>- Llévalos contigo en el bolsillo</p>
      <p>- Medita sosteniéndolos</p>
      <p>- Colócalos en tu espacio</p>
      <p>- Crea grids (patrones geométricos)</p>
      
      <h2>Limpieza y Carga</h2>
      <p>Limpiar: Agua, humo de salvia, o sonido</p>
      <p>Cargar: Luz de luna llena, tierra, o con selenita</p>
      
      <p>Confía en tu intuición al elegir cristales. Ellos también te eligen a ti.</p>
    `,
    meta_description: 'Guía completa de cristales para principiantes: usos, propiedades y cuidados',
    tags: 'cristales, piedras, energía, espiritualidad, sanación',
    featured: false,
    published: true,
  },

  // Hogara Esencia
  {
    title: 'Tu Propósito de Vida: Cómo Descubrirlo',
    slug: 'proposito-vida-como-descubrirlo',
    category: 'hogara-esencia',
    excerpt: 'No necesitas encontrar tu propósito, necesitas recordarlo.',
    content: `
      <p>Tu propósito de vida no es algo que encuentras "ahí fuera". Es algo que descubres al mirar hacia adentro.</p>
      
      <h2>Señales de que Estás Alineado con tu Propósito</h2>
      <p>- Pierdes la noción del tiempo cuando lo haces</p>
      <p>- Te sientes energizado, no agotado</p>
      <p>- Sientes que estás contribuyendo al mundo</p>
      <p>- Conecta con tus valores más profundos</p>
      
      <h2>Ejercicio: Las 3 Preguntas</h2>
      
      <h3>1. ¿Qué me apasiona?</h3>
      <p>Escribe todo lo que te hace sentir vivo, sin filtrar ni juzgar.</p>
      
      <h3>2. ¿En qué soy naturalmente bueno?</h3>
      <p>Incluye tanto habilidades técnicas como cualidades personales.</p>
      
      <h3>3. ¿Qué problema quiero resolver en el mundo?</h3>
      <p>¿Qué te duele del mundo? ¿Qué quieres cambiar?</p>
      
      <p>Tu propósito vive en la intersección de estas tres respuestas.</p>
      
      <h2>Tu Propósito Puede Evolucionar</h2>
      <p>No es una decisión única e inamovible. Puedes tener diferentes propósitos en diferentes etapas de tu vida. Lo importante es vivir con intención.</p>
      
      <h2>Empezando Hoy</h2>
      <p>No esperes tener todo resuelto para comenzar. Da el primer paso en la dirección que resuena contigo. La claridad viene con la acción, no antes.</p>
      
      <p>Tu propósito no es tu profesión, es la forma en que eliges vivir e impactar al mundo.</p>
    `,
    meta_description: 'Guía práctica para descubrir tu propósito de vida y vivir con intención',
    tags: 'propósito de vida, autoconocimiento, desarrollo personal, esencia',
    featured: true,
    published: true,
  },
  {
    title: 'Shadow Work: Integrando tu Sombra',
    slug: 'shadow-work-integrando-sombra',
    category: 'hogara-esencia',
    excerpt: 'El trabajo con la sombra es uno de los caminos más poderosos hacia la autenticidad.',
    content: `
      <p>Tu "sombra" son todos los aspectos de ti que has reprimido, negado o escondido. El trabajo con la sombra consiste en traer luz a esa oscuridad.</p>
      
      <h2>¿Qué es la Sombra?</h2>
      <p>Concepto popularizado por Carl Jung, la sombra contiene las partes de nosotros que consideramos inaceptables: ira, envidia, miedo, deseos "inapropiados". Pero también incluye fortalezas que nos enseñaron a esconder.</p>
      
      <h2>Señales de Sombra No Integrada</h2>
      <p>- Reacciones emocionales desproporcionadas</p>
      <p>- Juicio intenso hacia otros</p>
      <p>- Patrones repetitivos autodestructivos</p>
      <p>- Miedo a mostrar ciertas partes de ti</p>
      
      <h2>Ejercicio de Shadow Work</h2>
      
      <h3>1. Identifica tus Triggers</h3>
      <p>¿Qué comportamientos en otros te molestan intensamente? A menudo, lo que más te molesta en otros es lo que niegas en ti.</p>
      
      <h3>2. Diálogo con tu Sombra</h3>
      <p>Escribe una carta a ese aspecto de ti. Pregúntale: ¿Qué necesitas? ¿Qué estás tratando de proteger? ¿Qué te asusta?</p>
      
      <h3>3. Integración</h3>
      <p>No se trata de eliminar la sombra, sino de reconocerla, aceptarla y encontrar formas saludables de expresarla.</p>
      
      <h2>El Regalo de la Sombra</h2>
      <p>Cuando integras tu sombra, recuperas energía que estabas usando para reprimirla. Te vuelves más auténtico, compasivo y completo.</p>
      
      <p>La oscuridad no es el enemigo. Es el vientre donde nace la transformación.</p>
    `,
    meta_description: 'Introducción al shadow work: cómo integrar tu sombra para mayor autenticidad',
    tags: 'shadow work, sombra, Jung, desarrollo personal, autoconocimiento',
    featured: false,
    published: true,
  },

  // Hogara App
  {
    title: 'Productividad Digital: Apps que Cambiarán tu Vida',
    slug: 'productividad-digital-apps-vida',
    category: 'hogara-app',
    excerpt: 'Las herramientas digitales correctas pueden multiplicar tu efectividad sin añadir complejidad.',
    content: `
      <p>La tecnología puede ser una bendición o una distracción. La clave está en elegir las herramientas correctas y usarlas con intención.</p>
      
      <h2>Categorías Esenciales</h2>
      
      <h3>1. Gestión de Tareas</h3>
      <p>Todoist o TickTick: Captura y organiza todo lo que necesitas hacer. La mente es para tener ideas, no para almacenarlas.</p>
      
      <h3>2. Toma de Notas</h3>
      <p>Notion o Obsidian: Tu segundo cerebro. Captura ideas, organiza conocimiento, conecta conceptos.</p>
      
      <h3>3. Enfoque Profundo</h3>
      <p>Forest o Freedom: Bloquea distracciones cuando necesitas concentración total.</p>
      
      <h3>4. Hábitos</h3>
      <p>Habitica o Streaks: Gamifica tu progreso y mantén tus rutinas.</p>
      
      <h3>5. Meditación</h3>
      <p>Insight Timer o Calm: Para mantener tu paz mental en el mundo digital.</p>
      
      <h2>Principios de Uso</h2>
      <p>- Menos es más: No necesitas 20 apps</p>
      <p>- Un propósito por app: Evita redundancia</p>
      <p>- Revisa y simplifica trimestralmente</p>
      <p>- La app no es la solución, es la herramienta</p>
      
      <h2>Minimalismo Digital</h2>
      <p>Antes de añadir una nueva app, pregúntate: ¿Realmente necesito esto? ¿O estoy procrastinando la acción real?</p>
      
      <p>Las mejores apps son las que desaparecen en el fondo y te permiten enfocarte en lo que importa.</p>
    `,
    meta_description: 'Las mejores apps de productividad digital y cómo usarlas efectivamente',
    tags: 'productividad, apps, tecnología, organización digital, minimalismo digital',
    featured: true,
    published: true,
  },
  {
    title: 'Cómo Crear una Rutina Digital Saludable',
    slug: 'crear-rutina-digital-saludable',
    category: 'hogara-app',
    excerpt: 'El bienestar digital no es una opción, es una necesidad en el mundo moderno.',
    content: `
      <p>Pasamos horas diarias en dispositivos digitales. Es crucial crear límites saludables para proteger nuestra energía y atención.</p>
      
      <h2>Síntomas de Sobrecarga Digital</h2>
      <p>- Revisar el teléfono compulsivamente</p>
      <p>- Dificultad para concentrarse</p>
      <p>- Ansiedad cuando no tienes tu teléfono</p>
      <p>- Fatiga visual constante</p>
      <p>- Sueño interrumpido</p>
      
      <h2>Tu Rutina Digital Saludable</h2>
      
      <h3>Mañana</h3>
      <p>- No revises el teléfono por 1 hora después de despertar</p>
      <p>- Desactiva todas las notificaciones no esenciales</p>
      <p>- Modo avión durante tu rutina matutina</p>
      
      <h3>Durante el Día</h3>
      <p>- Bloques de enfoque profundo sin dispositivos</p>
      <p>- Revisa email/mensajes en horarios específicos (no constantemente)</p>
      <p>- Regla 20-20-20: Cada 20 minutos, mira a 20 pies de distancia por 20 segundos</p>
      
      <h3>Noche</h3>
      <p>- Carga el teléfono fuera del dormitorio</p>
      <p>- Filtro de luz azul después de las 8 PM</p>
      <p>- No pantallas 1 hora antes de dormir</p>
      
      <h2>Auditoría de Apps</h2>
      <p>Revisa el tiempo de pantalla semanal. Pregúntate: ¿Estas apps añaden valor o solo consumen tiempo?</p>
      
      <p>Tu atención es tu recurso más valioso. Protégela como protegerías tu dinero.</p>
    `,
    meta_description: 'Crea una rutina digital saludable para proteger tu bienestar en la era tecnológica',
    tags: 'bienestar digital, rutinas, tecnología, salud mental, balance',
    featured: false,
    published: true,
  },
];

async function main() {
  console.log('🌱 Seeding blog posts...');

  for (const post of blogPosts) {
    try {
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug: post.slug },
      });

      if (existingPost) {
        console.log(`⏭️  Post "${post.title}" already exists, skipping...`);
        continue;
      }

      await prisma.blogPost.create({
        data: post,
      });
      console.log(`✅ Created post: "${post.title}"`);
    } catch (error) {
      console.error(`❌ Error creating post "${post.title}":`, error);
    }
  }

  console.log('✨ Blog posts seeding completed!');
}

main()
  .catch((error) => {
    console.error('Error seeding blog posts:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
