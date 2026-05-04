"use client";

import React, { useState } from 'react';
import { ArrowRight, Building2, LogIn, Plus, Users } from 'lucide-react';
import { CommentMarker } from '@/components/Comments/CommentMarker';
import { useRouter } from 'next/navigation';

type SpecialistMode = 'login' | 'signup';

export default function SpecialistEntryPage() {
  const [mode, setMode] = useState<SpecialistMode>('login');
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <section className="wireframe-card p-8 sm:p-10 bg-black text-white flex flex-col justify-between">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-[10px] uppercase font-black tracking-widest text-white/60">Specialist Prototype</p>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
                Manage referrals, practice operations, and care channels.
              </h1>
              <p className="text-[11px] uppercase leading-relaxed font-bold text-white/70">
                Specialists receive referrals, process cases, talk with dentists, and manage patient SMS/email communication from the practice workspace.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Building2, label: 'Practice Setup' },
                { icon: Users, label: 'Referral Intake' },
                { icon: Plus, label: 'Learning Resources' },
              ].map((item) => (
                <div key={item.label} className="border border-white/40 p-4 space-y-3">
                  <item.icon size={20} />
                  <p className="text-[9px] uppercase font-black">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => router.push('/academy')}
            className="mt-8 text-left text-[10px] uppercase font-black underline text-white/80 hover:text-white"
          >
            Browse public Learning Hub
          </button>
        </section>

        <section className="wireframe-card p-8 sm:p-10 space-y-8">
          <div className="flex border-2 border-black p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-[10px] uppercase font-black ${mode === 'login' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-[10px] uppercase font-black ${mode === 'signup' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              Sign Up / Create Practice
            </button>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              {mode === 'login' ? 'Specialist Login' : 'Create Specialist Workspace'}
            </h2>
            <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed">
              {mode === 'login'
                ? 'Access received referrals, practice channels, patient communication, and Learning Hub tools.'
                : 'Create your account, then create or join a practice workspace for referral processing.'}
            </p>
          </div>

          <div className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">First Name</label>
                  <input className="wireframe-input" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">Last Name</label>
                  <input className="wireframe-input" />
                </div>
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold uppercase">Email Address</label>
                {mode === 'signup' && (
                  <CommentMarker 
                    id="specialist-signup-email"
                    title="Corporate Email Policy"
                    description="Personal emails will be checked and discouraged. The system will ask users to register with a corporate email, but they would still be able to continue with a Gmail/personal account if a professional one is unavailable."
                  />
                )}
              </div>
              <input type="email" placeholder="doctor@specialtypractice.com" className="wireframe-input" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase">Password</label>
              <input type="password" placeholder="........" className="wireframe-input" />
            </div>
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase">Practice Setup</label>
                <select className="wireframe-input appearance-none bg-transparent">
                  <option>Create new specialist practice</option>
                  <option>Join existing specialist practice</option>
                </select>
              </div>
            )}
          </div>

          <button
            onClick={() => router.push(mode === 'signup' ? '/onboarding' : '/dashboard')}
            className="wireframe-button w-full bg-black text-white py-4 text-[10px] uppercase font-black flex items-center justify-center gap-2"
          >
            {mode === 'login' ? 'Enter Specialist Dashboard' : 'Continue Practice Setup'}
            {mode === 'login' ? <LogIn size={14} /> : <ArrowRight size={14} />}
          </button>
        </section>
      </div>
    </main>
  );
}
