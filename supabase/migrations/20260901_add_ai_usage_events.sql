-- ─────────────────────────────────────────────────────────────────────────────
-- ai_usage_events — per-call AI cost/usage telemetry (lib/ai-telemetry.ts) and
-- the backing store for anonymous /try and authenticated rate limiting
-- (lib/ai-limits.ts). Every tracked Anthropic call (analysis, deep analysis,
-- email generation) inserts one row here via runWithAiContext().
--
-- This table was created ad-hoc during development and never had a migration
-- file — recreating it here from the live dev schema so production has it.
-- Safe to re-run (IF NOT EXISTS / idempotent policy creation guards).
--
-- Apply manually in the Supabase SQL editor (same as the other migrations
-- here).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ai_usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  deal_id uuid REFERENCES deals(id) ON DELETE SET NULL,
  round_id uuid REFERENCES rounds(id) ON DELETE SET NULL,
  ip_address text,
  action text NOT NULL,
  provider text NOT NULL DEFAULT 'anthropic',
  model text NOT NULL,
  input_tokens integer,
  output_tokens integer,
  cache_creation_input_tokens integer,
  cache_read_input_tokens integer,
  estimated_cost_usd numeric,
  success boolean NOT NULL DEFAULT true,
  error_message text,
  latency_ms integer
);

CREATE INDEX IF NOT EXISTS ai_usage_events_deal_id_idx ON ai_usage_events(deal_id);
CREATE INDEX IF NOT EXISTS ai_usage_events_user_id_idx ON ai_usage_events(user_id);
CREATE INDEX IF NOT EXISTS ai_usage_events_created_at_idx ON ai_usage_events(created_at DESC);
-- Backs the anonymous-IP and authenticated-user rate-limit lookups (rolling
-- window count per action) — see lib/ai-limits.ts / lib/rate-limit.ts.
CREATE INDEX IF NOT EXISTS ai_usage_events_ip_action_idx ON ai_usage_events(ip_address, action, created_at DESC);

ALTER TABLE ai_usage_events ENABLE ROW LEVEL SECURITY;

-- Any request (authenticated or anonymous) may insert its own usage event.
-- user_id must either match the caller or be NULL (anonymous /try calls).
DROP POLICY IF EXISTS ai_usage_events_insert ON ai_usage_events;
CREATE POLICY ai_usage_events_insert ON ai_usage_events
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Only admins may read usage events (cost/usage dashboard at
-- /app/admin/ai-usage). Uses an EXISTS subquery against profiles rather than
-- a self-referential policy on profiles, avoiding RLS recursion.
DROP POLICY IF EXISTS ai_usage_events_select_admin ON ai_usage_events;
CREATE POLICY ai_usage_events_select_admin ON ai_usage_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );
