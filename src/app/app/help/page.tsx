'use client'

import { useState } from 'react'
import { Search, Rocket, Upload, BarChart3, FolderOpen, Shield, CreditCard, ChevronDown, Mail } from 'lucide-react'

type Category = 'getting-started' | 'uploading' | 'output' | 'deals' | 'privacy' | 'billing'

const categories: { key: Category; name: string; icon: React.ReactNode; sub: string }[] = [
  { key: 'getting-started', name: 'Getting started', icon: <Rocket className="w-4 h-4" />, sub: 'What TermLift does and how it works' },
  { key: 'uploading', name: 'Uploading quotes', icon: <Upload className="w-4 h-4" />, sub: 'How to get your vendor quotes in' },
  { key: 'output', name: 'Analysis output', icon: <BarChart3 className="w-4 h-4" />, sub: 'What you get back and how to use it' },
  { key: 'deals', name: 'Deals & tracking', icon: <FolderOpen className="w-4 h-4" />, sub: 'Managing deals, rounds, and outcomes' },
  { key: 'privacy', name: 'Privacy & data', icon: <Shield className="w-4 h-4" />, sub: 'How we handle your documents' },
  { key: 'billing', name: 'Account & billing', icon: <CreditCard className="w-4 h-4" />, sub: 'Plans, pricing, and account management' },
]

const faqData: Record<Category, { q: string; a: string }[]> = {
  'getting-started': [
    { q: 'What is TermLift?', a: 'TermLift is an AI-powered procurement tool that helps you negotiate better vendor deals. Upload a quote or contract, and it finds red flags, estimates savings, builds a negotiation strategy, and drafts ready-to-send reply emails \u2014 all in about two minutes.' },
    { q: 'How does the AI analysis work?', a: "Text is extracted from your document (PDF, image, or pasted text) and sent to Anthropic\u2019s Claude AI, which is specifically trained for procurement analysis. It reads the full content, identifies risks, calculates savings potential, and generates a complete negotiation playbook." },
    { q: 'What file formats are supported?', a: 'PDF, PNG, JPG, WEBP, or plain text paste. Maximum file size is 10 MB. For images, make sure the text is clearly readable. Multi-page PDFs are fully supported \u2014 every page is analyzed.' },
    { q: 'Do I need procurement experience?', a: "No. TermLift is designed for anyone who negotiates vendor contracts \u2014 from first-timers to procurement pros. The AI provides specific asks, fallback positions, and ready-to-send emails so you know exactly what to say." },
  ],
  'uploading': [
    { q: 'How do I upload a quote?', a: "Go to New Analysis, then either drag and drop a file onto the upload area, click \u2018Browse files\u2019 to select one, or paste the contract text directly into the text box. The AI handles all formats automatically." },
    { q: 'Can I analyze an email from a vendor?', a: 'Yes. Copy the full email text \u2014 subject line, body, pricing tables, terms \u2014 and paste it into the text input. TermLift will analyze everything including inline pricing and conditions.' },
    { q: 'What if my PDF has images or complex tables?', a: 'TermLift uses vision AI to read PDFs with images, scanned pages, and complex table layouts. If the text extraction seems off, try pasting the key sections as plain text for more reliable results.' },
  ],
  'output': [
    { q: 'What do I get back from an analysis?', a: 'A complete negotiation package: a 0\u2013100 deal score with breakdown (pricing, terms, leverage), red flags with specific asks and fallback positions, realistic savings estimates (must-have and nice-to-have), a negotiation playbook, and email drafts in three tones.' },
    { q: 'What are the three email tones?', a: 'Friendly (warm and collaborative \u2014 good for relationships you want to preserve), Direct (clear and professional \u2014 gets to the point), and Firm (assertive with deadlines \u2014 for when you have leverage or urgency). Pick the one that fits your vendor relationship.' },
    { q: 'How accurate is the AI?', a: 'The AI is good but not perfect. It can miss details, misinterpret terms, or make errors \u2014 especially with complex legal language or unusual contract structures. Always review the outputs against your original documents. Use it as a starting point, not the final word.' },
  ],
  'deals': [
    { q: 'How do I close a deal?', a: "Click \u2018Close deal\u2019 on the deal page. You\u2019ll be asked to enter the final agreed price and select what changed (price reduction, better terms, added scope, etc.). TermLift calculates your actual savings and tracks them in your dashboard." },
    { q: 'Can I do multiple negotiation rounds?', a: "Yes. After the initial analysis, you can upload the vendor\u2019s counter-offer as a new round. TermLift re-analyzes the updated terms and adjusts its recommendations. This is available on Essentials and Pro plans." },
    { q: 'How are savings calculated?', a: 'Savings are calculated by comparing the original quoted price to the final agreed price when you close the deal. The potential savings shown during analysis are estimates based on market benchmarks and the specific issues found in your quote.' },
  ],
  'privacy': [
    { q: 'Is my data private?', a: "Yes. Uploaded files are deleted immediately after text extraction. Your deal data is stored securely and encrypted in transit (TLS) and at rest. Your documents are never used for AI training. We use Anthropic\u2019s Claude API which has a zero-retention data policy." },
    { q: 'Are my documents stored?', a: 'No. Files (PDFs, images) are processed in memory and deleted immediately after extraction. Only the structured analysis output is saved to your account \u2014 not the original document. You can delete any deal and its data at any time from your settings.' },
    { q: 'Can I delete all my data?', a: "Yes. Go to Settings \u2192 Danger Zone and click \u2018Delete account.\u2019 This permanently removes all your deals, analysis history, and account information. This action cannot be undone." },
  ],
  'billing': [
    { q: "What\u2019s the free plan?", a: "The Starter plan gives you 4 free analyses \u2014 no credit card required. You get the full analysis package (score, flags, savings, emails) for each one. Create an account to track your deals and access your history." },
    { q: 'What does Essentials include?', a: 'Essentials (€15/month) gives you 10 analyses a month, saved deals, up to 2 negotiation rounds per deal, full deal history, and PDF export. A good fit if you negotiate a few contracts a month.' },
    { q: 'What does Pro include?', a: 'Pro (€39/month) gives you unlimited analyses, unlimited negotiation rounds, a full spend dashboard with savings tracking, and email regeneration. It\u2019s designed for individuals or small teams who negotiate regularly.' },
    { q: 'Can I cancel anytime?', a: "Yes. You can cancel your subscription at any time from Settings \u2192 Subscription \u2192 Manage subscription. You\u2019ll keep access until the end of your current billing period. No cancellation fees, no questions asked." },
  ],
}

export default function AppHelpPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('getting-started')
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [search, setSearch] = useState('')

  const toggleItem = (key: string) => setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))

  const currentCat = categories.find(c => c.key === activeCategory)!
  const currentFaqs = faqData[activeCategory]

  // Filter by search
  const filteredFaqs = search.trim()
    ? currentFaqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : currentFaqs

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 -mb-8 md:-mb-8 flex flex-col min-h-screen bg-slate-50">
      {/* Topbar */}
      <div className="h-14 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-[18px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>Help Center</h1>
        <div className="relative w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search help articles..."
            className="w-full pl-9 pr-3 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left nav */}
        <div className="w-[220px] flex-shrink-0 bg-white border-r border-slate-200 px-3 py-6">
          <p className="px-3 mb-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Topics</p>
          <nav className="space-y-0.5">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setSearch('') }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left ${
                  activeCategory === cat.key
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={`flex-shrink-0 ${activeCategory === cat.key ? 'text-emerald-500' : 'text-slate-400'}`}>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div className="max-w-3xl">
            {/* Category header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                {currentCat.icon}
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>{currentCat.name}</h2>
                <p className="text-[13px] text-slate-500">{currentCat.sub}</p>
              </div>
            </div>

            {/* FAQ items */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {filteredFaqs.length > 0 ? filteredFaqs.map((item, i) => {
                const key = `${activeCategory}-${i}`
                const isOpen = !!openItems[key]
                return (
                  <div
                    key={key}
                    className={`${i < filteredFaqs.length - 1 ? 'border-b border-slate-100' : ''}`}
                  >
                    <button
                      onClick={() => toggleItem(key)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-[14px] font-semibold text-slate-900 pr-4">{item.q}</span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5">
                        <p className="text-[14px] text-slate-600 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                )
              }) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-[14px] text-slate-400">No results for &ldquo;{search}&rdquo; in this category</p>
                  <button onClick={() => setSearch('')} className="text-[13px] text-emerald-600 font-medium mt-2 hover:underline">Clear search</button>
                </div>
              )}
            </div>

            {/* Still have questions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[15px] font-bold text-slate-900 mb-1">Still have questions?</p>
                <p className="text-[13px] text-slate-500">We&apos;re here to help &mdash; reach out anytime</p>
              </div>
              <a
                href="mailto:hello@termlift.com"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-5 py-2.5 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <Mail className="w-4 h-4" />hello@termlift.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
