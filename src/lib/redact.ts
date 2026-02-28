/**
 * Client-side redaction utility for masking sensitive information
 * before sending to AI analysis API
 */

export function redactText(text: string): string {
  let redacted = text;

  // 1. Email addresses
  redacted = redacted.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    '[EMAIL]'
  );

  // 2. Phone numbers (various formats)
  // International: +XX XXX XXX XXXX, (XXX) XXX-XXXX, XXX-XXX-XXXX, etc.
  redacted = redacted.replace(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    '[PHONE]'
  );
  redacted = redacted.replace(
    /\b\d{10,}\b/g, // 10+ consecutive digits (likely phone/account number)
    '[PHONE]'
  );

  // 3. IBAN and bank-like strings
  redacted = redacted.replace(
    /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/g,
    '[IBAN]'
  );

  // 4. IDs like INV-2026-0192, PO-12345, QT-2024-001, etc.
  redacted = redacted.replace(
    /\b(INV|PO|QUOTE|QT|ORDER|ORD|REF|ID)[-_]?\d{4,}[-_]?\d*\b/gi,
    '[ID]'
  );

  // 5. Contact/Company lines - redact values after common labels
  const contactPatterns = [
    /(?:Prepared For|Contact|Supplier|Customer|Client|Vendor|Attn|Attention):\s*([^\n]+)/gi,
    /(?:Name):\s*([^\n]+)/gi,
  ];

  contactPatterns.forEach(pattern => {
    redacted = redacted.replace(pattern, (match, value) => {
      return match.replace(value, '[REDACTED]');
    });
  });

  // 6. Currency amounts with bucketing
  // Match: $12,345.67, €12.345,67, 12345 EUR, USD 12,345, etc.
  const currencyPattern = /([€$£¥])\s?([\d,\.]+)|(\d[\d,\.]+)\s?(EUR|USD|GBP|CHF|CAD|AUD)/gi;

  redacted = redacted.replace(currencyPattern, (match) => {
    // Extract numeric value
    const numStr = match.replace(/[€$£¥EUR USD GBP CHF CAD AUD,\s]/gi, '');
    const amount = parseFloat(numStr);

    if (isNaN(amount)) return match;

    // Bucket the amount
    if (amount < 1000) return '[AMOUNT <1k]';
    if (amount < 10000) return '[AMOUNT 1-10k]';
    if (amount < 50000) return '[AMOUNT 10-50k]';
    if (amount < 200000) return '[AMOUNT 50-200k]';
    return '[AMOUNT >200k]';
  });

  return redacted;
}

/**
 * Quick test function (run in console if needed)
 */
export function testRedaction() {
  const sample = `
    Contact: John Smith
    Email: john.smith@acme.com
    Phone: +1 (555) 123-4567

    Quote ID: INV-2026-0192
    Amount: $12,345.67
    Payment: €25,000 upfront

    IBAN: GB82 WEST 1234 5698 7654 32
    Net 30 days, total 45000 EUR
  `;

  console.log('Original:', sample);
  console.log('Redacted:', redactText(sample));
}
