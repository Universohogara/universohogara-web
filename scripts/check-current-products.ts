import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    orderBy: { created_at: 'desc' }
  });

  console.log('\n=== PRODUCTOS ACTUALES EN LA BASE DE DATOS ===\n');
  products.forEach((product: any, index: any) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Slug: ${product.slug}`);
    console.log(`   Precio: ${product.price}€`);
    console.log(`   Categoría: ${product.category}`);
    console.log('');
  });

  console.log(`\nTotal productos: ${products.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
