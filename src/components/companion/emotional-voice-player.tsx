
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmotionalVoicePlayerProps {
  companionType: string;
  companionName?: string;
  emotionType: 'bienvenida' | 'consolo' | 'animo' | 'felicitacion';
  trigger: string;
  context?: string;
  onComplete?: () => void;
  onError?: (error: string) => void;
  autoPlay?: boolean;
}

interface EmotionalPhrase {
  id: string;
  text_content: string;
  audio_url: string;
  duration_seconds: number;
  companion_type: string;
  emotion_type: string;
  tone?: string;
}

const emotionConfig = {
  bienvenida: {
    color: '#FFD700',
    icon: '✨',
    auraColor: 'from-amber-400/30 to-yellow-500/20',
    label: 'Te da la bienvenida'
  },
  consolo: {
    color: '#87CEEB',
    icon: '💙',
    auraColor: 'from-blue-400/30 to-cyan-500/20',
    label: 'Está aquí para consolarte'
  },
  animo: {
    color: '#98FB98',
    icon: '🌟',
    auraColor: 'from-green-400/30 to-emerald-500/20',
    label: 'Te anima con su voz'
  },
  felicitacion: {
    color: '#FF69B4',
    icon: '🎉',
    auraColor: 'from-pink-400/30 to-rose-500/20',
    label: 'Celebra contigo'
  }
};

export default function EmotionalVoicePlayer({
  companionType,
  companionName = 'Tu compañero',
  emotionType,
  trigger,
  context,
  onComplete,
  onError,
  autoPlay = true
}: EmotionalVoicePlayerProps) {
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [phrase, setPhrase] = useState<EmotionalPhrase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const config = emotionConfig[emotionType];

  useEffect(() => {
    fetchPhrase();
  }, [companionType, emotionType]);

  const fetchPhrase = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/companion/emotional-voices/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companion_type: companionType,
          emotion_type: emotionType,
          trigger,
          context
        })
      });

      const data = await response.json();

      if (!data.success) {
        setShowFallback(true);
        setError(data.error || 'No hay voces disponibles en este momento');
        if (onError) {
          onError(data.error);
        }
        return;
      }

      setPhrase(data.phrase);

      if (autoPlay && audioRef.current) {
        // Pequeño delay para la animación
        setTimeout(() => {
          audioRef.current?.play();
        }, 800);
      }

    } catch (err: any) {
      console.error('Error obteniendo frase emocional:', err);
      setShowFallback(true);
      setError('No puedo usar mi voz ahora, pero estoy aquí para ti');
      if (onError) {
        onError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleAudioPlay = () => {
    setPlaying(true);
  };

  const handleAudioEnded = () => {
    setPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };

  const handleAudioError = () => {
    setShowFallback(true);
    setError('Error al reproducir la voz');
    if (onError) {
      onError('Error de reproducción');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 space-y-4"
      >
        <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${config.auraColor} animate-pulse`}>
          <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-4xl">{config.icon}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 animate-pulse">
          {companionName} está preparando su voz...
        </p>
      </motion.div>
    );
  }

  if (showFallback || !phrase) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 space-y-4"
      >
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gray-300/30 to-gray-400/20">
          <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-4xl opacity-50">{config.icon}</span>
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 italic">
            {error || 'Mi voz mágica no está disponible ahora'}
          </p>
          <p className="text-xs text-gray-500">
            Pero estoy aquí para escucharte y acompañarte. 💙
          </p>
        </div>
        <button
          onClick={() => {
            setShowFallback(false);
            fetchPhrase();
          }}
          className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all"
        >
          Intentar de nuevo
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      {/* Audio element */}
      {phrase && (
        <audio
          ref={audioRef}
          src={phrase.audio_url}
          onPlay={handleAudioPlay}
          onEnded={handleAudioEnded}
          onError={handleAudioError}
          preload="auto"
        />
      )}

      {/* Visual feedback antes de reproducir */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center space-y-3"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`relative w-28 h-28 mx-auto rounded-full bg-gradient-to-br ${config.auraColor}`}
            >
              <div className="absolute inset-3 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                <span className="text-5xl">{config.icon}</span>
              </div>
            </motion.div>
            
            <p className="text-sm font-medium text-gray-700">
              {companionName} {config.label}
            </p>
            
            {!autoPlay && (
              <button
                onClick={handlePlay}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all transform hover:scale-105"
              >
                Escuchar su voz
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual feedback durante reproducción */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-4 max-w-md"
          >
            {/* Aura pulsante */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${config.auraColor}`}
            >
              <div className="absolute inset-4 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center">
                <motion.span 
                  className="text-6xl"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                >
                  {config.icon}
                </motion.span>
              </div>
              
              {/* Ondas sonoras */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={`absolute inset-0 rounded-full border-2 border-current`}
                  style={{ color: config.color }}
                  animate={{
                    scale: [1, 1.5, 2],
                    opacity: [0.6, 0.3, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Texto de la frase con efecto typewriter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg"
            >
              <p className="text-base text-gray-800 italic leading-relaxed">
                "{phrase.text_content}"
              </p>
            </motion.div>

            {/* Indicador de reproducción */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: phrase.duration_seconds, ease: 'linear' }}
              className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
