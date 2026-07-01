"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft, Check, Users, Globe, Zap, CheckCircle2 } from 'lucide-react';
import { useSubscription } from '@/components/SubscriptionContext';

type SubscriptionPlan = 'Trial' | 'Starter' | 'Pro' | 'BusinessPlus';

const PLANS = [
  {
    id: 'Starter' as SubscriptionPlan,
    name: 'Starter',
    tagline: 'Communication and referrals',
    price: 'Free',
    features: [
      { icon: Users, text: 'Up to 10 team members' },
      { icon: Globe, text: 'Up to 5 connected practices' }
    ]
  },
  {
    id: 'Pro' as SubscriptionPlan,
    name: 'Pro',
    tagline: 'Recommended for small teams',
    price: '$110',
    priceSuffix: '/month',
    badge: 'Best value',
    features: [
      { icon: Users, text: 'Unlimited team members' },
      { icon: Globe, text: 'Unlimited connections' }
    ]
  },
  {
    id: 'BusinessPlus' as SubscriptionPlan,
    name: 'Business Plus',
    tagline: 'For specialty practices',
    price: '$299',
    priceSuffix: '/month',
    features: [
      { icon: Users, text: 'Up to 3 providers' },
      { icon: Zap, text: '$99/mo for each additional provider' }
    ]
  }
];

const SECTIONS = [
  {
    title: 'Referrals',
    features: [
      { name: 'Send documents', starter: true, pro: true, business: true },
      { name: 'Send and receive Referral', starter: true, pro: true, business: true },
      { name: 'Comment on documents', starter: true, pro: true, business: true },
      { name: 'Forward files', starter: false, pro: true, business: true },
      { name: 'Marking (Processing/ Being worked on)', starter: true, pro: true, business: true },
      { name: 'Custom Website Referral Pad', starter: false, pro: false, business: true },
      { name: 'e-Fax', starter: false, pro: true, business: true },
    ]
  },
  {
    title: 'Patient Communication',
    features: [
      { name: 'Messaging', starter: false, pro: true, business: true },
      { name: 'Emails', starter: true, pro: true, business: true },
      { name: 'Automated responses', starter: false, pro: true, business: true },
      { name: 'Resend messages & emails', starter: false, pro: true, business: true },
      { name: 'Archive', starter: false, pro: true, business: true },
      { name: 'Live status view', starter: true, pro: true, business: true },
    ]
  },
  {
    title: 'Communication',
    features: [
      { name: 'In-office channels', starter: false, pro: true, business: true },
      { name: 'Connected Practice channels', starter: true, pro: true, business: true },
      { name: 'Per-patient channels', starter: true, pro: true, business: true },
      { name: 'Direct messages', starter: true, pro: true, business: true },
      { name: 'Attachments', starter: true, pro: true, business: true },
      { name: 'Reactions', starter: false, pro: true, business: true },
      { name: 'Archive channels', starter: false, pro: true, business: true },
      { name: 'Messages and document history', starter: '90 days', pro: 'Unlimited', business: 'Unlimited' },
    ]
  },
  {
    title: 'Network',
    features: [
      { name: 'Practice suggestions', starter: false, pro: true, business: true },
      { name: 'Network analytics & trends', starter: false, pro: true, business: true },
      { name: 'Invite network connection', starter: true, pro: true, business: true },
    ]
  },
  {
    title: 'Learning Hub',
    features: [
      { name: 'Education channels', starter: 'Up to 3', pro: 'Up to 10', business: 'Unlimited' },
      { name: 'Clinical courses & videos', starter: true, pro: true, business: true },
    ]
  },
  {
    title: 'Notifications',
    features: [
      { name: 'In-app notifications', starter: true, pro: true, business: true },
      { name: 'Desktop push notifications', starter: true, pro: true, business: true },
      { name: 'Email alerts', starter: true, pro: true, business: true },
      { name: 'SMS text alerts', starter: false, pro: true, business: true },
      { name: 'Mobile app notifications', starter: false, pro: true, business: true },
    ]
  }
];

export default function SubscriptionSettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const isDentist = pathname.includes('/dentist');
  const { plan, daysRemaining, isTrialEnded, setPlan } = useSubscription();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add-ons interactive state
  const [addons, setAddons] = useState<Record<string, boolean>>({
    checkin: false,
    noemr: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAddons({
        checkin: localStorage.getItem('addon_curbside_checkin') === 'true',
        noemr: localStorage.getItem('addon_curbside_noemr') === 'true'
      });
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectPlan = (planId: SubscriptionPlan) => {
    setPlan(planId);
    showToast(`Successfully updated subscription to ${planId === 'BusinessPlus' ? 'Business Plus' : planId}!`);
  };

  const handleToggleAddon = (key: string, name: string) => {
    const newState = !addons[key];
    setAddons(prev => ({ ...prev, [key]: newState }));
    localStorage.setItem(`addon_curbside_${key}`, String(newState));
    showToast(newState ? `Added ${name} add-on!` : `Removed ${name} add-on.`);
  };

  const renderVal = (val: any) => {
    if (val === true) {
      return <Check size={16} className="text-black mx-auto" />;
    }
    if (val === false) {
      return <span className="text-gray-300 font-normal">—</span>;
    }
    return <span className="text-[11px] font-bold uppercase">{val}</span>;
  };

  return (
    <MainLayout title="Subscription">
      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-24">
        
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

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {PLANS.map((p) => {
            const isCurrent = 
              (p.id === 'Starter' && (plan === 'Trial' || plan === 'Starter')) ||
              (p.id === 'Pro' && plan === 'Pro') ||
              (p.id === 'BusinessPlus' && plan === 'BusinessPlus');

            // Determine button action and text
            let buttonText = 'Upgrade';
            let isDisabled = false;

            if (isCurrent) {
              isDisabled = true;
              if (p.id === 'Starter' && plan === 'Trial') {
                buttonText = isTrialEnded ? 'Ends in 14 days' : `Ends in ${daysRemaining} days`;
              } else {
                buttonText = 'Current Plan';
              }
            } else {
              const planHierarchy: Record<SubscriptionPlan, number> = {
                'Trial': 0,
                'Starter': 1,
                'Pro': 2,
                'BusinessPlus': 3
              };
              
              const currentHierarchyVal = planHierarchy[plan];
              const targetHierarchyVal = planHierarchy[p.id];

              if (targetHierarchyVal < currentHierarchyVal) {
                buttonText = 'Downgrade';
              } else {
                buttonText = 'Upgrade';
              }
            }

            return (
              <div 
                key={p.id} 
                className={`wireframe-card p-10 bg-white flex flex-col space-y-8 relative transition-all hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${p.badge || isCurrent ? 'border-4 border-black' : 'border-2 border-black'}`}
              >
                {p.badge && (
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-black text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                  onClick={() => !isDisabled && handleSelectPlan(p.id)}
                  disabled={isDisabled}
                  className={`w-full py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-4 border-black ${
                    isCurrent 
                      ? 'bg-white text-black border-dashed border-black/40 cursor-default' 
                      : (p.id === 'Pro' 
                          ? 'bg-black text-white hover:bg-white hover:text-black' 
                          : 'bg-white text-black hover:bg-black hover:text-white')
                  } shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)]`}
                >
                  {buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Features Comparison Table */}
        <div className="space-y-6 pt-8">
          <div className="border-b-2 border-black pb-4">
            <h3 className="text-xl font-bold uppercase tracking-tight">Compare Plans</h3>
            <p className="text-[9px] text-muted-foreground uppercase">Detailed look at what is included in each plan</p>
          </div>

          <div className="w-full overflow-x-auto border-2 border-black bg-white">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-black bg-gray-50">
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider w-2/5 text-black">Features</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-center w-1/5 text-black">Starter</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-center w-1/5 text-black">Pro</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-center w-1/5 text-black">Business Plus</th>
                </tr>
              </thead>
              <tbody>
                {SECTIONS.map((section, sIdx) => (
                  <React.Fragment key={sIdx}>
                    {/* Section Header Row */}
                    <tr className="border-b-2 border-black bg-gray-100/70">
                      <td colSpan={4} className="p-3 text-[10px] font-black uppercase tracking-widest italic text-black">
                        {section.title}
                      </td>
                    </tr>
                    {section.features.map((feat, fIdx) => (
                      <tr 
                        key={fIdx} 
                        className={`border-b border-black/10 hover:bg-gray-50/50 transition-colors ${
                          fIdx === section.features.length - 1 ? 'border-b-2 border-black' : ''
                        }`}
                      >
                        <td className="p-3 text-[10px] font-bold text-black pl-6">{feat.name}</td>
                        <td className="p-3 text-center text-xs font-bold text-black">{renderVal(feat.starter)}</td>
                        <td className="p-3 text-center text-xs font-bold text-black">{renderVal(feat.pro)}</td>
                        <td className="p-3 text-center text-xs font-bold text-black">{renderVal(feat.business)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add-Ons Section */}
        <div className="space-y-6 pt-4">
          <div className="border-b-2 border-black pb-4">
            <h3 className="text-xl font-bold uppercase tracking-tight">Add-Ons</h3>
            <p className="text-[9px] text-muted-foreground uppercase">Optional upgrades to customize your experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add-On 1: Curbside Check-in */}
            <div className="wireframe-card p-6 bg-white border-2 border-black flex items-center justify-between transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-black uppercase tracking-tight">Curbside Check-in</h4>
                <p className="text-[9px] text-muted-foreground uppercase font-semibold">Enable seamless check-ins for patients</p>
              </div>
              <button
                onClick={() => handleToggleAddon('checkin', 'Curbside Check-in')}
                className={`px-6 py-2 rounded-none text-[10px] font-black uppercase tracking-wider transition-all border-2 border-black flex items-center gap-1.5 ${
                  addons.checkin
                    ? 'bg-black text-white hover:bg-white hover:text-black'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                {addons.checkin ? (
                  <>
                    <CheckCircle2 size={12} />
                    <span>Added</span>
                  </>
                ) : (
                  <span>Click to add</span>
                )}
              </button>
            </div>

            {/* Add-On 2: Curbside No-EMR */}
            <div className="wireframe-card p-6 bg-white border-2 border-black flex items-center justify-between transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-black uppercase tracking-tight">Curbside No-EMR</h4>
                <p className="text-[9px] text-muted-foreground uppercase font-semibold">Standalone intake without EMR requirements</p>
              </div>
              <button
                onClick={() => handleToggleAddon('noemr', 'Curbside No-EMR')}
                className={`px-6 py-2 rounded-none text-[10px] font-black uppercase tracking-wider transition-all border-2 border-black flex items-center gap-1.5 ${
                  addons.noemr
                    ? 'bg-black text-white hover:bg-white hover:text-black'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                {addons.noemr ? (
                  <>
                    <CheckCircle2 size={12} />
                    <span>Added</span>
                  </>
                ) : (
                  <span>Click to add</span>
                )}
              </button>
            </div>
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
