

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Sparkles, 
  BookHeart, 
  Palette, 
  Trophy, 
  Music, 
  MessageCircle,
  Sticker,
  TrendingUp,
  Calendar,
  Heart,
  Star,
  ArrowRight,
  Crown,
  Zap,
  Gift,
  Target,
  Activity,
  Speaker
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface DashboardData {
  user: {
    name: string
    email: string
    points: number
    level: number
    experience: number
    experienceForNextLevel: number
    experienceProgress: number
  }
  statistics: {
    total_journal_entries: number
    total_templates_completed: number
    total_challenges_completed: number
    active_days: number
    streak_days: number
  }
  recentAchievements: Array<{
    id: string
    name: string
    icon: string
    unlocked_at: string
  }>
  activeChallenges: Array<{
    id: string
    title: string
    current_day: number
    duration: number
  }>
  unlockedStickersCount: number
  scrapbookPagesCount: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?redirect=/premium/dashboard')
      return
    }

    if (status === 'authenticated') {
      loadDashboardData()
      
      // Mostrar bienvenida para usuarios nuevos
      const hasSeenWelcome = localStorage.getItem('hasSeenDashboardWelcome')
      if (!hasSeenWelcome) {
        setShowWelcome(true)
        localStorage.setItem('hasSeenDashboardWelcome', 'true')
      }
    }
  }, [status, router])

  const loadDashboardData = async () => {
    try {
      const [profileRes, statsRes, achievementsRes, challengesRes, stickersRes, scrapbookRes] = await Promise.all([
        fetch('/api/gamification/profile'),
        fetch('/api/statistics/user'),
        fetch('/api/gamification/achievements'),
        fetch('/api/challenges/user'),
        fetch('/api/stickers'),
        fetch('/api/scrapbook/pages'),
      ])

      const profileData = await profileRes.json()
      const statsData = await statsRes.json()
      const achievementsData = await achievementsRes.json()
      const challengesData = await challengesRes.json()
      const stickersData = await stickersRes.json()
      const scrapbookData = await scrapbookRes.json()

      setDashboardData({
        user: profileData.user || { 
          name: session?.user?.name || 'Usuario',
          email: session?.user?.email || '',
          points: 0,
          level: 1,
          experience: 0,
          experienceForNextLevel: 100,
          experienceProgress: 0
        },
        statistics: profileData.statistics || {
          total_journal_entries: 0,
          total_templates_completed: 0,
          total_challenges_completed: 0,
          active_days: 0,
          streak_days: 0
        },
        recentAchievements: (achievementsData.achievements || []).slice(0, 3),
        activeChallenges: (challengesData.challenges || []).filter((c: any) => !c.completed_at).slice(0, 2),
        unlockedStickersCount: stickersData.userStickers?.length || 0,
        scrapbookPagesCount: scrapbookData.pages?.length || 0
      })
    } catch (error) {
      console.error('Error al cargar dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hogara-cream via-white to-hogara-pink/10">
        <div className="text-center space-y-4">
          <Sparkles className="h-12 w-12 mx-auto text-hogara-gold animate-pulse" />
          <p className="text-hogara-gray/70">Cargando tu espacio mágico...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  const features = [
    {
      id: 'acompanante',
      icon: Sparkles,
      title: '✨ Acompañante Mágico',
      description: 'Tu compañero emocional inteligente con memoria',
      link: '/premium/acompanante',
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      stat: null,
      statLabel: '',
      tooltip: 'Un ser mágico que te acompaña, recuerda tus conversaciones y te brinda apoyo personalizado en todo momento',
      featured: true
    },
    {
      id: 'chat',
      icon: Heart,
      title: '💬 Chat Emocional (Espacio de Desahogo)',
      description: '100% privado · Ejercicios guiados · Seguimiento semanal',
      link: '/premium/desahogo',
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      stat: null,
      statLabel: '',
      tooltip: 'Espacio 100% privado para expresar emociones, con ejercicios interactivos, seguimiento semanal y recomendaciones personalizadas'
    },
    {
      id: 'diarios',
      icon: BookHeart,
      title: 'Diarios',
      description: 'Escribe y refleja tu día a día',
      link: '/mis-diarios',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      stat: dashboardData.statistics.total_journal_entries,
      statLabel: 'entradas',
      tooltip: 'Escribe tus pensamientos, emociones y reflexiones diarias'
    },
    {
      id: 'plantillas',
      icon: Palette,
      title: 'Plantillas',
      description: 'Explora y colorea plantillas premium',
      link: '/premium/plantillas',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      stat: dashboardData.statistics.total_templates_completed,
      statLabel: 'completadas',
      tooltip: 'Plantillas digitales protegidas para colorear y personalizar'
    },
    {
      id: 'scrapbook',
      icon: Sticker,
      title: 'Scrapbook',
      description: 'Crea páginas decoradas con stickers',
      link: '/premium/scrapbook',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      stat: dashboardData.scrapbookPagesCount,
      statLabel: 'páginas',
      tooltip: 'Canvas digital para crear composiciones únicas con stickers'
    },
    {
      id: 'retos',
      icon: Trophy,
      title: 'Retos',
      description: 'Desafíos de 21 días para transformarte',
      link: '/premium/retos',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      stat: dashboardData.statistics.total_challenges_completed,
      statLabel: 'completados',
      tooltip: 'Retos de gratitud, energía y autocuidado para tu crecimiento'
    },
    {
      id: 'musica',
      icon: Music,
      title: 'Música',
      description: 'Biblioteca premium de sonidos',
      link: '/premium/musica',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      stat: null,
      statLabel: '',
      tooltip: 'Música ambient y sonidos para acompañar tus rituales'
    },
    {
      id: 'voice-config',
      icon: Speaker,
      title: '🎙️ Configuración de Voz',
      description: 'Gestiona voces y conecta tu API key',
      link: '/premium/configuracion-voz',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      stat: null,
      statLabel: '',
      tooltip: 'Configura voces realistas para tus companions y conecta tu API key personal para uso ilimitado'
    },
    {
      id: 'diarios-3d',
      icon: BookHeart,
      title: '📖 Diarios 3D Interactivos',
      description: 'Experiencia única de journaling',
      link: '/premium/diarios-3d',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      stat: null,
      statLabel: '',
      tooltip: 'Diarios 3D con pestañas interactivas, trackers clicables y protección total'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-hogara-cream via-white to-hogara-pink/10">
      {/* Header con navegación mejorada */}
      <div className="bg-white border-b-2 border-hogara-gold/30 sticky top-0 z-40 backdrop-blur-sm bg-white/90 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button 
                variant="outline" 
                className="border-2 border-hogara-gold/40 text-hogara-gold hover:bg-hogara-gold hover:text-white transition-all font-semibold gap-2 shadow-sm hover:shadow-md"
              >
                <span className="text-lg">🌈</span>
                Volver a los Submundos
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-hogara-gold/10 to-hogara-pink/10 rounded-full border border-hogara-gold/20">
                <Crown className="h-5 w-5 text-hogara-gold" />
                <span className="font-heading text-lg text-hogara-gray">Hogara Planner</span>
              </div>
            </div>
            <Link href="/premium">
              <Button 
                variant="outline" 
                className="border-hogara-gold/30 text-hogara-gray hover:bg-hogara-gold/10 hover:border-hogara-gold/50 transition-all"
              >
                💎 Ver Planes
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Message */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-hogara-gold/10 to-hogara-pink/10 border-hogara-gold/30">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Sparkles className="h-8 w-8 text-hogara-gold flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-heading text-xl text-hogara-gray mb-2">
                          ¡Bienvenida a tu espacio mágico, {dashboardData.user.name}! ✨
                        </h3>
                        <p className="text-hogara-gray/70 text-sm mb-4">
                          Este es tu dashboard central. Desde aquí puedes acceder a todas las funcionalidades premium. 
                          Completa acciones para ganar puntos, desbloquear logros y subir de nivel. ¡Tu viaje comienza ahora!
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-hogara-gold hover:bg-hogara-gold/90"
                            onClick={() => setShowWelcome(false)}
                          >
                            Empezar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-hogara-gold/10 to-hogara-gold/5 border-hogara-gold/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-hogara-gray/70">Nivel</CardTitle>
                <Star className="h-4 w-4 text-hogara-gold" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-hogara-gold">{dashboardData.user.level}</div>
              <Progress value={dashboardData.user.experienceProgress} className="mt-2 h-2" />
              <p className="text-xs text-hogara-gray/60 mt-1">
                {dashboardData.user.experience} / {dashboardData.user.experienceForNextLevel} XP
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-50/50 border-purple-200/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-hogara-gray/70">Puntos</CardTitle>
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{dashboardData.user.points}</div>
              <p className="text-xs text-hogara-gray/60 mt-1">Úsalos para desbloquear stickers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-50/50 border-pink-200/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-hogara-gray/70">Racha</CardTitle>
                <Activity className="h-4 w-4 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-600">{dashboardData.statistics.streak_days}</div>
              <p className="text-xs text-hogara-gray/60 mt-1">días consecutivos activa</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-50/50 border-green-200/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-hogara-gray/70">Días Activos</CardTitle>
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{dashboardData.statistics.active_days}</div>
              <p className="text-xs text-hogara-gray/60 mt-1">días totales de actividad</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Main Features */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-3xl text-hogara-gray flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-hogara-gold/20 to-hogara-pink/20 rounded-xl">
                <Sparkles className="h-7 w-7 text-hogara-gold" />
              </div>
              Tus Herramientas Mágicas
            </h2>
          </div>

          <TooltipProvider>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon
                const isFeatured = feature.featured
                return (
                  <Tooltip key={feature.id}>
                    <TooltipTrigger asChild>
                      <Link href={feature.link}>
                        <motion.div
                          whileHover={{ scale: 1.02, y: -4 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Card className={`
                            hover:shadow-2xl transition-all cursor-pointer group h-full
                            ${isFeatured 
                              ? 'border-3 border-hogara-gold/50 bg-gradient-to-br from-hogara-gold/10 via-yellow-50/40 to-orange-50/30 shadow-lg hover:shadow-2xl hover:border-hogara-gold/70 relative overflow-hidden' 
                              : 'border-2 border-hogara-gold/20 hover:border-hogara-gold/50 bg-white'
                            }
                          `}>
                            {isFeatured && (
                              <>
                                <motion.div
                                  className="absolute top-3 right-3 z-10"
                                  animate={{
                                    scale: [1, 1.3, 1],
                                    rotate: [0, 15, -15, 0]
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 3
                                  }}
                                >
                                  <Sparkles className="w-6 h-6 text-hogara-gold fill-hogara-gold drop-shadow-lg" />
                                </motion.div>
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-hogara-gold to-yellow-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-md">
                                  ✨ NUEVO
                                </div>
                              </>
                            )}
                            <CardHeader className="pb-4">
                              <div className="flex items-start justify-between mb-4">
                                <div className={`p-4 ${feature.bgColor} rounded-2xl group-hover:scale-110 transition-transform shadow-md ${isFeatured ? 'shadow-lg' : ''}`}>
                                  <Icon className={`h-8 w-8 ${feature.color}`} />
                                </div>
                                <ArrowRight className={`h-6 w-6 ${isFeatured ? 'text-hogara-gold' : 'text-hogara-gray/30'} group-hover:text-hogara-gold group-hover:translate-x-2 transition-all`} />
                              </div>
                              <CardTitle className={`text-xl mb-2 ${isFeatured ? 'text-hogara-gold' : 'text-hogara-gray'} font-heading`}>
                                {feature.title}
                              </CardTitle>
                              <CardDescription className={`text-sm leading-relaxed ${isFeatured ? 'font-medium text-hogara-gray/80' : 'text-hogara-gray/60'}`}>
                                {feature.description}
                              </CardDescription>
                            </CardHeader>
                            {feature.stat !== null && (
                              <CardContent className="pt-0">
                                <div className="flex items-baseline gap-2 p-3 bg-gradient-to-r from-hogara-gold/5 to-transparent rounded-lg">
                                  <span className="text-3xl font-bold text-hogara-gold">{feature.stat}</span>
                                  <span className="text-sm text-hogara-gray/60 font-medium">{feature.statLabel}</span>
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        </motion.div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs bg-hogara-gray text-white border-hogara-gold/30">
                      <p className="text-sm leading-relaxed">{feature.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </TooltipProvider>
        </div>

        {/* Active Challenges & Recent Achievements */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Active Challenges */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-hogara-gold" />
                  Retos Activos
                </CardTitle>
                <Link href="/premium/retos">
                  <Button variant="ghost" size="sm" className="text-hogara-gold hover:text-hogara-gold/80">
                    Ver todos
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {dashboardData.activeChallenges.length === 0 ? (
                <div className="text-center py-6 text-hogara-gray/60">
                  <Trophy className="h-12 w-12 mx-auto mb-2 text-hogara-gray/30" />
                  <p className="text-sm">No tienes retos activos</p>
                  <Link href="/premium/retos">
                    <Button size="sm" className="mt-3 bg-hogara-gold hover:bg-hogara-gold/90">
                      Explorar Retos
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData.activeChallenges.map((challenge) => (
                    <div key={challenge.id} className="p-4 bg-hogara-cream/50 rounded-lg border border-hogara-gold/10">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-hogara-gray">{challenge.title}</h4>
                        <Badge variant="outline" className="text-hogara-gold border-hogara-gold/30">
                          Día {challenge.current_day}/{challenge.duration}
                        </Badge>
                      </div>
                      <Progress value={(challenge.current_day / challenge.duration) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-hogara-gold" />
                  Logros Recientes
                </CardTitle>
                <Link href="/premium/gamificacion">
                  <Button variant="ghost" size="sm" className="text-hogara-gold hover:text-hogara-gold/80">
                    Ver todos
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {dashboardData.recentAchievements.length === 0 ? (
                <div className="text-center py-6 text-hogara-gray/60">
                  <Gift className="h-12 w-12 mx-auto mb-2 text-hogara-gray/30" />
                  <p className="text-sm">Completa acciones para desbloquear logros</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData.recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-hogara-cream/50 rounded-lg border border-hogara-gold/10">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-hogara-gray text-sm">{achievement.name}</p>
                        <p className="text-xs text-hogara-gray/60">
                          {new Date(achievement.unlocked_at).toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </p>
                      </div>
                      <Sparkles className="h-4 w-4 text-hogara-gold" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Advanced Features */}
        <Card className="bg-gradient-to-br from-hogara-gold/5 to-hogara-pink/5 border-hogara-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-hogara-gold" />
              Funciones Avanzadas
            </CardTitle>
            <CardDescription>Explora más herramientas para tu crecimiento personal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/premium/gamificacion">
                <Button variant="outline" className="w-full justify-start h-auto py-4 border-hogara-gold/20 hover:border-hogara-gold/40">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-hogara-gold" />
                    <div className="text-left">
                      <div className="font-medium text-sm">Gamificación</div>
                      <div className="text-xs text-hogara-gray/60">Sistema completo de puntos y logros</div>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/premium/estadisticas">
                <Button variant="outline" className="w-full justify-start h-auto py-4 border-hogara-gold/20 hover:border-hogara-gold/40">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-sm">Estadísticas</div>
                      <div className="text-xs text-hogara-gray/60">Visualiza tu progreso y evolución</div>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/premium/stickers">
                <Button variant="outline" className="w-full justify-start h-auto py-4 border-hogara-gold/20 hover:border-hogara-gold/40">
                  <div className="flex items-center gap-3">
                    <Sticker className="h-5 w-5 text-yellow-600" />
                    <div className="text-left">
                      <div className="font-medium text-sm">Tienda de Stickers</div>
                      <div className="text-xs text-hogara-gray/60">{dashboardData.unlockedStickersCount} desbloqueados</div>
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

