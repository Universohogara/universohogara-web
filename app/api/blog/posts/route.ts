
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Obtener posts (públicos o filtrados)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const published = searchParams.get('published');

    const where: any = {};

    // Filtrar por categoría
    if (category) {
      where.category = category;
    }

    // Filtrar por destacados
    if (featured === 'true') {
      where.featured = true;
    }

    // Filtrar por publicados (por defecto solo publicados)
    if (published !== 'all') {
      where.published = true;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Error al obtener los posts' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo post (solo admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      image_url,
      slug,
      category,
      author_name,
      tags,
      featured,
      published,
      meta_description,
    } = body;

    // Validar campos requeridos
    if (!title || !content || !category || !slug) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el slug ya existe
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'El slug ya existe' },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        excerpt,
        image_url,
        slug,
        category,
        author_name: author_name || 'Universo Hogara',
        tags,
        featured: featured || false,
        published: published !== undefined ? published : true,
        meta_description: meta_description || excerpt,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Error al crear el post' },
      { status: 500 }
    );
  }
}
