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


describe('prototype components: referral flows.test', () => {
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

    expect(screen.getByText(/connected practices/i)).toBeInTheDocument();
    expect(screen.getByText(/^sunshine dental$/i)).toBeInTheDocument();
    expect(screen.getByText(/selected: sunshine dental/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove sunshine dental/i }));
    await user.type(screen.getByPlaceholderText(/type to search and add practice/i), 'ley');
    await user.click(screen.getByRole('button', { name: /toggle practice dropdown/i }));
    await user.click(screen.getByText(/^valley endodontics$/i));
    await user.click(screen.getByRole('button', { name: /clear selected practices/i }));

    expect(onTargetPracticesChange).toHaveBeenCalledWith([]);
    expect(onSearchChange).toHaveBeenCalled();
    expect(onDropdownChange).toHaveBeenCalledWith(false);
    expect(onTargetPracticesChange).toHaveBeenCalledWith(['Valley Endodontics']);

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
});
