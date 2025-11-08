
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Star, Loader2 } from 'lucide-react';
import { ReadingEntryForm } from './reading-entry-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReadingTracker } from './reading-tracker';

interface ReadingEntry {
  id: string;
  book_title: string;
  author: string;
  pages: number;
  total_pages?: number;
  rating?: number;
  genre?: string;
  status: string;
  review?: string;
  quotes?: string;
  created_at: string;
}

export function ReadingDiarySection() {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<ReadingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = async () => {
    try {
      const response = await fetch('/api/diarios/reading');
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Error al cargar entradas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSuccess = () => {
    setShowForm(false);
    loadEntries();
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      reading: 'Leyendo',
      completed: 'Completado',
      paused: 'En pausa',
      abandoned: 'Abandonado',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      reading: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      paused: 'bg-yellow-100 text-yellow-700',
      abandoned: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-hogara-gold" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="entries" className="w-full">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
        <TabsTrigger value="entries">📝 Entradas</TabsTrigger>
        <TabsTrigger value="tracker">📊 Tracker Anual</TabsTrigger>
      </TabsList>

      <TabsContent value="entries" className="space-y-6">
        {showForm ? (
        <ReadingEntryForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
      ) : (
        <Button onClick={() => setShowForm(true)} className="bg-hogara-gold">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Libro
        </Button>
      )}

      {entries.length === 0 && !showForm ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-hogara-gray/30 mb-4" />
          <h3 className="text-xl font-serif font-bold text-hogara-gray mb-2">
            Aún no hay libros registrados
          </h3>
          <p className="text-hogara-gray/60">
            Comienza a registrar tus lecturas para llevar un seguimiento completo
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-hogara-gold/20 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-serif font-bold text-lg text-hogara-gray mb-1">
                    {entry.book_title}
                  </h4>
                  <p className="text-sm text-hogara-gray/70">{entry.author}</p>
                </div>
                {entry.rating && (
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{entry.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-hogara-gray/60 mb-3">
                {entry.total_pages ? (
                  <span>
                    {entry.pages}/{entry.total_pages} páginas
                  </span>
                ) : (
                  <span>{entry.pages} páginas leídas</span>
                )}
                {entry.genre && (
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs">
                    {entry.genre}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(entry.status)}`}>
                  {getStatusLabel(entry.status)}
                </span>
                {entry.review && (
                  <span className="text-xs text-hogara-gray/60">
                    {entry.review.substring(0, 50)}...
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      </TabsContent>

      <TabsContent value="tracker">
        <ReadingTracker />
      </TabsContent>
    </Tabs>
  );
}
