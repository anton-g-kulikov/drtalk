import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DashboardStats } from '@/components/prototype/DashboardStats';
import { DashboardActionCard } from '@/components/prototype/DashboardActionCard';
import { PrototypeToast } from '@/components/prototype/PrototypeToast';
import { PrototypeDocumentSection } from '@/components/prototype/PrototypeDocumentSection';
import { ChannelArchivedConversations } from '@/components/prototype/ChannelArchivedConversations';
import { ChannelContentPane } from '@/components/prototype/ChannelContentPane';
import { ChannelConversationHeader } from '@/components/prototype/ChannelConversationHeader';
import { ChannelDocumentsPane } from '@/components/prototype/ChannelDocumentsPane';
import { ChannelMessageComposer } from '@/components/prototype/ChannelMessageComposer';
import { ChannelItem, Message } from '@/components/prototype/ChannelPrimitives';
import { ChannelSidebar } from '@/components/prototype/ChannelSidebar';
import { ChannelSidebarSection } from '@/components/prototype/ChannelSidebarSection';
import { AttachedDocumentPreview, ChannelAttachmentDrawer } from '@/components/prototype/ChannelAttachmentControls';
import { ChannelDocumentPreviewOverlay } from '@/components/prototype/ChannelDocumentPreviewOverlay';
import { ChannelGroupModal } from '@/components/prototype/ChannelGroupModal';
import { ChannelParticipantsModal } from '@/components/prototype/ChannelParticipantsModal';
import { DashboardDocumentActionModals } from '@/components/prototype/DashboardDocumentActionModals';
import { DashboardDocumentRow } from '@/components/prototype/DashboardDocumentRow';
import { DashboardSidebarList } from '@/components/prototype/DashboardSidebarList';
import { DentistSentReferralsSection } from '@/components/prototype/DentistSentReferralsSection';
import { DentistDashboardHeader } from '@/components/prototype/DentistDashboardHeader';
import { GuestReferralAttachmentsStep } from '@/components/prototype/GuestReferralAttachmentsStep';
import { GuestReferralPracticeSelector } from '@/components/prototype/GuestReferralPracticeSelector';
import { SendDocumentPatientFields } from '@/components/prototype/SendDocumentPatientFields';
import { SendDocumentPracticeSelector } from '@/components/prototype/SendDocumentPracticeSelector';
import { SendDocumentReferralSelector } from '@/components/prototype/SendDocumentReferralSelector';
import { SendDocumentUploadSection } from '@/components/prototype/SendDocumentUploadSection';
import { SpecialistDashboardHeader } from '@/components/prototype/SpecialistDashboardHeader';
import { SpecialistReferralQueues } from '@/components/prototype/SpecialistReferralQueues';
import { ReferralPipelineControls } from '@/components/prototype/ReferralPipelineControls';
import { FileText } from 'lucide-react';


describe('prototype components: channels.test', () => {
  it('renders channel items with unread and external state', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <ChannelItem
        channel={{
          id: 'ext-1',
          name: 'Pinecrest Dental Group',
          type: 'inter-practice',
          lastMessage: 'Practice channel created.',
          memberCount: 2,
          unreadCount: 3,
          isExternal: true,
          isVerified: false,
        }}
        isActive={false}
        onClick={onClick}
        hasSubChannels
        isExpanded={false}
      />
    );

    await user.click(screen.getByRole('button', { name: /pinecrest dental group/i }));

    expect(screen.getByText(/secure email/i)).toBeInTheDocument();
    expect(screen.getByText(/unverified/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders channel sidebar sections with collapse, unread, and action states', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onAction = vi.fn();
    const { rerender } = render(
      <ChannelSidebarSection
        title="Internal Communication"
        isCollapsed={false}
        unreadCount={2}
        onToggle={onToggle}
        action={<button onClick={onAction}>Create +</button>}
      >
        <p>Team channel row</p>
      </ChannelSidebarSection>
    );

    expect(screen.getByText(/internal communication/i)).toBeInTheDocument();
    expect(screen.getByText(/team channel row/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /internal communication/i }));
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledTimes(1);

    rerender(
      <ChannelSidebarSection
        title="Internal Communication"
        isCollapsed
        unreadCount={2}
        onToggle={onToggle}
      >
        <p>Team channel row</p>
      </ChannelSidebarSection>
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.queryByText(/team channel row/i)).not.toBeInTheDocument();
  });

  it('renders full channel sidebar with search, case rows, role links, and actions', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSearchChange = vi.fn();
    const onToggleInternal = vi.fn();
    const onToggleConnected = vi.fn();
    const onToggleExternal = vi.fn();
    const onToggleGroup = vi.fn();
    const onTogglePatient = vi.fn();
    const onCreateGroup = vi.fn();
    const onSelectChannel = vi.fn();
    const onSelectCaseChannel = vi.fn();

    render(
      <ChannelSidebar
        isDentist
        showChannelList
        searchQuery="alice"
        activeChannelId="case_1"
        internalCollapsed={false}
        connectedCollapsed={false}
        externalCollapsed={false}
        groupCollapsed={false}
        patientCollapsed={false}
        internalUnreadCount={1}
        connectedUnreadCount={2}
        externalUnreadCount={3}
        groupUnreadCount={4}
        patientUnreadCount={5}
        expandedPractices={{ connected: true, external: true }}
        showCommentMarker={false}
        internalChannels={[
          { id: 'internal', name: 'Team Huddle', type: 'internal', lastMessage: 'Morning sync', memberCount: 3 },
        ]}
        onPlatformChannels={[
          { id: 'connected', name: 'Valley Endodontics', type: 'inter-practice', lastMessage: 'Case update', memberCount: 4 },
        ]}
        externalChannels={[
          { id: 'external', name: 'Pinecrest Dental', type: 'inter-practice', lastMessage: 'Secure email received', memberCount: 2, isExternal: true },
        ]}
        groupChannels={[
          { id: 'group', name: 'Study Club', type: 'group', lastMessage: 'Agenda posted', memberCount: 5 },
        ]}
        patientChannels={[
          { id: 'patient', name: 'Alice Patient', type: 'patient', lastMessage: 'Reminder sent', memberCount: 1 },
        ]}
        caseChannels={[
          { id: 'case_1', name: 'ALICE COOPER', patientName: 'Alice Cooper', referralId: '1', practiceId: 'connected', isArchived: false, lastMessage: 'Referral status: Scheduled' },
          { id: 'case_2', name: 'BOB SMITH', patientName: 'Bob Smith', referralId: '2', practiceId: 'external', isArchived: false, isExternal: true, lastMessage: 'Referral status: Accepted' },
        ]}
        onCloseMobile={onClose}
        onSearchQueryChange={onSearchChange}
        onToggleInternal={onToggleInternal}
        onToggleConnected={onToggleConnected}
        onToggleExternal={onToggleExternal}
        onToggleGroup={onToggleGroup}
        onTogglePatient={onTogglePatient}
        onCreateGroup={onCreateGroup}
        onCreateInternalChannel={vi.fn()}
        onSelectChannel={onSelectChannel}
        onSelectCaseChannel={onSelectCaseChannel}
      />
    );

    expect(screen.getByRole('heading', { name: /communication/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue(/alice/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /connect/i })).toHaveAttribute('href', '/dentist/network?tab=directory');
    expect(screen.getByText(/alice cooper/i)).toBeInTheDocument();
    expect(screen.getByText(/bob smith/i)).toBeInTheDocument();
    expect(screen.getByText(/tip: patient channels/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close channel list/i }));
    await user.type(screen.getByPlaceholderText(/search conversations/i), ' updated');
    await user.click(screen.getByRole('button', { name: /clear/i }));
    await user.click(screen.getByRole('button', { name: /internal communication/i }));
    await user.click(screen.getByRole('button', { name: /connected practices/i }));
    await user.click(screen.getByRole('button', { name: /^external — secure email/i }));
    await user.click(screen.getByRole('button', { name: /group chats/i }));
    await user.click(screen.getByRole('button', { name: /patient comm/i }));
    await user.click(screen.getAllByRole('button', { name: /Create \+/ })[1]);
    await user.click(screen.getByRole('button', { name: /team huddle/i }));
    await user.click(screen.getByRole('button', { name: /alice cooper/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSearchChange).toHaveBeenCalled();
    expect(onSearchChange).toHaveBeenCalledWith('');
    expect(onToggleInternal).toHaveBeenCalledTimes(1);
    expect(onToggleConnected).toHaveBeenCalledTimes(1);
    expect(onToggleExternal).toHaveBeenCalledTimes(1);
    expect(onToggleGroup).toHaveBeenCalledTimes(1);
    expect(onTogglePatient).toHaveBeenCalledTimes(1);
    expect(onCreateGroup).toHaveBeenCalledTimes(1);
    expect(onSelectChannel).toHaveBeenCalledWith(expect.objectContaining({ id: 'internal' }));
    expect(onSelectCaseChannel).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'case_1' }),
      expect.objectContaining({ id: 'connected' })
    );
  });

  it('renders channel content pane with messages, archived, composer, and documents states', async () => {
    const user = userEvent.setup();
    const onActiveTabChange = vi.fn();
    const onShowChannelList = vi.fn();
    const onBackToPractice = vi.fn();
    const onArchiveCase = vi.fn();
    const onOpenParticipants = vi.fn();
    const onReactivateArchived = vi.fn();
    const onInputChange = vi.fn();
    const onToggleAttachmentDrawer = vi.fn();
    const onAttachNew = vi.fn();
    const onAttachRecent = vi.fn();
    const onCloseAttachmentDrawer = vi.fn();
    const onRemoveAttachment = vi.fn();
    const onSendMessage = vi.fn();
    const onDocSearchChange = vi.fn();
    const onClearDocSearch = vi.fn();
    const onSendNewDocument = vi.fn();
    const onViewDocument = vi.fn();
    const onDownloadDocument = vi.fn();
    const onDocPageChange = vi.fn();

    const activeChannel = {
      id: 'case_1',
      name: 'ALICE COOPER',
      type: 'inter-practice' as const,
      lastMessage: 'Referral status: Scheduled',
      memberCount: 4,
      isVerified: false,
    };

    const { rerender } = render(
      <ChannelContentPane
        activeChannel={activeChannel}
        isDentist={false}
        activeTab="messages"
        messages={[
          { id: 'm1', user: 'Me', text: 'Please review.', time: '9:00 AM', type: 'self' },
        ]}
        archivedConversations={[]}
        inputText="hello"
        attachedDocument={null}
        showAttachmentDrawer
        attachmentOptions={[{ name: 'scan.pdf', size: '2 MB', type: 'pdf' }]}
        documents={[]}
        totalDocumentCount={0}
        docSearchQuery=""
        currentDocPage={1}
        totalDocPages={1}
        onActiveTabChange={onActiveTabChange}
        onShowChannelList={onShowChannelList}
        onBackToPractice={onBackToPractice}
        onArchiveCase={onArchiveCase}
        onOpenParticipants={onOpenParticipants}
        onReactivateArchived={onReactivateArchived}
        onInputChange={onInputChange}
        onToggleAttachmentDrawer={onToggleAttachmentDrawer}
        onAttachNew={onAttachNew}
        onAttachRecent={onAttachRecent}
        onCloseAttachmentDrawer={onCloseAttachmentDrawer}
        onRemoveAttachment={onRemoveAttachment}
        onSendMessage={onSendMessage}
        onDocSearchQueryChange={onDocSearchChange}
        onClearDocSearch={onClearDocSearch}
        onSendNewDocument={onSendNewDocument}
        onViewDocument={onViewDocument}
        onDownloadDocument={onDownloadDocument}
        onDocPageChange={onDocPageChange}
        formatMessage={(message) => ({ type: message.type, user: message.user })}
        formatDocumentSender={(sender) => sender}
      />
    );

    expect(screen.getByRole('heading', { name: /alice cooper/i })).toBeInTheDocument();
    expect(screen.getByText(/please review/i)).toBeInTheDocument();
    expect(screen.getByText(/phi sharing is restricted/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /documents/i }));
    await user.click(screen.getByRole('button', { name: /more options/i }));
    await user.click(screen.getByRole('button', { name: /participants/i }));
    await user.click(screen.getByTitle(/back to practice dashboard/i));
    await user.click(screen.getByRole('button', { name: /more options/i }));
    await user.click(screen.getByRole('button', { name: /archive channel/i }));
    await user.type(screen.getByPlaceholderText(/message #alice cooper/i), ' updated');
    await user.click(screen.getByRole('button', { name: /attach document/i }));
    await user.click(screen.getByText(/scan.pdf/i));
    await user.click(screen.getByRole('button', { name: /attach new document/i }));
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(onActiveTabChange).toHaveBeenCalledWith('documents');
    expect(onOpenParticipants).toHaveBeenCalledTimes(1);
    expect(onBackToPractice).toHaveBeenCalledTimes(1);
    expect(onArchiveCase).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalled();
    expect(onToggleAttachmentDrawer).toHaveBeenCalledTimes(1);
    expect(onAttachRecent).toHaveBeenCalledWith(expect.objectContaining({ name: 'scan.pdf' }));
    expect(onAttachNew).toHaveBeenCalledTimes(1);
    expect(onSendMessage).toHaveBeenCalledTimes(1);

    rerender(
      <ChannelContentPane
        activeChannel={{ ...activeChannel, id: 'practice-1', name: 'Valley Endodontics' }}
        isDentist={false}
        activeTab="archived"
        messages={[]}
        archivedConversations={[
          { id: 'case_archived', name: 'BOB SMITH', patientName: 'Bob Smith', referralId: '2', practiceId: 'practice-1', isArchived: true, lastMessage: 'Case archived.' },
        ]}
        inputText=""
        attachedDocument={null}
        showAttachmentDrawer={false}
        attachmentOptions={[]}
        documents={[]}
        totalDocumentCount={0}
        docSearchQuery=""
        currentDocPage={1}
        totalDocPages={1}
        onActiveTabChange={onActiveTabChange}
        onShowChannelList={onShowChannelList}
        onBackToPractice={onBackToPractice}
        onArchiveCase={onArchiveCase}
        onOpenParticipants={onOpenParticipants}
        onReactivateArchived={onReactivateArchived}
        onInputChange={onInputChange}
        onToggleAttachmentDrawer={onToggleAttachmentDrawer}
        onAttachNew={onAttachNew}
        onAttachRecent={onAttachRecent}
        onCloseAttachmentDrawer={onCloseAttachmentDrawer}
        onRemoveAttachment={onRemoveAttachment}
        onSendMessage={onSendMessage}
        onDocSearchQueryChange={onDocSearchChange}
        onClearDocSearch={onClearDocSearch}
        onSendNewDocument={onSendNewDocument}
        onViewDocument={onViewDocument}
        onDownloadDocument={onDownloadDocument}
        onDocPageChange={onDocPageChange}
        formatMessage={(message) => ({ type: message.type, user: message.user })}
        formatDocumentSender={(sender) => sender}
      />
    );

    await user.click(screen.getByRole('button', { name: /re-activate/i }));
    expect(onReactivateArchived).toHaveBeenCalledWith('case_archived');

    rerender(
      <ChannelContentPane
        activeChannel={activeChannel}
        isDentist={false}
        activeTab="documents"
        messages={[]}
        archivedConversations={[]}
        inputText=""
        attachedDocument={null}
        showAttachmentDrawer={false}
        attachmentOptions={[]}
        documents={[
          { id: 'doc-1', channelId: 'case_1', name: 'scan.pdf', size: '2 MB', type: 'pdf', sentBy: 'Me', sentAt: 'Today' },
        ]}
        totalDocumentCount={1}
        docSearchQuery="scan"
        currentDocPage={1}
        totalDocPages={1}
        onActiveTabChange={onActiveTabChange}
        onShowChannelList={onShowChannelList}
        onBackToPractice={onBackToPractice}
        onArchiveCase={onArchiveCase}
        onOpenParticipants={onOpenParticipants}
        onReactivateArchived={onReactivateArchived}
        onInputChange={onInputChange}
        onToggleAttachmentDrawer={onToggleAttachmentDrawer}
        onAttachNew={onAttachNew}
        onAttachRecent={onAttachRecent}
        onCloseAttachmentDrawer={onCloseAttachmentDrawer}
        onRemoveAttachment={onRemoveAttachment}
        onSendMessage={onSendMessage}
        onDocSearchQueryChange={onDocSearchChange}
        onClearDocSearch={onClearDocSearch}
        onSendNewDocument={onSendNewDocument}
        onViewDocument={onViewDocument}
        onDownloadDocument={onDownloadDocument}
        onDocPageChange={onDocPageChange}
        formatMessage={(message) => ({ type: message.type, user: message.user })}
        formatDocumentSender={(sender) => sender}
      />
    );

    await user.click(screen.getByRole('button', { name: /send new document/i }));
    await user.click(screen.getByRole('button', { name: /^view$/i }));
    await user.click(screen.getByRole('button', { name: /^download$/i }));

    expect(onSendNewDocument).toHaveBeenCalledTimes(1);
    expect(onViewDocument).toHaveBeenCalledWith(expect.objectContaining({ id: 'doc-1' }));
    expect(onDownloadDocument).toHaveBeenCalledWith(expect.objectContaining({ id: 'doc-1' }));
  });

  it('renders channel conversation headers with case controls and tab switching', async () => {
    const user = userEvent.setup();
    const onActiveTabChange = vi.fn();
    const onBackToPractice = vi.fn();
    const onArchiveCase = vi.fn();
    const onOpenParticipants = vi.fn();
    const onShowChannelList = vi.fn();

    render(
      <ChannelConversationHeader
        activeChannel={{
          id: 'case_D-1001',
          name: 'ALICE COOPER',
          type: 'inter-practice',
          lastMessage: 'Referral status: Scheduled',
          memberCount: 4,
          isExternal: true,
        }}
        isDentist={false}
        activeTab="messages"
        onActiveTabChange={onActiveTabChange}
        onBackToPractice={onBackToPractice}
        onArchiveCase={onArchiveCase}
        onOpenParticipants={onOpenParticipants}
        onShowChannelList={onShowChannelList}
      />
    );

    expect(screen.getByRole('heading', { name: /alice cooper/i })).toBeInTheDocument();
    expect(screen.getByText(/case ref-/i)).toBeInTheDocument();
    expect(screen.getByText(/external/i)).toBeInTheDocument();
    expect(screen.getByText(/secure email/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /archived conversations/i })).not.toBeInTheDocument();

    await user.click(screen.getByTitle(/back to practice dashboard/i));
    await user.click(screen.getByRole('button', { name: /more options/i }));
    await user.click(screen.getByRole('button', { name: /archive channel/i }));
    await user.click(screen.getByRole('button', { name: /more options/i }));
    await user.click(screen.getByRole('button', { name: /participants/i }));
    await user.click(screen.getByRole('button', { name: /documents/i }));

    expect(onBackToPractice).toHaveBeenCalledTimes(1);
    expect(onArchiveCase).toHaveBeenCalledTimes(1);
    expect(onOpenParticipants).toHaveBeenCalledTimes(1);
    expect(onActiveTabChange).toHaveBeenCalledWith('documents');
  });

  it('renders message bubbles with attached documents and transport labels', () => {
    render(
      <Message
        id="msg-doc"
        user="Dr. Smith"
        text="Please review the updated scan."
        time="10:05 AM"
        type="other"
        transport="Email"
        document={{
          id: 'doc-1',
          channelId: 'ext-1',
          name: 'scan.pdf',
          size: '2.4 MB',
          type: 'pdf',
          sentBy: 'Dr. Smith',
          sentAt: 'Today',
        }}
      />
    );

    expect(screen.getByText(/please review the updated scan/i)).toBeInTheDocument();
    expect(screen.getByText(/scan.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/sent via email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('renders attachment drawer actions for recent and new documents', async () => {
    const user = userEvent.setup();
    const onAttachRecent = vi.fn();
    const onAttachNew = vi.fn();
    const onClose = vi.fn();

    render(
      <ChannelAttachmentDrawer
        attachments={[
          { name: 'bitewing.pdf', size: '1.2 MB', type: 'pdf' },
          { name: 'xray.jpg', size: '3.4 MB', type: 'image' },
        ]}
        onAttachRecent={onAttachRecent}
        onAttachNew={onAttachNew}
        onClose={onClose}
      />
    );

    await user.click(screen.getByRole('button', { name: /attach new document/i }));
    await user.click(screen.getByRole('button', { name: /bitewing.pdf/i }));
    await user.click(screen.getByRole('button', { name: /close attachment picker/i }));

    expect(onAttachNew).toHaveBeenCalledTimes(1);
    expect(onAttachRecent).toHaveBeenCalledWith({ name: 'bitewing.pdf', size: '1.2 MB', type: 'pdf' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders attached document preview with removal callback', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(
      <AttachedDocumentPreview
        document={{ name: 'scan.pdf', size: '2.4 MB', type: 'pdf' }}
        onRemove={onRemove}
      />
    );

    expect(screen.getByText(/scan.pdf \(2.4 mb\)/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove attached document/i }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('renders channel message composer with attachment and delivery states', async () => {
    const user = userEvent.setup();
    const onInputChange = vi.fn();
    const onToggleAttachmentDrawer = vi.fn();
    const onAttachNew = vi.fn();
    const onAttachRecent = vi.fn();
    const onCloseAttachmentDrawer = vi.fn();
    const onRemoveAttachment = vi.fn();
    const onSendMessage = vi.fn();

    const { rerender } = render(
      <ChannelMessageComposer
        activeChannel={{
          id: 'ext-1',
          name: 'Pinecrest Dental',
          type: 'inter-practice',
          lastMessage: 'Practice channel created.',
          memberCount: 2,
          isExternal: true,
        }}
        inputText=""
        attachedDocument={null}
        showAttachmentDrawer={false}
        attachmentOptions={[{ name: 'scan.pdf', size: '2.4 MB', type: 'pdf' }]}
        onInputChange={onInputChange}
        onToggleAttachmentDrawer={onToggleAttachmentDrawer}
        onAttachNew={onAttachNew}
        onAttachRecent={onAttachRecent}
        onCloseAttachmentDrawer={onCloseAttachmentDrawer}
        onRemoveAttachment={onRemoveAttachment}
        onSendMessage={onSendMessage}
      />
    );

    expect(screen.getByText(/secure email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();

    await user.click(screen.getByTitle(/attach document/i));

    expect(onToggleAttachmentDrawer).toHaveBeenCalledTimes(1);

    rerender(
      <ChannelMessageComposer
        activeChannel={{
          id: 'patient-1',
          name: 'Alice Cooper',
          type: 'patient',
          lastMessage: 'Patient message.',
          memberCount: 1,
        }}
        inputText="Please review"
        attachedDocument={{ name: 'scan.pdf', size: '2.4 MB', type: 'pdf' }}
        showAttachmentDrawer
        attachmentOptions={[{ name: 'scan.pdf', size: '2.4 MB', type: 'pdf' }]}
        onInputChange={onInputChange}
        onToggleAttachmentDrawer={onToggleAttachmentDrawer}
        onAttachNew={onAttachNew}
        onAttachRecent={onAttachRecent}
        onCloseAttachmentDrawer={onCloseAttachmentDrawer}
        onRemoveAttachment={onRemoveAttachment}
        onSendMessage={onSendMessage}
      />
    );

    expect(screen.getByText(/delivery method/i)).toBeInTheDocument();
    expect(screen.getByText(/both \(email \+ sms\)/i)).toBeInTheDocument();
    expect(screen.getByText(/scan.pdf \(2.4 mb\)/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /attach new document/i }));
    await user.click(screen.getByRole('button', { name: /scan.pdf/i }));
    await user.click(screen.getByRole('button', { name: /close attachment picker/i }));
    await user.click(screen.getByRole('button', { name: /remove attached document/i }));
    await user.type(screen.getByPlaceholderText(/message #alice cooper/i), '{enter}');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(onAttachNew).toHaveBeenCalledTimes(1);
    expect(onAttachRecent).toHaveBeenCalledWith({ name: 'scan.pdf', size: '2.4 MB', type: 'pdf' });
    expect(onCloseAttachmentDrawer).toHaveBeenCalledTimes(1);
    expect(onRemoveAttachment).toHaveBeenCalledTimes(1);
    expect(onSendMessage).toHaveBeenCalledTimes(2);
  });

  it('renders channel documents pane search, empty, view, and download states', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onClearSearch = vi.fn();
    const onSendNewDocument = vi.fn();
    const onViewDocument = vi.fn();
    const onDownloadDocument = vi.fn();
    const document = {
      id: 'doc-1',
      channelId: 'ch-1',
      name: 'endo-scan.pdf',
      size: '2.4 MB',
      type: 'pdf' as const,
      sentBy: 'Me',
      sentAt: 'Today',
    };

    const { rerender } = render(
      <ChannelDocumentsPane
        documents={[document]}
        searchQuery="endo"
        onSearchQueryChange={onSearchChange}
        onClearSearch={onClearSearch}
        onSendNewDocument={onSendNewDocument}
        onViewDocument={onViewDocument}
        onDownloadDocument={onDownloadDocument}
        formatSender={(sender) => sender === 'Me' ? 'You' : sender}
        currentPage={2}
        totalPages={3}
        totalDocumentCount={9}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText(/9 files/i)).toBeInTheDocument();
    expect(screen.getByText(/endo-scan.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/shared by/i)).toBeInTheDocument();
    expect(screen.getByText(/you/i)).toBeInTheDocument();
    expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/search documents/i), ' updated');
    await user.click(screen.getByRole('button', { name: /clear document search/i }));
    await user.click(screen.getByRole('button', { name: /send new document/i }));
    await user.click(screen.getByRole('button', { name: /view/i }));
    await user.click(screen.getByRole('button', { name: /download/i }));

    expect(onSearchChange).toHaveBeenCalled();
    expect(onClearSearch).toHaveBeenCalledTimes(1);
    expect(onSendNewDocument).toHaveBeenCalledTimes(1);
    expect(onViewDocument).toHaveBeenCalledWith(document);
    expect(onDownloadDocument).toHaveBeenCalledWith(document);

    const onPageChange = vi.fn();
    rerender(
      <ChannelDocumentsPane
        documents={[document]}
        searchQuery=""
        onSearchQueryChange={onSearchChange}
        onClearSearch={onClearSearch}
        onSendNewDocument={onSendNewDocument}
        onViewDocument={onViewDocument}
        onDownloadDocument={onDownloadDocument}
        formatSender={(sender) => sender}
        currentPage={2}
        totalPages={3}
        totalDocumentCount={9}
        onPageChange={onPageChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /previous page/i }));
    await user.click(screen.getByRole('button', { name: /next page/i }));

    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(onPageChange).toHaveBeenCalledWith(3);

    rerender(
      <ChannelDocumentsPane
        documents={[]}
        searchQuery="missing"
        onSearchQueryChange={onSearchChange}
        onClearSearch={onClearSearch}
        onSendNewDocument={onSendNewDocument}
        onViewDocument={onViewDocument}
        onDownloadDocument={onDownloadDocument}
        formatSender={(sender) => sender}
      />
    );

    expect(screen.getByText(/no documents found matching your search/i)).toBeInTheDocument();
  });

  it('renders channel document preview overlay for pdf and image documents', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onDownload = vi.fn();
    const pdfDocument = {
      id: 'doc-pdf',
      channelId: 'ch-1',
      name: 'referral.pdf',
      size: '2.4 MB',
      type: 'pdf' as const,
      sentBy: 'Me',
      sentAt: 'Today',
    };
    const imageDocument = {
      ...pdfDocument,
      id: 'doc-image',
      name: 'pano.jpg',
      type: 'image' as const,
    };

    const { rerender } = render(
      <ChannelDocumentPreviewOverlay
        document={pdfDocument}
        activePracticeName="Valley Endodontics"
        onClose={onClose}
        onDownload={onDownload}
      />
    );

    expect(screen.getByText(/document viewer/i)).toBeInTheDocument();
    expect(screen.getByText(/referral.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/drtalk secure patient referral/i)).toBeInTheDocument();
    expect(screen.getByText(/to practice:/i)).toBeInTheDocument();
    expect(screen.getByText(/doc-pdf/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close view/i }));
    await user.click(screen.getByRole('button', { name: /download file/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onDownload).toHaveBeenCalledWith(pdfDocument);

    rerender(
      <ChannelDocumentPreviewOverlay
        document={imageDocument}
        activePracticeName="Downtown Endodontics"
        onClose={onClose}
        onDownload={onDownload}
      />
    );

    expect(screen.getByText(/pano x-ray/i)).toBeInTheDocument();
    expect(screen.getByText(/tooth #14 apical lesion/i)).toBeInTheDocument();
  });

  it('renders channel group modal and delegates group creation choices', async () => {
    const user = userEvent.setup();
    const onGroupChatNameChange = vi.fn();
    const onParticipantToggle = vi.fn();
    const onPracticeToggle = vi.fn();
    const onCancel = vi.fn();
    const onCreate = vi.fn();

    render(
      <ChannelGroupModal
        groupChatName=""
        participants={[
          { id: 'gp1', name: 'Dr. John Smith', practice: 'Sunshine Dental (Me)', selected: false },
          { id: 'gp2', name: 'Jane Doe', practice: 'Sunshine Dental (Me)', selected: true },
          { id: 'gp3', name: 'Dr. Clara Valley', practice: 'Valley Endodontics', selected: false },
        ]}
        error="Please select at least one participant."
        onGroupChatNameChange={onGroupChatNameChange}
        onParticipantToggle={onParticipantToggle}
        onPracticeToggle={onPracticeToggle}
        onCancel={onCancel}
        onCreate={onCreate}
      />
    );

    expect(screen.getByText(/create group chat/i)).toBeInTheDocument();
    expect(screen.getByText(/sunshine dental \(me\)/i)).toBeInTheDocument();
    expect(screen.getByText(/valley endodontics/i)).toBeInTheDocument();
    expect(screen.getByText(/please select at least one participant/i)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/enter group chat name/i), 'Referral review');
    await user.click(screen.getByText(/dr\. john smith/i));
    await user.click(screen.getAllByRole('button', { name: /select all/i })[0]);
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    await user.click(screen.getByRole('button', { name: /create group/i }));

    expect(onGroupChatNameChange).toHaveBeenCalled();
    expect(onParticipantToggle).toHaveBeenCalledWith('gp1');
    expect(onPracticeToggle).toHaveBeenCalledWith(['gp1', 'gp2'], true);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('renders channel participants modal and delegates participant choices', async () => {
    const user = userEvent.setup();
    const onParticipantToggle = vi.fn();
    const onClose = vi.fn();

    render(
      <ChannelParticipantsModal
        participants={[
          { id: 'p1', name: 'Dr. John Smith', role: 'Admin', selected: true },
          { id: 'p2', name: 'Jane Doe', role: 'Treatment Coordinator', selected: false },
        ]}
        onParticipantToggle={onParticipantToggle}
        onClose={onClose}
      />
    );

    expect(screen.getByText(/manage participants/i)).toBeInTheDocument();
    expect(screen.getByText(/dr\. john smith/i)).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
    expect(screen.getByText(/jane doe/i)).toBeInTheDocument();

    await user.click(screen.getByText(/jane doe/i));
    await user.click(screen.getByRole('button', { name: /done/i }));
    await user.click(screen.getByRole('button', { name: /close participants modal/i }));

    expect(onParticipantToggle).toHaveBeenCalledWith('p2');
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('renders archived channel conversations and delegates reactivation', async () => {
    const user = userEvent.setup();
    const onReactivate = vi.fn();
    const { rerender } = render(
      <ChannelArchivedConversations
        conversations={[
          {
            id: 'case_D-1001',
            name: 'ALICE COOPER',
            patientName: 'Alice Cooper',
            practiceId: '3',
            referralId: 'D-1001',
            isArchived: true,
            lastMessage: 'Case archived.',
          },
        ]}
        onReactivate={onReactivate}
      />
    );

    expect(screen.getByRole('heading', { name: /archived conversations/i })).toBeInTheDocument();
    expect(screen.getByText(/re-activate any per-case channel/i)).toBeInTheDocument();
    expect(screen.getByText(/^#alice cooper$/i, { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText(/case id: d-1001/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /re-activate alice cooper/i }));

    expect(onReactivate).toHaveBeenCalledWith('case_D-1001');

    rerender(
      <ChannelArchivedConversations
        conversations={[]}
        onReactivate={onReactivate}
      />
    );

    expect(screen.getByText(/no archived conversations for this practice/i)).toBeInTheDocument();
  });
});
