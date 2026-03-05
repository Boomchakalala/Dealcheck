// Simple in-memory rate limiter (no external dependencies)
// Resets on server restart - good enough for a startup

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

interface RateLimitConfig {
  maxRequests: number  // Max requests per window
  windowMs: number     // Window in milliseconds
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    // New window
    store.set(key, { count: 1, resetAt: now + config.windowMs })
    return { allowed: true, remaining: config.maxRequests - 1, resetAt: now + config.windowMs }
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt }
}

// Preset configs
export const RATE_LIMITS = {
  // AI analysis endpoints - expensive (OpenAI costs)
  analysis: { maxRequests: 10, windowMs: 60 * 60 * 1000 },     // 10/hour
  // Trial endpoint - even stricter (no auth, public)
  trial: { maxRequests: 3, windowMs: 60 * 60 * 1000 },          // 3/hour per IP
  // General API - moderate
  api: { maxRequests: 60, windowMs: 60 * 1000 },                 // 60/min
  // Upload endpoint
  upload: { maxRequests: 20, windowMs: 60 * 60 * 1000 },         // 20/hour
}
