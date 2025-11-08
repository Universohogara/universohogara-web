
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Key, Check, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'
import {
  VoiceState,
  VOICE_NARRATIVES,
  getVoiceNarrative,
  BasicNarrative,
  AwakeningNarrative,
  AwakenedNarrative
} from '@/lib/voice-state-manager'

interface MagicalVoicePanelProps {
  state: VoiceState
  companionType: string
  companionName: string
  onAwaken?: () => void
  onClose?: () => void
}

export function MagicalVoicePanel({
  state,
  companionType,
  companionName,
  onAwaken,
  onClose
}: MagicalVoicePanelProps) {
  const router = useRouter()
  const narrative = getVoiceNarrative(state, companionType)

  // No mostrar panel si la voz ya está despertada
  if (state === 'awakened') {
    return null
  }

  const handleAction = () => {
    if (state === 'basic') {
      // Cambiar a estado awakening (mostrar explicación)
      onAwaken?.()
    } else if (state === 'awakening') {
      // Redirigir a la página de configuración de voz
      router.push('/premium/configuracion-voz')
    }
  }

  // Type guards para determinar el tipo de narrativa
  const isBasicNarrative = (n: typeof narrative): n is BasicNarrative => {
    return 'description' in n && 'ctaText' in n && !('note' in n)
  }

  const isAwakeningNarrative = (n: typeof narrative): n is AwakeningNarrative => {
    return 'description' in n && 'ctaText' in n && 'note' in n
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 right-4 z-50 w-full max-w-md"
      >
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {state === 'basic' ? (
                  <div className="rounded-full bg-muted p-2">
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                  </div>
                ) : (
                  <div className="rounded-full bg-primary/10 p-2">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                )}
                <CardTitle className="text-xl">
                  {narrative.title}
                </CardTitle>
              </div>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  ✕
                </Button>
              )}
            </div>
            <CardDescription className="text-base leading-relaxed">
              {(isBasicNarrative(narrative) || isAwakeningNarrative(narrative)) && narrative.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {isAwakeningNarrative(narrative) && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {narrative.note}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleAction}
              className="w-full text-lg font-medium py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl"
              size="lg"
            >
              {(isBasicNarrative(narrative) || isAwakeningNarrative(narrative)) && narrative.ctaText}
            </Button>

            {state === 'basic' && (
              <p className="text-center text-xs text-muted-foreground">
                Puedes seguir usando la voz terrenal de {companionName}, o despertarla para escuchar su verdadera magia.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Notificación pequeña cuando la voz se despierta exitosamente
 */
export function VoiceAwakenedNotification({
  companionType,
  companionName,
  onClose
}: {
  companionType: string
  companionName: string
  onClose?: () => void
}) {
  const narrative = getVoiceNarrative('awakened', companionType) as AwakenedNarrative

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="fixed top-4 right-4 z-50 w-full max-w-md"
    >
      <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 to-secondary/10 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1,
                repeat: 2
              }}
              className="rounded-full bg-primary p-3"
            >
              <Check className="h-6 w-6 text-primary-foreground" />
            </motion.div>
            <div className="flex-1 space-y-2">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {narrative.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {narrative.message}
              </p>
              <p className="text-xs text-primary font-medium">
                ¡{companionName} puede hablar con su voz verdadera! ✨
              </p>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
