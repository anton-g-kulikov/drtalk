"use client";

import React, { useState } from 'react';
import { CreditCard, Check, ArrowRight } from 'lucide-react';

interface StripeConnectScreenProps {
  channelName: string;
  onConnect: () => void;
}

export default function StripeConnectScreen({ channelName, onConnect }: StripeConnectScreenProps) {
  const [connecting, setConnecting] = useState(false);
  const [done, setDone] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setDone(true);
      setTimeout(() => {
        onConnect();
      }, 1000);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 border-2 border-black/10 m-6 wireframe-card border-dashed">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto bg-white">
          <CreditCard size={28} className="text-black" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-black uppercase tracking-tight">Connect Stripe Account</h3>
          <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed">
            To start publishing and monetizing content in <span className="text-black font-black">"{channelName}"</span>, you need to connect your practice's Stripe account.
          </p>
        </div>

        <div className="bg-white border-2 border-black p-4 text-left space-y-3">
          <h4 className="text-[9px] font-black uppercase tracking-wider border-b border-black pb-1">Why Stripe?</h4>
          <ul className="text-[8px] uppercase font-bold text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-black font-black">•</span> Secure payment routing straight to your practice bank account.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-black font-black">•</span> Automated billing interval tracking (monthly / yearly).
            </li>
            <li className="flex items-start gap-2">
              <span className="text-black font-black">•</span> Access to Stripe dashboard for payouts and subscriber tracking.
            </li>
          </ul>
        </div>

        {done ? (
          <div className="wireframe-button border-green-700 bg-green-50 text-green-700 text-[10px] uppercase py-3 flex items-center justify-center gap-2">
            <Check size={14} /> Stripe Connected Successfully!
          </div>
        ) : (
          <button
            type="button"
            disabled={connecting}
            onClick={handleConnect}
            className="w-full wireframe-button bg-black text-white text-[10px] uppercase py-3 flex items-center justify-center gap-2"
          >
            {connecting ? 'Redirecting to Stripe...' : 'Link Stripe Account'} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
