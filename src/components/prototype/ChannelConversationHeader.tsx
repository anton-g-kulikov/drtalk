"use client";

import { useState } from 'react';
import { ArrowLeft, FileText, Hash, Users, MoreVertical } from 'lucide-react';
import type { Channel } from '@/prototype/channelTypes';
import { getReferralCode, type ReferralStatus } from '@/lib/referrals';

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
  onRenameChannel?: (channelId: string, newName: string) => void;
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
  onRenameChannel,
}: ChannelConversationHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  
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
            {!activeChannel.type.startsWith('archive_') ? (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                <span className="text-[8px] text-muted-foreground uppercase font-black">
                  {isCaseChannel ? `Case ${getReferralCode(activeChannel.id.replace('case_', ''))}` : `${activeChannel.memberCount} Members`}
                </span>
                {activeChannel.isExternal && (
                  <span className="text-[7px] font-black uppercase px-1.5 py-0.5 border border-black bg-gray-100 whitespace-nowrap">
                    External &bull; Secure Email
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[8px] text-muted-foreground uppercase font-black">
                  {activeChannel.memberCount} Archived {activeChannel.type === 'archive_internal' ? 'Channels' : activeChannel.type === 'archive_group' ? 'Groups' : 'Cases'}
                </span>
              </div>
            )}
          </div>
        </div>
        {!activeChannel.type.startsWith('archive_') && (
          <div className="relative text-black">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 hover:bg-gray-100 border-2 border-black text-black flex items-center justify-center transition-all bg-white"
              aria-label="More options"
            >
              <MoreVertical size={16} />
            </button>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 mt-2 z-40 bg-white border-2 border-black w-44 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-[9px] font-black divide-y-2 divide-black">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenParticipants();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-black hover:text-white transition-all"
                  >
                    Participants
                  </button>
                  {onRenameChannel && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setNewChannelName(activeChannel.name);
                        setIsRenameModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-black hover:text-white transition-all"
                    >
                      Rename Channel
                    </button>
                  )}
                  {(isCaseChannel || activeChannel.type === 'internal' || activeChannel.type === 'group') && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onArchiveCase();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-black hover:text-white transition-all text-red-600 hover:text-white"
                    >
                      Archive Channel
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
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
        </div>
      )}

      {isRenameModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
            <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-4">
              Rename Channel
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="rename-channel-input" className="text-[10px] font-black uppercase block mb-1">
                  New Name
                </label>
                <input
                  id="rename-channel-input"
                  type="text"
                  className="wireframe-input w-full p-2 text-xs font-bold border-2 border-black"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setIsRenameModalOpen(false)}
                  className="wireframe-button bg-white text-black px-4 py-2 border-2 border-black hover:bg-gray-100 font-bold uppercase text-[9px]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newChannelName.trim()) {
                      onRenameChannel?.(activeChannel.id, newChannelName.trim());
                      setIsRenameModalOpen(false);
                    }
                  }}
                  className="wireframe-button bg-black text-white px-4 py-2 hover:bg-zinc-800 font-black uppercase text-[9px]"
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
