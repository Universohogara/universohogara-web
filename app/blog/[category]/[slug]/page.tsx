
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/lib/blog-config';
import { prisma } from '@/lib/db';
import { ShareButton } from '@/components/blog/share-button';

interface PostPageProps {
  params: {
    category: string;
    slug: string;
  };
}

async function getPost(categorySlug: string, postSlug: string) {
  try {
    return await prisma.blogPost.findFirst({
      where: {
        category: categorySlug,
        slug: postSlug,
        published: true,
      },
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function getRelatedPosts(categorySlug: string, currentPostId: string) {
  try {
    return await prisma.blogPost.findMany({
      where: {
        category: categorySlug,
        published: true,
        id: { not: currentPostId },
      },
      orderBy: { created_at: 'desc' },
      take: 3,
    });
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.category, params.slug);
  const category = getCategoryBySlug(params.category);
  
  if (!post || !category) {
    return {
      title: 'Artículo no encontrado',
    };
  }

  return {
    title: `${post.title} | ${category.name}`,
    description: post.meta_description || post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt || post.title,
      type: 'article',
      publishedTime: post.created_at.toISOString(),
      authors: [post.author_name],
      images: post.image_url ? [post.image_url] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.category, params.slug);
  const category = getCategoryBySlug(params.category);
  
  if (!post || !category) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(params.category, post.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/blog" className="hover:text-gray-900 transition-colors">
            Blog
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link 
            href={`/blog/${category.slug}`} 
            className="hover:text-gray-900 transition-colors"
            style={{ color: category.color }}
          >
            {category.name}
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-400 line-clamp-1">{post.title}</span>
        </nav>

        {/* Category Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-10 h-10">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-contain"
            />
          </div>
          <span 
            className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ 
              backgroundColor: `${category.color}20`,
              color: category.color 
            }}
          >
            {category.icon} {category.name}
          </span>
          {post.featured && (
            <span className="flex items-center gap-1 text-sm text-amber-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Destacado
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {post.author_name}
          </div>
          <span className="text-gray-400">•</span>
          <time className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(post.created_at).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>

        {/* Featured Image */}
        {post.image_url && (
          <div className="relative aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-12 shadow-xl">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <div className="text-xl text-gray-700 leading-relaxed mb-8 p-6 rounded-2xl"
               style={{ backgroundColor: `${category.color}10` }}>
            {post.excerpt}
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && (
          <div className="flex flex-wrap gap-3 mb-12 pt-8 border-t">
            <span className="text-sm font-semibold text-gray-600">Etiquetas:</span>
            {post.tags.split(',').map((tag, idx) => (
              <span 
                key={idx}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${category.color}15`,
                  color: category.color
                }}
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Share Buttons */}
        <div className="flex items-center gap-4 mb-12 p-6 bg-gray-50 rounded-2xl">
          <span className="text-sm font-semibold text-gray-600">Compartir:</span>
          <ShareButton title={post.title} color={category.color} />
        </div>

        {/* Back to Category */}
        <div className="text-center">
          <Link 
            href={`/blog/${category.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-1"
            style={{ backgroundColor: category.color }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a {category.name}
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-100 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Más de {category.name}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${category.slug}/${relatedPost.slug}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {relatedPost.image_url && (
                    <div className="relative aspect-video bg-gray-200">
                      <Image
                        src={relatedPost.image_url}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text"
                        style={{ 
                          backgroundImage: `linear-gradient(to right, ${category.color}, ${category.color}dd)` 
                        }}>
                      {relatedPost.title}
                    </h3>
                    {relatedPost.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
