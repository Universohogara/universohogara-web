import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Limpiando duplicados de la base de datos...\n')

  // 1. Limpiar plantillas duplicadas - mantener solo las últimas 6 que creamos
  console.log('📄 Limpiando plantillas duplicadas...')
  
  const keepTemplateNames = [
    'Kit de Agradecimiento Diario',
    'Kit Post-Cita (CSI)',
    'Kit Redes Sociales Consciente',
    'Trackers Anuales Completos',
    'Kit de Ruptura y Sanación',
    'Pack Agradecimiento Especial'
  ]

  // Eliminar todas las plantillas que no estén en nuestra lista
  const deletedTemplates = await prisma.template.deleteMany({
    where: {
      name: {
        notIn: keepTemplateNames
      }
    }
  })
  console.log(`✅ Eliminadas ${deletedTemplates.count} plantillas duplicadas`)

  // 2. Limpiar retos duplicados - mantener solo los últimos 4
  console.log('\n🏆 Limpiando retos duplicados...')
  
  const keepChallengeNames = [
    'Reto de Gratitud 21 Días',
    'Energía Vital 21 Días',
    'Limpieza Emocional 21 Días',
    'Hábitos de Oro 21 Días'
  ]

  // Eliminar todos los retos que no estén en nuestra lista
  const deletedChallenges = await prisma.challenge.deleteMany({
    where: {
      title: {
        notIn: keepChallengeNames
      }
    }
  })
  console.log(`✅ Eliminados ${deletedChallenges.count} retos duplicados`)

  // 3. Verificar contenido final
  const finalTemplates = await prisma.template.count()
  const finalChallenges = await prisma.challenge.count()
  
  console.log('\n✨ Limpieza completada:')
  console.log(`📄 Plantillas finales: ${finalTemplates}`)
  console.log(`🏆 Retos finales: ${finalChallenges}`)
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
