'use client'

import Link from 'next/link'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { Shield, Lock, Trash2, FileText, Database, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function SecurityPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <UnifiedHeader variant="public" />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-50/60 to-white">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-16">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/60 shadow-sm mb-6">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700 tracking-wide">{t('securityPage.badge')}</span>
              </div>
              <h1 className="text-[2.5rem] sm:text-[3.5rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-4">
                {t('securityPage.title')}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                {t('securityPage.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">

          {/* Key principle */}
          <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 to-white p-6 mb-16 text-center">
            <p className="text-xl text-slate-700 font-medium max-w-2xl mx-auto">
              {t('securityPage.keyPrinciple')}
            </p>
          </div>

          {/* What happens to your data - Visual flow */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{t('securityPage.uploadTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Step 1: Upload */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/60 p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{t('securityPage.step1Title')}</h3>
                <p className="text-sm text-slate-600">
                  {t('securityPage.step1Desc')}
                </p>
              </div>

              {/* Step 2: Process */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/60 p-6 text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{t('securityPage.step2Title')}</h3>
                <p className="text-sm text-slate-600">
                  {t('securityPage.step2Desc')}
                </p>
              </div>

              {/* Step 3: Delete */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200/60 p-6 text-center">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{t('securityPage.step3Title')}</h3>
                <p className="text-sm text-slate-600">
                  {t('securityPage.step3Desc')}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-sm text-slate-600 text-center">
                <span className="font-semibold text-slate-900">{t('securityPage.bottomLine')}</span> {t('securityPage.bottomLineDesc')}
              </p>
            </div>
          </div>

          {/* Encryption */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('securityPage.encryptionTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-semibold text-slate-900">{t('securityPage.inTransit')}</h3>
                </div>
                <p className="text-sm text-slate-600">
                  {t('securityPage.inTransitDesc')}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-semibold text-slate-900">{t('securityPage.atRest')}</h3>
                </div>
                <p className="text-sm text-slate-600">
                  {t('securityPage.atRestDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* File Deletion */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('securityPage.fileDeletionTitle')}</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Trash2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-slate-900">{t('securityPage.originalsNeverStored')}</h3>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                {t('securityPage.fileDeletionDesc1')}
              </p>
              <p className="text-sm text-slate-600">
                {t('securityPage.fileDeletionDesc2')}
              </p>
            </div>
          </div>

          {/* Extracted Text */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('securityPage.extractedTextTitle')}</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-slate-900">{t('securityPage.onlySavedWhenYouSaySo')}</h3>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                {t('securityPage.extractedTextDesc1')}
              </p>
              <p className="text-sm text-slate-600">
                {t('securityPage.extractedTextDesc2')}
              </p>
            </div>
          </div>

          {/* AI Training */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('securityPage.aiTrainingTitle')}</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-slate-900">{t('securityPage.anthropicNoTrain')}</h3>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                {t('securityPage.aiTrainingDesc1')}
              </p>
              <p className="text-sm text-slate-600">
                {t('securityPage.aiTrainingDesc2')}
              </p>
            </div>
          </div>

          {/* GDPR */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('securityPage.gdprTitle')}</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-slate-900">{t('securityPage.rightsRespected')}</h3>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                {t('securityPage.gdprDesc1')}
              </p>
              <p className="text-sm text-slate-600">
                {t('securityPage.gdprDesc2')}
              </p>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('securityPage.infraTitle')}</h2>

            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-5 h-5 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">{t('securityPage.supabaseTitle')}</h3>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  {t('securityPage.supabaseDesc1')}
                </p>
                <p className="text-sm text-slate-600">
                  {t('securityPage.supabaseDesc2')}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">{t('securityPage.vercelTitle')}</h3>
                </div>
                <p className="text-sm text-slate-600">
                  {t('securityPage.vercelDesc')}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-5 h-5 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">{t('securityPage.anthropicTitle')}</h3>
                </div>
                <p className="text-sm text-slate-600">
                  {t('securityPage.anthropicDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* What we don't do */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('securityPage.whatWeDontDoTitle')}</h2>

            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-200/60 p-6">
              <ul className="space-y-3 text-sm text-slate-700">
                {[
                  t('securityPage.dontSell'),
                  t('securityPage.dontAdvertise'),
                  t('securityPage.dontTrain'),
                  t('securityPage.dontStore'),
                  t('securityPage.dontShareBeyond'),
                  t('securityPage.dontAccess'),
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-red-500 font-bold text-base leading-5">&#10005;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Limitations */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('securityPage.limitationsTitle')}</h2>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <p className="text-sm text-slate-700 mb-4">
                {t('securityPage.limitationsIntro')}
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">&#8226;</span>
                  <span><span className="font-medium text-slate-700">{t('securityPage.limit1Title')}</span> {t('securityPage.limit1Desc')}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">&#8226;</span>
                  <span><span className="font-medium text-slate-700">{t('securityPage.limit2Title')}</span> {t('securityPage.limit2Desc')}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">&#8226;</span>
                  <span><span className="font-medium text-slate-700">{t('securityPage.limit3Title')}</span> {t('securityPage.limit3Desc')}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">&#8226;</span>
                  <span><span className="font-medium text-slate-700">{t('securityPage.limit4Title')}</span> {t('securityPage.limit4Desc')}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">&#8226;</span>
                  <span><span className="font-medium text-slate-700">{t('securityPage.limit5Title')}</span> {t('securityPage.limit5Desc')}</span>
                </li>
              </ul>
              <p className="text-sm text-slate-700 mt-4">
                {t('securityPage.limitationsOutro')}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('securityPage.questionsTitle')}</h2>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <p className="text-sm text-slate-600 mb-4">
                {t('securityPage.questionsIntro')}
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-slate-900">{t('securityPage.securityQuestions')}</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>
                </p>
                <p>
                  <span className="font-semibold text-slate-900">{t('securityPage.privacyRequests')}</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>
                </p>
                <p>
                  <span className="font-semibold text-slate-900">{t('securityPage.generalSupport')}</span>{' '}
                  <a href="mailto:hello@termlift.com" className="text-emerald-600 hover:underline">hello@termlift.com</a>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {t('securityPage.ctaTitle')}
            </h2>
            <p className="text-emerald-50 text-sm sm:text-base mb-8 max-w-2xl mx-auto">
              {t('securityPage.ctaSubtitle')}
            </p>
            <Link
              href="/try"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
            >
              {t('securityPage.ctaButton')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
