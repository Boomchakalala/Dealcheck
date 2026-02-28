import { NextResponse } from 'next/server';
import PDFParser from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

export const runtime = 'nodejs';
export const maxDuration = 60; // Allow up to 60 seconds for OCR

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.name.toLowerCase();
    let extractedText = '';

    // Handle PDF files
    if (fileType.endsWith('.pdf')) {
      try {
        const data = await PDFParser(buffer);
        extractedText = data.text;
      } catch (error) {
        console.error('PDF parsing error:', error);
        throw new Error('Failed to parse PDF file');
      }
    }
    // Handle DOCX files
    else if (fileType.endsWith('.docx') || fileType.endsWith('.doc')) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      } catch (error) {
        console.error('DOCX parsing error:', error);
        throw new Error('Failed to parse DOCX file');
      }
    }
    // Handle image files (screenshots) with OCR
    else if (fileType.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/)) {
      try {
        const result = await Tesseract.recognize(buffer, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${(m.progress * 100).toFixed(0)}%`);
            }
          },
        });
        extractedText = result.data.text;
      } catch (error) {
        console.error('OCR error:', error);
        throw new Error('Failed to extract text from image');
      }
    }
    // Unsupported file type
    else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, DOCX, or image files.' },
        { status: 400 }
      );
    }

    // Clean up extracted text
    extractedText = extractedText.trim();

    if (!extractedText) {
      return NextResponse.json(
        { error: 'No text could be extracted from the file. The file may be empty or contain only images.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error('File extraction error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract text from file' },
      { status: 500 }
    );
  }
}
