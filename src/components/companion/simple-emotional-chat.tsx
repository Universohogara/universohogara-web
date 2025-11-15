

/**
 * Chat Emocional Simplificado
 * Con voces mágicas automáticas y auras emocionales sutiles
 * ACTUALIZADO: Sistema mejorado con control de reproducción
 * 
 * CAMBIOS CLAVE:
 * - ✅ El audio solo se reproduce cuando el mensaje está COMPLETO
 * - ✅ Se detiene cualquier audio previo antes de reproducir uno nuevo
 * - ✅ Mejor sincronización entre texto escrito y voz hablada
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, MessageCircle, Send, Volume2, Loader2, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { detectEmotion, type DetectedEmotion } from '@/lib/emotion-detector'
import { cleanTextForSpeech } from '@/lib/text-cleaner'
import { getVoiceConfig } from '@/lib/voice-config'
import { usesPiperTTS, playPiperAudio } from '@/lib/piper-tts-service'
import { usesPuterTTS, playPuterAudio, stopCurrentAudio } from '@/lib/puter-tts-service'
import { getCompanionColors } from '@/lib/companion-colors'
import Image from 'next/image'
import EmotionParticles from './emotion-particles'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  emotion?: DetectedEmotion
  timestamp: Date
}

interface SimpleEmotionalChatProps {
  companion: {
    id: string
    type: string
    name: string
    personality: string
  }
  onEmotionChange?: (emotion: DetectedEmotion) => void
}

export function SimpleEmotionalChat({ companion, onEmotionChange }: SimpleEmotionalChatProps) {
  // Estados
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [mode, setMode] = useState<'text' | 'voice'>('voice') // MODO VOZ POR DEFECTO
  const [currentEmotion, setCurrentEmotion] = useState<DetectedEmotion>('calm')
  const [micSupported, setMicSupported] = useState(false)
  const [voicesLoaded, setVoicesLoaded] = useState(false)

  // Referencias
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 🎨 Obtener colores personalizados del companion
  const colors = getCompanionColors(companion.type)

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cargar voces del navegador
  useEffect(() => {
    if ('speechSynthesis' in window) {
      console.log('🎤 Inicializando sistema de voces...')
      
      // Cargar voces
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          setVoicesLoaded(true)
          console.log('═══════════════════════════════════════════')
          console.log('✅ VOCES CARGADAS EXITOSAMENTE')
          console.log('═══════════════════════════════════════════')
          console.log(`📋 Total de voces: ${voices.length}`)
          
          // Log de voces en español
          const spanishVoices = voices.filter(v => 
            v.lang.includes('es') || v.lang.includes('ES')
          )
          console.log(`🇪🇸 Voces en español disponibles: ${spanishVoices.length}`)
          
          if (spanishVoices.length > 0) {
            console.log('Lista de voces en español:')
            spanishVoices.forEach((v, i) => {
              console.log(`  ${i + 1}. ${v.name} (${v.lang})`)
            })
          } else {
            console.warn('⚠️ No se encontraron voces en español')
          }
          console.log('═══════════════════════════════════════════')
        }
      }

      // Cargar inmediatamente
      loadVoices()

      // Y también cuando se dispare el evento (algunos navegadores lo necesitan)
      window.speechSynthesis.onvoiceschanged = loadVoices
      
      // Forzar carga después de un momento (para navegadores que tardan)
      setTimeout(() => {
        if (!voicesLoaded) {
          console.log('⏰ Intentando cargar voces de nuevo...')
          loadVoices()
        }
      }, 1000)
    } else {
      console.error('❌ speechSynthesis NO está disponible en este navegador')
    }
  }, [voicesLoaded])

  // Inicializar reconocimiento de voz
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.lang = 'es-ES'
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.maxAlternatives = 1

      recognitionRef.current.onstart = () => {
        console.log('✅ Micrófono iniciado correctamente')
        setIsListening(true)
      }

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        console.log('📝 Transcripción:', transcript)
        setInputText(transcript)
        setIsListening(false)
        // Auto-enviar después de transcribir
        setTimeout(() => handleSendMessage(transcript), 300)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('❌ Error de reconocimiento:', event.error)
        setIsListening(false)
        
        // Mensajes específicos para cada error
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          toast.error('🎤 Necesito acceso al micrófono. Por favor permite el acceso en tu navegador.')
        } else if (event.error === 'no-speech') {
          toast('🎤 No escuché nada. Intenta de nuevo.', { duration: 2000 })
        } else if (event.error === 'audio-capture') {
          toast.error('❌ No se pudo acceder al micrófono. Verifica que esté conectado.')
        } else if (event.error === 'network') {
          toast.error('❌ Error de red. Verifica tu conexión.')
        } else if (event.error !== 'aborted') {
          // Solo mostrar si no fue abortado intencionalmente
          toast.error('Error al escuchar. Intenta otra vez.')
        }
      }

      recognitionRef.current.onend = () => {
        console.log('🎤 Reconocimiento finalizado')
        setIsListening(false)
      }

      setMicSupported(true)
      
      // Solicitar permisos del micrófono de forma anticipada
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            console.log('✅ Permisos del micrófono otorgados')
          })
          .catch((err) => {
            console.warn('⚠️ No se pudieron obtener permisos del micrófono:', err)
          })
      }
    } else {
      console.warn('⚠️ Reconocimiento de voz no soportado')
      setMode('text') // Fallback a modo texto
    }
  }, [])

  // Limpiar recursos al desmontar
  useEffect(() => {
    return () => {
      // Detener síntesis de voz
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      
      // Detener cualquier audio de Puter.js
      stopCurrentAudio()
      
      // Detener reconocimiento de voz
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop()
      }
      
      // Limpiar audio (legacy, ya no se usa)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [isListening])

  /**
   * Iniciar/detener escucha por voz
   */
  const toggleListening = async () => {
    if (!recognitionRef.current) {
      toast.error('Tu navegador no soporta reconocimiento de voz')
      setMode('text')
      return
    }

    if (isListening) {
      try {
        recognitionRef.current.stop()
        setIsListening(false)
      } catch (error) {
        console.error('Error al detener reconocimiento:', error)
        setIsListening(false)
      }
    } else {
      try {
        // Verificar permisos del micrófono primero
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true })
            console.log('✅ Permisos del micrófono confirmados')
          } catch (permError) {
            console.error('❌ Permisos denegados:', permError)
            toast.error('🎤 Necesito acceso al micrófono. Permite el acceso en tu navegador.')
            return
          }
        }

        // Intentar iniciar reconocimiento
        recognitionRef.current.start()
        // El estado se actualiza en el evento onstart
        toast.success('🎤 Escuchando... habla ahora', { duration: 2000 })
      } catch (error: any) {
        console.error('Error al iniciar reconocimiento:', error)
        
        // Manejo específico de errores
        if (error.message && error.message.includes('already')) {
          // Ya está escuchando - reiniciar
          try {
            recognitionRef.current.stop()
            setTimeout(() => {
              recognitionRef.current.start()
            }, 100)
          } catch (e) {
            console.error('Error al reiniciar:', e)
            setIsListening(false)
            toast.error('Error al activar el micrófono. Recarga la página.')
          }
        } else {
          setIsListening(false)
          toast.error('No se pudo activar el micrófono. Intenta otra vez.')
        }
      }
    }
  }

  /**
   * Reproducir respuesta con VOZ MÁGICA
   * - FEMENINAS CON Puter.js: Ada, Luna, Aurora, Coral
   * - MASCULINAS: Web Speech API (voces del navegador)
   * 
   * ⚠️ IMPORTANTE: Solo se llama cuando el mensaje está COMPLETO
   */
  const playVoiceResponse = async (text: string, emotion: DetectedEmotion) => {
    try {
      // Limpiar texto antes de sintetizar (quitar emojis)
      const cleanText = cleanTextForSpeech(text)
      
      if (!cleanText || cleanText.length < 2) {
        console.log('⚠️ Texto muy corto para sintetizar')
        return
      }

      console.log('═══════════════════════════════════════════')
      console.log('🎤 INICIANDO VOZ MÁGICA')
      console.log('═══════════════════════════════════════════')
      
      // OBTENER CONFIGURACIÓN del companion
      const companionKey = companion.type.toLowerCase()
      const voiceConfig = getVoiceConfig(companionKey)
      
      console.log('Companion:', voiceConfig.realName, '(', companion.type, ')')
      console.log('Género:', voiceConfig.gender)
      console.log('⚙️ CONFIGURACIÓN DE VOZ:')
      console.log('  - usePuter:', voiceConfig.usePuter)
      console.log('  - usePiper:', voiceConfig.usePiper)
      console.log('  - gender:', voiceConfig.gender)
      console.log('Texto:', cleanText.substring(0, 100) + '...')
      
      // ⚠️ DETENER CUALQUIER AUDIO PREVIO
      console.log('⏸️ Deteniendo cualquier audio previo...')
      stopCurrentAudio()
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      
      // Pequeña pausa para asegurar que se detuvo
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // ===================================================
      // ✨ PRIORIDAD 1: Puter.js TTS (voces femeninas mágicas)
      // ===================================================
      if (voiceConfig.usePuter === true) {
        console.log('✨✨✨ USANDO PUTER.JS TTS - VOZ MÁGICA AWS POLLY ✨✨✨')
        console.log('  Personaje:', voiceConfig.realName)
        console.log('  Verificando si Puter.js está disponible...')
        
        // Verificar que Puter.js esté cargado
        if (typeof window !== 'undefined' && (window as any).puter) {
          console.log('  ✅ Puter.js detectado y disponible')
        } else {
          console.log('  ❌ Puter.js NO está cargado aún, esperando...')
        }
        
        setIsSpeaking(true)
        
        try {
          await playPuterAudio(cleanText, companionKey, emotion)
          console.log('✅ Reproducción Puter.js TTS completada con éxito')
        } catch (error) {
          console.error('❌ ERROR con Puter.js TTS:', error)
          console.log('⚠️ Usando fallback Web Speech por error')
          // Si falla Puter.js, usar Web Speech como fallback
          await playWebSpeech(cleanText, voiceConfig, companionKey)
        } finally {
          setIsSpeaking(false)
        }
        
        console.log('═══════════════════════════════════════════')
        return
      }
      
      // ===================================================
      // PRIORIDAD 2: Piper TTS (DESHABILITADO para femeninas)
      // ===================================================
      if (voiceConfig.usePiper === true && voiceConfig.gender === 'female') {
        console.log('👩 Usando Piper TTS (voz femenina natural)')
        setIsSpeaking(true)
        
        try {
          await playPiperAudio(cleanText, companionKey, emotion)
          console.log('✅ Reproducción Piper TTS completada')
        } catch (error) {
          console.error('❌ Error con Piper TTS, usando fallback Web Speech:', error)
          // Si falla Piper, usar Web Speech como fallback
          await playWebSpeech(cleanText, voiceConfig, companionKey)
        } finally {
          setIsSpeaking(false)
        }
        
        console.log('═══════════════════════════════════════════')
        return
      }
      
      // ===================================================
      // VOCES MASCULINAS: Usar Web Speech API
      // ===================================================
      console.log('👨 Usando Web Speech API (voz masculina)')
      await playWebSpeech(cleanText, voiceConfig, companionKey)
      console.log('═══════════════════════════════════════════')

    } catch (error) {
      console.error('❌ Error crítico al reproducir voz:', error)
      setIsSpeaking(false)
    }
  }

  /**
   * Reproducir con Web Speech API (voces del navegador)
   */
  const playWebSpeech = async (text: string, voiceConfig: any, companionKey: string) => {
    // Verificar soporte
    if (!('speechSynthesis' in window)) {
      console.warn('⚠️ Síntesis de voz no soportada en este navegador')
      return
    }
    
    // Detener cualquier reproducción previa
    window.speechSynthesis.cancel()
    await new Promise(resolve => setTimeout(resolve, 150))

    // Crear utterance
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.pitch = voiceConfig.pitch
    utterance.rate = voiceConfig.rate  
    utterance.volume = voiceConfig.volume

    console.log('🎛️ Configuración aplicada:')
    console.log('  - Pitch:', utterance.pitch)
    console.log('  - Rate:', utterance.rate)
    console.log('  - Volume:', utterance.volume)

    // BUSCAR VOZ EN ESPAÑOL CON FILTRO DE GÉNERO
    const voices = window.speechSynthesis.getVoices()
    console.log(`📋 Total voces disponibles: ${voices.length}`)
    
    if (voices.length > 0) {
      const spanishVoices = voices.filter(v => 
        v.lang.includes('es') || v.lang.includes('ES')
      )
      
      console.log(`🇪🇸 Voces en español: ${spanishVoices.length}`)
      
      // Filtrar por género
      const genderPreference = voiceConfig.gender
      console.log(`👤 Buscando voz ${genderPreference}`)
      
      let filteredVoices = spanishVoices
      
      if (genderPreference === 'male') {
        filteredVoices = spanishVoices.filter(v => {
          const name = v.name.toLowerCase()
          return (
            name.includes('male') ||
            name.includes('man') ||
            name.includes('hombre') ||
            name.includes('jorge') ||
            name.includes('diego') ||
            name.includes('juan')
          )
        })
        console.log(`👨 Voces masculinas encontradas: ${filteredVoices.length}`)
      }
      
      let selectedVoice: SpeechSynthesisVoice | undefined
      
      if (filteredVoices.length > 0) {
        selectedVoice = filteredVoices.find(v => v.name.toLowerCase().includes('google'))
        if (!selectedVoice) {
          selectedVoice = filteredVoices[0]
        }
      }
      
      if (!selectedVoice && spanishVoices.length > 0) {
        console.log(`⚠️ No hay voces del género ${genderPreference}, usando fallback`)
        selectedVoice = spanishVoices.find(v => v.name.toLowerCase().includes('google'))
        if (!selectedVoice) {
          selectedVoice = spanishVoices[0]
        }
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice
        console.log(`✅ Voz seleccionada: ${selectedVoice.name}`)
        console.log(`   Género: ${genderPreference}`)
        console.log(`   Pitch final: ${utterance.pitch.toFixed(2)}`)
      }
    }

    // Eventos
    utterance.onstart = () => {
      setIsSpeaking(true)
      console.log('▶️ REPRODUCCIÓN INICIADA')
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      console.log(`✅ REPRODUCCIÓN COMPLETADA`)
    }

    utterance.onerror = (error) => {
      console.error('❌ ERROR en síntesis de voz:', error)
      setIsSpeaking(false)
    }

    // REPRODUCIR
    console.log('🎵 Llamando a speechSynthesis.speak()...')
    window.speechSynthesis.speak(utterance)
  }

  /**
   * Enviar mensaje
   * ⚠️ CAMBIO IMPORTANTE: La voz solo se reproduce cuando el mensaje está COMPLETO
   */
  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText
    
    if (!textToSend.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      // Enviar a la API de chat emocional
      const response = await fetch('/api/chat-emocional', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          companionType: companion.type,
          companionName: companion.name,
          companionPersonality: companion.personality
        })
      })

      if (!response.ok) {
        throw new Error('Error al enviar mensaje')
      }

      // ⚠️ CAMBIO CLAVE: Esperar a que el streaming esté COMPLETO
      // Leer respuesta streaming
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''
      let detectedEmotion: DetectedEmotion = 'calm'

      console.log('📥 Leyendo respuesta en streaming...')

      while (true) {
        const { done, value } = await reader!.read()
        if (done) {
          console.log('✅ Streaming completado')
          break
        }

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content || ''
              assistantMessage += content
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // ✅ AQUÍ EL MENSAJE ESTÁ COMPLETO
      console.log('📝 Mensaje completo recibido:', assistantMessage.substring(0, 50) + '...')

      // Detectar emoción del mensaje completo
      detectedEmotion = detectEmotion(assistantMessage)
      setCurrentEmotion(detectedEmotion)
      
      // Notificar al padre sobre el cambio de emoción
      if (onEmotionChange) {
        onEmotionChange(detectedEmotion)
      }

      // Agregar mensaje del asistente
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantMessage,
        emotion: detectedEmotion,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, newAssistantMessage])

      // ✅ REPRODUCIR VOZ SOLO CUANDO EL MENSAJE ESTÁ COMPLETO
      if (mode === 'voice') {
        console.log('🔊 Iniciando reproducción de voz para mensaje completo...')
        await playVoiceResponse(assistantMessage, detectedEmotion)
      }

    } catch (error) {
      console.error('Error al enviar mensaje:', error)
      toast.error('Hubo un error al procesar tu mensaje')
    } finally {
      setIsLoading(false)
    }
  }

  // Mapeo de imágenes según el tipo de companion
  const companionImages: Record<string, string> = {
    'ken': '/images/companions/ken.png',
    'hada': '/images/companions/companion-hada-fairy.png',
    'lumi': '/images/companions/companion-lumi-light.png',
    'draguito': '/images/companions/companion-draguito-dragon.png',
    'elfo': '/images/companions/companion-elfo-elf.png',
    'fabel': '/images/companions/companion-sprig-plant.png',
    'willow': '/images/companions/companion-willow-tree.png',
    'nimbo': '/images/companions/companion-nimbo-cloud.png',
    'unicornito': '/images/companions/companion-unicornito-unicorn.png',
    'human': '/images/companions/companion-human-warm.png'
  }

  const imagePath = companionImages[companion.type.toLowerCase()] || '/images/companions/companion-hada-fairy.png'

  return (
    <div 
      className="relative flex flex-col h-full bg-gradient-to-b to-white dark:to-gray-800"
      style={{
        background: `linear-gradient(to bottom, ${colors.primary}08, white)`,
      }}
    >
      {/* Header con información */}
      <div className="p-4 border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{companion.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              {isSpeaking && <Volume2 className="w-4 h-4 animate-pulse" />}
              {isSpeaking ? 'Hablando...' : 
               isListening ? '🎤 Escuchando...' : 
               'Listo para conversar'}
            </p>
          </div>
          
          {/* Toggle Modo: Texto / Voz */}
          <div className="flex gap-2">
            <Button
              variant={mode === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('text')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Texto
            </Button>
            {micSupported && (
              <Button
                variant={mode === 'voice' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('voice')}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Voz
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto pb-24">
          {messages.length === 0 && (
            <motion.div 
              className="text-center py-12 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="mb-2 text-lg">Hola, soy {companion.name}</p>
              <p className="text-sm">Estoy aquí para escucharte y acompañarte con mi voz mágica</p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'text-white'
                      : `bg-gradient-to-br ${colors.gradient} shadow-md border ${colors.border}`
                  }`}
                  style={message.role === 'user' ? {
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    boxShadow: `0 4px 12px ${colors.glow}`
                  } : {}}
                >
                  <p className={`text-sm whitespace-pre-wrap ${message.role === 'assistant' ? colors.text : ''}`}>
                    {message.content}
                  </p>
                  {message.role === 'assistant' && mode === 'text' && (
                    <button
                      onClick={() => playVoiceResponse(message.content, message.emotion || 'calm')}
                      className={`mt-2 flex items-center gap-1 text-xs ${colors.text} opacity-70 hover:opacity-100`}
                      disabled={isSpeaking}
                      style={{ color: colors.primary }}
                    >
                      <Play className="w-3 h-3" />
                      {isSpeaking ? 'Reproduciendo...' : 'Escuchar'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          {mode === 'text' ? (
            // Modo texto
            <div className="flex gap-2">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Escribe tu mensaje..."
                className="resize-none"
                rows={2}
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                size="lg"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            // Modo voz con micrófono mejorado
            <div className="flex flex-col items-center gap-4">
              {/* Estado y permisos del micrófono */}
              {!micSupported && (
                <div className="w-full p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                  <p className="text-sm text-amber-800">
                    ⚠️ Tu navegador no soporta reconocimiento de voz. Usa el modo texto.
                  </p>
                </div>
              )}

              <motion.div
                className="relative w-full"
                animate={isListening ? {
                  boxShadow: [
                    `0 0 0 0 ${colors.glow.replace('0.5', '0')}`,
                    `0 0 0 15px ${colors.glow}`,
                    `0 0 0 0 ${colors.glow.replace('0.5', '0')}`
                  ]
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: isListening ? Infinity : 0,
                  ease: 'easeInOut'
                }}
              >
                <Button
                  onClick={toggleListening}
                  disabled={isLoading || isSpeaking || !micSupported}
                  size="lg"
                  variant={isListening ? 'default' : 'outline'}
                  className={`w-full h-20 text-lg font-semibold transition-all text-white`}
                  style={{
                    background: isListening 
                      ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                      : isSpeaking
                      ? '#10b981'
                      : 'white',
                    borderColor: colors.primary,
                    color: isListening || isSpeaking ? 'white' : colors.primary
                  }}
                  onMouseEnter={(e) => {
                    if (!isListening && !isSpeaking && !isLoading) {
                      e.currentTarget.style.background = `${colors.primary}10`
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isListening && !isSpeaking && !isLoading) {
                      e.currentTarget.style.background = 'white'
                    }
                  }}
                >
                  {isListening ? (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <MicOff className="w-8 h-8 mr-3" />
                      </motion.div>
                      🎤 Escuchando... Habla ahora
                    </>
                  ) : isSpeaking ? (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        <Volume2 className="w-8 h-8 mr-3" />
                      </motion.div>
                      🗣️ {companion.name} está hablando...
                    </>
                  ) : isLoading ? (
                    <>
                      <Loader2 className="w-8 h-8 mr-3 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Mic className="w-8 h-8 mr-3" />
                      🎤 Toca para hablar con {companion.name}
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Feedback de transcripción con color personalizado */}
              {inputText && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full p-3 rounded-lg"
                  style={{
                    background: `${colors.primary}10`,
                    borderColor: colors.primary,
                    borderWidth: '1px'
                  }}
                >
                  <p className="text-sm text-center" style={{ color: colors.primary }}>
                    📝 &quot;{inputText}&quot;
                  </p>
                </motion.div>
              )}

              {/* Indicador de estado del sistema */}
              <div className="w-full flex items-center justify-center gap-2 text-xs text-gray-500">
                <span className={`w-2 h-2 rounded-full ${micSupported ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>{micSupported ? '✅ Micrófono disponible' : '❌ Micrófono no disponible'}</span>
                <span className="mx-2">•</span>
                <span className={`w-2 h-2 rounded-full ${voicesLoaded ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                <span>{voicesLoaded ? '✅ Voces cargadas' : '⏳ Cargando voces...'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
