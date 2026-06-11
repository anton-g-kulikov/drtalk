import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { getPrototypePageNumbers } from '@/prototype/pagination';

type PrototypeDocumentSectionProps = {
  title?: string;
  inboxCount: number;
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-black"></div>
            <span className="text-[9px] font-black uppercase tracking-wider text-black">Inbox ({inboxCount})</span>
          </div>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t-2 border-black pt-4 bg-white font-bold text-[10px] gap-4">
          <div className="flex items-center gap-3 text-muted-foreground uppercase font-black tracking-wider flex-wrap">
            <span>Page {currentPage} of {totalPages} ({totalItems} items)</span>
            <div className="flex items-center gap-1.5 text-black">
              <span className="font-normal lowercase">go to page:</span>
              <select
                value={currentPage}
                onChange={(event) => onPageChange(Number(event.target.value))}
                className="border-2 border-black bg-white px-1.5 py-0.5 font-black text-[9px] uppercase cursor-pointer hover:bg-black hover:text-white transition-all outline-none"
              >
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <option key={page} value={page} className="bg-white text-black">Page {page}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className="wireframe-button border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black shrink-0"
            >
              PREV
            </button>

            <div className="flex items-center gap-1">
              {getPrototypePageNumbers(currentPage, totalPages).map((page, index) => {
                if (page === '...') {
                  return <span key={`ellipsis-${index}`} className="w-6 h-6 flex items-center justify-center text-[9px] text-muted-foreground">...</span>;
                }
                return (
                  <button
                    key={`page-${page}`}
                    onClick={() => onPageChange(Number(page))}
                    className={`w-6 h-6 flex items-center justify-center border-2 border-black transition-all text-[9px] ${
                      currentPage === page
                        ? 'bg-black text-white font-black'
                        : 'bg-white text-black hover:bg-black hover:text-white font-bold'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              className="wireframe-button border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black shrink-0"
            >
              NEXT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
