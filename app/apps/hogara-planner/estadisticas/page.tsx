
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { PremiumGuard } from '@/components/premium/premium-guard'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  Calendar, 
  BookHeart,
  Trophy,
  Flame,
  Target,
  Sparkles,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

interface UserStats {
  total_journal_entries: number
  total_templates_completed: number
  total_challenges_completed: number
  active_days: number
  streak_days: number
  last_active: string
}

function EstadisticasContent() {
  const { data: session } = useSession() || {}
  const [stats, setStats] = useState<UserStats>({
    total_journal_entries: 0,
    total_templates_completed: 0,
    total_challenges_completed: 0,
    active_days: 0,
    streak_days: 0,
    last_active: new Date().toISOString()
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/statistics/user')
      if (response.ok) {
        const data = await response.json()
        setStats(data.statistics || stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    color = 'hogara-gold',
    trend 
  }: {
    icon: any
    title: string
    value: string | number
    subtitle: string
    color?: string
    trend?: string
  }) => (
    <Card className="hover:shadow-lg transition-all border-hogara-gold/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`p-3 bg-${color}/10 rounded-xl`}>
            <Icon className={`h-6 w-6 text-${color}`} />
          </div>
          {trend && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              {trend}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-hogara-gray">{value}</p>
          <p className="text-sm font-medium text-hogara-gray/90">{title}</p>
          <p className="text-xs text-hogara-gray/60">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-hogara-cream via-white to-hogara-pink/5">
      <Header />
      
      <main className="py-20">
        <div className="container px-4">
          {/* Hero */}
          <div className="text-center space-y-4 mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BarChart3 className="h-6 w-6 text-hogara-gold" />
              <span className="text-sm font-medium text-hogara-gold uppercase tracking-wider">
                Tu Progreso
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-hogara-gray">
              Estadísticas y Progreso
            </h1>
            <p className="text-lg text-hogara-gray/70 max-w-2xl mx-auto">
              Visualiza tu viaje de autodescubrimiento y celebra cada paso que das hacia tu mejor versión.
            </p>
          </div>

          {/* Racha Actual - Destacado */}
          <Card className="mb-8 bg-gradient-to-r from-hogara-gold/10 via-hogara-pink/10 to-hogara-lavender/10 border-2 border-hogara-gold/30">
            <CardContent className="p-8">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white rounded-2xl shadow-md">
                    <Flame className="h-12 w-12 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-hogara-gray/70 mb-1">Tu racha actual</p>
                    <p className="text-5xl font-bold text-hogara-gray">{stats.streak_days}</p>
                    <p className="text-lg text-hogara-gray/80 mt-1">días consecutivos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-hogara-gray/70 mb-2">¡Sigue así!</p>
                  <p className="text-hogara-gray">
                    Has estado activa {stats.active_days} días en total
                  </p>
                  <p className="text-xs text-hogara-gray/60 mt-1">
                    Última actividad: {new Date(stats.last_active).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Estadísticas */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              icon={BookHeart}
              title="Entradas de Diario"
              value={stats.total_journal_entries}
              subtitle="Total de reflexiones escritas"
              trend={stats.total_journal_entries > 0 ? '+' + Math.min(stats.total_journal_entries, 10) : undefined}
            />
            <StatCard
              icon={Target}
              title="Plantillas Completadas"
              value={stats.total_templates_completed}
              subtitle="Herramientas utilizadas"
            />
            <StatCard
              icon={Trophy}
              title="Retos Completados"
              value={stats.total_challenges_completed}
              subtitle="Transformaciones logradas"
            />
            <StatCard
              icon={Calendar}
              title="Días Activos"
              value={stats.active_days}
              subtitle="Tu compromiso contigo misma"
            />
          </div>

          {/* Secciones de Análisis */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Actividad Reciente */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-hogara-gold" />
                  <CardTitle>Actividad Reciente</CardTitle>
                </div>
                <CardDescription>
                  Tus últimas interacciones con Hogara
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.total_journal_entries > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-hogara-cream/50 rounded-lg">
                      <BookHeart className="h-5 w-5 text-hogara-pink flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-hogara-gray">Diario personal</p>
                        <p className="text-xs text-hogara-gray/60">
                          {stats.total_journal_entries} entradas escritas
                        </p>
                      </div>
                    </div>
                  )}
                  {stats.total_templates_completed > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-hogara-cream/50 rounded-lg">
                      <Target className="h-5 w-5 text-hogara-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-hogara-gray">Plantillas</p>
                        <p className="text-xs text-hogara-gray/60">
                          {stats.total_templates_completed} plantillas completadas
                        </p>
                      </div>
                    </div>
                  )}
                  {stats.total_challenges_completed > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-hogara-cream/50 rounded-lg">
                      <Trophy className="h-5 w-5 text-hogara-lavender flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-hogara-gray">Retos</p>
                        <p className="text-xs text-hogara-gray/60">
                          {stats.total_challenges_completed} retos completados
                        </p>
                      </div>
                    </div>
                  )}
                  {stats.total_journal_entries === 0 && 
                   stats.total_templates_completed === 0 && 
                   stats.total_challenges_completed === 0 && (
                    <div className="text-center py-8 text-hogara-gray/60">
                      <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Comienza tu viaje hoy</p>
                      <p className="text-xs mt-1">Tus logros aparecerán aquí</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Logros y Hitos */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-hogara-gold" />
                  <CardTitle>Logros Desbloqueados</CardTitle>
                </div>
                <CardDescription>
                  Reconocimientos a tu dedicación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.streak_days >= 7 && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-hogara-gold/10 to-transparent rounded-lg border border-hogara-gold/20">
                      <div className="flex-shrink-0 p-2 bg-hogara-gold/20 rounded-lg">
                        <Flame className="h-5 w-5 text-hogara-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-hogara-gray">Racha de 7 días</p>
                        <p className="text-xs text-hogara-gray/60">Constancia principiante</p>
                      </div>
                    </div>
                  )}
                  {stats.total_journal_entries >= 10 && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-hogara-pink/10 to-transparent rounded-lg border border-hogara-pink/20">
                      <div className="flex-shrink-0 p-2 bg-hogara-pink/20 rounded-lg">
                        <BookHeart className="h-5 w-5 text-hogara-pink" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-hogara-gray">Escritora dedicada</p>
                        <p className="text-xs text-hogara-gray/60">10+ entradas de diario</p>
                      </div>
                    </div>
                  )}
                  {stats.total_challenges_completed >= 1 && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-hogara-lavender/10 to-transparent rounded-lg border border-hogara-lavender/20">
                      <div className="flex-shrink-0 p-2 bg-hogara-lavender/20 rounded-lg">
                        <Trophy className="h-5 w-5 text-hogara-lavender" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-hogara-gray">Transformadora</p>
                        <p className="text-xs text-hogara-gray/60">Primer reto completado</p>
                      </div>
                    </div>
                  )}
                  {stats.streak_days < 7 && 
                   stats.total_journal_entries < 10 && 
                   stats.total_challenges_completed < 1 && (
                    <div className="text-center py-8 text-hogara-gray/60">
                      <Trophy className="h-8 w-8 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Desbloquea tus primeros logros</p>
                      <p className="text-xs mt-1">Mantén tu práctica diaria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info motivacional */}
          <Card className="bg-gradient-to-r from-hogara-cream/50 to-white border-hogara-gold/20">
            <CardContent className="p-8 text-center">
              <Sparkles className="h-10 w-10 text-hogara-gold mx-auto mb-4" />
              <h3 className="text-2xl font-heading text-hogara-gray mb-3">
                Cada día cuenta
              </h3>
              <p className="text-hogara-gray/70 max-w-2xl mx-auto">
                Tus estadísticas son un reflejo de tu compromiso contigo misma. 
                No se trata de la perfección, sino del progreso consistente. 
                ¡Sigue adelante!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default function EstadisticasPage() {
  return (
    <PremiumGuard requiredTier="total">
      <EstadisticasContent />
    </PremiumGuard>
  )
}
