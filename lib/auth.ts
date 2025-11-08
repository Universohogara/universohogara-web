
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            subscription: true,
          },
        })

        if (!user || !user.password) {
          throw new Error("Email o contraseña incorrectos")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Email o contraseña incorrectos")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      
      // Refresh user data on each token update or when explicitly triggered
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          include: {
            subscription: true,
          },
        })
        
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          
          // Los administradores SIEMPRE tienen acceso premium automático
          if (dbUser.role === "admin") {
            token.isPremium = true
          } else if (dbUser.subscription?.status === "active") {
            // Usuario tiene acceso premium si tiene:
            // - Un plan base (basic_7 o complete_15)
            // - O la extensión de Personajes Mágicos activada
            const hasBasePlan = dbUser.subscription.plan_tier === "basic_7" || 
                                dbUser.subscription.plan_tier === "complete_15"
            const hasMagicalCompanions = dbUser.subscription.magical_companions_enabled === true &&
                                        dbUser.subscription.magical_companions_status === "active"
            
            token.isPremium = hasBasePlan || hasMagicalCompanions
          } else {
            token.isPremium = false
          }
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        // FORZAR que los admins siempre tengan isPremium = true
        session.user.isPremium = token.role === "admin" || (token.isPremium as boolean)
      }
      return session
    },
  },
}
