
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET - Obtener frases emocionales
 * Query params:
 * - companion_type: tipo de companion (opcional)
 * - emotion_type: tipo de emoción (opcional)
 * - is_active: solo activas (default true)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companionType = searchParams.get('companion_type');
    const emotionType = searchParams.get('emotion_type');
    const isActive = searchParams.get('is_active') !== 'false';

    const where: any = { is_active: isActive };
    
    if (companionType) {
      where.companion_type = companionType;
    }
    
    if (emotionType) {
      where.emotion_type = emotionType;
    }

    const phrases = await prisma.emotionalVoicePhrase.findMany({
      where,
      orderBy: [
        { companion_type: 'asc' },
        { emotion_type: 'asc' },
        { created_at: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      phrases,
      count: phrases.length
    });

  } catch (error: any) {
    console.error('❌ Error obteniendo frases emocionales:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al obtener frases emocionales' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Crear nueva frase emocional
 * Body:
 * {
 *   companion_type: string,
 *   phrase_id: string,
 *   emotion_type: string,
 *   text_content: string,
 *   audio_url: string,
 *   duration_seconds: number,
 *   language?: string,
 *   tone?: string,
 *   metadata?: object
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

    // Verificar que el usuario es admin
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
      select: { role: true }
    });

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Acceso denegado. Solo administradores.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      companion_type,
      phrase_id,
      emotion_type,
      text_content,
      audio_url,
      duration_seconds,
      language = 'es',
      tone,
      metadata
    } = body;

    // Validaciones
    if (!companion_type || !phrase_id || !emotion_type || !text_content || !audio_url || !duration_seconds) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Verificar si ya existe una frase con el mismo companion_type y phrase_id
    const existing = await prisma.emotionalVoicePhrase.findUnique({
      where: {
        companion_type_phrase_id: {
          companion_type,
          phrase_id
        }
      }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya existe una frase con este ID para este companion' },
        { status: 409 }
      );
    }

    // Crear la frase
    const phrase = await prisma.emotionalVoicePhrase.create({
      data: {
        companion_type,
        phrase_id,
        emotion_type,
        text_content,
        audio_url,
        duration_seconds: parseFloat(duration_seconds),
        language,
        tone,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });

    return NextResponse.json({
      success: true,
      phrase
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error creando frase emocional:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al crear frase emocional' 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT - Actualizar frase emocional existente
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario es admin
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
      select: { role: true }
    });

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Acceso denegado. Solo administradores.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de frase requerido' },
        { status: 400 }
      );
    }

    // Si se incluye metadata, convertirlo a string
    if (updateData.metadata && typeof updateData.metadata === 'object') {
      updateData.metadata = JSON.stringify(updateData.metadata);
    }

    // Incrementar versión
    const currentPhrase = await prisma.emotionalVoicePhrase.findUnique({
      where: { id }
    });

    if (!currentPhrase) {
      return NextResponse.json(
        { success: false, error: 'Frase no encontrada' },
        { status: 404 }
      );
    }

    const phrase = await prisma.emotionalVoicePhrase.update({
      where: { id },
      data: {
        ...updateData,
        version: currentPhrase.version + 1,
        last_updated: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      phrase
    });

  } catch (error: any) {
    console.error('❌ Error actualizando frase emocional:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al actualizar frase emocional' 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Eliminar frase emocional
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario es admin
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
      select: { role: true }
    });

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Acceso denegado. Solo administradores.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de frase requerido' },
        { status: 400 }
      );
    }

    await prisma.emotionalVoicePhrase.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Frase eliminada exitosamente'
    });

  } catch (error: any) {
    console.error('❌ Error eliminando frase emocional:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al eliminar frase emocional' 
      },
      { status: 500 }
    );
  }
}
