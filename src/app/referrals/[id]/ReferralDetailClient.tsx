"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { 
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/components/SubscriptionContext';
import { initialDocuments } from '@/prototype/channelFixtures';
import { ReferralDetailHeader } from '@/components/prototype/ReferralDetailHeader';
import { ReferralActivitySidebar } from '@/components/prototype/ReferralActivitySidebar';
import { DocumentViewerTab } from '@/components/prototype/DocumentViewerTab';
import { UnrecognizedSenderPageContent, type UnrecognizedDocData } from '@/components/prototype/UnrecognizedSenderPageContent';
import {
  buildDashboardDocumentChannelTransfer,
  type DashboardDocumentItem,
} from '@/prototype/dashboardDocuments';
import { saveDashboardDocumentsToStorage } from '@/prototype/dashboardDocumentStorage';
import { getInitialDentistDocs, getInitialSpecialistDocs } from '@/lib/mockGenerator';
import {
  appendReferralComment,
  loadReferralActivityLogs,
  transitionReferralDetailStatus,
  type ReferralActivityLog,
} from '@/prototype/referralDetailState';

import {
  getReferrals,
  updateReferralAssignee,
  UnifiedReferral,
  ReferralStatus,
  initialReferrals,
  saveReferrals,
  getNetwork,
  saveNetwork,
  getChannels,
  saveChannels,
  getMessages,
  saveMessages,
} from '@/lib/referrals';

const PRACTICE_TEAM = [
  { id: 'none', name: 'UNASSIGNED' },
  { id: '1', name: 'DR. EMMA SMITH', specialty: 'ENDODONTICS' },
  { id: '2', name: 'ALICE JOHNSON', specialty: 'PRACTICE ADMIN' },
  { id: '3', name: 'BOB WILSON', specialty: 'ORAL SURGERY' },
  { id: '4', name: 'CAROL DANVERS', specialty: 'PERIODONTICS' },
];

const UNRECOGNIZED_DOC_ROLE: Record<string, 'specialist' | 'dentist'> = {
  'doc-unrecognized-1': 'specialist',
  'doc-unrecognized-2': 'specialist',
  'doc-unrecognized-3': 'dentist',
  'doc-unrecognized-4': 'dentist',
};

function getDashboardStorageKey(role: 'specialist' | 'dentist'): string {
  return role === 'specialist' ? 'drtalk_specialist_docs' : 'drtalk_dentist_docs';
}

function getDashboardDocDefaults(role: 'specialist' | 'dentist'): DashboardDocumentItem[] {
  return role === 'specialist' ? getInitialSpecialistDocs() : getInitialDentistDocs();
}

export default function ReferralDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { isTrialEnded, setShowPaywall } = useSubscription();
  const isUnrecognizedSender = id.startsWith('doc-unrecognized');
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | string>('info');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [unrecognizedDoc, setUnrecognizedDoc] = useState<UnrecognizedDocData | null>(null);
  const [unrecognizedRole, setUnrecognizedRole] = useState<'specialist' | 'dentist'>(
    UNRECOGNIZED_DOC_ROLE[id] ?? 'specialist'
  );

  // Load unified referrals from localStorage
  const [referrals, setReferrals] = useState<UnifiedReferral[]>(initialReferrals);
  const referral = referrals.find(r => r.id === id) || referrals[0];
  const caseDocs = initialDocuments.filter(d => d.channelId === `case_${referral.id}`);

  const [currentStatus, setCurrentStatus] = useState<ReferralStatus>(referral.status);
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'Emergency'>(referral.urgency || 'Routine');
  const [practiceName, setPracticeName] = useState(referral.practice);
  const [assignedTo, setAssignedTo] = useState<string>(referral?.assignedTo || 'none');

  const [activityLogs, setActivityLogs] = useState<ReferralActivityLog[]>([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (isUnrecognizedSender) {
      const preferredRole = UNRECOGNIZED_DOC_ROLE[id] ?? 'specialist';
      const fallbackDoc: UnrecognizedDocData = {
        id,
        name: 'INCOMING_DOCUMENT.PDF',
        size: '—',
        transport: 'Email',
        sender: 'Unknown Sender',
        date: new Date().toLocaleDateString('en-US'),
      };

      const findDocForRole = (role: 'specialist' | 'dentist') => {
        const defaults = getDashboardDocDefaults(role);
        if (typeof window === 'undefined') return defaults.find((doc) => doc.id === id) ?? null;
        try {
          const stored = localStorage.getItem(getDashboardStorageKey(role));
          const parsed = stored ? JSON.parse(stored) : defaults;
          const docs = Array.isArray(parsed) ? parsed : defaults;
          return docs.find((doc) => doc.id === id) ?? null;
        } catch {
          return defaults.find((doc) => doc.id === id) ?? null;
        }
      };

      const preferredMatch = findDocForRole(preferredRole);
      const alternateRole = preferredRole === 'specialist' ? 'dentist' : 'specialist';
      const alternateMatch = preferredMatch ? null : findDocForRole(alternateRole);
      const resolvedRole = preferredMatch ? preferredRole : alternateMatch ? alternateRole : preferredRole;
      const resolvedDoc = preferredMatch ?? alternateMatch;

      setUnrecognizedRole(resolvedRole);
      setUnrecognizedDoc(
        resolvedDoc
          ? {
              id: resolvedDoc.id,
              name: resolvedDoc.name,
              size: resolvedDoc.size,
              transport: resolvedDoc.transport || 'Email',
              sender: resolvedDoc.sender,
              date: resolvedDoc.date,
            }
          : fallbackDoc
      );
      return;
    }

    setTimeout(() => {
      const loadedRefs = getReferrals();
      setReferrals(loadedRefs);
      const ref = loadedRefs.find(r => r.id === id) || loadedRefs[0];
      if (ref) {
        setUrgency(ref.urgency || 'Routine');
        setPracticeName(ref.practice);
        setAssignedTo(ref.assignedTo || 'none');
        
        const initialLogs = loadReferralActivityLogs(ref);
        if (ref.status === 'Received' || ref.status === 'Sent') {
          const result = transitionReferralDetailStatus({
            referral: ref,
            newStatus: 'Accepted',
            currentLogs: initialLogs,
          });
          setReferrals(result.referrals);
          setActivityLogs(result.activityLogs);
          setCurrentStatus('Accepted');
        } else {
          setActivityLogs(initialLogs);
          setCurrentStatus(ref.status);
        }
      }
    }, 0);
  }, [id, isUnrecognizedSender]);

  const targetPractice = practiceName && practiceName !== 'unknown' ? practiceName : referral.dentist;

  const handleStatusChange = (newStatus: ReferralStatus) => {
    setCurrentStatus(newStatus);
    const result = transitionReferralDetailStatus({
      referral,
      newStatus,
      currentLogs: activityLogs,
    });
    setReferrals(result.referrals);
    setActivityLogs(result.activityLogs);
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    const updated = appendReferralComment({
      referralId: referral.id,
      commentText,
      currentLogs: activityLogs,
    });
    setActivityLogs(updated);
    setCommentText('');
  };

  const handleProcessReferral = () => {
    if (isTrialEnded) {
      setShowPaywall(true);
    } else {
      handleStatusChange('Released');
    }
  };

  const handleMainNextAction = () => {
    switch (currentStatus) {
      case 'Received':
      case 'Sent':
        handleStatusChange('Accepted');
        break;
      case 'Accepted':
        handleStatusChange('Scheduled');
        break;
      case 'Scheduled':
        handleProcessReferral();
        break;
      case 'Released':
        handleStatusChange('Archived');
        break;
      case 'Archived':
        handleStatusChange('Scheduled');
        break;
      default:
        break;
    }
  };

  const triggerDownloadToast = (docName: string) => {
    setDownloadToast(`Downloading "${docName}"…`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const handleUnrecognizedConfirm = (values: { senderPractice: string; patientName: string; itemType: 'referral' | 'document' }) => {
    if (!unrecognizedDoc) return;

    const storageKey = getDashboardStorageKey(unrecognizedRole);
    const defaults = getDashboardDocDefaults(unrecognizedRole);
    const remainingDocs = (() => {
      if (typeof window === 'undefined') return defaults.filter((doc) => doc.id !== unrecognizedDoc.id);
      try {
        const stored = localStorage.getItem(storageKey);
        const parsed = stored ? JSON.parse(stored) : defaults;
        const sourceDocs = Array.isArray(parsed) ? parsed : defaults;
        return sourceDocs.filter((doc) => doc.id !== unrecognizedDoc.id);
      } catch {
        return defaults.filter((doc) => doc.id !== unrecognizedDoc.id);
      }
    })();
    saveDashboardDocumentsToStorage(storageKey, remainingDocs);

    if (values.itemType === 'referral') {
      const currentReferrals = getReferrals();
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const today = new Date().toLocaleDateString('en-US');
      const newReferral: UnifiedReferral = unrecognizedRole === 'dentist'
        ? {
            id: `D-${1000 + currentReferrals.length + 1}`,
            patientName: values.patientName || 'NEW PATIENT',
            type: 'Referral Case',
            source: unrecognizedDoc.transport || 'External',
            completion: 0,
            status: 'Sent',
            receivedAt: `Today, ${now}`,
            lastUpdate: `Today, ${now}`,
            nextStep: 'Waiting for specialist review',
            dentist: 'Dr. Taylor Reed',
            specialist: values.senderPractice,
            practice: values.senderPractice,
            urgency: 'Routine',
            sender: 'Dr. Taylor Reed',
          }
        : {
            id: `ext-ref-${Date.now()}`,
            patientName: values.patientName || 'NEW PATIENT',
            type: 'Referral',
            source: unrecognizedDoc.transport || 'External',
            completion: 0,
            status: 'Received',
            receivedAt: `${now}\n${today}`,
            lastUpdate: `${now}\n${today}`,
            nextStep: 'Needs review',
            dentist: values.senderPractice,
            specialist: 'Valley Endodontics',
            specialistDoctor: 'Dr. Emma Smith',
            practice: values.senderPractice,
            urgency: 'Routine',
            sender: values.senderPractice,
          };

      saveReferrals([newReferral, ...currentReferrals]);
      router.push(unrecognizedRole === 'dentist' ? '/dentist/dashboard' : '/dashboard');
      return;
    }

    const resolvedDoc: DashboardDocumentItem = {
      id: unrecognizedDoc.id,
      name: unrecognizedDoc.name,
      sender: values.senderPractice,
      date: unrecognizedDoc.date || new Date().toLocaleDateString('en-US'),
      size: unrecognizedDoc.size,
      isExternal: true,
      isUnrecognized: false,
      transport: unrecognizedDoc.transport,
    };
    const transfer = buildDashboardDocumentChannelTransfer({
      doc: resolvedDoc,
      role: unrecognizedRole,
      network: getNetwork(),
      channels: getChannels(unrecognizedRole === 'dentist'),
      messages: getMessages(),
      addSharedDocument: (sharedDocument) => initialDocuments.push(sharedDocument),
    });
    saveNetwork(transfer.network);
    saveChannels(unrecognizedRole === 'dentist', transfer.channels);
    saveMessages(transfer.messages);
    router.push(transfer.destinationHref);
  };

  if (isUnrecognizedSender) {
    return (
      <MainLayout title="Unrecognized Sender">
        <UnrecognizedSenderPageContent
          doc={unrecognizedDoc ?? {
            id,
            name: 'INCOMING_DOCUMENT.PDF',
            size: '—',
            transport: 'Email',
            sender: 'Unknown Sender',
            date: new Date().toLocaleDateString('en-US'),
          }}
          onConfirm={handleUnrecognizedConfirm}
          onCancel={() => router.push(unrecognizedRole === 'dentist' ? '/dentist/dashboard' : '/dashboard')}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Referral Detail">
      <div className="max-w-6xl mx-auto space-y-8">
        <ReferralDetailHeader
          referral={referral}
          urgency={urgency}
          currentStatus={currentStatus}
          assignedTo={assignedTo}
          targetPractice={targetPractice}
          isStatusDropdownOpen={isStatusDropdownOpen}
          setIsStatusDropdownOpen={setIsStatusDropdownOpen}
          onBack={() => router.push('/referrals')}
          onMainNextAction={handleMainNextAction}
          onStatusChange={handleStatusChange}
          onProcessReferral={handleProcessReferral}
          onOpenCaseChat={() => router.push(`/channels?practice=${encodeURIComponent(targetPractice)}&caseId=case_${referral.id}`)}
        />

        {/* Tab bar */}
        <div className="border-b-2 border-black flex items-end gap-0 overflow-x-auto">
          {/* Case Info tab */}
          <button
            onClick={() => setActiveTab('info')}
            className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-wider border-2 border-b-0 transition-all shrink-0 ${
              activeTab === 'info'
                ? 'border-black bg-black text-white'
                : 'border-black/30 bg-white text-black hover:border-black hover:bg-zinc-50'
            }`}
          >
            Case Information
          </button>

          {/* Document tabs */}
          {caseDocs.map((doc) => {
            const ext = doc.name.split('.').pop()?.toUpperCase() || doc.type.toUpperCase();
            const isActive = activeTab === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setActiveTab(doc.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider border-2 border-b-0 transition-all shrink-0 max-w-[220px] ${
                  isActive
                    ? 'border-black bg-black text-white'
                    : 'border-black/30 bg-white text-black hover:border-black hover:bg-zinc-50'
                }`}
              >
                <FileText size={11} className="shrink-0" />
                <span className="truncate">{doc.name.replace(/\.[^.]+$/, '').slice(0, 18)}</span>
                <span className={`text-[7px] px-1 py-0.5 font-black border shrink-0 ${isActive ? 'border-white/40 text-white/80' : 'border-black/30 text-zinc-500'}`}>
                  {ext}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Layout */}
        {activeTab === 'info' ? (
          <div className="wireframe-card p-0 flex flex-col md:flex-row overflow-hidden bg-white min-h-[75vh]">
            
            {/* Main Info */}
            <div className="flex-1 p-6 sm:p-10 space-y-10 border-b-2 md:border-b-0 md:border-r-2 border-black">
              
              {/* Data Warning Banner */}
              {referral.completion < 60 && currentStatus === 'Received' && (
                <div className="wireframe-card border-black bg-zinc-50 p-6 flex gap-5 items-start">
                  <AlertTriangle className="text-black shrink-0" size={28} />
                  <div className="flex-1">
                    <p className="text-[11px] font-black uppercase text-black tracking-tighter">Incomplete Data Extraction</p>
                    <p className="text-[10px] uppercase leading-relaxed mt-1 font-medium">
                      Please verify all information before processing. Manual review required for clinical accuracy.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-end border-b-2 border-black pb-4">
                <h3 className="font-bold uppercase text-xs tracking-widest">Case Information</h3>
                <div className="flex gap-6">
                  <button 
                    onClick={() => setIsEditorMode(!isEditorMode)}
                    className="text-[10px] font-bold uppercase underline hover:text-black transition-colors"
                  >
                    {isEditorMode ? 'Save Changes' : 'Enter Edit Mode'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                <div className="space-y-10">
                  <section className="space-y-6">
                    <h4 className="text-[11px] font-black uppercase text-muted-foreground border-b border-black/10 pb-2">Patient Details</h4>
                    <div className="space-y-5">
                      <DataField label="Full Name" value={referral.patientName} edit={isEditorMode} />
                      <DataField 
                        label="Date of Birth" 
                        value={referral.id === '2' ? '[MISSING - ACTION REQUIRED]' : 'MAY 14, 1985'} 
                        edit={isEditorMode} 
                      />
                      <DataField 
                        label="Contact Phone" 
                        value={referral.id === '5' ? '[MISSING - ACTION REQUIRED]' : '(555) 012-3456'} 
                        edit={isEditorMode} 
                      />
                      <div className="space-y-1.5 pt-2">
                        <label className="text-[8px] font-black uppercase tracking-wider text-muted-foreground block">Urgency</label>
                        <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-sm border ${
                          urgency === 'Emergency' ? 'bg-red-100 text-red-900 border-red-300' :
                          urgency === 'Urgent' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                          'bg-zinc-100 text-zinc-800 border-zinc-300'
                        }`}>
                          {urgency}
                        </span>
                      </div>
                    </div>
                  </section>
                  <section className="space-y-6">
                    <h4 className="text-[11px] font-black uppercase text-muted-foreground border-b border-black/10 pb-2">Referral Source</h4>
                    <div className="space-y-5">
                      <DataField 
                        label="Referring Dentist" 
                        value={referral.id === '1' ? '[MISSING - ACTION REQUIRED]' : referral.dentist} 
                        edit={isEditorMode} 
                      />
                      <DataField 
                        label="Referring Practice" 
                        value={referral.id === '1' || referral.practice === 'unknown' ? '[MISSING - ACTION REQUIRED]' : (practiceName || '')} 
                        edit={isEditorMode} 
                        onChange={setPracticeName}
                        canEditInline={true}
                      />
                      <DataField label="Input Channel" value={referral.source} edit={isEditorMode} />
                    </div>
                  </section>

                </div>

                <div className="space-y-10">
                  <section className="space-y-6">
                    <h4 className="text-[11px] font-black uppercase text-muted-foreground border-b border-black/10 pb-2">Referred To</h4>
                    <div className="space-y-5">
                      <DataField label="Practice" value={referral.specialist} edit={isEditorMode} />
                      <DataField
                        label="Doctor"
                        value={referral.specialistDoctor || '—'}
                        edit={isEditorMode}
                      />
                    </div>
                  </section>
                  <section className="space-y-6">
                    <h4 className="text-[11px] font-black uppercase text-muted-foreground border-b border-black/10 pb-2">Reason for Referral</h4>
                    <div className="space-y-4">
                      <p className="text-xs uppercase leading-relaxed font-bold italic">
                        Patient experiencing persistent pain in the upper left molar (tooth #14). Requires immediate endodontic evaluation for possible retreatment of root canal.
                      </p>
                    </div>
                  </section>

                  {/* Attachment summary — click to open document tab */}
                  {caseDocs.length > 0 && (
                    <section className="space-y-4">
                      <h4 className="text-[11px] font-black uppercase text-muted-foreground border-b border-black/10 pb-2">
                        Attachments ({caseDocs.length})
                      </h4>
                      <div className="space-y-2">
                        {caseDocs.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => setActiveTab(doc.id)}
                            className="flex items-center gap-3 p-3 border-2 border-black border-dashed hover:bg-black hover:text-white group w-full text-left transition-all"
                          >
                            <FileText size={16} className="shrink-0" />
                            <div className="flex flex-col flex-1 overflow-hidden">
                              <span className="text-[10px] font-bold uppercase tracking-tight truncate">{doc.name}</span>
                              <span className="text-[8px] font-bold uppercase text-muted-foreground group-hover:text-white/70">
                                {doc.type.toUpperCase()} • {doc.size} — Click to view
                              </span>
                            </div>
                            <span className="text-[8px] font-black uppercase px-2 py-0.5 border border-current shrink-0">View</span>
                          </button>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>

            <ReferralActivitySidebar
              assignedTo={assignedTo}
              activityLogs={activityLogs}
              commentText={commentText}
              currentStatus={currentStatus}
              dentistName={referral.dentist || ''}
              practiceName={practiceName}
              team={PRACTICE_TEAM}
              onAssign={(newAssignee) => {
                setAssignedTo(newAssignee);
                const updated = updateReferralAssignee(referral.id, newAssignee === 'none' ? undefined : newAssignee);
                setReferrals(updated);
              }}
              onCommentTextChange={setCommentText}
              onPostComment={handlePostComment}
            />
          </div>
        ) : (
          /* Document viewer tab */
          (() => {
            const doc = caseDocs.find(d => d.id === activeTab);
            if (!doc) return null;
            return (
              <div className="wireframe-card p-0 overflow-hidden bg-white">
                <DocumentViewerTab
                  documentName={doc.name}
                  documentSize={doc.size}
                  documentType={doc.type}
                  sentBy={doc.sentBy}
                  sentAt={doc.sentAt}
                  onDownload={() => triggerDownloadToast(doc.name)}
                />
              </div>
            );
          })()
        )}
      </div>

      {/* Download toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-2 text-[9px] font-black uppercase tracking-widest border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
          {downloadToast}
        </div>
      )}
    </MainLayout>
  );
}

function DataField({ 
  label, 
  value, 
  edit, 
  onChange,
  canEditInline 
}: { 
  label: string, 
  value: string, 
  edit?: boolean,
  onChange?: (val: string) => void,
  canEditInline?: boolean
}) {
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setTempValue(value);
  }

  const handleSave = () => {
    setIsInlineEditing(false);
    if (onChange) {
      onChange(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsInlineEditing(false);
      setTempValue(value);
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-[8px] font-bold uppercase text-muted-foreground">{label}</label>
      {edit ? (
        <input 
          type="text" 
          value={tempValue} 
          onChange={(e) => {
            setTempValue(e.target.value);
            if (onChange) onChange(e.target.value);
          }} 
          className="wireframe-input py-1 text-xs" 
        />
      ) : isInlineEditing && canEditInline ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            autoFocus
            className="wireframe-input py-1 text-xs w-full max-w-xs focus:ring-1 focus:ring-black"
          />
          <span className="text-[8px] text-muted-foreground uppercase font-bold">(Enter to save)</span>
        </div>
      ) : (
        <div 
          onClick={() => {
            if (canEditInline) setIsInlineEditing(true);
          }}
          className={`group flex items-center gap-2 ${canEditInline ? 'cursor-pointer select-none' : ''}`}
        >
          <p className={`font-bold text-xs uppercase group-hover:underline ${value.includes('MISSING') ? 'text-red-600 bg-red-50 px-2 py-0.5 border border-red-300 rounded-sm inline-block' : ''}`}>
            {value}
          </p>
          {canEditInline && (
            <span className="text-[8px] opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity uppercase font-bold">
              (Click to edit)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
