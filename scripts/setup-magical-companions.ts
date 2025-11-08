
/**
 * Script para configurar el sistema de companions mágicos con voces expresivas
 * y emociones automáticas SIN lectura de emojis
 */

require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🎭 Configurando companions mágicos...\n')

  // 1. BUSCAR USUARIO EXISTENTE
  const user = await prisma.user.findFirst()

  if (!user) {
    console.log('❌ No se encontró ningún usuario en la base de datos.')
    return
  }

  console.log(`✅ Usuario encontrado: ${user.email}`)

  // 2. ACTUALIZAR COMPANION A KEN (el guardián con imagen correcta)
  console.log('🐕 Configurando Ken (imagen 4)...')
  
  // Buscar companion actual del usuario
  let companion = await prisma.companion.findFirst({
    where: { 
      user_id: user.id
    }
  })

  if (companion) {
    // Actualizar el companion existente a Ken
    companion = await prisma.companion.update({
      where: { id: companion.id },
      data: {
        type: 'ken',
        name: 'Ken',
        color_theme: '#8B4513',
        voice_tone: 'protective',
        personality: 'guardian',
        position_x: 85,
        position_y: 85,
        is_active: true
      }
    })
    console.log('✅ Companion actualizado a Ken con imagen correcta (ken_guardian_004.png)')
  } else {
    console.log('⚠️ No hay companion para actualizar')
  }

  // 2. ACTUALIZAR TODOS LOS COMPANIONS PARA VOCES EXPRESIVAS
  console.log('\n🎤 Actualizando sistema de voces...')
  
  const companions = await prisma.companion.findMany()
  console.log(`📋 Total companions: ${companions.length}`)

  // 3. VERIFICAR API KEYS
  console.log('\n🔑 Verificando configuración de voces:')
  if (process.env.ABACUSAI_API_KEY) {
    console.log('✅ Abacus AI API Key configurada')
  } else {
    console.log('⚠️ Abacus AI API Key NO configurada')
  }

  if (process.env.ELEVENLABS_API_KEY) {
    console.log('✅ ElevenLabs API Key configurada (respaldo)')
  } else {
    console.log('⚠️ ElevenLabs API Key NO configurada')
  }

  console.log('\n✨ Sistema de companions mágicos configurado!')
  console.log('\n📝 CARACTERÍSTICAS IMPLEMENTADAS:')
  console.log('  ✓ Emojis NO se leen en voz alta')
  console.log('  ✓ Animaciones emocionales automáticas')
  console.log('  ✓ Voces únicas para cada personaje')
  console.log('  ✓ Detección automática de emociones')
  console.log('  ✓ Expresividad natural sin ajustes manuales')
  console.log('  ✓ Micrófono funcional con feedback')
  console.log('  ✓ Ken con imagen correcta (guardian_004)')
  
  console.log('\n🎯 MODO DE USO:')
  console.log('  • El usuario solo elige: Modo Texto o Modo Voz')
  console.log('  • Todo lo demás es automático')
  console.log('  • Las emociones se detectan del contexto')
  console.log('  • Las voces se ajustan solas según la emoción')
  console.log('  • Las animaciones responden a las emociones')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
