"use client";

import type { Channel, MessageItem, SharedDocument } from '@/prototype/channelTypes';
import type { AttachmentOption } from '@/components/prototype/ChannelAttachmentControls';
import type { ChannelCaseSummary } from '@/components/prototype/ChannelSidebar';
import type { ReferralStatus } from '@/lib/referrals';
import { ChannelArchivedConversations } from '@/components/prototype/ChannelArchivedConversations';
import { ChannelConversationHeader } from '@/components/prototype/ChannelConversationHeader';
import { ChannelDocumentsPane } from '@/components/prototype/ChannelDocumentsPane';
import { ChannelMessageComposer } from '@/components/prototype/ChannelMessageComposer';
import { Message } from '@/components/prototype/ChannelPrimitives';

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
}: ChannelContentPaneProps) {
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
                        user={mapped.user}
                        text={message.text}
                        time={message.time}
                        type={mapped.type}
                        transport={message.transport}
                        hideHeader={!!isGrouped}
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
            />
          )}
        </>
      )}
    </div>
  );
}
