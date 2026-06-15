"use client";

import React, { useState } from 'react';
import {
  VerificationIntroStep,
  VerificationManualDetailsStep,
  VerificationNpiStep,
  VerificationPersonaStep,
  VerificationRoleStep,
  VerificationSuccessStep,
  type VerificationNpiResult,
} from '@/components/prototype/verification/VerificationStepViews';
import { UserRole } from './VerificationContext';

type VerificationStep = 'INTRO' | 'CHOOSE_ROLE' | 'NPI_LOOKUP' | 'MANUAL_DETAILS' | 'PERSONA' | 'SUCCESS';

interface VerificationFlowProps {
  onComplete: (role: UserRole) => void;
  onCancel: () => void;
  isModal?: boolean;
}

export function VerificationFlow({ onComplete, onCancel, isModal = false }: VerificationFlowProps) {
  const [step, setStep] = useState<VerificationStep>('INTRO');
  const [npi, setNpi] = useState('');
  const [npiResult, setNpiResult] = useState<VerificationNpiResult | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');

  const handleNpiSearch = () => {
    setTimeout(() => {
      setNpiResult({
        name: 'DR. EMMA SMITH',
        specialty: 'ENDODONTICS',
        address: 'SUNSHINE DENTAL, 456 MEDICAL PLAZA, PHOENIX, AZ',
        npi: npi || '1234567890',
      });
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 'INTRO':
        return (
          <VerificationIntroStep
            onStart={() => setStep('PERSONA')}
            onCancel={onCancel}
          />
        );

      case 'CHOOSE_ROLE':
        return (
          <VerificationRoleStep
            selectedRole={selectedRole}
            onBack={() => setStep('INTRO')}
            onRoleChange={setSelectedRole}
            onContinue={() => setStep('NPI_LOOKUP')}
          />
        );

      case 'NPI_LOOKUP':
        return (
          <VerificationNpiStep
            npi={npi}
            npiResult={npiResult}
            onBack={() => setStep('INTRO')}
            onNpiChange={setNpi}
            onSearch={handleNpiSearch}
            onManualDetails={() => setStep('MANUAL_DETAILS')}
            onContinue={() => setStep('PERSONA')}
          />
        );

      case 'MANUAL_DETAILS':
        return (
          <VerificationManualDetailsStep
            onBack={() => setStep('NPI_LOOKUP')}
            onContinue={() => setStep('PERSONA')}
          />
        );

      case 'PERSONA':
        return (
          <VerificationPersonaStep
            onBack={() => setStep('INTRO')}
            onContinue={() => setStep('SUCCESS')}
          />
        );

      case 'SUCCESS':
        return (
          <VerificationSuccessStep
            selectedRole={selectedRole}
            onComplete={onComplete}
          />
        );
    }
  };

  const content = (
    <div className={`w-full max-w-lg bg-white border-4 border-black p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden ${!isModal ? 'mx-auto' : ''}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-black opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black opacity-10"></div>

      {renderStep()}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-sm p-4">
        {content}
      </div>
    );
  }

  return content;
}
