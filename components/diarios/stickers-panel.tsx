
'use client';

import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface Sticker {
  id: string;
  emoji: string;
  category: string;
  name: string;
}

const STICKER_CATEGORIES = [
  {
    id: 'emociones',
    label: 'Emociones',
    stickers: [
      { id: 's1', emoji: '😊', category: 'emociones', name: 'Feliz' },
      { id: 's2', emoji: '😌', category: 'emociones', name: 'Tranquilo' },
      { id: 's3', emoji: '🥰', category: 'emociones', name: 'Amor' },
      { id: 's4', emoji: '😢', category: 'emociones', name: 'Triste' },
      { id: 's5', emoji: '😴', category: 'emociones', name: 'Cansado' },
      { id: 's6', emoji: '🤔', category: 'emociones', name: 'Pensativo' },
      { id: 's7', emoji: '😤', category: 'emociones', name: 'Frustrado' },
      { id: 's8', emoji: '🤗', category: 'emociones', name: 'Abrazo' },
    ],
  },
  {
    id: 'naturaleza',
    label: 'Naturaleza',
    stickers: [
      { id: 'n1', emoji: '🌸', category: 'naturaleza', name: 'Flor' },
      { id: 'n2', emoji: '🌙', category: 'naturaleza', name: 'Luna' },
      { id: 'n3', emoji: '⭐', category: 'naturaleza', name: 'Estrella' },
      { id: 'n4', emoji: '🌈', category: 'naturaleza', name: 'Arcoíris' },
      { id: 'n5', emoji: '🌊', category: 'naturaleza', name: 'Ola' },
      { id: 'n6', emoji: '🌻', category: 'naturaleza', name: 'Girasol' },
      { id: 'n7', emoji: '🍂', category: 'naturaleza', name: 'Hoja' },
      { id: 'n8', emoji: '🌺', category: 'naturaleza', name: 'Hibisco' },
    ],
  },
  {
    id: 'actividades',
    label: 'Actividades',
    stickers: [
      { id: 'a1', emoji: '📚', category: 'actividades', name: 'Lectura' },
      { id: 'a2', emoji: '🎨', category: 'actividades', name: 'Arte' },
      { id: 'a3', emoji: '💪', category: 'actividades', name: 'Ejercicio' },
      { id: 'a4', emoji: '🧘‍♀️', category: 'actividades', name: 'Yoga' },
      { id: 'a5', emoji: '🎵', category: 'actividades', name: 'Música' },
      { id: 'a6', emoji: '✍️', category: 'actividades', name: 'Escritura' },
      { id: 'a7', emoji: '🎬', category: 'actividades', name: 'Cine' },
      { id: 'a8', emoji: '🍳', category: 'actividades', name: 'Cocina' },
    ],
  },
  {
    id: 'simbolos',
    label: 'Símbolos',
    stickers: [
      { id: 'si1', emoji: '✨', category: 'simbolos', name: 'Brillo' },
      { id: 'si2', emoji: '💫', category: 'simbolos', name: 'Destello' },
      { id: 'si3', emoji: '✓', category: 'simbolos', name: 'Check' },
      { id: 'si4', emoji: '💝', category: 'simbolos', name: 'Regalo' },
      { id: 'si5', emoji: '🎯', category: 'simbolos', name: 'Objetivo' },
      { id: 'si6', emoji: '🔥', category: 'simbolos', name: 'Fuego' },
      { id: 'si7', emoji: '💎', category: 'simbolos', name: 'Diamante' },
      { id: 'si8', emoji: '🌟', category: 'simbolos', name: 'Estrella' },
    ],
  },
];

interface StickersPanelProps {
  onStickerDragStart: (sticker: Sticker) => void;
  open: boolean;
  onClose: () => void;
}

export function StickersPanel({ onStickerDragStart, open, onClose }: StickersPanelProps) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed right-0 top-0 h-screen w-80 bg-white shadow-2xl z-50 overflow-y-auto"
    >
      <div className="sticky top-0 bg-white border-b border-hogara-gold/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-hogara-gold" />
          <h3 className="font-serif font-bold text-lg text-hogara-gray">Stickers</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4">
        <Tabs defaultValue="emociones">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            {STICKER_CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {STICKER_CATEGORIES.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-4 gap-3">
                {category.stickers.map((sticker) => (
                  <motion.div
                    key={sticker.id}
                    draggable
                    onDragStart={() => onStickerDragStart(sticker)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="aspect-square flex items-center justify-center text-4xl cursor-grab active:cursor-grabbing bg-gradient-to-br from-hogara-pink/10 to-hogara-gold/10 rounded-lg hover:shadow-md transition-shadow"
                  >
                    {sticker.emoji}
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </motion.div>
  );
}
