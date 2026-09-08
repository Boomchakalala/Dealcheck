import { describe, it, expect, vi, afterEach } from 'vitest'
import { logAiRaw, logAiParseFailure } from './ai-debug'

const SECRET = 'Total contract value €48,200 for Acme Corp, contact jane@acme.example'

afterEach(() => {
  vi.restoreAllMocks()
  delete process.env.DEBUG_AI_RAW
})

describe('model output never reaches the logs by default', () => {
  it('logAiRaw logs the length, not the content', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    logAiRaw('Analyze raw response', SECRET)
    const printed = log.mock.calls.flat().map(String).join(' ')
    expect(printed).toContain(String(SECRET.length))
    expect(printed).not.toContain('48,200')
    expect(printed).not.toContain('Acme')
    expect(printed).not.toContain('jane@')
  })

  it('logAiParseFailure logs the size and the reason, not the content', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    logAiParseFailure('Step 2 judgment response', SECRET, new SyntaxError('Unexpected token'))
    const printed = err.mock.calls.flat().map(String).join(' ')
    expect(printed).toContain('Unexpected token')
    expect(printed).not.toContain('Acme')
  })

  it('only DEBUG_AI_RAW=true (local development) prints content', () => {
    process.env.DEBUG_AI_RAW = 'true'
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    logAiRaw('Analyze raw response', SECRET)
    expect(log.mock.calls.flat().map(String).join(' ')).toContain('Acme')
  })
})
