'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, FileText, Image as ImageIcon, File, X, Copy, Check, ShieldAlert, Target, MessageSquare, Mail, ArrowRight, Loader2, Paperclip, Send, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Callout } from '@/components/ui/callout';
import { Sidebar } from '@/components/Sidebar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs-new';
import { redactText } from '@/lib/redact';
import { getMissingItems } from '@/lib/missingInfo';
import {
  Thread,
  ThreadDoc,
  Message,
  loadThreads,
  getCurrentThreadId,
  createThread,
  addThread,
  updateThread,
  addDocument,
  removeDocument,
  addMessage,
  buildAnalysisContext,
} from '@/lib/threads';

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('docs');

  // Doc form state
  const [docType, setDocType] = useState<'quote' | 'msa' | 'sla' | 'other'>('quote');
  const [docName, setDocName] = useState('');
  const [docText, setDocText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);

  // Conversation state
  const [msgRole, setMsgRole] = useState<'vendor' | 'user'>('vendor');
  const [msgContent, setMsgContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  // Redaction
  const [redactionMode, setRedactionMode] = useState(true);
  const [showRedactedPreview, setShowRedactedPreview] = useState(false);

  // General
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentThread = threads.find(t => t.id === currentThreadId);

  // Load threads on mount
  useEffect(() => {
    const loaded = loadThreads();
    setThreads(loaded);

    const currentId = getCurrentThreadId();
    if (currentId && loaded.some(t => t.id === currentId)) {
      setCurrentThreadId(currentId);
    } else if (loaded.length > 0) {
      setCurrentThreadId(loaded[0].id);
    }
  }, []);

  const handleNewThread = () => {
    const newThread = createThread('New Deal');
    const updated = addThread(newThread);
    setThreads(updated);
    setCurrentThreadId(newThread.id);
    setSidebarOpen(false);
  };

  const handleSelectThread = (id: string) => {
    setCurrentThreadId(id);
    localStorage.setItem('dealcheck_current_thread', id);
  };

  const handleUpdateThreadTitle = (title: string) => {
    if (!currentThreadId) return;
    const updated = updateThread(currentThreadId, { title });
    setThreads(updated);
  };

  const handleUpdateSupplier = (supplier: string) => {
    if (!currentThreadId) return;
    const updated = updateThread(currentThreadId, { supplier });
    setThreads(updated);
  };

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
      setDocText(data.text);
      setDocName(file.name);
      setExtracting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setExtracting(false);
      setUploadedFile(null);
    }
  };

  const handleAddDocument = () => {
    if (!currentThreadId || !docText.trim()) return;

    const updated = addDocument(currentThreadId, {
      type: docType,
      name: docName || undefined,
      text: docText,
    });

    setThreads(updated);
    setDocText('');
    setDocName('');
    setUploadedFile(null);
    setError(null);
  };

  const handleRemoveDocument = (docId: string) => {
    if (!currentThreadId) return;
    const updated = removeDocument(currentThreadId, docId);
    setThreads(updated);
  };

  const handleAddMessage = () => {
    if (!currentThreadId || !msgContent.trim()) return;

    const updated = addMessage(currentThreadId, {
      role: msgRole,
      content: msgContent,
    });

    setThreads(updated);
    setMsgContent('');
  };

  const handleAnalyzeAndReply = async () => {
    if (!currentThreadId || !currentThread) return;

    setAnalyzing(true);
    setError(null);

    try {
      // Build context from thread
      const context = buildAnalysisContext(currentThread, msgContent);

      // Apply redaction if enabled
      const textToAnalyze = redactionMode ? redactText(context) : context;

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: textToAnalyze }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      // Save vendor message if present
      if (msgContent.trim()) {
        const withVendorMsg = addMessage(currentThreadId, {
          role: 'vendor',
          content: msgContent,
        });
        setThreads(withVendorMsg);
      }

      // Save AI response as message
      const withAiMsg = addMessage(currentThreadId, {
        role: 'ai',
        content: data.analysis,
      });

      // Update lastAnalysis
      const updated = updateThread(currentThreadId, {
        lastAnalysis: data.analysis,
      });

      setThreads(updated);
      setMsgContent('');
      setActiveTab('conversation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setAnalyzing(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return <FileText className="w-4 h-4 text-red-500" />;
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return <ImageIcon className="w-4 h-4 text-blue-500" />;
    return <File className="w-4 h-4 text-slate-500" />;
  };

  const getDocTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      quote: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      msa: 'bg-blue-100 text-blue-800 border-blue-200',
      sla: 'bg-purple-100 text-purple-800 border-purple-200',
      other: 'bg-slate-100 text-slate-800 border-slate-200',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border uppercase ${variants[type] || variants.other}`}>
        {type}
      </span>
    );
  };

  if (threads.length === 0 && !currentThreadId) {
    // Empty state
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <rect width="32" height="32" rx="8" fill="#10B981"/>
              <path d="M9 16L14 21L23 11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to DealCheck</h1>
          <p className="text-slate-400 mb-6">
            Your AI-powered procurement workspace. Track deals, analyze terms, and negotiate with confidence.
          </p>
          <Button onClick={handleNewThread} className="gap-2">
            <Plus className="w-4 h-4" />
            Start Your First Deal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-80">
        <Sidebar
          threads={threads}
          currentThreadId={currentThreadId}
          onSelectThread={handleSelectThread}
          onNewThread={handleNewThread}
        />
      </div>

      {/* Sidebar - Mobile Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <div className="w-80 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar
              threads={threads}
              currentThreadId={currentThreadId}
              onSelectThread={handleSelectThread}
              onNewThread={handleNewThread}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Thread Header */}
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-400" />
              </button>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={currentThread?.title || ''}
                  onChange={(e) => handleUpdateThreadTitle(e.target.value)}
                  className="w-full bg-transparent text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1"
                  placeholder="Deal title..."
                />
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="text"
                    value={currentThread?.supplier || ''}
                    onChange={(e) => handleUpdateSupplier(e.target.value)}
                    className="bg-slate-900/60 text-sm text-slate-300 px-2 py-1 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Supplier name..."
                  />
                  <span className="text-xs text-slate-500">
                    Updated {currentThread ? new Date(currentThread.updatedAt).toLocaleString() : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="docs">
                  Docs ({currentThread?.docs.length || 0})
                </TabsTrigger>
                <TabsTrigger value="conversation">
                  Conversation ({currentThread?.messages.length || 0})
                </TabsTrigger>
                <TabsTrigger value="analysis">
                  Analysis
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
            <Tabs value={activeTab}>
              {/* DOCS TAB */}
              <TabsContent value="docs" className="space-y-6">
                {/* Add Document Form */}
                <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Add Document</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Document Type
                        </label>
                        <select
                          value={docType}
                          onChange={(e) => setDocType(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-950/60 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="quote">Quote / Proposal</option>
                          <option value="msa">MSA / Contract</option>
                          <option value="sla">SLA / Service Terms</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Name (optional)
                        </label>
                        <input
                          type="text"
                          value={docName}
                          onChange={(e) => setDocName(e.target.value)}
                          placeholder="e.g., Q1 2025 Quote"
                          className="w-full px-3 py-2 bg-slate-950/60 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {uploadedFile && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFileIcon(uploadedFile.name)}
                          <div>
                            <p className="text-sm font-medium text-white">{uploadedFile.name}</p>
                            <p className="text-xs text-slate-400">
                              {(uploadedFile.size / 1024).toFixed(1)} KB
                              {extracting && <span className="ml-2">• Extracting...</span>}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setUploadedFile(null);
                            setDocText('');
                          }}
                          disabled={extracting}
                          className="p-1 hover:bg-slate-800 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Document Text
                      </label>
                      <textarea
                        value={docText}
                        onChange={(e) => setDocText(e.target.value)}
                        rows={8}
                        placeholder="Paste document text here or upload a file..."
                        disabled={extracting}
                        className="w-full px-3 py-2 bg-slate-950/60 border border-slate-700 rounded-lg text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={extracting}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Paperclip className="w-4 h-4" />
                        Upload File
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg,.docx,.doc"
                        onChange={handleFileUpload}
                        disabled={extracting}
                      />

                      <Button
                        onClick={handleAddDocument}
                        disabled={!docText.trim() || extracting}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add to Deal
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Documents List */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">
                    Documents ({currentThread?.docs.length || 0})
                  </h3>

                  {currentThread?.summary && (
                    <div className="mb-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-emerald-400">Summary: </span>
                        {currentThread.summary}
                      </p>
                    </div>
                  )}

                  {!currentThread?.docs.length ? (
                    <div className="text-center py-12 text-slate-500">
                      No documents added yet. Add your first document above.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentThread.docs.map(doc => (
                        <div key={doc.id} className="bg-slate-900/60 rounded-xl border border-slate-800 p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              {getDocTypeBadge(doc.type)}
                              {doc.name && (
                                <span className="text-sm font-medium text-white">{doc.name}</span>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveDocument(doc.id)}
                              className="p-1 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-slate-400 line-clamp-3">
                            {doc.text.substring(0, 200)}...
                          </p>
                          <p className="text-xs text-slate-600 mt-2">
                            Added {new Date(doc.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* CONVERSATION TAB */}
              <TabsContent value="conversation" className="space-y-6">
                {/* Messages Timeline */}
                <div className="space-y-4">
                  {!currentThread?.messages.length ? (
                    <div className="text-center py-12 text-slate-500">
                      No messages yet. Add a vendor message or your note below.
                    </div>
                  ) : (
                    currentThread.messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-2xl rounded-xl p-4 ${
                            msg.role === 'vendor'
                              ? 'bg-slate-900/60 border border-slate-800'
                              : msg.role === 'user'
                              ? 'bg-emerald-600/10 border border-emerald-500/30'
                              : 'bg-blue-600/10 border border-blue-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-bold uppercase ${
                              msg.role === 'vendor' ? 'text-slate-400' :
                              msg.role === 'user' ? 'text-emerald-400' : 'text-blue-400'
                            }`}>
                              {msg.role === 'vendor' ? '📨 Vendor' : msg.role === 'user' ? '✍️ Me' : '🤖 AI Analysis'}
                            </span>
                            <span className="text-xs text-slate-600">
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-slate-300 whitespace-pre-wrap">
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Message Form */}
                <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="msgRole"
                          value="vendor"
                          checked={msgRole === 'vendor'}
                          onChange={() => setMsgRole('vendor')}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-300">Vendor message</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="msgRole"
                          value="user"
                          checked={msgRole === 'user'}
                          onChange={() => setMsgRole('user')}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-300">My note</span>
                      </label>
                    </div>

                    <textarea
                      value={msgContent}
                      onChange={(e) => setMsgContent(e.target.value)}
                      rows={4}
                      placeholder={msgRole === 'vendor' ? "Paste vendor's email or response..." : "Add your internal note..."}
                      className="w-full px-3 py-2 bg-slate-950/60 border border-slate-700 rounded-lg text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRedactionMode(!redactionMode)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            redactionMode ? 'bg-emerald-600' : 'bg-slate-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              redactionMode ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className="text-xs text-slate-400">Redaction mode</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddMessage}
                          disabled={!msgContent.trim()}
                          variant="secondary"
                        >
                          Add message
                        </Button>
                        <Button
                          onClick={handleAnalyzeAndReply}
                          disabled={analyzing}
                          className="gap-2"
                        >
                          {analyzing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Analyze & draft reply
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <Callout variant="warning">
                    <strong>Error:</strong> {error}
                  </Callout>
                )}
              </TabsContent>

              {/* ANALYSIS TAB */}
              <TabsContent value="analysis">
                {currentThread?.lastAnalysis ? (
                  <AnalysisDisplay analysis={currentThread.lastAnalysis} />
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <MessageSquare className="w-16 h-16 text-slate-700 mx-auto" />
                    </div>
                    <p className="text-slate-400 mb-2">No analysis yet</p>
                    <p className="text-sm text-slate-600">
                      Add documents and use "Analyze & draft reply" in the Conversation tab
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

function AnalysisDisplay({ analysis }: { analysis: string }) {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  // Parse sections from analysis
  const sections = analysis.split(/##\s+/);
  const parsed: Record<string, string> = {};

  sections.forEach(section => {
    if (section.includes('Reality Check') || section.includes('1️⃣')) {
      parsed.realityCheck = section;
    } else if (section.includes('What Matters') || section.includes('2️⃣')) {
      parsed.risks = section;
    } else if (section.includes('What to Ask') || section.includes('3️⃣')) {
      parsed.questions = section;
    } else if (section.includes('Suggested Reply') || section.includes('4️⃣')) {
      parsed.reply = section;
    } else if (section.includes('Push Back') || section.includes('5️⃣')) {
      parsed.pushback = section;
    }
  });

  return (
    <div className="space-y-6">
      {/* Reality Check */}
      {parsed.realityCheck && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
              <ShieldAlert className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Deal Reality Check</h3>
              <div className="text-sm text-slate-300 whitespace-pre-wrap">{parsed.realityCheck}</div>
            </div>
          </div>
        </div>
      )}

      {/* Risks / What Matters */}
      {parsed.risks && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Key Points</h3>
              <div className="text-sm text-slate-300 whitespace-pre-wrap">{parsed.risks}</div>
            </div>
          </div>
        </div>
      )}

      {/* Questions */}
      {parsed.questions && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Questions to Ask</h3>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyToClipboard(parsed.questions, 'questions')}
            >
              {copied === 'questions' ? (
                <><Check className="w-4 h-4 mr-1.5 text-emerald-600" /> Copied</>
              ) : (
                <><Copy className="w-4 h-4 mr-1.5" /> Copy</>
              )}
            </Button>
          </div>
          <div className="text-sm text-slate-300 whitespace-pre-wrap">{parsed.questions}</div>
        </div>
      )}

      {/* Suggested Reply */}
      {parsed.reply && (
        <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl border border-emerald-500/20 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Suggested Reply</h3>
                <p className="text-sm text-slate-400">Copy and customize for your situation</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => copyToClipboard(parsed.reply, 'reply')}
            >
              {copied === 'reply' ? (
                <><Check className="w-4 h-4 mr-1.5" /> Copied!</>
              ) : (
                <><Copy className="w-4 h-4 mr-1.5" /> Copy Email</>
              )}
            </Button>
          </div>
          <div className="p-4 bg-slate-950/50 rounded-xl border border-emerald-500/10">
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">{parsed.reply}</pre>
          </div>
        </div>
      )}

      {/* Push Back Strategy */}
      {parsed.pushback && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <ArrowRight className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">If They Push Back</h3>
              <div className="text-sm text-slate-300 whitespace-pre-wrap">{parsed.pushback}</div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback: show raw if parsing failed */}
      {!parsed.realityCheck && !parsed.risks && !parsed.questions && !parsed.reply && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Analysis Result</h3>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">{analysis}</pre>
        </div>
      )}
    </div>
  );
}
