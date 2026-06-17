import type { ReactNode } from 'react';
import { ChevronDown, Search } from 'lucide-react';

type PrototypeDocumentSectionProps = {
  title?: string;
  inboxCount: number;
  spamCount: number;
  activeTab: 'inbox' | 'spam';
  onTabChange: (tab: 'inbox' | 'spam') => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  isEmpty: boolean;
  children: ReactNode;
  className?: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

export function PrototypeDocumentSection({
  title = 'Documents',
  inboxCount,
  spamCount,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchQueryChange,
  isEmpty,
  children,
  className = '',
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: PrototypeDocumentSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-2">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-black"></div>
          <h3 className="font-black uppercase text-sm tracking-widest italic">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabChange('inbox')}
            className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider border-2 transition-all ${
              activeTab === 'inbox'
                ? 'border-black bg-black text-white'
                : 'border-black/30 bg-white text-black hover:border-black hover:bg-zinc-50'
            }`}
          >
            Inbox ({inboxCount})
          </button>
          <button
            onClick={() => onTabChange('spam')}
            className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider border-2 transition-all ${
              activeTab === 'spam'
                ? 'border-black bg-black text-white'
                : 'border-black/30 bg-white text-black hover:border-black hover:bg-zinc-50'
            }`}
          >
            Spam ({spamCount})
          </button>
        </div>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="SEARCH DOCUMENTS..."
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          className="wireframe-input pl-10 py-2 text-[10px] w-full"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchQueryChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="wireframe-card p-6 text-center text-muted-foreground uppercase text-[10px] font-bold bg-gray-50 border-dashed border-2 border-black">
          No documents found
        </div>
      ) : (
        <div className="space-y-3">{children}</div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-2 border-black bg-white p-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="wireframe-button px-4 py-2 text-[10px] uppercase font-black tracking-widest border-2 disabled:border-gray-300 disabled:text-gray-300 disabled:pointer-events-none border-black text-black hover:bg-black hover:text-white transition-colors bg-white"
          >
            Previous Page
          </button>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-black">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5 text-black border-l border-black/20 pl-4">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Jump to:</span>
              <div className="relative">
                <select
                  value={currentPage}
                  onChange={(event) => onPageChange(Number(event.target.value))}
                  className="border-2 border-black bg-white pl-2 pr-6 py-0.5 font-black text-[9px] uppercase cursor-pointer hover:bg-black hover:text-white transition-all outline-none appearance-none"
                >
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <option key={page} value={page} className="bg-white text-black">Page {page}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-black">
                  <ChevronDown size={10} />
                </div>
              </div>
            </div>
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="wireframe-button px-4 py-2 text-[10px] uppercase font-black tracking-widest border-2 disabled:border-gray-300 disabled:text-gray-300 disabled:pointer-events-none border-black text-black hover:bg-black hover:text-white transition-colors bg-white"
          >
            Next Page
          </button>
        </div>
      )}
    </div>
  );
}
