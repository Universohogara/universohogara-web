-- Crear tabla de frases emocionales pregrabadas
CREATE TABLE IF NOT EXISTS "emotional_voice_phrases" (
    "id" TEXT NOT NULL,
    "companion_type" TEXT NOT NULL,
    "phrase_id" TEXT NOT NULL,
    "emotion_type" TEXT NOT NULL,
    "text_content" TEXT NOT NULL,
    "audio_url" TEXT NOT NULL,
    "duration_seconds" DOUBLE PRECISION NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'es',
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "tone" TEXT,
    "metadata" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emotional_voice_phrases_pkey" PRIMARY KEY ("id")
);

-- Crear tabla de logs de reproducción de frases emocionales
CREATE TABLE IF NOT EXISTS "emotional_voice_phrase_play_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "phrase_id" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "context" TEXT,
    "played_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emotional_voice_phrase_play_logs_pkey" PRIMARY KEY ("id")
);

-- Crear índices y constraints únicos
CREATE UNIQUE INDEX IF NOT EXISTS "emotional_voice_phrases_companion_type_phrase_id_key" ON "emotional_voice_phrases"("companion_type", "phrase_id");
CREATE INDEX IF NOT EXISTS "emotional_voice_phrases_companion_type_emotion_type_is_active_idx" ON "emotional_voice_phrases"("companion_type", "emotion_type", "is_active");
CREATE INDEX IF NOT EXISTS "emotional_voice_phrase_play_logs_user_id_played_at_idx" ON "emotional_voice_phrase_play_logs"("user_id", "played_at");
CREATE INDEX IF NOT EXISTS "emotional_voice_phrase_play_logs_phrase_id_played_at_idx" ON "emotional_voice_phrase_play_logs"("phrase_id", "played_at");

-- Agregar foreign key constraints
ALTER TABLE "emotional_voice_phrase_play_logs" DROP CONSTRAINT IF EXISTS "emotional_voice_phrase_play_logs_phrase_id_fkey";
ALTER TABLE "emotional_voice_phrase_play_logs" ADD CONSTRAINT "emotional_voice_phrase_play_logs_phrase_id_fkey" FOREIGN KEY ("phrase_id") REFERENCES "emotional_voice_phrases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
