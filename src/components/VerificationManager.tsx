"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useVerification } from './VerificationContext';
import { VerificationFlow } from './VerificationFlow';

export function VerificationManager() {
  const { showVerification, setShowVerification, verify } = useVerification();
  const pathname = usePathname();

  // Don't show the modal if we are on the dedicated verify page
  if (pathname === '/verify') return null;

  return (
    <>
      {showVerification && (
        <VerificationFlow 
          onComplete={verify} 
          onCancel={() => setShowVerification(false)} 
          isModal
        />
      )}
      
    </>
  );
}
