
"use client"

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowRight, Lock, Crown, Sparkles } from 'lucide-react'

export default function AppsPortalPage() {
  const router = useRouter()
  const { data: session, status } = useSession() || {}

  const worlds = [
    {
      id: 'planner',
      name: 'Hogara Planner',
      description: 'Organización mágica y bienestar emocional',
      icon: '/images/logos/HOGARA APP.png',
      color: 'from-[#F54291] to-[#C6B8FF]',
      bgGradient: 'from-[#F9D6E4] to-[#C6B8FF]',
      active: true,
      route: '/apps/hogara-planner',
      features: ['Seres Mágicos', 'Scrapbook 3D', 'Diarios', 'Estadísticas', 'Retos']
    },
    {
      id: 'home',
      name: 'Hogara Home',
      description: 'Armonía y tranquilidad en tu hogar',
      icon: '/images/logos/hogara-home.jpg',
      color: 'from-[#FFD991] to-[#C6B8FF]',
      bgGradient: 'from-[#F9D6E4] to-[#C6B8FF]',
      active: false,
      badge: 'Próximamente'
    },
    {
      id: 'pet',
      name: 'Hogara Pet',
      description: 'El hogar de tus compañeros peludos',
      icon: '/images/logos/hogara-pet.png',
      color: 'from-[#F54291] to-[#FFD991]',
      bgGradient: 'from-[#F9D6E4] to-[#C6B8FF]',
      active: false,
      badge: 'Próximamente'
    },
    {
      id: 'mind',
      name: 'Hogara Mind',
      description: 'Bienestar mental y serenidad',
      icon: '/images/logos/hogara-mind.png',
      color: 'from-[#C6B8FF] to-[#1C1B4A]',
      bgGradient: 'from-[#F9D6E4] to-[#C6B8FF]',
      active: false,
      badge: 'Próximamente'
    },
    {
      id: 'esencia',
      name: 'Hogara Esencia',
      description: 'Frescura y energía para tu ser',
      icon: '/images/logos/hogara-esencia.jpg',
      color: 'from-[#FFD991] to-[#F54291]',
      bgGradient: 'from-[#F9D6E4] to-[#C6B8FF]',
      active: false,
      badge: 'Próximamente'
    },
    {
      id: 'luz',
      name: 'Hogara Luz',
      description: 'Iluminación y energía radiante',
      icon: '/assets/logo-hogara-luz.png',
      color: 'from-[#FFD991] to-[#FEFEFE]',
      bgGradient: 'from-[#F9D6E4] to-[#C6B8FF]',
      active: false,
      badge: 'Próximamente'
    }
  ]

  const handleWorldClick = (world: typeof worlds[0]) => {
    if (!session?.user && world.active) {
      router.push('/auth/login?redirect=/apps/' + world.id)
      return
    }

    if (world.active && world.route) {
      router.push(world.route)
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap');
        
        /* Fondo cósmico con colores de Universo Hogara */
        body {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, 
            #F9D6E4 0%,    /* Rosa bruma */
            #C6B8FF 25%,   /* Lila nebulosa */
            #FFD991 50%,   /* Dorado etéreo */
            #F54291 75%,   /* Fucsia estrella */
            #C6B8FF 100%   /* Lila nebulosa */
          );
          background-size: 400% 400%;
          animation: cosmicFlow 20s ease infinite;
          position: relative;
          overflow-x: hidden;
        }

        /* Animación del fondo cósmico */
        @keyframes cosmicFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Partículas mágicas flotantes */
        .magical-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #FFD991 0%, transparent 70%);
          border-radius: 50%;
          animation: float-particle 15s infinite ease-in-out;
          opacity: 0.6;
          box-shadow: 0 0 8px #FFD991;
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100px) translateX(50px) scale(1.5);
            opacity: 0.8;
          }
        }

        /* Distribución aleatoria de partículas */
        .particle:nth-child(1) { left: 10%; animation-delay: 0s; animation-duration: 12s; }
        .particle:nth-child(2) { left: 20%; animation-delay: 2s; animation-duration: 15s; }
        .particle:nth-child(3) { left: 30%; animation-delay: 4s; animation-duration: 18s; }
        .particle:nth-child(4) { left: 40%; animation-delay: 1s; animation-duration: 14s; }
        .particle:nth-child(5) { left: 50%; animation-delay: 3s; animation-duration: 16s; }
        .particle:nth-child(6) { left: 60%; animation-delay: 5s; animation-duration: 13s; }
        .particle:nth-child(7) { left: 70%; animation-delay: 2s; animation-duration: 17s; }
        .particle:nth-child(8) { left: 80%; animation-delay: 4s; animation-duration: 15s; }
        .particle:nth-child(9) { left: 90%; animation-delay: 1s; animation-duration: 19s; }
        .particle:nth-child(10) { left: 15%; animation-delay: 6s; animation-duration: 14s; }

        /* Títulos con efecto glow */
        .title-glow {
          font-family: 'Cinzel Decorative', serif;
          text-shadow: 
            0 0 20px rgba(255, 217, 145, 0.6),
            0 0 40px rgba(255, 217, 145, 0.4),
            0 0 60px rgba(255, 217, 145, 0.2);
          animation: subtle-glow 3s ease-in-out infinite;
        }

        @keyframes subtle-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(255, 217, 145, 0.6), 0 0 40px rgba(255, 217, 145, 0.4); }
          50% { text-shadow: 0 0 30px rgba(255, 217, 145, 0.8), 0 0 60px rgba(255, 217, 145, 0.5); }
        }

        /* Tarjetas de mundos con efecto flotante */
        .world-card-hover {
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 30px rgba(198, 184, 255, 0.3);
          position: relative;
          z-index: 10;
        }

        .world-card-hover:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 25px 50px rgba(245, 66, 145, 0.4),
                      0 0 60px rgba(255, 217, 145, 0.3);
        }

        .world-card-hover.inactive {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .world-card-hover.inactive:hover {
          transform: none;
        }

        /* Badges con animación flotante */
        .badge-float {
          animation: gentle-float 4s ease-in-out infinite;
          box-shadow: 0 4px 15px rgba(245, 66, 145, 0.5);
        }

        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        /* Efecto hover en botones con glow dorado */
        .btn-glow-hover {
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-glow-hover::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(255, 217, 145, 0.6) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: width 0.5s, height 0.5s;
          border-radius: 50%;
        }

        .btn-glow-hover:hover::before {
          width: 300px;
          height: 300px;
        }

        .btn-glow-hover:hover {
          box-shadow: 0 0 30px rgba(255, 217, 145, 0.7),
                      0 0 60px rgba(245, 66, 145, 0.4);
        }

        /* Iconos con rotación sutil */
        .icon-shimmer {
          animation: shimmer-rotate 6s ease-in-out infinite;
        }

        @keyframes shimmer-rotate {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(5deg) scale(1.05); }
        }

        /* Contenedor principal con z-index para partículas */
        .content-layer {
          position: relative;
          z-index: 10;
        }
      `}</style>

      {/* Partículas mágicas de fondo */}
      <div className="magical-particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="particle" style={{ top: `${Math.random() * 100}%` }} />
        ))}
      </div>

      <div className="content-layer min-h-screen p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="text-center space-y-6">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 text-white hover:text-[#FFD991] transition-all duration-300 mb-4 font-medium"
            >
              ← Volver al Universo
            </button>
            
            <div className="relative inline-block">
              <Sparkles className="absolute -top-4 -left-4 h-8 w-8 text-[#FFD991] animate-pulse" />
              <h1 className="title-glow text-5xl md:text-7xl font-bold text-white">
                Universo Hogara
              </h1>
              <Sparkles className="absolute -bottom-4 -right-4 h-8 w-8 text-[#FFD991] animate-pulse" />
            </div>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
              Cada mundo tiene su propia aplicación mágica para acompañarte en tu viaje
            </p>
            
            {session?.user && (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full text-white border border-[#FFD991]/40 shadow-lg">
                <Crown className="h-5 w-5 text-[#FFD991]" />
                <span className="font-medium">Bienvenida, {session.user.name || session.user.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Worlds Grid */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {worlds.map((world) => (
            <div
              key={world.id}
              onClick={() => handleWorldClick(world)}
              className={`world-card-hover ${!world.active ? 'inactive' : 'cursor-pointer'} 
                         relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 ${world.active ? '' : 'pointer-events-none'}`}
            >
              {/* Badge */}
              {world.badge && (
                <div className="absolute -top-3 right-6 px-5 py-2 bg-gradient-to-r from-[#F54291] to-[#C6B8FF] text-white text-sm font-bold rounded-full shadow-xl badge-float">
                  {world.badge}
                </div>
              )}

              {world.active && (
                <div className="absolute -top-3 right-6 px-5 py-2 bg-gradient-to-r from-[#FFD991] to-[#F54291] text-white text-sm font-bold rounded-full shadow-xl">
                  ✨ Activo
                </div>
              )}

              {/* Icon */}
              <div className={`w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-br ${world.bgGradient} p-1 shadow-2xl icon-shimmer`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                  <Image
                    src={world.icon}
                    alt={world.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <h2 className={`text-2xl font-bold text-center mb-3 bg-gradient-to-r ${world.color} bg-clip-text text-transparent`}
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                {world.name}
              </h2>
              
              <p className="text-gray-600 text-center mb-6 text-sm">
                {world.description}
              </p>

              {/* Features Preview */}
              {world.features && world.active && (
                <div className="space-y-2 mb-6">
                  {world.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${world.color}`}></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                  {world.features.length > 3 && (
                    <div className="text-xs text-gray-500 pl-4">
                      +{world.features.length - 3} más...
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              {world.active ? (
                <button className={`btn-glow-hover w-full py-3 px-6 bg-gradient-to-r ${world.color} text-white rounded-xl font-medium
                                   flex items-center justify-center gap-2 relative z-10`}>
                  {session?.user ? (
                    <>
                      Abrir App <ArrowRight className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Iniciar Sesión <Lock className="h-5 w-5" />
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full py-3 px-6 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 rounded-xl font-medium text-center">
                  Próximamente
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="max-w-4xl mx-auto mt-20 p-10 bg-white/15 backdrop-blur-lg rounded-3xl border border-[#FFD991]/30 text-center shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            ✨ Cada mundo, una experiencia única
          </h3>
          <p className="text-white/90 text-lg leading-relaxed">
            Las apps del Universo Hogara están diseñadas para acompañarte en diferentes aspectos de tu vida.
            Cada una con sus propias herramientas, seres mágicos y contenido exclusivo.
          </p>
        </div>
      </div>
    </>
  )
}
