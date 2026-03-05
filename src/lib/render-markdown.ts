// Shared helper to render markdown from deal output JSON
export function renderMarkdown(output: any): string {
  return `# ${output.title}

## Snapshot

**Vendor / Product:** ${output.snapshot?.vendor_product || output.vendor}

**Term:** ${output.snapshot?.term || 'N/A'}

**Total Commitment:** ${output.snapshot?.total_commitment || 'N/A'}

**Billing / Payment:** ${output.snapshot?.billing_payment || 'N/A'}

**Pricing Model:** ${output.snapshot?.pricing_model || 'N/A'}

**Deal Type:** ${output.snapshot?.deal_type || 'N/A'}

## Quick Read

**What's Solid:**
${(output.quick_read?.whats_solid || []).map((s: string) => `- ${s}`).join('\n')}

**What's Concerning:**
${(output.quick_read?.whats_concerning || []).map((s: string) => `- ${s}`).join('\n')}

**Conclusion:** ${output.quick_read?.conclusion || 'N/A'}

## Red Flags

${(output.red_flags || []).map((flag: any) => `
### ${flag.type}: ${flag.issue}

**Why it matters:** ${flag.why_it_matters}

**What to ask for:** ${flag.what_to_ask_for}

**If they push back:** ${flag.if_they_push_back}
`).join('\n')}

## Negotiation Plan

**Leverage You Have:**
${(output.negotiation_plan?.leverage_you_have || []).map((l: string) => `- ${l}`).join('\n')}

**Must-Have Asks:**
${(output.negotiation_plan?.must_have_asks || []).map((a: string) => `- ${a}`).join('\n')}

**Nice-to-Have Asks:**
${(output.negotiation_plan?.nice_to_have_asks || []).map((a: string) => `- ${a}`).join('\n')}

**Trades You Can Offer:**
${(output.negotiation_plan?.trades_you_can_offer || []).map((t: string) => `- ${t}`).join('\n')}

## What to Ask For

### Must-Have
${(output.what_to_ask_for?.must_have || []).map((ask: string) => `- ${ask}`).join('\n')}

### Nice-to-Have
${(output.what_to_ask_for?.nice_to_have || []).map((ask: string) => `- ${ask}`).join('\n')}

## Email Drafts

### Neutral
**Subject:** ${output.email_drafts.neutral.subject}

${output.email_drafts.neutral.body}

### Firm
**Subject:** ${output.email_drafts.firm.subject}

${output.email_drafts.firm.body}

### Final Push
**Subject:** ${output.email_drafts.final_push.subject}

${output.email_drafts.final_push.body}

## Assumptions
${(output.assumptions || []).map((a: string) => `- ${a}`).join('\n')}

## Disclaimer
${output.disclaimer}
`
}
