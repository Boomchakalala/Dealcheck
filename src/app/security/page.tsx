import Link from 'next/link'
import { Header } from '@/components/Header'
import { Trash2, FileText, Lock, Shield, ArrowRight } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header variant="public" />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-50/60 to-white">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-[2.5rem] sm:text-[3.5rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-4">
                How We Handle Your Data
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Transparent about what we do with your quotes and how we protect your information.
              </p>
            </div>
          </div>
        </div>


        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">

          {/* Key principle */}
          <div className="text-center mb-12">
            <p className="text-xl text-slate-700 font-medium max-w-2xl mx-auto">
              We don&apos;t store your uploaded files. Only the AI-generated analysis is saved if you choose to keep it.
            </p>
          </div>

          {/* What happens to your data - Visual flow */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Step 1: Upload */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/60 p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">1. You Upload</h3>
                <p className="text-sm text-slate-600">
                  We extract text from your PDF or image
                </p>
              </div>

              {/* Step 2: Process */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/60 p-6 text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">2. AI Analyzes</h3>
                <p className="text-sm text-slate-600">
                  Text sent to OpenAI for analysis
                </p>
              </div>

              {/* Step 3: Delete */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200/60 p-6 text-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">3. File Deleted</h3>
                <p className="text-sm text-slate-600">
                  Original file deleted immediately
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-sm text-slate-600 text-center">
                <span className="font-semibold text-slate-900">Bottom line:</span> We don&apos;t store your files. Only AI outputs are saved if you choose to save the deal.
              </p>
            </div>
          </div>


          {/* Where data goes */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Where Your Data Goes</h2>

            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">OpenAI</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Extracted text sent for AI analysis. OpenAI doesn&apos;t use API data to train models.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">Supabase</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Database for saved deals. SOC 2 Type II certified, data encrypted at rest.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">Vercel</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Application hosting. SOC 2 Type II certified with DDoS protection.
                </p>
              </div>
            </div>
          </div>

          {/* What we don't do */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">What We Don&apos;t Do</h2>

            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-200/60 p-6">
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-2"><span className="text-emerald-600 font-bold">✗</span> Sell your data</li>
                <li className="flex gap-2"><span className="text-emerald-600 font-bold">✗</span> Train AI models on your data</li>
                <li className="flex gap-2"><span className="text-emerald-600 font-bold">✗</span> Store uploaded files after processing</li>
                <li className="flex gap-2"><span className="text-emerald-600 font-bold">✗</span> Share data beyond services listed above</li>
              </ul>
            </div>
          </div>

          {/* Limitations */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Being Honest: Limitations</h2>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <p className="text-sm text-slate-700 mb-3">We&apos;re a startup, not enterprise-certified. What we don&apos;t have yet:</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2"><span>•</span> Not SOC 2 certified (our providers are)</li>
                <li className="flex gap-2"><span>•</span> Not end-to-end encrypted</li>
                <li className="flex gap-2"><span>•</span> No pen testing or security audits yet</li>
                <li className="flex gap-2"><span>•</span> No formal incident response plan</li>
              </ul>
              <p className="text-sm text-slate-700 mt-3">
                We&apos;re continuously improving. Questions? Email <a href="mailto:security@dealcheck.app" className="text-emerald-600 hover:underline font-medium">security@dealcheck.app</a>
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Questions?</h2>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-slate-900">Security:</span> <a href="mailto:security@dealcheck.app" className="text-emerald-600 hover:underline">security@dealcheck.app</a></p>
                <p><span className="font-semibold text-slate-900">Privacy:</span> <a href="mailto:privacy@dealcheck.app" className="text-emerald-600 hover:underline">privacy@dealcheck.app</a></p>
                <p><span className="font-semibold text-slate-900">Support:</span> <a href="mailto:support@dealcheck.app" className="text-emerald-600 hover:underline">support@dealcheck.app</a></p>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Try DealCheck?
            </h2>
            <p className="text-emerald-50 text-sm sm:text-base mb-8 max-w-2xl mx-auto">
              Your files are deleted after processing. Only the AI insights you choose to save are stored.
            </p>
            <Link
              href="/try"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
            >
              Try DealCheck
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-400">DealCheck</p>
          <div className="flex items-center gap-8 text-sm text-slate-400">
            <Link href="/pricing" className="hover:text-slate-600 transition-colors">Pricing</Link>
            <Link href="/help" className="hover:text-slate-600 transition-colors">Help</Link>
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
            <Link href="/security" className="hover:text-slate-600 transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
