import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Shield, Eye, Target, Lock, Users, Heart } from 'lucide-react'
import { MarketingPage, PageHero, Section, SectionTitle, FeatureTile, Prose, FinalCta } from '@/components/marketing/MarketingPage'

export const metadata: Metadata = {
  title: 'About',
  alternates: { canonical: 'https://www.termlift.com/about' },
}

export default async function AboutPage() {
  const t = await getTranslations('about')
  const f = await getTranslations('footer')
  const nav = await getTranslations('nav')

  const cards = [
    { icon: <Target className="w-[18px] h-[18px]" />, title: t('card1Title'), body: t('card1Desc') },
    { icon: <Users className="w-[18px] h-[18px]" />, title: t('card2Title'), body: t('card2Desc') },
    { icon: <Lock className="w-[18px] h-[18px]" />, title: t('card3Title'), body: t('card3Desc') },
  ]
  const values = [
    { icon: <Eye className="w-4 h-4" />, title: t('value1Title'), body: t('value1Desc') },
    { icon: <Heart className="w-4 h-4" />, title: t('value2Title'), body: t('value2Desc') },
    { icon: <Shield className="w-4 h-4" />, title: t('value3Title'), body: t('value3Desc') },
  ]

  return (
    <MarketingPage>
      <PageHero eyebrow={f('about')} title={t('heroTitle')} lead={t('heroSubtitle')} narrow />

      {/* Why — the founder's story, reading width */}
      <Section>
        <SectionTitle title={t('whyTitle')} />
        <Prose className="mt-5 text-[16px]">
          {t('whyContent').split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
        </Prose>
      </Section>

      {/* Different — three flat tiles */}
      <Section tone="ground">
        <SectionTitle title={t('differenceTitle')} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-7">
          {cards.map((c) => <FeatureTile key={c.title} icon={c.icon} title={c.title} body={c.body} />)}
        </div>
      </Section>

      {/* Who — one row, no card */}
      <Section>
        <SectionTitle title={t('founderTitle')} />
        <div className="flex items-start gap-5 mt-6 max-w-[68ch]">
          <div className="w-14 h-14 rounded-[14px] bg-ink text-white grid place-items-center shrink-0 font-display font-bold text-[17px] tracking-[-0.02em]">KO</div>
          <p className="text-[15.5px] text-ink-2 leading-[1.6]">{t('founderBio')}</p>
        </div>
      </Section>

      {/* Values — three columns, flat */}
      <Section tone="ground">
        <SectionTitle title={t('valuesTitle')} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-7">
          {values.map((v) => (
            <div key={v.title} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-[9px] bg-green-soft text-green-deep grid place-items-center shrink-0 mt-0.5">{v.icon}</div>
              <div>
                <h3 className="font-display font-bold text-[15px] leading-tight">{v.title}</h3>
                <p className="text-[13.5px] text-ink-2 leading-[1.5] mt-1">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <FinalCta title={t('ctaTitle')} cta={t('ctaButton')} secondary={{ label: nav('examples'), href: '/demo' }} />
    </MarketingPage>
  )
}
