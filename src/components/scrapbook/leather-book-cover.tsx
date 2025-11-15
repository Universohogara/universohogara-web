
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LeatherBookCoverProps {
  isOpen: boolean
  onOpen: () => void
  bookTitle: string
  hasMagicEffects?: boolean
}

export default function LeatherBookCover({
  isOpen,
  onOpen,
  bookTitle,
  hasMagicEffects = false
}: LeatherBookCoverProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Partículas mágicas flotantes */}
      {hasMagicEffects && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{ 
                y: [null, Math.random() * window.innerHeight],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Libro cerrado */}
      <motion.div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onOpen}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Sombra del libro */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-96 h-8 bg-black/30 blur-xl rounded-full" />

        {/* Portada de cuero */}
        <div className="relative w-[400px] h-[550px] rounded-r-lg shadow-2xl">
          {/* Textura de cuero */}
          <div
            className="absolute inset-0 rounded-r-lg"
            style={{
              background: 'linear-gradient(135deg, #4a2c2a 0%, #6b3e37 50%, #4a2c2a 100%)',
              boxShadow: `
                inset 0 0 50px rgba(0,0,0,0.3),
                inset -5px 0 20px rgba(0,0,0,0.4),
                10px 10px 30px rgba(0,0,0,0.5)
              `
            }}
          />

          {/* Detalles decorativos dorados */}
          <div className="absolute inset-4 border-2 border-amber-600/40 rounded-r-md" />
          <div className="absolute inset-6 border border-amber-500/30 rounded-r-sm" />

          {/* Broche decorativo */}
          <motion.div
            className="absolute right-8 top-1/2 transform -translate-y-1/2 w-12 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-lg flex items-center justify-center"
            animate={{ 
              rotateY: isHovered ? 10 : 0,
              scale: isHovered ? 1.1 : 1
            }}
          >
            <Heart className="h-6 w-6 text-amber-900" fill="currentColor" />
          </motion.div>

          {/* Título del libro */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
            <motion.div
              animate={{ 
                y: isHovered ? -5 : 0,
                opacity: isHovered ? 1 : 0.9
              }}
              className="space-y-6"
            >
              {/* Ornamento superior */}
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                <Sparkles className="h-5 w-5" />
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              </div>

              {/* Título */}
              <h1 className="text-4xl font-serif text-amber-200 drop-shadow-lg tracking-wide leading-tight">
                {bookTitle}
              </h1>

              {/* Subtítulo */}
              <p className="text-sm text-amber-300/80 font-light tracking-widest uppercase">
                Tu Diario Mágico
              </p>

              {/* Ornamento inferior */}
              <div className="flex items-center justify-center gap-2 text-amber-400">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                <Star className="h-4 w-4" fill="currentColor" />
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              </div>

              {/* Botón de apertura */}
              <motion.div
                animate={{ 
                  scale: isHovered ? 1 : 0.95,
                  opacity: isHovered ? 1 : 0.7
                }}
              >
                <Button
                  size="lg"
                  className="mt-8 bg-amber-600 hover:bg-amber-500 text-amber-950 font-semibold shadow-xl"
                  onClick={onOpen}
                >
                  Abrir el Libro
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Efecto de brillo al hover */}
          <motion.div
            className="absolute inset-0 rounded-r-lg pointer-events-none"
            animate={{
              background: isHovered 
                ? 'radial-gradient(circle at 50% 50%, rgba(251,191,36,0.1) 0%, transparent 70%)'
                : 'transparent'
            }}
          />

          {/* Lomo del libro (lado izquierdo) */}
          <div
            className="absolute -left-8 top-0 w-8 h-full rounded-l-lg"
            style={{
              background: 'linear-gradient(to right, #3a1c1a 0%, #4a2c2a 100%)',
              boxShadow: 'inset 2px 0 10px rgba(0,0,0,0.5)'
            }}
          />
        </div>

        {/* Páginas del libro (efecto de grosor) */}
        <div className="absolute right-0 top-2 w-full h-[546px] flex flex-col justify-between pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-[398px] h-[1px] bg-amber-100"
              style={{
                marginRight: `${i * 0.3}px`,
                opacity: 0.4 - i * 0.02,
                boxShadow: '1px 0 2px rgba(0,0,0,0.1)'
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Texto de ayuda */}
      <motion.p
        className="absolute bottom-20 text-purple-200 text-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Haz clic para abrir tu scrapbook mágico...
      </motion.p>
    </div>
  )
}
