
'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Star, Lock, Check, CreditCard, Zap } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import Image from 'next/image'

interface MagicPackUpgradeProps {
  isOpen: boolean
  onClose: () => void
  onPurchase?: (type: 'monthly' | 'one_time') => void
}

export default function MagicPackUpgrade({ isOpen, onClose, onPurchase }: MagicPackUpgradeProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'one_time'>('one_time')
  const [isPurchasing, setIsPurchasing] = useState(false)

  const features = [
    { icon: '📚', text: 'Páginas ilimitadas', highlight: true },
    { icon: '🎨', text: 'Todos los stickers (200+)', highlight: true },
    { icon: '🔐', text: 'Bolsillo secreto cifrado', highlight: false },
    { icon: '✨', text: 'Página de manifestación', highlight: false },
    { icon: '🌙', text: 'Modo ritual/noche', highlight: false },
    { icon: '💫', text: 'Efectos mágicos premium', highlight: false },
    { icon: '📄', text: 'Exportar a PDF alta calidad', highlight: false },
    { icon: '🎵', text: 'Música ambiental exclusiva', highlight: false }
  ]

  const handlePurchase = async () => {
    setIsPurchasing(true)
    try {
      const res = await fetch('/api/scrapbook/magic-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseType: selectedPlan })
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        if (onPurchase) onPurchase(selectedPlan)
        setTimeout(() => {
          onClose()
          window.location.reload() // Recargar para actualizar límites
        }, 1500)
      } else {
        toast.error(data.error || 'Error al activar el pack')
      }
    } catch (error) {
      console.error('Error al comprar pack:', error)
      toast.error('Error al procesar la compra')
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-serif flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-amber-500" />
            Pack Scrapbook Mágico
            <Sparkles className="h-8 w-8 text-amber-500" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Hero visual */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-rose-100 to-purple-100 border-2 border-amber-300">
            <div className="absolute inset-0 opacity-20">
              <Image
                src="/images/scrapbook/textures/leather-cover.png"
                alt="Texture"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative p-8 text-center space-y-3">
              <h3 className="text-2xl font-serif text-amber-900">
                Desbloquea Todo el Poder Creativo
              </h3>
              <p className="text-amber-700">
                Convierte tu scrapbook en una experiencia mágica e ilimitada
              </p>
            </div>
          </Card>

          {/* Opciones de precio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opción mensual */}
            <Card
              className={`p-6 cursor-pointer transition-all ${
                selectedPlan === 'monthly'
                  ? 'ring-2 ring-amber-500 shadow-xl scale-105'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-amber-100">
                    <Zap className="h-3 w-3 mr-1" />
                    Mensual
                  </Badge>
                  {selectedPlan === 'monthly' && (
                    <Check className="h-5 w-5 text-amber-600" />
                  )}
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-amber-900">€2.99</span>
                    <span className="text-sm text-gray-600">/mes</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Cancela cuando quieras
                  </p>
                </div>

                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✓ Renovación automática</li>
                  <li>✓ Precio fijo garantizado</li>
                  <li>✓ Perfecto para probar</li>
                </ul>
              </div>
            </Card>

            {/* Opción única (mejor valor) */}
            <Card
              className={`p-6 cursor-pointer transition-all relative ${
                selectedPlan === 'one_time'
                  ? 'ring-2 ring-purple-500 shadow-xl scale-105'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedPlan('one_time')}
            >
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600">
                <Star className="h-3 w-3 mr-1" />
                Mejor Valor
              </Badge>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-purple-100">
                    <Lock className="h-3 w-3 mr-1" />
                    Único
                  </Badge>
                  {selectedPlan === 'one_time' && (
                    <Check className="h-5 w-5 text-purple-600" />
                  )}
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-purple-900">€19.99</span>
                    <span className="text-sm text-gray-600 line-through">€35.88</span>
                  </div>
                  <p className="text-xs text-purple-600 font-medium mt-1">
                    ¡Ahorra €15.89! Para siempre.
                  </p>
                </div>

                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✓ Pago único, tuyo para siempre</li>
                  <li>✓ Sin renovaciones ni sorpresas</li>
                  <li>✓ Máximo ahorro (equivale a 7 meses gratis)</li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Features list */}
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-rose-50">
            <h4 className="font-semibold mb-4 text-center text-gray-900">
              Todo lo que incluye:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-2 ${
                    feature.highlight ? 'font-semibold text-amber-900' : 'text-gray-700'
                  }`}
                >
                  <span className="text-xl">{feature.icon}</span>
                  <span className="text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* CTA */}
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 hover:from-amber-600 hover:via-rose-600 hover:to-purple-600 text-white text-lg py-6 shadow-xl"
            onClick={handlePurchase}
            disabled={isPurchasing}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            {isPurchasing ? 'Procesando...' : `Activar por €${selectedPlan === 'monthly' ? '2.99/mes' : '19.99 único'}`}
          </Button>

          <p className="text-xs text-center text-gray-500">
            🔒 Pago seguro. Podrás disfrutar de todas las funciones inmediatamente.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
