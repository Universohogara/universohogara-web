
/**
 * Middleware para verificar permisos de chat y gestionar créditos/límites
 * 
 * NUEVA ESTRUCTURA DE ACCESO (Oct 2025):
 * 1. Admin: Acceso ilimitado y gratuito (sin coste para Gara)
 * 2. Plan Personajes Mágicos:
 *    - Addon (con plan base €7 o €15): 200 mensajes/mes + memoria emocional + voces ilimitadas
 *    - Standalone (solo €4.99): 100 mensajes/mes + conversaciones simples + voces ilimitadas
 * 3. Cuenta gratuita: Sin acceso
 * 
 * SISTEMA DE LÍMITES:
 * - Addon: 200 mensajes/mes + créditos comprados
 * - Standalone: 100 mensajes/mes + créditos comprados
 * - Al agotarse, pueden comprar packs de créditos (100 → €1.99, 300 → €3.99)
 * - Los créditos comprados NO caducan mientras haya suscripción activa
 * - Reseteo automático cada mes natural
 */

import { prisma } from './db'

export interface ChatAccessResult {
  allowed: boolean
  reason?: string
  userType: 'admin' | 'addon' | 'standalone' | 'free'
  messagesRemaining?: number
  accessLevel: 'full' | 'limited' | 'none'
  hasBasePlan: boolean
  monthlyMessagesUsed?: number
  purchasedCredits?: number
}

/**
 * Resetea el contador mensual si ha pasado más de 30 días
 */
async function checkAndResetMonthlyLimit(userId: string, hasBasePlan: boolean): Promise<void> {
  const credits = await prisma.magicalCompanionCredits.findUnique({
    where: { user_id: userId }
  })
  
  // Establecer límite según tipo de plan
  // - Plan base (addon): 200 mensajes/mes
  // - Solo extensión (standalone): 100 mensajes/mes
  const monthlyLimit = hasBasePlan ? 200 : 100
  
  if (!credits) {
    // Crear registro de créditos si no existe
    await prisma.magicalCompanionCredits.create({
      data: {
        user_id: userId,
        monthly_messages_used: 0,
        monthly_messages_limit: monthlyLimit,
        last_monthly_reset: new Date(),
        purchased_credits: 0
      }
    })
    return
  }
  
  // Verificar si ha pasado un mes
  const now = new Date()
  const lastReset = new Date(credits.last_monthly_reset)
  const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysSinceReset >= 30) {
    // Resetear contador mensual y actualizar límite según plan actual
    await prisma.magicalCompanionCredits.update({
      where: { user_id: userId },
      data: {
        monthly_messages_used: 0,
        monthly_messages_limit: monthlyLimit,
        last_monthly_reset: now
      }
    })
  } else if (credits.monthly_messages_limit !== monthlyLimit) {
    // Actualizar límite si el usuario cambió de plan (pero no resetear uso)
    await prisma.magicalCompanionCredits.update({
      where: { user_id: userId },
      data: {
        monthly_messages_limit: monthlyLimit
      }
    })
  }
}

/**
 * Verifica si un usuario puede enviar un mensaje de chat
 */
export async function checkChatAccess(userId: string): Promise<ChatAccessResult> {
  // 0. ✅ VERIFICAR SI ES ADMINISTRADOR - ACCESO GRATUITO E ILIMITADO
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  })
  
  if (user?.role === 'admin') {
    return {
      allowed: true,
      userType: 'admin',
      messagesRemaining: -1, // Ilimitado
      accessLevel: 'full',
      hasBasePlan: true,
      monthlyMessagesUsed: 0,
      purchasedCredits: 0
    }
  }
  
  // 1. Verificar si el usuario tiene suscripción de personajes mágicos
  const subscription = await prisma.subscription.findUnique({
    where: { user_id: userId }
  })
  
  // Verificar si tiene plan base activo
  const hasBasePlan = subscription?.status === 'active' && 
    (subscription?.plan_tier === 'basic_7' || subscription?.plan_tier === 'complete_15')
  
  // Verificar si tiene personajes mágicos activos
  const hasMagicalCompanions = subscription?.magical_companions_enabled && 
    subscription?.magical_companions_status === 'active'
  
  if (!hasMagicalCompanions) {
    // Sin personajes mágicos, sin acceso
    return {
      allowed: false,
      userType: 'free',
      reason: 'no_magical_companions_plan',
      messagesRemaining: 0,
      accessLevel: 'none',
      hasBasePlan: hasBasePlan
    }
  }
  
  // 2. Resetear límite mensual si es necesario (pasar info de plan base)
  await checkAndResetMonthlyLimit(userId, hasBasePlan)
  
  // 3. Obtener estado de créditos
  const credits = await prisma.magicalCompanionCredits.findUnique({
    where: { user_id: userId }
  })
  
  if (!credits) {
    // Establecer límite según tipo de plan
    const monthlyLimit = hasBasePlan ? 200 : 100
    
    // Crear registro si no existe (fallback)
    await prisma.magicalCompanionCredits.create({
      data: {
        user_id: userId,
        monthly_messages_used: 0,
        monthly_messages_limit: monthlyLimit,
        last_monthly_reset: new Date(),
        purchased_credits: 0
      }
    })
    
    // Devolver acceso con límite completo
    return {
      allowed: true,
      userType: subscription.magical_companions_plan_type === 'addon' ? 'addon' : 'standalone',
      messagesRemaining: monthlyLimit,
      accessLevel: subscription.magical_companions_plan_type === 'addon' ? 'full' : 'limited',
      hasBasePlan: hasBasePlan,
      monthlyMessagesUsed: 0,
      purchasedCredits: 0
    }
  }
  
  // 4. Calcular mensajes disponibles
  const monthlyMessagesRemaining = credits.monthly_messages_limit - credits.monthly_messages_used
  const totalMessagesAvailable = monthlyMessagesRemaining + credits.purchased_credits
  
  // 5. Verificar si puede enviar mensaje
  if (totalMessagesAvailable <= 0) {
    // Sin mensajes disponibles
    return {
      allowed: false,
      userType: subscription.magical_companions_plan_type === 'addon' ? 'addon' : 'standalone',
      reason: 'monthly_limit_reached',
      messagesRemaining: 0,
      accessLevel: subscription.magical_companions_plan_type === 'addon' ? 'full' : 'limited',
      hasBasePlan: hasBasePlan,
      monthlyMessagesUsed: credits.monthly_messages_used,
      purchasedCredits: credits.purchased_credits
    }
  }
  
  // 6. Usuario puede enviar mensaje
  return {
    allowed: true,
    userType: subscription.magical_companions_plan_type === 'addon' ? 'addon' : 'standalone',
    messagesRemaining: totalMessagesAvailable,
    accessLevel: subscription.magical_companions_plan_type === 'addon' ? 'full' : 'limited',
    hasBasePlan: hasBasePlan,
    monthlyMessagesUsed: credits.monthly_messages_used,
    purchasedCredits: credits.purchased_credits
  }
}

/**
 * Registra el uso de un mensaje y CONSUME del contador
 * ⚠️ IMPORTANTE: Este método DEBE ser llamado después de enviar cada mensaje
 */
export async function recordMessageUsage(userId: string, userType: 'admin' | 'addon' | 'standalone' | 'free'): Promise<void> {
  // ✅ NO CONSUMIR PARA ADMINISTRADORES (acceso ilimitado)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  })
  
  if (user?.role === 'admin') {
    return // Los admins tienen acceso ilimitado sin registro
  }
  
  // Obtener créditos actuales
  const credits = await prisma.magicalCompanionCredits.findUnique({
    where: { user_id: userId }
  })
  
  if (!credits) {
    console.warn(`⚠️ No se encontraron créditos para el usuario ${userId}`)
    return
  }
  
  // CONSUMIR UN MENSAJE
  // Prioridad: primero mensajes mensuales, luego créditos comprados
  const monthlyMessagesRemaining = credits.monthly_messages_limit - credits.monthly_messages_used
  
  if (monthlyMessagesRemaining > 0) {
    // Consumir del límite mensual
    await prisma.magicalCompanionCredits.update({
      where: { user_id: userId },
      data: {
        monthly_messages_used: credits.monthly_messages_used + 1,
        total_messages: credits.total_messages + 1,
        last_message_at: new Date()
      }
    })
    console.log(`✅ Mensaje consumido del límite mensual. ${monthlyMessagesRemaining - 1} restantes.`)
  } else if (credits.purchased_credits > 0) {
    // Consumir de créditos comprados
    await prisma.magicalCompanionCredits.update({
      where: { user_id: userId },
      data: {
        purchased_credits: credits.purchased_credits - 1,
        total_messages: credits.total_messages + 1,
        last_message_at: new Date()
      }
    })
    console.log(`✅ Mensaje consumido de créditos comprados. ${credits.purchased_credits - 1} restantes.`)
  } else {
    // No debería llegar aquí si checkChatAccess se usó correctamente
    console.warn(`⚠️ Usuario ${userId} intentó enviar mensaje sin créditos disponibles`)
  }
}

/**
 * Obtiene el estado actual de personajes mágicos de un usuario
 */
export async function getUserChatStatus(userId: string): Promise<{
  userType: 'admin' | 'addon' | 'standalone' | 'free'
  accessLevel: 'full' | 'limited' | 'none'
  hasBasePlan: boolean
  basePlanTier?: string
  magicalCompanionsActive: boolean
}> {
  // ✅ VERIFICAR SI ES ADMINISTRADOR
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  })
  
  if (user?.role === 'admin') {
    return {
      userType: 'admin',
      accessLevel: 'full',
      hasBasePlan: true,
      basePlanTier: 'admin',
      magicalCompanionsActive: true
    }
  }
  
  const subscription = await prisma.subscription.findUnique({
    where: { user_id: userId }
  })
  
  // Verificar plan base
  const hasBasePlan = subscription?.status === 'active' && 
    (subscription?.plan_tier === 'basic_7' || subscription?.plan_tier === 'complete_15')
  
  const magicalCompanionsActive = subscription?.magical_companions_enabled && 
    subscription?.magical_companions_status === 'active'
  
  // Caso: Plan base + personajes (addon)
  if (hasBasePlan && magicalCompanionsActive && subscription?.magical_companions_plan_type === 'addon') {
    return {
      userType: 'addon',
      accessLevel: 'full',
      hasBasePlan: true,
      basePlanTier: subscription.plan_tier,
      magicalCompanionsActive: true
    }
  }
  
  // Caso: Solo personajes (standalone)
  if (magicalCompanionsActive && subscription?.magical_companions_plan_type === 'standalone') {
    return {
      userType: 'standalone',
      accessLevel: 'limited',
      hasBasePlan: false,
      magicalCompanionsActive: true
    }
  }
  
  // Caso: Usuario sin personajes mágicos
  return {
    userType: 'free',
    accessLevel: 'none',
    hasBasePlan: hasBasePlan,
    basePlanTier: hasBasePlan ? subscription?.plan_tier : undefined,
    magicalCompanionsActive: false
  }
}
