
'use client';

import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceControlsProps {
  voiceState: 'idle' | 'listening' | 'processing' | 'speaking';
  transcript: string;
  error: string | null;
  isSupported: boolean;
  onToggleVoice: () => void;
  className?: string;
}

export const VoiceControls = ({
  voiceState,
  transcript,
  error,
  isSupported,
  onToggleVoice,
  className
}: VoiceControlsProps) => {
  if (!isSupported) {
    return (
      <div className={cn('text-center p-4 bg-destructive/10 rounded-lg', className)}>
        <p className="text-sm text-destructive">
          Tu navegador no soporta conversación por voz. 
          Por favor, usa Chrome o Edge.
        </p>
      </div>
    );
  }

  const getButtonIcon = () => {
    switch (voiceState) {
      case 'listening':
        return <Mic className="h-5 w-5 animate-pulse" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'speaking':
        return <Volume2 className="h-5 w-5 animate-pulse" />;
      default:
        return <MicOff className="h-5 w-5" />;
    }
  };

  const getButtonText = () => {
    switch (voiceState) {
      case 'listening':
        return 'Escuchando...';
      case 'processing':
        return 'Pensando...';
      case 'speaking':
        return 'Hablando...';
      default:
        return 'Hablar con micrófono';
    }
  };

  const getButtonVariant = () => {
    if (voiceState === 'listening') return 'default';
    if (voiceState === 'processing') return 'secondary';
    if (voiceState === 'speaking') return 'default';
    return 'outline';
  };

  return (
    <div className={cn('space-y-3', className)}>
      <Button
        onClick={onToggleVoice}
        variant={getButtonVariant()}
        size="lg"
        className={cn(
          'w-full transition-all duration-300',
          voiceState === 'listening' && 'bg-primary shadow-lg shadow-primary/50 scale-105',
          voiceState === 'speaking' && 'bg-primary shadow-lg shadow-primary/50'
        )}
        disabled={voiceState === 'processing'}
      >
        {getButtonIcon()}
        <span className="ml-2">{getButtonText()}</span>
      </Button>

      {/* Transcripción en tiempo real */}
      {transcript && voiceState === 'listening' && (
        <div className="p-3 bg-muted rounded-lg border border-primary/20 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-sm text-muted-foreground mb-1 font-medium">
            Tú estás diciendo:
          </p>
          <p className="text-base text-foreground">
            {transcript}
          </p>
        </div>
      )}

      {/* Estado de procesamiento */}
      {voiceState === 'processing' && (
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 animate-pulse">
          <p className="text-sm text-muted-foreground text-center">
            Preparando respuesta...
          </p>
        </div>
      )}

      {/* Indicador de voz */}
      {voiceState === 'speaking' && (
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.6s'
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              Tu acompañante está hablando
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* Instrucciones */}
      {voiceState === 'idle' && !error && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            💡 Pulsa el botón y habla. Tu acompañante te responderá con su voz.
          </p>
        </div>
      )}
    </div>
  );
};
