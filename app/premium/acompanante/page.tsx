
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CompanionSelector } from '@/components/companion/companion-selector'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Heart, Shield, Zap, Settings } from 'lucide-react'
import { Loader2 } from 'lucide-react'

export default function AcompanantePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [companion, setCompanion] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      loadCompanion()
    }
  }, [session])

  const loadCompanion = async () => {
    try {
      const res = await fetch('/api/companion')
      const data = await res.json()
      
      if (data.companion) {
        setCompanion(data.companion)
      }
    } catch (error) {
      console.error('Error al cargar acompañante:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCompanion = async (companionData: any) => {
    setIsCreating(true)
    
    try {
      console.log('🔄 Cambiando acompañante:', companionData)
      
      const res = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companionData)
      })

      const data = await res.json()
      console.log('📥 Respuesta de API:', data)

      if (res.ok) {
        setCompanion(data.companion)
        
        // Disparar evento para notificar al CompanionProvider
        const event = new CustomEvent('companion-updated', {
          detail: { companion: data.companion }
        })
        window.dispatchEvent(event)
        console.log('✨ Acompañante actualizado:', data.companion.name)
        
        // Forzar recarga de la página para que se actualice el companion flotante
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        console.error('❌ Error en la respuesta:', data)
        alert(`Error al cambiar acompañante: ${data.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('❌ Error al crear acompañante:', error)
      alert('Error al cambiar acompañante. Por favor, intenta de nuevo.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateCompanion = (updatedData: any) => {
    setCompanion(updatedData)
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-white">
      <div className="container mx-auto px-4 py-12">
        {!companion ? (
          <>
            {/* Header de introducción */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-serif text-[#8B7355] mb-4">
                Conoce a tu acompañante mágico
              </h1>
              <p className="text-lg text-[#A0826D] max-w-2xl mx-auto">
                Un ser especial que te acompañará en tu proceso de sanación emocional, 
                recordando tus conversaciones y brindándote apoyo personalizado.
              </p>
            </motion.div>

            {/* Características */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto"
            >
              <Card className="border-[#D4AF37]/20 bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#8B7355] mb-2">
                    Empatía genuina
                  </h3>
                  <p className="text-sm text-[#A0826D]">
                    Respuestas cálidas y personalizadas a tus emociones
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#D4AF37]/20 bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#8B7355] mb-2">
                    Memoria contextual
                  </h3>
                  <p className="text-sm text-[#A0826D]">
                    Recuerda tus conversaciones y detalles importantes
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#D4AF37]/20 bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#8B7355] mb-2">
                    Detección de riesgo
                  </h3>
                  <p className="text-sm text-[#A0826D]">
                    Identifica momentos difíciles y ofrece apoyo inmediato
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#D4AF37]/20 bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#8B7355] mb-2">
                    100% Privado
                  </h3>
                  <p className="text-sm text-[#A0826D]">
                    Tus conversaciones son completamente confidenciales
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Selector de acompañante */}
            <CompanionSelector 
              onSelect={handleCreateCompanion}
              isLoading={isCreating}
            />
          </>
        ) : (
          <>
            {/* Dashboard con acompañante activo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              <Card className="border-[#D4AF37]/20 bg-gradient-to-br from-white to-[#F5F0E8] mb-8">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif text-[#8B7355] mb-2">
                      Tu acompañante está activo ✨
                    </h2>
                    <p className="text-[#A0826D]">
                      {companion.name} está listo para acompañarte en todo momento
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8DCC8] mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-[#8B7355]">
                          {companion.name}
                        </h3>
                        <p className="text-sm text-[#A0826D] mt-1">
                          Tipo: {companion.type.charAt(0).toUpperCase() + companion.type.slice(1)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm text-green-600 font-medium">Activo</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-[#D4AF37]/5 border-[#D4AF37]/20">
                      <CardContent className="p-6">
                        <Sparkles className="w-8 h-8 text-[#D4AF37] mb-3" />
                        <h4 className="font-semibold text-[#8B7355] mb-2">
                          Personaje Animado Vivo
                        </h4>
                        <p className="text-sm text-[#A0826D]">
                          Tu acompañante aparecerá como un personaje animado completo que se mueve, 
                          camina, salta y expresa emociones en toda la aplicación. ¡Es como tener 
                          un amigo de dibujos animados contigo!
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#D4AF37]/5 border-[#D4AF37]/20">
                      <CardContent className="p-6">
                        <Settings className="w-8 h-8 text-[#D4AF37] mb-3" />
                        <h4 className="font-semibold text-[#8B7355] mb-2">
                          Interacción Natural
                        </h4>
                        <p className="text-sm text-[#A0826D]">
                          • Haz clic en el personaje para chatear<br/>
                          • 💬 Botón dorado: chat de texto<br/>
                          • 🎤 Botón morado: chat por voz<br/>
                          • ⚙️ Botón de configuración: personalizar<br/>
                          • El personaje se moverá libremente por la pantalla
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-8 flex justify-center gap-4">
                    <Button
                      onClick={() => {
                        setCompanion(null)
                        loadCompanion()
                      }}
                      variant="outline"
                      className="border-[#E8DCC8] text-[#8B7355]"
                    >
                      Cambiar Acompañante
                    </Button>
                    <Button
                      onClick={() => router.push('/premium/dashboard')}
                      className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white"
                    >
                      Ir al Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Selector de acompañantes - SIEMPRE VISIBLE */}
              <div className="mb-8">
                <h3 className="text-2xl font-serif text-[#8B7355] text-center mb-6">
                  Cambiar a otro acompañante
                </h3>
                <CompanionSelector 
                  onSelect={handleCreateCompanion}
                  isLoading={isCreating}
                />
              </div>
            </motion.div>

            {/* ❌ NO renderizar el companion aquí - el CompanionProvider global ya lo hace */}
          </>
        )}
      </div>
    </div>
  )
}
