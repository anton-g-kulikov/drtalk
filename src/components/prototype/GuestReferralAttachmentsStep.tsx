"use client";

import { ArrowLeft, ChevronRight, FileText, Upload, X } from 'lucide-react';

type GuestReferralAttachmentsStepProps = {
  sendCopyToPatient: boolean;
  patientCell: string;
  patientEmail: string;
  onBack: () => void;
  onSubmit: () => void;
  onSendCopyToPatientChange: (sendCopy: boolean) => void;
  onPatientCellChange: (cell: string) => void;
  onPatientEmailChange: (email: string) => void;
};

export function GuestReferralAttachmentsStep({
  sendCopyToPatient,
  patientCell,
  patientEmail,
  onBack,
  onSubmit,
  onSendCopyToPatientChange,
  onPatientCellChange,
  onPatientEmailChange,
}: GuestReferralAttachmentsStepProps) {
  return (
    <div className="space-y-8 w-full max-w-lg">
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Back to case details"
          onClick={onBack}
          className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-2xl font-bold uppercase tracking-tighter">Attachments</h1>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <h3 className="text-xs font-bold uppercase">3. X-Rays & Records</h3>
        </div>
        <div className="space-y-6">
          <div className="border-4 border-black border-dashed p-12 text-center space-y-4 hover:bg-gray-50 transition-all cursor-pointer">
            <div className="flex justify-center">
              <Upload size={40} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-tighter">Drag & Drop Files Here</p>
              <p className="text-[8px] text-muted-foreground uppercase font-black">Supported: JPG, PNG, PDF, DICOM</p>
            </div>
            <button type="button" className="wireframe-button text-[10px] uppercase px-4 py-2">
              Browse Files
            </button>
          </div>

          <div className="space-y-2">
            <div className="wireframe-card p-3 border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={16} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">X-Ray_Upper_Left.jpg</span>
              </div>
              <X size={14} className="cursor-pointer" />
            </div>
          </div>

          <div className="space-y-4 border-2 border-black p-4 bg-gray-50/50 mt-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={sendCopyToPatient}
                onChange={(event) => onSendCopyToPatientChange(event.target.checked)}
                className="w-4 h-4 border-2 border-black rounded-none appearance-none checked:bg-black cursor-pointer"
              />
              <span className="text-xs font-black uppercase tracking-tight">Would you like to send a copy of this referral to your patient?</span>
            </label>

            {sendCopyToPatient && (
              <div className="space-y-3 pt-2 border-t border-black border-dashed animate-in fade-in duration-200">
                <div className="space-y-1">
                  <label htmlFor="guest-referral-patient-cell" className="text-[9px] font-black uppercase tracking-wider">Patient&apos;s Cell Phone</label>
                  <input
                    id="guest-referral-patient-cell"
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={patientCell}
                    onChange={(event) => onPatientCellChange(event.target.value)}
                    className="wireframe-input bg-white text-xs py-2 px-3"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="guest-referral-patient-email" className="text-[9px] font-black uppercase tracking-wider">Patient&apos;s Email Address (Optional)</label>
                  <input
                    id="guest-referral-patient-email"
                    type="email"
                    placeholder="patient@example.com"
                    value={patientEmail}
                    onChange={(event) => onPatientEmailChange(event.target.value)}
                    className="wireframe-input bg-white text-xs py-2 px-3"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 space-y-4 border-t-2 border-black">
          <button
            type="button"
            onClick={onSubmit}
            disabled={sendCopyToPatient && !patientCell}
            className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm font-black tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            SUBMIT SECURE REFERRAL <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
