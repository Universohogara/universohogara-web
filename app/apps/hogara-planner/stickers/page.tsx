
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Lock, ShoppingBag, Heart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Sticker {
  id: string
  name: string
  image_url: string
  category: string
  is_premium: boolean
  price_points: number
  price_eur: number | null
  unlocked: boolean
}

export default function StickersPage() {
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [userPoints, setUserPoints] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { toast } = useToast()

  useEffect(() => {
    loadStickers()
  }, [])

  const loadStickers = async () => {
    try {
      const res = await fetch('/api/stickers')
      const data = await res.json()
      setStickers(data.stickers)
      setUserPoints(data.userPoints)
    } catch (error) {
      console.error('Error al cargar stickers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnlock = async (stickerId: string, pricePoints: number) => {
    if (userPoints < pricePoints) {
      toast({
        title: 'Puntos insuficientes',
        description: 'No tienes suficientes puntos para desbloquear este sticker.',
        variant: 'destructive'
      })
      return
    }

    try {
      const res = await fetch('/api/stickers/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stickerId, method: 'points' })
      })

      if (res.ok) {
        toast({
          title: '¡Sticker desbloqueado!',
          description: `Has desbloqueado un nuevo sticker. -${pricePoints} puntos`,
        })
        loadStickers()
      } else {
        throw new Error('Error al desbloquear')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'No se pudo desbloquear el sticker',
        variant: 'destructive'
      })
    }
  }

  const categories = ['all', 'emociones', 'naturaleza', 'celestial', 'frases']

  const filteredStickers = selectedCategory === 'all' 
    ? stickers 
    : stickers.filter(s => s.category === selectedCategory)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8956A]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-pink-400" />
            <h1 className="text-4xl font-serif text-[#1a1a1a]">Tienda de Stickers</h1>
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            Desbloquea stickers con tus puntos para decorar tus páginas de scrapbooking
          </p>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-3 rounded-full">
            <Sparkles className="h-5 w-5 text-yellow-600" />
            <span className="font-bold text-lg text-yellow-700">{userPoints} puntos</span>
          </div>
        </div>

        {/* Categorías */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat === 'all' ? 'Todos' : cat}
            </Button>
          ))}
        </div>

        {/* Grid de Stickers */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredStickers.map(sticker => (
            <Card 
              key={sticker.id}
              className={`p-4 text-center transition-all ${
                sticker.unlocked 
                  ? 'bg-gradient-to-br from-green-50 to-white border-green-200' 
                  : sticker.is_premium 
                  ? 'bg-gradient-to-br from-purple-50 to-white border-purple-200'
                  : 'bg-white'
              }`}
            >
              <div className="relative w-full aspect-square mb-3 bg-gradient-to-br from-gray-50 to-white rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={sticker.image_url}
                  alt={sticker.name}
                  className="w-full h-full object-contain p-2 transition-transform hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback si la imagen no carga
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement!.innerHTML = '<div class="text-5xl">❓</div>'
                  }}
                />
              </div>
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{sticker.name}</h3>
              <Badge variant="outline" className="text-xs mb-3 capitalize">
                {sticker.category}
              </Badge>

              {sticker.unlocked ? (
                <div className="flex items-center justify-center gap-1 text-green-600 text-sm font-semibold">
                  <Heart className="h-4 w-4" fill="currentColor" />
                  Desbloqueado
                </div>
              ) : sticker.is_premium ? (
                <Button
                  size="sm"
                  onClick={() => handleUnlock(sticker.id, sticker.price_points)}
                  className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500"
                  disabled={userPoints < sticker.price_points}
                >
                  {userPoints < sticker.price_points && <Lock className="h-3 w-3 mr-1" />}
                  {sticker.price_points} pts
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleUnlock(sticker.id, 0)}
                  variant="outline"
                  className="w-full"
                >
                  Gratis
                </Button>
              )}
            </Card>
          ))}
        </div>

        {filteredStickers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay stickers en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  )
}
