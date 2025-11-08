import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎮 Seeding gamification data...')

  // ====================================
  // LOGROS (ACHIEVEMENTS)
  // ====================================
  const achievements = [
    // Journals
    {
      name: 'Primera Reflexión',
      description: 'Escribe tu primer diario',
      icon: '✨',
      points_reward: 10,
      category: 'journals',
      requirement: 'Completa 1 diario',
      tier: 'all'
    },
    {
      name: 'Escritora Consistente',
      description: 'Escribe 7 diarios',
      icon: '📖',
      points_reward: 50,
      category: 'journals',
      requirement: 'Completa 7 diarios',
      tier: 'all'
    },
    {
      name: 'Alma Expresiva',
      description: 'Escribe 30 diarios',
      icon: '🌟',
      points_reward: 200,
      category: 'journals',
      requirement: 'Completa 30 diarios',
      tier: 'all'
    },
    // Retos
    {
      name: 'Primera Transformación',
      description: 'Completa tu primer reto',
      icon: '🦋',
      points_reward: 30,
      category: 'challenges',
      requirement: 'Completa 1 reto',
      tier: 'standard'
    },
    {
      name: 'Guerrera de la Luz',
      description: 'Completa 3 retos',
      icon: '⚡',
      points_reward: 100,
      category: 'challenges',
      requirement: 'Completa 3 retos',
      tier: 'standard'
    },
    // Rachas
    {
      name: 'Constancia Mágica',
      description: 'Mantén una racha de 7 días',
      icon: '🔥',
      points_reward: 75,
      category: 'streaks',
      requirement: 'Racha de 7 días',
      tier: 'all'
    },
    {
      name: 'Ritual Inquebrantable',
      description: 'Mantén una racha de 21 días',
      icon: '💎',
      points_reward: 250,
      category: 'streaks',
      requirement: 'Racha de 21 días',
      tier: 'all'
    },
    // Comunidad
    {
      name: 'Voz del Corazón',
      description: 'Comparte tu primera publicación',
      icon: '💬',
      points_reward: 20,
      category: 'community',
      requirement: 'Primera publicación',
      tier: 'all'
    }
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: achievement,
      create: achievement
    })
  }

  console.log(`✅ ${achievements.length} logros creados`)

  // ====================================
  // STICKERS
  // ====================================
  const stickerCategories = [
    {
      category: 'emociones',
      stickers: [
        { name: '💖 Amor Propio', emoji: '💖', is_premium: false, price_points: 0 },
        { name: '✨ Magia Interior', emoji: '✨', is_premium: false, price_points: 0 },
        { name: '🌙 Serenidad', emoji: '🌙', is_premium: false, price_points: 0 },
        { name: '🦋 Transformación', emoji: '🦋', is_premium: false, price_points: 0 },
        { name: '💫 Gratitud', emoji: '💫', is_premium: true, price_points: 50, price_eur: 0.99 },
        { name: '🌸 Florecimiento', emoji: '🌸', is_premium: true, price_points: 50, price_eur: 0.99 }
      ]
    },
    {
      category: 'naturaleza',
      stickers: [
        { name: '🌿 Hojas Verdes', emoji: '🌿', is_premium: false, price_points: 0 },
        { name: '🍃 Brisa Suave', emoji: '🍃', is_premium: false, price_points: 0 },
        { name: '🌺 Flor Tropical', emoji: '🌺', is_premium: true, price_points: 30, price_eur: 0.99 },
        { name: '🌻 Girasol', emoji: '🌻', is_premium: true, price_points: 30, price_eur: 0.99 }
      ]
    },
    {
      category: 'celestial',
      stickers: [
        { name: '⭐ Estrella', emoji: '⭐', is_premium: false, price_points: 0 },
        { name: '🌟 Destello', emoji: '🌟', is_premium: false, price_points: 0 },
        { name: '✨ Chispa Mágica', emoji: '✨', is_premium: false, price_points: 0 },
        { name: '💎 Cristal', emoji: '💎', is_premium: true, price_points: 100, price_eur: 1.99 }
      ]
    },
    {
      category: 'frases',
      stickers: [
        { name: '"Soy luz"', emoji: '💡', is_premium: true, price_points: 75, price_eur: 1.49 },
        { name: '"Merece la pena"', emoji: '🌈', is_premium: true, price_points: 75, price_eur: 1.49 },
        { name: '"Tu magia aumenta"', emoji: '🔮', is_premium: true, price_points: 100, price_eur: 1.99 }
      ]
    }
  ]

  for (const group of stickerCategories) {
    for (const sticker of group.stickers) {
      // Usamos el emoji como image_url temporal
      await prisma.sticker.upsert({
        where: { id: `${group.category}-${sticker.name}`.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase() },
        update: {
          name: sticker.name,
          image_url: sticker.emoji,
          category: group.category,
          is_premium: sticker.is_premium,
          price_points: sticker.price_points,
          price_eur: sticker.price_eur,
          tier: 'all'
        },
        create: {
          id: `${group.category}-${sticker.name}`.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase(),
          name: sticker.name,
          image_url: sticker.emoji,
          category: group.category,
          is_premium: sticker.is_premium,
          price_points: sticker.price_points,
          price_eur: sticker.price_eur,
          tier: 'all'
        }
      })
    }
  }

  console.log('✅ Stickers creados')

  console.log('🎉 Gamification seeding completado!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
