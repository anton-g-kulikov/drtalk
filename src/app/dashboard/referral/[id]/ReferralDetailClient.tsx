"use client";

import React, { useState } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { 
  ArrowLeft, FileText, Download, 
  AlertTriangle, Send, MoreHorizontal, Pencil
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export type ReferralStatus = 'Received' | 'Scheduled' | 'Released' | 'Archived';

export default function ReferralDetailClient() {
  const router = useRouter();
  const params = useParams();
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ReferralStatus>('Received');

  // Mock data for the specific referral
  const mockReferrals = [
    { id: '1', patientName: 'Alice Cooper', type: 'Endodontic Consultation', source: 'Email', completion: 55, receivedAt: '08:20 AM\n05/11/2026', dentist: 'Dr. Smith', practice: 'Valley Endodontics', urgency: 'Routine' as const },
    { id: '2', patientName: 'Bob Marley', type: 'Dental Implant', source: 'Fax', completion: 45, receivedAt: '06:20 AM\n05/11/2026', dentist: 'Dr. Jones', practice: 'unknown', urgency: 'Urgent' as const },
    { id: '3', patientName: 'Charlie Brown', type: 'Emergency Extraction', source: 'App', completion: 100, receivedAt: '10:20 AM\n05/10/2026', dentist: 'Dr. Miller', practice: 'Miller & Associates', urgency: 'Emergency' as const },
    { id: '4', patientName: 'David Bowie', type: 'Invisalign Eval', source: 'Web', completion: 88, receivedAt: '10:20 AM\n05/09/2026', dentist: 'Dr. White', practice: 'White Dental Group', urgency: 'Routine' as const },
    { id: '5', patientName: 'Eve Online', type: 'Periodontal Surgery', source: 'Email', completion: 30, receivedAt: '09:20 AM\n05/11/2026', dentist: 'Dr. Black', practice: 'Black Family Dental', urgency: 'Routine' as const },
  ];

  const resolvedId = Array.isArray(params.id) ? params.id[0] : params.id;
  const referral = mockReferrals.find(r => r.id === resolvedId) || mockReferrals[0];
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'Emergency'>(referral.urgency || 'Routine');
  const [practiceName, setPracticeName] = useState(referral.practice);

  const getStatusColor = (status: ReferralStatus) => {
    switch (status) {
      case 'Received': return 'bg-gray-100 text-black border-black/30';
      case 'Scheduled': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Released': return 'bg-green-50 text-green-800 border-green-200';
      case 'Archived': return 'bg-gray-50 text-gray-800 border-gray-200';
      default: return 'bg-white';
    }
  };

  return (
    <MainLayout title="Referral Detail">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumbs / Back button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-5">
            <button 
              onClick={() => router.push('/referrals')}
              className="mt-1 p-2.5 border-2 border-black hover:bg-black hover:text-white transition-all bg-white"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Referrals / REF-{referral.id}000X</p>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black uppercase tracking-tighter">{referral.patientName}</h1>
                <CommentMarker id="dashboard-referral-detail" title="Dashboard Referral Detail" description="Referral detail view accessible from the dashboard." />
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
            </div>
          </div>
          
          <div className="flex gap-2">
            {currentStatus === 'Received' && (
              <button 
                onClick={() => setCurrentStatus('Scheduled')}
                className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-2"
              >
                Schedule
              </button>
            )}
            {currentStatus === 'Scheduled' && (
              <button 
                onClick={() => setCurrentStatus('Released')}
                className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-2"
              >
                Release Patient
              </button>
            )}
          </div>
        </div>

        {/* Content Layout */}
        <div className="wireframe-card p-0 flex flex-col md:flex-row overflow-hidden bg-white min-h-[75vh]">
          
          {/* Main Info */}
          <div className="flex-1 p-10 space-y-10 border-r-2 border-black">
            
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
                  className={isEditorMode ? "text-[10px] font-bold uppercase underline hover:text-black transition-colors" : "hover:opacity-75 transition-opacity pb-0.5"}
                  title={isEditorMode ? 'Save Changes' : 'Enter Edit Mode'}
                >
                  {isEditorMode ? 'Save Changes' : <Pencil size={12} className="text-black inline" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-10">
                <section className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase text-muted-foreground border-b border-black/10 pb-2">Patient Details</h4>
                  <div className="space-y-5">
                    <DataField label="Full Name" value={referral.patientName} edit={isEditorMode} onEditRequest={() => setIsEditorMode(true)} />
                    <DataField label="Date of Birth" value="MAY 14, 1985" edit={isEditorMode} onEditRequest={() => setIsEditorMode(true)} />
                    <DataField label="Contact Phone" value="(555) 012-3456" edit={isEditorMode} onEditRequest={() => setIsEditorMode(true)} />
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
                     <DataField label="Input Channel" value={referral.source} edit={isEditorMode} onEditRequest={() => setIsEditorMode(true)} />
                     <DataField 
                       label="Referring Practice" 
                       value={practiceName} 
                       edit={isEditorMode} 
                       onChange={setPracticeName}
                       canEditInline={true}
                       onEditRequest={() => setIsEditorMode(true)}
                     />
                     <DataField label="Referring Dentist" value={referral.dentist} edit={isEditorMode} onEditRequest={() => setIsEditorMode(true)} />
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
                </section>
              </div>
            </div>

            <div className="pt-16 flex gap-6">
              <button 
                onClick={() => setCurrentStatus('Archived')}
                className="wireframe-button text-[11px] uppercase px-10 py-4 hover:bg-black hover:text-white hover:border-black transition-all"
              >
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
                  <p className="text-[9px] font-black uppercase">System</p>
                  <p className="text-[8px] text-muted-foreground uppercase whitespace-pre-line text-right">08:20 AM{"\n"}05/11/2026</p>
                </div>
                <div className="wireframe-card p-3 text-[10px] uppercase leading-tight bg-white shadow-sm">
                  Referral received from <span className="font-black underline">{practiceName}</span> and auto-extracted via Digital Intake Pipeline.
                </div>
              </div>
              
              {currentStatus !== 'Received' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <p className="text-[9px] font-black uppercase">Specialist Team</p>
                    <p className="text-[8px] text-muted-foreground uppercase whitespace-pre-line text-right">Just now{"\n"}05/11/2026</p>
                  </div>
                  <div className="wireframe-card p-3 text-[10px] uppercase leading-tight bg-black text-white">
                    Case status updated to <span className="font-black">{currentStatus}</span>.
                  </div>
                </div>
              )}
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
  canEditInline,
  onEditRequest
}: { 
  label: string, 
  value: string, 
  edit?: boolean,
  onChange?: (val: string) => void,
  canEditInline?: boolean,
  onEditRequest?: () => void
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

  const isMissingValue = value.includes('MISSING');

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
            if (isMissingValue && onEditRequest) {
              onEditRequest();
            } else if (canEditInline) {
              setIsInlineEditing(true);
            }
          }}
          className={`group flex items-center gap-2 ${(canEditInline || (isMissingValue && onEditRequest)) ? 'cursor-pointer select-none' : ''}`}
        >
          <p className={`font-bold text-xs uppercase group-hover:underline ${isMissingValue ? 'text-red-600 bg-red-50 px-2 py-0.5 border border-red-300 rounded-sm inline-block' : ''}`}>
            {value}
          </p>
          {canEditInline && (
            <span className="text-[8px] opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity uppercase font-bold">
              (Click to edit)
            </span>
          )}
          {isMissingValue && onEditRequest && (
            <span className="text-[8px] opacity-0 group-hover:opacity-100 text-red-600 transition-opacity uppercase font-bold">
              (Click to enter edit mode)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
