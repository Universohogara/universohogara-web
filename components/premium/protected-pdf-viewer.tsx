
'use client'

import { useState, useEffect, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Lock,
  AlertTriangle
} from 'lucide-react'
import Image from 'next/image'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Configurar el worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface ProtectedPDFViewerProps {
  pdfUrl: string
  templateName: string
  userEmail?: string
}

export function ProtectedPDFViewer({ 
  pdfUrl, 
  templateName,
  userEmail 
}: ProtectedPDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.2)
  const [loading, setLoading] = useState<boolean>(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Protección contra clic derecho
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Protección contra atajos de teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bloquear Ctrl+P (imprimir), Ctrl+S (guardar), Ctrl+C (copiar)
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === 'p' || e.key === 's' || e.key === 'c' || e.key === 'a')
      ) {
        e.preventDefault()
        return false
      }
      // Bloquear tecla de impresión de pantalla
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        return false
      }
    }

    // Protección contra selección
    const handleSelectStart = (e: Event) => {
      e.preventDefault()
      return false
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('selectstart', handleSelectStart)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('selectstart', handleSelectStart)
    }
  }, [])

  // Protección CSS adicional
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.userSelect = 'none'
      containerRef.current.style.webkitUserSelect = 'none'
      // @ts-ignore - webkit property
      containerRef.current.style.webkitTouchCallout = 'none'
    }
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
  }

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages))
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.5))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hogara-cream via-white to-hogara-pink/5 py-8">
      <div className="container mx-auto px-4">
        {/* Header con información de protección */}
        <Card className="mb-6 p-6 bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200">
          <div className="flex items-start gap-4">
            <Lock className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-heading text-lg text-amber-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Contenido Máximamente Protegido
              </h3>
              <div className="space-y-1 text-sm text-amber-800/90">
                <p>✓ <strong>No descargable:</strong> Este PDF solo puede visualizarse aquí</p>
                <p>✓ <strong>Marca de agua personalizada:</strong> Cada página incluye tu email</p>
                <p>✓ <strong>Sin impresión:</strong> Protegido contra impresión y capturas</p>
                <p>✓ <strong>Uso exclusivo:</strong> Solo para tu uso personal dentro de la app</p>
              </div>
              {userEmail && (
                <p className="mt-3 text-xs text-amber-700 font-medium">
                  📧 Licenciado para: {userEmail}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Título de la plantilla */}
        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl md:text-4xl text-hogara-gray mb-2">
            {templateName}
          </h1>
          <p className="text-hogara-gray/70">
            Página {pageNumber} de {numPages || '...'}
          </p>
        </div>

        {/* Controles de navegación */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <Button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            variant="outline"
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
            <Button
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              variant="ghost"
              size="sm"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-16 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              onClick={handleZoomIn}
              disabled={scale >= 2.5}
              variant="ghost"
              size="sm"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            variant="outline"
            className="gap-2"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Visor de PDF con marca de agua */}
        <div className="flex justify-center">
          <Card 
            ref={containerRef}
            className="relative overflow-hidden shadow-2xl bg-white p-8"
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          >
            {/* Marca de agua diagonal */}
            <div 
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 200px,
                  rgba(0, 0, 0, 0.02) 200px,
                  rgba(0, 0, 0, 0.02) 201px
                )`
              }}
            >
              {/* Logo como marca de agua */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="relative opacity-10"
                  style={{
                    transform: 'rotate(-45deg)',
                    width: '400px',
                    height: '400px'
                  }}
                >
                  <Image
                    src="/images/hogara-logo-main.png"
                    alt="Hogara Planner"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Email como marca de agua adicional */}
              {userEmail && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="text-6xl font-bold opacity-5 select-none"
                    style={{
                      transform: 'rotate(-45deg)',
                      color: '#8B7355',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {userEmail}
                  </div>
                </div>
              )}
            </div>

            {/* Documento PDF */}
            <div className="relative z-0">
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center space-y-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-hogara-gold border-t-transparent mx-auto" />
                    <p className="text-hogara-gray">Cargando plantilla protegida...</p>
                  </div>
                </div>
              )}
              
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading=""
                error={
                  <div className="text-center py-20">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">Error al cargar el PDF</p>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                />
              </Document>
            </div>
          </Card>
        </div>

        {/* Información adicional */}
        <div className="text-center mt-8 text-sm text-hogara-gray/70 max-w-2xl mx-auto">
          <p>
            Este contenido es exclusivo para suscriptores de Hogara Planner y está 
            protegido por derechos de autor. El uso no autorizado está prohibido.
          </p>
        </div>
      </div>
    </div>
  )
}
