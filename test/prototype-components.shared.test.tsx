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


describe('prototype components: shared.test', () => {
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
});
