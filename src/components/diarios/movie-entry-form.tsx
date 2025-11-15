
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface MovieEntryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function MovieEntryForm({ onSuccess, onCancel }: MovieEntryFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'movie',
    genre: '',
    rating: '',
    director: '',
    year: '',
    season: '',
    episode: '',
    review: '',
    quotes: '',
    watchedWith: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/diarios/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rating: formData.rating ? parseInt(formData.rating) : null,
          year: formData.year ? parseInt(formData.year) : null,
          season: formData.season ? parseInt(formData.season) : null,
          episode: formData.episode ? parseInt(formData.episode) : null,
        }),
      });

      if (!response.ok) throw new Error('Error al guardar');

      toast.success('🎬 Película/Serie agregada exitosamente');
      onSuccess();
    } catch (error) {
      toast.error('Error al guardar la película/serie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-lg border border-hogara-gold/20"
    >
      <h3 className="text-xl font-serif font-bold text-hogara-gray mb-4">
        Agregar Película/Serie
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ej: Inception"
            required
          />
        </div>

        <div className="col-span-1">
          <Label htmlFor="type">Tipo</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="movie">Película</SelectItem>
              <SelectItem value="series">Serie</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1">
          <Label htmlFor="rating">Valoración (1-5)</Label>
          <Input
            id="rating"
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            placeholder="5"
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label htmlFor="director">Director</Label>
          <Input
            id="director"
            value={formData.director}
            onChange={(e) => setFormData({ ...formData, director: e.target.value })}
            placeholder="Ej: Christopher Nolan"
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label htmlFor="genre">Género</Label>
          <Input
            id="genre"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            placeholder="Ej: Ciencia Ficción"
          />
        </div>

        <div className="col-span-1">
          <Label htmlFor="year">Año</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="2024"
          />
        </div>

        {formData.type === 'series' && (
          <>
            <div className="col-span-1">
              <Label htmlFor="season">Temporada</Label>
              <Input
                id="season"
                type="number"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                placeholder="1"
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="episode">Episodio</Label>
              <Input
                id="episode"
                type="number"
                value={formData.episode}
                onChange={(e) => setFormData({ ...formData, episode: e.target.value })}
                placeholder="1"
              />
            </div>
          </>
        )}

        <div className="col-span-2">
          <Label htmlFor="watchedWith">Visto con</Label>
          <Input
            id="watchedWith"
            value={formData.watchedWith}
            onChange={(e) => setFormData({ ...formData, watchedWith: e.target.value })}
            placeholder="Ej: Familia, amigos, solo/a..."
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="quotes">Frases Memorables</Label>
          <Textarea
            id="quotes"
            value={formData.quotes}
            onChange={(e) => setFormData({ ...formData, quotes: e.target.value })}
            placeholder="Frases que te marcaron de esta película/serie..."
            rows={3}
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="review">Reseña Personal</Label>
          <Textarea
            id="review"
            value={formData.review}
            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
            placeholder="¿Qué te pareció?"
            rows={4}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="bg-hogara-gold">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </Button>
      </div>
    </motion.form>
  );
}
