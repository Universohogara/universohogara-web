
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, AlertTriangle, Volume2, VolumeX, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { detectEmotion, type DetectedEmotion } from '@/lib/emotion-detector'
import { cleanTextForSpeech } from '@/lib/text-cleaner'
import EmotionParticles from './emotion-particles'
import { getEmotionAnimation, getEmotionDescription } from '@/lib/emotion-animations'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  emotion_detected?: string
  risk_detected?: boolean
  risk_level?: string
  created_at: string
}

interface CompanionChatProps {
  companion: {
    id: string
    type: string
    name: string
  }
  companionTheme?: {
    from: string
    to: string
    name: string
  }
  onEmotionChange?: (emotion: DetectedEmotion) => void
}

export function CompanionChat({ companion, companionTheme, onEmotionChange }: CompanionChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showRiskAlert, setShowRiskAlert] = useState(false)
  const [riskLevel, setRiskLevel] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Sistema de voz automática
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<DetectedEmotion>('calm')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Color predeterminado si no se proporciona tema
  const theme = companionTheme || { from: '#D4AF37', to: '#B8941F', name: companion.name }

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadHistory = async () => {
    // Por ahora no cargamos historial, empezamos fresh cada vez
    // Esto mantiene la privacidad y simplicidad
  }

  // Función para reproducir voz automáticamente
  const playVoice = async (text: string) => {
    if (!voiceEnabled || !text) return

    try {
      setIsSpeaking(true)

      // Limpiar texto de emojis antes de enviar a TTS
      const cleanText = cleanTextForSpeech(text)
      
      if (!cleanText.trim()) {
        console.warn('⚠️ Texto vacío después de limpiar, omitiendo TTS')
        setIsSpeaking(false)
        return
      }

      // Llamar a la API de TTS
      const response = await fetch('/api/companion/voice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: cleanText, // ✅ Texto limpio sin emojis
          companionType: companion.type
        })
      })

      if (!response.ok) {
        console.error('Error generando voz')
        setIsSpeaking(false)
        return
      }

      const data = await response.json()

      if (!data.success) {
        console.error('Error en respuesta de voz:', data.error)
        setIsSpeaking(false)
        return
      }

      // Actualizar emoción detectada
      if (data.emotion && onEmotionChange) {
        setCurrentEmotion(data.emotion)
        onEmotionChange(data.emotion)
      }

      // Reproducir audio
      if (data.audioUrl && audioRef.current) {
        audioRef.current.src = data.audioUrl
        await audioRef.current.play()
      }

    } catch (err: any) {
      console.error('Error reproduciendo voz:', err)
      setIsSpeaking(false)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)

    // Detectar emoción del mensaje del usuario
    const detectedUserEmotion = detectEmotion(userMessage)
    if (onEmotionChange) {
      onEmotionChange(detectedUserEmotion)
    }

    // Actualizar emoción del componente
    setCurrentEmotion(detectedUserEmotion)

    // Agregar mensaje del usuario inmediatamente
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      emotion_detected: detectedUserEmotion,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      // Construir historial de chat para contexto
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const res = await fetch('/api/chat-emocional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          chatHistory: chatHistory
        })
      })

      if (!res.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      // Leer respuesta como stream
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let assistantResponse = ''

      // Crear mensaje del asistente vacío inicialmente
      const assistantMsgId = `assistant-${Date.now()}`
      setMessages(prev => [...prev, {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString()
      }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content || ''
                if (content) {
                  assistantResponse += content
                  // Actualizar el mensaje del asistente en tiempo real
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMsgId 
                      ? { ...msg, content: assistantResponse }
                      : msg
                  ))
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      // Detectar emoción y reproducir voz de la respuesta completa del asistente
      if (assistantResponse) {
        const assistantEmotion = detectEmotion(assistantResponse)
        setCurrentEmotion(assistantEmotion)
        
        if (onEmotionChange) {
          setTimeout(() => {
            onEmotionChange(assistantEmotion)
          }, 300)
        }

        // Reproducir voz automáticamente
        if (voiceEnabled) {
          setTimeout(() => {
            playVoice(assistantResponse)
          }, 500)
        }
      }

    } catch (error) {
      console.error('Error en la comunicación:', error)
      // Mostrar mensaje de error al usuario
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un problema con la conexión. Por favor, intenta de nuevo.',
        created_at: new Date().toISOString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getEmotionEmoji = (emotion?: string) => {
    const emojiMap: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      angry: '😠',
      calm: '😌',
      confused: '😕',
      neutral: '🙂'
    }
    return emotion ? emojiMap[emotion] || '💭' : '💭'
  }

  // Obtener animación de emoción actual
  const emotionVisuals = getEmotionAnimation(currentEmotion)

  return (
    <div className="flex flex-col h-full relative">
      {/* Alerta de riesgo */}
      <AnimatePresence>
        {showRiskAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 flex-shrink-0 z-10"
          >
            <Alert className="border-red-300 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-900 text-sm">
                {riskLevel === 'high' ? (
                  <>
                    Detecté que estás pasando por un momento muy difícil. Por favor, considera contactar con un profesional:
                    <div className="mt-2 font-semibold">
                      📞 Línea de la Vida: 900 925 555 (24h, gratuita)
                    </div>
                  </>
                ) : (
                  'Estoy aquí para apoyarte. Recuerda que no estás solo/a y que hay ayuda disponible.'
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowRiskAlert(false)}
                  className="ml-2"
                >
                  Cerrar
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banner de privacidad y control de voz */}
      <div className="p-3 border-b flex-shrink-0 flex items-center justify-between" style={{
        background: `linear-gradient(90deg, ${theme.from}15 0%, ${theme.to}15 100%)`,
        borderColor: `${theme.from}30`
      }}>
        <p className="text-xs font-medium" style={{ color: theme.to }}>
          🔒 <strong>Privado</strong> • Voces expresivas automáticas
        </p>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className="h-7 px-2 hover:bg-white/50"
          title={voiceEnabled ? 'Desactivar voz' : 'Activar voz'}
        >
          {voiceEnabled ? (
            <Volume2 className="w-4 h-4" style={{ color: theme.from }} />
          ) : (
            <VolumeX className="w-4 h-4 text-gray-400" />
          )}
        </Button>
      </div>

      {/* Audio element oculto */}
      <audio
        ref={audioRef}
        onEnded={() => setIsSpeaking(false)}
        onError={() => setIsSpeaking(false)}
        className="hidden"
      />

      {/* Partículas emocionales de fondo */}
      {isSpeaking && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <EmotionParticles 
            emotion={currentEmotion}
            companionType={companion.type}
          />
        </div>
      )}

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="space-y-4">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 px-4"
            >
              <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: theme.from }} />
              <p className="font-medium mb-2" style={{ color: theme.to }}>
                Hola, soy {companion.name} ✨
              </p>
              <p className="text-sm opacity-80" style={{ color: theme.to }}>
                Estoy aquí para acompañarte en tu proceso. Puedes compartir lo que sientas con total confianza y privacidad.
              </p>
            </motion.div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[80%] rounded-2xl px-4 py-3 shadow-sm"
                style={msg.role === 'user' ? {
                  background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
                  color: 'white'
                } : {
                  background: 'white',
                  border: `1px solid ${theme.from}30`,
                  color: theme.to
                }}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
                
                {msg.emotion_detected && msg.role === 'user' && (
                  <div className="mt-2 text-xs opacity-70">
                    {getEmotionEmoji(msg.emotion_detected)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white rounded-2xl px-5 py-4 shadow-lg" style={{
                border: `2px solid ${theme.from}30`
              }}>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <motion.span 
                      className="w-3 h-3 rounded-full" 
                      style={{
                        background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`
                      }}
                      animate={{ y: [-3, 3, -3], scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.span 
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`
                      }}
                      animate={{ y: [-3, 3, -3], scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    />
                    <motion.span 
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`
                      }}
                      animate={{ y: [-3, 3, -3], scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    />
                  </div>
                  <span className="text-xs font-medium" style={{ color: theme.to }}>{companion.name} está escribiendo...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Indicador de voz activa */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-4 pb-2 flex items-center justify-center gap-2"
            style={{ color: theme.from }}
          >
            <motion.div
              className="flex gap-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{ backgroundColor: theme.from }}
                  animate={{
                    height: [`${10 + Math.random() * 10}px`, `${15 + Math.random() * 15}px`, `${10 + Math.random() * 10}px`]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
            <span className="text-xs font-medium">{getEmotionDescription(currentEmotion)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Área de input personalizada */}
      <div className="p-4 border-t flex-shrink-0" style={{
        borderColor: `${theme.from}30`,
        background: `linear-gradient(180deg, ${theme.from}08 0%, ${theme.from}15 100%)`
      }}>
        <div className="flex gap-2 items-end">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Escribe a ${companion.name}...`}
            className="resize-none bg-white"
            style={{
              borderColor: `${theme.from}40`,
              outline: 'none'
            }}
            rows={2}
            disabled={isLoading || isSpeaking}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading || isSpeaking}
            className="text-white shrink-0 hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`
            }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs mt-2 text-center opacity-70" style={{ color: theme.to }}>
          {isSpeaking ? 'Escuchando...' : 'Presiona Enter para enviar • Shift+Enter para nueva línea'}
        </p>
      </div>
    </div>
  )
}
