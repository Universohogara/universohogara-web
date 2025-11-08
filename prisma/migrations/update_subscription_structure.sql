
-- Migración para actualizar estructura de suscripciones
-- Fecha: 2025-10-30
-- Descripción: Refactorización completa del sistema de suscripciones para soportar:
-- 1. Planes base (basic_7 y complete_15)
-- 2. Personajes mágicos como complemento (addon) o independiente (standalone)

-- Actualizar tabla subscriptions
ALTER TABLE subscriptions 
  ALTER COLUMN plan_tier SET DEFAULT 'none',
  ALTER COLUMN price SET DEFAULT 0.00;

-- Agregar nuevas columnas si no existen
ALTER TABLE subscriptions 
  ADD COLUMN IF NOT EXISTS magical_companions_plan_type VARCHAR(50) DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS magical_companions_status VARCHAR(50) DEFAULT 'inactive';

-- Eliminar columna antigua si existe
ALTER TABLE subscriptions DROP COLUMN IF EXISTS magical_companions_type;

-- Migrar datos existentes
UPDATE subscriptions 
SET plan_tier = 'basic_7', price = 7.00
WHERE plan_tier = 'standard' AND status = 'active';

UPDATE subscriptions 
SET plan_tier = 'complete_15', price = 15.00
WHERE plan_tier = 'total' AND status = 'active';

-- Resetear planes inactivos
UPDATE subscriptions 
SET plan_tier = 'none', price = 0.00
WHERE status = 'inactive' OR status = 'cancelled';

-- Información de éxito
SELECT 'Migración completada exitosamente' AS status;
