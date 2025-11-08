
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const body = await req.json();
    const {
      bookTitle,
      author,
      pages,
      totalPages,
      rating,
      genre,
      status,
      review,
      quotes,
    } = body;

    // Ejecutar SQL directo para insertar
    await prisma.$executeRawUnsafe(`
      INSERT INTO reading_entries (
        id, user_id, book_title, author, pages, total_pages,
        rating, genre, status, review, quotes, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `, nanoid(), user.id, bookTitle, author, pages || 0, totalPages, rating, genre, status, review, quotes);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al crear entrada de lectura:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const entries = await prisma.$queryRawUnsafe(`
      SELECT * FROM reading_entries
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, user.id);

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error al obtener entradas:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
