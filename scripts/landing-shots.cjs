/* eslint-disable @typescript-eslint/no-require-imports */
// Product screenshots for the landing page, taken from the public demo pages (no login).
const { chromium } = require('playwright')
const path = require('path')
const out = (n) => path.join('C:/Users/kevin/TermLift/public/landing', n)

;(async () => {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  const go = async (url) => {
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    // Strip chrome that has no business in a product picture: cookie banner, demo banner, sticky demo CTA.
    await page.evaluate(() => {
      const kill = (txt) => { for (const el of document.querySelectorAll('div, section, aside')) { if (el.children.length < 8 && el.innerText && el.innerText.includes(txt) && el.innerText.length < 400) { el.remove(); break } } }
      kill('We use cookies'); kill("You're exploring TermLift"); kill('Sign up to use it with your own quotes')
      // The public marketing header is sticky and would overlap any element captured near the top.
      document.querySelectorAll('header').forEach((h) => h.remove())
      for (const el of document.querySelectorAll('body *')) {
        const pos = getComputedStyle(el).position
        if ((pos === 'sticky' || pos === 'fixed') && el.getBoundingClientRect().top < 80) el.remove()
      }
    })
    await page.waitForTimeout(300)
  }
  const shot = async (selector, file, pad = 0, maxH = Infinity) => {
    const el = page.locator(selector).first()
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    const box = await el.boundingBox()
    const h = Math.min(box.height, maxH)
    await page.screenshot({ path: out(file), clip: { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.width + pad * 2, height: h + pad * 2 } })
    console.log('saved', file, Math.round(box.width + pad * 2), 'x', Math.round(h + pad * 2))
  }

  // Home (deals list) — used in "who it's for"
  await go('http://localhost:3000/demo')
  await shot('main', 'who-home-v3.png', 0, 660)

  // Deal page sections
  await go('http://localhost:3000/demo/deal/demo-atlassian')
  await shot('#playbook', 'tour-playbook-v3.png', 0)
  await shot('#email-section', 'tour-email-v3.png', 8)

  // Hand-off: the public request page's form
  await go('http://localhost:3000/negotiate')
  await shot('form', 'tour-negotiate-v3.png', 8, 700)

  await browser.close()
})().catch((e) => { console.error('FAILED', e.message); process.exit(1) })
