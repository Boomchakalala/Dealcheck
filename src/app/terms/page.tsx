import Link from 'next/link'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { Scale } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <UnifiedHeader variant="public" />

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
            <p className="text-sm text-slate-400">Last updated: March 13, 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 pb-20">
          <div className="space-y-10 text-sm text-slate-700 leading-relaxed">

            {/* 1. Acceptance */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">1. Acceptance</h2>
              <p>By accessing or using TermLift, you agree to be bound by these Terms of Service. If you don&apos;t agree, please don&apos;t use the service. These terms apply to all users, whether you have an account or not.</p>
            </section>

            {/* 2. What the Service Is */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">2. What the Service Is</h2>
              <p className="mb-2">TermLift analyzes vendor quotes and contracts using AI, specifically Anthropic&apos;s Claude. Here&apos;s how it works:</p>
              <ul className="space-y-2 ml-4">
                <li>• You upload a document (quote, contract, proposal, etc.)</li>
                <li>• We extract text from the document</li>
                <li>• The extracted text is sent to the AI for analysis</li>
                <li>• You receive negotiation insights including red flags, savings opportunities, negotiation plans, and draft emails</li>
                <li>• Uploaded files are deleted after processing</li>
              </ul>
            </section>

            {/* 3. What the Service Is NOT */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">3. What the Service Is NOT</h2>
              <div className="rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 to-white p-6">
                <p className="font-semibold text-amber-900 mb-3">Important Disclaimers</p>
                <ul className="space-y-2 text-sm">
                  {[
                    'TermLift is NOT legal, financial, or professional advice.',
                    'TermLift is NOT a guarantee of savings or improved contract terms.',
                    'AI analysis may be incomplete, inaccurate, or miss important details.',
                    'Always review outputs yourself and consult licensed professionals before making decisions.',
                    'Results vary by deal — past analyses don\'t predict future outcomes.',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-amber-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 4. Your Responsibilities */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Your Responsibilities</h2>
              <p className="mb-3">When using TermLift, you agree to:</p>
              <ul className="space-y-2 ml-4">
                <li>• Provide accurate account information</li>
                <li>• Keep your password secure</li>
                <li>• Only upload content you have the right to share</li>
                <li>• Not abuse, hack, or reverse-engineer the service</li>
                <li>• Not share your account credentials with others</li>
                <li>• Not use the service for automated bulk processing without our written permission</li>
                <li>• Comply with all applicable laws</li>
              </ul>
            </section>

            {/* 5. Pricing & Payment */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Pricing & Payment</h2>

              <div className="space-y-3 mb-4">
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">Starter (Free)</p>
                  <p className="text-sm">4 total analyses — 1 without signing up, 3 more after creating an account.</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">Pro — €39/month <span className="text-xs text-slate-400 font-normal">(coming soon)</span></p>
                  <p className="text-sm">Unlimited analyses for individuals.</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">Business — €149/month <span className="text-xs text-slate-400 font-normal">(coming soon)</span></p>
                  <p className="text-sm">Team workspace with unlimited analyses.</p>
                </div>
              </div>

              <ul className="space-y-2 ml-4">
                <li>• When paid plans launch, payments will be processed securely via Stripe</li>
                <li>• Subscriptions renew automatically until cancelled</li>
                <li>• You can cancel anytime from your profile</li>
                <li>• No refunds for partial billing periods</li>
                <li>• After cancellation, access continues until the end of your current billing period</li>
                <li>• We may change pricing with at least 30 days notice</li>
              </ul>
            </section>

            {/* 6. Intellectual Property */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">6. Intellectual Property</h2>

              <div className="space-y-4">
                <div>
                  <p className="font-medium text-slate-900 mb-1">Your Content</p>
                  <p>You own what you upload. By using the service, you grant us a limited, temporary license to process your content solely for the purpose of providing the analysis. We don&apos;t claim ownership of your documents.</p>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">Our Content</p>
                  <p>TermLift&apos;s interface, branding, design, and proprietary prompts are our property. You may not copy, modify, or redistribute them.</p>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">AI Outputs</p>
                  <p>Analysis results are provided to you for your use. However, they are AI-generated and should not be treated as professional advice. You&apos;re free to use the outputs, but you do so at your own discretion and risk.</p>
                </div>
              </div>
            </section>

            {/* 7. Service Availability */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">7. Service Availability</h2>
              <p className="mb-2">TermLift is provided &quot;as is&quot; and &quot;as available.&quot; We do our best to keep things running smoothly, but:</p>
              <ul className="space-y-2 ml-4">
                <li>• The service may experience downtime or bugs</li>
                <li>• We may add, change, or remove features at any time</li>
                <li>• We are not liable for outages, data loss, or service interruptions</li>
                <li>• We don&apos;t guarantee that the service will meet all of your requirements</li>
              </ul>
            </section>

            {/* 8. Account Termination */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">8. Account Termination</h2>
              <ul className="space-y-2 ml-4">
                <li>• You can close your account at any time and request deletion of your data</li>
                <li>• We may suspend or terminate your account if you violate these Terms or fail to pay</li>
                <li>• We may discontinue the service entirely with at least 30 days notice</li>
                <li>• Upon termination, your right to use the service ends immediately (except for access through a paid billing period you&apos;ve already paid for)</li>
              </ul>
            </section>

            {/* 9. Limitation of Liability */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">9. Limitation of Liability</h2>
              <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50/60 to-white p-6">
                <p className="font-semibold text-slate-900 mb-3">To the maximum extent permitted by law:</p>
                <ul className="space-y-2 text-sm">
                  {[
                    'TermLift is not liable for business losses, lost deals, or missed savings opportunities.',
                    'TermLift is not liable for errors, omissions, or inaccuracies in AI-generated analysis.',
                    'Our total liability is limited to the amount you have paid us in the last 12 months.',
                    'TermLift is not liable for the actions or failures of third-party services (Anthropic, Stripe, etc.).',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-slate-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 10. Indemnification */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">10. Indemnification</h2>
              <p>You agree to indemnify and hold TermLift harmless from any claims, damages, or expenses (including reasonable legal fees) arising from your use of the service, the content you upload, or your violation of these Terms.</p>
            </section>

            {/* 11. Dispute Resolution */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">11. Dispute Resolution</h2>
              <ul className="space-y-2 ml-4">
                <li>• <span className="font-medium">Talk to us first:</span> If you have a dispute, contact us at <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a> and we&apos;ll try to resolve it informally within 30 days.</li>
                <li>• <span className="font-medium">Binding arbitration:</span> If informal resolution fails, disputes will be resolved through binding arbitration rather than in court.</li>
                <li>• <span className="font-medium">No class actions:</span> Disputes must be brought individually, not as part of a class action or representative proceeding.</li>
                <li>• <span className="font-medium">Governing law:</span> These Terms are governed by the laws of Ireland.</li>
              </ul>
              <p className="mt-3 text-sm text-slate-500">Note: Some jurisdictions don&apos;t allow arbitration waivers or class action waivers. In those jurisdictions, the applicable restrictions above will not apply to you, and disputes will be resolved in the courts of Ireland.</p>
            </section>

            {/* 12. Changes to These Terms */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">12. Changes to These Terms</h2>
              <p>We may update these Terms from time to time. For material changes, we&apos;ll notify you via email at least 14 days before they take effect. Continued use of the service after changes take effect means you accept the updated Terms.</p>
            </section>

            {/* 13. General */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">13. General</h2>
              <ul className="space-y-2 ml-4">
                <li>• <span className="font-medium">Entire agreement:</span> These Terms, together with our Privacy Policy, constitute the entire agreement between you and TermLift.</li>
                <li>• <span className="font-medium">Severability:</span> If any provision of these Terms is found to be unenforceable, the remaining provisions continue in full force.</li>
                <li>• <span className="font-medium">Assignment:</span> We may assign our rights under these Terms. You may not assign yours without our written consent.</li>
                <li>• <span className="font-medium">No waiver:</span> Our failure to enforce any provision is not a waiver of that provision. Any waiver must be in writing.</li>
              </ul>
            </section>

            {/* 14. Contact */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">14. Contact</h2>
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
                <p className="text-sm">Questions about these Terms? Reach out to us at <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a></p>
              </div>
            </section>

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
