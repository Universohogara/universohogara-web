
/**
 * SoundManager - Sistema de efectos de sonido para los companions
 * 
 * Genera sonidos sintéticos usando Web Audio API
 */

class SoundManager {
  private audioContext: AudioContext | null = null
  private isMuted = false

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.warn('Web Audio API no disponible:', error)
      }
    }
  }

  /**
   * Reproduce un tono simple
   */
  private playTone(frequency: number, duration: number, volume: number = 0.3) {
    if (!this.audioContext || this.isMuted) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    )

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  /**
   * Sonido de saludo (waving)
   */
  playWave() {
    if (!this.audioContext || this.isMuted) return
    
    const notes = [523.25, 659.25, 783.99] // Do, Mi, Sol
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 0.2), i * 100)
    })
  }

  /**
   * Sonido de salto (jumping)
   */
  playJump() {
    if (!this.audioContext || this.isMuted) return
    
    const startFreq = 200
    const endFreq = 600
    const duration = 0.3
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      endFreq,
      this.audioContext.currentTime + duration
    )

    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    )

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  /**
   * Sonido de baile (dancing)
   */
  playDance() {
    if (!this.audioContext || this.isMuted) return
    
    const notes = [
      { freq: 392, time: 0 },     // Sol
      { freq: 523.25, time: 0.2 }, // Do
      { freq: 659.25, time: 0.4 }, // Mi
      { freq: 523.25, time: 0.6 }  // Do
    ]
    
    notes.forEach(note => {
      setTimeout(() => this.playTone(note.freq, 0.15, 0.15), note.time * 1000)
    })
  }

  /**
   * Sonido de risa (laughing)
   */
  playLaugh() {
    if (!this.audioContext || this.isMuted) return
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playTone(400 + Math.random() * 200, 0.1, 0.15)
      }, i * 150)
    }
  }

  /**
   * Sonido de tristeza (crying)
   */
  playCry() {
    if (!this.audioContext || this.isMuted) return
    
    const startFreq = 400
    const endFreq = 200
    const duration = 0.8
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      endFreq,
      this.audioContext.currentTime + duration
    )

    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    )

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  /**
   * Sonido de clic/selección
   */
  playClick() {
    if (!this.audioContext || this.isMuted) return
    this.playTone(800, 0.05, 0.1)
  }

  /**
   * Sonido cuando el companion empieza a hablar
   */
  playSpeakStart() {
    if (!this.audioContext || this.isMuted) return
    
    const notes = [659.25, 783.99] // Mi, Sol
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.1, 0.15), i * 50)
    })
  }

  /**
   * Sonido cuando el companion termina de hablar
   */
  playSpeakEnd() {
    if (!this.audioContext || this.isMuted) return
    
    const notes = [783.99, 659.25] // Sol, Mi (descendente)
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.1, 0.15), i * 50)
    })
  }

  /**
   * Sonido cuando empieza a escuchar
   */
  playListenStart() {
    if (!this.audioContext || this.isMuted) return
    this.playTone(523.25, 0.2, 0.15) // Do
  }

  /**
   * Silenciar/Activar sonidos
   */
  toggleMute() {
    this.isMuted = !this.isMuted
    return this.isMuted
  }

  getMuteStatus() {
    return this.isMuted
  }
}

// Exportar instancia singleton
export const soundManager = new SoundManager()
