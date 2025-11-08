
/**
 * Componente: Indicador de Límites de Voces Mágicas
 * Muestra cuántas voces mágicas quedan disponibles
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VoiceLimits {
  used: number;
  limit: number;
  purchased: number;
  total: number;
  remaining: number;
  percentage: number;
  canUseVoice: boolean;
  resetDate: string;
}

export function MagicVoiceLimits() {
  const [limits, setLimits] = useState<VoiceLimits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLimits();
  }, []);

  const fetchLimits = async () => {
    try {
      const response = await fetch('/api/magic-voice/limits');
      if (response.ok) {
        const data = await response.json();
        setLimits(data.limits);
      }
    } catch (error) {
      console.error('Error al obtener límites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !limits) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span>Cargando...</span>
      </div>
    );
  }

  const resetDate = new Date(limits.resetDate);
  const daysUntilReset = Math.ceil(
    (resetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  // Color según el porcentaje usado
  const getColor = () => {
    if (limits.percentage < 50) return 'text-green-600 dark:text-green-400';
    if (limits.percentage < 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColor = () => {
    if (limits.percentage < 50) return 'bg-green-500';
    if (limits.percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-sm">Voces Mágicas</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {limits.remaining} / {limits.total}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div 
              className={`h-full transition-all ${getProgressColor()}`}
              style={{ width: `${limits.percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className={getColor()}>
              {limits.percentage}% usado
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Se renueva en {daysUntilReset} días
            </span>
          </div>
        </div>

        {/* Info adicional */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Zap className="w-3 h-3" />
            <span>Plan: {limits.limit} voces/mes</span>
          </div>
          {limits.purchased > 0 && (
            <Badge variant="outline" className="text-xs">
              +{limits.purchased} compradas
            </Badge>
          )}
        </div>

        {/* Advertencia si quedan pocas */}
        {limits.remaining < 10 && limits.remaining > 0 && (
          <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-1">
            <Sparkles className="w-3 h-3" />
            <span>¡Pocas voces mágicas disponibles!</span>
          </div>
        )}

        {/* Agotado */}
        {limits.remaining === 0 && (
          <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 pt-1">
            <Sparkles className="w-3 h-3" />
            <span>✨ La magia se ha agotado</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

