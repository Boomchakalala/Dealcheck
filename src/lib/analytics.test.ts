import { describe, it, expect, vi, beforeEach } from 'vitest'

const capture = vi.fn()
const identify = vi.fn()
vi.mock('posthog-js', () => ({ default: { capture, identify, reset: vi.fn(), init: vi.fn() } }))

// The analytics module gates on `window`; give it one for the test.
beforeEach(() => {
  ;(globalThis as unknown as { window: object }).window = {}
  capture.mockClear(); identify.mockClear()
})

describe('PostHog payloads carry no email and no document content', () => {
  it('identifyUser sends the user id only', async () => {
    const { identifyUser } = await import('./analytics')
    identifyUser('user-123', { plan: 'free' })
    expect(identify).toHaveBeenCalledWith('user-123', { plan: 'free' })
    const sent = JSON.stringify(identify.mock.calls)
    expect(sent).not.toMatch(/@/)
    expect(sent).not.toMatch(/email/i)
  })

  it('login and signup events have empty property bags', async () => {
    const { trackEvent } = await import('./analytics')
    trackEvent({ name: 'signup_completed', properties: {} })
    trackEvent({ name: 'login_completed', properties: {} })
    for (const call of capture.mock.calls) expect(JSON.stringify(call[1] ?? {})).not.toMatch(/@|email/i)
  })

  it('the event contract has no field that could carry an email or quote text', async () => {
    // Type-level guard made runtime: the source file must not declare such a property.
    const fs = await import('node:fs')
    const src = fs.readFileSync(new URL('./analytics.ts', import.meta.url), 'utf8')
    const typeBlock = src.slice(src.indexOf('export type AnalyticsEvent'), src.indexOf('// Track an event'))
    expect(typeBlock).not.toMatch(/email\s*:/)
    expect(typeBlock).not.toMatch(/text\s*:|content\s*:|vendor\s*:/)
  })
})
