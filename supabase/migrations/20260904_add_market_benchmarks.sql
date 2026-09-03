-- 20260904_add_market_benchmarks.sql
-- Market Benchmark V1: manually curated benchmark observations with provenance.
-- Additive only. Safe to re-run (IF NOT EXISTS / DROP POLICY IF EXISTS guards).
--
-- Access model: admin-only through the API (private.is_admin()); regular users
-- never read these tables directly. The benchmark engine runs server-side with
-- the service role and stores only aggregates + source names into
-- rounds.output_json.market_benchmark.

-- ---------------------------------------------------------------------------
-- benchmark_sources — where an observation came from (provenance).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.benchmark_sources (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  -- Where this class of evidence originates. Extend the CHECK when a new
  -- ingestion path lands (marketplace, licensed provider, ...).
  source_type  text NOT NULL CHECK (source_type IN (
                 'vendor_pricing_page', 'vendor_quote', 'termlift_negotiation',
                 'customer_submission', 'cloud_marketplace', 'licensed_data_provider',
                 'public_research', 'analyst_report', 'community', 'other')),
  url          text,
  source_date  date,
  -- How much we trust the source itself (the observation has its own level).
  verification_level text NOT NULL DEFAULT 'unverified'
                 CHECK (verification_level IN ('unverified', 'plausible', 'verified')),
  notes        text,
  is_test      boolean NOT NULL DEFAULT false,
  created_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- benchmark_products — curated product identities per vendor so observations
-- and quotes map to the same key (free-text product matching is fragile).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.benchmark_products (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_key     text NOT NULL,   -- normalizeVendorName() of the vendor
  vendor_name    text NOT NULL,   -- display
  product_key    text NOT NULL,   -- slug of the product name
  product_name   text NOT NULL,   -- display
  sku            text,
  category       text,            -- QuoteCategory slug (saas, usage_based_infra, ...)
  -- What one unit means for this product: per_seat_month, per_seat_year,
  -- per_host_month, per_gb_month, per_unit, flat_annual, flat_total, ...
  pricing_metric text NOT NULL DEFAULT 'flat_total',
  aliases        text[] NOT NULL DEFAULT '{}',
  is_test        boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (vendor_key, product_key)
);

-- ---------------------------------------------------------------------------
-- benchmark_observations — one observed price point.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.benchmark_observations (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id            uuid NOT NULL REFERENCES public.benchmark_sources(id) ON DELETE RESTRICT,
  product_id           uuid REFERENCES public.benchmark_products(id) ON DELETE SET NULL,

  -- Denormalised identity so an observation stays matchable if the product
  -- row is edited/removed, and so vendor-level (Level 4) matching is cheap.
  vendor_key           text NOT NULL,
  vendor_name          text NOT NULL,
  product_key          text,
  product_name         text,
  sku                  text,
  category             text,

  -- Pricing. Native values as observed; *_eur are converted at insert time
  -- with the FX rate recorded, so the comparison is reproducible.
  pricing_metric       text NOT NULL DEFAULT 'flat_total',
  quantity             numeric,
  currency             text NOT NULL,
  unit_price           numeric,
  annualized_price     numeric,
  total_contract_value numeric,
  unit_price_eur       numeric,
  annualized_price_eur numeric,
  total_contract_value_eur numeric,
  fx_rate_to_eur       numeric,          -- 1 unit of `currency` = fx_rate_to_eur EUR at fx_rate_date
  fx_rate_date         date,

  term_months          integer,
  deal_type            text CHECK (deal_type IS NULL OR deal_type IN ('new', 'renewal', 'expansion', 'unknown')),
  region               text,             -- free text / ISO region, e.g. 'EU', 'US', 'FR'
  company_size_band    text CHECK (company_size_band IS NULL OR company_size_band IN ('smb', 'mid_market', 'enterprise', 'unknown')),

  -- Where in the negotiation this price sits. Weighted by the engine.
  price_type           text NOT NULL CHECK (price_type IN (
                         'public_list_price', 'initial_customer_quote', 'negotiated_offer',
                         'executed_contract', 'third_party_aggregate')),
  initial_quote        numeric,          -- when the observation is a negotiated/executed price, the opening quote if known
  final_price          numeric,
  discount_from_list   numeric,          -- percent, 0-100

  observation_date     date NOT NULL,
  verification_level   text NOT NULL DEFAULT 'unverified'
                         CHECK (verification_level IN ('unverified', 'plausible', 'verified')),
  confidence           integer NOT NULL DEFAULT 50 CHECK (confidence BETWEEN 0 AND 100),
  notes                text,
  is_test              boolean NOT NULL DEFAULT false,
  created_by           uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS benchmark_observations_vendor_idx
  ON public.benchmark_observations (vendor_key, product_key, observation_date DESC);
CREATE INDEX IF NOT EXISTS benchmark_observations_category_idx
  ON public.benchmark_observations (category, observation_date DESC);
CREATE INDEX IF NOT EXISTS benchmark_products_vendor_idx
  ON public.benchmark_products (vendor_key);

-- updated_at maintenance (reuses the existing trigger function).
DROP TRIGGER IF EXISTS on_benchmark_source_updated ON public.benchmark_sources;
CREATE TRIGGER on_benchmark_source_updated BEFORE UPDATE ON public.benchmark_sources
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS on_benchmark_product_updated ON public.benchmark_products;
CREATE TRIGGER on_benchmark_product_updated BEFORE UPDATE ON public.benchmark_products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS on_benchmark_observation_updated ON public.benchmark_observations;
CREATE TRIGGER on_benchmark_observation_updated BEFORE UPDATE ON public.benchmark_observations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: admin-only for every operation. No anon access, no per-user access.
-- Service role bypasses RLS (engine + admin API writes go through the session
-- client, which is the admin's own session).
-- ---------------------------------------------------------------------------
ALTER TABLE public.benchmark_sources      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmark_products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmark_observations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage benchmark sources" ON public.benchmark_sources;
CREATE POLICY "Admins manage benchmark sources" ON public.benchmark_sources
  FOR ALL TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));

DROP POLICY IF EXISTS "Admins manage benchmark products" ON public.benchmark_products;
CREATE POLICY "Admins manage benchmark products" ON public.benchmark_products
  FOR ALL TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));

DROP POLICY IF EXISTS "Admins manage benchmark observations" ON public.benchmark_observations;
CREATE POLICY "Admins manage benchmark observations" ON public.benchmark_observations
  FOR ALL TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));
