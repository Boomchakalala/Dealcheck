import Link from 'next/link'

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400 mb-16">Last updated: March 1, 2026</p>

          <div className="space-y-14 text-sm text-slate-700 leading-relaxed">

            {/* Summary box */}
            <div className="border border-slate-200 rounded-xl p-6 space-y-3 bg-slate-50/50">
              <p className="font-semibold text-slate-900">Summary</p>
              <ul className="space-y-2">
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Uploaded files are processed for text extraction only, then deleted. We do not store raw files.</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Data is encrypted in transit (TLS). We do not claim end-to-end encryption.</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> We do not sell your data or use it for advertising.</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Your text is sent to OpenAI for AI analysis. See &ldquo;Sub-processors&rdquo; below.</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> You can request deletion of your account and data at any time.</li>
              </ul>
            </div>

            {/* 1. Controller */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">1. Data Controller</h2>
              <p className="mb-3">
                The data controller for DealCheck is:
              </p>
              <div className="border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1">
                <p className="font-medium text-slate-900">DealCheck</p>
                {/* TODO: Insert registered business name, address, and registration number when incorporated */}
                <p>Email: <a href="mailto:privacy@dealcheck.app" className="text-slate-900 underline underline-offset-2 decoration-slate-300">privacy@dealcheck.app</a></p>
              </div>
            </section>

            {/* 2. Information We Collect */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">2. Information We Collect</h2>

              <p className="font-medium text-slate-900 mb-2 mt-5">Account information</p>
              <ul className="space-y-1.5 ml-1">
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Email address (for authentication)</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Password (hashed; never stored in plaintext)</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Account creation date and usage count</li>
              </ul>

              <p className="font-medium text-slate-900 mb-2 mt-5">Analysis data (stored only if you save a deal)</p>
              <ul className="space-y-1.5 ml-1">
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Extracted text from uploaded documents</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> AI-generated analysis outputs</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Deal metadata (title, vendor, dates)</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Round history</li>
              </ul>

              <p className="font-medium text-slate-900 mb-2 mt-5">Uploaded files</p>
              <p>PDF and image files are processed for text extraction only. <span className="font-medium">Raw files are not stored</span> on our servers after extraction completes.</p>

              <p className="font-medium text-slate-900 mb-2 mt-5">Automatically collected</p>
              <ul className="space-y-1.5 ml-1">
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> IP address (security and fraud prevention)</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Browser type, device, OS</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Error logs and performance metrics</li>
              </ul>
            </section>

            {/* 3. Legal Basis */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">3. Legal Basis for Processing (GDPR)</h2>
              <p className="mb-3">We process your data under the following legal bases:</p>
              <ul className="space-y-2 ml-1">
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> <span><span className="font-medium">Contract performance:</span> Processing needed to provide the Service you requested (account management, analysis).</span></li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> <span><span className="font-medium">Legitimate interests:</span> Security, fraud prevention, service improvement, and analytics — balanced against your rights.</span></li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> <span><span className="font-medium">Consent:</span> Where required (e.g., marketing communications). You can withdraw consent at any time.</span></li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> <span><span className="font-medium">Legal obligation:</span> Where required by law (e.g., tax records, court orders).</span></li>
              </ul>
            </section>

            {/* 4. How We Use */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">4. How We Use Your Information</h2>
              <ul className="space-y-2 ml-1">
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Provide and operate the AI analysis service</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Authenticate your account and maintain security</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Store and retrieve your saved deal history</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Send service-related communications (account updates, security alerts)</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Monitor for fraud, abuse, and security threats</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Improve the Service based on aggregate usage patterns</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Comply with legal obligations</li>
              </ul>
              <p className="mt-3">We do not use your uploaded content to train AI models. We do not sell your data. We do not use your data for advertising.</p>
            </section>

            {/* 5. Sub-processors */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">5. Sub-processors &amp; Third Parties</h2>
              <p className="mb-4">We share data with the following service providers, solely to operate the Service:</p>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                      <th className="text-left px-4 py-3 font-medium text-slate-500">Provider</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-500">Purpose</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-500">Data shared</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr className="border-b border-slate-100">
                      <td className="px-4 py-3 font-medium">Supabase</td>
                      <td className="px-4 py-3">Database, authentication</td>
                      <td className="px-4 py-3">Email, hashed password, deal data</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-4 py-3 font-medium">OpenAI</td>
                      <td className="px-4 py-3">AI analysis processing</td>
                      <td className="px-4 py-3">Extracted text from documents</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Vercel</td>
                      <td className="px-4 py-3">Hosting, edge functions</td>
                      <td className="px-4 py-3">IP address, request metadata</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">We do not share data with advertisers, data brokers, social media platforms, or any entity for purposes unrelated to providing the Service.</p>
              <p className="mt-3"><span className="font-medium">Legal disclosure:</span> We may disclose information if required by law, court order, or government regulation, or to protect our rights, safety, and property.</p>
            </section>

            {/* 6. Security */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">6. Data Security</h2>
              <ul className="space-y-2 ml-1">
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> TLS encryption for all data in transit</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Hashed password storage (bcrypt)</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Row Level Security (RLS) on database</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Immediate file deletion after text extraction</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Access controls and authentication requirements</li>
              </ul>
              <p className="mt-3">No system is 100% secure. We implement industry-standard measures but cannot guarantee absolute security. You are responsible for keeping your account credentials confidential.</p>
            </section>

            {/* 7. Retention */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">7. Data Retention</h2>
              <ul className="space-y-2 ml-1">
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> <span><span className="font-medium">Uploaded files:</span> Deleted immediately after text extraction.</span></li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> <span><span className="font-medium">Saved deal data:</span> Retained while your account is active, or until you delete it.</span></li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> <span><span className="font-medium">Account data:</span> Retained until you request deletion.</span></li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> <span><span className="font-medium">Server logs:</span> Retained for up to 90 days for security and debugging.</span></li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> <span><span className="font-medium">Anonymous analytics:</span> May be retained indefinitely in aggregate form.</span></li>
              </ul>
            </section>

            {/* 8. International Transfers */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">8. International Data Transfers</h2>
              <p className="mb-3">
                Your data may be processed in the United States and other countries where our sub-processors operate. Where data is transferred outside the EEA/UK, we rely on:
              </p>
              <ul className="space-y-2 ml-1">
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Adequacy decisions where applicable</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Sub-processor DPAs with appropriate safeguards</li>
              </ul>
              {/* TODO: Confirm specific transfer mechanisms with each sub-processor */}
            </section>

            {/* 9. Your Rights */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">9. Your Rights</h2>
              <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
              <ul className="space-y-2 ml-1">
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Access your personal data</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Correct inaccurate information</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Request deletion of your data (&ldquo;right to be forgotten&rdquo;)</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Export your data in a portable format</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Restrict or object to certain processing</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Withdraw consent where processing is consent-based</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Lodge a complaint with your local data protection authority</li>
              </ul>
              <p className="mt-3">To exercise these rights, contact <a href="mailto:privacy@dealcheck.app" className="text-slate-900 underline underline-offset-2 decoration-slate-300">privacy@dealcheck.app</a>. We respond within 30 days.</p>
            </section>

            {/* 10. Cookies */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">10. Cookies &amp; Local Storage</h2>
              <p className="mb-3">We use essential cookies and local storage for:</p>
              <ul className="space-y-2 ml-1">
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Authentication and session management</li>
                <li className="flex gap-2"><span className="text-slate-400">&ndash;</span> Security and fraud prevention</li>
              </ul>
              <p className="mt-3">We do not use third-party advertising, tracking, or analytics cookies.</p>
            </section>

            {/* 11. Children */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">11. Children&apos;s Privacy</h2>
              <p>DealCheck is not intended for individuals under 18. We do not knowingly collect personal information from children. If you believe we have, contact us immediately for deletion.</p>
            </section>

            {/* 12. Changes */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">12. Changes to This Policy</h2>
              <p>We may update this policy periodically. Material changes will be communicated via email or a notice in the Service at least 14 days before taking effect. Continued use constitutes acceptance.</p>
            </section>

            {/* 13. Contact */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">13. Contact</h2>
              <div className="border border-slate-200 rounded-lg p-4 text-xs space-y-2">
                <p><span className="font-medium text-slate-900">Privacy inquiries:</span> <a href="mailto:privacy@dealcheck.app" className="text-slate-700 underline underline-offset-2 decoration-slate-300">privacy@dealcheck.app</a></p>
                <p><span className="font-medium text-slate-900">General support:</span> <a href="mailto:support@dealcheck.app" className="text-slate-700 underline underline-offset-2 decoration-slate-300">support@dealcheck.app</a></p>
              </div>
            </section>

            {/* Closing */}
            <div className="pt-8 mt-8 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                This Privacy Policy is designed to be transparent about our practices. If anything is unclear, please reach out — we&apos;re happy to explain.
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
