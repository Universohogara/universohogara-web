
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Film, Star, Loader2 } from 'lucide-react';
import { MovieEntryForm } from './movie-entry-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoviesTracker } from './movies-tracker';

interface MovieEntry {
  id: string;
  title: string;
  type: string;
  genre?: string;
  rating?: number;
  director?: string;
  year?: number;
  season?: number;
  episode?: number;
  review?: string;
  quotes?: string;
  watched_with?: string;
  created_at: string;
}

export function MoviesDiarySection() {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<MovieEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = async () => {
    try {
      const response = await fetch('/api/diarios/movies');
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
        <MovieEntryForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
      ) : (
        <Button onClick={() => setShowForm(true)} className="bg-hogara-gold">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Película/Serie
        </Button>
      )}

      {entries.length === 0 && !showForm ? (
        <div className="text-center py-12">
          <Film className="w-16 h-16 mx-auto text-hogara-gray/30 mb-4" />
          <h3 className="text-xl font-serif font-bold text-hogara-gray mb-2">
            Aún no hay películas o series registradas
          </h3>
          <p className="text-hogara-gray/60">
            Comienza a registrar lo que ves para llevar un seguimiento completo
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-red-50 to-orange-50 p-5 rounded-xl border border-hogara-gold/20 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white text-hogara-gray">
                      {entry.type === 'movie' ? '🎬 Película' : '📺 Serie'}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-lg text-hogara-gray mb-1">
                    {entry.title}
                  </h4>
                  {entry.director && (
                    <p className="text-sm text-hogara-gray/70">{entry.director}</p>
                  )}
                </div>
                {entry.rating && (
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{entry.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-hogara-gray/60 mb-3">
                {entry.year && <span>{entry.year}</span>}
                {entry.genre && (
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs">
                    {entry.genre}
                  </span>
                )}
              </div>

              {entry.type === 'series' && entry.season && (
                <div className="text-xs text-hogara-gray/60 mb-2">
                  Temporada {entry.season}
                  {entry.episode && `, Episodio ${entry.episode}`}
                </div>
              )}

              {entry.review && (
                <div className="text-sm text-hogara-gray/70 line-clamp-2 mt-2">
                  {entry.review}
                </div>
              )}

              {entry.watched_with && (
                <div className="text-xs text-hogara-gray/60 mt-2">
                  Visto con: {entry.watched_with}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
      </TabsContent>

      <TabsContent value="tracker">
        <MoviesTracker />
      </TabsContent>
    </Tabs>
  );
}
