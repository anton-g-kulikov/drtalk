"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, MessageSquare, ArrowUpRight, 
  TrendingUp, Users, FileText, Send, Search, Clock, Plus, GraduationCap
} from 'lucide-react';

type SentReferralStatus = 'Draft' | 'Sent' | 'Accepted' | 'Scheduled' | 'In Progress' | 'Completed';

interface SentReferral {
  id: string;
  patientName: string;
  specialist: string;
  type: string;
  status: SentReferralStatus;
  lastUpdate: string;
  nextStep: string;
}

const sentReferrals: SentReferral[] = [
  {
    id: 'D-1001',
    patientName: 'Alice Cooper',
    specialist: 'Valley Endodontics',
    type: 'Endodontic Consultation',
    status: 'Accepted',
    lastUpdate: '15m ago',
    nextStep: 'Specialist scheduling patient',
  },
  {
    id: 'D-1002',
    patientName: 'Marco Reyes',
    specialist: 'Downtown Oral Surgery',
    type: 'Extraction Evaluation',
    status: 'Sent',
    lastUpdate: '2h ago',
    nextStep: 'Waiting for specialist review',
  },
  {
    id: 'D-1003',
    patientName: 'Nina Patel',
    specialist: 'Arizona Periodontics',
    type: 'Periodontal Surgery',
    status: 'Scheduled',
    lastUpdate: '1d ago',
    nextStep: 'Appointment confirmed for Tuesday',
  },
  {
    id: 'D-1004',
    patientName: 'John Doe',
    specialist: 'Metro Orthodontics',
    type: 'Braces Consultation',
    status: 'Completed',
    lastUpdate: '3d ago',
    nextStep: 'Case closed. Outcome report received.',
  },
];

export default function DentistDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredReferrals = sentReferrals.filter((referral) =>
    referral.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    referral.specialist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    referral.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout title="Dentist Dashboard">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">Dentist Practice Dashboard</h2>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              Refer patients, track specialist progress, and coordinate care across your network.
            </p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button 
              onClick={() => router.push('/dentist/referral')}
              className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-3 flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              New Referral <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Referrals', value: '09', trend: '+2', icon: FileText },
            { label: 'Awaiting Review', value: '02', trend: '-1', icon: Clock },
            { label: 'Accepted Cases', value: '05', trend: '+1', icon: TrendingUp },
            { label: 'Specialist Messages', value: '03', trend: '+3', icon: MessageSquare },
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
                <AlertCircle size={18} className="text-red-600" />
                <h3 className="font-bold uppercase text-xs tracking-widest">Requires Attention (2)</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: '1005', patient: 'Sarah Jenkins', reason: 'Unfinished Draft', type: 'Endodontic' },
                  { id: '1002', patient: 'Marco Reyes', reason: 'Missing Pano Image', type: 'Extraction' },
                ].map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => router.push(item.reason === 'Unfinished Draft' ? '/dentist/referral' : '/dentist/channels')}
                    className="wireframe-card p-4 flex items-center justify-between bg-white hover:bg-red-50 cursor-pointer border-red-600 group transition-all"
                  >
                    <div className="space-y-1">
                      <p className="font-bold uppercase text-xs">{item.patient}</p>
                      <p className="text-[10px] uppercase text-red-600 font-bold">{item.reason}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[8px] uppercase font-bold text-muted-foreground">{item.type}</span>
                      <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral Status Tracker */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-2">
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  <h3 className="font-bold uppercase text-xs tracking-widest">Recent Referrals</h3>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="SEARCH REFERRALS..."
                    className="wireframe-input pl-10 py-1.5 text-[9px] w-full sm:w-64"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredReferrals.map((referral) => (
                  <div key={referral.id} className="wireframe-card p-4 hover:bg-gray-50 transition-all cursor-pointer" onClick={() => router.push('/dentist/channels')}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-4">
                        <p className="text-xs font-black uppercase">{referral.patientName}</p>
                        <p className="text-[9px] uppercase font-bold text-muted-foreground">{referral.type}</p>
                      </div>
                      <div className="md:col-span-4">
                        <p className="text-[10px] uppercase font-black">{referral.specialist}</p>
                        <p className="text-[8px] uppercase text-muted-foreground font-bold">{referral.id}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="inline-block border border-black px-2 py-1 text-[8px] uppercase font-black">
                          {referral.status}
                        </span>
                      </div>
                      <div className="md:col-span-2 flex items-center justify-end gap-2 text-muted-foreground">
                        <span className="text-[9px] uppercase font-bold">{referral.lastUpdate}</span>
                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => router.push('/dentist/referrals')}
                className="text-[10px] font-black uppercase underline"
              >
                View all Referrals
              </button>
            </div>
          </div>

          {/* Side Column */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="font-bold uppercase text-xs tracking-widest border-b-2 border-black pb-2">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <ActionCard 
                  label="New Referral" 
                  desc="Initiate a patient transfer" 
                  onClick={() => router.push('/dentist/referral')}
                />
                <ActionCard 
                  label="Find Specialist" 
                  desc="Browse the drTalk network" 
                  onClick={() => router.push('/dentist/referrals')}
                />
                <ActionCard 
                  label="Practice Setup" 
                  desc="Manage your dentist profile" 
                  onClick={() => router.push('/dentist/settings')}
                />
              </div>
            </div>

            {/* Specialist Conversations */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                <MessageSquare size={18} />
                <h3 className="font-bold uppercase text-xs tracking-widest">Specialist Conversations</h3>
              </div>
              <div className="wireframe-card p-0 divide-y-2 divide-black bg-white overflow-hidden">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 flex gap-3 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => router.push('/dentist/channels')}>
                    <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-white font-bold text-[10px] shrink-0">VE</div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="text-[9px] font-bold uppercase truncate">{i === 1 ? 'Valley Endodontics' : 'Downtown Oral Surgery'}</p>
                        <span className="text-[7px] text-muted-foreground uppercase shrink-0">15m ago</span>
                      </div>
                      <p className="text-[9px] uppercase truncate opacity-70 italic">
                        {i === 1 ? 'Regarding Alice Cooper: pano received.' : 'Requesting pano image for Marco Reyes.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Hub */}
            <div className="wireframe-card p-5 space-y-4 bg-gray-50">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} />
                <h3 className="text-xs uppercase font-black">Learning Hub</h3>
              </div>
              <p className="text-[9px] uppercase font-bold text-muted-foreground leading-relaxed">
                Browse clinical guides and practice growth resources.
              </p>
              <button
                onClick={() => router.push('/dentist/academy')}
                className="wireframe-button w-full bg-black text-white text-[10px] uppercase py-3"
              >
                Open Learning Hub
              </button>
            </div>
          </div>

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
