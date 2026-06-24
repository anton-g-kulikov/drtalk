"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, GraduationCap, LogIn, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useVerification } from '@/components/VerificationContext';

export default function LandingPage() {
  const router = useRouter();
  const { verify } = useVerification();
  const [email, setEmail] = useState("specialist@practice.com");
  const [view, setView] = useState<'login' | 'forgot' | 'success'>('login');

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
          {view === 'login' && (
            <>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  <button 
                    onClick={() => setView('forgot')}
                    className="text-[9px] uppercase font-bold underline hover:text-muted-foreground transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    verify('owner');
                    const isDentistEmail = email.toLowerCase().includes('dentist');
                    router.push(isDentistEmail ? '/dentist/dashboard' : '/dashboard');
                  }}
                  className="wireframe-button w-full bg-black text-white py-5 text-[11px] uppercase font-black flex items-center justify-center gap-2 hover:bg-gray-900 transition-all"
                >
                  Enter Dashboard <LogIn size={16} />
                </button>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => {
                      verify('owner');
                      const isDentistEmail = email.toLowerCase().includes('dentist');
                      router.push(isDentistEmail ? '/dentist/dashboard' : '/dashboard');
                    }}
                    className="wireframe-button border-2 border-black py-3 text-[9px] uppercase font-black flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all bg-white text-black"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    Sign in with Google
                  </button>
                  <button
                    onClick={() => {
                      verify('owner');
                      const isDentistEmail = email.toLowerCase().includes('dentist');
                      router.push(isDentistEmail ? '/dentist/dashboard' : '/dashboard');
                    }}
                    className="wireframe-button border-2 border-black py-3 text-[9px] uppercase font-black flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all bg-white text-black"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 23 23" fill="currentColor">
                      <rect x="0" y="0" width="11" height="11" fill="#F25022" />
                      <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
                      <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
                      <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
                    </svg>
                    Sign in with Microsoft
                  </button>
                </div>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute w-full border-t border-black border-dashed opacity-20"></div>
                  <span className="relative bg-white px-4 text-[9px] font-black uppercase italic text-muted-foreground">OR</span>
                </div>

                <button
                  onClick={() => router.push('/onboarding')}
                  className="wireframe-button w-full border-2 border-black py-4 text-[11px] uppercase font-black flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all"
                >
                  Create or Join Practice <ArrowRight size={16} />
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
            </>
          )}

          {view === 'forgot' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <button 
                  onClick={() => setView('login')}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-black transition-colors mb-2"
                >
                  <ArrowLeft size={12} /> Back to Log In
                </button>
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Reset Password</h2>
                <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed">
                  Enter your email address to receive a secure password reset link.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    placeholder="doctor@practice.com"
                    className="wireframe-input w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => setView('success')}
                  className="wireframe-button w-full bg-black text-white py-5 text-[11px] uppercase font-black flex items-center justify-center gap-2 hover:bg-gray-900 transition-all mt-4"
                >
                  Send Reset Link <Mail size={16} />
                </button>
              </div>
            </div>
          )}

          {view === 'success' && (
            <div className="space-y-6 text-center py-4">
              <div className="flex justify-center text-black">
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Check Your Email</h2>
                <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed">
                  We have sent a secure password reset link to:
                </p>
                <div className="border-2 border-black bg-gray-50 py-3 px-4 font-mono text-xs font-bold inline-block break-all max-w-full">
                  {email}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setView('login')}
                  className="wireframe-button w-full border-2 border-black py-4 text-[11px] uppercase font-black flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all"
                >
                  Return to Log In
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="text-center">
          <button
            onClick={() => router.push('/referral')}
            className="text-[10px] uppercase font-black underline hover:text-muted-foreground transition-colors"
          >
            Refer a patient without an account
          </button>
        </div>
      </div>
    </main>
  );
}
