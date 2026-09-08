-- Privacy / retention integrity pass (2026-09-08). Additive only, safe to re-run.
--
-- rounds.extracted_text_purged_at
--   Set when the raw quote text was removed on purpose (after Deep Analysis,
--   at close, or by the retention job). Lets the UI tell "never had text"
--   from "text removed under the retention policy".
--
-- negotiation_requests.document_delete_at / document_deleted_at
--   Every stored negotiation document carries a deletion deadline from the
--   moment it is uploaded: earliest(closed_at + 30 days, uploaded_at + 12
--   months). The retention job removes the object once the deadline passes
--   and records when it did. document_path is nulled at that point (it
--   carries the original filename).
--
-- deals.verification / negotiation_requests.verification
--   Structured evidence behind a document_verified outcome, so the tier
--   survives deletion of the source document: tier, method, timestamps, the
--   document type and SHA-256 fingerprint, the total the model read from it.
--   Never document content.

alter table public.rounds
  add column if not exists extracted_text_purged_at timestamptz;

alter table public.negotiation_requests
  add column if not exists document_delete_at timestamptz,
  add column if not exists document_deleted_at timestamptz,
  add column if not exists verification jsonb;

alter table public.deals
  add column if not exists verification jsonb;

comment on column public.rounds.extracted_text_purged_at is 'When the raw quote text was removed under the retention policy (Deep Analysis done, deal closed, or max age). NULL = not purged (may never have had text).';
comment on column public.negotiation_requests.document_delete_at is 'Deadline for removing the stored document: earliest(closed_at + 30d, uploaded + 365d). Set at upload, tightened at close.';
comment on column public.negotiation_requests.document_deleted_at is 'When the retention job removed the document from storage.';
comment on column public.deals.verification is 'Structured provenance for final_total: tier, method, verified_at, document type + sha256 fingerprint, extracted total. No document content.';
comment on column public.negotiation_requests.verification is 'Same shape as deals.verification, for outcomes recorded by an admin.';

-- Backfill the deadline for documents uploaded before this migration so the
-- retention job has a date to act on. Uses the consent timestamp as upload
-- time (they are set together) and the close date where the case is closed.
update public.negotiation_requests
set document_delete_at = least(
  coalesce(document_consent_at, created_at) + interval '365 days',
  coalesce(closed_at + interval '30 days', coalesce(document_consent_at, created_at) + interval '365 days')
)
where document_path is not null and document_delete_at is null;

create index if not exists negotiation_requests_document_delete_at_idx
  on public.negotiation_requests (document_delete_at)
  where document_path is not null;
