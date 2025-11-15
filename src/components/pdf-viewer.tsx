
'use client';

import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from 'lucide-react';

// Configurar worker de PDF.js
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

interface PDFViewerProps {
  pdfUrl: string;
  onClose?: () => void;
  watermarkImage?: string;
  initialPage?: number;
}

export default function PDFViewer({ pdfUrl, onClose, watermarkImage = '/images/SELLO.png', initialPage = 1 }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1.5);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);
  const watermarkImgRef = useRef<HTMLImageElement | null>(null);

  // Actualizar página cuando cambie initialPage
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  // Prevenir clic derecho, selección y atajos de teclado
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    const preventSelection = (e: Event) => e.preventDefault();
    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      // Prevenir Ctrl+S, Ctrl+P, Ctrl+C, F12, etc.
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'c')) ||
        e.key === 'F12' ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('selectstart', preventSelection);
    document.addEventListener('keydown', preventKeyboardShortcuts);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('selectstart', preventSelection);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
    };
  }, []);

  // Cargar marca de agua
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = watermarkImage;
    img.onload = () => {
      watermarkImgRef.current = img;
    };
  }, [watermarkImage]);

  // Cargar PDF
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error cargando PDF:', error);
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  // Renderizar página con marca de agua
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDocRef.current || !canvasRef.current) return;

      try {
        const page = await pdfDocRef.current.getPage(currentPage);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        const viewport = page.getViewport({ scale });

        // Ajustar tamaño del canvas
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Renderizar página del PDF
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Añadir marca de agua diagonal
        if (watermarkImgRef.current) {
          context.save();

          // Configurar opacidad
          context.globalAlpha = 0.15;

          // Mover al centro del canvas
          context.translate(canvas.width / 2, canvas.height / 2);

          // Rotar -45 grados
          context.rotate(-Math.PI / 4);

          // Calcular tamaño de la marca de agua (30% del ancho del canvas)
          const watermarkWidth = canvas.width * 0.3;
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
      } catch (error) {
        console.error('Error renderizando página:', error);
      }
    };

    renderPage();
  }, [currentPage, scale, pdfUrl]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < numPages) setCurrentPage(currentPage + 1);
  };

  const handleZoomIn = () => {
    if (scale < 3) setScale(scale + 0.25);
  };

  const handleZoomOut = () => {
    if (scale > 0.5) setScale(scale - 0.25);
  };

  return (
    <div className="fixed inset-0 z-50 bg-cream/95 backdrop-blur-sm flex flex-col">
      {/* Header con controles */}
      <div className="bg-white border-b border-gold/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-serif text-xl text-olive">Vista Previa de Plantilla</h3>
          <div className="text-sm text-olive/70">
            Página {currentPage} de {numPages}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Controles de zoom */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="border-gold/30 hover:bg-gold/10"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-olive/70 w-16 text-center">{Math.round(scale * 100)}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={scale >= 3}
            className="border-gold/30 hover:bg-gold/10"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          {/* Botón cerrar */}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="ml-4">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Área de visualización */}
      <div className="flex-1 overflow-auto bg-cream flex items-center justify-center p-8">
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent"></div>
            <p className="mt-4 text-olive/70">Cargando plantilla...</p>
          </div>
        ) : (
          <div className="relative select-none" style={{ userSelect: 'none' }}>
            <canvas
              ref={canvasRef}
              className="shadow-2xl bg-white"
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
              }}
            />
            {/* Overlay invisible para prevenir interacciones */}
            <div
              className="absolute inset-0"
              style={{
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          </div>
        )}
      </div>

      {/* Footer con navegación de páginas */}
      <div className="bg-white border-t border-gold/20 px-6 py-4 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="border-gold/30 hover:bg-gold/10"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>

        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(numPages, 5) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-full text-sm transition-all ${
                  currentPage === pageNum
                    ? 'bg-gold text-white'
                    : 'bg-white border border-gold/30 text-olive/70 hover:bg-gold/10'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {numPages > 5 && <span className="text-olive/50">...</span>}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === numPages}
          className="border-gold/30 hover:bg-gold/10"
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Mensaje de protección sutil */}
      <div className="absolute bottom-20 right-8 text-xs text-olive/40 italic">
        © Hogara Planner - Contenido protegido
      </div>
    </div>
  );
}
