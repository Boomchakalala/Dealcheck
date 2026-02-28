import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

- The proposal lacks flexibility with rigid commitment terms
- Payment structure appears to favor the vendor's cash flow over buyer protection
- Limited details on service levels, exit terms, and performance guarantees

## 2️⃣ What Matters Most

- **Payment terms**: Upfront or annual payment significantly increases your risk. Request monthly or quarterly billing.
- **Commitment length**: 12-month minimum may be standard, but ensure there's a clear exit clause for non-performance.
- **Service scope**: The proposal lacks specifics. Don't commit until you have a detailed SLA and deliverables list.

## 3️⃣ What to Ask For

- Ask for monthly payment terms, or at minimum quarterly billing with the option to review and exit after 6 months.
- Request a detailed Service Level Agreement (SLA) that outlines uptime guarantees, support response times, and remedies for non-performance.
- Clarify what happens if you need to terminate early - request a pro-rated refund clause or at least a 30-day cancellation notice option.
- Link the payment schedule to performance milestones or service delivery checkpoints.

## 4️⃣ Suggested Reply

---

Hi [Vendor Name],

Thank you for the proposal. We're interested in moving forward, but would like to discuss a few items to ensure this works for both parties:

1. **Payment terms**: We'd prefer monthly billing rather than upfront payment. Would quarterly billing be possible as an alternative?

2. **Service details**: Could you provide a detailed SLA covering uptime guarantees, support response times, and what happens if service levels aren't met?

3. **Flexibility**: We'd like the option to review at 6 months. Can we include a clause allowing termination with 30 days notice if service expectations aren't met?

Happy to discuss these points further. Looking forward to finding a structure that works well for both sides.

Best regards,
[Your Name]

---

## 5️⃣ If They Push Back

If they insist on annual prepayment and won't budge, consider requesting a discount (10-15%) in exchange for the prepayment risk you're taking on. You could also ask for a trial period (1-2 months) at the monthly rate before committing to the annual term, which demonstrates good faith on both sides.

---

**Note**: This is a demo analysis. To use real AI-powered analysis, please add a valid OpenAI API key with available credits.`;
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
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.warn('OpenAI API key not configured, using demo mode');
      return NextResponse.json({
        analysis: generateDemoAnalysis(input),
        demo: true
      });
    }

    try {
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

    } catch (openaiError: any) {
      // Handle OpenAI-specific errors
      console.error('OpenAI API error:', openaiError);

      // If quota exceeded or authentication failed, fall back to demo mode
      if (openaiError.status === 429 || openaiError.status === 401) {
        console.warn('OpenAI quota exceeded or auth failed, using demo mode');
        return NextResponse.json({
          analysis: generateDemoAnalysis(input),
          demo: true,
          warning: 'Using demo mode. OpenAI API quota exceeded or invalid key. Please check your billing at platform.openai.com'
        });
      }

      throw openaiError;
    }

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze the deal. Please try again.' },
      { status: 500 }
    );
  }
}
