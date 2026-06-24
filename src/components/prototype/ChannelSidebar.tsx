"use client";

import Link from 'next/link';
import { FileText, MoreHorizontal, Search } from 'lucide-react';
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
  onSelectChannel: (channel: Channel) => void;
  onSelectCaseChannel: (caseChannel: ChannelCaseSummary, parentChannel: Channel) => void;
};

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
      className={`w-full flex items-center gap-2 py-1.5 pl-10 text-left transition-all ${
        isActive
          ? 'bg-black text-white font-black'
          : 'hover:bg-gray-100 text-muted-foreground hover:text-black font-bold'
      }`}
    >
      <FileText size={10} className={isActive ? 'text-white' : 'text-black'} />
      <span className="text-[10px] uppercase tracking-tight">{caseChannel.name}</span>
      {isExternal && <span className="sr-only">External secure email</span>}
    </button>
  );
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
  onSelectChannel,
  onSelectCaseChannel,
}: ChannelSidebarProps) {
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
            {internalChannels.map((channel) => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                isActive={activeChannelId === channel.id}
                onClick={() => onSelectChannel(channel)}
              />
            ))}
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
                const practiceCases = caseChannels.filter((caseChannel) => caseChannel.practiceId === channel.id && !caseChannel.isArchived);
                return (
                  <div key={channel.id} className="space-y-0.5">
                    <ChannelItem
                      channel={channel}
                      isActive={activeChannelId === channel.id}
                      onClick={() => onSelectChannel(channel)}
                      isExpanded={!!expandedPractices[channel.id]}
                      hasSubChannels={practiceCases.length > 0}
                    />
                    {expandedPractices[channel.id] && practiceCases.map((caseChannel) => (
                      <ChannelCaseRow
                        key={caseChannel.id}
                        caseChannel={caseChannel}
                        parentChannel={channel}
                        isActive={activeChannelId === caseChannel.id}
                        onSelectCaseChannel={onSelectCaseChannel}
                      />
                    ))}
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
                const practiceCases = caseChannels.filter((caseChannel) => caseChannel.practiceId === channel.id && !caseChannel.isArchived);
                return (
                  <div key={channel.id} className="space-y-0.5">
                    <ChannelItem
                      channel={channel}
                      isActive={activeChannelId === channel.id}
                      onClick={() => onSelectChannel(channel)}
                      isExpanded={!!expandedPractices[channel.id]}
                      hasSubChannels={practiceCases.length > 0}
                    />
                    {expandedPractices[channel.id] && practiceCases.map((caseChannel) => (
                      <ChannelCaseRow
                        key={caseChannel.id}
                        caseChannel={caseChannel}
                        parentChannel={channel}
                        isActive={activeChannelId === caseChannel.id}
                        isExternal
                        onSelectCaseChannel={onSelectCaseChannel}
                      />
                    ))}
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
            {groupChannels.length === 0 ? (
              <p className="text-[8px] text-muted-foreground italic uppercase">No group chats yet.</p>
            ) : (
              groupChannels.map((channel) => (
                <ChannelItem
                  key={channel.id}
                  channel={channel}
                  isActive={activeChannelId === channel.id}
                  onClick={() => onSelectChannel(channel)}
                />
              ))
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
