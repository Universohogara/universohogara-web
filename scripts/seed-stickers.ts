
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎨 Creando stickers para el scrapbook...')

  const stickers = [
    // Emociones
    { name: 'Corazón Rosa', image_url: '💗', category: 'emociones', is_premium: false, price_points: 0 },
    { name: 'Estrella Brillante', image_url: '✨', category: 'emociones', is_premium: false, price_points: 0 },
    { name: 'Sonrisa', image_url: '😊', category: 'emociones', is_premium: false, price_points: 0 },
    { name: 'Amor', image_url: '💕', category: 'emociones', is_premium: false, price_points: 0 },
    { name: 'Felicidad', image_url: '🌟', category: 'emociones', is_premium: true, price_points: 50 },
    { name: 'Paz', image_url: '☮️', category: 'emociones', is_premium: true, price_points: 50 },
    
    // Naturaleza
    { name: 'Flor Rosa', image_url: '🌸', category: 'naturaleza', is_premium: false, price_points: 0 },
    { name: 'Girasol', image_url: '🌻', category: 'naturaleza', is_premium: false, price_points: 0 },
    { name: 'Luna', image_url: '🌙', category: 'naturaleza', is_premium: false, price_points: 0 },
    { name: 'Sol', image_url: '☀️', category: 'naturaleza', is_premium: false, price_points: 0 },
    { name: 'Arcoíris', image_url: '🌈', category: 'naturaleza', is_premium: true, price_points: 60 },
    { name: 'Mariposa', image_url: '🦋', category: 'naturaleza', is_premium: true, price_points: 60 },
    
    // Decorativos
    { name: 'Corona', image_url: '👑', category: 'decorativo', is_premium: false, price_points: 0 },
    { name: 'Diamante', image_url: '💎', category: 'decorativo', is_premium: false, price_points: 0 },
    { name: 'Trofeo', image_url: '🏆', category: 'decorativo', is_premium: true, price_points: 70 },
    { name: 'Regalo', image_url: '🎁', category: 'decorativo', is_premium: false, price_points: 0 },
    { name: 'Globos', image_url: '🎈', category: 'decorativo', is_premium: false, price_points: 0 },
    { name: 'Confeti', image_url: '🎉', category: 'decorativo', is_premium: true, price_points: 50 },
    
    // Frases y símbolos
    { name: 'Tick Positivo', image_url: '✓', category: 'simbolos', is_premium: false, price_points: 0 },
    { name: 'Check', image_url: '✔️', category: 'simbolos', is_premium: false, price_points: 0 },
    { name: 'Música', image_url: '🎵', category: 'simbolos', is_premium: false, price_points: 0 },
    { name: 'Luz', image_url: '💡', category: 'simbolos', is_premium: false, price_points: 0 },
    { name: 'Fuego', image_url: '🔥', category: 'simbolos', is_premium: true, price_points: 40 },
    { name: 'Rayo', image_url: '⚡', category: 'simbolos', is_premium: true, price_points: 40 },
    
    // Objetos
    { name: 'Café', image_url: '☕', category: 'objetos', is_premium: false, price_points: 0 },
    { name: 'Libro', image_url: '📖', category: 'objetos', is_premium: false, price_points: 0 },
    { name: 'Lápiz', image_url: '✏️', category: 'objetos', is_premium: false, price_points: 0 },
    { name: 'Pincel', image_url: '🖌️', category: 'objetos', is_premium: true, price_points: 50 },
    { name: 'Paleta', image_url: '🎨', category: 'objetos', is_premium: true, price_points: 50 },
    { name: 'Cámara', image_url: '📷', category: 'objetos', is_premium: false, price_points: 0 },
  ]

  // Eliminar stickers existentes para evitar duplicados
  await prisma.sticker.deleteMany({})
  
  for (const sticker of stickers) {
    await prisma.sticker.create({
      data: {
        name: sticker.name,
        image_url: sticker.image_url,
        category: sticker.category,
        is_premium: sticker.is_premium,
        price_points: sticker.price_points,
        tier: 'all'
      }
    })
  }

  console.log(`✅ ${stickers.length} stickers creados exitosamente`)
  
  // Otorgar algunos stickers gratis a todos los usuarios existentes
  const users = await prisma.user.findMany()
  
  for (const user of users) {
    const freeStickers = await prisma.sticker.findMany({
      where: { is_premium: false },
      take: 10
    })
    
    for (const sticker of freeStickers) {
      await prisma.userSticker.upsert({
        where: {
          user_id_sticker_id: {
            user_id: user.id,
            sticker_id: sticker.id
          }
        },
        update: {},
        create: {
          user_id: user.id,
          sticker_id: sticker.id,
          unlock_method: 'free'
        }
      })
    }
  }
  
  console.log(`✅ Stickers gratuitos desbloqueados para ${users.length} usuarios`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
