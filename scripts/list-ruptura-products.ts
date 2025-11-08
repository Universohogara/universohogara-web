import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Buscar productos relacionados con ruptura
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'ruptura', mode: 'insensitive' } },
        { name: { contains: 'CSI', mode: 'insensitive' } },
        { slug: { contains: 'ruptura', mode: 'insensitive' } },
        { slug: { contains: 'csi', mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      description: true,
      image_url: true,
      category: true,
      stock: true,
      variations: true
    }
  });

  console.log('\n=== PRODUCTOS RELACIONADOS CON RUPTURA ===\n');
  products.forEach((product: any) => {
    console.log(`ID: ${product.id}`);
    console.log(`Nombre: ${product.name}`);
    console.log(`Slug: ${product.slug}`);
    console.log(`Precio: ${product.price}€`);
    console.log(`Categoría: ${product.category}`);
    console.log(`Stock: ${product.stock}`);
    console.log(`Variaciones: ${product.variations || 'N/A'}`);
    console.log(`Imagen: ${product.image_url || 'Sin imagen'}`);
    console.log(`Descripción: ${product.description?.substring(0, 100)}...`);
    console.log('---\n');
  });

  console.log(`Total de productos encontrados: ${products.length}\n`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
