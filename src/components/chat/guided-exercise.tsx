
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, X, CheckCircle2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ExerciseStep {
  step: number
  instruction: string
  duration: number
  action?: string
}

interface Exercise {
  id: string
  title: string
  category: string
  duration: number
  icon: string
  description: string
  steps: ExerciseStep[]
  benefits: string[]
}

interface GuidedExerciseProps {
  exercise: Exercise
  onComplete: () => void
  onClose: () => void
}

export function GuidedExercise({ exercise, onComplete, onClose }: GuidedExerciseProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(exercise.steps[0]?.duration || 0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            // Ir al siguiente paso
            if (currentStep < exercise.steps.length - 1) {
              const nextStep = currentStep + 1
              setCurrentStep(nextStep)
              return exercise.steps[nextStep].duration
            } else {
              // Ejercicio completado
              setIsActive(false)
              setCompleted(true)
              return 0
            }
          }
          return time - 1
        })
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, currentStep, exercise.steps])

  const toggleExercise = () => {
    setIsActive(!isActive)
  }

  const skipToNext = () => {
    if (currentStep < exercise.steps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      setTimeLeft(exercise.steps[nextStep].duration)
    }
  }

  const handleComplete = () => {
    onComplete()
    onClose()
  }

  const currentStepData = exercise.steps[currentStep]
  const progress = ((currentStep + 1) / exercise.steps.length) * 100

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">{exercise.icon}</span>
            {exercise.title}
          </DialogTitle>
          <DialogDescription>
            {exercise.description} · Duración: {exercise.duration} min
          </DialogDescription>
        </DialogHeader>

        {!completed ? (
          <div className="space-y-6 py-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Paso {currentStep + 1} de {exercise.steps.length}</span>
                <span>{timeLeft}s restantes</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Current Step */}
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="text-center space-y-4">
                <div className="text-lg font-medium text-gray-900">
                  {currentStepData.instruction}
                </div>

                {currentStepData.action && (
                  <div className="text-4xl animate-pulse">
                    {currentStepData.action === 'inhale' && '🌊 Inhala...'}
                    {currentStepData.action === 'hold' && '⏸️ Mantén...'}
                    {currentStepData.action === 'exhale' && '💨 Exhala...'}
                    {currentStepData.action === 'repeat' && '🔄 Repite...'}
                  </div>
                )}

                <div className="text-6xl font-bold text-purple-600">
                  {timeLeft}
                </div>
              </div>
            </Card>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={toggleExercise}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isActive ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    {currentStep === 0 && timeLeft === exercise.steps[0].duration ? 'Comenzar' : 'Continuar'}
                  </>
                )}
              </Button>

              {currentStep < exercise.steps.length - 1 && (
                <Button
                  onClick={skipToNext}
                  variant="outline"
                  size="lg"
                >
                  Siguiente paso
                </Button>
              )}

              <Button
                onClick={onClose}
                variant="ghost"
                size="lg"
              >
                <X className="mr-2 h-4 w-4" />
                Cerrar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-8">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Ejercicio completado! 🎉
              </h3>
              <p className="text-gray-600">
                Has completado el ejercicio de {exercise.title}
              </p>
            </div>

            {/* Benefits */}
            <Card className="p-6 bg-green-50 text-left">
              <h4 className="font-semibold text-green-900 mb-3">
                Beneficios de este ejercicio:
              </h4>
              <ul className="space-y-2">
                {exercise.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-green-800">
                    <span className="text-green-600">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleComplete}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Terminar
              </Button>
              <Button
                onClick={() => {
                  setCurrentStep(0)
                  setTimeLeft(exercise.steps[0].duration)
                  setCompleted(false)
                  setIsActive(false)
                }}
                variant="outline"
                size="lg"
              >
                Repetir ejercicio
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
