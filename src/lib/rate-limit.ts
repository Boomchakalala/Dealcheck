import { createClient } from '@/lib/supabase/server'

export interface RateLimitConfig {
  hourlyLimit: number
  dailyLimit: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
  resetAt: Date
  message?: string
}

// Rate limits by tier
const FREE_LIMITS: RateLimitConfig = {
  hourlyLimit: 5,
  dailyLimit: 5,
}

const ESSENTIALS_LIMITS: RateLimitConfig = {
  hourlyLimit: 5,
  dailyLimit: 10,
}

const PRO_LIMITS: RateLimitConfig = {
  hourlyLimit: 10,
  dailyLimit: 30,
}

export async function checkRateLimit(userId: string, plan: string = 'free'): Promise<RateLimitResult> {
  const supabase = await createClient()
  const now = new Date()

  const limits = plan === 'pro' || plan === 'business' ? PRO_LIMITS : plan === 'essentials' ? ESSENTIALS_LIMITS : FREE_LIMITS

  // Count analyses in the last hour
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const { count: hourlyCount } = await supabase
    .from('rounds')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', oneHourAgo.toISOString())

  // Count analyses today
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const { count: dailyCount } = await supabase
    .from('rounds')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfDay.toISOString())

  // Check hourly limit
  if ((hourlyCount || 0) >= limits.hourlyLimit) {
    const resetAt = new Date(oneHourAgo.getTime() + 60 * 60 * 1000)
    return {
      allowed: false,
      remaining: 0,
      limit: limits.hourlyLimit,
      resetAt,
      message: `Hourly limit of ${limits.hourlyLimit} analyses reached. Resets at ${resetAt.toLocaleTimeString()}.`
    }
  }

  // Check daily limit
  if ((dailyCount || 0) >= limits.dailyLimit) {
    const resetAt = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
    return {
      allowed: false,
      remaining: 0,
      limit: limits.dailyLimit,
      resetAt,
      message: `Daily limit of ${limits.dailyLimit} analyses reached. Resets at ${resetAt.toLocaleDateString()}.`
    }
  }

  // Calculate remaining (use the more restrictive one)
  const hourlyRemaining = limits.hourlyLimit - (hourlyCount || 0)
  const dailyRemaining = limits.dailyLimit - (dailyCount || 0)
  const remaining = Math.min(hourlyRemaining, dailyRemaining)

  return {
    allowed: true,
    remaining,
    limit: limits.dailyLimit,
    resetAt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
  }
}

export async function getUserUsage(userId: string): Promise<{
  hourlyUsed: number
  dailyUsed: number
  hourlyLimit: number
  dailyLimit: number
}> {
  const supabase = await createClient()
  const now = new Date()

  // Get user's plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single()

  const plan = profile?.plan || 'free'
  const limits = plan === 'pro' || plan === 'business' ? PRO_LIMITS : plan === 'essentials' ? ESSENTIALS_LIMITS : FREE_LIMITS

  // Count hourly usage
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const { count: hourlyUsed } = await supabase
    .from('rounds')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', oneHourAgo.toISOString())

  // Count daily usage
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const { count: dailyUsed } = await supabase
    .from('rounds')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfDay.toISOString())

  return {
    hourlyUsed: hourlyUsed || 0,
    dailyUsed: dailyUsed || 0,
    hourlyLimit: limits.hourlyLimit,
    dailyLimit: limits.dailyLimit,
  }
}
