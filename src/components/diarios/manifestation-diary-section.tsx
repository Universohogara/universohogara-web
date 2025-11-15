'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Zap, TrendingUp, Trophy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManifestationTracker } from './manifestation-tracker';

interface ManifestationEntry {
  id: string;
  date: Date;
  goal: string;
  affirmations: string[];
  visualizations?: string;
  actions: string[];
  feelings?: string;
  gratitudeForIt?: string;
  progress: number;
  achieved: boolean;
  achievedDate?: Date;
}

export function ManifestationDiarySection() {
  const [entries, setEntries] = useState<ManifestationEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    goal: '',
    affirmations: ['', ''],
    visualizations: '',
    actions: [''],
    feelings: '',
    gratitudeForIt: '',
    progress: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: ManifestationEntry = {
      id: Date.now().toString(),
      date: new Date(),
      goal: formData.goal,
      affirmations: formData.affirmations.filter((a) => a.trim() !== ''),
      visualizations: formData.visualizations || undefined,
      actions: formData.actions.filter((a) => a.trim() !== ''),
      feelings: formData.feelings || undefined,
      gratitudeForIt: formData.gratitudeForIt || undefined,
      progress: formData.progress,
      achieved: false,
    };
    setEntries([newEntry, ...entries]);
    setFormData({
      goal: '',
      affirmations: ['', ''],
      visualizations: '',
      actions: [''],
      feelings: '',
      gratitudeForIt: '',
      progress: 0,
    });
    setShowForm(false);
  };

  const toggleAchieved = (id: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              achieved: !entry.achieved,
              achievedDate: !entry.achieved ? new Date() : undefined,
            }
          : entry
      )
    );
  };

  const activeGoals = entries.filter((e) => !e.achieved);
  const achievedGoals = entries.filter((e) => e.achieved);
  const averageProgress = activeGoals.length > 0
    ? activeGoals.reduce((sum, e) => sum + e.progress, 0) / activeGoals.length
    : 0;

  return (
    <div className="space-y-8">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 text-center border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <div className="text-3xl font-bold text-purple-600">{activeGoals.length}</div>
          <div className="text-sm text-gray-600 mt-1">Metas Activas</div>
        </Card>

        <Card className="p-6 text-center border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-3xl font-bold text-green-600">{achievedGoals.length}</div>
          <div className="text-sm text-gray-600 mt-1">Metas Logradas</div>
        </Card>

        <Card className="p-6 text-center border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-3xl font-bold text-blue-600">
            {averageProgress.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Progreso Promedio</div>
        </Card>

        <Card className="p-6 text-center border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
          <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
          <div className="text-3xl font-bold text-yellow-600">{entries.length}</div>
          <div className="text-sm text-gray-600 mt-1">Total Manifestaciones</div>
        </Card>
      </div>

      {/* Botón para agregar entrada */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowForm(!showForm)}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Manifestación
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border-2 border-purple-200 shadow-xl"
        >
          <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            Nueva Manifestación
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="goal">Meta u Objetivo *</Label>
              <Input
                id="goal"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                required
                placeholder="¿Qué quieres manifestar?"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Afirmaciones Positivas</Label>
              {formData.affirmations.map((affirmation, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={affirmation}
                    onChange={(e) => {
                      const newAffirmations = [...formData.affirmations];
                      newAffirmations[index] = e.target.value;
                      setFormData({ ...formData, affirmations: newAffirmations });
                    }}
                    placeholder={`Afirmación ${index + 1}: "Yo soy...", "Yo tengo..."`}
                  />
                  {index === formData.affirmations.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          affirmations: [...formData.affirmations, ''],
                        })
                      }
                    >
                      +
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="visualizations">Visualización</Label>
              <Textarea
                id="visualizations"
                value={formData.visualizations}
                onChange={(e) => setFormData({ ...formData, visualizations: e.target.value })}
                placeholder="Describe cómo te ves cuando ya has logrado tu meta..."
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Acciones Concretas *</Label>
              {formData.actions.map((action, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={action}
                    onChange={(e) => {
                      const newActions = [...formData.actions];
                      newActions[index] = e.target.value;
                      setFormData({ ...formData, actions: newActions });
                    }}
                    placeholder={`Acción ${index + 1}: ¿Qué harás para lograrlo?`}
                    required={index === 0}
                  />
                  {index === formData.actions.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          actions: [...formData.actions, ''],
                        })
                      }
                    >
                      +
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feelings">¿Cómo te sientes al manifestar esto?</Label>
              <Input
                id="feelings"
                value={formData.feelings}
                onChange={(e) => setFormData({ ...formData, feelings: e.target.value })}
                placeholder="Emocionado, confiado, esperanzado..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gratitudeForIt">Gratitud (como si ya lo tuvieras)</Label>
              <Textarea
                id="gratitudeForIt"
                value={formData.gratitudeForIt}
                onChange={(e) => setFormData({ ...formData, gratitudeForIt: e.target.value })}
                placeholder="Gracias por..., estoy agradecido de..."
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Progreso Actual: {formData.progress}%
              </Label>
              <Slider
                value={[formData.progress]}
                onValueChange={(value) => setFormData({ ...formData, progress: value[0] })}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              >
                Guardar Manifestación
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tabs para metas activas y logradas */}
      <div className="space-y-6">
        {/* Metas Activas */}
        <div className="space-y-4">
          <h3 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Metas En Progreso
          </h3>

          {activeGoals.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-lg text-gray-500 mb-2">
                No hay metas activas
              </p>
              <p className="text-sm text-gray-400">
                Comienza a manifestar tus sueños
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeGoals.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-purple-600" />
                            <h4 className="font-semibold text-xl text-gray-800">
                              {entry.goal}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-500">
                            Iniciado: {entry.date.toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleAchieved(entry.id)}
                          className="flex-shrink-0"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Marcar Logrado
                        </Button>
                      </div>

                      {/* Barra de progreso */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">Progreso</span>
                          <span className="font-bold text-purple-600">{entry.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <motion.div
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${entry.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      {entry.affirmations.length > 0 && (
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="font-medium text-purple-900 mb-2">💫 Afirmaciones</div>
                          <ul className="space-y-1 text-sm text-purple-800">
                            {entry.affirmations.map((affirmation, i) => (
                              <li key={i}>• {affirmation}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {entry.actions.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="font-medium text-blue-900 mb-2">🎯 Acciones</div>
                          <ul className="space-y-1 text-sm text-blue-800">
                            {entry.actions.map((action, i) => (
                              <li key={i}>• {action}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {entry.visualizations && (
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <div className="font-medium text-indigo-900 mb-2">👁️ Visualización</div>
                          <p className="text-sm text-indigo-800">{entry.visualizations}</p>
                        </div>
                      )}

                      {entry.gratitudeForIt && (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <div className="font-medium text-yellow-900 mb-2">🙏 Gratitud</div>
                          <p className="text-sm text-yellow-800">{entry.gratitudeForIt}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Metas Logradas */}
        {achievedGoals.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-green-600" />
              Metas Logradas
            </h3>

            <div className="grid gap-4">
              {achievedGoals.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-green-500 bg-gradient-to-br from-green-50/30 to-white">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-green-600" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-800">
                            {entry.goal}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Logrado: {entry.achievedDate?.toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          ✓ Completado
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
