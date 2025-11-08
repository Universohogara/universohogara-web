
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: Obtener el progreso del usuario en una plantilla
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const progress = await prisma.templateProgress.findUnique({
      where: {
        user_id_template_id: {
          user_id: user.id,
          template_id: params.id
        }
      }
    });

    return NextResponse.json({
      drawing_data: progress?.drawing_data ? JSON.parse(progress.drawing_data) : null,
      completed: progress?.completed || false,
      last_accessed: progress?.last_accessed || null
    });

  } catch (error) {
    console.error('Error al obtener progreso:', error);
    return NextResponse.json({ error: 'Error al obtener progreso' }, { status: 500 });
  }
}

// POST: Guardar el progreso del usuario en una plantilla
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { drawing_data, completed } = body;

    const progress = await prisma.templateProgress.upsert({
      where: {
        user_id_template_id: {
          user_id: user.id,
          template_id: params.id
        }
      },
      create: {
        user_id: user.id,
        template_id: params.id,
        drawing_data: JSON.stringify(drawing_data),
        completed: completed || false,
        last_accessed: new Date()
      },
      update: {
        drawing_data: JSON.stringify(drawing_data),
        completed: completed || false,
        last_accessed: new Date(),
        updated_at: new Date()
      }
    });

    return NextResponse.json({ success: true, progress });

  } catch (error) {
    console.error('Error al guardar progreso:', error);
    return NextResponse.json({ error: 'Error al guardar progreso' }, { status: 500 });
  }
}
