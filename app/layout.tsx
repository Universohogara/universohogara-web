
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "sonner"
import { SessionProvider } from "@/components/providers/session-provider"
import { CompanionProvider } from "@/components/companion/companion-provider"
import { CartProvider } from "@/contexts/cart-context"
import { PuterLoader } from "@/components/puter-loader"

export const metadata: Metadata = {
  title: {
    template: '%s | Universo Hogara',
    default: 'Universo Hogara - Mundos de Magia, Calma y Evolución Personal',
  },
  description: 'Bienvenida al Universo Hogara: Un espacio donde convergen múltiples mundos diseñados para tu bienestar, creatividad y evolución personal. Descubre agendas, papelería premium, acompañantes mágicos y herramientas interactivas para tu crecimiento.',
  keywords: ['universo hogara', 'hogara planner', 'agendas', 'papelería', 'planners', 'acompañantes mágicos', 'organización', 'bienestar', 'auto-cuidado', 'minimalista', 'premium', 'España', 'evolución personal'],
  authors: [{ name: 'Universo Hogara' }],
  creator: 'Universo Hogara',
  publisher: 'Universo Hogara',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Universo Hogara - Mundos de Magia y Evolución Personal',
    description: 'Explora el Universo Hogara: Múltiples mundos diseñados para tu bienestar, creatividad y crecimiento personal',
    url: 'https://www.universohogara.com',
    siteName: 'Universo Hogara',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Universo Hogara - Mundos de Magia',
    description: 'Múltiples mundos para tu bienestar y evolución personal',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification-token-here', // Se configurará después
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        {/* Puter.js Loader - Componente Client-Side */}
        <PuterLoader />
        
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <CompanionProvider>
                <div className="relative min-h-screen">
                  {children}
                </div>
                <Toaster />
                <Sonner richColors position="top-right" />
              </CompanionProvider>
            </CartProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
