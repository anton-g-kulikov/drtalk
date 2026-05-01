"use client";

import React, { useState } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { 
  ArrowLeft, FileText, Download, 
  AlertTriangle, Send, MoreHorizontal 
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export default function ReferralDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [isEditorMode, setIsEditorMode] = useState(false);

  // Mock data for the specific referral
  const referral = {
    id: params.id,
    patientName: 'Alice Cooper',
    type: 'Endodontic Consultation',
    source: 'Email',
    confidence: 55,
    status: 'Received',
    receivedAt: '2h ago',
    dentist: 'Dr. Smith'
  };

  return (
    <MainLayout title="Referral Detail">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumbs / Back button */}
        <div className="flex items-start gap-5">
          <button 
            onClick={() => router.push('/referrals')}
            className="mt-1 p-2.5 border-2 border-black hover:bg-black hover:text-white transition-all bg-white"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Referrals / REF-{referral.id}000X</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter">{referral.patientName}</h1>
          </div>
        </div>

        {/* Content Layout */}
        <div className="wireframe-card p-0 flex flex-col md:flex-row overflow-hidden bg-white min-h-[75vh]">
          
          {/* Main Info */}
          <div className="flex-1 p-10 space-y-10 border-r-2 border-black">
            
            {/* AI Warning Banner */}
            {referral.confidence < 60 && (
              <div className="wireframe-card border-red-600 bg-red-50 p-6 flex gap-5 items-start">
                <AlertTriangle className="text-red-600 shrink-0" size={28} />
                <div className="flex-1">
                  <p className="text-[11px] font-black uppercase text-red-600 tracking-tighter">Low Confidence Data Extraction</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
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
                  <h4 className="text-[11px] font-black uppercase text-muted-foreground border-b border-black/10 pb-2">Clinical Source</h4>
                  <div className="space-y-5">
                    <DataField label="Referring Dentist" value={referral.dentist} />
                    <DataField label="Input Channel" value={referral.source} />
                  </div>
                </section>
              </div>

              <div className="space-y-10">
                <section className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase text-muted-foreground border-b border-black/10 pb-2">Clinical Narrative</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase text-muted-foreground tracking-tighter">Reason for Referral</label>
                      <p className="text-xs uppercase leading-relaxed font-bold italic">
                        Patient experiencing persistent pain in the upper left molar (tooth #14). Requires immediate endodontic evaluation for possible retreatment of root canal.
                      </p>
                    </div>
                  </div>
                </section>
                <section className="space-y-6">
                  <h4 className="text-[11px] font-black uppercase text-muted-foreground border-b border-black/10 pb-2">Attachments (3)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="aspect-square border-2 border-black border-dashed flex flex-col items-center justify-center p-3 group hover:bg-black hover:text-white cursor-pointer transition-all">
                        <FileText size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[7px] font-black mt-3 uppercase tracking-tighter">View_Scan_{i}.dcm</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="pt-16 flex gap-6">
              <button className="wireframe-button bg-black text-white text-[11px] uppercase px-10 py-4 flex items-center gap-3">
                Process Referral <Send size={14} />
              </button>
              <button className="wireframe-button text-[11px] uppercase px-10 py-4">
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
                  <p className="text-[8px] text-muted-foreground uppercase">2h ago</p>
                </div>
                <div className="wireframe-card p-3 text-[10px] uppercase leading-tight bg-white shadow-sm">
                  Referral received from <span className="font-black underline">Alice Cooper</span> and auto-extracted via AI Pipeline.
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <p className="text-[9px] font-black uppercase">Administrator</p>
                  <p className="text-[8px] text-muted-foreground uppercase">1h ago</p>
                </div>
                <div className="wireframe-card p-3 text-[10px] uppercase leading-tight bg-black text-white">
                  Clinical records requested from Dr. Smith's office. Pending response.
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

function DataField({ label, value, edit }: { label: string, value: string, edit?: boolean }) {
  return (
    <div className="space-y-1">
      <label className="text-[8px] font-bold uppercase text-muted-foreground">{label}</label>
      {edit ? (
        <input type="text" defaultValue={value} className="wireframe-input py-1 text-xs" />
      ) : (
        <p className="font-bold text-xs uppercase">{value}</p>
      )}
    </div>
  );
}
