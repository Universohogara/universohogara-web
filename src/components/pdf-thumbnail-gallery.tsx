
'use client';

import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

// Configurar worker de PDF.js
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface PDFThumbnailGalleryProps {
  pdfUrl: string;
  onPageClick: (pageNum: number) => void;
  totalPages: number;
  watermarkImage?: string;
}

export default function PDFThumbnailGallery({ 
  pdfUrl, 
  onPageClick, 
  totalPages,
  watermarkImage = '/images/SELLO.png'
}: PDFThumbnailGalleryProps) {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(true); // CAMBIO: Mostrar todas por defecto
  const pdfDocRef = useRef<any>(null);
  const watermarkImgRef = useRef<HTMLImageElement | null>(null);

  // Cargar marca de agua
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = watermarkImage;
    img.onload = () => {
      watermarkImgRef.current = img;
    };
  }, [watermarkImage]);

  useEffect(() => {
    const generateThumbnails = async () => {
      try {
        setIsLoading(true);
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        pdfDocRef.current = pdf;

        const thumbs: string[] = [];
        
        // Generar miniaturas para todas las páginas CON MARCA DE AGUA
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 0.4 }); // Escala ligeramente más grande para mejor calidad

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) continue;

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Renderizar página del PDF
          const renderContext = {
            canvasContext: context,
            canvas: canvas,
            viewport: viewport,
          };
          await page.render(renderContext).promise;

          // AGREGAR MARCA DE AGUA a cada miniatura
          if (watermarkImgRef.current) {
            context.save();
            
            // Configurar opacidad para la marca de agua
            context.globalAlpha = 0.2;
            
            // Mover al centro del canvas
            context.translate(canvas.width / 2, canvas.height / 2);
            
            // Rotar -45 grados
            context.rotate(-Math.PI / 4);
            
            // Calcular tamaño de la marca de agua (40% del ancho para miniaturas)
            const watermarkWidth = canvas.width * 0.4;
            const watermarkHeight =
              (watermarkWidth * watermarkImgRef.current.height) / watermarkImgRef.current.width;
            
            // Dibujar marca de agua centrada
            context.drawImage(
              watermarkImgRef.current,
              -watermarkWidth / 2,
              -watermarkHeight / 2,
              watermarkWidth,
              watermarkHeight
            );
            
            context.restore();
          }

          thumbs.push(canvas.toDataURL());
        }

        setThumbnails(thumbs);
        setIsLoading(false);
      } catch (error) {
        console.error('Error generando miniaturas:', error);
        setIsLoading(false);
      }
    };

    generateThumbnails();
  }, [pdfUrl]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent"></div>
        <p className="mt-4 text-olive/70 text-sm">Cargando vista previa protegida...</p>
      </div>
    );
  }

  const displayedThumbnails = showAll ? thumbnails : thumbnails.slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-olive">
          📖 Vista Previa del Contenido ({totalPages} páginas)
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {displayedThumbnails.map((thumb, index) => (
          <button
            key={index}
            onClick={() => onPageClick(index + 1)}
            className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden border-2 border-gold/20 hover:border-gold transition-all group shadow-sm"
          >
            <img
              src={thumb}
              alt={`Página ${index + 1} - Contenido protegido`}
              className="w-full h-full object-cover select-none"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="h-6 w-6 text-white drop-shadow-lg" />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-olive/80 text-white text-xs px-2 py-0.5 rounded">
              {index + 1}
            </div>
          </button>
        ))}
      </div>

      {thumbnails.length > 8 && !showAll && (
        <Button
          onClick={() => setShowAll(true)}
          variant="outline"
          className="w-full border-gold/30 hover:bg-gold/10"
        >
          Ver todas las {thumbnails.length} páginas
        </Button>
      )}

      {showAll && thumbnails.length > 8 && (
        <Button
          onClick={() => setShowAll(false)}
          variant="outline"
          className="w-full border-gold/30 hover:bg-gold/10"
        >
          Mostrar menos
        </Button>
      )}
    </div>
  );
}
