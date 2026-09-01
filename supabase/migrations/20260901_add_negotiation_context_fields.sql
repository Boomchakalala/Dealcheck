-- ─────────────────────────────────────────────────────────────────────────────
-- Negotiation context fields — captures what the analysis already inferred
-- (deal type, target price, savings, top red flags, verdict) at submission
-- time, plus a small set of genuinely user-only fields (objective, walk-away,
-- competitor context) that the quote/analysis cannot reliably know.
--
-- analysis_context is a deliberate SNAPSHOT, not a live reference: it stores
-- normalized fields only (target price, savings estimate, top flag headlines,
-- verdict text) — never the raw quote text, per the existing "don't send the
-- whole document where it isn't needed" posture already established for this
-- table's document_path/document_consent_at columns.
--
-- Apply manually in the Supabase SQL editor (same as the other migrations
-- here). Safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE negotiation_requests
  ADD COLUMN IF NOT EXISTS deal_type TEXT CHECK (deal_type IN ('renewal', 'new_purchase', 'expansion', 'unknown')),
  ADD COLUMN IF NOT EXISTS deal_type_confidence TEXT CHECK (deal_type_confidence IN ('high', 'low')),
  ADD COLUMN IF NOT EXISTS negotiation_objective TEXT,
  ADD COLUMN IF NOT EXISTS walk_away_notes TEXT,
  ADD COLUMN IF NOT EXISTS competitor_context TEXT,
  ADD COLUMN IF NOT EXISTS analysis_context JSONB;
