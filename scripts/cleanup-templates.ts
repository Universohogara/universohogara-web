
import { prisma } from '@/lib/db'

async function main() {
  console.log('🗑️  Limpiando templates existentes...')
  await prisma.template.deleteMany({})
  console.log('✅ Templates eliminados')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
