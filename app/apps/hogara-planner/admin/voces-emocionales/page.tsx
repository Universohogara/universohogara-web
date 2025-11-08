
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface EmotionalPhrase {
  id: string;
  companion_type: string;
  phrase_id: string;
  emotion_type: string;
  text_content: string;
  audio_url: string;
  duration_seconds: number;
  language: string;
  version: number;
  is_active: boolean;
  tone?: string;
  created_at: string;
  last_updated: string;
}

const companionTypes = [
  { value: 'ken', label: 'Ken (Pastor Alemán)' },
  { value: 'ada', label: 'Ada (Sabia)' },
  { value: 'lumi', label: 'Lumi (Luz)' },
  { value: 'sprig', label: 'Sprig (Naturaleza)' },
  { value: 'nimbo', label: 'Nimbo (Nube)' },
  { value: 'fabel', label: 'Fabel (Cuentacuentos)' }
];

const emotionTypes = [
  { value: 'bienvenida', label: 'Bienvenida', icon: '✨' },
  { value: 'consolo', label: 'Consuelo', icon: '💙' },
  { value: 'animo', label: 'Ánimo', icon: '🌟' },
  { value: 'felicitacion', label: 'Felicitación', icon: '🎉' }
];

export default function VocesEmocionalesAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [phrases, setPhrases] = useState<EmotionalPhrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState<EmotionalPhrase | null>(null);
  const [filterCompanion, setFilterCompanion] = useState<string>('all');
  const [filterEmotion, setFilterEmotion] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    companion_type: 'ken',
    phrase_id: '',
    emotion_type: 'bienvenida',
    text_content: '',
    audio_url: '',
    duration_seconds: 0,
    language: 'es',
    tone: 'warm',
    is_active: true
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated') {
      fetchPhrases();
    }
  }, [status]);

  const fetchPhrases = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCompanion !== 'all') params.append('companion_type', filterCompanion);
      if (filterEmotion !== 'all') params.append('emotion_type', filterEmotion);
      
      const response = await fetch(`/api/companion/emotional-voices?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setPhrases(data.phrases);
      }
    } catch (error) {
      console.error('Error cargando frases:', error);
      toast.error('Error al cargar las frases emocionales');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const endpoint = editingPhrase 
        ? '/api/companion/emotional-voices'
        : '/api/companion/emotional-voices';
      
      const method = editingPhrase ? 'PUT' : 'POST';
      const body = editingPhrase 
        ? { ...formData, id: editingPhrase.id }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingPhrase ? 'Frase actualizada' : 'Frase creada exitosamente');
        setShowForm(false);
        setEditingPhrase(null);
        resetForm();
        fetchPhrases();
      } else {
        toast.error(data.error || 'Error al guardar la frase');
      }
    } catch (error) {
      console.error('Error guardando frase:', error);
      toast.error('Error al guardar la frase');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás segura de eliminar esta frase?')) {
      return;
    }

    try {
      const response = await fetch(`/api/companion/emotional-voices?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Frase eliminada');
        fetchPhrases();
      } else {
        toast.error(data.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error eliminando frase:', error);
      toast.error('Error al eliminar la frase');
    }
  };

  const handleEdit = (phrase: EmotionalPhrase) => {
    setEditingPhrase(phrase);
    setFormData({
      companion_type: phrase.companion_type,
      phrase_id: phrase.phrase_id,
      emotion_type: phrase.emotion_type,
      text_content: phrase.text_content,
      audio_url: phrase.audio_url,
      duration_seconds: phrase.duration_seconds,
      language: phrase.language,
      tone: phrase.tone || 'warm',
      is_active: phrase.is_active
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      companion_type: 'ken',
      phrase_id: '',
      emotion_type: 'bienvenida',
      text_content: '',
      audio_url: '',
      duration_seconds: 0,
      language: 'es',
      tone: 'warm',
      is_active: true
    });
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingPhrase(null);
    resetForm();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Voces Emocionales
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona las frases pregrabadas para momentos emocionales clave
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg transition-all"
          >
            ➕ Nueva Frase
          </Button>
        </div>

        {/* Filtros */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Companion</label>
              <Select value={filterCompanion} onValueChange={setFilterCompanion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los companions</SelectItem>
                  {companionTypes.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Emoción</label>
              <Select value={filterEmotion} onValueChange={setFilterEmotion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las emociones</SelectItem>
                  {emotionTypes.map(e => (
                    <SelectItem key={e.value} value={e.value}>
                      {e.icon} {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={fetchPhrases}
            variant="outline"
            className="mt-4"
          >
            Aplicar Filtros
          </Button>
        </Card>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingPhrase ? 'Editar' : 'Nueva'} Frase Emocional
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Companion</label>
                      <Select
                        value={formData.companion_type}
                        onValueChange={(value) => setFormData({...formData, companion_type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {companionTypes.map(c => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Tipo de Emoción</label>
                      <Select
                        value={formData.emotion_type}
                        onValueChange={(value) => setFormData({...formData, emotion_type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {emotionTypes.map(e => (
                            <SelectItem key={e.value} value={e.value}>
                              {e.icon} {e.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">ID de Frase</label>
                      <Input
                        value={formData.phrase_id}
                        onChange={(e) => setFormData({...formData, phrase_id: e.target.value})}
                        placeholder="ken_consolo_01"
                        required
                        disabled={!!editingPhrase}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Ej: ken_consolo_01, ada_animo_02
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Duración (segundos)</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.duration_seconds}
                        onChange={(e) => setFormData({...formData, duration_seconds: parseFloat(e.target.value)})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Texto de la Frase</label>
                    <Textarea
                      value={formData.text_content}
                      onChange={(e) => setFormData({...formData, text_content: e.target.value})}
                      placeholder="Estoy aquí para escucharte..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">URL del Audio</label>
                    <Input
                      value={formData.audio_url}
                      onChange={(e) => setFormData({...formData, audio_url: e.target.value})}
                      placeholder="https://cdn.hogara.com/voices/ken_consolo_01.mp3"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL del archivo MP3 en el CDN
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Idioma</label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => setFormData({...formData, language: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Tono</label>
                      <Select
                        value={formData.tone}
                        onValueChange={(value) => setFormData({...formData, tone: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="warm">Cálido</SelectItem>
                          <SelectItem value="gentle">Suave</SelectItem>
                          <SelectItem value="encouraging">Alentador</SelectItem>
                          <SelectItem value="joyful">Alegre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                          className="rounded"
                        />
                        <span className="text-sm font-medium">Activa</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                      {editingPhrase ? 'Actualizar' : 'Crear'} Frase
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de Frases */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Frases Registradas ({phrases.length})</h2>
          {phrases.length === 0 ? (
            <Card className="p-12 text-center text-gray-500">
              No hay frases registradas. Crea la primera.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {phrases.map(phrase => (
                <Card key={phrase.id} className="p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {emotionTypes.find(e => e.value === phrase.emotion_type)?.icon}
                        </span>
                        <div>
                          <h3 className="font-bold text-lg">
                            {companionTypes.find(c => c.value === phrase.companion_type)?.label} - {phrase.phrase_id}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {emotionTypes.find(e => e.value === phrase.emotion_type)?.label} • 
                            {phrase.duration_seconds}s • v{phrase.version}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">"{phrase.text_content}"</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded ${phrase.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {phrase.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                        <span>•</span>
                        <span>{phrase.tone}</span>
                      </div>
                      <audio controls className="w-full max-w-md mt-2">
                        <source src={phrase.audio_url} type="audio/mpeg" />
                      </audio>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(phrase)}
                      >
                        ✏️ Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(phrase.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
