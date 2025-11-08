'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREDEFINED_DIARIES, Diary, DiaryType } from '@/lib/diary-types';
import { EnhancedDiaryCover } from '@/components/diarios/enhanced-diary-cover';
import { Sparkles, BookOpen, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function Diarios3DPage() {
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [filter, setFilter] = useState<DiaryType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const diaries = PREDEFINED_DIARIES.map((d) => ({
    ...d,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Filtrar diarios
  const filteredDiaries = diaries.filter((diary) => {
    const matchesFilter = filter === 'all' || diary.type === filter;
    const matchesSearch =
      diary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diary.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const diaryTypes: { value: DiaryType | 'all'; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'reading', label: 'Lectura' },
    { value: 'movies', label: 'Cine y Series' },
    { value: 'exercise', label: 'Ejercicio' },
    { value: 'finance', label: 'Finanzas' },
    { value: 'wellness', label: 'Bienestar' },
    { value: 'dreams', label: 'Sueños' },
    { value: 'gratitude', label: 'Gratitud' },
    { value: 'manifestation', label: 'Manifestación' },
    { value: 'tracker', label: 'Trackers' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-hogara-pink/10 via-white to-hogara-gold/10">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-hogara-gold via-hogara-pink to-hogara-gold py-20">
        {/* Patrón de fondo animado */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <BookOpen className="w-16 h-16" />
              <h1 className="text-6xl font-serif font-bold">Diarios Profesionales Hogara</h1>
              <Sparkles className="w-16 h-16" />
            </div>
            <p className="text-2xl text-white/90 max-w-4xl mx-auto mb-6">
              Inspirados en HardPeach, diseñados con la magia de Hogara
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-white/20 text-white border-none backdrop-blur-sm text-sm py-2 px-4">
                ✨ 9 Tipos de Diarios
              </Badge>
              <Badge className="bg-white/20 text-white border-none backdrop-blur-sm text-sm py-2 px-4">
                📚 Hasta 300 Entradas
              </Badge>
              <Badge className="bg-white/20 text-white border-none backdrop-blur-sm text-sm py-2 px-4">
                🎨 Trackers Personalizables
              </Badge>
              <Badge className="bg-white/20 text-white border-none backdrop-blur-sm text-sm py-2 px-4">
                📊 Estadísticas Automáticas
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-2xl p-6 shadow-lg border border-hogara-gold/20">
          <div className="flex items-center gap-3 flex-1 w-full md:w-auto">
            <Search className="w-5 h-5 text-hogara-gray/40" />
            <Input
              placeholder="Buscar diarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none focus:ring-0 flex-1"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-5 h-5 text-hogara-gold" />
            <Select value={filter} onValueChange={(value) => setFilter(value as DiaryType | 'all')}>
              <SelectTrigger className="w-full md:w-48 border-hogara-gold/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {diaryTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Galería de Diarios */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {filteredDiaries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-hogara-gray/40">No se encontraron diarios</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
            {filteredDiaries.map((diary, index) => (
              <motion.div
                key={diary.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="w-full flex flex-col items-center"
              >
                <EnhancedDiaryCover
                  diary={diary}
                  onClick={() => setSelectedDiary(diary)}
                />

                {/* Botón de apertura */}
                <Link
                  href={`/premium/diarios-3d/${diary.id}`}
                  className="mt-6 w-full max-w-sm"
                >
                  <motion.button
                    className="w-full px-6 py-3 bg-hogara-gold text-white rounded-full font-medium hover:bg-hogara-gold/90 transition-colors shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Abrir Diario ✨
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Características Principales */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-serif font-bold text-hogara-gray mb-4">
            Características Profesionales
          </h2>
          <p className="text-xl text-hogara-gray/60">
            Todo lo que necesitas para una organización completa
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: '📊',
              title: 'Trackers Personalizables',
              description: 'Colores y leyendas 100% customizables según tus necesidades',
            },
            {
              icon: '📅',
              title: 'Vistas Múltiples',
              description: 'Navegación anual, mensual, semanal y diaria intuitiva',
            },
            {
              icon: '📈',
              title: 'Estadísticas Automáticas',
              description: 'Análisis de patrones y tendencias generados automáticamente',
            },
            {
              icon: '💾',
              title: 'Guardado Automático',
              description: 'Tus datos se guardan en tiempo real sin preocupaciones',
            },
            {
              icon: '✨',
              title: 'Diseño Premium',
              description: 'Interfaces elegantes que inspiran y motivan',
            },
            {
              icon: '🎨',
              title: 'Personalización Total',
              description: 'Adapta colores, estilos y categorías a tu gusto',
            },
            {
              icon: '📝',
              title: 'Entradas Ilimitadas',
              description: 'Espacio para todos tus registros sin límites',
            },
            {
              icon: '🔒',
              title: 'Seguridad y Privacidad',
              description: 'Tus datos protegidos con encriptación',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-hogara-gold/20 group hover:-translate-y-1"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-serif font-bold text-hogara-gray mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-hogara-gray/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-hogara-gold via-hogara-pink to-hogara-gold rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-4xl font-serif font-bold mb-4">
            Comienza Tu Viaje de Organización
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Elige el diario perfecto para ti y experimenta el poder de la organización profesional
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-hogara-gold px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
            >
              Ver Todos los Diarios ✨
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
