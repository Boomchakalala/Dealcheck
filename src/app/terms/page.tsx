import Link from 'next/link'
import { CheckCircle, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600 text-sm mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using DealCheck ("the Service"), you accept and agree to be bound by the
              terms and provisions of this agreement. If you do not agree to these terms, please do not use
              our Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              DealCheck is an AI-powered procurement analysis platform designed to help professionals
              analyze supplier quotes, contracts, and commercial proposals. The Service provides automated
              insights, risk analysis, negotiation guidance, and draft communications.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Critical Disclaimers</h2>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Not Legal, Financial, or Professional Advice</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  DealCheck does not provide legal, financial, tax, or professional advice of any kind.
                  All analysis, suggestions, and guidance are for informational and educational purposes only.
                  Always consult with licensed attorneys, accountants, or other qualified professionals before
                  making business decisions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No Proprietary Benchmark Data</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We do not have access to proprietary pricing benchmarks, market rate databases, or
                  confidential industry data. All analysis is based solely on the information you provide
                  and general AI knowledge.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Your Responsibility</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  You are solely responsible for all business decisions, contract negotiations, pricing
                  determinations, and legal compliance. DealCheck is a tool to assist your analysis—not
                  a substitute for professional judgment.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Generated Content</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Our Service uses artificial intelligence to generate analysis and recommendations.
                  While we strive for accuracy, AI systems can make errors, miss important details, or
                  provide incomplete information. Always verify all outputs independently.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You agree to:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Provide accurate, complete information</li>
              <li>• Use the Service lawfully and ethically</li>
              <li>• Only upload content you have the right to share</li>
              <li>• Not share confidential information without proper authorization</li>
              <li>• Verify all AI-generated suggestions before acting on them</li>
              <li>• Comply with all applicable laws and regulations</li>
              <li>• Not attempt to reverse engineer, hack, or abuse the Service</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Privacy & File Handling</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We take your privacy seriously. Uploaded files (PDFs, images) are processed for text
              extraction only and are immediately deleted after processing. We do not store your raw files.
              Analysis outputs and metadata are stored in accordance with our{' '}
              <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Privacy Policy
              </Link>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Usage Limits</h2>
            <p className="text-gray-700 leading-relaxed">
              Free trial accounts are limited to 2 analysis rounds. Registered free accounts receive
              an additional 2 rounds. Additional usage requires a paid subscription plan.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain all rights to your uploaded content and data. We retain all rights to the
              DealCheck platform, brand, software, analysis frameworks, and AI model outputs. By using
              the Service, you grant us a limited license to process your content to provide the Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              DealCheck is provided "as is" and "as available" without warranties of any kind, either
              express or implied. We are not liable for:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Business decisions made based on our analysis</li>
              <li>• Financial losses from negotiations or contracts</li>
              <li>• Errors, omissions, or inaccuracies in AI-generated content</li>
              <li>• Service interruptions or data loss</li>
              <li>• Indirect, incidental, or consequential damages</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our total liability to you for any claim shall not exceed the amount you paid us in the
              12 months preceding the claim.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Service Availability</h2>
            <p className="text-gray-700 leading-relaxed">
              We strive to maintain high service availability but do not guarantee uninterrupted access.
              We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to terminate or suspend your access immediately, without prior notice,
              for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of material
              changes via email or through the Service. Continued use after changes constitutes acceptance
              of the modified terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws, without
              regard to conflict of law provisions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@dealcheck.ai" className="text-emerald-600 hover:text-emerald-700 font-medium">
                legal@dealcheck.ai
              </a>
            </p>
          </section>

          <div className="mt-16 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 leading-relaxed">
              By using DealCheck, you acknowledge that you have read, understood, and agree to be bound
              by these Terms of Service.
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
