
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📦 Listando productos...\n');

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      description: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  if (products.length === 0) {
    console.log('⚠️  No hay productos en la base de datos');
  } else {
    products.forEach((product: any, index: any) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Slug: ${product.slug}`);
      console.log(`   Categoría: ${product.category}`);
      console.log(`   Descripción: ${product.description}\n`);
    });
  }

  console.log(`Total de productos: ${products.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
