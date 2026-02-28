'use client';

import { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, File, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoWarning, setDemoWarning] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setExtracting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract text from file');
      }

      const data = await response.json();
      setInput(data.text);
      setExtracting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setExtracting(false);
      setUploadedFile(null);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setInput('');
  };

  const analyzeAsDeal = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setIsDemoMode(false);
    setDemoWarning(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data.analysis);

      if (data.demo) {
        setIsDemoMode(true);
        if (data.warning) {
          setDemoWarning(data.warning);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                DealCheck
              </h1>
              <p className="text-sm text-gray-600 mt-1">Clarity before commitment</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>AI-Powered Analysis</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Analyze Supplier Proposals with Confidence
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a document or paste your supplier email, quote, or commercial proposal for structured procurement guidance.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-8">
          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Upload Document (Optional)
            </label>

            {!uploadedFile ? (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-400 transition-all duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG, DOCX (Max 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.docx,.doc"
                  onChange={handleFileUpload}
                  disabled={extracting}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <div className="flex items-center gap-3">
                  {getFileIcon(uploadedFile.name)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                      {extracting && <span className="ml-2">• Extracting text...</span>}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  disabled={extracting}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div>
            <label htmlFor="deal-input" className="block text-sm font-semibold text-gray-700 mb-3">
              Or Paste Text Directly
            </label>
            <textarea
              id="deal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your supplier email, quote, or commercial proposal here..."
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-y transition-shadow"
              disabled={extracting}
            />
          </div>

          <button
            onClick={analyzeAsDeal}
            disabled={loading || !input.trim() || extracting}
            className="mt-6 w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze Deal'
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Demo Mode Warning */}
        {isDemoMode && demoWarning && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-amber-900 text-sm font-semibold mb-1">Demo Mode Active</p>
              <p className="text-amber-800 text-sm">{demoWarning}</p>
            </div>
          </div>
        )}

        {/* Analysis Result */}
        {analysis && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">Analysis Complete</h3>
            </div>
            <div
              className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:text-gray-700 prose-li:my-1 prose-strong:text-gray-900 prose-strong:font-semibold"
              dangerouslySetInnerHTML={{ __html: formatAnalysis(analysis) }}
            />
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-xs text-gray-600">
              DealCheck provides structured guidance, not legal or pricing advice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatAnalysis(text: string): string {
  // Convert markdown-style headings and formatting to HTML
  let html = text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/(<li>.*?<\/li>)/gs, (match) => {
      const items = match.match(/<li>.*?<\/li>/g) || [];
      return '<ul>' + items.join('') + '</ul>';
    });

  // Wrap in paragraphs
  if (!html.startsWith('<h1>') && !html.startsWith('<h2>')) {
    html = '<p>' + html + '</p>';
  }

  return html;
}
