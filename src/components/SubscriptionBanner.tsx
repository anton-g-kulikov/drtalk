"use client";

import React from 'react';
import { useSubscription } from './SubscriptionContext';
import { Timer, Zap, ShieldCheck } from 'lucide-react';

export function SubscriptionBanner() {
  const { plan, isTrialEnded, daysRemaining, setShowPaywall } = useSubscription();

  if (plan !== 'Trial') return null;

  return (
    <div className={`wireframe-card p-5 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${isTrialEnded ? 'bg-black text-white border-black' : 'bg-gray-50 border-black border-dashed'}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 border-2 flex items-center justify-center ${isTrialEnded ? 'border-white bg-white text-black' : 'border-black bg-black text-white'}`}>
          <Timer size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-[11px] font-black uppercase tracking-widest leading-tight">
            {isTrialEnded ? 'Your trial has ended' : `Free Trial Active: ${daysRemaining} Days Remaining`}
          </h4>
          <p className={`text-[10px] uppercase font-bold tracking-tight opacity-70 ${isTrialEnded ? 'text-gray-300' : 'text-muted-foreground'}`}>
            {isTrialEnded 
              ? 'Subscription required to process new incoming referrals and access premium features.' 
              : 'You have full access to all Pro features. Upgrade anytime to ensure uninterrupted service.'}
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => setShowPaywall(true)}
        className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-2 transition-all shrink-0 ${isTrialEnded ? 'bg-white text-black border-white hover:bg-black hover:text-white' : 'bg-black text-white border-black hover:bg-white hover:text-black'}`}
      >
        {isTrialEnded ? 'Renew Subscription' : 'Upgrade Now'}
      </button>
    </div>
  );
}
