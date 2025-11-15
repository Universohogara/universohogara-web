
'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface KenCompanionProps {
  size?: number
  showAura?: boolean
  interactive?: boolean
  emotion?: 'calm' | 'happy' | 'alert' | 'protective'
  isListening?: boolean
  isSpeaking?: boolean
}

export const KenCompanion: React.FC<KenCompanionProps> = ({ 
  size = 300, 
  showAura = true,
  interactive = true,
  emotion = 'calm',
  isListening = false,
  isSpeaking = false
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Aura mágica cálida - Ken tiene personalidad protectora y amigable
  const auraColor = {
    outer: 'rgba(255, 200, 100, 0.3)',
    inner: 'rgba(255, 180, 80, 0.2)',
    glow: 'rgb(255, 200, 100)'
  }

  // Respiración suave
  const breathingDuration = 3.5

  return (
    <div 
      className="ken-companion-container"
      style={{ 
        position: 'relative', 
        width: size, 
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseEnter={() => {
        if (interactive) {
          setIsHovered(true)
        }
      }}
      onMouseLeave={() => {
        if (interactive) {
          setIsHovered(false)
        }
      }}
    >
      {/* Aura exterior mágica */}
      {showAura && (
        <motion.div
          className="ken-aura-outer"
          animate={{
            scale: [1.0, 1.12, 1.0],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{
            duration: breathingDuration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '110%',
            height: '110%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${auraColor.outer} 0%, ${auraColor.inner} 50%, rgba(255,180,80,0) 100%)`,
            filter: 'blur(25px)',
            zIndex: 1
          }}
        />
      )}

      {/* Capa de brillo suave */}
      {showAura && (
        <motion.div
          className="ken-glow"
          animate={{
            opacity: [0.25, 0.5, 0.25],
            scale: [0.98, 1.02, 0.98]
          }}
          transition={{
            duration: breathingDuration * 1.3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '90%',
            height: '90%',
            borderRadius: '50%',
            background: auraColor.glow,
            filter: 'blur(18px)',
            zIndex: 2
          }}
        />
      )}

      {/* Ken estilo dibujito en SVG */}
      <motion.div
        className="ken-character"
        animate={{
          y: isListening ? [-5, 5, -5] : [-3, 3, -3],
          scale: isSpeaking ? [1.0, 1.02, 1.0] : [1.0, 1.01, 1.0]
        }}
        transition={{
          y: {
            duration: breathingDuration,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: {
            duration: breathingDuration * 0.9,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          zIndex: 3,
          cursor: interactive ? 'pointer' : 'default',
          filter: isHovered 
            ? 'brightness(1.12) drop-shadow(0 0 20px rgba(255,200,100,0.8))' 
            : 'drop-shadow(0 0 10px rgba(255,200,100,0.5))'
        }}
      >
        <svg
          viewBox="0 0 200 200"
          width="100%"
          height="100%"
          style={{ overflow: 'visible' }}
        >
          {/* Cuerpo sentado */}
          <ellipse
            cx="100"
            cy="140"
            rx="40"
            ry="35"
            fill="#8B6914"
            stroke="#5C4A0D"
            strokeWidth="2"
          />

          {/* Patas delanteras */}
          <rect
            x="75"
            y="160"
            width="15"
            height="25"
            rx="7"
            fill="#8B6914"
            stroke="#5C4A0D"
            strokeWidth="1.5"
          />
          <rect
            x="110"
            y="160"
            width="15"
            height="25"
            rx="7"
            fill="#8B6914"
            stroke="#5C4A0D"
            strokeWidth="1.5"
          />

          {/* Cabeza */}
          <ellipse
            cx="100"
            cy="80"
            rx="35"
            ry="40"
            fill="#A0826D"
            stroke="#5C4A0D"
            strokeWidth="2"
          />

          {/* Hocico */}
          <ellipse
            cx="100"
            cy="95"
            rx="20"
            ry="18"
            fill="#D4A574"
            stroke="#5C4A0D"
            strokeWidth="1.5"
          />

          {/* Nariz */}
          <ellipse
            cx="100"
            cy="100"
            rx="6"
            ry="5"
            fill="#2C1810"
          />

          {/* Ojos con parpadeo */}
          <motion.g
            animate={{
              scaleY: [1, 0.1, 1]
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              repeatDelay: 3.5,
              ease: "easeInOut"
            }}
          >
            <ellipse
              cx="85"
              cy="75"
              rx="5"
              ry="8"
              fill="#2C1810"
            />
            <ellipse
              cx="115"
              cy="75"
              rx="5"
              ry="8"
              fill="#2C1810"
            />
          </motion.g>

          {/* Orejas con animación sutil */}
          <motion.g
            animate={{
              rotate: [0, 5, 0, -3, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: '70px 50px' }}
          >
            <ellipse
              cx="70"
              cy="50"
              rx="12"
              ry="28"
              fill="#8B6914"
              stroke="#5C4A0D"
              strokeWidth="1.5"
              transform="rotate(-20 70 50)"
            />
          </motion.g>

          <motion.g
            animate={{
              rotate: [0, -5, 0, 3, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            style={{ transformOrigin: '130px 50px' }}
          >
            <ellipse
              cx="130"
              cy="50"
              rx="12"
              ry="28"
              fill="#8B6914"
              stroke="#5C4A0D"
              strokeWidth="1.5"
              transform="rotate(20 130 50)"
            />
          </motion.g>

          {/* Lengua con movimiento sutil (cuando está hablando) */}
          {isSpeaking && (
            <motion.g
              animate={{
                y: [0, 3, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ellipse
                cx="100"
                cy="108"
                rx="8"
                ry="6"
                fill="#FF6B9D"
                stroke="#E5507D"
                strokeWidth="1"
              />
            </motion.g>
          )}

          {/* Manchas características */}
          <ellipse
            cx="75"
            cy="85"
            rx="10"
            ry="12"
            fill="#5C4A0D"
            opacity="0.3"
          />
          <ellipse
            cx="125"
            cy="82"
            rx="8"
            ry="10"
            fill="#5C4A0D"
            opacity="0.3"
          />
        </svg>
      </motion.div>

      {/* Partículas mágicas sutiles */}
      {showAura && (
        <div
          className="ken-sparkles"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 4,
            pointerEvents: 'none'
          }}
        >
          {[
            { x: '20%', y: '20%', delay: 0 },
            { x: '80%', y: '25%', delay: 0.5 },
            { x: '25%', y: '75%', delay: 1.0 },
            { x: '75%', y: '70%', delay: 1.5 }
          ].map((sparkle, idx) => (
            <motion.div
              key={`sparkle-${idx}`}
              style={{
                position: 'absolute',
                left: sparkle.x,
                top: sparkle.y,
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: auraColor.glow,
                boxShadow: `0 0 6px ${auraColor.glow}`
              }}
              animate={{
                opacity: [0.8, 0.2, 0.8],
                scale: [1, 1.3, 1],
                y: [0, -6, 0]
              }}
              transition={{
                duration: 2.5 + sparkle.delay * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: sparkle.delay
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default KenCompanion
