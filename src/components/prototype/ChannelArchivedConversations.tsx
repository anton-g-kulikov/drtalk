"use client";

export type ArchivedChannelConversation = {
  id: string;
  name: string;
  patientName: string;
  practiceId: string;
  referralId: string;
  isArchived: boolean;
  lastMessage: string;
};

type ChannelArchivedConversationsProps = {
  conversations: ArchivedChannelConversation[];
  onReactivate: (conversationId: string) => void;
  isInternal?: boolean;
};

export function ChannelArchivedConversations({
  conversations,
  onReactivate,
  isInternal = false,
}: ChannelArchivedConversationsProps) {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-zinc-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="wireframe-card p-6 bg-white border-2 border-black space-y-6">
          <div className="border-b-2 border-black pb-3">
            <h3 className="text-sm font-black uppercase tracking-widest italic text-black">
              {isInternal ? 'Archived Channels' : 'Archived Conversations'}
            </h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
              {isInternal ? 'Re-activate any internal channel to resume communication' : 'Re-activate any per-case channel to resume communication'}
            </p>
          </div>

          {conversations.length === 0 ? (
            <div className="p-8 border-2 border-black border-dashed text-center text-muted-foreground uppercase text-[10px] font-bold">
              {isInternal ? 'No archived internal channels.' : 'No archived conversations for this practice.'}
            </div>
          ) : (
            <div className="divide-y divide-black/10">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="py-4 flex items-center justify-between text-black">
                  <div>
                    <p className="font-bold text-xs uppercase text-black">#{conversation.name}</p>
                    <p className="text-[8px] text-muted-foreground uppercase font-bold mt-0.5">
                      {isInternal ? 'Internal Channel' : `Case ID: ${conversation.id.replace('case_', '')}`}
                    </p>
                  </div>
                  <button
                    onClick={() => onReactivate(conversation.id)}
                    className="wireframe-button text-[9px] font-black uppercase px-4 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-all"
                  >
                    Re-activate <span className="sr-only">{conversation.name}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
