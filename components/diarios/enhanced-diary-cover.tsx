
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Diary } from '@/lib/diary-types';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EnhancedDiaryCoverProps {
  diary: Diary;
  onClick?: () => void;
}

export function EnhancedDiaryCover({ diary, onClick }: EnhancedDiaryCoverProps) {
  return (
    <motion.div
      className="relative w-full max-w-sm cursor-pointer group"
      whileHover={{ y: -8 }}
      onClick={onClick}
    >
      {/* Sombra del libro */}
      <div
        className="absolute -bottom-2 left-0 right-0 h-8 bg-black/10 blur-xl rounded-full transform scale-90"
        style={{
          background: `radial-gradient(ellipse, ${diary.coverColor}40 0%, transparent 70%)`,
        }}
      />

      {/* Portada del libro */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 group-hover:shadow-3xl"
        style={{
          background: diary.coverGradient,
          aspectRatio: '3/4',
        }}
      >
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, white 1px, transparent 1px),
                radial-gradient(circle at 80% 80%, white 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Contenido de la portada */}
        <div className="relative h-full p-8 flex flex-col justify-between text-white">
          {/* Header con icono */}
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
              <span className="text-4xl">{diary.icon}</span>
            </div>
            {diary.maxEntries && (
              <Badge className="bg-white/20 text-white border-none backdrop-blur-sm">
                Hasta {diary.maxEntries} entradas
              </Badge>
            )}
          </div>

          {/* Título y descripción */}
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-bold leading-tight">{diary.title}</h3>
            <p className="text-sm font-medium text-white/90">{diary.subtitle}</p>
            <p className="text-xs text-white/70 line-clamp-2">{diary.description}</p>
          </div>

          {/* Footer con características */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {diary.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="text-xs bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Brillo hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Indicador de apertura */}
        <motion.div
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.div>
      </div>

      {/* Lomo del libro (efecto 3D) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-4 rounded-l-2xl"
        style={{
          background: `linear-gradient(to right, ${diary.coverColor}cc, ${diary.coverColor})`,
          transform: 'translateX(-100%)',
          boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.2)',
        }}
      />
    </motion.div>
  );
}
