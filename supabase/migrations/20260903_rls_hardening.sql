-- 20260903_rls_hardening.sql
-- Security Advisor follow-up (2026-09-03).
--
-- Audit result: every table in `public` already has Row Level Security enabled
-- with owner-scoped (auth.uid() = user_id) policies, and the project carries the
-- platform `ensure_rls` event trigger (public.rls_auto_enable) that enables RLS on
-- any table created in `public` from now on. The `rls_disabled_in_public` lint no
-- longer fires. This migration closes the smaller gaps the audit did find.
--
-- Safe to re-run: every statement is idempotent.

-- ---------------------------------------------------------------------------
-- 1. Belt and braces: RLS on every public table (no-op today, documents intent).
-- ---------------------------------------------------------------------------
ALTER TABLE public.ai_usage_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rounds               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_notes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors              ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 2. ai_usage_events: written ONLY by the service role (src/lib/ai-telemetry.ts,
--    createAdminClient). The client-facing INSERT policy
--    `(user_id = auth.uid()) OR (user_id IS NULL)` let the anon role insert
--    arbitrary usage rows with user_id NULL through the REST API. No code path
--    inserts with the anon/authenticated key, so the policy is pure exposure.
--    The admin SELECT policy (used by /app/admin/ai-usage) is kept.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS ai_usage_events_insert ON public.ai_usage_events;

-- ---------------------------------------------------------------------------
-- 3. SECURITY DEFINER trigger functions were EXECUTE-able by anon/authenticated
--    via /rest/v1/rpc (advisor lints 0028 / 0029). They are only ever fired by
--    triggers; Postgres checks EXECUTE at CREATE TRIGGER time, not at fire time,
--    so revoking from the API roles does not affect the triggers:
--      auth.users            -> handle_new_user   (fired by supabase_auth_admin)
--      deals / negotiation_requests -> handle_updated_at (fired on user updates)
--    Owner (postgres) and service_role keep EXECUTE.
-- ---------------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.handle_new_user()   FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable()   FROM PUBLIC, anon, authenticated;
-- Explicit grant for the role that actually fires the signup trigger (belt and braces).
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;

-- ---------------------------------------------------------------------------
-- 4. Pin search_path on the two functions that lacked it (advisor lint 0011).
--    Both bodies already schema-qualify everything they touch.
-- ---------------------------------------------------------------------------
ALTER FUNCTION public.handle_new_user()   SET search_path = '';
ALTER FUNCTION public.handle_updated_at() SET search_path = '';
