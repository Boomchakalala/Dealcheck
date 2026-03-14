import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const PLANS = {
  pro: {
    priceId: 'price_1TAybBRu4wsBOkv2lUj88gTs',
    name: 'Pro',
    price: 39,
    currency: 'EUR',
  },
  business: {
    priceId: 'price_1TAybCRu4wsBOkv2kLQL9zrR',
    name: 'Business',
    price: 149,
    currency: 'EUR',
  },
} as const

export type PlanKey = keyof typeof PLANS
