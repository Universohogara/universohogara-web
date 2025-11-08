import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Eliminando cuenta duplicada...')
  
  // Eliminar la cuenta owner@hogaraplanner.com si existe
  const deletedUser = await prisma.user.deleteMany({
    where: {
      email: 'owner@hogaraplanner.com'
    }
  })
  
  if (deletedUser.count > 0) {
    console.log('✅ Cuenta duplicada eliminada')
  } else {
    console.log('ℹ️  No se encontró cuenta duplicada')
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
