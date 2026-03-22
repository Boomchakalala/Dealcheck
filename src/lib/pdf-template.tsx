import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { DealOutput } from '@/types'
import path from 'path'
import fs from 'fs'

// Load logo as base64 for embedding in PDF
function getLogoBase64(): string {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'termlift-logo.png')
    const logoBuffer = fs.readFileSync(logoPath)
    return `data:image/png;base64,${logoBuffer.toString('base64')}`
  } catch {
    return ''
  }
}

const colors = {
  emerald: '#059669',
  emeraldLight: '#d1fae5',
  amber: '#d97706',
  amberLight: '#fef3c7',
  red: '#dc2626',
  redLight: '#fee2e2',
  slate900: '#0f172a',
  slate700: '#334155',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
  white: '#ffffff',
}

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 9, color: colors.slate700 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.slate200 },
  logo: { width: 120, height: 30 },
  headerRight: { alignItems: 'flex-end' },
  headerDate: { fontSize: 8, color: colors.slate400 },

  // Title section
  titleSection: { marginBottom: 20 },
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: colors.slate900, marginBottom: 4 },
  subtitle: { fontSize: 9, color: colors.slate500 },

  // Score + stats row
  scoreRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  scoreBox: { width: 80, padding: 12, borderRadius: 6, alignItems: 'center' },
  scoreNumber: { fontSize: 28, fontFamily: 'Helvetica-Bold' },
  scoreLabel: { fontSize: 7, marginTop: 2, textAlign: 'center' as const },
  statBox: { flex: 1, padding: 10, borderRadius: 6, backgroundColor: colors.slate50, borderWidth: 1, borderColor: colors.slate200 },
  statLabel: { fontSize: 7, color: colors.slate400, textTransform: 'uppercase' as const, marginBottom: 2 },
  statValue: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: colors.slate900 },
  statSub: { fontSize: 7, color: colors.slate500, marginTop: 1 },

  // Sections
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: colors.slate900, marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: colors.slate200 },
  sectionSubtitle: { fontSize: 8, color: colors.slate500, marginBottom: 8 },

  // Quick read
  quickReadRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  quickReadCol: { flex: 1, padding: 8, borderRadius: 4 },
  quickReadLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase' as const, marginBottom: 4 },
  quickReadItem: { fontSize: 8, marginBottom: 3, color: colors.slate700 },
  conclusion: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: colors.slate900, marginTop: 4, padding: 8, backgroundColor: colors.slate50, borderRadius: 4 },

  // Red flags
  flagCard: { padding: 10, marginBottom: 6, borderRadius: 4, borderWidth: 1, borderColor: colors.slate200, backgroundColor: colors.white },
  flagHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  flagBadge: { fontSize: 6, fontFamily: 'Helvetica-Bold', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 2, textTransform: 'uppercase' as const },
  flagIssue: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: colors.slate900, marginBottom: 3 },
  flagBody: { fontSize: 8, color: colors.slate700, marginBottom: 3 },
  flagAsk: { fontSize: 8, color: colors.emerald, fontFamily: 'Helvetica-Bold' },

  // Savings
  savingsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  savingsTotal: { padding: 10, borderRadius: 6, backgroundColor: colors.emeraldLight, alignItems: 'flex-end' as const },
  savingsTotalLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: colors.emerald, textTransform: 'uppercase' as const },
  savingsTotalAmount: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: colors.emerald },
  savingsItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 8, marginBottom: 4, borderRadius: 4, borderWidth: 1 },
  savingsAsk: { flex: 1, fontSize: 8, color: colors.slate700 },
  savingsAmount: { fontSize: 9, fontFamily: 'Helvetica-Bold', marginLeft: 8 },
  savingsRationale: { fontSize: 7, color: colors.slate500, fontStyle: 'italic' as const, marginTop: 2 },

  // Strategy
  strategyRow: { flexDirection: 'row', gap: 10 },
  strategyCol: { flex: 1 },
  strategyLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: colors.slate400, textTransform: 'uppercase' as const, marginBottom: 4 },
  strategyItem: { fontSize: 8, color: colors.slate700, marginBottom: 3, paddingLeft: 8 },
  askBadge: { fontSize: 6, fontFamily: 'Helvetica-Bold', paddingHorizontal: 3, paddingVertical: 1, borderRadius: 2, marginBottom: 2 },

  // Footer
  footer: { position: 'absolute' as const, bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: colors.slate200, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 7, color: colors.slate400 },

  // Score breakdown
  breakdownRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  breakdownBar: { flex: 1 },
  breakdownLabel: { fontSize: 7, color: colors.slate500, marginBottom: 2 },
  breakdownTrack: { height: 4, backgroundColor: colors.slate100, borderRadius: 2 },
  breakdownFill: { height: 4, borderRadius: 2 },
  breakdownPct: { fontSize: 7, fontFamily: 'Helvetica-Bold', marginTop: 1 },
})

function formatAmount(amount: number, currency: string = 'EUR'): string {
  const symbol = currency === 'EUR' ? '\u20AC' : currency === 'GBP' ? '\u00A3' : currency === 'USD' ? '$' : currency
  if (amount >= 1000000) return `${symbol}${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `${symbol}${Math.round(amount).toLocaleString('en-US')}`
  return `${symbol}${Math.round(amount)}`
}

export function AnalysisPDF({ output, locale = 'en' }: { output: DealOutput; locale?: string }) {
  const logoBase64 = getLogoBase64()
  const score = output.score ?? 0
  const scoreColor = score >= 80 ? colors.emerald : score >= 60 ? colors.amber : colors.red
  const scoreColorLight = score >= 80 ? colors.emeraldLight : score >= 60 ? colors.amberLight : colors.redLight

  const ps = output.potential_savings as any
  const savingsTotal = ps?.total !== undefined ? (typeof ps.total === 'number' ? ps.total : 0) : 0
  const mustHaveSavings = ps?.must_have || []
  const niceToHaveSavings = ps?.nice_to_have || []
  const savingsCurrency = ps?.currency || output.snapshot?.currency || 'EUR'

  const bd = output.score_breakdown
  const pricingPct = bd ? Math.round((bd.pricing_fairness / 50) * 100) : 0
  const termsPct = bd ? Math.round((bd.terms_protections / 30) * 100) : 0
  const leveragePct = bd ? Math.round((bd.leverage_position / 20) * 100) : 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {logoBase64 ? <Image src={logoBase64} style={styles.logo} /> : <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: colors.slate900 }}>TermLift</Text>}
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>{locale === 'fr' ? 'Analyse commerciale' : 'Commercial Analysis'}</Text>
            <Text style={styles.headerDate}>{new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{output.title}</Text>
          <Text style={styles.subtitle}>{output.verdict}</Text>
        </View>

        {/* Score + Key Stats */}
        <View style={styles.scoreRow}>
          <View style={[styles.scoreBox, { backgroundColor: scoreColorLight }]}>
            <Text style={[styles.scoreNumber, { color: scoreColor }]}>{score}</Text>
            <Text style={[styles.scoreLabel, { color: scoreColor }]}>{output.score_label}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{locale === 'fr' ? 'Engagement total' : 'Total Commitment'}</Text>
            <Text style={styles.statValue}>{output.snapshot?.total_commitment}</Text>
            <Text style={styles.statSub}>{output.snapshot?.term}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{locale === 'fr' ? 'Alertes' : 'Red Flags'}</Text>
            <Text style={[styles.statValue, { color: colors.red }]}>{output.red_flags?.length || 0}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: colors.emerald }]}>{locale === 'fr' ? 'Economies' : 'Savings'}</Text>
            <Text style={[styles.statValue, { color: colors.emerald }]}>{savingsTotal > 0 ? formatAmount(savingsTotal, savingsCurrency) : 'N/A'}</Text>
          </View>
        </View>

        {/* Score Breakdown */}
        {bd && (
          <View style={[styles.section, { marginBottom: 12 }]}>
            <View style={styles.breakdownRow}>
              {[
                { label: locale === 'fr' ? 'Prix' : 'Pricing', pct: pricingPct, color: pricingPct >= 70 ? colors.emerald : pricingPct >= 50 ? colors.amber : colors.red },
                { label: locale === 'fr' ? 'Conditions' : 'Terms', pct: termsPct, color: termsPct >= 70 ? colors.emerald : termsPct >= 50 ? colors.amber : colors.red },
                { label: locale === 'fr' ? 'Levier' : 'Leverage', pct: leveragePct, color: leveragePct >= 70 ? colors.emerald : leveragePct >= 50 ? colors.amber : colors.red },
              ].map((bar) => (
                <View key={bar.label} style={styles.breakdownBar}>
                  <Text style={styles.breakdownLabel}>{bar.label}</Text>
                  <View style={styles.breakdownTrack}>
                    <View style={[styles.breakdownFill, { width: `${bar.pct}%`, backgroundColor: bar.color }]} />
                  </View>
                  <Text style={[styles.breakdownPct, { color: bar.color }]}>{bar.pct}%</Text>
                </View>
              ))}
            </View>
            {output.score_rationale && <Text style={{ fontSize: 7, color: colors.slate500, fontStyle: 'italic' }}>{output.score_rationale}</Text>}
          </View>
        )}

        {/* Quick Read */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{locale === 'fr' ? 'Apercu rapide' : 'Quick Read'}</Text>
          <View style={styles.quickReadRow}>
            <View style={[styles.quickReadCol, { backgroundColor: colors.emeraldLight }]}>
              <Text style={[styles.quickReadLabel, { color: colors.emerald }]}>{locale === 'fr' ? 'Points forts' : 'Solid'}</Text>
              {output.quick_read?.whats_solid?.map((item, i) => (
                <Text key={i} style={styles.quickReadItem}>{'\u2022'} {item}</Text>
              ))}
            </View>
            <View style={[styles.quickReadCol, { backgroundColor: colors.amberLight }]}>
              <Text style={[styles.quickReadLabel, { color: colors.amber }]}>{locale === 'fr' ? 'Points de vigilance' : 'Concerning'}</Text>
              {output.quick_read?.whats_concerning?.map((item, i) => (
                <Text key={i} style={styles.quickReadItem}>{'\u2022'} {item}</Text>
              ))}
            </View>
          </View>
          {output.quick_read?.conclusion && <Text style={styles.conclusion}>{output.quick_read.conclusion}</Text>}
        </View>

        {/* Red Flags */}
        {output.red_flags && output.red_flags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{locale === 'fr' ? 'Alertes' : 'Red Flags'} ({output.red_flags.length})</Text>
            {output.red_flags.map((flag, i) => (
              <View key={i} style={styles.flagCard}>
                <View style={styles.flagHeader}>
                  <Text style={[styles.flagBadge, {
                    backgroundColor: (flag as any).severity === 'high' ? colors.redLight : colors.amberLight,
                    color: (flag as any).severity === 'high' ? colors.red : colors.amber,
                  }]}>{(flag as any).severity || 'medium'}</Text>
                  <Text style={[styles.flagBadge, { backgroundColor: colors.slate100, color: colors.slate500 }]}>{flag.type}</Text>
                </View>
                <Text style={styles.flagIssue}>{flag.issue}</Text>
                <Text style={styles.flagBody}>{flag.why_it_matters}</Text>
                <Text style={styles.flagAsk}>{locale === 'fr' ? 'Demander:' : 'Ask for:'} {flag.what_to_ask_for}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Savings */}
        {(mustHaveSavings.length > 0 || niceToHaveSavings.length > 0) && (
          <View style={styles.section} break={output.red_flags && output.red_flags.length > 3}>
            <View style={styles.savingsHeader}>
              <Text style={styles.sectionTitle}>{locale === 'fr' ? 'Economies potentielles' : 'Potential Savings'}</Text>
              <View style={styles.savingsTotal}>
                <Text style={styles.savingsTotalLabel}>{locale === 'fr' ? 'Total' : 'Total'}</Text>
                <Text style={styles.savingsTotalAmount}>{formatAmount(savingsTotal, savingsCurrency)}</Text>
              </View>
            </View>
            {mustHaveSavings.map((item: any, i: number) => (
              <View key={i} style={[styles.savingsItem, { borderColor: colors.emerald, backgroundColor: colors.emeraldLight }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.savingsAsk}>{item.ask}</Text>
                  {item.rationale && <Text style={styles.savingsRationale}>{item.rationale}</Text>}
                </View>
                <Text style={[styles.savingsAmount, { color: colors.emerald }]}>{formatAmount(item.amount || 0, savingsCurrency)}</Text>
              </View>
            ))}
            {niceToHaveSavings.map((item: any, i: number) => (
              <View key={i} style={[styles.savingsItem, { borderColor: colors.amber, backgroundColor: colors.amberLight }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.savingsAsk}>{item.ask}</Text>
                  {item.rationale && <Text style={styles.savingsRationale}>{item.rationale}</Text>}
                </View>
                <Text style={[styles.savingsAmount, { color: colors.amber }]}>{formatAmount(item.amount || 0, savingsCurrency)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Strategy */}
        <View style={styles.section} break>
          <Text style={styles.sectionTitle}>{locale === 'fr' ? 'Strategie de negociation' : 'Negotiation Strategy'}</Text>

          {/* Must-have + Nice-to-have asks */}
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.strategyLabel}>{locale === 'fr' ? 'A demander' : 'Push For'}</Text>
            {output.what_to_ask_for?.must_have?.map((item, i) => (
              <View key={i} style={{ marginBottom: 4 }}>
                <Text style={[styles.askBadge, { backgroundColor: colors.emeraldLight, color: colors.emerald }]}>{locale === 'fr' ? 'INDISPENSABLE' : 'MUST-HAVE'}</Text>
                <Text style={styles.strategyItem}>{item}</Text>
              </View>
            ))}
            {output.what_to_ask_for?.nice_to_have?.map((item, i) => (
              <View key={i} style={{ marginBottom: 4 }}>
                <Text style={[styles.askBadge, { backgroundColor: colors.slate100, color: colors.slate500 }]}>{locale === 'fr' ? 'SOUHAITABLE' : 'NICE-TO-HAVE'}</Text>
                <Text style={styles.strategyItem}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.strategyRow}>
            <View style={styles.strategyCol}>
              <Text style={styles.strategyLabel}>{locale === 'fr' ? 'Vos atouts' : 'Your Leverage'}</Text>
              {output.negotiation_plan?.leverage_you_have?.map((item, i) => (
                <Text key={i} style={styles.strategyItem}>{'\u2022'} {item}</Text>
              ))}
            </View>
            <View style={styles.strategyCol}>
              <Text style={styles.strategyLabel}>{locale === 'fr' ? 'Ce que vous pouvez offrir' : 'Can Offer'}</Text>
              {output.negotiation_plan?.trades_you_can_offer?.map((item, i) => (
                <Text key={i} style={styles.strategyItem}>{'\u2022'} {item}</Text>
              ))}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Generated by TermLift | termlift.com</Text>
          <Text style={styles.footerText}>{output.disclaimer || 'Commercial guidance, not legal advice.'}</Text>
        </View>
      </Page>
    </Document>
  )
}
