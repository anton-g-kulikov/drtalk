import React, { useState } from 'react';
import { Search, X, Check } from 'lucide-react';
import type { GroupParticipant } from '@/prototype/channelFixtures';

type ParticipantSelectorProps = {
  participants: GroupParticipant[];
  onParticipantToggle: (id: string) => void;
  onPracticeToggle: (participantIds: string[], shouldSelect: boolean) => void;
  maxHeightClass?: string;
};

export function ParticipantSelector({
  participants,
  onParticipantToggle,
  onPracticeToggle,
  maxHeightClass = 'max-h-[30vh]',
}: ParticipantSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.practice.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const participantsByPractice = filteredParticipants.reduce((acc, participant) => {
    if (!acc[participant.practice]) acc[participant.practice] = [];
    acc[participant.practice].push(participant);
    return acc;
  }, {} as Record<string, GroupParticipant[]>);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[8px] font-black uppercase tracking-wider text-muted-foreground block">
          Select Participants
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-black">
            <Search size={12} />
          </span>
          <input
            type="text"
            placeholder="SEARCH BY NAME OR PRACTICE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="wireframe-input w-full pl-9 pr-8 py-2 border-2 border-black text-[10px] uppercase font-bold text-black focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-muted-foreground hover:text-black"
              aria-label="Clear search query"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className={`space-y-4 overflow-y-auto pr-2 ${maxHeightClass}`}>
        {Object.keys(participantsByPractice).length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-[9px] uppercase font-black border-2 border-dashed border-gray-300">
            No participants found
          </div>
        ) : (
          Object.entries(participantsByPractice).map(([practiceName, members]) => {
            const allGroupSelected = members.every((member) => member.selected);
            return (
              <div key={practiceName} className="space-y-1.5">
                <div className="flex justify-between items-end border-b border-black border-dashed pb-1">
                  <h4 className="text-[8px] font-black uppercase text-muted-foreground tracking-wider">
                    {practiceName}
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      onPracticeToggle(
                        members.map((member) => member.id),
                        !allGroupSelected
                      )
                    }
                    className="flex items-center gap-1.5 text-[8px] font-black uppercase text-muted-foreground hover:text-black transition-colors"
                  >
                    <div
                      className={`w-3.5 h-3.5 border border-black flex items-center justify-center shrink-0 transition-colors ${
                        allGroupSelected ? 'bg-black text-white' : 'bg-white text-transparent'
                      }`}
                    >
                      <Check size={8} strokeWidth={4} />
                    </div>
                    <span>Select All</span>
                  </button>
                </div>
                <div className="space-y-1.5">
                  {members.map((participant) => (
                    <label
                      key={participant.id}
                      className="flex items-center justify-between p-2 border border-black hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3.5 h-3.5 border border-black flex items-center justify-center transition-colors ${
                            participant.selected ? 'bg-black text-white' : 'bg-white text-transparent'
                          }`}
                        >
                          <Check size={8} strokeWidth={4} />
                        </div>
                        <span className="text-[9px] font-bold uppercase text-black">
                          {participant.name}
                        </span>
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
          })
        )}
      </div>
    </div>
  );
}
