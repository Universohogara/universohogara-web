
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Star, Trash2, Heart, Sparkles, Lock, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import LeatherBookCover from '@/components/scrapbook/leather-book-cover'
// MagicPackUpgrade ya no se usa - redirigimos al dashboard de planes
import { toast } from 'sonner'

interface ScrapbookPage {
  id: string
  title: string | null
  description: string | null
  canvas_data: string
  thumbnail: string | null
  is_favorite: boolean
  page_type: string
  is_secret: boolean
  created_at: string
  updated_at: string
}

interface ScrapbookLimits {
  maxPages: number
  hasSecretPocket: boolean
  hasManifestationPage: boolean
  hasRitualMode: boolean
  hasMagicEffects: boolean
  canExportPDF: boolean
  hasPremiumStickers: boolean
  planName: string
}

export default function ScrapbookPage() {
  const [pages, setPages] = useState<ScrapbookPage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBookOpen, setIsBookOpen] = useState(false)
  const [limits, setLimits] = useState<ScrapbookLimits | null>(null)
  const [currentPages, setCurrentPages] = useState(0)
  const [canCreate, setCanCreate] = useState(true)
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null)
  const [upgradeMessage, setUpgradeMessage] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    loadPages()
    loadLimits()
  }, [])

  const loadPages = async () => {
    try {
      const res = await fetch('/api/scrapbook/pages')
      const data = await res.json()
      setPages(data.pages || [])
    } catch (error) {
      console.error('Error al cargar páginas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadLimits = async () => {
    try {
      const res = await fetch('/api/scrapbook/limits')
      const data = await res.json()
      console.log('📊 Límites recibidos del API:', data)
      setLimits(data.limits)
      setCurrentPages(data.currentPages)
      setCanCreate(data.canCreatePage)
      setSubscriptionTier(data.subscriptionTier)
      setUpgradeMessage(data.upgradeMessage)
      console.log('✅ Estado actualizado - subscriptionTier:', data.subscriptionTier)
    } catch (error) {
      console.error('Error al cargar límites:', error)
    }
  }

  const handleDelete = async (pageId: string) => {
    if (!confirm('¿Estás segura de que quieres eliminar esta página?')) {
      return
    }

    try {
      await fetch(`/api/scrapbook/pages/${pageId}`, {
        method: 'DELETE'
      })
      loadPages()
      loadLimits()
    } catch (error) {
      console.error('Error al eliminar página:', error)
    }
  }

  const handleCreatePage = () => {
    if (!canCreate) {
      const isUnlimited = limits?.maxPages === 999
      const message = isUnlimited 
        ? `Has alcanzado el límite de ${currentPages} páginas`
        : `Has alcanzado el límite de ${limits?.maxPages} páginas de tu ${limits?.planName || 'plan'}`
      toast.error(message)
      
      // Redirigir al dashboard si no tiene plan completo
      if (subscriptionTier !== 'complete_15') {
        toast.info(upgradeMessage || 'Actualiza tu plan para crear más páginas')
        setTimeout(() => {
          router.push('/premium/dashboard')
        }, 1500)
      }
      return
    }
    router.push('/premium/scrapbook/editor')
  }

  const handleOpenBook = () => {
    setIsBookOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8956A] mx-auto"></div>
          <p className="text-amber-800 font-serif">Abriendo tu scrapbook mágico...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!isBookOpen ? (
          <motion.div key="book-cover">
            <LeatherBookCover
              isOpen={isBookOpen}
              onOpen={handleOpenBook}
              bookTitle="Mi Scrapbook Mágico"
              hasMagicEffects={limits?.hasMagicEffects || false}
            />
          </motion.div>
        ) : (
          <motion.div
            key="book-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-12 px-4"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header con límites */}
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-4xl font-serif text-[#1a1a1a] mb-2 flex items-center gap-2 flex-wrap">
                    <Heart className="h-8 w-8 text-rose-400" />
                    Mi Scrapbook Mágico
                    {limits && (
                      <Badge className={
                        subscriptionTier === 'complete_15' 
                          ? "bg-gradient-to-r from-purple-600 to-pink-600"
                          : subscriptionTier === 'basic_7'
                          ? "bg-gradient-to-r from-amber-500 to-orange-500"
                          : "bg-gray-500"
                      }>
                        <Sparkles className="h-3 w-3 mr-1" />
                        {limits.planName}
                      </Badge>
                    )}
                  </h1>
                  <p className="text-gray-600">
                    Crea páginas únicas decoradas con tus stickers favoritos
                  </p>
                  {limits && (
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {currentPages} / {limits.maxPages === 999 ? '∞' : limits.maxPages} páginas
                      </Badge>
                      {subscriptionTier && subscriptionTier !== 'complete_15' && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => router.push('/premium/dashboard')}
                          className="text-xs text-amber-600 hover:text-amber-700"
                        >
                          <Crown className="h-3 w-3 mr-1" />
                          {subscriptionTier === 'basic_7' ? 'Actualizar a Plan Total' : 'Ver Planes Premium'}
                        </Button>
                      )}
                      {subscriptionTier === 'complete_15' && (
                        <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                          ✨ Acceso ilimitado
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleCreatePage}
                  className="bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500"
                  disabled={!canCreate && subscriptionTier !== 'complete_15'}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nueva Página
                </Button>
              </div>

              {/* Banner de upgrade - solo si no tiene el plan completo */}
              {subscriptionTier && subscriptionTier !== 'complete_15' && limits && (
                <Card className="mb-8 p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-2 border-purple-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        {subscriptionTier === 'basic_7' 
                          ? '¡Actualiza al Plan Total (€15) para desbloquear todo!' 
                          : '¡Hazte Premium para acceder al Scrapbook Mágico!'}
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        {subscriptionTier === 'basic_7'
                          ? 'Páginas ilimitadas, bolsillo secreto, página de manifestación, modo ritual, exportar PDF y más...'
                          : 'Accede a 15 páginas de scrapbook con el Plan Standard (€7) o páginas ilimitadas con el Plan Total (€15)'}
                      </p>
                      <div className="flex gap-2 text-xs flex-wrap">
                        {subscriptionTier === 'basic_7' ? (
                          <>
                            <Badge variant="secondary">Páginas ∞</Badge>
                            <Badge variant="secondary">Bolsillo Secreto</Badge>
                            <Badge variant="secondary">Página Manifestación</Badge>
                            <Badge variant="secondary">Modo Ritual</Badge>
                            <Badge variant="secondary">Exportar PDF</Badge>
                          </>
                        ) : (
                          <>
                            <Badge variant="secondary">Plan Standard: 15 páginas</Badge>
                            <Badge variant="secondary">Plan Total: Páginas ∞</Badge>
                            <Badge variant="secondary">Stickers premium</Badge>
                            <Badge variant="secondary">Efectos mágicos</Badge>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push('/premium/dashboard')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      {subscriptionTier === 'basic_7' ? 'Actualizar Plan' : 'Ver Planes'}
                    </Button>
                  </div>
                </Card>
              )}

              {/* Grid de páginas */}
              {pages.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="text-6xl mb-4">📓</div>
                  <h3 className="text-xl font-semibold mb-2">Tu scrapbook está vacío</h3>
                  <p className="text-gray-600 mb-6">
                    Crea tu primera página y comienza a decorarla con stickers
                  </p>
                  <Button
                    onClick={handleCreatePage}
                    className="bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500"
                    disabled={!canCreate && subscriptionTier !== 'complete_15'}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Crear Primera Página
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {pages.map(page => (
                    <motion.div
                      key={page.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="overflow-hidden hover:shadow-2xl transition-all group hover:-translate-y-1 border-2 border-[#D4C5B0]">
                        <div 
                          className="aspect-[3/4] relative overflow-hidden" 
                          style={{
                            backgroundColor: '#F5F0E6',
                            backgroundImage: `
                              linear-gradient(90deg, rgba(184,149,106,0.02) 1px, transparent 1px),
                              linear-gradient(rgba(184,149,106,0.02) 1px, transparent 1px)
                            `,
                            backgroundSize: '30px 30px, 30px 30px',
                            boxShadow: 'inset 0 0 10px rgba(139,115,85,0.05)'
                          }}
                        >
                          {/* Renderizar previsualización del canvas */}
                          {page.canvas_data && (() => {
                            try {
                              // Validar que canvas_data no esté vacío o nulo
                              if (!page.canvas_data || page.canvas_data === '{}' || page.canvas_data === 'null') {
                                return (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-400 text-xs">Página vacía</p>
                                  </div>
                                )
                              }
                              
                              const canvasData = typeof page.canvas_data === 'string' 
                                ? JSON.parse(page.canvas_data) 
                                : page.canvas_data
                              
                              const elements = canvasData?.elements || []
                              const colorAreas = canvasData?.colorAreas || []
                              // Escalar para que se ajuste al contenedor de previsualización
                              // Canvas original: 1200x800, Contenedor aumentado para mejor visibilidad
                              const scaleX = 0.4  // 480/1200 (40% del tamaño original)
                              const scaleY = 0.6  // 480/800 (60% del tamaño original)
                              
                              return (
                                <div className="relative w-full h-full">
                                  {/* Áreas coloreadas */}
                                  {colorAreas.map((area: any, index: number) => (
                                    <div
                                      key={`area-${index}`}
                                      className="absolute"
                                      style={{
                                        left: `${area.x * scaleX}px`,
                                        top: `${area.y * scaleY}px`,
                                        width: `${area.width * scaleX}px`,
                                        height: `${area.height * scaleY}px`,
                                        backgroundColor: area.color,
                                        opacity: 0.6
                                      }}
                                    />
                                  ))}
                                  
                                  {/* Elementos (stickers, textos) */}
                                  {elements.map((element: any) => (
                                    <div
                                      key={element.id}
                                      className="absolute"
                                      style={{
                                        left: `${element.x * scaleX}px`,
                                        top: `${element.y * scaleY}px`,
                                        width: `${element.width * scaleX}px`,
                                        height: `${element.height * scaleY}px`,
                                        transform: `rotate(${element.rotation}deg)`,
                                        opacity: element.opacity,
                                        zIndex: element.zIndex
                                      }}
                                    >
                                      {element.type === 'sticker' && element.data?.image_url && (
                                        <img
                                          src={element.data.image_url}
                                          alt={element.data.name || 'Sticker'}
                                          className="w-full h-full object-contain select-none pointer-events-none"
                                          loading="lazy"
                                          style={{
                                            filter: `drop-shadow(0 1px 2px rgba(0,0,0,${element.opacity * 0.2}))`,
                                            backgroundColor: 'transparent',
                                            mixBlendMode: 'normal',
                                            imageRendering: 'auto',
                                            WebkitFontSmoothing: 'antialiased',
                                            backfaceVisibility: 'hidden'
                                          }}
                                        />
                                      )}
                                      {element.type === 'text' && (
                                        <div
                                          className="w-full h-full flex items-center justify-center text-center font-serif"
                                          style={{
                                            fontSize: `${(element.data.fontSize || 20) * scaleX}px`,
                                            color: element.data.color || '#000'
                                          }}
                                        >
                                          {element.data.text}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  
                                  {/* Si está vacío, mostrar placeholder */}
                                  {elements.length === 0 && colorAreas.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <p className="text-gray-400 text-xs">Página vacía</p>
                                    </div>
                                  )}
                                </div>
                              )
                            } catch (e) {
                              return (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <p className="text-gray-400 text-xs">Vista previa no disponible</p>
                                </div>
                              )
                            }
                          })()}
                          
                          {/* Badges especiales */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                            {page.page_type === 'manifestation' && (
                              <Badge className="bg-purple-600 text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Manifestación
                              </Badge>
                            )}
                            {page.is_secret && (
                              <Badge className="bg-amber-600 text-xs">
                                <Lock className="h-3 w-3 mr-1" />
                                Secreto
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm line-clamp-1">
                              {page.title || 'Sin título'}
                            </h3>
                            {page.is_favorite && (
                              <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" fill="currentColor" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {page.description || 'Sin descripción'}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => router.push(`/premium/scrapbook/editor/${page.id}`)}
                            >
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(page.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
