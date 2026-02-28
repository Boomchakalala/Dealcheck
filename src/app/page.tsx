'use client';

import { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, File, X, CheckCircle2, AlertCircle, ShieldAlert, Target, MessageSquare, Mail, ArrowRight, Copy, Check } from 'lucide-react';

interface AnalysisData {
  realityCheck: { verdict: string; points: string[] };
  whatMatters: string[];
  whatToAsk: string[];
  suggestedReply: string;
  pushBack: string;
}

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
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Add Your Proposal</h3>
            <p className="text-sm text-gray-600">Upload a document or paste the text below</p>
          </div>

          {/* Combined Input Area */}
          <div className="space-y-4">
            {/* File Upload - Compact Version */}
            {!uploadedFile ? (
              <div className="relative">
                <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-700">
                        Upload a file
                      </p>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG, DOCX</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.docx,.doc"
                    onChange={handleFileUpload}
                    disabled={extracting}
                  />
                </label>
              </div>
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

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500 font-medium">or paste text</span>
              </div>
            </div>

            {/* Text Input */}
            <div className="relative">
              <textarea
                id="deal-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your supplier email, quote, or commercial proposal here..."
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-y transition-all"
                disabled={extracting}
              />
              {input && (
                <div className="absolute top-3 right-3">
                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    {input.length} characters
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={analyzeAsDeal}
            disabled={loading || !input.trim() || extracting}
            className="mt-6 w-full px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
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
        {analysis && <AnalysisDisplay analysis={analysis} />}

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

function AnalysisDisplay({ analysis }: { analysis: string }) {
  const [copied, setCopied] = useState(false);
  const parsed = parseAnalysis(analysis);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Reality Check */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Deal Reality Check</h3>
            <div className="inline-block px-3 py-1 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-sm font-semibold text-red-700">{parsed.realityCheck.verdict}</span>
            </div>
          </div>
        </div>
        <ul className="space-y-2 ml-16">
          {parsed.realityCheck.points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <span className="text-red-500 mt-1">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 2: What Matters Most */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">What Matters Most</h3>
          </div>
        </div>
        <ul className="space-y-3 ml-16">
          {parsed.whatMatters.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {idx + 1}
              </span>
              <span className="text-gray-700">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 3: What to Ask For */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <MessageSquare className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">What to Ask For</h3>
          </div>
        </div>
        <ul className="space-y-2 ml-16">
          {parsed.whatToAsk.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <ArrowRight className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 4: Suggested Reply */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-200 p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Mail className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Suggested Reply</h3>
              <button
                onClick={() => copyToClipboard(parsed.suggestedReply)}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="ml-16 bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
            {parsed.suggestedReply}
          </pre>
        </div>
      </div>

      {/* Section 5: If They Push Back */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <ArrowRight className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">If They Push Back</h3>
          </div>
        </div>
        <div className="ml-16">
          <p className="text-gray-700 leading-relaxed">{parsed.pushBack}</p>
        </div>
      </div>
    </div>
  );
}

function parseAnalysis(text: string): AnalysisData {
  const sections = text.split(/##\s+/);

  const result: AnalysisData = {
    realityCheck: { verdict: '', points: [] },
    whatMatters: [],
    whatToAsk: [],
    suggestedReply: '',
    pushBack: '',
  };

  sections.forEach((section) => {
    if (section.includes('Deal Reality Check')) {
      const lines = section.split('\n').filter(l => l.trim());
      const verdict = lines.find(l => l.includes('Verdict:'))?.replace(/.*Verdict:\s*\*?\*?/, '').replace(/\*?\*?/, '').trim() || 'Unknown';
      result.realityCheck.verdict = verdict;
      result.realityCheck.points = lines
        .filter(l => l.trim().startsWith('-'))
        .map(l => l.replace(/^-\s*/, '').trim());
    } else if (section.includes('What Matters Most')) {
      result.whatMatters = section
        .split('\n')
        .filter(l => l.trim().startsWith('-'))
        .map(l => l.replace(/^-\s*/, '').replace(/\*\*/g, '').trim());
    } else if (section.includes('What to Ask For')) {
      result.whatToAsk = section
        .split('\n')
        .filter(l => l.trim().startsWith('-'))
        .map(l => l.replace(/^-\s*/, '').trim());
    } else if (section.includes('Suggested Reply')) {
      const parts = section.split('---');
      if (parts.length >= 2) {
        result.suggestedReply = parts[1].trim();
      } else {
        result.suggestedReply = section.replace(/.*Suggested Reply\n+/, '').trim();
      }
    } else if (section.includes('If They Push Back')) {
      result.pushBack = section
        .replace(/.*If They Push Back\n+/, '')
        .replace(/---.*$/, '')
        .replace(/\*\*Note\*\*:.*$/, '')
        .trim();
    }
  });

  return result;
}
