
/**
 * Componente: Diálogo de Magia Agotada
 * Se muestra cuando el usuario se queda sin voces mágicas
 */

'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star, Calendar, Check } from 'lucide-react';

interface Pack {
  type: string;
  voices: number;
  price: number;
  emoji: string;
  name?: string;
  description?: string;
  popular?: boolean;
  bestValue?: boolean;
}

interface MagicDepletedDialogProps {
  open: boolean;
  onClose: () => void;
  limits?: {
    used: number;
    total: number;
    resetDate: string;
  };
  packs?: Pack[];
}

export function MagicDepletedDialog({
  open,
  onClose,
  limits,
  packs,
}: MagicDepletedDialogProps) {
  const defaultPacks: Pack[] = [
    {
      type: 'pack_50',
      voices: 50,
      price: 2.99,
      emoji: '🌟',
      name: 'Pack Estrella',
      description: '50 voces mágicas adicionales',
    },
    {
      type: 'pack_150',
      voices: 150,
      price: 4.99,
      emoji: '✨',
      name: 'Pack Brillante',
      description: '150 voces mágicas adicionales',
      popular: true,
    },
    {
      type: 'pack_500',
      voices: 500,
      price: 9.99,
      emoji: '🔮',
      name: 'Pack Místico',
      description: '500 voces mágicas adicionales',
      bestValue: true,
    },
  ];

  const availablePacks = packs || defaultPacks;

  const resetDate = limits?.resetDate ? new Date(limits.resetDate) : null;
  const daysUntilReset = resetDate
    ? Math.ceil((resetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const handlePurchase = (packType: string) => {
    // TODO: Integrar con Stripe cuando esté listo
    console.log('Comprar pack:', packType);
    alert('🚧 Sistema de pago en desarrollo.\nPronto podrás comprar packs de voces mágicas.');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Sparkles className="w-16 h-16 text-purple-600 dark:text-purple-400 animate-pulse" />
              <div className="absolute inset-0 blur-xl bg-purple-400/30 animate-pulse"></div>
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            ✨ Mi magia se ha agotado...
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            He usado toda mi energía mágica por este mes.
            <br />
            Pero puedes ayudarme a recuperarla con estos packs especiales.
          </DialogDescription>
        </DialogHeader>

        {/* Info de límites */}
        {limits && (
          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Voces usadas este mes:</span>
              <span className="font-semibold">
                {limits.used} / {limits.total}
              </span>
            </div>
            {daysUntilReset && (
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Se renuevan en:
                </span>
                <span className="font-semibold">{daysUntilReset} días</span>
              </div>
            )}
          </div>
        )}

        {/* Packs disponibles */}
        <div className="space-y-3">
          <h3 className="font-semibold text-center mb-4">
            Elige tu pack de voces mágicas:
          </h3>

          {availablePacks.map((pack) => (
            <Card
              key={pack.type}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                pack.popular
                  ? 'border-purple-400 dark:border-purple-600'
                  : pack.bestValue
                  ? 'border-amber-400 dark:border-amber-600'
                  : ''
              }`}
            >
              {pack.popular && (
                <Badge className="absolute top-2 right-2 bg-purple-600">
                  Más Popular
                </Badge>
              )}
              {pack.bestValue && (
                <Badge className="absolute top-2 right-2 bg-amber-600">
                  Mejor Valor
                </Badge>
              )}

              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{pack.emoji}</span>
                      <h4 className="font-semibold text-lg">
                        {pack.name || `Pack de ${pack.voices} voces`}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {pack.description || `${pack.voices} voces mágicas adicionales`}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Válido por 30 días
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {(pack.price / pack.voices).toFixed(3)}€ por voz
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 ml-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        €{pack.price.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {pack.voices} voces
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePurchase(pack.type)}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Comprar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nota informativa */}
        <div className="text-xs text-center text-muted-foreground mt-4">
          💡 Los packs comprados se suman a tus voces mensuales y caducan en 30 días
        </div>

        <Button
          variant="ghost"
          onClick={onClose}
          className="w-full"
        >
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
  );
}

