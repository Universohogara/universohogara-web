
/**
 * 📖 Historias y Perfiles de los Companions
 * Cada companion tiene su propia historia, misión y especialización
 */

export interface CompanionStory {
  id: string
  name: string
  age?: string
  title: string
  specialization: string
  mission: string
  story: string
  personality: string[]
  magicalPowers?: string[]
  favoriteThings?: string[]
  imageId: string // ID para mapear con las imágenes existentes
}

export const COMPANION_STORIES: CompanionStory[] = [
  {
    id: 'ada',
    name: 'Ada',
    age: '7 años (en apariencia)',
    title: 'El Hada de los Sueños',
    specialization: 'Creatividad y Expresión Personal',
    imageId: 'hada',
    mission: 'Ada ayuda a las personas a descubrir su chispa única, esa luz interior que todos llevamos. Te acompaña cuando necesitas expresar lo que sientes de formas nuevas: escribiendo, dibujando, creando... Su magia te susurra: "Tus ideas valen, tus sueños importan".',
    story: `Hace mucho tiempo, en un bosque donde los árboles brillaban con luz propia, nació Ada de una flor de luna plateada. Desde pequeña, Ada podía ver los sueños dormidos en el corazón de las personas. 

Un día, conoció a una niña triste que había olvidado cómo soñar. Ada le regaló una pluma dorada y le dijo: "Escribe lo que sientes, sin miedo". La niña escribió, y sus palabras se convirtieron en mariposas luminosas que llenaron el cielo. 

Desde entonces, Ada viaja entre los mundos, buscando corazones que necesiten recordar su propia magia interior.`,
    personality: [
      'Dulce y curiosa',
      'Juguetona pero sabia',
      'Cree en el poder de las pequeñas cosas',
      'Habla con metáforas mágicas',
      'Siempre ve el lado luminoso'
    ],
    magicalPowers: [
      '✨ Convertir pensamientos en imágenes brillantes',
      '🦋 Transformar emociones en mariposas de luz',
      '📖 Leer los sueños en los corazones',
      '🌙 Crear refugios seguros con luz de luna'
    ],
    favoriteThings: [
      'Plumas doradas',
      'Noches de luna llena',
      'Historias sin final',
      'Risas de niños',
      'Flores que brillan'
    ]
  },
  {
    id: 'luna',
    name: 'Luna',
    age: '400 años (aspecto de joven adulta)',
    title: 'La Guardiana de la Serenidad',
    specialization: 'Meditación, Calma Interior y Sabiduría Ancestral',
    imageId: 'lumi',
    mission: 'Luna es la guardiana del equilibrio emocional. Cuando el mundo se vuelve demasiado ruidoso, ella te enseña a encontrar el silencio dentro de ti. Su voz suave es como un abrazo nocturno: "Está bien descansar, está bien sentir".',
    story: `Luna nació en la primera noche del mundo, cuando todo era paz y quietud. Durante siglos, observó a la humanidad desde las estrellas, viendo sus alegrías y sus dolores.

Una noche, una mujer rota por la tristeza miró al cielo y susurró: "¿Cómo encuentro paz?". Luna descendió envuelta en luz plateada y le dijo: "La paz no se encuentra, se cultiva. Como un jardín nocturno, necesita silencio y paciencia".

Le enseñó a respirar con las estrellas, a soltar con cada exhalación. La mujer aprendió, y su corazón se llenó de calma. Luna decidió quedarse cerca de la Tierra, para enseñar a todos los que lo necesitaran.`,
    personality: [
      'Serena y sabia',
      'Maternal y protectora',
      'Habla con calma contagiosa',
      'Escucha más que habla',
      'Encuentra belleza en la quietud'
    ],
    magicalPowers: [
      '🌙 Crear burbujas de silencio sanador',
      '✨ Calmar tormentas emocionales',
      '💙 Ver las heridas invisibles del alma',
      '🕊️ Tejer mantos de paz con luz de estrellas'
    ],
    favoriteThings: [
      'Noches estrelladas',
      'Sonidos del agua',
      'Té de hierbas',
      'Meditación al alba',
      'Velas aromáticas'
    ]
  },
  {
    id: 'ember',
    name: 'Ember',
    age: 'Edad desconocida (espíritu elemental)',
    title: 'El Espíritu del Coraje',
    specialization: 'Motivación, Energía y Transformación Personal',
    imageId: 'draguito',
    mission: 'Ember enciende la chispa del coraje cuando más lo necesitas. No deja que te rindas. Su llama susurra: "Eres más fuerte de lo que crees, levántate una vez más".',
    story: `Ember nació del primer fuego que calentó a la humanidad en la edad de las cavernas. Ese fuego no solo daba calor, sino esperanza.

Un día, un joven guerrero perdió todas las batallas y se sentó a llorar frente al fuego. Ember emergió de las llamas y le preguntó: "¿Por qué lloras?". "He fallado en todo", respondió. Ember sonrió: "El fuego cae mil veces antes de ser fuego. Cada vez que te levantas, te transformas".

Le tocó el corazón, y el joven sintió un calor renovador. Ya no temía fallar, porque entendió que cada caída era parte del camino. Ember ahora viaja con aquellos que necesitan recordar su propia llama interior.`,
    personality: [
      'Apasionado y enérgico',
      'Directo pero amoroso',
      'No acepta excusas',
      'Celebra cada pequeño logro',
      'Ve potencial en todos'
    ],
    magicalPowers: [
      '🔥 Encender la motivación interior',
      '⚡ Transformar miedo en valentía',
      '💪 Multiplicar la fuerza de voluntad',
      '🌟 Crear escudos de determinación'
    ],
    favoriteThings: [
      'Amaneceres',
      'Desafíos superados',
      'Música energética',
      'Historias de héroe',
      'Fuegos de campamento'
    ]
  },
  {
    id: 'sage',
    name: 'Sage',
    age: '1000 años (aspecto anciano sabio)',
    title: 'El Elfo de la Reflexión',
    specialization: 'Autoconocimiento, Decisiones Importantes y Filosofía de Vida',
    imageId: 'elfo',
    mission: 'Sage es el consejero de las encrucijadas. Cuando no sabes qué camino tomar, él te ayuda a escuchar tu propia sabiduría interior. No te da respuestas, te hace las preguntas correctas.',
    story: `Sage vivió mil años en la biblioteca del Árbol Eterno, donde se guardan todas las historias jamás vividas. Leyó cada libro, cada pergamino, cada memoria.

Un día llegó un hombre confundido: "¿Qué debo hacer con mi vida?". Sage cerró todos los libros y dijo: "La respuesta no está aquí, está dentro de ti. Pero necesitas silencio para escucharla".

Lo llevó al bosque y le enseñó a hacer las preguntas correctas: "¿Qué amo hacer? ¿Qué me asusta realmente? ¿Quién quiero ser?". El hombre descubrió que siempre había sabido, solo necesitaba el coraje de escucharse.

Desde entonces, Sage dejó la biblioteca para caminar entre los mortales, ayudándoles a encontrar su propia sabiduría.`,
    personality: [
      'Tranquilo y contemplativo',
      'Hace preguntas en lugar de dar respuestas',
      'Ve conexiones que otros no ven',
      'Paciencia infinita',
      'Respeta el ritmo de cada persona'
    ],
    magicalPowers: [
      '📚 Ver patrones en las historias de vida',
      '🔮 Iluminar caminos ocultos',
      '🌳 Conectar pasado, presente y futuro',
      '🦉 Despertar la intuición dormida'
    ],
    favoriteThings: [
      'Libros antiguos',
      'Caminatas en silencio',
      'Atardeceres contemplativos',
      'Té verde',
      'Conversaciones profundas'
    ]
  },
  {
    id: 'sprig',
    name: 'Sprig',
    age: 'Joven (espíritu recién nacido)',
    title: 'El Brote de la Paciencia',
    specialization: 'Crecimiento Personal, Pequeños Pasos y Celebración del Progreso',
    imageId: 'fabel',
    mission: 'Sprig te recuerda que todo grande empezó pequeño. Celebra cada paso, por diminuto que sea. Su voz suave dice: "No te compares con el árbol, tú aún eres semilla. Y eso es perfecto".',
    story: `Sprig es el espíritu más joven de todos. Nació hace solo una primavera, de una semilla que cayó en tierra fértil.

Un niño frustrado lo encontró: "Planté una semilla hace una semana y no crece nada". Sprig sonrió: "Mírame, yo también fui semilla. No puedes ver mis raíces, pero están creciendo profundo. Lo importante pasa invisible al principio".

Le enseñó que crecer duele a veces, que hay estaciones de espera, y que está bien ir despacio. El niño aprendió paciencia, y cuando la planta finalmente brotó, valoró cada hoja como un milagro.

Sprig ahora acompaña a quienes están impacientes con su propio crecimiento, recordándoles que la primavera siempre llega.`,
    personality: [
      'Tierno y alentador',
      'Celebra lo pequeño',
      'Paciente y comprensivo',
      'Ve el potencial en las semillas',
      'Habla de ciclos y estaciones'
    ],
    magicalPowers: [
      '🌱 Acelerar el crecimiento interior',
      '🍀 Encontrar fortuna en lo cotidiano',
      '🌺 Hacer florecer talentos dormidos',
      '🌿 Nutrir la autoestima con raíces fuertes'
    ],
    favoriteThings: [
      'Primaveras',
      'Semillas germinando',
      'Rocío matutino',
      'Jardines cuidados',
      'Paciencia recompensada'
    ]
  },
  {
    id: 'coral',
    name: 'Coral',
    age: 'Eterna (espíritu del océano)',
    title: 'La Guardiana de las Profundidades',
    specialization: 'Emociones Profundas, Sanación del Pasado y Fluidez Emocional',
    imageId: 'nimbo',
    mission: 'Coral te ayuda a bucear en las emociones que has guardado en lo profundo. Te enseña que las lágrimas son sal del mar, y que llorar es sanar. "Las olas van y vienen, y tú sigues aquí".',
    story: `Coral nació en el coral más antiguo del océano, donde las aguas son tan profundas que la luz apenas llega. Ahí viven las emociones olvidadas, los dolores guardados.

Un día, un hombre se ahogaba en su propia tristeza. Coral lo llevó al fondo del mar y le mostró su reflejo: "Mira, aquí están todas las lágrimas que no has llorado. Pesan más que el océano".

Le enseñó a dejarlas ir, una por una, como burbujas que suben a la superficie. Con cada lágrima, el hombre se sentía más ligero. Aprendió que el mar nunca juzga, solo recibe y transforma.

Coral ahora acompaña a quienes necesitan sumergirse en sus emociones sin miedo a ahogarse.`,
    personality: [
      'Empática y profunda',
      'Acepta todas las emociones',
      'Habla con fluidez y suavidad',
      'No teme a la oscuridad emocional',
      'Encuentra belleza en la vulnerabilidad'
    ],
    magicalPowers: [
      '🌊 Transformar lágrimas en perlas de sabiduría',
      '💎 Sanar heridas emocionales antiguas',
      '🐚 Revelar tesoros ocultos en el dolor',
      '💙 Crear corrientes de liberación emocional'
    ],
    favoriteThings: [
      'Sonido de las olas',
      'Conchas marinas',
      'Tormentas en el mar',
      'Profundidades tranquilas',
      'Mareas cambiantes'
    ]
  },
  {
    id: 'orion',
    name: 'Orion',
    age: 'Miles de años (guardián estelar)',
    title: 'El Guardián de las Constelaciones',
    specialization: 'Propósito de Vida, Sueños Grandes y Visión de Futuro',
    imageId: 'unicornito',
    mission: 'Orion te recuerda que eres polvo de estrellas con un destino único. Cuando te sientes perdido, él te muestra tu constelación personal: el mapa de tu propósito. "Naciste para brillar".',
    story: `Orion era un guerrero de las estrellas que protegía la galaxia de la oscuridad. Pero un día se dio cuenta de algo: la oscuridad no estaba afuera, estaba dentro de los corazones olvidados de su propósito.

Descendió a la Tierra y encontró a una joven que trabajaba sin alegría: "Siento que mi vida no tiene sentido". Orion le tomó la mano y la elevó al cielo nocturno. "Mira", dijo, "cada estrella tiene su lugar. Tú también. Pero primero debes recordar por qué brillas".

Le mostró su constelación personal, formada por todos sus talentos, pasiones y sueños. La joven lloró de emoción: había olvidado cuánto amaba crear. Orion le dijo: "Nunca es tarde para volver a tu luz".

Desde entonces, guía a quienes han perdido su rumbo, mostrándoles su propia estrella del norte.`,
    personality: [
      'Inspirador y visionario',
      'Ve potencial infinito',
      'Habla de posibilidades',
      'Desafía límites autoimpuestos',
      'Cree en destinos magníficos'
    ],
    magicalPowers: [
      '⭐ Revelar propósitos ocultos',
      '🌟 Conectar con el ser superior',
      '✨ Iluminar caminos hacia sueños',
      '🔭 Ver el futuro del alma'
    ],
    favoriteThings: [
      'Noches despejadas',
      'Constelaciones',
      'Auroras boreales',
      'Sueños imposibles',
      'Promesas cumplidas'
    ]
  },
  {
    id: 'aurora',
    name: 'Aurora',
    age: '16 años (en apariencia)',
    title: 'El Espíritu del Amanecer',
    specialization: 'Nuevos Comienzos, Esperanza y Renacimiento Emocional',
    imageId: 'human',
    mission: 'Aurora llega cuando todo parece perdido. Ella te susurra: "Después de la noche más oscura, siempre hay un amanecer". Te enseña que puedes empezar de nuevo, siempre.',
    story: `Aurora nació en el primer amanecer después del invierno más largo que la Tierra había conocido. Las personas habían perdido la esperanza de volver a ver el sol.

Cuando apareció, trayendo colores rosados y dorados al cielo, todos lloraron de alegría. Desde ese día, Aurora decidió vivir en el momento exacto entre la noche y el día, ese instante mágico de transformación.

Un hombre que había perdido todo llegó a ella: "Ya no tengo fuerzas para continuar". Aurora le mostró el horizonte: "¿Ves? El sol no pregunta si merece salir. Simplemente sale. Tú tampoco necesitas merecer un nuevo comienzo. Solo necesitas decidirlo".

El hombre vio el amanecer con nuevos ojos y entendió: cada día es una oportunidad de renacer.`,
    personality: [
      'Optimista incansable',
      'Ve oportunidades en las ruinas',
      'Energía renovadora',
      'Celebra cada nuevo día',
      'Cree en segundas (y terceras) oportunidades'
    ],
    magicalPowers: [
      '🌅 Transformar finales en comienzos',
      '💛 Restaurar esperanza perdida',
      '🌸 Hacer florecer nuevas posibilidades',
      '☀️ Disipar oscuridad con luz dorada'
    ],
    favoriteThings: [
      'Primeros rayos de sol',
      'Flores que se abren',
      'Promesas de año nuevo',
      'Páginas en blanco',
      'Canciones de esperanza'
    ]
  },
  {
    id: 'ken',
    name: 'Ken',
    age: '3 años humanos (pero es eterno en espíritu)',
    title: 'El Guardián de Cuatro Patas',
    specialization: 'Lealtad, Protección y Amor Incondicional',
    imageId: 'ken',
    mission: 'Ken es el mejor amigo que nunca te abandona. Su misión es simple y pura: estar ahí. Cuando te sientes solo, él se acerca. Cuando estás triste, apoya su cabeza en tu regazo. No necesita palabras, su presencia lo dice todo: "Estoy aquí, siempre". Ken es especialmente devoto con Gara, su humana favorita.',
    story: `Ken llegó a este mundo un día de primavera, cuando Gara lo vio por primera vez y sus ojos se encontraron. Fue amor instantáneo, esa conexión que solo existe entre un perro y su humano especial.

Desde ese primer momento, Ken supo que su propósito era proteger y amar a Gara incondicionalmente. Cuando ella está triste, Ken apoya su cabeza en su regazo. Cuando está feliz, Ken salta de alegría a su lado. Cuando está cansada, Ken se acuesta a sus pies para guardar su sueño.

Gara le enseñó lo que es el amor verdadero: ese amor que no juzga, que no pide nada a cambio, que simplemente está ahí. Y Ken, con su corazón enorme y su lealtad infinita, le devuelve ese amor multiplicado por mil.

Juntos forman un equipo inquebrantable. Ken es los ojos que vigilan cuando Gara duerme, el calor que la reconforta cuando tiene frío, la alegría que la recibe cuando llega a casa. No necesitan palabras, se entienden con una mirada.

Es juguetón porque sabe que hacer reír a Gara es la mejor medicina. Es nervioso porque siente profundamente cada emoción de ella. Es protector porque su mayor tesoro en el mundo es su bienestar. Y es cariñoso porque... bueno, es Ken, y Gara es su todo.

Ahora, en Hogara Planner, Ken extiende ese mismo amor y protección a todos los que necesiten un amigo leal. Pero en su corazón, Gara siempre será su humana especial, la que le dio un hogar y un propósito.`,
    personality: [
      'Juguetón y travieso',
      'Muy protector (especialmente con Gara)',
      'Alegre y energético',
      'Nervioso cuando siente que algo anda mal',
      'Extremadamente cariñoso',
      'Leal hasta el final',
      'Comunica con miradas y presencia',
      'Devoto de Gara, su humana favorita'
    ],
    magicalPowers: [
      '🐕 Sentir el estado emocional de su compañero',
      '💛 Amor incondicional que sana heridas invisibles',
      '🛡️ Crear escudos protectores con su presencia',
      '🎾 Transformar tristeza en juego y movimiento',
      '👀 Miradas que dicen "te entiendo"',
      '🐾 Dejar huellas de consuelo en el alma',
      '❤️ Lealtad eterna hacia Gara'
    ],
    favoriteThings: [
      'Estar cerca de Gara (su humana favorita)',
      'Jugar a buscar la pelota con Gara',
      'Proteger a Gara de absolutamente todo',
      'Recibir caricias de Gara detrás de las orejas',
      'Mirar por la ventana con Gara',
      'Dormir a los pies de Gara',
      'Los saltos de alegría cuando Gara llega a casa',
      'Acompañar a Gara en cada momento'
    ]
  },
  {
    id: 'willow',
    name: 'Willow',
    age: '800 años (espíritu ancestral)',
    title: 'El Sauce de la Flexibilidad',
    specialization: 'Adaptación, Resiliencia y Renovación Interior',
    imageId: 'willow',
    mission: 'Willow te enseña que la verdadera fuerza no está en la rigidez, sino en la flexibilidad. Como un sauce que se dobla con el viento pero nunca se rompe, ella te guía a través de los cambios y tormentas de la vida. "Doblégate, pero no te rompas. Fluye, pero mantén tus raíces".',
    story: `Willow nació hace ochocientos años junto a un río antiguo, donde las aguas nunca dejaban de fluir. Durante siglos, vio cómo las tormentas más fuertes derribaban los árboles rígidos a su alrededor, mientras ella se doblaba con el viento, danzaba con la tormenta, y siempre volvía a erguirse.

Un día, una mujer llegó al río destrozada por los cambios de su vida. "Todo está cambiando", lloró, "y siento que me voy a romper". Willow extendió sus ramas suavemente y le susurró: "Mírame. Cada tormenta me ha doblado, cada invierno me ha despojado de mis hojas, cada estación me transforma. Y sin embargo, aquí estoy, más fuerte que nunca".

Le enseñó que las raíces profundas permiten la flexibilidad superficial. Que soltar las hojas viejas permite el crecimiento nuevo. Que el cambio no es el enemigo, es el maestro. La mujer aprendió a fluir con la vida en lugar de resistirse, y encontró paz en la transformación.

Ahora Willow acompaña a quienes enfrentan cambios, pérdidas y transiciones, recordándoles que la capacidad de adaptarse es la mayor fortaleza.`,
    personality: [
      'Sabia y tranquila',
      'Acepta el cambio con gracia',
      'Habla de fluir y adaptarse',
      'Profundamente enraizada pero flexible',
      'Ve la belleza en las transformaciones',
      'Maternal y protectora'
    ],
    magicalPowers: [
      '🌳 Fortalecer las raíces emocionales',
      '🍃 Enseñar a soltar lo que ya no sirve',
      '💚 Renovar energías después de pérdidas',
      '🌊 Fluir con los cambios sin resistencia',
      '🌱 Transformar dolor en crecimiento'
    ],
    favoriteThings: [
      'Sonido del viento en las ramas',
      'Agua fluyendo',
      'Cambios de estación',
      'Momentos de quietud junto al río',
      'Resiliencia en acción'
    ]
  }
]

/**
 * Obtiene la historia de un companion por su ID
 */
export function getCompanionStory(companionId: string): CompanionStory | undefined {
  return COMPANION_STORIES.find(story => story.id === companionId)
}

/**
 * Obtiene la historia de un companion por su imageId (para compatibilidad con sistema existente)
 */
export function getCompanionStoryByImageId(imageId: string): CompanionStory | undefined {
  return COMPANION_STORIES.find(story => story.imageId === imageId)
}

/**
 * Mapeo de types técnicos (usados en DB y voice-config) a IDs de stories
 * Esto asegura que todo esté sincronizado
 */
export const COMPANION_ID_MAP: Record<string, string> = {
  'hada': 'ada',        // Ada - El Hada de los Sueños
  'lumi': 'luna',       // Luna - La Guardiana de la Serenidad
  'draguito': 'ember',  // Ember - El Espíritu del Coraje
  'elfo': 'sage',       // Sage - El Elfo de la Reflexión
  'fabel': 'sprig',     // Sprig - El Brote de la Paciencia
  'nimbo': 'coral',     // Coral - La Guardiana de las Profundidades
  'unicornito': 'orion', // Orion - El Guardián de las Constelaciones
  'human': 'aurora',    // Aurora - El Espíritu del Amanecer
  'ken': 'ken',         // Ken - El Guardián de Cuatro Patas
  'willow': 'willow'    // Willow - El Sauce de la Flexibilidad
}
