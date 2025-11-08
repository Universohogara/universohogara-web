
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { PremiumGuard } from '@/components/premium/premium-guard'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DailyChallengeWidget from '@/components/gamification/daily-challenge-widget'
import { 
  Trophy, 
  Calendar, 
  Heart,
  Zap,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  Clock,
  Target,
  Star,
  Gamepad2,
  Flame,
  Award
} from 'lucide-react'
import { toast } from 'sonner'

interface Challenge {
  id: string
  title: string
  description: string
  duration: number
  category: string
  icon: string
  tier: string
  is_active: boolean
}

interface UserChallenge {
  id: string
  challenge_id: string
  started_at: string
  current_day: number
  completed_at: string | null
  challenge: Challenge
}

const CHALLENGE_ICONS: Record<string, any> = {
  heart: Heart,
  zap: Zap,
  sparkles: Sparkles,
  trophy: Trophy
}

function RetosContent() {
  const { data: session } = useSession() || {}
  const [activeChallenges, setActiveChallenges] = useState<UserChallenge[]>([])
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)

  useEffect(() => {
    fetchUserChallenges()
    fetchAvailableChallenges()
  }, [])

  const fetchUserChallenges = async () => {
    try {
      const response = await fetch('/api/challenges/user')
      if (response.ok) {
        const data = await response.json()
        setActiveChallenges(data.challenges || [])
      }
    } catch (error) {
      console.error('Error fetching challenges:', error)
    }
  }

  const fetchAvailableChallenges = async () => {
    try {
      const response = await fetch('/api/challenges/available')
      if (response.ok) {
        const data = await response.json()
        setAvailableChallenges(data.challenges || [])
      }
    } catch (error) {
      console.error('Error fetching available challenges:', error)
    } finally {
      setFetchingData(false)
    }
  }

  const handleStartChallenge = async (challengeId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/challenges/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId })
      })

      if (response.ok) {
        toast.success('¡Reto iniciado! Día 1 de 21 comienza ahora')
        fetchUserChallenges()
        fetchAvailableChallenges()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Error al iniciar el reto')
      }
    } catch (error) {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const calculateProgress = (challenge: UserChallenge) => {
    return Math.round((challenge.current_day / challenge.challenge.duration) * 100)
  }

  if (fetchingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hogara-cream via-white to-hogara-pink/5">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-hogara-gold border-t-transparent mx-auto" />
            <p className="text-hogara-gray">Cargando retos...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hogara-cream via-white to-hogara-pink/5">
      <Header />
      
      <main className="py-20">
        <div className="container px-4">
          {/* Hero */}
          <div className="text-center space-y-4 mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-6 w-6 text-hogara-gold" />
              <span className="text-sm font-medium text-hogara-gold uppercase tracking-wider">
                Retos Transformadores
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-hogara-gray">
              Retos de 21 Días
            </h1>
            <p className="text-lg text-hogara-gray/70 max-w-2xl mx-auto">
              Cambia tu vida con retos diseñados científicamente para crear hábitos duraderos. 
              21 días es lo que necesitas para transformar tu mente.
            </p>
          </div>

          {/* Retos Activos */}
          {activeChallenges.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-heading text-hogara-gray mb-6 flex items-center gap-2">
                <Flame className="h-6 w-6 text-orange-500" />
                Tus Retos Activos
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {activeChallenges
                  .filter(uc => !uc.completed_at)
                  .map((userChallenge) => (
                    <DailyChallengeWidget
                      key={userChallenge.id}
                      userChallenge={userChallenge}
                      onUpdate={() => {
                        fetchUserChallenges()
                        fetchAvailableChallenges()
                      }}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Retos Completados */}
          {activeChallenges.some(uc => uc.completed_at) && (
            <div className="mb-12">
              <h2 className="text-2xl font-heading text-hogara-gray mb-6 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-green-500" />
                Retos Completados
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeChallenges
                  .filter(uc => uc.completed_at)
                  .map((userChallenge) => {
                    const Icon = CHALLENGE_ICONS[userChallenge.challenge.icon] || Trophy
                    const completedDate = new Date(userChallenge.completed_at!)

                    return (
                      <Card key={userChallenge.id} className="border-2 border-green-200 bg-gradient-to-br from-white to-green-50">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-3">
                            <div className="p-3 bg-green-100 rounded-xl">
                              <Icon className="h-6 w-6 text-green-600" />
                            </div>
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completado
                            </Badge>
                          </div>
                          <CardTitle className="font-serif text-xl">
                            {userChallenge.challenge.title}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Completado el {completedDate.toLocaleDateString('es-ES', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-center py-4">
                            <div className="text-center space-y-2">
                              <div className="text-4xl">🏆</div>
                              <p className="text-sm font-medium text-green-600">
                                {userChallenge.challenge.duration} días completados
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Retos Disponibles */}
          <div>
            <h2 className="text-2xl font-heading text-hogara-gray mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-hogara-gold" />
              Retos Disponibles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableChallenges.map((challenge) => {
                const Icon = CHALLENGE_ICONS[challenge.icon] || Trophy
                const isActive = activeChallenges.some(
                  uc => uc.challenge_id === challenge.id && !uc.completed_at
                )

                return (
                  <Card
                    key={challenge.id}
                    className="hover:shadow-xl transition-all border-hogara-gold/20"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-3 bg-hogara-gold/10 rounded-xl">
                          <Icon className="h-6 w-6 text-hogara-gold" />
                        </div>
                        <Badge variant="outline" className="border-hogara-gold/30 text-hogara-gold">
                          {challenge.duration} días
                        </Badge>
                      </div>
                      <CardTitle className="font-serif text-xl">
                        {challenge.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {challenge.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleStartChallenge(challenge.id)}
                        disabled={loading || isActive}
                        className="w-full bg-hogara-gold hover:bg-hogara-gold/90 text-white"
                      >
                        {isActive ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Ya iniciado
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Iniciar Reto
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Info Section */}
          <Card className="mt-12 p-8 bg-gradient-to-r from-hogara-cream/50 to-white border-hogara-gold/20">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center">
                <Trophy className="h-10 w-10 text-hogara-gold mx-auto mb-4" />
                <h3 className="text-2xl font-heading text-hogara-gray mb-3">
                  ¿Por qué 21 días?
                </h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-hogara-gold">7</div>
                  <p className="text-sm text-hogara-gray">días para crear conciencia del hábito</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-hogara-gold">14</div>
                  <p className="text-sm text-hogara-gray">días para que se vuelva natural</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-hogara-gold">21</div>
                  <p className="text-sm text-hogara-gray">días para anclar el cambio</p>
                </div>
              </div>
              <p className="text-center text-hogara-gray/70 pt-4">
                Respaldado por neurociencia: 21 días es el tiempo mínimo necesario para crear nuevas 
                conexiones neuronales y establecer hábitos duraderos.
              </p>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default function RetosPage() {
  return (
    <PremiumGuard requiredTier="total">
      <RetosContent />
    </PremiumGuard>
  )
}
