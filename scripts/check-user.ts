import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscription: {
          select: {
            status: true,
            plan_tier: true,
            price: true
          }
        }
      }
    })
    
    console.log('📊 Usuarios en la base de datos:')
    console.log(JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()
