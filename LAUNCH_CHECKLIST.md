# Launch Checklist ✅

## Pre-Launch (Now)
- [x] Add PostHog environment variables to Vercel
- [x] Trial rate limiting added (5/day per IP)
- [x] Test signup/login flow on production
- [x] Test trial flow on production
- [x] Verify PostHog events flowing

## Week 1 Monitoring
- [ ] Check OpenAI costs daily (set alert at $50/day)
- [ ] Monitor PostHog for errors/drops
- [ ] Check Supabase usage
- [ ] Monitor trial → signup conversion rate

## Optional Improvements (Later)
- [ ] Add Sentry for error tracking
- [ ] Set up OpenAI usage alerts
- [ ] Add honeypot for bot detection
- [ ] Email verification required (currently optional)
- [ ] Add CAPTCHA to trial (if abuse detected)

## Cost Estimates (First 100 Users)
- **Vercel**: Free tier (fine for launch)
- **Supabase**: Free tier (25k MAU, 500MB database)
- **OpenAI**: ~$0.50-1.00 per analysis
  - 100 users × 3 analyses = 300 analyses = ~$150-300/mo
- **PostHog**: Free (1M events/month)

**Total estimated first month: $150-300**

## Emergency Contacts
- OpenAI: Add billing alert at $200
- Supabase: Monitor disk usage
- Vercel: Check bandwidth

## Launch URL
- Production: https://your-app.vercel.app
- PostHog: https://app.posthog.com
- Supabase: https://app.supabase.com
