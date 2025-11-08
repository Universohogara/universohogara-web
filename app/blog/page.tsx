
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories } from '@/lib/blog-config';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Blog | Universo Hogara',
  description: 'Explora artículos inspiradores de todos los mundos del Universo Hogara',
  openGraph: {
    title: 'Blog | Universo Hogara',
    description: 'Explora artículos inspiradores de todos los mundos del Universo Hogara',
    type: 'website',
  },
};

async function getFeaturedPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: {
        published: true,
        featured: true,
      },
      orderBy: { created_at: 'desc' },
      take: 3,
    });
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

async function getPostCountByCategory() {
  try {
    const posts = await prisma.blogPost.groupBy({
      by: ['category'],
      where: { published: true },
      _count: true,
    });
    return posts.reduce((acc, item) => {
      acc[item.category] = item._count;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('Error fetching post counts:', error);
    return {};
  }
}

export default async function BlogHomePage() {
  const categories = getAllCategories();
  const featuredPosts = await getFeaturedPosts();
  const postCounts = await getPostCountByCategory();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
        <div className="absolute inset-0 bg-[url('/images/universo-hogara-map.png')] opacity-5 bg-cover bg-center" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Blog del Universo Hogara
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Descubre historias, consejos y sabiduría de cada mundo mágico
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              7 Mundos
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Contenido Inspirador
            </span>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Artículos Destacados</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.category}/${post.slug}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
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
                <div className="p-6">
                  <div className="text-sm text-purple-600 font-semibold mb-2">
                    {categories.find(c => c.slug === post.category)?.name || post.category}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Explora por Mundo</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/blog/${category.slug}`}
              className="group relative bg-white rounded-2xl shadow-lg p-8 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient Background */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />
              
              {/* Logo Image */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>

              {/* Icon Emoji */}
              <div className="text-5xl text-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>

              {/* Category Name */}
              <h3 className="text-2xl font-bold text-center mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text"
                  style={{ 
                    backgroundImage: `linear-gradient(to right, ${category.color}, ${category.color}dd)` 
                  }}>
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-center text-sm mb-4">
                {category.description}
              </p>

              {/* Post Count */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                <span>{postCounts[category.slug] || 0} artículos</span>
              </div>

              {/* Hover Arrow */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-6 h-6" style={{ color: category.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
