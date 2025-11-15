
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicTrack {
  id: string;
  name: string;
  file: string;
  description: string;
}

const AMBIENT_TRACKS: MusicTrack[] = [
  {
    id: 'chimenea',
    name: 'Chimenea Acogedora',
    file: '/premium-music/chimenea-acogedora.wav',
    description: 'Cálida y reconfortante',
  },
  {
    id: 'cinematica',
    name: 'Cinématica Ambient',
    file: '/premium-music/cinematica-ambient.wav',
    description: 'Atmosférica y envolvente',
  },
  {
    id: 'cristal',
    name: 'Energía de Cristal',
    file: '/premium-music/energia-cristal.wav',
    description: 'Clara y energizante',
  },
  {
    id: 'espiritual',
    name: 'Espiritual Moderna',
    file: '/premium-music/espiritual-moderna.wav',
    description: 'Contemplativa y serena',
  },
  {
    id: 'hora-dorada',
    name: 'Hora Dorada',
    file: '/premium-music/hora-dorada.wav',
    description: 'Suave y luminosa',
  },
  {
    id: 'meditacion',
    name: 'Meditación del Bosque',
    file: '/premium-music/meditacion-bosque.wav',
    description: 'Relajante y natural',
  },
  {
    id: 'lluvia',
    name: 'Ritual de Lluvia',
    file: '/premium-music/ritual-lluvia.wav',
    description: 'Tranquilizante y pacífica',
  },
  {
    id: 'cosmico',
    name: 'Viaje Cósmico',
    file: '/premium-music/viaje-cosmico.wav',
    description: 'Expansiva y celestial',
  },
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(AMBIENT_TRACKS[0]);
  const [showTrackList, setShowTrackList] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(currentTrack.file);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeTrack = (track: MusicTrack) => {
    const wasPlaying = isPlaying;
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setCurrentTrack(track);
    setShowTrackList(false);

    setTimeout(() => {
      if (wasPlaying && audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-full shadow-xl border border-hogara-gold/20 p-3 flex items-center gap-3"
      >
        <Button
          onClick={togglePlay}
          size="icon"
          className="h-10 w-10 rounded-full bg-gradient-to-r from-hogara-pink to-hogara-gold text-white hover:opacity-90 transition-opacity"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>

        <div className="flex items-center gap-2 pr-2">
          <Popover open={showTrackList} onOpenChange={setShowTrackList}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-hogara-gray hover:text-hogara-gold"
              >
                <Music className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-hogara-gray mb-3">
                  Selecciona Música Ambiente
                </h4>
                {AMBIENT_TRACKS.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => changeTrack(track)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      currentTrack.id === track.id
                        ? 'bg-hogara-gold/10 border border-hogara-gold/30'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-sm text-hogara-gray">{track.name}</div>
                    <div className="text-xs text-hogara-gray/60">{track.description}</div>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-hogara-gray hover:text-hogara-gold"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          <Slider
            value={[isMuted ? 0 : volume * 100]}
            onValueChange={([val]) => {
              setVolume(val / 100);
              if (val > 0) setIsMuted(false);
            }}
            max={100}
            step={1}
            className="w-20"
          />
        </div>
      </motion.div>

      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg px-3 py-2 text-xs text-hogara-gray whitespace-nowrap"
        >
          {currentTrack.name}
        </motion.div>
      )}
    </div>
  );
}
