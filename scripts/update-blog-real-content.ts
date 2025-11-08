import { prisma } from '../lib/db';

// Contenido real basado en investigación de internet

const realBlogContent = {
  // HOGARA PLANNER
  '5-habitos-matutinos-transformar-dia': {
    title: '5 Hábitos Matutinos para Transformar tu Día',
    excerpt: 'La forma en que comienzas tu día establece el tono para todo lo que viene después. Descubre cómo simples rutinas matutinas pueden mejorar tu energía, reducir el estrés y aumentar tu productividad.',
    content: `
      <p>Los hábitos matutinos no son solo una moda de productividad; están respaldados por investigación científica que demuestra cómo las primeras horas del día pueden influir en tu bienestar físico, mental y emocional para las siguientes 16 horas.</p>

      <h2>1. Hidr\u00e1tate Inmediatamente al Despertar</h2>
      <p>Tu cuerpo acaba de pasar 6-8 horas sin agua. Los expertos recomiendan beber <strong>500-750 ml de agua</strong> en los primeros 30 minutos después de despertar.</p>
      <p><strong>Beneficios comprobados:</strong></p>
      <ul>
        <li>Mejora la circulación y reduce la fatiga</li>
        <li>Activa el metabolismo y mejora la digestión</li>
        <li>Aumenta la claridad mental hasta en un 26% según estudios</li>
        <li>Reduce niveles de ansiedad y mejora la concentración</li>
      </ul>
      <p class="tip">💡 Tip: Prepara tu botella de agua la noche anterior y déjala en tu mesita de noche.</p>

      <h2>2. Movimiento Físico (Solo 10 Minutos)</h2>
      <p>No necesitas una rutina de gimnasio completa. Incluso 10 minutos de movimiento activan tu sistema nervioso y preparan tu cuerpo para el día.</p>
      <p><strong>Opciones simples:</strong></p>
      <ul>
        <li>Caminata ligera o saltar la cuerda</li>
        <li>Estiramientos suaves o yoga</li>
        <li>5-10 minutos de ejercicio cardiovascular</li>
      </ul>
      <p><strong>¿Por qué funciona?</strong> El ejercicio matutino eleva endorfinas (hormonas de la felicidad), mejora la circulación y, según la Universidad de Bath, ayuda a quemar grasa y mejorar la sensibilidad a la insulina.</p>

      <h2>3. Exposición a Luz Natural</h2>
      <p>Salir al exterior o exponerte a luz brillante (5,000-10,000 lux) en los primeros 30 minutos después de despertar regula tu ritmo circadiano.</p>
      <p><strong>Beneficios:</strong></p>
      <ul>
        <li>Mejora la calidad del sueño nocturno</li>
        <li>Estabiliza los niveles de cortisol (hormona del estrés)</li>
        <li>Aumenta la producción de serotonina (mejora el ánimo)</li>
        <li>Proporciona vitamina D natural</li>
      </ul>

      <h2>4. Práctica de Gratitud o Meditación (5 Minutos)</h2>
      <p>Antes de revisar tu teléfono, dedica 5 minutos a centrarte mentalmente.</p>
      <p><strong>Opciones simples:</strong></p>
      <ul>
        <li><strong>Gratitud:</strong> Escribe o piensa en 3 cosas por las que estás agradecido</li>
        <li><strong>Respiración consciente:</strong> 10 respiraciones profundas para bajar el cortisol</li>
        <li><strong>Meditación:</strong> Incluso 5 minutos cambian estructuras cerebrales</li>
      </ul>
      <p>La investigación de Harvard muestra que la meditación regular mejora la regulación emocional y reduce la ansiedad.</p>

      <h2>5. Planifica tus 3 Prioridades del Día</h2>
      <p>Antes de sumergirte en emails o redes sociales, define las 3 cosas más importantes que quieres lograr hoy.</p>
      <p><strong>Por qué funciona:</strong></p>
      <ul>
        <li>Te da sensación de control y propósito</li>
        <li>Reduce el estrés y la sensación de estar abrumado</li>
        <li>Aumenta la productividad y el enfoque</li>
      </ul>
      <p class="tip">💡 Usa tu planner para escribirlo. El acto físico de escribir aumenta el compromiso.</p>

      <h2>¿Cuánto Tiempo Necesitas?</h2>
      <p>Con solo <strong>30-45 minutos</strong> puedes incorporar estos 5 hábitos. Los expertos sugieren que en 4 semanas de práctica consistente notarás diferencias significativas en tu energía, humor y productividad.</p>

      <h2>Empieza Pequeño</h2>
      <p>No necesitas implementar los 5 hábitos mañana. Elige UNO, hazlo por una semana, y luego añade otro. La consistencia es más importante que la perfección.</p>
      
      <p class="highlight">✨ Recuerda: Los primeros 30-60 minutos de tu día son los más importantes. Inviértelos en ti mismo, no en tu teléfono.</p>
    `,
    tags: 'rutinas matutinas, hábitos saludables, productividad, bienestar, planner'
  },

  'como-usar-planner-alcanzar-suenos': {
    title: 'Cómo Usar tu Planner para Alcanzar tus Sueños',
    excerpt: 'Un planner no es solo un calendario. Es una herramienta poderosa para transformar tus sueños en metas alcanzables y tus metas en acciones diarias. Aprende a usarlo estratégicamente.',
    content: `
      <p>¿Alguna vez has comprado un planner hermoso lleno de entusiasmo, solo para abandonarlo en febrero? No estás sola. El problema no es el planner—es cómo lo estás usando.</p>

      <h2>¿Por Qué un Planner es más que una Agenda?</h2>
      <p>Una agenda solo registra eventos. Un planner bien usado es un sistema para:</p>
      <ul>
        <li><strong>Externalizar tu mente:</strong> Reduce la carga mental y el estrés</li>
        <li><strong>Dar visibilidad a tus prioridades:</strong> Lo que se ve, se hace</li>
        <li><strong>Rastrear tu progreso:</strong> Ver avances aumenta la motivación</li>
        <li><strong>Crear hábitos sostenibles:</strong> La repetición genera cambio</li>
      </ul>

      <h2>Paso 1: Define tus Metas (No Solo las Escribas)</h2>
      <p>Antes de abrir tu planner, necesitas claridad.</p>
      
      <h3>Ejercicio: El Método Ikigai Simplificado</h3>
      <ul>
        <li><strong>¿Qué amas hacer?</strong> (Tu pasión)</li>
        <li><strong>¿En qué eres buena?</strong> (Tus talentos)</li>
        <li><strong>¿Qué necesita el mundo?</strong> (Tu contribución)</li>
        <li><strong>¿Qué te sostiene económicamente?</strong> (Tu realidad)</li>
      </ul>
      <p>Tus metas más significativas vivirán en la intersección de estas 4 áreas.</p>

      <h2>Paso 2: Usa la Matriz de Eisenhower</h2>
      <p>No todas las tareas son iguales. Clasifica tus actividades en:</p>
      <ul>
        <li><strong>Urgente e Importante:</strong> Crisis, deadlines (haz AHORA)</li>
        <li><strong>No Urgente pero Importante:</strong> Planeación, aprendizaje, ejercicio (PLANIFICA)</li>
        <li><strong>Urgente pero No Importante:</strong> Interrupciones, emails (DELEGA o minimiza)</li>
        <li><strong>Ni Urgente ni Importante:</strong> Distracciones (ELIMINA)</li>
      </ul>
      <p class="highlight">💡 El secreto: El 80% de tus resultados viene del 20% de tus actividades. Identifícalas.</p>

      <h2>Paso 3: Planificación en 3 Niveles</h2>
      
      <h3>Nivel 1: Visión Anual (Panorama)</h3>
      <p>Al inicio del año, dedica 1-2 horas a responder:</p>
      <ul>
        <li>¿Qué logros me harían sentir que este año fue exitoso?</li>
        <li>¿Qué hábitos quiero cultivar?</li>
        <li>¿Qué experiencias quiero vivir?</li>
      </ul>
      <p>Escribe 3-5 metas anuales en tu planner. Estos son tus "Nortes".</p>

      <h3>Nivel 2: Revisión Mensual (Ajuste)</h3>
      <p>El último domingo de cada mes, revisa:</p>
      <ul>
        <li>¿Qué logré este mes?</li>
        <li>¿Qué no funcionó y por qué?</li>
        <li>¿Qué 3 prioridades tengo para el próximo mes?</li>
      </ul>

      <h3>Nivel 3: Planificación Semanal (Acción)</h3>
      <p>Cada lunes (o domingo noche), dedica 15-20 minutos a:</p>
      <ul>
        <li>Revisar tu calendario de la semana</li>
        <li>Identificar tus 3 prioridades semanales</li>
        <li>Asignar tiempo específico para cada tarea importante (Time Blocking)</li>
        <li>Dejar espacios buffer para imprevistos</li>
      </ul>

      <h2>Paso 4: El Poder del Time Blocking</h2>
      <p>En lugar de hacer listas interminables, asigna bloques de tiempo específicos:</p>
      <ul>
        <li><strong>9:00-10:30:</strong> Tarea de alta prioridad (tu mente está fresca)</li>
        <li><strong>10:30-10:45:</strong> Descanso (camina, estírate)</li>
        <li><strong>10:45-12:00:</strong> Reuniones o emails</li>
        <li><strong>12:00-13:00:</strong> Almuerzo sin pantallas</li>
      </ul>
      <p><strong>Tip de Elon Musk:</strong> Divide tu día en bloques de 5 minutos. No necesitas ser tan extremo, pero la idea es clara: el tiempo asignado se respeta.</p>

      <h2>Paso 5: Técnicas para Mantener el Hábito</h2>
      
      <h3>1. La Regla de los 2 Minutos</h3>
      <p>Si algo toma menos de 2 minutos, hazlo ahora. Si no, planifícalo en tu planner.</p>

      <h3>2. Batch Similar Tasks</h3>
      <p>Agrupa tareas similares (ejemplo: responder todos los emails de una vez, no cada 10 minutos).</p>

      <h3>3. Review Semanal No Negociable</h3>
      <p>Si solo haces UNA cosa de esta guía, que sea la revisión semanal de 20 minutos. Esto solo mantendrá todo lo demás funcionando.</p>

      <h3>4. Recompensas Pequeñas</h3>
      <p>Cuando completes una tarea importante, date un mini premio: tu café favorito, 10 minutos de música, una caminata.</p>

      <h2>Errores Comunes al Usar un Planner</h2>
      <ul>
        <li><strong>Sobrellenar tu día:</strong> Deja 40% de tu tiempo libre para imprevistos</li>
        <li><strong>No revisar tu planner:</strong> Si no lo miras, no existe</li>
        <li><strong>Tratar todo como urgente:</strong> Solo 3 cosas pueden ser prioridad máxima</li>
        <li><strong>Abandonar tras una semana "mala":</strong> Un día sin usar tu planner no significa fracaso</li>
      </ul>

      <h2>Tu Planner es un Reflejo de tus Prioridades</h2>
      <p>Si tu planner está lleno de tareas de otros pero vacío de tiempo para ti, es momento de revaluar. Tus sueños necesitan tiempo planificado, no "tiempo que sobre".</p>

      <p class="highlight">✨ Un planner no mágicamente te organiza. Es una herramienta que amplifica tu intención. Úsala con claridad y verás cómo tus sueños se convierten en tu realidad diaria.</p>
    `,
    tags: 'planificación, metas, organización, productividad, planner'
  }
};

async function updateBlogContent() {
  console.log('🔄 Actualizando contenido del blog con información real...\n');

  for (const [slug, data] of Object.entries(realBlogContent)) {
    try {
      const result = await prisma.blogPost.updateMany({
        where: { slug },
        data: {
          excerpt: data.excerpt,
          content: data.content,
          tags: data.tags
        }
      });
      
      if (result.count > 0) {
        console.log(`✅ ${data.title} - Actualizado`);
      } else {
        console.log(`⚠️  ${data.title} - No encontrado`);
      }
    } catch (error) {
      console.error(`❌ Error actualizando ${slug}:`, error);
    }
  }

  console.log('\n✨ Actualización completada');
  await prisma.$disconnect();
}

updateBlogContent();
