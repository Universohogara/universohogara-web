
'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import AdvancedCanvas from '@/components/scrapbook/advanced-canvas'
import StickerLibrary from '@/components/scrapbook/sticker-library'
import RewardsDisplay from '@/components/scrapbook/rewards-display'
import SecretPocket from '@/components/scrapbook/secret-pocket'
import { toast } from 'sonner'

export default function EditScrapbookPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [page, setPage] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [userStats, setUserStats] = useState({
    points: 0,
    level: 1,
    experience: 0
  })
  const [achievements, setAchievements] = useState([])
  const [secretNotes, setSecretNotes] = useState('')

  useEffect(() => {
    loadPage()
    loadUserStats()
    loadAchievements()
  }, [])

  const loadPage = async () => {
    try {
      const res = await fetch(`/api/scrapbook/pages/${resolvedParams.id}`)
      const data = await res.json()
      
      if (data.page) {
        setPage(data.page)
        setTitle(data.page.title || '')
        setDescription(data.page.description || '')
        // Cargar notas secretas si existen
        if (data.page.canvas_data && typeof data.page.canvas_data === 'string') {
          try {
            const parsedData = JSON.parse(data.page.canvas_data)
            setSecretNotes(parsedData.secretNotes || '')
          } catch (e) {
            // Si falla el parse, ignorar
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar página:', error)
      toast.error('Error al cargar la página')
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleSave = async (canvasData: any) => {
    try {
      const res = await fetch(`/api/scrapbook/pages/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          canvas_data: canvasData
        })
      })

      const result = await res.json()

      if (result.page) {
        toast.success('¡Cambios guardados!')
      } else {
        throw new Error('Error al guardar')
      }
    } catch (error) {
      console.error('Error al guardar:', error)
      toast.error('Error al guardar los cambios')
    }
  }

  const handleSaveSecretNotes = async (notes: string) => {
    try {
      // Obtener canvas data actual
      let currentCanvasData: any = {}
      
      if (page.canvas_data && typeof page.canvas_data === 'string') {
        try {
          currentCanvasData = JSON.parse(page.canvas_data)
        } catch (e) {
          // Si falla, usar objeto vacío
        }
      }

      // Agregar las notas secretas
      currentCanvasData.secretNotes = notes

      const res = await fetch(`/api/scrapbook/pages/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          canvas_data: JSON.stringify(currentCanvasData)
        })
      })

      const result = await res.json()

      if (result.page) {
        setSecretNotes(notes)
      } else {
        throw new Error('Error al guardar')
      }
    } catch (error) {
      console.error('Error al guardar notas secretas:', error)
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8956A]"></div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <p className="text-lg mb-4">Página no encontrada</p>
          <Button onClick={() => router.push('/premium/scrapbook')}>
            Volver al Scrapbook
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push('/premium/scrapbook')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-serif text-[#1a1a1a]">
            Editar Página
          </h1>
          <div className="w-24" />
        </div>

        {/* Info */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Título</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de tu página..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Descripción</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe tu creación..."
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-3 space-y-4">
            <AdvancedCanvas
              pageId={resolvedParams.id}
              initialData={page.canvas_data}
              onSave={handleSave}
              onPointsEarned={handlePointsEarned}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <RewardsDisplay
              points={userStats.points}
              level={userStats.level}
              experience={userStats.experience}
              recentAchievements={achievements}
            />

            <SecretPocket
              pageId={resolvedParams.id}
              initialNotes={secretNotes}
              onSave={handleSaveSecretNotes}
            />

            <StickerLibrary
              userPoints={userStats.points}
              onPointsUpdate={loadUserStats}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
