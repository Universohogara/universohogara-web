
-- Agregar campos de tracking de uso de voz a la tabla de usuarios
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "voice_minutes_used" INTEGER DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "voice_minutes_limit" INTEGER DEFAULT 100; -- 100 minutos por defecto
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "voice_reset_date" TIMESTAMP DEFAULT NOW();
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "voice_last_used" TIMESTAMP;

-- Tabla para registrar cada uso de voz
CREATE TABLE IF NOT EXISTS "voice_usage_logs" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "companion_type" TEXT NOT NULL,
  "text_length" INTEGER NOT NULL,
  "minutes_used" REAL NOT NULL,
  "provider" TEXT NOT NULL DEFAULT 'elevenlabs',
  "success" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_voice_usage_user" ON "voice_usage_logs"("user_id", "created_at");
CREATE INDEX IF NOT EXISTS "idx_voice_usage_companion" ON "voice_usage_logs"("companion_type");
