"use client";

import React, { useState } from 'react';
import { 
  ChevronRight, ArrowLeft, CheckCircle2, 
  Upload, FileText, X, Shield, Lock 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type ReferralStep = 'IDENTIFY' | 'LOGIN' | 'PATIENT' | 'CASE' | 'DOCS' | 'SUCCESS';

export default function GuestReferralPage() {
  const [step, setStep] = useState<ReferralStep>('IDENTIFY');
  const router = useRouter();

  const nextStep = (next: ReferralStep) => setStep(next);

  const renderStep = () => {
    switch (step) {
      case 'IDENTIFY':
        return (
          <div className="space-y-8 w-full max-w-lg">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold uppercase tracking-tighter">Refer to</h1>
              <p className="text-xl font-black uppercase italic tracking-tighter">Sunshine Dental</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">Enter email</label>
                  <input type="email" placeholder="dr.smith@example.com" className="wireframe-input" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">Your practice name</label>
                  <input type="text" placeholder="Smith Dental Care" className="wireframe-input" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">Select Doctor</label>
                  <select className="wireframe-input bg-white appearance-none cursor-pointer">
                    <option value="">Select a doctor</option>
                    <option value="1">Dr. John Taylor</option>
                    <option value="2">Dr. Sarah Reed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => nextStep('PATIENT')}
                  className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm font-black tracking-widest flex items-center justify-center gap-2"
                >
                  Continue to Patient Details <ChevronRight size={16} />
                </button>
                
                <div className="text-center pt-4 border-t border-black border-dashed">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Already have an account?</p>
                  <button 
                    onClick={() => nextStep('LOGIN')}
                    className="text-xs font-black uppercase underline hover:text-black transition-colors"
                  >
                    Log In
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'LOGIN':
        return (
          <div className="space-y-8 w-full max-w-lg">
            <div className="flex items-center gap-4">
              <button onClick={() => nextStep('IDENTIFY')} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                <ArrowLeft size={16} />
              </button>
              <h1 className="text-2xl font-bold uppercase tracking-tighter">Log In</h1>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">Email</label>
                  <input type="email" placeholder="your@email.com" className="wireframe-input" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">Password</label>
                  <input type="password" placeholder="••••••••" className="wireframe-input" />
                </div>
              </div>
              <button 
                onClick={() => nextStep('PATIENT')}
                className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm font-black tracking-widest flex items-center justify-center gap-2"
              >
                Log In & Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );

      case 'PATIENT':
        return (
          <div className="space-y-8 w-full max-w-lg">
            <div className="flex items-center gap-4">
              <button onClick={() => nextStep('IDENTIFY')} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                <ArrowLeft size={16} />
              </button>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold uppercase tracking-tighter">Patient Info</h1>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  Step 2: Case Details for Sunshine Dental
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase border-b-2 border-black pb-2">1. Patient Information</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">Patient Full Name</label>
                  <input type="text" placeholder="John Doe" className="wireframe-input" />
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
                onClick={() => nextStep('CASE')}
                className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm mt-4 flex items-center justify-center gap-2"
              >
                Continue to Case Details <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );

      case 'CASE':
        return (
          <div className="space-y-8 w-full max-w-lg">
            <div className="flex items-center gap-4">
              <button onClick={() => nextStep('PATIENT')} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                <ArrowLeft size={16} />
              </button>
              <h1 className="text-2xl font-bold uppercase tracking-tighter">Case Details</h1>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase border-b-2 border-black pb-2">2. Clinical Information</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">Reason for Referral</label>
                  <textarea 
                    placeholder="Describe the clinical needs, specific teeth, or symptoms..." 
                    className="wireframe-input h-32 py-3 resize-none" 
                  />
                </div>
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
                onClick={() => nextStep('DOCS')}
                className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm mt-4 flex items-center justify-center gap-2"
              >
                Next: Upload Documents <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );

      case 'DOCS':
        return (
          <div className="space-y-8 w-full max-w-lg">
            <div className="flex items-center gap-4">
              <button onClick={() => nextStep('CASE')} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                <ArrowLeft size={16} />
              </button>
              <h1 className="text-2xl font-bold uppercase tracking-tighter">Attachments</h1>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase border-b-2 border-black pb-2">3. X-Rays & Records</h3>
              <div className="space-y-6">
                <div className="border-4 border-black border-dashed p-12 text-center space-y-4 hover:bg-gray-50 transition-all cursor-pointer">
                  <div className="flex justify-center">
                    <Upload size={40} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-tighter">Drag & Drop Files Here</p>
                    <p className="text-[8px] text-muted-foreground uppercase font-black">Supported: JPG, PNG, PDF, DICOM</p>
                  </div>
                  <button className="wireframe-button text-[10px] uppercase px-4 py-2">
                    Browse Files
                  </button>
                </div>

                {/* Mock Upload List */}
                <div className="space-y-2">
                  <div className="wireframe-card p-3 border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">X-Ray_Upper_Left.jpg</span>
                    </div>
                    <X size={14} className="cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="pt-8 space-y-4 border-t-2 border-black">
                <div className="flex items-start gap-3">
                  <Shield size={18} className="shrink-0" />
                  <p className="text-[8px] font-bold uppercase leading-relaxed text-muted-foreground">
                    By submitting, you agree that this data will be stored securely and processed in accordance with HIPAA regulations.
                  </p>
                </div>
                <button 
                  onClick={() => nextStep('SUCCESS')}
                  className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm font-black tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all"
                >
                  SUBMIT SECURE REFERRAL
                </button>
              </div>
            </div>
          </div>
        );

      case 'SUCCESS':
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
                  Referral Successfully Sent to Sunshine Dental
                </p>
              </div>
            </div>

            <div className="wireframe-card bg-gray-50 space-y-6 p-8">
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-tighter">Join the drTalk Network</h3>
                <p className="text-[10px] uppercase leading-relaxed text-muted-foreground">
                  Log in or create a dentist account to track status updates and communicate with the specialist team.
                </p>
              </div>
              <button 
                onClick={() => router.push('/dentist/dashboard')}
                className="wireframe-button w-full bg-black text-white py-3 uppercase text-xs font-black"
              >
                Track This Referral
              </button>
              <button 
                onClick={() => router.push('/')}
                className="text-[10px] font-bold uppercase underline text-muted-foreground hover:text-black"
              >
                Back to Home
              </button>
            </div>

            <div className="flex justify-center items-center gap-2 opacity-30">
              <Lock size={12} />
              <span className="text-[8px] font-bold uppercase">HIPAA Compliant & Encrypted</span>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8 font-sans border-t-[12px] border-black">
      {renderStep()}
      
      {/* Step Indicator */}
      {step !== 'SUCCESS' && (
        <div className="fixed bottom-12 flex gap-4 items-center">
          {['IDENTIFY', 'PATIENT', 'CASE', 'DOCS'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div 
                className={`w-3 h-3 border-2 border-black transition-all ${
                  (['IDENTIFY', 'PATIENT', 'CASE', 'DOCS'].indexOf(step) >= i) || (step === 'LOGIN' && i === 0) ? 'bg-black' : 'bg-transparent'
                }`}
              />
              {i < 3 && <div className="w-8 h-0.5 bg-black/20" />}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
