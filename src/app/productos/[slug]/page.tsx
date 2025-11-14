
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  ShoppingCart, Heart, ArrowLeft, Star, Check, 
  FileText, Package, Truck, Shield
} from 'lucide-react'
import { products, ProductVariant, getThumbnailPaths } from '@/lib/products-data'
import { useToast } from '@/hooks/use-toast'
import { ProtectedTemplatePreview } from '@/components/protected-template-preview'
import { useCart } from '@/contexts/cart-context'

export default function ProductoPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { addToCart } = useCart()
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  const product = products.find(p => p.slug === params?.slug)
  
  // Obtener rutas de las miniaturas con marca de agua
  const thumbnailPaths = product ? getThumbnailPaths(product) : []

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0])
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="section-padding bg-gradient-to-br from-white to-hogara-pink/5">
          <div className="container max-w-2xl text-center py-20">
            <h1 className="text-3xl font-heading font-medium text-hogara-gray mb-4">
              Producto no encontrado
            </h1>
            <Link href="/tienda">
              <Button size="lg" className="bg-hogara-gold hover:bg-hogara-gold/90">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la tienda
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price

  const handleAddToCart = () => {
    addToCart(product.id, selectedVariant?.id, quantity)
    
    toast({
      title: "¡Añadido al carrito!",
      description: `${product.name} se ha añadido correctamente`,
    })
  }

  const handleBuyNow = () => {
    addToCart(product.id, selectedVariant?.id, quantity)
    router.push('/carrito')
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="section-padding bg-gradient-to-br from-white to-hogara-pink/5">
        <div className="container max-w-7xl">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link 
              href="/tienda"
              className="inline-flex items-center text-hogara-gold hover:text-hogara-gold/80 text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la tienda
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 transition-all ${
                        selectedImage === index 
                          ? 'ring-2 ring-hogara-gold' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - imagen ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Category & Favorite */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-hogara-gold uppercase tracking-wide">
                  {product.category === 'planner' ? 'Planners' : 
                   product.category === 'kit' ? 'Kits' : 
                   product.category === 'pack' ? 'Packs' :
                   product.category === 'tracker' ? 'Trackers' : 'Complementos'}
                </span>
                
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      isFavorite 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-400'
                    }`}
                  />
                </Button>
              </div>

              {/* Title & Description */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-heading font-medium text-hogara-gray mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-hogara-gray/70 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-hogara-gold fill-current"
                    />
                  ))}
                </div>
                <span className="text-sm text-hogara-gray/60">
                  5.0 (120 valoraciones)
                </span>
              </div>

              {/* Price */}
              <div className="py-6 border-y border-hogara-gray/10">
                <div className="flex items-baseline space-x-2">
                  {product.priceFrom && <span className="text-gray-500">desde</span>}
                  <span className="text-4xl font-semibold text-hogara-gray">
                    {currentPrice.toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  <label className="text-sm font-medium text-hogara-gray">
                    Selecciona tu opción:
                  </label>
                  <div className="space-y-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedVariant?.id === variant.id
                            ? 'border-hogara-gold bg-hogara-gold/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-hogara-gray mb-1">
                              {variant.name}
                            </div>
                            <div className="text-sm text-hogara-gray/70">
                              {variant.description}
                            </div>
                          </div>
                          <div className="font-semibold text-hogara-gray ml-4">
                            {variant.price.toFixed(2)}€
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-hogara-gray">
                  Cantidad:
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Button 
                  size="lg"
                  className="w-full bg-hogara-gold hover:bg-hogara-gold/90"
                  onClick={handleBuyNow}
                >
                  Comprar ahora
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Añadir al carrito
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-hogara-gray/10">
                <div className="flex items-center space-x-3 text-sm text-hogara-gray/70">
                  <Truck className="w-5 h-5 text-hogara-pink" />
                  <span>Envío rápido</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-hogara-gray/70">
                  <Shield className="w-5 h-5 text-hogara-pink" />
                  <span>Pago seguro</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-hogara-gray/70">
                  <Package className="w-5 h-5 text-hogara-pink" />
                  <span>Embalaje artesanal</span>
                </div>
                {product.templatePdf && (
                  <div className="flex items-center space-x-3 text-sm text-hogara-gray/70">
                    <FileText className="w-5 h-5 text-hogara-pink" />
                    <span>{product.templatePages} páginas</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Long Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-hogara-gray/10">
              <h2 className="text-2xl font-heading font-medium text-hogara-gray mb-6">
                Descripción del producto
              </h2>
              <div className="prose prose-lg max-w-none text-hogara-gray/80 whitespace-pre-line">
                {product.longDescription}
              </div>
            </div>
          </motion.div>

          {/* Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-4xl mx-auto mb-16"
            >
              <div className="bg-gradient-to-br from-hogara-pink/10 to-hogara-gold/10 rounded-2xl p-8 lg:p-12">
                <h2 className="text-2xl font-heading font-medium text-hogara-gray mb-6">
                  ¿Qué incluye?
                </h2>
                <ul className="space-y-4">
                  {product.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-hogara-gold flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-hogara-gray/80 leading-relaxed">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Template Preview with Watermark */}
          {product.templatePdf && product.templatePages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-6xl mx-auto mb-16"
            >
              <ProtectedTemplatePreview
                productName={product.name}
                pdfPath={product.templatePdf}
                totalPages={product.templatePages}
                thumbnailImages={thumbnailPaths}
              />
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
