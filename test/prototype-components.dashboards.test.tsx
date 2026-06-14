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


describe('prototype components: dashboards.test', () => {
  it('renders dashboard stats with the shared time-range control', async () => {
    const user = userEvent.setup();
    const onTimeRangeChange = vi.fn();
    const onStatClick = vi.fn();

    render(
      <DashboardStats
        timeRange="month"
        onTimeRangeChange={onTimeRangeChange}
        onStatClick={onStatClick}
        stats={[
          { label: 'Referrals received', value: '07', icon: FileText, path: '/referrals?tab=Received' },
        ]}
      />
    );

    await user.selectOptions(screen.getByRole('combobox'), 'week');
    await user.click(screen.getByText(/referrals received/i));

    expect(onTimeRangeChange).toHaveBeenCalledWith('week');
    expect(onStatClick).toHaveBeenCalledWith('/referrals?tab=Received');
  });

  it('renders a shared dashboard action card and delegates clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <DashboardActionCard
        label="Send Document"
        description="Share a mock document"
        onClick={onClick}
      />
    );

    await user.click(screen.getByRole('button', { name: /send document share a mock document/i }));

    expect(screen.getByText(/send document/i)).toBeInTheDocument();
    expect(screen.getByText(/share a mock document/i)).toBeInTheDocument();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders dashboard sidebar lists and delegates item actions', async () => {
    const user = userEvent.setup();
    const onConversationClick = vi.fn();
    const onConnectionClick = vi.fn();

    render(
      <>
        <DashboardSidebarList
          title="Recent Conversations"
          items={[
            {
              id: 'conversation-1',
              name: 'Valley Endodontics',
              message: 'Pano received.',
              initials: 'VE',
              meta: 'Inter-Practice',
              timestamp: '10:05 AM\n05/11/2026',
              onClick: onConversationClick,
            },
          ]}
        />
        <DashboardSidebarList
          title="Suggested Connections"
          items={[
            {
              id: 'connection-1',
              name: 'Arizona Periodontics',
              message: 'Scottsdale, AZ',
              meta: 'Periodontics',
              actionLabel: 'Connect',
              onAction: onConnectionClick,
            },
          ]}
        />
      </>
    );

    expect(screen.getByText(/recent conversations/i)).toBeInTheDocument();
    expect(screen.getByText(/valley endodontics/i)).toBeInTheDocument();
    expect(screen.getByText(/pano received/i)).toBeInTheDocument();
    expect(screen.getByText(/suggested connections/i)).toBeInTheDocument();
    expect(screen.getByText(/arizona periodontics/i)).toBeInTheDocument();

    await user.click(screen.getByText(/valley endodontics/i));
    await user.click(screen.getByRole('button', { name: /connect arizona periodontics/i }));

    expect(onConversationClick).toHaveBeenCalledTimes(1);
    expect(onConnectionClick).toHaveBeenCalledTimes(1);
  });

  it('renders dentist sent referrals with search, row navigation, and pagination actions', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onReferralClick = vi.fn();
    const onPageChange = vi.fn();
    const onViewAll = vi.fn();

    render(
      <DentistSentReferralsSection
        searchQuery="alice"
        onSearchQueryChange={onSearchChange}
        referrals={[
          {
            id: 'D-1001',
            patientName: 'Alice Cooper',
            sender: 'Dr. Reed',
            specialist: 'Valley Endodontics',
            code: 'REF-D1001',
            status: 'Sent',
            lastUpdate: 'Today',
            urgency: 'Urgent',
          },
        ]}
        currentPage={2}
        totalPages={3}
        totalItems={12}
        onPageChange={onPageChange}
        onReferralClick={onReferralClick}
        onViewAll={onViewAll}
      />
    );

    expect(screen.getByText(/patients sent/i)).toBeInTheDocument();
    expect(screen.getByText(/patient: alice cooper/i)).toBeInTheDocument();
    expect(screen.getByText(/ref-d1001/i)).toBeInTheDocument();
    expect(screen.getByText(/urgent/i)).toBeInTheDocument();
    expect(screen.getByText(/page 2 of 3 \(12 items\)/i)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/search patients/i), ' updated');
    await user.click(screen.getByText(/patient: alice cooper/i));
    await user.click(screen.getByRole('button', { name: /prev/i }));
    await user.click(screen.getByRole('button', { name: /^3$/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /view all referrals/i }));

    expect(onSearchChange).toHaveBeenCalled();
    expect(onReferralClick).toHaveBeenCalledWith('D-1001');
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(onViewAll).toHaveBeenCalledTimes(1);
  });

  it('renders dentist dashboard header with status banners and quick actions', async () => {
    const user = userEvent.setup();
    const onVerify = vi.fn();
    const onInviteOwner = vi.fn();
    const onSendReferral = vi.fn();
    const onSendDocument = vi.fn();

    const { rerender } = render(
      <DentistDashboardHeader
        isVerified={false}
        hasPracticeOwner={false}
        showCommentMarker={false}
        onVerifyIdentity={onVerify}
        onInvitePracticeOwner={onInviteOwner}
        onSendReferral={onSendReferral}
        onSendDocument={onSendDocument}
      />
    );

    expect(screen.getByText(/verification required/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/refer patients, track/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /verify identity now/i }));
    await user.click(screen.getByRole('button', { name: /send a referral/i }));
    await user.click(screen.getByRole('button', { name: /send document/i }));

    expect(onVerify).toHaveBeenCalledTimes(1);
    expect(onSendReferral).toHaveBeenCalledTimes(1);
    expect(onSendDocument).toHaveBeenCalledTimes(1);

    rerender(
      <DentistDashboardHeader
        isVerified
        hasPracticeOwner={false}
        showCommentMarker={false}
        onVerifyIdentity={onVerify}
        onInvitePracticeOwner={onInviteOwner}
        onSendReferral={onSendReferral}
        onSendDocument={onSendDocument}
      />
    );

    expect(screen.getByText(/practice owner required/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /invite practice owner/i }));
    expect(onInviteOwner).toHaveBeenCalledTimes(1);

    rerender(
      <DentistDashboardHeader
        isVerified
        hasPracticeOwner
        showCommentMarker={false}
        onVerifyIdentity={onVerify}
        onInvitePracticeOwner={onInviteOwner}
        onSendReferral={onSendReferral}
        onSendDocument={onSendDocument}
      />
    );

    expect(screen.queryByText(/verification required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/practice owner required/i)).not.toBeInTheDocument();
  });

  it('renders specialist referral queues and delegates referral actions', async () => {
    const user = userEvent.setup();
    const onReferralClick = vi.fn();
    const onViewAll = vi.fn();

    render(
      <SpecialistReferralQueues
        totalCount={1}
        processingReferrals={[
          {
            id: 'ext-ref-1',
            patient: 'Jane Doe',
            source: 'Pinecrest Dental',
            dentist: 'Dr. Taylor Reed',
            date: '06/30/2026',
            detail: 'Secure Email Referral - Needs Review',
            urgency: 'Emergency',
            isExternal: true,
            transport: 'Email',
          },
        ]}
        documentReferrals={[]}
        onReferralClick={onReferralClick}
        onViewAll={onViewAll}
      />
    );

    expect(screen.getByRole('heading', { name: /^referrals$/i })).toBeInTheDocument();
    expect(screen.getByText(/1 items/i)).toBeInTheDocument();
    expect(screen.getByText(/new referrals requiring processing/i)).toBeInTheDocument();
    expect(screen.getByText(/^referrals with newly received documents$/i)).toBeInTheDocument();
    expect(screen.getByText(/jane doe/i)).toBeInTheDocument();
    expect(screen.getByText(/external/i)).toBeInTheDocument();
    expect(screen.getByText(/emergency/i)).toBeInTheDocument();
    expect(screen.getByText(/no referrals with newly received documents/i)).toBeInTheDocument();

    await user.click(screen.getByText(/jane doe/i));
    await user.click(screen.getByRole('button', { name: /view all referrals/i }));

    expect(onReferralClick).toHaveBeenCalledWith('ext-ref-1');
    expect(onViewAll).toHaveBeenCalledTimes(1);
  });

  it('renders document section search, empty state, and pagination controls', async () => {
    const user = userEvent.setup();
    const onSearchQueryChange = vi.fn();
    const onPageChange = vi.fn();

    render(
      <PrototypeDocumentSection
        inboxCount={12}
        searchQuery="scan"
        onSearchQueryChange={onSearchQueryChange}
        isEmpty={false}
        currentPage={2}
        totalPages={3}
        totalItems={12}
        onPageChange={onPageChange}
      >
        <div>Mock document row</div>
      </PrototypeDocumentSection>
    );

    expect(screen.getByText(/inbox \(12\)/i)).toBeInTheDocument();
    expect(screen.getByText(/mock document row/i)).toBeInTheDocument();
    expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear/i }));
    await user.click(screen.getByRole('button', { name: /next page/i }));

    expect(onSearchQueryChange).toHaveBeenCalledWith('');
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('renders dashboard document rows with document, archive, and action states', async () => {
    const user = userEvent.setup();
    const onOpenDocument = vi.fn();
    const onConvert = vi.fn();
    const onAttach = vi.fn();
    const onOpenChannel = vi.fn();

    const { rerender } = render(
      <DashboardDocumentRow
        document={{
          id: 'doc-1',
          name: 'scan.pdf',
          sender: 'Pinecrest Dental',
          date: 'Today',
          size: '2.4 MB',
          isExternal: true,
          transport: 'Email',
        }}
        onOpenDocument={onOpenDocument}
        onConvert={onConvert}
        onAttach={onAttach}
        onOpenChannel={onOpenChannel}
      />
    );

    expect(screen.getByText(/scan.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/external/i)).toBeInTheDocument();

    await user.click(screen.getByText(/scan.pdf/i));
    await user.click(screen.getByRole('button', { name: /convert to referral/i }));
    await user.click(screen.getByRole('button', { name: /attach to existing referral/i }));
    await user.click(screen.getByRole('button', { name: /open in channel/i }));

    expect(onOpenDocument).toHaveBeenCalledWith('doc-1');
    expect(onConvert).toHaveBeenCalledWith('doc-1');
    expect(onAttach).toHaveBeenCalledWith('doc-1');
    expect(onOpenChannel).toHaveBeenCalledWith('doc-1');

    rerender(
      <DashboardDocumentRow
        document={{
          id: 'doc-2',
          name: 'archived.pdf',
          sender: 'Valley Endodontics',
          date: 'Yesterday',
          size: '1.1 MB',
        }}
        isArchived
        onOpenDocument={onOpenDocument}
        onConvert={onConvert}
        onAttach={onAttach}
        onOpenChannel={onOpenChannel}
      />
    );

    expect(screen.getByText(/^archived$/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /convert to referral/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /open in channel/i })).not.toBeInTheDocument();
  });

  it('renders dashboard document action modals for convert and attach flows', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirmConvert = vi.fn();
    const onConfirmAttach = vi.fn();
    const onPatientNameChange = vi.fn();
    const onAttachSearchChange = vi.fn();

    const { rerender } = render(
      <DashboardDocumentActionModals
        mode="convert"
        documentName="referral-scan.pdf"
        convertPatientName=""
        attachSearchQuery=""
        attachReferrals={[]}
        attachSearchPlaceholder="Search patient or source..."
        onPatientNameChange={onPatientNameChange}
        onAttachSearchChange={onAttachSearchChange}
        onClose={onClose}
        onConfirmConvert={onConfirmConvert}
        onConfirmAttach={onConfirmAttach}
      />
    );

    expect(screen.getByText(/convert document to referral/i)).toBeInTheDocument();
    expect(screen.getByText(/referral-scan.pdf/i)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/patient name/i), 'Alice Cooper');
    await user.click(screen.getByRole('button', { name: /create referral/i }));
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onPatientNameChange).toHaveBeenCalled();
    expect(onConfirmConvert).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <DashboardDocumentActionModals
        mode="attach"
        documentName="referral-scan.pdf"
        convertPatientName=""
        attachSearchQuery="alice"
        attachReferrals={[
          { id: 'ref-1', patientName: 'Alice Cooper', detail: 'From: Sunshine Dental - Needs Review' },
        ]}
        attachSearchPlaceholder="Search patient or source..."
        onPatientNameChange={onPatientNameChange}
        onAttachSearchChange={onAttachSearchChange}
        onClose={onClose}
        onConfirmConvert={onConfirmConvert}
        onConfirmAttach={onConfirmAttach}
      />
    );

    expect(screen.getByText(/attach to existing referral/i)).toBeInTheDocument();
    expect(screen.getByText(/document to attach/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear/i }));
    await user.click(screen.getByText(/alice cooper/i));

    expect(onAttachSearchChange).toHaveBeenCalledWith('');
    expect(onConfirmAttach).toHaveBeenCalledWith('ref-1');
  });
});
