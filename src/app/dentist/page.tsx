"use client";

import React, { useState } from 'react';
import { ArrowRight, FileText, LogIn, MessageSquare, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useVerification } from '@/components/VerificationContext';

type DentistMode = 'login' | 'no-account';

export default function DentistEntryPage() {
  const [mode, setMode] = useState<DentistMode>('login');
  const router = useRouter();
  const { verify } = useVerification();

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <section className="wireframe-card p-8 sm:p-10 bg-white border-2 border-black flex flex-col justify-between">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Dentist Prototype</p>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                Refer patients and track specialist response.
              </h1>
              <p className="text-[11px] uppercase leading-relaxed font-bold text-muted-foreground">
                Start a referral without an account, or log in to see sent referrals, status updates, and specialist conversations.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => router.push('/dentist/referral')}
                className="wireframe-button bg-black text-white py-4 text-[10px] uppercase font-black flex items-center justify-center gap-2"
              >
                Start Referral <ArrowRight size={14} />
              </button>
              <button
                onClick={() => router.push('/academy')}
                className="wireframe-button py-4 text-[10px] uppercase font-black flex items-center justify-center gap-2"
              >
                Learning Hub <GraduationCap size={14} />
              </button>
            </div>
          </div>
          <div className="mt-8 border-t border-black border-dashed pt-6">
            <p className="text-[9px] uppercase font-bold text-muted-foreground mb-4">Quick Links</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push('/dentist/channels')}
                className="text-[10px] uppercase font-black flex items-center gap-1.5 hover:underline"
              >
                <MessageSquare size={12} /> Specialist Messages
              </button>
              <button
                onClick={() => router.push('/dentist/referrals')}
                className="text-[10px] uppercase font-black flex items-center gap-1.5 hover:underline"
              >
                <FileText size={12} /> Tracking
              </button>
            </div>
          </div>
        </section>

        <section className="wireframe-card p-8 sm:p-10 space-y-8 bg-gray-50/50">
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Dentist Login</h2>
            <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed">
              Access your sent referrals, track status updates, and manage specialist coordination.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase">Email Address</label>
              <input type="email" placeholder="dentist@practice.com" className="wireframe-input bg-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase">Password</label>
              <input type="password" placeholder="........" className="wireframe-input bg-white" />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3 h-3 border-2 border-black rounded-none appearance-none checked:bg-black" />
                <span className="text-[9px] uppercase font-bold">Remember me</span>
              </label>
              <button className="text-[9px] uppercase font-bold underline">Forgot password?</button>
            </div>
          </div>

          <button
            onClick={() => {
              verify('owner');
              router.push('/dentist/dashboard');
            }}
            className="wireframe-button w-full bg-black text-white py-4 text-[10px] uppercase font-black flex items-center justify-center gap-2"
          >
            Enter Dentist Dashboard <LogIn size={14} />
          </button>

          <div className="text-center pt-4">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">
              New to drTalk?{' '}
              <button 
                onClick={() => router.push('/dentist/referral')}
                className="text-black underline"
              >
                Refer a patient without an account
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
