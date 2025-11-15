
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CompanionSettings } from './companion-settings'
import Image from 'next/image'
import { SimpleEmotionalChat } from './simple-emotional-chat'
import { DetectedEmotion } from '@/lib/emotion-detector'
import EmotionParticles from './emotion-particles'

interface FloatingCompanionProps {
  companion: {
    id: string
    type: string
    name: string
    color_theme: string
    voice_tone: string
    personality: string
    position_x: number
    position_y: number
    is_active: boolean
  }
  onUpdate: (data: any) => void
}

export function FloatingCompanion({ companion, onUpdate }: FloatingCompanionProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<DetectedEmotion>('calm')

  // Efecto de emociones sutiles aleatorias cuando no está en chat
  useEffect(() => {
    if (!showChat) {
      const emotions: DetectedEmotion[] = ['calm', 'happy']
      const interval = setInterval(() => {
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
        setCurrentEmotion(randomEmotion)
      }, 8000)

      return () => clearInterval(interval)
    }
  }, [showChat])

  if (!companion.is_active) {
    return null
  }

  // Mapeo de imágenes según el ID del companion (ahora coincide con companion.id)
  const companionImages: Record<string, string> = {
    'ken': 'ken.png',
    'ada': 'companion-hada-fairy.png',           // Ada (hada)
    'luna': 'companion-lumi-light.png',          // Luna (lumi)
    'ember': 'companion-draguito-dragon.png',    // Ember (draguito)
    'sage': 'companion-elfo-elf.png',            // Sage (elfo)
    'sprig': 'companion-sprig-plant.png',        // Sprig (fabel)
    'willow': 'companion-willow-tree.png',       // Willow (willow)
    'coral': 'companion-nimbo-cloud.png',        // Coral (nimbo)
    'orion': 'companion-unicornito-unicorn.png', // Orion (unicornito)
    'aurora': 'companion-human-warm.png',        // Aurora (human)
  }

  // Temas de color por companion (sincronizados con companion-card-detail.tsx)
  const companionThemes: Record<string, { from: string; to: string }> = {
    'ken': { from: '#DC143C', to: '#FF6B6B' },      // Rojo (como su pañuelo)
    'ada': { from: '#FF1493', to: '#FFB6D9' },      // Fucsia
    'hada': { from: '#FF1493', to: '#FFB6D9' },     // Alias para Ada
    'luna': { from: '#9370DB', to: '#E6E6FA' },     // Púrpura/Lavanda
    'lumi': { from: '#9370DB', to: '#E6E6FA' },     // Alias para Luna
    'ember': { from: '#FF4500', to: '#FFD700' },    // Rojo/Naranja
    'draguito': { from: '#FF4500', to: '#FFD700' }, // Alias para Ember
    'sage': { from: '#2E8B57', to: '#98FB98' },     // Verde bosque
    'elfo': { from: '#2E8B57', to: '#98FB98' },     // Alias para Sage
    'sprig': { from: '#228B22', to: '#90EE90' },    // Verde naturaleza
    'fabel': { from: '#228B22', to: '#90EE90' },    // Alias para Sprig
    'willow': { from: '#228B22', to: '#90EE90' },   // Verde naturaleza (Willow)
    'coral': { from: '#00CED1', to: '#AFEEEE' },    // Turquesa/Coral
    'nimbo': { from: '#00CED1', to: '#AFEEEE' },    // Alias para Coral
    'orion': { from: '#4169E1', to: '#B0C4DE' },    // Azul real
    'unicornito': { from: '#4169E1', to: '#B0C4DE' }, // Alias para Orion
    'aurora': { from: '#FFD700', to: '#FFA500' },   // Dorado/Amanecer
    'human': { from: '#FFD700', to: '#FFA500' }     // Alias para Aurora
  }

  const imagePath = companionImages[companion.type] || 'companion-hada-fairy.png'
  const theme = companionThemes[companion.type] || { from: '#D4AF37', to: '#B8941F' }

  // Tamaño del companion según el tipo
  const companionSize = companion.type === 'ken' ? 180 : 140

  return (
    <>
      {/* BOTÓN FLOTANTE DEL ACOMPAÑANTE */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed bottom-6 right-6 z-[9999] pointer-events-auto"
      >
        {/* Contenedor con efecto hover */}
        <motion.div
          className="relative cursor-pointer group"
          onClick={() => setShowChat(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Aura emocional sutil que envuelve la silueta */}
          <div 
            className="absolute inset-0"
            style={{
              width: companionSize,
              height: companionSize,
              transform: 'translate(0, 0)'
            }}
          >
            <EmotionParticles 
              emotion={currentEmotion} 
              companionType={companion.type}
            />
          </div>

          {/* Imagen del companion CON FONDO TRANSPARENTE */}
          <motion.div
            className="relative"
            style={{
              width: companionSize,
              height: companionSize,
            }}
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Image
              src={`/images/companions/${imagePath}`}
              alt={companion.name}
              width={companionSize}
              height={companionSize}
              className="object-contain drop-shadow-2xl relative z-10"
              priority
              unoptimized
            />
          </motion.div>

          {/* Tooltip */}
          <div className="absolute bottom-full mb-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
            <div className="bg-[#8B7355] text-white px-3 py-2 rounded-lg text-sm shadow-xl">
              <div className="font-semibold flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                {companion.name}
              </div>
              <div className="text-xs opacity-90 mt-0.5">Haz clic para hablar</div>
            </div>
          </div>

          {/* Botón de configuración */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              setShowSettings(true)
            }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
            style={{ borderColor: theme.from }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="w-4 h-4" style={{ color: theme.from }} />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* PANEL DE CHAT */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-[220px] w-[450px] max-w-[calc(100vw-260px)] h-[600px] max-h-[calc(100vh-100px)] z-[9998] shadow-2xl"
          >
            <div 
              className="bg-white rounded-2xl overflow-hidden h-full flex flex-col"
              style={{ border: `2px solid ${theme.from}40` }}
            >
              {/* Header del chat */}
              <div 
                className="p-4 flex items-center justify-between flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full overflow-hidden shadow-lg relative"
                    style={{ border: '2px solid white' }}
                  >
                    <Image
                      src={`/images/companions/${imagePath}`}
                      alt={companion.name}
                      width={40}
                      height={40}
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{companion.name}</h3>
                    <p className="text-xs text-white/90 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      Listo con voces mágicas
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowChat(false)}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Chat emocional simplificado */}
              <div className="flex-1 overflow-hidden">
                <SimpleEmotionalChat 
                  companion={companion} 
                  onEmotionChange={setCurrentEmotion}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PANEL DE CONFIGURACIÓN */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
              style={{ border: `2px solid ${theme.from}40` }}
            >
              <div 
                className="p-4 flex items-center justify-between"
                style={{
                  background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`
                }}
              >
                <h3 className="font-semibold text-white">Configuración de {companion.name}</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowSettings(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CompanionSettings
                companion={companion}
                onUpdate={(data) => {
                  onUpdate(data)
                  setShowSettings(false)
                }}
                onClose={() => setShowSettings(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
