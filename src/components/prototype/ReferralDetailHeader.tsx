"use client";

import React from 'react';
import { ArrowLeft, Check, ChevronDown, MessageSquare } from 'lucide-react';
import { CommentMarker } from '@/components/Comments/CommentMarker';
import { getReferralCode, type ReferralStatus, type UnifiedReferral } from '@/lib/referrals';

type ReferralDetailHeaderProps = {
  referral: UnifiedReferral;
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  currentStatus: ReferralStatus;
  assignedTo: string;
  targetPractice: string;
  isStatusDropdownOpen: boolean;
  setIsStatusDropdownOpen: (open: boolean) => void;
  onBack: () => void;
  onMainNextAction: () => void;
  onStatusChange: (status: ReferralStatus) => void;
  onProcessReferral: () => void;
  onOpenCaseChat: () => void;
  onMessagePatient?: () => void;
};

export function ReferralDetailHeader({
  referral,
  urgency,
  currentStatus,
  assignedTo,
  targetPractice: _targetPractice,
  isStatusDropdownOpen,
  setIsStatusDropdownOpen,
  onBack,
  onMainNextAction,
  onStatusChange,
  onProcessReferral,
  onOpenCaseChat,
  onMessagePatient,
}: ReferralDetailHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-black pb-6">
      <div className="flex items-start gap-3 sm:gap-5">
        <button onClick={onBack} className="mt-1 p-2 border-2 border-black hover:bg-black hover:text-white transition-all bg-white">
          <ArrowLeft size={16} />
        </button>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Referrals / {getReferralCode(referral.id)}</p>
            {referral.id.startsWith('ext-') && (
              <span className="bg-red-50 text-red-800 border-red-200 px-2 py-0.5 border text-[9px] font-black uppercase rounded-sm">
                {referral.source === 'Fax' ? 'External — Secure Fax Referral' : 'External — Secure Email Referral'}
              </span>
            )}
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

      <div className="flex flex-wrap items-center gap-3 relative">
        <div className="relative flex items-stretch">
          <button onClick={onMainNextAction} className="wireframe-button bg-black text-white text-[10px] uppercase px-5 py-3 flex items-center justify-center font-black tracking-widest border-2 border-black border-r-0 hover:bg-zinc-800 transition-colors rounded-r-none h-11 disabled:opacity-50 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
            {currentStatus === 'Received' || currentStatus === 'Sent' ? 'Accept Referral' :
              currentStatus === 'Accepted' ? 'Schedule' :
              currentStatus === 'Scheduled' ? 'Release Patient' :
              currentStatus === 'Released' ? 'Archive Case' :
              'Reopen Case'}
          </button>

          <button onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)} className="wireframe-button bg-black text-white px-3 py-3 flex items-center justify-center border-2 border-black hover:bg-zinc-800 transition-colors rounded-l-none h-11 border-l-zinc-700">
            <ChevronDown size={14} className={`transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 py-1 divide-y divide-black/10 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 bg-gray-50 border-b border-black">
                <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Change Status</p>
              </div>
              {[
                { status: 'Received', label: 'Received (Review)' },
                { status: 'Accepted', label: 'Accepted' },
                { status: 'Scheduled', label: 'Scheduled' },
                { status: 'Released', label: 'Released' },
                { status: 'Archived', label: 'Archived' },
              ].map((item) => (
                <button
                  key={item.status}
                  onClick={() => {
                    if (item.status === 'Released') {
                      onProcessReferral();
                    } else {
                      onStatusChange(item.status as ReferralStatus);
                    }
                    setIsStatusDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase transition-all flex items-center justify-between hover:bg-black hover:text-white ${currentStatus === item.status ? 'bg-zinc-100 text-black font-black' : 'text-black bg-white'} disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <span>{item.label}</span>
                  {currentStatus === item.status && <Check size={10} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {currentStatus !== 'Received' && currentStatus !== 'Sent' && currentStatus !== 'Draft' && (
          <button onClick={onOpenCaseChat} className="wireframe-button border-2 border-black hover:bg-black hover:text-white transition-all text-[10px] uppercase px-5 py-3 flex items-center gap-2 bg-white text-black font-black">
            Open Case Chat <MessageSquare size={12} />
          </button>
        )}

        {currentStatus !== 'Draft' && onMessagePatient && (
          <button onClick={onMessagePatient} className="wireframe-button border-2 border-black hover:bg-black hover:text-white transition-all text-[10px] uppercase px-5 py-3 flex items-center gap-2 bg-white text-black font-black">
            Message Patient <MessageSquare size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
