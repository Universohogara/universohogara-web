
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Calendar, Dumbbell, Award, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { ExerciseTracker } from './exercise-tracker';

interface ExerciseEntry {
  id: string;
  date: Date;
  type: string;
  duration: number;
  intensity: 'light' | 'moderate' | 'high';
  calories?: number;
  weight?: number;
  mood?: string;
  notes?: string;
}

export function ExerciseDiarySection() {
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    type: string;
    duration: string;
    intensity: 'light' | 'moderate' | 'high';
    calories: string;
    weight: string;
    mood: string;
    notes: string;
  }>({
    type: '',
    duration: '',
    intensity: 'moderate',
    calories: '',
    weight: '',
    mood: '',
    notes: '',
  });

  const exerciseTypes = [
    { value: 'cardio', label: 'Cardio', icon: '🏃' },
    { value: 'strength', label: 'Fuerza', icon: '💪' },
    { value: 'yoga', label: 'Yoga', icon: '🧘' },
    { value: 'pilates', label: 'Pilates', icon: '🤸' },
    { value: 'swimming', label: 'Natación', icon: '🏊' },
    { value: 'cycling', label: 'Ciclismo', icon: '🚴' },
    { value: 'walking', label: 'Caminata', icon: '🚶' },
    { value: 'other', label: 'Otro', icon: '⚡' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: ExerciseEntry = {
      id: Date.now().toString(),
      date: new Date(),
      type: formData.type,
      duration: parseInt(formData.duration),
      intensity: formData.intensity,
      calories: formData.calories ? parseInt(formData.calories) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      mood: formData.mood || undefined,
      notes: formData.notes || undefined,
    };
    setEntries([newEntry, ...entries]);
    setFormData({
      type: '',
      duration: '',
      intensity: 'moderate',
      calories: '',
      weight: '',
      mood: '',
      notes: '',
    });
    setShowForm(false);
  };

  const totalWorkouts = entries.length;
  const totalMinutes = entries.reduce((sum, entry) => sum + entry.duration, 0);
  const totalCalories = entries.reduce(
    (sum, entry) => sum + (entry.calories || 0),
    0
  );
  const averageWeight =
    entries.filter((e) => e.weight).length > 0
      ? entries.reduce((sum, entry) => sum + (entry.weight || 0), 0) /
        entries.filter((e) => e.weight).length
      : 0;

  return (
    <Tabs defaultValue="entries" className="w-full">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
        <TabsTrigger value="entries">📝 Entradas</TabsTrigger>
        <TabsTrigger value="tracker">📊 Tracker Anual</TabsTrigger>
      </TabsList>

      <TabsContent value="entries" className="space-y-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 text-center border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <Dumbbell className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-3xl font-bold text-green-600">{totalWorkouts}</div>
          <div className="text-sm text-gray-600 mt-1">Entrenamientos</div>
        </Card>

        <Card className="p-6 text-center border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-3xl font-bold text-blue-600">{totalMinutes}</div>
          <div className="text-sm text-gray-600 mt-1">Minutos Totales</div>
        </Card>

        <Card className="p-6 text-center border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          <div className="text-3xl font-bold text-orange-600">{totalCalories}</div>
          <div className="text-sm text-gray-600 mt-1">Calorías Quemadas</div>
        </Card>

        <Card className="p-6 text-center border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <div className="text-3xl font-bold text-purple-600">
            {averageWeight > 0 ? averageWeight.toFixed(1) : '-'}
          </div>
          <div className="text-sm text-gray-600 mt-1">Peso Promedio (kg)</div>
        </Card>
      </div>

      {/* Botón para agregar entrada */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowForm(!showForm)}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Entrada de Ejercicio
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-200 shadow-xl"
        >
          <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-green-600" />
            Registrar Entrenamiento
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Ejercicio *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {exerciseTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duración (minutos) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  required
                  placeholder="30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intensity">Intensidad *</Label>
                <Select
                  value={formData.intensity}
                  onValueChange={(value: 'light' | 'moderate' | 'high') =>
                    setFormData({ ...formData, intensity: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">🟢 Suave</SelectItem>
                    <SelectItem value="moderate">🟡 Moderada</SelectItem>
                    <SelectItem value="high">🔴 Intensa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Calorías Quemadas</Label>
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={(e) =>
                    setFormData({ ...formData, calories: e.target.value })
                  }
                  placeholder="250"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Peso Actual (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  placeholder="70.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood">Estado de Ánimo</Label>
                <Input
                  id="mood"
                  value={formData.mood}
                  onChange={(e) =>
                    setFormData({ ...formData, mood: e.target.value })
                  }
                  placeholder="Energético, cansado..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas del Entrenamiento</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Cómo te sentiste, ejercicios realizados, logros..."
                rows={4}
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                Guardar Entrenamiento
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de entradas */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-green-600" />
          Historial de Entrenamientos
        </h3>

        {entries.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2">
            <div className="text-6xl mb-4">💪</div>
            <p className="text-lg text-gray-500 mb-2">
              Aún no hay entrenamientos registrados
            </p>
            <p className="text-sm text-gray-400">
              Comienza agregando tu primer entrenamiento del día
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry, index) => {
              const exerciseType = exerciseTypes.find((t) => t.value === entry.type);
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{exerciseType?.icon}</span>
                          <div>
                            <h4 className="font-semibold text-lg text-gray-800">
                              {exerciseType?.label}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {entry.date.toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            ⏱️ {entry.duration} min
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={
                              entry.intensity === 'high'
                                ? 'bg-red-100 text-red-700'
                                : entry.intensity === 'moderate'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }
                          >
                            {entry.intensity === 'high'
                              ? '🔴 Intensa'
                              : entry.intensity === 'moderate'
                              ? '🟡 Moderada'
                              : '🟢 Suave'}
                          </Badge>
                          {entry.calories && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                              🔥 {entry.calories} kcal
                            </Badge>
                          )}
                          {entry.weight && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              ⚖️ {entry.weight} kg
                            </Badge>
                          )}
                          {entry.mood && (
                            <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                              💭 {entry.mood}
                            </Badge>
                          )}
                        </div>

                        {entry.notes && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      </TabsContent>

      <TabsContent value="tracker">
        <ExerciseTracker />
      </TabsContent>
    </Tabs>
  );
}
