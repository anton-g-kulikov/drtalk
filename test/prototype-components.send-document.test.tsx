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


describe('prototype components: send document.test', () => {
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
    expect(screen.getByText(/alice cooper/i)).toBeInTheDocument();
    expect(screen.getByText(/\(ref-d1001\)/i)).toBeInTheDocument();
    expect(screen.getByText(/valley endodontics/i)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/search or select referral/i), ' 1001');
    await user.click(screen.getByRole('button', { name: /toggle referral selector/i }));
    await user.click(screen.getByText(/none \/ new referral/i));
    await user.click(screen.getByText(/alice cooper/i));

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
});
