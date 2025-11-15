
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X, Sparkles, Heart, Shield, Zap, Book, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { CompanionStory } from '@/lib/companion-stories'
import { getCompanionColors } from '@/lib/companion-colors'

interface CompanionCardDetailProps {
  companion: CompanionStory
  isOpen: boolean
  onClose: () => void
  onSelect?: () => void
}

// Partículas flotantes para el aura mágica
const MagicalParticles = ({ color }: { color: string }) => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            boxShadow: `0 0 ${particle.size * 2}px ${color}`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Sección expandible
interface ExpandableSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  color: string
  isExpanded: boolean
  onToggle: () => void
}

const ExpandableSection = ({ title, icon, children, color, isExpanded, onToggle }: ExpandableSectionProps) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          borderLeft: `4px solid ${color}`,
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isExpanded ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ color }}
          >
            {icon}
          </motion.div>
          <span className="font-semibold text-[#8B7355]">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-[#8B7355]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 text-[#8B7355]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CompanionCardDetail({ companion, isOpen, onClose, onSelect }: CompanionCardDetailProps) {
  const colors = getCompanionColors(companion.imageId)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    story: false,
    powers: false,
    favorites: false,
  })
  const [scrollReveal, setScrollReveal] = useState(0)

  // Efecto de revelado progresivo al hacer scroll
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement
      const scrollPercentage = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100
      setScrollReveal(scrollPercentage)
    }

    const scrollContainer = document.getElementById('scroll-container')
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)
      return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Mapeo de imageId a ruta de imagen
  const getImagePath = (imageId: string) => {
    const imageMap: Record<string, string> = {
      hada: '/images/companions/companion-hada-fairy.png',
      lumi: '/images/companions/companion-lumi-light.png',
      draguito: '/images/companions/companion-draguito-dragon.png',
      elfo: '/images/companions/companion-elfo-elf.png',
      sprig: '/images/companions/companion-sprig-plant.png',
      willow: '/images/companions/companion-willow-tree.png',
      nimbo: '/images/companions/companion-nimbo-cloud.png',
      unicornito: '/images/companions/companion-unicornito-unicorn.png',
      human: '/images/companions/companion-human-warm.png',
      fabel: '/images/companions/companion-fabel-animal.png',
      ken: '/images/companions/ken/ken_guardian_004.png',
    }
    return imageMap[imageId] || '/images/companions/companion-hada-fairy.png'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Ficha mágica - Pergamino */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl pointer-events-auto"
              style={{
                background: `linear-gradient(135deg, ${colors.secondary}30 0%, ${colors.primary}10 100%)`,
                boxShadow: `0 0 60px ${colors.glow}, 0 0 120px ${colors.glow}`,
              }}
              animate={{
                boxShadow: [
                  `0 0 60px ${colors.glow}, 0 0 120px ${colors.glow}`,
                  `0 0 80px ${colors.glow}, 0 0 160px ${colors.glow}`,
                  `0 0 60px ${colors.glow}, 0 0 120px ${colors.glow}`,
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Partículas mágicas */}
              <MagicalParticles color={colors.primary} />

              {/* Borde decorativo de pergamino */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `repeating-linear-gradient(
                    0deg,
                    ${colors.primary}20 0px,
                    transparent 2px,
                    transparent 20px
                  )`,
                }}
              />

              {/* Contenido del pergamino */}
              <div
                id="scroll-container"
                className="relative bg-gradient-to-br from-[#FFF8F0] to-[#F5F0E8] p-8 overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-rounded"
                style={{
                  scrollbarColor: `${colors.primary} transparent`,
                }}
              >
                {/* Botón cerrar */}
                <motion.button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ color: colors.primary }}
                >
                  <X className="w-6 h-6" />
                </motion.button>

                {/* Header - Foto e información principal */}
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-8"
                >
                  {/* Foto del personaje con aura */}
                  <motion.div
                    className="relative w-48 h-48 mx-auto mb-6"
                    animate={{
                      filter: [
                        `drop-shadow(0 0 20px ${colors.glow})`,
                        `drop-shadow(0 0 40px ${colors.glow})`,
                        `drop-shadow(0 0 20px ${colors.glow})`,
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={getImagePath(companion.imageId)}
                        alt={companion.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    {/* Anillo mágico giratorio */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `3px solid ${colors.primary}40`,
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>

                  {/* Nombre y edad */}
                  <motion.h2
                    className="text-4xl font-serif mb-2"
                    style={{ color: colors.primary }}
                    animate={{
                      textShadow: [
                        `0 0 10px ${colors.glow}`,
                        `0 0 20px ${colors.glow}`,
                        `0 0 10px ${colors.glow}`,
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {companion.name}
                  </motion.h2>

                  {companion.age && (
                    <p className="text-[#A0826D] mb-2">{companion.age}</p>
                  )}

                  <p className="text-xl font-semibold text-[#8B7355] mb-4">
                    {companion.title}
                  </p>

                  {/* Especialización */}
                  <div
                    className="inline-block px-6 py-2 rounded-full text-white font-medium"
                    style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
                  >
                    {companion.specialization}
                  </div>
                </motion.div>

                {/* Misión */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8 p-6 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}05 100%)`,
                    borderLeft: `4px solid ${colors.primary}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: colors.primary }} />
                    <div>
                      <h3 className="font-bold text-[#8B7355] mb-2 text-lg">✨ Misión</h3>
                      <p className="text-[#8B7355] leading-relaxed">{companion.mission}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Secciones expandibles */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {/* Historia completa */}
                  <ExpandableSection
                    title="Historia Completa"
                    icon={<Book className="w-6 h-6" />}
                    color={colors.primary}
                    isExpanded={expandedSections.story}
                    onToggle={() => toggleSection('story')}
                  >
                    <div className="space-y-4">
                      {companion.story.split('\n\n').map((paragraph, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="leading-relaxed"
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>
                  </ExpandableSection>

                  {/* Poderes mágicos */}
                  {companion.magicalPowers && companion.magicalPowers.length > 0 && (
                    <ExpandableSection
                      title="Poderes Mágicos"
                      icon={<Zap className="w-6 h-6" />}
                      color={colors.primary}
                      isExpanded={expandedSections.powers}
                      onToggle={() => toggleSection('powers')}
                    >
                      <ul className="space-y-3">
                        {companion.magicalPowers.map((power, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors"
                          >
                            <Star className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
                            <span>{power}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </ExpandableSection>
                  )}

                  {/* Curiosidades */}
                  {companion.favoriteThings && companion.favoriteThings.length > 0 && (
                    <ExpandableSection
                      title="Cosas Favoritas"
                      icon={<Heart className="w-6 h-6" />}
                      color={colors.primary}
                      isExpanded={expandedSections.favorites}
                      onToggle={() => toggleSection('favorites')}
                    >
                      <ul className="space-y-2">
                        {companion.favoriteThings.map((thing, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            >
                              <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
                            </motion.div>
                            <span>{thing}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </ExpandableSection>
                  )}

                  {/* Personalidad */}
                  <ExpandableSection
                    title="Personalidad"
                    icon={<Shield className="w-6 h-6" />}
                    color={colors.primary}
                    isExpanded={expandedSections.personality}
                    onToggle={() => toggleSection('personality')}
                  >
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {companion.personality.map((trait, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2 p-2 rounded-lg bg-white/50"
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colors.primary }}
                          />
                          <span className="text-sm">{trait}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </ExpandableSection>
                </motion.div>

                {/* Botón de selección */}
                {onSelect && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-8 text-center"
                  >
                    <Button
                      onClick={onSelect}
                      size="lg"
                      className="text-white font-semibold px-8 py-6 text-lg"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                      }}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Elegir a {companion.name} como mi acompañante
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
