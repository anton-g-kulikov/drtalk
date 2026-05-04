"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface VerificationContextType {
  isVerified: boolean;
  verify: () => void;
  reset: () => void;
  showVerification: boolean;
  setShowVerification: (show: boolean) => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export function VerificationProvider({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  // Initialize from localStorage if possible
  useEffect(() => {
    const stored = localStorage.getItem('drtalk_owner_verified');
    if (stored === 'true') setIsVerified(true);
  }, []);

  const verify = () => {
    setIsVerified(true);
    setShowVerification(false);
    localStorage.setItem('drtalk_owner_verified', 'true');
  };

  const reset = () => {
    setIsVerified(false);
    setShowVerification(false);
    localStorage.removeItem('drtalk_owner_verified');
  };

  return (
    <VerificationContext.Provider value={{ isVerified, verify, reset, showVerification, setShowVerification }}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}
