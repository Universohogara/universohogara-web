-- Agregar columna emotion_detected a chat_messages
ALTER TABLE "chat_messages" ADD COLUMN IF NOT EXISTS "emotion_detected" TEXT;

-- Agregar índice para mejorar consultas por emoción
CREATE INDEX IF NOT EXISTS "chat_messages_emotion_detected_idx" ON "chat_messages"("emotion_detected");
