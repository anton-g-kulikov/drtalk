"use client";

import React from 'react';
import { useSubscription } from './SubscriptionContext';
import { Timer, Zap, ShieldCheck } from 'lucide-react';

export function SubscriptionBanner() {
  const { plan, isTrialEnded, daysRemaining, setShowPaywall } = useSubscription();

  if (plan !== 'Trial') return null;

  return (
    <div className={`wireframe-card p-4 flex flex-col items-stretch gap-4 transition-all ${isTrialEnded ? 'bg-black text-white border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]' : 'bg-gray-50 border-black border-dashed'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 border-2 flex items-center justify-center shrink-0 ${isTrialEnded ? 'border-white bg-white text-black' : 'border-black bg-black text-white'}`}>
          <Timer size={16} />
        </div>
        <div className="space-y-1">
          <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">
            {isTrialEnded ? 'Trial Ended' : 'Free Trial'}
          </h4>
          <p className={`text-[9px] font-bold tracking-tight leading-tight ${isTrialEnded ? 'text-gray-300' : 'text-muted-foreground'}`}>
            {isTrialEnded ? 'Upgrade to process referrals.' : `${daysRemaining} Days Left`}
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => setShowPaywall(true)}
        className={`w-full py-2.5 text-[9px] font-black uppercase tracking-widest border-2 transition-all ${isTrialEnded ? 'bg-white text-black border-white hover:bg-black hover:text-white' : 'bg-black text-white border-black hover:bg-white hover:text-black'}`}
      >
        {isTrialEnded ? 'Renew' : 'Upgrade'}
      </button>
    </div>
  );
}
