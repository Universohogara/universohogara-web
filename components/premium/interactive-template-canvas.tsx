'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Undo2, 
  Redo2, 
  Eraser, 
  Paintbrush, 
  Save, 
  Download,
  Palette,
  RefreshCw,
  Droplet,
  Pencil
} from 'lucide-react';
import { toast } from 'sonner';

interface DrawingLine {
  tool: 'pen' | 'eraser';
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
}

interface FillArea {
  x: number;
  y: number;
  color: string;
  timestamp: number;
}

interface InteractiveTemplateCanvasProps {
  templateId: string;
  pdfUrl: string;
  templateName?: string;
  onSave?: () => void;
}

const COLORS = [
  '#FF6B6B', // Rojo suave
  '#4ECDC4', // Turquesa
  '#45B7D1', // Azul
  '#FFA07A', // Naranja
  '#98D8C8', // Verde menta
  '#F7DC6F', // Amarillo
  '#BB8FCE', // Púrpura
  '#85C1E2', // Azul claro
  '#F8B195', // Coral
  '#C06C84', // Rosa
  '#000000', // Negro
  '#6C5CE7', // Índigo
];

export function InteractiveTemplateCanvas({
  templateId,
  pdfUrl,
  templateName,
  onSave
}: InteractiveTemplateCanvasProps) {
  const [mode, setMode] = useState<'draw' | 'fill'>('fill'); // Modo por defecto: relleno táctil
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [lines, setLines] = useState<DrawingLine[]>([]);
  const [fillAreas, setFillAreas] = useState<FillArea[]>([]);
  const [history, setHistory] = useState<{ lines: DrawingLine[], fills: FillArea[] }[]>([{ lines: [], fills: [] }]);
  const [historyStep, setHistoryStep] = useState(0);
  const [color, setColor] = useState('#FF6B6B');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLIFrameElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 1130 });

  // Asegurar montaje en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cargar progreso guardado
  useEffect(() => {
    if (isMounted) {
      loadProgress();
    }
  }, [templateId, isMounted]);

  // Ajustar dimensiones al tamaño del contenedor
  useEffect(() => {
    if (!isMounted) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const width = Math.min(containerRef.current.offsetWidth - 32, 800);
        setDimensions({
          width,
          height: width * 1.4142 // Relación A4 exacta (√2)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isMounted]);

  // Redibujar canvas cuando cambien líneas, áreas rellenadas o dimensiones
  useEffect(() => {
    if (isMounted && canvasRef.current) {
      redrawCanvas();
    }
  }, [lines, fillAreas, dimensions, isMounted]);

  const loadProgress = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/templates/${templateId}/progress`);
      if (response.ok) {
        const data = await response.json();
        if (data.drawing_data) {
          const savedLines = data.drawing_data.lines || [];
          const savedFills = data.drawing_data.fills || [];
          setLines(savedLines);
          setFillAreas(savedFills);
          setHistory([{ lines: savedLines, fills: savedFills }]);
          setHistoryStep(0);
        }
      }
    } catch (error) {
      console.error('Error al cargar progreso:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/templates/${templateId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drawing_data: { lines, fills: fillAreas },
          completed: false
        })
      });

      if (response.ok) {
        toast.success('✓ Progreso guardado correctamente');
        onSave?.();
      } else {
        toast.error('Error al guardar el progreso');
      }
    } catch (error) {
      console.error('Error al guardar progreso:', error);
      toast.error('Error al guardar el progreso');
    } finally {
      setIsSaving(false);
    }
  };

  // Algoritmo de flood fill MEJORADO - detecta bordes automáticamente
  const floodFill = (startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    const startFloorX = Math.floor(startX);
    const startFloorY = Math.floor(startY);
    
    const targetColor = getPixelColor(pixels, startFloorX, startFloorY, canvas.width);
    const newColor = hexToRgb(fillColor);
    
    if (!newColor || colorsMatch(targetColor, newColor)) {
      toast.info('⚠️ Ese área ya tiene ese color', { duration: 2000 });
      return;
    }

    // Detectar si es un área con bordes definidos (tracker, casilla, etc)
    const hasDefinedBorders = (x: number, y: number, radius: number = 3): boolean => {
      let borderPixels = 0;
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          const checkX = x + dx;
          const checkY = y + dy;
          if (checkX >= 0 && checkX < canvas.width && checkY >= 0 && checkY < canvas.height) {
            const color = getPixelColor(pixels, checkX, checkY, canvas.width);
            // Si encontramos píxeles oscuros (bordes), es un área definida
            if (color.r < 200 && color.g < 200 && color.b < 200) {
              borderPixels++;
            }
          }
        }
      }
      return borderPixels > 3; // Si hay varios píxeles oscuros cerca, hay bordes
    };

    const hasBorders = hasDefinedBorders(startFloorX, startFloorY, 5);
    
    // Límite adaptativo: mayor si hay bordes (áreas definidas), menor si no
    const MAX_PIXELS = hasBorders ? 100000 : 30000;
    
    const pixelsToCheck = [{ x: startFloorX, y: startFloorY }];
    const checkedPixels = new Set<string>();
    let pixelsColored = 0;

    while (pixelsToCheck.length > 0 && pixelsColored < MAX_PIXELS) {
      const { x, y } = pixelsToCheck.pop()!;
      const key = `${x},${y}`;

      if (checkedPixels.has(key)) continue;
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

      const currentColor = getPixelColor(pixels, x, y, canvas.width);
      if (!colorsMatch(currentColor, targetColor)) continue;

      checkedPixels.add(key);
      setPixelColor(pixels, x, y, canvas.width, newColor);
      pixelsColored++;

      // Agregar píxeles vecinos (4 direcciones)
      pixelsToCheck.push({ x: x + 1, y });
      pixelsToCheck.push({ x: x - 1, y });
      pixelsToCheck.push({ x, y: y + 1 });
      pixelsToCheck.push({ x, y: y - 1 });
    }

    ctx.putImageData(imageData, 0, 0);
    
    if (pixelsColored >= MAX_PIXELS) {
      toast.warning('⚠️ Área demasiado grande - coloreada parcialmente. Prueba en modo Dibujo para áreas extensas.', {
        duration: 4000
      });
    } else if (pixelsColored > 0) {
      toast.success(`✅ ${pixelsColored.toLocaleString()} píxeles coloreados`, {
        duration: 1500
      });
    }
  };

  const getPixelColor = (pixels: Uint8ClampedArray, x: number, y: number, width: number) => {
    const i = (y * width + x) * 4;
    return { r: pixels[i], g: pixels[i + 1], b: pixels[i + 2], a: pixels[i + 3] };
  };

  const setPixelColor = (
    pixels: Uint8ClampedArray, 
    x: number, 
    y: number, 
    width: number, 
    color: { r: number; g: number; b: number }
  ) => {
    const i = (y * width + x) * 4;
    pixels[i] = color.r;
    pixels[i + 1] = color.g;
    pixels[i + 2] = color.b;
    pixels[i + 3] = 255;
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const colorsMatch = (
    c1: { r: number; g: number; b: number; a: number },
    c2: { r: number; g: number; b: number }
  ) => {
    return Math.abs(c1.r - c2.r) < 5 && Math.abs(c1.g - c2.g) < 5 && Math.abs(c1.b - c2.b) < 5;
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar áreas rellenadas primero (aplicar flood fill)
    fillAreas.forEach((fill) => {
      floodFill(fill.x, fill.y, fill.color);
    });

    // Dibujar todas las líneas encima
    lines.forEach((line) => {
      if (line.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (line.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.moveTo(line.points[0].x, line.points[0].y);
      
      for (let i = 1; i < line.points.length; i++) {
        ctx.lineTo(line.points[i].x, line.points[i].y);
      }
      
      ctx.stroke();
    });
  };

  const getPointerPosition = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPointerPosition(e);
    if (!pos) return;

    // Modo Relleno: Un toque rellena el área
    if (mode === 'fill') {
      const newFill: FillArea = {
        x: pos.x,
        y: pos.y,
        color,
        timestamp: Date.now()
      };
      
      const newFillAreas = [...fillAreas, newFill];
      setFillAreas(newFillAreas);
      
      // Aplicar el flood fill inmediatamente
      setTimeout(() => floodFill(pos.x, pos.y, color), 0);
      
      // Actualizar historial
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push({ lines: [...lines], fills: newFillAreas });
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
      
      toast.success('✓ Área coloreada');
      return;
    }

    // Modo Dibujo: Para Apple Pencil o dibujo libre
    setIsDrawing(true);
    
    const newLine: DrawingLine = {
      tool,
      points: [pos],
      color: tool === 'eraser' ? '#FFFFFF' : color,
      strokeWidth: tool === 'eraser' ? strokeWidth * 3 : strokeWidth
    };
    
    setLines([...lines, newLine]);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const pos = getPointerPosition(e);
    if (!pos) return;
    
    setLines(prevLines => {
      const newLines = [...prevLines];
      const lastLine = newLines[newLines.length - 1];
      if (lastLine) {
        lastLine.points.push(pos);
      }
      return newLines;
    });
  };

  const handlePointerUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      // Guardar en el historial (solo en modo dibujo)
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push({ lines: [...lines], fills: [...fillAreas] });
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const prevState = history[historyStep - 1];
      setHistoryStep(historyStep - 1);
      setLines(prevState.lines);
      setFillAreas(prevState.fills);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const nextState = history[historyStep + 1];
      setHistoryStep(historyStep + 1);
      setLines(nextState.lines);
      setFillAreas(nextState.fills);
    }
  };

  const handleClear = () => {
    setLines([]);
    setFillAreas([]);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push({ lines: [], fills: [] });
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
    toast.success('Dibujo borrado');
  };

  const handleExport = async () => {
    try {
      const canvas = canvasRef.current;
      const pdfIframe = pdfContainerRef.current;
      
      if (!canvas || !pdfIframe) {
        toast.error('Error al exportar');
        return;
      }

      // Crear canvas temporal para combinar PDF + dibujo
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = dimensions.width;
      tempCanvas.height = dimensions.height;
      const ctx = tempCanvas.getContext('2d');
      
      if (!ctx) {
        toast.error('Error al exportar');
        return;
      }

      // Fondo blanco
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Dibujar el canvas de dibujo encima
      ctx.drawImage(canvas, 0, 0);
      
      // Descargar
      const link = document.createElement('a');
      const fileName = templateName 
        ? `hogara-${templateName.toLowerCase().replace(/\s+/g, '-')}.png`
        : `hogara-plantilla-${templateId}.png`;
      link.download = fileName;
      link.href = tempCanvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('✓ Plantilla exportada correctamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar la plantilla');
    }
  };

  if (!isMounted || isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-muted/20 rounded-lg">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-[#C8A882] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Cargando plantilla...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de herramientas */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-lg border shadow-sm">
        {/* Selector de modo */}
        <div className="flex gap-2 border-r pr-3">
          <Button
            variant={mode === 'fill' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('fill')}
            className="gap-2"
            title="Modo Relleno: Toca para colorear áreas completas"
          >
            <Droplet className="w-4 h-4" />
            <span className="hidden sm:inline">Relleno</span>
          </Button>
          <Button
            variant={mode === 'draw' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('draw')}
            className="gap-2"
            title="Modo Dibujo: Dibuja libremente con Apple Pencil o dedo"
          >
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Dibujar</span>
          </Button>
        </div>

        {/* Selector de herramienta (solo en modo dibujo) */}
        {mode === 'draw' && (
          <>
            <div className="flex gap-2">
              <Button
                variant={tool === 'pen' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('pen')}
                className="gap-2"
              >
                <Paintbrush className="w-4 h-4" />
                <span className="hidden sm:inline">Pincel</span>
              </Button>
              <Button
                variant={tool === 'eraser' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('eraser')}
                className="gap-2"
              >
                <Eraser className="w-4 h-4" />
                <span className="hidden sm:inline">Borrador</span>
              </Button>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />
          </>
        )}

        {/* Selector de color */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="gap-2"
            disabled={mode === 'draw' && tool === 'eraser'}
          >
            <Palette className="w-4 h-4" />
            <div 
              className="w-5 h-5 rounded-full border-2 border-background shadow-sm"
              style={{ backgroundColor: color }}
            />
          </Button>
          
          {showColorPicker && (
            <div className="absolute top-full mt-2 p-3 bg-card rounded-lg border shadow-lg z-10 grid grid-cols-6 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c ? 'border-[#C8A882] scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    setColor(c);
                    setShowColorPicker(false);
                  }}
                  aria-label={`Seleccionar color ${c}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Control de grosor (solo en modo dibujo) */}
        {mode === 'draw' && (
          <>
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Grosor:
              </span>
              <Slider
                value={[strokeWidth]}
                onValueChange={([value]) => setStrokeWidth(value)}
                min={1}
                max={20}
                step={1}
                className="flex-1"
              />
              <span className="text-sm font-medium w-6 text-right">{strokeWidth}</span>
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" />
          </>
        )}

        {/* Deshacer/Rehacer/Limpiar */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={historyStep === 0}
            title="Deshacer"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={historyStep >= history.length - 1}
            title="Rehacer"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={lines.length === 0}
            title="Borrar todo"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-8 w-px bg-border hidden sm:block" />

        {/* Guardar y Exportar */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={saveProgress}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isSaving ? 'Guardando...' : 'Guardar'}
            </span>
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleExport}
            className="gap-2 bg-[#C8A882] hover:bg-[#B89872]"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        </div>
      </div>

      {/* Canvas con PDF de fondo */}
      <div 
        ref={containerRef}
        className="relative bg-white rounded-lg shadow-lg overflow-hidden border-2 border-[#C8A882]/20"
        style={{ touchAction: 'none' }}
      >
        {/* PDF de fondo (bloqueado) */}
        <div 
          className="absolute inset-0"
          style={{ 
            width: dimensions.width,
            height: dimensions.height,
            overflow: 'hidden',
            pointerEvents: 'none'
          }}
        >
          <iframe
            ref={pdfContainerRef}
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="w-full h-full border-0"
            style={{
              pointerEvents: 'none',
              userSelect: 'none'
            }}
            title="Plantilla PDF"
          />
        </div>

        {/* MARCA DE AGUA: Logo de Hogara (NO DESCARGABLE) */}
        <div 
          className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center"
          style={{
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 250px,
              rgba(200, 168, 130, 0.03) 250px,
              rgba(200, 168, 130, 0.03) 251px
            )`
          }}
        >
          {/* Logo central rotado como marca de agua */}
          <div 
            className="absolute opacity-8"
            style={{
              transform: 'rotate(-30deg)',
              width: '60%',
              maxWidth: '400px',
              aspectRatio: '1'
            }}
          >
            <img
              src="/images/hogara-logo-main.png"
              alt="Hogara Planner"
              className="w-full h-full object-contain"
              style={{
                opacity: 0.08,
                pointerEvents: 'none',
                userSelect: 'none'
              }}
              draggable={false}
            />
          </div>
          
          {/* Texto "Hogara Planner" en esquinas */}
          <div 
            className="absolute top-4 right-4 text-[#C8A882] text-xs font-medium opacity-40"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            Hogara Planner ©
          </div>
          <div 
            className="absolute bottom-4 left-4 text-[#C8A882] text-xs font-medium opacity-40"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            Uso exclusivo de suscriptores
          </div>
        </div>

        {/* Canvas de dibujo encima */}
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className={`relative z-10 ${mode === 'fill' ? 'cursor-pointer' : 'cursor-crosshair'}`}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto'
          }}
        />
      </div>

      {/* Ayuda táctil */}
      <div className="text-center text-sm text-muted-foreground space-y-2">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <p className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-[#C8A882]" />
            <span><strong>Modo Relleno:</strong> Toca cualquier área para colorearla completa</span>
          </p>
          <p className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-[#C8A882]" />
            <span><strong>Modo Dibujo:</strong> Dibuja libremente con Apple Pencil o stylus</span>
          </p>
        </div>
        <p className="text-xs">
          Tu progreso se guarda automáticamente en la nube ☁️
        </p>
      </div>
    </div>
  );
}
