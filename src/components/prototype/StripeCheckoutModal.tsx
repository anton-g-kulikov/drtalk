"use client";

import React, { useState, useEffect } from 'react';
import { X, CreditCard, ShieldCheck } from 'lucide-react';
import { LearningChannel } from '@/types/learningHubTypes';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: LearningChannel | null;
  onSuccess: () => void;
}

export default function StripeCheckoutModal({ isOpen, onClose, channel, onSuccess }: StripeCheckoutModalProps) {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCardName('');
      setProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen || !channel) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm bg-white border-2 border-black p-6 space-y-6 z-10 animate-fade-in shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-black border-dashed pb-3">
          <div>
            <h3 className="font-black uppercase text-sm tracking-tight">Checkout</h3>
            <p className="text-[8px] uppercase text-muted-foreground font-bold">Secure payment powered by Stripe</p>
          </div>
          <button onClick={onClose} className="p-0.5 border border-black hover:bg-black hover:text-white transition-colors">
            <X size={12} />
          </button>
        </div>

        {/* Pricing Summary */}
        <div className="bg-gray-50 border border-black p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-wider">Channel subscription</span>
            <span className="text-[8px] font-bold border border-black bg-white px-1 uppercase">{channel.category}</span>
          </div>
          <h4 className="font-black text-xs uppercase truncate">{channel.name}</h4>
          
          <div className="border-t border-black border-dashed pt-2 mt-2 space-y-1 text-[8px] uppercase font-bold text-muted-foreground">
            <div className="flex justify-between">
              <span>Monthly Subscription:</span>
              <span className="text-black font-black">${channel.subscriptionCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform & processing fees:</span>
              <span className="text-black font-black">${(channel.totalCharge - channel.subscriptionCost).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-black/10 pt-1 text-black font-black text-[10px]">
              <span>Monthly Total:</span>
              <span>${channel.totalCharge.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePay} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[8px] font-black uppercase tracking-wider block">Cardholder Name</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="wireframe-input text-xs font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black uppercase tracking-wider block">Card Details</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="wireframe-input text-xs font-bold pl-8"
              />
              <CreditCard size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-wider block">Expires</label>
              <input
                type="text"
                required
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="wireframe-input text-xs font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-wider block">CVC</label>
              <input
                type="text"
                required
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="wireframe-input text-xs font-bold"
              />
            </div>
          </div>

          {/* Security Banner */}
          <div className="flex items-center gap-1.5 text-muted-foreground justify-center">
            <ShieldCheck size={12} />
            <span className="text-[7px] uppercase font-bold tracking-wider">Payments are encrypted and direct to the host.</span>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full wireframe-button bg-black text-white text-[10px] uppercase py-2.5 flex items-center justify-center gap-2"
          >
            {processing ? 'Processing Payment...' : `Subscribe for $${channel.totalCharge.toFixed(2)}/mo`}
          </button>
        </form>
      </div>
    </div>
  );
}
