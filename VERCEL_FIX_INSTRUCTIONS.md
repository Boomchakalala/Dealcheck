# Fix TermLift Production - Analysis Not Working

## Problem
Analysis is failing in production even though Vercel environment variables are set correctly. This is likely caused by:
1. Vercel build cache using old environment variables
2. Environment variables not properly propagated to the deployment

## Solution: Force Fresh Deployment

### Step 1: Verify Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your TermLift project
3. Go to **Settings** → **Environment Variables**
4. Verify `OPENAI_API_KEY` is set to your **NEW** API key
5. Make sure it's enabled for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

**IMPORTANT:** If the old key is still there, DELETE it first, then add the new one.

### Step 2: Clear Build Cache and Redeploy

Option A: **Via Vercel Dashboard** (Recommended)

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **⋯** (three dots menu)
4. Select **Redeploy**
5. **IMPORTANT:** Check the box "Use existing Build Cache" and **UNCHECK IT** (force fresh build)
6. Click **Redeploy**
7. Wait 2-3 minutes for deployment to complete

Option B: **Via Git Push**

1. Make a small change (or empty commit):
   ```bash
   git commit --allow-empty -m "Force Vercel redeploy with new API key"
   git push origin main
   ```
2. This will trigger a new deployment automatically
3. Wait 2-3 minutes

### Step 3: Test Production

1. Open your production URL
2. Create a new test deal
3. Upload a sample quote/PDF
4. Click "Run Analysis"
5. Verify the analysis completes successfully

### Step 4: Check Deployment Logs (If Still Failing)

1. Go to Vercel Dashboard → **Deployments**
2. Click on the latest deployment
3. Go to **Functions** or **Runtime Logs** tab
4. Look for errors related to:
   - `OPENAI_API_KEY`
   - `Incorrect API key`
   - `Authentication failed`
   - `401 Unauthorized`

## Common Issues

### Issue 1: "Incorrect API key" in logs
- Your new API key might not be saved in Vercel
- Double-check: Settings → Environment Variables → OPENAI_API_KEY
- Make sure you clicked **Save** after entering the new key
- Try deleting and re-adding the variable

### Issue 2: Still using old API key
- Vercel cached the old environment variable
- Solution: Force redeploy WITHOUT build cache (see Step 2, Option A)

### Issue 3: API key works locally but not in production
- Environment variable might only be set for Development/Preview
- Make sure **Production** checkbox is enabled for OPENAI_API_KEY

### Issue 4: Deployment succeeds but analysis still fails
- Check if your new OpenAI API key has credits/quota
- Test the key locally:
  ```bash
  curl -s https://api.openai.com/v1/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_NEW_API_KEY" \
    -d '{"model": "gpt-4o", "messages": [{"role": "user", "content": "Test"}], "max_tokens": 10}'
  ```
- If you get an error, the API key itself might be invalid

## Security Notes

✅ **FIXED:** Hardcoded API keys removed from documentation files in latest commit
✅ **SAFE:** Repository no longer contains exposed credentials
✅ **ACTION NEEDED:** You should rotate the exposed Supabase and OpenAI keys

### Recommended: Rotate Exposed Keys

Since the old keys were committed to git history, you should:

1. **OpenAI API Key:**
   - Go to https://platform.openai.com/api-keys
   - Delete the old key
   - Create a new key
   - Update it in Vercel

2. **Supabase Keys:**
   - The exposed anon key is public-facing, so it's less critical
   - The service role key should be rotated:
     - Go to Supabase Dashboard → Settings → API
     - Click "Rotate" on Service Role Key
     - Update `SUPABASE_SERVICE_ROLE_KEY` in Vercel

## Quick Checklist

- [ ] Verified new OPENAI_API_KEY is set in Vercel
- [ ] Enabled for Production environment
- [ ] Forced fresh deployment (no build cache)
- [ ] Waited 2-3 minutes for deployment
- [ ] Tested analysis on production URL
- [ ] Checked runtime logs if still failing

## Still Not Working?

If analysis still fails after following all steps:

1. Share the Vercel runtime logs (Functions tab)
2. Share any browser console errors (F12 → Console)
3. Confirm your production URL
4. Test if the API key works with the curl command above

---

Last updated: 2026-03-10
