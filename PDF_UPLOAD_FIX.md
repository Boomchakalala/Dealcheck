# PDF Upload Fix - COMPLETE ✅

## What Was Broken

You were getting `"Unexpected token Doctype// is not valid JSON"` and `"ENOENT: no such file or directory, open './test/data/05-versions-space.pdf'"` errors when uploading PDFs.

**Root Cause**: The `pdf-parse` npm library has test/debug code that runs automatically when `module.parent` is undefined, which happens in Next.js's bundled environment. It tries to read a hardcoded file path from the library's test folder.

---

## What I Fixed (4 Files)

### 1. `/src/app/api/upload/route.ts`
**Added Node.js runtime declaration:**
```typescript
export const runtime = 'nodejs'  // Forces Node.js runtime (required for pdf-parse)
```

### 2. `/next.config.ts`
**Excluded pdf-parse from bundling:**
```typescript
serverExternalPackages: ['pdf-parse', 'canvas']
```
This tells Next.js to use the raw npm package instead of bundling it, preventing the test code from running.

### 3. `/src/lib/extract.ts`
**Kept dynamic require() to load pdf-parse only when needed:**
```typescript
const pdfParse = require('pdf-parse')  // Inside function, not at top level
```

### 4. `/src/app/page.tsx`
**Added drag-and-drop support:**
- Added `isDragging` state
- Added `handleDragOver`, `handleDragLeave`, `handleDrop` handlers
- Shows "Drop your file here" indicator when dragging
- Supports dropping PDFs and screenshots directly

---

## How to Test

### Method 1: Upload PDF (Click)
1. Go to http://localhost:3000
2. Click "Upload file" button
3. Select any PDF from your computer
4. Wait for text extraction
5. Click "Analyze" to get AI analysis

### Method 2: Drag & Drop PDF
1. Go to http://localhost:3000
2. Drag a PDF file from your desktop
3. Drop it onto the text area
4. See "Drop your file here" indicator while dragging
5. PDF text extracts automatically
6. Click "Analyze"

### Method 3: Paste Screenshot (ChatGPT-style)
1. Take a screenshot (Windows: Win+Shift+S, Mac: Cmd+Shift+4)
2. Go to http://localhost:3000
3. Press Cmd/Ctrl+V to paste
4. OCR extraction happens automatically
5. Click "Analyze"

---

## What's Working Now

✅ PDF upload via file picker
✅ PDF drag-and-drop
✅ Screenshot paste (Cmd/Ctrl+V)
✅ Screenshot drag-and-drop
✅ Proper JSON error responses
✅ User-friendly error messages
✅ No hardcoded file paths
✅ No "Doctype" JSON errors

---

## Error Handling

If a PDF has no extractable text (scanned/image-based):
- Returns friendly error: "PDF appears to contain mostly images or is empty"
- Suggests: "Try taking a screenshot or pasting text directly"

If file type is unsupported:
- Returns: "Invalid file type. Only PDFs and images (PNG, JPG, WEBP) are supported"

If file is too large (>10MB):
- Returns: "File too large (max 10MB)"

---

## Server Status

🟢 Running: http://localhost:3000
✅ API Route: `/api/upload` (POST only)
✅ Runtime: Node.js
✅ Max File Size: 10MB
✅ Supported: PDF, PNG, JPG, JPEG, WEBP

---

## Try It Now!

The app is ready. Just open http://localhost:3000 and:
1. Drop a PDF quote/contract onto the page
2. Or paste a screenshot
3. Or click "Upload file"
4. Click "Analyze" to get instant AI analysis with red flags and negotiation emails

**No more JSON errors!** 🎉
