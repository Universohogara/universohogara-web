
/**
 * Script para actualizar los stickers locales a versiones con fondo transparente
 */

import { config } from 'dotenv'
config()

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

const STICKERS_DIR = path.join(process.cwd(), 'public', 'images', 'stickers')

async function main() {
  console.log('🎨 Actualizando stickers a versiones transparentes...\n')

  // Obtener todos los stickers de la base de datos
  const stickers = await prisma.sticker.findMany()
  
  console.log(`📊 Total de stickers en BD: ${stickers.length}`)
  
  let updated = 0
  let notFound = 0
  let alreadyTransparent = 0
  
  for (const sticker of stickers) {
    const imageUrl = sticker.image_url
    
    // Solo procesar stickers locales (que empiezan con /images/stickers/)
    if (!imageUrl.startsWith('/images/stickers/')) {
      continue
    }
    
    // Si ya tiene _transparent, saltar
    if (imageUrl.includes('_transparent')) {
      alreadyTransparent++
      continue
    }
    
    // Construir la ruta del archivo transparente
    const fileName = path.basename(imageUrl)
    const fileNameWithoutExt = fileName.replace(/\.(png|jpg|jpeg)$/i, '')
    const transparentFileName = `${fileNameWithoutExt}_transparent.png`
    const transparentFilePath = path.join(STICKERS_DIR, transparentFileName)
    
    // Verificar si existe el archivo transparente
    if (fs.existsSync(transparentFilePath)) {
      // Actualizar la URL en la base de datos
      const newUrl = `/images/stickers/${transparentFileName}`
      
      await prisma.sticker.update({
        where: { id: sticker.id },
        data: { image_url: newUrl }
      })
      
      console.log(`✅ ${sticker.name}`)
      console.log(`   ${imageUrl} -> ${newUrl}`)
      updated++
    } else {
      console.log(`⏭️  ${sticker.name} - aún no procesado`)
      notFound++
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMEN:')
  console.log(`   ✅ Actualizados: ${updated}`)
  console.log(`   ⏭️  No procesados aún: ${notFound}`)
  console.log(`   ✓  Ya eran transparentes: ${alreadyTransparent}`)
  console.log('='.repeat(60))
  
  if (notFound > 0) {
    console.log('\n💡 Tip: Espera a que termine el procesamiento de imágenes y ejecuta este script de nuevo.')
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
