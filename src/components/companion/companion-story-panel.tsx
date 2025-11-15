
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, Sparkles, Heart, Star, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { getCompanionStory, type CompanionStory } from '@/lib/companion-stories'

interface CompanionStoryPanelProps {
  companionId: string
  onClose: () => void
}

export function CompanionStoryPanel({ companionId, onClose }: CompanionStoryPanelProps) {
  const story = getCompanionStory(companionId)

  if (!story) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-gradient-to-br from-[#F5EFE7] to-[#E8DCC8] rounded-2xl shadow-2xl overflow-hidden border-2 border-[#D4AF37]/30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#D4AF37]/20 to-[#8B7355]/20 p-6 border-b-2 border-[#D4AF37]/30">
            <motion.div
              className="absolute top-0 left-0 w-full h-full"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.1) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-[#8B7355] hover:text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors z-10"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="relative flex items-start gap-4">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8956A] flex items-center justify-center shadow-lg"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(212,175,55,0.3)',
                    '0 0 40px rgba(212,175,55,0.5)',
                    '0 0 20px rgba(212,175,55,0.3)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <BookOpen className="w-8 h-8 text-white" />
              </motion.div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#8B7355] mb-1">
                  {story.name}
                  {story.age && <span className="text-lg font-normal text-[#8B7355]/70 ml-2">({story.age})</span>}
                </h2>
                <p className="text-[#D4AF37] font-semibold text-lg">{story.title}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="h-[calc(90vh-180px)]">
            <div className="p-6 space-y-6">
              {/* Specialization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-[#D4AF37]/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-semibold text-[#8B7355]">Especialización</h3>
                </div>
                <p className="text-[#8B7355]/80">{story.specialization}</p>
              </motion.div>

              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#D4AF37]/10 to-[#B8956A]/10 rounded-xl p-4 border border-[#D4AF37]/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-semibold text-[#8B7355]">Misión</h3>
                </div>
                <p className="text-[#8B7355]/90 leading-relaxed">{story.mission}</p>
              </motion.div>

              {/* Story */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-[#D4AF37]/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-semibold text-[#8B7355]">Su Historia</h3>
                </div>
                <div className="space-y-3 text-[#8B7355]/90 leading-relaxed">
                  {story.story.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                  ))}
                </div>
              </motion.div>

              {/* Personality */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-[#D4AF37]/10 to-[#B8956A]/10 rounded-xl p-4 border border-[#D4AF37]/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-semibold text-[#8B7355]">Personalidad</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {story.personality.map((trait, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-[#D4AF37]/20 text-[#8B7355] hover:bg-[#D4AF37]/30 border border-[#D4AF37]/30"
                    >
                      {trait}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {/* Magical Powers */}
              {story.magicalPowers && story.magicalPowers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-[#D4AF37]/20"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="font-semibold text-[#8B7355]">Poderes Mágicos</h3>
                  </div>
                  <ul className="space-y-2">
                    {story.magicalPowers.map((power, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-2 text-[#8B7355]/90"
                      >
                        <span className="text-[#D4AF37] mt-0.5">✦</span>
                        <span>{power}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Favorite Things */}
              {story.favoriteThings && story.favoriteThings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-[#D4AF37]/10 to-[#B8956A]/10 rounded-xl p-4 border border-[#D4AF37]/20"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="font-semibold text-[#8B7355]">Le Encanta</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {story.favoriteThings.map((thing, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className="flex items-center gap-2 text-sm text-[#8B7355]/80"
                      >
                        <span className="text-[#D4AF37]">♥</span>
                        <span>{thing}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#B8956A]/10 border-t border-[#D4AF37]/20">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8956A] hover:from-[#B8956A] hover:to-[#D4AF37] text-white font-semibold transition-all duration-300"
            >
              Cerrar
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
