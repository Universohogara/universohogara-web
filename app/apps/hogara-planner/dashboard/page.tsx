
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  BookHeart,
  Music,
  Sparkles,
  Trophy,
  Target,
  Sticker,
  FileText,
  Crown,
  Settings,
  BarChart3,
  Calendar
} from "lucide-react"

export default function HogaraPlannerDashboard() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const [userStatus, setUserStatus] = useState({
    hasBasePlan: false,
    magicalCompanionsActive: false
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?redirect=/apps/hogara-planner/dashboard')
    }
  }, [status, router])

  useEffect(() => {
    const loadUserStatus = async () => {
      if (!session?.user) return

      try {
        const res = await fetch('/api/user/subscription-status')
        if (res.ok) {
          const data = await res.json()
          setUserStatus(data)
        }
      } catch (error) {
        console.error('Error cargando estado:', error)
      }
    }

    if (status === 'authenticated') {
      loadUserStatus()
    }
  }, [status, session?.user])

  const features = [
    {
      title: 'Acompañante Mágico',
      description: 'Chat con tu companion emocional personalizado',
      icon: MessageCircle,
      url: '/apps/hogara-planner/acompanante',
      color: 'from-purple-500 to-pink-500',
      premium: true,
      available: userStatus.magicalCompanionsActive
    },
    {
      title: 'Desahogo Emocional',
      description: 'Espacio seguro para expresar tus emociones',
      icon: MessageCircle,
      url: '/apps/hogara-planner/desahogo',
      color: 'from-blue-500 to-cyan-500',
      premium: false,
      available: true
    },
    {
      title: 'Scrapbook Mágico',
      description: 'Crea páginas únicas con stickers y diseños',
      icon: BookHeart,
      url: '/apps/hogara-planner/scrapbook',
      color: 'from-pink-500 to-rose-500',
      premium: true,
      available: userStatus.hasBasePlan
    },
    {
      title: 'Diarios 3D',
      description: 'Diarios interactivos con efecto libro real',
      icon: BookHeart,
      url: '/apps/hogara-planner/diarios-3d',
      color: 'from-amber-500 to-orange-500',
      premium: true,
      available: userStatus.hasBasePlan
    },
    {
      title: 'Stickers Premium',
      description: 'Colección exclusiva de stickers mágicos',
      icon: Sticker,
      url: '/apps/hogara-planner/stickers',
      color: 'from-green-500 to-emerald-500',
      premium: true,
      available: userStatus.hasBasePlan
    },
    {
      title: 'Plantillas',
      description: 'Plantillas descargables para tu planificación',
      icon: FileText,
      url: '/apps/hogara-planner/plantillas',
      color: 'from-indigo-500 to-purple-500',
      premium: true,
      available: userStatus.hasBasePlan
    },
    {
      title: 'Música Ambiente',
      description: 'Música relajante para tus momentos de escritura',
      icon: Music,
      url: '/apps/hogara-planner/musica',
      color: 'from-violet-500 to-purple-500',
      premium: true,
      available: userStatus.hasBasePlan
    },
    {
      title: 'Gamificación',
      description: 'Logros, niveles y recompensas por tu progreso',
      icon: Trophy,
      url: '/apps/hogara-planner/gamificacion',
      color: 'from-yellow-500 to-amber-500',
      premium: false,
      available: true
    },
    {
      title: 'Retos Diarios',
      description: 'Desafíos para crecer cada día',
      icon: Target,
      url: '/apps/hogara-planner/retos',
      color: 'from-red-500 to-pink-500',
      premium: false,
      available: true
    },
    {
      title: 'Estadísticas',
      description: 'Visualiza tu progreso y evolución',
      icon: BarChart3,
      url: '/apps/hogara-planner/estadisticas',
      color: 'from-teal-500 to-cyan-500',
      premium: false,
      available: true
    },
    {
      title: 'Configuración de Voz',
      description: 'Personaliza las voces de tus companions',
      icon: Settings,
      url: '/apps/hogara-planner/configuracion-voz',
      color: 'from-slate-500 to-gray-500',
      premium: true,
      available: userStatus.magicalCompanionsActive
    }
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
        <div className="text-white text-2xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Hogara Planner</h1>
              <p className="text-purple-200">Panel de Funciones</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/apps/hogara-app')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                ← Mundos
              </Button>
              {!userStatus.hasBasePlan && (
                <Button
                  onClick={() => router.push('/apps/hogara-planner')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Ver Planes
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Todas tus Herramientas Mágicas</h2>
          <p className="text-purple-200 text-lg">
            Bienvenida, {session?.user?.name || 'Viajera'} ✨
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon
            const isLocked = feature.premium && !feature.available

            return (
              <Card
                key={feature.title}
                className={`bg-white/10 backdrop-blur-sm border-white/20 transition-all duration-300 ${
                  isLocked ? 'opacity-60' : 'hover:bg-white/15 cursor-pointer hover:scale-105'
                }`}
                onClick={() => !isLocked && router.push(feature.url)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {feature.premium && (
                      <Badge variant={isLocked ? 'secondary' : 'default'} className={isLocked ? 'bg-gray-500' : 'bg-purple-500'}>
                        {isLocked ? <Crown className="w-3 h-3" /> : '✓'}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-purple-100">
                    {feature.description}
                  </CardDescription>
                  {isLocked && (
                    <p className="text-yellow-300 text-sm mt-2">
                      🔒 Requiere plan premium
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
