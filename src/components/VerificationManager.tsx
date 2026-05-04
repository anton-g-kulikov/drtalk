"use client";

import React from 'react';
import { useVerification } from './VerificationContext';
import { VerificationFlow } from './VerificationFlow';

export function VerificationManager() {
  const { showVerification, setShowVerification, verify, reset, isVerified } = useVerification();

  return (
    <>
      {showVerification && (
        <VerificationFlow 
          onComplete={verify} 
          onCancel={() => setShowVerification(false)} 
        />
      )}
      
      {/* Prototype Reset Trigger - Fixed to bottom right */}
      <div className="fixed bottom-4 right-4 z-[200]">
        <button 
          onClick={reset}
          className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-20 hover:opacity-100 transition-opacity bg-white px-2 py-1 border border-black"
        >
          {isVerified ? "Debug: Reset Verification" : "Unverified State"}
        </button>
      </div>
    </>
  );
}
