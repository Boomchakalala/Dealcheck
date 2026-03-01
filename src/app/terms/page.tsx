import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-slate-900 tracking-tight hover:text-slate-700 transition-colors">
            DealCheck
          </Link>
          <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Sign in
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-20 pb-20">
          <p className="text-sm font-medium text-emerald-600 mb-5 tracking-wide">Legal</p>
          <h1 className="text-[2.25rem] sm:text-[2.75rem] leading-[1.1] font-bold text-slate-900 tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400 mb-16">Last updated: March 1, 2026</p>

          <div className="space-y-14 text-sm text-slate-700 leading-relaxed">

            {/* 1. Acceptance */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using DealCheck (&ldquo;the Service&rdquo;), operated by DealCheck (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;), you agree to these Terms of Service. If you do not agree, do not use the Service.
              </p>
            </section>

            {/* 2. Description */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">2. Description of Service</h2>
              <p>
                DealCheck is an AI-powered procurement analysis tool. It accepts supplier quotes, contracts, and commercial proposals as text input and returns automated analysis including risk identification, negotiation guidance, and draft communications.
              </p>
            </section>

            {/* 3. Critical Disclaimers */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">3. Critical Disclaimers</h2>
              <div className="border-2 border-amber-200 bg-amber-50/50 rounded-xl p-6 space-y-5">
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

            {/* 4. Accounts */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">4. Accounts &amp; Registration</h2>
              <p className="mb-3">You may use limited features without an account. To save deals and access your history, you must create an account with a valid email and password.</p>
              <p>You are responsible for maintaining the security of your account credentials. Notify us immediately at <a href="mailto:support@dealcheck.app" className="text-slate-900 underline underline-offset-2 decoration-slate-300">support@dealcheck.app</a> if you suspect unauthorized access.</p>
            </section>

            {/* 5. User Responsibilities */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">5. User Responsibilities</h2>
              <p className="mb-3">You agree to:</p>
              <ul className="space-y-2 ml-1">
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Provide accurate, complete information</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Use the Service lawfully and ethically</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Only upload content you have the right to share</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Not share confidential documents without proper authorization</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Verify all AI-generated output before acting on it</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Not reverse engineer, scrape, or abuse the Service</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            {/* 6. Data & Files */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">6. Data &amp; File Handling</h2>
              <p className="mb-3">
                Uploaded files (PDFs, images) are processed for text extraction only and are not stored permanently on our servers after extraction. Extracted text and AI-generated analysis may be stored if you create an account and save a deal.
              </p>
              <p>See our <Link href="/privacy" className="text-slate-900 underline underline-offset-2 decoration-slate-300 hover:decoration-slate-500 transition-colors">Privacy Policy</Link> for full details on data handling, sub-processors, and your rights.</p>
            </section>

            {/* 7. Usage Limits */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">7. Usage Limits &amp; Plans</h2>
              <p className="mb-3">
                <span className="font-medium">Free:</span> 2 analysis rounds. 1 saved deal with an account.
              </p>
              <p className="mb-3">
                <span className="font-medium">Pro:</span> Unlimited rounds and saved deals. Pricing and availability will be announced separately.
              </p>
              <p>We reserve the right to modify plan limits with reasonable notice.</p>
            </section>

            {/* 8. Subscription & Billing */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">8. Subscription &amp; Billing</h2>
              <p className="mb-3">
                Paid plans (when available) will be billed monthly. You may cancel at any time; cancellation takes effect at the end of the current billing period. No refunds for partial months.
              </p>
              <p className="mb-3">
                We may change pricing with 30 days&apos; notice. Continued use after a price change constitutes acceptance. Payment processing is handled by third-party providers (e.g., Stripe); their terms apply to payment transactions.
              </p>
              <p className="text-xs text-slate-500">
                {/* TODO: Update with actual billing provider and refund policy when Pro launches */}
              </p>
            </section>

            {/* 9. Intellectual Property */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">9. Intellectual Property</h2>
              <p className="mb-3">You retain all rights to content you upload. We retain all rights to the DealCheck platform, brand, software, and analysis frameworks.</p>
              <p>By using the Service, you grant us a limited, non-exclusive license to process your content solely for the purpose of providing the Service. We do not claim ownership of your uploaded content.</p>
            </section>

            {/* 10. Limitation of Liability */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">10. Limitation of Liability</h2>
              <p className="mb-3">
                THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="mb-3">We are not liable for:</p>
              <ul className="space-y-2 ml-1 mb-3">
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Business decisions made based on our analysis</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Financial losses from negotiations or contracts</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Errors, omissions, or inaccuracies in AI-generated content</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Service interruptions or data loss</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Indirect, incidental, special, or consequential damages</li>
              </ul>
              <p>Our total aggregate liability for any claim shall not exceed the greater of (a) the amount you paid us in the 12 months preceding the claim, or (b) $100 USD.</p>
            </section>

            {/* 11. Indemnification */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">11. Indemnification</h2>
              <p>You agree to indemnify and hold harmless DealCheck and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the Service, your violation of these Terms, or your violation of any third-party rights.</p>
            </section>

            {/* 12. Service Availability */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">12. Service Availability</h2>
              <p>We strive for high availability but do not guarantee uninterrupted access. We may modify, suspend, or discontinue the Service (or any feature) at any time with reasonable notice where practicable.</p>
            </section>

            {/* 13. Termination */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">13. Termination</h2>
              <p className="mb-3">You may close your account at any time by contacting us. We may suspend or terminate your access for violation of these Terms or harmful conduct, with or without notice.</p>
              <p>Upon termination, your right to use the Service ceases. Sections 3, 10, 11, and 15 survive termination.</p>
            </section>

            {/* 14. Changes */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">14. Changes to These Terms</h2>
              <p>We may update these Terms at any time. Material changes will be communicated via email or a notice in the Service at least 14 days before they take effect. Continued use after the effective date constitutes acceptance.</p>
            </section>

            {/* 15. Governing Law */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">15. Governing Law &amp; Disputes</h2>
              <p>
                {/* TODO: Insert specific jurisdiction when incorporated */}
                These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict-of-law provisions. Any disputes shall be resolved in the state or federal courts located in Delaware.
              </p>
            </section>

            {/* 16. Contact */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">16. Contact</h2>
              <p>
                Questions about these Terms: <a href="mailto:legal@dealcheck.app" className="text-slate-900 underline underline-offset-2 decoration-slate-300">legal@dealcheck.app</a>
              </p>
            </section>

            {/* Closing */}
            <div className="pt-8 mt-8 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                By using DealCheck, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">DealCheck</p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
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
