import { Download, Eye, FileText, ImageIcon, Paperclip, Plus, Search, X } from 'lucide-react';
import type { SharedDocument } from '@/prototype/channelTypes';

type ChannelDocumentsPaneProps = {
  documents: SharedDocument[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onClearSearch: () => void;
  onSendNewDocument: () => void;
  onViewDocument: (document: SharedDocument) => void;
  onDownloadDocument: (document: SharedDocument) => void;
  formatSender: (sender: string) => string;
};

export function ChannelDocumentsPane({
  documents,
  searchQuery,
  onSearchQueryChange,
  onClearSearch,
  onSendNewDocument,
  onViewDocument,
  onDownloadDocument,
  formatSender,
}: ChannelDocumentsPaneProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 text-black">
      <div className="p-4 border-b-2 border-black bg-white shrink-0">
        <div className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black uppercase tracking-tighter italic text-black">Shared Documents</span>
            <span className="text-[8px] font-bold uppercase px-2 py-0.5 bg-black text-white">
              {documents.length} Files
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-48 sm:w-64">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="SEARCH DOCUMENTS..."
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
                className="wireframe-input pl-9 py-1.5 text-[9px] outline-none text-black font-bold uppercase"
              />
              {searchQuery && (
                <button
                  onClick={onClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-black text-gray-400"
                  aria-label="Clear document search"
                >
                  <X size={10} />
                </button>
              )}
            </div>

            <button
              onClick={onSendNewDocument}
              className="wireframe-button bg-black text-white text-[9px] uppercase px-4 py-1.5 flex items-center gap-1.5 font-black whitespace-nowrap hover:bg-white hover:text-black transition-all"
            >
              Send New Document <Plus size={10} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto w-full space-y-4">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 bg-white border-2 border-black border-dashed p-6 text-center">
              <p className="text-[11px] font-bold uppercase text-muted-foreground italic mb-1">
                {searchQuery ? 'No documents found matching your search' : 'No documents have been shared yet'}
              </p>
              <p className="text-[9px] text-muted-foreground uppercase">
                {searchQuery ? 'Try checking your spelling or clearing the search query.' : 'Attach documents to messages or use the button above to upload.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="wireframe-card p-4 flex flex-col justify-between bg-white border-2 border-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-gray-50 shrink-0">
                      {document.type === 'pdf' ? <FileText size={20} className="text-black" /> :
                        document.type === 'image' ? <ImageIcon size={20} className="text-black" /> :
                          <Paperclip size={20} className="text-black" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[11px] font-black uppercase tracking-tight truncate text-black" title={document.name}>
                        {document.name}
                      </h4>
                      <p className="text-[8px] uppercase font-bold text-muted-foreground mt-0.5">
                        {document.size} • {document.type.toUpperCase()} File
                      </p>
                      <div className="mt-2 text-[8px] font-medium uppercase tracking-tight text-gray-500">
                        Shared by <span className="font-bold text-black">{formatSender(document.sentBy)}</span> • {document.sentAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-black border-dashed">
                    <button
                      onClick={() => onViewDocument(document)}
                      className="flex-1 wireframe-button bg-white text-black border-black text-[9px] uppercase py-1 flex items-center justify-center gap-1 hover:bg-black hover:text-white font-bold"
                    >
                      <Eye size={10} /> View
                    </button>
                    <button
                      onClick={() => onDownloadDocument(document)}
                      className="flex-1 wireframe-button bg-black text-white border-black text-[9px] uppercase py-1 flex items-center justify-center gap-1 hover:bg-white hover:text-black font-bold"
                    >
                      <Download size={10} /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
