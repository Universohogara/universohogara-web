
/**
 * API: Comprar Packs de Voces Mágicas
 * POST /api/magic-voice/packs
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { purchaseVoicePack } from '@/lib/magic-voice-manager';

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // 2. Obtener datos de la petición
    const { packType, paymentIntentId } = await request.json();

    // 3. Validar pack type
    const validPacks = ['pack_50', 'pack_150', 'pack_500'];
    if (!validPacks.includes(packType)) {
      return NextResponse.json(
        { error: 'Tipo de pack inválido' },
        { status: 400 }
      );
    }

    // 4. Validar payment intent (por ahora solo simulado)
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'ID de pago requerido' },
        { status: 400 }
      );
    }

    // 5. Procesar compra
    const success = await purchaseVoicePack(
      session.user.id,
      packType as 'pack_50' | 'pack_150' | 'pack_500',
      paymentIntentId
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Error al procesar la compra' },
        { status: 500 }
      );
    }

    // 6. Devolver éxito
    return NextResponse.json({
      success: true,
      message: '🎉 ¡Pack de voces mágicas adquirido!',
    });
  } catch (error) {
    console.error('❌ Error en /api/magic-voice/packs:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET: Listar packs disponibles
export async function GET(request: NextRequest) {
  return NextResponse.json({
    packs: [
      {
        type: 'pack_50',
        voices: 50,
        price: 2.99,
        emoji: '🌟',
        name: 'Pack Estrella',
        description: '50 voces mágicas adicionales',
        validDays: 30,
      },
      {
        type: 'pack_150',
        voices: 150,
        price: 4.99,
        emoji: '✨',
        name: 'Pack Brillante',
        description: '150 voces mágicas adicionales',
        validDays: 30,
        popular: true,
      },
      {
        type: 'pack_500',
        voices: 500,
        price: 9.99,
        emoji: '🔮',
        name: 'Pack Místico',
        description: '500 voces mágicas adicionales',
        validDays: 30,
        bestValue: true,
      },
    ],
  });
}

