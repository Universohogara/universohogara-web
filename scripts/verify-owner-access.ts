import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Verificando credenciales de acceso...\n');
    
    const owner = await prisma.user.findUnique({
      where: { email: 'duena@hogaraplanner.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
    });
    
    if (owner) {
      console.log('✅ Cuenta encontrada:');
      console.log(`   📧 Email: ${owner.email}`);
      console.log(`   👤 Nombre: ${owner.name}`);
      console.log(`   🔑 Rol: ${owner.role}`);
      
      // Verificar si la contraseña es la estándar
      const passwords = ['HogaraOwner2024!', 'hogara2024', 'admin123', 'password123'];
      let foundPassword = null;
      
      if (owner.password) {
        for (const testPassword of passwords) {
          const isMatch = await bcrypt.compare(testPassword, owner.password);
          if (isMatch) {
            foundPassword = testPassword;
            break;
          }
        }
      }
      
      if (foundPassword) {
        console.log(`\n🔓 Contraseña actual: ${foundPassword}`);
      } else {
        console.log('\n⚠️  La contraseña no coincide con las contraseñas de prueba estándar.');
        console.log('   Actualizando a contraseña segura...');
        
        const newPassword = 'HogaraOwner2024!';
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await prisma.user.update({
          where: { id: owner.id },
          data: { password: hashedPassword },
        });
        
        console.log(`\n✅ Nueva contraseña establecida: ${newPassword}`);
      }
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎯 CREDENCIALES DE ACCESO:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📧 Email:      duena@hogaraplanner.com`);
      console.log(`🔑 Contraseña: ${foundPassword || 'HogaraOwner2024!'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
    } else {
      console.log('❌ No se encontró la cuenta.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
