'use client';

import { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, File, X, Copy, Check, ShieldAlert, Target, MessageSquare, Mail, ArrowRight, Loader2 } from 'lucide-react';
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
    if (fileName.endsWith('.pdf')) return <FileText className="w-5 h-5 text-red-400" />;
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return <ImageIcon className="w-5 h-5 text-blue-400" />;
    return <File className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-950 relative">
      {/* Subtle corner glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded bg-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-100">DealCheck</h1>
              </div>
              <p className="text-sm text-slate-400 mt-1">Clarity before commitment</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-slate-300">AI-Powered</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        {/* Hero */}
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-100 mb-4">
            Analyze Supplier Proposals
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
            Get sharp, actionable procurement guidance on any commercial proposal in seconds.
          </p>
        </div>

        {/* Input Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Your Proposal</CardTitle>
            <p className="text-sm text-slate-400 mt-1">Upload a document or paste text below</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Two-column layout on desktop */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upload Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Upload Document</label>
                {!uploadedFile ? (
                  <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer bg-slate-900/30 hover:bg-slate-900/50 hover:border-emerald-500/30 transition-all">
                    <Upload className="w-8 h-8 text-slate-500 mb-2" />
                    <p className="text-sm font-medium text-slate-300">Click to upload</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, PNG, JPG, DOCX</p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.docx,.doc"
                      onChange={handleFileUpload}
                      disabled={extracting}
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-center gap-3">
                      {getFileIcon(uploadedFile.name)}
                      <div>
                        <p className="text-sm font-medium text-slate-200">{uploadedFile.name}</p>
                        <p className="text-xs text-slate-400">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                          {extracting && <span className="ml-2">• Extracting...</span>}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearFile}
                      className="p-1 hover:bg-slate-800 rounded transition-colors"
                      disabled={extracting}
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Paste Section */}
              <div className="space-y-2">
                <label htmlFor="deal-input" className="text-sm font-medium text-slate-300">
                  Or Paste Text
                </label>
                <div className="relative">
                  <textarea
                    id="deal-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste your supplier email, quote, or proposal..."
                    rows={7}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    disabled={extracting}
                  />
                  {input && (
                    <div className="absolute bottom-2 right-2">
                      <span className="text-xs text-slate-500">{input.length} chars</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={loadSample}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Load example quote
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={analyzeAsDeal}
              disabled={loading || !input.trim() || extracting}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Deal...
                </>
              ) : (
                'Analyze Deal'
              )}
            </Button>

            {/* Demo Mode Callout */}
            {isDemoMode && demoWarning && (
              <Callout variant="warning">
                <strong className="font-semibold">Demo mode active</strong> — {demoWarning}
              </Callout>
            )}
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Callout variant="warning" className="mb-8">
            <strong>Analysis failed:</strong> {error}
          </Callout>
        )}

        {/* Results */}
        {analysis && <AnalysisDisplay analysis={analysis} />}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500">
            DealCheck provides structured guidance, not legal or pricing advice.
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
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reality">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="reality">Reality Check</TabsTrigger>
            <TabsTrigger value="matters">What Matters</TabsTrigger>
            <TabsTrigger value="ask">What to Ask</TabsTrigger>
            <TabsTrigger value="reply">Suggested Reply</TabsTrigger>
            <TabsTrigger value="pushback">Push Back</TabsTrigger>
          </TabsList>

          {/* Reality Check */}
          <TabsContent value="reality" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <ShieldAlert className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-100 mb-2">Deal Reality Check</h3>
                <Badge variant={getBadgeVariant(parsed.realityCheck.verdict)}>
                  {parsed.realityCheck.verdict}
                </Badge>
              </div>
            </div>
            <ul className="space-y-2 pl-16">
              {parsed.realityCheck.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300 leading-relaxed">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          {/* What Matters Most */}
          <TabsContent value="matters" className="space-y-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">What Matters Most</h3>
            </div>
            <ul className="space-y-3 pl-16">
              {parsed.whatMatters.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold border border-emerald-500/20">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          {/* What to Ask For */}
          <TabsContent value="ask" className="space-y-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-100">What to Ask For</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(parsed.whatToAsk.join('\n'), 'ask')}
                >
                  {copied === 'ask' ? (
                    <><Check className="w-4 h-4 mr-1" /> Copied</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-1" /> Copy</>
                  )}
                </Button>
              </div>
            </div>
            <ul className="space-y-2 pl-16">
              {parsed.whatToAsk.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300 leading-relaxed">
                  <ArrowRight className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          {/* Suggested Reply */}
          <TabsContent value="reply" className="space-y-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-100">Suggested Reply</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copyToClipboard(parsed.suggestedReply, 'reply')}
                >
                  {copied === 'reply' ? (
                    <><Check className="w-4 h-4 mr-1 text-emerald-400" /> Copied</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-1" /> Copy Email</>
                  )}
                </Button>
              </div>
            </div>
            <div className="pl-16 p-4 bg-slate-900/40 rounded-xl border border-slate-800">
              <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-relaxed">
                {parsed.suggestedReply}
              </pre>
            </div>
          </TabsContent>

          {/* If They Push Back */}
          <TabsContent value="pushback" className="space-y-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <ArrowRight className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">If They Push Back</h3>
            </div>
            <div className="pl-16">
              <p className="text-slate-300 leading-relaxed">{parsed.pushBack}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
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
