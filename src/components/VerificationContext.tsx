"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'owner' | 'team' | 'admin' | 'individual';

interface VerificationContextType {
  isVerified: boolean;
  userRole: UserRole | null;
  hasPracticeOwner: boolean;
  verify: (role?: UserRole) => void;
  setNoOwnerYet: () => void;
  reset: () => void;
  showVerification: boolean;
  setShowVerification: (show: boolean) => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export function VerificationProvider({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [hasPracticeOwner, setHasPracticeOwner] = useState(true);
  const [showVerification, setShowVerification] = useState(false);

  // Initialize from localStorage if possible
  useEffect(() => {
    const stored = localStorage.getItem('drtalk_owner_verified');
    const storedRole = localStorage.getItem('drtalk_user_role') as UserRole | null;
    const storedHasOwner = localStorage.getItem('drtalk_has_practice_owner');

    setTimeout(() => {
      if (stored === 'true') {
        setIsVerified(true);
      }
      if (storedRole) {
        setUserRole(storedRole);
      }
      if (storedHasOwner === 'false') {
        setHasPracticeOwner(false);
      } else {
        setHasPracticeOwner(true);
      }
    }, 0);
  }, []);

  const verify = (role: UserRole = 'owner') => {
    setIsVerified(true);
    setUserRole(role);
    setShowVerification(false);
    
    // If the user chose owner, then practice has an owner
    if (role === 'owner') {
      setHasPracticeOwner(true);
      localStorage.setItem('drtalk_has_practice_owner', 'true');
    } else {
      setHasPracticeOwner(false);
      localStorage.setItem('drtalk_has_practice_owner', 'false');
    }

    localStorage.setItem('drtalk_owner_verified', 'true');
    localStorage.setItem('drtalk_user_role', role);
  };

  const setNoOwnerYet = () => {
    setIsVerified(true);
    setUserRole('admin');
    setHasPracticeOwner(false);
    localStorage.setItem('drtalk_owner_verified', 'true');
    localStorage.setItem('drtalk_user_role', 'admin');
    localStorage.setItem('drtalk_has_practice_owner', 'false');
  };

  const reset = () => {
    setIsVerified(false);
    setUserRole(null);
    setHasPracticeOwner(true);
    setShowVerification(false);
    localStorage.removeItem('drtalk_owner_verified');
    localStorage.removeItem('drtalk_user_role');
    localStorage.removeItem('drtalk_has_practice_owner');
  };

  return (
    <VerificationContext.Provider value={{ 
      isVerified, 
      userRole, 
      hasPracticeOwner, 
      verify, 
      setNoOwnerYet,
      reset, 
      showVerification, 
      setShowVerification 
    }}>
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
