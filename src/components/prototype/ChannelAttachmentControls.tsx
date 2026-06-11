import { FileText, ImageIcon, Paperclip, Plus, X } from 'lucide-react';

type AttachmentOption = {
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'zip' | 'doc';
};

type ChannelAttachmentDrawerProps = {
  attachments: AttachmentOption[];
  onAttachNew: () => void;
  onAttachRecent: (file: AttachmentOption) => void;
  onClose: () => void;
};

export function ChannelAttachmentDrawer({
  attachments,
  onAttachNew,
  onAttachRecent,
  onClose,
}: ChannelAttachmentDrawerProps) {
  return (
    <div className="absolute bottom-24 left-4 right-4 sm:left-6 sm:right-auto bg-white border-2 border-black p-4 z-40 w-[280px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-in">
      <div className="flex justify-between items-center pb-2 border-b border-black border-dashed mb-3">
        <span className="text-[9px] font-black uppercase tracking-wider text-black">Select Document to Attach</span>
        <button onClick={onClose} className="hover:text-black" aria-label="Close attachment picker">
          <X size={14} />
        </button>
      </div>
      <div className="space-y-1.5">
        <button
          onClick={onAttachNew}
          className="w-full flex items-center gap-2 p-2 bg-black text-white hover:bg-white hover:text-black border border-black text-left transition-all font-black text-[9px] uppercase group/btn"
        >
          <div className="w-5 h-5 border border-white group-hover/btn:border-black flex items-center justify-center shrink-0">
            <Plus size={12} />
          </div>
          <span>Attach New Document</span>
        </button>

        <div className="pt-2 border-t border-black/10">
          <p className="text-[7px] font-black uppercase text-muted-foreground mb-1.5 tracking-wider">Attach Recent scan/form</p>
          <div className="space-y-1">
            {attachments.map((file) => (
              <button
                key={`${file.name}-${file.size}`}
                onClick={() => onAttachRecent(file)}
                className="w-full text-left p-1.5 hover:bg-zinc-100 border border-transparent hover:border-black/10 flex items-center gap-2 overflow-hidden transition-all text-black"
              >
                <FileText size={12} className="shrink-0 text-black/50" />
                <div className="truncate">
                  <p className="text-[8px] font-bold uppercase truncate leading-tight">{file.name}</p>
                  <p className="text-[7px] text-muted-foreground uppercase leading-none mt-0.5">{file.size} • {file.type.toUpperCase()}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type AttachedDocumentPreviewProps = {
  document: AttachmentOption;
  onRemove: () => void;
};

export function AttachedDocumentPreview({
  document,
  onRemove,
}: AttachedDocumentPreviewProps) {
  return (
    <div className="flex items-center justify-between p-2 mb-2 bg-gray-50 border-2 border-black animate-fade-in">
      <div className="flex items-center gap-2 text-black">
        <div className="w-6 h-6 border border-black flex items-center justify-center bg-black text-white shrink-0">
          {document.type === 'pdf' ? <FileText size={12} /> :
            document.type === 'image' ? <ImageIcon size={12} /> :
              <Paperclip size={12} />}
        </div>
        <span className="text-[10px] font-bold uppercase">{document.name} ({document.size})</span>
      </div>
      <button
        onClick={onRemove}
        className="p-1 hover:bg-black hover:text-white border border-black transition-colors text-black"
        aria-label="Remove attached document"
      >
        <X size={10} />
      </button>
    </div>
  );
}
