
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Heart, Star, Lock, Crown } from "lucide-react"
import { COMPANION_STORIES, type CompanionStory } from "@/lib/companion-stories"
import Link from "next/link"

interface CompanionsGalleryProps {
  showPremiumBadge?: boolean
  maxItems?: number
}

export function CompanionsGallery({ showPremiumBadge = true, maxItems }: CompanionsGalleryProps) {
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionStory | null>(null)
  
  const companions = maxItems ? COMPANION_STORIES.slice(0, maxItems) : COMPANION_STORIES

  // Mapeo de imageId a nombres de archivo
  const imageMap: Record<string, string> = {
    'hada': 'companion-hada-fairy.png',
    'lumi': 'companion-lumi-light.png',
    'draguito': 'companion-draguito-dragon.png',
    'elfo': 'companion-elfo-elf.png',
    'sprig': 'companion-sprig-plant.png',
    'willow': 'companion-willow-tree.png',
    'nimbo': 'companion-nimbo-cloud.png',
    'unicornito': 'companion-unicornito-unicorn.png',
    'human': 'companion-human-warm.png',
    'fabel': 'companion-fabel-animal.png',
    'ken': 'ken.png'
  }

  // Emociones típicas por tipo de companion
  const getEmotions = (id: string): string[] => {
    const emotionMap: Record<string, string[]> = {
      'ada': ['Alegría ✨', 'Curiosidad 🦋', 'Esperanza 🌟', 'Ternura 💝'],
      'luna': ['Calma 🌙', 'Serenidad 💙', 'Paz ✨', 'Comprensión 🕊️'],
      'ember': ['Motivación 🔥', 'Determinación 💪', 'Pasión ❤️', 'Energía ⚡'],
      'sage': ['Reflexión 🤔', 'Sabiduría 📚', 'Claridad 💡', 'Introspección 🌿'],
      'sprig': ['Paciencia 🌱', 'Aceptación 🍃', 'Crecimiento 🌳', 'Resiliencia 💚'],
      'coral': ['Fluidez 🌊', 'Adaptación 🐚', 'Profundidad 💙', 'Renovación 🌸'],
      'orion': ['Asombro ⭐', 'Perspectiva 🔭', 'Inspiración ✨', 'Grandeza 🌌'],
      'aurora': ['Esperanza 🌅', 'Renovación ☀️', 'Optimismo 🌈', 'Nuevos comienzos 🦋'],
      'ken': ['Lealtad 🐕', 'Amor Incondicional 💛', 'Protección 🛡️', 'Alegría 🎾']
    }
    return emotionMap[id] || ['Alegría', 'Calma', 'Energía', 'Esperanza']
  }

  // Frase de ejemplo por companion
  const getGreeting = (id: string): string => {
    const greetings: Record<string, string> = {
      'ada': '"Hola, luz brillante. ¿Qué sueños guardas hoy en tu corazón? ✨"',
      'luna': '"La luna te saluda con paz. Respira conmigo, todo está bien. 🌙"',
      'ember': '"¡Hey! ¿Listo para encender tu fuego interior? ¡Vamos! 🔥"',
      'sage': '"Te doy la bienvenida, buscador de verdades. ¿Qué te trae aquí? 🌿"',
      'sprig': '"Poco a poco, con amor y paciencia, todo florece. 🌱"',
      'coral': '"Las olas traen mensajes del alma. ¿Escuchas el tuyo? 🌊"',
      'orion': '"Mira las estrellas, cada una es un recordatorio de tu grandeza. ⭐"',
      'aurora': '"Cada amanecer trae una nueva oportunidad. ¿La tomarás? 🌅"',
      'ken': '"¡Guau guau! *mueve la cola* Estoy aquí para ti, siempre. 🐕💛"'
    }
    return greetings[id] || '"Te doy la bienvenida, alma hermosa. ✨"'
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {companions.map((companion, index) => (
          <motion.div
            key={companion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="relative group cursor-pointer overflow-hidden border-2 border-hogara-gold/20 hover:border-hogara-gold hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-hogara-cream/30"
              onClick={() => setSelectedCompanion(companion)}
            >
              {/* Premium Badge */}
              {showPremiumBadge && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              )}

              {/* Lock overlay for non-Sprig companions */}
              {companion.id !== 'sprig' && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-white" />
                </div>
              )}

              {/* Image container */}
              <div className="relative aspect-square bg-gradient-to-br from-hogara-cream to-hogara-pink/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-hogara-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src={`/images/companions/${imageMap[companion.imageId] || 'companion-hada-fairy.png'}`}
                  alt={companion.name}
                  fill
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Sparkle effect on hover */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles className="h-12 w-12 text-hogara-gold" />
                </motion.div>
              </div>

              {/* Name and title */}
              <div className="p-4 text-center space-y-1 bg-white/80 backdrop-blur">
                <h3 className="font-heading text-lg text-hogara-gray font-bold">
                  {companion.name}
                </h3>
                <p className="text-xs text-hogara-gray/70 line-clamp-2">
                  {companion.title}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCompanion && (
          <Dialog open={!!selectedCompanion} onOpenChange={() => setSelectedCompanion(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading text-hogara-gray flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-hogara-gold" />
                  {selectedCompanion.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Image and basic info */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative w-full md:w-1/3 aspect-square bg-gradient-to-br from-hogara-cream to-hogara-pink/10 rounded-2xl overflow-hidden border-2 border-hogara-gold/30">
                    <Image
                      src={`/images/companions/${imageMap[selectedCompanion.imageId] || 'companion-hada-fairy.png'}`}
                      alt={selectedCompanion.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-hogara-gray/60 mb-1">Título</h4>
                      <p className="text-lg font-heading text-hogara-gold">{selectedCompanion.title}</p>
                    </div>

                    {selectedCompanion.age && (
                      <div>
                        <h4 className="text-sm font-medium text-hogara-gray/60 mb-1">Edad</h4>
                        <p className="text-hogara-gray">{selectedCompanion.age}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-hogara-gray/60 mb-1">Especialización</h4>
                      <p className="text-hogara-gray">{selectedCompanion.specialization}</p>
                    </div>
                  </div>
                </div>

                {/* Greeting */}
                <div className="p-4 bg-gradient-to-r from-hogara-gold/10 to-hogara-pink/10 rounded-lg border border-hogara-gold/30">
                  <p className="text-hogara-gray italic text-center">
                    {getGreeting(selectedCompanion.id)}
                  </p>
                </div>

                {/* Personality traits */}
                <div>
                  <h4 className="text-sm font-medium text-hogara-gray/60 mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-hogara-pink" />
                    Personalidad
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompanion.personality.map((trait, i) => (
                      <Badge key={i} variant="outline" className="border-hogara-gold/50 text-hogara-gray">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Emotions */}
                <div>
                  <h4 className="text-sm font-medium text-hogara-gray/60 mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4 text-hogara-gold" />
                    Emociones que acompaña
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getEmotions(selectedCompanion.id).map((emotion, i) => (
                      <Badge key={i} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Mission */}
                <div>
                  <h4 className="text-sm font-medium text-hogara-gray/60 mb-2">Misión</h4>
                  <p className="text-hogara-gray text-sm leading-relaxed">
                    {selectedCompanion.mission}
                  </p>
                </div>

                {/* Story preview */}
                <div>
                  <h4 className="text-sm font-medium text-hogara-gray/60 mb-2">Historia</h4>
                  <p className="text-hogara-gray text-sm leading-relaxed line-clamp-4">
                    {selectedCompanion.story}
                  </p>
                </div>

                {/* Premium CTA */}
                {selectedCompanion.id !== 'sprig' && (
                  <div className="pt-4 border-t border-hogara-gold/20">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg space-y-3">
                      <div className="flex items-start gap-3">
                        <Crown className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-hogara-gray mb-1">
                            Desbloquea conversaciones ilimitadas con {selectedCompanion.name}
                          </p>
                          <p className="text-xs text-hogara-gray/70">
                            Accede al plan de Personajes Mágicos y chatea sin límites con todos los acompañantes emocionales.
                          </p>
                        </div>
                      </div>
                      <Link href="/premium">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Ver Planes Premium
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}
