"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Users, FileText, Calendar
} from 'lucide-react';

import { useVerification } from '@/components/VerificationContext';
import { useSubscription } from '@/components/SubscriptionContext';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { DashboardStats, type DashboardTimeRange } from '@/components/prototype/DashboardStats';

import { DashboardDocumentRow } from '@/components/prototype/DashboardDocumentRow';
import { DashboardSidebarList } from '@/components/prototype/DashboardSidebarList';
import { DentistDashboardHeader } from '@/components/prototype/DentistDashboardHeader';
import { DentistSentReferralsSection } from '@/components/prototype/DentistSentReferralsSection';
import { PrototypeDocumentSection } from '@/components/prototype/PrototypeDocumentSection';
import { PrototypeToast } from '@/components/prototype/PrototypeToast';
import { ChannelDocumentPreviewOverlay } from '@/components/prototype/ChannelDocumentPreviewOverlay';
import { ForwardDocumentModal } from '@/components/prototype/ForwardDocumentModal';
import { forwardDocument } from '@/prototype/sendDocumentFlow';
import { getPrototypePageNumbers } from '@/prototype/pagination';
import {
  buildDashboardDocumentChannelTransfer,
  type DashboardDocumentItem,
} from '@/prototype/dashboardDocuments';
import {
  loadDashboardDocumentStorage,
  saveDashboardDocumentsToStorage,
} from '@/prototype/dashboardDocumentStorage';
import {
  initialDocuments,
  initialMessages,
  mockChannels,
} from '@/prototype/channelFixtures';
import type { MessageItem, SharedDocument } from '@/prototype/channelTypes';
import { getReferrals, saveReferrals, UnifiedReferral, initialReferrals, getReferralCode, isInRange, getNetwork, saveNetwork, getChannels, saveChannels, getMessages, saveMessages, type NetworkPractice } from '@/lib/referrals';
import { getInitialDentistDocs, getInitialDentistArchivedDocs, specialistClinics } from '@/lib/mockGenerator';

// Referral type compatibility
export type SentReferral = UnifiedReferral;

import { InviteModal } from '@/components/InviteModal';

export default function DentistDashboardPage() {
  const { isTrialEnded, setShowPaywall } = useSubscription();
  const [referralsList, setReferralsList] = useState<UnifiedReferral[]>(initialReferrals);
  const [networkList, setNetworkList] = useState<NetworkPractice[]>([]);
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>('month');

  useEffect(() => {
    setTimeout(() => {
      setReferralsList(getReferrals());
      setNetworkList(getNetwork());
    }, 0);
  }, []);

  const suggestedConnections = networkList.filter(p => 
    p.type === 'Specialist' && 
    (p.status === 'Nearby' || p.status === 'Suggested') && 
    !p.dismissed
  );

  const handleDismissSuggestion = (id: string) => {
    const updated = networkList.map(p => p.id === id ? { ...p, dismissed: true } : p);
    setNetworkList(updated);
    saveNetwork(updated);
    triggerToast('Suggestion dismissed');
  };

  const handleConnectSuggestion = (practice: NetworkPractice) => {
    const updated = networkList.map(p => p.id === practice.id ? { ...p, status: 'Connected' as const } : p);
    setNetworkList(updated);
    saveNetwork(updated);
    triggerToast(`Connection request sent to ${practice.name}`);
  };

  const sentReferrals: SentReferral[] = referralsList.filter(r => r.id.startsWith('D-') || r.id === '1' || (r.practice && r.practice.toLowerCase() === 'sunshine dental') || (r.dentist && (r.dentist.includes('Reed') || r.dentist.includes('Taylor'))));
  
  const referralsSentCount = sentReferrals.filter(r => r.status !== 'Draft' && isInRange(r.receivedAt, timeRange)).length;
  const referralsScheduledCount = sentReferrals.filter(r => r.status === 'Scheduled' && isInRange(r.receivedAt, timeRange)).length;
  const referralsReleasedCount = sentReferrals.filter(r => (r.dentistStatus || r.status) === 'Released' && isInRange(r.receivedAt, timeRange)).length;

  type DocumentItem = DashboardDocumentItem;

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [archivedDocuments, setArchivedDocuments] = useState<DocumentItem[]>([]);
  const [activeInboxTab, setActiveInboxTab] = useState<'inbox' | 'spam'>('inbox');

  const [previewDocument, setPreviewDocument] = useState<SharedDocument | null>(null);

  // Forward Document state
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [documentToForward, setDocumentToForward] = useState<DocumentItem | null>(null);

  const handleForwardDocument = (doc: DocumentItem) => {
    setDocumentToForward(doc);
    setIsForwardModalOpen(true);
  };

  const handleConfirmForward = (
    targets: { name: string; isCustom?: boolean; customType?: 'email' | 'fax' }[],
    note: string
  ) => {
    if (!documentToForward) return;

    const toastOutcome = forwardDocument({
      role: 'dentist',
      document: {
        name: documentToForward.name,
        size: documentToForward.size,
      },
      targets,
      note,
    });

    triggerToast(toastOutcome.message, {
      label: 'VIEW CHAT',
      onClick: () => {
        router.push(toastOutcome.destinationHref);
      },
    });

    setIsForwardModalOpen(false);
    setDocumentToForward(null);
  };

  const handleViewDocument = (doc: DocumentItem) => {
    const sharedDoc: SharedDocument = {
      id: doc.id,
      channelId: doc.caseId || 'dashboard',
      name: doc.name,
      size: doc.size,
      type: doc.name.toLowerCase().endsWith('.png') || doc.name.toLowerCase().endsWith('.jpg') || doc.name.toLowerCase().endsWith('.jpeg') ? 'image' : 'pdf',
      sentBy: doc.sender,
      sentAt: doc.date
    };
    setPreviewDocument(sharedDoc);
  };

  useEffect(() => {
    const storage = loadDashboardDocumentStorage({
      activeKey: 'drtalk_dentist_docs',
      archivedKey: 'drtalk_dentist_archived_docs',
      getActiveDefaults: getInitialDentistDocs,
      getArchivedDefaults: getInitialDentistArchivedDocs,
    });
    setDocuments(storage.active);
    setArchivedDocuments(storage.archived);
  }, []);

  const saveDocumentsToStorage = (newDocs: DocumentItem[]) => {
    setDocuments(newDocs);
    saveDashboardDocumentsToStorage('drtalk_dentist_docs', newDocs);
  };

  const handleArchiveDocument = (id: string) => {
    const docToArchive = documents.find(d => d.id === id);
    if (!docToArchive) return;
    const updatedActive = documents.filter(d => d.id !== id);
    const updatedArchived = [docToArchive, ...archivedDocuments];
    setDocuments(updatedActive);
    setArchivedDocuments(updatedArchived);
    saveDashboardDocumentsToStorage('drtalk_dentist_docs', updatedActive);
    saveDashboardDocumentsToStorage('drtalk_dentist_archived_docs', updatedArchived);
    triggerToast(`Marked ${docToArchive.name} as Spam`);
  };

  const handleUnarchiveDocument = (id: string) => {
    const docToRestore = archivedDocuments.find(d => d.id === id);
    if (!docToRestore) return;
    const updatedArchived = archivedDocuments.filter(d => d.id !== id);
    const updatedActive = [docToRestore, ...documents];
    setDocuments(updatedActive);
    setArchivedDocuments(updatedArchived);
    saveDashboardDocumentsToStorage('drtalk_dentist_docs', updatedActive);
    saveDashboardDocumentsToStorage('drtalk_dentist_archived_docs', updatedArchived);
    triggerToast(`Restored ${docToRestore.name} to Inbox`);
  };

  // Search & Pagination states for Dashboard Documents
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [docCurrentPage, setDocCurrentPage] = useState(1);

  // Reset page to 1 when search query or tab changes
  useEffect(() => {
    setDocCurrentPage(1);
  }, [docSearchQuery, activeInboxTab]);

  const filteredDocs = React.useMemo(() => {
    const list = activeInboxTab === 'inbox' ? documents : archivedDocuments;
    return list.filter(d => 
      d.name.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      d.sender.toLowerCase().includes(docSearchQuery.toLowerCase())
    );
  }, [documents, archivedDocuments, activeInboxTab, docSearchQuery]);

  const DOCS_PER_PAGE = 5;
  const totalDocPages = Math.ceil(filteredDocs.length / DOCS_PER_PAGE);
  const paginatedDocs = React.useMemo(() => {
    const start = (docCurrentPage - 1) * DOCS_PER_PAGE;
    return filteredDocs.slice(start, start + DOCS_PER_PAGE);
  }, [filteredDocs, docCurrentPage]);

  const handleOpenInChannel = (doc: DocumentItem) => {
    const transfer = buildDashboardDocumentChannelTransfer({
      doc,
      role: 'dentist',
      network: getNetwork(),
      channels: getChannels(true),
      messages: getMessages(),
      addSharedDocument: (sharedDocument) => initialDocuments.push(sharedDocument),
    });

    saveNetwork(transfer.network);
    saveChannels(true, transfer.channels);
    saveMessages(transfer.messages);

    // Remove from dashboard inbox
    const updatedDocs = documents.filter(d => d.id !== doc.id);
    saveDocumentsToStorage(updatedDocs);
    router.push(transfer.destinationHref);
  };

  const handleIdentifyDocument = (doc: DocumentItem) => {
    router.push(`/referrals/${doc.id}`);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [referralsCurrentPage, setReferralsCurrentPage] = useState(1);
  const REFERRALS_PER_PAGE = 10;

  // Reset page when search query changes
  useEffect(() => {
    setReferralsCurrentPage(1);
  }, [searchQuery]);
  const router = useRouter();
  const { isVerified, hasPracticeOwner } = useVerification();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState('Team Member');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastAction, setToastAction] = useState<{ label: string; onClick: () => void } | null>(null);

  const triggerToast = (msg: string, action?: { label: string; onClick: () => void }) => {
    setToastMessage(msg);
    setToastAction(action || null);
    setTimeout(() => {
      setToastMessage(null);
      setToastAction(null);
    }, 6000);
  };

  const filteredReferrals = sentReferrals.filter((referral) =>
    referral.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    referral.specialist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    referral.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalReferralPages = Math.ceil(filteredReferrals.length / REFERRALS_PER_PAGE);
  const paginatedReferrals = React.useMemo(() => {
    const start = (referralsCurrentPage - 1) * REFERRALS_PER_PAGE;
    return filteredReferrals.slice(start, start + REFERRALS_PER_PAGE);
  }, [filteredReferrals, referralsCurrentPage]);

  return (
    <MainLayout title="Dentist Dashboard">
      <div className="max-w-6xl mx-auto space-y-8">

        <DentistDashboardHeader
          isVerified={isVerified}
          hasPracticeOwner={hasPracticeOwner}
          onVerifyIdentity={() => router.push('/verify')}
          onInvitePracticeOwner={() => {
            setInviteRole('Owner');
            setIsInviteModalOpen(true);
          }}
          onSendReferral={() => router.push('/dentist/referral')}
          onSendDocument={() => {
            router.push('/dentist/dashboard/send-document');
          }}
        />
        <DashboardStats
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onStatClick={(path) => router.push(path)}
          stats={[
            { label: 'Patients Referred', value: referralsSentCount.toString().padStart(2, '0'), icon: FileText, path: '/dentist/referrals?tab=Received', trend: 12 },
            { label: 'Patients Scheduled', value: referralsScheduledCount.toString().padStart(2, '0'), icon: Calendar, path: '/dentist/referrals?tab=Scheduled', trend: 5 },
            { label: 'Patients Released', value: referralsReleasedCount.toString().padStart(2, '0'), icon: FileText, path: '/dentist/referrals?tab=Released', trend: -2 },
            { label: '# drtalk connections', value: specialistClinics.length.toString(), icon: Users, path: '/dentist/network?tab=connected', trend: 20 },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Action Area */}
          <div className="lg:col-span-8 space-y-8">
            <PrototypeDocumentSection
              inboxCount={documents.length}
              spamCount={archivedDocuments.length}
              activeTab={activeInboxTab}
              onTabChange={setActiveInboxTab}
              searchQuery={docSearchQuery}
              onSearchQueryChange={setDocSearchQuery}
              isEmpty={filteredDocs.length === 0}
              currentPage={docCurrentPage}
              totalPages={totalDocPages}
              totalItems={filteredDocs.length}
              onPageChange={setDocCurrentPage}
            >
                  {paginatedDocs.map((doc) => (
                    <DashboardDocumentRow
                      key={doc.id}
                      document={doc}
                      isArchived={activeInboxTab === 'spam'}
                      onOpenDocument={() => handleViewDocument(doc)}
                      onForward={() => handleForwardDocument(doc)}
                      onIdentify={() => handleIdentifyDocument(doc)}
                      onArchive={handleArchiveDocument}
                      onUnarchive={handleUnarchiveDocument}
                      onOpenChannel={() => {
                        if (doc.fromChannel) {
                          const practiceName = doc.channelName || doc.sender;
                          const url = doc.channelType === 'case'
                            ? `/dentist/channels?practice=${encodeURIComponent(practiceName)}&caseId=${doc.caseId}&tab=documents`
                            : `/dentist/channels?practice=${encodeURIComponent(practiceName)}&tab=documents`;
                          router.push(url);
                        } else {
                          handleOpenInChannel(doc);
                        }
                      }}
                    />
                  ))}
            </PrototypeDocumentSection>

            <DentistSentReferralsSection
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              referrals={paginatedReferrals.map((referral) => ({
                id: referral.id,
                patientName: referral.patientName,
                sender: referral.sender || referral.dentist || 'Practice Team',
                specialist: referral.specialist,
                code: getReferralCode(referral.id),
                status: referral.status,
                lastUpdate: referral.lastUpdate || referral.receivedAt,
                urgency: referral.urgency,
              }))}
              currentPage={referralsCurrentPage}
              totalPages={totalReferralPages}
              totalItems={filteredReferrals.length}
              onPageChange={setReferralsCurrentPage}
              onReferralClick={(id) => {
                const referral = paginatedReferrals.find((item) => item.id === id);
                if (referral) {
                  router.push(`/dentist/channels?practice=${encodeURIComponent(referral.specialist)}&caseId=case_${referral.id}`);
                }
              }}
              onViewAll={() => router.push('/dentist/referrals')}
            />
          </div>

          {/* Side Column */}
          <div className="lg:col-span-4 space-y-8">

            <DashboardSidebarList
              title="Recent Conversations"
              icon={<MessageSquare size={18} />}
              items={[
                { id: 1, name: 'team-members', message: 'Did anyone review the morning labs yet?', initials: 'TM', meta: 'Internal', timestamp: '10:05 AM\n05/11/2026', onClick: () => router.push('/dentist/channels') },
                { id: 2, name: 'Valley Endodontics', message: 'Regarding Alice Cooper: pano received.', initials: 'VE', meta: 'Inter-Practice', timestamp: '10:05 AM\n05/11/2026', onClick: () => router.push('/dentist/channels?practice=Valley%20Endodontics') },
                { id: 3, name: 'Downtown Oral Surgery', message: 'Requesting pano image for Marco Reyes.', initials: 'DO', meta: 'Inter-Practice', timestamp: '10:05 AM\n05/11/2026', onClick: () => router.push('/dentist/channels?practice=Downtown%20Oral%20Surgery') },
                { id: 4, name: 'Alice Cooper', message: 'Got it, thank you!', initials: 'AC', meta: 'Patient', timestamp: '10:05 AM\n05/11/2026', onClick: () => router.push('/dentist/channels?practice=Alice%20Cooper') },
                { id: 5, name: 'Case Coordination Group', message: 'Dr. Jones joined the group.', initials: 'CC', meta: 'Group', timestamp: '10:05 AM\n05/11/2026', onClick: () => router.push('/dentist/channels') },
              ]}
            />

             <DashboardSidebarList
              title="Suggested Connections"
              icon={<Users size={18} />}
              items={suggestedConnections.map(p => ({
                id: p.id,
                name: p.name,
                message: p.location,
                meta: p.specialty,
                actionLabel: 'Connect',
                onAction: () => handleConnectSuggestion(p),
                onDismiss: () => handleDismissSuggestion(p.id)
              }))}
            />

            {/* Commented out Trial widget for Dentist profile */}
            {/* <SubscriptionBanner /> */}
          </div>

        </div>
      </div>

      {/* Premium Toast Banner */}
      {toastMessage && (
        <PrototypeToast
          message={toastMessage}
          action={toastAction}
          placement="top-right"
        />
      )}



      {previewDocument && (
        <ChannelDocumentPreviewOverlay
          document={previewDocument}
          activePracticeName="Sunshine Dental"
          onClose={() => setPreviewDocument(null)}
          onDownload={(document) => {
            setPreviewDocument(null);
            triggerToast(`Downloading "${document.name}"...`);
          }}
        />
      )}

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        defaultRole={inviteRole}
        onSuccess={(email) => {
          triggerToast(`Invitation sent to ${email}`);
        }}
      />

      <ForwardDocumentModal
        isOpen={isForwardModalOpen}
        onClose={() => {
          setIsForwardModalOpen(false);
          setDocumentToForward(null);
        }}
        documentName={documentToForward?.name || ''}
        documentSize={documentToForward?.size || ''}
        isDentist={true}
        onConfirmForward={handleConfirmForward}
      />
    </MainLayout>
  );
}
