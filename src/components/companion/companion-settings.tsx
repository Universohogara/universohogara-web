
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Check, Sparkles, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'

interface CompanionType {
  id: string
  name: string
  description: string
  image: string
}

const COMPANION_TYPES: CompanionType[] = [
  {
    id: 'ada',
    name: 'Ada',
    description: 'El Hada de los Sueños',
    image: '/images/companions/companion-hada-fairy.png',
  },
  {
    id: 'luna',
    name: 'Luna',
    description: 'Guardiana de la Serenidad',
    image: '/images/companions/companion-lumi-light.png',
  },
  {
    id: 'ember',
    name: 'Ember',
    description: 'Espíritu del Coraje',
    image: '/images/companions/companion-draguito-dragon.png',
  },
  {
    id: 'sage',
    name: 'Sage',
    description: 'Elfo de la Reflexión',
    image: '/images/companions/companion-elfo-elf.png',
  },
  {
    id: 'sprig',
    name: 'Sprig',
    description: 'Espíritu de planta',
    image: '/images/companions/companion-sprig-plant.png',
  },
  {
    id: 'willow',
    name: 'Willow',
    description: 'Guardiana del Bosque',
    image: '/images/companions/companion-willow-tree.png',
  },
  {
    id: 'coral',
    name: 'Coral',
    description: 'Espíritu del Océano',
    image: '/images/companions/companion-nimbo-cloud.png',
  },
  {
    id: 'orion',
    name: 'Orion',
    description: 'Guía Celestial',
    image: '/images/companions/companion-unicornito-unicorn.png',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Luz del Amanecer',
    image: '/images/companions/companion-human-warm.png',
  },
  {
    id: 'ken',
    name: 'Ken',
    description: 'El Guardián Leal',
    image: '/images/companions/ken/ken_guardian_004.png',
  }
]

interface CompanionSettingsProps {
  companion: {
    id: string
    type: string
    name: string
    color_theme: string
    voice_tone: string
    personality: string
  }
  onUpdate: (data: any) => void
  onClose: () => void
}

export function CompanionSettings({ companion, onUpdate, onClose }: CompanionSettingsProps) {
  const [selectedType, setSelectedType] = useState(companion.type)
  const [name, setName] = useState(companion.name)
  const [voiceTone, setVoiceTone] = useState(companion.voice_tone)
  const [personality, setPersonality] = useState(companion.personality)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          name,
          voice_tone: voiceTone,
          personality
        })
      })

      const data = await res.json()

      if (res.ok) {
        setShowSuccess(true)
        
        // Disparar evento para notificar al CompanionProvider
        const event = new CustomEvent('companion-updated', {
          detail: { companion: data.companion }
        })
        window.dispatchEvent(event)
        console.log('✨ Acompañante actualizado y evento disparado')
        
        setTimeout(() => {
          setShowSuccess(false)
          onUpdate(data.companion)
          onClose()
        }, 1500)
      } else {
        console.error('Error del servidor:', data.error)
        alert('Error al guardar: ' + (data.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error al actualizar:', error)
      alert('Error de conexión al guardar los cambios')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-[600px] flex flex-col">
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Settings className="w-10 h-10 text-[#D4AF37] mx-auto mb-2" />
            <h3 className="text-xl font-serif text-[#8B7355]">
              Personaliza tu acompañante
            </h3>
            <p className="text-sm text-[#A0826D] mt-1">
              Cambia el tipo de criatura y ajusta su comportamiento
            </p>
          </div>

          {showSuccess && (
            <Alert className="bg-green-50 border-green-300">
              <Check className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-900">
                ✨ Configuración guardada correctamente
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Selector de tipo de criatura */}
            <div>
              <Label className="text-[#8B7355] text-base font-semibold mb-3 block">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Tipo de criatura mágica
              </Label>
              <RadioGroup value={selectedType} onValueChange={setSelectedType}>
                <div className="grid grid-cols-3 gap-3">
                  {COMPANION_TYPES.map((type) => (
                    <label
                      key={type.id}
                      className={`
                        relative cursor-pointer rounded-lg border-2 p-3 transition-all
                        ${selectedType === type.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-md'
                          : 'border-[#E8DCC8] hover:border-[#D4AF37]/50'
                        }
                      `}
                    >
                      <RadioGroupItem value={type.id} className="sr-only" />
                      
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm">
                          <Image
                            src={type.image}
                            alt={type.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-[#8B7355] text-xs">
                            {type.name}
                          </h4>
                          <p className="text-[10px] text-[#A0826D] mt-0.5">
                            {type.description}
                          </p>
                        </div>

                        {selectedType === type.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1 right-1"
                          >
                            <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                          </motion.div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
              <p className="text-xs text-[#A0826D] mt-2">
                Selecciona la criatura que mejor resuene contigo
              </p>
            </div>

            <div className="border-t border-[#E8DCC8] pt-4" />

            {/* Resto de configuración */}
            <div>
              <Label htmlFor="name" className="text-[#8B7355]">
                Nombre del acompañante
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 border-[#E8DCC8] focus:border-[#D4AF37]"
                placeholder="Ej: Luna, Sol, Estrella..."
              />
            </div>

            <div>
              <Label htmlFor="voice-tone" className="text-[#8B7355]">
                Tono de voz
              </Label>
              <Select value={voiceTone} onValueChange={setVoiceTone}>
                <SelectTrigger className="mt-1 border-[#E8DCC8]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warm">Cálido</SelectItem>
                  <SelectItem value="gentle">Suave</SelectItem>
                  <SelectItem value="cheerful">Alegre</SelectItem>
                  <SelectItem value="serene">Sereno</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-[#A0826D] mt-1">
                Cómo {name || 'tu acompañante'} se comunica contigo
              </p>
            </div>

            <div>
              <Label htmlFor="personality" className="text-[#8B7355]">
                Personalidad
              </Label>
              <Select value={personality} onValueChange={setPersonality}>
                <SelectTrigger className="mt-1 border-[#E8DCC8]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empathetic">Empático</SelectItem>
                  <SelectItem value="wise">Sabio</SelectItem>
                  <SelectItem value="playful">Juguetón</SelectItem>
                  <SelectItem value="calm">Calmado</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-[#A0826D] mt-1">
                La forma en que {name || 'tu acompañante'} responde a tus emociones
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-[#E8DCC8] bg-[#F5F0E8] flex gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1 border-[#E8DCC8] text-[#8B7355]"
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white"
        >
          {isLoading ? 'Guardando...' : '✨ Guardar cambios'}
        </Button>
      </div>
    </div>
  )
}
