/**
 * The published privacy text must quote the retention rules the code
 * enforces (lib/retention.ts), in both languages, and must not carry the
 * claims the 2026-09-08 audit found to be untrue.
 */
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { RAW_TEXT_MAX_AGE_DAYS, NEGOTIATION_DOC_GRACE_DAYS, NEGOTIATION_DOC_MAX_AGE_DAYS, TELEMETRY_IDENTIFIERS_MAX_AGE_DAYS } from './retention'

type Messages = Record<string, Record<string, unknown>>
const load = (loc: string): Messages => JSON.parse(fs.readFileSync(path.resolve(process.cwd(), `messages/${loc}.json`), 'utf8'))
const en = load('en')
const fr = load('fr')
const flat = (o: unknown, out: string[] = []): string[] => {
  if (typeof o === 'string') out.push(o)
  else if (o && typeof o === 'object') Object.values(o).forEach((v) => flat(v, out))
  return out
}
const str = (m: Messages, ns: string, key: string) => (m[ns] as Record<string, string>)[key]
const docMonths = String(Math.round(NEGOTIATION_DOC_MAX_AGE_DAYS / 30))

describe.each([['en', en], ['fr', fr]] as const)('%s privacy copy matches the implemented rules', (loc, m) => {
  it('states the raw-text rule with the real number', () => {
    for (const key of ['summary2', 's5Item2']) expect(str(m, 'privacyPage', key)).toContain(String(RAW_TEXT_MAX_AGE_DAYS))
    expect(str(m, 'securityPage', 'keyPrinciple')).toContain(String(RAW_TEXT_MAX_AGE_DAYS))
    expect(str(m, 'securityPage', 'extractedTextDesc1')).toContain(String(RAW_TEXT_MAX_AGE_DAYS))
  })

  it('states the negotiation-document rule with the real numbers', () => {
    const line = str(m, 'privacyPage', 's5Item4')
    expect(line).toContain(String(NEGOTIATION_DOC_GRACE_DAYS))
    expect(line).toContain(docMonths)
    expect(str(m, 'securityPage', 'fileDeletionDesc2')).toContain(String(NEGOTIATION_DOC_GRACE_DAYS))
  })

  it('states the telemetry rule with the real number', () => {
    expect(str(m, 'privacyPage', 's5Item6')).toContain(String(TELEMETRY_IDENTIFIERS_MAX_AGE_DAYS))
  })

  it('discloses benchmark use as de-identified / pseudonymised, never anonymous', () => {
    const b = str(m, 'privacyPage', 's3Item8')
    expect(b).toMatch(loc === 'fr' ? /dé-identifi/i : /de-identified/i)
    expect(b).toMatch(loc === 'fr' ? /pseudonymis/i : /pseudonymised/i)
    // Saying "pseudonymised rather than anonymous" is the point; claiming anonymity is what's forbidden.
    expect(b).not.toMatch(loc === 'fr' ? /anonymis(é|ée|és|ées)\b|données anonymes|totalement anonyme/i : /\banonymi[sz]ed\b|\banonymous data\b|\bfully anonymous\b/i)
    expect(str(m, 'termsPage', 's6YourContentDesc')).toMatch(loc === 'fr' ? /benchmark/i : /benchmarks/i)
  })

  it('no longer claims text is stored only when the user chooses, or that files are deleted after analysis unless saved', () => {
    const all = flat(m).join('\n')
    expect(all).not.toMatch(/only if you choose to (keep|save)|unless you save|Only saved when you say so/i)
    expect(all).not.toMatch(/uniquement si vous choisissez de (la conserver|sauvegarder)|sauf si vous (les )?sauvegardez|Sauvegardé uniquement à votre demande/i)
    expect(all).not.toMatch(/never logged/i)
    expect(all).not.toMatch(/Deleted immediately after (processing|text extraction)/i)
    expect(all).not.toMatch(/Supprimés? immédiatement après (traitement|extraction)/i)
  })

  it('no longer describes analytics as anonymised or PII-free', () => {
    expect(str(m, 'privacyPage', 's4PostHogDesc')).not.toMatch(/anonymi[sz]|personally identifiable|personnellement identifiable/i)
    expect(str(m, 'privacyPage', 's4PostHogDesc')).toMatch(/email/i)
  })

  it('renders every retention line the privacy page iterates over', () => {
    for (const n of [1, 2, 3, 4, 5, 6, 7]) {
      expect(str(m, 'privacyPage', `s5Item${n}Prefix`)).toBeTruthy()
      expect(str(m, 'privacyPage', `s5Item${n}`)).toBeTruthy()
    }
    expect(str(m, 'privacyPage', 's2Deal4')).toBeTruthy()
    for (const k of ['retentionTitle', 'retentionFiles', 'retentionText', 'retentionDocs', 'retentionDelete', 'retentionLink']) expect(str(m, 'settingsClient', k)).toBeTruthy()
    expect(str(m, 'settingsClient', 'saveExtractedText')).toBeUndefined()
  })
})
