-- Sistema de límites de mensajes mensuales para Personajes Mágicos
-- Migración para añadir control de 100 mensajes/mes + sistema de créditos

-- Actualizar tabla de créditos de companions mágicos
ALTER TABLE magical_companion_credits 
ADD COLUMN IF NOT EXISTS monthly_messages_used INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_messages_limit INT DEFAULT 100,
ADD COLUMN IF NOT EXISTS last_monthly_reset TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS purchased_credits INT DEFAULT 0;

-- Actualizar tabla de compras de créditos
ALTER TABLE credit_purchases
ADD COLUMN IF NOT EXISTS credits_remaining INT DEFAULT 0;

COMMENT ON COLUMN magical_companion_credits.monthly_messages_used IS 'Mensajes usados en el mes actual';
COMMENT ON COLUMN magical_companion_credits.monthly_messages_limit IS 'Límite mensual de mensajes (100 por defecto)';
COMMENT ON COLUMN magical_companion_credits.last_monthly_reset IS 'Última vez que se reseteó el contador mensual';
COMMENT ON COLUMN magical_companion_credits.purchased_credits IS 'Créditos comprados adicionales (no caducan con plan activo)';
