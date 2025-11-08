
'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

/**
 * Componente Client-Side para cargar Puter.js
 * Se carga ANTES del contenido de la página para garantizar disponibilidad
 */
export function PuterLoader() {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Verificar si ya está cargado (por hot reload, etc)
    if (typeof window !== 'undefined' && (window as any).puter) {
      console.log('✅ Puter.js ya estaba cargado')
      setLoaded(true)
      window.dispatchEvent(new Event('puter-loaded'))
    }
  }, [])

  return (
    <>
      <Script 
        src="https://js.puter.com/v2/" 
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('✅ Puter.js cargado exitosamente')
          setLoaded(true)
          // Disparar evento personalizado cuando Puter.js esté listo
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('puter-loaded'))
          }
        }}
        onError={(e) => {
          console.error('❌ Error al cargar Puter.js:', e)
          setError(true)
        }}
      />
      {/* Indicator visual (opcional, para debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div 
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            zIndex: 9999,
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            background: loaded ? '#10b981' : error ? '#ef4444' : '#fbbf24',
            color: 'white',
            pointerEvents: 'none'
          }}
        >
          Puter.js: {loaded ? '✓' : error ? '✗' : '...'}
        </div>
      )}
    </>
  )
}
