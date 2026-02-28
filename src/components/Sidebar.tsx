import { Thread } from '@/lib/threads';
import { Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  threads: Thread[];
  currentThreadId: string | null;
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ threads, currentThreadId, onSelectThread, onNewThread, onClose, className }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreads = threads.filter(t => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(query) ||
      t.supplier?.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={cn('flex flex-col h-full bg-slate-900 border-r border-slate-700', className)}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Deals</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>

        <button
          onClick={onNewThread}
          className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Deal
        </button>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {filteredThreads.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-sm">
            {searchQuery ? 'No deals found' : 'No deals yet. Create one!'}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredThreads.map(thread => (
              <button
                key={thread.id}
                onClick={() => {
                  onSelectThread(thread.id);
                  onClose?.();
                }}
                className={cn(
                  'w-full text-left p-3 rounded-lg transition-all',
                  currentThreadId === thread.id
                    ? 'bg-emerald-600/20 border-l-2 border-emerald-500'
                    : 'hover:bg-slate-800 border-l-2 border-transparent'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className={cn(
                    'font-semibold text-sm truncate',
                    currentThreadId === thread.id ? 'text-emerald-400' : 'text-slate-200'
                  )}>
                    {thread.title}
                  </h3>
                  <span className="text-xs text-slate-500 flex-shrink-0">
                    {formatDate(thread.updatedAt)}
                  </span>
                </div>
                {thread.supplier && (
                  <p className="text-xs text-slate-400 truncate">{thread.supplier}</p>
                )}
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                  <span>{thread.docs.length} docs</span>
                  <span>•</span>
                  <span>{thread.messages.length} msgs</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="p-3 border-t border-slate-700">
        <div className="px-2 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-xs text-amber-400">
            Free plan: 1 deal thread + limited replies
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Full access coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
