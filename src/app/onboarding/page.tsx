"use client";

import React, { useState } from 'react';
import { 
  ChevronRight as ChevronRightIcon, 
  ArrowLeft as ArrowLeftIcon, 
  CheckCircle2 as CheckCircle2Icon, 
  ShieldCheck as ShieldCheckIcon, 
  Users as UsersIcon, 
  Building2 as Building2Icon 
} from 'lucide-react';
import { CommentMarker } from '@/components/Comments/CommentMarker';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

type OnboardingStep = 
  | 'AUTH' 
  | 'VERIFY' 
  | 'ROLE_SELECTION' 
  | 'PRACTICE_DETAILS' 
  | 'PRACTICE_VERIFY' 
  | 'PRACTICE_INVITE' 
  | 'SUCCESS';

function OnboardingContent() {
  const [step, setStep] = useState<OnboardingStep>('AUTH');
  const [isLogin, setIsLogin] = useState(false);
  const [practiceCategory, setPracticeCategory] = useState<'Dental' | 'Medical'>('Dental');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [practiceName, setPracticeName] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const emailParam = searchParams.get('email');
    const practiceParam = searchParams.get('practice');
    if (emailParam) setEmail(emailParam);
    if (practiceParam) setPracticeName(practiceParam);
  }, [searchParams]);

  const dentalTypes = [
    'Dentist', 'Dental Laboratory', 'Dental Radiology', 'Endodontist', 
    'Oral & Maxillofacial Surgeon', 'Orthodontist', 'Pediatric Dentist', 
    'Periodontist', 'Prosthodontist', 'Oral Pathologist', 
    'Dental Anaesthesiology', 'Dental Implant Company'
  ];

  const medicalTypes = [
    'Anesthesiology', 'Cardiology', 'Colorectal Surgery', 'Dermatology',
    'Emergency Medicine', 'Endocrinology', 'Family medicine', 
    'Gastroenterology', 'Hematology-Oncology', 'Hospitalist', 
    'Internal medicine', 'Medical Genetics'
  ];

  const nextStep = (next: OnboardingStep) => setStep(next);

  const renderStep = () => {
    switch (step) {
      case 'AUTH':
        return (
          <div className="space-y-6 w-full max-w-sm">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none">drTalk Account</h1>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Create account to create or join a practice</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold uppercase">Email Address</label>
                  <CommentMarker 
                    id="onboarding-email-policy"
                    title="Corporate Email Policy"
                    description="Personal emails will be checked and discouraged. The system will ask users to register with a corporate email, but they would still be able to continue with a Gmail/personal account if a professional one is unavailable."
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="doctor@practice.com" 
                  className="wireframe-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase">Password</label>
                <input type="password" placeholder="••••••••" className="wireframe-input" />
              </div>
              {!isLogin && (
                <div className="flex gap-4">
                  <div className="space-y-1 flex-1">
                    <label className="text-[10px] font-bold uppercase">First Name</label>
                    <input 
                      type="text" 
                      className="wireframe-input" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <label className="text-[10px] font-bold uppercase">Last Name</label>
                    <input 
                      type="text" 
                      className="wireframe-input" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <button 
                onClick={() => nextStep('VERIFY')}
                className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm font-black tracking-widest"
              >
                {isLogin ? 'Login' : 'Create Account'}
              </button>
            </div>
            <p className="text-center text-[10px] uppercase font-black tracking-tighter">
              {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
              <span 
                className="text-black cursor-pointer underline ml-1" 
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
          <div className="space-y-12 w-full max-w-4xl px-4">
            <div className="text-center space-y-3">
              <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">WELCOME TO DRTALK</h1>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">CREATE A SPECIALIST PRACTICE OR JOIN YOUR EXISTING TEAM.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div 
                onClick={() => nextStep('PRACTICE_DETAILS')}
                className="wireframe-card hover:bg-black hover:text-white cursor-pointer transition-all group p-12 space-y-6 flex flex-col items-start min-h-[320px]"
              >
                <Building2Icon size={48} className="mb-2" />
                <div className="space-y-4">
                  <h3 className="font-black uppercase text-2xl leading-tight tracking-tighter">CREATE SPECIALIST PRACTICE</h3>
                  <p className="text-xs uppercase leading-relaxed font-bold opacity-70">
                    Set up a specialist profile to receive referrals and coordinate patient communication.
                  </p>
                </div>
              </div>
              <div
                onClick={() => nextStep('PRACTICE_INVITE')}
                className="wireframe-card border-dashed hover:bg-black hover:text-white cursor-pointer transition-all group p-12 space-y-6 flex flex-col items-start min-h-[320px]"
              >
                <UsersIcon size={48} className="mb-2" />
                <div className="space-y-4">
                  <h3 className="font-black uppercase text-2xl leading-tight tracking-tighter">JOIN EXISTING PRACTICE</h3>
                  <p className="text-xs uppercase leading-relaxed font-bold opacity-70">
                    Enter with an invite code or request access from a practice administrator.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'PRACTICE_DETAILS':
        return (
          <div className="space-y-10 w-full max-w-2xl px-4">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => nextStep('ROLE_SELECTION')} 
                className="w-12 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
              >
                <ArrowLeftIcon size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">SPECIALIST PRACTICE DETAILS</h1>
                <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">STEP 1 OF 3</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-[120px_1fr] gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest">STATE</label>
                  <select className="wireframe-input appearance-none bg-transparent py-4 px-4 text-sm">
                    <option>CA</option>
                    <option>NY</option>
                    <option>TX</option>
                    <option>FL</option>
                    <option>WA</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest">PRACTICE NAME</label>
                    <CommentMarker 
                      id="onboarding-practice-search"
                      title="Practice Search"
                      description="Practice name will work as search/filter after first 3 letters suggesting users to select a practice from drtalk db."
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Valley Endodontics" 
                    className="wireframe-input py-4 px-4 text-sm" 
                    value={practiceName}
                    onChange={(e) => setPracticeName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest">CITY</label>
                  <input type="text" placeholder="Beverly Hills" className="wireframe-input py-4 px-4 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest">FULL ADDRESS</label>
                  <input type="text" placeholder="123 Dental Way, Ste 100" className="wireframe-input py-4 px-4 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest">PRACTICE CATEGORY</label>
                  <select 
                    value={practiceCategory}
                    onChange={(e) => setPracticeCategory(e.target.value as any)}
                    className="wireframe-input appearance-none bg-transparent py-4 px-4 text-sm"
                  >
                    <option value="Dental">Dental</option>
                    <option value="Medical">Medical</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest">PRACTICE TYPE</label>
                  <select className="wireframe-input appearance-none bg-transparent py-4 px-4 text-sm">
                    {(practiceCategory === 'Dental' ? dentalTypes : medicalTypes).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                onClick={() => nextStep('PRACTICE_VERIFY')}
                className="wireframe-button w-full bg-black text-white py-5 uppercase text-sm font-black tracking-[0.2em] mt-4 flex items-center justify-center gap-2"
              >
                NEXT STEP <ChevronRightIcon size={18} />
              </button>
            </div>
          </div>
        );

      case 'PRACTICE_VERIFY':
        return (
          <div className="space-y-8 w-full max-w-lg">
            <div className="flex items-center gap-4">
              <button onClick={() => nextStep('PRACTICE_DETAILS')} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                <ArrowLeftIcon size={16} />
              </button>
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tighter">NPI Lookup</h1>
                <p className="text-[10px] text-muted-foreground uppercase">Step 2 of 3</p>
              </div>
            </div>
            <div className="wireframe-card bg-gray-50 space-y-4">
              <div className="flex gap-4 items-start">
                <ShieldCheckIcon className="text-black shrink-0" size={24} />
                <p className="text-[10px] uppercase font-bold leading-relaxed">
                  Add an NPI now to autofill practice information. Owner verification happens later when PHI/referral processing is triggered.
                </p>
              </div>
              <div className="space-y-4 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">National Provider Identifier (Optional)</label>
                  <input type="text" placeholder="10-digit number" className="wireframe-input bg-white" />
                </div>
                <div className="p-4 border border-black border-dashed text-center">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Registry match preview</p>
                  <button className="text-[10px] font-bold underline uppercase">Use Autofilled Practice Data</button>
                </div>
              </div>
            </div>
            <button 
              onClick={() => nextStep('PRACTICE_INVITE')}
              className="wireframe-button w-full bg-black text-white py-3 uppercase text-sm flex items-center justify-center gap-2"
            >
              Save & Continue <ChevronRightIcon size={16} />
            </button>
          </div>
        );

      case 'PRACTICE_INVITE':
        return (
          <div className="space-y-8 w-full max-w-lg">
            <div className="flex items-center gap-4">
              <button onClick={() => nextStep('PRACTICE_VERIFY')} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                <ArrowLeftIcon size={16} />
              </button>
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tighter">Invite Your Team</h1>
                <p className="text-[10px] text-muted-foreground uppercase">Step 3 of 3</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Invite clinical staff, administrators, or enter an invite code</p>
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-2">
                  <input type="email" placeholder="colleague@practice.com" className="wireframe-input flex-1" />
                  <select className="wireframe-input w-32 appearance-none bg-transparent text-[10px] font-bold uppercase">
                    <option>Clinical</option>
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
                <CheckCircle2Icon size={48} />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold uppercase tracking-tighter">Success!</h1>
              <p className="text-xs text-muted-foreground uppercase leading-relaxed">
                Your specialist practice is set up.<br />You can now receive and process referrals.
              </p>
            </div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="wireframe-button w-full bg-black text-white py-3 uppercase text-sm"
            >
              Go to Specialist Dashboard
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

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-bold uppercase tracking-widest">Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
