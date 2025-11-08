

/**
 * Servicio de Text-to-Speech usando Puter.js + AWS Polly
 * 100% GRATIS, ILIMITADO, SIN API KEY
 * 
 * Puter.js ofrece 3 motores de AWS Polly:
 * - standard: Calidad básica
 * - neural: Alta calidad, natural
 * - generative: El más humano, expresivo y MÁGICO (RECOMENDADO)
 * 
 * Voces Españolas Femeninas Disponibles:
 * - Mia (es-MX): Joven, expresiva, mágica - generative/neural
 * - Lucia (es-ES): Suave, maternal, calmada - neural
 * - Lupe (es-US): Energética, optimista - neural
 * - Conchita (es-ES): Misteriosa, profunda - neural
 * - Alba (es-ES): Femenina clásica - standard/neural
 */

export type PuterEngine = 'standard' | 'neural' | 'generative';

export interface PuterTTSOptions {
  engine: PuterEngine;
  voice: string;
  language: string;
  realName: string;
  personality: string;
}

/**
 * Configuración de voces mágicas para cada personaje
 * Cada una tiene una voz única que refleja su personalidad y poderes
 */
const magicalVoiceConfigs: Record<string, PuterTTSOptions> = {
  // 🧚 ADA - El Hada de los Sueños (Mágica, juguetona, soñadora)
  hada: {
    engine: 'generative', // La más mágica y expresiva
    voice: 'Mia',
    language: 'es-MX',
    realName: 'Ada',
    personality: '🧚 Hada mágica de los sueños, juguetona y encantadora'
  },
  
  // 🌙 LUNA - La Guardiana de la Serenidad (Maternal, suave, calmada)
  lumi: {
    engine: 'neural',
    voice: 'Lucia',
    language: 'es-ES',
    realName: 'Luna',
    personality: '🌙 Guardiana serena y maternal, voz suave como la luz de luna'
  },
  
  // 🌅 AURORA - El Espíritu del Amanecer (Joven, optimista, energética)
  human: {
    engine: 'neural',
    voice: 'Lupe',
    language: 'es-US',
    realName: 'Aurora',
    personality: '🌅 Espíritu del amanecer, joven y llena de esperanza'
  },
  
  // 🌊 CORAL - El Alma del Océano (Misteriosa, profunda, serena)
  nimbo: {
    engine: 'neural',
    voice: 'Conchita',
    language: 'es-ES',
    realName: 'Coral',
    personality: '🌊 Alma del océano, misteriosa y profunda como el mar'
  },
  
  // 🌱 SPRIG - El Brote de la Paciencia (Duende mágico como Ada)
  fabel: {
    engine: 'generative', // La misma voz mágica de Ada
    voice: 'Mia',
    language: 'es-MX',
    realName: 'Sprig',
    personality: '🌱 Duende de la paciencia, voz mágica como el hada Ada'
  },
  
  // 🐕 KEN - El Guardián de Cuatro Patas (Protector, leal, robusta)
  ken: {
    engine: 'neural',
    voice: 'Enrique', // Voz masculina robusta
    language: 'es-ES',
    realName: 'Ken',
    personality: '🐕 Guardián leal de cuatro patas, voz robusta y protectora'
  }
};

/**
 * Verificar si un companion usa Puter TTS
 */
export function usesPuterTTS(companionType: string): boolean {
  const normalized = companionType.toLowerCase();
  return normalized in magicalVoiceConfigs;
}

/**
 * Obtener configuración de voz para un personaje
 */
export function getPuterVoiceConfig(companionType: string): PuterTTSOptions | null {
  const normalized = companionType.toLowerCase();
  return magicalVoiceConfigs[normalized] || null;
}

/**
 * Esperar a que Puter.js esté disponible (máximo 10 segundos)
 */
function waitForPuter(maxWaitMs: number = 10000): Promise<any> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    // Listener para el evento personalizado de carga
    const handlePuterLoad = () => {
      console.log('✅ Puter.js detectado vía evento de carga');
      window.removeEventListener('puter-loaded', handlePuterLoad);
      if ((window as any).puter) {
        resolve((window as any).puter);
      } else {
        checkPuter(); // Hacer un check adicional por si acaso
      }
    };
    
    // Registrar listener
    if (typeof window !== 'undefined') {
      window.addEventListener('puter-loaded', handlePuterLoad);
    }
    
    const checkPuter = () => {
      if (typeof window !== 'undefined' && (window as any).puter) {
        console.log('✅ Puter.js está disponible');
        window.removeEventListener('puter-loaded', handlePuterLoad);
        resolve((window as any).puter);
        return;
      }
      
      // Si pasó el tiempo máximo, rechazar
      if (Date.now() - startTime > maxWaitMs) {
        console.error(`❌ Puter.js no se cargó después de ${maxWaitMs}ms`);
        console.error('⚠️ Asegúrate de que el script esté en <head> sin defer');
        window.removeEventListener('puter-loaded', handlePuterLoad);
        reject(new Error('Timeout esperando a Puter.js'));
        return;
      }
      
      // Reintentar en 100ms
      setTimeout(checkPuter, 100);
    };
    
    // Empezar a verificar de inmediato
    checkPuter();
  });
}

// Variable global para controlar reproducciones simultáneas
let currentAudioElement: HTMLAudioElement | null = null;
let isCurrentlyPlaying = false;

/**
 * Agregar ladridos naturales de Ken (20% del tiempo)
 * Se activan al inicio de saludos o cuando detecta preocupación
 */
function addKenBarks(text: string, companionType: string): string {
  // Solo para Ken
  if (companionType.toLowerCase() !== 'ken') {
    return text;
  }
  
  // 20% de probabilidad de ladrar
  const shouldBark = Math.random() < 0.2;
  
  if (!shouldBark) {
    return text;
  }
  
  // Detectar si es saludo o preocupación
  const lowerText = text.toLowerCase();
  const isGreeting = /^(hola|hey|buenos|buenas|¿qué tal|qué tal|saludos)/i.test(lowerText);
  const isConcern = /(preocup|triste|mal|ayud|problem)/i.test(lowerText);
  
  if (isGreeting || isConcern) {
    // Ladrar al principio
    return `¡Guau! ${text}`;
  }
  
  return text;
}

/**
 * Reproducir audio usando Puter.js TTS con voces mágicas personalizadas
 * Cada personaje tiene su propia voz única de AWS Polly
 * 
 * IMPORTANTE: Esta función ahora controla que solo se reproduzca UN audio a la vez
 */
export async function playPuterAudio(
  text: string,
  companionType: string,
  emotion?: string
): Promise<void> {
  console.log('═══════════════════════════════════════════');
  console.log('🌟 INICIANDO PUTER.JS TTS MÁGICO');
  console.log('═══════════════════════════════════════════');
  console.log('  - Texto:', text.substring(0, 50) + '...');
  console.log('  - Companion Type:', companionType);
  console.log('  - Emoción:', emotion || 'neutral');

  try {
    // ⚠️ CONTROL DE REPRODUCCIÓN: Detener audio previo si existe
    if (isCurrentlyPlaying && currentAudioElement) {
      console.log('⏸️ Deteniendo reproducción anterior...');
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
      currentAudioElement = null;
      isCurrentlyPlaying = false;
      // Esperar un momento antes de continuar
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Obtener configuración de voz personalizada
    const voiceConfig = getPuterVoiceConfig(companionType);
    
    if (!voiceConfig) {
      throw new Error(`❌ No hay configuración de voz para ${companionType}`);
    }

    console.log('\n✨ VOZ MÁGICA CONFIGURADA:');
    console.log(`  - Personaje: ${voiceConfig.realName}`);
    console.log(`  - Personalidad: ${voiceConfig.personality}`);
    console.log(`  - Motor: ${voiceConfig.engine}`);
    console.log(`  - Voz AWS Polly: ${voiceConfig.voice}`);
    console.log(`  - Idioma: ${voiceConfig.language}`);

    // Agregar ladridos naturales de Ken (20% del tiempo)
    let textToSpeak = addKenBarks(text, companionType);
    if (textToSpeak !== text) {
      console.log('🐕 ¡Ken va a ladrar!');
    }

    // Esperar a que Puter.js esté disponible (hasta 10 segundos)
    console.log('\n⏳ Esperando a que Puter.js esté disponible...');
    const puter = await waitForPuter(10000);

    // Verificar que tenga la API de txt2speech
    if (!puter.ai || !puter.ai.txt2speech) {
      throw new Error('❌ Puter.js no tiene la API txt2speech disponible');
    }

    console.log('✅ Puter.js está listo. Generando audio...\n');
    
    // Llamar a la API de Puter.js con la configuración mágica
    console.log('🔊 Llamando a puter.ai.txt2speech...');
    
    return new Promise((resolve, reject) => {
      puter.ai.txt2speech(textToSpeak, {
        voice: voiceConfig.voice,
        engine: voiceConfig.engine,
        language: voiceConfig.language
      })
        .then((audio: HTMLAudioElement) => {
          console.log(`✅ Audio mágico generado para ${voiceConfig.realName}`);
          
          // Guardar referencia al audio actual
          currentAudioElement = audio;
          isCurrentlyPlaying = true;
          
          // Configurar eventos del audio
          audio.onended = () => {
            console.log(`✅ ${voiceConfig.realName} terminó de hablar ✨`);
            console.log('═══════════════════════════════════════════\n');
            currentAudioElement = null;
            isCurrentlyPlaying = false;
            resolve();
          };
          
          audio.onerror = (error) => {
            console.error('❌ Error al reproducir audio:', error);
            currentAudioElement = null;
            isCurrentlyPlaying = false;
            reject(new Error('Error al reproducir audio'));
          };
          
          audio.onpause = () => {
            if (currentAudioElement === audio && !audio.ended) {
              console.log('⏸️ Reproducción pausada');
            }
          };
          
          // Reproducir audio
          console.log(`▶️ ${voiceConfig.realName} está hablando...`);
          audio.play()
            .then(() => {
              console.log(`🎵 Voz mágica de ${voiceConfig.realName} reproduciéndose...`);
            })
            .catch((playError) => {
              console.error('❌ Error al iniciar reproducción:', playError);
              currentAudioElement = null;
              isCurrentlyPlaying = false;
              reject(playError);
            });
        })
        .catch((error: any) => {
          console.error('❌ Error al generar audio con Puter.js:', error);
          console.error('Detalles del error:', error);
          currentAudioElement = null;
          isCurrentlyPlaying = false;
          reject(error);
        });
    });

  } catch (error) {
    console.error('❌ ERROR CRÍTICO en playPuterAudio:', error);
    console.log('═══════════════════════════════════════════\n');
    currentAudioElement = null;
    isCurrentlyPlaying = false;
    throw error;
  }
}

/**
 * Detener reproducción actual si existe
 */
export function stopCurrentAudio(): void {
  if (isCurrentlyPlaying && currentAudioElement) {
    console.log('⏹️ Deteniendo audio actual...');
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
    currentAudioElement = null;
    isCurrentlyPlaying = false;
  }
}

/**
 * Verificar si hay audio reproduciéndose
 */
export function isAudioPlaying(): boolean {
  return isCurrentlyPlaying;
}

/**
 * Verificar si Puter.js está disponible
 */
export function isPuterAvailable(): boolean {
  // Puter.js se carga desde CDN, verificamos si está disponible
  return typeof window !== 'undefined' && !!(window as any).puter;
}
