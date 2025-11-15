'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Diary } from '@/lib/diary-types';
import { diaryProtection, watermarkStyles } from '@/lib/diary-protection';
import { Lock } from 'lucide-react';

interface InteractiveDiaryProps {
  diary: Diary;
  onClose: () => void;
}

export function InteractiveDiary({ diary, onClose }: InteractiveDiaryProps) {
  // Aplicar protecciones
  useEffect(() => {
    diaryProtection.applyAll();
    return () => diaryProtection.removeAll();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{ ...watermarkStyles }}
      >
        <div
          className="relative overflow-hidden py-8"
          style={{
            background: diary.coverGradient,
          }}
        >
          <div className="relative px-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-0 right-8 text-white/80 hover:text-white text-3xl"
            >
              ×
            </button>
            <h2 className="text-3xl font-serif font-bold">{diary.title}</h2>
            <p className="text-white/90 mt-2">{diary.subtitle}</p>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[60vh]">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{diary.icon}</div>
            <h3 className="text-2xl font-serif font-bold text-hogara-gray mb-4">
              {diary.title}
            </h3>
            <p className="text-hogara-gray/60 mb-6 max-w-2xl mx-auto">
              {diary.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {diary.features.slice(0, 4).map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-hogara-pink/10 to-hogara-gold/10 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-hogara-gold/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-hogara-gold">✓</span>
                  </div>
                  <span className="text-sm text-hogara-gray text-left">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t flex items-center justify-between text-sm text-hogara-gray/60">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Contenido protegido - © Hogara Planner</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
