# DealCheck

**Clarity before commitment**

DealCheck is a procurement advisor tool for non-procurement professionals (founders, ops managers, finance managers, first-time buyers). Analyze supplier emails, quotes, and commercial proposals to get structured, practical guidance.

## Features

- **Paste & Analyze**: Simple textarea input for supplier communications
- **AI-Powered**: Uses OpenAI GPT-4 to provide structured analysis
- **5-Section Output**:
  1. Deal Reality Check
  2. What Matters Most
  3. What to Ask For
  4. Suggested Reply (copy-paste ready)
  5. If They Push Back
- **Calm & Clear**: Designed to reduce anxiety and provide practical clarity

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- OpenAI API

## Setup

1. Install dependencies:
   ```bash
   bun install
   ```

2. Create `.env.local` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Run the development server:
   ```bash
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Paste a supplier email, quote, or commercial proposal into the textarea
2. Click "Analyze Deal"
3. Receive structured guidance following the 5-section format
4. Use the suggested reply template to respond professionally

## What DealCheck Does NOT Do

- Provide legal advice
- Give pricing benchmarks or market rates
- Use aggressive negotiation tactics
- Overwhelm you with too many points

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)

## License

MIT
