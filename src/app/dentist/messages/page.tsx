"use client";

import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { ArrowLeft, FileText, MessageSquare, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DentistMessagesPage() {
  const router = useRouter();

  return (
    <MainLayout title="Specialist Messages">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.push('/dentist/dashboard')}
            className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all bg-white"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Dentist to Specialist</p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">Referral Conversation</h2>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">
              Dentists can message specialists about referral status and missing records. Patient communication stays with the specialist.
            </p>
          </div>
        </div>

        <div className="wireframe-card p-0 overflow-hidden bg-white">
          <div className="p-5 border-b-2 border-black flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-black flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <div>
                <p className="text-xs uppercase font-black">Valley Endodontics</p>
                <p className="text-[9px] uppercase text-muted-foreground font-bold">Alice Cooper / D-1001</p>
              </div>
            </div>
            <span className="border border-black px-2 py-1 text-[8px] uppercase font-black">Referral Accepted</span>
          </div>

          <div className="p-6 sm:p-8 space-y-6 bg-gray-50">
            <Message user="Valley Endodontics" time="10:42 AM" text="Referral accepted. We are contacting Alice to schedule an endodontic evaluation." />
            <Message user="Sunshine Dental" time="10:50 AM" text="Thanks. We uploaded the bitewing and clinical notes with the referral." self />
            <Message user="Valley Endodontics" time="11:05 AM" text="Received. If you have a pano image, please add it before the consult." />
            <div className="wireframe-card p-3 bg-white flex items-center gap-3">
              <FileText size={16} />
              <span className="text-[10px] uppercase font-black">Referral documents shared with specialist</span>
            </div>
          </div>

          <div className="p-5 border-t-2 border-black bg-white space-y-4">
            <textarea
              placeholder="MESSAGE SPECIALIST TEAM..."
              className="wireframe-input h-24 text-[11px] uppercase p-3 resize-none bg-gray-50"
            />
            <button className="wireframe-button bg-black text-white text-[10px] uppercase py-3 px-6 flex items-center justify-center gap-2 w-full sm:w-auto">
              Send Message <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function Message({ user, time, text, self = false }: { user: string; time: string; text: string; self?: boolean }) {
  return (
    <div className={`flex flex-col ${self ? 'items-end' : 'items-start'} gap-1`}>
      <div className="flex items-center gap-2">
        <span className="text-[9px] uppercase font-black">{self ? 'You' : user}</span>
        <span className="text-[8px] uppercase font-bold text-muted-foreground">{time}</span>
      </div>
      <div className={`wireframe-card p-3 max-w-xl text-[10px] uppercase font-bold leading-relaxed ${self ? 'bg-black text-white' : 'bg-white text-black'}`}>
        {text}
      </div>
    </div>
  );
}
