"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { ReferralStatus } from '@/lib/referrals';

export type ReferralActivityLog = {
  user: string;
  text: string;
  time: string;
  isDark?: boolean;
};

export type ReferralPracticeTeamMember = {
  id: string;
  name: string;
  specialty?: string;
};

type ReferralActivitySidebarProps = {
  assignedTo: string;
  activityLogs: ReferralActivityLog[];
  commentText: string;
  currentStatus: ReferralStatus;
  dentistName: string;
  practiceName?: string;
  team: ReferralPracticeTeamMember[];
  onAssign: (memberId: string) => void;
  onCommentTextChange: (value: string) => void;
  onPostComment: () => void;
};

function getStatusColor(status: ReferralStatus) {
  switch (status) {
    case 'Received': return 'bg-gray-100 text-black border-black/30';
    case 'Accepted': return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'Scheduled': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    case 'Completed': return 'bg-green-50 text-green-800 border-green-200';
    case 'Archived': return 'bg-gray-50 text-gray-800 border-gray-200';
    default: return 'bg-white';
  }
}

export function ReferralActivitySidebar({
  assignedTo,
  activityLogs,
  commentText,
  currentStatus,
  dentistName,
  practiceName,
  team,
  onAssign,
  onCommentTextChange,
  onPostComment,
}: ReferralActivitySidebarProps) {
  return (
    <div className="w-full md:w-96 flex flex-col bg-gray-50/50">
      <div className="p-6 border-b-2 border-black bg-white flex items-center justify-between">
        <h3 className="font-bold uppercase text-xs tracking-widest">Case Activity</h3>
        <span className={`px-2 py-0.5 border text-[9px] font-black uppercase rounded-sm ${getStatusColor(currentStatus)}`}>
          {currentStatus === 'Received' ? 'Received (Review)' : currentStatus}
        </span>
      </div>

      <div className="p-6 border-b-2 border-black bg-white space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Working on This Referral</label>
        <div className="relative">
          <select value={assignedTo} onChange={(e) => onAssign(e.target.value)} className="wireframe-input w-full py-2.5 px-3 text-[10px] uppercase font-bold appearance-none bg-white pr-8 cursor-pointer focus:ring-1 focus:ring-black border-2 border-black">
            {team.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} {member.specialty ? `(${member.specialty})` : ''}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {assignedTo !== 'none' && (
          <div className="space-y-1 animate-in fade-in duration-200">
            <div className="flex justify-between items-baseline mb-1">
              <p className="text-[9px] font-bold uppercase text-muted-foreground">System</p>
              <p className="text-[8px] text-muted-foreground/60 uppercase whitespace-pre-line text-right">Active Assignment</p>
            </div>
            <div className="text-[11px] text-muted-foreground leading-relaxed">
              Case is currently assigned to <span className="font-bold text-black">{team.find((member) => member.id === assignedTo)?.name}</span>.
            </div>
          </div>
        )}

        {activityLogs.map((log, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-baseline mb-1">
              <p className="text-[9px] font-bold uppercase text-muted-foreground">{log.user}</p>
              <p className="text-[8px] text-muted-foreground/60 uppercase whitespace-pre-line text-right">{log.time}</p>
            </div>
            <div className={`text-[11px] leading-relaxed ${log.isDark ? 'text-black font-medium' : 'text-muted-foreground'}`}>
              {log.text.includes(practiceName || 'unknown') && log.text.includes('received') ? (
                <>
                  Referral received from <span className="font-bold text-black">{practiceName || dentistName}</span> and auto-extracted via Digital Intake Pipeline.
                </>
              ) : log.text.includes(dentistName) && log.text.includes('clinical records') ? (
                <>
                  Clinical records requested from <span className="font-bold text-black">{dentistName}</span>&apos;s office. Pending response.
                </>
              ) : (
                <span className="capitalize-first">{log.text.toLowerCase()}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t-2 border-black bg-white space-y-4">
        <textarea placeholder="ADD INTERNAL NOTE..." className="wireframe-input h-28 text-[11px] uppercase p-3 resize-none bg-gray-50 focus:bg-white transition-colors" value={commentText} onChange={(e) => onCommentTextChange(e.target.value)} />
        <button onClick={onPostComment} className="wireframe-button w-full bg-black text-white text-[11px] uppercase py-3 font-black tracking-widest">
          Post Comment
        </button>
      </div>
    </div>
  );
}
