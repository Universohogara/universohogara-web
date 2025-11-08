
/**
 * API: Generar Voz Mágica con Piper TTS
 * POST /api/magic-voice/generate
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { generateMagicVoice, getUserVoiceLimits } from '@/lib/magic-voice-manager';

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
    const { text, companionType } = await request.json();

    if (!text || !companionType) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // 3. Validar longitud del texto (máximo 500 caracteres)
    if (text.length > 500) {
      return NextResponse.json(
        { error: 'El texto es demasiado largo (máximo 500 caracteres)' },
        { status: 400 }
      );
    }

    // 4. Generar voz mágica
    const result = await generateMagicVoice(
      session.user.id,
      text,
      companionType
    );

    // 5. Si se excedió el límite, devolver error especial
    if (result.limitsExceeded) {
      const limits = await getUserVoiceLimits(session.user.id);
      
      return NextResponse.json(
        {
          error: 'magic_depleted',
          message: '✨ Mi magia se ha agotado por hoy...',
          limits: {
            used: limits.used,
            total: limits.total,
            resetDate: limits.resetDate,
          },
          packs: [
            { type: 'pack_50', voices: 50, price: 2.99, emoji: '🌟' },
            { type: 'pack_150', voices: 150, price: 4.99, emoji: '✨' },
            { type: 'pack_500', voices: 500, price: 9.99, emoji: '🔮' },
          ],
        },
        { status: 429 }
      );
    }

    // 6. Si hubo otro error, devolverlo
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Error al generar voz' },
        { status: 500 }
      );
    }

    // 7. Éxito - devolver datos de la voz
    return NextResponse.json({
      success: true,
      audioUrl: result.audioUrl,
      duration: result.duration,
      cached: result.cached,
      remainingVoices: result.remainingVoices,
    });
  } catch (error) {
    console.error('❌ Error en /api/magic-voice/generate:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

