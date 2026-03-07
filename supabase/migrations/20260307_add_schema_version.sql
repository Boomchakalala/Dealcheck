-- Migration: Add schema_version column to support V1 and V2 analysis formats
-- Date: 2026-03-07

-- Add schema version column to rounds table
ALTER TABLE rounds
ADD COLUMN IF NOT EXISTS schema_version TEXT DEFAULT 'v1'
CHECK (schema_version IN ('v1', 'v2'));

-- Add index for efficient filtering by schema version
CREATE INDEX IF NOT EXISTS idx_rounds_schema_version
ON rounds(schema_version);

-- Make output_markdown nullable for V2 (V2 may not generate markdown)
ALTER TABLE rounds
ALTER COLUMN output_markdown DROP NOT NULL;

-- Add comment explaining the schema version
COMMENT ON COLUMN rounds.schema_version IS 'Schema version: v1 (comprehensive with emails) or v2 (selective, issue-driven, on-demand emails)';
