
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌟 Poblando contenido premium...')

  // 1. Crear Plantillas Interactivas
  console.log('📄 Creando plantillas...')
  
  const templates = [
    {
      name: 'Kit de Agradecimiento Diario',
      description: 'Plantilla interactiva para cultivar la gratitud. Registra 3 momentos de gratitud cada día y transforma tu perspectiva.',
      category: 'worksheet',
      pdf_url: '/KIT.pdf',
      tier: 'standard',
      order: 1,
      is_colorable: true
    },
    {
      name: 'Kit Post-Cita (CSI)',
      description: 'Analiza tus citas y relaciones con profundidad. Perfecto para reflexionar sobre conexiones y patrones emocionales.',
      category: 'worksheet',
      pdf_url: '/KIT POST CITA.pdf',
      tier: 'total',
      order: 2,
      is_colorable: true
    },
    {
      name: 'Kit Redes Sociales Consciente',
      description: 'Planifica tu presencia digital con intención. Crea contenido alineado con tus valores y objetivos.',
      category: 'planner',
      pdf_url: '/KIT REDES SOCIALES.pdf',
      tier: 'standard',
      order: 3,
      is_colorable: true
    },
    {
      name: 'Trackers Anuales Completos',
      description: 'Sistema completo de seguimiento anual: hábitos, emociones, objetivos, finanzas y más. Visualiza tu año completo.',
      category: 'tracker',
      pdf_url: '/TRACKERS ANUALES.pdf',
      tier: 'standard',
      order: 4,
      is_colorable: true
    },
    {
      name: 'Kit de Ruptura y Sanación',
      description: 'Guía completa para procesar rupturas amorosas con amor propio. Ejercicios de liberación emocional y cierre.',
      category: 'ritual',
      pdf_url: '/kit ruptura.pdf',
      tier: 'total',
      order: 5,
      is_colorable: true
    },
    {
      name: 'Pack Agradecimiento Especial',
      description: 'Colección premium de ejercicios de gratitud para cultivar una mentalidad abundante y positiva.',
      category: 'worksheet',
      pdf_url: '/PACK AGRADECIMIENTO.pdf',
      tier: 'total',
      order: 6,
      is_colorable: true
    }
  ]

  for (const template of templates) {
    await prisma.template.upsert({
      where: { name: template.name },
      update: template,
      create: template
    })
    console.log(`✅ Plantilla creada: ${template.name}`)
  }

  // 2. Crear Retos de 21 Días
  console.log('\n🏆 Creando retos de 21 días...')
  
  const challenges = [
    {
      title: 'Reto de Gratitud 21 Días',
      description: 'Transforma tu perspectiva dedicando cada día a reconocer y anotar 3 cosas por las que estás agradecida. Un hábito simple que cambia tu cerebro y te conecta con la abundancia que ya existe en tu vida.',
      duration: 21,
      category: 'gratitud',
      icon: 'heart',
      tier: 'standard',
      is_active: true
    },
    {
      title: 'Energía Vital 21 Días',
      description: 'Conecta con tu energía interior a través de rituales matutinos, movimiento consciente y alimentación intencional durante 21 días. Despierta tu vitalidad natural.',
      duration: 21,
      category: 'energia',
      icon: 'zap',
      tier: 'total',
      is_active: true
    },
    {
      title: 'Limpieza Emocional 21 Días',
      description: 'Suelta lo que ya no te sirve. 21 días de journaling profundo, meditación y ejercicios de liberación emocional guiados. Libera espacio para lo nuevo.',
      duration: 21,
      category: 'limpieza_emocional',
      icon: 'sparkles',
      tier: 'total',
      is_active: true
    },
    {
      title: 'Hábitos de Oro 21 Días',
      description: 'Construye la versión de ti que siempre has soñado. 21 días para anclar los hábitos que transformarán tu vida: movimiento, nutrición, sueño y mindfulness.',
      duration: 21,
      category: 'habitos',
      icon: 'trophy',
      tier: 'standard',
      is_active: true
    }
  ]

  for (const challenge of challenges) {
    const existing = await prisma.challenge.findFirst({
      where: { title: challenge.title }
    })
    
    if (!existing) {
      await prisma.challenge.create({
        data: challenge
      })
      console.log(`✅ Reto creado: ${challenge.title}`)
    } else {
      console.log(`⏭️  Reto ya existe: ${challenge.title}`)
    }
  }

  // 3. Crear contenido de música ambiente premium
  console.log('\n🎵 Creando música ambiente premium...')
  
  const musicTracks = [
    {
      title: 'Chimenea Acogedora',
      description: 'Sonido relajante de chimenea crepitante para crear ambiente cálido mientras escribes',
      type: 'ambient_sound',
      file_url: '/premium-music/chimenea-acogedora.wav',
      category: 'relaxation',
      tier: 'standard',
      is_premium: true,
      duration: 300
    },
    {
      title: 'Cinemática Ambient',
      description: 'Música cinematográfica envolvente para sesiones de journaling profundo',
      type: 'music',
      file_url: '/premium-music/cinematica-ambient.wav',
      category: 'focus',
      tier: 'standard',
      is_premium: true,
      duration: 300
    },
    {
      title: 'Energía de Cristal',
      description: 'Frecuencias de cristales para elevar tu vibración mientras planificas',
      type: 'music',
      file_url: '/premium-music/energia-cristal.wav',
      category: 'focus',
      tier: 'total',
      is_premium: true,
      duration: 300
    },
    {
      title: 'Espiritual Moderna',
      description: 'Música espiritual contemporánea para conectar con tu esencia',
      type: 'music',
      file_url: '/premium-music/espiritual-moderna.wav',
      category: 'meditation',
      tier: 'total',
      is_premium: true,
      duration: 300
    },
    {
      title: 'Hora Dorada',
      description: 'Ambiente cálido y luminoso perfecto para reflexiones matutinas',
      type: 'music',
      file_url: '/premium-music/hora-dorada.wav',
      category: 'relaxation',
      tier: 'standard',
      is_premium: true,
      duration: 300
    },
    {
      title: 'Meditación en el Bosque',
      description: 'Sonidos naturales del bosque con música meditativa suave',
      type: 'meditation',
      file_url: '/premium-music/meditacion-bosque.wav',
      category: 'meditation',
      tier: 'standard',
      is_premium: true,
      duration: 300
    },
    {
      title: 'Ritual de Lluvia',
      description: 'Lluvia suave con música ambiente para rituales de escritura profunda',
      type: 'ambient_sound',
      file_url: '/premium-music/ritual-lluvia.wav',
      category: 'relaxation',
      tier: 'total',
      is_premium: true,
      duration: 300
    },
    {
      title: 'Viaje Cósmico',
      description: 'Soundscape espacial para expansión mental y creatividad',
      type: 'music',
      file_url: '/premium-music/viaje-cosmico.wav',
      category: 'focus',
      tier: 'total',
      is_premium: true,
      duration: 300
    }
  ]

  for (const track of musicTracks) {
    const existing = await prisma.mediaContent.findFirst({
      where: { title: track.title }
    })
    
    if (!existing) {
      await prisma.mediaContent.create({
        data: track
      })
      console.log(`✅ Música creada: ${track.title}`)
    } else {
      console.log(`⏭️  Música ya existe: ${track.title}`)
    }
  }

  console.log('\n✨ ¡Contenido premium poblado exitosamente!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
