"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { Channel, MessageItem, SharedDocument } from '@/prototype/channelTypes';
import type { AttachmentOption } from '@/components/prototype/ChannelAttachmentControls';
import type { ChannelCaseSummary } from '@/components/prototype/ChannelSidebar';
import type { ReferralStatus } from '@/lib/referrals';
import { ChannelArchivedConversations } from '@/components/prototype/ChannelArchivedConversations';
import { ChannelConversationHeader } from '@/components/prototype/ChannelConversationHeader';
import { ChannelDocumentsPane } from '@/components/prototype/ChannelDocumentsPane';
import { ChannelMessageComposer } from '@/components/prototype/ChannelMessageComposer';
import { Message } from '@/components/prototype/ChannelPrimitives';
import { Pin, MoreHorizontal } from 'lucide-react';

type MessageDisplay = {
  type: MessageItem['type'];
  user: string;
};

type ChannelContentPaneProps = {
  activeChannel: Channel;
  isDentist: boolean;
  activeTab: 'messages' | 'documents' | 'archived';
  messages: MessageItem[];
  archivedConversations: ChannelCaseSummary[];
  inputText: string;
  attachedDocument: { name: string; size: string; type: 'pdf' | 'image' | 'zip' | 'doc' } | null;
  showAttachmentDrawer: boolean;
  attachmentOptions: AttachmentOption[];
  documents: SharedDocument[];
  totalDocumentCount: number;
  docSearchQuery: string;
  currentDocPage: number;
  totalDocPages: number;
  onActiveTabChange: (tab: 'messages' | 'documents' | 'archived') => void;
  onShowChannelList: () => void;
  onBackToPractice: () => void;
  onArchiveCase: () => void;
  onOpenParticipants: () => void;
  onReactivateArchived: (conversationId: string) => void;
  onInputChange: (value: string) => void;
  onToggleAttachmentDrawer: () => void;
  onAttachNew: () => void;
  onAttachRecent: (file: AttachmentOption) => void;
  onCloseAttachmentDrawer: () => void;
  onRemoveAttachment: () => void;
  onSendMessage: () => void;
  onDocSearchQueryChange: (query: string) => void;
  onClearDocSearch: () => void;
  onSendNewDocument: () => void;
  onViewDocument: (document: SharedDocument) => void;
  onDownloadDocument: (document: SharedDocument) => void;
  onDocPageChange: (page: number) => void;
  formatMessage: (message: MessageItem) => MessageDisplay;
  formatDocumentSender: (sentBy: string) => string;
  referralStatus?: ReferralStatus;
  onArchiveDocument?: (document: SharedDocument) => void;
  onUnarchiveDocument?: (document: SharedDocument) => void;
  onViewArchivedDocuments?: () => void;
  isViewingArchivedDocs?: boolean;
  onForwardDocument?: (document: SharedDocument) => void;
  onToggleReaction?: (messageId: string, emoji: string) => void;
  onReplyMessage?: (id: string) => void;
  onForwardMessage?: (id: string) => void;
  onPinMessage?: (id: string) => void;
  onCopyMessage?: (id: string) => void;
  onDeleteMessage?: (id: string) => void;
  pinnedMessages?: string[];
  replyingToMessage?: MessageItem | null;
  onCancelReply?: () => void;
};

export function ChannelContentPane({
  activeChannel,
  isDentist,
  activeTab,
  messages,
  archivedConversations,
  inputText,
  attachedDocument,
  showAttachmentDrawer,
  attachmentOptions,
  documents,
  totalDocumentCount,
  docSearchQuery,
  currentDocPage,
  totalDocPages,
  onActiveTabChange,
  onShowChannelList,
  onBackToPractice,
  onArchiveCase,
  onOpenParticipants,
  onReactivateArchived,
  onInputChange,
  onToggleAttachmentDrawer,
  onAttachNew,
  onAttachRecent,
  onCloseAttachmentDrawer,
  onRemoveAttachment,
  onSendMessage,
  onDocSearchQueryChange,
  onClearDocSearch,
  onSendNewDocument,
  onViewDocument,
  onDownloadDocument,
  onDocPageChange,
  formatMessage,
  formatDocumentSender,
  referralStatus,
  onArchiveDocument,
  onUnarchiveDocument,
  onViewArchivedDocuments,
  isViewingArchivedDocs,
  onForwardDocument,
  onToggleReaction,
  onReplyMessage = () => {},
  onForwardMessage = () => {},
  onPinMessage = () => {},
  onCopyMessage = () => {},
  onDeleteMessage = () => {},
  pinnedMessages = [],
  replyingToMessage = null,
  onCancelReply = () => {},
}: ChannelContentPaneProps) {
  const [showPinnedMenu, setShowPinnedMenu] = useState(false);
  const pinnedMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pinnedMenuRef.current && !pinnedMenuRef.current.contains(event.target as Node)) {
        setShowPinnedMenu(false);
      }
    }
    if (showPinnedMenu && typeof window !== 'undefined') {
      window.document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [showPinnedMenu]);

  const shouldShowArchived = activeTab === 'archived' && (
    (activeChannel.type === 'inter-practice' && !activeChannel.id.startsWith('case_')) ||
    activeChannel.type === 'internal'
  );

  return (
    <div className="flex-1 flex flex-col bg-gray-50 relative">
      <ChannelConversationHeader
        activeChannel={activeChannel}
        isDentist={isDentist}
        activeTab={activeTab}
        onActiveTabChange={onActiveTabChange}
        onShowChannelList={onShowChannelList}
        onBackToPractice={onBackToPractice}
        onArchiveCase={onArchiveCase}
        onOpenParticipants={onOpenParticipants}
        referralStatus={referralStatus}
      />

      {(() => {
        const activeChannelPinnedMessages = messages.filter((m) => pinnedMessages.includes(m.id));
        if (activeChannelPinnedMessages.length === 0) return null;
        const latestPinned = activeChannelPinnedMessages[activeChannelPinnedMessages.length - 1];
        return (
          <div className="bg-white border-b-2 border-black px-6 py-2 flex items-center justify-between gap-4 shrink-0 text-black animate-fade-in">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Pin size={12} className="fill-current text-black shrink-0" />
              <div className="text-[10px] font-bold truncate">
                <span className="uppercase font-black text-muted-foreground mr-1.5">Pinned:</span>
                &quot;{latestPinned.text}&quot;
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {activeChannelPinnedMessages.length > 1 && (
                <span className="text-[8px] bg-black text-white px-1.5 py-0.5 font-black">
                  +{activeChannelPinnedMessages.length - 1} MORE
                </span>
              )}
              <div className="relative" ref={pinnedMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowPinnedMenu(!showPinnedMenu)}
                  className="text-black hover:text-gray-600 flex items-center justify-center p-1"
                  title="Pinned Message Actions"
                >
                  <MoreHorizontal size={14} />
                </button>
                {showPinnedMenu && (
                  <div className="absolute right-0 top-full mt-1 z-50 bg-white border-2 border-black py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-20 uppercase text-[8px] font-black text-black">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPinnedMenu(false);
                        onPinMessage(latestPinned.id);
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-black hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Pin size={10} />
                      <span>Unpin</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {shouldShowArchived ? (
        <ChannelArchivedConversations
          conversations={archivedConversations}
          onReactivate={onReactivateArchived}
          isInternal={activeChannel.type === 'internal'}
        />
      ) : (
        <>
          {activeTab === 'messages' ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="max-w-4xl mx-auto w-full space-y-6">
                   {messages.map((message, index) => {
                    const mapped = formatMessage(message);
                    const prevMessage = index > 0 ? messages[index - 1] : null;
                    const prevMapped = prevMessage ? formatMessage(prevMessage) : null;
                    const isGrouped = prevMapped && (
                      (mapped.type === 'self' && prevMapped.type === 'self') ||
                      (mapped.type !== 'self' && prevMapped.type !== 'self' && mapped.user === prevMapped.user)
                    );
                    return (
                      <Message
                        key={message.id}
                        id={message.id}
                        user={mapped.user}
                        text={message.text}
                        time={message.time}
                        type={mapped.type}
                        transport={message.transport}
                        hideHeader={!!isGrouped}
                        reactions={message.reactions}
                        onToggleReaction={onToggleReaction}
                        onReply={onReplyMessage}
                        onForward={onForwardMessage}
                        onPin={onPinMessage}
                        onCopy={onCopyMessage}
                        onDelete={onDeleteMessage}
                        isPinned={pinnedMessages.includes(message.id)}
                        document={message.document ? {
                          ...message.document,
                          sentBy: formatDocumentSender(message.document.sentBy),
                        } : undefined}
                      />
                    );
                  })}
                  {activeChannel.isVerified === false && (
                    <div className="flex justify-center p-4">
                      <div className="bg-gray-100 border border-black border-dashed p-4 max-w-sm text-center">
                        <p className="text-[10px] font-bold uppercase italic text-muted-foreground">
                          Note: This practice is unverified. Patient PHI sharing is restricted until the practice owner completes verification.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-center">
                    <span className="text-[8px] font-bold uppercase bg-gray-200 px-3 py-1 text-muted-foreground">End of history</span>
                  </div>
                </div>
              </div>

              <ChannelMessageComposer
                activeChannel={activeChannel}
                inputText={inputText}
                attachedDocument={attachedDocument}
                showAttachmentDrawer={showAttachmentDrawer}
                attachmentOptions={attachmentOptions}
                onInputChange={onInputChange}
                onToggleAttachmentDrawer={onToggleAttachmentDrawer}
                onAttachNew={onAttachNew}
                onAttachRecent={onAttachRecent}
                onCloseAttachmentDrawer={onCloseAttachmentDrawer}
                onRemoveAttachment={onRemoveAttachment}
                onSendMessage={onSendMessage}
                replyingToMessage={replyingToMessage}
                onCancelReply={onCancelReply}
              />
            </>
          ) : (
            <ChannelDocumentsPane
              documents={documents}
              totalDocumentCount={totalDocumentCount}
              searchQuery={docSearchQuery}
              onSearchQueryChange={onDocSearchQueryChange}
              onClearSearch={onClearDocSearch}
              onSendNewDocument={onSendNewDocument}
              onViewDocument={onViewDocument}
              onDownloadDocument={onDownloadDocument}
              formatSender={formatDocumentSender}
              currentPage={currentDocPage}
              totalPages={totalDocPages}
              onPageChange={onDocPageChange}
              onArchiveDocument={activeChannel.type === 'inter-practice' ? onArchiveDocument : undefined}
              onUnarchiveDocument={activeChannel.type === 'inter-practice' ? onUnarchiveDocument : undefined}
              onViewArchivedDocuments={activeChannel.type === 'inter-practice' ? onViewArchivedDocuments : undefined}
              isViewingArchivedDocs={isViewingArchivedDocs}
              onForwardDocument={onForwardDocument}
            />
          )}
        </>
      )}
    </div>
  );
}
