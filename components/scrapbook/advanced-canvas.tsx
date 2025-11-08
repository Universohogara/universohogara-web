
'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Save, 
  Undo, 
  Redo, 
  Trash2, 
  Image as ImageIcon,
  Type,
  Paintbrush,
  Eraser,
  Palette,
  Sparkles,
  Download,
  Scissors
} from 'lucide-react'
import { toast } from 'sonner'

interface CanvasElement {
  id: string
  type: 'sticker' | 'text' | 'image' | 'paint'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  data: any
  zIndex: number
  cropArea?: {
    x: number
    y: number
    width: number
    height: number
  }
}

interface PaintStroke {
  points: { x: number; y: number }[]
  color: string
  width: number
}

interface ColorArea {
  x: number
  y: number
  width: number
  height: number
  color: string
}

interface AdvancedCanvasProps {
  pageId?: string
  initialData?: any
  onSave?: (data: any) => void
  onPointsEarned?: (points: number, reason: string) => void
}

const COLORS = [
  { name: 'Rosa Suave', value: '#FFB6C1' },
  { name: 'Lavanda', value: '#E6E6FA' },
  { name: 'Melocotón', value: '#FFDAB9' },
  { name: 'Menta', value: '#98D8C8' },
  { name: 'Cielo', value: '#87CEEB' },
  { name: 'Dorado', value: '#B8956A' },
  { name: 'Coral', value: '#FF7F50' },
  { name: 'Lila', value: '#DDA0DD' },
]

export default function AdvancedCanvas({
  pageId,
  initialData,
  onSave,
  onPointsEarned
}: AdvancedCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const paintCanvasRef = useRef<HTMLCanvasElement>(null)
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [tool, setTool] = useState<'select' | 'paint' | 'erase' | 'colorArea' | 'crop'>('select')
  const [currentColor, setCurrentColor] = useState('#FFB6C1')
  const [brushSize, setBrushSize] = useState(10)
  const [isPainting, setIsPainting] = useState(false)
  const [paintStrokes, setPaintStrokes] = useState<PaintStroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([])
  const [colorAreas, setColorAreas] = useState<ColorArea[]>([])
  const [isCreatingArea, setIsCreatingArea] = useState(false)
  const [areaStart, setAreaStart] = useState<{ x: number; y: number } | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [actionsCount, setActionsCount] = useState(0)
  
  // Estados para manipulación de elementos
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [elementStart, setElementStart] = useState<{ x: number; y: number; width: number; height: number; rotation: number } | null>(null)
  
  // Estados para recorte
  const [isCropping, setIsCropping] = useState(false)
  const [cropArea, setCropArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null)

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      try {
        const parsed = typeof initialData === 'string' ? JSON.parse(initialData) : initialData
        setElements(parsed.elements || [])
        setPaintStrokes(parsed.paintStrokes || [])
        setColorAreas(parsed.colorAreas || [])
      } catch (error) {
        console.error('Error al cargar datos:', error)
      }
    }
  }, [initialData])

  // Guardar en historial
  const saveToHistory = useCallback(() => {
    const state = { elements, paintStrokes, colorAreas }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(state)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [elements, paintStrokes, colorAreas, history, historyIndex])

  // Deshacer
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      setElements(prevState.elements)
      setPaintStrokes(prevState.paintStrokes)
      setColorAreas(prevState.colorAreas)
      setHistoryIndex(historyIndex - 1)
    }
  }

  // Rehacer
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setElements(nextState.elements)
      setPaintStrokes(nextState.paintStrokes)
      setColorAreas(nextState.colorAreas)
      setHistoryIndex(historyIndex + 1)
    }
  }

  // Manejo de drag & drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('application/json')
    
    if (data) {
      try {
        const item = JSON.parse(data)
        const rect = canvasRef.current?.getBoundingClientRect()
        
        if (rect) {
          // Tamaño inicial optimizado para mejor composición - 250x250 px
          const initialSize = 250
          const newElement: CanvasElement = {
            id: `element-${Date.now()}`,
            type: item.type,
            x: e.clientX - rect.left - (initialSize / 2),
            y: e.clientY - rect.top - (initialSize / 2),
            width: initialSize,
            height: initialSize,
            rotation: 0,
            opacity: 1,
            data: {
              ...item.data,
              // Agregar timestamp para evitar caché del navegador
              image_url: item.data.image_url + '?t=' + Date.now()
            },
            zIndex: elements.length
          }
          
          setElements([...elements, newElement])
          setSelectedElement(newElement.id)
          saveToHistory()
          
          // Recompensa por agregar elemento
          incrementActions()
          if (onPointsEarned) {
            onPointsEarned(5, 'Elemento agregado')
          }
          
          toast.success('¡Elemento agregado! +5 puntos')
        }
      } catch (error) {
        console.error('Error al procesar drop:', error)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    
    // Auto-scroll mejorado - Funciona tanto en el canvas como en la ventana principal
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const scrollThreshold = 150 // Mayor área de sensibilidad
      const scrollSpeed = 15 // Velocidad aumentada
      
      // Scroll dentro del canvas
      if (e.clientY - rect.top < scrollThreshold && canvasRef.current) {
        canvasRef.current.scrollTop = Math.max(0, canvasRef.current.scrollTop - scrollSpeed)
      }
      
      if (rect.bottom - e.clientY < scrollThreshold && canvasRef.current) {
        canvasRef.current.scrollTop = canvasRef.current.scrollTop + scrollSpeed
      }
    }
    
    // También hacer scroll en la ventana principal si es necesario
    const windowScrollThreshold = 200
    const windowScrollSpeed = 20
    
    if (e.clientY < windowScrollThreshold) {
      window.scrollBy({ top: -windowScrollSpeed, behavior: 'auto' })
    }
    
    if (window.innerHeight - e.clientY < windowScrollThreshold) {
      window.scrollBy({ top: windowScrollSpeed, behavior: 'auto' })
    }
  }

  // Sistema de pintura
  const startPainting = (e: React.MouseEvent) => {
    if (tool === 'paint' || tool === 'erase') {
      setIsPainting(true)
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        setCurrentStroke([{ x: e.clientX - rect.left, y: e.clientY - rect.top }])
      }
    } else if (tool === 'colorArea') {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        setIsCreatingArea(true)
        setAreaStart({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }
    } else if (tool === 'crop' && selectedElement && !isCropping) {
      // Iniciar ajuste del área de recorte
      const element = elements.find(el => el.id === selectedElement)
      if (!element) return
      
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const relativeX = e.clientX - rect.left - element.x
        const relativeY = e.clientY - rect.top - element.y
        
        setIsCropping(true)
        setCropStart({ x: relativeX, y: relativeY })
      }
    }
  }

  const paint = (e: React.MouseEvent) => {
    if (isPainting && (tool === 'paint' || tool === 'erase')) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        setCurrentStroke([...currentStroke, { x: e.clientX - rect.left, y: e.clientY - rect.top }])
      }
    } else if (isCreatingArea && tool === 'colorArea' && areaStart) {
      // Mostrar preview del área
    } else if (isCropping && tool === 'crop' && cropStart && selectedElement) {
      // Actualizar área de recorte mientras se arrastra
      const element = elements.find(el => el.id === selectedElement)
      if (!element) return
      
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const relativeX = e.clientX - rect.left - element.x
        const relativeY = e.clientY - rect.top - element.y
        
        const newCropArea = {
          x: Math.max(0, Math.min(cropStart.x, relativeX)),
          y: Math.max(0, Math.min(cropStart.y, relativeY)),
          width: Math.min(element.width, Math.abs(relativeX - cropStart.x)),
          height: Math.min(element.height, Math.abs(relativeY - cropStart.y))
        }
        
        setCropArea(newCropArea)
      }
    }
  }

  const stopPainting = (e: React.MouseEvent) => {
    if (isPainting && currentStroke.length > 0) {
      const newStroke: PaintStroke = {
        points: currentStroke,
        color: tool === 'erase' ? 'transparent' : currentColor,
        width: brushSize
      }
      setPaintStrokes([...paintStrokes, newStroke])
      setCurrentStroke([])
      setIsPainting(false)
      saveToHistory()
      
      // Recompensa por pintar
      incrementActions()
      if (onPointsEarned) {
        onPointsEarned(3, 'Trazo pintado')
      }
    } else if (isCreatingArea && areaStart) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const endX = e.clientX - rect.left
        const endY = e.clientY - rect.top
        
        const newArea: ColorArea = {
          x: Math.min(areaStart.x, endX),
          y: Math.min(areaStart.y, endY),
          width: Math.abs(endX - areaStart.x),
          height: Math.abs(endY - areaStart.y),
          color: currentColor
        }
        
        if (newArea.width > 10 && newArea.height > 10) {
          setColorAreas([...colorAreas, newArea])
          saveToHistory()
          
          // Recompensa por colorear área
          incrementActions()
          if (onPointsEarned) {
            onPointsEarned(8, 'Área coloreada')
          }
          toast.success('¡Área coloreada! +8 puntos')
        }
      }
      
      setIsCreatingArea(false)
      setAreaStart(null)
    } else if (isCropping && cropStart) {
      // Finalizar ajuste de área de recorte
      setIsCropping(false)
      setCropStart(null)
    }
  }

  // Renderizar trazos de pintura
  useEffect(() => {
    const canvas = paintCanvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Dibujar trazos guardados
    paintStrokes.forEach(stroke => {
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      ctx.beginPath()
      stroke.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      })
      ctx.stroke()
    })
    
    // Dibujar trazo actual
    if (currentStroke.length > 0) {
      ctx.strokeStyle = tool === 'erase' ? 'white' : currentColor
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      ctx.beginPath()
      currentStroke.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      })
      ctx.stroke()
    }
  }, [paintStrokes, currentStroke, currentColor, brushSize, tool])

  const incrementActions = () => {
    const newCount = actionsCount + 1
    setActionsCount(newCount)
    
    // Logros por cantidad de acciones
    if (newCount === 10 && onPointsEarned) {
      toast.success('¡Logro desbloqueado: Primera Creación! +50 puntos', {
        icon: '🏆'
      })
      onPointsEarned(50, 'Logro: Primera Creación')
    } else if (newCount === 50 && onPointsEarned) {
      toast.success('¡Logro desbloqueado: Artista Dedicada! +100 puntos', {
        icon: '🎨'
      })
      onPointsEarned(100, 'Logro: Artista Dedicada')
    }
  }

  // Eliminar elemento
  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id))
    setSelectedElement(null)
    saveToHistory()
  }

  // Manipulación de elementos
  const startDragging = (e: React.MouseEvent, elementId: string) => {
    if (tool !== 'select') return
    e.stopPropagation()
    const element = elements.find(el => el.id === elementId)
    if (!element) return
    
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setElementStart({ x: element.x, y: element.y, width: element.width, height: element.height, rotation: element.rotation })
  }

  const startResizing = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation()
    const element = elements.find(el => el.id === elementId)
    if (!element) return
    
    setIsResizing(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setElementStart({ x: element.x, y: element.y, width: element.width, height: element.height, rotation: element.rotation })
  }

  const startRotating = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation()
    const element = elements.find(el => el.id === elementId)
    if (!element) return
    
    setIsRotating(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setElementStart({ x: element.x, y: element.y, width: element.width, height: element.height, rotation: element.rotation })
  }

  const handleElementManipulation = (e: React.MouseEvent) => {
    if (!selectedElement || !dragStart || !elementStart) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    setElements(elements.map(el => {
      if (el.id !== selectedElement) return el

      if (isDragging) {
        return { ...el, x: elementStart.x + deltaX, y: elementStart.y + deltaY }
      }
      
      if (isResizing) {
        const newWidth = Math.max(30, elementStart.width + deltaX)
        const newHeight = Math.max(30, elementStart.height + deltaY)
        return { ...el, width: newWidth, height: newHeight }
      }
      
      if (isRotating) {
        const centerX = elementStart.x + elementStart.width / 2
        const centerY = elementStart.y + elementStart.height / 2
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
        return { ...el, rotation: angle }
      }

      return el
    }))
  }

  const stopManipulation = () => {
    if (isDragging || isResizing || isRotating) {
      saveToHistory()
    }
    setIsDragging(false)
    setIsResizing(false)
    setIsRotating(false)
    setDragStart(null)
    setElementStart(null)
  }

  // Cambiar opacidad del elemento seleccionado
  const changeOpacity = (opacity: number) => {
    if (!selectedElement) return
    
    setElements(elements.map(el => 
      el.id === selectedElement ? { ...el, opacity } : el
    ))
  }

  // Cambiar z-index (traer al frente / enviar atrás)
  const bringToFront = () => {
    if (!selectedElement) return
    const maxZ = Math.max(...elements.map(el => el.zIndex), 0)
    setElements(elements.map(el => 
      el.id === selectedElement ? { ...el, zIndex: maxZ + 1 } : el
    ))
    saveToHistory()
  }

  const sendToBack = () => {
    if (!selectedElement) return
    const minZ = Math.min(...elements.map(el => el.zIndex), 0)
    setElements(elements.map(el => 
      el.id === selectedElement ? { ...el, zIndex: minZ - 1 } : el
    ))
    saveToHistory()
  }

  // Duplicar elemento
  const duplicateElement = () => {
    if (!selectedElement) return
    const element = elements.find(el => el.id === selectedElement)
    if (!element) return

    const newElement: CanvasElement = {
      ...element,
      id: `element-${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20,
      zIndex: elements.length
    }
    
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
    saveToHistory()
    toast.success('¡Elemento duplicado!')
  }

  // Iniciar modo de recorte
  const startCropMode = () => {
    if (!selectedElement) {
      toast.error('Selecciona un sticker primero')
      return
    }
    
    const element = elements.find(el => el.id === selectedElement)
    if (!element || element.type !== 'sticker') {
      toast.error('Solo se pueden recortar stickers')
      return
    }
    
    setTool('crop')
    // Inicializar área de recorte al tamaño completo del elemento
    setCropArea({
      x: 0,
      y: 0,
      width: element.width,
      height: element.height
    })
    toast.info('Ajusta el área de recorte y presiona Aplicar')
  }

  // Aplicar recorte
  const applyCrop = async () => {
    if (!selectedElement || !cropArea) return
    
    const element = elements.find(el => el.id === selectedElement)
    if (!element || element.type !== 'sticker') return

    try {
      // Crear un canvas temporal para recortar la imagen
      const tempCanvas = document.createElement('canvas')
      const ctx = tempCanvas.getContext('2d')
      if (!ctx) return

      // Cargar la imagen
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = element.data.image_url
      })

      // Calcular las proporciones del recorte
      const scaleX = img.width / element.width
      const scaleY = img.height / element.height

      const cropX = cropArea.x * scaleX
      const cropY = cropArea.y * scaleY
      const cropWidth = cropArea.width * scaleX
      const cropHeight = cropArea.height * scaleY

      // Configurar el canvas con el tamaño del recorte
      tempCanvas.width = cropWidth
      tempCanvas.height = cropHeight

      // Dibujar solo la parte recortada (mantiene transparencia)
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      )

      // Convertir a blob manteniendo transparencia
      const blob = await new Promise<Blob>((resolve) => {
        tempCanvas.toBlob((b) => resolve(b!), 'image/png')
      })

      // Crear URL del blob
      const croppedImageUrl = URL.createObjectURL(blob)

      // Actualizar el elemento con la imagen recortada
      setElements(elements.map(el => {
        if (el.id === selectedElement) {
          return {
            ...el,
            width: cropArea.width,
            height: cropArea.height,
            data: {
              ...el.data,
              image_url: croppedImageUrl,
              originalUrl: el.data.originalUrl || el.data.image_url
            },
            cropArea: undefined
          }
        }
        return el
      }))

      // Resetear estado de recorte
      setTool('select')
      setCropArea(null)
      setCropStart(null)
      setIsCropping(false)
      saveToHistory()

      toast.success('¡Sticker recortado! +10 puntos')
      if (onPointsEarned) {
        onPointsEarned(10, 'Sticker recortado')
      }
    } catch (error) {
      console.error('Error al recortar:', error)
      toast.error('Error al recortar el sticker')
    }
  }

  // Cancelar recorte
  const cancelCrop = () => {
    setTool('select')
    setCropArea(null)
    setCropStart(null)
    setIsCropping(false)
  }

  // Guardar canvas
  const handleSave = async () => {
    const canvasData = {
      elements,
      paintStrokes,
      colorAreas,
      timestamp: new Date().toISOString()
    }
    
    if (onSave) {
      onSave(canvasData)
    }
    
    // Recompensa por guardar
    if (onPointsEarned) {
      onPointsEarned(20, 'Página guardada')
    }
    
    toast.success('¡Página guardada! +20 puntos')
  }

  // Limpiar todo
  const clearCanvas = () => {
    if (confirm('¿Estás segura de que quieres borrar todo?')) {
      setElements([])
      setPaintStrokes([])
      setColorAreas([])
      saveToHistory()
    }
  }

  const selectedEl = elements.find(el => el.id === selectedElement)

  return (
    <div className="space-y-4">
      {/* Barra de herramientas */}
      <Card className="p-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Herramientas */}
          <Button
            size="sm"
            variant={tool === 'select' ? 'default' : 'outline'}
            onClick={() => setTool('select')}
          >
            Seleccionar
          </Button>
          
          <Button
            size="sm"
            variant={tool === 'paint' ? 'default' : 'outline'}
            onClick={() => setTool('paint')}
          >
            <Paintbrush className="h-4 w-4 mr-1" />
            Pintar
          </Button>
          
          <Button
            size="sm"
            variant={tool === 'erase' ? 'default' : 'outline'}
            onClick={() => setTool('erase')}
          >
            <Eraser className="h-4 w-4 mr-1" />
            Borrar
          </Button>
          
          <Button
            size="sm"
            variant={tool === 'colorArea' ? 'default' : 'outline'}
            onClick={() => setTool('colorArea')}
            title="Colorear área seleccionada"
          >
            <Palette className="h-4 w-4 mr-1" />
            Colorear Área
          </Button>
          
          <Button
            size="sm"
            variant={tool === 'crop' ? 'default' : 'outline'}
            onClick={startCropMode}
            title="Recortar sticker seleccionado"
          >
            <Scissors className="h-4 w-4 mr-1" />
            Recortar
          </Button>
          
          <div className="h-8 w-px bg-gray-300 mx-2" />
          
          {/* Paleta de colores - CLARA Y VISIBLE */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Color:</span>
            <div className="flex gap-1">
              {COLORS.map(color => (
                <button
                  key={color.value}
                  onClick={() => setCurrentColor(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    currentColor === color.value 
                      ? 'border-gray-900 scale-110 shadow-md' 
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          
          <div className="h-8 w-px bg-gray-300 mx-2" />
          
          {/* Tamaño de pincel */}
          {(tool === 'paint' || tool === 'erase') && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Tamaño:</span>
              <input
                type="range"
                min="5"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm font-medium">{brushSize}px</span>
            </div>
          )}
          
          <div className="flex-1" />
          
          {/* Acciones */}
          <Button size="sm" variant="outline" onClick={undo} disabled={historyIndex <= 0}>
            <Undo className="h-4 w-4" />
          </Button>
          
          <Button size="sm" variant="outline" onClick={redo} disabled={historyIndex >= history.length - 1}>
            <Redo className="h-4 w-4" />
          </Button>
          
          <Button size="sm" variant="outline" onClick={clearCanvas}>
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <Button size="sm" onClick={handleSave} className="bg-[#B8956A] hover:bg-[#9A7A54]">
            <Save className="h-4 w-4 mr-1" />
            Guardar
          </Button>
        </div>
      </Card>

      {/* Panel de control del elemento seleccionado */}
      {selectedEl && tool === 'select' && (
        <Card className="p-4 bg-gradient-to-r from-[#F5F1E8] to-white border-2 border-[#B8956A]/30">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#B8956A]" />
                Elemento Seleccionado: {selectedEl.data.name || 'Sin nombre'}
              </h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedElement(null)}
                className="h-6 text-xs"
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Opacidad */}
              <div className="space-y-1">
                <label className="text-xs font-medium">Opacidad</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedEl.opacity * 100}
                    onChange={(e) => changeOpacity(Number(e.target.value) / 100)}
                    className="flex-1"
                  />
                  <span className="text-xs w-10 text-right">{Math.round(selectedEl.opacity * 100)}%</span>
                </div>
              </div>

              {/* Rotación */}
              <div className="space-y-1">
                <label className="text-xs font-medium">Rotación</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedEl.rotation}
                    onChange={(e) => {
                      setElements(elements.map(el => 
                        el.id === selectedElement ? { ...el, rotation: Number(e.target.value) } : el
                      ))
                    }}
                    className="flex-1"
                  />
                  <span className="text-xs w-10 text-right">{Math.round(selectedEl.rotation)}°</span>
                </div>
              </div>

              {/* Tamaño */}
              <div className="space-y-1">
                <label className="text-xs font-medium">Tamaño</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="100"
                    max="800"
                    value={selectedEl.width}
                    onChange={(e) => {
                      const newSize = Number(e.target.value)
                      setElements(elements.map(el => 
                        el.id === selectedElement ? { ...el, width: newSize, height: newSize } : el
                      ))
                    }}
                    className="flex-1"
                  />
                  <span className="text-xs w-12 text-right">{Math.round(selectedEl.width)}px</span>
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="flex gap-2 pt-2 border-t">
              <Button size="sm" variant="outline" onClick={duplicateElement} className="text-xs">
                Duplicar
              </Button>
              <Button size="sm" variant="outline" onClick={bringToFront} className="text-xs">
                Al frente
              </Button>
              <Button size="sm" variant="outline" onClick={sendToBack} className="text-xs">
                Atrás
              </Button>
              <Button size="sm" variant="destructive" onClick={() => deleteElement(selectedEl.id)} className="text-xs ml-auto">
                <Trash2 className="h-3 w-3 mr-1" />
                Eliminar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Panel de control de recorte */}
      {tool === 'crop' && selectedElement && (
        <Card className="p-4 bg-gradient-to-r from-[#FFE5CC] to-white border-2 border-[#E07856]/30">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Scissors className="h-4 w-4 text-[#E07856]" />
                Modo Recorte
              </h4>
            </div>

            <p className="text-xs text-gray-600">
              Arrastra sobre el sticker para definir el área de recorte. Los fondos transparentes se mantendrán.
            </p>

            {cropArea && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                Área: {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-2 pt-2 border-t">
              <Button 
                size="sm" 
                onClick={applyCrop}
                className="flex-1 bg-[#E07856] hover:bg-[#C86644]"
                disabled={!cropArea || cropArea.width < 10 || cropArea.height < 10}
              >
                Aplicar Recorte
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={cancelCrop}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Canvas estilo página de diario - Tamaño reducido para libro */}
      <div className="relative overflow-hidden rounded-lg">
        <div
          ref={canvasRef}
          className={`relative w-full h-[480px] overflow-hidden ${
            tool === 'paint' ? 'cursor-crosshair' : 
            tool === 'erase' ? 'cursor-cell' : 
            tool === 'colorArea' ? 'cursor-copy' :
            tool === 'crop' ? 'cursor-crosshair' :
            'cursor-default'
          }`}
          style={{
            backgroundColor: 'transparent',
            backgroundImage: `
              linear-gradient(90deg, rgba(184,149,106,0.01) 1px, transparent 1px),
              linear-gradient(rgba(184,149,106,0.01) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px, 30px 30px'
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onMouseDown={startPainting}
          onMouseMove={(e) => {
            paint(e)
            handleElementManipulation(e)
          }}
          onMouseUp={(e) => {
            stopPainting(e)
            stopManipulation()
          }}
          onMouseLeave={(e) => {
            stopPainting(e)
            stopManipulation()
          }}
        >
          {/* Áreas coloreadas */}
          {colorAreas.map((area, index) => (
            <div
              key={`area-${index}`}
              className="absolute pointer-events-none"
              style={{
                left: area.x,
                top: area.y,
                width: area.width,
                height: area.height,
                backgroundColor: area.color,
                opacity: 0.6
              }}
            />
          ))}
          
          {/* Canvas de pintura */}
          <canvas
            ref={paintCanvasRef}
            width={560}
            height={480}
            className="absolute inset-0 pointer-events-none w-full h-full"
          />
          
          {/* Elementos (stickers, textos, imágenes) */}
          {elements.map(element => (
            <div
              key={element.id}
              className={`absolute ${tool === 'select' ? 'cursor-move' : 'pointer-events-none'} ${
                selectedElement === element.id ? 'ring-2 ring-[#B8956A] shadow-lg' : ''
              }`}
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                transform: `rotate(${element.rotation}deg)`,
                opacity: element.opacity,
                zIndex: element.zIndex,
                transition: isDragging || isResizing || isRotating ? 'none' : 'all 0.1s ease'
              }}
              onMouseDown={(e) => {
                if (tool === 'select') {
                  setSelectedElement(element.id)
                  startDragging(e, element.id)
                } else if (tool === 'crop') {
                  e.stopPropagation()
                  // En modo crop solo permitimos seleccionar, no arrastrar
                }
              }}
              onClick={(e) => {
                if (tool === 'select') {
                  e.stopPropagation()
                  setSelectedElement(element.id)
                } else if (tool === 'crop') {
                  e.stopPropagation()
                }
              }}
            >
              {element.type === 'sticker' && (
                <>
                  <img
                    src={element.data.image_url}
                    alt={element.data.name || 'Sticker'}
                    className="w-full h-full object-contain pointer-events-none select-none"
                    draggable={false}
                    style={{
                      filter: `drop-shadow(0 2px 4px rgba(0,0,0,${element.opacity * 0.2}))`,
                      backgroundColor: 'transparent',
                      mixBlendMode: 'normal',
                      imageRendering: 'auto',
                      WebkitFontSmoothing: 'antialiased',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)'
                    }}
                  />
                  
                  {/* Overlay de recorte */}
                  {tool === 'crop' && selectedElement === element.id && cropArea && (
                    <>
                      {/* Oscurecer áreas no recortadas */}
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Top */}
                        <div 
                          className="absolute left-0 right-0 bg-black/40"
                          style={{
                            top: 0,
                            height: cropArea.y
                          }}
                        />
                        {/* Bottom */}
                        <div 
                          className="absolute left-0 right-0 bg-black/40"
                          style={{
                            top: cropArea.y + cropArea.height,
                            bottom: 0
                          }}
                        />
                        {/* Left */}
                        <div 
                          className="absolute top-0 bottom-0 bg-black/40"
                          style={{
                            left: 0,
                            width: cropArea.x
                          }}
                        />
                        {/* Right */}
                        <div 
                          className="absolute top-0 bottom-0 bg-black/40"
                          style={{
                            left: cropArea.x + cropArea.width,
                            right: 0
                          }}
                        />
                      </div>
                      
                      {/* Marco de recorte */}
                      <div
                        className="absolute border-2 border-[#E07856] pointer-events-none"
                        style={{
                          left: cropArea.x,
                          top: cropArea.y,
                          width: cropArea.width,
                          height: cropArea.height,
                          boxShadow: '0 0 0 9999px rgba(0,0,0,0.3)'
                        }}
                      >
                        {/* Esquinas del marco */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#E07856] rounded-full" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#E07856] rounded-full" />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#E07856] rounded-full" />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#E07856] rounded-full" />
                      </div>
                    </>
                  )}
                </>
              )}
              
              {element.type === 'text' && (
                <div
                  className="w-full h-full flex items-center justify-center text-center font-serif pointer-events-none select-none"
                  style={{
                    fontSize: element.data.fontSize || 20,
                    color: element.data.color || '#000'
                  }}
                >
                  {element.data.text}
                </div>
              )}
              
              {/* Controles visuales cuando está seleccionado */}
              {selectedElement === element.id && tool === 'select' && (
                <>
                  {/* Handle de resize (esquina inferior derecha) */}
                  <div
                    className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#B8956A] rounded-full cursor-nwse-resize flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      startResizing(e, element.id)
                    }}
                  >
                    <span className="text-white text-xs">⇲</span>
                  </div>
                  
                  {/* Handle de rotación (esquina superior derecha) */}
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#E07856] rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      startRotating(e, element.id)
                    }}
                  >
                    <span className="text-white text-xs">↻</span>
                  </div>
                </>
              )}
            </div>
          ))}
          
          {/* Guía visual de canvas vacío */}
          {elements.length === 0 && paintStrokes.length === 0 && colorAreas.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-400 max-w-md px-4">
                <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Tu Lienzo Creativo</p>
                <p className="text-sm mb-3">Arrastra pegatinas artísticas desde la biblioteca</p>
                <div className="text-xs space-y-1 opacity-75">
                  <p>• Rota, escala y superpone elementos libremente</p>
                  <p>• Pinta con colores cálidos y texturas</p>
                  <p>• Crea composiciones únicas como en tu diario físico</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Contador de acciones */}
      <div className="text-center text-sm text-gray-500">
        <Sparkles className="h-4 w-4 inline mr-1" />
        {actionsCount} acciones realizadas
      </div>
    </div>
  )
}
