
/**
 * HOGARA PLANNER - THEME CONFIGURATION
 * Sistema centralizado de tema para personalización fácil
 */

export const hogaraTheme = {
  colors: {
    primary: {
      pink: '#F7DCEB',
      turquoise: '#CFEFF3', 
      cream: '#FFF7F0',
      gray: '#6E6E6E',
    },
    secondary: {
      gold: '#D4AF37',
      goldLight: '#F4E8C1',
      lavender: '#E8E0F5',
      mint: '#D5F2E3',
      peach: '#F9E5D3',
    },
    gradients: {
      hogara: 'linear-gradient(135deg, #F7DCEB 0%, #CFEFF3 100%)',
      hogaraSoft: 'linear-gradient(135deg, #FFF7F0 0%, #F7DCEB 50%, #CFEFF3 100%)',
      hogaraGold: 'linear-gradient(135deg, #F4E8C1 0%, #FFF7F0 100%)',
    }
  },
  
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "'Playfair Display', Georgia, serif",
    mono: "'JetBrains Mono', monospace",
  },
  
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px 
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '5rem',    // 80px
    '5xl': '6rem',    // 96px
  },
  
  borderRadius: {
    none: '0px',
    sm: '2px',
    md: '4px', 
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    pink: '0 4px 6px -1px rgb(247 220 235 / 0.3), 0 2px 4px -2px rgb(247 220 235 / 0.2)',
    turquoise: '0 4px 6px -1px rgb(207 239 243 / 0.3), 0 2px 4px -2px rgb(207 239 243 / 0.2)',
    gold: '0 4px 6px -1px rgb(212 175 55 / 0.2), 0 2px 4px -2px rgb(212 175 55 / 0.1)',
  },
  
  animations: {
    durations: {
      fast: '150ms',
      normal: '300ms', 
      slow: '500ms',
      shimmer: '2s',
      sparkle: '3s',
    },
    
    keyframes: {
      shimmer: {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(100%)' },
      },
      sparkle: {
        '0%, 100%': { opacity: '0', transform: 'scale(0)' },
        '50%': { opacity: '1', transform: 'scale(1)' },
      },
      glow: {
        '0%, 100%': { boxShadow: '0 0 5px #F4E8C1' },
        '50%': { boxShadow: '0 0 20px #F4E8C1, 0 0 30px #F4E8C1' },
      },
      float: {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-10px)' },
      },
    },
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1200px',
    '2xl': '1200px', // Límite máximo Hogara
  },
  
  container: {
    center: true,
    padding: '1rem',
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px', 
      xl: '1200px',
      '2xl': '1200px',
    },
  },
} as const

export type HogaraTheme = typeof hogaraTheme

// Utility functions para usar el tema
export const getHogaraColor = (path: string) => {
  const keys = path.split('.')
  let current: any = hogaraTheme.colors
  
  for (const key of keys) {
    current = current?.[key]
  }
  
  return current || '#000000'
}

export const getHogaraSpacing = (size: keyof typeof hogaraTheme.spacing) => {
  return hogaraTheme.spacing[size] || '0'
}

export const getHogaraShadow = (type: keyof typeof hogaraTheme.shadows) => {
  return hogaraTheme.shadows[type] || 'none'
}
