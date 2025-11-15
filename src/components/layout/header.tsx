
"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { 
  Sparkles,
  LogOut,
  Settings,
  User,
  ShoppingBag,
  ShoppingCart,
  BookOpen
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from '@/contexts/cart-context'

export function Header() {
  const { data: session } = useSession() || {}
  const router = useRouter()
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
            <div className="relative h-12 w-auto md:h-14" style={{ width: 'auto', minWidth: '180px' }}>
              <Image
                src="/images/logos/universo-hogara-logo-horizontal.png"
                alt="Universo Hogara"
                width={200}
                height={56}
                className="object-contain transition-all duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </Link>
          
          <nav className="flex-1 flex justify-center">
            <Link href="/blog">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-semibold"
              >
                <BookOpen className="w-4 h-4" />
                <span>Blog</span>
              </Button>
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link href="/tienda">
              <Button variant="ghost" size="sm" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Tienda</span>
              </Button>
            </Link>
            
            <Link href="/carrito">
              <Button variant="ghost" size="sm" className="gap-2 relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-hogara-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
                <span className="hidden sm:inline">Carrito</span>
              </Button>
            </Link>
            
            {session && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{session.user?.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/premium/dashboard')}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/premium/configuracion-voz')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
