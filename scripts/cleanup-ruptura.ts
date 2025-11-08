import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('\n🗑️  ELIMINANDO PRODUCTOS DEL PACK DE RUPTURA...\n');

  // IDs de los productos a eliminar
  const rupturaIds = [
    'cmh38jy5q0005wctzcpejknpc', // Pack Completo
    'cmh38jy5p0004wctzgv0y8lwq', // Kit
    'cmh38jy5n0003wctzozrwqimx'  // Hojas Sueltas
  ];

  for (const id of rupturaIds) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (product) {
      await prisma.product.delete({ where: { id } });
      console.log(`✅ Eliminado: ${product.name}`);
    }
  }

  console.log('\n✅ LIMPIEZA COMPLETADA\n');
  
  // Mostrar productos restantes
  const remaining = await prisma.product.findMany({
    orderBy: { created_at: 'desc' }
  });
  
  console.log('📦 PRODUCTOS RESTANTES:\n');
  remaining.forEach((p: any, i: any) => {
    console.log(`${i + 1}. ${p.name} (${p.price}€)`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
