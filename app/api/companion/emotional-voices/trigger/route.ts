
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST - Obtener frase emocional por trigger y registrar reproducción
 * Body:
 * {
 *   companion_type: string,
 *   emotion_type: string (bienvenida|consolo|animo|felicitacion),
 *   trigger: string (descripción del trigger),
 *   context?: string (contexto de la conversación)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { companion_type, emotion_type, trigger, context } = body;

    if (!companion_type || !emotion_type || !trigger) {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // Buscar una frase activa del tipo solicitado
    const phrases = await prisma.emotionalVoicePhrase.findMany({
      where: {
        companion_type,
        emotion_type,
        is_active: true
      }
    });

    if (phrases.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No hay frases disponibles para este trigger',
        fallback: true
      }, { status: 404 });
    }

    // Seleccionar una frase aleatoria (para variedad)
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];

    // Obtener usuario actual
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Registrar la reproducción en el log
    await prisma.emotionalVoicePhrasePlayLog.create({
      data: {
        user_id: user.id,
        phrase_id: phrase.id,
        trigger,
        context: context || null
      }
    });

    return NextResponse.json({
      success: true,
      phrase: {
        id: phrase.id,
        text_content: phrase.text_content,
        audio_url: phrase.audio_url,
        duration_seconds: phrase.duration_seconds,
        companion_type: phrase.companion_type,
        emotion_type: phrase.emotion_type,
        tone: phrase.tone
      }
    });

  } catch (error: any) {
    console.error('❌ Error obteniendo frase por trigger:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al obtener frase emocional',
        fallback: true 
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Obtener estadísticas de reproducción
 * Query params:
 * - companion_type: filtrar por companion (opcional)
 * - emotion_type: filtrar por emoción (opcional)
 * - days: últimos N días (default 30)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const companionType = searchParams.get('companion_type');
    const emotionType = searchParams.get('emotion_type');
    const days = parseInt(searchParams.get('days') || '30');

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    // Construir filtros
    const where: any = {
      played_at: {
        gte: dateFrom
      }
    };

    // Si se especifica companion o emoción, hacer join con la tabla de frases
    const logs = await prisma.emotionalVoicePhrasePlayLog.findMany({
      where,
      include: {
        phrase: {
          select: {
            companion_type: true,
            emotion_type: true,
            phrase_id: true
          }
        }
      },
      orderBy: {
        played_at: 'desc'
      }
    });

    // Filtrar por companion_type y emotion_type si se especificaron
    let filteredLogs = logs;
    if (companionType) {
      filteredLogs = filteredLogs.filter((log: any) => log.phrase.companion_type === companionType);
    }
    if (emotionType) {
      filteredLogs = filteredLogs.filter((log: any) => log.phrase.emotion_type === emotionType);
    }

    // Calcular estadísticas
    const stats = {
      total_plays: filteredLogs.length,
      by_emotion: {} as Record<string, number>,
      by_companion: {} as Record<string, number>,
      by_trigger: {} as Record<string, number>
    };

    filteredLogs.forEach((log: any) => {
      // Por emoción
      const emotion = log.phrase.emotion_type;
      stats.by_emotion[emotion] = (stats.by_emotion[emotion] || 0) + 1;

      // Por companion
      const companion = log.phrase.companion_type;
      stats.by_companion[companion] = (stats.by_companion[companion] || 0) + 1;

      // Por trigger
      const trigger = log.trigger;
      stats.by_trigger[trigger] = (stats.by_trigger[trigger] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      stats,
      period_days: days
    });

  } catch (error: any) {
    console.error('❌ Error obteniendo estadísticas:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al obtener estadísticas' 
      },
      { status: 500 }
    );
  }
}
