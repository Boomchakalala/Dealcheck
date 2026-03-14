import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsClient } from '@/components/SettingsClient'
import { formatCurrency, type Currency } from '@/lib/currency'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const t = await getTranslations()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get deal stats
  const { data: deals } = await supabase
    .from('deals')
    .select('id, status, savings_amount, rounds (id, output_json)')
    .eq('user_id', user.id)

  const { count: roundCount } = await supabase
    .from('rounds')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const allDeals = deals || []
  const activeDeals = allDeals.filter(d => !d.status?.startsWith('closed_'))
  const closedDeals = allDeals.filter(d => d.status?.startsWith('closed_'))

  // Total savings identified from AI analysis (all deals)
  const totalSavingsIdentified = allDeals.reduce((sum, d) => {
    const rounds = (d as any).rounds || []
    const latest = rounds.sort((a: any, b: any) => (b.round_number || 0) - (a.round_number || 0))[0]
    const savings = latest?.output_json?.potential_savings || []
    return sum + savings.reduce((s: number, item: any) => {
      const match = item.annual_impact?.match(/[\d,]+/)
      return s + (match ? parseInt(match[0].replace(/,/g, ''), 10) : 0)
    }, 0)
  }, 0)

  const baseCurrency = (profile?.base_currency || 'EUR') as Currency
  const plan = profile?.plan || 'free'
  const planLabel = plan === 'pro' ? 'Pro' : plan === 'business' ? 'Business' : 'Starter'

  // Calculate "joined X months ago"
  const createdAt = new Date(user.created_at)
  const now = new Date()
  const monthsAgo = (now.getFullYear() - createdAt.getFullYear()) * 12 + (now.getMonth() - createdAt.getMonth())
  const joinedAgo = monthsAgo === 0
    ? t('time.thisMonth')
    : monthsAgo === 1
      ? t('time.oneMonthAgo')
      : t('time.monthsAgo', { count: monthsAgo })

  // Get locale for date formatting
  const locale = (await cookies()).get('termlift_lang')?.value === 'fr' ? 'fr-FR' : 'en-US'

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <SettingsClient
        email={user.email || ''}
        firstName={profile?.first_name || ''}
        lastName={profile?.last_name || ''}
        plan={plan}
        planLabel={planLabel}
        usageCount={profile?.usage_count || 0}
        dealCount={allDeals.length}
        activeDeals={activeDeals.length}
        closedDeals={closedDeals.length}
        roundCount={roundCount || 0}
        isAdmin={profile?.is_admin || false}
        baseCurrency={baseCurrency}
        totalSavings={formatCurrency(totalSavingsIdentified, baseCurrency)}
        memberSince={createdAt.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
        joinedAgo={joinedAgo}
        locale={profile?.locale || 'en'}
      />
    </div>
  )
}
