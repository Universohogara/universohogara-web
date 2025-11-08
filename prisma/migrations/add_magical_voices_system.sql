
-- Migración para sistema de voces mágicas con Piper TTS
-- Fecha: 2025-10-30

-- 1. Agregar campos para tracking de voces mágicas en MagicalCompanionCredits
ALTER TABLE "magical_companion_credits" 
ADD COLUMN IF NOT EXISTS "magic_voices_used" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "magic_voices_limit" INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS "magic_voices_purchased" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "last_voices_reset" TIMESTAMP DEFAULT NOW();

-- 2. Crear tabla para packs de voces comprados
CREATE TABLE IF NOT EXISTS "magic_voice_packs" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "pack_type" TEXT NOT NULL, -- "pack_50" (2.99€), "pack_150" (4.99€), "pack_500" (9.99€)
  "voices_amount" INTEGER NOT NULL,
  "voices_remaining" INTEGER NOT NULL,
  "price_eur" FLOAT NOT NULL,
  "stripe_payment_intent" TEXT UNIQUE,
  "payment_status" TEXT DEFAULT 'pending', -- "pending", "completed", "failed", "refunded"
  "expires_at" TIMESTAMP NOT NULL, -- Los packs expiran en 30 días
  "created_at" TIMESTAMP DEFAULT NOW(),
  "applied_at" TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "magic_voice_packs_user_id_idx" ON "magic_voice_packs"("user_id");
CREATE INDEX IF NOT EXISTS "magic_voice_packs_expires_at_idx" ON "magic_voice_packs"("expires_at");

-- 3. Crear tabla para caché de voces (optimización)
CREATE TABLE IF NOT EXISTS "voice_cache" (
  "id" TEXT PRIMARY KEY,
  "companion_type" TEXT NOT NULL,
  "text_hash" TEXT NOT NULL, -- Hash del texto para identificar
  "text_content" TEXT NOT NULL,
  "audio_url" TEXT NOT NULL, -- URL del audio generado en S3
  "duration_seconds" FLOAT NOT NULL,
  "file_size_bytes" INTEGER,
  "play_count" INTEGER DEFAULT 0,
  "last_played_at" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS "voice_cache_unique_idx" ON "voice_cache"("companion_type", "text_hash");
CREATE INDEX IF NOT EXISTS "voice_cache_companion_idx" ON "voice_cache"("companion_type");

-- 4. Crear tabla para logs de uso de voces mágicas (con Piper TTS)
CREATE TABLE IF NOT EXISTS "magic_voice_usage_logs" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "companion_type" TEXT NOT NULL,
  "text_length" INTEGER NOT NULL,
  "used_cache" BOOLEAN DEFAULT false,
  "generation_time_ms" INTEGER,
  "success" BOOLEAN DEFAULT true,
  "error_message" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "magic_voice_usage_user_idx" ON "magic_voice_usage_logs"("user_id", "created_at");
CREATE INDEX IF NOT EXISTS "magic_voice_usage_companion_idx" ON "magic_voice_usage_logs"("companion_type");

-- 5. Actualizar límites según planes existentes
-- Plan gratuito: 50 voces/mes
-- Plan Personajes Mágicos (4.99€): 200 voces/mes
-- Plan Premium (15€): 500 voces/mes

UPDATE "magical_companion_credits" 
SET "magic_voices_limit" = 50 
WHERE "user_id" NOT IN (
  SELECT "user_id" FROM "subscriptions" 
  WHERE "magical_companions_enabled" = true
);

UPDATE "magical_companion_credits" mc
SET "magic_voices_limit" = 200
FROM "subscriptions" s
WHERE mc."user_id" = s."user_id" 
  AND s."magical_companions_enabled" = true
  AND s."magical_companions_status" = 'active';

UPDATE "magical_companion_credits" mc
SET "magic_voices_limit" = 500
FROM "subscriptions" s
WHERE mc."user_id" = s."user_id" 
  AND s."status" = 'active'
  AND s."plan_tier" IN ('complete_15');

-- 6. Comentarios para documentación
COMMENT ON COLUMN "magical_companion_credits"."magic_voices_used" IS 'Voces mágicas usadas en el mes actual (se resetea mensualmente)';
COMMENT ON COLUMN "magical_companion_credits"."magic_voices_limit" IS 'Límite de voces mágicas según plan: 50 (gratuito), 200 (personajes mágicos), 500 (premium)';
COMMENT ON COLUMN "magical_companion_credits"."magic_voices_purchased" IS 'Voces adicionales compradas mediante packs (no caducan con el mes)';
COMMENT ON TABLE "voice_cache" IS 'Caché de voces generadas con Piper TTS para optimizar rendimiento y reducir CPU';
COMMENT ON TABLE "magic_voice_packs" IS 'Packs de voces adicionales comprados por usuarios';

