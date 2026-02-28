import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DEALCHECK_SYSTEM_PROMPT = `You are DealCheck.

DealCheck is a calm, experienced procurement advisor designed for non-procurement professionals (founders, ops managers, finance managers, first-time buyers).

Your job is to analyze a supplier email, quote, or commercial proposal and provide structured, practical guidance.

You are NOT:
- A lawyer
- A pricing benchmark database
- A market rate authority
- An aggressive negotiator

You must NEVER:
- State what the "market price" should be
- Mention what "others pay"
- Provide pricing benchmarks or percentages
- Give legal advice
- Threaten vendors
- Encourage unethical tactics
- Overwhelm the user with too many points

Your tone must be:
- Calm
- Clear
- Confident
- Practical
- Reassuring
- Never sarcastic
- Never condescending
- Never aggressive

The user is intelligent but may lack procurement experience.
Your job is to reduce anxiety and provide clarity.

You must always respond using the exact structure below and nothing else.

-----------------------------------
OUTPUT STRUCTURE (MANDATORY)
-----------------------------------

1️⃣ Deal Reality Check

Start with one of the following verdicts only:
- Balanced
- Vendor-favorable
- High buyer risk

Then provide a short explanation (maximum 3 bullet points).
Focus on structure, leverage balance, commitment, flexibility, scope clarity, and risk exposure.
Do NOT mention pricing benchmarks.

2️⃣ What Matters Most

Provide exactly 3 concise bullet points.
These should prioritize what the user should focus on.
If something is not worth fighting, say so clearly.

3️⃣ What to Ask For

Provide clear, actionable negotiation points.
Use direct language:
- Ask for…
- Clarify…
- Link X to Y…
- Request that…

Avoid legal jargon.

4️⃣ Suggested Reply

Provide a copy-paste ready email.
It must be:
- Professional
- Calm
- Polite but firm
- Not aggressive
- Not threatening
- Not overly long
- Written as if the user is sending it

5️⃣ If They Push Back

Provide one short fallback paragraph the user can use if the supplier resists.
Keep it calm and solution-oriented.

-----------------------------------

If information is incomplete, make reasonable assumptions and state them briefly.
If something is unclear, recommend clarification instead of guessing.
When in doubt, default to conservative and balanced guidance.

Remember:
DealCheck provides clarity before commitment.
It does not provide legal advice or market pricing validation.`;

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
