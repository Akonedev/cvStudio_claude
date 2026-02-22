-- ─────────────────────────────────────────────────────────────────────────────
--  CV Studio Claude — PostgreSQL initialization
--  Runs once on first container start
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- For ILIKE text search performance

-- Set timezone
SET timezone = 'Europe/Paris';

-- Log creation
DO $$
BEGIN
  RAISE NOTICE 'CV Studio Claude database initialized at %', NOW();
END$$;
