"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { 
  ArrowLeft, Check, Users, Globe, Zap, CheckCircle2, 
  Infinity, Shield, Send, MessageSquare, BarChart3, 
  GraduationCap, ChevronDown, ChevronUp 
} from 'lucide-react';
import { useSubscription } from '@/components/SubscriptionContext';

type SubscriptionPlan = 'Trial' | 'Starter' | 'Pro' | 'BusinessPlus';

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

const SECTIONS = [
  {
    title: 'Referrals',
    features: [
      { name: 'Send documents', pro: true },
      { name: 'Send and receive Referral', pro: true },
      { name: 'Comment on documents', pro: true },
      { name: 'Forward files', pro: true },
      { name: 'Marking (Processing/ Being worked on)', pro: true },
      { name: 'Custom Website Referral Pad', pro: true },
      { name: 'e-Fax', pro: true },
    ]
  },
  {
    title: 'Patient Communication',
    features: [
      { name: 'Messaging', pro: true },
      { name: 'Emails', pro: true },
      { name: 'Automated responses', pro: true },
      { name: 'Resend messages & emails', pro: true },
      { name: 'Archive', pro: true },
      { name: 'Live status view', pro: true },
    ]
  },
  {
    title: 'Communication',
    features: [
      { name: 'In-office channels', pro: true },
      { name: 'Connected Practice channels', pro: true },
      { name: 'Per-patient channels', pro: true },
      { name: 'Direct messages', pro: true },
      { name: 'Attachments', pro: true },
      { name: 'Reactions', pro: true },
      { name: 'Archive channels', pro: true },
      { name: 'Messages and document history', pro: 'Unlimited' },
    ]
  },
  {
    title: 'Network',
    features: [
      { name: 'Practice suggestions', pro: true },
      { name: 'Network analytics & trends', pro: true },
      { name: 'Invite network connection', pro: true },
    ]
  },
  {
    title: 'Learning Hub',
    features: [
      { name: 'Education channels', pro: 'Unlimited' },
      { name: 'Clinical courses & videos', pro: true },
    ]
  },
  {
    title: 'Notifications',
    features: [
      { name: 'In-app notifications', pro: true },
      { name: 'Desktop push notifications', pro: true },
      { name: 'Email alerts', pro: true },
      { name: 'SMS text alerts', pro: true },
      { name: 'Mobile app notifications', pro: true },
    ]
  }
];

export default function SubscriptionSettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const isDentist = pathname.includes('/dentist');
  const { plan, daysRemaining, isTrialEnded, setPlan } = useSubscription();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Switcher state
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  // Accordion state
  const [showFeatures, setShowFeatures] = useState(false);

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

  const handleSelectPlan = () => {
    setPlan('Pro');
    showToast(`Successfully updated subscription to Pro!`);
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

  const isCurrent = plan === 'Pro';

  return (
    <MainLayout title="Subscription">
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-24">
        
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

        {/* Billing Switcher */}
        <div className="flex justify-center pt-4">
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

        {/* Pricing Card (Single Plan) */}
        <div className="max-w-md mx-auto">
          <div className="wireframe-card p-10 bg-white flex flex-col space-y-8 relative transition-all border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-black text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Best value
            </div>
            
            {isCurrent && (
              <div className="absolute top-0 left-10 -translate-y-1/2 bg-black text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Active Plan
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Pro Plan</h3>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                {billingPeriod === 'monthly' ? 'Recommended for practices of all sizes' : 'Recommended for practices of all sizes (15% savings)'}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black tracking-tighter italic leading-none">
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

            <ul className="space-y-4 pt-4 border-t border-black border-dashed">
              <li className="flex items-start gap-3">
                <Check size={16} className="shrink-0 mt-0.5 text-black" />
                <span className="text-[11px] uppercase font-bold leading-tight">Unlimited team members</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={16} className="shrink-0 mt-0.5 text-black" />
                <span className="text-[11px] uppercase font-bold leading-tight">Unlimited connections</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={16} className="shrink-0 mt-0.5 text-black" />
                <span className="text-[11px] uppercase font-bold leading-tight">HIPAA Compliant Referrals & Chat</span>
              </li>
            </ul>

            <button 
              onClick={() => !isCurrent && handleSelectPlan()}
              disabled={isCurrent}
              className={`w-full py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-4 border-black ${
                isCurrent 
                  ? 'bg-white text-black border-dashed border-black/40 cursor-default shadow-none' 
                  : 'bg-black text-white hover:bg-white hover:text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)]'
              }`}
            >
              {isCurrent ? 'Current Plan' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>

        {/* Value Propositions section */}
        <div className="space-y-6 pt-4 max-w-2xl mx-auto border-t-2 border-black border-dashed">
          <div className="text-center">
            <h3 className="text-xl font-black uppercase tracking-tight italic">Why Upgrade?</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Everything you need to grow your practice network securely</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {VALUE_PROPS.map((vp, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="p-3 border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0">
                  <vp.icon size={20} className="text-black" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-tight text-black">{vp.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase leading-relaxed">{vp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Comparison Table Accordion */}
        <div className="space-y-6 pt-4 flex flex-col items-center border-t-2 border-black border-dashed">
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="flex items-center gap-2 px-6 py-3.5 border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
          >
            <span>{showFeatures ? 'Hide Features Table' : 'Check all features'}</span>
            {showFeatures ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {showFeatures && (
            <div className="w-full space-y-6 pt-6 animate-fade-in max-w-3xl">
              <div className="border-b-2 border-black pb-4 text-center">
                <h3 className="text-lg font-bold uppercase tracking-tight">Pro Plan Features</h3>
                <p className="text-[9px] text-muted-foreground uppercase font-semibold">Detailed list of capabilities included with Pro</p>
              </div>

              <div className="w-full overflow-x-auto border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b-2 border-black bg-gray-50">
                      <th className="p-4 text-[10px] font-black uppercase tracking-wider w-2/3 text-black">Features</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-wider text-center w-1/3 text-black">Pro Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SECTIONS.map((section, sIdx) => (
                      <React.Fragment key={sIdx}>
                        {/* Section Header Row */}
                        <tr className="border-b-2 border-black bg-gray-100/70">
                          <td colSpan={2} className="p-3 text-[10px] font-black uppercase tracking-widest italic text-black">
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
                            <td className="p-3 text-center text-xs font-bold text-black">{renderVal(feat.pro)}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Add-Ons Section */}
        <div className="space-y-6 pt-4 max-w-3xl mx-auto border-t-2 border-black border-dashed">
          <div className="border-b-2 border-black pb-4">
            <h3 className="text-xl font-bold uppercase tracking-tight">Add-Ons</h3>
            <p className="text-[9px] text-muted-foreground uppercase font-semibold">Optional upgrades to customize your experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add-On 1: Curbside Check-in */}
            <div className="wireframe-card p-6 bg-white border-2 border-black flex items-center justify-between transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="space-y-1">
                <h4 className="text-md font-black text-black uppercase tracking-tight">Curbside Check-in</h4>
                <p className="text-[9px] text-muted-foreground uppercase font-bold">Enable seamless check-ins for patients</p>
              </div>
              <button
                onClick={() => handleToggleAddon('checkin', 'Curbside Check-in')}
                className={`px-4 py-2 rounded-none text-[9px] font-black uppercase tracking-wider transition-all border-2 border-black flex items-center gap-1.5 ${
                  addons.checkin
                    ? 'bg-black text-white hover:bg-white hover:text-black'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                {addons.checkin ? (
                  <>
                    <CheckCircle2 size={10} />
                    <span>Added</span>
                  </>
                ) : (
                  <span>Add</span>
                )}
              </button>
            </div>

            {/* Add-On 2: Curbside No-EMR */}
            <div className="wireframe-card p-6 bg-white border-2 border-black flex items-center justify-between transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="space-y-1">
                <h4 className="text-md font-black text-black uppercase tracking-tight">Curbside No-EMR</h4>
                <p className="text-[9px] text-muted-foreground uppercase font-bold">Intake without EMR integration requirements</p>
              </div>
              <button
                onClick={() => handleToggleAddon('noemr', 'Curbside No-EMR')}
                className={`px-4 py-2 rounded-none text-[9px] font-black uppercase tracking-wider transition-all border-2 border-black flex items-center gap-1.5 ${
                  addons.noemr
                    ? 'bg-black text-white hover:bg-white hover:text-black'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                {addons.noemr ? (
                  <>
                    <CheckCircle2 size={10} />
                    <span>Added</span>
                  </>
                ) : (
                  <span>Add</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Final Contact CTA */}
        <div className="text-center space-y-3 pt-8 border-t-2 border-black border-dashed max-w-xl mx-auto">
          <p className="text-xs uppercase font-bold text-muted-foreground">
            Have any questions or need custom enterprise terms?
          </p>
          <a
            href="mailto:support@drtalk.com?subject=DrTalk%20Pro%20Subscription%20Inquiry"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <span>Contact Us</span>
          </a>
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
