import Link from 'next/link'
import { Header } from '@/components/Header'
import { Scale } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header variant="public" />

      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-50/60 to-white">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm mb-6">
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wide">Legal</span>
            </div>
            <h1 className="text-[2.25rem] sm:text-[3rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-3">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-400">Last updated: March 5, 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 pb-20">
          <div className="space-y-10 text-sm text-slate-700 leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">1. Acceptance</h2>
              <p>
                By using DealCheck, you agree to these Terms. If you don&apos;t agree, don&apos;t use the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">2. The Service</h2>
              <p>
                DealCheck analyzes supplier quotes and contracts using AI. You upload documents, we extract text, send it to OpenAI for analysis, and return negotiation insights. Files are deleted after processing.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">3. Pricing & Payment</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-4">
                <p className="font-medium text-slate-900 mb-2">Trial & Paid Plans:</p>
                <ul className="space-y-1 ml-4">
                  <li>• New users get limited free analyses to try the service</li>
                  <li>• After trial, you must subscribe to continue</li>
                  <li>• Pricing shown at signup and on our pricing page</li>
                  <li>• Payments processed via Stripe</li>
                  <li>• Subscriptions renew automatically until cancelled</li>
                </ul>
              </div>

              <p className="font-medium text-slate-900 mb-2">Refunds & Cancellation:</p>
              <ul className="space-y-1 ml-4">
                <li>• Cancel anytime from your profile</li>
                <li>• No refunds for partial months</li>
                <li>• Access continues until end of billing period</li>
                <li>• We may change pricing with 30 days notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Critical Disclaimers</h2>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 space-y-3">
                <div>
                  <p className="font-semibold text-slate-900 mb-1">NOT Legal or Professional Advice</p>
                  <p className="text-sm">DealCheck provides information, not advice. Don&apos;t make business decisions solely based on our analysis. Consult licensed professionals for legal, financial, or tax advice.</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-900 mb-1">AI Can Make Mistakes</p>
                  <p className="text-sm">AI analysis may be incomplete, inaccurate, or miss important details. Always review the original documents yourself. We&apos;re not liable for AI errors.</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-900 mb-1">No Guarantees</p>
                  <p className="text-sm">We don&apos;t guarantee savings, improved terms, or any specific outcome. Results vary by deal.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Your Responsibilities</h2>

              <p className="font-medium text-slate-900 mb-2">You agree to:</p>
              <ul className="space-y-1 ml-4 mb-3">
                <li>• Provide accurate account information</li>
                <li>• Keep your password secure</li>
                <li>• Only upload content you have rights to</li>
                <li>• Not abuse, hack, or reverse-engineer the service</li>
                <li>• Not share your account</li>
                <li>• Comply with all applicable laws</li>
              </ul>

              <p className="font-medium text-slate-900 mb-2">Prohibited uses:</p>
              <ul className="space-y-1 ml-4">
                <li>• Uploading illegal or infringing content</li>
                <li>• Attempting to extract or scrape our AI models</li>
                <li>• Reselling or redistributing the service</li>
                <li>• Automated bulk processing without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">6. Intellectual Property</h2>

              <p className="font-medium text-slate-900 mb-2">Your content:</p>
              <p className="mb-3">You own your uploaded content. By using DealCheck, you grant us permission to process it for the service (extract text, send to OpenAI, generate analysis). We don&apos;t use your content for anything else.</p>

              <p className="font-medium text-slate-900 mb-2">Our content:</p>
              <p>DealCheck&apos;s interface, branding, and prompts are our property. The AI analysis outputs are provided to you, but you can&apos;t claim we created them—they&apos;re AI-generated.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">7. Service Availability</h2>

              <ul className="space-y-2 ml-4">
                <li>• We provide the service &quot;as is&quot; without warranties</li>
                <li>• We may have downtime, bugs, or interruptions</li>
                <li>• We may change or discontinue features</li>
                <li>• We&apos;re not liable for service outages</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">8. Account Termination</h2>

              <p className="font-medium text-slate-900 mb-2">You can:</p>
              <ul className="space-y-1 ml-4 mb-3">
                <li>• Close your account anytime</li>
                <li>• Request data deletion</li>
              </ul>

              <p className="font-medium text-slate-900 mb-2">We can:</p>
              <ul className="space-y-1 ml-4">
                <li>• Suspend or terminate accounts that violate these Terms</li>
                <li>• Terminate accounts for non-payment</li>
                <li>• Discontinue the service with 30 days notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">9. Limitation of Liability</h2>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="mb-2">To the maximum extent permitted by law:</p>
                <ul className="space-y-1 ml-4 text-sm">
                  <li>• We&apos;re not liable for business losses, lost deals, or missed savings</li>
                  <li>• We&apos;re not liable for AI errors or omissions</li>
                  <li>• Our total liability is limited to what you paid us in the last 12 months</li>
                  <li>• We&apos;re not liable for third-party actions (OpenAI, Stripe, etc.)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">10. Indemnification</h2>
              <p>
                You agree to indemnify DealCheck from claims arising from your use of the service, your content, or your violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">11. Dispute Resolution</h2>

              <p className="mb-2">If there&apos;s a dispute:</p>
              <ul className="space-y-1 ml-4 mb-3">
                <li>• Contact us first to resolve it informally</li>
                <li>• If needed, disputes go to binding arbitration (not court)</li>
                <li>• No class actions</li>
                <li>• Governed by the laws of Ireland</li>
              </ul>

              <p className="text-xs text-slate-600">Note: Some jurisdictions don&apos;t allow arbitration waivers. If yours doesn&apos;t, this clause doesn&apos;t apply to you.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">12. Changes to Terms</h2>
              <p>
                We may update these Terms. Material changes will be communicated via email at least 14 days before taking effect. Continued use means you accept the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">13. General</h2>
              <ul className="space-y-1 ml-4">
                <li>• These Terms are the entire agreement</li>
                <li>• If a provision is unenforceable, the rest remains valid</li>
                <li>• We can assign these Terms; you can&apos;t</li>
                <li>• No waiver unless in writing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">14. Contact</h2>
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
                <p className="text-sm"><span className="font-medium">Questions about Terms:</span> <a href="mailto:support@dealcheck.app" className="text-emerald-600 hover:underline">support@dealcheck.app</a></p>
                <p className="text-sm mt-1"><span className="font-medium">Legal notices:</span> <a href="mailto:legal@dealcheck.app" className="text-emerald-600 hover:underline">legal@dealcheck.app</a></p>
              </div>
            </section>

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
