-- ─────────────────────────────────────────────────────────────────────────────
-- Negotiation requests — intake for the human-led negotiation service.
-- Apply manually in the Supabase SQL editor (same as the other migrations here).
-- Safe to re-run (IF NOT EXISTS / IF EXISTS guards throughout).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS negotiation_requests (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id               UUID REFERENCES deals(id) ON DELETE SET NULL,   -- set for post_analysis, null for direct
  round_id              UUID REFERENCES rounds(id) ON DELETE SET NULL,  -- which analysis it came from, if any
  source                TEXT NOT NULL CHECK (source IN ('post_analysis', 'direct')),
  status                TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new', 'reviewing', 'waiting_for_client_info', 'ready_to_negotiate',
    'negotiating', 'offer_received', 'closed_won', 'closed_lost'
  )),
  vendor                TEXT,
  category              TEXT,
  renewal_date          DATE,
  current_total         TEXT,   -- mirrors snapshot.total_commitment's existing string format
  seat_or_usage_notes   TEXT,
  contact_name          TEXT,
  contact_phone         TEXT,
  vendor_contact_name   TEXT,
  vendor_contact_email  TEXT,
  notes                 TEXT,   -- relationship/context/constraints, free-form
  document_path         TEXT,
  document_consent_at   TIMESTAMP WITH TIME ZONE,
  created_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_negotiation_requests_user_id ON negotiation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_negotiation_requests_status ON negotiation_requests(status);

ALTER TABLE negotiation_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own negotiation requests" ON negotiation_requests;
CREATE POLICY "Users can read own negotiation requests"
  ON negotiation_requests FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own negotiation requests" ON negotiation_requests;
CREATE POLICY "Users can create own negotiation requests"
  ON negotiation_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can read all negotiation requests" ON negotiation_requests;
CREATE POLICY "Admins can read all negotiation requests"
  ON negotiation_requests FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "Admins can update negotiation requests" ON negotiation_requests;
CREATE POLICY "Admins can update negotiation requests"
  ON negotiation_requests FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Trigger to auto-update updated_at (reuses the function from 001_initial_schema.sql)
DROP TRIGGER IF EXISTS on_negotiation_request_updated ON negotiation_requests;
CREATE TRIGGER on_negotiation_request_updated
  BEFORE UPDATE ON negotiation_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── Storage: negotiation-documents bucket ──────────────────────────────────
-- Private bucket, deliberate exception to the app's "delete uploads instantly"
-- policy — files here are only retained once someone has explicitly asked for
-- a negotiator, with a visible consent line at upload time (document_consent_at).
INSERT INTO storage.buckets (id, name, public)
VALUES ('negotiation-documents', 'negotiation-documents', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload own negotiation documents" ON storage.objects;
CREATE POLICY "Users can upload own negotiation documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'negotiation-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can read own negotiation documents" ON storage.objects;
CREATE POLICY "Users can read own negotiation documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'negotiation-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Admins can read all negotiation documents" ON storage.objects;
CREATE POLICY "Admins can read all negotiation documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'negotiation-documents'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
