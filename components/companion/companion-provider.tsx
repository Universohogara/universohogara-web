
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FloatingCompanion } from './floating-companion'
import { usePathname } from 'next/navigation'

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [companion, setCompanion] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const pathname = usePathname()

  // Rutas donde NO mostrar el acompañante flotante
  const excludedPaths = [
    '/auth/login',
    '/auth/register',
    '/premium/acompanante'  // No mostrar en la página de selección
  ]

  const shouldShowCompanion = !excludedPaths.includes(pathname)

  useEffect(() => {
    if (session && status === 'authenticated' && !hasLoaded) {
      loadCompanion()
    } else if (!session && status === 'unauthenticated') {
      setIsLoading(false)
      setHasLoaded(false)
    }
  }, [session, status, hasLoaded])

  // Escuchar eventos de actualización del companion
  useEffect(() => {
    const handleCompanionUpdate = (event: CustomEvent) => {
      console.log('🔔 Evento de companion detectado:', event.detail)
      if (event.detail?.companion) {
        setCompanion(event.detail.companion)
        setIsLoading(false)
      }
    }

    window.addEventListener('companion-updated' as any, handleCompanionUpdate)
    
    return () => {
      window.removeEventListener('companion-updated' as any, handleCompanionUpdate)
    }
  }, [])

  const loadCompanion = async () => {
    try {
      const res = await fetch('/api/companion')
      const data = await res.json()
      
      if (data.companion && data.companion.is_active) {
        setCompanion(data.companion)
      } else {
        setCompanion(null)
      }
      
      setHasLoaded(true)
    } catch (error) {
      console.error('Error al cargar acompañante:', error)
      setHasLoaded(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCompanion = (updatedData: any) => {
    setCompanion(updatedData)
  }

  return (
    <>
      {children}
      
      {/* Mostrar acompañante flotante si existe y está activo */}
      {!isLoading && companion && shouldShowCompanion && (
        <FloatingCompanion
          companion={companion}
          onUpdate={handleUpdateCompanion}
        />
      )}
    </>
  )
}
