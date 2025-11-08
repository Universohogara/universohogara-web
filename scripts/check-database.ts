import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando base de datos...\n')

  // 1. Ver todos los usuarios
  console.log('👥 USUARIOS EN LA BASE DE DATOS:')
  const users = await prisma.user.findMany({
    include: {
      subscription: true
    }
  })
  
  users.forEach((user: any) => {
    console.log(`\n- Email: ${user.email}`)
    console.log(`  Nombre: ${user.name}`)
    console.log(`  Role: ${user.role}`)
    console.log(`  ID: ${user.id}`)
    if (user.subscription) {
      console.log(`  Suscripción: ${user.subscription.plan_tier} (${user.subscription.status})`)
    } else {
      console.log(`  Suscripción: Ninguna`)
    }
  })

  // 2. Ver todas las plantillas
  console.log('\n\n📄 PLANTILLAS EN LA BASE DE DATOS:')
  const templates = await prisma.template.findMany({
    orderBy: { order: 'asc' }
  })
  
  console.log(`Total: ${templates.length} plantillas\n`)
  templates.forEach((template: any) => {
    console.log(`- ${template.name}`)
    console.log(`  Tier: ${template.tier}`)
    console.log(`  Categoría: ${template.category}`)
    console.log(`  PDF: ${template.pdf_url}`)
  })

  // 3. Ver todos los retos
  console.log('\n\n🏆 RETOS EN LA BASE DE DATOS:')
  const challenges = await prisma.challenge.findMany({
    where: { is_active: true }
  })
  
  console.log(`Total: ${challenges.length} retos\n`)
  challenges.forEach((challenge: any) => {
    console.log(`- ${challenge.title}`)
    console.log(`  Tier: ${challenge.tier}`)
    console.log(`  Duración: ${challenge.duration} días`)
  })

  // 4. Ver música
  console.log('\n\n🎵 MÚSICA EN LA BASE DE DATOS:')
  const music = await prisma.mediaContent.findMany()
  
  console.log(`Total: ${music.length} pistas\n`)
  music.forEach((track: any) => {
    console.log(`- ${track.title} (${track.tier})`)
  })
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
