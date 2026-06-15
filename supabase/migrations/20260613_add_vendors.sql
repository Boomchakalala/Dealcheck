-- ─────────────────────────────────────────────────────────────────────────────
-- Vendors feature, stage 1: vendor entity, per-user, with aliases + notes.
-- Apply manually in the Supabase SQL editor (same as the other migrations here).
-- Safe to re-run (IF NOT EXISTS / IF EXISTS guards throughout).
-- ─────────────────────────────────────────────────────────────────────────────

-- ── vendors ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendors (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  canonical_name  TEXT NOT NULL,
  normalized_key  TEXT NOT NULL,
  aliases         TEXT[] NOT NULL DEFAULT '{}',      -- display names absorbed by merges
  alias_keys      TEXT[] NOT NULL DEFAULT '{}',      -- normalized keys of the aliases (for matching)
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- One canonical vendor per (user, normalized_key). Resolution also checks alias_keys.
CREATE UNIQUE INDEX IF NOT EXISTS vendors_user_key_unique ON vendors (user_id, normalized_key);
CREATE INDEX IF NOT EXISTS vendors_user_id_idx ON vendors (user_id);
CREATE INDEX IF NOT EXISTS vendors_alias_keys_idx ON vendors USING GIN (alias_keys);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own vendors" ON vendors;
CREATE POLICY "Users can read own vendors"   ON vendors FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create own vendors" ON vendors;
CREATE POLICY "Users can create own vendors" ON vendors FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own vendors" ON vendors;
CREATE POLICY "Users can update own vendors" ON vendors FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own vendors" ON vendors;
CREATE POLICY "Users can delete own vendors" ON vendors FOR DELETE USING (auth.uid() = user_id);

-- ── deals.vendor_id (nullable FK; deal.vendor string stays the display source) ─
ALTER TABLE deals ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS deals_vendor_id_idx ON deals (vendor_id);

-- ── vendor_notes (vendor-level notes; deal outcome notes are read from deals) ──
CREATE TABLE IF NOT EXISTS vendor_notes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id   UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS vendor_notes_vendor_id_idx ON vendor_notes (vendor_id, created_at DESC);

ALTER TABLE vendor_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own vendor notes" ON vendor_notes;
CREATE POLICY "Users can read own vendor notes"   ON vendor_notes FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create own vendor notes" ON vendor_notes;
CREATE POLICY "Users can create own vendor notes" ON vendor_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own vendor notes" ON vendor_notes;
CREATE POLICY "Users can update own vendor notes" ON vendor_notes FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own vendor notes" ON vendor_notes;
CREATE POLICY "Users can delete own vendor notes" ON vendor_notes FOR DELETE USING (auth.uid() = user_id);
