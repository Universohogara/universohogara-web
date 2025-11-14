
'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Heart, Loader2 } from 'lucide-react'
import { products } from '@/lib/products-data'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/contexts/cart-context'

export default function CarritoPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleRemoveItem = (productId: string, variantId: string | undefined) => {
    removeFromCart(productId, variantId)
    toast({
      title: "Producto eliminado",
      description: "El producto se ha eliminado del carrito",
    })
  }

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Carrito vaciado",
      description: "Todos los productos han sido eliminados",
    })
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/stripe/create-product-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          origin: window.location.origin,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago')
      }

      // Redirigir a Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo procesar el pago. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        
        <main className="section-padding bg-gradient-to-br from-white to-hogara-pink/5">
          <div className="container max-w-2xl text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-hogara-pink/20 mb-6">
                <ShoppingBag className="w-12 h-12 text-hogara-gold" />
              </div>
              
              <h1 className="text-3xl font-heading font-medium text-hogara-gray mb-4">
                Tu carrito está vacío
              </h1>
              
              <p className="text-lg text-hogara-gray/70 mb-8">
                Descubre nuestra colección y añade tus productos favoritos
              </p>
              
              <Link href="/tienda">
                <Button size="lg" className="bg-hogara-gold hover:bg-hogara-gold/90">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Ir a la tienda
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="section-padding bg-gradient-to-br from-white to-hogara-pink/5">
        <div className="container max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link 
                href="/tienda"
                className="inline-flex items-center text-hogara-gold hover:text-hogara-gold/80 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Seguir comprando
              </Link>
              
              <h1 className="text-4xl lg:text-5xl font-heading font-medium text-hogara-gray mb-4">
                Tu Carrito
              </h1>
              
              <p className="text-lg text-hogara-gray/70">
                {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en tu carrito
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => {
                const product = products.find(p => p.id === item.productId)
                if (!product) return null

                const variant = item.variantId 
                  ? product.variants?.find(v => v.id === item.variantId)
                  : null

                const price = variant ? variant.price : product.price
                const name = variant ? `${product.name} - ${variant.name}` : product.name

                return (
                  <motion.div
                    key={`${item.productId}-${item.variantId || 'default'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-hogara-gray/10"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-lg font-medium text-hogara-gray mb-1 truncate">
                          {name}
                        </h3>
                        <p className="text-sm text-hogara-gray/60 mb-4">
                          {price.toFixed(2)}€ × {item.quantity}
                        </p>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="w-8 h-8"
                              onClick={() => updateQuantity(item.productId, item.variantId, -1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            
                            <Button
                              size="icon"
                              variant="outline"
                              className="w-8 h-8"
                              onClick={() => updateQuantity(item.productId, item.variantId, 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-hogara-gray">
                              {(price * item.quantity).toFixed(2)}€
                            </span>
                            
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleRemoveItem(item.productId, item.variantId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                onClick={handleClearCart}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vaciar carrito
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-hogara-gray/10 sticky top-8"
              >
                <h2 className="text-2xl font-heading font-medium text-hogara-gray mb-6">
                  Resumen
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-hogara-gray/70">
                    <span>Subtotal</span>
                    <span>{getCartTotal().toFixed(2)}€</span>
                  </div>
                  
                  <div className="flex justify-between text-hogara-gray/70">
                    <span>Envío</span>
                    <span>Calculado en el checkout</span>
                  </div>

                  <div className="border-t border-hogara-gray/10 pt-4">
                    <div className="flex justify-between text-xl font-semibold text-hogara-gray">
                      <span>Total</span>
                      <span>{getCartTotal().toFixed(2)}€</span>
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-hogara-gold hover:bg-hogara-gold/90 mb-4"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Proceder al pago'
                  )}
                </Button>

                <Link href="/tienda">
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="w-full"
                  >
                    Continuar comprando
                  </Button>
                </Link>

                <div className="mt-6 pt-6 border-t border-hogara-gray/10 space-y-3">
                  <div className="flex items-center text-sm text-hogara-gray/70">
                    <Heart className="w-4 h-4 mr-2 text-hogara-pink" />
                    Envío seguro y cuidado
                  </div>
                  <div className="flex items-center text-sm text-hogara-gray/70">
                    <ShoppingBag className="w-4 h-4 mr-2 text-hogara-pink" />
                    Embalaje artesanal
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
