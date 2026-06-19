import { AlertTriangle, ArrowUpRight, FileText, UserPlus, Paperclip, Ban } from 'lucide-react';

export type DashboardDocumentRowItem = {
  id: string;
  name: string;
  sender: string;
  date: string;
  size: string;
  isExternal?: boolean;
  transport?: 'Email' | 'Fax' | 'App';
  channelType?: 'practice' | 'case';
  isUnrecognized?: boolean;
};

type DashboardDocumentRowProps = {
  document: DashboardDocumentRowItem;
  isArchived?: boolean;
  onOpenDocument: (id: string) => void;
  onConvert?: (id: string) => void;
  onAttach?: (id: string) => void;
  onOpenChannel: (id: string) => void;
  onIdentify?: (id: string) => void;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
};

export function DashboardDocumentRow({
  document,
  isArchived = false,
  onOpenDocument,
  onConvert,
  onAttach,
  onOpenChannel,
  onIdentify,
  onArchive,
  onUnarchive,
}: DashboardDocumentRowProps) {
  const isCase = document.channelType === 'case';
  const isUnrecognized = document.isUnrecognized;

  return (
    <div
      className={`wireframe-card p-4 border-2 transition-all space-y-3 ${
        isArchived
          ? 'opacity-65 bg-zinc-50 border-dashed border-zinc-300'
          : isUnrecognized
          ? 'bg-white border-dashed border-black hover:bg-zinc-50'
          : 'bg-white border-black hover:bg-zinc-50/50'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div
            onClick={() => !isArchived && onOpenDocument(document.id)}
            className={`w-10 h-10 border-2 flex items-center justify-center shrink-0 ${
              isArchived 
                ? 'border-zinc-300 bg-zinc-100 cursor-not-allowed' 
                : 'border-black bg-zinc-100 cursor-pointer hover:bg-zinc-200 transition-colors'
            }`}
          >
            {isArchived ? (
              <AlertTriangle size={20} className="text-zinc-400" />
            ) : isUnrecognized ? (
              <AlertTriangle size={20} className="text-black" />
            ) : (
              <FileText size={20} className="text-black" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p
                onClick={() => !isArchived && onOpenDocument(document.id)}
                className={`font-black uppercase text-xs tracking-tight ${
                  isArchived 
                    ? 'line-through text-zinc-400 cursor-not-allowed' 
                    : 'hover:underline cursor-pointer text-black'
                }`}
              >
                {document.name}
              </p>
              {isArchived ? null : isUnrecognized ? (
                <span className="text-[7px] bg-black text-white px-1.5 py-0.5 border border-black font-black uppercase tracking-wider flex items-center gap-1">
                  ⚠ UNRECOGNIZED SENDER
                </span>
              ) : document.isExternal ? (
                <span className="text-[7px] bg-gray-100 text-black px-1.5 py-0.5 border border-black font-black uppercase tracking-wider">
                  EXTERNAL • {document.transport || 'EMAIL'}
                </span>
              ) : null}
            </div>
            <div className={`flex gap-2 items-center text-[9px] font-bold uppercase ${isArchived ? 'text-zinc-400 line-through' : 'text-muted-foreground'}`}>
              <span>
                {isUnrecognized
                  ? `Via ${document.transport || 'External'} — Sender Unknown`
                  : `From: ${document.sender}`}
              </span>
              <span>•</span>
              <span>{document.size}</span>
            </div>
          </div>
        </div>
        {isArchived ? (
          <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
            <span className="text-[8px] font-bold uppercase text-zinc-400">{document.date}</span>
            <span className="text-[9px] font-black uppercase px-3 py-1 bg-red-50 border border-red-200 text-red-600">
              Spam
            </span>
          </div>
        ) : (
          <span className="text-[8px] font-bold uppercase text-muted-foreground">{document.date}</span>
        )}
      </div>

      {!isArchived && (
        <div
          className="flex flex-wrap gap-2 pt-2 border-t border-black/10 items-center justify-between"
        >
          {isUnrecognized ? (
            <button
              onClick={() => onIdentify?.(document.id)}
              className="wireframe-button w-full text-[9px] font-black uppercase px-4 py-2 bg-black text-white border-2 border-black hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <AlertTriangle size={12} />
              Identify &amp; Categorize <ArrowUpRight size={12} />
            </button>
          ) : (
            <>
                <div className="flex gap-2">
                  {!isCase && (
                    <>
                      {onConvert && (
                        <button
                          onClick={() => onConvert(document.id)}
                          className="wireframe-button p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all flex items-center justify-center"
                          title="Convert to Referral"
                          aria-label="Convert to Referral"
                        >
                          <UserPlus size={14} />
                        </button>
                      )}
                      {onAttach && (
                        <button
                          onClick={() => onAttach(document.id)}
                          className="wireframe-button p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all flex items-center justify-center"
                          title="Attach to existing referral"
                          aria-label="Attach to existing referral"
                        >
                          <Paperclip size={14} />
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => onArchive?.(document.id)}
                    className="wireframe-button p-2 border-2 border-black bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-all flex items-center justify-center"
                    title="Mark as Spam"
                    aria-label="Mark as Spam"
                  >
                    <Ban size={14} />
                  </button>
                </div>

              <button
                onClick={() => onOpenChannel(document.id)}
                className="wireframe-button text-[9px] font-black uppercase px-4 py-1.5 bg-black text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5 ml-auto"
              >
                Open in Channel <ArrowUpRight size={12} />
              </button>
            </>
          )}
        </div>
      )}
      {isArchived && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-black/10 items-center justify-end">
          <button
            onClick={() => onUnarchive?.(document.id)}
            className="wireframe-button text-[9px] font-black uppercase px-3 py-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-all"
          >
            Mark as Not Spam
          </button>
        </div>
      )}
    </div>
  );
}
