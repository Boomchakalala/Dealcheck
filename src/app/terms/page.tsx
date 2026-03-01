import Link from 'next/link'
import { Scale } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-base font-bold text-slate-900 tracking-tight hover:text-slate-700 transition-colors">
            DealCheck
          </Link>
          <Link href="/login" className="text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors">
            Sign in
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 to-white pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm mb-6">
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wide">Legal</span>
            </div>
            <h1 className="text-[2.25rem] sm:text-[3rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-3">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-400 mb-16">Last updated: March 1, 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-20">
          <div className="space-y-14 text-sm text-slate-700 leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using DealCheck (&ldquo;the Service&rdquo;), operated by DealCheck (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;), you agree to these Terms of Service. If you do not agree, do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">2. Description of Service</h2>
              <p>
                DealCheck is an AI-powered procurement analysis tool. It accepts supplier quotes, contracts, and commercial proposals as text input and returns automated analysis including risk identification, negotiation guidance, and draft communications.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">3. Critical Disclaimers</h2>
              <div className="border-2 border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl p-7 space-y-5 shadow-sm">
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Not legal, financial, or professional advice</p>
                  <p>DealCheck does not provide legal, financial, tax, or professional advice. All output is for informational purposes only. Consult licensed professionals before making business decisions based on our analysis.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">AI may be wrong</p>
                  <p>Our Service uses artificial intelligence which can produce errors, miss important details, hallucinate facts, or provide incomplete analysis. You must independently verify all output before relying on it.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">No proprietary benchmark data</p>
                  <p>We do not have access to proprietary pricing databases, market rate benchmarks, or confidential industry data. Analysis is based solely on the text you provide and the AI model&apos;s general training data.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Your responsibility</p>
                  <p>You are solely responsible for all business decisions, contract negotiations, pricing determinations, and legal compliance. DealCheck is a tool to assist your analysis — not a substitute for professional judgment.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Confidentiality warning</p>
                  <p>Documents you submit are sent to third-party AI providers for processing. Do not upload documents you are contractually prohibited from sharing with third-party cloud services. You are responsible for ensuring you have the right to share any content you submit.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">4. Accounts &amp; Registration</h2>
              <p className="mb-3">You may use the Service without an account. To save deals and access your history, you must create an account with a valid email and password.</p>
              <p>You are responsible for maintaining the security of your account credentials. Notify us immediately at <a href="mailto:support@dealcheck.app" className="text-emerald-700 underline underline-offset-2 decoration-emerald-300 hover:decoration-emerald-500 transition-colors">support@dealcheck.app</a> if you suspect unauthorized access.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">5. User Responsibilities</h2>
              <p className="mb-3">You agree to:</p>
              <ul className="space-y-2.5 ml-1">
                {[
                  'Provide accurate, complete information',
                  'Use the Service lawfully and ethically',
                  'Only upload content you have the right to share',
                  'Not share confidential documents without proper authorization',
                  'Verify all AI-generated output before acting on it',
                  'Not reverse engineer, scrape, or abuse the Service',
                  'Comply with all applicable laws and regulations',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">6. Data &amp; File Handling</h2>
              <p className="mb-3">
                Uploaded files (PDFs, images) are processed for text extraction only and are not stored permanently on our servers after extraction. Extracted text and AI-generated analysis may be stored if you create an account and save a deal.
              </p>
              <p>See our <Link href="/privacy" className="text-emerald-700 underline underline-offset-2 decoration-emerald-300 hover:decoration-emerald-500 transition-colors">Privacy Policy</Link> for full details on data handling, sub-processors, and your rights.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">7. Usage &amp; Plans</h2>
              <p className="mb-3">
                <span className="font-medium">Free:</span> Unlimited analysis rounds. Save deals with an account.
              </p>
              <p className="mb-3">
                <span className="font-medium">Pro:</span> Additional features including PDF export and team seats. Pricing and availability will be announced separately.
              </p>
              <p>We reserve the right to modify plan features with reasonable notice.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">8. Subscription &amp; Billing</h2>
              <p className="mb-3">
                Paid plans (when available) will be billed monthly. You may cancel at any time; cancellation takes effect at the end of the current billing period. No refunds for partial months.
              </p>
              <p>
                We may change pricing with 30 days&apos; notice. Continued use after a price change constitutes acceptance. Payment processing is handled by third-party providers (e.g., Stripe); their terms apply to payment transactions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">9. Intellectual Property</h2>
              <p className="mb-3">You retain all rights to content you upload. We retain all rights to the DealCheck platform, brand, software, and analysis frameworks.</p>
              <p>By using the Service, you grant us a limited, non-exclusive license to process your content solely for the purpose of providing the Service. We do not claim ownership of your uploaded content.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">10. Limitation of Liability</h2>
              <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-7 shadow-sm">
                <p className="mb-3">
                  THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p className="mb-3">We are not liable for:</p>
                <ul className="space-y-2 ml-1 mb-3">
                  {[
                    'Business decisions made based on our analysis',
                    'Financial losses from negotiations or contracts',
                    'Errors, omissions, or inaccuracies in AI-generated content',
                    'Service interruptions or data loss',
                    'Indirect, incidental, special, or consequential damages',
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p>Our total aggregate liability for any claim shall not exceed the greater of (a) the amount you paid us in the 12 months preceding the claim, or (b) $100 USD.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">11. Indemnification</h2>
              <p>You agree to indemnify and hold harmless DealCheck and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the Service, your violation of these Terms, or your violation of any third-party rights.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">12. Service Availability</h2>
              <p>We strive for high availability but do not guarantee uninterrupted access. We may modify, suspend, or discontinue the Service (or any feature) at any time with reasonable notice where practicable.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">13. Termination</h2>
              <p className="mb-3">You may close your account at any time by contacting us. We may suspend or terminate your access for violation of these Terms or harmful conduct, with or without notice.</p>
              <p>Upon termination, your right to use the Service ceases. Sections 3, 10, 11, and 15 survive termination.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">14. Changes to These Terms</h2>
              <p>We may update these Terms at any time. Material changes will be communicated via email or a notice in the Service at least 14 days before they take effect. Continued use after the effective date constitutes acceptance.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">15. Governing Law &amp; Disputes</h2>
              <p>
                {/* TODO: Insert specific jurisdiction when incorporated */}
                These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict-of-law provisions. Any disputes shall be resolved in the state or federal courts located in Delaware.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">16. Contact</h2>
              <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
                <p>
                  Questions about these Terms: <a href="mailto:legal@dealcheck.app" className="text-emerald-700 underline underline-offset-2 decoration-emerald-300 hover:decoration-emerald-500 transition-colors font-medium">legal@dealcheck.app</a>
                </p>
              </div>
            </section>

            <div className="pt-8 mt-8 border-t border-slate-200/60">
              <p className="text-xs text-slate-500">
                By using DealCheck, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>

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
          </div>
        </div>
      </footer>
    </div>
  )
}
