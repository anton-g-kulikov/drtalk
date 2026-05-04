"use client";

import React, { useState } from 'react';
import { 
  ChevronRight as ChevronRightIcon, 
  ArrowLeft as ArrowLeftIcon, 
  ShieldCheck as ShieldCheckIcon, 
  Search as SearchIcon,
  CheckCircle2 as CheckCircle2Icon,
  Fingerprint as FingerprintIcon,
  Lock as LockIcon
} from 'lucide-react';

type VerificationStep = 'INTRO' | 'NPI_LOOKUP' | 'PERSONA' | 'SUCCESS';

interface VerificationFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function VerificationFlow({ onComplete, onCancel }: VerificationFlowProps) {
  const [step, setStep] = useState<VerificationStep>('INTRO');
  const [npi, setNpi] = useState('');
  const [isNpiLoading, setIsNpiLoading] = useState(false);
  const [npiResult, setNpiResult] = useState<any>(null);

  const handleNpiSearch = () => {
    setIsNpiLoading(true);
    // Simulate API call
    setTimeout(() => {
      setNpiResult({
        name: "DR. ANTON KULIKOV",
        specialty: "ENDODONTICS",
        address: "123 DENTAL WAY, BEVERLY HILLS, CA",
        npi: npi || "1234567890"
      });
      setIsNpiLoading(false);
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 'INTRO':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 border-4 border-black rounded-full flex items-center justify-center mx-auto bg-gray-50">
                <LockIcon size={40} />
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Identity Verification</h1>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest max-w-sm mx-auto leading-relaxed">
                Practice owner verification is required to process referrals and access PHI.
              </p>
            </div>

            <div className="space-y-4">
              <div className="wireframe-card p-6 bg-gray-50 space-y-4">
                <div className="flex gap-4 items-start">
                  <ShieldCheckIcon size={24} className="shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-tight">HIPAA COMPLIANCE</p>
                    <p className="text-[10px] text-muted-foreground uppercase leading-relaxed font-bold">
                      This one-time verification ensures that sensitive patient data is only handled by authorized medical professionals.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[9px] uppercase font-bold text-muted-foreground leading-relaxed italic text-center px-4">
                  Once verified, all Clinical personnel in your practice will be granted PHI access. Granular user settings can be managed later in Practice Settings.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setStep('NPI_LOOKUP')}
                  className="wireframe-button bg-black text-white py-4 uppercase text-sm font-black tracking-widest flex items-center justify-center gap-2"
                >
                  Start Verification <ChevronRightIcon size={18} />
                </button>
                <button 
                  onClick={onCancel}
                  className="text-[10px] font-black uppercase underline py-2 text-muted-foreground hover:text-black"
                >
                  I'll do this later
                </button>
              </div>
            </div>
          </div>
        );

      case 'NPI_LOOKUP':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4">
              <button onClick={() => setStep('INTRO')} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                <ArrowLeftIcon size={16} />
              </button>
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tighter">NPI Validation</h1>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Step 1 of 2: Confirm Credentials</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest">NATIONAL PROVIDER IDENTIFIER</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="10-DIGIT NPI" 
                    className="wireframe-input flex-1 py-4 px-4 text-sm font-mono" 
                    value={npi}
                    onChange={(e) => setNpi(e.target.value)}
                  />
                  <button 
                    onClick={handleNpiSearch}
                    disabled={isNpiLoading}
                    className="wireframe-button px-6 bg-black text-white disabled:opacity-50"
                  >
                    {isNpiLoading ? '...' : <SearchIcon size={18} />}
                  </button>
                </div>
                <p className="text-[8px] text-muted-foreground uppercase font-bold italic mt-1">
                  Optional: Entering your NPI will help us pre-fill your professional details.
                </p>
              </div>

              {npiResult && (
                <div className="wireframe-card p-6 border-black bg-white space-y-4 animate-in zoom-in-95 duration-300">
                  <p className="text-[10px] font-black uppercase tracking-widest border-b border-black pb-2">Registry Match Found</p>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <p className="text-[8px] text-muted-foreground uppercase font-black">PROVIDER NAME</p>
                      <p className="text-sm font-black uppercase tracking-tight">{npiResult.name}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-muted-foreground uppercase font-black">SPECIALTY</p>
                      <p className="text-[10px] font-black uppercase tracking-tight">{npiResult.specialty}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-muted-foreground uppercase font-black">PRIMARY ADDRESS</p>
                      <p className="text-[10px] font-bold uppercase tracking-tight">{npiResult.address}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setStep('PERSONA')}
                  className="wireframe-button bg-black text-white py-4 uppercase text-sm font-black tracking-widest"
                >
                  {npiResult ? 'Confirm & Continue' : 'Skip to Identity Check'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'PERSONA':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4">
              <button onClick={() => setStep('NPI_LOOKUP')} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                <ArrowLeftIcon size={16} />
              </button>
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tighter">Identity Verification</h1>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Step 2 of 2: Secure Persona ID</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="wireframe-card p-10 border-dashed border-2 flex flex-col items-center justify-center text-center space-y-6 bg-gray-50">
                <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <FingerprintIcon size={32} />
                </div>
                <div className="space-y-2">
                  <p className="font-black uppercase tracking-tighter italic">Identity Verification Provider</p>
                  <p className="text-[10px] uppercase text-muted-foreground font-bold max-w-[200px] leading-relaxed">
                    Persona will verify your government ID and facial biometrics to secure your practice ownership.
                  </p>
                </div>
                <div className="w-full h-[2px] bg-black opacity-10"></div>
                <div className="flex items-center gap-2">
                  <LockIcon size={12} className="text-muted-foreground" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">SECURE ENCRYPTED CONNECTION</span>
                </div>
              </div>

              <button 
                onClick={() => setStep('SUCCESS')}
                className="wireframe-button bg-black text-white py-4 uppercase text-sm font-black tracking-widest w-full"
              >
                Launch Persona Verification
              </button>
            </div>
          </div>
        );

      case 'SUCCESS':
        return (
          <div className="space-y-10 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center mx-auto bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2Icon size={56} />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">VERIFIED</h1>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
                Your identity has been confirmed.<br />PHI access is now active for your practice.
              </p>
            </div>
            
            <div className="wireframe-card p-6 bg-gray-50 text-left space-y-4">
              <p className="text-[10px] font-black uppercase border-b border-black pb-2">Enabled Privileges</p>
              <ul className="space-y-2">
                {[
                  'Access to Patient Health Information (PHI)',
                  'Direct intake from external referral links',
                  'PHI delegation to clinical staff members',
                  'Secure patient messaging (SMS/Email)'
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 items-center text-[10px] font-bold uppercase">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={onComplete}
              className="wireframe-button bg-black text-white py-5 uppercase text-sm font-black tracking-[0.2em] w-full"
            >
              Continue to Practice
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white border-4 border-black p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        {/* Animated decorative lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-black opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black opacity-10"></div>
        
        {renderStep()}
      </div>
    </div>
  );
}
