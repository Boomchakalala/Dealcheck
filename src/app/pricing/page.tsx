import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">DealCheck</span>
          </Link>
          <Link href="/login">
            <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Start free. Upgrade when you need unlimited analysis and full negotiation support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <Card className="p-8 border-2 border-slate-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Free</h2>
              <p className="text-slate-600 text-sm">Get started with deal analysis</p>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold text-slate-900">$0</span>
              <span className="text-slate-500 ml-1">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">2 analysis rounds</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">1 saved deal</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">Red flags & negotiation plan</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">3 email draft variations</span>
              </li>
            </ul>

            <Link href="/login" className="block">
              <Button variant="outline" className="w-full">
                Get Started Free
              </Button>
            </Link>
          </Card>

          {/* Pro Tier */}
          <Card className="p-8 border-2 border-emerald-500 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">
              RECOMMENDED
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Pro</h2>
              <p className="text-slate-600 text-sm">For serious procurement teams</p>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold text-slate-900">$29</span>
              <span className="text-slate-500 ml-1">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">Unlimited analysis rounds</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">Unlimited saved deals</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">Red flags & negotiation plan</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">3 email draft variations</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">Email export</span>
              </li>
            </ul>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled>
              Coming Soon
            </Button>
          </Card>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <span className="mx-3">&middot;</span>
          <Link href="/help" className="hover:text-slate-900 transition-colors">Help</Link>
          <span className="mx-3">&middot;</span>
          <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
          <span className="mx-3">&middot;</span>
          <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
        </div>
      </footer>
    </div>
  )
}
