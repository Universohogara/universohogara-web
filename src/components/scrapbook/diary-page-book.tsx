
'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface DiaryPageBookProps {
  children: React.ReactNode
  pageNumber?: number
  isLeftPage?: boolean
}

export default function DiaryPageBook({ 
  children, 
  pageNumber,
  isLeftPage = false 
}: DiaryPageBookProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: isLeftPage ? -90 : 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Página con efecto de papel antiguo */}
      <div
        className="relative rounded-lg shadow-2xl overflow-hidden"
        style={{
          width: '600px',
          height: '800px',
          background: `
            linear-gradient(135deg, #fdfbf7 0%, #f9f6f0 50%, #fdfbf7 100%)
          `,
          boxShadow: `
            ${isLeftPage ? '5px' : '-5px'} 0 15px rgba(0,0,0,0.2),
            ${isLeftPage ? '10px' : '-10px'} 0 30px rgba(0,0,0,0.1),
            inset 0 0 100px rgba(139,115,85,0.03)
          `
        }}
      >
        {/* Textura de papel */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(184,149,106,0.03) 2px,
                rgba(184,149,106,0.03) 3px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(184,149,106,0.03) 2px,
                rgba(184,149,106,0.03) 3px
              )
            `,
            backgroundSize: '100% 100%'
          }}
        />

        {/* Manchas vintage aleatorias */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(160,130,95,0.15) 0%, transparent 40%),
              radial-gradient(ellipse at 80% 70%, rgba(139,115,85,0.1) 0%, transparent 30%),
              radial-gradient(ellipse at 40% 80%, rgba(184,149,106,0.08) 0%, transparent 25%)
            `
          }}
        />

        {/* Líneas de rayado suaves */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(184,149,106,0.2) 29px, rgba(184,149,106,0.2) 30px)',
            backgroundSize: '100% 30px'
          }}
        />

        {/* Borde interior decorativo */}
        <div className="absolute inset-4 border border-amber-200/40 rounded pointer-events-none" />

        {/* Número de página */}
        {pageNumber && (
          <div 
            className={`absolute ${isLeftPage ? 'bottom-6 left-6' : 'bottom-6 right-6'} text-amber-800/60 text-sm font-serif`}
          >
            {pageNumber}
          </div>
        )}

        {/* Contenido de la página */}
        <div className="relative z-10 w-full h-full p-8">
          {children}
        </div>

        {/* Efecto de sombra del lomo */}
        <div
          className={`absolute top-0 ${isLeftPage ? 'left-0' : 'right-0'} w-8 h-full pointer-events-none`}
          style={{
            background: isLeftPage 
              ? 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 100%)'
              : 'linear-gradient(to left, rgba(0,0,0,0.1) 0%, transparent 100%)'
          }}
        />
      </div>
    </motion.div>
  )
}
