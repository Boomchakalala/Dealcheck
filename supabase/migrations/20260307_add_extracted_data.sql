-- Migration: Add extracted_data column for storing extraction results
-- Date: 2026-03-07

-- Add extracted_data JSONB column to rounds table
ALTER TABLE rounds
ADD COLUMN IF NOT EXISTS extracted_data JSONB;

-- Add index for querying extraction confidence
CREATE INDEX IF NOT EXISTS idx_rounds_extraction_confidence
ON rounds ((extracted_data->>'confidence'));

-- Add comment explaining the column
COMMENT ON COLUMN rounds.extracted_data IS 'Stores structured extraction results from extractAndNormalize() - includes supplier, amounts, unclear fields, and confidence level';
