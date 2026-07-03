"use client";

import React, { useState } from 'react';
import { useSubscription } from './SubscriptionContext';
import { Check, X, Shield, Infinity, Send, MessageSquare, BarChart3, GraduationCap } from 'lucide-react';

const VALUE_PROPS = [
  {
    icon: Infinity,
    title: "No limits on growth",
    desc: "Unlimited referrals and connections, so your network grows with you"
  },
  {
    icon: Shield,
    title: "Nothing gets lost",
    desc: "Unlimited history, fully HIPAA compliant and encrypted"
  },
  {
    icon: Send,
    title: "Refer in seconds",
    desc: "Custom-branded referral pad built into your workflow"
  },
  {
    icon: MessageSquare,
    title: "Stay in the loop",
    desc: "Chat, channels, and e-fax, on desktop or mobile"
  },
  {
    icon: BarChart3,
    title: "See what's working",
    desc: "Referral reporting and trends across your network"
  },
  {
    icon: GraduationCap,
    title: "Keep learning",
    desc: "Learning hub access for CE credits and mentorship"
  }
];

export function SubscriptionManager() {
  const { showPaywall, setShowPaywall, setPlan, isTrialEnded, plan, daysRemaining } = useSubscription();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  if (!showPaywall) return null;

  const handleSelectPlan = () => {
    setPlan('Pro');
    setShowPaywall(false);
  };

  const isCurrent = plan === 'Pro';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-white/95 backdrop-blur-md p-4 sm:p-8 overflow-y-auto">
      <div className="w-full max-w-4xl space-y-10 py-12">
        
        {/* Close Button */}
        <div className="flex justify-end max-w-2xl mx-auto">
          <button 
            onClick={() => setShowPaywall(false)}
            className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter italic leading-none">
            {isTrialEnded ? 'Your trial has ended' : 'Upgrade to Pro'}
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
            Get unlimited access to referrals, connections, secure communication, and more.
          </p>
        </div>

        {/* Billing Switcher */}
        <div className="flex justify-center">
          <div className="border-2 border-black p-1 bg-white inline-flex rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all rounded-none ${
                billingPeriod === 'monthly'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all rounded-none flex items-center gap-1.5 ${
                billingPeriod === 'annual'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              <span>Annual</span>
              <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 font-bold uppercase tracking-tight">
                Save 15%
              </span>
            </button>
          </div>
        </div>

        {/* Main Grid: Card & Value Props side-by-side on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start max-w-4xl mx-auto">
          
          {/* Left: Pricing Card */}
          <div className="wireframe-card p-8 bg-white flex flex-col space-y-6 relative transition-all border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] w-full">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-black text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              Best value
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Pro Plan</h3>
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
                {billingPeriod === 'monthly' ? 'Recommended for practices of all sizes' : 'Recommended for practices of all sizes (15% savings)'}
              </p>
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter italic leading-none">
                  {billingPeriod === 'monthly' ? '$199' : '$169'}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-black">/month</span>
              </div>
              {billingPeriod === 'annual' && (
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                  Billed annually as $2,028/yr
                </span>
              )}
            </div>

            <button 
              onClick={handleSelectPlan}
              className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-4 border-black bg-black text-white hover:bg-white hover:text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)]"
            >
              {isCurrent ? 'Extend Subscription' : 'Upgrade to Pro'}
            </button>
          </div>

          {/* Right: Value Props (All 6 Benefits, no Included in Pro header) */}
          <div className="space-y-6 w-full">
            <div className="grid grid-cols-1 gap-5">
              {VALUE_PROPS.map((vp, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="p-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                    <vp.icon size={16} className="text-black" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-[11px] font-black uppercase tracking-tight text-black">{vp.title}</h4>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase leading-tight">{vp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer / Cancel */}
        <div className="text-center pt-4">
          <button 
            onClick={() => setShowPaywall(false)}
            className="text-[10px] font-black uppercase underline tracking-[0.2em] opacity-50 hover:opacity-100 transition-all"
          >
            I&apos;ll do this later
          </button>
        </div>
      </div>
    </div>
  );
}
