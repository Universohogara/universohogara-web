
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, BlogCategorySlug } from '@/lib/blog-config';
import { prisma } from '@/lib/db';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.category);
  
  if (!category) {
    return {
      title: 'Categoría no encontrada',
    };
  }

  return {
    title: `${category.name} | Blog Universo Hogara`,
    description: category.description,
    openGraph: {
      title: `${category.name} | Blog Universo Hogara`,
      description: category.description,
      type: 'website',
    },
  };
}

async function getCategoryPosts(categorySlug: string) {
  try {
    return await prisma.blogPost.findMany({
      where: {
        category: categorySlug,
        published: true,
      },
      orderBy: { created_at: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.category);
  
  if (!category) {
    notFound();
  }

  const posts = await getCategoryPosts(params.category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Category Hero */}
      <section 
        className="relative py-16 px-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}05 100%)`
        }}
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br" 
               style={{ background: `linear-gradient(135deg, ${category.color} 0%, transparent 100%)` }} />
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Back to Blog */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al Blog
          </Link>

          <div className="flex items-center gap-6 mb-6">
            {/* Category Logo */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-contain drop-shadow-xl"
              />
            </div>

            <div>
              <div className="text-6xl mb-2">{category.icon}</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3"
                  style={{ color: category.color }}>
                {category.name}
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl">
                {category.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
              {posts.length} {posts.length === 1 ? 'artículo' : 'artículos'}
            </span>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-50">{category.icon}</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Próximamente
            </h3>
            <p className="text-gray-600 mb-8">
              Estamos preparando contenido inspirador para esta categoría
            </p>
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ backgroundColor: category.color }}
            >
              Explorar otros mundos
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${category.slug}/${post.slug}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Post Image */}
                {post.image_url && (
                  <div className="relative aspect-video bg-gray-200">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <time>
                      {new Date(post.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    {post.featured && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1" style={{ color: category.color }}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Destacado
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text"
                      style={{ 
                        backgroundImage: `linear-gradient(to right, ${category.color}, ${category.color}dd)` 
                      }}>
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Tags */}
                  {post.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.split(',').slice(0, 3).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${category.color}20`,
                            color: category.color
                          }}
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-sm font-semibold"
                       style={{ color: category.color }}>
                    Leer más
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
