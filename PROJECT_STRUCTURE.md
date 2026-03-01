# DealCheck V1 - Project Structure

```
dealcheck/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deal/
│   │   │   │   ├── create/
│   │   │   │   │   └── route.ts          # POST - Create deal + Round 1
│   │   │   │   └── [dealId]/
│   │   │   │       └── round/
│   │   │   │           └── route.ts      # POST - Add round N+1
│   │   │   ├── deals/
│   │   │   │   └── route.ts              # GET - List user's deals
│   │   │   ├── round/
│   │   │   │   └── [roundId]/
│   │   │   │       └── route.ts          # GET - Get round details
│   │   │   └── upload/
│   │   │       └── route.ts              # POST - Handle file upload
│   │   ├── app/
│   │   │   ├── layout.tsx                # Auth layout
│   │   │   ├── page.tsx                  # Dashboard - My Deals
│   │   │   ├── new/
│   │   │   │   └── page.tsx              # Create new deal
│   │   │   ├── deal/
│   │   │   │   └── [dealId]/
│   │   │   │       └── page.tsx          # Deal page with rounds
│   │   │   └── round/
│   │   │       └── [roundId]/
│   │   │           └── page.tsx          # Round results view
│   │   ├── login/
│   │   │   └── page.tsx                  # Login/signup page
│   │   ├── privacy/
│   │   │   └── page.tsx                  # Privacy policy
│   │   ├── terms/
│   │   │   └── page.tsx                  # Terms of service
│   │   ├── layout.tsx                    # Root layout
│   │   └── page.tsx                      # Landing/redirect
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── badge.tsx
│   │   ├── DealCard.tsx                  # Deal list item
│   │   ├── RoundCard.tsx                 # Round list item
│   │   ├── OutputDisplay.tsx             # Structured output renderer
│   │   ├── CopyButton.tsx                # Copy to clipboard
│   │   ├── FileUpload.tsx                # File upload component
│   │   └── AuthGuard.tsx                 # Client-side auth check
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                 # Browser client
│   │   │   ├── server.ts                 # Server client
│   │   │   └── middleware.ts             # Auth middleware
│   │   ├── openai.ts                     # OpenAI client
│   │   ├── extract.ts                    # Text extraction (PDF/OCR)
│   │   ├── schemas.ts                    # Zod schemas
│   │   └── utils.ts                      # Utilities
│   └── types/
│       └── index.ts                      # TypeScript types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql        # Database schema + RLS
├── public/
├── .env.local.example
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Key Files by Feature

### Authentication
- `/src/lib/supabase/*` - Supabase client setup
- `/src/app/login/page.tsx` - Login page
- `/src/components/AuthGuard.tsx` - Route protection

### Deal Management
- `/src/app/api/deal/create/route.ts` - Create deal + Round 1
- `/src/app/api/deal/[dealId]/round/route.ts` - Add rounds
- `/src/app/app/new/page.tsx` - New deal form
- `/src/app/app/deal/[dealId]/page.tsx` - Deal view

### File Processing
- `/src/lib/extract.ts` - PDF/Image text extraction
- `/src/app/api/upload/route.ts` - File upload handler

### AI Integration
- `/src/lib/openai.ts` - OpenAI API calls
- `/src/lib/schemas.ts` - Output validation

### UI Components
- `/src/components/OutputDisplay.tsx` - Main results display
- `/src/components/CopyButton.tsx` - Copy functionality
