"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { ArrowUpRight, Clock, GraduationCap, MessageSquare, Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

type SentReferralStatus = 'Draft' | 'Sent' | 'Accepted' | 'Scheduled' | 'Completed';

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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Dentist Workspace</p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">Sent Referrals</h2>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">
              Track specialist response, patient scheduling, and referral conversations.
            </p>
          </div>
          <button
            onClick={() => router.push('/dentist/referral')}
            className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-3 flex items-center justify-center gap-2"
          >
            New Referral <Plus size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Sent This Week', value: '09' },
            { label: 'Awaiting Review', value: '02' },
            { label: 'Accepted', value: '05' },
            { label: 'Specialist Messages', value: '03' },
          ].map((stat) => (
            <div key={stat.label} className="wireframe-card p-4 space-y-1">
              <p className="text-[9px] font-bold uppercase text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-3">
              <h3 className="font-black uppercase text-xs tracking-widest">Referral Status Tracker</h3>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="SEARCH SENT REFERRALS..."
                  className="wireframe-input pl-10 py-2 text-[10px] w-full sm:w-72"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredReferrals.map((referral) => (
                <div key={referral.id} className="wireframe-card p-4 hover:bg-gray-50 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4">
                      <p className="text-xs font-black uppercase">{referral.patientName}</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">{referral.type}</p>
                    </div>
                    <div className="md:col-span-3">
                      <p className="text-[10px] uppercase font-black">{referral.specialist}</p>
                      <p className="text-[8px] uppercase text-muted-foreground font-bold">{referral.id}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="inline-block border border-black px-2 py-1 text-[8px] uppercase font-black">
                        {referral.status}
                      </span>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-2 text-muted-foreground">
                      <Clock size={12} />
                      <span className="text-[9px] uppercase font-bold">{referral.lastUpdate}</span>
                    </div>
                    <button
                      onClick={() => router.push('/dentist/messages')}
                      className="md:col-span-1 justify-self-start md:justify-self-end p-2 border-2 border-transparent hover:border-black hover:bg-black hover:text-white transition-all"
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                  <p className="mt-4 pt-3 border-t border-black border-dashed text-[9px] uppercase font-bold text-muted-foreground">
                    Next: {referral.nextStep}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <aside className="lg:col-span-4 space-y-4">
            <div className="wireframe-card p-5 space-y-4 bg-white">
              <div className="flex items-center gap-2 border-b border-black border-dashed pb-3">
                <MessageSquare size={16} />
                <h3 className="text-xs uppercase font-black">Specialist Conversations</h3>
              </div>
              {[
                'Valley Endodontics accepted Alice Cooper referral.',
                'Downtown Oral Surgery requested a pano image for Marco Reyes.',
              ].map((message) => (
                <button
                  key={message}
                  onClick={() => router.push('/dentist/messages')}
                  className="block w-full text-left border border-black p-3 text-[9px] uppercase font-bold hover:bg-black hover:text-white transition-all"
                >
                  {message}
                </button>
              ))}
            </div>

            <div className="wireframe-card p-5 space-y-4 bg-gray-50">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} />
                <h3 className="text-xs uppercase font-black">Learning Hub</h3>
              </div>
              <p className="text-[9px] uppercase font-bold text-muted-foreground leading-relaxed">
                Browse public resources or create a resource for the drTalk community.
              </p>
              <button
                onClick={() => router.push('/dentist/academy')}
                className="wireframe-button w-full bg-black text-white text-[10px] uppercase py-3"
              >
                Open Learning Hub
              </button>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
