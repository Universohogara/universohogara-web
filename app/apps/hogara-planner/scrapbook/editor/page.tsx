
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react'
import AdvancedCanvas from '@/components/scrapbook/advanced-canvas'
import StickerLibrary from '@/components/scrapbook/sticker-library'
import RewardsDisplay from '@/components/scrapbook/rewards-display'
import SecretPocket from '@/components/scrapbook/secret-pocket'
import DiaryPageBook from '@/components/scrapbook/diary-page-book'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

export default function ScrapbookEditorPage() {
  const router = useRouter()
  const { data: session } = useSession() || {}
  const [title, setTitle] = useState('Mi Nueva Página')
  const [description, setDescription] = useState('')
  const [canvasData, setCanvasData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [secretNotes, setSecretNotes] = useState('')
  const [pageId, setPageId] = useState<string | null>(null)
  const [userStats, setUserStats] = useState({
    points: 0,
    level: 1,
    experience: 0
  })
  const [achievements, setAchievements] = useState([])
  const [showMagicAnimation, setShowMagicAnimation] = useState(true)

  useEffect(() => {
    loadUserStats()
    loadAchievements()
    // Ocultar animación después de 2 segundos
    setTimeout(() => setShowMagicAnimation(false), 2000)
  }, [])

  const loadUserStats = async () => {
    try {
      const res = await fetch('/api/user/stats')
      const data = await res.json()
      if (data.stats) {
        setUserStats({
          points: data.stats.points || 0,
          level: data.stats.level || 1,
          experience: data.stats.experience || 0
        })
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  const loadAchievements = async () => {
    try {
      const res = await fetch('/api/gamification/achievements')
      const data = await res.json()
      if (data.achievements) {
        setAchievements(data.achievements)
      }
    } catch (error) {
      console.error('Error al cargar logros:', error)
    }
  }

  const handlePointsEarned = async (points: number, reason: string) => {
    try {
      const res = await fetch('/api/gamification/award', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points, reason })
      })

      const data = await res.json()
      
      if (data.success) {
        setUserStats({
          points: data.newPoints,
          level: data.newLevel,
          experience: data.newExperience
        })
        
        if (data.newAchievements && data.newAchievements.length > 0) {
          loadAchievements()
        }
      }
    } catch (error) {
      console.error('Error al otorgar puntos:', error)
    }
  }

  const handleSaveSecretNotes = async (notes: string) => {
    if (!pageId) {
      toast.error('Guarda la página primero antes de agregar notas secretas')
      return
    }
    
    try {
      const res = await fetch(`/api/scrapbook/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret_notes: notes
        })
      })

      if (res.ok) {
        setSecretNotes(notes)
      }
    } catch (error) {
      console.error('Error al guardar notas secretas:', error)
      throw error
    }
  }

  const handleSave = async (data: any) => {
    setIsSaving(true)
    setCanvasData(data)

    try {
      const res = await fetch('/api/scrapbook/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          canvas_data: data,
          secret_notes: secretNotes
        })
      })

      const result = await res.json()

      if (result.page) {
        setPageId(result.page.id)
        toast.success('¡Página guardada exitosamente!')
        
        setTimeout(() => {
          router.push('/premium/scrapbook')
        }, 1500)
      } else {
        throw new Error('Error al guardar')
      }
    } catch (error) {
      console.error('Error al guardar página:', error)
      toast.error('Error al guardar la página')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 relative overflow-hidden">
      {/* Animación mágica de entrada */}
      {showMagicAnimation && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600/80 to-pink-600/80 backdrop-blur-sm pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: [0, 1.2, 1], rotate: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <BookOpen className="w-24 h-24 text-amber-300" strokeWidth={1.5} />
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-24 h-24 text-yellow-300" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      <div className="py-8 px-4">
        {/* Header compacto */}
        <div className="max-w-[1400px] mx-auto mb-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push('/premium/scrapbook')}
              className="hover:bg-amber-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Scrapbook
            </Button>
            
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-amber-700" />
              <h1 className="text-2xl font-serif text-amber-900">
                Editor de Página
              </h1>
            </div>

            <div className="w-32" />
          </div>
        </div>

        {/* Contenedor principal - Diseño de libro abierto */}
        <div className="max-w-[1400px] mx-auto">
          <div className="flex gap-8 items-start">
            {/* PÁGINA IZQUIERDA: Biblioteca de Stickers */}
            <div className="flex-shrink-0">
              <DiaryPageBook isLeftPage={true} pageNumber={1}>
                <div className="h-full overflow-hidden">
                  <h3 className="text-xl font-serif text-amber-900 mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    Stickers Mágicos
                  </h3>
                  <p className="text-xs text-amber-700/70 mb-4 italic">
                    Arrastra los stickers a tu página →
                  </p>
                  <div className="h-[calc(100%-80px)] overflow-auto pr-2 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-100">
                    <StickerLibrary
                      userPoints={userStats.points}
                      onPointsUpdate={loadUserStats}
                    />
                  </div>
                </div>
              </DiaryPageBook>
            </div>

            {/* PÁGINA DERECHA: Canvas de edición */}
            <div className="flex-shrink-0">
              <DiaryPageBook isLeftPage={false} pageNumber={2}>
                <div className="h-full flex flex-col">
                  {/* Título y descripción - Compactos */}
                  <div className="mb-4 space-y-2">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Título de tu página..."
                      className="bg-white/50 border-amber-200 text-amber-900 placeholder:text-amber-400 font-serif"
                    />
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descripción breve..."
                      className="bg-white/50 border-amber-200 text-amber-900 placeholder:text-amber-400 text-sm"
                    />
                  </div>

                  {/* Recompensas - Compactas */}
                  <div className="mb-3">
                    <RewardsDisplay
                      points={userStats.points}
                      level={userStats.level}
                      experience={userStats.experience}
                      recentAchievements={achievements}
                    />
                  </div>

                  {/* Canvas - Área principal */}
                  <div className="flex-1 min-h-0">
                    <AdvancedCanvas
                      onSave={handleSave}
                      onPointsEarned={handlePointsEarned}
                    />
                  </div>

                  {/* Bolsillo Secreto - Compacto */}
                  <div className="mt-3">
                    <SecretPocket
                      pageId={pageId || 'temp'}
                      initialNotes={secretNotes}
                      onSave={handleSaveSecretNotes}
                    />
                  </div>
                </div>
              </DiaryPageBook>
            </div>
          </div>

          {/* Tips en la parte inferior */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 max-w-[1200px] mx-auto"
          >
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-purple-900">
                    💡 Consejos rápidos:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-gray-600">
                    <div>• Stickers: +5 pts</div>
                    <div>• Pintar: +3 pts</div>
                    <div>• Colorear: +8 pts</div>
                    <div>• Guardar: +20 pts</div>
                    <div>• Recortar: +10 pts</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
