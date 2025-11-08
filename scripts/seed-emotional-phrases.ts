
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Frases emocionales pregrabadas de ejemplo
 * Nota: Las URLs de audio son ejemplos. Debes reemplazarlas con las URLs reales de tus audios en CDN.
 */
const emotionalPhrases = [
  // KEN - Bienvenida
  {
    companion_type: 'ken',
    phrase_id: 'ken_bienvenida_01',
    emotion_type: 'bienvenida',
    text_content: '¡Hola! Qué alegría verte de nuevo. Estoy aquí para acompañarte hoy.',
    audio_url: 'https://cdn.example.com/voices/ken_bienvenida_01.mp3',
    duration_seconds: 4.5,
    tone: 'warm',
    language: 'es'
  },
  {
    companion_type: 'ken',
    phrase_id: 'ken_bienvenida_02',
    emotion_type: 'bienvenida',
    text_content: 'Buenos días. Es un nuevo día lleno de posibilidades. ¿Cómo te sientes?',
    audio_url: 'https://cdn.example.com/voices/ken_bienvenida_02.mp3',
    duration_seconds: 5.0,
    tone: 'gentle',
    language: 'es'
  },

  // KEN - Consuelo
  {
    companion_type: 'ken',
    phrase_id: 'ken_consolo_01',
    emotion_type: 'consolo',
    text_content: 'Estoy aquí para escucharte. Respira conmigo, no estás sola.',
    audio_url: 'https://cdn.example.com/voices/ken_consolo_01.mp3',
    duration_seconds: 5.5,
    tone: 'gentle',
    language: 'es'
  },
  {
    companion_type: 'ken',
    phrase_id: 'ken_consolo_02',
    emotion_type: 'consolo',
    text_content: 'Sé que este momento es difícil. Estoy aquí contigo, paso a paso.',
    audio_url: 'https://cdn.example.com/voices/ken_consolo_02.mp3',
    duration_seconds: 5.8,
    tone: 'warm',
    language: 'es'
  },

  // KEN - Ánimo
  {
    companion_type: 'ken',
    phrase_id: 'ken_animo_01',
    emotion_type: 'animo',
    text_content: 'Lo estás haciendo bien. Un paso a la vez. Tienes mi apoyo.',
    audio_url: 'https://cdn.example.com/voices/ken_animo_01.mp3',
    duration_seconds: 5.0,
    tone: 'encouraging',
    language: 'es'
  },
  {
    companion_type: 'ken',
    phrase_id: 'ken_animo_02',
    emotion_type: 'animo',
    text_content: 'Sé que puedes hacerlo. Eres más fuerte de lo que crees.',
    audio_url: 'https://cdn.example.com/voices/ken_animo_02.mp3',
    duration_seconds: 4.8,
    tone: 'encouraging',
    language: 'es'
  },

  // KEN - Felicitación
  {
    companion_type: 'ken',
    phrase_id: 'ken_felicitacion_01',
    emotion_type: 'felicitacion',
    text_content: '¡Lo lograste! Estoy tan orgulloso de ti. Celebra este momento.',
    audio_url: 'https://cdn.example.com/voices/ken_felicitacion_01.mp3',
    duration_seconds: 5.2,
    tone: 'joyful',
    language: 'es'
  },

  // ADA - Bienvenida
  {
    companion_type: 'ada',
    phrase_id: 'ada_bienvenida_01',
    emotion_type: 'bienvenida',
    text_content: 'Hola, querida. Me alegra que estés aquí. ¿En qué puedo acompañarte hoy?',
    audio_url: 'https://cdn.example.com/voices/ada_bienvenida_01.mp3',
    duration_seconds: 5.5,
    tone: 'gentle',
    language: 'es'
  },

  // ADA - Consuelo
  {
    companion_type: 'ada',
    phrase_id: 'ada_consolo_01',
    emotion_type: 'consolo',
    text_content: 'Permítete sentir lo que necesitas sentir. Aquí estoy para sostenerte.',
    audio_url: 'https://cdn.example.com/voices/ada_consolo_01.mp3',
    duration_seconds: 6.0,
    tone: 'warm',
    language: 'es'
  },

  // ADA - Ánimo
  {
    companion_type: 'ada',
    phrase_id: 'ada_animo_01',
    emotion_type: 'animo',
    text_content: 'Confía en tu proceso. Cada pequeño paso cuenta y te acerca a donde quieres estar.',
    audio_url: 'https://cdn.example.com/voices/ada_animo_01.mp3',
    duration_seconds: 6.5,
    tone: 'encouraging',
    language: 'es'
  },

  // ADA - Felicitación
  {
    companion_type: 'ada',
    phrase_id: 'ada_felicitacion_01',
    emotion_type: 'felicitacion',
    text_content: 'Qué maravilloso logro. Estoy feliz de ser testigo de tu crecimiento.',
    audio_url: 'https://cdn.example.com/voices/ada_felicitacion_01.mp3',
    duration_seconds: 5.8,
    tone: 'joyful',
    language: 'es'
  },

  // LUMI - Bienvenida
  {
    companion_type: 'lumi',
    phrase_id: 'lumi_bienvenida_01',
    emotion_type: 'bienvenida',
    text_content: '¡Hola, brillo! Tu luz es bienvenida aquí. ¿Cómo brillas hoy?',
    audio_url: 'https://cdn.example.com/voices/lumi_bienvenida_01.mp3',
    duration_seconds: 5.0,
    tone: 'joyful',
    language: 'es'
  },

  // LUMI - Consuelo
  {
    companion_type: 'lumi',
    phrase_id: 'lumi_consolo_01',
    emotion_type: 'consolo',
    text_content: 'Incluso en la oscuridad, tu luz interior sigue brillando. No lo olvides.',
    audio_url: 'https://cdn.example.com/voices/lumi_consolo_01.mp3',
    duration_seconds: 5.5,
    tone: 'gentle',
    language: 'es'
  },

  // SPRIG - Bienvenida
  {
    companion_type: 'sprig',
    phrase_id: 'sprig_bienvenida_01',
    emotion_type: 'bienvenida',
    text_content: 'Hola, amiga de la naturaleza. Qué alegría tenerte aquí.',
    audio_url: 'https://cdn.example.com/voices/sprig_bienvenida_01.mp3',
    duration_seconds: 4.5,
    tone: 'warm',
    language: 'es'
  },

  // SPRIG - Felicitación
  {
    companion_type: 'sprig',
    phrase_id: 'sprig_felicitacion_01',
    emotion_type: 'felicitacion',
    text_content: '¡Floreciste! Como una semilla que se convierte en árbol, has crecido.',
    audio_url: 'https://cdn.example.com/voices/sprig_felicitacion_01.mp3',
    duration_seconds: 5.5,
    tone: 'joyful',
    language: 'es'
  }
];

async function seedEmotionalPhrases() {
  try {
    console.log('🌱 Iniciando seeding de frases emocionales...\n');

    for (const phrase of emotionalPhrases) {
      console.log(`📝 Creando: ${phrase.companion_type} - ${phrase.emotion_type} (${phrase.phrase_id})`);
      
      // Verificar si ya existe
      const existing = await prisma.emotionalVoicePhrase.findUnique({
        where: {
          companion_type_phrase_id: {
            companion_type: phrase.companion_type,
            phrase_id: phrase.phrase_id
          }
        }
      });

      if (existing) {
        console.log(`   ⚠️  Ya existe, saltando...`);
        continue;
      }

      await prisma.emotionalVoicePhrase.create({
        data: phrase
      });

      console.log(`   ✅ Creada exitosamente\n`);
    }

    console.log('\n🎉 ¡Seeding completado!');
    console.log(`📊 Total de frases en la base de datos:`);
    
    const stats = await prisma.emotionalVoicePhrase.groupBy({
      by: ['companion_type', 'emotion_type'],
      _count: true
    });

    stats.forEach((stat: any) => {
      console.log(`   ${stat.companion_type} - ${stat.emotion_type}: ${stat._count} frases`);
    });

  } catch (error) {
    console.error('❌ Error en seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedEmotionalPhrases()
    .catch(error => {
      console.error('Error fatal:', error);
      process.exit(1);
    });
}

export default seedEmotionalPhrases;
