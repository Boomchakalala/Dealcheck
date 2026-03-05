import Link from 'next/link'
import { Header } from '@/components/Header'
import { Trash2, FileText, Lock, Shield, ArrowRight } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header variant="public" />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-50/60 to-white">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-[2.5rem] sm:text-[3.5rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-4">
                How We Handle Your Data
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Transparent about what we do with your quotes and how we protect your information.
              </p>
            </div>
          </div>
        </div>


        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-20">

          {/* Key principle */}
          <div className="text-center mb-16">
            <p className="text-xl text-slate-700 font-medium max-w-2xl mx-auto">
              We don&apos;t store your uploaded files. Only the AI-generated analysis is saved if you choose to keep it.
            </p>
          </div>

          {/* What happens to your data - Visual flow */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">What Happens to Your Files</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1: Upload */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/60 p-8 text-center">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">1. You Upload</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your PDF or image is uploaded and we extract the text from it
                </p>
              </div>

              {/* Step 2: Process */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/60 p-8 text-center">
                <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">2. AI Analyzes</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Text is sent to OpenAI for analysis. They process it and return insights
                </p>
              </div>

              {/* Step 3: Delete */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200/60 p-8 text-center">
                <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">3. File Deleted</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your original file is deleted immediately after processing. Only AI outputs remain if you save
                </p>
              </div>
            </div>

            <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-sm text-slate-600 text-center">
                <span className="font-semibold text-slate-900">Important:</span> We do not store your uploaded PDFs or images. The extracted text is sent to OpenAI for analysis, and only the AI-generated insights are saved in your account if you choose to save the deal.
              </p>
            </div>
          </div>

          {/* What we store */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What We Store</h2>

            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">If you save a deal:</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-2"><span className="text-emerald-600">•</span> AI-generated analysis and recommendations</li>
                  <li className="flex gap-2"><span className="text-emerald-600">•</span> Extracted text from your document (not the file itself)</li>
                  <li className="flex gap-2"><span className="text-emerald-600">•</span> Deal metadata you enter (title, vendor name, etc.)</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Your account information:</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-2"><span className="text-emerald-600">•</span> Email address (for login)</li>
                  <li className="flex gap-2"><span className="text-emerald-600">•</span> Password (hashed with bcrypt, never plaintext)</li>
                  <li className="flex gap-2"><span className="text-emerald-600">•</span> Usage count and account creation date</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Where data goes */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Where Your Data Goes</h2>

            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-900 mb-2">OpenAI</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      Your extracted text is sent to OpenAI&apos;s API for analysis. They process it and return negotiation insights.
                    </p>
                    <p className="text-xs text-slate-500">
                      OpenAI states they don&apos;t use API data to train models. See their <a href="https://openai.com/policies/api-data-usage-policies" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">data usage policy</a>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-900 mb-2">Supabase (Database)</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      If you save a deal, the AI outputs and extracted text are stored in our database hosted by Supabase.
                    </p>
                    <p className="text-xs text-slate-500">
                      Supabase is SOC 2 Type II certified and encrypts data at rest. Row Level Security ensures you only see your own data.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-900 mb-2">Vercel (Hosting)</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      Our application is hosted on Vercel. They handle the infrastructure and see request metadata (IP addresses, etc.).
                    </p>
                    <p className="text-xs text-slate-500">
                      Vercel is SOC 2 Type II certified and provides DDoS protection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Basic security measures */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Basic Security Measures</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-3">✓ TLS Encryption</h3>
                <p className="text-sm text-slate-600">
                  All data is encrypted in transit using HTTPS/TLS when communicating between your browser and our servers.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-3">✓ Password Hashing</h3>
                <p className="text-sm text-slate-600">
                  Passwords are hashed with bcrypt before storage. We never store passwords in plaintext.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-3">✓ File Deletion</h3>
                <p className="text-sm text-slate-600">
                  Uploaded files (PDFs, images) are deleted immediately after text extraction. No raw files persist.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-3">✓ Database Access Control</h3>
                <p className="text-sm text-slate-600">
                  Row Level Security (RLS) in Supabase ensures users can only access their own data.
                </p>
              </div>
            </div>
          </div>

          {/* What we don't do */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What We Don&apos;t Do</h2>

            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-200/60 p-8">
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex gap-3"><span className="text-emerald-600 font-bold">✗</span> <span><span className="font-semibold">We don&apos;t sell your data</span> to advertisers, brokers, or anyone else.</span></li>
                <li className="flex gap-3"><span className="text-emerald-600 font-bold">✗</span> <span><span className="font-semibold">We don&apos;t train AI models</span> on your data.</span></li>
                <li className="flex gap-3"><span className="text-emerald-600 font-bold">✗</span> <span><span className="font-semibold">We don&apos;t store your uploaded files</span> after processing.</span></li>
                <li className="flex gap-3"><span className="text-emerald-600 font-bold">✗</span> <span><span className="font-semibold">We don&apos;t share data</span> with anyone except the services listed above (OpenAI, Supabase, Vercel).</span></li>
              </ul>
            </div>
          </div>

          {/* Limitations & honesty */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Limitations & Being Honest</h2>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
              <p className="text-sm text-slate-700 mb-4">We&apos;re a startup, not an enterprise-certified platform. Here&apos;s what we <span className="font-semibold">don&apos;t</span> have yet:</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2"><span className="text-amber-600">•</span> We are <span className="font-semibold">not</span> SOC 2 certified (though our infrastructure providers are)</li>
                <li className="flex gap-2"><span className="text-amber-600">•</span> We do <span className="font-semibold">not</span> offer end-to-end encryption</li>
                <li className="flex gap-2"><span className="text-amber-600">•</span> Your data is processed by third parties (OpenAI)</li>
                <li className="flex gap-2"><span className="text-amber-600">•</span> We don&apos;t have penetration testing or security audits yet</li>
                <li className="flex gap-2"><span className="text-amber-600">•</span> We don&apos;t have formal incident response procedures documented</li>
              </ul>
              <p className="text-sm text-slate-700 mt-4">
                We&apos;re continuously improving our security posture as we grow. If you have specific security requirements, please <a href="mailto:security@dealcheck.app" className="text-emerald-600 hover:underline font-medium">reach out</a>.
              </p>
            </div>
          </div>

          {/* Your rights */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Rights & Data Control</h2>

            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <p className="text-sm text-slate-700 mb-4">You have full control over your data:</p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-3"><span className="text-emerald-600">→</span> <span><span className="font-semibold">Delete deals:</span> You can delete saved deals anytime from your dashboard.</span></li>
                <li className="flex gap-3"><span className="text-emerald-600">→</span> <span><span className="font-semibold">Delete account:</span> Request account deletion at <a href="mailto:privacy@dealcheck.app" className="text-emerald-600 hover:underline">privacy@dealcheck.app</a></span></li>
                <li className="flex gap-3"><span className="text-emerald-600">→</span> <span><span className="font-semibold">Export data:</span> Request a copy of your data at any time.</span></li>
                <li className="flex gap-3"><span className="text-emerald-600">→</span> <span><span className="font-semibold">Questions:</span> Ask us anything about how we handle your data.</span></li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Questions or Concerns?</h2>

            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-8">
              <p className="text-sm text-slate-700 mb-6">
                We believe in transparency. If you have questions about how we handle your data, or if you discover a security issue, please reach out:
              </p>
              <div className="space-y-3 text-sm">
                <p><span className="font-semibold text-slate-900">Security concerns:</span> <a href="mailto:security@dealcheck.app" className="text-emerald-600 hover:underline">security@dealcheck.app</a></p>
                <p><span className="font-semibold text-slate-900">Privacy questions:</span> <a href="mailto:privacy@dealcheck.app" className="text-emerald-600 hover:underline">privacy@dealcheck.app</a></p>
                <p><span className="font-semibold text-slate-900">General support:</span> <a href="mailto:support@dealcheck.app" className="text-emerald-600 hover:underline">support@dealcheck.app</a></p>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Try DealCheck?
            </h2>
            <p className="text-emerald-50 text-sm sm:text-base mb-8 max-w-2xl mx-auto">
              Your files are deleted after processing. Only the AI insights you choose to save are stored.
            </p>
            <Link
              href="/try"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
            >
              Try DealCheck
              <ArrowRight className="w-5 h-5" />
            </Link>
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
