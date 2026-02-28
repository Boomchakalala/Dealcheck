import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const DEALCHECK_SYSTEM_PROMPT = `You are DealCheck - a sharp, experienced procurement advisor for non-procurement professionals.

Your analysis must be:
- SHARP and SPECIFIC to the actual deal terms provided
- ACTIONABLE with clear next steps
- CONCISE - no fluff or generic advice
- PRACTICAL - focused on what actually matters

Core principles:
- Never mention market rates, benchmarks, or what "others pay"
- Never provide legal advice
- Stay calm, confident, and professional
- Focus on leverage, risk, and flexibility

CRITICAL OUTPUT RULES:
1. Use ONLY the exact emoji indicators shown below (1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣)
2. Keep bullet points SHORT - max 1-2 sentences each
3. Make the suggested email TIGHT - 3-4 short paragraphs max
4. Be SPECIFIC to the deal - reference actual terms mentioned

-----------------------------------
OUTPUT STRUCTURE (MANDATORY)
-----------------------------------

## 1️⃣ Deal Reality Check

**Verdict: [Choose ONE: Balanced | Vendor-favorable | High buyer risk]**

- [Specific observation about THIS deal's structure]
- [Specific observation about payment/commitment terms]
- [Specific observation about flexibility or risk]

## 2️⃣ What Matters Most

- **[Specific term]**: [Why it matters and what to do - ONE sentence]
- **[Specific term]**: [Why it matters and what to do - ONE sentence]
- **[Specific term]**: [Why it matters and what to do - ONE sentence]

## 3️⃣ What to Ask For

- [Specific, actionable request based on actual terms]
- [Specific, actionable request based on actual terms]
- [Specific, actionable request based on actual terms]
- [Optional 4th point if critical]

## 4️⃣ Suggested Reply

---

Hi [Vendor Name],

Thanks for the proposal. We're interested, but need to discuss a few points:

[2-3 specific, numbered requests referencing actual deal terms. Keep each point to 1-2 sentences. Be direct but professional.]

Looking forward to working this out.

Best,
[Your Name]

---

## 5️⃣ If They Push Back

[One tight paragraph with a specific fallback strategy. Reference actual terms. 2-3 sentences max.]

-----------------------------------

EXAMPLES OF SHARP vs GENERIC:

❌ GENERIC: "Payment terms may not be favorable"
✅ SHARP: "**Annual prepayment ($24K upfront)**: Shifts all risk to you. Request quarterly billing or at minimum a 6-month checkpoint."

❌ GENERIC: "You should negotiate better terms"
✅ SHARP: "Ask for monthly payment terms, or if they insist on annual, request a 15% discount to offset the prepayment risk."

Remember: BE SPECIFIC. REFERENCE ACTUAL TERMS. NO FLUFF.`;

// Demo analysis generator for when OpenAI is unavailable
function generateDemoAnalysis(input: string): string {
  return `## 1️⃣ Deal Reality Check

**Verdict: Vendor-favorable**

- Rigid 12-month lock-in with no clear exit terms if service fails
- Full annual prepayment ($6K) shifts all cash flow risk to buyer - you're funding their operations
- No SLA, support details, or performance guarantees mentioned - you're buying a black box

## 2️⃣ What Matters Most

- **Payment structure**: Annual prepayment is a red flag. Request monthly or quarterly billing - if they push back, ask for 15% discount to offset your risk.
- **Exit clause**: No mention of cancellation terms. Demand a 30-60 day out if they miss service levels.
- **Service scope**: "Standard support" is vague. Get specifics on uptime SLA, response times, and what happens when things break.

## 3️⃣ What to Ask For

- Switch to monthly billing, or at minimum quarterly with a 6-month review checkpoint
- Written SLA covering uptime (99%+), support response times, and remedies for non-performance
- Clear exit clause: 30-day termination notice if SLAs aren't met, with pro-rated refund
- Define "standard support" - email only? What response time? Weekends covered?

## 4️⃣ Suggested Reply

---

Hi [Vendor],

Thanks for the quote. We're interested but need to align on a few points before moving forward:

1. **Payment**: We need monthly billing. If annual is required, we'd need a 15% discount to offset the prepayment risk.

2. **SLA**: Please provide uptime guarantees, support response times, and what happens if targets aren't met.

3. **Flexibility**: We need a 30-day exit clause if service levels slip, with pro-rated refund.

Let me know if these work. Happy to discuss.

Best,
[Your Name]

---

## 5️⃣ If They Push Back

If they won't budge on annual payment, counter with: "We'll accept annual terms if you add a 60-day performance review at month 6, with the option to exit if SLAs aren't met, plus a 10% discount for the prepayment risk." This gives you an escape hatch and compensates for the risk.

---

**Note**: This is demo mode. For real AI analysis tailored to your deal, add a valid OpenAI API key with available credits.`;
}

export async function POST(request: Request) {
  try {
    const { input } = await request.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey?.length || 0);

    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add your API key to .env.local' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: DEALCHECK_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: input,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analysis = completion.choices[0]?.message?.content || 'No analysis generated';
    return NextResponse.json({ analysis });

  } catch (error: any) {
    console.error('Analysis error:', error);

    // Provide specific error messages
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'OpenAI API quota exceeded. Please check your billing at platform.openai.com' },
        { status: 429 }
      );
    }

    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Please check your API key.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to analyze the deal. Please try again.' },
      { status: 500 }
    );
  }
}
