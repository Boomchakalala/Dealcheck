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

export const SUPPORTED_CURRENCIES = ['EUR', 'USD', 'GBP', 'CAD', 'AUD', 'CHF', 'JPY'] as const
export type Currency = typeof SUPPORTED_CURRENCIES[number]

export const CURRENCY_LABELS: Record<Currency, string> = {
  EUR: '€ EUR — Euro',
  USD: '$ USD — US Dollar',
  GBP: '£ GBP — British Pound',
  CAD: 'C$ CAD — Canadian Dollar',
  AUD: 'A$ AUD — Australian Dollar',
  CHF: 'CHF — Swiss Franc',
  JPY: '¥ JPY — Japanese Yen',
}

/**
 * Detect currency from a string like "$15,000" or "€14,200" or "£10,000"
 */
export function detectCurrency(text: string): Currency {
  if (!text) return 'EUR'

  const upper = text.toUpperCase()

  // Check for explicit currency codes
  if (upper.includes('EUR') || text.includes('€')) return 'EUR'
  if (upper.includes('GBP') || text.includes('£')) return 'GBP'
  if (upper.includes('CAD') || upper.includes('C$')) return 'CAD'
  if (upper.includes('AUD') || upper.includes('A$')) return 'AUD'
  if (upper.includes('CHF')) return 'CHF'
  if (upper.includes('JPY') || text.includes('¥')) return 'JPY'
  if (upper.includes('USD') || text.includes('$')) return 'USD'

  // Default to EUR
  return 'EUR'
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
        AUD: 1.52,
        CHF: 0.88,
        JPY: 149.5,
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
    EUR: '€',
    USD: '$',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF ',
    JPY: '¥',
  }

  const symbol = symbols[currency]
  const noDecimals = currency === 'JPY'

  // For millions, use M notation
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`
  }

  // For amounts over 1,000 — round to whole numbers
  if (amount >= 1000) {
    const rounded = Math.round(amount)
    return `${symbol}${rounded.toLocaleString('en-US')}`
  }

  // For small amounts — show 2 decimals (except JPY)
  if (noDecimals) {
    return `${symbol}${Math.round(amount).toLocaleString('en-US')}`
  }

  return `${symbol}${amount.toFixed(2)}`
}

/**
 * Normalize a raw currency string from AI output into consistent format.
 * Handles: "21 456,00 €", "40 998€", "$16,328.40", "€110,170", "15 000 €/an"
 * Returns: "€21,456", "$16,328", etc. (symbol before, comma thousands, no decimals)
 */
export function normalizeAmount(raw: string): string {
  if (!raw || typeof raw !== 'string') return raw

  // Detect currency
  const currency = detectCurrency(raw)
  const symbols: Record<Currency, string> = {
    EUR: '€', USD: '$', GBP: '£', CAD: 'C$', AUD: 'A$', CHF: 'CHF ', JPY: '¥',
  }
  const symbol = symbols[currency]

  // Strip all currency symbols and text suffixes
  let cleaned = raw
    .replace(/€|EUR|\$|USD|£|GBP|C\$|CAD|A\$|AUD|CHF|¥|JPY/gi, '')
    .replace(/\/(an|year|yr|month|mo|mois)/gi, '')
    .trim()

  // Handle French-style numbers: "21 456,00" → "21456.00"
  // If we see digits with spaces as thousands separators and comma as decimal
  if (/\d\s\d/.test(cleaned) || /\d,\d{2}$/.test(cleaned)) {
    cleaned = cleaned.replace(/\s/g, '') // remove spaces
    cleaned = cleaned.replace(/,(\d{2})$/, '.$1') // convert trailing ,XX to .XX
    // If comma is thousands separator (e.g., "21,456"), leave as-is after space removal
    if (/,\d{3}/.test(cleaned)) {
      cleaned = cleaned.replace(/,/g, '')
    }
  }

  // Remove any remaining non-numeric chars except . and ,
  cleaned = cleaned.replace(/[^\d.,]/g, '')

  // Handle remaining commas as thousands separators
  cleaned = cleaned.replace(/,/g, '')

  const num = parseFloat(cleaned)
  if (isNaN(num)) return raw // Can't parse, return original

  // Format: symbol + number with commas, no decimals for amounts >= 1
  if (num >= 1000000) {
    return `${symbol}${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1) {
    return `${symbol}${Math.round(num).toLocaleString('en-US')}`
  }
  return `${symbol}${num.toFixed(2)}`
}

/**
 * Parse money string and return amount + currency
 */
export function parseMoney(str: string): { amount: number; currency: Currency } {
  if (!str || typeof str !== 'string') {
    return { amount: 0, currency: 'EUR' }
  }

  // Detect currency first
  const currency = detectCurrency(str)

  // Check for range first: "$3,000-6,000" — take midpoint
  const rangeMatch = str.match(/([\d.,\s]+)[-–—]\s*([\d.,\s]+)/)
  if (rangeMatch) {
    const parseNum = (s: string) => parseFloat(s.replace(/[\s,]/g, ''))
    const a = parseNum(rangeMatch[1]), b = parseNum(rangeMatch[2])
    if (!isNaN(a) && !isNaN(b) && a > 0 && b > 0) {
      return { amount: (a + b) / 2, currency }
    }
  }

  // Remove currency symbols and extra text
  let cleaned = str
    .toUpperCase()
    .replace(/USD|EUR|GBP|CAD|AUD|CHF|JPY/g, '')
    .replace(/\$|€|£|¥/g, '')
    .replace(/\/MONTH|\/YEAR|MONTHLY|ANNUAL|CONTRACT|SAVED|OVER CONTRACT LIFE|PER YEAR/g, '')
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
