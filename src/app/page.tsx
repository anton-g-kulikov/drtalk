"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, GraduationCap, Stethoscope, Users } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white text-black font-sans p-4 sm:p-10 flex items-center justify-center">
      <div className="w-full max-w-6xl space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold uppercase tracking-tighter italic leading-none">drTalk</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold max-w-2xl mx-auto">
            Choose the prototype track. Dentists send and track referrals. Specialists receive, process, and coordinate care.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="wireframe-card p-6 sm:p-8 space-y-8">
            <div className="space-y-4">
              <div className="w-14 h-14 border-2 border-black flex items-center justify-center">
                <Stethoscope size={28} />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dentist Track</p>
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Send & Track Referrals</h2>
                <p className="text-[11px] uppercase leading-relaxed font-bold text-muted-foreground">
                  Refer patients without friction, then log in to monitor status updates and talk with the specialist team.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => router.push('/dentist/referral')}
                className="wireframe-button bg-black text-white py-4 text-[10px] uppercase font-black flex items-center justify-center gap-2"
              >
                Refer a Patient <ArrowRight size={14} />
              </button>
              <button
                onClick={() => router.push('/dentist')}
                className="wireframe-button py-4 text-[10px] uppercase font-black"
              >
                Log In to Existing Account
              </button>
            </div>
            <div className="border-t border-black border-dashed pt-4 flex items-center gap-2 text-muted-foreground">
              <GraduationCap size={14} />
              <p className="text-[9px] uppercase font-bold">Public Learning Hub resources are open to dentists.</p>
            </div>
          </section>

          <section className="wireframe-card p-6 sm:p-8 space-y-8 bg-black text-white">
            <div className="space-y-4">
              <div className="w-14 h-14 border-2 border-white flex items-center justify-center">
                <Users size={28} />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Specialist Track</p>
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Receive & Process Referrals</h2>
                <p className="text-[11px] uppercase leading-relaxed font-bold text-white/70">
                  Log in or create a practice to manage incoming referrals, dentist conversations, and patient communication.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => router.push('/specialist')}
                className="bg-white text-black border-2 border-white py-4 px-4 text-[10px] uppercase font-black hover:bg-gray-200 transition-all"
              >
                Log In
              </button>
              <button
                onClick={() => router.push('/specialist')}
                className="border-2 border-white py-4 px-4 text-[10px] uppercase font-black hover:bg-white hover:text-black transition-all"
              >
                Sign Up / Create Practice
              </button>
            </div>
            <div className="border-t border-white/40 border-dashed pt-4 flex items-center gap-2 text-white/70">
              <GraduationCap size={14} />
              <p className="text-[9px] uppercase font-bold">Specialists can browse and create Learning Hub resources too.</p>
            </div>
          </section>
        </div>

        <div className="wireframe-card p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <p className="text-[9px] uppercase font-bold text-muted-foreground">Dentist: sends referrals and tracks outcomes</p>
            <p className="text-[9px] uppercase font-bold text-muted-foreground">Specialist: receives referrals and coordinates care</p>
            <p className="text-[9px] uppercase font-bold text-muted-foreground">Shared: Learning Hub access and resource creation</p>
          </div>
        </div>
      </div>
    </main>
  );
}
