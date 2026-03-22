/** Simple markdown to HTML for blog posts */
export function renderMarkdownToHtml(md: string): string {
  return md
    // Horizontal rules
    .replace(/^---$/gm, '<hr />')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Blockquotes (multi-line)
    .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // Paragraphs (double newlines)
    .replace(/\n\n(?!<)/g, '</p><p>')
    // Wrap in initial p if needed
    .replace(/^(?!<)/, '<p>')
    .replace(/(?!>)$/, '</p>')
    // Clean up empty paragraphs
    .replace(/<p>\s*<\/p>/g, '')
    // Clean up blockquote nesting
    .replace(/<\/blockquote>\s*<blockquote>/g, '')
}

// Shared helper to render markdown from deal output JSON
export function renderMarkdown(output: any): string {
  const verdictLabel = output.verdict_type === 'competitive'
    ? 'Competitive deal'
    : output.verdict_type === 'overpay_risk'
      ? 'Overpay risk'
      : 'Negotiate before signing'

  return `# ${output.title}

**Verdict:** ${verdictLabel} — ${output.verdict || output.quick_read?.conclusion || 'Review this deal.'}
${output.price_insight ? `\n**Price insight:** ${output.price_insight}\n` : ''}

## Deal Snapshot

**Vendor / Product:** ${output.snapshot?.vendor_product || output.vendor}

**Term:** ${output.snapshot?.term || 'N/A'}

**Total Commitment:** ${output.snapshot?.total_commitment || 'N/A'}

**Billing / Payment:** ${output.snapshot?.billing_payment || 'N/A'}

**Pricing Model:** ${output.snapshot?.pricing_model || 'N/A'}

**Deal Type:** ${output.snapshot?.deal_type || 'N/A'}

## What's Working

${(output.quick_read?.whats_solid || []).map((s: string) => `- ${s}`).join('\n')}

## Watch Out

${(output.quick_read?.whats_concerning || []).map((s: string) => `- ${s}`).join('\n')}

## Red Flags

${(output.red_flags || []).map((flag: any) => `
### ${flag.type}: ${flag.issue}

**Why it matters:** ${flag.why_it_matters}

**What to ask:** ${flag.what_to_ask_for}

**If they push back:** ${flag.if_they_push_back}
`).join('\n')}

## Your Negotiation Plan

**Leverage You Have:**
${(output.negotiation_plan?.leverage_you_have || []).map((l: string) => `- ${l}`).join('\n')}

**Must-Have Asks:**
${(output.what_to_ask_for?.must_have || []).map((a: string) => `- ${a}`).join('\n')}

**Nice-to-Have Asks:**
${(output.what_to_ask_for?.nice_to_have || []).map((a: string) => `- ${a}`).join('\n')}

**Trades You Can Offer:**
${(output.negotiation_plan?.trades_you_can_offer || []).map((t: string) => `- ${t}`).join('\n')}

## Email Drafts

### Friendly
**Subject:** ${output.email_drafts.neutral.subject}

${output.email_drafts.neutral.body}

### Direct
**Subject:** ${output.email_drafts.firm.subject}

${output.email_drafts.firm.body}

### Urgent
**Subject:** ${output.email_drafts.final_push.subject}

${output.email_drafts.final_push.body}

## Assumptions
${(output.assumptions || []).map((a: string) => `- ${a}`).join('\n')}

## Disclaimer
${output.disclaimer}
`
}
