"use client";

import Link from 'next/link';
import { FileText, Hash, MoreHorizontal, Search, Folder } from 'lucide-react';
import { CommentMarker } from '@/components/Comments/CommentMarker';
import type { Channel } from '@/prototype/channelTypes';
import { ChannelItem } from '@/components/prototype/ChannelPrimitives';
import { ChannelSidebarSection } from '@/components/prototype/ChannelSidebarSection';

export type ChannelCaseSummary = {
  id: string;
  name: string;
  patientName: string;
  referralId: string;
  practiceId: string;
  isArchived: boolean;
  isExternal?: boolean;
  lastMessage: string;
  unreadCount?: number;
};

type ChannelSidebarProps = {
  isDentist: boolean;
  showChannelList: boolean;
  searchQuery: string;
  activeChannelId: string;
  internalCollapsed: boolean;
  connectedCollapsed: boolean;
  externalCollapsed: boolean;
  groupCollapsed: boolean;
  patientCollapsed: boolean;
  internalUnreadCount: number;
  connectedUnreadCount: number;
  externalUnreadCount: number;
  groupUnreadCount: number;
  patientUnreadCount: number;
  expandedPractices: Record<string, boolean>;
  channels?: Channel[];
  internalChannels: Channel[];
  onPlatformChannels: Channel[];
  externalChannels: Channel[];
  groupChannels: Channel[];
  patientChannels: Channel[];
  caseChannels: ChannelCaseSummary[];
  showCommentMarker?: boolean;
  onCloseMobile: () => void;
  onSearchQueryChange: (query: string) => void;
  onToggleInternal: () => void;
  onToggleConnected: () => void;
  onToggleExternal: () => void;
  onToggleGroup: () => void;
  onTogglePatient: () => void;
  onCreateGroup: () => void;
  onCreateInternalChannel: () => void;
  onCreateSubChannel?: (parentChannel: Channel) => void;
  onSelectChannel: (channel: Channel) => void;
  onSelectCaseChannel: (caseChannel: ChannelCaseSummary, parentChannel: Channel) => void;
};

function ChannelSubRow({
  subChannel,
  isActive,
  onSelectSubChannel,
}: {
  subChannel: Channel;
  isActive: boolean;
  onSelectSubChannel: () => void;
}) {
  const displayName = subChannel.name.startsWith('#') ? subChannel.name : `#${subChannel.name}`;
  return (
    <button
      key={subChannel.id}
      onClick={onSelectSubChannel}
      className={`w-full flex items-center justify-between py-1.5 pl-10 pr-3 text-left transition-all ${
        isActive
          ? 'bg-black text-white font-black'
          : 'hover:bg-gray-100 text-muted-foreground hover:text-black font-bold'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Hash size={10} className={isActive ? 'text-white' : 'text-black'} />
        <span className="text-[10px] uppercase tracking-tight truncate">{displayName}</span>
      </div>
      {subChannel.unreadCount && subChannel.unreadCount > 0 && !isActive && (
        <span className="bg-black text-white text-[8px] px-1.5 py-0.2 rounded-full shrink-0 ml-1.5">{subChannel.unreadCount}</span>
      )}
    </button>
  );
}

function ChannelCaseRow({
  caseChannel,
  parentChannel,
  isActive,
  isExternal,
  onSelectCaseChannel,
}: {
  caseChannel: ChannelCaseSummary;
  parentChannel: Channel;
  isActive: boolean;
  isExternal?: boolean;
  onSelectCaseChannel: (caseChannel: ChannelCaseSummary, parentChannel: Channel) => void;
}) {
  return (
    <button
      key={caseChannel.id}
      onClick={() => onSelectCaseChannel(caseChannel, parentChannel)}
      className={`w-full flex items-center justify-between py-1.5 pl-10 pr-3 text-left transition-all ${
        isActive
          ? 'bg-black text-white font-black'
          : 'hover:bg-gray-100 text-muted-foreground hover:text-black font-bold'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <FileText size={10} className={isActive ? 'text-white' : 'text-black'} />
        <span className="text-[10px] uppercase tracking-tight truncate">{caseChannel.name}</span>
        {isExternal && <span className="sr-only">External secure email</span>}
      </div>
      {caseChannel.unreadCount && caseChannel.unreadCount > 0 && !isActive && (
        <span className="bg-black text-white text-[8px] px-1.5 py-0.2 rounded-full shrink-0 ml-1.5">{caseChannel.unreadCount}</span>
      )}
    </button>
  );
}

function sortChannels(channelsList: Channel[]): { unread: Channel[], read: Channel[] } {
  const unread = (channelsList || []).filter((c) => c.unreadCount && c.unreadCount > 0);
  const read = (channelsList || []).filter((c) => !c.unreadCount || c.unreadCount === 0);

  unread.sort((a, b) => a.name.localeCompare(b.name));
  read.sort((a, b) => a.name.localeCompare(b.name));

  return { unread, read };
}

function sortCaseChannels(casesList: ChannelCaseSummary[]): { unread: ChannelCaseSummary[], read: ChannelCaseSummary[] } {
  const unread = (casesList || []).filter((c) => c.unreadCount && c.unreadCount > 0);
  const read = (casesList || []).filter((c) => !c.unreadCount || c.unreadCount === 0);

  unread.sort((a, b) => a.name.localeCompare(b.name));
  read.sort((a, b) => a.name.localeCompare(b.name));

  return { unread, read };
}

export function ChannelSidebar({
  isDentist,
  showChannelList,
  searchQuery,
  activeChannelId,
  internalCollapsed,
  connectedCollapsed,
  externalCollapsed,
  groupCollapsed,
  patientCollapsed,
  internalUnreadCount,
  connectedUnreadCount,
  externalUnreadCount,
  groupUnreadCount,
  patientUnreadCount,
  expandedPractices,
  channels = [],
  internalChannels,
  onPlatformChannels,
  externalChannels,
  groupChannels,
  patientChannels,
  caseChannels,
  showCommentMarker = true,
  onCloseMobile,
  onSearchQueryChange,
  onToggleInternal,
  onToggleConnected,
  onToggleExternal,
  onToggleGroup,
  onTogglePatient,
  onCreateGroup,
  onCreateInternalChannel,
  onCreateSubChannel = () => {},
  onSelectChannel,
  onSelectCaseChannel,
}: ChannelSidebarProps) {
  const archivedInternalCount = (channels || []).filter((c) => c.type === 'internal' && c.isArchived).length;
  const archivedGroupCount = (channels || []).filter((c) => c.type === 'group' && c.isArchived).length;

  return (
    <div className={`${showChannelList ? 'fixed inset-0 z-50' : 'hidden'} lg:relative lg:flex lg:w-80 border-r-2 border-black flex-col bg-white overflow-hidden`}>
      {showChannelList && (
        <button
          type="button"
          aria-label="Close channel list"
          onClick={onCloseMobile}
          className="absolute right-4 top-4 p-2 lg:hidden z-10"
        >
          <MoreHorizontal size={24} className="rotate-90" />
        </button>
      )}
      <div className="p-4 border-b-2 border-black space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold uppercase tracking-tighter italic">Communication</h2>
          {showCommentMarker && (
            <CommentMarker id="channels-list" title="Channels Page" description="The list of communication channels." />
          )}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="SEARCH CONVERSATIONS..."
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            className="wireframe-input pl-10 py-1.5 text-[10px] w-full"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ChannelSidebarSection
          title="Internal Communication"
          isCollapsed={internalCollapsed}
          unreadCount={internalUnreadCount}
          onToggle={onToggleInternal}
          withTopBorder={false}
          action={
            <button
              type="button"
              onClick={onCreateInternalChannel}
              className="text-[8px] font-black uppercase underline hover:text-black"
            >
              Create +
            </button>
          }
        >
          <div className="space-y-1">
            {(() => {
              const { unread, read } = sortChannels(internalChannels);
              return (
                <>
                  {unread.map((channel) => (
                    <ChannelItem
                      key={channel.id}
                      channel={channel}
                      isActive={activeChannelId === channel.id}
                      onClick={() => onSelectChannel(channel)}
                    />
                  ))}
                  {unread.length > 0 && read.length > 0 && (
                    <div className="border-t border-black/10 border-dashed my-1.5" />
                  )}
                  {read.map((channel) => (
                    <ChannelItem
                      key={channel.id}
                      channel={channel}
                      isActive={activeChannelId === channel.id}
                      onClick={() => onSelectChannel(channel)}
                    />
                  ))}
                </>
              );
            })()}
            {archivedInternalCount > 0 && (
              <button
                onClick={() => onSelectChannel({ id: 'archive_internal', name: 'Archived Channels', type: 'archive_internal', memberCount: archivedInternalCount } as any)}
                className={`w-full flex items-center justify-between py-1.5 px-3 text-left transition-all ${
                  activeChannelId === 'archive_internal'
                    ? 'bg-black text-white font-black'
                    : 'hover:bg-gray-100 text-muted-foreground hover:text-black font-bold'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Folder size={12} className={activeChannelId === 'archive_internal' ? 'text-white' : 'text-black'} />
                  <span className="text-[10px] uppercase tracking-tight truncate">Archived Channels ({archivedInternalCount})</span>
                </div>
              </button>
            )}
          </div>
        </ChannelSidebarSection>

        <ChannelSidebarSection
          title="Connected Practices"
          isCollapsed={connectedCollapsed}
          unreadCount={connectedUnreadCount}
          onToggle={onToggleConnected}
          action={
            <Link
              href={`${isDentist ? '/dentist' : ''}/network?tab=directory`}
              className="text-[8px] font-black uppercase underline hover:text-black"
            >
              Connect
            </Link>
          }
        >
          <div className="space-y-1">
            {onPlatformChannels.length === 0 ? (
              <p className="text-[8px] text-muted-foreground italic uppercase">No on-platform connections yet.</p>
            ) : (
              onPlatformChannels.map((channel) => {
                const practiceSubChannels = channels.filter((c) => c.parentId === channel.id && !c.isArchived);
                const practiceCases = caseChannels.filter((caseChannel) => caseChannel.practiceId === channel.id && !caseChannel.isArchived);
                const practiceArchivedCases = caseChannels.filter((caseChannel) => caseChannel.practiceId === channel.id && caseChannel.isArchived);
                return (
                  <div key={channel.id} className="space-y-0.5">
                    <ChannelItem
                      channel={channel}
                      isActive={activeChannelId === channel.id}
                      onClick={() => onSelectChannel(channel)}
                      isExpanded={!!expandedPractices[channel.id]}
                      hasSubChannels={practiceSubChannels.length > 0 || practiceCases.length > 0 || practiceArchivedCases.length > 0}
                      onCreateSubChannel={() => onCreateSubChannel(channel)}
                    />
                    {expandedPractices[channel.id] && (
                      <>
                        {practiceSubChannels.map((subChannel) => (
                          <ChannelSubRow
                            key={subChannel.id}
                            subChannel={subChannel}
                            isActive={activeChannelId === subChannel.id}
                            onSelectSubChannel={() => onSelectChannel(subChannel)}
                          />
                        ))}
                        {(() => {
                          const { unread, read } = sortCaseChannels(practiceCases);
                          return (
                            <>
                              {unread.map((caseChannel) => (
                                <ChannelCaseRow
                                  key={caseChannel.id}
                                  caseChannel={caseChannel}
                                  parentChannel={channel}
                                  isActive={activeChannelId === caseChannel.id}
                                  onSelectCaseChannel={onSelectCaseChannel}
                                />
                              ))}
                              {unread.length > 0 && read.length > 0 && (
                                <div className="border-t border-black/10 border-dashed my-1.5 ml-10 mr-3" />
                              )}
                              {read.map((caseChannel) => (
                                <ChannelCaseRow
                                  key={caseChannel.id}
                                  caseChannel={caseChannel}
                                  parentChannel={channel}
                                  isActive={activeChannelId === caseChannel.id}
                                  onSelectCaseChannel={onSelectCaseChannel}
                                />
                              ))}
                            </>
                          );
                        })()}
                        {practiceArchivedCases.length > 0 && (
                          <button
                            onClick={() => onSelectChannel({ id: 'archive_cases_' + channel.id, name: `Archived Cases - ${channel.name}`, type: 'archive_cases', parentId: channel.id, memberCount: practiceArchivedCases.length } as any)}
                            className={`w-full flex items-center justify-between py-1.5 pl-10 pr-3 text-left transition-all ${
                              activeChannelId === 'archive_cases_' + channel.id
                                ? 'bg-black text-white font-black'
                                : 'hover:bg-gray-100 text-muted-foreground hover:text-black font-bold'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <Folder size={10} className={activeChannelId === 'archive_cases_' + channel.id ? 'text-white' : 'text-black'} />
                              <span className="text-[10px] uppercase tracking-tight truncate">Archived Cases ({practiceArchivedCases.length})</span>
                            </div>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </ChannelSidebarSection>

        <ChannelSidebarSection
          title="External — Secure Email"
          isCollapsed={externalCollapsed}
          unreadCount={externalUnreadCount}
          onToggle={onToggleExternal}
        >
          <div className="space-y-1">
            {externalChannels.length === 0 ? (
              <p className="text-[8px] text-muted-foreground italic uppercase">No external connections yet.</p>
            ) : (
              externalChannels.map((channel) => {
                const practiceSubChannels = channels.filter((c) => c.parentId === channel.id && !c.isArchived);
                const practiceCases = caseChannels.filter((caseChannel) => caseChannel.practiceId === channel.id && !caseChannel.isArchived);
                const practiceArchivedCases = caseChannels.filter((caseChannel) => caseChannel.practiceId === channel.id && caseChannel.isArchived);
                return (
                  <div key={channel.id} className="space-y-0.5">
                    <ChannelItem
                      channel={channel}
                      isActive={activeChannelId === channel.id}
                      onClick={() => onSelectChannel(channel)}
                      isExpanded={!!expandedPractices[channel.id]}
                      hasSubChannels={practiceSubChannels.length > 0 || practiceCases.length > 0 || practiceArchivedCases.length > 0}
                      onCreateSubChannel={() => onCreateSubChannel(channel)}
                    />
                    {expandedPractices[channel.id] && (
                      <>
                        {practiceSubChannels.map((subChannel) => (
                          <ChannelSubRow
                            key={subChannel.id}
                            subChannel={subChannel}
                            isActive={activeChannelId === subChannel.id}
                            onSelectSubChannel={() => onSelectChannel(subChannel)}
                          />
                        ))}
                        {(() => {
                          const { unread, read } = sortCaseChannels(practiceCases);
                          return (
                            <>
                              {unread.map((caseChannel) => (
                                <ChannelCaseRow
                                  key={caseChannel.id}
                                  caseChannel={caseChannel}
                                  parentChannel={channel}
                                  isActive={activeChannelId === caseChannel.id}
                                  isExternal
                                  onSelectCaseChannel={onSelectCaseChannel}
                                />
                              ))}
                              {unread.length > 0 && read.length > 0 && (
                                <div className="border-t border-black/10 border-dashed my-1.5 ml-10 mr-3" />
                              )}
                              {read.map((caseChannel) => (
                                <ChannelCaseRow
                                  key={caseChannel.id}
                                  caseChannel={caseChannel}
                                  parentChannel={channel}
                                  isActive={activeChannelId === caseChannel.id}
                                  isExternal
                                  onSelectCaseChannel={onSelectCaseChannel}
                                />
                              ))}
                            </>
                          );
                        })()}
                        {practiceArchivedCases.length > 0 && (
                          <button
                            onClick={() => onSelectChannel({ id: 'archive_cases_' + channel.id, name: `Archived Cases - ${channel.name}`, type: 'archive_cases', parentId: channel.id, memberCount: practiceArchivedCases.length } as any)}
                            className={`w-full flex items-center justify-between py-1.5 pl-10 pr-3 text-left transition-all ${
                              activeChannelId === 'archive_cases_' + channel.id
                                ? 'bg-black text-white font-black'
                                : 'hover:bg-gray-100 text-muted-foreground hover:text-black font-bold'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <Folder size={10} className={activeChannelId === 'archive_cases_' + channel.id ? 'text-white' : 'text-black'} />
                              <span className="text-[10px] uppercase tracking-tight truncate">Archived Cases ({practiceArchivedCases.length})</span>
                            </div>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </ChannelSidebarSection>

        <ChannelSidebarSection
          title="Group Chats"
          isCollapsed={groupCollapsed}
          unreadCount={groupUnreadCount}
          onToggle={onToggleGroup}
          action={
            <button
              type="button"
              onClick={onCreateGroup}
              className="text-[8px] font-black uppercase underline hover:text-black"
            >
              Create +
            </button>
          }
        >
          <div className="space-y-1">
            {groupChannels.length === 0 && archivedGroupCount === 0 ? (
              <p className="text-[8px] text-muted-foreground italic uppercase">No group chats yet.</p>
            ) : (
              (() => {
                const { unread, read } = sortChannels(groupChannels);
                return (
                  <>
                    {unread.map((channel) => (
                      <ChannelItem
                        key={channel.id}
                        channel={channel}
                        isActive={activeChannelId === channel.id}
                        onClick={() => onSelectChannel(channel)}
                      />
                    ))}
                    {unread.length > 0 && read.length > 0 && (
                      <div className="border-t border-black/10 border-dashed my-1.5" />
                    )}
                    {read.map((channel) => (
                      <ChannelItem
                        key={channel.id}
                        channel={channel}
                        isActive={activeChannelId === channel.id}
                        onClick={() => onSelectChannel(channel)}
                      />
                    ))}
                  </>
                );
              })()
            )}
            {archivedGroupCount > 0 && (
              <button
                onClick={() => onSelectChannel({ id: 'archive_group', name: 'Archived Groups', type: 'archive_group', memberCount: archivedGroupCount } as any)}
                className={`w-full flex items-center justify-between py-1.5 px-3 text-left transition-all ${
                  activeChannelId === 'archive_group'
                    ? 'bg-black text-white font-black'
                    : 'hover:bg-gray-100 text-muted-foreground hover:text-black font-bold'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Folder size={12} className={activeChannelId === 'archive_group' ? 'text-white' : 'text-black'} />
                  <span className="text-[10px] uppercase tracking-tight truncate">Archived Groups ({archivedGroupCount})</span>
                </div>
              </button>
            )}
          </div>
        </ChannelSidebarSection>

        <ChannelSidebarSection
          title="Patient Comm (SMS/Email)"
          isCollapsed={patientCollapsed}
          unreadCount={patientUnreadCount}
          onToggle={onTogglePatient}
        >
          <>
            <div className="p-3 bg-gray-50 border border-black border-dashed">
              <p className="text-[7px] font-bold uppercase leading-relaxed text-muted-foreground italic">
                Tip: Patient channels are automatically created once you process a referral and initiate external communication.
              </p>
            </div>

            <div className="space-y-1">
              {patientChannels.map((channel) => (
                <ChannelItem
                  key={channel.id}
                  channel={channel}
                  isActive={activeChannelId === channel.id}
                  onClick={() => onSelectChannel(channel)}
                />
              ))}
            </div>
          </>
        </ChannelSidebarSection>
      </div>
    </div>
  );
}
