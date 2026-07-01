import { Users, X } from 'lucide-react';
import type { GroupParticipant } from '@/prototype/channelFixtures';
import { ParticipantSelector } from '@/components/prototype/ParticipantSelector';

type ChannelGroupModalProps = {
  groupChatName: string;
  participants: GroupParticipant[];
  error: string | null;
  onGroupChatNameChange: (name: string) => void;
  onParticipantToggle: (id: string) => void;
  onPracticeToggle: (participantIds: string[], shouldSelect: boolean) => void;
  onCancel: () => void;
  onCreate: () => void;
};

export function ChannelGroupModal({
  groupChatName,
  participants,
  error,
  onGroupChatNameChange,
  onParticipantToggle,
  onPracticeToggle,
  onCancel,
  onCreate,
}: ChannelGroupModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-black">
      <div className="bg-white border-4 border-black p-8 max-w-lg w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-slide-in">
        <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
            <Users size={16} /> Create Group Chat
          </h3>
          <button
            onClick={onCancel}
            className="hover:text-black text-black"
            aria-label="Close group chat modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="space-y-1">
            <label className="text-[8px] font-black uppercase tracking-wider text-muted-foreground">Group Chat Name</label>
            <input
              type="text"
              placeholder="ENTER GROUP CHAT NAME..."
              value={groupChatName}
              onChange={(event) => onGroupChatNameChange(event.target.value)}
              className="wireframe-input w-full p-2.5 border-2 border-black text-[10px] uppercase font-bold text-black focus:outline-none"
            />
          </div>

          <ParticipantSelector
            participants={participants}
            onParticipantToggle={onParticipantToggle}
            onPracticeToggle={onPracticeToggle}
            maxHeightClass="max-h-[40vh]"
          />
        </div>

        {error && (
          <div className="mb-4 bg-black text-white border-2 border-black p-3 text-center animate-fade-in shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-[9px] font-black uppercase tracking-widest">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t-2 border-black">
          <button
            onClick={onCancel}
            className="wireframe-button border-black hover:bg-black hover:text-white text-[10px] uppercase py-2 px-4 font-black transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            className="wireframe-button bg-black text-white border-black text-[10px] uppercase py-2 px-6 font-black hover:bg-white hover:text-black transition-all"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}
