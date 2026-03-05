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

        <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-20">
          <div className="space-y-14 text-sm text-slate-700 leading-relaxed">

            {/* Summary box */}
            <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 to-white p-7 space-y-3 shadow-sm">
              <p className="font-semibold text-slate-900">Security Overview</p>
              <ul className="space-y-2.5">
                {[
                  'All data is encrypted in transit using TLS 1.3',
                  'Passwords are hashed with bcrypt (never stored in plaintext)',
                  'Uploaded files are deleted immediately after processing',
                  'Database access protected by Row Level Security (RLS)',
                  'Regular security audits and monitoring',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">1. Data Encryption</h2>

              <p className="font-medium text-slate-900 mb-2 mt-5">In Transit</p>
              <p className="mb-3">All data transmitted between your browser and our servers is encrypted using Transport Layer Security (TLS) 1.3. This includes:</p>
              <ul className="space-y-2 ml-1">
                {['Login credentials', 'Uploaded documents', 'AI analysis results', 'API requests and responses'].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>

              <p className="font-medium text-slate-900 mb-2 mt-5">At Rest</p>
              <p className="mb-3">Stored data is encrypted at the database level by our infrastructure provider (Supabase). This includes:</p>
              <ul className="space-y-2 ml-1">
                {['Account information', 'Saved deal analyses', 'User preferences'].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">2. Authentication & Access Control</h2>

              <p className="font-medium text-slate-900 mb-2">Password Security</p>
              <ul className="space-y-2 ml-1 mb-4">
                {[
                  'Passwords are hashed using bcrypt with salt',
                  'We never store passwords in plaintext',
                  'Password reset requires email verification',
                  'Failed login attempts are rate-limited',
                ].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>

              <p className="font-medium text-slate-900 mb-2">Session Management</p>
              <ul className="space-y-2 ml-1 mb-4">
                {[
                  'Secure, HTTP-only session cookies',
                  'Automatic session expiration after inactivity',
                  'Single sign-out terminates all active sessions',
                ].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>

              <p className="font-medium text-slate-900 mb-2">Database Security</p>
              <ul className="space-y-2 ml-1">
                {[
                  'Row Level Security (RLS) ensures users can only access their own data',
                  'Prepared statements prevent SQL injection',
                  'Least-privilege access for all service accounts',
                ].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">3. File Handling</h2>

              <p className="mb-3">Uploaded files are processed with strict security measures:</p>
              <ul className="space-y-2 ml-1">
                {[
                  'Files are validated for type and size before processing',
                  'All uploads are scanned for malicious content',
                  'Files are processed in isolated environments',
                  'Raw files are deleted immediately after text extraction',
                  'Extracted text is sanitized before storage',
                ].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>
              <p className="mt-3 font-medium">We do not retain uploaded files on our servers.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">4. Infrastructure Security</h2>

              <p className="font-medium text-slate-900 mb-2">Hosting & Network</p>
              <ul className="space-y-2 ml-1 mb-4">
                {[
                  'Application hosted on Vercel with enterprise-grade security',
                  'Database hosted on Supabase with SOC 2 Type II compliance',
                  'DDoS protection and rate limiting',
                  'Firewall rules restrict unauthorized access',
                ].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>

              <p className="font-medium text-slate-900 mb-2">Monitoring & Logging</p>
              <ul className="space-y-2 ml-1">
                {[
                  'Real-time monitoring for suspicious activity',
                  'Automated alerts for security incidents',
                  'Access logs retained for security analysis',
                  'Regular security audits and penetration testing',
                ].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">5. Third-Party Security</h2>

              <p className="mb-4">We carefully vet all third-party services that process your data:</p>

              <div className="rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
                      <th className="text-left px-5 py-3.5 font-semibold text-slate-500">Provider</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-slate-500">Security Measures</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr className="border-b border-slate-100">
                      <td className="px-5 py-3.5 font-medium">Supabase</td>
                      <td className="px-5 py-3.5">SOC 2 Type II, ISO 27001, encrypted at rest, RLS</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="px-5 py-3.5 font-medium">OpenAI</td>
                      <td className="px-5 py-3.5">SOC 2 compliant, data encryption, no model training</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3.5 font-medium">Vercel</td>
                      <td className="px-5 py-3.5">SOC 2 Type II, DDoS protection, edge security</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4">All third-party providers are bound by Data Processing Agreements (DPAs) that ensure your data is handled securely and in compliance with privacy regulations.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">6. Application Security</h2>

              <p className="mb-3">Our application is built with security best practices:</p>
              <ul className="space-y-2 ml-1">
                {[
                  'Input validation and sanitization on all user inputs',
                  'Content Security Policy (CSP) headers',
                  'Protection against XSS, CSRF, and injection attacks',
                  'Secure HTTP headers (HSTS, X-Frame-Options, etc.)',
                  'Regular dependency updates and vulnerability scanning',
                  'Code reviews for all changes',
                ].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">7. Incident Response</h2>

              <p className="mb-3">In the event of a security incident:</p>
              <ul className="space-y-2 ml-1">
                {[
                  'Immediate investigation and containment procedures',
                  'Affected users notified within 72 hours',
                  'Transparent communication about the incident',
                  'Post-incident analysis and security improvements',
                  'Cooperation with law enforcement if required',
                ].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">8. Your Security Responsibilities</h2>

              <p className="mb-3">You can help keep your account secure by:</p>
              <ul className="space-y-2 ml-1">
                {[
                  'Using a strong, unique password',
                  'Not sharing your login credentials',
                  'Logging out when using shared devices',
                  'Keeping your browser and OS up to date',
                  'Reporting suspicious activity immediately',
                ].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">9. Compliance & Certifications</h2>

              <p className="mb-3">DealCheck is committed to meeting industry security standards:</p>
              <ul className="space-y-2 ml-1">
                {[
                  'GDPR compliant for EU users',
                  'Following OWASP security best practices',
                  'Infrastructure providers maintain SOC 2 Type II compliance',
                  'Regular third-party security assessments',
                ].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">10. Limitations</h2>

              <p className="mb-3">While we implement robust security measures, please note:</p>
              <ul className="space-y-2 ml-1">
                {[
                  'No system is 100% secure against all threats',
                  'We do not claim end-to-end encryption',
                  'Your data is processed by third-party AI services (OpenAI)',
                  'Security depends partly on your own practices (strong passwords, secure devices)',
                ].map((item) => (
                  <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                ))}
              </ul>

              <p className="mt-4">We are transparent about our security posture and continuously work to improve our defenses.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">11. Reporting Security Issues</h2>

              <p className="mb-3">If you discover a security vulnerability, please:</p>
              <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm space-y-3">
                <p className="font-medium text-slate-900">Email us immediately at:</p>
                <p><a href="mailto:security@dealcheck.app" className="text-emerald-700 underline underline-offset-2 decoration-emerald-300 hover:decoration-emerald-500 transition-colors text-base font-medium">security@dealcheck.app</a></p>
                <ul className="space-y-2 ml-1 text-xs">
                  {[
                    'Provide detailed information about the vulnerability',
                    'Do not publicly disclose the issue until we have addressed it',
                    'We will acknowledge your report within 48 hours',
                    'We will provide updates on our remediation efforts',
                  ].map((item) => (
                    <li key={item} className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />{item}</li>
                  ))}
                </ul>
              </div>

              <p className="mt-4">We appreciate responsible disclosure and will work with security researchers to address issues promptly.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">12. Updates to Security Practices</h2>

              <p>We continuously review and improve our security measures. Material changes to our security practices will be communicated via email and reflected on this page.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">13. Contact</h2>
              <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm space-y-2">
                <p><span className="font-medium text-slate-900">Security inquiries:</span> <a href="mailto:security@dealcheck.app" className="text-emerald-700 underline underline-offset-2 decoration-emerald-300">security@dealcheck.app</a></p>
                <p><span className="font-medium text-slate-900">Privacy inquiries:</span> <a href="mailto:privacy@dealcheck.app" className="text-emerald-700 underline underline-offset-2 decoration-emerald-300">privacy@dealcheck.app</a></p>
                <p><span className="font-medium text-slate-900">General support:</span> <a href="mailto:support@dealcheck.app" className="text-emerald-700 underline underline-offset-2 decoration-emerald-300">support@dealcheck.app</a></p>
              </div>
            </section>

            <div className="pt-8 mt-8 border-t border-slate-200/60">
              <p className="text-xs text-slate-500">
                Security is a shared responsibility. We are committed to protecting your data and being transparent about our security practices. If you have questions or concerns, please reach out.
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
            <Link href="/security" className="hover:text-slate-600 transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
