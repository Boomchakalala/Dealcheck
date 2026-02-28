'use client';

import { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, File, X, Copy, Check, ShieldAlert, Target, MessageSquare, Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Callout } from '@/components/ui/callout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
    if (fileName.endsWith('.pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="8" fill="#10B981"/>
                  <path d="M9 16L14 21L23 11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-2xl font-bold text-gray-900">DealCheck</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-700">AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
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
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
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

        {/* Input Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl mb-8">
          <div className="p-8 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyze Your Proposal</h3>
            <p className="text-gray-600">Upload a document or paste your supplier's quote below</p>
          </div>
          <div className="p-8 space-y-6">
            {/* Two-column layout */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Upload Document</label>
                {!uploadedFile ? (
                  <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-green-50 hover:border-green-400 transition-all group">
                    <Upload className="w-10 h-10 text-gray-400 group-hover:text-green-500 mb-3 transition-colors" />
                    <p className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition-colors">Click to upload</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG, DOCX (Max 10MB)</p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.docx,.doc"
                      onChange={handleFileUpload}
                      disabled={extracting}
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                    <div className="flex items-center gap-3">
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
                      className="p-1.5 hover:bg-white rounded-lg transition-colors"
                      disabled={extracting}
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>

              {/* Paste */}
              <div className="space-y-3">
                <label htmlFor="deal-input" className="block text-sm font-semibold text-gray-700">
                  Or Paste Text
                </label>
                <div className="relative">
                  <textarea
                    id="deal-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste your supplier's email, quote, or proposal here..."
                    rows={9}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    disabled={extracting}
                  />
                  {input && (
                    <div className="absolute bottom-3 right-3">
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">{input.length} chars</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={loadSample}
                  className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Try example quote →
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button
                onClick={analyzeAsDeal}
                disabled={loading || !input.trim() || extracting}
                className="w-full h-14 text-base"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Your Deal...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Analyze Deal & Get Savings
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-gray-500 mt-3">
                Average time saved per analysis: <span className="font-semibold text-gray-700">2 minutes</span>
              </p>
            </div>

            {isDemoMode && demoWarning && (
              <Callout variant="warning">
                <strong className="font-semibold">Demo mode</strong> — {demoWarning}
              </Callout>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <Callout variant="warning" className="mb-8">
            <strong>Analysis failed:</strong> {error}
          </Callout>
        )}

        {/* Results */}
        {analysis && <AnalysisDisplay analysis={analysis} />}

        {/* Trust Footer */}
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl mb-8">
      <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h3 className="text-2xl font-bold text-gray-900">Your Analysis Results</h3>
        </div>
        <p className="text-gray-600">Review your procurement guidance below and copy the suggested email</p>
      </div>
      <div className="p-8">
        <Tabs defaultValue="reality">
          <TabsList className="w-full mb-8">
            <TabsTrigger value="reality">Reality Check</TabsTrigger>
            <TabsTrigger value="matters">What Matters</TabsTrigger>
            <TabsTrigger value="ask">What to Ask</TabsTrigger>
            <TabsTrigger value="reply">Email Reply</TabsTrigger>
            <TabsTrigger value="pushback">Plan B</TabsTrigger>
          </TabsList>

          {/* Reality Check */}
          <TabsContent value="reality" className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-red-50 rounded-xl border border-red-100">
              <div className="p-3 rounded-xl bg-red-100">
                <ShieldAlert className="w-7 h-7 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Deal Reality Check</h4>
                <Badge variant={getBadgeVariant(parsed.realityCheck.verdict)}>
                  {parsed.realityCheck.verdict}
                </Badge>
              </div>
            </div>
            <ul className="space-y-4">
              {parsed.realityCheck.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          {/* What Matters Most */}
          <TabsContent value="matters" className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-xl border border-blue-100">
              <div className="p-3 rounded-xl bg-blue-100">
                <Target className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">What Matters Most</h4>
            </div>
            <ul className="space-y-4">
              {parsed.whatMatters.map((point, idx) => (
                <li key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          {/* What to Ask For */}
          <TabsContent value="ask" className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border border-green-100">
              <div className="p-3 rounded-xl bg-green-100">
                <MessageSquare className="w-7 h-7 text-green-600" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <h4 className="text-xl font-bold text-gray-900">What to Ask For</h4>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copyToClipboard(parsed.whatToAsk.join('\n'), 'ask')}
                >
                  {copied === 'ask' ? (
                    <><Check className="w-4 h-4 mr-1.5 text-green-600" /> Copied</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-1.5" /> Copy List</>
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
          </TabsContent>

          {/* Suggested Reply */}
          <TabsContent value="reply" className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="p-3 rounded-xl bg-green-100">
                <Mail className="w-7 h-7 text-green-600" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Your Negotiation Email</h4>
                  <p className="text-sm text-gray-600 mt-1">Copy and send this to your supplier</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => copyToClipboard(parsed.suggestedReply, 'reply')}
                  className="ml-4"
                >
                  {copied === 'reply' ? (
                    <><Check className="w-4 h-4 mr-1.5" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-1.5" /> Copy Email</>
                  )}
                </Button>
              </div>
            </div>
            <div className="p-6 bg-white border-2 border-gray-200 rounded-xl">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                {parsed.suggestedReply}
              </pre>
            </div>
          </TabsContent>

          {/* If They Push Back */}
          <TabsContent value="pushback" className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-amber-50 rounded-xl border border-amber-100">
              <div className="p-3 rounded-xl bg-amber-100">
                <ArrowRight className="w-7 h-7 text-amber-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">If They Push Back</h4>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <p className="text-gray-700 leading-relaxed text-base">{parsed.pushBack}</p>
            </div>
          </TabsContent>
        </Tabs>
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
