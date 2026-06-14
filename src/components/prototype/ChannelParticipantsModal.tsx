import { Users, X } from 'lucide-react';

export type ChannelParticipant = {
  id: string;
  name: string;
  role: string;
  selected: boolean;
};

type ChannelParticipantsModalProps = {
  participants: ChannelParticipant[];
  onParticipantToggle: (id: string) => void;
  onClose: () => void;
};

export function ChannelParticipantsModal({
  participants,
  onParticipantToggle,
  onClose,
}: ChannelParticipantsModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-black">
      <div className="bg-white border-4 border-black p-6 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-in">
        <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
            <Users size={16} /> Manage Participants
          </h3>
          <button
            onClick={onClose}
            className="hover:text-black text-black"
            aria-label="Close participants modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto mb-6">
          {participants.map((participant) => (
            <label
              key={participant.id}
              className="flex items-center justify-between p-2 border-2 border-black hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 border-2 border-black flex items-center justify-center ${participant.selected ? 'bg-black' : 'bg-white'}`}>
                  {participant.selected && <div className="w-2 h-2 bg-white" />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase">{participant.name}</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase">{participant.role}</p>
                </div>
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

        <div className="flex justify-end gap-3 pt-4 border-t-2 border-black">
          <button
            onClick={onClose}
            className="wireframe-button bg-black text-white border-black text-[10px] uppercase py-2 px-6 font-bold hover:bg-white hover:text-black transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
