"use client";

import { AlertCircle, FileText, Plus, Users } from 'lucide-react';
import { CommentMarker } from '@/components/Comments/CommentMarker';

type DentistDashboardHeaderProps = {
  isVerified: boolean;
  hasPracticeOwner: boolean;
  showCommentMarker?: boolean;
  onVerifyIdentity: () => void;
  onInvitePracticeOwner: () => void;
  onSendReferral: () => void;
  onSendDocument: () => void;
};

export function DentistDashboardHeader({
  isVerified,
  hasPracticeOwner,
  showCommentMarker = true,
  onVerifyIdentity,
  onInvitePracticeOwner,
  onSendReferral,
  onSendDocument,
}: DentistDashboardHeaderProps) {
  return (
    <>
      <div className="space-y-4">
        {!isVerified && (
          <div className="wireframe-card border-black bg-gray-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center shrink-0 bg-white">
                <AlertCircle className="text-black" size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-black uppercase text-sm tracking-tight leading-none text-black">Verification Required</h3>
                <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed max-w-xl">
                  Practice owner verification is required to refer patients and access PHI.
                </p>
              </div>
            </div>
            <button
              onClick={onVerifyIdentity}
              className="wireframe-button bg-black text-white text-[10px] uppercase px-8 py-3 whitespace-nowrap"
            >
              Verify Identity Now
            </button>
          </div>
        )}

        {isVerified && !hasPracticeOwner && (
          <div className="wireframe-card border-black bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500 border-dashed">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center shrink-0 bg-gray-50">
                <Users className="text-black" size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-black uppercase text-sm tracking-tight leading-none text-black">Practice Owner Required</h3>
                <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed max-w-xl">
                  This practice does not have a verified owner yet. Please invite a doctor to verify their identity and unlock full clinical capabilities.
                </p>
              </div>
            </div>
            <button
              onClick={onInvitePracticeOwner}
              className="wireframe-button bg-black text-white text-[10px] uppercase px-8 py-3 whitespace-nowrap"
            >
              Invite Practice Owner
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">Dashboard</h2>
            {showCommentMarker && (
              <CommentMarker id="dashboard-dentist" title="Dentist Dashboard" description="The main overview for dentist practices." />
            )}
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            REFER PATIENTS, Track Patient&apos;s Progress, And completion of specialty care
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={onSendReferral}
            className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-3 flex items-center justify-center gap-2 flex-1 sm:flex-none hover:bg-zinc-800 transition-colors"
          >
            Send a Referral <Plus size={14} />
          </button>
          <button
            onClick={onSendDocument}
            className="wireframe-button bg-white text-black border-black text-[10px] uppercase px-6 py-3 flex items-center justify-center gap-2 flex-1 sm:flex-none hover:bg-zinc-100 transition-colors"
          >
            Send Document <FileText size={14} />
          </button>
        </div>
      </div>
    </>
  );
}
