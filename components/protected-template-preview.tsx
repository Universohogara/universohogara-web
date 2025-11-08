
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProtectedTemplatePreviewProps {
  productName: string
  pdfPath: string
  totalPages: number
  thumbnailImages?: string[] // Array de rutas a las miniaturas CON MARCA DE AGUA
}

export function ProtectedTemplatePreview({ 
  productName, 
  pdfPath, 
  totalPages,
  thumbnailImages = []
}: ProtectedTemplatePreviewProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [visiblePages, setVisiblePages] = useState(12) // Mostrar 12 inicialmente

  // Usar las miniaturas proporcionadas (que ya tienen marca de agua circular)
  const thumbnails = thumbnailImages.length > 0 
    ? thumbnailImages 
    : []

  const displayedThumbnails = thumbnails.slice(0, visiblePages)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % thumbnails.length)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + thumbnails.length) % thumbnails.length)
  }
  
  const loadMore = () => {
    setVisiblePages((prev) => Math.min(prev + 12, thumbnails.length))
  }

  return (
    <>
      {/* Grid de Miniaturas */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-heading text-hogara-gray">
            Vista Previa del Contenido
          </h3>
          <Button
            onClick={() => setShowPreview(true)}
            variant="outline"
            className="gap-2 border-hogara-gold text-hogara-gold hover:bg-hogara-gold hover:text-white"
          >
            <Eye className="h-4 w-4" />
            Ver todas las páginas
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedThumbnails.map((thumb, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              onClick={() => {
                setCurrentPage(index)
                setShowPreview(true)
              }}
              className="watermarked-thumbnail cursor-pointer group"
            >
              {/* Las miniaturas YA TIENEN el sello circular aplicado */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 group-hover:border-hogara-gold transition-all shadow-md">
                <Image
                  src={thumb}
                  alt={`Página ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Número de página */}
                <div className="absolute bottom-2 left-2 bg-hogara-gold/90 text-white text-xs px-2 py-1 rounded">
                  Pág. {index + 1}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Eye className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
              </div>

              <p className="text-xs text-center mt-2 text-hogara-gray/70">
                Página {index + 1} de {totalPages}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Botón para cargar más */}
        {visiblePages < thumbnails.length && (
          <div className="text-center mt-6">
            <Button
              onClick={loadMore}
              variant="outline"
              className="border-hogara-gold text-hogara-gold hover:bg-hogara-gold hover:text-white"
            >
              Cargar más páginas ({visiblePages} de {totalPages})
            </Button>
          </div>
        )}
        
        {visiblePages >= thumbnails.length && thumbnails.length > 12 && (
          <p className="text-center text-sm text-hogara-gray/60 mt-4">
            ✨ Mostrando todas las {totalPages} páginas del producto
          </p>
        )}
      </div>

      {/* Modal de vista completa */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-hogara-gray">
              {productName}
            </DialogTitle>
            <DialogDescription>
              Vista previa protegida - Página {currentPage + 1} de {thumbnails.length}
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            {/* Visor de página actual - YA TIENE marca de agua circular */}
            <div className="watermarked-thumbnail">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={thumbnails[currentPage]}
                  alt={`Página ${currentPage + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Controles de navegación */}
            <div className="flex items-center justify-between mt-4">
              <Button
                onClick={prevPage}
                variant="outline"
                disabled={currentPage === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <span className="text-sm text-hogara-gray">
                {currentPage + 1} / {thumbnails.length}
              </span>

              <Button
                onClick={nextPage}
                variant="outline"
                disabled={currentPage === thumbnails.length - 1}
                className="gap-2"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Estilos CSS para protección adicional */}
      <style jsx global>{`
        .watermarked-thumbnail {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        .watermarked-thumbnail * {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          pointer-events: none;
        }

        .watermarked-thumbnail img {
          pointer-events: none !important;
          -webkit-user-drag: none !important;
          -khtml-user-drag: none !important;
          -moz-user-drag: none !important;
          -o-user-drag: none !important;
          user-drag: none !important;
        }

        /* Prevenir captura de pantalla en algunos navegadores */
        @media print {
          .watermarked-thumbnail {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
