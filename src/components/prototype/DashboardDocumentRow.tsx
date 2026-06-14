import { ArrowUpRight, FileText } from 'lucide-react';

export type DashboardDocumentRowItem = {
  id: string;
  name: string;
  sender: string;
  date: string;
  size: string;
  isExternal?: boolean;
  transport?: 'Email' | 'Fax' | 'App';
  channelType?: 'practice' | 'case';
};

type DashboardDocumentRowProps = {
  document: DashboardDocumentRowItem;
  isArchived?: boolean;
  onOpenDocument: (id: string) => void;
  onConvert: (id: string) => void;
  onAttach: (id: string) => void;
  onOpenChannel: (id: string) => void;
};

export function DashboardDocumentRow({
  document,
  isArchived = false,
  onOpenDocument,
  onConvert,
  onAttach,
  onOpenChannel,
}: DashboardDocumentRowProps) {
  const isCase = document.channelType === 'case';

  return (
    <div className={`wireframe-card p-4 bg-white border-2 border-black space-y-3 hover:bg-zinc-50/50 transition-all ${isArchived ? 'opacity-80' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-zinc-100 shrink-0">
            <FileText size={20} className="text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p
                onClick={() => onOpenDocument(document.id)}
                className="font-black uppercase text-xs tracking-tight hover:underline cursor-pointer text-black"
              >
                {document.name}
              </p>
              {document.isExternal && (
                <span className="text-[7px] bg-gray-100 text-black px-1.5 py-0.5 border border-black font-black uppercase tracking-wider">
                  EXTERNAL • {document.transport || 'EMAIL'}
                </span>
              )}
            </div>
            <div className="flex gap-2 items-center text-[9px] font-bold uppercase text-muted-foreground">
              <span>From: {document.sender}</span>
              <span>•</span>
              <span>{document.size}</span>
            </div>
          </div>
        </div>
        {isArchived ? (
          <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
            <span className="text-[8px] font-bold uppercase text-muted-foreground">{document.date}</span>
            <span className="text-[9px] font-black uppercase px-3 py-1 bg-zinc-200 border border-zinc-400 text-zinc-600">
              Archived
            </span>
          </div>
        ) : (
          <span className="text-[8px] font-bold uppercase text-muted-foreground">{document.date}</span>
        )}
      </div>

      {!isArchived && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-black/10 items-center justify-between">
          {!isCase && (
            <div className="flex gap-2">
              <button
                onClick={() => onConvert(document.id)}
                className="wireframe-button text-[9px] font-black uppercase px-3 py-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-all"
              >
                Convert to Referral
              </button>
              <button
                onClick={() => onAttach(document.id)}
                className="wireframe-button text-[9px] font-black uppercase px-3 py-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-all"
              >
                Attach to existing referral
              </button>
            </div>
          )}

          <button
            onClick={() => onOpenChannel(document.id)}
            className="wireframe-button text-[9px] font-black uppercase px-4 py-1.5 bg-black text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5 ml-auto"
          >
            Open in Channel <ArrowUpRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
