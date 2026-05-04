"use client";

import React, { useState } from 'react';
import { 
  X, FileText, Download, MessageSquare, Send, 
  AlertTriangle, CheckCircle2, MoreHorizontal, User, 
  Calendar, Phone, Mail, Paperclip 
} from 'lucide-react';
import { CommentMarker } from "./Comments/CommentMarker";

interface ReferralDetailProps {
  referral: any;
  onClose: () => void;
}

export const ReferralDetail = ({ referral, onClose }: ReferralDetailProps) => {
  const [activeTab, setActiveTab] = useState<'info' | 'docs'>('info');
  const [isEditorMode, setIsEditorMode] = useState(false);

  if (!referral) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Centered Modal Content */}
      <div className="relative w-full max-w-5xl bg-white max-h-full border-4 border-black flex flex-col shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="h-20 border-b-2 border-black flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-1 hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-all">
              <X size={24} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold uppercase tracking-tighter leading-none">{referral.patientName}</h2>
                <CommentMarker id="referral-detail" title="Referral Detail" description="Detailed view of a specific referral." />
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
                Ref ID: {referral.id}000X — {referral.status === 'Received' ? 'Received (Review)' : referral.status === 'Working on' ? 'Working on (In progress)' : referral.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="wireframe-button text-[10px] uppercase px-4 py-2 hover:bg-gray-100">
              Forward
            </button>
            <button className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-2">
              Mark as Processed
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Info Column */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 border-r-2 border-black">
            
            {/* AI Warning Banner */}
            {referral.confidence < 60 && (
              <div className="wireframe-card border-red-600 bg-red-50 p-4 flex gap-4 items-start">
                <AlertTriangle className="text-red-600 shrink-0" size={24} />
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase text-red-600 tracking-tighter">Low Confidence Data Extraction</p>
                  <p className="text-[10px] uppercase leading-relaxed mt-1">
                    Some fields were extracted from a {referral.source} with low confidence. Please verify all information before processing.
                  </p>
                  <button 
                    onClick={() => setIsEditorMode(true)}
                    className="text-[10px] font-black uppercase underline mt-2 hover:text-black"
                  >
                    Enter Editor Mode
                  </button>
                </div>
              </div>
            )}

            {/* Patient Info Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center border-b border-black pb-2">
                <h3 className="font-bold uppercase text-xs tracking-widest">Patient Information</h3>
                <button 
                  onClick={() => setIsEditorMode(!isEditorMode)}
                  className="text-[10px] font-bold uppercase underline"
                >
                  {isEditorMode ? 'Save' : 'Edit'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-1">
                  <label className="text-[8px] font-bold uppercase text-muted-foreground">Full Name</label>
                  {isEditorMode ? (
                    <input type="text" defaultValue={referral.patientName} className="wireframe-input py-1 text-xs" />
                  ) : (
                    <p className="font-bold text-sm uppercase">{referral.patientName}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-bold uppercase text-muted-foreground">Date of Birth</label>
                  <p className="font-bold text-sm uppercase">MAY 14, 1985</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-bold uppercase text-muted-foreground">Phone Number</label>
                  <p className="font-bold text-sm uppercase">(555) 012-3456</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-bold uppercase text-muted-foreground">Email Address</label>
                  <p className="font-bold text-sm uppercase">alice.cooper@example.com</p>
                </div>
              </div>
            </section>

            {/* Case Details */}
            <section className="space-y-4 pt-4">
              <h3 className="font-bold uppercase text-xs tracking-widest border-b border-black pb-2">Case Details</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-bold uppercase text-muted-foreground">Reason for Referral</label>
                  <p className="text-xs uppercase leading-relaxed font-medium">
                    Patient experiencing persistent pain in the upper left molar (tooth #14). Previous root canal treatment performed 5 years ago. Requires endodontic evaluation for possible retreatment or apicoectomy.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold uppercase text-muted-foreground">Source Provider</label>
                    <p className="text-[10px] font-bold uppercase">{referral.dentist}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold uppercase text-muted-foreground">Source Type</label>
                    <p className="text-[10px] font-bold uppercase">{referral.source}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Attachments */}
            <section className="space-y-4 pt-4">
              <h3 className="font-bold uppercase text-xs tracking-widest border-b border-black pb-2">Attachments (3)</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'X-Ray Upper Left.png', type: 'IMAGE' },
                  { name: 'Patient History.pdf', type: 'PDF' },
                  { name: 'Insurance Card.jpg', type: 'IMAGE' },
                ].map((doc) => (
                  <div key={doc.name} className="wireframe-card border p-3 flex flex-col items-center gap-2 hover:bg-gray-100 cursor-pointer group transition-all">
                    <div className="w-full aspect-square border-2 border-black border-dashed flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors">
                      <FileText size={24} className="text-muted-foreground" />
                    </div>
                    <p className="text-[8px] font-bold uppercase truncate w-full text-center">{doc.name}</p>
                    <div className="flex gap-2 pt-1 border-t border-black w-full justify-center">
                      <Download size={12} className="cursor-pointer hover:scale-110" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Activity/Comments Column */}
          <div className="w-96 overflow-hidden flex flex-col">
            <div className="p-4 border-b-2 border-black">
              <h3 className="font-bold uppercase text-[10px] tracking-widest">Activity & Collaboration</h3>
            </div>
            
            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {[
                { user: 'System', text: 'Referral received from Dr. Smith via Email.', time: '2h ago', type: 'system' },
                { user: 'Dr. John Doe', text: 'Looks like we need to schedule this ASAP. Check for tooth #14 history.', time: '1h ago', type: 'user' },
                { user: 'Sarah (Admin)', text: 'Requested previous treatment records from Dr. Smith.', time: '15m ago', type: 'user' },
              ].map((msg, i) => (
                <div key={i} className={`space-y-1 ${msg.type === 'system' ? 'text-center py-2' : ''}`}>
                  {msg.type === 'system' ? (
                    <span className="text-[8px] font-bold uppercase text-muted-foreground bg-gray-200 px-2 py-0.5">{msg.text}</span>
                  ) : (
                    <>
                      <div className="flex justify-between items-baseline">
                        <span className="text-[9px] font-bold uppercase">{msg.user}</span>
                        <span className="text-[8px] text-muted-foreground">{msg.time}</span>
                      </div>
                      <div className="wireframe-card p-2 text-[10px] uppercase leading-tight bg-white">
                        {msg.text}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t-2 border-black space-y-2">
              <div className="flex gap-2">
                <button className="text-[8px] font-black uppercase text-black border-b-2 border-black">Internal</button>
                <button className="text-[8px] font-bold uppercase text-muted-foreground">External</button>
              </div>
              <div className="relative">
                <textarea 
                  placeholder="ADD COMMENT..." 
                  className="wireframe-input h-20 text-[10px] uppercase py-2 resize-none"
                />
                <button className="absolute bottom-2 right-2 p-1.5 bg-black text-white hover:bg-gray-800 transition-colors">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
