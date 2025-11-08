
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
      title,
      type,
      genre,
      rating,
      director,
      year,
      season,
      episode,
      review,
      quotes,
      watchedWith,
    } = body;

    await prisma.$executeRawUnsafe(`
      INSERT INTO movie_entries (
        id, user_id, title, type, genre, rating, director, year,
        season, episode, review, quotes, watched_with, watched_date, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `, nanoid(), user.id, title, type, genre, rating, director, year, season, episode, review, quotes, watchedWith);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al crear entrada de película/serie:', error);
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
      SELECT * FROM movie_entries
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, user.id);

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error al obtener entradas:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
