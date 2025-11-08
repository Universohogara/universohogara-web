
'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Crown, Loader2, Lock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PremiumGuardProps {
  children: React.ReactNode
  requiredTier?: 'standard' | 'total' // undefined = cualquier premium sirve
  fallbackUrl?: string
}

export function PremiumGuard({ 
  children, 
  requiredTier,
  fallbackUrl = '/premium' 
}: PremiumGuardProps) {
  const { data: session, status } = useSession() || {}
  const router = useRouter()

  const isAdmin = session?.user?.role === 'admin'
  const isPremium = session?.user?.isPremium || false
  const hasAccess = isAdmin || isPremium

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname))
    }
  }, [status, router])

  // Cargando...
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hogara-cream via-white to-hogara-pink/5">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-hogara-gold mx-auto" />
          <p className="text-hogara-gray">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // No autenticado (debería ser interceptado por el useEffect)
  if (status === 'unauthenticated') {
    return null
  }

  // No tiene acceso premium
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hogara-cream via-white to-hogara-pink/5 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 border-2 border-hogara-gold/20">
            <div className="mx-auto w-20 h-20 bg-hogara-gold/10 rounded-full flex items-center justify-center">
              <Lock className="h-10 w-10 text-hogara-gold" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-heading text-hogara-gray">
                Contenido Premium
              </h2>
              <p className="text-hogara-gray/70">
                Esta sección es exclusiva para miembros Premium de Hogara Planner
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/premium">
                <Button className="w-full bg-hogara-gold hover:bg-hogara-gold/90 text-white" size="lg">
                  <Crown className="mr-2 h-5 w-5" />
                  Ver Planes Premium
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full" size="lg">
                  Volver al Inicio
                </Button>
              </Link>
            </div>

            <p className="text-xs text-hogara-gray/60">
              Desde 7€/mes • Sin permanencia • Cancela cuando quieras
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Tiene acceso - mostrar contenido
  return <>{children}</>
}
