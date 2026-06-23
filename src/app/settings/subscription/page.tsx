"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft, CreditCard, ExternalLink, ShieldCheck } from 'lucide-react';
import { useSubscription } from '@/components/SubscriptionContext';

export default function SubscriptionSettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const isDentist = pathname.includes('/dentist');
  const { plan, daysRemaining, isTrialEnded } = useSubscription();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleManage = () => {
    showToast("Opening Stripe Customer Portal...");
  };

  return (
    <MainLayout title="Subscription">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        {/* Navigation & Header */}
        <div className="space-y-4">
          <button
            onClick={() => router.push(isDentist ? '/dentist/settings' : '/settings')}
            className="flex items-center gap-2 text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-colors w-fit px-2 py-1 border-2 border-transparent hover:border-black"
          >
            <ArrowLeft size={14} />
            Back to Settings
          </button>

          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter text-black italic">
              Subscription
            </h2>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            Manage your subscription and payment methods
          </p>
        </div>

        {/* Main Content Card */}
        <div className="wireframe-card p-6 space-y-6 w-full max-w-md bg-white border-2 border-black">
          <div className="flex items-center gap-3 border-b-2 border-black pb-4">
            <CreditCard size={20} />
            <div>
              <h3 className="font-bold uppercase tracking-tight text-sm">Subscription Details</h3>
              <p className="text-[9px] text-muted-foreground uppercase">View and update your payment information</p>
            </div>
          </div>

          <div className="wireframe-card p-6 bg-gray-50 border-black flex flex-col items-center text-center space-y-2 border-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Plan</span>
            <span className="text-2xl font-black uppercase">{plan === 'Trial' ? 'Free Trial' : plan}</span>
            {plan === 'Trial' && (
              <span className={`text-[10px] font-bold uppercase px-2 py-1 border border-black ${isTrialEnded ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                {isTrialEnded ? 'Trial Expired' : `${daysRemaining} Days Remaining`}
              </span>
            )}
            {plan !== 'Trial' && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 text-green-700 border border-green-700 bg-green-50 mt-2">
                <ShieldCheck size={12} /> Active Subscription
              </span>
            )}
          </div>

          <div className="pt-2">
            <button 
              onClick={handleManage}
              className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm font-black tracking-widest flex items-center justify-center gap-2"
            >
              Manage in Stripe <ExternalLink size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-black text-white border-2 border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-300">
          <p className="text-[10px] font-black uppercase tracking-tight flex items-center gap-2">
            <span>✓</span> {toastMessage}
          </p>
        </div>
      )}
    </MainLayout>
  );
}
