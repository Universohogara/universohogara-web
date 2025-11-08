
'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Heart, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Recommendation {
  type: string
  title: string
  description: string
  action: {
    label: string
    link: string
  }
  priority: 'high' | 'medium' | 'low'
}

interface WeeklySummary {
  period: {
    start: string
    end: string
  }
  summary: {
    totalMessages: number
    activeDays: number
    dominantEmotion: string
    emotionBreakdown: Record<string, number>
    riskMessages: number
    improvement: boolean
  }
  recommendations: Recommendation[]
  message: string
}

interface WeeklySummaryProps {
  open: boolean
  onClose: () => void
}

export function WeeklySummary({ open, onClose }: WeeklySummaryProps) {
  const [summary, setSummary] = useState<WeeklySummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      fetchWeeklySummary()
    }
  }, [open])

  const fetchWeeklySummary = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/chat-emocional/weekly-summary')
      const data = await res.json()
      setSummary(data)
    } catch (error) {
      console.error('Error al cargar resumen semanal:', error)
    } finally {
      setLoading(false)
    }
  }

  const emotionEmojis: Record<string, string> = {
    tristeza: '💙',
    ansiedad: '🌊',
    soledad: '🤗',
    ira: '🔥',
    esperanza: '✨',
    gratitud: '🌟',
    neutral: '🌙'
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-blue-100 text-blue-800 border-blue-300'
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-3xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!summary) return null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-3xl">
            <Sparkles className="h-8 w-8 text-purple-600" />
            Resumen de tu semana
          </DialogTitle>
          <DialogDescription>
            Del {new Date(summary.period.start).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} al {new Date(summary.period.end).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Summary Message */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="text-4xl">
                {emotionEmojis[summary.summary.dominantEmotion] || '🌙'}
              </div>
              <div className="flex-1">
                <p className="text-lg text-gray-800 leading-relaxed">
                  {summary.message}
                </p>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {summary.summary.totalMessages}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Mensajes esta semana
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-pink-600">
                {summary.summary.activeDays}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Días activos
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                {summary.summary.improvement ? (
                  <>
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">↑</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-6 w-6 text-gray-400" />
                    <span className="text-2xl font-bold text-gray-400">→</span>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {summary.summary.improvement ? 'Mayor actividad' : 'Actividad similar'}
              </div>
            </Card>
          </div>

          {/* Emotion Breakdown */}
          {Object.keys(summary.summary.emotionBreakdown).length > 0 && (
            <Card className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                Emociones identificadas
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(summary.summary.emotionBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([emotion, count]) => (
                    <Badge
                      key={emotion}
                      variant="outline"
                      className="px-3 py-1 text-sm"
                    >
                      {emotionEmojis[emotion]} {emotion}: {count}
                    </Badge>
                  ))}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          {summary.recommendations.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Recomendaciones personalizadas para ti
              </h4>
              {summary.recommendations.map((rec, index) => (
                <Card
                  key={index}
                  className={`p-5 border-2 ${priorityColors[rec.priority]}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h5 className="font-semibold text-lg mb-1">
                        {rec.title}
                      </h5>
                      <p className="text-sm opacity-90 mb-3">
                        {rec.description}
                      </p>
                      <Link href={rec.action.link}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-current hover:bg-current/10"
                          onClick={onClose}
                        >
                          {rec.action.label}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={onClose}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Entendido
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
