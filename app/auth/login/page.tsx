
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Error",
          description: "Email o contraseña incorrectos",
          variant: "destructive",
        })
      } else {
        toast({
          title: "¡Bienvenida!",
          description: "Has iniciado sesión correctamente",
        })
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al iniciar sesión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hogara-cream via-hogara-pink/10 to-hogara-lavender/10 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-hogara-gold/20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/">
              <div className="relative w-48 h-32 hover:scale-105 transition-transform">
                <Image
                  src="/images/logos/HOGARA APP.png"
                  alt="Hogara App"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          <h1 className="text-3xl font-heading text-center mb-2 text-hogara-gray">
            Bienvenida de nuevo
          </h1>
          <p className="text-center text-hogara-gray/70 mb-8">
            Inicia sesión para acceder a tu cuenta
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-hogara-gray">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-hogara-gold/30 focus:border-hogara-gold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-hogara-gray">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-hogara-gold/30 focus:border-hogara-gold"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-hogara-gold hover:bg-hogara-gold/90 text-white font-medium py-6"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-hogara-gray/70">
              ¿No tienes cuenta?{" "}
              <Link
                href="/auth/register"
                className="text-hogara-gold hover:underline font-medium"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-hogara-gray/60 hover:text-hogara-gray transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
