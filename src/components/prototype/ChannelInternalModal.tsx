import { Hash, X } from 'lucide-react';
import type { GroupParticipant } from '@/prototype/channelFixtures';
import { ParticipantSelector } from '@/components/prototype/ParticipantSelector';

type ChannelInternalModalProps = {
  channelName: string;
  error: string | null;
  participants: GroupParticipant[];
  onChannelNameChange: (name: string) => void;
  onParticipantToggle: (id: string) => void;
  onPracticeToggle: (participantIds: string[], shouldSelect: boolean) => void;
  onCancel: () => void;
  onCreate: () => void;
};

export function ChannelInternalModal({
  channelName,
  error,
  participants,
  onChannelNameChange,
  onParticipantToggle,
  onPracticeToggle,
  onCancel,
  onCreate,
}: ChannelInternalModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-black">
      <div className="bg-white border-4 border-black p-8 max-w-lg w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-slide-in">
        <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
            <Hash size={16} /> Create Internal Channel
          </h3>
          <button
            onClick={onCancel}
            className="hover:text-black text-black"
            aria-label="Close internal channel modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="space-y-1">
            <label className="text-[8px] font-black uppercase tracking-wider text-muted-foreground block">
              Channel Name
            </label>
            <input
              type="text"
              placeholder="e.g. clinical-chat, clinical-board..."
              value={channelName}
              onChange={(event) => onChannelNameChange(event.target.value)}
              className="wireframe-input w-full p-2.5 border-2 border-black text-[10px] uppercase font-bold text-black focus:outline-none"
              autoFocus
            />
            <p className="text-[8px] text-muted-foreground mt-1 uppercase">
              Spaces will be replaced with hyphens (lowercase).
            </p>
          </div>

          <ParticipantSelector
            participants={participants}
            onParticipantToggle={onParticipantToggle}
            onPracticeToggle={onPracticeToggle}
            maxHeightClass="max-h-[30vh]"
          />

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
