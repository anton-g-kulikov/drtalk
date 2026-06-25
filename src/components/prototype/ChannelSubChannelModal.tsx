import { Hash, X } from 'lucide-react';

type ChannelSubChannelModalProps = {
  subChannelName: string;
  error: string | null;
  parentPracticeName: string;
  onSubChannelNameChange: (name: string) => void;
  onCancel: () => void;
  onCreate: () => void;
};

export function ChannelSubChannelModal({
  subChannelName,
  error,
  parentPracticeName,
  onSubChannelNameChange,
  onCancel,
  onCreate,
}: ChannelSubChannelModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-black">
      <div className="bg-white border-4 border-black p-8 max-w-md w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-slide-in">
        <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
            <Hash size={16} /> Create Sub-channel
          </h3>
          <button
            onClick={onCancel}
            className="hover:text-black text-black"
            aria-label="Close sub-channel modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-100 p-3 border border-black mb-2">
            <p className="text-[8px] font-black uppercase tracking-wider text-muted-foreground">Parent Practice</p>
            <p className="text-[10px] font-bold uppercase text-black">{parentPracticeName}</p>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black uppercase tracking-wider text-muted-foreground block">
              Sub-channel Name
            </label>
            <input
              type="text"
              placeholder="e.g. billing, clinical-board, cases..."
              value={subChannelName}
              onChange={(event) => onSubChannelNameChange(event.target.value)}
              className="wireframe-input w-full p-2.5 border-2 border-black text-[10px] uppercase font-bold text-black focus:outline-none"
              autoFocus
            />
            <p className="text-[8px] text-muted-foreground mt-1 uppercase">
              Spaces will be replaced with hyphens (lowercase).
            </p>
          </div>

          {error && (
            <div className="border border-red-500 bg-red-50 text-red-900 px-3 py-2 text-[9px] font-bold uppercase tracking-wider">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 wireframe-button bg-white text-black border-2 border-black py-3 text-[10px] uppercase font-black tracking-widest hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="flex-1 wireframe-button bg-black text-white border-2 border-black py-3 text-[10px] uppercase font-black tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
