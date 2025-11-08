import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n🗑️  ELIMINANDO PRODUCTOS INCORRECTOS/DUPLICADOS...\n');
  
  // Eliminar productos relacionados con ruptura/CSI que estén mal
  const deleted = await prisma.product.deleteMany({
    where: {
      OR: [
        { slug: { contains: 'ruptura' } },
        { slug: { contains: 'csi' } },
        { slug: { contains: 'post-cita' } }
      ]
    }
  });
  
  console.log(`✓ Eliminados ${deleted.count} productos\n`);
  
  console.log('📦 CREANDO PACK CSI (Citas Altamente Sospechosas)...\n');
  
  // Pack CSI - Hojas sueltas
  const csiHojas = await prisma.product.create({
    data: {
      name: 'Pack CSI (Citas Altamente Sospechosas) - Hojas Sueltas',
      slug: 'pack-csi-hojas-sueltas',
      description: `💌 **16 páginas diseñadas para documentar y reflexionar sobre relaciones intensas**

Este kit de hojas sueltas te acompaña en el proceso de entender patrones, reconocer señales y transformar experiencias en aprendizaje consciente.

### ✨ Incluye:
- 16 páginas temáticas de alta calidad
- Diseño funcional y estético
- Formato compatible con carpetas A5

**Ideal para:** Reflexión personal, análisis de relaciones, autoconocimiento emocional

*Envío en sobre de cartón reforzado para máxima protección*`,
      price: 16.95,
      category: 'Kits',
      stock: 200,
      image_url: '/images/products/csi-portada.png',
      variations: JSON.stringify({ type: 'hojas', pages: 16 })
    }
  });
  console.log(`✓ ${csiHojas.name} - ${csiHojas.price}€`);
  
  // Pack CSI - Kit planner + boli
  const csiKit = await prisma.product.create({
    data: {
      name: 'Pack CSI (Citas Altamente Sospechosas) - Kit Planner + Boli',
      slug: 'pack-csi-kit-completo',
      description: `💌 **Sistema completo para documentar y transformar relaciones intensas**

Combina nuestro planner premium A5 con las 16 páginas especializadas del Pack CSI, más un bolígrafo de escritura suave para plasmar tus reflexiones más profundas.

### ✨ Incluye:
- Planner A5 Hogara (papel premium 120g)
- 16 páginas temáticas Pack CSI
- Bolígrafo de alta calidad
- Presentación en packaging artesanal

**Ideal para:** Terapia personal, journaling consciente, seguimiento emocional estructurado

*Cada kit se prepara artesanalmente con mimo y atención al detalle*`,
      price: 36.50,
      category: 'Kits',
      stock: 150,
      image_url: '/images/products/csi-portada.png',
      variations: JSON.stringify({ type: 'kit', includes: ['planner', 'hojas', 'boli'] })
    }
  });
  console.log(`✓ ${csiKit.name} - ${csiKit.price}€`);
  
  // Pack CSI - Pack completo
  const csiCompleto = await prisma.product.create({
    data: {
      name: 'Pack CSI (Citas Altamente Sospechosas) - Pack Completo',
      slug: 'pack-csi-completo',
      description: `💌 **Experiencia completa de sanación y claridad emocional**

El pack más completo para transformar experiencias relacionales intensas en autoconocimiento profundo. Incluye herramientas de escritura, organización y elementos simbólicos para tu proceso.

### ✨ Incluye:
- Planner A5 Hogara (papel premium 120g)
- 16 páginas temáticas Pack CSI
- Bolígrafo artesanal de escritura premium
- Complementos especiales seleccionados
- Packaging gift edition con sello Hogara

**Ideal para:** Regalo significativo, ritual de cierre/transformación, acompañamiento terapéutico

*Edición limitada preparada con intención y cuidado artesanal*`,
      price: 64.95,
      category: 'Packs',
      stock: 100,
      image_url: '/images/products/csi-portada.png',
      variations: JSON.stringify({ type: 'pack', premium: true })
    }
  });
  console.log(`✓ ${csiCompleto.name} - ${csiCompleto.price}€\n`);
  
  console.log('💔 CREANDO PACK 21 DÍAS DE RUPTURA...\n');
  
  // Pack Ruptura - Hojas sueltas
  const rupturaHojas = await prisma.product.create({
    data: {
      name: 'Pack 21 Días de Ruptura - Hojas Sueltas',
      slug: 'pack-ruptura-hojas-sueltas',
      description: `💔 **21 páginas para sanar una ruptura día a día**

Un acompañamiento estructurado de 21 días diseñado para procesar el duelo, recuperar tu energía y reconstruirte desde el amor propio. Cada página es un paso hacia tu sanación.

### ✨ Incluye:
- 21 páginas temáticas de sanación
- Ejercicios de escritura terapéutica
- Reflexiones guiadas día a día
- Formato A5 de alta calidad

**Ideal para:** Procesos de duelo amoroso, autoconocimiento, reconstrucción emocional

*Envío protegido en sobre de cartón con amor y cuidado*`,
      price: 18.95,
      category: 'Kits',
      stock: 200,
      image_url: '/images/products/ruptura-portada.png',
      variations: JSON.stringify({ type: 'hojas', pages: 21, days: 21 })
    }
  });
  console.log(`✓ ${rupturaHojas.name} - ${rupturaHojas.price}€`);
  
  // Pack Ruptura - Kit planner + boli
  const rupturaKit = await prisma.product.create({
    data: {
      name: 'Pack 21 Días de Ruptura - Kit Planner + Boli',
      slug: 'pack-ruptura-kit-completo',
      description: `💔 **Sistema completo de 21 días para transformar el dolor en crecimiento**

Tu compañero de sanación: planner premium + 21 páginas especializadas + herramienta de escritura. Todo lo que necesitas para acompañarte en este proceso sagrado de reconstrucción.

### ✨ Incluye:
- Planner A5 Hogara (papel premium 120g)
- 21 páginas de sanación estructurada
- Bolígrafo de escritura suave y fluida
- Packaging artesanal Hogara

**Ideal para:** Journaling terapéutico, ritual diario de autocuidado, transformación consciente

*Preparado con intención para acompañar tu proceso único*`,
      price: 39.95,
      category: 'Kits',
      stock: 150,
      image_url: '/images/products/ruptura-portada.png',
      variations: JSON.stringify({ type: 'kit', includes: ['planner', 'hojas', 'boli'] })
    }
  });
  console.log(`✓ ${rupturaKit.name} - ${rupturaKit.price}€`);
  
  // Pack Ruptura - Pack completo (ritual de sanación)
  const rupturaCompleto = await prisma.product.create({
    data: {
      name: 'Pack 21 Días de Ruptura - Pack Completo Ritual de Sanación',
      slug: 'pack-ruptura-completo',
      description: `💔✨ **Experiencia completa de 21 días: sanación, ritual y renacimiento**

El pack más completo para transformar una ruptura en tu mayor acto de amor propio. Incluye herramientas de escritura, elementos rituales y símbolos de sanación para acompañarte día a día.

### ✨ Incluye:
- Planner A5 Hogara (papel premium 120g)
- 21 páginas de sanación guiada
- Bolígrafo artesanal premium
- **Cuarzo rosa en forma de corazón** (amor propio y sanación emocional)
- **Vela eco-friendly aromática** para rituales de cierre
- **Pendientes artesanales** símbolo de renovación
- Piedras adicionales según disponibilidad de stock
- Packaging gift edition con sello Hogara

**Ideal para:** Rituales de cierre y renacimiento, regalo de amor propio, transformación profunda

*Edición limitada preparada artesanalmente con la intención de acompañar tu proceso sagrado de sanación*

> "Cada ruptura es una oportunidad de volver a ti con más fuerza, claridad y amor."`,
      price: 76.95,
      category: 'Packs',
      stock: 80,
      image_url: '/images/products/ruptura-portada.png',
      variations: JSON.stringify({ 
        type: 'pack', 
        premium: true, 
        ritual: true,
        includes: ['planner', 'hojas', 'boli', 'cuarzo_rosa', 'vela', 'pendientes', 'piedras']
      })
    }
  });
  console.log(`✓ ${rupturaCompleto.name} - ${rupturaCompleto.price}€\n`);
  
  console.log('✅ ESTRUCTURA COMPLETA CREADA\n');
  console.log('📊 RESUMEN:\n');
  console.log('Pack CSI (Citas Altamente Sospechosas):');
  console.log(`  • Hojas sueltas (16 pág): ${csiHojas.price}€`);
  console.log(`  • Kit planner + boli: ${csiKit.price}€`);
  console.log(`  • Pack completo: ${csiCompleto.price}€\n`);
  console.log('Pack 21 Días de Ruptura:');
  console.log(`  • Hojas sueltas (21 pág): ${rupturaHojas.price}€`);
  console.log(`  • Kit planner + boli: ${rupturaKit.price}€`);
  console.log(`  • Pack completo ritual: ${rupturaCompleto.price}€\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
