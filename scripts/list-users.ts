import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('👥 Listando usuarios...\n')
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      created_at: true
    },
    orderBy: {
      created_at: 'asc'
    }
  })
  
  users.forEach((user: any, index: any) => {
    console.log(`${index + 1}. ${user.email}`)
    console.log(`   Nombre: ${user.name || 'Sin nombre'}`)
    console.log(`   Rol: ${user.role}`)
    console.log(`   Creado: ${user.created_at}`)
    console.log('')
  })
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
