import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
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
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wide">Legal</span>
            </div>
            <h1 className="text-[2.25rem] sm:text-[3rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-400 mb-16">Last updated: March 1, 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-20">
          <div className="space-y-14 text-sm text-slate-700 leading-relaxed">

            {/* Summary box */}
            <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 to-white p-7 space-y-3 shadow-sm">
              <p className="font-semibold text-slate-900">Summary</p>
              <ul className="space-y-2.5">
                {[
                  'Uploaded files are processed for text extraction only, then deleted. We do not store raw files.',
                  'Data is encrypted in transit (TLS). We do not claim end-to-end encryption.',
                  'We do not sell your data or use it for advertising.',
                  'Your text is sent to OpenAI for AI analysis. See "Sub-processors" below.',
                  'You can request deletion of your account and data at any time.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">1. Data Controller</h2>
              <p className="mb-3">The data controller for DealCheck is:</p>
              <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-5 text-xs text-slate-600 space-y-1 shadow-sm">
                <p className="font-semibold text-slate-900">DealCheck</p>
                {/* TODO: Insert registered business name, address, and registration number when incorporated */}
                <p>Email: <a href="mailto:privacy@dealcheck.app" className="text-emerald-700 underline underline-offset-2 decoration-emerald-300">privacy@dealcheck.app</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">2. Information We Collect</h2>

              <p className="font-medium text-slate-900 mb-2 mt-5">Account information</p>
              <ul className="space-y-2 ml-1">
                {['Email address (for authentication)', 'Password (hashed; never stored in plaintext)', 'Account creation date and usage count'].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>

              <p className="font-medium text-slate-900 mb-2 mt-5">Analysis data (stored only if you save a deal)</p>
              <ul className="space-y-2 ml-1">
                {['Extracted text from uploaded documents', 'AI-generated analysis outputs', 'Deal metadata (title, vendor, dates)', 'Round history'].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>

              <p className="font-medium text-slate-900 mb-2 mt-5">Uploaded files</p>
              <p>PDF and image files are processed for text extraction only. <span className="font-medium">Raw files are not stored</span> on our servers after extraction completes.</p>

              <p className="font-medium text-slate-900 mb-2 mt-5">Automatically collected</p>
              <ul className="space-y-2 ml-1">
                {['IP address (security and fraud prevention)', 'Browser type, device, OS', 'Error logs and performance metrics'].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">3. Legal Basis for Processing (GDPR)</h2>
              <p className="mb-3">We process your data under the following legal bases:</p>
              <ul className="space-y-2.5 ml-1">
                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" /><span><span className="font-medium">Contract performance:</span> Processing needed to provide the Service you requested.</span></li>
                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" /><span><span className="font-medium">Legitimate interests:</span> Security, fraud prevention, service improvement — balanced against your rights.</span></li>
                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" /><span><span className="font-medium">Consent:</span> Where required (e.g., marketing). You can withdraw at any time.</span></li>
                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" /><span><span className="font-medium">Legal obligation:</span> Where required by law.</span></li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">4. How We Use Your Information</h2>
              <ul className="space-y-2 ml-1">
                {['Provide and operate the AI analysis service', 'Authenticate your account and maintain security', 'Store and retrieve your saved deal history', 'Send service-related communications', 'Monitor for fraud, abuse, and security threats', 'Improve the Service based on aggregate usage patterns', 'Comply with legal obligations'].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>
              <p className="mt-3">We do not use your uploaded content to train AI models. We do not sell your data. We do not use your data for advertising.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">5. Sub-processors &amp; Third Parties</h2>
              <p className="mb-4">We share data with the following service providers, solely to operate the Service:</p>
              <div className="rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
                      <th className="text-left px-5 py-3.5 font-semibold text-slate-500">Provider</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-slate-500">Purpose</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-slate-500">Data shared</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr className="border-b border-slate-100">
                      <td className="px-5 py-3.5 font-medium">Supabase</td>
                      <td className="px-5 py-3.5">Database, authentication</td>
                      <td className="px-5 py-3.5">Email, hashed password, deal data</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-5 py-3.5 font-medium">OpenAI</td>
                      <td className="px-5 py-3.5">AI analysis processing</td>
                      <td className="px-5 py-3.5">Extracted text from documents</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3.5 font-medium">Vercel</td>
                      <td className="px-5 py-3.5">Hosting, edge functions</td>
                      <td className="px-5 py-3.5">IP address, request metadata</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">We do not share data with advertisers, data brokers, social media platforms, or any entity for purposes unrelated to providing the Service.</p>
              <p className="mt-3"><span className="font-medium">Legal disclosure:</span> We may disclose information if required by law, court order, or government regulation.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">6. Data Security</h2>
              <ul className="space-y-2 ml-1">
                {['TLS encryption for all data in transit', 'Hashed password storage (bcrypt)', 'Row Level Security (RLS) on database', 'Immediate file deletion after text extraction', 'Access controls and authentication requirements'].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>
              <p className="mt-3">No system is 100% secure. We implement industry-standard measures but cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">7. Data Retention</h2>
              <ul className="space-y-2.5 ml-1">
                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" /><span><span className="font-medium">Uploaded files:</span> Deleted immediately after text extraction.</span></li>
                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" /><span><span className="font-medium">Saved deal data:</span> Retained while your account is active, or until you delete it.</span></li>
                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" /><span><span className="font-medium">Account data:</span> Retained until you request deletion.</span></li>
                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" /><span><span className="font-medium">Server logs:</span> Retained for up to 90 days.</span></li>
                <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" /><span><span className="font-medium">Anonymous analytics:</span> May be retained indefinitely in aggregate form.</span></li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">8. International Data Transfers</h2>
              <p className="mb-3">
                Your data may be processed in the United States and other countries where our sub-processors operate. Where data is transferred outside the EEA/UK, we rely on:
              </p>
              <ul className="space-y-2 ml-1">
                {['Standard Contractual Clauses (SCCs) approved by the European Commission', 'Adequacy decisions where applicable', 'Sub-processor DPAs with appropriate safeguards'].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">9. Your Rights</h2>
              <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
              <ul className="space-y-2 ml-1">
                {['Access your personal data', 'Correct inaccurate information', 'Request deletion of your data ("right to be forgotten")', 'Export your data in a portable format', 'Restrict or object to certain processing', 'Withdraw consent where processing is consent-based', 'Lodge a complaint with your local data protection authority'].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>
              <p className="mt-3">To exercise these rights, contact <a href="mailto:privacy@dealcheck.app" className="text-emerald-700 underline underline-offset-2 decoration-emerald-300 hover:decoration-emerald-500 transition-colors">privacy@dealcheck.app</a>. We respond within 30 days.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">10. Cookies &amp; Local Storage</h2>
              <p className="mb-3">We use essential cookies and local storage for:</p>
              <ul className="space-y-2 ml-1">
                {['Authentication and session management', 'Security and fraud prevention'].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>
              <p className="mt-3">We do not use third-party advertising, tracking, or analytics cookies.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">11. Children&apos;s Privacy</h2>
              <p>DealCheck is not intended for individuals under 18. We do not knowingly collect personal information from children. If you believe we have, contact us immediately for deletion.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">12. Changes to This Policy</h2>
              <p>We may update this policy periodically. Material changes will be communicated via email or a notice in the Service at least 14 days before taking effect. Continued use constitutes acceptance.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">13. Contact</h2>
              <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm space-y-2">
                <p><span className="font-medium text-slate-900">Privacy inquiries:</span> <a href="mailto:privacy@dealcheck.app" className="text-emerald-700 underline underline-offset-2 decoration-emerald-300">privacy@dealcheck.app</a></p>
                <p><span className="font-medium text-slate-900">General support:</span> <a href="mailto:support@dealcheck.app" className="text-emerald-700 underline underline-offset-2 decoration-emerald-300">support@dealcheck.app</a></p>
              </div>
            </section>

            <div className="pt-8 mt-8 border-t border-slate-200/60">
              <p className="text-xs text-slate-500">
                This Privacy Policy is designed to be transparent about our practices. If anything is unclear, please reach out — we&apos;re happy to explain.
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
