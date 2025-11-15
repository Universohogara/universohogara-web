
'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Lock, Star, Search, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface Sticker {
  id: string
  name: string
  image_url: string
  category: string
  is_premium: boolean
  price_points: number
  unlocked: boolean
}

interface StickerLibraryProps {
  onStickerSelect?: (sticker: Sticker) => void
  userPoints?: number
  onPointsUpdate?: () => void
}

export default function StickerLibrary({
  onStickerSelect,
  userPoints = 0,
  onPointsUpdate
}: StickerLibraryProps) {
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    loadStickers()
  }, [])

  const loadStickers = async () => {
    try {
      const res = await fetch('/api/stickers')
      const data = await res.json()
      setStickers(data.stickers || [])
      
      // Extraer categorías únicas
      const uniqueCategories = Array.from(
        new Set(data.stickers.map((s: Sticker) => s.category))
      ) as string[]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error al cargar stickers:', error)
      toast.error('Error al cargar la biblioteca de stickers')
    } finally {
      setIsLoading(false)
    }
  }

  const unlockSticker = async (sticker: Sticker) => {
    if (sticker.price_points > userPoints) {
      toast.error(`Necesitas ${sticker.price_points - userPoints} puntos más`)
      return
    }

    try {
      const res = await fetch('/api/stickers/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stickerId: sticker.id })
      })

      const data = await res.json()

      if (data.success) {
        toast.success(`¡Sticker "${sticker.name}" desbloqueado!`, {
          icon: '✨'
        })
        loadStickers()
        if (onPointsUpdate) onPointsUpdate()
      } else {
        toast.error(data.error || 'Error al desbloquear sticker')
      }
    } catch (error) {
      console.error('Error al desbloquear sticker:', error)
      toast.error('Error al desbloquear sticker')
    }
  }

  const handleDragStart = (e: React.DragEvent, sticker: Sticker) => {
    if (!sticker.unlocked) {
      e.preventDefault()
      toast.error('Debes desbloquear este sticker primero')
      return
    }

    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type: 'sticker', data: sticker })
    )
  }

  const filteredStickers = stickers.filter(sticker => {
    const matchesCategory = selectedCategory === 'all' || sticker.category === selectedCategory
    const matchesSearch = sticker.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8956A]"></div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {/* Header compacto */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-amber-700">
          Puntos: <span className="font-bold text-amber-900">{userPoints}</span>
        </p>
      </div>

      {/* Búsqueda compacta */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
        <Input
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-7 h-8 text-xs bg-white/70 border-amber-200"
        />
      </div>

      {/* Filtros de categoría - compactos */}
      <div className="flex gap-1 flex-wrap">
        <Button
          size="sm"
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          className={`h-6 text-xs px-2 ${selectedCategory === 'all' ? 'bg-amber-600' : ''}`}
        >
          Todos
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            size="sm"
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className={`h-6 text-xs px-2 ${selectedCategory === category ? 'bg-amber-600' : ''}`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Grid de stickers - Compacto para libro */}
      <div 
        className="grid grid-cols-3 gap-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent"
        style={{ 
          maxHeight: '600px',
          scrollBehavior: 'smooth'
        }}
      >
        {filteredStickers.map(sticker => (
          <div
            key={sticker.id}
            className={`relative group ${
              sticker.unlocked 
                ? 'cursor-grab active:cursor-grabbing' 
                : 'cursor-not-allowed opacity-50'
            }`}
            draggable={sticker.unlocked}
            onDragStart={(e) => handleDragStart(e, sticker)}
          >
            <div className="p-2 hover:shadow-lg transition-all hover:ring-1 hover:ring-amber-400 hover:-translate-y-0.5 bg-white/80 backdrop-blur rounded-lg border border-amber-100">
              <div className="aspect-square relative rounded flex items-center justify-center overflow-visible group">
                <img
                  src={sticker.image_url}
                  alt={sticker.name}
                  className="w-full h-full object-contain transition-transform group-hover:scale-110"
                  draggable={false}
                  loading="lazy"
                  style={{
                    backgroundColor: 'transparent',
                    mixBlendMode: 'normal',
                    imageRendering: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                />
                
                {!sticker.unlocked && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white drop-shadow-md" />
                  </div>
                )}
                
                {sticker.is_premium && (
                  <Badge className="absolute top-0.5 right-0.5 bg-amber-600 text-white text-[8px] px-1 py-0">
                    <Star className="h-2 w-2 mr-0.5" />
                    ✨
                  </Badge>
                )}
              </div>
              
              <p className="text-[10px] text-center mt-1 truncate font-medium text-amber-900">{sticker.name}</p>
              
              {!sticker.unlocked && (
                <Button
                  size="sm"
                  className="w-full mt-1 text-[9px] h-5 bg-amber-600 hover:bg-amber-700 px-1"
                  onClick={() => unlockSticker(sticker)}
                >
                  {sticker.price_points} pts
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredStickers.length === 0 && (
        <div className="text-center py-6 text-gray-400">
          <p className="text-xs">No se encontraron stickers</p>
        </div>
      )}
    </div>
  )
}
