'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Heart, Scale, Swords, Zap, Sparkles, Send, Shield, Building2, Target, Mail, Handshake, ArrowRight } from 'lucide-react'
import { demoProfile } from '@/lib/demo-data'

type TopPriority = 'lowest_price' | 'best_terms' | 'max_flexibility'
type Tone = 'friendly' | 'direct' | 'firm'
type Style = 'collaborative' | 'balanced' | 'aggressive'
type Payment = 'net_30' | 'net_60' | 'net_90' | 'no_preference'
type AutoRenewal = 'fine' | 'prefer_opt_in'

interface OptionCardProps {
  selected: boolean
  onClick: () => void
  title: string
  desc?: string
  icon?: React.ComponentType<{ className?: string }>
}

function OptionCard({ selected, onClick, title, desc, icon: Icon }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3.5 rounded-xl border-2 transition-all text-left ${
        selected ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {Icon && <Icon className={`w-4 h-4 mb-1.5 ${selected ? 'text-emerald-600' : 'text-slate-500'}`} />}
      <p className={`text-[13px] font-bold ${selected ? 'text-emerald-700' : 'text-slate-900'}`} style={{ fontFamily: 'Sora, sans-serif' }}>{title}</p>
      {desc && <p className="text-[11.5px] text-slate-500 mt-0.5 leading-snug">{desc}</p>}
    </button>
  )
}

export default function DemoSettingsPage() {
  const [tone, setTone] = useState<Tone>('friendly')
  const [style, setStyle] = useState<Style>(demoProfile.negotiation_preferences.top_priority === 'lowest_price' ? 'balanced' : 'collaborative')
  const [priority, setPriority] = useState<TopPriority>(demoProfile.negotiation_preferences.top_priority)
  const [payment, setPayment] = useState<Payment>(demoProfile.negotiation_preferences.payment_terms)
  const [autoRenewal, setAutoRenewal] = useState<AutoRenewal>(demoProfile.negotiation_preferences.auto_renewal)
  const [showSavePrompt, setShowSavePrompt] = useState(false)

  const triggerSave = () => {
    setShowSavePrompt(true)
    setTimeout(() => setShowSavePrompt(false), 4000)
  }

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-7">
        <h1 className="text-[20px] sm:text-[26px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>Settings</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">Tune how TermLift negotiates on your behalf</p>
      </div>

      <div className="px-5 sm:px-8 py-6 max-w-3xl">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Handshake className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>Negotiation preferences</h2>
              <p className="text-[12.5px] text-slate-500">Every analysis is tailored to these settings</p>
            </div>
          </div>

          <div className="space-y-5 sm:space-y-7">
            {/* Top priority */}
            <div>
              <p className="text-[12px] font-medium text-slate-500 mb-3 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />Top priority
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <OptionCard selected={priority === 'lowest_price'} onClick={() => setPriority('lowest_price')} title="Lowest price" icon={Zap} />
                <OptionCard selected={priority === 'best_terms'} onClick={() => setPriority('best_terms')} title="Best terms" icon={Scale} />
                <OptionCard selected={priority === 'max_flexibility'} onClick={() => setPriority('max_flexibility')} title="Max flexibility" icon={Sparkles} />
              </div>
            </div>

            {/* Email tone */}
            <div>
              <p className="text-[12px] font-medium text-slate-500 mb-3 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />Default email tone
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <OptionCard selected={tone === 'friendly'} onClick={() => setTone('friendly')} title="Warm" desc="Relationship-first" icon={Heart} />
                <OptionCard selected={tone === 'direct'} onClick={() => setTone('direct')} title="Direct" desc="Clear, concise" icon={Send} />
                <OptionCard selected={tone === 'firm'} onClick={() => setTone('firm')} title="Firm" desc="Strong position" icon={Shield} />
              </div>
            </div>

            {/* Negotiation style */}
            <div>
              <p className="text-[12px] font-medium text-slate-500 mb-3 flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5" />Negotiation style
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <OptionCard selected={style === 'collaborative'} onClick={() => setStyle('collaborative')} title="Collaborative" desc="Long-term relationships" icon={Heart} />
                <OptionCard selected={style === 'balanced'} onClick={() => setStyle('balanced')} title="Balanced" desc="Fair but firm" icon={Scale} />
                <OptionCard selected={style === 'aggressive'} onClick={() => setStyle('aggressive')} title="Aggressive" desc="Push hard" icon={Swords} />
              </div>
            </div>

            {/* Payment terms */}
            <div>
              <p className="text-[12px] font-medium text-slate-500 mb-3">Payment terms preference</p>
              <div className="grid grid-cols-2 gap-2.5">
                <OptionCard selected={payment === 'no_preference'} onClick={() => setPayment('no_preference')} title="No preference" />
                <OptionCard selected={payment === 'net_30'} onClick={() => setPayment('net_30')} title="Net 30" />
                <OptionCard selected={payment === 'net_60'} onClick={() => setPayment('net_60')} title="Net 60" />
                <OptionCard selected={payment === 'net_90'} onClick={() => setPayment('net_90')} title="Net 90" />
              </div>
            </div>

            {/* Auto-renewal */}
            <div>
              <p className="text-[12px] font-medium text-slate-500 mb-3">Auto-renewal clauses</p>
              <div className="grid grid-cols-2 gap-2.5">
                <OptionCard selected={autoRenewal === 'fine'} onClick={() => setAutoRenewal('fine')} title="Fine with it" desc="No issue with auto-renewal" />
                <OptionCard selected={autoRenewal === 'prefer_opt_in'} onClick={() => setAutoRenewal('prefer_opt_in')} title="Manual control" desc="Want to opt in each time" />
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="text-[12px] font-medium text-slate-500 mb-3 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />Company
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input readOnly value="Acme Corp" className="px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium" />
                <input readOnly value="51-200" className="px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg bg-slate-50 text-slate-700" />
                <input readOnly value="SaaS" className="px-3 py-2.5 text-[13px] border border-slate-200 rounded-lg bg-slate-50 text-slate-700" />
              </div>
            </div>

            {/* Save area */}
            <div className="pt-4 border-t border-slate-100">
              {showSavePrompt ? (
                <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300">
                  <div className="flex-1">
                    <p className="text-[13.5px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>Sign up to save these preferences</p>
                    <p className="text-[12px] text-slate-600 mt-0.5">Your negotiation profile carries into every quote you analyse.</p>
                  </div>
                  <Link
                    href="/login?from=demo"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-bold text-white whitespace-nowrap transition-all hover:-translate-y-0.5"
                    style={{ background: '#1DB954', boxShadow: '0 4px 12px -2px rgba(29,185,84,0.4)' }}
                  >
                    Sign up free <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <button
                  onClick={triggerSave}
                  className="px-5 py-2.5 text-[14px] font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Save preferences
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
