
'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Eye, Save, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

interface ProtectedTemplateViewerProps {
  templateId: string
  templateName: string
  children: React.ReactNode
  onSave?: (data: any) => Promise<void>
}

export function ProtectedTemplateViewer({
  templateId,
  templateName,
  children,
  onSave
}: ProtectedTemplateViewerProps) {
  const { data: session } = useSession() || {}
  const router = useRouter()
  const [suspiciousActivity, setSuspiciousActivity] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const userEmail = session?.user?.email || 'usuario'

  // Protección contra capturas de pantalla (detección de cambio de pestaña)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setSuspiciousActivity(prev => prev + 1)
        // Log suspicious activity
        fetch('/api/templates/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId,
            activity: 'tab_switch',
            timestamp: new Date().toISOString()
          })
        }).catch(() => {})
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [templateId])

  // Deshabilitar clic derecho
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      toast.error('Esta acción está protegida', {
        description: 'El contenido premium no puede ser copiado'
      })
      setSuspiciousActivity(prev => prev + 1)
      return false
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('contextmenu', handleContextMenu)
      return () => container.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  // Deshabilitar selección y arrastrar
  useEffect(() => {
    const handleSelectStart = (e: Event) => {
      e.preventDefault()
      return false
    }

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('selectstart', handleSelectStart)
      container.addEventListener('dragstart', handleDragStart)
      
      return () => {
        container.removeEventListener('selectstart', handleSelectStart)
        container.removeEventListener('dragstart', handleDragStart)
      }
    }
  }, [])

  // Deshabilitar atajos de teclado peligrosos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S, Ctrl+P, Ctrl+C, Print Screen
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'c')) ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault()
        toast.error('Esta acción está deshabilitada', {
          description: 'El contenido está protegido contra copia'
        })
        setSuspiciousActivity(prev => prev + 1)
        return false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Mostrar advertencia si hay actividad sospechosa
  useEffect(() => {
    if (suspiciousActivity >= 3) {
      toast.warning('Advertencia de uso', {
        description: 'Se ha detectado actividad sospechosa en tu sesión',
        duration: 5000
      })
    }
  }, [suspiciousActivity])

  // Guardado automático
  const handleAutoSave = async (data: any) => {
    if (!onSave) return
    
    setIsSaving(true)
    try {
      await onSave(data)
      setLastSaved(new Date())
      toast.success('Guardado automáticamente')
    } catch (error) {
      toast.error('Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-hogara-cream via-white to-hogara-pink/5">
      {/* Barra de estado superior */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-hogara-gold/20 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-hogara-gray hover:text-hogara-gold"
              >
                ← Volver
              </Button>
              <div>
                <h2 className="font-serif text-lg text-hogara-gray font-medium">
                  {templateName}
                </h2>
                <p className="text-xs text-hogara-gray/60">
                  Contenido protegido · Solo lectura en app
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {lastSaved && (
                <div className="flex items-center gap-2 text-sm text-hogara-gray/60">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>
                    Guardado {lastSaved.toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              )}
              
              {isSaving && (
                <div className="flex items-center gap-2 text-sm text-hogara-gray/60">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-hogara-gold border-t-transparent" />
                  <span>Guardando...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Advertencia legal */}
      <div className="container mx-auto px-4 py-4">
        <Card className="bg-amber-50 border-amber-200">
          <div className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-900 mb-1">
                Contenido Protegido por Propiedad Intelectual
              </h3>
              <p className="text-sm text-amber-800/80 leading-relaxed">
                Este contenido es exclusivo de Hogara Planner y está protegido por derechos de autor. 
                Está prohibida su reproducción, distribución, o uso comercial sin autorización expresa. 
                Todas las sesiones son monitoreadas y el contenido incluye marca de agua personalizada 
                con tu información de usuario ({userEmail}).
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Contenedor protegido */}
      <div
        ref={containerRef}
        className="relative container mx-auto px-4 pb-12"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      >
        {/* Marca de agua visible en el fondo */}
        <div className="fixed inset-0 pointer-events-none z-10 opacity-[0.015]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="transform rotate-[-45deg] text-6xl font-serif text-hogara-gray whitespace-nowrap"
              style={{ fontSize: '8rem', lineHeight: 1.5 }}
            >
              {Array.from({ length: 50 }, (_, i) => (
                <div key={i} className="mb-32">
                  {userEmail} · Hogara Planner · {userEmail} · Hogara Planner · {userEmail}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay de protección invisible */}
        <div className="relative z-20">
          {children}
        </div>

        {/* Marca de agua diagonal visible pero elegante */}
        <div className="fixed bottom-8 right-8 pointer-events-none z-50 opacity-20">
          <div className="transform rotate-[-15deg] bg-hogara-gold/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-hogara-gold/30">
            <p className="text-xs font-medium text-hogara-gray">
              {userEmail}
            </p>
            <p className="text-[10px] text-hogara-gray/60">
              Hogara Planner © 2025
            </p>
          </div>
        </div>
      </div>

      {/* Indicador de actividad sospechosa (solo para debugging) */}
      {process.env.NODE_ENV === 'development' && suspiciousActivity > 0 && (
        <div className="fixed bottom-4 left-4 bg-red-100 border border-red-300 rounded-lg p-2 text-xs">
          <Eye className="h-4 w-4 inline mr-1" />
          Actividad sospechosa: {suspiciousActivity}
        </div>
      )}
    </div>
  )
}
