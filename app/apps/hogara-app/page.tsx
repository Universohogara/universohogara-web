
'use client'

import { useRouter } from 'next/navigation'
import { Crown, Home, Sparkles, Brain, Heart, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function HogaraAppPage() {
  const router = useRouter()

  const worlds = [
    {
      id: 1,
      name: 'Hogara Planner',
      description: 'Organiza tu vida con alma. Tu refugio para planificar con calma, conectar contigo y crear tu propio ritmo.',
      icon: Crown,
      status: 'activo',
      badge: 'Entrar al planeta',
      url: '/apps/hogara-planner',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 2,
      name: 'Hogara Home',
      description: 'Forjado con hierro y alma. Un universo dedicado a la decoración artesanal, al diseño con historia.',
      icon: Home,
      status: 'en creación',
      badge: 'En taller',
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 3,
      name: 'Hogara Pet',
      description: 'Dónde el amor animal encuentra su lugar. Un espacio para los que sienten que los peludos también son FAMILIA.',
      icon: Heart,
      status: 'en desarrollo',
      badge: 'Próximamente',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      name: 'Hogara Mind',
      description: 'Equilibrio para tu mente y emociones. Un universo dedicado a la psicología emocional, el mindfulness y el autoconocimiento.',
      icon: Brain,
      status: 'en expansión',
      badge: 'En meditación',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 5,
      name: 'Hogara Esencia',
      description: 'Cuerpo, mente y ritual. Rituales de autocuidado, belleza consciente, y energía femenina para reconectar con tu esencia.',
      icon: Sparkles,
      status: 'en manifestación',
      badge: 'Desarrollando su energía',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 6,
      name: 'Hogara Luz',
      description: 'La energía que guía tu alma. Un espacio sagrado, donde la intuición, el tarot, reiki, la sanación angelical y muchas más terapias holísticas.',
      icon: Zap,
      status: 'en manifestación',
      badge: 'Despertando su luz',
      color: 'from-yellow-500 to-amber-500'
    }
  ]

  const handleWorldClick = (world: typeof worlds[0]) => {
    if (world.status === 'activo') {
      router.push(world.url!)
    } else {
      alert(`${world.name} está ${world.status}. ¡Pronto estará disponible! ✨`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Universo Hogara</h1>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              ← Volver
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Los Mundos de Hogara</h2>
          <p className="text-purple-200 text-lg">Explora cada universo y descubre su magia ✨</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {worlds.map((world) => {
            const Icon = world.icon
            return (
              <Card
                key={world.id}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => handleWorldClick(world)}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${world.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white">{world.name}</CardTitle>
                  <Badge
                    variant={world.status === 'activo' ? 'default' : 'secondary'}
                    className={world.status === 'activo' ? 'bg-green-500' : 'bg-gray-500'}
                  >
                    {world.badge}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-purple-100">
                    {world.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Partículas decorativas */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}
