
'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Star, Filter } from 'lucide-react'
import { products, Product } from '@/lib/products-data'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/contexts/cart-context'

export default function TiendaPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const { toast } = useToast()
  const { addToCart } = useCart()

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'planner', name: 'Planners' },
    { id: 'kit', name: 'Kits' },
    { id: 'pack', name: 'Packs' },
    { id: 'tracker', name: 'Trackers' },
    { id: 'accessory', name: 'Complementos' },
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(productId)
    toast({
      title: "¡Añadido al carrito!",
      description: `${productName} se ha añadido correctamente`,
    })
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="section-padding bg-gradient-to-br from-white to-hogara-pink/5">
        <div className="container">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-heading font-medium text-hogara-gray mb-4"
            >
              Hogara Planner
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block"
            >
              <h2 className="magic-text-hogara text-center mb-6">
                Bienvenida a tu mundo de magia y calma
              </h2>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-hogara-gray/80 max-w-2xl mx-auto"
            >
              Descubre nuestra colección completa de planners, kits y accesorios diseñados con amor
            </motion.p>
          </div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            <Filter className="h-5 w-5 text-hogara-gold" />
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-hogara-gold text-white shadow-lg'
                    : 'bg-white text-hogara-gray border border-hogara-gray/20 hover:border-hogara-gold'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="product-card group"
              >
                {/* Image Container */}
                <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100">
                  <div className="aspect-square relative">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Badge */}
                  {product.featured && (
                    <div className="absolute top-3 left-3 bg-hogara-gold text-white text-xs px-3 py-1 rounded-full font-medium">
                      Destacado
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-9 h-9 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart 
                        className={`h-5 w-5 ${
                          favorites.has(product.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </Button>
                  </div>
                  
                  {/* Quick add to cart */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      className="w-full bg-white text-hogara-gray hover:bg-hogara-pink hover:text-white"
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToCart(product.id, product.name)
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Añadir al carrito
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  {/* Category */}
                  <div className="text-xs text-hogara-gold font-medium uppercase">
                    {product.category === 'planner' ? 'Planners' : 
                     product.category === 'kit' ? 'Kits' : 
                     product.category === 'pack' ? 'Packs' :
                     product.category === 'tracker' ? 'Trackers' : 'Complementos'}
                  </div>
                  
                  {/* Title */}
                  <Link href={`/productos/${product.slug}`}>
                    <h3 className="font-heading text-lg font-medium text-hogara-gray hover:text-hogara-gold transition-colors line-clamp-2 min-h-[3.5rem]">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {/* Description */}
                  <p className="text-sm text-hogara-gray/70 line-clamp-2 min-h-[2.5rem]">
                    {product.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 text-hogara-gold fill-current"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-hogara-gray/60">
                      5.0
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-semibold text-hogara-gray">
                        {product.priceFrom && 'desde '}
                        {product.price.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-hogara-gray/60">
                No se encontraron productos en esta categoría
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
