import Link from 'next/link'
import { CheckCircle, ArrowLeft, Shield, Lock, Eye, FileX } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DealCheck</span>
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 text-sm mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          {/* Key Privacy Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 not-prose">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <FileX className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Files Never Stored</h3>
              <p className="text-sm text-gray-700">
                Uploaded PDFs and images are processed for text extraction only, then immediately deleted.
                We never store your raw files.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <Lock className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">End-to-End Encryption</h3>
              <p className="text-sm text-gray-700">
                All data transmission is encrypted using industry-standard TLS/SSL protocols.
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <Shield className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Your Data, Your Control</h3>
              <p className="text-sm text-gray-700">
                You can request deletion of your account and all associated data at any time.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <Eye className="w-8 h-8 text-amber-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">No Sale of Data</h3>
              <p className="text-sm text-gray-700">
                We never sell your personal information or analysis data to third parties.
              </p>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Account Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you create an account, we collect:
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>• Email address (required for authentication)</li>
              <li>• Password (encrypted and never stored in plain text)</li>
              <li>• Account creation date</li>
              <li>• Usage statistics (number of analyses performed)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Analysis Data</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you use our Service, we store:
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>• Extracted text from your uploaded documents (PDFs, images)</li>
              <li>• AI-generated analysis outputs</li>
              <li>• Deal metadata (title, vendor name, dates)</li>
              <li>• Round history for each deal</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              <strong>Important:</strong> We do NOT store your original PDF or image files. Files are processed
              for text extraction only and deleted immediately after processing.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Automatically Collected Information</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Browser type and version</li>
              <li>• Device type and operating system</li>
              <li>• IP address (for security and fraud prevention)</li>
              <li>• Usage patterns and interaction data</li>
              <li>• Error logs and performance metrics</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Provide and improve our AI analysis services</li>
              <li>• Authenticate your account and maintain security</li>
              <li>• Store and retrieve your analysis history</li>
              <li>• Send service-related communications (account updates, security alerts)</li>
              <li>• Monitor and prevent fraud, abuse, and security threats</li>
              <li>• Analyze usage patterns to improve the Service</li>
              <li>• Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Sharing & Third Parties</h2>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Service Providers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We share limited data with trusted third-party service providers:
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>• <strong>Supabase:</strong> Database and authentication (data hosting)</li>
              <li>• <strong>OpenAI:</strong> AI analysis processing (text is sent for analysis)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">We Do NOT Share With</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Advertisers or marketing companies</li>
              <li>• Data brokers or aggregators</li>
              <li>• Social media platforms</li>
              <li>• Any entity for purposes unrelated to providing our Service</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Legal Disclosure:</strong> We may disclose information if required by law, court order,
              or government regulation, or to protect our rights and safety.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• TLS/SSL encryption for all data transmission</li>
              <li>• Encrypted password storage (bcrypt hashing)</li>
              <li>• Secure database with Row Level Security (RLS)</li>
              <li>• Regular security audits and updates</li>
              <li>• Access controls and authentication requirements</li>
              <li>• Immediate file deletion after text extraction</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              While we take security seriously, no system is 100% secure. You are responsible for
              keeping your account credentials confidential.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Uploaded Files:</strong> Deleted immediately after text extraction</li>
              <li>• <strong>Analysis Data:</strong> Retained while your account is active</li>
              <li>• <strong>Account Data:</strong> Retained until you request deletion</li>
              <li>• <strong>Usage Logs:</strong> Retained for up to 90 days for security purposes</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Access your personal data and analysis history</li>
              <li>• Correct inaccurate information</li>
              <li>• Request deletion of your account and all associated data</li>
              <li>• Export your data in a machine-readable format</li>
              <li>• Opt out of non-essential communications</li>
              <li>• Withdraw consent for data processing (where applicable)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@dealcheck.ai" className="text-emerald-600 hover:text-emerald-700 font-medium">
                privacy@dealcheck.ai
              </a>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies & Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use essential cookies and local storage for:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Authentication and session management</li>
              <li>• Trial usage tracking (stored locally in your browser)</li>
              <li>• Security and fraud prevention</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We do not use third-party advertising or tracking cookies.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your data may be processed and stored in data centers located in various countries.
              We ensure that all international transfers comply with applicable data protection laws
              and maintain appropriate safeguards.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              DealCheck is not intended for use by individuals under the age of 18. We do not knowingly
              collect personal information from children. If you believe we have collected information
              from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes
              via email or through a prominent notice on our Service. Your continued use after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For privacy-related questions, concerns, or data requests:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <p className="text-gray-900 font-medium mb-2">Email:</p>
              <a href="mailto:privacy@dealcheck.ai" className="text-emerald-600 hover:text-emerald-700 font-medium">
                privacy@dealcheck.ai
              </a>
              <p className="text-gray-900 font-medium mt-4 mb-2">General Inquiries:</p>
              <a href="mailto:support@dealcheck.ai" className="text-emerald-600 hover:text-emerald-700 font-medium">
                support@dealcheck.ai
              </a>
            </div>
          </section>

          <div className="mt-16 p-6 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-sm text-emerald-900 leading-relaxed font-medium">
              Your privacy matters. We're committed to protecting your data and being transparent about
              our practices. If you have any questions, we're here to help.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-8 mt-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <div className="flex justify-center gap-6">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <Link href="/about" className="hover:text-gray-900">About</Link>
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
          </div>
          <p className="mt-4 text-gray-500">© {new Date().getFullYear()} DealCheck. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
