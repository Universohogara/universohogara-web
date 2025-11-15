
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Moon, Star, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DreamsTracker } from './dreams-tracker';

interface DreamEntry {
  id: string;
  date: Date;
  title: string;
  description: string;
  category: 'lucid' | 'nightmare' | 'recurring' | 'prophetic' | 'normal';
  emotions: string[];
  symbols?: string[];
  people?: string[];
  places?: string[];
  intensity: number;
  clarity: number;
  interpretation?: string;
}

export function DreamsDiarySection() {
  const [entries, setEntries] = useState<DreamEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'normal' as const,
    emotions: '',
    symbols: '',
    people: '',
    places: '',
    intensity: 5,
    clarity: 5,
    interpretation: '',
  });

  const categories = [
    { value: 'normal', label: 'Normal', emoji: '💭', color: 'blue' },
    { value: 'lucid', label: 'Lúcido', emoji: '🌟', color: 'purple' },
    { value: 'nightmare', label: 'Pesadilla', emoji: '😱', color: 'red' },
    { value: 'recurring', label: 'Recurrente', emoji: '🔄', color: 'orange' },
    { value: 'prophetic', label: 'Profético', emoji: '🔮', color: 'indigo' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DreamEntry = {
      id: Date.now().toString(),
      date: new Date(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      emotions: formData.emotions.split(',').map((e) => e.trim()).filter((e) => e),
      symbols: formData.symbols ? formData.symbols.split(',').map((s) => s.trim()).filter((s) => s) : undefined,
      people: formData.people ? formData.people.split(',').map((p) => p.trim()).filter((p) => p) : undefined,
      places: formData.places ? formData.places.split(',').map((p) => p.trim()).filter((p) => p) : undefined,
      intensity: formData.intensity,
      clarity: formData.clarity,
      interpretation: formData.interpretation || undefined,
    };
    setEntries([newEntry, ...entries]);
    setFormData({
      title: '',
      description: '',
      category: 'normal',
      emotions: '',
      symbols: '',
      people: '',
      places: '',
      intensity: 5,
      clarity: 5,
      interpretation: '',
    });
    setShowForm(false);
  };

  const getCategoryStyle = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat || categories[0];
  };

  return (
    <div className="space-y-8">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const count = entries.filter((e) => e.category === cat.value).length;
          return (
            <Card
              key={cat.value}
              className={`p-6 text-center border-2 border-${cat.color}-200 bg-gradient-to-br from-${cat.color}-50 to-white`}
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <div className={`text-3xl font-bold text-${cat.color}-600`}>{count}</div>
              <div className="text-sm text-gray-600 mt-1">{cat.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Botón para agregar entrada */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowForm(!showForm)}
          size="lg"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Registrar Sueño
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl border-2 border-indigo-200 shadow-xl"
        >
          <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Moon className="w-6 h-6 text-indigo-600" />
            Registrar Sueño
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Sueño *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Ej: El jardín mágico"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: typeof formData.category) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.emoji} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción del Sueño *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Describe tu sueño con el mayor detalle posible..."
                rows={6}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-600" />
                  Intensidad: {formData.intensity}/10
                </Label>
                <Slider
                  value={[formData.intensity]}
                  onValueChange={(value) => setFormData({ ...formData, intensity: value[0] })}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  Claridad: {formData.clarity}/10
                </Label>
                <Slider
                  value={[formData.clarity]}
                  onValueChange={(value) => setFormData({ ...formData, clarity: value[0] })}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emotions">Emociones (separadas por comas) *</Label>
              <Input
                id="emotions"
                value={formData.emotions}
                onChange={(e) => setFormData({ ...formData, emotions: e.target.value })}
                required
                placeholder="Alegría, sorpresa, miedo, paz..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="symbols">Símbolos</Label>
                <Input
                  id="symbols"
                  value={formData.symbols}
                  onChange={(e) => setFormData({ ...formData, symbols: e.target.value })}
                  placeholder="Agua, puerta, animal..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="people">Personas</Label>
                <Input
                  id="people"
                  value={formData.people}
                  onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                  placeholder="Nombres o relaciones..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="places">Lugares</Label>
                <Input
                  id="places"
                  value={formData.places}
                  onChange={(e) => setFormData({ ...formData, places: e.target.value })}
                  placeholder="Casa, bosque, ciudad..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interpretation">Interpretación Personal</Label>
              <Textarea
                id="interpretation"
                value={formData.interpretation}
                onChange={(e) => setFormData({ ...formData, interpretation: e.target.value })}
                placeholder="¿Qué crees que significa este sueño? ¿Qué refleja de tu vida?"
                rows={4}
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                Guardar Sueño
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de entradas */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
          <Moon className="w-5 h-5 text-indigo-600" />
          Diario de Sueños
        </h3>

        {entries.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2">
            <div className="text-6xl mb-4">🌙</div>
            <p className="text-lg text-gray-500 mb-2">
              Aún no hay sueños registrados
            </p>
            <p className="text-sm text-gray-400">
              Comienza a registrar tus sueños para descubrir patrones
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry, index) => {
              const catStyle = getCategoryStyle(entry.category);
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`p-6 hover:shadow-lg transition-shadow border-l-4 border-l-${catStyle.color}-500`}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{catStyle.emoji}</span>
                            <h4 className="font-semibold text-xl text-gray-800">
                              {entry.title}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            {entry.date.toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={`bg-${catStyle.color}-100 text-${catStyle.color}-700`}>
                              {catStyle.label}
                            </Badge>
                            <Badge variant="secondary">
                              ⚡ Intensidad: {entry.intensity}/10
                            </Badge>
                            <Badge variant="secondary">
                              👁️ Claridad: {entry.clarity}/10
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {entry.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <div className="font-medium text-yellow-900 mb-1">😊 Emociones</div>
                          <div className="flex flex-wrap gap-1">
                            {entry.emotions.map((emotion, i) => (
                              <Badge key={i} variant="secondary" className="bg-yellow-100 text-yellow-700">
                                {emotion}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {entry.symbols && entry.symbols.length > 0 && (
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="font-medium text-purple-900 mb-1">🔮 Símbolos</div>
                            <div className="flex flex-wrap gap-1">
                              {entry.symbols.map((symbol, i) => (
                                <Badge key={i} variant="secondary" className="bg-purple-100 text-purple-700">
                                  {symbol}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.people && entry.people.length > 0 && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="font-medium text-blue-900 mb-1">👥 Personas</div>
                            <div className="flex flex-wrap gap-1">
                              {entry.people.map((person, i) => (
                                <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-700">
                                  {person}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.places && entry.places.length > 0 && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="font-medium text-green-900 mb-1">📍 Lugares</div>
                            <div className="flex flex-wrap gap-1">
                              {entry.places.map((place, i) => (
                                <Badge key={i} variant="secondary" className="bg-green-100 text-green-700">
                                  {place}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {entry.interpretation && (
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <div className="font-medium text-indigo-900 mb-2">💡 Interpretación</div>
                          <p className="text-sm text-indigo-800">{entry.interpretation}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
