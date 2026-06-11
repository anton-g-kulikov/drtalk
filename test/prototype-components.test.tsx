import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DashboardStats } from '@/components/prototype/DashboardStats';
import { DashboardActionCard } from '@/components/prototype/DashboardActionCard';
import { PrototypeToast } from '@/components/prototype/PrototypeToast';
import { PrototypeDocumentSection } from '@/components/prototype/PrototypeDocumentSection';
import { ChannelDocumentsPane } from '@/components/prototype/ChannelDocumentsPane';
import { ChannelItem, Message } from '@/components/prototype/ChannelPrimitives';
import { AttachedDocumentPreview, ChannelAttachmentDrawer } from '@/components/prototype/ChannelAttachmentControls';
import { ChannelDocumentPreviewOverlay } from '@/components/prototype/ChannelDocumentPreviewOverlay';
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

    await user.click(screen.getByRole('button', { name: /clear/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(onSearchQueryChange).toHaveBeenCalledWith('');
    expect(onPageChange).toHaveBeenCalledWith(3);
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
      />
    );

    expect(screen.getByText(/1 files/i)).toBeInTheDocument();
    expect(screen.getByText(/endo-scan.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/shared by/i)).toBeInTheDocument();
    expect(screen.getByText(/you/i)).toBeInTheDocument();

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
});
