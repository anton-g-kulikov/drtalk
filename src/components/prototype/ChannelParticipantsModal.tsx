import React, { useState } from 'react';
import { Users, X, UserPlus, Info, Check, Search } from 'lucide-react';

export type ChannelParticipant = {
  id: string;
  name: string;
  role: string;
  selected: boolean;
  practice?: string;
};

type ChannelParticipantsModalProps = {
  participants: ChannelParticipant[];
  onParticipantToggle: (id: string) => void;
  onClose: () => void;
  channelId?: string;
  isDentist?: boolean;
  channelType?: string;
};

const EXTERNAL_DENTISTS = [
  { id: 'ext-p1', name: 'Dr. Taylor Reed', role: 'Owner', practice: 'Sunshine Dental' },
  { id: 'ext-p2', name: 'Jane Doe', role: 'Team Member', practice: 'Sunshine Dental' },
  { id: 'ext-p3', name: 'Dr. Sarah Jenkins', role: 'Owner', practice: 'Desert Bloom Dental' },
  { id: 'ext-p4', name: 'Dr. Marco Reyes', role: 'Owner', practice: 'Desert Bloom Dental' },
];

const EXTERNAL_SPECIALISTS = [
  { id: 'ext-s1', name: 'Dr. Clara Valley', role: 'Owner', practice: 'Valley Endodontics' },
  { id: 'ext-s2', name: 'Robert Chen', role: 'Practice Admin', practice: 'Valley Endodontics' },
  { id: 'ext-s3', name: 'Dr. Marcus Jones', role: 'Owner', practice: 'Downtown Oral Surgery' },
  { id: 'ext-s4', name: 'Linda Brooks', role: 'Practice Admin', practice: 'Downtown Oral Surgery' },
];

export function ChannelParticipantsModal({
  participants,
  onParticipantToggle,
  onClose,
  channelId,
  isDentist,
  channelType,
}: ChannelParticipantsModalProps) {
  const isCaseChannel = channelId?.startsWith('case_');
  const isGroupChat = channelType === 'group';

  const [addedExternalIds, setAddedExternalIds] = useState<string[]>([]);
  const [externalSearchQuery, setExternalSearchQuery] = useState('');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');

  // Choose the external users based on current role (dentists see specialists, specialists see dentists)
  const availableExternalList = isDentist ? EXTERNAL_SPECIALISTS : EXTERNAL_DENTISTS;

  const handleAddExternal = (user: typeof EXTERNAL_DENTISTS[0]) => {
    setAddedExternalIds((prev) => [...prev, user.id]);
    setExternalSearchQuery('');
  };

  const handleRemoveExternal = (userId: string) => {
    setAddedExternalIds((prev) => prev.filter((id) => id !== userId));
  };

  // Compile active list: original participants + added external users
  const activeExternalParticipants = availableExternalList
    .filter((user) => addedExternalIds.includes(user.id))
    .map((user) => ({
      id: user.id,
      name: user.name,
      role: `${user.role} (${user.practice})`,
      selected: true,
      isExternal: true,
    }));

  const inviteableExternalUsers = availableExternalList.filter(
    (user) => !addedExternalIds.includes(user.id)
  );

  const filteredInviteableUsers = inviteableExternalUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(externalSearchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(externalSearchQuery.toLowerCase()) ||
      user.practice.toLowerCase().includes(externalSearchQuery.toLowerCase())
  );

  // Group chat specific lists:
  const activeGroupMembers = participants.filter((p) => p.selected);
  const availableToAdd = participants.filter((p) => !p.selected);

  const filteredAvailableToAdd = availableToAdd.filter(
    (user) =>
      user.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
      (user.practice || '').toLowerCase().includes(groupSearchQuery.toLowerCase())
  );

  // Group available users by practice
  const availableByPractice = filteredAvailableToAdd.reduce((acc, user) => {
    const practiceName = user.practice || 'Other Practices';
    if (!acc[practiceName]) acc[practiceName] = [];
    acc[practiceName].push(user);
    return acc;
  }, {} as Record<string, typeof participants>);

  // Group active/all normal participants by practice
  const participantsByPractice = participants.reduce((acc, user) => {
    const practiceName = user.practice || 'Other Practices';
    if (!acc[practiceName]) acc[practiceName] = [];
    acc[practiceName].push(user);
    return acc;
  }, {} as Record<string, typeof participants>);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-black">
      <div className="bg-white border-4 border-black p-6 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-in flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-4 shrink-0">
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

        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {isGroupChat ? (
            /* ==================== GROUP CHAT MODEL (OPT-IN) ==================== */
            <>
              {/* Active Group Members */}
              <div className="space-y-2">
                <span className="text-[8px] font-black uppercase tracking-wider text-gray-500 block mb-1">
                  Active Group Members
                </span>
                {activeGroupMembers.length === 0 ? (
                  <p className="text-[9px] font-bold text-gray-400 uppercase italic py-2">
                    No active members in this group.
                  </p>
                ) : (
                  activeGroupMembers.map((participant) => (
                    <label
                      key={participant.id}
                      className="flex items-center justify-between p-2 border-2 border-black hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-black flex items-center justify-center bg-black text-white transition-colors">
                          <Check size={10} strokeWidth={4} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase">{participant.name}</p>
                          <p className="text-[8px] font-bold text-muted-foreground uppercase">
                            {participant.role} &bull; {participant.practice}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={true}
                        onChange={() => onParticipantToggle(participant.id)}
                      />
                    </label>
                  ))
                )}
              </div>

              {/* Add People to Group */}
              <div className="space-y-3 pt-4 border-t-2 border-dashed border-black/25">
                <div>
                  <span className="text-[8px] font-black uppercase tracking-wider text-gray-500 block mb-2">
                    Add People to Group
                  </span>
                  <div className="relative flex items-center mb-3">
                    <span className="absolute left-3 text-black">
                      <Search size={12} />
                    </span>
                    <input
                      type="text"
                      placeholder="SEARCH BY NAME OR PRACTICE..."
                      value={groupSearchQuery}
                      onChange={(e) => setGroupSearchQuery(e.target.value)}
                      className="w-full text-[9px] border-2 border-black pl-8 pr-8 py-1.5 bg-white text-black font-bold uppercase placeholder:text-zinc-400 focus:outline-none"
                    />
                    {groupSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setGroupSearchQuery('')}
                        className="absolute right-3 text-muted-foreground hover:text-black"
                        aria-label="Clear search"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {availableToAdd.length === 0 ? (
                  <p className="text-[9px] font-black uppercase text-center text-zinc-400 py-2">
                    Everyone has been added to the group.
                  </p>
                ) : filteredAvailableToAdd.length === 0 ? (
                  <p className="text-[9px] font-black uppercase text-center text-zinc-400 py-2">
                    No matching users found.
                  </p>
                ) : (
                  <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
                    {Object.entries(availableByPractice).map(([practiceName, members]) => (
                      <div key={practiceName} className="space-y-1.5">
                        <h4 className="text-[8px] font-black uppercase text-muted-foreground border-b border-black border-dashed pb-0.5">
                          {practiceName}
                        </h4>
                        <div className="space-y-1">
                          {members.map((member) => (
                            <label
                              key={member.id}
                              className="flex items-center justify-between p-2 border border-black hover:bg-zinc-50 cursor-pointer transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-3.5 h-3.5 border border-black flex items-center justify-center bg-white text-transparent transition-colors">
                                  <Check size={8} strokeWidth={4} />
                                </div>
                                <div>
                                  <p className="text-[9.5px] font-bold uppercase text-black">{member.name}</p>
                                  <p className="text-[7.5px] font-bold text-zinc-500 uppercase">{member.role}</p>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                className="hidden"
                                checked={false}
                                onChange={() => onParticipantToggle(member.id)}
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ==================== NORMAL / INTER-PRACTICE MODEL (OPT-OUT) ==================== */
            <>
              {/* Main/Active Participants List */}
              <div className="space-y-2">
                <p className="text-[7.5px] text-zinc-400 font-bold uppercase tracking-wider mb-2 leading-relaxed">
                  Uncheck a user&apos;s name to exclude them from this channel, or check it again to restore their access.
                </p>
                {Object.entries(participantsByPractice).map(([practiceName, members]) => (
                  <div key={practiceName} className="space-y-2 pt-2 first:pt-0">
                    <h4 className="text-[8px] font-black uppercase text-gray-400 border-b border-black border-dashed pb-0.5 mb-1.5">
                      {practiceName}
                    </h4>
                    <div className="space-y-1">
                      {members.map((participant) => (
                        <label
                          key={participant.id}
                          className="flex items-center justify-between p-2 border-2 border-black hover:bg-gray-50 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 border-2 border-black flex items-center justify-center transition-colors ${participant.selected ? 'bg-black text-white' : 'bg-white text-transparent'}`}>
                              <Check size={10} strokeWidth={4} />
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
                  </div>
                ))}

                {/* Added External Participants */}
                {activeExternalParticipants.map((participant) => (
                  <label
                    key={participant.id}
                    className="flex items-center justify-between p-2 border-2 border-dashed border-red-500 bg-red-50/30 hover:bg-red-50/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-red-500 flex items-center justify-center bg-red-500 text-white">
                        <Check size={10} strokeWidth={4} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-red-700 flex items-center gap-1.5">
                          {participant.name}
                          <span className="text-[7px] bg-red-600 text-white font-black px-1.5 py-0.2 shrink-0">
                            EXTERNAL
                          </span>
                        </p>
                        <p className="text-[8px] font-bold text-red-600 uppercase">{participant.role}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={true}
                      onChange={() => handleRemoveExternal(participant.id)}
                    />
                  </label>
                ))}
              </div>

              {/* Invite External Participants Section (Only for per-case channels) */}
              {isCaseChannel && (
                <div className="space-y-3 pt-4 border-t-2 border-dashed border-black/20">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1">
                      <UserPlus size={10} /> Invite External Users from Connected Practices
                    </span>
                    <p className="text-[7.5px] text-gray-400 uppercase font-bold mt-0.5 leading-relaxed mb-2">
                      Allows adding practitioners from other practices specifically to this patient case.
                    </p>
                    <input
                      type="text"
                      placeholder="Search by name, practice, or role..."
                      value={externalSearchQuery}
                      onChange={(e) => setExternalSearchQuery(e.target.value)}
                      className="w-full text-[10px] border border-black p-2 bg-white text-black font-bold outline-none placeholder:text-zinc-400"
                    />
                  </div>

                  {inviteableExternalUsers.length === 0 ? (
                    <p className="text-[9px] font-black uppercase text-center text-zinc-400 py-2">
                      All available external users invited.
                    </p>
                  ) : filteredInviteableUsers.length === 0 ? (
                    <p className="text-[9px] font-black uppercase text-center text-zinc-400 py-2">
                      No matching users found.
                    </p>
                  ) : (
                    <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
                      {filteredInviteableUsers.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleAddExternal(user)}
                          className="flex items-center justify-between p-2 border border-black/40 hover:border-black hover:bg-zinc-50 cursor-pointer transition-all active:scale-[0.99]"
                        >
                          <div>
                            <p className="text-[9.5px] font-black uppercase">{user.name}</p>
                            <p className="text-[7.5px] font-bold text-zinc-500 uppercase">
                              {user.role} &bull; {user.practice}
                            </p>
                          </div>
                          <span className="text-[8px] font-black uppercase bg-black text-white px-2 py-1 hover:bg-zinc-800 transition-colors">
                            Add to Case
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {addedExternalIds.length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-500 p-2.5 text-[8.5px] uppercase font-bold text-amber-900 flex items-start gap-2 shrink-0 mt-4">
            <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-[9px]">External Access Warning</p>
              <p className="mt-0.5 text-amber-800 leading-normal font-bold">
                Added external participants will have access to all channel history & shared documents.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t-2 border-black shrink-0 mt-4">
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
