"use client";

import React from 'react';
import { useSubscription } from './SubscriptionContext';
import { Check, X, ShieldAlert, Zap, Globe, Users } from 'lucide-react';

const PLANS = [
  {
    id: 'Starter',
    name: 'Starter',
    tagline: 'Communication and referrals',
    price: 'Free',
    features: [
      { icon: Users, text: 'Up to 10 team members' },
      { icon: Globe, text: 'Up to 5 connected practices' }
    ],
    buttonText: 'Try for free'
  },
  {
    id: 'Pro',
    name: 'Pro',
    tagline: 'Recommended for small teams',
    price: '$110',
    priceSuffix: '/month',
    badge: 'Best value',
    features: [
      { icon: Users, text: 'Unlimited team members' },
      { icon: Globe, text: 'Unlimited connections' }
    ],
    buttonText: 'Get started'
  },
  {
    id: 'BusinessPlus',
    name: 'Business plus',
    tagline: 'For specialty practices',
    price: '$299',
    priceSuffix: '/month',
    features: [
      { icon: Users, text: 'Up to 3 providers' },
      { icon: Zap, text: '$99/mo for each additional provider' }
    ],
    buttonText: 'Get started'
  }
];

export function SubscriptionManager() {
  const { showPaywall, setShowPaywall, setPlan, isTrialEnded, plan, daysRemaining } = useSubscription();

  if (!showPaywall) return null;

  const handleSelectPlan = (planId: any) => {
    setPlan(planId);
    setShowPaywall(false);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-white/95 backdrop-blur-md p-4 sm:p-8 overflow-y-auto">
      <div className="w-full max-w-6xl space-y-12 py-12">
        
        {/* Header */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em]">
            <ShieldAlert size={14} /> Subscription Status
          </div>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter italic leading-none">
            {isTrialEnded ? 'Your trial has ended' : 'Choose your plan'}
          </h1>
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
              Choose the right plan to continue processing referrals and communicating with your network.
            </p>
            {!isTrialEnded && (
              <p className="text-[10px] font-black uppercase tracking-widest text-black bg-white inline-block px-3 py-1 border-2 border-black italic">
                Currently on Starter Plan. Trial ends in {daysRemaining} days.
              </p>
            )}
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((p) => {
            const isCurrent = (p.id === 'Starter' && (plan === 'Trial' || plan === 'Starter'));
            
            return (
              <div 
                key={p.id} 
                className={`wireframe-card p-10 bg-white flex flex-col space-y-8 relative transition-all hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${p.badge || isCurrent ? 'border-4 border-black' : 'border-2 border-black opacity-90'}`}
              >
                {p.badge && (
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-black text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {p.badge}
                  </div>
                )}
                
                {isCurrent && (
                  <div className="absolute top-0 left-10 -translate-y-1/2 bg-black text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Current Plan
                  </div>
                )}

              <div className="space-y-2">
                <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">{p.name}</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{p.tagline}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black tracking-tighter italic leading-none">{p.price}</span>
                {p.priceSuffix && <span className="text-xs text-muted-foreground uppercase font-black">{p.priceSuffix}</span>}
              </div>

              <ul className="space-y-4 flex-grow pt-4">
                {p.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <f.icon size={16} className="shrink-0 mt-0.5" />
                    <span className="text-[11px] uppercase font-bold leading-tight">{f.text}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSelectPlan(p.id)}
                className={`w-full py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-4 border-black ${p.id === 'Pro' ? 'bg-black text-white hover:bg-white hover:text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]' : 'bg-white text-black hover:bg-black hover:text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]'}`}
              >
                {p.buttonText}
              </button>
            </div>
            );
          })}
        </div>

        {/* Footer / Cancel */}
        <div className="text-center">
          <button 
            onClick={() => setShowPaywall(false)}
            className="text-[10px] font-black uppercase underline tracking-[0.2em] opacity-50 hover:opacity-100 transition-all"
          >
            I'll do this later
          </button>
        </div>
      </div>
    </div>
  );
}
