
/**
 * Gestor de Voces Mágicas
 * 
 * Controla los límites, tracking y monetización del sistema de voces
 * con Piper TTS (0€ de coste).
 */

import { PrismaClient } from '@prisma/client';
// import { generateVoiceWithPiper } from './piper-tts-service'; // Ya no se usa

const prisma = new PrismaClient();

interface VoiceLimits {
  used: number;
  limit: number;
  purchased: number;
  total: number;
  canUseVoice: boolean;
  resetDate: Date;
}

interface VoiceGenerationResult {
  success: boolean;
  audioUrl?: string;
  audioPath?: string;
  duration?: number;
  cached?: boolean;
  error?: string;
  limitsExceeded?: boolean;
  remainingVoices?: number;
}

/**
 * Obtiene los límites de voces mágicas del usuario
 */
export async function getUserVoiceLimits(userId: string): Promise<VoiceLimits> {
  try {
    // 1. Obtener o crear registro de créditos
    let credits = await prisma.magicalCompanionCredits.findUnique({
      where: { user_id: userId },
    });

    if (!credits) {
      // Crear registro si no existe
      credits = await prisma.magicalCompanionCredits.create({
        data: {
          user_id: userId,
          magic_voices_used: 0,
          magic_voices_limit: 50, // Límite gratuito por defecto
          magic_voices_purchased: 0,
          last_voices_reset: new Date(),
        },
      });
    }

    // 2. Verificar si hay que resetear el contador mensual
    const lastReset = credits.last_voices_reset || new Date();
    const now = new Date();
    const daysSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceReset >= 30) {
      // Resetear contador mensual
      await prisma.magicalCompanionCredits.update({
        where: { user_id: userId },
        data: {
          magic_voices_used: 0,
          last_voices_reset: now,
        },
      });
      credits.magic_voices_used = 0;
      credits.last_voices_reset = now;
    }

    // 3. Calcular totales
    const used = credits.magic_voices_used || 0;
    const limit = credits.magic_voices_limit || 50;
    const purchased = credits.magic_voices_purchased || 0;
    const total = limit + purchased;
    const canUseVoice = used < total;

    // 4. Calcular próxima fecha de reset
    const resetDate = new Date(lastReset);
    resetDate.setDate(resetDate.getDate() + 30);

    return {
      used,
      limit,
      purchased,
      total,
      canUseVoice,
      resetDate,
    };
  } catch (error) {
    console.error('Error al obtener límites de voz:', error);
    throw error;
  }
}

/**
 * Genera una voz mágica y actualiza los contadores
 */
export async function generateMagicVoice(
  userId: string,
  text: string,
  companionType: string
): Promise<VoiceGenerationResult> {
  try {
    // 1. Verificar límites
    const limits = await getUserVoiceLimits(userId);

    if (!limits.canUseVoice) {
      return {
        success: false,
        limitsExceeded: true,
        remainingVoices: 0,
        error: 'magic_depleted',
      };
    }

    // 2. Generar voz con Piper TTS
    const startTime = Date.now();
    
    // TODO: Esta función ya no se usa directamente
    // La generación de voces ahora se hace a través de /api/tts/piper
    const result = {
      success: false,
      error: 'Direct voice generation is deprecated. Use /api/tts/piper instead.'
    };

    if (!result.success) {
      return {
        ...result,
        limitsExceeded: false,
      };
    }

    // 3. Incrementar contador solo si no vino del caché
    const cached = false; // TODO: implementar caché
    if (!cached) {
      await prisma.magicalCompanionCredits.update({
        where: { user_id: userId },
        data: {
          magic_voices_used: {
            increment: 1,
          },
        },
      });
    }

    // 4. Registrar log de uso
    const generationTime = Date.now() - startTime;
    await prisma.$executeRaw`
      INSERT INTO "magic_voice_usage_logs" 
      ("id", "user_id", "companion_type", "text_length", "used_cache", "generation_time_ms", "success", "created_at")
      VALUES (
        gen_random_uuid()::text,
        ${userId},
        ${companionType},
        ${text.length},
        ${cached},
        ${generationTime},
        true,
        NOW()
      )
    `;

    // 5. Actualizar límites
    const newLimits = await getUserVoiceLimits(userId);

    return {
      ...result,
      limitsExceeded: false,
      remainingVoices: newLimits.total - newLimits.used,
    };
  } catch (error) {
    console.error('Error al generar voz mágica:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Compra un pack de voces adicionales
 */
export async function purchaseVoicePack(
  userId: string,
  packType: 'pack_50' | 'pack_150' | 'pack_500',
  stripePaymentIntent: string
): Promise<boolean> {
  try {
    const packDetails = {
      pack_50: { voices: 50, price: 2.99 },
      pack_150: { voices: 150, price: 4.99 },
      pack_500: { voices: 500, price: 9.99 },
    };

    const pack = packDetails[packType];
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Expira en 30 días

    // 1. Crear registro del pack
    await prisma.$executeRaw`
      INSERT INTO "magic_voice_packs" 
      ("id", "user_id", "pack_type", "voices_amount", "voices_remaining", "price_eur", "stripe_payment_intent", "payment_status", "expires_at", "created_at")
      VALUES (
        gen_random_uuid()::text,
        ${userId},
        ${packType},
        ${pack.voices},
        ${pack.voices},
        ${pack.price},
        ${stripePaymentIntent},
        'completed',
        ${expiresAt},
        NOW()
      )
    `;

    // 2. Actualizar voces compradas del usuario
    await prisma.magicalCompanionCredits.update({
      where: { user_id: userId },
      data: {
        magic_voices_purchased: {
          increment: pack.voices,
        },
      },
    });

    console.log(`✅ Pack de ${pack.voices} voces comprado por usuario ${userId}`);
    return true;
  } catch (error) {
    console.error('Error al comprar pack de voces:', error);
    return false;
  }
}

/**
 * Actualiza los límites de voces según el plan del usuario
 */
export async function updateVoiceLimitsByPlan(userId: string): Promise<void> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { user_id: userId },
    });

    let newLimit = 50; // Gratuito por defecto

    if (subscription) {
      if (subscription.plan_tier === 'complete_15') {
        newLimit = 500; // Plan Premium
      } else if (subscription.magical_companions_enabled && subscription.magical_companions_status === 'active') {
        newLimit = 200; // Plan Personajes Mágicos
      }
    }

    await prisma.magicalCompanionCredits.upsert({
      where: { user_id: userId },
      update: {
        magic_voices_limit: newLimit,
      },
      create: {
        user_id: userId,
        magic_voices_used: 0,
        magic_voices_limit: newLimit,
        magic_voices_purchased: 0,
        last_voices_reset: new Date(),
      },
    });

    console.log(`✅ Límites de voz actualizados para usuario ${userId}: ${newLimit} voces/mes`);
  } catch (error) {
    console.error('Error al actualizar límites de voz:', error);
  }
}

/**
 * Limpia packs expirados y ajusta contadores
 */
export async function cleanExpiredVoicePacks(): Promise<void> {
  try {
    const now = new Date();

    // 1. Obtener packs expirados
    const expiredPacks = await prisma.$queryRaw<any[]>`
      SELECT "user_id", SUM("voices_remaining") as "total_expired"
      FROM "magic_voice_packs"
      WHERE "expires_at" < ${now}
        AND "voices_remaining" > 0
      GROUP BY "user_id"
    `;

    // 2. Para cada usuario con packs expirados, restar voces
    for (const { user_id, total_expired } of expiredPacks) {
      await prisma.magicalCompanionCredits.update({
        where: { user_id },
        data: {
          magic_voices_purchased: {
            decrement: Number(total_expired),
          },
        },
      });
    }

    // 3. Marcar packs como expirados
    await prisma.$executeRaw`
      UPDATE "magic_voice_packs"
      SET "voices_remaining" = 0
      WHERE "expires_at" < ${now}
        AND "voices_remaining" > 0
    `;

    console.log(`🧹 Limpiados packs expirados para ${expiredPacks.length} usuarios`);
  } catch (error) {
    console.error('Error al limpiar packs expirados:', error);
  }
}

