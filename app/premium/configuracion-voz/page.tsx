
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  Volume2, 
  Key, 
  Info, 
  Check, 
  X, 
  ExternalLink,
  Sparkles,
  Clock,
  Shield,
  Zap
} from 'lucide-react'

interface VoiceConfig {
  hasCustomApiKey: boolean
  voiceMinutesUsed: number
  voiceMinutesLimit: number
  voiceResetDate: string
  isPremium: boolean
}

export default function VoiceConfigPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState<VoiceConfig | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      loadConfig()
    }
  }, [status, router])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/user/voice-config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      } else {
        toast.error('Error al cargar la configuración')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveApiKey = async () => {
    if (!apiKey || apiKey.trim().length < 10) {
      toast.error('Por favor ingresa una API key válida')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/user/voice-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      })

      if (response.ok) {
        toast.success('✨ API key configurada correctamente')
        setApiKey('')
        
        // Marcar que la voz acaba de despertar para mostrar notificación
        localStorage.setItem('voice_just_awakened', 'true')
        
        loadConfig()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Error al guardar la API key')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteApiKey = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu API key personal? Volverás a usar la cuota compartida de 100 min/mes.')) {
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/user/voice-config', {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('API key eliminada correctamente')
        loadConfig()
      } else {
        toast.error('Error al eliminar la API key')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!config) {
    return null
  }

  const usagePercentage = (config.voiceMinutesUsed / config.voiceMinutesLimit) * 100
  const daysUntilReset = config.voiceResetDate 
    ? Math.max(0, 30 - Math.floor((Date.now() - new Date(config.voiceResetDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Volume2 className="w-8 h-8" />
            Configuración de Voz
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu uso de voces realistas y conecta tu API key personal de ElevenLabs
          </p>
        </div>

        {/* Estado Actual */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {config.hasCustomApiKey ? (
                <>
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Usando API Key Personal
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Usando Cuota Compartida
                </>
              )}
            </CardTitle>
            <CardDescription>
              {config.hasCustomApiKey 
                ? 'Tienes acceso ilimitado a voces realistas con tu propia cuenta de ElevenLabs'
                : `${config.voiceMinutesLimit} minutos mensuales de voces realistas`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!config.hasCustomApiKey && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      Consumo este mes: {config.voiceMinutesUsed} / {config.voiceMinutesLimit} minutos
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {usagePercentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Se resetea en {daysUntilReset} días</span>
                </div>

                {usagePercentage >= 80 && (
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      {usagePercentage >= 100 
                        ? 'Has agotado tus minutos de este mes. Tus companions hablarán en su idioma mágico hasta el próximo reset 🌙✨'
                        : 'Estás cerca de agotar tus minutos. Considera conectar tu propia API key para uso ilimitado.'
                      }
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {config.hasCustomApiKey && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Check className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">API Key Conectada</p>
                    <p className="text-sm text-green-700">
                      Estás usando tu propia cuenta de ElevenLabs. El uso se carga a tu cuota personal.
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={handleDeleteApiKey}
                  disabled={saving}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Desconectar y volver a cuota compartida
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs de Configuración */}
        <Tabs defaultValue={config.hasCustomApiKey ? 'info' : 'setup'} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="setup">Conectar API Key</TabsTrigger>
            <TabsTrigger value="info">Información</TabsTrigger>
          </TabsList>

          {/* Tab: Conectar API Key */}
          <TabsContent value="setup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Conecta tu Cuenta de ElevenLabs
                </CardTitle>
                <CardDescription>
                  Usa tus propios minutos de ElevenLabs para acceso ilimitado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!config.hasCustomApiKey && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key de ElevenLabs</Label>
                      <div className="flex gap-2">
                        <Input
                          id="apiKey"
                          type={showApiKey ? 'text' : 'password'}
                          placeholder="sk_..."
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="font-mono"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? '👁️' : '👁️‍🗨️'}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tu API key se guarda encriptada y nunca se comparte
                      </p>
                    </div>

                    <Button 
                      onClick={handleSaveApiKey} 
                      disabled={saving || !apiKey}
                      className="w-full"
                    >
                      {saving ? 'Guardando...' : 'Guardar API Key'}
                    </Button>
                  </>
                )}

                <Alert>
                  <Shield className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Seguridad:</strong> Tu API key se almacena encriptada y solo se usa para generar voces cuando tú interactúas con tus companions. Nunca se comparte con terceros.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Cómo obtener tu API Key */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">¿Cómo obtener tu API Key?</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-medium">Crea una cuenta en ElevenLabs</p>
                      <a 
                        href="https://elevenlabs.io" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        Ir a elevenlabs.io <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div>
                      <p className="font-medium">Ve a tu perfil → API Keys</p>
                      <p className="text-muted-foreground">Haz clic en tu avatar y selecciona "Profile Settings"</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div>
                      <p className="font-medium">Genera una nueva API key</p>
                      <p className="text-muted-foreground">Copia la key y pégala arriba</p>
                    </div>
                  </li>
                </ol>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <p className="font-medium text-blue-900 mb-1">💡 Consejo</p>
                  <p className="text-blue-700">
                    ElevenLabs ofrece un plan gratuito con 10,000 caracteres/mes (~10 minutos). Planes premium desde $5/mes con 30,000 caracteres (~30 minutos).
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Información */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>¿Cómo Funciona?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">🎭 Voces Básicas (Gratis, Ilimitado)</h4>
                    <p className="text-sm text-muted-foreground">
                      Tus companions pueden hablar en su "idioma mágico" usando la voz del navegador. Es funcional pero menos expresivo.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">✨ Voces Realistas (Cuota Compartida)</h4>
                    <p className="text-sm text-muted-foreground">
                      Como usuario Premium, tienes 100 minutos/mes de voces profesionales de ElevenLabs. Cada companion tiene su propia voz única y expresiva.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">🔑 API Key Personal (Ilimitado)</h4>
                    <p className="text-sm text-muted-foreground">
                      Al conectar tu propia cuenta de ElevenLabs, no hay límites. El uso se carga a tu cuota personal, y tienes control total sobre tu gasto.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preguntas Frecuentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-sm mb-1">¿Qué pasa si se me acaban los minutos?</p>
                  <p className="text-sm text-muted-foreground">
                    Tus companions seguirán funcionando, pero hablarán en su "idioma mágico" hasta que se resetee tu cuota mensual o conectes tu API key.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-sm mb-1">¿Es seguro conectar mi API key?</p>
                  <p className="text-sm text-muted-foreground">
                    Sí. Tu API key se encripta antes de guardarse y solo se usa cuando generas voces. Nunca se comparte ni se usa para otros fines.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-sm mb-1">¿Puedo cambiar o eliminar mi API key?</p>
                  <p className="text-sm text-muted-foreground">
                    Sí, en cualquier momento. Si la eliminas, volverás a usar la cuota compartida de 100 min/mes.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-sm mb-1">¿Cuánto cuesta ElevenLabs?</p>
                  <p className="text-sm text-muted-foreground">
                    Tienen un plan gratuito con 10,000 caracteres/mes. Los planes de pago empiezan en $5/mes con 30,000 caracteres (~30 minutos de audio).
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
