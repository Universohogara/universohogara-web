import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🧹 Limpiando cuentas innecesarias...\n');
    
    // Eliminar cuentas de prueba, manteniendo solo duena@hogaraplanner.com
    const emailsToDelete = ['john@doe.com', 'ana@hogaraplanner.com'];
    
    for (const email of emailsToDelete) {
      const deleted = await prisma.user.deleteMany({
        where: { email },
      });
      if (deleted.count > 0) {
        console.log(`✅ Eliminada cuenta: ${email}`);
      }
    }
    
    console.log('\n📋 Cuenta activa:\n');
    const mainAccount = await prisma.user.findUnique({
      where: { email: 'duena@hogaraplanner.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        created_at: true,
      },
    });
    
    if (mainAccount) {
      console.log(`✨ Email: ${mainAccount.email}`);
      console.log(`   Nombre: ${mainAccount.name}`);
      console.log(`   Rol: ${mainAccount.role}`);
      console.log(`   Creada: ${mainAccount.created_at.toLocaleDateString('es-ES')}`);
      
      // Asegurar que tiene los permisos correctos
      await prisma.user.update({
        where: { id: mainAccount.id },
        data: {
          name: 'Propietaria Hogara Planner',
          role: 'admin',
        },
      });
      
      console.log('\n✅ Cuenta actualizada y lista para usar');
    } else {
      console.log('⚠️  No se encontró la cuenta duena@hogaraplanner.com');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
