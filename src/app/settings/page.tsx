"use client";

import React from 'react';
import { MainLayout } from "@/components/MainLayout";
import { User, Bell, Shield, CreditCard, HelpCircle } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    { icon: User, label: 'Profile Settings', desc: 'Manage your personal information and credentials.' },
    { icon: Bell, label: 'Notifications', desc: 'Configure how you receive referral updates.' },
    { icon: Shield, label: 'Privacy & Security', desc: 'Manage HIPAA compliance and access logs.' },
    { icon: CreditCard, label: 'Billing & Plan', desc: 'View invoices and manage your subscription.' },
    { icon: HelpCircle, label: 'Support & Docs', desc: 'Access help articles or contact drTalk support.' },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold uppercase tracking-tighter text-black">Settings</h2>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Workspace & Personal Preferences</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sections.map((section) => (
            <div key={section.label} className="wireframe-card p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <section.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold uppercase text-sm tracking-tight">{section.label}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase">{section.desc}</p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] font-bold uppercase underline">Configure</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t-2 border-black border-dashed flex justify-between items-center">
          <p className="text-[8px] font-bold uppercase text-muted-foreground italic">Platform Version: Prototype 1.0.4-BW</p>
          <button className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-2">
            Save All Changes
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
