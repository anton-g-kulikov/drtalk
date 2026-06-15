"use client";

import { Check } from 'lucide-react';
import type { UnifiedReferral } from '@/lib/referrals';
import type { ExternalViewerStatus } from '@/prototype/externalViewerState';

type ExternalViewerPatientStatusProps = {
  referral: UnifiedReferral;
  appointmentDate: string;
  attachedReport: string | null;
  showStatusSuccess: boolean;
  onAppointmentDateChange: (value: string) => void;
  onAttachReport: (value: string | null) => void;
  onSendReply: () => void;
  onUpdateStatus: (status: ExternalViewerStatus) => void;
};

export function ExternalViewerPatientStatus({
  referral,
  appointmentDate,
  attachedReport,
  showStatusSuccess,
  onAppointmentDateChange,
  onAttachReport,
  onSendReply,
  onUpdateStatus,
}: ExternalViewerPatientStatusProps) {
  return (
    <div className="wireframe-card p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between gap-4">
      <div className="space-y-3">
        <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-black text-white">Patient Record</span>
        <h2 className="text-2xl font-black uppercase tracking-tight italic">{referral.patientName}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[9px] uppercase font-bold text-muted-foreground">
          <div>
            <p className="text-gray-400 text-[8px] font-black">Urgency Level</p>
            <p className={`text-black font-black mt-0.5 ${referral.urgency === 'Emergency' ? 'text-red-600' : referral.urgency === 'Urgent' ? 'text-amber-600' : ''}`}>
              {referral.urgency || 'Routine'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-[8px] font-black">Referring Office</p>
            <p className="text-black mt-0.5">{referral.practice || referral.dentist}</p>
          </div>
          <div>
            <p className="text-gray-400 text-[8px] font-black">Referring Doctor</p>
            <p className="text-black mt-0.5">{referral.dentist}</p>
          </div>
        </div>
      </div>

      <div className="border-t md:border-t-0 md:border-l border-black border-dashed pt-4 md:pt-0 md:pl-6 flex flex-col justify-center min-w-[200px] space-y-2.5">
        <span className="text-[8px] font-black uppercase text-gray-500">Pipeline Coordination</span>

        <div className="flex justify-between items-center text-[9px] font-black uppercase">
          <button
            onClick={() => onUpdateStatus('Received')}
            className={`flex-1 py-1 text-center border-2 border-black transition-all ${
              referral.status === 'Received' ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]' : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            Review
          </button>
          <div className="w-2 h-0.5 bg-black" />
          <button
            onClick={() => onUpdateStatus('Scheduled')}
            className={`flex-1 py-1 text-center border-2 border-black transition-all ${
              referral.status === 'Scheduled' ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]' : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            Schedule
          </button>
          <div className="w-2 h-0.5 bg-black" />
          <button
            onClick={() => onUpdateStatus('Completed')}
            className={`flex-1 py-1 text-center border-2 border-black transition-all ${
              referral.status === 'Completed' ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]' : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            Complete
          </button>
        </div>

        {referral.status === 'Scheduled' && (
          <div className="animate-fade-in flex gap-2 items-center bg-zinc-50 border border-black p-1.5">
            <span className="text-[7px] font-black uppercase">Appt Date:</span>
            <input
              type="date"
              value={appointmentDate}
              onChange={(event) => onAppointmentDateChange(event.target.value)}
              className="border border-black bg-white text-[8px] font-bold p-0.5 w-full uppercase outline-none focus:ring-0"
            />
            <button onClick={() => onUpdateStatus('Scheduled')} className="p-1 bg-black text-white border border-black hover:bg-zinc-800">
              <Check size={8} />
            </button>
          </div>
        )}

        {referral.status === 'Completed' && (
          <div className="animate-fade-in flex flex-col gap-1 bg-zinc-50 border border-black p-1.5">
            <span className="text-[7px] font-black uppercase">Attach Post-Op Report:</span>
            <div className="flex gap-2">
              <button
                onClick={() => onAttachReport('POST_OP_REPORT_COMPLETED.PDF')}
                className={`flex-1 text-[7px] py-1 border border-black font-black uppercase ${
                  attachedReport ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                {attachedReport ? 'Report Attached' : 'Attach Mock Report'}
              </button>
              {attachedReport && (
                <button onClick={onSendReply} className="p-1 bg-black text-white border border-black hover:bg-zinc-800 text-[8px] px-2 font-black uppercase">
                  Send
                </button>
              )}
            </div>
          </div>
        )}

        {showStatusSuccess && (
          <p className="text-[8px] font-bold uppercase text-green-700 text-center animate-pulse">
            ✓ Pipeline updated in referring dentist&apos;s portal!
          </p>
        )}
      </div>
    </div>
  );
}
