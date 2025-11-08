
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Save, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface TrackerField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'number' | 'checkbox'
  value: any
  placeholder?: string
}

interface InteractiveTrackerProps {
  templateId: string
  title: string
  description: string
  fields: TrackerField[]
  onSave: (data: any) => Promise<void>
  initialData?: any
}

export function InteractiveTracker({
  templateId,
  title,
  description,
  fields: initialFields,
  onSave,
  initialData
}: InteractiveTrackerProps) {
  const [fields, setFields] = useState<TrackerField[]>(initialFields)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Cargar datos guardados
  useEffect(() => {
    if (initialData) {
      setFields(prevFields => 
        prevFields.map(field => ({
          ...field,
          value: initialData[field.id] ?? field.value
        }))
      )
    }
  }, [initialData])

  // Auto-guardar cada 30 segundos si hay cambios
  useEffect(() => {
    if (!hasChanges) return

    const autoSaveInterval = setInterval(async () => {
      await handleSave()
    }, 30000) // 30 segundos

    return () => clearInterval(autoSaveInterval)
  }, [hasChanges, fields])

  const handleFieldChange = (fieldId: string, value: any) => {
    setFields(prev => 
      prev.map(field => 
        field.id === fieldId ? { ...field, value } : field
      )
    )
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const data = fields.reduce((acc, field) => {
        acc[field.id] = field.value
        return acc
      }, {} as any)

      await onSave(data)
      setHasChanges(false)
      toast.success('Guardado exitosamente', {
        description: 'Tus cambios están seguros en la nube'
      })
    } catch (error) {
      toast.error('Error al guardar', {
        description: 'Por favor intenta de nuevo'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const renderField = (field: TrackerField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={field.value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="border-hogara-gold/30 focus:border-hogara-gold"
          />
        )

      case 'textarea':
        return (
          <Textarea
            value={field.value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="border-hogara-gold/30 focus:border-hogara-gold resize-none"
          />
        )

      case 'number':
        return (
          <Input
            type="number"
            value={field.value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="border-hogara-gold/30 focus:border-hogara-gold"
          />
        )

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-hogara-gold/30",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(new Date(field.value), "PPP", { locale: es })
                ) : (
                  <span>Selecciona una fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => handleFieldChange(field.id, date?.toISOString())}
                locale={es}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.id}
              checked={field.value || false}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              className="h-4 w-4 rounded border-hogara-gold/30 text-hogara-gold focus:ring-hogara-gold"
            />
            <label
              htmlFor={field.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.placeholder}
            </label>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-hogara-gold" />
          <span className="text-sm font-medium text-hogara-gold uppercase tracking-wider">
            Plantilla Interactiva Premium
          </span>
        </div>
        <h1 className="font-serif text-3xl text-hogara-gray">
          {title}
        </h1>
        <p className="text-hogara-gray/70 max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Formulario */}
      <Card className="p-8 bg-white/80 backdrop-blur-sm border-hogara-gold/20 shadow-lg">
        <div className="space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label 
                htmlFor={field.id}
                className="text-hogara-gray font-medium"
              >
                {field.label}
              </Label>
              {renderField(field)}
            </div>
          ))}
        </div>

        {/* Botón de guardar */}
        <div className="mt-8 pt-6 border-t border-hogara-gold/20">
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="w-full bg-hogara-gold hover:bg-hogara-gold/90 text-white"
            size="lg"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {hasChanges ? 'Guardar Cambios' : 'Guardado ✓'}
              </>
            )}
          </Button>
          {hasChanges && (
            <p className="text-xs text-center text-hogara-gray/60 mt-2">
              Guardado automático cada 30 segundos
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
