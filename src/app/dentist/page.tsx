"use client";

import React from 'react';
import { ArrowRight, FileText, GraduationCap, LogIn, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DentistEntryPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-3">
          <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Dentist Prototype</p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter italic leading-none">
            Refer patients and track specialist response.
          </h1>
          <p className="text-[11px] uppercase leading-relaxed font-bold text-muted-foreground max-w-2xl mx-auto">
            Start a referral without an account, or log in to see sent referrals, status updates, and specialist conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push('/dentist/referral')}
            className="wireframe-card p-8 text-left hover:bg-black hover:text-white transition-all group space-y-6"
          >
            <div className="w-14 h-14 border-2 border-black group-hover:border-white flex items-center justify-center">
              <FileText size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Refer a Patient</h2>
              <p className="text-[10px] uppercase leading-relaxed font-bold opacity-70">
                Send patient details, case notes, and records to a specialist without account friction.
              </p>
            </div>
            <span className="text-[10px] uppercase font-black flex items-center gap-2">
              Start Referral <ArrowRight size={14} />
            </span>
          </button>

          <button
            onClick={() => router.push('/dentist/dashboard')}
            className="wireframe-card p-8 text-left hover:bg-black hover:text-white transition-all group space-y-6"
          >
            <div className="w-14 h-14 border-2 border-black group-hover:border-white flex items-center justify-center">
              <LogIn size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Log In to Existing Account</h2>
              <p className="text-[10px] uppercase leading-relaxed font-bold opacity-70">
                Track sent referrals, read specialist updates, and manage referral conversations.
              </p>
            </div>
            <span className="text-[10px] uppercase font-black flex items-center gap-2">
              Enter Dentist Dashboard <ArrowRight size={14} />
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/dentist/academy')}
            className="wireframe-button py-4 text-[10px] uppercase font-black flex items-center justify-center gap-2"
          >
            Browse Learning Hub <GraduationCap size={14} />
          </button>
          <button
            onClick={() => router.push('/dentist/channels')}
            className="wireframe-button py-4 text-[10px] uppercase font-black flex items-center justify-center gap-2"
          >
            Preview Specialist Messages <MessageSquare size={14} />
          </button>
        </div>
      </div>
    </main>
  );
}
