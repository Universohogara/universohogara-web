// Este es el Layout principal que envuelve TODA la aplicación.
// Debe incluir las etiquetas <html> y <body>.

import React from 'react';
import { Inter } from 'next/font/google';

// Importa el CartProvider desde la nueva ruta src/contexts
import { CartProvider } from '@/contexts/cart-context'; 

// Define la fuente (asumiendo que usas Inter)
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Universo Hogara',
  description: 'Tienda en línea de productos para el hogar.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.className}>
      <body>
        {/* Aquí envuelve toda la aplicación con el Contexto del Carrito */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
