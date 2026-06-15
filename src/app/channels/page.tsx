"use client";

import React, { Suspense } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { useSubscription } from '@/components/SubscriptionContext';
import { ChannelContentPane } from '@/components/prototype/ChannelContentPane';
import { ChannelDocumentPreviewOverlay } from '@/components/prototype/ChannelDocumentPreviewOverlay';
import { ChannelGroupModal } from '@/components/prototype/ChannelGroupModal';
import { ChannelParticipantsModal } from '@/components/prototype/ChannelParticipantsModal';
import { ChannelCaseSummary, ChannelSidebar } from '@/components/prototype/ChannelSidebar';
import type { Channel } from '@/prototype/channelTypes';
import { usePrototypeChannelsState } from '@/prototype/usePrototypeChannelsState';

function ChannelsContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDentist = pathname.startsWith('/dentist');
  const { isTrialEnded, setShowPaywall } = useSubscription();

  const channelsState = usePrototypeChannelsState({
    isDentist,
    practiceParam: searchParams.get('practice'),
    caseIdParam: searchParams.get('caseId'),
    tabParam: searchParams.get('tab'),
    isTrialEnded,
    onPaywall: () => setShowPaywall(true),
    onNavigate: (href) => router.push(href),
  });

  const handleSelectCaseChannel = (caseChannel: ChannelCaseSummary, parentChannel: Channel) => {
    channelsState.handleSelectChannel({
      id: caseChannel.id,
      name: caseChannel.name,
      type: 'inter-practice',
      lastMessage: caseChannel.lastMessage,
      memberCount: parentChannel.memberCount,
      ...(caseChannel.isExternal ? { isExternal: true } : {}),
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
      {channelsState.toastMessage && (
        <div className="absolute top-20 right-6 z-50 bg-black text-white border-2 border-white px-4 py-2 font-bold uppercase text-[9px] tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fade-in">
          {channelsState.toastMessage}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <ChannelSidebar
          isDentist={isDentist}
          showChannelList={channelsState.showChannelList}
          searchQuery={channelsState.sidebarSearchQuery}
          activeChannelId={channelsState.activeChannel.id}
          internalCollapsed={channelsState.internalCollapsed}
          connectedCollapsed={channelsState.connectedCollapsed}
          externalCollapsed={channelsState.externalCollapsed}
          groupCollapsed={channelsState.groupCollapsed}
          patientCollapsed={channelsState.patientCollapsed}
          internalUnreadCount={channelsState.internalUnreadCount}
          connectedUnreadCount={channelsState.connectedUnreadCount}
          externalUnreadCount={channelsState.externalUnreadCount}
          groupUnreadCount={channelsState.groupUnreadCount}
          patientUnreadCount={channelsState.patientUnreadCount}
          expandedPractices={channelsState.expandedPractices}
          internalChannels={channelsState.filteredInternalChannels}
          onPlatformChannels={channelsState.filteredOnPlatformChannels}
          externalChannels={channelsState.filteredExternalChannels}
          groupChannels={channelsState.filteredGroupChannels}
          patientChannels={channelsState.filteredPatientChannels}
          caseChannels={channelsState.filteredCaseChannels}
          onCloseMobile={() => channelsState.setShowChannelList(false)}
          onSearchQueryChange={channelsState.setSidebarSearchQuery}
          onToggleInternal={() => channelsState.setInternalCollapsed(!channelsState.internalCollapsed)}
          onToggleConnected={() => channelsState.setConnectedCollapsed(!channelsState.connectedCollapsed)}
          onToggleExternal={() => channelsState.setExternalCollapsed(!channelsState.externalCollapsed)}
          onToggleGroup={() => channelsState.setGroupCollapsed(!channelsState.groupCollapsed)}
          onTogglePatient={() => channelsState.setPatientCollapsed(!channelsState.patientCollapsed)}
          onCreateGroup={() => channelsState.setShowCreateGroupModal(true)}
          onSelectChannel={channelsState.handleSelectChannel}
          onSelectCaseChannel={handleSelectCaseChannel}
        />

        <ChannelContentPane
          activeChannel={channelsState.activeChannel}
          isDentist={isDentist}
          activeTab={channelsState.activeTab}
          messages={channelsState.messages[channelsState.activeChannel.id] || []}
          archivedConversations={channelsState.caseChannels.filter((caseChannel) => caseChannel.practiceId === channelsState.activeChannel.id && caseChannel.isArchived)}
          inputText={channelsState.inputText}
          attachedDocument={channelsState.attachedDoc}
          showAttachmentDrawer={channelsState.showAttachmentDrawer}
          attachmentOptions={channelsState.mockAttachments}
          documents={channelsState.paginatedDocuments}
          totalDocumentCount={channelsState.filteredDocuments.length}
          docSearchQuery={channelsState.docSearchQuery}
          currentDocPage={channelsState.docPage}
          totalDocPages={channelsState.totalDocPages}
          onActiveTabChange={channelsState.setActiveTab}
          onShowChannelList={() => channelsState.setShowChannelList(true)}
          onBackToPractice={channelsState.onBackToPractice}
          onArchiveCase={channelsState.onArchiveCase}
          onOpenParticipants={() => channelsState.setShowParticipantsModal(true)}
          onReactivateArchived={channelsState.onReactivateArchived}
          onInputChange={channelsState.setInputText}
          onToggleAttachmentDrawer={() => channelsState.setShowAttachmentDrawer(!channelsState.showAttachmentDrawer)}
          onAttachNew={channelsState.onAttachNew}
          onAttachRecent={(file) => {
            channelsState.setAttachedDoc({ name: file.name, size: file.size, type: file.type });
            channelsState.setShowAttachmentDrawer(false);
            channelsState.triggerToast(`Attached ${file.name}!`);
          }}
          onCloseAttachmentDrawer={() => channelsState.setShowAttachmentDrawer(false)}
          onRemoveAttachment={() => channelsState.setAttachedDoc(null)}
          onSendMessage={channelsState.handleSendMessage}
          onDocSearchQueryChange={channelsState.setDocSearchQuery}
          onClearDocSearch={() => channelsState.setDocSearchQuery('')}
          onSendNewDocument={channelsState.onSendNewDocument}
          onViewDocument={channelsState.setPreviewDocument}
          onDownloadDocument={(document) => channelsState.triggerToast(`Downloading "${document.name}"...`)}
          onDocPageChange={channelsState.setDocPage}
          formatMessage={channelsState.formatMessage}
          formatDocumentSender={channelsState.formatDocumentSender}
        />
      </div>

      {channelsState.previewDocument && (
        <ChannelDocumentPreviewOverlay
          document={channelsState.previewDocument}
          activePracticeName={channelsState.activeChannel.name}
          onClose={() => channelsState.setPreviewDocument(null)}
          onDownload={(document) => {
            channelsState.setPreviewDocument(null);
            channelsState.triggerToast(`Downloading "${document.name}"...`);
          }}
        />
      )}

      {channelsState.showCreateGroupModal && (
        <ChannelGroupModal
          groupChatName={channelsState.groupChatName}
          participants={channelsState.groupParticipants}
          error={channelsState.groupChatError}
          onGroupChatNameChange={(name) => {
            channelsState.setGroupChatName(name);
            channelsState.setGroupChatError(null);
          }}
          onParticipantToggle={channelsState.onToggleGroupParticipant}
          onPracticeToggle={channelsState.onToggleGroupPractice}
          onCancel={channelsState.onCancelCreateGroup}
          onCreate={channelsState.handleCreateGroupChat}
        />
      )}

      {channelsState.showParticipantsModal && (
        <ChannelParticipantsModal
          participants={channelsState.participants}
          onParticipantToggle={channelsState.onToggleParticipant}
          onClose={() => channelsState.setShowParticipantsModal(false)}
        />
      )}
    </div>
  );
}

export default function ChannelsPage() {
  return (
    <MainLayout title="Communication" noPadding>
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center bg-white">
          <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Loading channels...</p>
        </div>
      }>
        <ChannelsContent />
      </Suspense>
    </MainLayout>
  );
}
