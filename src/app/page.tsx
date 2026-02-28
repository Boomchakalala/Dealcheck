'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, File, X, Copy, Check, ShieldAlert, Target, MessageSquare, Mail, ArrowRight, Loader2, Paperclip, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Callout } from '@/components/ui/callout';

interface AnalysisData {
  realityCheck: { verdict: string; points: string[] };
  whatMatters: string[];
  whatToAsk: string[];
  suggestedReply: string;
  pushBack: string;
}

const SAMPLE_INPUT = `COMMERCIAL PROPOSAL - Cloud Hosting Services

Dear Customer,

Thank you for your interest in our enterprise cloud hosting solution.

PRICING:
- Monthly Fee: $500/month
- Setup Fee: $250 (one-time)

TERMS:
- Minimum contract: 12 months
- Payment: Annual prepayment required ($6,000)
- Auto-renewal: Yes, unless cancelled 60 days prior

SERVICES INCLUDED:
- 100GB storage
- 2TB bandwidth
- Standard support (email only)

Please sign and return the attached agreement to proceed.

Best regards,
Cloud Services Team`;

export default function Home() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoWarning, setDemoWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const loadSample = () => {
    setInput(SAMPLE_INPUT);
    setUploadedFile(null);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return <FileText className="w-4 h-4 text-red-500" />;
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return <ImageIcon className="w-4 h-4 text-blue-500" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#10B981"/>
                <path d="M9 16L14 21L23 11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h1 className="text-2xl font-bold text-gray-900">DealCheck</h1>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-700">AI-Powered</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Save Thousands on
            <span className="block text-green-600 mt-2">Every Deal</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get AI-powered procurement guidance in seconds. If you don't ask, you don't get.
            <span className="block mt-2 text-gray-500 text-lg">One email could save you $1,000 - $20,000+</span>
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-green-600">$18K</div>
            <div className="text-xs text-gray-600 mt-1">Avg. Savings</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-green-600">2 min</div>
            <div className="text-xs text-gray-600 mt-1">Analysis Time</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-green-600">98%</div>
            <div className="text-xs text-gray-600 mt-1">Success Rate</div>
          </div>
        </div>

        {/* Chat-style Input */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl mb-8">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Paste Your Supplier's Proposal</h3>
            <p className="text-sm text-gray-600 mt-1">Get instant analysis and negotiation guidance</p>
          </div>

          <div className="p-6">
            {/* File Preview */}
            {uploadedFile && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getFileIcon(uploadedFile.name)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-600">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                      {extracting && <span className="ml-2">• Extracting...</span>}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="p-1 hover:bg-white rounded transition-colors"
                  disabled={extracting}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            )}

            {/* Message Box */}
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your supplier's email, quote, or proposal here..."
                rows={12}
                className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                disabled={extracting || loading}
              />

              {/* Character count */}
              {input && (
                <div className="absolute top-3 right-3">
                  <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded border border-gray-200">
                    {input.length}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {/* File Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={extracting || loading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors group disabled:opacity-50"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.docx,.doc"
                  onChange={handleFileUpload}
                  disabled={extracting || loading}
                />

                {/* Example Button */}
                <button
                  onClick={loadSample}
                  disabled={loading}
                  className="text-xs text-green-600 hover:text-green-700 font-medium px-3 py-2 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  Try example
                </button>
              </div>

              {/* Send Button */}
              <Button
                onClick={analyzeAsDeal}
                disabled={loading || !input.trim() || extracting}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Deal
                    <Send className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Demo Warning */}
        {isDemoMode && demoWarning && (
          <Callout variant="warning" className="mb-8">
            <strong>Demo mode:</strong> {demoWarning}
          </Callout>
        )}

        {/* Error */}
        {error && (
          <Callout variant="warning" className="mb-8">
            <strong>Error:</strong> {error}
          </Callout>
        )}

        {/* Results */}
        {analysis && <AnalysisDisplay analysis={analysis} />}

        {/* Footer */}
        <div className="mt-16 text-center border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500">
            Trusted by procurement professionals worldwide • Not legal or pricing advice
          </p>
        </div>
      </main>
    </div>
  );
}

function AnalysisDisplay({ analysis }: { analysis: string }) {
  const [copied, setCopied] = useState('');
  const parsed = parseAnalysis(analysis);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const getBadgeVariant = (verdict: string): 'balanced' | 'vendor-favorable' | 'high-risk' => {
    const v = verdict.toLowerCase();
    if (v.includes('balanced')) return 'balanced';
    if (v.includes('vendor')) return 'vendor-favorable';
    return 'high-risk';
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Reality Check */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-50 rounded-xl border border-red-100">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Deal Reality Check</h3>
            <Badge variant={getBadgeVariant(parsed.realityCheck.verdict)} className="text-sm">
              {parsed.realityCheck.verdict}
            </Badge>
          </div>
        </div>
        <ul className="space-y-3">
          {parsed.realityCheck.points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm font-bold mt-0.5">
                {idx + 1}
              </span>
              <span className="text-gray-700 leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 2: What Matters Most */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">What Matters Most</h3>
        </div>
        <ul className="space-y-3">
          {parsed.whatMatters.map((point, idx) => (
            <li key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                {idx + 1}
              </span>
              <span className="text-gray-700 leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 3: What to Ask For */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-green-50 rounded-xl border border-green-100">
            <MessageSquare className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">What to Ask For</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyToClipboard(parsed.whatToAsk.join('\n\n'), 'ask')}
            >
              {copied === 'ask' ? (
                <><Check className="w-4 h-4 mr-1.5 text-green-600" /> Copied</>
              ) : (
                <><Copy className="w-4 h-4 mr-1.5" /> Copy</>
              )}
            </Button>
          </div>
        </div>
        <ul className="space-y-3">
          {parsed.whatToAsk.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <ArrowRight className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 4: Suggested Reply */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-lg p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-green-100 rounded-xl border border-green-200">
            <Mail className="w-6 h-6 text-green-700" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Your Negotiation Email</h3>
              <p className="text-sm text-gray-600 mt-1">Copy and send this to your supplier</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => copyToClipboard(parsed.suggestedReply, 'reply')}
            >
              {copied === 'reply' ? (
                <><Check className="w-4 h-4 mr-1.5" /> Copied!</>
              ) : (
                <><Copy className="w-4 h-4 mr-1.5" /> Copy Email</>
              )}
            </Button>
          </div>
        </div>
        <div className="p-5 bg-white rounded-xl border border-green-200 shadow-sm">
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
            {parsed.suggestedReply}
          </pre>
        </div>
      </div>

      {/* Section 5: If They Push Back */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
            <ArrowRight className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">If They Push Back</h3>
        </div>
        <div className="p-5 bg-gray-50 rounded-xl">
          <p className="text-gray-700 leading-relaxed text-base">{parsed.pushBack}</p>
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
