
/**
 * API: Obtener Límites de Voces Mágicas
 * GET /api/magic-voice/limits
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getUserVoiceLimits } from '@/lib/magic-voice-manager';

export async function GET(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // 2. Obtener límites del usuario
    const limits = await getUserVoiceLimits(session.user.id);

    // 3. Devolver información
    return NextResponse.json({
      success: true,
      limits: {
        used: limits.used,
        limit: limits.limit,
        purchased: limits.purchased,
        total: limits.total,
        canUseVoice: limits.canUseVoice,
        resetDate: limits.resetDate,
        remaining: limits.total - limits.used,
        percentage: Math.round((limits.used / limits.total) * 100),
      },
    });
  } catch (error) {
    console.error('❌ Error en /api/magic-voice/limits:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

