
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Crown, 
  Music, 
  BookHeart, 
  Check,
  Loader2,
  Sparkles,
  Zap,
  Star,
  Heart,
  MessageCircle,
  AlertCircle,
  Info
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PremiumPage() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [magicalLoading, setMagicalLoading] = useState(false)
  const [userStatus, setUserStatus] = useState({
    hasBasePlan: false,
    basePlanTier: 'none',
    magicalCompanionsActive: false,
    magicalCompanionsPlanType: 'none'
  })

  const isAdmin = session?.user?.role === 'admin'

  useEffect(() => {
    const loadUserStatus = async () => {
      if (!session?.user) return

      try {
        const res = await fetch('/api/user/subscription-status')
        if (res.ok) {
          const data = await res.json()
          setUserStatus(data)
        }
      } catch (error) {
        console.error('Error cargando estado:', error)
      }
    }

    if (status === 'authenticated') {
      loadUserStatus()
    }
  }, [status, session?.user])

  const handleBasePlanSubscribe = async (planTier: 'basic_7' | 'complete_15') => {
    if (!session?.user) {
      router.push("/auth/login?redirect=/premium")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planTier }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "No se pudo iniciar el proceso. Inténtalo de nuevo.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleMagicalCompanionsSubscribe = async (planType: 'addon' | 'standalone') => {
    if (!session?.user) {
      router.push("/auth/login?redirect=/premium")
      return
    }

    // Verificar requisito de plan base para addon
    if (planType === 'addon' && !userStatus.hasBasePlan && !isAdmin) {
      toast({
        title: "Plan base requerido",
        description: "Necesitas un plan activo (7€ o 15€) para añadir esta extensión.",
        variant: "destructive",
      })
      return
    }

    setMagicalLoading(true)

    try {
      const response = await fetch("/api/magical-companions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || "No checkout URL received")
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "No se pudo iniciar la activación. Inténtalo de nuevo.",
        variant: "destructive",
      })
      setMagicalLoading(false)
    }
  }

  const basePlans = [
    {
      id: 'basic_7' as const,
      name: 'Plan Hogara 7€',
      price: 7,
      description: 'Perfecto para empezar tu viaje de autodescubrimiento',
      features: [
        '🎵 Biblioteca completa de música Premium',
        '⬇️ Descargas de pistas seleccionadas',
        '📖 Diarios digitales con guardado automático',
        '🎯 Sistema de seguimiento de hábitos',
        '✨ Sin anuncios ni distracciones',
        '💫 Base para añadir Personajes Mágicos',
      ],
      color: 'from-hogara-pink/20 to-hogara-lavender/20',
      badge: 'Básico',
    },
    {
      id: 'complete_15' as const,
      name: 'Plan Hogara 15€',
      price: 15,
      description: 'La experiencia Hogara completa para tu transformación',
      features: [
        '✅ Todo lo incluido en el Plan 7€',
        '🎨 Plantillas interactivas para colorear',
        '📚 Todas las plantillas digitales (6+ colecciones)',
        '🏆 Retos mensuales de 21 días',
        '📊 Estadísticas de progreso completas',
        '🎭 Scrapbook digital personalizable',
        '🔔 Notificaciones personalizadas',
      ],
      color: 'from-hogara-gold/20 to-hogara-pink/20',
      badge: 'Completo',
      popular: true,
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-hogara-cream via-hogara-pink/10 to-hogara-lavender/10 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-hogara-gold rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-hogara-pink rounded-full blur-3xl"></div>
          </div>
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-hogara-gold/10 rounded-full text-hogara-gold font-medium mb-4">
                <Crown className="h-5 w-5" />
                <span>Zona Premium</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-hogara-gray">
                Elige tu plan perfecto
              </h1>
              
              <p className="text-lg text-hogara-gray/80 max-w-2xl mx-auto">
                Accede a contenido exclusivo, herramientas interactivas y personajes mágicos que te acompañan en tu evolución personal.
              </p>

              {isAdmin && (
                <div className="flex flex-col items-center gap-4 pt-6">
                  <div className="flex items-center gap-2 px-6 py-3 bg-hogara-gold/20 border-2 border-hogara-gold rounded-full text-hogara-gold font-bold shadow-lg">
                    <Crown className="h-6 w-6" />
                    <span className="text-lg">👑 Acceso de Administradora - Todo Gratis</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Plans Base Section */}
        <section className="py-16 bg-gradient-to-b from-white to-hogara-cream/30">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-heading text-center mb-3 text-hogara-gray">
              Planes Base
            </h2>
            <p className="text-center text-hogara-gray/70 mb-8 max-w-2xl mx-auto text-sm">
              Elige el plan que mejor se adapte a tus necesidades. Sin permanencia, cancela cuando quieras.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {basePlans.map((plan) => {
                const isActive = userStatus.basePlanTier === plan.id
                
                return (
                  <Card
                    key={plan.id}
                    className={`relative p-6 bg-gradient-to-br ${plan.color} border-2 transition-all ${
                      plan.popular 
                        ? 'border-hogara-gold scale-105 shadow-xl' 
                        : 'border-hogara-gold/20 hover:border-hogara-gold/40'
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 bg-hogara-gold text-white text-xs font-medium rounded-full shadow-lg">
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <h3 className="text-xl font-heading text-hogara-gray mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-hogara-gray/70 mb-3 text-sm">
                        {plan.description}
                      </p>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-hogara-gold">{plan.price}€</span>
                        <span className="text-hogara-gray/70 text-sm">/mes</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="p-1 bg-hogara-gold/10 rounded-full">
                              <Check className="h-4 w-4 text-hogara-gold" />
                            </div>
                          </div>
                          <p className="text-hogara-gray text-sm">{feature}</p>
                        </div>
                      ))}
                    </div>

                    {isActive && !isAdmin && (
                      <div className="text-center py-4 bg-hogara-gold/10 rounded-lg border-2 border-hogara-gold">
                        <div className="flex items-center justify-center gap-2">
                          <Check className="h-5 w-5 text-hogara-gold" />
                          <span className="text-hogara-gold font-bold text-lg">Plan Activo</span>
                        </div>
                      </div>
                    )}

                    {!isActive && !isAdmin && (
                      <Button
                        onClick={() => handleBasePlanSubscribe(plan.id)}
                        disabled={isLoading}
                        className={`w-full ${
                          plan.popular
                            ? 'bg-hogara-gold hover:bg-hogara-gold/90 text-white'
                            : 'bg-white hover:bg-hogara-cream text-hogara-gray border-2 border-hogara-gold/20'
                        }`}
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <Crown className="mr-2 h-5 w-5" />
                            Elegir {plan.name}
                          </>
                        )}
                      </Button>
                    )}

                    {isAdmin && (
                      <div className="text-center py-4 bg-hogara-gold/10 rounded-lg border-2 border-hogara-gold">
                        <div className="flex items-center justify-center gap-2">
                          <Check className="h-5 w-5 text-hogara-gold" />
                          <span className="text-hogara-gold font-bold text-lg">Acceso Completo Gratis</span>
                        </div>
                        <p className="text-xs text-hogara-gray/70 mt-2">Privilegios de administradora</p>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Magical Companions Section */}
        <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full text-purple-600 font-medium mb-4">
                  <Sparkles className="h-5 w-5" />
                  <span>Extensión Opcional</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading mb-4 text-hogara-gray">
                  ✨ Personajes Mágicos con GPT-4.1 Mini
                </h2>
                <p className="text-lg text-hogara-gray/80 max-w-2xl mx-auto">
                  Acompañantes emocionales inteligentes con mensajes mensuales + créditos extra disponibles
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Addon: Requiere Plan Base */}
                <Card className="relative overflow-hidden border-2 border-purple-300 shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-2xl"></div>
                  
                  <CardContent className="relative z-10 p-6">
                    <div className="text-center mb-4">
                      <div className="inline-block mb-3">
                        <div className="flex items-baseline gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-2xl">
                          <span className="text-3xl font-bold">4,99€</span>
                          <span className="text-base opacity-90">/mes</span>
                        </div>
                      </div>
                      <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full mb-3">
                        COMPLEMENTO - Requiere Plan Base
                      </div>
                      <h3 className="text-xl font-heading text-hogara-gray mb-2">
                        Personajes Completos
                      </h3>
                      <p className="text-sm text-hogara-gray/70">
                        Para quienes tienen plan 7€ o 15€
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <Star className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-hogara-gray">200 mensajes/mes incluidos</p>
                          <p className="text-xs text-hogara-gray/70">+ opción de comprar créditos extra</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MessageCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-hogara-gray">9 Acompañantes Emocionales</p>
                          <p className="text-xs text-hogara-gray/70">Conversaciones profundas y contextuales</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-hogara-gray">Voces ilimitadas incluidas</p>
                          <p className="text-xs text-hogara-gray/70">Web Speech API (100% gratis)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Heart className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-hogara-gray">Memoria emocional activada</p>
                          <p className="text-xs text-hogara-gray/70">Recuerdan tus conversaciones</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800">
                          <strong>Requisito:</strong> Necesitas un plan base activo (7€ o 15€) para activar esta extensión.
                        </p>
                      </div>
                    </div>

                    {userStatus.magicalCompanionsActive && userStatus.magicalCompanionsPlanType === 'addon' && !isAdmin && (
                      <div className="text-center py-4 bg-purple-50 rounded-lg border-2 border-purple-400">
                        <div className="flex items-center justify-center gap-2">
                          <Check className="h-5 w-5 text-purple-600" />
                          <span className="text-purple-600 font-bold">Extensión Activa</span>
                        </div>
                      </div>
                    )}

                    {(!userStatus.magicalCompanionsActive || userStatus.magicalCompanionsPlanType !== 'addon') && !isAdmin && (
                      <Button
                        onClick={() => handleMagicalCompanionsSubscribe('addon')}
                        disabled={magicalLoading || !userStatus.hasBasePlan}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        size="lg"
                      >
                        {magicalLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            {userStatus.hasBasePlan ? 'Añadir a mi Plan' : 'Requiere Plan Base'}
                          </>
                        )}
                      </Button>
                    )}

                    {isAdmin && (
                      <div className="text-center py-4 bg-purple-50 rounded-lg border-2 border-purple-400">
                        <div className="flex items-center justify-center gap-2">
                          <Check className="h-5 w-5 text-purple-600" />
                          <span className="text-purple-600 font-bold">Acceso Completo Gratis</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Admin</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Standalone: Sin Plan Base */}
                <Card className="relative overflow-hidden border-2 border-yellow-300 shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-2xl"></div>
                  
                  <CardContent className="relative z-10 p-6">
                    <div className="text-center mb-4">
                      <div className="inline-block mb-3">
                        <div className="flex items-baseline gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-5 py-2 rounded-2xl">
                          <span className="text-3xl font-bold">4,99€</span>
                          <span className="text-base opacity-90">/mes</span>
                        </div>
                      </div>
                      <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full mb-3">
                        INDEPENDIENTE - Sin Plan Base
                      </div>
                      <h3 className="text-xl font-heading text-hogara-gray mb-2">
                        Prueba los Personajes
                      </h3>
                      <p className="text-sm text-hogara-gray/70">
                        Sin necesidad de plan base
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <Star className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-hogara-gray">100 mensajes/mes incluidos</p>
                          <p className="text-xs text-hogara-gray/70">+ opción de comprar créditos extra</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MessageCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-hogara-gray">9 Personajes disponibles</p>
                          <p className="text-xs text-hogara-gray/70">Conversaciones simples</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-hogara-gray">Voces ilimitadas incluidas</p>
                          <p className="text-xs text-hogara-gray/70">Web Speech API (100% gratis)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-hogara-gray">Sin memoria emocional</p>
                          <p className="text-xs text-hogara-gray/70">Conversaciones simples</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-yellow-700 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-800">
                          <strong>Perfecto para probar:</strong> No requiere plan base. Puedes actualizar al plan completo cuando quieras.
                        </p>
                      </div>
                    </div>

                    {userStatus.magicalCompanionsActive && userStatus.magicalCompanionsPlanType === 'standalone' && !isAdmin && (
                      <div className="text-center py-4 bg-yellow-50 rounded-lg border-2 border-yellow-400">
                        <div className="flex items-center justify-center gap-2">
                          <Check className="h-5 w-5 text-yellow-600" />
                          <span className="text-yellow-600 font-bold">Plan Activo</span>
                        </div>
                      </div>
                    )}

                    {(!userStatus.magicalCompanionsActive || userStatus.magicalCompanionsPlanType !== 'standalone') && !isAdmin && (
                      <Button
                        onClick={() => handleMagicalCompanionsSubscribe('standalone')}
                        disabled={magicalLoading}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                        size="lg"
                      >
                        {magicalLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Probar Personajes
                          </>
                        )}
                      </Button>
                    )}

                    {isAdmin && (
                      <div className="text-center py-4 bg-yellow-50 rounded-lg border-2 border-yellow-400">
                        <div className="flex items-center justify-center gap-2">
                          <Check className="h-5 w-5 text-yellow-600" />
                          <span className="text-yellow-600 font-bold">Acceso Completo Gratis</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Admin</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 space-y-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-300">
                  <h3 className="text-lg font-heading text-hogara-gray mb-3 text-center">💰 Packs de Créditos Extra</h3>
                  <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div className="p-3 bg-white rounded-lg border border-green-200 text-center">
                      <p className="text-2xl font-bold text-green-600">€1.99</p>
                      <p className="text-sm text-hogara-gray">100 mensajes extra</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-green-200 text-center">
                      <p className="text-2xl font-bold text-green-600">€3.99</p>
                      <p className="text-sm text-hogara-gray">300 mensajes extra</p>
                    </div>
                  </div>
                  <p className="text-xs text-hogara-gray/70 text-center mt-3">
                    Los créditos comprados no caducan mientras mantengas tu suscripción activa
                  </p>
                </div>
                
                <div className="p-4 bg-white/50 rounded-lg border border-hogara-gold/20 text-center">
                  <p className="text-sm text-hogara-gray/70">
                    💡 <strong>Nota importante:</strong> Las voces de Eleven Labs NO están incluidas en ningún plan. 
                    Puedes conectar tu propia clave API si deseas voces más expresivas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gradient-to-b from-hogara-cream/30 to-white">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-heading text-center mb-8 text-hogara-gray">
                Preguntas Frecuentes
              </h2>
              
              <div className="space-y-4">
                <details className="group p-4 bg-white rounded-lg border border-hogara-gold/20 shadow-sm">
                  <summary className="cursor-pointer font-medium text-hogara-gray flex items-center justify-between">
                    ¿Qué diferencia hay entre el plan de 7€ y 15€?
                    <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-hogara-gray/80">
                    El plan de 7€ incluye música premium, descargas y chat emocional limitado. 
                    El plan de 15€ añade todas las plantillas digitales, retos de 21 días, scrapbook digital y estadísticas completas.
                  </p>
                </details>

                <details className="group p-4 bg-white rounded-lg border border-hogara-gold/20 shadow-sm">
                  <summary className="cursor-pointer font-medium text-hogara-gray flex items-center justify-between">
                    ¿Puedo usar personajes mágicos sin plan base?
                    <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-hogara-gray/80">
                    Sí, puedes suscribirte al plan independiente de personajes mágicos por 4,99€/mes. 
                    Tendrás acceso limitado (interacciones más cortas) pero podrás probar la función completa. 
                    Si quieres el acceso completo, necesitas tener un plan base activo (7€ o 15€).
                  </p>
                </details>

                <details className="group p-4 bg-white rounded-lg border border-hogara-gold/20 shadow-sm">
                  <summary className="cursor-pointer font-medium text-hogara-gray flex items-center justify-between">
                    ¿Las voces de los personajes tienen coste adicional?
                    <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-hogara-gray/80">
                    Las voces incluidas usan Web Speech API del navegador y son completamente gratuitas. 
                    Las voces de Eleven Labs NO están incluidas, pero puedes conectar tu propia API key si deseas voces más expresivas.
                  </p>
                </details>

                <details className="group p-4 bg-white rounded-lg border border-hogara-gold/20 shadow-sm">
                  <summary className="cursor-pointer font-medium text-hogara-gray flex items-center justify-between">
                    ¿Puedo cancelar en cualquier momento?
                    <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-hogara-gray/80">
                    Sí, todos los planes son sin permanencia. Puedes cancelar desde tu portal de facturación en cualquier momento.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
