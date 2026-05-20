"use client";

import React, { useState } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { 
  ArrowLeft, FileText, Download, 
  AlertTriangle, Send, MoreHorizontal,
  MessageSquare, Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/components/SubscriptionContext';

export default function ReferralDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { isTrialEnded, setShowPaywall } = useSubscription();
  const [isEditorMode, setIsEditorMode] = useState(false);

  const handleProcessReferral = () => {
    if (isTrialEnded) {
      setShowPaywall(true);
    } else {
      // Logic for processing referral
      alert("Referral Processed Successfully!");
      router.push('/referrals');
    }
  };

  // Mock data for the specific referral
  const mockReferrals = [
    { id: '1', patientName: 'Alice Cooper', type: 'Endodontic Consultation', source: 'Email' as const, completion: 55, status: 'Received' as const, receivedAt: '08:20 AM\n05/11/2026', dentist: 'Dr. Smith', practice: 'Valley Endodontics' },
    { id: '2', patientName: 'Bob Marley', type: 'Dental Implant', source: 'Fax' as const, completion: 45, status: 'Received' as const, receivedAt: '06:20 AM\n05/11/2026', dentist: 'Dr. Jones', practice: 'unknown' },
    { id: '3', patientName: 'Charlie Brown', type: 'Emergency Extraction', source: 'App' as const, completion: 100, status: 'Working on' as const, receivedAt: '10:20 AM\n05/10/2026', dentist: 'Dr. Miller', practice: 'Miller & Associates' },
    { id: '4', patientName: 'David Bowie', type: 'Invisalign Eval', source: 'Web' as const, completion: 88, status: 'Processed' as const, receivedAt: '10:20 AM\n05/09/2026', dentist: 'Dr. White', practice: 'White Dental Group' },
    { id: '5', patientName: 'Eve Online', type: 'Periodontal Surgery', source: 'Email' as const, completion: 30, status: 'Working on' as const, receivedAt: '09:20 AM\n05/11/2026', dentist: 'Dr. Black', practice: 'Black Family Dental' },
  ];

  const referral = mockReferrals.find(r => r.id === id) || mockReferrals[0];
  const [practiceName, setPracticeName] = useState(referral.practice);
  const targetPractice = practiceName && practiceName !== 'unknown' ? practiceName : referral.dentist;

  return (
    <MainLayout title="Referral Detail">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumbs / Back button */}
        <div className="flex items-start gap-3 sm:gap-5">
          <button 
            onClick={() => router.push('/referrals')}
            className="mt-1 p-2 border-2 border-black hover:bg-black hover:text-white transition-all bg-white"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Referrals / REF-{referral.id}000X</p>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter">{referral.patientName}</h1>
              <CommentMarker id="referral-page-detail" title="Referral Detail Page" description="The full-page detailed view of a referral." />
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="wireframe-card p-0 flex flex-col md:flex-row overflow-hidden bg-white min-h-[75vh]">
          
          {/* Main Info */}
          <div className="flex-1 p-6 sm:p-10 space-y-10 border-b-2 md:border-b-0 md:border-r-2 border-black">
            
            {/* Data Warning Banner */}
            {referral.completion < 60 && (
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
                    <DataField label="Date of Birth" value="MAY 14, 1985" />
                    <DataField label="Contact Phone" value="(555) 012-3456" />
                  </div>
                </section>
                <section className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase text-muted-foreground border-b border-black/10 pb-2">Referral Source</h4>
                  <div className="space-y-5">
                    <DataField label="Referring Dentist" value={referral.dentist} edit={isEditorMode} />
                    <DataField 
                       label="Referring Practice" 
                       value={practiceName} 
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
                    onClick={() => router.push(`/channels?practice=${encodeURIComponent(targetPractice)}`)}
                    className="w-full mt-4 wireframe-button border-2 border-black border-dashed hover:border-solid hover:bg-black hover:text-white transition-all text-[10px] uppercase py-3 flex items-center justify-center gap-2 font-black tracking-wider bg-white text-black"
                  >
                    Send Additional Documents Back <Send size={12} />
                  </button>
                </section>
              </div>
            </div>

            <div className="pt-8 sm:pt-16 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <button 
                onClick={handleProcessReferral}
                className="wireframe-button bg-black text-white text-[11px] uppercase px-10 py-4 flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                Process Referral <Send size={14} />
              </button>
              <button 
                onClick={() => router.push(`/channels?practice=${encodeURIComponent(targetPractice)}`)}
                className="wireframe-button border-2 border-black hover:bg-black hover:text-white transition-all text-[11px] uppercase px-10 py-4 flex items-center justify-center gap-3 w-full sm:w-auto bg-white text-black font-black"
              >
                Continue Communication <MessageSquare size={14} />
              </button>
              <button className="wireframe-button text-[11px] uppercase px-10 py-4 w-full sm:w-auto bg-white text-black">
                Archive Case
              </button>
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
                  onClick={() => router.push(`/channels?practice=${encodeURIComponent(targetPractice)}`)}
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
          <p className="font-bold text-xs uppercase group-hover:underline">
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
