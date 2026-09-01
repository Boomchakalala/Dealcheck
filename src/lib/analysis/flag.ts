/**
 * Single reversible switch for the new Step 1/2/3 deterministic analysis
 * pipeline (src/lib/analysis/). While false, src/lib/claude/index.ts's
 * analyzeDeal() is untouched and this pipeline is not called from any live
 * route — safe to build and test standalone before cutting over.
 *
 * 2026-08-28: pipeline built, not yet wired into any route. Flip only after
 * running it side-by-side against real quotes and comparing output to the
 * live analyzeDeal() path.
 */
export const ANALYSIS_PIPELINE_V3 = false
