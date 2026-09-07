-- Outcome provenance for closed deals (2026-09-08).
--
-- initial_total: the quoted total the savings arithmetic ran against, frozen at
--   close so savings_amount / savings_percent are reproducible.
-- final_total_provenance: how final_total was established. Anything that was
--   not explicitly confirmed by a person is 'inferred' and can never become a
--   verified benchmark observation. Rows closed before this migration are NULL,
--   which every reader treats as 'inferred'.
alter table public.deals
  add column if not exists initial_total numeric,
  add column if not exists final_total_provenance text
    check (final_total_provenance in ('inferred', 'user_confirmed', 'document_verified'));

comment on column public.deals.initial_total is 'Quoted total (deal currency) used to derive savings at close. Frozen at close time.';
comment on column public.deals.final_total_provenance is 'inferred = AI/estimated, never confirmed · user_confirmed = user entered/confirmed the final total · document_verified = supported by a final/signed document or admin documentary confirmation';
