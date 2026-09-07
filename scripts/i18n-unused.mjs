// Lists top-level i18n namespaces (and their keys) that no file under src/ references.
// Heuristic: a namespace is "used" if src mentions `<ns>.` or `('<ns>')`; a key inside a
// used namespace is "used" if its dotted path or its leaf name appears in src.
// Usage: node scripts/i18n-unused.mjs [namespace ...]
import fs from 'node:fs'
import { execSync } from 'node:child_process'

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'))
const files = execSync('git ls-files src').toString().trim().split('\n').filter((f) => /\.(ts|tsx)$/.test(f) && !f.startsWith('src/i18n/'))
const src = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
const only = process.argv.slice(2)

for (const [ns, tree] of Object.entries(en)) {
  if (only.length && !only.includes(ns)) continue
  if (!tree || typeof tree !== 'object') continue
  const nsUsed = src.includes(`${ns}.`) || src.includes(`('${ns}')`) || src.includes(`"${ns}"`)
  const dead = []
  const walk = (o, p) => {
    for (const [k, v] of Object.entries(o)) {
      const path = `${p}.${k}`
      if (v && typeof v === 'object') { walk(v, path); continue }
      const leaf = k.replace(/\d+$/, '')
      const used = src.includes(`'${path}'`) || src.includes(`'${k}'`) || src.includes(`\`${k}`) || src.includes(`'${leaf}`) || src.includes(`\`${leaf}`)
      if (!used) dead.push(path)
    }
  }
  walk(tree, ns)
  if (!nsUsed) console.log(`NAMESPACE UNUSED: ${ns}`)
  else if (dead.length) console.log(`${ns}: ${dead.length} unused → ${dead.join(' ')}`)
}
