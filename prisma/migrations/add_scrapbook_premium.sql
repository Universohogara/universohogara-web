-- Agregar columnas premium al scrapbook
ALTER TABLE "scrapbook_pages" ADD COLUMN IF NOT EXISTS "is_secret" BOOLEAN DEFAULT false;
ALTER TABLE "scrapbook_pages" ADD COLUMN IF NOT EXISTS "page_type" TEXT DEFAULT 'normal'; -- normal, manifestation, secret_pocket
ALTER TABLE "scrapbook_pages" ADD COLUMN IF NOT EXISTS "mood" TEXT DEFAULT 'light'; -- light, ritual, night
ALTER TABLE "scrapbook_pages" ADD COLUMN IF NOT EXISTS "private_notes" TEXT;

-- Agregar tabla de packs premium
CREATE TABLE IF NOT EXISTS "user_premium_packs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "pack_type" TEXT NOT NULL, -- scrapbook_magic, voice_premium, etc
  "purchased_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMP, -- NULL para compras únicas
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  
  CONSTRAINT "user_premium_packs_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "user_premium_packs_user_id_idx" ON "user_premium_packs"("user_id");
CREATE INDEX IF NOT EXISTS "user_premium_packs_pack_type_idx" ON "user_premium_packs"("pack_type");

-- Agregar límites de stickers por tier
ALTER TABLE "stickers" ADD COLUMN IF NOT EXISTS "pack_required" TEXT DEFAULT 'none'; -- none, scrapbook_magic

-- Seed inicial de stickers si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "stickers" LIMIT 1) THEN
        -- Los stickers se agregarán via script de seed
        NULL;
    END IF;
END $$;

