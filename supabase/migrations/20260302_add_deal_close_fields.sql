-- Add close deal fields to deals table
ALTER TABLE deals
ADD COLUMN status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'closed_won', 'closed_lost', 'closed_no_change')),
ADD COLUMN closed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN final_total NUMERIC,
ADD COLUMN savings_amount NUMERIC,
ADD COLUMN savings_percent NUMERIC,
ADD COLUMN close_notes TEXT,
ADD COLUMN close_summary TEXT;

-- Add index for status queries
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_closed_at ON deals(closed_at);
