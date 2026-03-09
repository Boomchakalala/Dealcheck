# Quick Start Guide - TermLift V1

## Prerequisites Checklist

- [ ] Node.js 18+ or Bun installed
- [ ] Supabase account created
- [ ] OpenAI API key obtained

## 5-Minute Setup

### Step 1: Supabase Setup (2 minutes)

1. Go to https://supabase.com and create a new project
2. Wait for project to provision (~60 seconds)
3. Go to **Project Settings → API**
4. Copy these values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (click "Reveal" first)

### Step 2: Database Migration (1 minute)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy ALL contents from `supabase/migrations/001_initial_schema.sql`
4. Paste into SQL Editor
5. Click **Run** (bottom right)
6. Verify success (should see green checkmark)

### Step 3: Environment Variables (1 minute)

1. Create `.env.local` in project root:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OPENAI_API_KEY=sk-your-openai-key
   ```

### Step 4: Install & Run (1 minute)

```bash
bun install
bun dev
```

Open http://localhost:3000

## First Usage Test

### Create Account
1. Go to http://localhost:3000
2. Click "Sign up"
3. Enter email: `test@example.com`
4. Enter password: `password123`
5. Check email for confirmation link
6. Click confirmation link

### Create First Deal
1. Click "New Deal"
2. Paste this sample text:
   ```
   Quote for Cloud Services
   Annual License: $50,000
   Term: 36 months
   Auto-renewal with 90-day notice
   Payment: Net 30
   ```
3. Select "New" deal type
4. Click "Generate Round 1"
5. Wait ~5-10 seconds
6. View structured analysis with email drafts

### Test Copy Functionality
1. Click "Copy" on any email draft
2. Paste into text editor
3. Verify complete email copied

### Add Second Round
1. Go back to deal page
2. Click "Add New Round"
3. Paste new quote:
   ```
   Revised Quote
   Annual License: $45,000 (10% discount applied)
   Term: 24 months
   Payment: Net 60
   ```
4. Add note: "Supplier came back with counter-offer"
5. Click "Generate Round"
6. View updated analysis with context from Round 1

## Troubleshooting

### "Unauthorized" Error
- Check `.env.local` has correct Supabase keys
- Verify you're logged in
- Check browser console for errors

### SQL Migration Fails
- Ensure you copied entire SQL file (scroll to bottom)
- Check for any syntax errors
- Try running in sections if needed

### "Failed to extract text"
- For testing, use paste text instead of upload
- Check OpenAI API key is valid
- Verify OpenAI account has credits

### Email Confirmation Not Received
- Check spam folder
- In Supabase, go to **Authentication → Email Templates**
- For testing, you can disable email confirmation:
  - Go to **Authentication → Settings**
  - Disable "Enable email confirmations"

### Usage Limit Hit
- Each user gets 2 free rounds
- Create new account to test more
- Or manually update `profiles.usage_count` in Supabase:
  ```sql
  UPDATE profiles SET usage_count = 0 WHERE email = 'test@example.com';
  ```

## Testing Checklist

- [ ] Sign up flow works
- [ ] Email confirmation received (or disabled for testing)
- [ ] Login works
- [ ] Dashboard shows "My Deals"
- [ ] "New Deal" button navigates to form
- [ ] File upload extracts text (PDF or image)
- [ ] Paste text works
- [ ] Generate Round 1 creates deal
- [ ] Analysis displays with all sections
- [ ] Copy buttons work
- [ ] Can navigate to deal page
- [ ] Can add Round 2 with note
- [ ] Round 2 uses context from Round 1
- [ ] Usage count increments
- [ ] After 2 rounds, see limit message
- [ ] Privacy and Terms pages load

## Sample Test Data

### Quote 1 (SaaS)
```
Enterprise SaaS Quote
Platform License: $100,000/year
Implementation: $25,000 one-time
Support: Premium 24/7 included
Term: 3 years
Auto-renewal unless canceled 6 months prior
Payment: 100% upfront or quarterly Net 30
Liability cap: 1x annual fees
```

### Quote 2 (Hardware)
```
Hardware Purchase Order
Servers: 10x Dell R640 @ $8,500 each = $85,000
Networking: Cisco switches $15,000
Shipping: $2,500
Total: $102,500
Payment: 50% deposit, 50% on delivery
Lead time: 8-12 weeks
Warranty: Standard 1 year, extended available
```

### Quote 3 (Consulting)
```
Professional Services Agreement
Rate: $250/hour
Estimated hours: 200-300
Total estimate: $50,000-$75,000
Term: 6 months
Weekly invoicing
Net 15 payment terms
Work product ownership: Client retains all IP
```

## Next Steps

1. Test with real procurement documents
2. Invite team members to test
3. Gather feedback on analysis quality
4. Review email draft tone and accuracy
5. Check error handling with malformed inputs
6. Test file upload limits (10MB max)

## Support

For issues:
1. Check browser console for errors
2. Check Supabase logs in Dashboard
3. Verify environment variables
4. Review `IMPLEMENTATION_SUMMARY.md` for architecture
5. Check README for detailed documentation

## Production Deployment

When ready to deploy:
1. Push code to GitHub
2. Create Vercel/Netlify project
3. Add same environment variables
4. Deploy
5. Update `NEXT_PUBLIC_APP_URL` to production URL
6. Configure Supabase email SMTP for production
7. Review Terms/Privacy with legal team
8. Set up monitoring and error tracking

---

**You're ready to go! Happy testing! 🚀**
