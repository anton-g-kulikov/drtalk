"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useVerification, UserRole } from '@/components/VerificationContext';
import { OnboardingStepView, type OnboardingStep } from '@/components/prototype/OnboardingStepView';

function OnboardingContent() {
  const searchParams = useSearchParams();
  const isIndividualFlow = searchParams.get('type') === 'individual';
  const [step, setStep] = useState<OnboardingStep>('AUTH');
  const [isLogin, setIsLogin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(isIndividualFlow ? 'individual' : 'owner');
  const [practiceType, setPracticeType] = useState('Dentist');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [practiceName, setPracticeName] = useState(searchParams.get('practice') || '');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [selectedState, setSelectedState] = useState('CA');
  const [wantsFax, setWantsFax] = useState(false);
  const [faxNumber, setFaxNumber] = useState('');
  const [isPracticeDetailsLoading, setIsPracticeDetailsLoading] = useState(false);
  const [showNpiTooltip, setShowNpiTooltip] = useState(false);

  const handlePracticeNameClick = () => {
    if (isPracticeDetailsLoading || city) return;
    setIsPracticeDetailsLoading(true);
    setPracticeName("Valley Endodontics");
    setTimeout(() => {
      setCity("Beverly Hills");
      setSelectedState("CA");
      setZipCode("90210");
      setFullAddress("123 Dental Way, Ste 100");
      setPhone("(310) 555-0199");
      setFaxNumber("(310) 555-0198");
      setWantsFax(true);
      setPracticeType("Endodontist");
      setIsPracticeDetailsLoading(false);
      setShowNpiTooltip(true);
      setTimeout(() => setShowNpiTooltip(false), 4000);
    }, 1200);
  };




  const [invites, setInvites] = useState<{email: string, role: string}[]>([
    { email: '', role: 'admin' },
    { email: '', role: 'team' }
  ]);

  
  const addInvite = () => {
    if (invites.length < 10) {
      setInvites([...invites, { email: '', role: 'team' }]);
    }
  };

  const updateInvite = (index: number, field: 'email' | 'role', value: string) => {
    const newInvites = [...invites];
    newInvites[index][field] = value;
    setInvites(newInvites);
  };
  const router = useRouter();
  const { verify } = useVerification();

  const practiceTypes = [
    'Dentist',
    'Pediatric Dentist',
    'Orthodontist',
    'Endodontist',
    'Oral & Maxillofacial Surgeon',
    'Periodontist',
    'Prosthodontist',
    'Dental Anesthesiologist',
    'Oral Pathologist',
    'Dental Partner',
    'Dental Laboratory'
  ];

  const dentistTypes = ['Dentist', 'Pediatric Dentist', 'Orthodontist'];

  const nextStep = (next: OnboardingStep) => setStep(next);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <OnboardingStepView
        step={step}
        isIndividualFlow={isIndividualFlow}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        userRole={userRole}
        setUserRole={setUserRole}
        practiceType={practiceType}
        setPracticeType={setPracticeType}
        email={email}
        setEmail={setEmail}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        practiceName={practiceName}
        setPracticeName={setPracticeName}
        phone={phone}
        setPhone={setPhone}
        city={city}
        setCity={setCity}
        zipCode={zipCode}
        setZipCode={setZipCode}
        fullAddress={fullAddress}
        setFullAddress={setFullAddress}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        wantsFax={wantsFax}
        setWantsFax={setWantsFax}
        faxNumber={faxNumber}
        setFaxNumber={setFaxNumber}
        isPracticeDetailsLoading={isPracticeDetailsLoading}
        showNpiTooltip={showNpiTooltip}
        handlePracticeNameClick={handlePracticeNameClick}
        invites={invites}
        setInvites={setInvites}
        addInvite={addInvite}
        updateInvite={updateInvite}
        practiceTypes={practiceTypes}
        dentistTypes={dentistTypes}
        nextStep={nextStep}
        verify={verify}
        router={router}
      />
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
