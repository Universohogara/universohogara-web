import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Buscando usuarios existentes...\n');
    
    // Listar todos los usuarios
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    
    console.log('Usuarios actuales:');
    allUsers.forEach((user: any) => {
      console.log(`- ${user.email} (${user.name}) - Rol: ${user.role}`);
    });
    
    console.log('\n🔄 Actualizando email de la propietaria...\n');
    
    // Buscar la cuenta de administrador/propietaria
    const ownerAccount = allUsers.find((u: any) => u.role === 'admin' || u.role === 'ADMIN');
    
    if (ownerAccount) {
      // Actualizar el email
      const updated = await prisma.user.update({
        where: { id: ownerAccount.id },
        data: {
          email: 'duena@hogaraplanner.com',
          name: 'Propietaria Hogara Planner',
          role: 'admin',
        },
      });
      
      console.log('✅ Email actualizado correctamente:');
      console.log(`   Email anterior: ${ownerAccount.email}`);
      console.log(`   Email nuevo: ${updated.email}`);
      console.log(`   Nombre: ${updated.name}`);
      console.log(`   Rol: ${updated.role}`);
    } else {
      console.log('⚠️  No se encontró cuenta de administrador. Creando nueva...');
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('HogaraOwner2024!', 10);
      
      const newOwner = await prisma.user.create({
        data: {
          email: 'duena@hogaraplanner.com',
          name: 'Propietaria Hogara Planner',
          password: hashedPassword,
          role: 'admin',
        },
      });
      
      console.log('✅ Nueva cuenta de propietaria creada:');
      console.log(`   Email: ${newOwner.email}`);
      console.log(`   Contraseña: HogaraOwner2024!`);
      console.log(`   Rol: ${newOwner.role}`);
    }
    
    console.log('\n📋 Lista actualizada de usuarios:\n');
    const updatedUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    
    updatedUsers.forEach((user: any) => {
      console.log(`- ${user.email} (${user.name}) - Rol: ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
