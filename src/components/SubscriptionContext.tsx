"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type SubscriptionPlan = 'Trial' | 'Starter' | 'Pro' | 'BusinessPlus';

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  isTrialEnded: boolean;
  daysRemaining: number;
  setPlan: (plan: SubscriptionPlan) => void;
  endTrial: () => void;
  resetSubscription: () => void;
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlanState] = useState<SubscriptionPlan>('Trial');
  const [isTrialEnded, setIsTrialEnded] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(14);
  const [showPaywall, setShowPaywall] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const storedPlan = localStorage.getItem('drtalk_subscription_plan') as SubscriptionPlan;
    const storedTrialEnded = localStorage.getItem('drtalk_trial_ended') === 'true';
    const storedDays = localStorage.getItem('drtalk_trial_days');

    // Use setTimeout to avoid synchronous setState in effect warning
    setTimeout(() => {
      if (storedPlan) setPlanState(storedPlan);
      if (storedTrialEnded) setIsTrialEnded(true);
      if (storedDays) setDaysRemaining(parseInt(storedDays));
    }, 0);
  }, []);

  const setPlan = (newPlan: SubscriptionPlan) => {
    setPlanState(newPlan);
    localStorage.setItem('drtalk_subscription_plan', newPlan);
    if (newPlan !== 'Trial') {
      setIsTrialEnded(false);
      localStorage.setItem('drtalk_trial_ended', 'false');
    }
  };

  const endTrial = () => {
    setIsTrialEnded(true);
    setDaysRemaining(0);
    localStorage.setItem('drtalk_trial_ended', 'true');
    localStorage.setItem('drtalk_trial_days', '0');
  };

  const resetSubscription = () => {
    setPlanState('Trial');
    setIsTrialEnded(false);
    setDaysRemaining(14);
    setShowPaywall(false);
    localStorage.setItem('drtalk_subscription_plan', 'Trial');
    localStorage.setItem('drtalk_trial_ended', 'false');
    localStorage.setItem('drtalk_trial_days', '14');
    window.location.reload();
  };

  return (
    <SubscriptionContext.Provider value={{ 
      plan, 
      isTrialEnded, 
      daysRemaining, 
      setPlan, 
      endTrial, 
      resetSubscription,
      showPaywall,
      setShowPaywall
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
