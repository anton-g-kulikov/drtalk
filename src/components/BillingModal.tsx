import React from 'react';
import { CreditCard, ExternalLink, ShieldCheck } from 'lucide-react';
import { useSubscription } from '@/components/SubscriptionContext';

export function BillingModal({
  isOpen,
  onClose,
  onManage
}: {
  isOpen: boolean;
  onClose: () => void;
  onManage: () => void;
}) {
  const { plan, daysRemaining, isTrialEnded } = useSubscription();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white border-4 border-black p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] space-y-8 animate-in zoom-in-95 duration-300">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-black rounded-full flex items-center justify-center mx-auto bg-gray-50">
            <CreditCard size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Billing & Plan</h2>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
            Manage your subscription and payment methods.
          </p>
        </div>

        <div className="space-y-4">
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

          <div className="grid grid-cols-1 gap-3 pt-4">
            <button 
              onClick={onManage}
              className="wireframe-button bg-black text-white py-4 uppercase text-sm font-black tracking-widest flex items-center justify-center gap-2"
            >
              Manage in Stripe <ExternalLink size={14} />
            </button>
            <button 
              onClick={onClose}
              className="text-[10px] font-black uppercase underline py-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
