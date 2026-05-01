"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-black font-sans">
      <div className="wireframe-card max-w-xl w-full text-center space-y-12 p-16">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold uppercase tracking-tighter italic">drTalk</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
            Interactive Platform Prototype / HIPAA-Compliant Communication
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 pt-8">
          <button 
            onClick={() => router.push('/referral')}
            className="wireframe-button w-full uppercase text-sm bg-black text-white py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all font-black italic tracking-widest"
          >
            Send Secure Referral
          </button>
          
          <div className="flex gap-4 pt-4 border-t border-black border-dashed mt-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="wireframe-button flex-1 text-[10px] uppercase py-3 font-bold"
            >
              Enter Dashboard
            </button>
            <button 
              onClick={() => router.push('/onboarding')}
              className="wireframe-button flex-1 text-[10px] uppercase py-3 font-bold"
            >
              Join Network / Login
            </button>
          </div>
        </div>

        <div className="pt-12 border-t border-black border-dashed">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">
            Built for Dental Practices & Specialists
          </p>
        </div>
      </div>
    </main>
  );
}
