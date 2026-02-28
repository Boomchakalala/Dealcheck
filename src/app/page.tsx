'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeAsDeal = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">DealCheck</h1>
          <p className="text-lg text-slate-600">Clarity before commitment</p>
          <p className="text-sm text-slate-500 mt-2">
            Paste your supplier email, quote, or proposal below for structured guidance
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <label htmlFor="deal-input" className="block text-sm font-medium text-slate-700 mb-2">
            Supplier Email or Quote
          </label>
          <textarea
            id="deal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your supplier email, quote, or commercial proposal here..."
            rows={12}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 resize-y"
          />
          <button
            onClick={analyzeAsDeal}
            disabled={loading || !input.trim()}
            className="mt-4 w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze Deal'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Analysis Result */}
        {analysis && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div
              className="prose prose-slate max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-p:text-slate-700 prose-ul:text-slate-700 prose-strong:text-slate-900"
              dangerouslySetInnerHTML={{ __html: formatAnalysis(analysis) }}
            />
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>DealCheck provides structured guidance, not legal or pricing advice.</p>
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
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Wrap in paragraphs
  if (!html.startsWith('<h1>') && !html.startsWith('<h2>')) {
    html = '<p>' + html + '</p>';
  }

  return html;
}
