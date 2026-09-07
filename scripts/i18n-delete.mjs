// Deletes dotted keys from messages/<locale>.json. Companion to i18n-merge.mjs.
// Usage: node scripts/i18n-delete.mjs en termsPage.s5StarterTitle privacyPage.s4Stripe …
import fs from 'node:fs'

const [locale, ...keys] = process.argv.slice(2)
if (!locale || keys.length === 0) {
  console.error('usage: node scripts/i18n-delete.mjs <en|fr> <dotted.key> [more.keys…]')
  process.exit(1)
}
const target = `messages/${locale}.json`
const base = JSON.parse(fs.readFileSync(target, 'utf8'))

let removed = 0, missing = 0
for (const key of keys) {
  const parts = key.split('.')
  let node = base
  for (const p of parts.slice(0, -1)) {
    node = node && typeof node === 'object' ? node[p] : undefined
  }
  const last = parts[parts.length - 1]
  if (node && typeof node === 'object' && last in node) { delete node[last]; removed++ } else missing++
}
fs.writeFileSync(target, JSON.stringify(base, null, 2) + '\n')
console.log(`${target}: -${removed} removed, ${missing} not found`)
