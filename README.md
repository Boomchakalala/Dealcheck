# DealCheck V1

**Clarity before commitment** — A procurement quote/contract negotiation copilot for non-procurement professionals.

## Product Overview

DealCheck helps founders, ops managers, and first-time buyers analyze supplier emails, quotes, and commercial proposals. It provides structured guidance with:

- 💡 **Deal Reality Check** - High-level assessment
- 🚩 **Red Flags** - Commercial, legal, and operational risks
- 🎯 **What to Ask For** - Must-have and nice-to-have negotiation points
- ✉️ **Email Drafts** - Ready-to-send responses (neutral, firm, final push)
- 📊 **Round History** - Track negotiations over time

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (Auth + Postgres)
- **AI:** OpenAI API (GPT-4o)
- **File Processing:** pdf-parse, Tesseract.js (OCR)

## Features

### V1 Scope

- ✅ Supabase authentication
- ✅ Deal → Rounds model (versioned analyses, NOT chat)
- ✅ File uploads (PDF + images/screenshots)
- ✅ Transient file processing (no raw files retained)
- ✅ Strict JSON output validation with Zod
- ✅ Copy-ready email drafts
- ✅ Usage limits (2 free rounds)
- ✅ Round history with context from previous rounds

### Data Retention Policy

- **Uploaded files:** Deleted immediately after text extraction
- **Extracted text:** NOT saved by default (user can opt-in)
- **Stored data:** Only AI output (JSON + markdown) and metadata
- **Privacy-first:** Minimal data retention

## Setup Instructions

### Prerequisites

- Node.js 18+ or Bun
- Supabase account
- OpenAI API key

### 1. Clone and Install

```bash
git clone <your-repo>
cd dealcheck
bun install
```

### 2. Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and anon key from Project Settings → API
3. Run the database migration:
   - Go to SQL Editor in Supabase Dashboard
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run"

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create Your First Account

1. Go to `/login`
2. Click "Sign up"
3. Enter email and password (min 6 characters)
4. Check your email for confirmation link
5. Click confirmation link to activate account

## Usage

### Creating a Deal

1. Click "New Deal" from dashboard
2. Upload a quote/contract (PDF or screenshot) OR paste text
3. Fill in optional fields:
   - Vendor (auto-detected if blank)
   - Deal type (New/Renewal)
   - Goal (reduce price, add value, improve terms)
   - Notes
4. Click "Generate Round 1"
5. View structured analysis with copy buttons

### Adding Rounds

1. Open a deal
2. Click "Add New Round"
3. Upload counter-offer or new quote
4. Add optional note describing what changed
5. Click "Generate Round"
6. AI uses previous round context for updated analysis

### Output Structure

Each round provides:

- **Quote Overview:** Products, pricing, term, key terms
- **Red Flags:** Commercial/Legal/Operational risks with mitigation
- **Asks:** Must-have and nice-to-have negotiation points
- **Email Drafts:** 3 tones (neutral, firm, final push)
- **Assumptions:** What the AI assumed during analysis
- **Disclaimer:** Legal and data usage disclaimers

## Database Schema

### Tables

- **profiles** - User data and usage tracking
- **deals** - Deal metadata (vendor, title, type, goal)
- **rounds** - Versioned analyses with AI output

### Row Level Security

All tables have RLS policies ensuring users can only access their own data.

## API Routes

- `POST /api/deal/create` - Create deal + Round 1
- `POST /api/deal/[dealId]/round` - Add round N+1
- `GET /api/deals` - List user's deals
- `GET /api/round/[roundId]` - Get round details
- `POST /api/upload` - Process file and extract text

## File Upload Support

- **PDF** (.pdf) - Contracts, proposals, quotes
- **Images** (.png, .jpg, .jpeg, .webp) - Screenshots via OCR
- **Max size:** 10MB
- **Processing:** Text extracted immediately, file NOT stored

## Compliance & Disclaimers

### What DealCheck Does NOT Do

- ❌ Provide legal advice
- ❌ Access proprietary pricing benchmarks
- ❌ Guarantee pricing accuracy
- ❌ Make business decisions for you

### Tone Guidelines (Built-in)

- Uses cautious language ("appears above typical tiers" vs "you're overpaying")
- No aggressive negotiation tactics
- Professional, procurement-focused
- Emphasizes user responsibility

## Environment Configuration

### Required Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only)
- `OPENAI_API_KEY` - OpenAI API key (server-side only)

### Optional Variables

- `NEXT_PUBLIC_APP_URL` - Base URL (default: http://localhost:3000)

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Deploy to Other Platforms

Compatible with any Next.js hosting platform (Netlify, Railway, etc.)

## Development

### Project Structure

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed file organization.

### Key Files

- `/src/lib/openai.ts` - AI analysis logic
- `/src/lib/extract.ts` - File processing
- `/src/lib/schemas.ts` - Zod validation
- `/src/app/api/*` - API routes
- `/src/components/OutputDisplay.tsx` - Results renderer

## Usage Limits

### Free Plan

- 2 analysis rounds total
- After limit, user sees paywall message
- No Stripe integration in V1 (manual upgrade path)

### Tracking

- `profiles.usage_count` incremented on successful generation
- Checked before API calls
- Prevents abuse while keeping V1 simple

## Security

- ✅ All API routes require authentication
- ✅ RLS policies on all database tables
- ✅ OpenAI key server-side only
- ✅ No raw file retention
- ✅ Optional text storage (user consent)
- ✅ Input validation with Zod

## Troubleshooting

### "Unauthorized" Error

- Check Supabase credentials in `.env.local`
- Verify user is logged in
- Check RLS policies are applied

### "Failed to extract text"

- Ensure file is PDF or image format
- Check file size < 10MB
- For PDFs with no text, use screenshot instead
- For poor OCR results, paste text manually

### "Free usage limit reached"

- User has used 2 free rounds
- Currently no paid upgrade (V1)
- Manual upgrade path TBD

## License

MIT

## Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ for procurement professionals**
