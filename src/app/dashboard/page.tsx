"use client";

import React from 'react';
import { MainLayout } from "@/components/MainLayout";
import {
  AlertCircle, MessageSquare, ArrowUpRight,
  TrendingUp, Users, FileText, Send
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useVerification } from '@/components/VerificationContext';
import { useSubscription } from '@/components/SubscriptionContext';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';

export default function DashboardPage() {
  const router = useRouter();
  const { isVerified, reset: resetVerification, setShowVerification } = useVerification();
  const { endTrial, resetSubscription } = useSubscription();

  const handleReferralClick = (id: string) => {
    if (!isVerified) {
      setShowVerification(true);
    } else {
      router.push(`/referrals/${id}`);
    }
  };

  return (
    <MainLayout title="Practice Dashboard">
      <div className="max-w-6xl mx-auto space-y-8 pb-20">

        {/* Status Banners */}
        <div className="space-y-4">
          
          {/* Verification Alert */}
          {!isVerified && (
            <div className="wireframe-card border-black bg-gray-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center shrink-0 bg-white">
                  <AlertCircle className="text-black" size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black uppercase text-sm tracking-tight leading-none text-black">Verification Required</h3>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed max-w-xl">
                    Practice owner verification is required to process referrals and access PHI.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVerification(true)}
                className="wireframe-button bg-black text-white text-[10px] uppercase px-8 py-3 whitespace-nowrap"
              >
                Verify Identity Now
              </button>
            </div>
          )}
        </div>

        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter italic">Dashboard</h2>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              Receive referrals, process cases, coordinate with dentists, and manage patient communication.
            </p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button
              onClick={() => router.push('/referrals')}
              className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-3 flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              Open Intake Queue <Send size={14} />
            </button>
          </div>
        </div>


        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Acceptance Rate', value: '82%', trend: '+4%', icon: TrendingUp },
            { label: 'Referrals', value: '18', trend: '+2', icon: FileText },
            { label: 'Dentist Partners', value: '12', trend: '+1', icon: Users },
            { label: 'Patient Messages', value: '05', trend: '-2', icon: MessageSquare },
          ].map((stat) => (
            <div key={stat.label} className="wireframe-card p-5 space-y-2 bg-white">
              <div className="flex justify-between items-start">
                <p className="text-[9px] font-black uppercase text-muted-foreground">{stat.label}</p>
                <stat.icon size={16} className="text-muted-foreground" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tighter">{stat.value}</span>
                <span className="text-[9px] font-bold text-black uppercase">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Action Area */}
          <div className="lg:col-span-8 space-y-8">

            {/* Requires Attention Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                <AlertCircle size={18} />
                <h3 className="font-bold uppercase text-xs tracking-widest">Requires Attention (3)</h3>
              </div>

              <div className="space-y-3">
                {[
                  { id: '2', patient: 'Bob Marley', reason: 'Low Confidence (45%)', type: 'Extraction' },
                  { id: '5', patient: 'Eve Online', reason: 'Low Confidence (30%)', type: 'Periodontal' },
                  { id: '1', patient: 'Charlie Brown', reason: 'Missing Attachment', type: 'Endodontic' },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleReferralClick(item.id)}
                    className="wireframe-card p-4 flex items-center justify-between bg-white hover:bg-black hover:text-white cursor-pointer group transition-all"
                  >
                    <div className="space-y-1">
                      <p className="font-bold uppercase text-xs">{item.patient}</p>
                      <p className="text-[10px] uppercase font-bold opacity-70 group-hover:opacity-100">{item.reason}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[8px] uppercase font-bold text-muted-foreground group-hover:text-white opacity-70">{item.type}</span>
                      <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push('/referrals')}
                className="text-[10px] font-black uppercase underline"
              >
                View all Referrals
              </button>
            </div>


            {/* Recent Messages */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                <MessageSquare size={18} />
                <h3 className="font-bold uppercase text-xs tracking-widest">Recent Dentist & Patient Messages</h3>
              </div>
              <div className="wireframe-card p-0 divide-y-2 divide-black bg-white overflow-hidden">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 flex gap-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => router.push('/channels')}>
                    <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-white font-bold text-xs">JD</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-baseline">
                        <p className="text-[10px] font-bold uppercase">{i === 1 ? 'Dr. Smith (Dentist)' : 'Alice Cooper (Patient)'}</p>
                        <span className="text-[8px] text-muted-foreground uppercase">15m ago</span>
                      </div>
                      <p className="text-[10px] uppercase truncate opacity-70 italic">
                        {i === 1 ? 'Regarding Alice Cooper: please confirm pano image received.' : 'Patient asked about appointment preparation via SMS.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions / Side Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="mt-1.5">
              <SubscriptionBanner />
            </div>
            <div className="space-y-4">
              <h3 className="font-bold uppercase text-xs tracking-widest border-b-2 border-black pb-2">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <ActionCard 
                  label="Invite Dentist" 
                  desc="Grow your referral network" 
                  onClick={() => router.push('/dashboard/invite')}
                />
                <ActionCard 
                  label="TEAM, ROLES & ACCESS CONTROL" 
                  desc="Manage team permissions and patient communication safeguards." 
                  onClick={() => router.push('/dashboard/settings/team')}
                />
                <ActionCard 
                  label="Learning Resource" 
                  desc="Create a public or paid education channel" 
                />
              </div>
            </div>
          </div>

        </div>

        {/* Debug Controls */}
        <div className="pt-12 border-t-2 border-black border-dashed flex flex-wrap gap-4 opacity-30 hover:opacity-100 transition-opacity">
          <button 
            onClick={resetVerification}
            className="text-[9px] font-black uppercase px-3 py-1.5 border-2 border-black hover:bg-black hover:text-white transition-all"
          >
            Debug: Reset Verification
          </button>
          <button 
            onClick={endTrial}
            className="text-[9px] font-black uppercase px-3 py-1.5 border-2 border-black hover:bg-black hover:text-white transition-all"
          >
            Debug: End Trial
          </button>
          <button 
            onClick={resetSubscription}
            className="text-[9px] font-black uppercase px-3 py-1.5 border-2 border-black hover:bg-black hover:text-white transition-all"
          >
            Debug: Reset Subscription
          </button>
        </div>

      </div>
    </MainLayout>
  );
}

function ActionCard({ label, desc, onClick }: { label: string, desc: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="wireframe-card p-4 bg-white hover:bg-black hover:text-white cursor-pointer transition-all group"
    >
      <h4 className="font-bold uppercase text-[10px] tracking-tight">{label}</h4>
      <p className="text-[8px] uppercase opacity-70 group-hover:opacity-100">{desc}</p>
    </div>
  );
}
