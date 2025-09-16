-- Adiciona novo valor SUPERUSER ao enum Role se ainda não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname = 'Role' AND e.enumlabel = 'SUPERUSER'
  ) THEN
    ALTER TYPE "Role" ADD VALUE 'SUPERUSER';
  END IF;
END $$;
