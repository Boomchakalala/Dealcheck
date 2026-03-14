import Link from 'next/link'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { Shield, Lock, Trash2, FileText, Database, ArrowRight } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <UnifiedHeader variant="public" />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-50/60 to-white">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-16">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm mb-6">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700 tracking-wide">Security</span>
              </div>
              <h1 className="text-[2.5rem] sm:text-[3.5rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-4">
                How we handle your data
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                No marketing spin. Here&apos;s exactly what happens to your files, where your data goes, and what we&apos;re still working on.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">

          {/* Key principle */}
          <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 to-white p-6 mb-16 text-center">
            <p className="text-xl text-slate-700 font-medium max-w-2xl mx-auto">
              Files are deleted immediately after analysis. Only AI-generated outputs are saved — and only if you explicitly choose to save the deal.
            </p>
          </div>

          {/* What happens to your data - Visual flow */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-6">What happens when you upload a file</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Step 1: Upload */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/60 p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">1. You Upload</h3>
                <p className="text-sm text-slate-600">
                  We extract text from your PDF or image. The file is held in memory only.
                </p>
              </div>

              {/* Step 2: Process */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/60 p-6 text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">2. AI Analyzes</h3>
                <p className="text-sm text-slate-600">
                  Extracted text is sent to Anthropic&apos;s API over TLS for analysis.
                </p>
              </div>

              {/* Step 3: Delete */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200/60 p-6 text-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">3. File Deleted</h3>
                <p className="text-sm text-slate-600">
                  Original file deleted immediately. It never touches our database.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-sm text-slate-600 text-center">
                <span className="font-semibold text-slate-900">Bottom line:</span> Your original files are never stored. Only AI-generated analysis is saved — and only if you click save.
              </p>
            </div>
          </div>

          {/* Encryption */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Encryption</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-semibold text-slate-900">In Transit</h3>
                </div>
                <p className="text-sm text-slate-600">
                  All data transmitted over TLS (HTTPS). This applies to file uploads, API calls to Anthropic, and all communication with Supabase and Vercel.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-semibold text-slate-900">At Rest</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Supabase encrypts all stored data with AES-256 encryption. This covers saved deal analyses, account data, and any metadata in our database.
                </p>
              </div>
            </div>
          </div>

          {/* File Deletion */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">File Deletion</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Trash2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-slate-900">Originals never stored</h3>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                When you upload a PDF or image, we extract the text in memory and immediately discard the original file. It is never written to a database, never saved to disk storage, and never logged. Once the analysis is complete, the extracted text exists only in the AI response.
              </p>
              <p className="text-sm text-slate-600">
                If you choose not to save the deal, nothing is persisted at all — the analysis result is discarded when you leave the page.
              </p>
            </div>
          </div>

          {/* Extracted Text */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Extracted Text Storage</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-slate-900">Only saved when you say so</h3>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Extracted text from your documents is not stored by default. It&apos;s sent to the AI, the AI produces an analysis, and the extracted text is discarded.
              </p>
              <p className="text-sm text-slate-600">
                If you explicitly save a deal, the AI-generated analysis (risk scores, clause breakdowns, recommendations) is stored in your account. The raw extracted text may be stored alongside it so you can reference the original content — but only if you choose to save.
              </p>
            </div>
          </div>

          {/* AI Training */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Never Used for AI Training</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-slate-900">Anthropic doesn&apos;t train on API data</h3>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                We use Anthropic&apos;s API (Claude) for analysis. Anthropic&apos;s API terms explicitly state that data sent through the API is not used to train their models. Your contract text is not being fed into future AI models.
              </p>
              <p className="text-sm text-slate-600">
                We also don&apos;t use your data to train any models ourselves. We don&apos;t build datasets from user uploads. Period.
              </p>
            </div>
          </div>

          {/* GDPR */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">GDPR Compliance</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-slate-900">Your rights are respected</h3>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                We comply with GDPR. You can request access to your data, request deletion, correct inaccurate information, or export your data at any time. Email us and we&apos;ll handle it.
              </p>
              <p className="text-sm text-slate-600">
                Our database infrastructure is hosted in the EU through Supabase, which means your stored data stays within EU jurisdiction.
              </p>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Our Infrastructure</h2>

            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-5 h-5 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">Supabase — Auth & Database</h3>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Handles authentication and stores saved deal data. SOC 2 Type II certified. Data encrypted at rest with AES-256. EU-hosted infrastructure.
                </p>
                <p className="text-sm text-slate-600">
                  Row-level security (RLS) is enabled on all database tables. This means queries are enforced at the database level — users can only read, update, or delete their own data. Even if there were an application-level bug, RLS prevents cross-account data access.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">Vercel — Hosting</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Application hosting and edge functions. SOC 2 certified. Provides DDoS protection, automatic HTTPS, and edge caching. Our serverless functions run here, including the file processing and AI analysis endpoints.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-5 h-5 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">Anthropic — AI Analysis</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Extracted text is sent to Anthropic&apos;s Claude API for contract analysis. Anthropic does not use API data to train models. Data is transmitted over TLS and is not stored by Anthropic beyond their standard API log retention for abuse monitoring.
                </p>
              </div>
            </div>
          </div>

          {/* What we don't do */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">What We Don&apos;t Do</h2>

            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-200/60 p-6">
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-base leading-5">&#10005;</span>
                  <span>Sell your data to anyone — ever</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-base leading-5">&#10005;</span>
                  <span>Use your data for advertising or marketing profiles</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-base leading-5">&#10005;</span>
                  <span>Train AI models on your uploads or saved data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-base leading-5">&#10005;</span>
                  <span>Store your original uploaded files after processing</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-base leading-5">&#10005;</span>
                  <span>Share data with third parties beyond the services listed above</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-500 font-bold text-base leading-5">&#10005;</span>
                  <span>Access your saved deals unless you ask us to for support purposes</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Limitations */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Being Honest: Limitations</h2>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <p className="text-sm text-slate-700 mb-4">
                We believe in being upfront. We&apos;re a startup, and while we take security seriously, there are things we haven&apos;t done yet:
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">&#8226;</span>
                  <span><span className="font-medium text-slate-700">We&apos;re not SOC 2 certified ourselves.</span> Our providers (Supabase, Vercel) are. We haven&apos;t gone through the certification process as a company.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">&#8226;</span>
                  <span><span className="font-medium text-slate-700">No penetration testing yet.</span> We haven&apos;t hired a third party to attempt to break into our systems. It&apos;s on our roadmap.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">&#8226;</span>
                  <span><span className="font-medium text-slate-700">No formal incident response plan.</span> If something went wrong, we&apos;d handle it — but we don&apos;t have a documented, rehearsed procedure yet.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">&#8226;</span>
                  <span><span className="font-medium text-slate-700">Not end-to-end encrypted.</span> Data is encrypted in transit and at rest, but we can technically access stored data on the server side.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">&#8226;</span>
                  <span><span className="font-medium text-slate-700">Small team.</span> We don&apos;t have a dedicated security team. Security is handled by the same people building the product.</span>
                </li>
              </ul>
              <p className="text-sm text-slate-700 mt-4">
                We&apos;re improving this as we grow. If you have specific security requirements, reach out and we&apos;ll be honest about whether we can meet them.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Questions?</h2>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <p className="text-sm text-slate-600 mb-4">
                If you have security concerns or questions about how we handle your data, we&apos;d rather you ask than wonder.
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-slate-900">Security questions:</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Privacy requests:</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>
                </p>
                <p>
                  <span className="font-semibold text-slate-900">General support:</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to analyze your first contract?
            </h2>
            <p className="text-emerald-50 text-sm sm:text-base mb-8 max-w-2xl mx-auto">
              Your files are deleted immediately after processing. Only the AI-generated insights you choose to save are stored in your account.
            </p>
            <Link
              href="/try"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
            >
              Try TermLift free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-400">TermLift</p>
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
