# DealCheck

**Clarity before commitment**

DealCheck is a procurement advisor tool for non-procurement professionals (founders, ops managers, finance managers, first-time buyers). Analyze supplier emails, quotes, and commercial proposals to get structured, practical guidance.

## Features

- **📄 File Upload Support**: Upload PDF documents, screenshots (PNG/JPG), or DOCX files
- **🤖 AI-Powered Analysis**: Uses OpenAI GPT-4 to provide structured analysis
- **📝 Text Extraction**: Automatically extracts text from uploaded documents using OCR
- **🎨 Modern UI**: Clean, professional design with gradients and smooth animations
- **5-Section Output**:
  1. 💡 Deal Reality Check
  2. 🎯 What Matters Most
  3. 📋 What to Ask For
  4. ✉️ Suggested Reply (copy-paste ready)
  5. 🔄 If They Push Back
- **Calm & Clear**: Designed to reduce anxiety and provide practical clarity

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- OpenAI API
- PDF Parser (pdf-parse)
- OCR (Tesseract.js)
- DOCX Parser (mammoth)
- Icons (lucide-react)

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

### Option 1: Upload a File
1. Click the upload area or drag and drop a file
2. Supported formats: PDF, PNG, JPG, DOCX
3. Wait for text extraction to complete
4. Review the extracted text (edit if needed)
5. Click "Analyze Deal"

### Option 2: Paste Text Directly
1. Paste a supplier email, quote, or commercial proposal into the textarea
2. Click "Analyze Deal"
3. Receive structured guidance following the 5-section format
4. Use the suggested reply template to respond professionally

## Supported File Types

- **PDF** (.pdf) - Contract documents, proposals, quotes
- **Images** (.png, .jpg, .jpeg, .gif, .webp) - Screenshots of emails or quotes
- **Word Documents** (.docx, .doc) - Commercial proposals and contracts

## What DealCheck Does NOT Do

- Provide legal advice
- Give pricing benchmarks or market rates
- Use aggressive negotiation tactics
- Overwhelm you with too many points

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)

## Design Features

- Gradient backgrounds (indigo/purple theme)
- Sticky header with branding
- File upload with drag-and-drop support
- Loading states and animations
- Error handling with clear messaging
- Responsive design for mobile and desktop
- Professional typography and spacing

## License

MIT
