'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, BookOpen } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import Link from 'next/link'

export default function UniversoHogaraPage() {
  const [hoveredWorld, setHoveredWorld] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalWorld, setModalWorld] = useState<any>(null)
  const router = useRouter()
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  // Definición de mundos con CÍRCULOS PERFECTOS - AJUSTES FINALES
  // Solo usamos width, el aspect-ratio 1:1 garantiza círculos perfectos
  const worlds = [
    {
      id: 'hogara-home',
      name: 'Hogara Home',
      description: 'Forjado con hierro y alma. Un universo dedicado a la decoración artesanal, al diseño con historia y a los objetos que llenan tu hogar de vida. ⚒️',
      status: 'en creación',
      badge: 'En taller',
      active: false,
      isAxis: true,
      subtitle: 'Cuerpo',
      // Posición: arriba centro (gris/plata) - MOVIDO MÁS ABAJO
      position: { top: '10%', left: '42%', width: '14%' }
    },
    {
      id: 'hogara-planner',
      name: 'Hogara Planner',
      description: 'Organiza tu vida con alma. Tu refugio para planificar con calma, conectar contigo y crear tu propio ritmo. ❤️',
      status: 'activo',
      badge: 'Entrar al planeta',
      active: true,
      url: '/tienda',
      isInternal: true,
      // Posición: izquierda arriba (rosa) - SUBIDO + MÁS AL CENTRO
      position: { top: '18%', left: '20%', width: '16%' }
    },
    {
      id: 'hogara-luz',
      name: 'Hogara Luz',
      description: 'La energía que guía tu alma. Un espacio sagrado, donde la intuición, el tarot, reiki, la sanación angelical y muchas más terapias holísticas, nos encuentran. ✨🌟',
      status: 'en manifestación',
      badge: 'Despertando su luz',
      active: false,
      isAxis: true,
      subtitle: 'Alma',
      // Posición: derecha arriba (amarillo) - BAJADO + MÁS AL CENTRO
      position: { top: '18%', left: '64%', width: '16%' }
    },
    {
      id: 'hogara-mind',
      name: 'Hogara Mind',
      description: 'Equilibrio para tu mente y emociones. Un universo dedicado a la psicología emocional, el mindfulness y el autoconocimiento. 🧠💭✨',
      status: 'en expansión',
      badge: 'En meditación',
      active: false,
      isAxis: true,
      subtitle: 'Mente',
      // Posición: izquierda medio (azul) - MÁS AL CENTRO
      position: { top: '35%', left: '13%', width: '16%' }
    },
    {
      id: 'hogara-esencia',
      name: 'Hogara Esencia',
      description: 'Cuerpo, mente y ritual. Rituales de autocuidado, belleza consciente, y energía femenina para reconectar con tu esencia. ✨🌸',
      status: 'en proceso de manifestación',
      badge: 'Desarrollando su energía',
      active: false,
      // Posición: derecha medio (lila/púrpura) - SUBIDO MÁS ARRIBA
      position: { top: '33%', left: '68%', width: '16%' }
    },
    {
      id: 'hogara-pet',
      name: 'Hogara Pet',
      description: 'Dónde el amor animal encuentra su lugar. Un espacio para los que sienten que los peludos también son FAMILIA. 🐶❤️',
      status: 'en desarrollo',
      badge: 'Próximamente',
      active: false,
      // Posición: abajo izquierda (verde) - ✓ PERFECTA, NO SE TOCA
      position: { top: '50%', left: '12%', width: '14%' }
    },
    {
      id: 'hogara-app',
      name: 'Hogara App',
      description: 'La aplicación del universo - Mapa interactivo de todos los mundos',
      status: 'activo',
      badge: '✓ Mapa Interactivo',
      active: true,
      url: '/apps',
      isInternal: true,
      // Posición: abajo derecha (cósmico morado) - SUBIDO + MOVIDO A LA DERECHA
      position: { top: '48%', left: '71%', width: '16%' }
    }
  ]

  const handleWorldClick = (world: typeof worlds[0]) => {
    if (world.active && world.url) {
      if (world.isInternal) {
        router.push(world.url)
      } else {
        window.open(world.url, '_blank')
      }
    } else {
      setModalWorld(world)
      setShowModal(true)
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Playfair+Display+SC:wght@400;700;900&family=Poppins:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
          background: #F9D6E4;
        }

        /* Navegación superior */
        .top-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background: rgba(254, 254, 254, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 217, 145, 0.2);
          box-shadow: 0 4px 30px rgba(198, 184, 255, 0.1);
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo img {
          height: 50px;
          width: auto;
          filter: drop-shadow(0 2px 8px rgba(255, 217, 145, 0.3));
        }

        .blog-button {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.8rem 1.8rem;
          text-decoration: none;
          background: linear-gradient(135deg, #9b87f5 0%, #C6B8FF 100%);
          color: #FEFEFE;
          font-weight: 600;
          border-radius: 30px;
          box-shadow: 0 4px 20px rgba(155, 135, 245, 0.25);
          transition: all 0.4s ease;
          position: relative;
          cursor: pointer;
          border: none;
        }

        .blog-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 35px rgba(155, 135, 245, 0.4), 0 0 20px rgba(198, 184, 255, 0.3);
        }

        .cart-button {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.8rem 1.8rem;
          text-decoration: none;
          background: linear-gradient(135deg, #F54291 0%, #FFD991 100%);
          color: #FEFEFE;
          font-weight: 600;
          border-radius: 30px;
          box-shadow: 0 4px 20px rgba(245, 66, 145, 0.25);
          transition: all 0.4s ease;
          position: relative;
          cursor: pointer;
          border: none;
        }

        .cart-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 35px rgba(245, 66, 145, 0.4), 0 0 20px rgba(255, 217, 145, 0.3);
        }

        /* Contenedor del mapa */
        .map-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding-top: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Efecto de desenfoque en los laterales (efecto retrato) */
        .map-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            ellipse 70% 85% at 50% 50%,
            transparent 0%,
            transparent 40%,
            rgba(249, 214, 228, 0.3) 70%,
            rgba(249, 214, 228, 0.6) 90%,
            rgba(249, 214, 228, 0.8) 100%
          );
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
          pointer-events: none;
          z-index: 5;
        }

        /* Capa adicional para el blur progresivo en los bordes */
        .map-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            ellipse 65% 80% at 50% 50%,
            transparent 0%,
            transparent 50%,
            rgba(249, 214, 228, 0.1) 65%,
            rgba(249, 214, 228, 0.3) 80%,
            rgba(249, 214, 228, 0.5) 100%
          );
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          pointer-events: none;
          z-index: 5;
        }

        .map-wrapper {
          position: relative;
          width: 90%;
          max-width: 1200px;
          margin: 0 auto;
          z-index: 10;
        }

        .map-image-container {
          position: relative;
          width: 100%;
          padding-bottom: 133%; /* Aspect ratio de la imagen (4:3 aproximadamente) */
        }

        /* Áreas clicables sobre la imagen */
        .world-hotspot {
          position: absolute;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 50%;
          z-index: 20;
          aspect-ratio: 1 / 1;
        }

        .world-hotspot:hover {
          background: rgba(255, 217, 145, 0.2);
          transform: scale(1.05);
        }

        .world-hotspot.active:hover {
          background: rgba(255, 217, 145, 0.3);
        }

        /* Tooltip emergente */
        .world-tooltip {
          position: absolute;
          bottom: 105%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(254, 254, 254, 0.98);
          backdrop-filter: blur(20px);
          padding: 1.2rem 1.5rem;
          border-radius: 20px;
          box-shadow: 
            0 10px 40px rgba(198, 184, 255, 0.3),
            0 0 1px rgba(255, 217, 145, 0.5);
          border: 2px solid rgba(255, 217, 145, 0.4);
          min-width: 280px;
          max-width: 350px;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
          z-index: 100;
        }

        .world-hotspot:hover .world-tooltip {
          opacity: 1;
          bottom: 110%;
        }

        .tooltip-name {
          font-family: 'Playfair Display SC', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #1C1B4A;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #F54291 0%, #C6B8FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tooltip-subtitle {
          font-size: 0.7rem;
          font-weight: 600;
          color: #FFD991;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 0.5rem;
        }

        .tooltip-description {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.9rem;
          color: #1C1B4A;
          line-height: 1.5;
          margin-bottom: 0.8rem;
          opacity: 0.85;
        }

        .tooltip-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
        }

        .tooltip-badge.active {
          background: linear-gradient(135deg, #F54291 0%, #FFD991 100%);
          color: #FEFEFE;
          box-shadow: 0 4px 15px rgba(245, 66, 145, 0.3);
        }

        .tooltip-badge.inactive {
          background: rgba(198, 184, 255, 0.2);
          color: #1C1B4A;
          border: 1px solid rgba(255, 217, 145, 0.3);
        }

        /* Modal */
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(28, 27, 74, 0.6);
          backdrop-filter: blur(15px);
          z-index: 9999;
          justify-content: center;
          align-items: center;
        }

        .modal.active {
          display: flex;
        }

        .modal-content {
          background: rgba(254, 254, 254, 0.98);
          backdrop-filter: blur(20px);
          padding: 3rem;
          border-radius: 30px;
          text-align: center;
          max-width: 500px;
          width: 90%;
          box-shadow:
            0 20px 60px rgba(198, 184, 255, 0.3),
            0 0 1px rgba(255, 217, 145, 0.5);
          border: 2px solid rgba(255, 217, 145, 0.3);
          position: relative;
        }

        .close-modal {
          position: absolute;
          top: 1rem;
          right: 1.5rem;
          font-size: 2rem;
          cursor: pointer;
          color: #F54291;
          transition: all 0.3s ease;
          font-weight: 300;
        }

        .close-modal:hover {
          transform: rotate(90deg) scale(1.1);
          color: #FFD991;
        }

        .modal-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .modal-content h2 {
          font-size: 2rem;
          font-family: 'Playfair Display SC', serif;
          color: #1C1B4A;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #F54291 0%, #C6B8FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .modal-content p {
          font-size: 1rem;
          font-family: 'Cormorant Garamond', serif;
          color: #1C1B4A;
          margin-bottom: 0.6rem;
          opacity: 0.85;
          line-height: 1.6;
        }

        /* Responsivo */
        @media (max-width: 768px) {
          .map-wrapper {
            width: 95%;
          }

          .nav-container {
            padding: 1rem 1.5rem;
          }

          .nav-logo img {
            height: 40px;
          }

          .blog-button {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }

          .cart-button {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }

          .world-tooltip {
            min-width: 240px;
            max-width: 280px;
            padding: 1rem;
          }

          .tooltip-name {
            font-size: 1rem;
          }

          .tooltip-description {
            font-size: 0.85rem;
          }

          .modal-content {
            padding: 2rem;
          }

          .modal-content h2 {
            font-size: 1.6rem;
          }
        }
      `}</style>

      {/* Navegación superior */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <Image 
              src="/images/universo-hogara-horizontal.png" 
              alt="Universo Hogara" 
              width={200} 
              height={50}
              style={{ height: '50px', width: 'auto' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/blog" className="blog-button">
              <BookOpen style={{ width: '20px', height: '20px' }} />
              <span>Blog</span>
            </Link>
            <button 
              onClick={() => router.push('/carrito')} 
              className="cart-button"
            >
              <ShoppingCart style={{ width: '20px', height: '20px' }} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4e4a6 100%)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
                }}>
                  {cartCount}
                </span>
              )}
              <span>Carrito</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mapa interactivo */}
      <div className="map-container">
        <div className="map-wrapper">
          <div className="map-image-container">
            <Image
              src="/images/universo-hogara-main.png"
              alt="Mapa del Universo Hogara"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />

            {/* Áreas clicables sobre cada logo - CÍRCULOS PERFECTOS */}
            {worlds.map((world) => (
              <div
                key={world.id}
                className={`world-hotspot ${world.active ? 'active' : ''}`}
                style={{
                  top: world.position.top,
                  left: world.position.left,
                  width: world.position.width,
                  // height se calcula automáticamente por aspect-ratio: 1/1
                }}
                onClick={() => handleWorldClick(world)}
                onMouseEnter={() => setHoveredWorld(world.id)}
                onMouseLeave={() => setHoveredWorld(null)}
              >
                {/* Tooltip que aparece al hover */}
                <div className="world-tooltip">
                  {world.subtitle && (
                    <div className="tooltip-subtitle">{world.subtitle}</div>
                  )}
                  <div className="tooltip-name">{world.name}</div>
                  <div className="tooltip-description">{world.description}</div>
                  <span className={`tooltip-badge ${world.active ? 'active' : 'inactive'}`}>
                    {world.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal "En creación" */}
      {modalWorld && (
        <div className={`modal ${showModal ? 'active' : ''}`}>
          <div className="modal-content">
            <span className="close-modal" onClick={() => setShowModal(false)}>&times;</span>
            <div className="modal-icon">✨</div>
            <h2>{modalWorld.name}</h2>
            <p>{modalWorld.description}</p>
            <p style={{ fontStyle: 'italic', marginTop: '1rem', fontSize: '0.95rem' }}>
              ({modalWorld.status})
            </p>
            <p style={{ marginTop: '1rem', fontWeight: 600 }}>
              Este mundo mágico está preparándose para ti. Pronto podrás explorarlo...
            </p>
          </div>
        </div>
      )}
    </>
  )
}
