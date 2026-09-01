# TermLift

Procurement quote/contract negotiation copilot. See README.md for full product overview.

## Environment

Local development on Windows (not a cloud sandbox). Project lives at `C:\Users\kevin\TermLift`.

## Tech stack

- Next.js 16 (App Router) + TypeScript, React 19
- Tailwind CSS v4
- Supabase (Auth + Postgres, via `@supabase/ssr`)
- OpenAI API (GPT-4o) for analysis; `@anthropic-ai/sdk` also present
- Stripe for billing, PostHog for analytics
- File processing: pdf-parse, pdfjs-dist, mammoth, tesseract.js (OCR)
- Tests: Vitest

## Running the app

```bash
npm run dev     # starts Next.js dev server via dev.sh (unsets stale OPENAI_API_KEY, runs `next dev`)
npm run build
npm run lint
npm test         # vitest run
```

Dev server runs on `http://localhost:3000` by default — no sandbox port-forwarding involved.

## Environment variables

Configured in `.env.local` (see README.md for the full list): Supabase URL/anon/service-role keys, OpenAI key, Stripe keys, PostHog key. Never commit this file or print its values.

## Tooling installed

- Supabase Claude Code plugin (`supabase@claude-plugins-official`) — not yet connected; requires Supabase CLI login/access token separate from the app's runtime keys.
- Playwright MCP server, scoped to this project.

## Key files

- `/src/lib/openai.ts` — AI analysis logic
- `/src/lib/extract.ts` — file processing
- `/src/lib/schemas.ts` — Zod validation
- `/src/app/api/*` — API routes
- `/src/components/OutputDisplay.tsx` — results renderer
