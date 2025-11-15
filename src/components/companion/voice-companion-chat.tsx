
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeX, AlertTriangle, Settings as SettingsIcon } from 'lucide-react'
import { soundManager } from '@/lib/sound-manager'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import Image from 'next/image'
// Importación de panel de voz mágica removida - ya no se usa
import { VoiceState, determineVoiceState, VoiceStatus } from '@/lib/voice-state-manager'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  emotion_detected?: string
  risk_detected?: boolean
  risk_level?: string
  created_at: string
  isVoice?: boolean
}

interface VoiceCompanionChatProps {
  companion: {
    id: string
    type: string
    name: string
    voice_tone: string
    personality: string
  }
}

export function VoiceCompanionChat({ companion }: VoiceCompanionChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showTranscript, setShowTranscript] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState([0.8])
  const [showRiskAlert, setShowRiskAlert] = useState(false)
  const [riskLevel, setRiskLevel] = useState<string | null>(null)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Estados del sistema narrativo de voz mágica
  const [voiceState, setVoiceState] = useState<VoiceState>('basic')
  const [showVoicePanel, setShowVoicePanel] = useState(false)
  const [showAwakenedNotification, setShowAwakenedNotification] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus | null>(null)
  
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const companionImage = `/images/companions/companion-${companion.type}-${
    companion.type === 'human' ? 'warm' :
    companion.type === 'lumi' ? 'light' :
    companion.type === 'nimbo' ? 'cloud' :
    companion.type === 'fabel' ? 'animal' :
    companion.type === 'sprig' ? 'plant' :
    companion.type === 'hada' ? 'fairy' :
    companion.type === 'elfo' ? 'elf' :
    companion.type === 'draguito' ? 'dragon' :
    'unicorn'
  }.png`

  // Verificar soporte de voz
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean | null>(null)

  // Inicializar Web Speech API
  useEffect(() => {
    // Verificar soporte
    const hasWebkitSpeech = typeof window !== 'undefined' && 'webkitSpeechRecognition' in window
    const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window
    
    setVoiceSupported(hasWebkitSpeech && hasSpeechSynthesis)
    
    if (!hasWebkitSpeech) {
      console.error('❌ Web Speech API no soportado en este navegador')
      return
    }

    // Verificar dispositivos de audio disponibles
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Primero verificar si hay dispositivos de audio
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const audioInputs = devices.filter(device => device.kind === 'audioinput')
          console.log('🎤 Dispositivos de audio encontrados:', audioInputs.length)
          
          if (audioInputs.length === 0) {
            console.error('❌ No se encontró ningún micrófono conectado')
            setMicPermissionGranted(false)
            return Promise.reject(new Error('No se encontró ningún micrófono conectado'))
          }
          
          // Si hay dispositivos, solicitar permisos
          return navigator.mediaDevices.getUserMedia({ audio: true })
        })
        .then(() => {
          console.log('✅ Permisos de micrófono concedidos')
          setMicPermissionGranted(true)
          
          // Inicializar reconocimiento de voz
          const SpeechRecognition = (window as any).webkitSpeechRecognition
          const recognition = new SpeechRecognition()
          
          recognition.continuous = true
          recognition.interimResults = true
          recognition.lang = 'es-ES'
          recognition.maxAlternatives = 1
          
          recognition.onstart = () => {
            console.log('🎤 Micrófono activado')
            setIsListening(true)
          }
          
          recognition.onresult = (event: any) => {
            let interimTranscript = ''
            let finalTranscript = ''
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript
              
              if (event.results[i].isFinal) {
                finalTranscript += transcript
                console.log('✅ Texto detectado:', transcript)
              } else {
                interimTranscript += transcript
              }
            }
            
            // Mostrar transcripción en tiempo real
            const displayText = finalTranscript || interimTranscript
            setCurrentTranscript(displayText)
            
            // Si hay transcripción final, preparar envío
            if (finalTranscript.trim()) {
              if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current)
              }
              
              // Enviar después de un breve silencio (1.2 segundos)
              silenceTimeoutRef.current = setTimeout(() => {
                console.log('📤 Enviando mensaje al servidor...')
                sendVoiceMessage(finalTranscript)
                setCurrentTranscript('')
              }, 1200)
            }
          }
          
          recognition.onerror = (event: any) => {
            console.error('❌ Error en reconocimiento de voz:', event.error)
            
            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
              setMicPermissionGranted(false)
              console.warn('⚠️ Permisos de micrófono denegados. El usuario debe permitir el acceso.')
            } else if (event.error === 'no-speech') {
              console.warn('⏸️ No se detectó habla')
            } else {
              console.warn('⚠️ Error en reconocimiento:', event.error)
            }
            
            setIsListening(false)
          }
          
          recognition.onend = () => {
            console.log('🎤 Reconocimiento terminado')
            setIsListening(false)
          }
          
          recognitionRef.current = recognition
        })
        .catch((error) => {
          console.error('❌ Error al solicitar permisos de micrófono:', error)
          setMicPermissionGranted(false)
          console.warn('⚠️ No se pudo acceder al micrófono. Verifica permisos del navegador.')
        })
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
      }
    }
  }, [])

  // Cargar historial al iniciar
  useEffect(() => {
    loadHistory()
  }, [])

  // Auto-scroll
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Verificar estado de voz del usuario
  useEffect(() => {
    const checkVoiceStatus = async () => {
      try {
        const res = await fetch('/api/companion/generate-voice')
        if (res.ok) {
          const data = await res.json()
          const status: VoiceStatus = {
            state: 'basic',
            hasOwnApiKey: data.hasOwnApiKey || false,
            minutesUsed: data.minutesUsed || 0,
            minutesLimit: data.minutesLimit || 100,
            isPremium: data.isPremium || false,
            canUseRealisticVoice: data.canUseVoice || false
          }
          
          setVoiceStatus(status)
          const newState = determineVoiceState(status)
          setVoiceState(newState)
          
          // Mostrar panel si está en estado básico y nunca lo ha visto
          if (newState === 'basic' && !localStorage.getItem('voice_panel_seen')) {
            setTimeout(() => setShowVoicePanel(true), 2000) // Mostrar después de 2 segundos
          }
          
          // Si acaba de despertar la voz, mostrar notificación
          const justAwakened = localStorage.getItem('voice_just_awakened')
          if (justAwakened === 'true' && newState === 'awakened') {
            setShowAwakenedNotification(true)
            localStorage.removeItem('voice_just_awakened')
            setTimeout(() => setShowAwakenedNotification(false), 5000)
          }
        }
      } catch (error) {
        console.error('Error verificando estado de voz:', error)
      }
    }
    
    checkVoiceStatus()
    
    // Verificar cada minuto por si el usuario configura su API key
    const interval = setInterval(checkVoiceStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/companion/chat')
      const data = await res.json()
      
      if (data.conversations) {
        setMessages(data.conversations)
      }
    } catch (error) {
      console.error('Error al cargar historial:', error)
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      console.warn('⚠️ Tu navegador no soporta reconocimiento de voz. Por favor usa Chrome o Edge.')
      return
    }
    
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
      }
    } else {
      // Sonido al empezar a escuchar
      soundManager.playListenStart()
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const sendVoiceMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return

    console.log('💬 Procesando mensaje:', text)
    setIsProcessing(true)
    setCurrentTranscript('')

    // Detener reconocimiento mientras procesa
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
    }

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
      isVoice: true
    }
    setMessages(prev => [...prev, userMessage])

    try {
      console.log('📡 Enviando al servidor...')
      const res = await fetch('/api/companion/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`)
      }

      const data = await res.json()
      console.log('✅ Respuesta recibida del servidor')

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        emotion_detected: data.emotion_detected,
        risk_detected: data.risk_detected,
        risk_level: data.risk_level,
        created_at: new Date().toISOString(),
        isVoice: true
      }
      setMessages(prev => [...prev, assistantMessage])

      // Hablar la respuesta
      if (!isMuted && data.message) {
        console.log('🔊 Iniciando reproducción de audio...')
        speakText(data.message)
      } else if (isMuted) {
        console.log('🔇 Audio silenciado por el usuario')
      }

      // Mostrar alerta si hay riesgo
      if (data.risk_detected) {
        setShowRiskAlert(true)
        setRiskLevel(data.risk_level)
      }
    } catch (error) {
      console.error('❌ Error al procesar mensaje:', error)
      
      // Mensaje de error al usuario
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un problema al procesar tu mensaje. Por favor, intenta de nuevo.',
        created_at: new Date().toISOString(),
        isVoice: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
      
      // Reanudar reconocimiento si estaba activo
      if (isListening && recognitionRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start()
            console.log('🎤 Micrófono reactivado')
          } catch (e) {
            console.error('Error al reactivar micrófono:', e)
          }
        }, 500)
      }
    }
  }

  const speakText = async (text: string) => {
    try {
      // Importar Puter TTS service
      const { playPuterAudio, usesPuterTTS, isPuterAvailable } = await import('@/lib/puter-tts-service')
      const { getVoiceConfig } = await import('@/lib/voice-config')
      
      // Obtener configuración de voz
      const voiceConfig = getVoiceConfig(companion.type)
      
      console.log('🔊 Generando voz para:', companion.type)
      console.log('📋 Configuración de voz:', voiceConfig)
      console.log('🎭 Usa Puter TTS:', voiceConfig.usePuter)
      
      soundManager.playSpeakStart()
      setIsSpeaking(true)

      // ⚠️ VOCES FEMENINAS: SIEMPRE USAR PUTER.JS
      if (voiceConfig.usePuter && usesPuterTTS(companion.type)) {
        console.log(`✨ Usando Puter.js TTS para ${voiceConfig.realName} (FEMENINA)`)
        
        // Verificar que Puter esté disponible
        if (!isPuterAvailable()) {
          console.error('❌ Puter.js no está disponible')
          throw new Error('Puter.js no está disponible')
        }
        
        // Reproducir directamente con Puter.js (100% GRATIS)
        await playPuterAudio(text, companion.type)
        
        console.log(`✅ Voz de ${voiceConfig.realName} reproducida con éxito ✨`)
        setIsSpeaking(false)
        return
      }
      
      // Para otros personajes, usar el endpoint anterior
      console.log(`🔊 Usando API para ${companion.type}`)
      const response = await fetch('/api/companion/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          companionType: companion.type
        })
      })

      if (!response.ok) {
        throw new Error('Error al generar voz')
      }

      const data = await response.json()
      
      console.log('🎤 Respuesta de Eleven Labs:', {
        success: data.success,
        useMagicalLanguage: data.useMagicalLanguage,
        minutesUsed: data.minutesUsed,
        minutesLimit: data.minutesLimit
      })

      // Si no hay éxito (error silencioso), no hacer nada
      if (!data.success) {
        console.log('⚠️ Error generando voz, pero continuando sin audio')
        
        soundManager.playSpeakEnd()
        setIsSpeaking(false)
        setIsProcessing(false)
        
        // Reiniciar micrófono si estaba activo
        if (recognitionRef.current && !isListening) {
          setTimeout(() => {
            soundManager.playListenStart()
            recognitionRef.current?.start()
          }, 500)
        }
        return
      }

      // Reproducir audio (puede ser de ElevenLabs o Abacus)
      if (data.success && data.audioBase64) {
        const provider = data.provider || 'elevenlabs'
        console.log(`🔊 Reproduciendo audio de ${provider}`)
        
        // Convertir base64 a blob
        const audioBlob = base64ToBlob(data.audioBase64, 'audio/mpeg')
        const audioUrl = URL.createObjectURL(audioBlob)
        
        // Crear elemento de audio
        const audio = new Audio(audioUrl)
        audio.volume = volume[0]
        
        audio.onplay = () => {
          console.log('▶️ Audio iniciado')
        }
        
        audio.onended = () => {
          console.log('✅ Audio finalizado')
          URL.revokeObjectURL(audioUrl)
          soundManager.playSpeakEnd()
          setIsSpeaking(false)
          setIsProcessing(false)
          
          // Reiniciar micrófono si estaba activo
          if (recognitionRef.current && !isListening) {
            setTimeout(() => {
              soundManager.playListenStart()
              recognitionRef.current?.start()
            }, 500)
          }
        }
        
        audio.onerror = (e) => {
          console.error('❌ Error reproduciendo audio:', e)
          URL.revokeObjectURL(audioUrl)
          setIsSpeaking(false)
          setIsProcessing(false)
          alert('⚠️ Error al reproducir el audio')
        }
        
        await audio.play()
      } else {
        throw new Error('No se recibió audio válido')
      }

    } catch (error) {
      console.error('❌ Error en speakText:', error)
      soundManager.playSpeakEnd()
      setIsSpeaking(false)
      setIsProcessing(false)
      alert('⚠️ Error al generar la voz')
    }
  }

  // Helper para convertir base64 a Blob
  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const getEmotionColor = (emotion?: string) => {
    const colorMap: { [key: string]: string } = {
      happy: 'from-yellow-400 to-orange-400',
      sad: 'from-blue-400 to-indigo-500',
      anxious: 'from-purple-400 to-pink-500',
      angry: 'from-red-500 to-orange-600',
      calm: 'from-green-400 to-teal-400',
      confused: 'from-gray-400 to-slate-500',
      neutral: 'from-[#D4AF37] to-[#B8941F]'
    }
    return colorMap[emotion || 'neutral'] || colorMap.neutral
  }

  return (
    <div className="flex flex-col h-full">
      {/* Alerta de no soporte de voz */}
      {!voiceSupported && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-200"
        >
          <Alert className="border-yellow-300 bg-white/80">
            <AlertTriangle className="w-5 h-5 text-yellow-700" />
            <AlertDescription className="text-yellow-900 text-sm">
              <div className="font-bold text-base mb-2">⚠️ Navegador no compatible</div>
              <p className="mb-2">El chat por voz no está disponible en tu navegador actual.</p>
              <div className="bg-white/60 rounded-lg p-3 text-xs">
                <p className="mb-2"><strong>Navegadores compatibles:</strong></p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Google Chrome (recomendado)</li>
                  <li>Microsoft Edge</li>
                  <li>Opera</li>
                </ul>
              </div>
              <p className="mt-3 text-xs opacity-75">
                💡 <strong>Tip:</strong> Puedes usar el chat de texto haciendo clic en el botón 💬 arriba
              </p>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Alerta de permisos denegados o micrófono no encontrado */}
      {voiceSupported && micPermissionGranted === false && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200"
        >
          <Alert className="border-red-300 bg-white/80">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <AlertDescription className="text-red-900 text-sm">
              <div className="font-bold text-base mb-2">🎤 Problema con el micrófono</div>
              <p className="mb-3">No se puede acceder al micrófono. Esto puede ocurrir por dos razones:</p>
              
              {/* Razón 1: No hay micrófono conectado */}
              <div className="bg-white/60 rounded-lg p-3 mb-3">
                <p className="font-bold text-red-700 mb-2">📍 Opción 1: Verificar si tu micrófono está conectado</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-red-600 mt-0.5">•</span>
                    <span><strong>Windows:</strong> Ve a Configuración → Sistema → Sonido → Entrada. Verifica que aparezca un micrófono en la lista y que esté habilitado.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-red-600 mt-0.5">•</span>
                    <span><strong>Mac:</strong> Ve a Preferencias del Sistema → Sonido → Entrada. Asegúrate de que haya un micrófono seleccionado.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-red-600 mt-0.5">•</span>
                    <span>Si usas auriculares con micrófono, verifica que estén bien conectados.</span>
                  </div>
                </div>
              </div>

              {/* Razón 2: Permisos del navegador */}
              <div className="bg-white/60 rounded-lg p-3">
                <p className="font-bold text-red-700 mb-2">📍 Opción 2: Permitir acceso al micrófono en el navegador</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-red-600 mt-0.5">1.</span>
                    <span>Haz clic en el <strong>icono de candado 🔒</strong> (o micrófono 🎤) en la barra de direcciones</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-red-600 mt-0.5">2.</span>
                    <span>Busca "Micrófono" y selecciona <strong>"Permitir"</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-red-600 mt-0.5">3.</span>
                    <span>Recarga la página (F5 o Ctrl+R)</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-red-300/50">
                <p className="text-xs text-red-700">
                  💡 <strong>Mientras tanto:</strong> Puedes usar el chat de texto haciendo clic en el botón 💬 arriba
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Alerta de riesgo */}
      <AnimatePresence>
        {showRiskAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4"
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
                  'Estoy aquí para apoyarte. Recuerda que no estás solo/a.'
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

      {/* Área principal: Avatar + Controles */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#F5F0E8] to-white relative overflow-hidden">
        {/* Efecto de fondo animado */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full bg-[#D4AF37]/5"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 2
              }}
              style={{
                left: `${20 * i}%`,
                top: `${15 * i}%`,
              }}
            />
          ))}
        </div>

        {/* Avatar del acompañante */}
        <motion.div 
          className="relative z-10 mb-8"
          animate={{
            scale: isSpeaking ? [1, 1.05, 1] : 1,
            y: isSpeaking ? [0, -5, 0] : 0,
          }}
          transition={{
            duration: isSpeaking ? 0.6 : 0,
            repeat: isSpeaking ? Infinity : 0,
            ease: 'easeInOut'
          }}
        >
          {/* Glow effect cuando habla */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.3 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute inset-0 bg-gradient-to-r ${getEmotionColor(messages[messages.length - 1]?.emotion_detected)} rounded-full blur-3xl`}
              />
            )}
          </AnimatePresence>

          {/* Avatar principal */}
          <div className="relative w-64 h-64 rounded-full overflow-hidden bg-white shadow-2xl border-4 border-[#D4AF37]/30">
            <Image
              src={companionImage}
              alt={companion.name}
              fill
              className="object-cover"
            />
            
            {/* Overlay de onda de voz */}
            {isSpeaking && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/30 to-transparent"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            )}
          </div>

          {/* Indicador de estado */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            <div className={`px-4 py-2 rounded-full ${
              isListening ? 'bg-red-500' :
              isSpeaking ? 'bg-green-500' :
              'bg-gray-400'
            } text-white text-sm font-medium shadow-lg flex items-center gap-2`}>
              {isListening && <Mic className="w-4 h-4 animate-pulse" />}
              {isSpeaking && <Volume2 className="w-4 h-4 animate-pulse" />}
              {isListening ? 'Escuchando...' : isSpeaking ? 'Hablando...' : 'En espera'}
            </div>
          </div>
        </motion.div>

        {/* Nombre del acompañante */}
        <h3 className="text-2xl font-serif text-[#8B7355] mb-2 z-10">
          {companion.name}
        </h3>
        <p className="text-sm text-[#A0826D] mb-6 z-10">
          {companion.personality.charAt(0).toUpperCase() + companion.personality.slice(1)} • {companion.voice_tone.charAt(0).toUpperCase() + companion.voice_tone.slice(1)}
        </p>

        {/* Transcripción en tiempo real */}
        {isListening && currentTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-[#E8DCC8] max-w-md z-10"
          >
            <p className="text-sm text-[#8B7355]">
              "{currentTranscript}"
            </p>
          </motion.div>
        )}

        {/* Controles de voz */}
        <div className="flex gap-4 items-center z-10 mt-8">
          <Button
            onClick={toggleListening}
            disabled={isProcessing}
            size="lg"
            className={`
              w-16 h-16 rounded-full shadow-2xl
              ${isListening 
                ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                : 'bg-gradient-to-br from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37]'
              }
              text-white transition-all duration-300
              ${isListening ? 'animate-pulse' : ''}
            `}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          <Button
            onClick={toggleMute}
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-[#E8DCC8] hover:border-[#D4AF37] bg-white/80 backdrop-blur"
          >
            {isMuted ? <VolumeX className="w-6 h-6 text-[#8B7355]" /> : <Volume2 className="w-6 h-6 text-[#8B7355]" />}
          </Button>

          <Button
            onClick={() => setShowTranscript(!showTranscript)}
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-[#E8DCC8] hover:border-[#D4AF37] bg-white/80 backdrop-blur"
          >
            {showTranscript ? <Video className="w-6 h-6 text-[#8B7355]" /> : <VideoOff className="w-6 h-6 text-[#8B7355]" />}
          </Button>
        </div>

        {/* Control de volumen */}
        {!isMuted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg z-10"
          >
            <Volume2 className="w-4 h-4 text-[#8B7355]" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={1}
              step={0.1}
              className="w-32"
            />
          </motion.div>
        )}

        {/* Instrucciones */}
        {!isListening && !isSpeaking && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6 z-10 max-w-md"
          >
            {voiceSupported && micPermissionGranted === true ? (
              <>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <p className="text-lg text-green-800 font-bold mb-3 flex items-center gap-2">
                    <span className="text-2xl">✨</span> ¡Todo listo para hablar con {companion.name}!
                  </p>
                  <div className="space-y-3 text-sm text-green-700">
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">🎤</span>
                      <div>
                        <strong>Paso 1:</strong> Pulsa el micrófono dorado grande
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">💬</span>
                      <div>
                        <strong>Paso 2:</strong> Habla con naturalidad y tranquilidad
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">⏸️</span>
                      <div>
                        <strong>Paso 3:</strong> Haz una pausa de 2 segundos para enviar
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-green-300/50">
                    <p className="text-xs text-green-600 flex items-center gap-2">
                      <span>🔒</span> Todas tus conversaciones son 100% privadas y confidenciales
                    </p>
                  </div>
                </div>
              </>
            ) : voiceSupported && micPermissionGranted === null ? (
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border-2 border-gray-200">
                <p className="text-base text-gray-700 flex items-center gap-2">
                  <span className="animate-spin text-xl">⏳</span> Cargando sistema de voz...
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200">
                <p className="text-sm text-red-700">
                  ⚠️ Por favor, revisa los permisos arriba para usar el chat por voz.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Transcripción de mensajes (opcional) */}
      {showTranscript && messages.length > 0 && (
        <div className="border-t border-[#E8DCC8] bg-white/50 backdrop-blur-sm">
          <ScrollArea className="h-48 p-4">
            <div className="space-y-3">
              {messages.slice(-5).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[80%] rounded-2xl px-4 py-2 text-sm
                      ${msg.role === 'user'
                        ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8941F] text-white'
                        : 'bg-white border border-[#E8DCC8] text-[#8B7355]'
                      }
                    `}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
        </div>
      )}

      {/* Panel de voz mágica eliminado - sistema ahora usa fallback automático a Abacus */}
    </div>
  )
}
