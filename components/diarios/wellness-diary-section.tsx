
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart, Droplets, Moon, Sparkles, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WellnessTracker } from './wellness-tracker';

interface WellnessEntry {
  id: string;
  date: Date;
  mood: number;
  energy: number;
  sleep: { hours: number; quality: number };
  water: number;
  meditation?: number;
  gratitude?: string[];
  achievements?: string[];
  challenges?: string[];
  notes?: string;
}

export function WellnessDiarySection() {
  const [entries, setEntries] = useState<WellnessEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mood: 5,
    energy: 5,
    sleepHours: 7,
    sleepQuality: 5,
    water: 8,
    meditation: 0,
    gratitude: ['', '', ''],
    achievements: [''],
    challenges: [''],
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: WellnessEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: formData.mood,
      energy: formData.energy,
      sleep: {
        hours: formData.sleepHours,
        quality: formData.sleepQuality,
      },
      water: formData.water,
      meditation: formData.meditation > 0 ? formData.meditation : undefined,
      gratitude: formData.gratitude.filter((g) => g.trim() !== ''),
      achievements: formData.achievements.filter((a) => a.trim() !== ''),
      challenges: formData.challenges.filter((c) => c.trim() !== ''),
      notes: formData.notes || undefined,
    };
    setEntries([newEntry, ...entries]);
    setFormData({
      mood: 5,
      energy: 5,
      sleepHours: 7,
      sleepQuality: 5,
      water: 8,
      meditation: 0,
      gratitude: ['', '', ''],
      achievements: [''],
      challenges: [''],
      notes: '',
    });
    setShowForm(false);
  };

  const averageMood = entries.length > 0
    ? entries.reduce((sum, e) => sum + e.mood, 0) / entries.length
    : 0;
  const averageEnergy = entries.length > 0
    ? entries.reduce((sum, e) => sum + e.energy, 0) / entries.length
    : 0;
  const averageSleep = entries.length > 0
    ? entries.reduce((sum, e) => sum + e.sleep.hours, 0) / entries.length
    : 0;
  const totalWater = entries.reduce((sum, e) => sum + e.water, 0);

  const getMoodEmoji = (value: number) => {
    if (value <= 2) return '😢';
    if (value <= 4) return '😕';
    if (value <= 6) return '😐';
    if (value <= 8) return '🙂';
    return '😊';
  };

  return (
    <div className="space-y-8">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 text-center border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white">
          <Heart className="w-8 h-8 mx-auto mb-2 text-pink-600" />
          <div className="text-3xl font-bold text-pink-600">
            {averageMood.toFixed(1)} {getMoodEmoji(averageMood)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Ánimo Promedio</div>
        </Card>

        <Card className="p-6 text-center border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
          <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
          <div className="text-3xl font-bold text-yellow-600">
            {averageEnergy.toFixed(1)}/10
          </div>
          <div className="text-sm text-gray-600 mt-1">Energía Promedio</div>
        </Card>

        <Card className="p-6 text-center border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <Moon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <div className="text-3xl font-bold text-purple-600">
            {averageSleep.toFixed(1)}h
          </div>
          <div className="text-sm text-gray-600 mt-1">Sueño Promedio</div>
        </Card>

        <Card className="p-6 text-center border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <Droplets className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-3xl font-bold text-blue-600">{totalWater}</div>
          <div className="text-sm text-gray-600 mt-1">Vasos de Agua Total</div>
        </Card>
      </div>

      {/* Botón para agregar entrada */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowForm(!showForm)}
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Registrar Día de Bienestar
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
            <Sparkles className="w-6 h-6 text-pink-600" />
            Registro de Bienestar
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Estado de Ánimo */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600" />
                Estado de Ánimo: {formData.mood}/10 {getMoodEmoji(formData.mood)}
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

            {/* Nivel de Energía */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-600" />
                Nivel de Energía: {formData.energy}/10
              </Label>
              <Slider
                value={[formData.energy]}
                onValueChange={(value) => setFormData({ ...formData, energy: value[0] })}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* Sueño */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-purple-600" />
                  Horas de Sueño: {formData.sleepHours}h
                </Label>
                <Slider
                  value={[formData.sleepHours]}
                  onValueChange={(value) => setFormData({ ...formData, sleepHours: value[0] })}
                  min={0}
                  max={12}
                  step={0.5}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label>Calidad del Sueño: {formData.sleepQuality}/10</Label>
                <Slider
                  value={[formData.sleepQuality]}
                  onValueChange={(value) => setFormData({ ...formData, sleepQuality: value[0] })}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Agua y Meditación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  Vasos de Agua: {formData.water}
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={formData.water}
                  onChange={(e) => setFormData({ ...formData, water: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-3">
                <Label>Meditación (minutos)</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.meditation}
                  onChange={(e) => setFormData({ ...formData, meditation: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Gratitud */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Gratitud (3 cosas por las que estás agradecido)</Label>
              {formData.gratitude.map((item, index) => (
                <Input
                  key={index}
                  value={item}
                  onChange={(e) => {
                    const newGratitude = [...formData.gratitude];
                    newGratitude[index] = e.target.value;
                    setFormData({ ...formData, gratitude: newGratitude });
                  }}
                  placeholder={`Gratitud ${index + 1}...`}
                />
              ))}
            </div>

            {/* Logros */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Logros del Día</Label>
              {formData.achievements.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newAchievements = [...formData.achievements];
                      newAchievements[index] = e.target.value;
                      setFormData({ ...formData, achievements: newAchievements });
                    }}
                    placeholder="Un logro..."
                  />
                  {index === formData.achievements.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, achievements: [...formData.achievements, ''] })}
                    >
                      +
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Desafíos */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Desafíos Enfrentados</Label>
              {formData.challenges.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newChallenges = [...formData.challenges];
                      newChallenges[index] = e.target.value;
                      setFormData({ ...formData, challenges: newChallenges });
                    }}
                    placeholder="Un desafío..."
                  />
                  {index === formData.challenges.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, challenges: [...formData.challenges, ''] })}
                    >
                      +
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label>Notas Adicionales</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Reflexiones, sentimientos, observaciones..."
                rows={4}
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              >
                Guardar Registro
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de entradas */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-600" />
          Historial de Bienestar
        </h3>

        {entries.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2">
            <div className="text-6xl mb-4">🌸</div>
            <p className="text-lg text-gray-500 mb-2">
              Aún no hay registros de bienestar
            </p>
            <p className="text-sm text-gray-400">
              Comienza a cuidar tu bienestar registrando tu día
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
                      <div className="flex gap-2">
                        <Badge className="bg-pink-100 text-pink-700">
                          {getMoodEmoji(entry.mood)} {entry.mood}/10
                        </Badge>
                        <Badge className="bg-yellow-100 text-yellow-700">
                          ⚡ {entry.energy}/10
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Moon className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                        <div className="text-sm font-medium text-purple-700">
                          {entry.sleep.hours}h
                        </div>
                        <div className="text-xs text-gray-600">
                          Calidad: {entry.sleep.quality}/10
                        </div>
                      </div>

                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Droplets className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                        <div className="text-sm font-medium text-blue-700">
                          {entry.water} vasos
                        </div>
                        <div className="text-xs text-gray-600">Agua</div>
                      </div>

                      {entry.meditation && (
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <Sparkles className="w-5 h-5 mx-auto mb-1 text-green-600" />
                          <div className="text-sm font-medium text-green-700">
                            {entry.meditation} min
                          </div>
                          <div className="text-xs text-gray-600">Meditación</div>
                        </div>
                      )}
                    </div>

                    {entry.gratitude && entry.gratitude.length > 0 && (
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="font-medium text-yellow-900 mb-2">🙏 Gratitud</div>
                        <ul className="space-y-1 text-sm text-yellow-800">
                          {entry.gratitude.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {entry.achievements && entry.achievements.length > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="font-medium text-green-900 mb-2">🏆 Logros</div>
                        <ul className="space-y-1 text-sm text-green-800">
                          {entry.achievements.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {entry.challenges && entry.challenges.length > 0 && (
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="font-medium text-orange-900 mb-2">💪 Desafíos</div>
                        <ul className="space-y-1 text-sm text-orange-800">
                          {entry.challenges.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {entry.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {entry.notes}
                      </p>
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
