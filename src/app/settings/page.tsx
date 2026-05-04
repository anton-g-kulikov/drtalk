"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { User, Bell, Shield, CreditCard, HelpCircle } from 'lucide-react';

export default function SettingsPage() {
  const pathname = usePathname();
  const isDentist = pathname.startsWith('/dentist');

  const sections = [
    { icon: User, label: isDentist ? 'Practice Profile' : 'Practice Profile', desc: isDentist ? 'Manage practice details and referral preferences.' : 'Manage specialist details, locations, and clinical specialties.' },
    { icon: Bell, label: 'Referral Notifications', desc: 'Configure intake alerts for dentists, staff, and patients.' },
    { icon: Shield, label: 'PHI & Access Control', desc: 'Manage team permissions and patient communication safeguards.' },
    ...(isDentist ? [] : [{ icon: CreditCard, label: 'Billing & Plan', desc: 'View subscription status for referral processing.' }]),
    { icon: HelpCircle, label: 'Support & Docs', desc: 'Access help articles or contact drTalk support.' },
  ];

  return (
    <MainLayout title="Practice">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter text-black italic">
            {isDentist ? 'Dentist Practice' : 'Specialist Practice'}
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            {isDentist ? 'Practice management and referral preferences' : 'Practice management, team access, and referral operations'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sections.map((section) => (
            <div key={section.label} className="wireframe-card p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 cursor-pointer transition-all group">
              <div className="flex items-center gap-4 sm:gap-6 w-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-black flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-all">
                  <section.icon size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold uppercase text-xs sm:text-sm tracking-tight truncate">{section.label}</h3>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase leading-relaxed">{section.desc}</p>
                </div>
              </div>
              <div className="sm:opacity-0 group-hover:opacity-100 transition-opacity w-full sm:w-auto text-right">
                <p className="text-[10px] font-bold uppercase underline">Configure</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t-2 border-black border-dashed flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[8px] font-bold uppercase text-muted-foreground italic">Platform Version: Prototype 1.0.4-BW</p>
          <button className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-2 w-full sm:w-auto">
            Save All Changes
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
