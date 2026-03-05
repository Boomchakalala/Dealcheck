import Link from 'next/link'
import { Header } from '@/components/Header'
import { Shield, Lock, FileCheck, Code, Eye, CheckCircle2, ArrowRight } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header variant="public" />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-50/60 to-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-[2.5rem] sm:text-[3.5rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-4">
                Security and Privacy at DealCheck
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-12">
                Your sensitive deal data stays yours. Built with enterprise-grade security from day one.
              </p>

              {/* Illustration placeholder */}
              <div className="relative mb-12">
                <div className="flex items-center justify-center gap-8">
                  {/* Document illustration */}
                  <div className="relative">
                    <div className="w-48 h-56 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg shadow-lg border border-slate-300 p-4">
                      <div className="space-y-2">
                        <div className="h-2 bg-slate-300 rounded w-3/4"></div>
                        <div className="h-2 bg-slate-300 rounded w-full"></div>
                        <div className="h-2 bg-slate-300 rounded w-5/6"></div>
                        <div className="h-2 bg-slate-300 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Shield illustration */}
                  <div className="relative">
                    <div className="w-32 h-36 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                      <Shield className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SOC 2 Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6">
            <div className="flex items-center justify-center gap-3 text-white">
              <Shield className="w-5 h-5" />
              <p className="text-sm sm:text-base font-semibold">
                SOC 2 Hosting & Global Compliance
              </p>
            </div>
            <p className="text-center text-emerald-50 text-xs sm:text-sm mt-2 max-w-3xl mx-auto">
              Our infrastructure is hosted on SOC 2 Type II certified platforms. Data is encrypted in transit and at rest, complying with GDPR, CCPA, and industry best practices.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          {/* 4 Feature Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* Encrypting Your Data */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                <Lock className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Encrypting Your Data</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All data transmitted between your browser and our servers is encrypted using TLS 1.3. Passwords are hashed with bcrypt and never stored in plaintext. Database access is protected by Row Level Security (RLS).
              </p>
            </div>

            {/* Audit-Quality Narrative Files */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                <FileCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Audit-Quality Narrative Files</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We automatically detect your uploaded files&apos; structure and extract text with precision. Files are deleted immediately after processing. We maintain detailed audit logs of all analysis activities for compliance.
              </p>
            </div>

            {/* Auto-Codes & Scrutinizes Results */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                <Code className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Auto-Codes & Scrutinizes Results</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our AI scrutinizes every clause, flag, and term. Results are structured, validated, and presented with clear risk categorization so you can make informed decisions faster than manual review.
              </p>
            </div>

            {/* Streamlining Responsible Disclosure */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Streamlining Responsible Disclosure</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We welcome security researchers to report vulnerabilities. All reports are acknowledged within 48 hours, and we work transparently to address issues promptly with responsible disclosure.
              </p>
            </div>
          </div>

          {/* Trust, But Verify Section */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-200/60 p-10 sm:p-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Trust, But Verify</h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                Security is central to our platform. We work hard to protect data and ensure you can validate our approach transparently.
              </p>
            </div>

            {/* Trust Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {/* SOC 2 Type II */}
              <div className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-900">SOC 2</p>
                  <p className="text-xs text-slate-500">Type II</p>
                </div>
              </div>

              {/* Multi-Factor */}
              <div className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-900">Multi-Factor</p>
                  <p className="text-xs text-slate-500">Authentication</p>
                </div>
              </div>

              {/* Quick Financial Monitoring */}
              <div className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-900">Quick Financial</p>
                  <p className="text-xs text-slate-500">Monitoring</p>
                </div>
              </div>

              {/* AI-Powered */}
              <div className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-900">AI-powered</p>
                  <p className="text-xs text-slate-500">Content Analysis</p>
                </div>
              </div>

              {/* Access Control */}
              <div className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-rose-600" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-900">Access Control</p>
                  <p className="text-xs text-slate-500">& Monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Start Negotiating Smarter
            </h2>
            <p className="text-emerald-50 text-sm sm:text-base mb-8 max-w-2xl mx-auto">
              Upload your deal documents and get AI-powered insights in seconds. Your data stays secure.
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
