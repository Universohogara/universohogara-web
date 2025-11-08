
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Sembrando retos en la base de datos...')

  const challenges = [
    {
      title: '21 Días de Gratitud',
      description: 'Transforma tu perspectiva escribiendo tres cosas por las que estás agradecida cada día. La gratitud científicamente comprobada mejora el bienestar emocional.',
      duration: 21,
      category: 'gratitud',
      icon: 'heart',
      tier: 'total'
    },
    {
      title: 'Energía Matutina',
      description: 'Establece una rutina poderosa de mañana. 10 minutos de meditación, afirmaciones positivas y visualización de tu día ideal.',
      duration: 21,
      category: 'energia',
      icon: 'zap',
      tier: 'standard'
    },
    {
      title: 'Limpieza Emocional',
      description: 'Libera emociones atrapadas con journaling guiado. Escribe sobre tus sentimientos, identifica patrones y encuentra claridad.',
      duration: 21,
      category: 'limpieza_emocional',
      icon: 'sparkles',
      tier: 'total'
    },
    {
      title: 'Autocuidado Consciente',
      description: 'Dedica tiempo cada día a ti misma. Actividades de autocuidado, desde baños relajantes hasta momentos de silencio y reflexión.',
      duration: 21,
      category: 'autocuidado',
      icon: 'heart',
      tier: 'standard'
    },
    {
      title: 'Mindfulness Diario',
      description: 'Cultiva la presencia plena con prácticas de mindfulness. Observa tus pensamientos sin juicio y encuentra paz en el momento presente.',
      duration: 21,
      category: 'mindfulness',
      icon: 'sparkles',
      tier: 'total'
    }
  ]

  for (const challenge of challenges) {
    const existing = await prisma.challenge.findFirst({
      where: { title: challenge.title }
    })

    if (!existing) {
      const created = await prisma.challenge.create({
        data: challenge
      })
      console.log(`✅ Reto creado: ${created.title}`)
    } else {
      console.log(`⏭️  Reto ya existe: ${challenge.title}`)
    }
  }

  console.log('\n📊 Resumen de retos:')
  const allChallenges = await prisma.challenge.findMany()
  console.log(`Total de retos en base de datos: ${allChallenges.length}`)
  
  console.log('\n✨ ¡Seed de retos completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
