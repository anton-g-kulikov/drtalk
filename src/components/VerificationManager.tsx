"use client";

import React from 'react';
import { useVerification } from './VerificationContext';
import { VerificationFlow } from './VerificationFlow';

export function VerificationManager() {
  const { showVerification, setShowVerification, verify } = useVerification();

  if (!showVerification) return null;

  return (
    <VerificationFlow 
      onComplete={verify} 
      onCancel={() => setShowVerification(false)} 
    />
  );
}
