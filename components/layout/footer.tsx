
"use client"

import React from 'react'

export function Footer() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-sm text-gray-600">
          © 2024 Universo Hogara. Todos los derechos reservados.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Visita{' '}
          <a 
            href="https://hogaraplanner.abacusai.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:underline"
          >
            hogaraplanner.abacusai.app
          </a>
          {' '}para la tienda y blog
        </p>
      </div>
    </footer>
  )
}
