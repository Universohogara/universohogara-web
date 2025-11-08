
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Obtener un post específico
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Error al obtener el post' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un post (solo admin)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
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

    // Verificar si el slug ya existe en otro post
    if (slug) {
      const existingPost = await prisma.blogPost.findFirst({
        where: {
          slug,
          id: { not: params.id },
        },
      });

      if (existingPost) {
        return NextResponse.json(
          { error: 'El slug ya existe' },
          { status: 400 }
        );
      }
    }

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(image_url !== undefined && { image_url }),
        ...(slug && { slug }),
        ...(category && { category }),
        ...(author_name !== undefined && { author_name }),
        ...(tags !== undefined && { tags }),
        ...(featured !== undefined && { featured }),
        ...(published !== undefined && { published }),
        ...(meta_description !== undefined && { meta_description }),
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el post' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un post (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    await prisma.blogPost.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Post eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el post' },
      { status: 500 }
    );
  }
}
