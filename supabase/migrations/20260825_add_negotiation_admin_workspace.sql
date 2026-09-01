-- ─────────────────────────────────────────────────────────────────────────────
-- Admin workspace fields — internal notes and a "next action" reminder so
-- admins have somewhere to actually work a case, not just change its status.
-- Apply manually in the Supabase SQL editor. Safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE negotiation_requests
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS next_action TEXT;
