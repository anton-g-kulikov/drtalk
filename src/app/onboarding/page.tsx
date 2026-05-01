"use client";

import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, CheckCircle2, ShieldCheck, Users, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type OnboardingStep = 
  | 'AUTH' 
  | 'VERIFY' 
  | 'ROLE_SELECTION' 
  | 'PRACTICE_DETAILS' 
  | 'PRACTICE_VERIFY' 
  | 'PRACTICE_INVITE' 
  | 'SUCCESS';

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>('AUTH');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const nextStep = (next: OnboardingStep) => setStep(next);

  const renderStep = () => {
    switch (step) {
      case 'AUTH':
        return (
          <div className="space-y-6 w-full max-w-sm">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold uppercase tracking-tighter">drTalk</h1>
              <p className="text-xs text-muted-foreground uppercase">{isLogin ? 'Login to your account' : 'Create your account'}</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase">Email Address</label>
                <input type="email" placeholder="doctor@practice.com" className="wireframe-input" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase">Password</label>
                <input type="password" placeholder="••••••••" className="wireframe-input" />
              </div>
              {!isLogin && (
                <div className="flex gap-4">
                  <div className="space-y-1 flex-1">
                    <label className="text-[10px] font-bold uppercase">First Name</label>
                    <input type="text" className="wireframe-input" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <label className="text-[10px] font-bold uppercase">Last Name</label>
                    <input type="text" className="wireframe-input" />
                  </div>
                </div>
              )}
              <button 
                onClick={() => nextStep('VERIFY')}
                className="wireframe-button w-full bg-black text-white py-3 uppercase text-sm mt-4"
              >
                {isLogin ? 'Login' : 'Create Account'}
              </button>
            </div>
            <p className="text-center text-[10px] uppercase font-bold text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
              <span 
                className="text-black cursor-pointer underline" 
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </span>
            </p>
          </div>
        );

      case 'VERIFY':
        return (
          <div className="space-y-6 w-full max-w-sm text-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold uppercase tracking-tighter">Verify Email</h1>
              <p className="text-[10px] text-muted-foreground uppercase leading-relaxed">
                We sent a 6-digit code to your email.<br />Enter it below to continue.
              </p>
            </div>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <input key={i} type="text" maxLength={1} className="w-10 h-12 border-2 border-black text-center font-bold text-xl focus:bg-black focus:text-white outline-none transition-all" />
              ))}
            </div>
            <button 
              onClick={() => nextStep('ROLE_SELECTION')}
              className="wireframe-button w-full bg-black text-white py-3 uppercase text-sm"
            >
              Verify & Continue
            </button>
            <p className="text-[10px] uppercase font-bold text-muted-foreground cursor-pointer hover:text-black">
              Resend Code
            </p>
          </div>
        );

      case 'ROLE_SELECTION':
        return (
          <div className="space-y-8 w-full max-w-2xl">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold uppercase tracking-tighter">Welcome to drTalk</h1>
              <p className="text-xs text-muted-foreground uppercase">How would you like to start?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => nextStep('PRACTICE_DETAILS')}
                className="wireframe-card hover:bg-black hover:text-white cursor-pointer transition-all group p-8 space-y-4"
              >
                <Building2 size={32} />
                <h3 className="font-bold uppercase text-lg">Create New Practice</h3>
                <p className="text-xs uppercase leading-relaxed opacity-70">
                  I want to set up a new practice profile and invite my clinical team.
                </p>
              </div>
              <div className="wireframe-card hover:bg-black hover:text-white cursor-pointer transition-all group p-8 space-y-4 border-dashed opacity-50">
                <Users size={32} />
                <h3 className="font-bold uppercase text-lg">Join Existing Team</h3>
                <p className="text-xs uppercase leading-relaxed opacity-70">
                  My practice is already on drTalk. I have an invite code.
                </p>
              </div>
            </div>
          </div>
        );

      case 'PRACTICE_DETAILS':
        return (
          <div className="space-y-8 w-full max-w-lg">
            <div className="flex items-center gap-4">
              <button onClick={() => nextStep('ROLE_SELECTION')} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tighter">Practice Details</h1>
                <p className="text-[10px] text-muted-foreground uppercase">Step 1 of 3</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase">Practice Name</label>
                <input type="text" placeholder="Sunshine Dental" className="wireframe-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">Type</label>
                  <select className="wireframe-input appearance-none bg-transparent">
                    <option>Dentist</option>
                    <option>Specialist</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">City</label>
                  <input type="text" className="wireframe-input" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase">Full Address</label>
                <input type="text" className="wireframe-input" />
              </div>
              <button 
                onClick={() => nextStep('PRACTICE_VERIFY')}
                className="wireframe-button w-full bg-black text-white py-3 uppercase text-sm mt-4 flex items-center justify-center gap-2"
              >
                Next Step <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );

      case 'PRACTICE_VERIFY':
        return (
          <div className="space-y-8 w-full max-w-lg">
            <div className="flex items-center gap-4">
              <button onClick={() => nextStep('PRACTICE_DETAILS')} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tighter">Identity & NPI</h1>
                <p className="text-[10px] text-muted-foreground uppercase">Step 2 of 3</p>
              </div>
            </div>
            <div className="wireframe-card bg-gray-50 space-y-4">
              <div className="flex gap-4 items-start">
                <ShieldCheck className="text-black shrink-0" size={24} />
                <p className="text-[10px] uppercase font-bold leading-relaxed">
                  To enable HIPAA-compliant features (PHI), we need to verify your medical license or NPI number.
                </p>
              </div>
              <div className="space-y-4 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">National Provider Identifier (NPI)</label>
                  <input type="text" placeholder="10-digit number" className="wireframe-input bg-white" />
                </div>
                <div className="p-4 border border-black border-dashed text-center">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Upload Medical License (PDF/Image)</p>
                  <button className="text-[10px] font-bold underline uppercase">Browse Files</button>
                </div>
              </div>
            </div>
            <button 
              onClick={() => nextStep('PRACTICE_INVITE')}
              className="wireframe-button w-full bg-black text-white py-3 uppercase text-sm flex items-center justify-center gap-2"
            >
              Verify & Next <ChevronRight size={16} />
            </button>
          </div>
        );

      case 'PRACTICE_INVITE':
        return (
          <div className="space-y-8 w-full max-w-lg">
            <div className="flex items-center gap-4">
              <button onClick={() => nextStep('PRACTICE_VERIFY')} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tighter">Invite Your Team</h1>
                <p className="text-[10px] text-muted-foreground uppercase">Step 3 of 3</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Add clinical staff or administrators</p>
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-2">
                  <input type="email" placeholder="colleague@practice.com" className="wireframe-input flex-1" />
                  <select className="wireframe-input w-32 appearance-none bg-transparent text-[10px] font-bold uppercase">
                    <option>Medical</option>
                    <option>Admin</option>
                  </select>
                </div>
              ))}
              <button className="text-[10px] font-bold underline uppercase">+ Add Another</button>
              
              <div className="pt-8 space-y-4">
                <button 
                  onClick={() => nextStep('SUCCESS')}
                  className="wireframe-button w-full bg-black text-white py-3 uppercase text-sm"
                >
                  Complete Setup
                </button>
                <button 
                  onClick={() => nextStep('SUCCESS')}
                  className="w-full text-[10px] font-bold uppercase text-muted-foreground hover:text-black"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        );

      case 'SUCCESS':
        return (
          <div className="space-y-8 w-full max-w-sm text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-black flex items-center justify-center">
                <CheckCircle2 size={48} />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold uppercase tracking-tighter">Success!</h1>
              <p className="text-xs text-muted-foreground uppercase leading-relaxed">
                Your practice is set up.<br />You can now start sending referrals.
              </p>
            </div>
            <button 
              onClick={() => router.push('/')}
              className="wireframe-button w-full bg-black text-white py-3 uppercase text-sm"
            >
              Go to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      {renderStep()}
      
      {/* Progress Footer for setup steps */}
      {['PRACTICE_DETAILS', 'PRACTICE_VERIFY', 'PRACTICE_INVITE'].includes(step) && (
        <div className="fixed bottom-12 flex gap-2">
          {['PRACTICE_DETAILS', 'PRACTICE_VERIFY', 'PRACTICE_INVITE'].map((s, i) => (
            <div 
              key={s} 
              className={`h-1 w-12 transition-all ${
                ['PRACTICE_DETAILS', 'PRACTICE_VERIFY', 'PRACTICE_INVITE'].indexOf(step) >= i 
                  ? 'bg-black' 
                  : 'bg-gray-200'
              }`} 
            />
          ))}
        </div>
      )}
    </main>
  );
}
