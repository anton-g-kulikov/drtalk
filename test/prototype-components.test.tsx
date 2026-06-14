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

describe('shared prototype components', () => {
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

  it('renders a shared prototype toast with optional action and dismiss', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onDismiss = vi.fn();

    render(
      <PrototypeToast
        message="Document shared"
        action={{ label: 'View', onClick: onAction }}
        onDismiss={onDismiss}
      />
    );

    await user.click(screen.getByRole('button', { name: /view/i }));
    await user.click(screen.getByRole('button', { name: /dismiss/i }));

    expect(screen.getByText(/document shared/i)).toBeInTheDocument();
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
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

  it('renders specialist dashboard header with status banners and send-document action', async () => {
    const user = userEvent.setup();
    const onVerify = vi.fn();
    const onInviteOwner = vi.fn();
    const onSendDocument = vi.fn();

    const { rerender } = render(
      <SpecialistDashboardHeader
        isVerified={false}
        hasPracticeOwner={false}
        showCommentMarker={false}
        onVerifyIdentity={onVerify}
        onInvitePracticeOwner={onInviteOwner}
        onSendDocument={onSendDocument}
      />
    );

    expect(screen.getByText(/verification required/i)).toBeInTheDocument();
    expect(screen.getByText(/receive referrals, process cases/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /verify identity now/i }));
    await user.click(screen.getByRole('button', { name: /send document/i }));

    expect(onVerify).toHaveBeenCalledTimes(1);
    expect(onSendDocument).toHaveBeenCalledTimes(1);

    rerender(
      <SpecialistDashboardHeader
        isVerified
        hasPracticeOwner={false}
        showCommentMarker={false}
        onVerifyIdentity={onVerify}
        onInvitePracticeOwner={onInviteOwner}
        onSendDocument={onSendDocument}
      />
    );

    expect(screen.getByText(/practice owner required/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /invite practice owner/i }));
    expect(onInviteOwner).toHaveBeenCalledTimes(1);
  });

  it('renders send-document patient fields and delegates edits', async () => {
    const user = userEvent.setup();
    const onFirstNameChange = vi.fn();
    const onLastNameChange = vi.fn();
    const onDobChange = vi.fn();
    const onMessageChange = vi.fn();

    render(
      <SendDocumentPatientFields
        patientFirstName="Bob"
        patientLastName="Marley"
        patientDob="02/06/1945"
        uploadMessage="Sharing updated panoramic X-ray."
        onPatientFirstNameChange={onFirstNameChange}
        onPatientLastNameChange={onLastNameChange}
        onPatientDobChange={onDobChange}
        onUploadMessageChange={onMessageChange}
      />
    );

    expect(screen.getByText(/patient information/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/bob/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/marley/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/02\/06\/1945/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/sharing updated panoramic x-ray/i)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/enter patient first name/i), ' Jr');
    await user.type(screen.getByPlaceholderText(/enter patient last name/i), ' Sr');
    await user.type(screen.getByPlaceholderText(/mm\/dd\/yyyy/i), '6');
    await user.type(screen.getByPlaceholderText(/enter message/i), ' Please review.');

    expect(onFirstNameChange).toHaveBeenCalled();
    expect(onLastNameChange).toHaveBeenCalled();
    expect(onDobChange).toHaveBeenCalled();
    expect(onMessageChange).toHaveBeenCalled();
  });

  it('renders send-document practice selector with chips, dropdown, and empty state', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onOpenChange = vi.fn();
    const onSelectPractice = vi.fn();
    const onRemovePractice = vi.fn();

    const { rerender } = render(
      <SendDocumentPracticeSelector
        selectedPractices={['Sunshine Dental']}
        searchQuery="val"
        isOpen
        practices={[
          { id: '1', name: 'Valley Endodontics', isVerified: false },
          { id: '2', name: 'Downtown Oral Surgery' },
        ]}
        onSearchQueryChange={onSearchChange}
        onOpenChange={onOpenChange}
        onSelectPractice={onSelectPractice}
        onRemovePractice={onRemovePractice}
      />
    );

    expect(screen.getByText(/connected practices/i)).toBeInTheDocument();
    expect(screen.getByText(/sunshine dental/i)).toBeInTheDocument();
    expect(screen.getByText(/valley endodontics/i)).toBeInTheDocument();
    expect(screen.getByText(/unverified/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove sunshine dental/i }));
    await user.type(screen.getByPlaceholderText(/type to search and add practices/i), 'ley');
    await user.click(screen.getByRole('button', { name: /toggle practice selector/i }));
    await user.click(screen.getByText(/valley endodontics/i));

    expect(onRemovePractice).toHaveBeenCalledWith('Sunshine Dental');
    expect(onSearchChange).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onSelectPractice).toHaveBeenCalledWith('Valley Endodontics');

    rerender(
      <SendDocumentPracticeSelector
        selectedPractices={[]}
        searchQuery="zzz"
        isOpen
        practices={[]}
        onSearchQueryChange={onSearchChange}
        onOpenChange={onOpenChange}
        onSelectPractice={onSelectPractice}
        onRemovePractice={onRemovePractice}
      />
    );

    expect(screen.getByText(/no practices found/i)).toBeInTheDocument();
  });

  it('renders send-document referral selector with none, referral, and empty states', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onOpenChange = vi.fn();
    const onSelectReferral = vi.fn();
    const { rerender } = render(
      <SendDocumentReferralSelector
        searchQuery="REF"
        isOpen
        referrals={[
          { id: 'D-1001', code: 'REF-D1001', patientName: 'Alice Cooper', specialist: 'Valley Endodontics' },
        ]}
        onSearchQueryChange={onSearchChange}
        onOpenChange={onOpenChange}
        onSelectReferral={onSelectReferral}
      />
    );

    expect(screen.getByText(/associated referral/i)).toBeInTheDocument();
    expect(screen.getByText(/none \/ new referral/i)).toBeInTheDocument();
    expect(screen.getByText(/ref-d1001 - alice cooper/i)).toBeInTheDocument();
    expect(screen.getByText(/valley endodontics/i)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/search or select referral/i), ' 1001');
    await user.click(screen.getByRole('button', { name: /toggle referral selector/i }));
    await user.click(screen.getByText(/none \/ new referral/i));
    await user.click(screen.getByText(/ref-d1001 - alice cooper/i));

    expect(onSearchChange).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onSelectReferral).toHaveBeenCalledWith('');
    expect(onSelectReferral).toHaveBeenCalledWith('D-1001');

    rerender(
      <SendDocumentReferralSelector
        searchQuery="missing"
        isOpen
        referrals={[]}
        onSearchQueryChange={onSearchChange}
        onOpenChange={onOpenChange}
        onSelectReferral={onSelectReferral}
      />
    );

    expect(screen.getByText(/no referrals found/i)).toBeInTheDocument();
  });

  it('renders send-document upload section with attached files and actions', async () => {
    const user = userEvent.setup();
    const onFileSelect = vi.fn();
    const onRemoveFile = vi.fn();
    const onAttachMockScan = vi.fn();

    render(
      <SendDocumentUploadSection
        inputId="prototype-upload-input"
        attachedFiles={[
          { id: 'file-1', name: 'scan.pdf', size: '2.4 MB', type: 'pdf' },
        ]}
        onFileSelect={onFileSelect}
        onRemoveFile={onRemoveFile}
        onAttachMockScan={onAttachMockScan}
      />
    );

    expect(screen.getByText(/attached files \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/scan.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/2.4 mb/i)).toBeInTheDocument();
    expect(screen.getByText(/attach document/i)).toBeInTheDocument();
    expect(screen.getByText(/click to browse files or drag and drop here/i)).toBeInTheDocument();

    const file = new File(['mock'], 'new-scan.pdf', { type: 'application/pdf' });
    await user.upload(document.querySelector('#prototype-upload-input') as HTMLInputElement, file);
    await user.click(screen.getByRole('button', { name: /remove scan.pdf/i }));
    await user.click(screen.getByRole('button', { name: /quick attach mock scan/i }));

    expect(onFileSelect).toHaveBeenCalledTimes(1);
    expect(onRemoveFile).toHaveBeenCalledWith('file-1');
    expect(onAttachMockScan).toHaveBeenCalledTimes(1);
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

  it('renders referral pipeline controls with tabs, search, filters, and role copy', async () => {
    const user = userEvent.setup();
    const onActiveTabChange = vi.fn();
    const onTimeRangeChange = vi.fn();
    const onSearchQueryChange = vi.fn();
    const onShowFiltersChange = vi.fn();
    const onUrgencyChange = vi.fn();
    const onSourceChange = vi.fn();
    const onPracticeChange = vi.fn();
    const onIncompleteOnlyChange = vi.fn();
    const onClearFilters = vi.fn();

    const { rerender } = render(
      <ReferralPipelineControls
        isDentist={false}
        activeTab="Received"
        timeRange="month"
        searchQuery="alice"
        showFilters
        selectedUrgency="Urgent"
        selectedSource="Email"
        selectedPracticeFilter="All"
        showIncompleteOnly={false}
        practiceOptions={['Pinecrest Dental']}
        onActiveTabChange={onActiveTabChange}
        onTimeRangeChange={onTimeRangeChange}
        onSearchQueryChange={onSearchQueryChange}
        onShowFiltersChange={onShowFiltersChange}
        onUrgencyChange={onUrgencyChange}
        onSourceChange={onSourceChange}
        onPracticeChange={onPracticeChange}
        onIncompleteOnlyChange={onIncompleteOnlyChange}
        onClearFilters={onClearFilters}
      />
    );

    expect(screen.getByRole('button', { name: /received \(review\)/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search referrals/i)).toBeInTheDocument();
    expect(screen.getByText(/source \/ channel/i)).toBeInTheDocument();
    expect(screen.getByText(/referring practice/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /show incomplete only/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^accepted$/i }));
    await user.selectOptions(screen.getByLabelText(/time range/i), 'week');
    await user.type(screen.getByPlaceholderText(/search referrals/i), ' updated');
    await user.click(screen.getByRole('button', { name: /^filters/i }));
    await user.selectOptions(screen.getByLabelText(/urgency/i), 'Emergency');
    await user.selectOptions(screen.getByLabelText(/source \/ channel/i), 'Fax');
    await user.selectOptions(screen.getByLabelText(/referring practice/i), 'Pinecrest Dental');
    await user.click(screen.getByRole('checkbox', { name: /show incomplete only/i }));
    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    expect(onActiveTabChange).toHaveBeenCalledWith('Accepted');
    expect(onTimeRangeChange).toHaveBeenCalledWith('week');
    expect(onSearchQueryChange).toHaveBeenCalled();
    expect(onShowFiltersChange).toHaveBeenCalledWith(false);
    expect(onUrgencyChange).toHaveBeenCalledWith('Emergency');
    expect(onSourceChange).toHaveBeenCalledWith('Fax');
    expect(onPracticeChange).toHaveBeenCalledWith('Pinecrest Dental');
    expect(onIncompleteOnlyChange).toHaveBeenCalledWith(true);
    expect(onClearFilters).toHaveBeenCalledTimes(1);

    rerender(
      <ReferralPipelineControls
        isDentist
        activeTab="Received"
        timeRange="month"
        searchQuery=""
        showFilters
        selectedUrgency="All"
        selectedSource="All"
        selectedPracticeFilter="All"
        showIncompleteOnly={false}
        practiceOptions={['Valley Endodontics']}
        onActiveTabChange={onActiveTabChange}
        onTimeRangeChange={onTimeRangeChange}
        onSearchQueryChange={onSearchQueryChange}
        onShowFiltersChange={onShowFiltersChange}
        onUrgencyChange={onUrgencyChange}
        onSourceChange={onSourceChange}
        onPracticeChange={onPracticeChange}
        onIncompleteOnlyChange={onIncompleteOnlyChange}
        onClearFilters={onClearFilters}
      />
    );

    expect(screen.getByRole('button', { name: /^sent$/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search patients/i)).toBeInTheDocument();
    expect(screen.getByText(/specialist practice/i)).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: /show incomplete only/i })).not.toBeInTheDocument();
  });

  it('renders guest referral practice selector across preselected, internal, and public states', async () => {
    const user = userEvent.setup();
    const onStateChange = vi.fn();
    const onSearchChange = vi.fn();
    const onTargetPracticeChange = vi.fn();
    const onTargetPracticesChange = vi.fn();
    const onDropdownChange = vi.fn();

    const practiceOptions = [
      { name: 'Valley Endodontics', specialty: 'Endodontics', location: 'Phoenix, AZ' },
      { name: 'Sunshine Dental', specialty: 'General Dentistry', location: 'Phoenix, AZ' },
    ];

    const { rerender } = render(
      <GuestReferralPracticeSelector
        isInternal={false}
        practiceParam="Valley Endodontics"
        selectedState=""
        practiceSearch=""
        targetPractice="Valley Endodontics"
        targetPractices={[]}
        showDropdown={false}
        states={[{ code: 'AZ', name: 'Arizona' }]}
        filteredPractices={practiceOptions}
        allPractices={practiceOptions}
        onStateChange={onStateChange}
        onPracticeSearchChange={onSearchChange}
        onTargetPracticeChange={onTargetPracticeChange}
        onTargetPracticesChange={onTargetPracticesChange}
        onShowDropdownChange={onDropdownChange}
      />
    );

    expect(screen.getByText(/valley endodontics/i)).toBeInTheDocument();
    expect(screen.queryByText(/select receiving practice/i)).not.toBeInTheDocument();

    rerender(
      <GuestReferralPracticeSelector
        isInternal
        selectedState=""
        practiceSearch="val"
        targetPractice=""
        targetPractices={['Sunshine Dental']}
        showDropdown
        states={[{ code: 'AZ', name: 'Arizona' }]}
        filteredPractices={practiceOptions}
        allPractices={practiceOptions}
        onStateChange={onStateChange}
        onPracticeSearchChange={onSearchChange}
        onTargetPracticeChange={onTargetPracticeChange}
        onTargetPracticesChange={onTargetPracticesChange}
        onShowDropdownChange={onDropdownChange}
      />
    );

    expect(screen.getByText(/connected practices \(select multiple\)/i)).toBeInTheDocument();
    expect(screen.getByText(/^sunshine dental$/i)).toBeInTheDocument();
    expect(screen.getByText(/selected: sunshine dental/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove sunshine dental/i }));
    await user.type(screen.getByPlaceholderText(/type to search and add practices/i), 'ley');
    await user.click(screen.getByRole('button', { name: /toggle practice dropdown/i }));
    await user.click(screen.getByText(/^valley endodontics$/i));
    await user.click(screen.getByRole('button', { name: /clear selected practices/i }));

    expect(onTargetPracticesChange).toHaveBeenCalledWith([]);
    expect(onSearchChange).toHaveBeenCalled();
    expect(onDropdownChange).toHaveBeenCalledWith(false);
    expect(onTargetPracticesChange).toHaveBeenCalledWith(['Sunshine Dental', 'Valley Endodontics']);

    rerender(
      <GuestReferralPracticeSelector
        isInternal={false}
        selectedState="AZ"
        practiceSearch="val"
        targetPractice=""
        targetPractices={[]}
        showDropdown
        states={[{ code: 'AZ', name: 'Arizona' }]}
        filteredPractices={practiceOptions}
        allPractices={practiceOptions}
        onStateChange={onStateChange}
        onPracticeSearchChange={onSearchChange}
        onTargetPracticeChange={onTargetPracticeChange}
        onTargetPracticesChange={onTargetPracticesChange}
        onShowDropdownChange={onDropdownChange}
      />
    );

    expect(screen.getByText(/select receiving practice/i)).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText(/^state$/i), 'AZ');
    await user.type(screen.getByPlaceholderText(/type practice name/i), ' endo');
    await user.click(screen.getByText(/^valley endodontics$/i));

    expect(onStateChange).toHaveBeenCalledWith('AZ');
    expect(onSearchChange).toHaveBeenCalled();
    expect(onTargetPracticeChange).toHaveBeenCalledWith('Valley Endodontics');

    rerender(
      <GuestReferralPracticeSelector
        isInternal={false}
        selectedState="AZ"
        practiceSearch="missing"
        targetPractice=""
        targetPractices={[]}
        showDropdown
        states={[{ code: 'AZ', name: 'Arizona' }]}
        filteredPractices={[]}
        allPractices={practiceOptions}
        onStateChange={onStateChange}
        onPracticeSearchChange={onSearchChange}
        onTargetPracticeChange={onTargetPracticeChange}
        onTargetPracticesChange={onTargetPracticesChange}
        onShowDropdownChange={onDropdownChange}
      />
    );

    expect(screen.getByText(/no practices found/i)).toBeInTheDocument();
  });

  it('renders guest referral attachment step with patient-copy contact states', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    const onSubmit = vi.fn();
    const onSendCopyChange = vi.fn();
    const onPatientCellChange = vi.fn();
    const onPatientEmailChange = vi.fn();

    const { rerender } = render(
      <GuestReferralAttachmentsStep
        sendCopyToPatient={false}
        patientCell=""
        patientEmail=""
        onBack={onBack}
        onSubmit={onSubmit}
        onSendCopyToPatientChange={onSendCopyChange}
        onPatientCellChange={onPatientCellChange}
        onPatientEmailChange={onPatientEmailChange}
      />
    );

    expect(screen.getByRole('heading', { name: /attachments/i })).toBeInTheDocument();
    expect(screen.getByText(/x-rays & records/i)).toBeInTheDocument();
    expect(screen.getByText(/drag & drop files here/i)).toBeInTheDocument();
    expect(screen.getByText(/x-ray_upper_left.jpg/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /back to case details/i }));
    await user.click(screen.getByRole('checkbox', { name: /send a copy of this referral to your patient/i }));
    await user.click(screen.getByRole('button', { name: /submit secure referral/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onSendCopyChange).toHaveBeenCalledWith(true);
    expect(onSubmit).toHaveBeenCalledTimes(1);

    rerender(
      <GuestReferralAttachmentsStep
        sendCopyToPatient
        patientCell=""
        patientEmail=""
        onBack={onBack}
        onSubmit={onSubmit}
        onSendCopyToPatientChange={onSendCopyChange}
        onPatientCellChange={onPatientCellChange}
        onPatientEmailChange={onPatientEmailChange}
      />
    );

    expect(screen.getByLabelText(/patient's cell phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/patient's email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit secure referral/i })).toBeDisabled();

    await user.type(screen.getByLabelText(/patient's cell phone/i), '555');
    await user.type(screen.getByLabelText(/patient's email address/i), 'patient@example.com');

    expect(onPatientCellChange).toHaveBeenCalled();
    expect(onPatientEmailChange).toHaveBeenCalled();

    rerender(
      <GuestReferralAttachmentsStep
        sendCopyToPatient
        patientCell="(555) 000-0000"
        patientEmail="patient@example.com"
        onBack={onBack}
        onSubmit={onSubmit}
        onSendCopyToPatientChange={onSendCopyChange}
        onPatientCellChange={onPatientCellChange}
        onPatientEmailChange={onPatientEmailChange}
      />
    );

    expect(screen.getByRole('button', { name: /submit secure referral/i })).toBeEnabled();
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
    expect(screen.queryByText('2')).not.toBeInTheDocument();

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
    await user.click(screen.getByRole('button', { name: /^external — secure email$/i }));
    await user.click(screen.getByRole('button', { name: /group chats/i }));
    await user.click(screen.getByRole('button', { name: /patient comm/i }));
    await user.click(screen.getAllByRole('button', { name: /create/i })[1]);
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
    await user.click(screen.getByRole('button', { name: /participants/i }));
    await user.click(screen.getByTitle(/back to practice dashboard/i));
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
    expect(screen.getByText(/case sub-channel/i)).toBeInTheDocument();
    expect(screen.getByText(/external/i)).toBeInTheDocument();
    expect(screen.getByText(/secure email/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /archived conversations/i })).not.toBeInTheDocument();

    await user.click(screen.getByTitle(/back to practice dashboard/i));
    await user.click(screen.getByRole('button', { name: /archive channel/i }));
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
    expect(screen.getByText(/^alice cooper$/i, { selector: 'p' })).toBeInTheDocument();
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
