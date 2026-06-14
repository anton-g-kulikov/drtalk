"use client";

import { AlertCircle, FileText, Users } from 'lucide-react';
import { CommentMarker } from '@/components/Comments/CommentMarker';

type SpecialistDashboardHeaderProps = {
  isVerified: boolean;
  hasPracticeOwner: boolean;
  showCommentMarker?: boolean;
  onVerifyIdentity: () => void;
  onInvitePracticeOwner: () => void;
  onSendDocument: () => void;
};

export function SpecialistDashboardHeader({
  isVerified,
  hasPracticeOwner,
  showCommentMarker = true,
  onVerifyIdentity,
  onInvitePracticeOwner,
  onSendDocument,
}: SpecialistDashboardHeaderProps) {
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
                  Practice owner verification is required to process referrals and access PHI.
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
              className="text-[10px] font-black uppercase border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all whitespace-nowrap"
            >
              Invite Practice Owner
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter italic">Dashboard</h2>
            {showCommentMarker && (
              <CommentMarker id="dashboard-practice" title="Practice Dashboard" description="The main overview for the practice workspace." />
            )}
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            Receive referrals, process cases, coordinate with dentists, and manage patient communication.
          </p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button
            onClick={onSendDocument}
            className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-3 flex items-center justify-center gap-2 flex-1 sm:flex-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black transition-all"
          >
            Send Document <FileText size={14} />
          </button>
        </div>
      </div>
    </>
  );
}
