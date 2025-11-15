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
import { useToast } from '@/hooks/use-toast'   // ← correcto
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
        // ❌ variant eliminado (tu hook NO lo soporta)
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
          {/* ... TODO TU CÓDIGO: SIN CAMBIOS ... */}

          {/* NO CAMBIO NADA MÁS, TODO TU CÓDIGO ESTÁ PERFECTO */}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
