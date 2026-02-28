'use client';

import { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, File, X, CheckCircle2, AlertCircle, ShieldAlert, Target, MessageSquare, Mail, ArrowRight, Copy, Check, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02ek0yMCAzNGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  DealCheck
                </h1>
                <p className="text-sm text-purple-200">Clarity before commitment</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-white font-medium">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Analyze Supplier Proposals with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Confidence & Clarity
            </span>
          </h2>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Get sharp, actionable guidance on any commercial proposal in seconds
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Add Your Proposal</h3>
            <p className="text-sm text-purple-200">Upload a document or paste the text below</p>
          </div>

          {/* Combined Input Area */}
          <div className="space-y-4">
            {/* File Upload - Compact Version */}
            {!uploadedFile ? (
              <div className="relative">
                <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer bg-white/5 hover:bg-white/10 hover:border-purple-400 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-purple-300" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">
                        Upload a file
                      </p>
                      <p className="text-xs text-purple-300">PDF, PNG, JPG, DOCX</p>
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
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  {getFileIcon(uploadedFile.name)}
                  <div>
                    <p className="text-sm font-medium text-white">{uploadedFile.name}</p>
                    <p className="text-xs text-purple-200">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                      {extracting && <span className="ml-2">• Extracting text...</span>}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  disabled={extracting}
                >
                  <X className="w-5 h-5 text-purple-200" />
                </button>
              </div>
            )}

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-3 text-purple-300 font-medium">or paste text</span>
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
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-purple-300/50 resize-y transition-all backdrop-blur-sm"
                disabled={extracting}
              />
              {input && (
                <div className="absolute top-3 right-3">
                  <div className="px-3 py-1 bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-medium rounded-lg backdrop-blur-sm">
                    {input.length} chars
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={analyzeAsDeal}
            disabled={loading || !input.trim() || extracting}
            className="mt-6 w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-2xl hover:shadow-purple-500/50 transform hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing Deal...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Analyze Deal
              </span>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-xl rounded-2xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Demo Mode Warning */}
        {isDemoMode && demoWarning && (
          <div className="bg-amber-500/10 border border-amber-500/30 backdrop-blur-xl rounded-2xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-amber-200 text-sm font-semibold mb-1">Demo Mode Active</p>
              <p className="text-amber-300 text-sm">{demoWarning}</p>
            </div>
          </div>
        )}

        {/* Analysis Result */}
        {analysis && <AnalysisDisplay analysis={analysis} />}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <p className="text-xs text-purple-200">
              DealCheck provides structured guidance, not legal or pricing advice
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
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

  const getVerdictColor = (verdict: string) => {
    if (verdict.toLowerCase().includes('balanced')) return 'from-green-500 to-emerald-500';
    if (verdict.toLowerCase().includes('vendor')) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Reality Check */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl hover:shadow-purple-500/20 transition-all">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 bg-gradient-to-br ${getVerdictColor(parsed.realityCheck.verdict)} rounded-2xl shadow-lg`}>
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-3">Deal Reality Check</h3>
            <div className={`inline-block px-4 py-2 bg-gradient-to-r ${getVerdictColor(parsed.realityCheck.verdict)} rounded-xl shadow-lg`}>
              <span className="text-sm font-bold text-white uppercase tracking-wide">{parsed.realityCheck.verdict}</span>
            </div>
          </div>
        </div>
        <ul className="space-y-3 ml-16">
          {parsed.realityCheck.points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 text-purple-100">
              <span className="text-purple-400 mt-1 text-lg">•</span>
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 2: What Matters Most */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl hover:shadow-blue-500/20 transition-all">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white">What Matters Most</h3>
          </div>
        </div>
        <ul className="space-y-4 ml-16">
          {parsed.whatMatters.map((point, idx) => (
            <li key={idx} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg">
                {idx + 1}
              </span>
              <span className="text-purple-100 leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 3: What to Ask For */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl hover:shadow-green-500/20 transition-all">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white">What to Ask For</h3>
          </div>
        </div>
        <ul className="space-y-3 ml-16">
          {parsed.whatToAsk.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 text-purple-100">
              <ArrowRight className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 4: Suggested Reply */}
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl border border-purple-400/30 p-6 sm:p-8 shadow-2xl hover:shadow-purple-500/30 transition-all">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-2xl font-bold text-white">Suggested Reply</h3>
              <button
                onClick={() => copyToClipboard(parsed.suggestedReply)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-semibold text-white transition-all shadow-lg"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-300" />
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
        <div className="ml-16 bg-white/10 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/20">
          <pre className="whitespace-pre-wrap font-sans text-sm text-purple-100 leading-relaxed">
            {parsed.suggestedReply}
          </pre>
        </div>
      </div>

      {/* Section 5: If They Push Back */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl hover:shadow-pink-500/20 transition-all">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg">
            <ArrowRight className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white">If They Push Back</h3>
          </div>
        </div>
        <div className="ml-16">
          <p className="text-purple-100 leading-relaxed">{parsed.pushBack}</p>
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
