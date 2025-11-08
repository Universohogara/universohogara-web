
// Sistema de sonidos ambientales para el scrapbook

export type SoundEffect = 
  | 'book_open'
  | 'page_turn' 
  | 'sticker_place'
  | 'magic_sparkle'
  | 'leather_creak'
  | 'paper_rustle'

class SoundManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<SoundEffect, AudioBuffer> = new Map()
  private isMuted: boolean = false
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  // Generar sonidos sintéticos
  private createSound(type: SoundEffect): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    let duration = 0.3
    let buffer: AudioBuffer

    switch (type) {
      case 'book_open':
        duration = 0.8
        buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
        const openData = buffer.getChannelData(0)
        for (let i = 0; i < buffer.length; i++) {
          const t = i / sampleRate
          // Sonido de cuero abriéndose (tono bajo con fricción)
          openData[i] = (Math.random() * 0.1 - 0.05) * Math.exp(-t * 2) * Math.sin(2 * Math.PI * 80 * t)
        }
        return buffer

      case 'page_turn':
        duration = 0.4
        buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
        const pageData = buffer.getChannelData(0)
        for (let i = 0; i < buffer.length; i++) {
          const t = i / sampleRate
          // Sonido de papel suave
          pageData[i] = (Math.random() * 0.15 - 0.075) * Math.exp(-t * 5)
        }
        return buffer

      case 'sticker_place':
        duration = 0.15
        buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
        const stickerData = buffer.getChannelData(0)
        for (let i = 0; i < buffer.length; i++) {
          const t = i / sampleRate
          // Click suave
          stickerData[i] = Math.exp(-t * 20) * Math.sin(2 * Math.PI * 800 * t) * 0.1
        }
        return buffer

      case 'magic_sparkle':
        duration = 0.6
        buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
        const sparkleData = buffer.getChannelData(0)
        for (let i = 0; i < buffer.length; i++) {
          const t = i / sampleRate
          // Tintineo mágico suave
          sparkleData[i] = (
            Math.sin(2 * Math.PI * 1200 * t) +
            Math.sin(2 * Math.PI * 1600 * t) +
            Math.sin(2 * Math.PI * 2000 * t)
          ) * 0.05 * Math.exp(-t * 3)
        }
        return buffer

      case 'leather_creak':
        duration = 0.5
        buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
        const leatherData = buffer.getChannelData(0)
        for (let i = 0; i < buffer.length; i++) {
          const t = i / sampleRate
          // Crujido de cuero
          leatherData[i] = (Math.random() * 0.08 - 0.04) * Math.sin(2 * Math.PI * 100 * t) * Math.exp(-t * 2)
        }
        return buffer

      case 'paper_rustle':
        duration = 0.3
        buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
        const rustleData = buffer.getChannelData(0)
        for (let i = 0; i < buffer.length; i++) {
          const t = i / sampleRate
          // Ruido de papel
          rustleData[i] = (Math.random() * 0.1 - 0.05) * Math.exp(-t * 6)
        }
        return buffer

      default:
        return null
    }
  }

  async loadSound(type: SoundEffect): Promise<void> {
    if (!this.audioContext) return

    const buffer = this.createSound(type)
    if (buffer) {
      this.sounds.set(type, buffer)
    }
  }

  async loadAllSounds(): Promise<void> {
    const soundTypes: SoundEffect[] = [
      'book_open',
      'page_turn',
      'sticker_place',
      'magic_sparkle',
      'leather_creak',
      'paper_rustle'
    ]

    await Promise.all(soundTypes.map(type => this.loadSound(type)))
  }

  play(type: SoundEffect, volume: number = 0.3): void {
    if (!this.audioContext || this.isMuted) return

    const buffer = this.sounds.get(type)
    if (!buffer) {
      // Intentar cargar el sonido si no existe
      this.loadSound(type).then(() => this.play(type, volume))
      return
    }

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    
    source.buffer = buffer
    gainNode.gain.value = volume
    
    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    source.start()
  }

  mute(): void {
    this.isMuted = true
  }

  unmute(): void {
    this.isMuted = false
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted
    return this.isMuted
  }
}

// Singleton
let soundManagerInstance: SoundManager | null = null

export function getSoundManager(): SoundManager {
  if (typeof window === 'undefined') {
    // SSR - retornar mock
    return {
      loadAllSounds: async () => {},
      play: () => {},
      mute: () => {},
      unmute: () => {},
      toggleMute: () => false
    } as any
  }

  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager()
    soundManagerInstance.loadAllSounds()
  }

  return soundManagerInstance
}
