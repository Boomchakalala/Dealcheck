/**
 * Deal Threads - Local storage data model and utilities
 * No backend/DB yet, pure localStorage
 */

export interface ThreadDoc {
  id: string;
  type: 'quote' | 'msa' | 'sla' | 'other';
  name?: string;
  text: string;
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'vendor' | 'user' | 'ai';
  content: string;
  createdAt: string;
}

export interface Thread {
  id: string;
  title: string;
  supplier?: string;
  createdAt: string;
  updatedAt: string;
  summary?: string;
  lastAnalysis?: string;
  docs: ThreadDoc[];
  messages: Message[];
}

const STORAGE_KEY = 'dealcheck_threads_v1';
const CURRENT_THREAD_KEY = 'dealcheck_current_thread';

// Load all threads from localStorage
export function loadThreads(): Thread[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load threads:', e);
    return [];
  }
}

// Save all threads to localStorage
export function saveThreads(threads: Thread[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch (e) {
    console.error('Failed to save threads:', e);
  }
}

// Get current thread ID
export function getCurrentThreadId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_THREAD_KEY);
}

// Set current thread ID
export function setCurrentThreadId(id: string | null): void {
  if (typeof window === 'undefined') return;

  if (id) {
    localStorage.setItem(CURRENT_THREAD_KEY, id);
  } else {
    localStorage.removeItem(CURRENT_THREAD_KEY);
  }
}

// Create a new thread
export function createThread(title: string = 'New Deal'): Thread {
  const now = new Date().toISOString();
  return {
    id: `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title,
    supplier: undefined,
    createdAt: now,
    updatedAt: now,
    summary: undefined,
    lastAnalysis: undefined,
    docs: [],
    messages: [],
  };
}

// Add a thread
export function addThread(thread: Thread): Thread[] {
  const threads = loadThreads();
  threads.unshift(thread);
  saveThreads(threads);
  setCurrentThreadId(thread.id);
  return threads;
}

// Update a thread
export function updateThread(id: string, updates: Partial<Thread>): Thread[] {
  const threads = loadThreads();
  const index = threads.findIndex(t => t.id === id);

  if (index === -1) return threads;

  threads[index] = {
    ...threads[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveThreads(threads);
  return threads;
}

// Delete a thread
export function deleteThread(id: string): Thread[] {
  const threads = loadThreads();
  const filtered = threads.filter(t => t.id !== id);
  saveThreads(filtered);

  if (getCurrentThreadId() === id) {
    setCurrentThreadId(filtered[0]?.id || null);
  }

  return filtered;
}

// Add document to thread
export function addDocument(threadId: string, doc: Omit<ThreadDoc, 'id' | 'createdAt'>): Thread[] {
  const newDoc: ThreadDoc = {
    ...doc,
    id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };

  const threads = loadThreads();
  const thread = threads.find(t => t.id === threadId);

  if (!thread) return threads;

  thread.docs.push(newDoc);
  thread.updatedAt = new Date().toISOString();

  // Generate simple summary
  thread.summary = generateThreadSummary(thread);

  saveThreads(threads);
  return threads;
}

// Remove document from thread
export function removeDocument(threadId: string, docId: string): Thread[] {
  const threads = loadThreads();
  const thread = threads.find(t => t.id === threadId);

  if (!thread) return threads;

  thread.docs = thread.docs.filter(d => d.id !== docId);
  thread.updatedAt = new Date().toISOString();
  thread.summary = generateThreadSummary(thread);

  saveThreads(threads);
  return threads;
}

// Add message to thread
export function addMessage(threadId: string, message: Omit<Message, 'id' | 'createdAt'>): Thread[] {
  const newMessage: Message = {
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };

  const threads = loadThreads();
  const thread = threads.find(t => t.id === threadId);

  if (!thread) return threads;

  thread.messages.push(newMessage);
  thread.updatedAt = new Date().toISOString();

  saveThreads(threads);
  return threads;
}

// Generate thread summary from docs (simple heuristics)
function generateThreadSummary(thread: Thread): string {
  if (thread.docs.length === 0) return 'No documents added yet.';

  const docTypes = thread.docs.map(d => d.type);
  const uniqueTypes = [...new Set(docTypes)];

  const typeLabels = uniqueTypes.map(t => {
    if (t === 'quote') return 'Quote';
    if (t === 'msa') return 'MSA';
    if (t === 'sla') return 'SLA';
    return 'Other';
  }).join(', ');

  // Extract some keywords from docs
  const allText = thread.docs.map(d => d.text.toLowerCase()).join(' ');
  const keywords: string[] = [];

  if (allText.includes('price') || allText.includes('payment') || allText.includes('$') || allText.includes('€')) {
    keywords.push('pricing');
  }
  if (allText.includes('term') || allText.includes('duration') || allText.includes('month')) {
    keywords.push('term');
  }
  if (allText.includes('liability') || allText.includes('indemnif')) {
    keywords.push('liability');
  }
  if (allText.includes('security') || allText.includes('soc 2') || allText.includes('gdpr')) {
    keywords.push('security');
  }
  if (allText.includes('sla') || allText.includes('uptime') || allText.includes('support')) {
    keywords.push('SLA/support');
  }

  const topicsStr = keywords.length > 0 ? `. Key topics: ${keywords.join(', ')}` : '';

  return `Docs included: ${typeLabels}${topicsStr}`;
}

// Build context for API call (summary + recent messages)
export function buildAnalysisContext(thread: Thread, newVendorMessage?: string): string {
  let context = '';

  // Add summary or docs
  if (thread.summary) {
    context += `DEAL CONTEXT:\n${thread.summary}\n\n`;
  } else if (thread.docs.length > 0) {
    context += `DOCUMENTS:\n`;
    thread.docs.forEach(doc => {
      context += `[${doc.type.toUpperCase()}] ${doc.name || 'Unnamed'}\n${doc.text.substring(0, 500)}...\n\n`;
    });
  }

  // Add recent messages (last 6)
  if (thread.messages.length > 0) {
    const recentMessages = thread.messages.slice(-6);
    context += `CONVERSATION HISTORY:\n`;
    recentMessages.forEach(msg => {
      const label = msg.role === 'vendor' ? 'VENDOR' : msg.role === 'user' ? 'ME' : 'AI';
      context += `[${label}]: ${msg.content}\n\n`;
    });
  }

  // Add new vendor message
  if (newVendorMessage) {
    context += `NEW VENDOR MESSAGE:\n${newVendorMessage}\n\n`;
  }

  context += `Please analyze this situation and provide:\n1. Reality check on current position\n2. Key risks or concerns\n3. Questions to ask\n4. Suggested reply`;

  return context;
}
