-- Vendor counter-offer per negotiation round (2026-09-09). Additive, safe to re-run.
--
-- rounds.vendor_offer: the supplier's current total commercial offer on a
-- Round 2+ reply, as structured data with provenance (lib/vendor-offer.ts):
--   { version, amount, currency, provenance: inferred | user_confirmed | document_verified,
--     extracted: { amount, currency, raw }, checks: {...}, ceiling, source, confirmed_at, notes }
-- Round 1 and every historical round stay NULL: nothing is invented from prose.
-- A dedicated column (not output_json / extracted_data) because both of those
-- are rewritten by later steps and this value must survive them and be queryable.

alter table public.rounds
  add column if not exists vendor_offer jsonb;

comment on column public.rounds.vendor_offer is 'Supplier''s current total offer on this round with provenance (lib/vendor-offer.ts). NULL on Round 1 and on rounds recorded before 2026-09-09.';

create index if not exists rounds_vendor_offer_provenance_idx
  on public.rounds ((vendor_offer->>'provenance'))
  where vendor_offer is not null;
