-- Eliminar la restricción unique del campo user_id en companions
ALTER TABLE companions DROP CONSTRAINT IF EXISTS companions_user_id_key;

-- Agregar restricción única compuesta para permitir múltiples companions por usuario, pero solo uno de cada tipo
ALTER TABLE companions ADD CONSTRAINT companions_user_id_type_key UNIQUE (user_id, type);
