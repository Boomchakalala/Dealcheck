// Deep-merges a fragment into messages/<locale>.json without touching existing keys.
// Usage: node scripts/i18n-merge.mjs scripts/i18n/<name>.en.json en
import fs from 'node:fs'

const [fragmentPath, locale] = process.argv.slice(2)
if (!fragmentPath || !locale) {
  console.error('usage: node scripts/i18n-merge.mjs <fragment.json> <en|fr>')
  process.exit(1)
}
const target = `messages/${locale}.json`
const base = JSON.parse(fs.readFileSync(target, 'utf8'))
const frag = JSON.parse(fs.readFileSync(fragmentPath, 'utf8'))

let added = 0, replaced = 0
function merge(dst, src, path = '') {
  for (const [k, v] of Object.entries(src)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      if (!dst[k] || typeof dst[k] !== 'object') dst[k] = {}
      merge(dst[k], v, path + k + '.')
    } else {
      if (k in dst) { if (dst[k] !== v) replaced++ } else added++
      dst[k] = v
    }
  }
}
merge(base, frag)
fs.writeFileSync(target, JSON.stringify(base, null, 2) + '\n')
console.log(`${target}: +${added} added, ${replaced} replaced`)
