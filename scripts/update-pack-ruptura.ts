
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Actualizando Pack CSI a Pack de Ruptura...\n');

  // Buscar el producto CSI por slug
  const oldProduct = await prisma.product.findUnique({
    where: { slug: 'kit-csi-post-cita' },
  });

  if (oldProduct) {
    console.log('✅ Producto encontrado:', oldProduct.name);
    
    // Actualizar el producto
    const updatedProduct = await prisma.product.update({
      where: { id: oldProduct.id },
      data: {
        name: 'Pack de Ruptura: Ritual de Sanación + Planner A5',
        slug: 'pack-ruptura-sanacion',
        description: 'Tu refugio sagrado cuando el corazón necesita volver a casa',
        category: 'Kits',
      },
    });

    console.log('✅ Producto actualizado:', updatedProduct.name);
    console.log('✅ Nuevo slug:', updatedProduct.slug);
  } else {
    console.log('⚠️  No se encontró el producto CSI, buscando por nombre...');
    
    const productByName = await prisma.product.findFirst({
      where: {
        OR: [
          { name: { contains: 'CSI' } },
          { name: { contains: 'Citas Sospechosas' } },
        ],
      },
    });

    if (productByName) {
      console.log('✅ Producto encontrado:', productByName.name);
      
      const updatedProduct = await prisma.product.update({
        where: { id: productByName.id },
        data: {
          name: 'Pack de Ruptura: Ritual de Sanación + Planner A5',
          slug: 'pack-ruptura-sanacion',
          description: 'Tu refugio sagrado cuando el corazón necesita volver a casa',
          category: 'Kits',
        },
      });

      console.log('✅ Producto actualizado:', updatedProduct.name);
      console.log('✅ Nuevo slug:', updatedProduct.slug);
    } else {
      console.log('❌ No se encontró ningún producto CSI en la base de datos');
    }
  }

  console.log('\n✨ Actualización completada');
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
