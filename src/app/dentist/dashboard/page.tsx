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
import { DashboardDocumentActionModals } from '@/components/prototype/DashboardDocumentActionModals';
import { DashboardDocumentRow } from '@/components/prototype/DashboardDocumentRow';
import { DashboardSidebarList } from '@/components/prototype/DashboardSidebarList';
import { DentistDashboardHeader } from '@/components/prototype/DentistDashboardHeader';
import { DentistSentReferralsSection } from '@/components/prototype/DentistSentReferralsSection';
import { PrototypeDocumentSection } from '@/components/prototype/PrototypeDocumentSection';
import { PrototypeToast } from '@/components/prototype/PrototypeToast';
import { getPrototypePageNumbers } from '@/prototype/pagination';
import { UnrecognizedSenderModal, type UnrecognizedSenderFormValues } from '@/components/prototype/UnrecognizedSenderModal';
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
import { getReferrals, saveReferrals, UnifiedReferral, initialReferrals, getReferralCode, isInRange, getNetwork, saveNetwork, getChannels, saveChannels, getMessages, saveMessages } from '@/lib/referrals';
import { getInitialDentistDocs, getInitialDentistArchivedDocs, specialistClinics } from '@/lib/mockGenerator';

// Referral type compatibility
export type SentReferral = UnifiedReferral;

import { InviteModal } from '@/components/InviteModal';

export default function DentistDashboardPage() {
  const { isTrialEnded, setShowPaywall } = useSubscription();
  const [referralsList, setReferralsList] = useState<UnifiedReferral[]>(initialReferrals);
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>('month');

  useEffect(() => {
    setTimeout(() => {
      setReferralsList(getReferrals());
    }, 0);
  }, []);

  const sentReferrals: SentReferral[] = referralsList.filter(r => r.id.startsWith('D-') || r.id === '1' || r.dentist.includes('Reed') || r.dentist.includes('Taylor'));
  
  const referralsSentCount = sentReferrals.filter(r => r.status !== 'Draft' && isInRange(r.receivedAt, timeRange)).length;
  const referralsScheduledCount = sentReferrals.filter(r => r.status === 'Scheduled' && isInRange(r.receivedAt, timeRange)).length;
  const specialtyCareCompleteCount = sentReferrals.filter(r => r.status === 'Completed' && isInRange(r.receivedAt, timeRange)).length;

  type DocumentItem = DashboardDocumentItem;

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [archivedDocuments, setArchivedDocuments] = useState<DocumentItem[]>([]);
  const [activeInboxTab, setActiveInboxTab] = useState<'inbox' | 'archived'>('inbox');

  const [activeModal, setActiveModal] = useState<'convert' | 'attach' | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [convertPatientName, setConvertPatientName] = useState('');
  const [attachSearchQuery, setAttachSearchQuery] = useState('');
  const [unrecognizedDoc, setUnrecognizedDoc] = useState<DocumentItem | null>(null);

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
    setSelectedDocument(null);
    router.push(transfer.destinationHref);
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
    
    const newId = `D-${1000 + referralsList.length + 1}`;
    const newReferral: UnifiedReferral = {
      id: newId,
      patientName: convertPatientName || 'NEW PATIENT',
      type: 'Referral Case',
      source: 'App',
      completion: 0,
      status: 'Sent',
      receivedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastUpdate: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      nextStep: 'Waiting for specialist review',
      dentist: 'Dr. Taylor Reed',
      specialist: selectedDocument.sender,
      practice: selectedDocument.sender,
      urgency: 'Routine',
      sender: 'Dr. Taylor Reed'
    };

    const updatedReferrals = [newReferral, ...referralsList];
    setReferralsList(updatedReferrals);
    saveReferrals(updatedReferrals);
    
    // Archive or remove from active docs
    const updatedDocs = documents.filter(d => d.id !== selectedDocument.id);
    saveDocumentsToStorage(updatedDocs);
    
    setActiveModal(null);
    setSelectedDocument(null);
    
    triggerToast(`Converted ${selectedDocument.name} to referral for ${newReferral.patientName}!`);
  };

  const handleAttachDocument = (doc: DocumentItem) => {
    setSelectedDocument(doc);
    setAttachSearchQuery('');
    setActiveModal('attach');
  };

  const handleConfirmAttach = (referralId: string) => {
    if (!selectedDocument) return;

    const updatedReferrals = referralsList.map(ref => {
      if (ref.id === referralId) {
        return {
          ...ref,
          completion: Math.min(ref.completion + 10, 100),
          lastUpdate: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          nextStep: `Attached: ${selectedDocument.name}`
        };
      }
      return ref;
    });

    setReferralsList(updatedReferrals);
    saveReferrals(updatedReferrals);

    const updatedDocs = documents.filter(d => d.id !== selectedDocument.id);
    saveDocumentsToStorage(updatedDocs);
    setActiveModal(null);
    
    const targetRef = referralsList.find(r => r.id === referralId);
    triggerToast(`Attached ${selectedDocument.name} to referral for ${targetRef?.patientName || 'patient'}.`);
    setSelectedDocument(null);
  };

  const filteredAttachReferrals = React.useMemo(() => {
    return sentReferrals.filter(ref => {
      const matchesSearch = ref.patientName.toLowerCase().includes(attachSearchQuery.toLowerCase()) ||
                            ref.specialist.toLowerCase().includes(attachSearchQuery.toLowerCase());
      return matchesSearch && ref.status !== 'Completed' && ref.status !== 'Archived';
    });
  }, [sentReferrals, attachSearchQuery]);

  const handleIdentifyDocument = (doc: DocumentItem) => {
    setUnrecognizedDoc(doc);
  };

  const handleConfirmUnrecognized = (values: UnrecognizedSenderFormValues) => {
    if (!unrecognizedDoc) return;

    // Remove from inbox
    const updatedDocs = documents.filter(d => d.id !== unrecognizedDoc.id);
    saveDocumentsToStorage(updatedDocs);

    if (values.itemType === 'referral') {
      // Create a new referral entry
      const newId = `D-${1000 + referralsList.length + 1}`;
      const newReferral: UnifiedReferral = {
        id: newId,
        patientName: values.patientName || 'NEW PATIENT',
        type: 'Referral Case',
        source: unrecognizedDoc.transport || 'External',
        completion: 0,
        status: 'Sent',
        receivedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        lastUpdate: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        nextStep: 'Waiting for specialist review',
        dentist: 'Dr. Taylor Reed',
        specialist: values.senderPractice,
        practice: values.senderPractice,
        urgency: 'Routine',
        sender: 'Dr. Taylor Reed',
      };
      const updatedReferrals = [newReferral, ...referralsList];
      setReferralsList(updatedReferrals);
      saveReferrals(updatedReferrals);
      triggerToast(`Referral case created for ${newReferral.patientName} from ${values.senderPractice}.`);
    } else {
      // Route as document to inter-practice channel
      const resolvedDoc = {
        ...unrecognizedDoc,
        sender: values.senderPractice,
        isUnrecognized: false,
        isExternal: true,
      };
      const transfer = buildDashboardDocumentChannelTransfer({
        doc: resolvedDoc,
        role: 'dentist',
        network: getNetwork(),
        channels: getChannels(true),
        messages: getMessages(),
        addSharedDocument: (sharedDocument) => initialDocuments.push(sharedDocument),
      });
      saveNetwork(transfer.network);
      saveChannels(true, transfer.channels);
      saveMessages(transfer.messages);
      triggerToast(
        `Document routed to ${values.senderPractice} channel.`,
        { label: 'Open Channel', onClick: () => router.push(transfer.destinationHref) }
      );
    }

    setUnrecognizedDoc(null);
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
            if (isTrialEnded) {
              setShowPaywall(true);
            } else {
              router.push('/dentist/dashboard/send-document');
            }
          }}
        />
        <DashboardStats
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onStatClick={(path) => router.push(path)}
          stats={[
            { label: 'Patients Sent', value: referralsSentCount.toString().padStart(2, '0'), icon: FileText, path: '/dentist/referrals?tab=Received', trend: 12 },
            { label: 'Patients Scheduled', value: referralsScheduledCount.toString().padStart(2, '0'), icon: Calendar, path: '/dentist/referrals?tab=Scheduled', trend: 5 },
            { label: 'Specialty Care Complete', value: specialtyCareCompleteCount.toString().padStart(2, '0'), icon: FileText, path: '/dentist/referrals?tab=Completed', trend: -2 },
            { label: '# drtalk connections', value: specialistClinics.length.toString(), icon: Users, path: '/dentist/network?tab=connected', trend: 20 },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Action Area */}
          <div className="lg:col-span-8 space-y-8">
            <PrototypeDocumentSection
              inboxCount={documents.length}
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
                      isArchived={activeInboxTab === 'archived'}
                      onOpenDocument={() => router.push(`/documents/${doc.id}?role=dentist`)}
                      onConvert={() => handleConvertDocument(doc)}
                      onAttach={() => handleAttachDocument(doc)}
                      onIdentify={() => handleIdentifyDocument(doc)}
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
              items={[
                { id: '3', name: 'Arizona Periodontics', message: 'Scottsdale, AZ', meta: 'Periodontics', actionLabel: 'Connect', onAction: () => triggerToast('Connection request sent to Arizona Periodontics') },
                { id: '5', name: 'Skyline Orthodontics', message: 'Phoenix, AZ', meta: 'Orthodontics', actionLabel: 'Connect', onAction: () => triggerToast('Connection request sent to Skyline Orthodontics') },
                { id: '4', name: 'Desert Dental Implants', message: 'Tempe, AZ', meta: 'Implantology', actionLabel: 'Connect', onAction: () => triggerToast('Connection request sent to Desert Dental Implants') },
              ]}
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

      {activeModal && selectedDocument && (
        <DashboardDocumentActionModals
          mode={activeModal}
          documentName={selectedDocument.name}
          convertPatientName={convertPatientName}
          attachSearchQuery={attachSearchQuery}
          attachReferrals={filteredAttachReferrals.map((ref) => ({
            id: ref.id,
            patientName: ref.patientName,
            detail: `To: ${ref.specialist} - ${ref.nextStep || 'Sent'}`,
          }))}
          attachSearchPlaceholder="Search patient or practice..."
          onPatientNameChange={setConvertPatientName}
          onAttachSearchChange={setAttachSearchQuery}
          onClose={() => setActiveModal(null)}
          onConfirmConvert={handleConfirmConvert}
          onConfirmAttach={handleConfirmAttach}
        />
      )}

      {unrecognizedDoc && (
        <UnrecognizedSenderModal
          documentName={unrecognizedDoc.name}
          documentSize={unrecognizedDoc.size}
          transport={unrecognizedDoc.transport || 'Email'}
          onClose={() => setUnrecognizedDoc(null)}
          onConfirm={handleConfirmUnrecognized}
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
    </MainLayout>
  );
}
