"use client";

import React, { useState, useEffect, Suspense } from 'react';
import {
  ChevronRight, ArrowLeft
} from 'lucide-react';
import { CommentMarker } from '@/components/Comments/CommentMarker';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useVerification } from '@/components/VerificationContext';
import { MainLayout } from '@/components/MainLayout';
import { GuestReferralAttachmentsStep } from '@/components/prototype/GuestReferralAttachmentsStep';
import { GuestReferralPracticeSelector } from '@/components/prototype/GuestReferralPracticeSelector';
import {
  GuestReferralCaseStep,
  GuestReferralLoginStep,
  GuestReferralPatientStep,
  GuestReferralSuccessStep,
} from '@/components/prototype/guest-referral/GuestReferralStepViews';

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

  // Practice selection states
  const [selectedState, setSelectedState] = useState('');
  const [practiceSearch, setPracticeSearch] = useState('');
  const [targetPractice, setTargetPractice] = useState(practiceParam || '');
  const [targetPractices, setTargetPractices] = useState<string[]>(practiceParam ? [practiceParam] : []);
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
              
              <GuestReferralPracticeSelector
                isInternal={isInternal}
                practiceParam={practiceParam}
                selectedState={selectedState}
                practiceSearch={practiceSearch}
                targetPractice={targetPractice}
                targetPractices={targetPractices}
                showDropdown={showDropdown}
                states={statesList}
                filteredPractices={filteredPractices}
                allPractices={allMockPractices}
                onStateChange={handleStateChange}
                onPracticeSearchChange={setPracticeSearch}
                onTargetPracticeChange={setTargetPractice}
                onTargetPracticesChange={setTargetPractices}
                onShowDropdownChange={setShowDropdown}
              />
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
                  <label className="text-[10px] font-bold uppercase">Select Receiving doctor</label>
                  <select 
                    value={receivingDoctor}
                    onChange={(e) => setReceivingDoctor(e.target.value)}
                    disabled={isInternal ? targetPractices.length === 0 : !targetPractice}
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
                  disabled={isInternal ? (targetPractices.length === 0 || !receivingDoctor) : (!targetPractice || !receivingDoctor)}
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
          <GuestReferralLoginStep
            onBack={() => nextStep('IDENTIFY')}
            onContinue={() => {
              verify('owner');
              nextStep('PATIENT');
            }}
          />
        );

      case 'PATIENT':
        return (
          <GuestReferralPatientStep
            targetPractice={targetPractice}
            onBack={() => nextStep('IDENTIFY')}
            onContinue={() => nextStep('CASE')}
          />
        );

      case 'CASE':
        return (
          <GuestReferralCaseStep
            onBack={() => nextStep('PATIENT')}
            onContinue={() => nextStep('DOCS')}
          />
        );

      case 'DOCS':
        return (
          <GuestReferralAttachmentsStep
            sendCopyToPatient={sendCopyToPatient}
            patientCell={patientCell}
            patientEmail={patientEmail}
            onBack={() => nextStep('CASE')}
            onSubmit={() => nextStep('SUCCESS')}
            onSendCopyToPatientChange={setSendCopyToPatient}
            onPatientCellChange={setPatientCell}
            onPatientEmailChange={setPatientEmail}
          />
        );

      case 'SUCCESS':
        return (
          <GuestReferralSuccessStep
            isInternal={isInternal}
            targetPractice={targetPractice}
            targetPractices={targetPractices}
            onBackToDashboard={() => router.push('/dentist/dashboard')}
            onTrackReferral={() => router.push(`/onboarding?email=${encodeURIComponent(email)}&practice=${encodeURIComponent(practiceName)}`)}
            onBackHome={() => router.push('/')}
          />
        );
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {isInternal && step !== 'SUCCESS' && (
        <div className="w-full max-w-lg mb-4 flex justify-start">
          <button
            onClick={() => router.push('/dentist/dashboard')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-black hover:underline"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>
      )}
      <div className="w-full flex justify-center">
        {renderStep()}
      </div>
    </div>
  );
}

function GuestReferralPageContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const isInternal = typeParam === 'internal' || (pathname ? pathname.startsWith('/dentist') : false);

  if (isInternal) {
    return (
      <MainLayout title="New Referral">
        <div className="max-w-xl mx-auto py-8">
          <ReferralFormContent />
        </div>
      </MainLayout>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8 font-sans border-t-[12px] border-black">
      <ReferralFormContent />
    </main>
  );
}

export default function GuestReferralPage() {
  return (
    <Suspense fallback={<div className="text-[10px] font-black uppercase flex items-center justify-center min-h-screen">Loading Referral Form...</div>}>
      <GuestReferralPageContent />
    </Suspense>
  );
}
