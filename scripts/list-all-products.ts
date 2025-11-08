import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      category: true,
      stock: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  console.log('\n=== TODOS LOS PRODUCTOS ===\n');
  products.forEach((product: any) => {
    console.log(`ID: ${product.id}`);
    console.log(`Nombre: ${product.name}`);
    console.log(`Slug: ${product.slug}`);
    console.log(`Precio: ${product.price}€`);
    console.log(`Categoría: ${product.category}`);
    console.log(`Stock: ${product.stock}`);
    console.log('---\n');
  });

  console.log(`Total de productos: ${products.length}\n`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
