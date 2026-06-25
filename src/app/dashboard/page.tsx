"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout";
import {
  AlertCircle, MessageSquare, ArrowUpRight,
  TrendingUp, Users, FileText, Send, Upload, X, UserPlus, Archive, Clock, Calendar, Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useVerification } from '@/components/VerificationContext';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { InviteModal } from '@/components/InviteModal';
import { DashboardStats, type DashboardTimeRange } from '@/components/prototype/DashboardStats';
import { DashboardDocumentActionModals } from '@/components/prototype/DashboardDocumentActionModals';
import { DashboardDocumentRow } from '@/components/prototype/DashboardDocumentRow';
import { DashboardSidebarList } from '@/components/prototype/DashboardSidebarList';
import { PrototypeDocumentSection } from '@/components/prototype/PrototypeDocumentSection';
import { PrototypeToast } from '@/components/prototype/PrototypeToast';
import { SpecialistDashboardHeader } from '@/components/prototype/SpecialistDashboardHeader';
import { SpecialistReferralQueues } from '@/components/prototype/SpecialistReferralQueues';
import { ChannelDocumentPreviewOverlay } from '@/components/prototype/ChannelDocumentPreviewOverlay';
import { ForwardDocumentModal } from '@/components/prototype/ForwardDocumentModal';
import { forwardDocument } from '@/prototype/sendDocumentFlow';
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
} from '@/prototype/channelFixtures';
import type { SharedDocument } from '@/prototype/channelTypes';
import { getReferrals, isInRange, UnifiedReferral, getNetwork, saveNetwork, getChannels, saveChannels, getMessages, saveMessages, type NetworkPractice } from '@/lib/referrals';
import { 
  getInitialSpecialistDocs, 
  getInitialSpecialistArchivedDocs,
} from '@/lib/mockGenerator';

// Helper functions defined outside the React component to satisfy the React Compiler's strict purity/immutability checks.
function getNewId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

function getFormattedDateOnly(): string {
  return new Date().toLocaleDateString('en-US');
}

function addSharedDocumentToDb(newDoc: SharedDocument) {
  initialDocuments.push(newDoc);
}

export default function DashboardPage() {
  const router = useRouter();
  const { isVerified, hasPracticeOwner } = useVerification();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState('Team Member');
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>('month');
  const [referralsList, setReferralsList] = useState<UnifiedReferral[]>([]);
  const [networkList, setNetworkList] = useState<NetworkPractice[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setReferralsList(getReferrals());
      setNetworkList(getNetwork());
    }, 0);
  }, []);

  const suggestedConnections = networkList.filter(p => 
    p.type === 'Dentist' && 
    (p.status === 'Nearby' || p.status === 'Suggested') && 
    !p.isExternal &&
    !p.dismissed
  );

  const handleDismissSuggestion = (id: string) => {
    const updated = networkList.map(p => p.id === id ? { ...p, dismissed: true } : p);
    setNetworkList(updated);
    saveNetwork(updated);
    showToast('Suggestion dismissed');
  };

  const handleConnectSuggestion = (practice: NetworkPractice) => {
    const updated = networkList.map(p => p.id === practice.id ? { ...p, status: 'Connected' as const } : p);
    setNetworkList(updated);
    saveNetwork(updated);
    showToast(`Connection request sent to ${practice.name}`);
  };

  const specialistReferrals = referralsList.filter(r => !r.id.startsWith('D-'));
  
  const referralsReceivedCount = specialistReferrals.filter(r => r.status !== 'Draft' && isInRange(r.receivedAt, timeRange)).length;
  const referralsScheduledCount = specialistReferrals.filter(r => r.status === 'Scheduled' && isInRange(r.receivedAt, timeRange)).length;
  const referralsReleasedCount = specialistReferrals.filter(r => r.status === 'Released' && isInRange(r.receivedAt, timeRange)).length;

  // Defined after state declarations below — see handleReferralClick near referrals state

  type DocumentItem = DashboardDocumentItem;

  interface ReferralItem {
    id: string;
    patient: string;
    type: string;
    source: string;
    dentist?: string;
    date: string;
    status: 'new_processing' | 'new_docs';
    detail: string;
    urgency?: 'Routine' | 'Urgent' | 'Emergency';
    isExternal?: boolean;
    transport?: 'Email' | 'Fax' | 'App';
    isUnrecognized?: boolean;
  }

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [archivedDocuments, setArchivedDocuments] = useState<DocumentItem[]>([]);
  const [activeInboxTab, setActiveInboxTab] = useState<'inbox' | 'spam'>('inbox');

  useEffect(() => {
    const storage = loadDashboardDocumentStorage({
      activeKey: 'drtalk_specialist_docs',
      archivedKey: 'drtalk_specialist_archived_docs',
      getActiveDefaults: getInitialSpecialistDocs,
      getArchivedDefaults: getInitialSpecialistArchivedDocs,
    });
    setDocuments(storage.active);
    setArchivedDocuments(storage.archived);
  }, []);

  const saveDocumentsToStorage = (newDocs: DocumentItem[]) => {
    setDocuments(newDocs);
    saveDashboardDocumentsToStorage('drtalk_specialist_docs', newDocs);
  };

  const handleArchiveDocument = (id: string) => {
    const docToArchive = documents.find(d => d.id === id);
    if (!docToArchive) return;
    const updatedActive = documents.filter(d => d.id !== id);
    const updatedArchived = [docToArchive, ...archivedDocuments];
    setDocuments(updatedActive);
    setArchivedDocuments(updatedArchived);
    saveDashboardDocumentsToStorage('drtalk_specialist_docs', updatedActive);
    saveDashboardDocumentsToStorage('drtalk_specialist_archived_docs', updatedArchived);
    showToast(`Document ${docToArchive.name} archived!`);
  };

  const handleSpamDocument = (id: string) => {
    const docToSpam = documents.find(d => d.id === id);
    if (!docToSpam) return;
    const updatedActive = documents.filter(d => d.id !== id);
    const updatedArchived = [docToSpam, ...archivedDocuments];
    setDocuments(updatedActive);
    setArchivedDocuments(updatedArchived);
    saveDashboardDocumentsToStorage('drtalk_specialist_docs', updatedActive);
    saveDashboardDocumentsToStorage('drtalk_specialist_archived_docs', updatedArchived);
    showToast(`Marked ${docToSpam.name} as Spam`);
  };

  const handleUnarchiveDocument = (id: string) => {
    const docToRestore = archivedDocuments.find(d => d.id === id);
    if (!docToRestore) return;
    const updatedArchived = archivedDocuments.filter(d => d.id !== id);
    const updatedActive = [docToRestore, ...documents];
    setDocuments(updatedActive);
    setArchivedDocuments(updatedArchived);
    saveDashboardDocumentsToStorage('drtalk_specialist_docs', updatedActive);
    saveDashboardDocumentsToStorage('drtalk_specialist_archived_docs', updatedArchived);
    showToast(`Restored ${docToRestore.name} to Inbox`);
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
      role: 'specialist',
      network: getNetwork(),
      channels: getChannels(false),
      messages: getMessages(),
      addSharedDocument: addSharedDocumentToDb,
    });

    saveNetwork(transfer.network);
    saveChannels(false, transfer.channels);
    saveMessages(transfer.messages);

    // Remove from dashboard inbox
    const updatedDocs = documents.filter(d => d.id !== doc.id);
    saveDocumentsToStorage(updatedDocs);
    setSelectedDocument(null);
    router.push(transfer.destinationHref);
  };

  const [referrals, setReferrals] = useState<ReferralItem[]>([]);

  useEffect(() => {
    const loaded = referralsList
      .filter(r => !r.id.startsWith('D-') && (r.status === 'Received' || r.status === 'Sent' || r.status === 'Scheduled' || r.status === 'Accepted'))
      .map(r => ({
        id: r.id,
        patient: r.patientName,
        type: r.type,
        source: r.practice || r.dentist,
        dentist: r.dentist,
        date: r.receivedAt.includes('\n') ? r.receivedAt.split('\n')[1] : r.receivedAt,
        status: (r.status === 'Received' || r.status === 'Sent') ? 'new_processing' as const : 'new_docs' as const,
        detail: r.status === 'Received' ? 'Needs Review' : `Status: ${r.status}`,
        urgency: r.urgency,
        isExternal: r.id.startsWith('ext-'),
        transport: r.source as any,
      }));
    const unrecognized = [
      { id: 'doc-unrecognized-1', patient: 'Unknown', type: 'Unknown', source: 'Unknown — Via Fax', dentist: undefined, date: '06/30/2026', status: 'new_processing' as const, detail: 'Missing: Referring Practice', isExternal: true, transport: 'Fax' as const, isUnrecognized: true },
      { id: 'doc-unrecognized-2', patient: 'Unknown', type: 'Unknown', source: 'Unknown — Via Email', dentist: undefined, date: '06/30/2026', status: 'new_processing' as const, detail: 'Missing: Referring Practice', isExternal: true, transport: 'Email' as const, isUnrecognized: true },
    ];
    setReferrals([...unrecognized, ...loaded]);
  }, [referralsList]);

  const [activeModal, setActiveModal] = useState<'convert' | 'attach' | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [convertPatientName, setConvertPatientName] = useState('');
  const [attachSearchQuery, setAttachSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
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
      role: 'specialist',
      document: {
        name: documentToForward.name,
        size: documentToForward.size,
      },
      targets,
      note,
    });

    showToast(toastOutcome.message, {
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

  const handleReferralClick = (ref: ReferralItem) => {
    // Unrecognized-sender items now resolve in a dedicated page
    if (ref.id.startsWith('doc-unrecognized')) {
      router.push(`/referrals/${ref.id}`);
      return;
    }
    if (!isVerified) {
      router.push('/verify');
      return;
    }
    router.push(`/referrals/${ref.id}`);
  };

  const handleConvertDocument = (doc: DocumentItem) => {
    setSelectedDocument(doc);
    
    let guessedName = 'NEW PATIENT';
    if (doc.name.includes('ALICE_COOPER')) {
      guessedName = 'Alice Cooper';
    } else if (doc.name.includes('JOHN_DOE')) {
      guessedName = 'John Doe';
    } else if (doc.name.includes('BOB_MARLEY')) {
      guessedName = 'Bob Marley';
    }
    setConvertPatientName(guessedName);
    setActiveModal('convert');
  };

  const handleConfirmConvert = () => {
    if (!selectedDocument) return;
    
    const newReferral: ReferralItem = {
      id: getNewId('ref'),
      patient: convertPatientName || 'NEW PATIENT',
      type: 'Referral',
      source: selectedDocument.sender,
      date: getFormattedDateOnly(),
      status: 'new_processing',
      detail: `Converted from: ${selectedDocument.name}`,
      urgency: 'Routine'
    };

    setReferrals(prev => [newReferral, ...prev]);
    
    // Archive or remove from active docs
    const updatedDocs = documents.filter(d => d.id !== selectedDocument.id);
    saveDocumentsToStorage(updatedDocs);
    
    setActiveModal(null);
    setSelectedDocument(null);
    
    showToast(`Converted ${selectedDocument.name} to referral for ${newReferral.patient}!`);
  };


  const handleAttachDocument = (doc: DocumentItem) => {
    setSelectedDocument(doc);
    setAttachSearchQuery('');
    setActiveModal('attach');
  };

  const handleConfirmAttach = (referralId: string) => {
    if (!selectedDocument) return;

    setReferrals(prev => prev.map(ref => {
      if (ref.id === referralId) {
        return {
          ...ref,
          status: 'new_docs',
          detail: `Doc attached: ${selectedDocument.name}`
        };
      }
      return ref;
    }));

    const updatedDocs = documents.filter(d => d.id !== selectedDocument.id);
    saveDocumentsToStorage(updatedDocs);
    setActiveModal(null);
    
    const targetRef = referrals.find(r => r.id === referralId);
    showToast(`Attached ${selectedDocument.name} to ${targetRef?.patient || 'referral'}.`);
    setSelectedDocument(null);
  };

  const showToast = (message: string, action?: { label: string; onClick: () => void }) => {
    setToast({ message, type: 'success' });
    if (action) setToastAction(action);
    setTimeout(() => {
      setToast(null);
      setToastAction(null);
    }, 5000);
  };

  const handleIdentifyDocument = (doc: DocumentItem) => {
    router.push(`/referrals/${doc.id}`);
  };

  const newProcessingReferrals = referrals.filter(r => r.status === 'new_processing');
  const newDocsReferrals = referrals.filter(r => r.status === 'new_docs').slice(0, 2);
  const filteredAttachReferrals = referrals.filter(ref => 
    ref.patient.toLowerCase().includes(attachSearchQuery.toLowerCase()) ||
    ref.source.toLowerCase().includes(attachSearchQuery.toLowerCase()) ||
    (ref.detail && ref.detail.toLowerCase().includes(attachSearchQuery.toLowerCase()))
  );

  // Toast Action Link state
  const [toastAction, setToastAction] = useState<{ label: string; onClick: () => void } | null>(null);

  return (
    <MainLayout title="Practice Dashboard">
      <div className="max-w-6xl mx-auto space-y-8 pb-20">

        <SpecialistDashboardHeader
          isVerified={isVerified}
          hasPracticeOwner={hasPracticeOwner}
          onVerifyIdentity={() => router.push('/verify')}
          onInvitePracticeOwner={() => {
            setInviteRole('Owner');
            setIsInviteModalOpen(true);
          }}
          onSendDocument={() => router.push('/dashboard/send-document')}
        />


        <DashboardStats
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onStatClick={(path) => router.push(path)}
          stats={[
            { label: 'Referrals received', value: referralsReceivedCount.toString().padStart(2, '0'), icon: FileText, path: '/referrals?tab=Received', trend: 15 },
            { label: 'Referrals scheduled', value: referralsScheduledCount.toString().padStart(2, '0'), icon: Calendar, path: '/referrals?tab=Scheduled', trend: 8 },
            { label: 'Referrals Released', value: referralsReleasedCount.toString().padStart(2, '0'), icon: FileText, path: '/referrals?tab=Released', trend: -4 },
            { label: '# drtalk connections', value: '15', icon: Users, path: '/network?tab=connected', trend: 10 },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Action Area */}
          <div className="lg:col-span-8 space-y-8">

            <SpecialistReferralQueues
              totalCount={referrals.length}
              processingReferrals={newProcessingReferrals}
              documentReferrals={newDocsReferrals}
              onReferralClick={(id) => {
                const referral = referrals.find((item) => item.id === id);
                if (referral) handleReferralClick(referral);
              }}
              onViewAll={() => router.push('/referrals')}
            />
            
            <PrototypeDocumentSection
              className="pt-4"
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
                      onConvert={() => handleConvertDocument(doc)}
                      onAttach={() => handleAttachDocument(doc)}
                      onForward={() => handleForwardDocument(doc)}
                      onIdentify={() => handleIdentifyDocument(doc)}
                      onArchive={handleArchiveDocument}
                      onSpam={handleSpamDocument}
                      onUnarchive={handleUnarchiveDocument}
                      onOpenChannel={() => {
                        if (doc.fromChannel) {
                          const practiceName = doc.sender.toLowerCase().includes('smith') || doc.sender.toLowerCase().includes('sunshine')
                            ? 'Sunshine Dental'
                            : doc.sender.toLowerCase().includes('jane') || doc.sender.toLowerCase().includes('oakridge')
                              ? 'Oakridge Dental'
                              : doc.sender.toLowerCase().includes('miller') || doc.sender.toLowerCase().includes('robert')
                                ? 'Westside Pediatric Dentistry'
                                : 'Sunshine Dental';
                          const url = doc.channelType === 'case'
                            ? `/channels?practice=${encodeURIComponent(practiceName)}&caseId=${doc.caseId}&tab=documents`
                            : `/channels?practice=${encodeURIComponent(practiceName)}&tab=documents`;
                          router.push(url);
                        } else {
                          handleOpenInChannel(doc);
                        }
                      }}
                    />
                  ))}
            </PrototypeDocumentSection>
          </div>

          {/* Recent Conversations / Side Column */}
          <div className="lg:col-span-4 space-y-8">
            <DashboardSidebarList
              title="Recent Conversations"
              icon={<MessageSquare size={18} />}
              items={[
                { id: 1, name: 'TEAM-MEMBERS', message: 'Reviewing tooth #14...', initials: 'TM', meta: 'Internal', timestamp: '10:05 AM\n05/11/2026', onClick: () => router.push('/channels') },
                { id: 2, name: 'SUNSHINE DENTAL', message: 'Practice connection active.', initials: 'SD', meta: 'Inter-Practice', timestamp: '10:05 AM\n05/11/2026', onClick: () => router.push('/channels?practice=Sunshine%20Dental') },
                { id: 3, name: 'DOWNTOWN ORAL SURGERY', message: 'Referral sent for Bob Marley.', initials: 'DO', meta: 'Inter-Practice', timestamp: '10:05 AM\n05/11/2026', onClick: () => router.push('/channels?practice=Downtown%20Oral%20Surgery') },
                { id: 4, name: 'ALICE COOPER (SUNSHINE DENTAL)', message: 'Got it, thank you!', initials: 'AC', meta: 'Patient', timestamp: '10:05 AM\n05/11/2026', onClick: () => router.push('/channels?practice=Alice%20Cooper') },
                { id: 5, name: 'EMERGENCY CASE BOARD', message: 'Case discussion initiated.', initials: 'EC', meta: 'Group', timestamp: '10:05 AM\n05/11/2026', onClick: () => router.push('/channels') },
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

            <SubscriptionBanner />
          </div>

        </div>

        {activeModal && selectedDocument && (
          <DashboardDocumentActionModals
            mode={activeModal}
            documentName={selectedDocument.name}
            convertPatientName={convertPatientName}
            attachSearchQuery={attachSearchQuery}
            attachReferrals={filteredAttachReferrals.map((ref) => ({
              id: ref.id,
              patientName: ref.patient,
              detail: `From: ${ref.source} - ${ref.detail}`,
            }))}
            attachSearchPlaceholder="Search patient or source..."
            onPatientNameChange={setConvertPatientName}
            onAttachSearchChange={setAttachSearchQuery}
            onClose={() => setActiveModal(null)}
            onConfirmConvert={handleConfirmConvert}
            onConfirmAttach={handleConfirmAttach}
          />
        )}

        {previewDocument && (
          <ChannelDocumentPreviewOverlay
            document={previewDocument}
            activePracticeName="Valley Endodontics"
            onClose={() => setPreviewDocument(null)}
            onDownload={(document) => {
              setPreviewDocument(null);
              showToast(`Downloading "${document.name}"...`);
            }}
          />
        )}

        <ForwardDocumentModal
          isOpen={isForwardModalOpen}
          onClose={() => {
            setIsForwardModalOpen(false);
            setDocumentToForward(null);
          }}
          documentName={documentToForward?.name || ''}
          documentSize={documentToForward?.size || ''}
          isDentist={false}
          onConfirmForward={handleConfirmForward}
        />



      {/* Toast Notification */}
      {toast && (
        <PrototypeToast
          message={toast.message}
          action={toastAction ? {
            label: toastAction.label,
            onClick: () => {
              toastAction.onClick();
              setToast(null);
              setToastAction(null);
            },
          } : null}
          onDismiss={() => {
            setToast(null);
            setToastAction(null);
          }}
        />
      )}

      </div>
      <InviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        defaultRole={inviteRole}
        onSuccess={(email) => {
          showToast(`Invitation sent to ${email}`);
        }}
      />
    </MainLayout>
  );
}
