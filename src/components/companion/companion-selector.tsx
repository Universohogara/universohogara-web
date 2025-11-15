
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Info } from 'lucide-react'
import Image from 'next/image'
import { COMPANION_STORIES, CompanionStory } from '@/lib/companion-stories'
import { getCompanionColors } from '@/lib/companion-colors'
import CompanionCardDetail from './companion-card-detail'

interface CompanionSelectorProps {
  onSelect: (companionData: any) => void
  isLoading?: boolean
}

export function CompanionSelector({ onSelect, isLoading = false }: CompanionSelectorProps) {
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionStory | null>(null)

  const handleViewDetails = (companion: CompanionStory) => {
    setSelectedCompanion(companion)
  }

  const handleSelectCompanion = (companion: CompanionStory) => {
    onSelect({
      type: companion.imageId,  // ✅ Usar imageId para coincidir con la BD
      name: companion.name,
    })
    setSelectedCompanion(null)
  }

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
    <>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-serif text-[#8B7355] mb-4">
            Elige a tu acompañante mágico
          </h2>
          <p className="text-[#A0826D]">
            Cada uno tiene una historia única y una misión especial para acompañarte 
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {COMPANION_STORIES.map((companion, index) => {
            const colors = getCompanionColors(companion.imageId)
            
            return (
              <motion.div
                key={companion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`group relative overflow-hidden border-2 transition-all duration-300 cursor-pointer hover:shadow-xl`}
                  style={{
                    borderColor: colors.primary,
                    background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}10)`
                  }}
                  onClick={() => handleViewDetails(companion)}
                >
                  <CardContent className="p-4">
                    {/* Badge de info */}
                    <motion.div
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg z-10"
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Info className="w-4 h-4" style={{ color: colors.primary }} />
                    </motion.div>

                    {/* Imagen del companion */}
                    <motion.div
                      className="relative w-full aspect-square mb-3"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Image
                        src={getImagePath(companion.imageId)}
                        alt={companion.name}
                        fill
                        className="object-contain drop-shadow-lg"
                      />
                      
                      {/* Aura sutil personalizada */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                          boxShadow: [
                            `0 0 20px ${colors.glow}`,
                            `0 0 40px ${colors.glow}`,
                            `0 0 20px ${colors.glow}`,
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>

                    {/* Nombre */}
                    <h3 className="text-center font-semibold text-[#8B7355] mb-1">
                      {companion.name}
                    </h3>

                    {/* Título corto */}
                    <p className="text-center text-xs text-[#A0826D] mb-3 line-clamp-2">
                      {companion.title}
                    </p>

                    {/* Botón ver más con color personalizado */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs transition-all hover:text-white"
                      style={{
                        borderColor: colors.primary,
                        color: colors.primary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.primary
                        e.currentTarget.style.color = 'white'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = colors.primary
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewDetails(companion)
                      }}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Ver historia
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Nota informativa */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-[#A0826D]"
        >
          <Sparkles className="w-4 h-4 inline-block mr-2" />
          Haz clic en cualquier personaje para conocer su historia completa y elegirlo
        </motion.div>
      </div>

      {/* Modal de detalle */}
      {selectedCompanion && (
        <CompanionCardDetail
          companion={selectedCompanion}
          isOpen={!!selectedCompanion}
          onClose={() => setSelectedCompanion(null)}
          onSelect={() => handleSelectCompanion(selectedCompanion)}
        />
      )}
    </>
  )
}
