import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Actualizando cuenta de la dueña...\n')
  
  // Actualizar contraseña y asegurar que tenga rol admin
  const password = await bcrypt.hash('hogara2024', 10)
  
  const user = await prisma.user.update({
    where: { email: 'duena@hogaraplanner.com' },
    data: {
      password: password,
      role: 'admin'
    }
  })
  
  console.log('✅ Usuario actualizado:', user.email)
  console.log('   Nueva contraseña: hogara2024')
  
  // Crear o actualizar suscripción Premium Total
  await prisma.subscription.upsert({
    where: { user_id: user.id },
    update: {
      status: 'active',
      plan_tier: 'total',
      price: 15.00,
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
    },
    create: {
      user_id: user.id,
      status: 'active',
      plan_tier: 'total',
      price: 15.00,
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })
  
  console.log('✅ Suscripción Premium Total activa')
  
  // Crear estadísticas si no existen
  await prisma.userStatistics.upsert({
    where: { user_id: user.id },
    update: {},
    create: {
      user_id: user.id,
      total_journal_entries: 0,
      total_templates_completed: 0,
      total_challenges_completed: 0,
      active_days: 1,
      streak_days: 1,
    },
  })
  
  console.log('✅ Estadísticas creadas')
  console.log('\n🎉 Cuenta lista para usar!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
