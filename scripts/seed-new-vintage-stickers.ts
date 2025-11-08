
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const newVintageStickers = [
  // Gothic/Dark Academia
  {
    name: 'Llave Vintage',
    category: 'decorativo',
    image_url: '/images/stickers/gothic-key-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  },
  {
    name: 'Reloj de Bolsillo',
    category: 'decorativo',
    image_url: '/images/stickers/gothic-clock-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  },
  {
    name: 'Libros Antiguos',
    category: 'decorativo',
    image_url: '/images/stickers/gothic-books-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  },
  {
    name: 'Ventana Gótica',
    category: 'decorativo',
    image_url: '/images/stickers/gothic-architecture-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  },
  
  // Florales
  {
    name: 'Rosa Vintage',
    category: 'naturaleza',
    image_url: '/images/stickers/vintage-rose-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  },
  {
    name: 'Flores Silvestres',
    category: 'naturaleza',
    image_url: '/images/stickers/wildflowers-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  },
  {
    name: 'Ilustración Botánica',
    category: 'naturaleza',
    image_url: '/images/stickers/botanical-illustration-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  },
  {
    name: 'Flores Prensadas',
    category: 'naturaleza',
    image_url: '/images/stickers/pressed-flowers-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  },
  
  // Vehículos Vintage
  {
    name: 'Cadillac Rosa',
    category: 'decorativo',
    image_url: '/images/stickers/pink-vintage-car-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  },
  {
    name: 'Bicicleta Vintage',
    category: 'decorativo',
    image_url: '/images/stickers/vintage-bicycle-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  },
  {
    name: 'Máquina de Escribir',
    category: 'decorativo',
    image_url: '/images/stickers/vintage-typewriter-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  },
  {
    name: 'Cámara Antigua',
    category: 'decorativo',
    image_url: '/images/stickers/retro-camera-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  },
  
  // Paraguas y Clima
  {
    name: 'Paraguas Victoriano',
    category: 'decorativo',
    image_url: '/images/stickers/vintage-umbrella-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  },
  {
    name: 'Gotas de Lluvia',
    category: 'naturaleza',
    image_url: '/images/stickers/raindrops-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  },
  {
    name: 'Nube Vintage',
    category: 'naturaleza',
    image_url: '/images/stickers/vintage-cloud-01.png',
    is_premium: false,
    price_points: 0,
    tier: 'all',
    pack_required: 'none'
  }
]

async function main() {
  console.log('🎨 Agregando nuevos stickers vintage a la base de datos...')
  
  for (const sticker of newVintageStickers) {
    try {
      const existingSticker = await prisma.sticker.findFirst({
        where: { image_url: sticker.image_url }
      })
      
      if (!existingSticker) {
        await prisma.sticker.create({
          data: sticker
        })
        console.log(`✅ Agregado: ${sticker.name}`)
      } else {
        console.log(`⏭️  Ya existe: ${sticker.name}`)
      }
    } catch (error) {
      console.error(`❌ Error al agregar ${sticker.name}:`, error)
    }
  }
  
  console.log('\n✨ ¡Proceso completado!')
  
  // Mostrar estadísticas
  const totalStickers = await prisma.sticker.count()
  console.log(`📊 Total de stickers en la base de datos: ${totalStickers}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
