
'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Send, Trash2, AlertTriangle, Heart, Sparkles, BarChart3, Activity, Calendar, Mic, MessageSquare } from 'lucide-react'
import { RewardNotification } from '@/components/chat/reward-notification'
import { StatisticsPanel } from '@/components/chat/statistics-panel'
import { GuidedExercise } from '@/components/chat/guided-exercise'
import { WeeklySummary } from '@/components/chat/weekly-summary'
import { VoiceCompanionChat } from '@/components/companion/voice-companion-chat'
import { SimpleEmotionalChat } from '@/components/companion/simple-emotional-chat'

export default function DesahogoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [rewardAchievements, setRewardAchievements] = useState<string[]>([])
  const [rewardPoints, setRewardPoints] = useState(0)
  const [activeTab, setActiveTab] = useState('chat')
  const [showExercises, setShowExercises] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<any>(null)
  const [exercises, setExercises] = useState<any[]>([])
  const [showWeeklySummary, setShowWeeklySummary] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [activeCompanion, setActiveCompanion] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Cargar companion activo
  useEffect(() => {
    const loadActiveCompanion = async () => {
      try {
        const res = await fetch('/api/companion')
        const data = await res.json()
        if (data.activeCompanion) {
          setActiveCompanion(data.activeCompanion)
        }
      } catch (error) {
        console.error('Error cargando companion:', error)
      }
    }

    if (session) {
      loadActiveCompanion()
    }
  }, [session])

  useEffect(() => {
    const checkConsent = async () => {
      try {
        const res = await fetch('/api/chat-emocional/consent')
        const data = await res.json()
        if (data.hasConsent) {
          setHasConsent(true)
          loadChatHistory()
        } else {
          setShowDisclaimer(true)
        }
      } catch (error) {
        console.error('Error al verificar consentimiento:', error)
        setShowDisclaimer(true)
      }
    }

    if (session) {
      checkConsent()
    }
  }, [session])

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadChatHistory = async () => {
    try {
      const res = await fetch('/api/chat-emocional/history')
      const data = await res.json()
      if (data.messages) {
        setChatHistory(data.messages)
      }
      
      // Cargar estadísticas para obtener el streak
      const statsRes = await fetch('/api/chat-emocional/statistics')
      const statsData = await statsRes.json()
      if (statsData.currentStreak !== undefined) {
        setCurrentStreak(statsData.currentStreak)
      }
    } catch (error) {
      console.error('Error al cargar historial:', error)
    }
  }

  const loadExercises = async () => {
    try {
      const res = await fetch('/api/chat-emocional/exercises')
      const data = await res.json()
      if (data.exercises) {
        setExercises(data.exercises)
      }
    } catch (error) {
      console.error('Error al cargar ejercicios:', error)
    }
  }

  const handleExerciseComplete = async () => {
    // Recompensar al usuario por completar un ejercicio
    try {
      await fetch('/api/gamification/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'COMPLETE_EXERCISE',
          metadata: { exerciseId: selectedExercise?.id }
        })
      })
    } catch (error) {
      console.error('Error al registrar ejercicio:', error)
    }
    setSelectedExercise(null)
  }

  useEffect(() => {
    if (hasConsent) {
      loadExercises()
    }
  }, [hasConsent])

  const processRewards = async () => {
    try {
      const res = await fetch('/api/gamification/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_MESSAGE',
          metadata: { streak: currentStreak }
        })
      })

      const data = await res.json()
      if (data.success && data.pointsEarned > 0) {
        setRewardAchievements(data.achievements || [])
        setRewardPoints(data.pointsEarned)
      }
    } catch (error) {
      console.error('Error al procesar recompensas:', error)
    }
  }

  const handleAcceptDisclaimer = async () => {
    try {
      await fetch('/api/chat-emocional/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accepted: true })
      })
      setHasConsent(true)
      setShowDisclaimer(false)
    } catch (error) {
      console.error('Error al guardar consentimiento:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = message
    setMessage('')
    setIsLoading(true)

    // Agregar mensaje del usuario al historial
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    }
    setChatHistory(prev => [...prev, newUserMessage])

    try {
      const res = await fetch('/api/chat-emocional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          chatHistory: chatHistory.slice(-10) // Últimos 10 mensajes para contexto
        })
      })

      if (!res.ok) {
        throw new Error('Error al enviar mensaje')
      }

      // Verificar si es una respuesta JSON (riesgo detectado) o streaming
      const contentType = res.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const data = await res.json()
        
        if (data.riskDetected && data.riskLevel === 'high') {
          setShowEmergencyAlert(true)
        }

        const assistantMessage = {
          role: 'assistant',
          content: data.response,
          created_at: new Date().toISOString()
        }
        setChatHistory(prev => [...prev, assistantMessage])
      } else {
        // Streaming response
        const reader = res.body?.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        // Agregar mensaje del asistente vacío que se irá llenando
        const assistantMessage = {
          role: 'assistant',
          content: '',
          created_at: new Date().toISOString()
        }
        setChatHistory(prev => [...prev, assistantMessage])

        while (true) {
          const { done, value } = await reader!.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content || ''
                buffer += content

                // Actualizar el último mensaje del asistente
                setChatHistory(prev => {
                  const newHistory = [...prev]
                  const lastMessage = newHistory[newHistory.length - 1]
                  if (lastMessage.role === 'assistant') {
                    lastMessage.content = buffer
                  }
                  return newHistory
                })
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      // Procesar recompensas después de enviar el mensaje exitosamente
      await processRewards()
      
      // Recargar estadísticas para actualizar el streak
      const statsRes = await fetch('/api/chat-emocional/statistics')
      const statsData = await statsRes.json()
      if (statsData.currentStreak !== undefined) {
        setCurrentStreak(statsData.currentStreak)
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error)
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: '❌ Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.',
        created_at: new Date().toISOString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = async () => {
    if (!confirm('¿Estás segura de que quieres borrar todo el historial del chat? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await fetch('/api/chat-emocional/history', {
        method: 'DELETE'
      })
      setChatHistory([])
    } catch (error) {
      console.error('Error al borrar historial:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#B8956A]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Reward Notification */}
        {rewardAchievements.length > 0 && (
          <RewardNotification
            achievements={rewardAchievements}
            points={rewardPoints}
            onClose={() => {
              setRewardAchievements([])
              setRewardPoints(0)
            }}
          />
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-rose-400" />
            <h1 className="text-4xl font-serif text-[#1a1a1a]">Espacio de Desahogo</h1>
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Un espacio seguro y privado para expresar tus emociones. Aquí puedes hablar libremente sin juicios.
          </p>
          
          {/* Streak indicator */}
          {currentStreak > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full">
              <span className="text-2xl">🔥</span>
              <span className="text-orange-700 font-medium">
                {currentStreak} {currentStreak === 1 ? 'día' : 'días'} de racha
              </span>
            </div>
          )}
        </div>

        {/* Privacy Banner - DESTACADO Y MUY VISIBLE */}
        <Card className="mb-6 border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 shadow-lg">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-emerald-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-emerald-900 mb-2 flex items-center gap-2">
                  🔒 Tu Privacidad es Sagrada
                </h3>
                <div className="space-y-2 text-emerald-800">
                  <p className="font-semibold text-lg">
                    ✨ Tus conversaciones son 100% privadas y confidenciales
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span><strong>Nadie puede leer tus mensajes</strong> - Solo tú tienes acceso</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span><strong>Datos cifrados y protegidos</strong> - Máxima seguridad</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span><strong>Sin fines comerciales</strong> - Nunca vendemos ni compartimos tu información</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span><strong>Confidencialidad total</strong> - No contactaremos a nadie sin tu permiso</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Emergency Alert */}
        {showEmergencyAlert && (
          <Alert className="mb-6 border-red-500 bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-900">
              <strong>Si estás en crisis, por favor busca ayuda inmediata:</strong><br />
              📞 Teléfono de la Esperanza: <a href="tel:717003717" className="font-bold underline">717 003 717</a><br />
              📞 Emergencias: <a href="tel:112" className="font-bold underline">112</a><br />
              💬 Chat ANAR (menores): <a href="tel:900202010" className="font-bold underline">900 20 20 10</a>
            </AlertDescription>
          </Alert>
        )}

        {/* Toggle de modo de chat: Texto vs Voz */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white rounded-lg shadow-md p-2 border-2 border-[#D4AF37]/20">
            <Button
              onClick={() => setIsVoiceMode(false)}
              variant={!isVoiceMode ? "default" : "ghost"}
              className={`gap-2 ${!isVoiceMode ? 'bg-gradient-to-r from-rose-400 to-purple-400 text-white' : 'text-gray-600'}`}
            >
              <MessageSquare className="h-4 w-4" />
              Chat de Texto
            </Button>
            <Button
              onClick={() => setIsVoiceMode(true)}
              variant={isVoiceMode ? "default" : "ghost"}
              className={`gap-2 ${isVoiceMode ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white' : 'text-gray-600'}`}
              disabled={!activeCompanion}
            >
              <Mic className="h-4 w-4" />
              Chat por Voz
            </Button>
          </div>
        </div>

        {/* Botones de acciones rápidas (solo en modo texto) */}
        {!isVoiceMode && (
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <Button
              onClick={() => setShowWeeklySummary(true)}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Ver resumen semanal
            </Button>
            <Button
              onClick={() => setShowExercises(!showExercises)}
              variant="outline"
              className="border-rose-300 text-rose-700 hover:bg-rose-50"
            >
              <Activity className="mr-2 h-4 w-4" />
              {showExercises ? 'Ocultar ejercicios' : 'Ver ejercicios guiados'}
            </Button>
          </div>
        )}

        {/* Contenido Principal: Chat de Voz o Texto + Tabs */}
        {isVoiceMode && activeCompanion ? (
          // MODO VOZ: Mostrar SimpleEmotionalChat a pantalla completa con voces de Abacus
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur overflow-hidden" style={{ height: '70vh' }}>
            <SimpleEmotionalChat companion={activeCompanion} />
          </Card>
        ) : (
          // MODO TEXTO: Mostrar Tabs con Chat, Ejercicios y Estadísticas
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="exercises" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Ejercicios
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Progreso
              </TabsTrigger>
            </TabsList>

            {/* Tab: Chat */}
            <TabsContent value="chat">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
              <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {chatHistory.length === 0 && (
              <div className="text-center text-gray-400 py-12">
                <Heart className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Escribe tu primer mensaje para comenzar...</p>
              </div>
            )}

            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-rose-400 to-purple-400 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-[#B8956A]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white/90">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Escribe aquí lo que sientes..."
                className="resize-none border-gray-300 focus:border-[#B8956A] focus:ring-[#B8956A]"
                rows={2}
                disabled={isLoading}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 text-white"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
                {chatHistory.length > 0 && (
                  <Button
                    onClick={handleClearChat}
                    variant="outline"
                    size="icon"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Presiona Enter para enviar
              </p>
              <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Conversación 100% privada
              </div>
            </div>
          </div>
        </Card>
          </TabsContent>

          {/* Tab: Ejercicios */}
          <TabsContent value="exercises">
            <div className="space-y-4">
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Activity className="h-6 w-6 text-purple-600" />
                  Ejercicios interactivos guiados
                </h3>
                <p className="text-gray-600 mb-4">
                  Estos ejercicios te ayudarán a gestionar tus emociones de forma práctica y efectiva.
                  Cada uno está diseñado para un estado emocional específico.
                </p>
              </Card>

              {exercises.length === 0 ? (
                <Card className="p-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-500">Cargando ejercicios...</p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {exercises.map((exercise) => (
                    <Card
                      key={exercise.id}
                      className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-300"
                      onClick={() => setSelectedExercise(exercise)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{exercise.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-900 mb-1">
                            {exercise.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {exercise.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              ⏱️ {exercise.duration} min
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                              {exercise.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab: Estadísticas */}
          <TabsContent value="statistics">
            <StatisticsPanel />
          </TabsContent>
        </Tabs>
        )}

        {/* Privacy Notice */}
        <div className="mt-6 bg-white/80 rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Privacidad y Seguridad Garantizadas</span>
            </div>
            <p className="text-sm text-gray-600">
              Este espacio es un complemento de bienestar emocional, no sustituye ayuda profesional.
              <br />
              <strong>Tus mensajes son completamente privados</strong> - no son leídos por humanos ni se usan con fines comerciales.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer Dialog */}
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-3 text-3xl mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg 
                  className="w-7 h-7 text-emerald-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                  />
                </svg>
              </div>
              <span className="font-serif">Bienvenida a tu Espacio Privado</span>
            </DialogTitle>
            <DialogDescription className="text-left space-y-5 pt-2">
              {/* PRIVACIDAD - DESTACADO PRIMERO */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-300 rounded-xl p-5 shadow-md">
                <h4 className="font-bold text-emerald-900 mb-3 text-xl flex items-center gap-2">
                  🔒 Tu Privacidad es Nuestra Prioridad Absoluta
                </h4>
                <div className="space-y-3 text-emerald-900">
                  <p className="text-lg font-semibold">
                    ✨ Todo lo que compartas aquí es 100% privado y confidencial
                  </p>
                  <ul className="space-y-2 text-base">
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold text-xl">✓</span>
                      <span><strong>Nadie puede leer tus conversaciones</strong> - Solo tú tienes acceso a ellas. Ni siquiera el equipo de Hogara puede verlas.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold text-xl">✓</span>
                      <span><strong>Tus datos están cifrados y protegidos</strong> - Usamos la máxima seguridad disponible para guardar tu información.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold text-xl">✓</span>
                      <span><strong>Sin fines comerciales</strong> - Nunca vendemos, compartimos ni usamos tus conversaciones para publicidad o análisis comerciales.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-600 font-bold text-xl">✓</span>
                      <span><strong>Confidencialidad total garantizada</strong> - No contactaremos a nadie (familia, amigos, autoridades) sin tu consentimiento expreso.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2 text-lg">💬 ¿Qué es este chat?</h4>
                <p className="text-gray-600">
                  Un asistente emocional con inteligencia artificial diseñado para escucharte con
                  empatía y calidez. Puede sugerirte herramientas de Hogara según tu estado emocional.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2 text-lg">⚠️ Limitaciones Importantes</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>No proporciona consejos médicos ni terapéuticos</li>
                  <li>No reemplaza intervención profesional (psicólogo, psiquiatra)</li>
                  <li>No es una línea de crisis ni emergencias</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2 text-lg">🚨 Detección de Riesgo</h4>
                <p className="text-gray-600">
                  Si el sistema detecta señales de riesgo grave (ideación suicida, autolesión),
                  te mostraremos <strong>información inmediata de contacto con servicios profesionales de ayuda</strong>.
                  Nunca contactaremos a nadie sin tu consentimiento expreso.
                </p>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 font-semibold mb-2">
                  Al aceptar, confirmas que:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Comprendes que este chat no sustituye ayuda profesional</li>
                  <li>✓ No estás en crisis ni emergencia médica inmediata</li>
                  <li>✓ Has leído y comprendido la política de privacidad</li>
                  <li>✓ Entiendes las limitaciones de este servicio</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/premium')}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAcceptDisclaimer}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold"
            >
              ✓ He leído y acepto - Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Guided Exercise Modal */}
      {selectedExercise && (
        <GuidedExercise
          exercise={selectedExercise}
          onComplete={handleExerciseComplete}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {/* Weekly Summary Modal */}
      <WeeklySummary
        open={showWeeklySummary}
        onClose={() => setShowWeeklySummary(false)}
      />
    </div>
  )
}
