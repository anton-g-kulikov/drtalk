"use client";

import React, { useState, useEffect, Suspense } from 'react';
import {
  ChevronRight, ArrowLeft, CheckCircle2,
  Upload, FileText, X, Shield, Lock, Download, Search
} from 'lucide-react';
import { CommentMarker } from '@/components/Comments/CommentMarker';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useVerification } from '@/components/VerificationContext';
import { useSubscription } from '@/components/SubscriptionContext';

type ReferralStep = 'IDENTIFY' | 'LOGIN' | 'PATIENT' | 'CASE' | 'DOCS' | 'SUCCESS';

const mockPracticesByState: Record<string, { name: string; specialty: string; location: string }[]> = {
  "AZ": [
    { name: "Valley Endodontics", specialty: "Endodontics", location: "Phoenix, AZ" },
    { name: "Sunshine Dental", specialty: "General Dentistry", location: "Phoenix, AZ" },
    { name: "Downtown Oral Surgery", specialty: "Oral Surgery", location: "Phoenix, AZ" },
    { name: "Arizona Periodontics", specialty: "Periodontics", location: "Scottsdale, AZ" }
  ],
  "CA": [
    { name: "Westside Family Dentistry", specialty: "General Dentistry", location: "Los Angeles, CA" },
    { name: "Golden Gate Dental", specialty: "General Dentistry", location: "San Francisco, CA" },
    { name: "Pacific Oral Surgery", specialty: "Oral Surgery", location: "San Diego, CA" }
  ],
  "TX": [
    { name: "Lone Star Endodontics", specialty: "Endodontics", location: "Austin, TX" },
    { name: "Houston Dental Implants", specialty: "Implantology", location: "Houston, TX" }
  ],
  "NY": [
    { name: "Manhattan Orthodontics", specialty: "Orthodontics", location: "New York, NY" },
    { name: "Brooklyn Pediatric Dentistry", specialty: "Pediatric Dentistry", location: "Brooklyn, NY" }
  ]
};

const statesList = [
  { code: 'AZ', name: 'Arizona' },
  { code: 'CA', name: 'California' },
  { code: 'TX', name: 'Texas' },
  { code: 'NY', name: 'New York' },
];

const allMockPractices = Object.values(mockPracticesByState).flat();

function ReferralFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Determine if public or internal form
  const typeParam = searchParams.get('type');
  const isInternal = typeParam === 'internal' || (pathname ? pathname.startsWith('/dentist') : false);

  const practiceParam = searchParams.get('practice');

  const [step, setStep] = useState<ReferralStep>('IDENTIFY');
  const [email, setEmail] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [practiceName, setPracticeName] = useState('');
  const [receivingDoctor, setReceivingDoctor] = useState('');
  const [sendCopyToPatient, setSendCopyToPatient] = useState(false);
  const [patientCell, setPatientCell] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const { verify } = useVerification();
  const { isTrialEnded, setShowPaywall } = useSubscription();

  // Practice selection states
  const [selectedState, setSelectedState] = useState('');
  const [practiceSearch, setPracticeSearch] = useState('');
  const [targetPractice, setTargetPractice] = useState(practiceParam || '');
  const [showDropdown, setShowDropdown] = useState(false);

  // Load remembered state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('drtalk_selected_state');
      if (savedState) {
        setSelectedState(savedState);
      }

      if (isInternal) {
        const stored = localStorage.getItem('drtalk_profile_dentist');
        if (stored) {
          try {
            const profile = JSON.parse(stored);
            const name = profile.displayName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
            if (name) {
              setDoctorName(name);
            } else {
              setDoctorName("Dr. Taylor Reed, DDS");
            }
          } catch (e) {
            setDoctorName("Dr. Taylor Reed, DDS");
          }
        } else {
          setDoctorName("Dr. Taylor Reed, DDS");
        }
      }
    }
  }, [isInternal]);

  // Synchronize target practice if query param changes
  useEffect(() => {
    if (practiceParam) {
      setTargetPractice(practiceParam);
    }
  }, [practiceParam]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    if (typeof window !== 'undefined') {
      localStorage.setItem('drtalk_selected_state', state);
    }
    setPracticeSearch('');
    setTargetPractice('');
  };

  const nextStep = (next: ReferralStep) => setStep(next);

  // Filter practices based on selected state and search text
  const filteredPractices = selectedState 
    ? (mockPracticesByState[selectedState] || []).filter(p => 
        p.name.toLowerCase().includes(practiceSearch.toLowerCase()) ||
        p.specialty.toLowerCase().includes(practiceSearch.toLowerCase())
      )
    : [];

  const handleSelectPractice = (name: string) => {
    setTargetPractice(name);
    setPracticeSearch(name);
    setShowDropdown(false);
  };

  const renderStep = () => {
    switch (step) {
      case 'IDENTIFY':
        return (
          <div className="space-y-8 w-full max-w-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold uppercase tracking-tighter">Refer to</h1>
                <CommentMarker
                  id="referral-target-practice"
                  title="Target Practice"
                  description="Choose the practice you are referring your patient to."
                />
              </div>
              
              {/* Display preselected practice statically if provided, otherwise show selector */}
              {practiceParam ? (
                <div className="p-3 border-2 border-black bg-gray-50 flex items-center justify-between">
                  <p className="text-xl font-black uppercase italic tracking-tighter">{targetPractice}</p>
                </div>
              ) : (
                // State selector + practice search box for both public and internal forms
                <div className="space-y-4 border-2 border-black p-4 bg-gray-50/50">
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Select receiving practice</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1 space-y-1">
                      <label className="text-[8px] font-black uppercase">State</label>
                      <select
                        value={selectedState}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="wireframe-input bg-white text-[10px] h-9"
                      >
                        <option value="">State...</option>
                        {statesList.map(s => (
                          <option key={s.code} value={s.code}>{s.code}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 space-y-1 relative">
                      <label className="text-[8px] font-black uppercase">Search Practice Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={selectedState ? "Type practice name..." : "Choose state first"}
                          disabled={!selectedState}
                          value={practiceSearch}
                          onChange={(e) => {
                            setPracticeSearch(e.target.value);
                            setTargetPractice('');
                            setShowDropdown(true);
                          }}
                          onFocus={() => setShowDropdown(true)}
                          className="wireframe-input bg-white text-[10px] h-9 pl-7 pr-3"
                        />
                        <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>

                      {showDropdown && selectedState && filteredPractices.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-50 bg-white border-2 border-black mt-1 max-h-40 overflow-y-auto divide-y divide-black/10">
                          {filteredPractices.map((p) => (
                            <button
                              key={p.name}
                              type="button"
                              onClick={() => handleSelectPractice(p.name)}
                              className="w-full text-left p-2 hover:bg-gray-100 text-[10px] font-bold uppercase transition-colors"
                            >
                              <p className="font-black text-black">{p.name}</p>
                              <p className="text-[8px] text-muted-foreground">{p.specialty} • {p.location}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {targetPractice && (
                    <div className="p-2 bg-black text-white text-[10px] font-black uppercase tracking-tight flex justify-between items-center">
                      <span>Selected: {targetPractice}</span>
                      <button 
                        onClick={() => {
                          setTargetPractice('');
                          setPracticeSearch('');
                        }} 
                        className="text-white hover:text-red-400 font-bold"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                {!isInternal && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase">Enter your email</label>
                      <input
                        key="referral-identify-email"
                        type="email"
                        placeholder="dr.smith@example.com"
                        className="wireframe-input"
                        value={email || ''}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase">Your practice name</label>
                      <input
                        key="referral-identify-practice"
                        type="text"
                        placeholder="Smith Dental Care"
                        className="wireframe-input"
                        value={practiceName || ''}
                        onChange={(e) => setPracticeName(e.target.value)}
                      />
                    </div>
                  </>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">Referring Doctor Name</label>
                  <input
                    key="referral-identify-doctor"
                    type="text"
                    placeholder="Dr. Smith"
                    className="wireframe-input"
                    value={doctorName || ''}
                    onChange={(e) => setDoctorName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">Select Specialist or Receiving doctor</label>
                  <select 
                    value={receivingDoctor}
                    onChange={(e) => setReceivingDoctor(e.target.value)}
                    disabled={!targetPractice}
                    className="wireframe-input bg-white appearance-none cursor-pointer disabled:opacity-40"
                  >
                    <option value="">Select a doctor</option>
                    <option value="1">Dr. John Taylor</option>
                    <option value="2">Dr. Sarah Reed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => nextStep('PATIENT')}
                  disabled={!targetPractice || !receivingDoctor}
                  className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm font-black tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue to Patient Details <ChevronRight size={16} />
                </button>

                {/* Hide Login option for Internal Form */}
                {!isInternal && (
                  <div className="text-center pt-4 border-t border-black border-dashed">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Already have an account?</p>
                    <button
                      onClick={() => nextStep('LOGIN')}
                      className="text-xs font-black uppercase underline hover:text-black transition-colors"
                    >
                      Log In
                    </button>
                  </div>
                )}
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
                  <input key="referral-login-email" type="email" placeholder="your@email.com" className="wireframe-input" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase">Password</label>
                  <input key="referral-login-password" type="password" placeholder="••••••••" className="wireframe-input" />
                </div>
              </div>
              <button
                onClick={() => {
                  verify('owner');
                  nextStep('PATIENT');
                }}
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
                  Step 2: Case Details for {targetPractice || 'Selected Practice'}
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
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <h3 className="text-xs font-bold uppercase">3. X-Rays & Records</h3>
              </div>
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

                {/* Send copy to patient option */}
                <div className="space-y-4 border-2 border-black p-4 bg-gray-50/50 mt-6">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={sendCopyToPatient}
                      onChange={(e) => setSendCopyToPatient(e.target.checked)}
                      className="w-4 h-4 border-2 border-black rounded-none appearance-none checked:bg-black cursor-pointer"
                    />
                    <span className="text-xs font-black uppercase tracking-tight">Would you like to send a copy of this referral to your patient?</span>
                  </label>
                  
                  {sendCopyToPatient && (
                    <div className="space-y-3 pt-2 border-t border-black border-dashed animate-in fade-in duration-200">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider">Patient's Cell Phone</label>
                        <input
                          type="tel"
                          placeholder="(555) 000-0000"
                          value={patientCell}
                          onChange={(e) => setPatientCell(e.target.value)}
                          className="wireframe-input bg-white text-xs py-2 px-3"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider">Patient's Email Address (Optional)</label>
                        <input
                          type="email"
                          placeholder="patient@example.com"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          className="wireframe-input bg-white text-xs py-2 px-3"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8 space-y-4 border-t-2 border-black">
                <button
                  onClick={() => nextStep('SUCCESS')}
                  disabled={sendCopyToPatient && !patientCell}
                  className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm font-black tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
                  Referral Successfully Sent to {targetPractice || 'Sunshine Dental'}
                </p>
              </div>
            </div>

            {isInternal ? (
              <div className="wireframe-card bg-gray-50 space-y-6 p-8">
                <button
                  onClick={() => router.push('/dentist/dashboard')}
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
                  onClick={() => router.push(`/onboarding?email=${encodeURIComponent(email)}&practice=${encodeURIComponent(practiceName)}`)}
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
            )}

            <div className="flex justify-center items-center gap-2 opacity-30">
              <Lock size={12} />
              <span className="text-[8px] font-bold uppercase">HIPAA Compliant & Encrypted</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {isInternal && step !== 'SUCCESS' && (
        <button
          onClick={() => router.push('/dentist/dashboard')}
          className="fixed top-8 right-8 z-50 p-2.5 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 text-[10px] font-black uppercase"
          title="Exit to Dashboard"
        >
          <X size={14} /> Exit
        </button>
      )}
      <div className="w-full flex justify-center">
        {renderStep()}
      </div>
    </div>
  );
}

export default function GuestReferralPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8 font-sans border-t-[12px] border-black">
      <Suspense fallback={<div className="text-[10px] font-black uppercase">Loading Referral Form...</div>}>
        <ReferralFormContent />
      </Suspense>
    </main>
  );
}
