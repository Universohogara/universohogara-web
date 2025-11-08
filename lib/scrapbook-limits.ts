
// Sistema de límites y privilegios del scrapbook según plan
// NUEVA ESTRATEGIA: Scrapbook incluido en planes base (sin pago adicional)

export interface ScrapbookLimits {
  maxPages: number
  maxStickersPerPage: number
  hasSecretPocket: boolean
  hasManifestationPage: boolean
  hasRitualMode: boolean
  hasMagicEffects: boolean
  canExportPDF: boolean
  hasPremiumStickers: boolean
  stickerCategories: string[]
  planName: string // Para mostrar en la UI
}

export type UserTier = 'free' | 'basic_7' | 'complete_15'

export function getScrapbookLimits(
  userRole: string,
  subscriptionTier: string | null
): ScrapbookLimits {
  
  // Plan Total (€15) - SCRAPBOOK ILIMITADO + TODAS LAS FUNCIONES PREMIUM
  if (subscriptionTier === 'complete_15') {
    return {
      maxPages: 999, // Ilimitado
      maxStickersPerPage: 999,
      hasSecretPocket: true,
      hasManifestationPage: true,
      hasRitualMode: true,
      hasMagicEffects: true,
      canExportPDF: true,
      hasPremiumStickers: true,
      stickerCategories: ['basico', 'emociones', 'naturaleza', 'frases', 'decorativo', 'magico', 'ritual', 'lujo'],
      planName: 'Plan Total'
    }
  }

  // Plan Standard (€7) - SCRAPBOOK LIMITADO + FUNCIONES BÁSICAS
  if (subscriptionTier === 'basic_7' || userRole === 'premium') {
    return {
      maxPages: 15,
      maxStickersPerPage: 50,
      hasSecretPocket: false,
      hasManifestationPage: false,
      hasRitualMode: false,
      hasMagicEffects: true, // Efectos básicos
      canExportPDF: false,
      hasPremiumStickers: true,
      stickerCategories: ['basico', 'emociones', 'naturaleza', 'frases', 'decorativo'],
      planName: 'Plan Standard'
    }
  }

  // Usuarios gratuitos (sin plan premium)
  return {
    maxPages: 3,
    maxStickersPerPage: 20,
    hasSecretPocket: false,
    hasManifestationPage: false,
    hasRitualMode: false,
    hasMagicEffects: false,
    canExportPDF: false,
    hasPremiumStickers: false,
    stickerCategories: ['basico', 'emociones'],
    planName: 'Gratuito'
  }
}

export function canCreatePage(currentPages: number, limits: ScrapbookLimits): boolean {
  return currentPages < limits.maxPages
}

export function canAccessFeature(feature: keyof ScrapbookLimits, limits: ScrapbookLimits): boolean {
  return !!limits[feature]
}

// Información de planes para la UI
export function getPlanUpgradeMessage(currentTier: string | null): string {
  if (!currentTier || currentTier === 'none') {
    return '¡Actualiza al Plan Standard (€7) para tener 15 páginas de scrapbook!'
  }
  if (currentTier === 'basic_7') {
    return '¡Actualiza al Plan Total (€15) para tener páginas ilimitadas y todas las funciones mágicas!'
  }
  return 'Tienes el plan completo con todas las funciones desbloqueadas'
}
