"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

type GuestReferralLoginStepProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function GuestReferralLoginStep({ onBack, onContinue }: GuestReferralLoginStepProps) {
  return (
    <div className="space-y-8 w-full max-w-lg">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-2xl font-bold uppercase tracking-tighter">Log In</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase">Email</label>
            <input key="referral-login-email" type="email" placeholder="your@email.com" className="wireframe-input" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase">Password</label>
            <input key="referral-login-password" type="password" placeholder="••••••••" className="wireframe-input" />
          </div>
        </div>
        <button
          onClick={onContinue}
          className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm font-black tracking-widest flex items-center justify-center gap-2"
        >
          Log In & Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

type GuestReferralPatientStepProps = {
  targetPractice: string;
  onBack: () => void;
  onContinue: () => void;
};

export function GuestReferralPatientStep({ targetPractice, onBack, onContinue }: GuestReferralPatientStepProps) {
  return (
    <div className="space-y-8 w-full max-w-lg">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
          <ArrowLeft size={16} />
        </button>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold uppercase tracking-tighter">Patient Info</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            Step 2: Case Details for {targetPractice || 'Selected Practice'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-bold uppercase border-b-2 border-black pb-2">1. Patient Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase">Patient First Name</label>
              <input type="text" placeholder="Enter patient first name" className="wireframe-input" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase">Patient Last Name</label>
              <input type="text" placeholder="Enter patient last name" className="wireframe-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase">Date of Birth</label>
              <input type="text" placeholder="MM/DD/YYYY" className="wireframe-input" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase">Phone Number</label>
              <input type="text" placeholder="(555) 000-0000" className="wireframe-input" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase">Insurance Provider (Optional)</label>
            <input type="text" placeholder="Delta Dental" className="wireframe-input" />
          </div>
        </div>
        <button
          onClick={onContinue}
          className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm mt-4 flex items-center justify-center gap-2"
        >
          Continue to Case Details <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

type GuestReferralCaseStepProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function GuestReferralCaseStep({ onBack, onContinue }: GuestReferralCaseStepProps) {
  const [hasReferralPad, setHasReferralPad] = useState(true);

  useEffect(() => {
    const updatePadState = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('drtalk_debug_has_referral_pad');
        setHasReferralPad(saved !== 'false');
      }
    };

    updatePadState();
    window.addEventListener('drtalk-debug-referral-pad-changed', updatePadState);
    return () => {
      window.removeEventListener('drtalk-debug-referral-pad-changed', updatePadState);
    };
  }, []);

  return (
    <div className="space-y-8 w-full max-w-lg">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-2xl font-bold uppercase tracking-tighter">Case Details</h1>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-bold uppercase border-b-2 border-black pb-2">2. Clinical Information</h3>
        <div className="space-y-4">
          {hasReferralPad ? (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase">Referral Pad / Clinical Notes</label>
              <div className="border-2 border-black p-1 bg-white">
                <img
                  src="/referral-pad.png"
                  alt="Referral Pad"
                  className="w-full object-contain filter grayscale"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase">Procedure / Reason for Referral</label>
                <select className="wireframe-input bg-white appearance-none cursor-pointer">
                  <option value="Consultation">General Consultation</option>
                  <option value="Root Canal">Root Canal Treatment</option>
                  <option value="Extraction">Extraction / Oral Surgery</option>
                  <option value="Implant">Dental Implant</option>
                  <option value="Other">Other (See Notes Below)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase">Tooth Number(s)</label>
                <input type="text" placeholder="e.g. #3, #18 (or All)" className="wireframe-input" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase">Clinical Notes / Comments</label>
                <textarea 
                  rows={4} 
                  placeholder="Provide additional clinical notes, patient symptoms, or history..." 
                  className="wireframe-input resize-none py-2"
                />
              </div>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase">Urgency</label>
            <div className="flex gap-4">
              {['Routine', 'Urgent', 'Emergency'].map((level) => (
                <label key={level} className="flex-1 border-2 border-black p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 has-[:checked]:bg-black has-[:checked]:text-white transition-all">
                  <input type="radio" name="urgency" className="hidden" defaultChecked={level === 'Routine'} />
                  <span className="text-[10px] font-bold uppercase">{level}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={onContinue}
          className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm mt-4 flex items-center justify-center gap-2"
        >
          Next: Upload Documents <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

type GuestReferralSuccessStepProps = {
  isInternal: boolean;
  targetPractice: string;
  targetPractices: string[];
  onBackToDashboard: () => void;
  onTrackReferral: () => void;
  onBackHome: () => void;
};

export function GuestReferralSuccessStep({
  isInternal,
  targetPractice,
  targetPractices,
  onBackToDashboard,
  onTrackReferral,
  onBackHome,
}: GuestReferralSuccessStepProps) {
  return (
    <div className="space-y-12 w-full max-w-lg text-center py-12">
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-black flex items-center justify-center bg-black text-white">
            <CheckCircle2 size={56} />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold uppercase tracking-tighter italic">Thank You!</h1>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
            Referral Successfully Sent to {isInternal ? (targetPractices.join(', ') || 'selected practices') : (targetPractice || 'Sunshine Dental')}
          </p>
        </div>
      </div>

      {isInternal ? (
        <div className="wireframe-card bg-gray-50 space-y-6 p-8">
          <button
            onClick={onBackToDashboard}
            className="wireframe-button w-full bg-black text-white py-3 uppercase text-xs font-black"
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <div className="wireframe-card bg-gray-50 space-y-6 p-8">
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-tighter">Join the drTalk Network</h3>
            <p className="text-[10px] leading-relaxed text-red-600">
              <span className="font-bold underline decoration-red-600">Are you still using email, fax and voice mail?</span> Your patients deserve better! Eliminate operational friction, increase patient case acceptance and track your patients through specialty care with drtalk. Set up your team today with 3 easy steps...
            </p>
          </div>
          <button
            onClick={onTrackReferral}
            className="wireframe-button w-full bg-black text-white py-3 uppercase text-xs font-black"
          >
            Track This Referral
          </button>
          <button
            onClick={onBackHome}
            className="text-[10px] font-bold uppercase underline text-muted-foreground hover:text-black"
          >
            Back to Home
          </button>
        </div>
      )}

      <div className="flex justify-center items-center gap-2 opacity-30">
        <Lock size={12} />
        <span className="text-[8px] font-bold uppercase">HIPAA Compliant & Encrypted</span>
      </div>
    </div>
  );
}
