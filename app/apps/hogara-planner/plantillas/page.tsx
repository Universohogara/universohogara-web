
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, FileText, Lock, TrendingUp, Calendar, Heart, BarChart } from 'lucide-react'
import Link from 'next/link'

interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string | null
  tier: string
}

const CATEGORY_CONFIG = {
  tracker: {
    icon: TrendingUp,
    label: 'Tracker',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  planner: {
    icon: Calendar,
    label: 'Planner',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  worksheet: {
    icon: FileText,
    label: 'Hoja de Trabajo',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  ritual: {
    icon: Heart,
    label: 'Ritual',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  }
}

export default function PlantillasPage() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      fetchTemplates()
    }
  }, [status, router])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-hogara-gold border-t-transparent mx-auto" />
          <p className="text-hogara-gray">Cargando plantillas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hogara-cream via-white to-hogara-pink/5 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-hogara-gold" />
            <span className="text-sm font-medium text-hogara-gold uppercase tracking-wider">
              Contenido Premium
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-hogara-gray">
            Plantillas Interactivas Protegidas
          </h1>
          <p className="text-lg text-hogara-gray/70 max-w-2xl mx-auto">
            Plantillas digitales exclusivas que solo puedes usar dentro de la aplicación.
            Tu progreso se guarda automáticamente en la nube de forma segura.
          </p>
        </div>

        {/* Advertencia de protección */}
        <Card className="mb-8 bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Lock className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-amber-900 mb-2">
                  Contenido Máximamente Protegido
                </h3>
                <ul className="text-sm text-amber-800/80 space-y-1">
                  <li>✓ No se puede descargar ni imprimir</li>
                  <li>✓ Marca de agua personalizada con tu email</li>
                  <li>✓ Protegido contra copias y capturas</li>
                  <li>✓ Guardado automático en la nube</li>
                  <li>✓ Acceso exclusivo dentro de la app</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de plantillas */}
        {templates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-hogara-gray/30 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-hogara-gray mb-2">
                No hay plantillas disponibles aún
              </h3>
              <p className="text-hogara-gray/60">
                Pronto agregaremos plantillas exclusivas para tu plan
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => {
              const categoryConfig = CATEGORY_CONFIG[template.category as keyof typeof CATEGORY_CONFIG]
              const Icon = categoryConfig?.icon || FileText

              return (
                <Card 
                  key={template.id}
                  className="group hover:shadow-xl transition-all duration-300 border-hogara-gold/20 hover:border-hogara-gold/40 overflow-hidden"
                >
                  {/* Vista previa MEJORADA - siempre visible y atractiva */}
                  <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-hogara-cream via-white to-hogara-pink/10 overflow-hidden">
                    {/* Patrón decorativo de fondo */}
                    <div 
                      className="absolute inset-0 opacity-5"
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 20px,
                          rgba(200, 168, 130, 0.1) 20px,
                          rgba(200, 168, 130, 0.1) 21px
                        )`
                      }}
                    />
                    
                    {/* Logo de Hogara como marca de agua */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-8 pointer-events-none">
                      <img
                        src="/images/hogara-logo-main.png"
                        alt="Hogara"
                        className="w-1/2 h-1/2 object-contain transform rotate-12"
                        draggable={false}
                      />
                    </div>
                    
                    {/* Thumbnail del PDF O icono decorativo */}
                    {template.thumbnail ? (
                      <img
                        src={template.thumbnail}
                        alt={`Vista previa de ${template.name}`}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          // Si la imagen falla al cargar, ocultar y mostrar fallback
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback decorativo si no hay thumbnail */}
                    {!template.thumbnail && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                        <div className={`p-6 rounded-2xl ${categoryConfig?.bgColor || 'bg-gray-50'} shadow-lg`}>
                          <Icon className={`h-20 w-20 ${categoryConfig?.color || 'text-gray-600'}`} />
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-sm font-medium text-hogara-gray/80">
                            {categoryConfig?.label || 'Plantilla'}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-hogara-gold">
                            <Sparkles className="h-3 w-3" />
                            <span>Interactiva</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Badge de categoría */}
                    <Badge 
                      variant="outline" 
                      className="absolute top-3 right-3 border-hogara-gold/50 bg-white/95 text-hogara-gold backdrop-blur-sm shadow-sm"
                    >
                      {template.tier === 'total' ? 'Plan Total' : 'Premium'}
                    </Badge>
                    
                    {/* Icono de categoría en la esquina superior izquierda */}
                    <div className="absolute top-3 left-3">
                      <div className={`p-2 rounded-lg ${categoryConfig?.bgColor || 'bg-white'} shadow-sm`}>
                        <Icon className={`h-4 w-4 ${categoryConfig?.color || 'text-gray-600'}`} />
                      </div>
                    </div>
                    
                    {/* Overlay de hover con info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
                          <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-white font-medium text-sm">Abrir Plantilla</p>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white text-xs font-medium">
                        <Lock className="h-3 w-3" />
                        <span>Contenido Protegido</span>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="space-y-3">
                    <CardTitle className="font-serif text-lg text-hogara-gray group-hover:text-hogara-gold transition-colors line-clamp-2">
                      {template.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-hogara-gray/70 line-clamp-2">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Link href={`/premium/plantillas/${template.id}`}>
                      <Button 
                        className="w-full bg-hogara-gold hover:bg-hogara-gold/90 text-white group-hover:shadow-lg transition-shadow"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Abrir Plantilla Interactiva
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
