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
            <p className="text-sm text-slate-400">Last updated: March 5, 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 pb-20">
          <div className="space-y-10 text-sm text-slate-700 leading-relaxed">

            {/* Summary box */}
            <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 to-white p-6">
              <p className="font-semibold text-slate-900 mb-3">Quick Summary</p>
              <ul className="space-y-2 text-sm">
                {[
                  'Uploaded files deleted after processing. We don\'t store raw files.',
                  'Only AI outputs saved if you choose to keep them.',
                  'Data sent to OpenAI for analysis.',
                  'We don\'t sell your data or use it for ads.',
                  'You can delete your account and data anytime.',
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
              <p className="mb-2">TermLift is operated by its founding team. Company registration is in progress.</p>
              <p className="text-xs text-slate-600">Contact: <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a></p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">2. What We Collect</h2>

              <div className="space-y-4">
                <div>
                  <p className="font-medium text-slate-900 mb-1">Account Info:</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Email address (for login)</li>
                    <li>• Password (hashed, never plaintext)</li>
                    <li>• Usage count & subscription status</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">Deal Data (only if you save):</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Extracted text from documents</li>
                    <li>• AI-generated analysis</li>
                    <li>• Deal metadata (title, vendor, etc.)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">Payment Info:</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Processed by Stripe (we don't store card details)</li>
                    <li>• We see transaction IDs and subscription status</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-slate-900 mb-1">Automatically:</p>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• IP address, browser type, device info</li>
                    <li>• Usage patterns and error logs</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">3. How We Use Your Data</h2>
              <ul className="space-y-2 ml-4">
                <li>• Provide the AI analysis service</li>
                <li>• Manage your account and subscription</li>
                <li>• Process payments</li>
                <li>• Send service updates (not marketing unless you opt in)</li>
                <li>• Improve the service</li>
                <li>• Prevent fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Who We Share Data With</h2>

              <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">OpenAI</p>
                  <p className="text-sm">Extracted text sent for AI analysis. They don't use API data to train models.</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">Supabase</p>
                  <p className="text-sm">Database hosting. SOC 2 certified, data encrypted at rest.</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">Stripe</p>
                  <p className="text-sm">Payment processing. They handle all card data securely.</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900 mb-1">Vercel</p>
                  <p className="text-sm">Application hosting. Sees request metadata.</p>
                </div>
              </div>

              <p className="mt-3 text-sm">We don't share data with advertisers, brokers, or social media platforms.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Your Rights</h2>
              <ul className="space-y-2 ml-4">
                <li>• <span className="font-medium">Access:</span> Request a copy of your data</li>
                <li>• <span className="font-medium">Delete:</span> Request account deletion anytime</li>
                <li>• <span className="font-medium">Correct:</span> Update inaccurate information</li>
                <li>• <span className="font-medium">Export:</span> Get your data in portable format</li>
                <li>• <span className="font-medium">Object:</span> Object to certain processing</li>
              </ul>
              <p className="mt-3 text-sm">To exercise these rights: <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a></p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">6. Data Retention</h2>
              <ul className="space-y-2 ml-4">
                <li>• <span className="font-medium">Uploaded files:</span> Deleted immediately after processing</li>
                <li>• <span className="font-medium">Saved deals:</span> Until you delete them or close your account</li>
                <li>• <span className="font-medium">Account data:</span> Until you request deletion</li>
                <li>• <span className="font-medium">Logs:</span> Up to 90 days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">7. Security</h2>
              <p className="mb-2">We use standard security practices:</p>
              <ul className="space-y-1 ml-4">
                <li>• TLS encryption in transit</li>
                <li>• Password hashing (bcrypt)</li>
                <li>• Database access controls (RLS)</li>
                <li>• Immediate file deletion after processing</li>
              </ul>
              <p className="mt-3 text-sm">See our <Link href="/security" className="text-emerald-600 hover:underline">Security page</Link> for details.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">8. International Transfers</h2>
              <p>Your data may be processed in the US and other countries where our service providers operate. We rely on Standard Contractual Clauses (SCCs) for transfers outside the EEA/UK.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">9. Children</h2>
              <p>TermLift is not for users under 18. We don't knowingly collect data from children.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">10. Changes to This Policy</h2>
              <p>We may update this policy. Material changes will be communicated via email at least 14 days before taking effect.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">11. Contact</h2>
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
                <p className="text-sm"><span className="font-medium">Privacy questions:</span> <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a></p>
                <p className="text-sm mt-1"><span className="font-medium">General support:</span> <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a></p>
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
