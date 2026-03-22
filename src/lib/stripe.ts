import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  }
  return _stripe
}

export const PLANS = {
  essentials: {
    priceId: process.env.STRIPE_ESSENTIALS_PRICE_ID || '',
    name: 'Essentials',
    price: 15,
    currency: 'EUR',
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    name: 'Pro',
    price: 39,
    currency: 'EUR',
  },
  business: {
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID || '',
    name: 'Business',
    price: 149,
    currency: 'EUR',
  },
} as const

export type PlanKey = keyof typeof PLANS
