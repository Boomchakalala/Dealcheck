import Link from 'next/link'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <UnifiedHeader variant="public" />

      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-50/60 to-white">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm mb-6">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wide">Legal</span>
            </div>
            <h1 className="text-[2.25rem] sm:text-[3rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-400">Last updated: March 13, 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 pb-20">
          <div className="space-y-10 text-sm text-slate-700 leading-relaxed">

            {/* Quick Summary box */}
            <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 to-white p-6">
              <p className="font-semibold text-slate-900 mb-3">Quick Summary</p>
              <ul className="space-y-2 text-sm">
                {[
                  'Uploaded files are deleted immediately after processing — we never store your raw documents.',
                  'Only the AI-generated analysis is saved, and only if you choose to keep it.',
                  'Extracted text is sent to Anthropic (Claude AI) for analysis — they don\'t train on API data.',
                  'We don\'t sell, share, or use your data for advertising.',
                  'You can delete your account and all associated data anytime.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-600">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">1. Who We Are</h2>
              <p className="mb-2">
                TermLift is a deal analysis platform operated by its founding team. We help procurement
                and finance teams analyze supplier quotes and contracts using AI to surface negotiation
                leverage and identify risks.
              </p>
              <p className="text-xs text-slate-600">
                Contact: <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">2. What We Collect</h2>

              <div className="space-y-4">
                <div>
                  <p className="font-medium text-slate-900 mb-1">Account Info:</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Email address (for login and service communications)</li>
                    <li>• Password (hashed — we never store or see your plaintext password)</li>
                    <li>• Usage count and plan/subscription status</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">Deal Data (only if you choose to save):</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Extracted text from your uploaded documents</li>
                    <li>• AI-generated analysis output (negotiation insights, risk flags, benchmarks)</li>
                    <li>• Deal metadata (title, vendor name, deal type, etc.)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">Payment Info:</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Processed by Stripe (coming soon) — we never store your card details</li>
                    <li>• We only see transaction IDs and subscription status</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">Automatically Collected:</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• IP address, browser type, and device information</li>
                    <li>• Usage patterns and feature interaction via PostHog analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">3. How We Use Your Data</h2>
              <ul className="space-y-2 ml-4">
                <li>• Provide the AI-powered deal analysis service</li>
                <li>• Manage your account and subscription</li>
                <li>• Process payments</li>
                <li>• Send service updates and important notifications (not marketing unless you opt in)</li>
                <li>• Improve the service based on aggregated, anonymized usage patterns</li>
                <li>• Prevent fraud, abuse, and unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Who We Share Data With</h2>
              <p className="mb-4">We only share data with the service providers necessary to run TermLift. We do not sell, rent, or share your data with advertisers, data brokers, or social media platforms.</p>

              <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">Anthropic</p>
                  <p className="text-sm">Extracted text from your documents is sent to Anthropic&apos;s Claude AI for analysis. Anthropic does not use API data to train their models. See their <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">privacy policy</a> for details.</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">Supabase</p>
                  <p className="text-sm">Database and authentication hosting. SOC 2 Type II certified. All data encrypted at rest and in transit.</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">Vercel</p>
                  <p className="text-sm">Application hosting and deployment. SOC 2 certified with enterprise-grade infrastructure.</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">PostHog</p>
                  <p className="text-sm">Anonymized product analytics to understand how features are used and improve the service. No personally identifiable information is shared for analytics purposes.</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">Stripe <span className="text-xs text-slate-400 font-normal">(coming soon)</span></p>
                  <p className="text-sm">Payment processing. Stripe handles all card data securely under PCI DSS Level 1 compliance. We never see or store your full card number.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Data Retention</h2>
              <ul className="space-y-2 ml-4">
                <li>• <span className="font-medium">Uploaded files:</span> Deleted immediately after text extraction — we never store your raw documents</li>
                <li>• <span className="font-medium">Saved deals:</span> Kept until you delete them or close your account</li>
                <li>• <span className="font-medium">Account data:</span> Kept until you request deletion</li>
                <li>• <span className="font-medium">Analytics logs:</span> Retained for up to 90 days, then automatically purged</li>
              </ul>
              <p className="mt-3 text-sm">We do not sell or share your data with advertisers. When you delete data, it is permanently removed from our systems.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">6. Cookies</h2>
              <p className="mb-3">We use minimal cookies, strictly for functionality and analytics. We do not use advertising or tracking cookies.</p>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-slate-900 mb-1">Session Authentication:</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Supabase auth cookies to keep you logged in securely</li>
                    <li>• These are essential for the service to function</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">Analytics:</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• PostHog cookies for anonymized product analytics</li>
                    <li>• Used to understand usage patterns and improve the service</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">What we don&apos;t use:</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• No advertising cookies</li>
                    <li>• No third-party tracking cookies</li>
                    <li>• No social media cookies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">7. Your Rights (GDPR)</h2>
              <p className="mb-3">Under the General Data Protection Regulation (GDPR) and similar data protection laws, you have the following rights:</p>
              <ul className="space-y-2 ml-4">
                <li>• <span className="font-medium">Access:</span> Request a copy of all personal data we hold about you</li>
                <li>• <span className="font-medium">Delete:</span> Request deletion of your account and all associated data at any time — this is also available directly in your profile settings</li>
                <li>• <span className="font-medium">Correct:</span> Update or correct any inaccurate personal information</li>
                <li>• <span className="font-medium">Export:</span> Receive your data in a portable, machine-readable format</li>
                <li>• <span className="font-medium">Object:</span> Object to certain types of data processing</li>
              </ul>
              <p className="mt-3 text-sm">
                To exercise any of these rights, contact us at{' '}
                <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>.
                We will respond to your request within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">8. International Transfers</h2>
              <p>
                Your data may be processed in the United States and other countries where our service
                providers (Anthropic, Supabase, Vercel, Stripe) operate. For transfers of personal data
                outside the European Economic Area (EEA) and the United Kingdom, we rely on Standard
                Contractual Clauses (SCCs) approved by the European Commission to ensure adequate
                protection of your data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">9. Children</h2>
              <p>
                TermLift is not intended for users under the age of 18. We do not knowingly collect
                personal data from children. If you believe a child has provided us with personal data,
                please contact us at{' '}
                <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>{' '}
                and we will promptly delete it.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. If we make material changes, we will
                notify you via email at least 14 days before the changes take effect. Continued use of
                TermLift after changes take effect constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">11. Contact</h2>
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
                <p className="text-sm">
                  <span className="font-medium">Privacy questions:</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Data requests:</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">General support:</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>
                </p>
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
