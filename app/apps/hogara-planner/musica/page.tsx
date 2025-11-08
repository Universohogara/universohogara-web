
'use client'

import { useState } from 'react'
import { PremiumGuard } from '@/components/premium/premium-guard'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  Heart,
  Sparkles,
  Download
} from 'lucide-react'

interface Track {
  id: string
  title: string
  description: string
  category: string
  duration: string
  file: string
  downloadable: boolean
}

const PREMIUM_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Chimenea Acogedora',
    description: 'Sonido relajante de chimenea con música ambiental',
    category: 'Relajación',
    duration: '45:00',
    file: '/premium-music/chimenea-acogedora.wav',
    downloadable: true
  },
  {
    id: '2',
    title: 'Cinemática Ambient',
    description: 'Música cinemática inspiradora para momentos de reflexión',
    category: 'Inspiración',
    duration: '52:30',
    file: '/premium-music/cinematica-ambient.wav',
    downloadable: true
  },
  {
    id: '3',
    title: 'Energía Cristal',
    description: 'Frecuencias elevadas para meditación y concentración',
    category: 'Energía',
    duration: '48:15',
    file: '/premium-music/energia-cristal.wav',
    downloadable: true
  },
  {
    id: '4',
    title: 'Espiritual Moderna',
    description: 'Fusión de sonidos ancestrales y modernos',
    category: 'Espiritual',
    duration: '55:20',
    file: '/premium-music/espiritual-moderna.wav',
    downloadable: false
  },
  {
    id: '5',
    title: 'Hora Dorada',
    description: 'Melodías cálidas para momentos de gratitud',
    category: 'Gratitud',
    duration: '42:00',
    file: '/premium-music/hora-dorada.wav',
    downloadable: true
  },
  {
    id: '6',
    title: 'Meditación Bosque',
    description: 'Sonidos de la naturaleza con música meditativa',
    category: 'Meditación',
    duration: '60:00',
    file: '/premium-music/meditacion-bosque.wav',
    downloadable: true
  },
  {
    id: '7',
    title: 'Ritual Lluvia',
    description: 'Lluvia suave con campanas tibetanas',
    category: 'Ritual',
    duration: '50:45',
    file: '/premium-music/ritual-lluvia.wav',
    downloadable: false
  },
  {
    id: '8',
    title: 'Viaje Cósmico',
    description: 'Música espacial para estados expandidos',
    category: 'Meditación',
    duration: '58:30',
    file: '/premium-music/viaje-cosmico.wav',
    downloadable: false
  }
]

function MusicaContent() {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const handlePlay = (trackFile: string) => {
    if (audio) {
      audio.pause()
      setAudio(null)
    }

    if (currentTrack === trackFile && isPlaying) {
      setIsPlaying(false)
      setCurrentTrack(null)
      return
    }

    const newAudio = new Audio(trackFile)
    newAudio.volume = volume / 100
    newAudio.play()
    setAudio(newAudio)
    setCurrentTrack(trackFile)
    setIsPlaying(true)

    newAudio.onended = () => {
      setIsPlaying(false)
      setCurrentTrack(null)
    }
  }

  const handlePause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        audio.play()
        setIsPlaying(true)
      }
    }
  }

  const handleDownload = (track: Track) => {
    const link = document.createElement('a')
    link.href = track.file
    link.download = `${track.title}.wav`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hogara-cream via-white to-hogara-pink/5">
      <Header />
      
      <main className="py-20">
        <div className="container px-4">
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-hogara-gold" />
              <span className="text-sm font-medium text-hogara-gold uppercase tracking-wider">
                Biblioteca Premium
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-hogara-gray">
              Música y Sonidos Exclusivos
            </h1>
            <p className="text-lg text-hogara-gray/70 max-w-2xl mx-auto">
              Colección curada de música ambiental, frecuencias sanadoras y sonidos de la naturaleza 
              para acompañar tus rituales y momentos de autocuidado.
            </p>
          </div>

          {/* Player Controls (cuando hay algo reproduciéndose) */}
          {currentTrack && (
            <Card className="mb-8 p-6 bg-gradient-to-r from-hogara-gold/10 to-hogara-pink/10 border-hogara-gold/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    onClick={handlePause}
                    className="bg-hogara-gold hover:bg-hogara-gold/90 text-white rounded-full h-14 w-14"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </Button>
                  <div>
                    <p className="font-medium text-hogara-gray">
                      {PREMIUM_TRACKS.find(t => t.file === currentTrack)?.title}
                    </p>
                    <p className="text-sm text-hogara-gray/70">
                      Reproduciendo ahora
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-hogara-gray" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => {
                      const newVolume = parseInt(e.target.value)
                      setVolume(newVolume)
                      if (audio) {
                        audio.volume = newVolume / 100
                      }
                    }}
                    className="w-24 accent-hogara-gold"
                  />
                  <span className="text-sm text-hogara-gray/70 w-10">{volume}%</span>
                </div>
              </div>
            </Card>
          )}

          {/* Grid de Música */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREMIUM_TRACKS.map((track) => (
              <Card
                key={track.id}
                className={`p-6 hover:shadow-xl transition-all ${
                  currentTrack === track.file 
                    ? 'border-2 border-hogara-gold bg-hogara-gold/5' 
                    : 'border-hogara-gold/20'
                }`}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-hogara-gold/10 rounded-xl">
                      <Music className="h-6 w-6 text-hogara-gold" />
                    </div>
                    <span className="text-xs px-3 py-1 bg-hogara-cream rounded-full text-hogara-gray">
                      {track.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-heading text-xl text-hogara-gray mb-2">
                      {track.title}
                    </h3>
                    <p className="text-sm text-hogara-gray/70 mb-3">
                      {track.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-hogara-gray/60">
                      <Heart className="h-4 w-4" />
                      <span>{track.duration}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handlePlay(track.file)}
                      className={`flex-1 ${
                        currentTrack === track.file && isPlaying
                          ? 'bg-hogara-pink hover:bg-hogara-pink/90'
                          : 'bg-hogara-gold hover:bg-hogara-gold/90'
                      } text-white`}
                    >
                      {currentTrack === track.file && isPlaying ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2 ml-1" />
                          Reproducir
                        </>
                      )}
                    </Button>
                    
                    {track.downloadable && (
                      <Button
                        onClick={() => handleDownload(track)}
                        variant="outline"
                        size="icon"
                        className="border-hogara-gold/30 hover:border-hogara-gold text-hogara-gold"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Info adicional */}
          <Card className="mt-12 p-8 bg-gradient-to-r from-hogara-cream/50 to-white border-hogara-gold/20">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <Sparkles className="h-10 w-10 text-hogara-gold mx-auto" />
              <h3 className="text-2xl font-heading text-hogara-gray">
                Nuevas pistas cada mes
              </h3>
              <p className="text-hogara-gray/70">
                Ampliamos constantemente nuestra biblioteca con música exclusiva creada específicamente 
                para acompañar tus rituales de autodescubrimiento y bienestar.
              </p>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default function MusicaPage() {
  return (
    <PremiumGuard>
      <MusicaContent />
    </PremiumGuard>
  )
}
