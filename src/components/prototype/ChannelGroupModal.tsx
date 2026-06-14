import { Users, X } from 'lucide-react';
import type { GroupParticipant } from '@/prototype/channelFixtures';

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
  const participantsByPractice = participants.reduce((acc, participant) => {
    if (!acc[participant.practice]) acc[participant.practice] = [];
    acc[participant.practice].push(participant);
    return acc;
  }, {} as Record<string, GroupParticipant[]>);

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

        <div className="space-y-1 mb-4">
          <label className="text-[8px] font-black uppercase tracking-wider text-muted-foreground">Group Chat Name</label>
          <input
            type="text"
            placeholder="ENTER GROUP CHAT NAME..."
            value={groupChatName}
            onChange={(event) => onGroupChatNameChange(event.target.value)}
            className="wireframe-input w-full p-2 border-2 border-black text-[10px] text-black"
          />
        </div>

        <label className="text-[8px] font-black uppercase tracking-wider text-muted-foreground block mb-2">Select Participants</label>
        <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-6 pr-2">
          {Object.entries(participantsByPractice).map(([practiceName, members]) => {
            const allGroupSelected = members.every(member => member.selected);
            return (
              <div key={practiceName} className="space-y-1.5">
                <div className="flex justify-between items-end border-b border-black border-dashed pb-1">
                  <h4 className="text-[8px] font-black uppercase text-muted-foreground tracking-wider">
                    {practiceName}
                  </h4>
                  <button
                    type="button"
                    onClick={() => onPracticeToggle(members.map(member => member.id), !allGroupSelected)}
                    className="flex items-center gap-1.5 text-[8px] font-black uppercase text-muted-foreground hover:text-black transition-colors"
                  >
                    <div className={`w-3.5 h-3.5 border border-black flex items-center justify-center shrink-0 ${allGroupSelected ? 'bg-black' : 'bg-white'}`}>
                      {allGroupSelected && <div className="w-1.5 h-1.5 bg-white" />}
                    </div>
                    <span>Select All</span>
                  </button>
                </div>
                <div className="space-y-1.5">
                  {members.map(participant => (
                    <label key={participant.id} className="flex items-center justify-between p-2 border border-black hover:bg-gray-50 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className={`w-3.5 h-3.5 border border-black flex items-center justify-center ${participant.selected ? 'bg-black' : 'bg-white'}`}>
                          {participant.selected && <div className="w-1.5 h-1.5 bg-white" />}
                        </div>
                        <span className="text-[9px] font-bold uppercase text-black">{participant.name}</span>
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={participant.selected}
                        onChange={() => onParticipantToggle(participant.id)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
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
