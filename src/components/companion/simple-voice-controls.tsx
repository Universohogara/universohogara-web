

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DetectedEmotion } from '@/lib/emotion-detector'
import { getEmotionVisual } from '@/lib/emotion-animations'

interface SimpleVoiceControlsProps {
  companionType: string
  companionName: string
  lastMessage?: string
  detectedEmotion?: DetectedEmotion
  onVoiceToggle: (enabled: boolean) => void
  className?: string
}

export default function SimpleVoiceControls({
  companionType,
  companionName,
  lastMessage,
  detectedEmotion = 'calm',
  onVoiceToggle,
  className
}: SimpleVoiceControlsProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const visuals = getEmotionVisual(detectedEmotion)

  const handleToggleVoice = () => {
    const newState = !voiceEnabled
    setVoiceEnabled(newState)
    onVoiceToggle(newState)
    
    if (!newState && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const playVoice = async () => {
    if (!lastMessage || !voiceEnabled) return

    setIsLoading(true)
    setError(null)

    try {
      // Llamar a la API de TTS
      const response = await fetch('/api/companion/voice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: lastMessage,
          companionType
        })
      })

      if (!response.ok) {
        throw new Error('Error generando voz')
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Error desconocido')
      }

      // Reproducir audio
      if (data.audioUrl) {
        if (audioRef.current) {
          audioRef.current.src = data.audioUrl
          await audioRef.current.play()
          setIsPlaying(true)
        }
      }

    } catch (err: any) {
      console.error('Error reproduciendo voz:', err)
      setError('No puedo hablar en este momento')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (voiceEnabled && lastMessage && !isPlaying && !isLoading) {
      playVoice()
    }
  }, [lastMessage, voiceEnabled])

  return (
    <div className={className}>
      {/* Control simple de voz */}
      <div className="flex items-center justify-center gap-4 p-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleToggleVoice}
            variant={voiceEnabled ? 'default' : 'outline'}
            size="lg"
            className={`
              relative overflow-hidden rounded-full px-6 py-3
            `}
            style={{
              background: voiceEnabled ? visuals.auraColor : undefined
            }}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : isPlaying ? (
              <Volume2 className="h-5 w-5 mr-2 animate-pulse" />
            ) : voiceEnabled ? (
              <Volume2 className="h-5 w-5 mr-2" />
            ) : (
              <VolumeX className="h-5 w-5 mr-2" />
            )}
            
            <span className="font-medium">
              {isPlaying ? 'Hablando...' : voiceEnabled ? 'Modo Voz Activado' : 'Activar Voz'}
            </span>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-6 py-3"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            <span className="font-medium">Modo Chat</span>
          </Button>
        </motion.div>
      </div>

      {/* Indicador de emoción actual */}
      <AnimatePresence>
        {voiceEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center text-sm text-gray-600 mt-2"
          >
            {isPlaying && (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {companionName} te está hablando...
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje de error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center text-sm text-red-600 mt-2"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio element oculto */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false)
          setError('Error al reproducir audio')
        }}
        className="hidden"
      />
    </div>
  )
}
