
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sparkles, CreditCard, CheckCircle, MessageCircle, Zap, Crown, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface ChatStatus {
  userType: 'free' | 'subscription' | 'credits'
  freeMessagesRemaining: number
  creditsRemaining: number
  hasActiveSubscription: boolean
}

export function MagicalCompanionsManager() {
  const [status, setStatus] = useState<ChatStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/magical-companions/status')
      const data = await response.json()
      
      if (data.success) {
        setStatus(data)
      }
    } catch (error) {
      console.error('Error fetching status:', error)
      toast.error('Error al cargar el estado')
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    setPurchaseLoading('subscription')
    
    try {
      const response = await fetch('/api/magical-companions/subscribe', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        toast.error('Error al crear la suscripción')
      }
    } catch (error) {
      console.error('Error subscribing:', error)
      toast.error('Error al procesar la suscripción')
    } finally {
      setPurchaseLoading(null)
    }
  }

  const handlePurchaseCredits = async (packType: string) => {
    setPurchaseLoading(packType)
    
    try {
      const response = await fetch('/api/magical-companions/purchase-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ packType })
      })
      
      const data = await response.json()
      
      if (data.success && data.clientSecret) {
        // Aquí se integraría Stripe Elements para completar el pago
        // Por ahora, mostramos un mensaje
        toast.success('Redirigiendo al pago...')
        // TODO: Implementar Stripe Elements o redirigir a checkout
      } else {
        toast.error('Error al procesar la compra')
      }
    } catch (error) {
      console.error('Error purchasing credits:', error)
      toast.error('Error al procesar la compra')
    } finally {
      setPurchaseLoading(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estado Actual */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Estado de Personajes Mágicos</CardTitle>
          </div>
          <CardDescription>
            Tu acceso actual al chat emocional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status?.hasActiveSubscription ? (
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
              <Crown className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold text-primary">Suscripción Activa</p>
                <p className="text-sm text-muted-foreground">Chat ilimitado con tus acompañantes mágicos</p>
              </div>
              <Badge className="ml-auto" variant="default">
                <CheckCircle className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
          ) : status?.userType === 'credits' && status.creditsRemaining > 0 ? (
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
              <Zap className="h-6 w-6 text-amber-600" />
              <div>
                <p className="font-semibold">Créditos Disponibles</p>
                <p className="text-sm text-muted-foreground">
                  Tienes {status.creditsRemaining} mensajes disponibles
                </p>
              </div>
              <Badge className="ml-auto" variant="secondary">
                {status.creditsRemaining} créditos
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <MessageCircle className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-semibold">Plan Gratuito</p>
                <p className="text-sm text-muted-foreground">
                  {status?.freeMessagesRemaining} mensajes restantes hoy
                </p>
              </div>
              <Badge className="ml-auto" variant="outline">
                Gratis
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Opciones de Upgrade */}
      {!status?.hasActiveSubscription && (
        <>
          {/* Suscripción Mensual */}
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <CardTitle>Suscripción Mensual</CardTitle>
                </div>
                <Badge variant="default">Recomendado</Badge>
              </div>
              <CardDescription>
                Chat emocional ilimitado con tus acompañantes mágicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary">4,99€</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Mensajes ilimitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Respuestas completas y personalizadas (GPT-4.1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Voces y emociones de todos los acompañantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Cancela cuando quieras</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleSubscribe}
                disabled={purchaseLoading === 'subscription'}
              >
                {purchaseLoading === 'subscription' ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Suscribirme Ahora
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Separator />

          {/* Packs de Créditos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">O compra créditos solo cuando los necesites</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Ideal si prefieres pagar por uso en lugar de una suscripción mensual
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Pack Pequeño */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pack Pequeño</CardTitle>
                  <CardDescription>100 mensajes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">2,99€</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ~0.03€ por mensaje
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handlePurchaseCredits('small')}
                    disabled={purchaseLoading === 'small'}
                  >
                    {purchaseLoading === 'small' ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Comprar
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Pack Mediano */}
              <Card className="border-primary/50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Pack Mediano</CardTitle>
                      <CardDescription>200 mensajes</CardDescription>
                    </div>
                    <Badge variant="secondary">Popular</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">4,99€</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ~0.025€ por mensaje
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => handlePurchaseCredits('medium')}
                    disabled={purchaseLoading === 'medium'}
                  >
                    {purchaseLoading === 'medium' ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Comprar
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Pack Grande */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Pack Grande</CardTitle>
                      <CardDescription>500 mensajes</CardDescription>
                    </div>
                    <Badge variant="default">Mejor valor</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">7,99€</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ~0.016€ por mensaje
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handlePurchaseCredits('large')}
                    disabled={purchaseLoading === 'large'}
                  >
                    {purchaseLoading === 'large' ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Comprar
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Información adicional */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-2">💡 ¿Qué incluyen los Personajes Mágicos?</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Chat emocional con respuestas empáticas y personalizadas</li>
            <li>• Voces expresivas de tus acompañantes (Web Speech API)</li>
            <li>• Detección automática de emociones</li>
            <li>• Protocolos de seguridad emocional</li>
            <li>• Historial de conversaciones privado y seguro</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
