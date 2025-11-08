'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart, Star, Sparkles, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GratitudeTracker } from './gratitude-tracker';

interface GratitudeEntry {
  id: string;
  date: Date;
  items: string[];
  highlight?: string;
  learnings?: string;
  tomorrow?: string;
  mood: number;
}

export function GratitudeDiarySection() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    items: ['', '', ''],
    highlight: '',
    learnings: '',
    tomorrow: '',
    mood: 8,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: GratitudeEntry = {
      id: Date.now().toString(),
      date: new Date(),
      items: formData.items.filter((item) => item.trim() !== ''),
      highlight: formData.highlight || undefined,
      learnings: formData.learnings || undefined,
      tomorrow: formData.tomorrow || undefined,
      mood: formData.mood,
    };
    setEntries([newEntry, ...entries]);
    setFormData({
      items: ['', '', ''],
      highlight: '',
      learnings: '',
      tomorrow: '',
      mood: 8,
    });
    setShowForm(false);
  };

  const averageMood = entries.length > 0
    ? entries.reduce((sum, e) => sum + e.mood, 0) / entries.length
    : 0;

  return (
    <div className="space-y-8">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white">
          <Heart className="w-8 h-8 mx-auto mb-2 text-pink-600" />
          <div className="text-3xl font-bold text-pink-600">{entries.length}</div>
          <div className="text-sm text-gray-600 mt-1">Días de Gratitud</div>
        </Card>

        <Card className="p-6 text-center border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
          <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
          <div className="text-3xl font-bold text-yellow-600">
            {entries.reduce((sum, e) => sum + e.items.length, 0)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Cosas Agradecidas</div>
        </Card>

        <Card className="p-6 text-center border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <Sun className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <div className="text-3xl font-bold text-purple-600">
            {averageMood.toFixed(1)}/10
          </div>
          <div className="text-sm text-gray-600 mt-1">Ánimo Promedio</div>
        </Card>
      </div>

      {/* Botón para agregar entrada */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowForm(!showForm)}
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Entrada de Gratitud
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border-2 border-pink-200 shadow-xl"
        >
          <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-600" />
            Registro de Gratitud Diaria
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Tres cosas por las que estoy agradecido hoy:
              </Label>
              {formData.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-semibold">
                    {index + 1}
                  </div>
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...formData.items];
                      newItems[index] = e.target.value;
                      setFormData({ ...formData, items: newItems });
                    }}
                    placeholder={`Gratitud ${index + 1}...`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="highlight">✨ Lo Mejor del Día</Label>
              <Textarea
                id="highlight"
                value={formData.highlight}
                onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                placeholder="¿Qué fue lo más especial de hoy?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="learnings">📚 Aprendizajes del Día</Label>
              <Textarea
                id="learnings"
                value={formData.learnings}
                onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
                placeholder="¿Qué aprendiste hoy?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tomorrow">🌟 Intención para Mañana</Label>
              <Input
                id="tomorrow"
                value={formData.tomorrow}
                onChange={(e) => setFormData({ ...formData, tomorrow: e.target.value })}
                placeholder="¿Cómo quieres que sea tu mañana?"
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600" />
                Estado de Ánimo: {formData.mood}/10
              </Label>
              <Slider
                value={[formData.mood]}
                onValueChange={(value) => setFormData({ ...formData, mood: value[0] })}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Guardar Gratitud
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de entradas */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-600" />
          Diario de Gratitud
        </h3>

        {entries.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2">
            <div className="text-6xl mb-4">🙏</div>
            <p className="text-lg text-gray-500 mb-2">
              Aún no hay entradas de gratitud
            </p>
            <p className="text-sm text-gray-400">
              Comienza tu práctica de gratitud diaria
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-pink-500">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg text-gray-800">
                        {entry.date.toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </h4>
                      <Badge className="bg-pink-100 text-pink-700">
                        💖 {entry.mood}/10
                      </Badge>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="font-medium text-yellow-900 mb-3 flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Agradecido por:
                      </div>
                      <ul className="space-y-2">
                        {entry.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-yellow-800">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-900 font-semibold text-xs">
                              {i + 1}
                            </span>
                            <span className="flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {entry.highlight && (
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Lo Mejor del Día
                        </div>
                        <p className="text-sm text-purple-800">{entry.highlight}</p>
                      </div>
                    )}

                    {entry.learnings && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="font-medium text-blue-900 mb-2">📚 Aprendizajes</div>
                        <p className="text-sm text-blue-800">{entry.learnings}</p>
                      </div>
                    )}

                    {entry.tomorrow && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="font-medium text-green-900 mb-2">🌟 Intención para Mañana</div>
                        <p className="text-sm text-green-800">{entry.tomorrow}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
