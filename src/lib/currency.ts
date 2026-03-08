// Currency conversion utility using exchangerate-api.io

const EXCHANGE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || 'free'
const EXCHANGE_API_URL = 'https://open.er-api.com/v6/latest'

interface ExchangeRates {
  rates: Record<string, number>
  base: string
  time_last_update_unix: number
}

// Cache rates for 24 hours
let ratesCache: ExchangeRates | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const
export type Currency = typeof SUPPORTED_CURRENCIES[number]

/**
 * Detect currency from a string like "$15,000" or "€14,200" or "£10,000"
 */
export function detectCurrency(text: string): Currency {
  if (!text) return 'USD'

  const upper = text.toUpperCase()

  // Check for explicit currency codes
  if (upper.includes('EUR') || text.includes('€')) return 'EUR'
  if (upper.includes('GBP') || text.includes('£')) return 'GBP'
  if (upper.includes('CAD') || upper.includes('C$')) return 'CAD'
  if (upper.includes('AUD') || upper.includes('A$')) return 'AUD'
  if (upper.includes('USD') || text.includes('$')) return 'USD'

  // Default to USD
  return 'USD'
}

/**
 * Fetch latest exchange rates from API
 */
async function fetchRates(): Promise<ExchangeRates> {
  const now = Date.now()

  // Return cached rates if still valid
  if (ratesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return ratesCache
  }

  try {
    const response = await fetch(`${EXCHANGE_API_URL}/USD`)
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates')
    }

    const data = await response.json()
    ratesCache = {
      rates: data.rates,
      base: data.base_code,
      time_last_update_unix: data.time_last_update_unix
    }
    cacheTimestamp = now

    return ratesCache
  } catch (error) {
    console.error('Currency API error:', error)

    // Fallback to approximate rates if API fails
    return {
      rates: {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        CAD: 1.36,
        AUD: 1.52
      },
      base: 'USD',
      time_last_update_unix: now
    }
  }
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): Promise<number> {
  if (fromCurrency === toCurrency) return amount

  const rates = await fetchRates()

  // Convert to USD first (base), then to target currency
  const usdAmount = fromCurrency === 'USD'
    ? amount
    : amount / rates.rates[fromCurrency]

  const targetAmount = toCurrency === 'USD'
    ? usdAmount
    : usdAmount * rates.rates[toCurrency]

  return Math.round(targetAmount * 100) / 100 // Round to 2 decimals
}

/**
 * Format currency amount with symbol
 * Shows actual numbers with commas for better precision
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$'
  }

  const symbol = symbols[currency]

  // For millions, use M notation (e.g., $2.5M)
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`
  }

  // For amounts under 1M, show actual number with thousand separators
  // Round to nearest dollar for cleaner display
  const rounded = Math.round(amount)
  return `${symbol}${rounded.toLocaleString('en-US')}`
}

/**
 * Parse money string and return amount + currency
 */
export function parseMoney(str: string): { amount: number; currency: Currency } {
  if (!str || typeof str !== 'string') {
    return { amount: 0, currency: 'USD' }
  }

  // Detect currency first
  const currency = detectCurrency(str)

  // Remove currency symbols and extra text
  let cleaned = str
    .toUpperCase()
    .replace(/USD|EUR|GBP|CAD|AUD/g, '')
    .replace(/\$|€|£/g, '')
    .replace(/\/MONTH|\/YEAR|MONTHLY|ANNUAL|CONTRACT/g, '')
    .trim()

  // Extract number with K/M suffix
  const match = cleaned.match(/([\d,]+\.?\d*)\s*([KM])?/)
  if (!match) {
    return { amount: 0, currency }
  }

  const numberStr = match[1].replace(/,/g, '')
  const suffix = match[2]
  const baseAmount = parseFloat(numberStr)

  if (isNaN(baseAmount)) {
    return { amount: 0, currency }
  }

  let amount = baseAmount
  if (suffix === 'K') amount *= 1000
  if (suffix === 'M') amount *= 1000000

  return { amount, currency }
}
