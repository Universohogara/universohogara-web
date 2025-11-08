
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // ============== ADMIN USER (DUEÑA) ==============
  const ownerPassword = await bcrypt.hash('hogara2024', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'duena@hogaraplanner.com' },
    update: {
      password: ownerPassword,
      role: 'admin',
      name: 'Dueña Hogara'
    },
    create: {
      email: 'duena@hogaraplanner.com',
      name: 'Dueña Hogara',
      password: ownerPassword,
      role: 'admin',
    },
  })

  console.log('✅ Usuario admin (dueña) creado:', admin.email)

  // Crear suscripción Premium Total para admin
  await prisma.subscription.upsert({
    where: { user_id: admin.id },
    update: {
      status: 'active',
      plan_tier: 'total',
      price: 15.00,
    },
    create: {
      user_id: admin.id,
      status: 'active',
      plan_tier: 'total',
      price: 15.00,
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  // Crear estadísticas para admin
  await prisma.userStatistics.upsert({
    where: { user_id: admin.id },
    update: {},
    create: {
      user_id: admin.id,
      total_journal_entries: 0,
      total_templates_completed: 0,
      total_challenges_completed: 0,
      active_days: 1,
      streak_days: 1,
    },
  })

  // ============== CONTENIDO MULTIMEDIA ==============
  const musicTracks = [
    {
      title: 'Ambiente Cinematográfico',
      description: 'Música épica y emocional con cuerdas suaves y piano',
      type: 'music',
      file_url: '/premium-music/cinematica-ambient.wav',
      category: 'relaxation',
      is_premium: true,
      tier: 'standard',
      is_downloadable: true,
    },
    {
      title: 'Espiritual Moderna',
      description: 'Cuencos de cristal, pads electrónicos y voces etéreas',
      type: 'music',
      file_url: '/premium-music/espiritual-moderna.wav',
      category: 'meditation',
      is_premium: true,
      tier: 'standard',
      is_downloadable: true,
    },
    {
      title: 'Meditación del Bosque',
      description: 'Sonidos de la naturaleza mezclados con flauta suave y arpa',
      type: 'music',
      file_url: '/premium-music/meditacion-bosque.wav',
      category: 'meditation',
      is_premium: true,
      tier: 'standard',
      is_downloadable: false,
    },
    {
      title: 'Hora Dorada',
      description: 'Jazz lounge cálido con saxofón suave y ritmos gentiles',
      type: 'music',
      file_url: '/premium-music/hora-dorada.wav',
      category: 'focus',
      is_premium: true,
      tier: 'standard',
      is_downloadable: true,
    },
    {
      title: 'Viaje Cósmico',
      description: 'Ambient espacial con sintetizadores y sonidos celestiales',
      type: 'music',
      file_url: '/premium-music/viaje-cosmico.wav',
      category: 'relaxation',
      is_premium: true,
      tier: 'standard',
      is_downloadable: false,
    },
    {
      title: 'Chimenea Acogedora',
      description: 'Crepitar del fuego con guitarra acústica suave',
      type: 'music',
      file_url: '/premium-music/chimenea-acogedora.wav',
      category: 'sleep',
      is_premium: true,
      tier: 'standard',
      is_downloadable: true,
    },
    {
      title: 'Ritual de Lluvia',
      description: 'Sonido de lluvia con piano suave y truenos distantes',
      type: 'music',
      file_url: '/premium-music/ritual-lluvia.wav',
      category: 'sleep',
      is_premium: true,
      tier: 'standard',
      is_downloadable: false,
    },
    {
      title: 'Energía de Cristal',
      description: 'Sonidos de alta frecuencia, campanas y meditación ambient',
      type: 'music',
      file_url: '/premium-music/energia-cristal.wav',
      category: 'meditation',
      is_premium: true,
      tier: 'standard',
      is_downloadable: true,
    },
  ]

  for (const track of musicTracks) {
    await prisma.mediaContent.upsert({
      where: { id: track.title.toLowerCase().replace(/ /g, '-') },
      update: {},
      create: {
        id: track.title.toLowerCase().replace(/ /g, '-'),
        ...track,
        duration: 33,
      },
    })
  }

  console.log('✅ Contenido multimedia creado')

  // ============== PLANTILLAS INTERACTIVAS ==============
  const templates = [
    {
      name: 'Trackers Anuales',
      description: 'Seguimiento visual de hábitos, emociones y metas durante todo el año',
      category: 'tracker',
      pdf_url: '/TRACKERS ANUALES.pdf',
      tier: 'total',
      order: 1,
    },
    {
      name: 'Kit Post Cita',
      description: 'Plantillas para reflexionar y registrar tus experiencias después de una cita',
      category: 'worksheet',
      pdf_url: '/KIT POST CITA.pdf',
      tier: 'total',
      order: 2,
    },
    {
      name: 'Kit Redes Sociales',
      description: 'Planificador de contenido para redes sociales y estrategia digital',
      category: 'planner',
      pdf_url: '/KIT REDES SOCIALES.pdf',
      tier: 'total',
      order: 3,
    },
    {
      name: 'Pack Agradecimiento',
      description: 'Diario de gratitud y ejercicios para cultivar la apreciación diaria',
      category: 'ritual',
      pdf_url: '/PACK AGRADECIMIENTO.pdf',
      tier: 'total',
      order: 4,
    },
    {
      name: 'Kit Ruptura',
      description: 'Guía de 21 días para sanar y crecer después de una ruptura',
      category: 'ritual',
      pdf_url: '/kit ruptura.pdf',
      tier: 'total',
      order: 5,
    },
    {
      name: 'Kit Organización',
      description: 'Sistema completo de limpieza y organización del hogar',
      category: 'planner',
      pdf_url: '/KIT.pdf',
      tier: 'total',
      order: 6,
    },
  ]

  for (const template of templates) {
    await prisma.template.upsert({
      where: { name: template.name },
      update: template,
      create: template,
    })
  }

  console.log('✅ Plantillas interactivas creadas/actualizadas')

  // ============== RETOS MENSUALES ==============
  const challenges = [
    {
      title: '21 Días de Gratitud',
      description: 'Transforma tu vida cultivando el agradecimiento diario. Cada día recibirás un ejercicio diferente para conectar con las bendiciones de tu vida.',
      duration: 21,
      category: 'gratitud',
      icon: '🙏',
      tier: 'total',
    },
    {
      title: 'Energía Cristalina',
      description: 'Reto de 21 días para limpiar tu energía y elevar tu vibración. Incluye meditaciones, rituales y ejercicios de conexión espiritual.',
      duration: 21,
      category: 'energia',
      icon: '✨',
      tier: 'total',
    },
    {
      title: 'Limpieza Emocional',
      description: 'Libera emociones atascadas y patrones que ya no te sirven. 21 días de introspección, escritura terapéutica y liberación.',
      duration: 21,
      category: 'limpieza_emocional',
      icon: '🌊',
      tier: 'total',
    },
    {
      title: 'Rituales de Autocuidado',
      description: 'Aprende a priorizar tu bienestar con rituales diarios de amor propio. 21 días de mimos y conexión contigo misma.',
      duration: 21,
      category: 'autocuidado',
      icon: '💖',
      tier: 'standard',
    },
  ]

  try {
    for (const challenge of challenges) {
      await prisma.challenge.create({
        data: challenge,
      })
    }
    console.log('✅ Retos mensuales creados')
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('ℹ️  Retos ya existen, omitiendo...')
    } else {
      throw error
    }
  }

  // Crear plantillas interactivas protegidas
  console.log('📋 Creando plantillas protegidas...')
  
  const templatesData = [
    {
      name: 'Tracker Anual Completo',
      description: 'Seguimiento mensual de metas, hábitos y crecimiento personal durante todo el año. Visualiza tu progreso y celebra tus logros.',
      category: 'tracker',
      pdf_url: '/TRACKERS ANUALES.pdf',
      thumbnail: '/images/products/trackers-01.png',
      is_colorable: true,
      tier: 'standard',
      order: 1
    },
    {
      name: 'Planner Semanal de Bienestar',
      description: 'Organiza tu semana con intención. Equilibra productividad, autocuidado y momentos de calma en un solo lugar.',
      category: 'planner',
      pdf_url: '/KIT POST CITA.pdf',
      thumbnail: '/images/products/postcita-01.png',
      is_colorable: true,
      tier: 'standard',
      order: 2
    },
    {
      name: 'Diario de Gratitud Guiado',
      description: 'Cultiva una mentalidad positiva con prompts diarios para reconocer la abundancia en tu vida.',
      category: 'ritual',
      pdf_url: '/PACK AGRADECIMIENTO.pdf',
      thumbnail: '/images/products/agradecimiento-01.png',
      is_colorable: true,
      tier: 'total',
      order: 3
    },
    {
      name: 'Kit de Planificación de Contenido',
      description: 'Organiza tu estrategia de redes sociales con claridad. Ideal para emprendedoras creativas y creadoras de contenido.',
      category: 'planner',
      pdf_url: '/KIT REDES SOCIALES.pdf',
      thumbnail: '/images/products/redes-01.png',
      is_colorable: true,
      tier: 'total',
      order: 4
    },
    {
      name: 'Diario de Sanación Emocional',
      description: 'Acompañamiento guiado para procesar emociones difíciles y avanzar con amor propio. 21 días de transformación.',
      category: 'ritual',
      pdf_url: '/kit ruptura.pdf',
      thumbnail: null,
      is_colorable: false,
      tier: 'total',
      order: 5
    }
  ]

  for (const templateData of templatesData) {
    await prisma.template.upsert({
      where: { 
        name: templateData.name 
      },
      update: templateData,
      create: templateData
    })
  }

  const templateCount = await prisma.template.count()
  console.log(`✅ ${templateCount} plantillas protegidas creadas`)

  console.log('🎉 Seed completado exitosamente')
}

main()
  .catch((e) => {
    console.error('Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
