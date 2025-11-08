
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getScrapbookLimits, canCreatePage } from '@/lib/scrapbook-limits'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        scrapbook_pages: {
          orderBy: {
            updated_at: 'desc'
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      pages: user.scrapbook_pages
    })
  } catch (error) {
    console.error('Error al cargar páginas:', error)
    return NextResponse.json(
      { error: 'Error al cargar páginas' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { title, description, canvas_data, page_type, is_secret, private_notes, mood } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscription: true,
        scrapbook_pages: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar límites (nueva lógica sin Magic Pack)
    const subscriptionTier = user.subscription?.plan_tier || null
    const limits = getScrapbookLimits(user.role, subscriptionTier)
    const currentPages = user.scrapbook_pages.length

    if (!canCreatePage(currentPages, limits)) {
      return NextResponse.json({ 
        error: `Has alcanzado el límite de ${limits.maxPages} páginas de tu ${limits.planName}`,
        currentPages,
        maxPages: limits.maxPages
      }, { status: 403 })
    }

    // Verificar funcionalidades premium
    if (page_type === 'manifestation' && !limits.hasManifestationPage) {
      return NextResponse.json({ 
        error: 'La Página de Manifestación requiere el Plan Total (€15)' 
      }, { status: 403 })
    }

    if (is_secret && !limits.hasSecretPocket) {
      return NextResponse.json({ 
        error: 'El Bolsillo Secreto requiere el Plan Total (€15)' 
      }, { status: 403 })
    }

    // Crear página
    const page = await prisma.scrapbookPage.create({
      data: {
        user_id: user.id,
        title: title || 'Sin título',
        description: description || '',
        canvas_data: JSON.stringify(canvas_data),
        page_type: page_type || 'normal',
        is_secret: is_secret || false,
        private_notes: private_notes || null,
        mood: mood || 'light'
      }
    })

    return NextResponse.json({
      success: true,
      page
    })
  } catch (error) {
    console.error('Error al crear página:', error)
    return NextResponse.json(
      { error: 'Error al crear página' },
      { status: 500 }
    )
  }
}
