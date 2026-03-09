# DealCheck → TermLift Rebrand Plan

## Scope Assessment

**Total Changes:**
- 91 code occurrences of "DealCheck"/"dealcheck"
- 28 files affected
- 21 domain references (dealcheck.app → termlift.app)

**Messiness Level:** 🟢 **Low-Medium** (Clean, systematic rebrand - 30-45 min)

---

## Phase 1: Codebase Updates (Automated - 5 minutes)

### 1.1 Text Replacements
Run these find-and-replace commands:

```bash
# In source files
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i 's/DealCheck/TermLift/g' {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i 's/dealcheck/termlift/g' {} +

# In documentation files
find . -maxdepth 1 -name "*.md" -exec sed -i 's/DealCheck/TermLift/g' {} +
find . -maxdepth 1 -name "*.md" -exec sed -i 's/dealcheck/termlift/g' {} +
```

### 1.2 Domain Replacements
```bash
# Replace all email domains
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.md" \) ! -path "*/node_modules/*" ! -path "*/.next/*" -exec sed -i 's/dealcheck\.app/termlift.app/g' {} +
```

### 1.3 Package Name (Optional)
Update `package.json`:
```json
{
  "name": "termlift",
  "version": "0.1.0"
}
```

---

## Phase 2: External Services (Manual - 15 minutes)

### 2.1 GitHub Repo Rename
1. Go to https://github.com/Boomchakalaka/Dealcheck
2. **Settings** → **General**
3. Scroll to "Repository name"
4. Change to: `TermLift`
5. Click **Rename**

**Impact:** All git remotes will auto-redirect (GitHub handles this)

---

### 2.2 Vercel Project Rename
1. Go to https://vercel.com/dashboard
2. Find your DealCheck project
3. **Settings** → **General**
4. Change project name to: `termlift`
5. **Save**

**New deployment URL:** `termlift.vercel.app` (old URLs will redirect)

---

### 2.3 Domain Setup (If you have termlift.app)

**Current domain:** dealcheck.app (mentioned in code, may not be registered)
**New domain:** termlift.app

#### If you own/will buy termlift.app:
1. Register termlift.app at Namecheap/Cloudflare
2. In Vercel: **Settings** → **Domains**
3. Add `termlift.app` and `www.termlift.app`
4. Update DNS as instructed by Vercel
5. Remove old dealcheck.app domain (if it exists)

#### If you DON'T have a domain yet:
- Just use the Vercel URL for now: `termlift.vercel.app`
- Code will reference termlift.app for emails (update later when you buy it)

---

### 2.4 Email Setup
If you have email forwarding set up for dealcheck.app:
- Set up the same for termlift.app:
  - hello@termlift.app
  - support@termlift.app
  - legal@termlift.app
  - privacy@termlift.app
  - security@termlift.app

---

## Phase 3: Environment Variables (Verify - 2 minutes)

Check these are still correct (no changes needed):
- `NEXT_PUBLIC_SUPABASE_URL` ✓ (unchanged)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓ (unchanged)
- `SUPABASE_SERVICE_ROLE_KEY` ✓ (unchanged)
- `OPENAI_API_KEY` ✓ (unchanged)

Only update if you change the domain:
- `NEXT_PUBLIC_APP_URL` → https://termlift.app (or termlift.vercel.app)

---

## Phase 4: Supabase Updates (If using custom domain - 2 minutes)

1. Go to Supabase Dashboard
2. **Authentication** → **URL Configuration**
3. Update **Site URL** to new domain
4. Update **Redirect URLs** to match new domain pattern

---

## Phase 5: Final Checks (5 minutes)

- [ ] Test build: `npm run build`
- [ ] Test dev server: `npm run dev`
- [ ] Visit homepage - verify branding
- [ ] Check footer copyright: "© 2026 TermLift"
- [ ] Check header logo: "TermLift"
- [ ] Test trial analysis flow
- [ ] Check email templates reference TermLift
- [ ] Verify Terms/Privacy pages say TermLift

---

## Quick Execution Script

Run this single command to do Phase 1 automatically:

```bash
# Backup first (optional but recommended)
git stash

# Run all replacements
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i 's/DealCheck/TermLift/g' {} + && \
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i 's/dealcheck/termlift/g' {} + && \
find . -maxdepth 1 -name "*.md" -exec sed -i 's/DealCheck/TermLift/g' {} + && \
find . -maxdepth 1 -name "*.md" -exec sed -i 's/dealcheck/termlift/g' {} + && \
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.md" \) ! -path "*/node_modules/*" ! -path "*/.next/*" -exec sed -i 's/dealcheck\.app/termlift.app/g' {} + && \
echo "✅ Rebrand complete! Review changes with: git diff"

# Commit changes
git add -A
git commit -m "Rebrand from DealCheck to TermLift"
git push origin main
```

---

## Risk Assessment

### Low Risk (Safe to change):
- ✅ UI text and branding
- ✅ Documentation files
- ✅ Email addresses (if you control the domain)
- ✅ GitHub repo name (auto-redirects)
- ✅ Vercel project name (auto-redirects)

### Medium Risk (Test thoroughly):
- ⚠️ localStorage keys (dealcheck_trial_count → termlift_trial_count)
  - **Impact:** Users will lose trial count (could be a feature - resets everyone's trial)
- ⚠️ AI prompts mentioning "DealCheck"
  - **Impact:** Minimal - AI still generates good output

### Zero Risk (No changes needed):
- ✅ Database schema (vendor/deal/round tables stay the same)
- ✅ Supabase project (no rebrand needed)
- ✅ OpenAI integration (doesn't care about branding)

---

## Timeline

1. **Phase 1 (Codebase):** 5 min - Run script
2. **Phase 2 (External):** 15 min - Manual clicks
3. **Phase 3 (Env vars):** 2 min - Quick check
4. **Phase 4 (Supabase):** 2 min - Update URLs
5. **Phase 5 (Testing):** 5 min - Verify everything

**Total: ~30 minutes** (45 if setting up new domain)

---

## Should You Do This Now?

**Yes, if:**
- ✅ You're serious about the TermLift name
- ✅ You can register termlift.app domain
- ✅ No active users who will be confused
- ✅ You're okay with resetting trial counts

**Wait, if:**
- ⏸️ Still deciding on the name
- ⏸️ Can't get termlift.app domain
- ⏸️ Have active paid users (announce the rebrand first)

---

## Ready to Execute?

Just say **"yes rebrand now"** and I'll run Phase 1 automatically.

Then I'll give you the exact steps for Phase 2 (GitHub + Vercel).
