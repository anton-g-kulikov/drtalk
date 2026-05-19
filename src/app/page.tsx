"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, GraduationCap, LogIn } from 'lucide-react';
import { useVerification } from '@/components/VerificationContext';

export default function LandingPage() {
  const router = useRouter();
  const { verify } = useVerification();

  return (
    <main className="min-h-screen bg-white text-black font-sans p-4 sm:p-10 flex items-center justify-center">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl sm:text-7xl font-bold uppercase tracking-tighter italic leading-none">drTalk</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
            Referrals & Care Coordination
          </p>
        </div>

        <section className="wireframe-card p-8 sm:p-10 space-y-8 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Log In</h2>
            <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed">
              Access your practice dashboard, track referrals, and coordinate patient care.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                placeholder="doctor@practice.com" 
                className="wireframe-input w-full" 
                defaultValue="dentist@practice.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="wireframe-input w-full" 
                defaultValue="password123"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3 h-3 border-2 border-black rounded-none appearance-none checked:bg-black" />
                <span className="text-[9px] uppercase font-bold">Remember me</span>
              </label>
              <button className="text-[9px] uppercase font-bold underline">Forgot password?</button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                verify('owner');
                router.push('/dentist/dashboard');
              }}
              className="wireframe-button w-full bg-black text-white py-5 text-[11px] uppercase font-black flex items-center justify-center gap-2 hover:bg-gray-900 transition-all"
            >
              Enter Dashboard <LogIn size={16} />
            </button>
            
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute w-full border-t border-black border-dashed opacity-20"></div>
              <span className="relative bg-white px-4 text-[9px] font-black uppercase italic text-muted-foreground">OR</span>
            </div>

            <button
              onClick={() => router.push('/onboarding')}
              className="wireframe-button w-full border-2 border-black py-4 text-[11px] uppercase font-black flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all"
            >
              Sign Up / Create Practice <ArrowRight size={16} />
            </button>
          </div>

          <button
            onClick={() => router.push('/onboarding?type=individual')}
            className="border-t border-black border-dashed pt-6 w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-black transition-colors"
          >
            <GraduationCap size={14} />
            <p className="text-[9px] uppercase font-black underline">
              Ready to learn? Create a free individual account for the Learning Hub →
            </p>
          </button>
        </section>

        <div className="text-center">
          <button 
            onClick={() => router.push('/dentist/referral')}
            className="text-[10px] uppercase font-black underline hover:text-muted-foreground transition-colors"
          >
            Refer a patient without an account
          </button>
        </div>
      </div>
    </main>
  );
}
