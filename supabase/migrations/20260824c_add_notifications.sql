-- ─────────────────────────────────────────────────────────────────────────────
-- In-app notifications — system-generated only (inserted via the service-role
-- client from trusted server code, never directly by users). RLS only grants
-- users read/mark-read access to their own rows; there is no user-facing
-- INSERT policy by design.
-- Apply manually in the Supabase SQL editor. Safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  link        TEXT,
  read_at     TIMESTAMP WITH TIME ZONE,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can mark own notifications read" ON notifications;
CREATE POLICY "Users can mark own notifications read"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);
