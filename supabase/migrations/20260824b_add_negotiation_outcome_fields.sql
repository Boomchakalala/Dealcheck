-- ─────────────────────────────────────────────────────────────────────────────
-- Outcome/savings fields for negotiation_requests — closes the loop so an
-- admin can record the final result of a negotiation (both post_analysis and
-- direct sourced cases use these; post_analysis cases also mirror onto the
-- linked deals row so the client's existing dashboard reflects it).
-- Apply manually in the Supabase SQL editor. Safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE negotiation_requests
  ADD COLUMN IF NOT EXISTS final_total NUMERIC,
  ADD COLUMN IF NOT EXISTS savings_amount NUMERIC,
  ADD COLUMN IF NOT EXISTS savings_percent NUMERIC,
  ADD COLUMN IF NOT EXISTS close_notes TEXT,
  ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP WITH TIME ZONE;
