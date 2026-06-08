"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { 
  ArrowLeft, FileText, Download, 
  AlertTriangle, Send, MoreHorizontal,
  MessageSquare, Users, ChevronDown, Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/components/SubscriptionContext';

import { getReferrals, updateReferralStatus, UnifiedReferral, ReferralStatus, initialReferrals, getReferralCode } from '@/lib/referrals';

export default function ReferralDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { isTrialEnded, setShowPaywall } = useSubscription();
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Load unified referrals from localStorage
  const [referrals, setReferrals] = useState<UnifiedReferral[]>(initialReferrals);
  const referral = referrals.find(r => r.id === id) || referrals[0];

  const [currentStatus, setCurrentStatus] = useState<ReferralStatus>(referral.status);
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'Emergency'>(referral.urgency || 'Routine');
  const [practiceName, setPracticeName] = useState(referral.practice);

  useEffect(() => {
    setTimeout(() => {
      const loadedRefs = getReferrals();
      setReferrals(loadedRefs);
      const ref = loadedRefs.find(r => r.id === id) || loadedRefs[0];
      if (ref) {
        setCurrentStatus(ref.status);
        setUrgency(ref.urgency || 'Routine');
        setPracticeName(ref.practice);
      }
    }, 0);
  }, [id]);

  const targetPractice = practiceName && practiceName !== 'unknown' ? practiceName : referral.dentist;

  const handleStatusChange = (newStatus: ReferralStatus) => {
    setCurrentStatus(newStatus);
    const updated = updateReferralStatus(referral.id, newStatus);
    setReferrals(updated);
  };

  const handleProcessReferral = () => {
    if (isTrialEnded) {
      setShowPaywall(true);
    } else {
      alert("Referral Processed Successfully!");
      handleStatusChange('Completed');
    }
  };

  const handleMainNextAction = () => {
    switch (currentStatus) {
      case 'Received':
      case 'Sent':
        handleStatusChange('Scheduled');
        break;
      case 'Scheduled':
        handleProcessReferral();
        break;
      case 'Completed':
        handleStatusChange('Archived');
        break;
      case 'Archived':
        handleStatusChange('Scheduled');
        break;
      default:
        break;
    }
  };

  const getStatusColor = (status: ReferralStatus) => {
    switch (status) {
      case 'Received': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'Scheduled': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Completed': return 'bg-green-50 text-green-800 border-green-200';
      case 'Archived': return 'bg-gray-50 text-gray-800 border-gray-200';
      default: return 'bg-white';
    }
  };

  return (
    <MainLayout title="Referral Detail">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header / Actions Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-black pb-6">
          <div className="flex items-start gap-3 sm:gap-5">
            <button 
              onClick={() => router.push('/referrals')}
              className="mt-1 p-2 border-2 border-black hover:bg-black hover:text-white transition-all bg-white"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Referrals / {getReferralCode(referral.id)}</p>
                <span className={`px-2 py-0.5 border text-[9px] font-black uppercase rounded-sm ${getStatusColor(currentStatus)}`}>
                  {currentStatus === 'Received' ? 'Received (Review)' : currentStatus}
                </span>
                {urgency === 'Urgent' && (
                  <span className="bg-amber-50 text-amber-800 border-amber-200 px-2 py-0.5 border text-[9px] font-black uppercase rounded-sm animate-pulse">
                    Urgent
                  </span>
                )}
                {urgency === 'Emergency' && (
                  <span className="bg-red-50 text-red-800 border-red-200 px-2 py-0.5 border text-[9px] font-black uppercase rounded-sm animate-pulse">
                    Emergency
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter">{referral.patientName}</h1>
                <CommentMarker id="referral-page-detail" title="Referral Detail Page" description="The full-page detailed view of a referral." />
              </div>
            </div>
          </div>
 
          {/* Dynamic Actions Row */}
          <div className="flex flex-wrap items-center gap-3 relative">
            <div className="relative flex items-stretch">
              {/* Left Action Button (Direct One-Click Status Advance) */}
              <button 
                onClick={handleMainNextAction}
                className="wireframe-button bg-black text-white text-[10px] uppercase px-5 py-3 flex items-center justify-center font-black tracking-widest border-2 border-black border-r-0 hover:bg-zinc-800 transition-colors rounded-r-none h-11"
              >
                {currentStatus === 'Received' ? 'Schedule Appointment' :
                 currentStatus === 'Scheduled' ? 'Complete Treatment' :
                 currentStatus === 'Completed' ? 'Archive Case' :
                 'Reopen Case'}
              </button>
 
              {/* Right Dropdown Toggle Segment */}
              <button 
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="wireframe-button bg-black text-white px-3 py-3 flex items-center justify-center border-2 border-black hover:bg-zinc-800 transition-colors rounded-l-none h-11 border-l-zinc-700"
              >
                <ChevronDown size={14} className={`transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
 
              {isStatusDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 py-1 divide-y divide-black/10 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 bg-gray-50 border-b border-black">
                    <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Change Status</p>
                  </div>
                  {[
                    { status: 'Received', label: 'Received (Review)' },
                    { status: 'Scheduled', label: 'Scheduled' },
                    { status: 'Completed', label: 'Completed' },
                    { status: 'Archived', label: 'Archived' }
                  ].map((item) => (
                    <button
                      key={item.status}
                      onClick={() => {
                        if (item.status === 'Completed') {
                          handleProcessReferral();
                        } else {
                          handleStatusChange(item.status as ReferralStatus);
                        }
                        setIsStatusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase transition-all flex items-center justify-between hover:bg-black hover:text-white ${
                        currentStatus === item.status ? 'bg-zinc-100 text-black font-black' : 'text-black bg-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {currentStatus === item.status && <Check size={10} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
 
            <button 
              onClick={() => router.push(`/channels?practice=${encodeURIComponent(targetPractice)}&caseId=case_${referral.id}`)}
              className="wireframe-button border-2 border-black hover:bg-black hover:text-white transition-all text-[10px] uppercase px-5 py-3 flex items-center gap-2 bg-white text-black font-black"
            >
              Continue Communication <MessageSquare size={12} />
            </button>
 
            {currentStatus !== 'Archived' && currentStatus !== 'Completed' && (
              <button 
                onClick={() => handleStatusChange('Archived')}
                className="wireframe-button border-2 border-black hover:bg-black hover:text-white transition-all text-[10px] uppercase px-5 py-3 bg-white text-black font-black"
              >
                Archive Case
              </button>
            )}
          </div>
        </div>

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
                  <h4 className="text-[11px] font-black uppercase text-muted-foreground border-b border-black/10 pb-2">Reason for Referral</h4>
                  <div className="space-y-4">
                    <p className="text-xs uppercase leading-relaxed font-bold italic">
                      Patient experiencing persistent pain in the upper left molar (tooth #14). Requires immediate endodontic evaluation for possible retreatment of root canal.
                    </p>
                  </div>
                </section>
                <section className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase text-muted-foreground border-b border-black/10 pb-2">Attachments (3)</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'VIEW_SCAN_1.DCM', type: 'DICOM', size: '12.4 MB' },
                      { name: 'VIEW_SCAN_2.DCM', type: 'DICOM', size: '8.2 MB' },
                      { name: 'VIEW_SCAN_3.DCM', type: 'DICOM', size: '10.1 MB' },
                    ].map((file, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border-2 border-black border-dashed hover:bg-black hover:text-white group cursor-pointer transition-all">
                        <FileText size={18} className="shrink-0" />
                        <div className="flex flex-col flex-1 overflow-hidden">
                          <span className="text-[10px] font-bold uppercase tracking-tight truncate">{file.name}</span>
                          <span className="text-[8px] font-bold uppercase text-muted-foreground group-hover:text-white/70">{file.type} • {file.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => router.push(`/channels?practice=${encodeURIComponent(targetPractice)}&caseId=case_${referral.id}`)}
                    className="w-full mt-4 wireframe-button border-2 border-black border-dashed hover:border-solid hover:bg-black hover:text-white transition-all text-[10px] uppercase py-3 flex items-center justify-center gap-2 font-black tracking-wider bg-white text-black"
                  >
                    Send Additional Documents Back <Send size={12} />
                  </button>
                </section>
              </div>
            </div>
          </div>

          {/* Activity Sidebar */}
          <div className="w-full md:w-96 flex flex-col bg-gray-50/50">
            <div className="p-6 border-b-2 border-black bg-white">
              <h3 className="font-bold uppercase text-xs tracking-widest">Case Activity</h3>
            </div>
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <p className="text-[9px] font-black uppercase text-black">Practice Communication</p>
                  <p className="text-[8px] text-muted-foreground uppercase whitespace-pre-line text-right">ACTIVE NOW</p>
                </div>
                <div 
                  onClick={() => router.push(`/channels?practice=${encodeURIComponent(targetPractice)}&caseId=case_${referral.id}`)}
                  className="wireframe-card p-3 text-[10px] uppercase leading-tight bg-white border-dashed border-2 border-black hover:bg-black hover:text-white cursor-pointer transition-all flex items-center justify-between gap-3 group shadow-sm"
                >
                  <span className="font-medium">Click here to reply to <span className="font-black underline">{referral.dentist}</span> / share post-op reports or additional scans.</span>
                  <MessageSquare size={14} className="shrink-0 text-black group-hover:text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <p className="text-[9px] font-black uppercase">System</p>
                  <p className="text-[8px] text-muted-foreground uppercase whitespace-pre-line text-right">08:20 AM{"\n"}05/11/2026</p>
                </div>
                <div className="wireframe-card p-3 text-[10px] uppercase leading-tight bg-white shadow-sm">
                  Referral received from <span className="font-black underline">{practiceName}</span> and auto-extracted via Digital Intake Pipeline.
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <p className="text-[9px] font-black uppercase">Administrator</p>
                  <p className="text-[8px] text-muted-foreground uppercase whitespace-pre-line text-right">09:20 AM{"\n"}05/11/2026</p>
                </div>
                <div className="wireframe-card p-3 text-[10px] uppercase leading-tight bg-black text-white">
                  Clinical records requested from {referral.dentist}&apos;s office. Pending response.
                </div>
              </div>
            </div>
            <div className="p-6 border-t-2 border-black bg-white space-y-4">
              <textarea 
                placeholder="ADD INTERNAL NOTE..." 
                className="wireframe-input h-28 text-[11px] uppercase p-3 resize-none bg-gray-50 focus:bg-white transition-colors"
              />
              <button className="wireframe-button w-full bg-black text-white text-[11px] uppercase py-3 font-black tracking-widest">
                Post Comment
              </button>
            </div>
        </div>
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
