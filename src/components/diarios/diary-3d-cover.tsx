
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Diary } from '@/lib/diary-types';

interface Diary3DCoverProps {
  diary: Diary;
  isOpen: boolean;
  onClick: () => void;
}

export function Diary3DCover({ diary, isOpen, onClick }: Diary3DCoverProps) {
  return (
    <motion.div
      className="relative cursor-pointer select-none"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Contenedor del libro */}
      <motion.div
        className="relative w-64 h-80"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: isOpen ? -20 : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Portada */}
        <div
          className="absolute inset-0 rounded-r-xl shadow-2xl overflow-hidden"
          style={{
            background: diary.coverGradient,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Textura de cuero */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0, 0, 0, 0.1) 2px,
                  rgba(0, 0, 0, 0.1) 4px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(0, 0, 0, 0.1) 2px,
                  rgba(0, 0, 0, 0.1) 4px
                )
              `,
            }}
          />

          {/* Brillo dorado */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />

          {/* Contenido de la portada */}
          <div className="relative h-full flex flex-col items-center justify-center p-6 text-white">
            {/* Sello Hogara */}
            <div className="mb-6 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
              ✨
            </div>

            {/* Título */}
            <h3 className="text-2xl font-serif text-center mb-3 font-bold tracking-wide">
              {diary.title}
            </h3>

            {/* Descripción */}
            <p className="text-sm text-center text-white/80 mb-6 max-w-[200px]">
              {diary.description}
            </p>

            {/* Línea decorativa */}
            <div className="w-20 h-[2px] bg-white/40 rounded-full mb-4" />

            {/* Número de secciones */}
            <div className="text-xs text-white/70">
              {diary.sections?.length || 0} secciones
            </div>
          </div>

          {/* Lomo visible */}
          <div
            className="absolute left-0 top-0 bottom-0 w-8"
            style={{
              background: `linear-gradient(to right, 
                rgba(0, 0, 0, 0.3), 
                rgba(0, 0, 0, 0.1), 
                transparent
              )`,
            }}
          />
        </div>

        {/* Páginas (efecto de grosor) */}
        <div
          className="absolute top-2 bottom-2 right-0 w-2 bg-white rounded-r-sm"
          style={{
            transform: 'translateZ(-10px)',
            boxShadow: 'inset -2px 0 4px rgba(0, 0, 0, 0.2)',
          }}
        />

        {/* Secciones visibles en el lateral */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-evenly pr-2">
          {diary.sections?.slice(0, 3).map((section, index) => (
            <div
              key={section.id}
              className="w-8 h-12 rounded-r-md shadow-md flex items-center justify-center text-white text-xl transform hover:translate-x-1 transition-transform"
              style={{
                background: section.color,
                transform: `translateZ(${index * 2}px)`,
              }}
              title={section.label}
            >
              {section.icon}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sombra */}
      <div
        className="absolute -bottom-4 left-8 right-8 h-8 bg-black/20 blur-xl rounded-full"
        style={{
          transform: 'translateZ(-20px)',
        }}
      />
    </motion.div>
  );
}
