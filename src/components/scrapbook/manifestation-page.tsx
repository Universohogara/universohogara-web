
'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Heart, Star, Moon, Sun } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { getSoundManager } from '@/lib/scrapbook-sounds'
import Image from 'next/image'

interface ManifestationPageProps {
  pageId: string
  onSave: (data: any) => Promise<void>
}

const MANIFESTATION_PROMPTS = [
  '✨ ¿Qué quieres crear en tu vida este mes?',
  '💫 ¿Cómo te quieres sentir cada día?',
  '🌟 ¿Qué sueño grande estás llamando a tu realidad?',
  '🦋 ¿Qué limitación estás lista para soltar?',
  '🌙 ¿Qué versión de ti misma estás manifestando?'
]

export default function ManifestationPage({ pageId, onSave }: ManifestationPageProps) {
  const [manifestations, setManifestations] = useState<Record<number, string>>({})
  const [selectedPrompt, setSelectedPrompt] = useState(0)
  const [isRitualMode, setIsRitualMode] = useState(false)
  const soundManager = getSoundManager()

  const handleSave = async () => {
    try {
      await onSave({ manifestations, ritualMode: isRitualMode })
      toast.success('✨ Tus manifestaciones han sido selladas con magia')
      soundManager.play('magic_sparkle', 0.3)
    } catch (error) {
      toast.error('Error al guardar manifestaciones')
    }
  }

  const toggleRitualMode = () => {
    setIsRitualMode(!isRitualMode)
    soundManager.play('magic_sparkle', 0.2)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative min-h-screen p-8 transition-all duration-700 ${
        isRitualMode 
          ? 'bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950' 
          : 'bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50'
      }`}
    >
      {/* Textura de fondo */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/scrapbook/textures/aged-paper.jpg"
          alt="Paper texture"
          fill
          className="object-cover"
        />
      </div>

      {/* Partículas mágicas en modo ritual */}
      {isRitualMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-purple-300"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 4,
              ease: 'easeInOut'
            }}
          >
            <Sparkles className={`h-16 w-16 mx-auto ${
              isRitualMode ? 'text-purple-300' : 'text-amber-500'
            }`} />
          </motion.div>

          <h1 className={`text-4xl font-serif ${
            isRitualMode ? 'text-purple-100' : 'text-amber-900'
          }`}>
            Página de Manifestación
          </h1>

          <p className={`text-lg font-light ${
            isRitualMode ? 'text-purple-200' : 'text-amber-700'
          }`}>
            Habla con tu Yo Superior. La magia empieza en el papel.
          </p>

          {/* Toggle modo ritual */}
          <div className="flex justify-center gap-3 pt-4">
            <Button
              variant={isRitualMode ? 'outline' : 'default'}
              onClick={toggleRitualMode}
              className={isRitualMode ? 'border-purple-300 text-purple-200' : ''}
            >
              <Sun className="h-4 w-4 mr-2" />
              Modo Luz
            </Button>
            <Button
              variant={!isRitualMode ? 'outline' : 'default'}
              onClick={toggleRitualMode}
              className={!isRitualMode ? '' : 'bg-purple-600 hover:bg-purple-700'}
            >
              <Moon className="h-4 w-4 mr-2" />
              Modo Ritual
            </Button>
          </div>
        </div>

        {/* Prompts de manifestación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MANIFESTATION_PROMPTS.map((prompt, index) => (
            <Card 
              key={index}
              className={`p-6 cursor-pointer transition-all duration-300 ${
                isRitualMode 
                  ? 'bg-purple-900/30 border-purple-500/30 hover:bg-purple-900/50 backdrop-blur-sm' 
                  : 'bg-white/80 border-amber-200 hover:shadow-xl hover:border-amber-400'
              } ${selectedPrompt === index ? 'ring-2 ring-amber-400' : ''}`}
              onClick={() => setSelectedPrompt(index)}
            >
              <div className="space-y-3">
                <h3 className={`font-serif text-lg ${
                  isRitualMode ? 'text-purple-100' : 'text-amber-900'
                }`}>
                  {prompt}
                </h3>
                <Textarea
                  value={manifestations[index] || ''}
                  onChange={(e) => setManifestations({ ...manifestations, [index]: e.target.value })}
                  placeholder="Escribe tu manifestación..."
                  className={`min-h-[120px] font-serif ${
                    isRitualMode 
                      ? 'bg-purple-950/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300/50' 
                      : 'bg-amber-50/50 border-amber-200 text-amber-900 placeholder:text-amber-400/60'
                  }`}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Espejo de afirmación */}
        <Card className={`p-8 text-center ${
          isRitualMode 
            ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30 backdrop-blur-sm' 
            : 'bg-gradient-to-br from-amber-100 via-rose-100 to-purple-100 border-amber-300'
        }`}>
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              <Star className={`h-6 w-6 ${isRitualMode ? 'text-purple-300' : 'text-amber-500'}`} />
              <Heart className={`h-6 w-6 ${isRitualMode ? 'text-pink-300' : 'text-rose-500'}`} />
              <Star className={`h-6 w-6 ${isRitualMode ? 'text-purple-300' : 'text-amber-500'}`} />
            </div>
            
            <h3 className={`text-2xl font-serif ${
              isRitualMode ? 'text-purple-100' : 'text-amber-900'
            }`}>
              Tu Afirmación Diaria
            </h3>

            <motion.p
              className={`text-xl font-light italic ${
                isRitualMode ? 'text-purple-200' : 'text-amber-800'
              }`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              "Soy digna de todo lo bueno que el universo tiene para mí.
              <br />
              Mis sueños se manifiestan con facilidad y gracia."
            </motion.p>

            <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-current to-transparent opacity-30" />
          </div>
        </Card>

        {/* Guardar */}
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={handleSave}
            className={`px-8 ${
              isRitualMode 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600'
            } text-white shadow-xl`}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Sellar Manifestaciones
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
