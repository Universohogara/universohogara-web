
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎨 Creando colección artística de stickers para Hogara Planner...')

  // Mapear las rutas locales a las URLs del CDN
  const stickerData = [
    // SET 1: FLORES Y BOTANICALS (8 stickers)
    { name: 'Ramo de Rosas Vintage', image_url: 'https://cdn.abacus.ai/images/40b92ba6-4f45-4733-afb5-0f8b8b4ba760.png', category: 'Flores', is_premium: false, price_points: 0, description: 'Bouquet de rosas en tonos terracota y rosa suave, estilo acuarela' },
    { name: 'Flores Silvestres Secas', image_url: 'https://cdn.abacus.ai/images/d52cd0fc-1ab0-40a1-b567-d2aa17efaf0c.png', category: 'Flores', is_premium: false, price_points: 0, description: 'Lavanda y eucalipto con textura de herbario' },
    { name: 'Peonías Crema y Rosa', image_url: 'https://cdn.abacus.ai/images/7aa64253-0745-496a-9d20-ae29f502489b.png', category: 'Flores', is_premium: true, price_points: 50, description: 'Peonías románticas en tonos suaves con sombras delicadas' },
    { name: 'Rama de Olivo Dorada', image_url: 'https://cdn.abacus.ai/images/d3a9a3ba-4dd7-403d-b34d-3e49ec55188f.png', category: 'Flores', is_premium: false, price_points: 0, description: 'Rama dorada con hojas elegantes' },
    { name: 'Flores Prensadas Sepia', image_url: 'https://cdn.abacus.ai/images/0c63fa8b-e048-4d17-98c0-68f420ebc6a9.png', category: 'Flores', is_premium: true, price_points: 60, description: 'Composición de flores prensadas en tonos vintage' },
    { name: 'Flores de Cerezo', image_url: 'https://cdn.abacus.ai/images/fd08ca14-bb9d-48f6-b6a6-65936b29cfa8.png', category: 'Flores', is_premium: false, price_points: 0, description: 'Cherry blossoms aesthetic en tonos suaves' },
    { name: 'Girasoles Vintage', image_url: 'https://cdn.abacus.ai/images/bce81c2d-4f8c-473a-9bde-3eba36d33a6e.png', category: 'Flores', is_premium: true, price_points: 70, description: 'Bouquet de girasoles en tonos cálidos otoñales' },
    { name: 'Corona Floral', image_url: 'https://cdn.abacus.ai/images/5ca1fe90-b635-485e-9fc5-123a91ec83e5.png', category: 'Flores', is_premium: true, price_points: 80, description: 'Wreath circular con flores secas y botanicals' },

    // SET 2: LETTERING Y FRASES (10 stickers)
    { name: 'Respira', image_url: 'https://cdn.abacus.ai/images/255c1914-7a0e-4adb-8209-b36aafedf1ea.png', category: 'Lettering', is_premium: false, price_points: 0, description: 'Caligrafía moderna con textura suave' },
    { name: 'Tú Puedes', image_url: 'https://cdn.abacus.ai/images/96db9e2a-11f4-4260-80ad-ef5a1afa9e45.png', category: 'Lettering', is_premium: false, price_points: 0, description: 'Hand-lettering motivacional en tonos cálidos' },
    { name: 'Gratitud', image_url: 'https://cdn.abacus.ai/images/40b0a4fa-d807-4643-ac91-11940216beef.png', category: 'Lettering', is_premium: false, price_points: 0, description: 'Tipografía serif elegante en dorado' },
    { name: 'Hoy es un Buen Día', image_url: 'https://i.pinimg.com/736x/ed/ac/93/edac930017818cf0a062f01b45f87712.jpg', category: 'Lettering', is_premium: true, price_points: 40, description: 'Lettering cursivo artístico positivo' },
    { name: 'Crecimiento', image_url: 'https://i.ytimg.com/vi/zFGjynmcnH8/maxresdefault.jpg', category: 'Lettering', is_premium: true, price_points: 50, description: 'Tipografía moderna con decoración floral minimal' },
    { name: 'Amor Propio', image_url: 'https://www.shutterstock.com/image-vector/self-love-club-lettering-care-600nw-2388986317.jpg', category: 'Lettering', is_premium: false, price_points: 0, description: 'Lettering empoderador con textura de papel' },
    { name: 'Presente', image_url: 'https://i.pinimg.com/736x/dd/e9/e7/dde9e73ce271c901d1d2855b50583ed7.jpg', category: 'Lettering', is_premium: true, price_points: 60, description: 'Caligrafía zen con trazo de pincel' },
    { name: 'Sueña', image_url: 'https://i.ytimg.com/vi/hiPkIFSDtSg/hqdefault.jpg', category: 'Lettering', is_premium: false, price_points: 0, description: 'Palabra decorada con estrellas sutiles' },
    { name: 'Confía en Ti', image_url: 'https://i.pinimg.com/736x/3a/84/a4/3a84a456991b4c280761d420410cb7ec.jpg', category: 'Lettering', is_premium: true, price_points: 50, description: 'Lettering vintage empoderador' },
    { name: 'Nuevo Comienzo', image_url: 'https://i.pinimg.com/736x/06/47/6d/06476d3909b718466bd7d2a3f3787ba2.jpg', category: 'Lettering', is_premium: true, price_points: 60, description: 'Frase con elementos decorativos delicados' },

    // SET 3: CINTAS, SELLOS Y MARCOS (8 stickers)
    { name: 'Washi Tape Floral', image_url: 'https://cdn.abacus.ai/images/a1fddf0c-6a99-4e40-86df-d4e3e300db32.png', category: 'Decorativo', is_premium: false, price_points: 0, description: 'Cinta decorativa con patrón floral vintage' },
    { name: 'Sello Postal Antiguo', image_url: 'https://i.pinimg.com/1200x/df/5f/3a/df5f3ac72e356dacabb748685d4d7929.jpg', category: 'Decorativo', is_premium: false, price_points: 0, description: 'Sello postal con textura de papel envejecido' },
    { name: 'Marco Polaroid Dorado', image_url: 'https://i.pinimg.com/736x/f1/83/f7/f183f78bc361c5ac9fece9874aae4a26.jpg', category: 'Decorativo', is_premium: true, price_points: 70, description: 'Marco decorativo dorado estilo polaroid' },
    { name: 'Cinta de Seda Terracota', image_url: 'https://www.silkandwillow.com/cdn/shop/files/Terracottasilkribbon_19b04926-2087-4ebe-b38d-69d8a7d1cc02.jpg?v=1718809469&width=3464', category: 'Decorativo', is_premium: true, price_points: 60, description: 'Cinta realista con pliegues en tonos cálidos' },
    { name: 'Sello de Cera Hogara', image_url: 'https://cdn.abacus.ai/images/95121e9a-8a35-4905-8d97-bc7512bc0ae8.png', category: 'Decorativo', is_premium: true, price_points: 100, description: 'Sello de cera dorado con inicial "H" exclusivo' },
    { name: 'Papel Rasgado Vintage', image_url: 'https://thumbs.dreamstime.com/b/torn-paper-frame-4484327.jpg', category: 'Decorativo', is_premium: false, price_points: 0, description: 'Marco de papel con bordes irregulares' },
    { name: 'Cinta con Flores Prensadas', image_url: 'https://www.firstdayofhome.com/wp-content/uploads/2024/09/Easy-Pressed-Flower-Bookmark-16.jpg', category: 'Decorativo', is_premium: true, price_points: 80, description: 'Cinta transparente con flores delicadas' },
    { name: 'Clips Dorados', image_url: 'https://m.media-amazon.com/images/I/71cgnW5iC2L._AC_UF1000,1000_QL80_.jpg', category: 'Decorativo', is_premium: false, price_points: 0, description: 'Conjunto de clips metálicos decorativos' },

    // SET 4: ELEMENTOS MÍSTICOS (6 stickers)
    { name: 'Cuarzo Rosa', image_url: 'https://cdn.abacus.ai/images/e68ace9d-12a5-4305-9850-78d5a5215e0e.png', category: 'Místico', is_premium: true, price_points: 90, description: 'Cristal de cuarzo con brillos sutiles' },
    { name: 'Luna Creciente Dorada', image_url: 'https://cdn.abacus.ai/images/6124ef0e-2942-4b2b-b99c-a0b24b07b649.png', category: 'Místico', is_premium: true, price_points: 70, description: 'Luna con textura celestial en oro' },
    { name: 'Constelación Estelar', image_url: 'https://i.pinimg.com/564x/2c/82/86/2c82860cf0e07f7f822b6553e27ec024.jpg', category: 'Místico', is_premium: true, price_points: 80, description: 'Constelación en tonos dorados' },
    { name: 'Pluma Boho', image_url: 'https://ih1.redbubble.net/image.222276512.8805/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.u3.jpg', category: 'Místico', is_premium: false, price_points: 0, description: 'Pluma decorativa con detalles dorados' },
    { name: 'Mandala Delicado', image_url: 'https://i.ytimg.com/vi/SDz1dVtwNwc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB82NVzZKLF57sX4pJTBK0u2SyGGg', category: 'Místico', is_premium: true, price_points: 100, description: 'Mandala en tonos tierra y dorado' },
    { name: 'Vela Aromática', image_url: 'https://i.pinimg.com/originals/c5/18/e7/c518e7360f918e72072eccea79f77c7a.jpg', category: 'Místico', is_premium: false, price_points: 0, description: 'Vela vintage con llama suave' },

    // SET 5: TEXTURAS Y OVERLAYS (6 stickers)
    { name: 'Acuarela Terracota', image_url: 'https://cdn.abacus.ai/images/59c636c2-6faf-4327-8f77-7b65a5398811.png', category: 'Textura', is_premium: false, price_points: 0, description: 'Mancha de acuarela orgánica en tonos cálidos' },
    { name: 'Papel Vintage', image_url: 'https://i.pinimg.com/474x/c6/67/23/c66723752f7f3ee35d502513af43af16.jpg', category: 'Textura', is_premium: false, price_points: 0, description: 'Papel rasgado con bordes irregulares' },
    { name: 'Textura Lino', image_url: 'https://cdn.abacus.ai/images/ad30933c-9431-437e-b48c-9cc80bf765e3.png', category: 'Textura', is_premium: true, price_points: 50, description: 'Textura de tela de lino natural' },
    { name: 'Splash de Café', image_url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgqQAKoKJ_6h9HpjLEckajBD_2ws3dP-B4lBMrLNqwKAiB2b79Qh2lXbK8eqpkj2lnsijRSATUaC7B2wX6byjSkWOyMmvflOk2I21p0j7kMt77stvA9ta6gEe8tAzDO0ifH79r6KKMT8URr/s1600/mariya+olshevska+coffee+banner.jpg', category: 'Textura', is_premium: false, price_points: 0, description: 'Manchas orgánicas de café/té' },
    { name: 'Papel Antiguo Doblado', image_url: 'https://thumbs.dreamstime.com/b/blank-old-paper-sheet-folded-corners-vintage-background-creating-textured-aged-effect-old-blank-paper-vintage-384363065.jpg', category: 'Textura', is_premium: true, price_points: 60, description: 'Hoja de papel con esquinas dobladas' },
    { name: 'Mármol Cálido', image_url: 'https://i.pinimg.com/736x/e8/a5/24/e8a52433063a0f0d828a394342da256b.jpg', category: 'Textura', is_premium: true, price_points: 70, description: 'Textura de mármol en tonos tierra' },
  ]

  // Limpiar stickers existentes
  console.log('🧹 Limpiando stickers antiguos...')
  await prisma.sticker.deleteMany({})
  console.log('✅ Stickers antiguos eliminados')

  // Crear nuevos stickers artísticos
  console.log('✨ Creando nueva colección artística...')
  for (const sticker of stickerData) {
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

  console.log(`✅ ${stickerData.length} stickers artísticos creados exitosamente`)

  // Desbloquear stickers gratuitos para usuarios existentes
  const users = await prisma.user.findMany()
  console.log(`👥 Desbloqueando stickers gratuitos para ${users.length} usuarios...`)

  for (const user of users) {
    const freeStickers = await prisma.sticker.findMany({
      where: { is_premium: false }
    })

    for (const sticker of freeStickers) {
      try {
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
      } catch (error) {
        console.log(`⚠️  Sticker ya desbloqueado para usuario ${user.email}`)
      }
    }
  }

  console.log('✅ Stickers gratuitos desbloqueados para todos los usuarios')

  // Resumen final
  const totalStickers = await prisma.sticker.count()
  const freeStickers = await prisma.sticker.count({ where: { is_premium: false } })
  const premiumStickers = await prisma.sticker.count({ where: { is_premium: true } })

  console.log('\n📊 RESUMEN DE LA COLECCIÓN:')
  console.log(`   Total de stickers: ${totalStickers}`)
  console.log(`   Stickers gratuitos: ${freeStickers}`)
  console.log(`   Stickers premium: ${premiumStickers}`)
  console.log('\n🎨 Categorías:')
  console.log('   - Flores y Botanicals: 8 stickers')
  console.log('   - Lettering y Frases: 10 stickers')
  console.log('   - Decorativo: 8 stickers')
  console.log('   - Místico: 6 stickers')
  console.log('   - Textura: 6 stickers')
  console.log('\n🌟 ¡Colección artística de Hogara Planner lista!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
