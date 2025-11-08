
-- Añadir campos de Personajes Mágicos a Subscription
ALTER TABLE "subscriptions" 
ADD COLUMN IF NOT EXISTS "magical_companions_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "magical_companions_type" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN IF NOT EXISTS "magical_companions_subscription_id" TEXT;

-- Crear tabla de créditos de Personajes Mágicos
CREATE TABLE IF NOT EXISTS "magical_companion_credits" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_credits" INTEGER NOT NULL DEFAULT 0,
    "credits_used" INTEGER NOT NULL DEFAULT 0,
    "free_messages_today" INTEGER NOT NULL DEFAULT 0,
    "free_messages_limit" INTEGER NOT NULL DEFAULT 10,
    "last_free_reset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message_at" TIMESTAMP(3),
    "total_messages" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "magical_companion_credits_pkey" PRIMARY KEY ("id")
);

-- Crear tabla de compras de créditos
CREATE TABLE IF NOT EXISTS "credit_purchases" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "pack_type" TEXT NOT NULL,
    "credits_amount" INTEGER NOT NULL,
    "price_eur" DOUBLE PRECISION NOT NULL,
    "stripe_payment_intent" TEXT,
    "stripe_charge_id" TEXT,
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "applied_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_purchases_pkey" PRIMARY KEY ("id")
);

-- Crear índices
CREATE UNIQUE INDEX IF NOT EXISTS "magical_companion_credits_user_id_key" ON "magical_companion_credits"("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "credit_purchases_stripe_payment_intent_key" ON "credit_purchases"("stripe_payment_intent");
CREATE INDEX IF NOT EXISTS "credit_purchases_user_id_created_at_idx" ON "credit_purchases"("user_id", "created_at");

-- Comentarios para documentación
COMMENT ON TABLE "magical_companion_credits" IS 'Sistema de créditos y límites diarios para Personajes Mágicos';
COMMENT ON TABLE "credit_purchases" IS 'Historial de compras de packs de créditos';
COMMENT ON COLUMN "subscriptions"."magical_companions_enabled" IS 'Si el usuario tiene la extensión de Personajes Mágicos activa';
COMMENT ON COLUMN "subscriptions"."magical_companions_type" IS 'Tipo de acceso: none, subscription, credits';
