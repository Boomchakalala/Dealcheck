/**
 * Analyzes text to identify missing information in procurement quotes
 * Uses keyword heuristics (no AI calls)
 */

export interface MissingInfoItem {
  label: string;
  keywords: string[];
  missing: boolean;
}

export function getMissingInfo(text: string): MissingInfoItem[] {
  const lowerText = text.toLowerCase();

  const checks: Omit<MissingInfoItem, 'missing'>[] = [
    {
      label: 'Contract term & renewal terms',
      keywords: ['term', 'renewal', 'auto-renew', 'notice', 'duration', 'period'],
    },
    {
      label: 'Price increase / indexation clause',
      keywords: ['increase', 'uplift', 'cpi', 'indexation', 'inflation', 'adjustment', 'annual increase'],
    },
    {
      label: 'Termination for convenience / exit terms',
      keywords: ['terminate', 'termination', 'for convenience', 'cancellation', 'notice period', 'exit'],
    },
    {
      label: 'SLA / uptime guarantees',
      keywords: ['sla', 'uptime', 'service credits', 'response time', 'severity', 'support hours', 'availability'],
    },
    {
      label: 'Liability cap / limitation',
      keywords: ['limitation of liability', 'liability cap', 'aggregate liability', 'liable', 'damages'],
    },
    {
      label: 'Data protection / DPA terms',
      keywords: ['dpa', 'gdpr', 'data processing', 'sub-processor', 'breach notification', 'data protection'],
    },
    {
      label: 'Security & compliance certifications',
      keywords: ['soc 2', 'iso 27001', 'iso27001', 'penetration test', 'pen test', 'encryption', 'certification'],
    },
    {
      label: 'Audit rights / security assessment',
      keywords: ['audit', 'assessment', 'security questionnaire', 'right to audit', 'inspect'],
    },
    {
      label: 'Payment terms (net days)',
      keywords: ['net 30', 'net 45', 'net 60', 'payment terms', 'invoice due', 'payment due'],
    },
    {
      label: 'Scope boundaries / exclusions',
      keywords: ['exclusions', 'out of scope', 'fair use', 'overage', 'limitations', 'not included'],
    },
  ];

  // Check each item for keyword presence
  const results: MissingInfoItem[] = checks.map(check => {
    const hasKeyword = check.keywords.some(keyword => lowerText.includes(keyword));
    return {
      ...check,
      missing: !hasKeyword,
    };
  });

  return results;
}

/**
 * Get only the missing items (for display)
 */
export function getMissingItems(text: string): MissingInfoItem[] {
  return getMissingInfo(text).filter(item => item.missing);
}
