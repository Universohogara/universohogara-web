
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

interface ReadingEntryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReadingEntryForm({ onSuccess, onCancel }: ReadingEntryFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bookTitle: '',
    author: '',
    pages: '',
    totalPages: '',
    rating: '',
    genre: '',
    status: 'reading',
    review: '',
    quotes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/diarios/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pages: parseInt(formData.pages) || 0,
          totalPages: formData.totalPages ? parseInt(formData.totalPages) : null,
          rating: formData.rating ? parseInt(formData.rating) : null,
        }),
      });

      if (!response.ok) throw new Error('Error al guardar');

      toast.success('📚 Libro agregado exitosamente');
      onSuccess();
    } catch (error) {
      toast.error('Error al guardar el libro');
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
        Agregar Libro
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="bookTitle">Título del Libro *</Label>
          <Input
            id="bookTitle"
            value={formData.bookTitle}
            onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
            placeholder="Ej: Cien años de soledad"
            required
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label htmlFor="author">Autor *</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Ej: Gabriel García Márquez"
            required
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label htmlFor="genre">Género</Label>
          <Input
            id="genre"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            placeholder="Ej: Realismo mágico"
          />
        </div>

        <div className="col-span-1">
          <Label htmlFor="pages">Páginas Leídas</Label>
          <Input
            id="pages"
            type="number"
            value={formData.pages}
            onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
            placeholder="0"
          />
        </div>

        <div className="col-span-1">
          <Label htmlFor="totalPages">Total de Páginas</Label>
          <Input
            id="totalPages"
            type="number"
            value={formData.totalPages}
            onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
            placeholder="300"
          />
        </div>

        <div className="col-span-1">
          <Label htmlFor="status">Estado</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reading">Leyendo</SelectItem>
              <SelectItem value="completed">Completado</SelectItem>
              <SelectItem value="paused">En pausa</SelectItem>
              <SelectItem value="abandoned">Abandonado</SelectItem>
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

        <div className="col-span-2">
          <Label htmlFor="quotes">Citas Favoritas</Label>
          <Textarea
            id="quotes"
            value={formData.quotes}
            onChange={(e) => setFormData({ ...formData, quotes: e.target.value })}
            placeholder="Escribe tus citas favoritas, separadas por saltos de línea..."
            rows={3}
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="review">Reseña Personal</Label>
          <Textarea
            id="review"
            value={formData.review}
            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
            placeholder="¿Qué te pareció este libro?"
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
            'Guardar Libro'
          )}
        </Button>
      </div>
    </motion.form>
  );
}
