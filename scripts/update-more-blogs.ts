import { prisma } from '../lib/db';

const moreBlogContent = {
  // HOGARA PET
  'lenguaje-secreto-gatos-guia-completa': {
    title: 'El Lenguaje Secreto de los Gatos: Guía Completa',
    excerpt: 'Los gatos no maúllan, hablan. Aprende a interpretar su cola, orejas, ojos y postura corporal para entender realmente lo que tu gato intenta decirte.',
    content: `
      <p>Tu gato está constantemente comunicándose contigo, pero ¿estás escuchando? Los gatos descienden de cazadores solitarios y han evolucionado un sistema complejo de señales visuales y táctiles para expresar emociones y necesidades.</p>

      <h2>La Cola: Su Principal Herramienta de Comunicación</h2>
      
      <h3>Cola Alta y Erecta</h3>
      <ul>
        <li><strong>Significado:</strong> Confianza, felicidad y saludo amistoso</li>
        <li><strong>Variante con curva en la punta:</strong> Indica sociabilidad y ganas de jugar</li>
        <li><strong>Vibración en la punta:</strong> Extrema emoción o placer (especialmente al verte llegar)</li>
      </ul>

      <h3>Cola Moviéndose Rápido de Lado a Lado</h3>
      <ul>
        <li><strong>Significado:</strong> Irritación, frustración o agresión</li>
        <li><strong>Qué hacer:</strong> Dale espacio. Es una advertencia clara de "déjame en paz"</li>
        <li><strong>Diferencia con perros:</strong> En perros significa felicidad; en gatos es lo opuesto</li>
      </ul>

      <h3>Cola Baja o Metida Entre las Piernas</h3>
      <ul>
        <li><strong>Significado:</strong> Miedo, sumisión o ansiedad</li>
        <li><strong>Cola inflada (pelo erizado):</strong> Intento de parecer más grande cuando se siente amenazado</li>
      </ul>

      <h3>Movimientos Lentos y Elegantes</h3>
      <ul>
        <li><strong>Significado:</strong> Curiosidad, evaluando una situación</li>
        <li><strong>Cola envolviendo su cuerpo:</strong> Contentamiento o necesidad de confort</li>
      </ul>

      <h2>Las Orejas: 25 Músculos de Expresión</h2>
      <p>Las orejas de un gato tienen hasta 25 músculos que les permiten moverse con precisión asombrosa.</p>

      <h3>Orejas Hacia Adelante</h3>
      <ul>
        <li><strong>Significado:</strong> Relajación, atención o curiosidad</li>
        <li><strong>Escuchando activamente:</strong> Procesando sonidos del entorno</li>
      </ul>

      <h3>Orejas Girando Independientemente</h3>
      <ul>
        <li><strong>Significado:</strong> Alerta moderada, evaluando posibles amenazas</li>
        <li><strong>Común cuando:</strong> Escuchan un ruido nuevo pero no se sienten amenazados</li>
      </ul>

      <h3>Orejas Aplastadas Hacia Atrás o a los Lados</h3>
      <ul>
        <li><strong>Significado:</strong> Miedo, ira o agresión defensiva</li>
        <li><strong>A menudo acompañado de:</strong> Siseo, bufido o golpes con las patas</li>
        <li><strong>En encuentros con otros gatos:</strong> Orejas neutrales = menos conflicto; orejas hacia atrás = mayor tensión</li>
      </ul>

      <h2>Los Ojos: Ventanas a su Alma</h2>

      <h3>Pupilas Dilatadas</h3>
      <ul>
        <li><strong>Puede significar:</strong> Miedo, excitación o agresión (contexto es clave)</li>
        <li><strong>También:</strong> Adaptación a poca luz (normal)</li>
        <li><strong>Con mirada fija:</strong> Preparándose para atacar o jugar intensamente</li>
      </ul>

      <h3>Parpadeo Lento</h3>
      <ul>
        <li><strong>Significado:</strong> "Te amo" en lenguaje gatuno</li>
        <li><strong>Conocido como:</strong> "Beso de gato"</li>
        <li><strong>Devuélvelo:</strong> Parpadea lento hacia tu gato para decirle que confías en él</li>
      </ul>

      <h3>Mirada Fija sin Parpadear</h3>
      <ul>
        <li><strong>Significado:</strong> Amenaza o dominancia</li>
        <li><strong>Evitar:</strong> El contacto visual prolongado puede interpretarse como agresión</li>
        <li><strong>Si un gato te mira fijo:</strong> Desvía la mirada para desescalar tensión</li>
      </ul>

      <h3>Pupilas Estrechas</h3>
      <ul>
        <li><strong>Significado:</strong> Confianza o potencial agresión (según postura corporal)</li>
        <li><strong>En ambientes brillantes:</strong> Normal (adaptación a la luz)</li>
      </ul>

      <h2>Bigotes y Expresiones Faciales</h2>

      <h3>Bigotes Hacia Adelante</h3>
      <ul>
        <li><strong>Significado:</strong> Interés, juego o modo caza</li>
        <li><strong>Función:</strong> Los bigotes detectan cambios de aire y espacios estrechos</li>
      </ul>

      <h3>Bigotes Hacia Atrás</h3>
      <ul>
        <li><strong>Significado:</strong> Miedo o postura defensiva</li>
        <li><strong>Protegiendo:</strong> Retraen los bigotes para protegerlos en confrontaciones</li>
      </ul>

      <h3>Lamerse la Nariz o los Labios</h3>
      <ul>
        <li><strong>Significado:</strong> Ansiedad o anticipación</li>
        <li><strong>Común:</strong> Antes de comer o en situaciones estresantes</li>
      </ul>

      <h2>Posturas Corporales Completas</h2>

      <h3>Espalda Arqueada con Pelo Erizado</h3>
      <ul>
        <li><strong>Significado:</strong> Miedo extremo o postura defensiva</li>
        <li><strong>Objetivo:</strong> Parecer más grande e intimidante</li>
        <li><strong>A menudo con:</strong> Cola inflada, orejas hacia atrás, siseos</li>
      </ul>

      <h3>Rodando Sobre la Espalda (Panza Arriba)</h3>
      <ul>
        <li><strong>En ambiente seguro:</strong> Confianza extrema y relajación</li>
        <li><strong>En conflicto:</strong> Posición defensiva (permite usar las 4 patas para defenderse)</li>
        <li><strong>¡Cuidado!:</strong> Exponer la panza NO siempre significa "acaríciame aquí"</li>
      </ul>

      <h3>Amasando con las Patas ("Haciendo Galletas")</h3>
      <ul>
        <li><strong>Significado:</strong> Extrema felicidad y seguridad</li>
        <li><strong>Origen:</strong> Comportamiento de gatito al amamantar</li>
        <li><strong>También:</strong> Marcado territorial (glándulas en las patas)</li>
      </ul>

      <h3>Frotándose Contra Ti u Objetos</h3>
      <ul>
        <li><strong>Significado:</strong> Marcado territorial, afecto o saludo</li>
        <li><strong>Feromonas:</strong> Dejan su olor para "reclamarte" como parte de su territorio</li>
        <li><strong>Zonas:</strong> Mejillas, frente, flancos (todas tienen glándulas odoríferas)</li>
      </ul>

      <h3>Agachado/Escondido</h3>
      <ul>
        <li><strong>Significado:</strong> Miedo, cautela o preparación para cazar</li>
        <li><strong>Con trasero elevado y meneo:</strong> ¡Modo juego activado!</li>
      </ul>

      <h2>Vocalizaciones: Más Allá del Maullido</h2>

      <h3>Ronroneo</h3>
      <ul>
        <li><strong>Común:</strong> Felicidad y contentamiento</li>
        <li><strong>También puede indicar:</strong> Dolor, estrés o necesidad de confort (¡contexto!)</li>
      </ul>

      <h3>Maullido</h3>
      <ul>
        <li><strong>Raramente usado entre gatos:</strong> Principalmente para comunicarse con humanos</li>
        <li><strong>Tonos diferentes:</strong> Tienen significados diferentes (hambre, atención, queja)</li>
      </ul>

      <h3>Siseo/Bufido</h3>
      <ul>
        <li><strong>Significado:</strong> Advertencia clara de miedo o agresión</li>
        <li><strong>Mensaje:</strong> "Retrocede ahora o atacaré"</li>
      </ul>

      <h2>Interpretación en Contexto</h2>
      <p class="highlight">⚠️ Regla de Oro: NUNCA interpretes una sola señal aislada. Observa:</p>
      <ul>
        <li><strong>Cola + Orejas + Ojos + Postura:</strong> Juntos cuentan la historia completa</li>
        <li><strong>Situación:</strong> ¿Qué estaba pasando antes?</li>
        <li><strong>Historial:</strong> Cada gato tiene su personalidad única</li>
      </ul>

      <h2>Ejemplo de Lectura Completa</h2>
      <p><strong>Escenario:</strong> Tu gato tiene la cola erizada, orejas hacia atrás, pupilas dilatadas y está sisean do.</p>
      <p><strong>Interpretación:</strong> Miedo extremo con postura defensiva. Algo lo asustó gravemente. Dale espacio, elimina la amenaza si es visible, y permite que se calme.</p>

      <p class="tip">💡 Con el tiempo, aprenderás el "dialecto" único de tu gato. La observación paciente es la clave para una comunicación profunda.</p>
    `,
    tags: 'gatos, lenguaje corporal, mascotas, comportamiento animal, comunicación'
  },

'crear-jardin-seguro-mascotas': {
    title: 'Cómo Crear un Jardín Seguro para tus Mascotas',
    excerpt: 'Tu jardín puede ser un paraíso o un peligro para tus mascotas. Aprende qué plantas son tóxicas y cómo diseñar un espacio exterior donde perros y gatos puedan jugar sin riesgos.',
    content: `
      <p>Un jardín hermoso no tiene que significar peligro para tus mascotas. Con planificación inteligente, puedes crear un espacio donde tus perros y gatos disfruten sin exponerse a plantas tóxicas, químicos peligrosos o accidentes evitables.</p>

      <h2>Plantas Tóxicas Comunes: La Lista Esencial</h2>
      <p>La ASPCA (Sociedad Americana para la Prevención de la Crueldad hacia los Animales) ha documentado cientos de plantas tóxicas. Estas son las más comunes en jardines:</p>

      <h3>🚨 Extremadamente Peligrosas (Pueden ser Fatales)</h3>
      <ul>
        <li><strong>Lirios (Lilium spp.):</strong> ESPECIALMENTE tóxicos para gatos; causan insuficiencia renal. Incluso el polen es letal.</li>
        <li><strong>Azaleas y Rododendros:</strong> Afectan el corazón. Pueden causar vómitos, diarrea, debilidad y muerte.</li>
        <li><strong>Adelfa:</strong> Contiene toxinas cardíacas; puede provocar arritmias graves y muerte.</li>
        <li><strong>Cica (Palma de Sagú):</strong> Todas las partes son tóxicas; causa fallo hepático. ¡El bulbo es mortal!</li>
      </ul>

      <h3>⚠️ Muy Tóxicas (Requieren Atención Veterinaria Urgente)</h3>
      <ul>
        <li><strong>Tulipanes y Narcisos:</strong> El bulbo es la parte más peligrosa; causa vómitos intensos, diarrea y convulsiones.</li>
        <li><strong>Hortensias:</strong> Contienen amigdalina; pueden causar problemas cardíacos y digestivos.</li>
        <li><strong>Ciclamen:</strong> Las raíces son tóxicas; causan vómitos severos y fallo renal.</li>
        <li><strong>Datura (Trompeta de Ángel):</strong> Extremadamente tóxica; causa alucinaciones, convulsiones y muerte.</li>
      </ul>

      <h3>⚠️ Plantas de Interior Peligrosas (Si también están en el Jardín)</h3>
      <ul>
        <li><strong>Filodendro, Dieffenbachia, Espatifilo:</strong> Cristales de oxalato de calcio; irritación severa en boca y garganta.</li>
        <li><strong>Poto (Epipremnum):</strong> Causa vómitos, diarrea y posible fallo renal.</li>
        <li><strong>Aloe Vera:</strong> Savia irritante que causa problemas digestivos.</li>
      </ul>

      <h2>Síntomas de Intoxicación por Plantas</h2>
      <p>Los síntomas pueden aparecer minutos u horas después de la exposición:</p>
      <ul>
        <li><strong>Digestivos:</strong> Vómitos, diarrea, salivación excesiva, dolor abdominal</li>
        <li><strong>Neurológicos:</strong> Convulsiones, temblores, desorientación, letargo</li>
        <li><strong>Respiratorios:</strong> Dificultad para respirar, hinchazón de lengua/garganta</li>
        <li><strong>Cutáneos:</strong> Irritación, enrojecimiento, ampollas</li>
        <li><strong>Sistémicos:</strong> Insuficiencia renal/hepática, arritmias cardíacas</li>
      </ul>
      <p class="highlight">🚨 Si sospechas intoxicación: Contacta INMEDIATAMENTE a tu veterinario. NO induzcas vómito por tu cuenta. Lleva una muestra de la planta si es posible.</p>

      <h2>Plantas Seguras para Mascotas</h2>
      <p>Puedes tener un jardín hermoso Y seguro. Estas plantas son no tóxicas:</p>

      <h3>🌿 Plantas de Interior/Exterior Seguras</h3>
      <ul>
        <li><strong>Helechos (mayoría):</strong> Boston fern, helecho nido de ave</li>
        <li><strong>Palmas:</strong> Palma areca, palma bambú</li>
        <li><strong>Plantas Araña (Chlorophytum):</strong> Resistentes y seguras</li>
        <li><strong>Violetas Africanas:</strong> Flores bonitas y sin riesgo</li>
        <li><strong>Peperomia:</strong> Variedad de colores, totalmente segura</li>
        <li><strong>Haworthia (suculenta):</strong> Alternativa segura al aloe vera</li>
      </ul>

      <h3>🌼 Flores y Arbustos para Jardín</h3>
      <ul>
        <li><strong>Caléndulas, Girasoles, Rosas:</strong> Seguras y coloridas</li>
        <li><strong>Hierbas aromáticas:</strong> Albahaca, menta, romero (en moderación)</li>
        <li><strong>Bambú (mayoría):</strong> Crea privacidad sin toxicidad</li>
      </ul>

      <h2>Diseño de Jardín Amigable para Mascotas</h2>

      <h3>1. Zonificación Inteligente</h3>
      <ul>
        <li><strong>Área de Juego Designada:</strong> Césped resistente (pasto azul de Kentucky + trébol)</li>
        <li><strong>Zonas Densas:</strong> Planta densamente para limitar acceso a ciertas áreas</li>
        <li><strong>Canteros Elevados:</strong> Coloca plantas delicadas fuera de alcance</li>
        <li><strong>Cercas Bajas o Barreras:</strong> Delimita áreas "solo para humanos"</li>
      </ul>

      <h3>2. Evita Productos Químicos Tóxicos</h3>
      <ul>
        <li><strong>Fertilizantes:</strong> Usa opciones orgánicas o restringe acceso 24-48h después de aplicar</li>
        <li><strong>Herbicidas y Pesticidas:</strong> Altamente tóxicos; evita completamente si es posible</li>
        <li><strong>Anticaracoles/Babosas:</strong> Contienen metaldehído (mortal para perros); usa barreras físicas</li>
      </ul>

      <h3>3. Considera el Comportamiento Animal</h3>
      <ul>
        <li><strong>Perros que cavan:</strong> Crea una zona de excavación con arena</li>
        <li><strong>Gatos que cazan:</strong> Evita plantas frágiles cerca del suelo</li>
        <li><strong>Acceso a sombra:</strong> Refugios seguros en días calurosos</li>
        <li><strong>Agua limpia accesible:</strong> Reduce tentación de beber agua estancada (con bacterias)</li>
      </ul>

      <h2>Protocolos de Seguridad</h2>

      <h3>Antes de Comprar/Plantar</h3>
      <ol>
        <li>Consulta la lista de plantas tóxicas de ASPCA (aspca.org)</li>
        <li>Pregunta en el vivero: "¿Es esto seguro para mascotas?"</li>
        <li>Investiga el nombre científico (nombres comunes pueden variar)</li>
        <li>Considera eliminación progresiva de plantas tóxicas existentes</li>
      </ol>

      <h3>Supervisión y Entrenamiento</h3>
      <ul>
        <li><strong>Entrena el comando "No":</strong> Para alejar a mascotas de plantas específicas</li>
        <li><strong>Supervisión inicial:</strong> Monitorea comportamiento en el jardín las primeras semanas</li>
        <li><strong>Refuerzo positivo:</strong> Premia cuando ignoren plantas o jueguen en áreas designadas</li>
      </ul>

      <h2>Kit de Emergencia para Jardín</h2>
      <p>Ten siempre a mano:</p>
      <ul>
        <li>Número de tu veterinario y línea de toxicología animal</li>
        <li>Lista de plantas en tu jardín con nombres científicos</li>
        <li>Carbón activado (solo bajo indicación veterinaria)</li>
        <li>Fotos de plantas tóxicas para referencia rápida</li>
      </ul>

      <h2>Mitos Comunes</h2>
      <ul>
        <li><strong>❌ "Los animales saben qué no comer":</strong> FALSO. Cachorros, gatitos y mascotas curiosas pueden ingerir plantas tóxicas por error.</li>
        <li><strong>❌ "Un poco no hace daño":</strong> FALSO. Incluso pequeñas cantidades de algunas plantas (como lirios para gatos) son letales.</li>
        <li><strong>❌ "Las plantas ornamentales son seguras":</strong> FALSO. Muchas plantas decorativas comunes son tóxicas.</li>
      </ul>

      <h2>Checklist de Jardín Seguro</h2>
      <ul>
        <li>☑️ Plantas tóxicas eliminadas o inaccesibles</li>
        <li>☑️ Área de juego designada con césped seguro</li>
        <li>☑️ Productos químicos evitados o usados con precaución extrema</li>
        <li>☑️ Acceso a agua limpia y sombra</li>
        <li>☑️ Supervisión regular</li>
        <li>☑️ Información de emergencia accesible</li>
      </ul>

      <p class="tip">💡 Un jardín amigable para mascotas no significa sacrificar belleza. Significa elegir plantas con intención, diseñar con empatía y cultivar un espacio donde toda tu familia—de dos y cuatro patas—pueda prosperar.</p>
    `,
    tags: 'mascotas, jardín, seguridad, plantas tóxicas, perros, gatos'
  }
};

async function updateMoreBlogs() {
  console.log('🔄 Actualizando más contenido del blog...\n');

  for (const [slug, data] of Object.entries(moreBlogContent)) {
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

updateMoreBlogs();
