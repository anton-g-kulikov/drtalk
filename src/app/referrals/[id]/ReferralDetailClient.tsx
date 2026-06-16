"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { 
  FileText, Download, 
  AlertTriangle, Send, MoreHorizontal,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/components/SubscriptionContext';
import { initialDocuments } from '@/prototype/channelFixtures';
import { ReferralDetailHeader } from '@/components/prototype/ReferralDetailHeader';
import { ReferralActivitySidebar } from '@/components/prototype/ReferralActivitySidebar';
import {
  appendReferralComment,
  loadReferralActivityLogs,
  transitionReferralDetailStatus,
  type ReferralActivityLog,
} from '@/prototype/referralDetailState';

import { getReferrals, updateReferralAssignee, UnifiedReferral, ReferralStatus, initialReferrals } from '@/lib/referrals';

const PRACTICE_TEAM = [
  { id: 'none', name: 'UNASSIGNED' },
  { id: '1', name: 'DR. EMMA SMITH', specialty: 'ENDODONTICS' },
  { id: '2', name: 'ALICE JOHNSON', specialty: 'PRACTICE ADMIN' },
  { id: '3', name: 'BOB WILSON', specialty: 'ORAL SURGERY' },
  { id: '4', name: 'CAROL DANVERS', specialty: 'PERIODONTICS' },
];

export default function ReferralDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { isTrialEnded, setShowPaywall } = useSubscription();
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

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
  }, [id]);

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

        {/* Content Layout */}
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
                <section className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase text-muted-foreground border-b border-black/10 pb-2">Attachments ({caseDocs.length})</h4>
                  {caseDocs.length === 0 ? (
                    <div className="p-4 border-2 border-black border-dashed text-center">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">No attachments for this case</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {caseDocs.map((doc) => (
                        <div 
                          key={doc.id} 
                          onClick={() => router.push(`/documents/${doc.id}?role=specialist`)}
                          className="flex items-center gap-3 p-3 border-2 border-black border-dashed hover:bg-black hover:text-white group cursor-pointer transition-all"
                        >
                          <FileText size={18} className="shrink-0" />
                          <div className="flex flex-col flex-1 overflow-hidden">
                            <span className="text-[10px] font-bold uppercase tracking-tight truncate">{doc.name}</span>
                            <span className="text-[8px] font-bold uppercase text-muted-foreground group-hover:text-white/70">
                              {doc.type.toUpperCase()} • {doc.size}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
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
      </div>
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
