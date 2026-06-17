"use client";

import { ArrowLeft, FileText, Hash, Users } from 'lucide-react';
import type { Channel } from '@/prototype/channelTypes';
import type { ReferralStatus } from '@/lib/referrals';

type ChannelTab = 'messages' | 'documents' | 'archived';

type ChannelConversationHeaderProps = {
  activeChannel: Channel;
  isDentist: boolean;
  activeTab: ChannelTab;
  onActiveTabChange: (tab: ChannelTab) => void;
  onShowChannelList: () => void;
  onBackToPractice: () => void;
  onArchiveCase: () => void;
  onOpenParticipants: () => void;
  onCompleteCare?: () => void;
  referralStatus?: ReferralStatus;
};

export function ChannelConversationHeader({
  activeChannel,
  isDentist,
  activeTab,
  onActiveTabChange,
  onShowChannelList,
  onBackToPractice,
  onArchiveCase,
  onOpenParticipants,
  onCompleteCare,
  referralStatus,
}: ChannelConversationHeaderProps) {
  const isCaseChannel = activeChannel.id.startsWith('case_');
  const displayName = isCaseChannel || activeChannel.id !== '3' || isDentist
    ? activeChannel.name
    : 'Sunshine Dental';

  return (
    <>
      <div className="h-16 bg-white border-b-2 border-black flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onShowChannelList}
            className="p-2 -ml-2 lg:hidden hover:bg-gray-100 transition-colors"
          >
            <Hash size={20} />
          </button>
          {isCaseChannel && (
            <button
              onClick={onBackToPractice}
              className="mr-1 p-1 hover:bg-gray-100 border border-black/20 text-black"
              title="Back to practice dashboard"
            >
              <ArrowLeft size={14} />
            </button>
          )}
          <div className="w-8 h-8 border-2 border-black flex items-center justify-center shrink-0 text-black">
            {isCaseChannel ? (
              <FileText size={16} />
            ) : activeChannel.type === 'internal' ? (
              <Hash size={16} />
            ) : (
              <Users size={16} />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-black uppercase text-xs truncate text-black">
              {displayName}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              <span className="text-[8px] text-muted-foreground uppercase font-black">
                {isCaseChannel ? 'Case Sub-Channel' : `${activeChannel.memberCount} Members`}
              </span>
              {activeChannel.isExternal && (
                <span className="text-[7px] font-black uppercase px-1.5 py-0.5 border border-black bg-gray-100 whitespace-nowrap">
                  External &bull; Secure Email
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-black">
          {isCaseChannel && isDentist && referralStatus === 'Released' && onCompleteCare && (
            <button
              onClick={onCompleteCare}
              className="wireframe-button border-2 border-black px-3 py-1.5 bg-black text-white hover:bg-zinc-800 transition-all text-[9px] uppercase font-black"
            >
              Complete Care
            </button>
          )}
          {isCaseChannel && (
            <button
              onClick={onArchiveCase}
              className="wireframe-button border-2 border-black px-3 py-1.5 hover:bg-black hover:text-white transition-all text-[9px] uppercase font-black bg-white text-black"
            >
              Archive Channel
            </button>
          )}
          <button onClick={onOpenParticipants} className="hidden sm:block text-[10px] font-bold uppercase underline">
            Participants
          </button>
        </div>
      </div>

      {activeChannel.type === 'inter-practice' && (
        <div className="h-10 bg-white border-b-2 border-black flex px-6 shrink-0 gap-4">
          <button
            onClick={() => onActiveTabChange('messages')}
            className={`text-[9px] font-black uppercase tracking-wider px-4 border-b-4 transition-all ${activeTab === 'messages'
              ? 'border-black text-black font-black'
              : 'border-transparent text-muted-foreground hover:text-black'
              }`}
          >
            Messages
          </button>
          <button
            onClick={() => onActiveTabChange('documents')}
            className={`text-[9px] font-black uppercase tracking-wider px-4 border-b-4 transition-all ${activeTab === 'documents'
              ? 'border-black text-black font-black'
              : 'border-transparent text-muted-foreground hover:text-black'
              }`}
          >
            Documents
          </button>
          {!isCaseChannel && (
            <button
              onClick={() => onActiveTabChange('archived')}
              className={`text-[9px] font-black uppercase tracking-wider px-4 border-b-4 transition-all ${activeTab === 'archived'
                ? 'border-black text-black font-black'
                : 'border-transparent text-muted-foreground hover:text-black'
                }`}
            >
              Archived Conversations
            </button>
          )}
        </div>
      )}
    </>
  );
}
