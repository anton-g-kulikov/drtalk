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
import { DashboardStats, type DashboardTimeRange } from '@/components/prototype/DashboardStats';
import { DashboardDocumentActionModals } from '@/components/prototype/DashboardDocumentActionModals';
import { DashboardDocumentRow } from '@/components/prototype/DashboardDocumentRow';
import { DashboardSidebarList } from '@/components/prototype/DashboardSidebarList';
import { DentistDashboardHeader } from '@/components/prototype/DentistDashboardHeader';
import { DentistSentReferralsSection } from '@/components/prototype/DentistSentReferralsSection';
import { PrototypeDocumentSection } from '@/components/prototype/PrototypeDocumentSection';
import { PrototypeToast } from '@/components/prototype/PrototypeToast';
import {
  initialDocuments,
} from '@/prototype/channelFixtures';
import type { SharedDocument } from '@/prototype/channelTypes';
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

  interface DocumentItem {
    id: string;
    name: string;
    sender: string;
    date: string;
    size: string;
    channelName?: string;
    fromChannel?: boolean;
    channelType?: 'practice' | 'case';
    caseId?: string;
  }

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [archivedDocuments, setArchivedDocuments] = useState<DocumentItem[]>([]);
  const [activeInboxTab, setActiveInboxTab] = useState<'inbox' | 'archived'>('inbox');

  const [activeModal, setActiveModal] = useState<'convert' | 'attach' | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [convertPatientName, setConvertPatientName] = useState('');
  const [attachSearchQuery, setAttachSearchQuery] = useState('');

  // Sync with localStorage
  useEffect(() => {
    const savedDocs = localStorage.getItem('drtalk_dentist_docs');
    const savedArchived = localStorage.getItem('drtalk_dentist_archived_docs');
    if (savedDocs) {
      try {
        const docs = JSON.parse(savedDocs);
        if (docs.length < 5) {
          const initialDentistDocs = getInitialDentistDocs();
          setDocuments(initialDentistDocs);
          localStorage.setItem('drtalk_dentist_docs', JSON.stringify(initialDentistDocs));
        } else {
          setTimeout(() => setDocuments(docs), 0);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      const initialDentistDocs = getInitialDentistDocs();
      setDocuments(initialDentistDocs);
      localStorage.setItem('drtalk_dentist_docs', JSON.stringify(initialDentistDocs));
    }
    if (savedArchived) {
      try {
        const archived = JSON.parse(savedArchived);
        if (archived.length < 5) {
          const initialDentistArchivedDocs = getInitialDentistArchivedDocs();
          setArchivedDocuments(initialDentistArchivedDocs);
          localStorage.setItem('drtalk_dentist_archived_docs', JSON.stringify(initialDentistArchivedDocs));
        } else {
          setTimeout(() => setArchivedDocuments(archived), 0);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      const initialDentistArchivedDocs = getInitialDentistArchivedDocs();
      setArchivedDocuments(initialDentistArchivedDocs);
      localStorage.setItem('drtalk_dentist_archived_docs', JSON.stringify(initialDentistArchivedDocs));
    }
  }, []);

  const saveDocumentsToStorage = (newDocs: DocumentItem[]) => {
    setDocuments(newDocs);
    localStorage.setItem('drtalk_dentist_docs', JSON.stringify(newDocs));
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
    let practiceName = doc.sender;
    if (practiceName.includes('Valley') || practiceName.includes('Endo')) {
      practiceName = 'Valley Endodontics';
    } else if (practiceName.includes('Downtown')) {
      practiceName = 'Downtown Oral Surgery';
    } else if (practiceName.includes('Metro')) {
      practiceName = 'Metro Orthodontics';
    } else if (practiceName.includes('Arizona')) {
      practiceName = 'Arizona Periodontics';
    } else if (practiceName.includes('Beverly')) {
      practiceName = 'Beverly Hills Dental';
    } else {
      practiceName = doc.sender.replace(' (Specialist)', '').replace(' (Dentist)', '');
    }

    // Add to Network if not exists
    const currentNetwork = getNetwork();
    const existsInNetwork = currentNetwork.some(p => p.name.toLowerCase() === practiceName.toLowerCase());
    if (!existsInNetwork) {
      const newPracticeId = 'ext_' + Math.random().toString(36).substring(2, 9);
      const newPractice = {
        id: newPracticeId,
        name: practiceName,
        type: 'Specialist',
        specialty: 'Endodontics',
        location: 'Phoenix, AZ',
        status: 'Connected' as const,
        verified: false,
        isExternal: true
      };
      saveNetwork([...currentNetwork, newPractice]);
    }

    // Add to Channels if not exists
    const isDentist = true;
    const currentChannels = getChannels(isDentist);
    const existsInChannels = currentChannels.some(c => c.name.toLowerCase() === practiceName.toLowerCase());
    let practiceId = '';
    if (!existsInChannels) {
      practiceId = 'ext_ch_' + Math.random().toString(36).substring(2, 9);
      const newChannel = {
        id: practiceId,
        name: practiceName,
        type: 'inter-practice' as const,
        lastMessage: `Practice channel created. Shared document: ${doc.name}`,
        memberCount: 2,
        isVerified: false,
        isExternal: true
      };
      saveChannels(isDentist, [...currentChannels, newChannel]);
    } else {
      const match = currentChannels.find(c => c.name.toLowerCase() === practiceName.toLowerCase());
      practiceId = match ? match.id : '3';
    }

    // Add Shared Document item to channel documents store
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sharedDocObj: SharedDocument = {
      id: doc.id,
      channelId: practiceId,
      name: doc.name,
      size: doc.size,
      type: doc.name.toLowerCase().endsWith('.png') || doc.name.toLowerCase().endsWith('.jpg') || doc.name.toLowerCase().endsWith('.jpeg') ? 'image' : 'pdf',
      sentBy: doc.sender,
      sentAt: 'Today, ' + timeString
    };
    initialDocuments.push(sharedDocObj);

    // Add initial message to the channel
    const allMessages = getMessages();
    if (!allMessages[practiceId]) {
      allMessages[practiceId] = [];
    }
    allMessages[practiceId].push({
      id: 'm_' + Math.random().toString(36).substring(2, 9),
      user: doc.sender,
      text: `Incoming document via secure email: ${doc.name}`,
      time: timeString,
      type: 'other',
      transport: 'Email',
      document: sharedDocObj
    });
    saveMessages(allMessages);

    // Remove from dashboard inbox
    const updatedDocs = documents.filter(d => d.id !== doc.id);
    saveDocumentsToStorage(updatedDocs);
    setSelectedDocument(null);
    router.push(`/dentist/channels?practice=${encodeURIComponent(practiceName)}&tab=documents`);
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
            { label: 'Patients Sent', value: referralsSentCount.toString().padStart(2, '0'), icon: FileText, path: '/dentist/referrals?tab=Received' },
            { label: 'Patients Scheduled', value: referralsScheduledCount.toString().padStart(2, '0'), icon: Calendar, path: '/dentist/referrals?tab=Scheduled' },
            { label: 'Specialty Care Complete', value: specialtyCareCompleteCount.toString().padStart(2, '0'), icon: FileText, path: '/dentist/referrals?tab=Completed' },
            { label: '# drtalk connections', value: specialistClinics.length.toString(), icon: Users, path: '/dentist/network?tab=connected' },
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
