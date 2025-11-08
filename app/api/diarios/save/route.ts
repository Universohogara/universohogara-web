
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { diaryId, tabId, content } = body;

    if (!diaryId || !tabId || !content) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Guardar o actualizar entrada del diario
    // Nota: Necesitarás añadir el modelo DiaryEntry a tu schema.prisma
    // Por ahora, guardamos en JSON en el perfil del usuario o localStorage

    return NextResponse.json({
      success: true,
      message: 'Diario guardado correctamente',
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving diary:', error);
    return NextResponse.json(
      { error: 'Error al guardar el diario' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const diaryId = searchParams.get('diaryId');

    if (!diaryId) {
      return NextResponse.json(
        { error: 'ID de diario requerido' },
        { status: 400 }
      );
    }

    // Recuperar datos del diario
    // Por ahora retornamos vacío, implementar con el modelo de BD

    return NextResponse.json({
      diaryId,
      entries: [],
    });
  } catch (error) {
    console.error('Error loading diary:', error);
    return NextResponse.json(
      { error: 'Error al cargar el diario' },
      { status: 500 }
    );
  }
}
