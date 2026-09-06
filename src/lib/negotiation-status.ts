/**
 * Negotiation request status — one source of truth for the admin list, the
 * admin detail page and the status control. The values are the DB enum;
 * nothing here changes what gets stored.
 */
export const NEGOTIATION_STATUSES = [
  'new', 'reviewing', 'waiting_for_client_info', 'ready_to_negotiate',
  'negotiating', 'offer_received', 'closed_won', 'closed_lost',
] as const
export type NegotiationStatus = (typeof NEGOTIATION_STATUSES)[number]

/** The working pipeline, in order. Closing states are terminal and live outside the strip. */
export const PIPELINE: NegotiationStatus[] = ['new', 'reviewing', 'ready_to_negotiate', 'negotiating', 'offer_received']

export const STATUS_LABEL: Record<NegotiationStatus, { en: string; fr: string }> = {
  new: { en: 'New', fr: 'Nouveau' },
  reviewing: { en: 'Reviewing', fr: 'En revue' },
  waiting_for_client_info: { en: 'Waiting on client', fr: 'En attente du client' },
  ready_to_negotiate: { en: 'Ready', fr: 'Prêt' },
  negotiating: { en: 'Negotiating', fr: 'En négociation' },
  offer_received: { en: 'Offer received', fr: 'Offre reçue' },
  closed_won: { en: 'Closed — won', fr: 'Clôturé — gagné' },
  closed_lost: { en: 'Closed — lost', fr: 'Clôturé — perdu' },
}

/** Chip tone per status. */
export function statusTone(s: string): 'neutral' | 'green' | 'warn' | 'risk' | 'info' | 'ink' {
  switch (s) {
    case 'new': return 'ink'
    case 'reviewing': return 'warn'
    case 'waiting_for_client_info': return 'warn'
    case 'ready_to_negotiate': return 'info'
    case 'negotiating': return 'info'
    case 'offer_received': return 'green'
    case 'closed_won': return 'green'
    case 'closed_lost': return 'neutral'
    default: return 'neutral'
  }
}

export function isClosedStatus(s: string): boolean {
  return s === 'closed_won' || s === 'closed_lost'
}

/** Statuses where the ball is in TermLift's court — surfaced first in the admin list. */
export function needsAdminAction(s: string): boolean {
  return s === 'new' || s === 'offer_received' || s === 'reviewing'
}

/** Index on the client-visible pipeline strip (waiting_for_client_info sits at the Reviewing step). */
export function pipelineIndex(s: string): number {
  if (isClosedStatus(s)) return PIPELINE.length
  if (s === 'waiting_for_client_info') return PIPELINE.indexOf('reviewing')
  const i = PIPELINE.indexOf(s as NegotiationStatus)
  return i < 0 ? 0 : i
}

export function statusLabel(s: string, locale = 'en'): string {
  const l = STATUS_LABEL[s as NegotiationStatus]
  return l ? (locale === 'fr' ? l.fr : l.en) : s
}
