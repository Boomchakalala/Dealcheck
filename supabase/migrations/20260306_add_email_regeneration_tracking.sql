-- Add email regeneration tracking to rounds table
-- This tracks how many times a user has regenerated emails for this round
-- to prevent API key abuse

ALTER TABLE rounds
ADD COLUMN IF NOT EXISTS email_regeneration_count INTEGER DEFAULT 0 CHECK (email_regeneration_count >= 0);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_rounds_email_regen_count ON rounds(email_regeneration_count);

-- Comment
COMMENT ON COLUMN rounds.email_regeneration_count IS 'Number of times user has regenerated emails for this round (limit: 3)';
