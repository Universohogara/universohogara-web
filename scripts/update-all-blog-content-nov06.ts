import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Este script actualiza TODOS los blogs con contenido genuino y añade nuevos blogs
const blogPostsToUpdate = [
  // ===== HOGARA PLANNER (3 artículos) =====
  {
    slug: '5-habitos-matutinos-transformar-dia',
    update: {
      title: '5 Hábitos Matutinos para Transformar tu Día',
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
    }
  },
  {
    slug: 'como-usar-planner-alcanzar-suenos',
    update: {
      title: 'Cómo Usar tu Planner para Alcanzar tus Sueños: Del Ikigai al Time Blocking',
      category: 'hogara-planner',
      excerpt: 'Tu planner no es solo un calendario, es un mapa hacia la vida que deseas crear. Descubre técnicas comprobadas como el Ikigai, time blocking y sistemas de productividad para convertir sueños en realidad.',
      content: `
        <p>Un planner bien utilizado es mucho más que una lista de tareas pendientes. Es una herramienta de transformación personal que traduce tus sueños más grandes en pasos concretos y alcanzables. La diferencia entre quienes logran sus metas y quienes no, a menudo se reduce a un sistema efectivo de planificación.</p>
        
        <h2>El Fundamento: Encuentra tu Ikigai</h2>
        <p>Antes de llenar tu planner con actividades, necesitas claridad sobre tu dirección. El concepto japonés de Ikigai ("razón de ser") proporciona un marco poderoso para identificar metas que realmente importan.</p>
        <p><strong>El método Ikigai identifica cuatro elementos:</strong></p>
        <ul>
          <li>Lo que amas hacer</li>
          <li>En lo que eres bueno</li>
          <li>Lo que el mundo necesita</li>
          <li>Por lo que te pueden pagar (si es relevante)</li>
        </ul>
        <p>Tu Ikigai vive en la intersección de estos cuatro círculos. Usa las primeras páginas de tu planner para explorar estas áreas y definir tus metas alineadas con tu propósito.</p>
        
        <h2>Time Blocking: La Técnica de los Más Productivos</h2>
        <p>El time blocking (bloqueo de tiempo) es una de las técnicas de productividad más efectivas. En lugar de trabajar con una lista de tareas interminable, asignas bloques específicos de tiempo a actividades específicas.</p>
        <p><strong>Cómo implementarlo en tu planner:</strong></p>
        <p>1. <strong>Identifica tus bloques de energía:</strong> Todos tenemos momentos del día con mayor energía mental. Usa tu planner para rastrear durante una semana cuándo te sientes más enfocado y productivo.</p>
        <p>2. <strong>Asigna actividades según energía:</strong> Trabajo profundo (escritura, análisis, creación) en bloques de alta energía. Tareas administrativas (email, llamadas) en bloques de menor energía.</p>
        <p>3. <strong>Bloques de enfoque:</strong> Programa bloques de 90-120 minutos sin interrupciones para trabajo profundo. La investigación muestra que este es el tiempo óptimo antes de necesitar un descanso.</p>
        <p>4. <strong>Buffer time:</strong> Deja espacios de 15-30 minutos entre bloques para transiciones, imprevistos y descansos mentales.</p>
        
        <h2>El Sistema de las 3 Capas de Planificación</h2>
        <p><strong>Capa 1: Visión Anual (Big Picture)</strong></p>
        <p>Dedica las primeras páginas de tu planner a tu visión del año. Define 3-5 metas grandes divididas por áreas de vida: profesional, personal, salud, relaciones, finanzas. Sé específico: "Aumentar ingresos un 30%" en lugar de "ganar más dinero".</p>
        
        <p><strong>Capa 2: Planificación Mensual (Estrategia)</strong></p>
        <p>Al inicio de cada mes, divide tus metas anuales en hitos mensuales. ¿Qué necesitas lograr este mes para estar en camino? Usa el sistema OKR simplificado: Objetivo + 2-3 Resultados Clave medibles.</p>
        
        <p><strong>Capa 3: Planificación Semanal y Diaria (Táctica)</strong></p>
        <p>Cada domingo, planifica tu semana. Cada noche, planifica tu día siguiente. La clave es desglosar las metas grandes en acciones específicas y programadas en tu calendario.</p>
        
        <h2>Tracking Visual: Haz Visible tu Progreso</h2>
        <p>El cerebro humano ama el feedback visual. Incorpora en tu planner:</p>
        <ul>
          <li><strong>Habit trackers:</strong> Cuadrículas donde marcas cada día que completas un hábito</li>
          <li><strong>Color coding:</strong> Asigna colores a diferentes áreas de vida para ver de un vistazo tu balance</li>
          <li><strong>Progress bars:</strong> Barras de progreso para proyectos grandes</li>
          <li><strong>Mood tracking:</strong> Registra tu estado de ánimo para identificar patrones</li>
        </ul>
        
        <h2>La Regla de las 3 Prioridades</h2>
        <p>Cada día, identifica tus 3 MIT (Most Important Tasks). Si solo pudieras completar 3 cosas hoy, ¿cuáles moverían la aguja hacia tus metas? Escríbelas en tu planner antes de cualquier otra cosa.</p>
        <p>Técnica bonus: Marca con una estrella tu #1 MIT del día. Esa tarea merece tu mejor energía y debe completarse antes de revisar email o redes sociales.</p>
        
        <h2>Reflexión Semanal: El Hábito que Cambia Todo</h2>
        <p>Dedica 15-30 minutos cada semana (idealmente domingo por la tarde) para:</p>
        <ul>
          <li>Revisar qué funcionó y qué no</li>
          <li>Celebrar tus victorias (por pequeñas que sean)</li>
          <li>Identificar obstáculos y cómo superarlos</li>
          <li>Ajustar tu plan para la próxima semana</li>
        </ul>
        <p>Este ciclo de retroalimentación convierte tu planner de un documento estático en una herramienta viva de mejora continua.</p>
        
        <h2>De Sueños a Realidad: El Poder de la Acción Consistente</h2>
        <p>Tu planner es el puente entre donde estás y donde quieres estar. Pero recuerda: el planner más bonito del mundo no te llevará a tus sueños. Solo la acción consistente lo hará.</p>
        <p>Empieza hoy. Abre tu planner. Escribe una meta. Define el primer paso. Programa cuándo lo harás. Y luego hazlo.</p>
        <p>Los sueños no se cumplen por magia. Se construyen, un día planificado a la vez.</p>
      `,
      meta_description: 'Guía completa para usar tu planner como herramienta de transformación: Ikigai, time blocking, OKRs y técnicas comprobadas para alcanzar tus sueños.',
      tags: 'planner, productividad, Ikigai, time blocking, metas, organización, sueños',
      featured: false,
      published: true,
    }
  },
  {
    slug: 'productividad-consciente-organizacion-tiempo',
    create: {
      title: 'Productividad Consciente: Herramientas y Estrategias para Organizar tu Tiempo sin Burnout',
      slug: 'productividad-consciente-organizacion-tiempo',
      category: 'hogara-planner',
      excerpt: 'La verdadera productividad no es hacer más cosas, es hacer las cosas correctas con mayor consciencia y menos agotamiento. Descubre herramientas digitales y estrategias internas para una productividad sostenible.',
      content: `
        <p>Vivimos en la era de la hiperproductividad, donde se nos dice que debemos optimizar cada minuto del día. Pero hay un problema: la productividad tradicional nos está llevando al burnout colectivo. La productividad consciente propone un enfoque diferente: no se trata de hacer más, sino de hacer lo importante con mayor presencia y menor desgaste.</p>
        
        <h2>¿Qué es la Productividad Consciente?</h2>
        <p>La productividad consciente es un enfoque que integra autoconocimiento, herramientas estratégicas y gestión de energía (no solo tiempo). Reconoce que tu capacidad productiva no es infinita y que gestionar tu atención es tan importante como gestionar tu agenda.</p>
        <p>Como explica el experto en productividad Cal Newport: "La pregunta no es '¿cuántas horas trabajé?', sino '¿cuántas horas de trabajo profundo y significativo logré?'"</p>
        
        <h2>Las 7 Herramientas Internas de la Productividad Consciente</h2>
        <p>Antes de explorar apps y tecnología, necesitas desarrollar estas habilidades internas:</p>
        
        <h3>1. Orden: Sistemas sobre Motivación</h3>
        <p>Crea sistemas predecibles para tareas recurrentes. Por ejemplo, un sistema para gestionar email (revisar solo 2 veces al día, a las 10 AM y 4 PM) elimina la necesidad de decidir constantemente "¿debería revisar mi email ahora?"</p>
        
        <h3>2. Disciplina: Pequeños Compromisos Diarios</h3>
        <p>La disciplina no es fuerza de voluntad heroica. Es la práctica de cumplir pequeños compromisos contigo mismo cada día. Empieza micro: si dices que vas a escribir 10 minutos, escribe 10 minutos. La confianza en ti mismo se construye cumpliendo.</p>
        
        <h3>3. Planificación: La Noche Anterior es Oro</h3>
        <p>Dedica 10 minutos cada noche a planificar tu día siguiente. Identifica tu tarea más importante y programa cuándo la harás. Esta simple práctica reduce la ansiedad matutina y la parálisis por análisis.</p>
        
        <h3>4. Criterio: Distinguir lo Urgente de lo Importante</h3>
        <p>Usa la Matriz de Eisenhower: Las tareas se dividen en cuatro cuadrantes según urgencia e importancia. El error común es vivir en "urgente pero no importante" (emails reactivos, interrupciones). La magia sucede en "importante pero no urgente" (desarrollo de habilidades, relaciones, planificación estratégica).</p>
        
        <h3>5. Creatividad: Espacio para Pensar</h3>
        <p>La productividad consciente incluye tiempo para no hacer nada. Los mejores insights vienen en la ducha, caminando o descansando. Programa "bloques blancos" en tu calendario: tiempo sin agenda para pensar.</p>
        
        <h3>6. Autocracia: Decide y Comprométete</h3>
        <p>La indecisión consume más energía que una mala decisión. Establece límites claros, toma decisiones basadas en tus valores, y comprométete sin dudar constantemente.</p>
        
        <h3>7. Autoconocimiento: Conoce tus Ritmos</h3>
        <p>¿Eres persona de mañana o de noche? ¿Cuándo tienes mayor energía mental? Rastrea durante dos semanas tu energía y enfoque en diferentes momentos del día. Luego, ajusta tu agenda a tu biología, no al revés.</p>
        
        <h2>Herramientas Digitales para Productividad Consciente</h2>
        <p>Una vez que hayas desarrollado las habilidades internas, las herramientas digitales multiplican tu efectividad:</p>
        
        <h3>Gestión de Tareas y Proyectos</h3>
        <ul>
          <li><strong>Todoist o TickTick:</strong> Captura rápida de tareas, organización por proyectos, recordatorios inteligentes. Perfecto para el método GTD (Getting Things Done).</li>
          <li><strong>Asana o Trello:</strong> Para proyectos colaborativos. Visualiza flujos de trabajo, asigna responsabilidades, rastrea progreso.</li>
          <li><strong>Notion:</strong> Tu "segundo cerebro". Base de datos, wiki personal, gestor de proyectos y notas, todo en uno.</li>
        </ul>
        
        <h3>Gestión de Tiempo y Enfoque</h3>
        <ul>
          <li><strong>RescueTime o Toggl:</strong> Rastrea automáticamente en qué gastas tu tiempo digital. La consciencia es el primer paso del cambio.</li>
          <li><strong>Forest o Freedom:</strong> Bloquea sitios y apps que te distraen durante tus bloques de enfoque profundo.</li>
          <li><strong>Pomodone o Flowtime:</strong> Implementa la técnica Pomodoro (25 min trabajo, 5 min descanso) o su variación más flexible, Flowtime.</li>
        </ul>
        
        <h3>Automatización y Eficiencia</h3>
        <ul>
          <li><strong>Zapier o Make:</strong> Automatiza tareas repetitivas conectando tus apps favoritas.</li>
          <li><strong>TextExpander o Rocket:</strong> Crea atajos para textos que escribes frecuentemente.</li>
        </ul>
        
        <h2>Técnicas de Gestión de Tiempo Consciente</h2>
        
        <h3>Time Boxing (Caja de Tiempo)</h3>
        <p>Asigna un tiempo fijo a cada tarea. Ejemplo: "Responder emails: 30 minutos" en lugar de un vago "responder emails". Esto crea urgencia constructiva y previene la expansión infinita de tareas.</p>
        
        <h3>Time Blocking (Bloqueo de Tiempo)</h3>
        <p>Programa bloques específicos en tu calendario para diferentes tipos de trabajo. Trata estos bloques como citas inamovibles contigo mismo.</p>
        <p>Ejemplo de día bloqueado:</p>
        <ul>
          <li>6:00-7:00 AM: Rutina matutina (ejercicio, meditación)</li>
          <li>7:00-8:00 AM: Desayuno y preparación</li>
          <li>8:00-11:00 AM: Bloque de enfoque profundo (trabajo más importante)</li>
          <li>11:00-11:15 AM: Descanso</li>
          <li>11:15-12:30 PM: Bloque de comunicación (emails, llamadas)</li>
          <li>12:30-1:30 PM: Almuerzo y caminata</li>
          <li>1:30-3:30 PM: Bloque de enfoque (proyectos secundarios)</li>
          <li>3:30-5:00 PM: Tareas administrativas y planificación</li>
        </ul>
        
        <h3>Técnica Pomodoro</h3>
        <p>25 minutos de enfoque total, 5 minutos de descanso. Después de 4 "pomodoros", descanso largo de 15-30 minutos. Esta técnica aprovecha el poder de las micro-recompensas y previene el agotamiento mental.</p>
        
        <h2>La Regla 40%: Productividad Sostenible</h2>
        <p>Investigaciones muestran que desperdiciamos aproximadamente 40% de nuestro tiempo en actividades de bajo valor: distracciones digitales, reuniones innecesarias, "trabajo sobre el trabajo" (emails sobre el proyecto en lugar de trabajar en el proyecto).</p>
        <p>El objetivo de la productividad consciente no es trabajar 16 horas al día, es recuperar ese 40% y usarlo en lo que verdaderamente importa.</p>
        
        <h2>Prevención del Burnout: La Productividad Incluye el Descanso</h2>
        <p>La productividad consciente reconoce que el descanso no es opcional, es estratégico:</p>
        <ul>
          <li>Programa descansos cada 90 minutos (alineado con tu ciclo circadiano ultradiano)</li>
          <li>Desconecta completamente al menos un día a la semana</li>
          <li>Practica el "downshifting": reduce deliberadamente tu ritmo cuando sientes agotamiento</li>
          <li>Duerme 7-9 horas. La privación de sueño reduce tu productividad más que cualquier otra cosa</li>
        </ul>
        
        <h2>Comienza Hoy: Tu Primera Acción</h2>
        <p>No intentes implementar todo de inmediato. Elige UNA herramienta y UNA técnica de esta guía. Practícala durante dos semanas. Evalúa. Ajusta. Luego añade la siguiente.</p>
        <p>La productividad consciente no es un destino, es una práctica. Y como toda práctica, mejora con la repetición y la reflexión.</p>
        <p>Recuerda: El objetivo no es exprimir cada segundo del día. Es crear espacio para lo que verdaderamente importa y tener energía para disfrutarlo.</p>
      `,
      meta_description: 'Descubre la productividad consciente: herramientas digitales, técnicas de gestión del tiempo y estrategias internas para ser más efectivo sin burnout.',
      tags: 'productividad consciente, organización, herramientas, time blocking, gestión del tiempo, bienestar',
      featured: true,
      published: true,
    }
  },
];

async function main() {
  console.log('🔄 Actualizando contenido de blogs existentes...\n');

  for (const blogPost of blogPostsToUpdate) {
    try {
      if (blogPost.update) {
        // Actualizar blog existente
        const existingPost = await prisma.blogPost.findUnique({
          where: { slug: blogPost.slug },
        });

        if (!existingPost) {
          console.log(`⚠️  Blog "${blogPost.slug}" no encontrado para actualizar, saltando...`);
          continue;
        }

        await prisma.blogPost.update({
          where: { slug: blogPost.slug },
          data: blogPost.update,
        });
        console.log(`✅ Actualizado: "${blogPost.update.title}"`);
      } else if (blogPost.create) {
        // Crear nuevo blog
        const existingPost = await prisma.blogPost.findUnique({
          where: { slug: blogPost.create.slug },
        });

        if (existingPost) {
          console.log(`⏭️  Blog "${blogPost.create.title}" ya existe, saltando...`);
          continue;
        }

        await prisma.blogPost.create({
          data: blogPost.create,
        });
        console.log(`✨ Creado nuevo blog: "${blogPost.create.title}"`);
      }
    } catch (error) {
      console.error(`❌ Error procesando blog "${blogPost.slug || blogPost.create?.slug}":`, error);
    }
  }

  console.log('\n🎉 ¡Actualización completada!');
}

main()
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
