"use client";

import React, { useState } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { Search, Filter, AlertCircle, Clock, MoreVertical } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

type ReferralStatus = 'Pending' | 'Accepted' | 'Scheduled' | 'In Progress' | 'Completed' | 'Archived';

interface Referral {
  id: string;
  patientName: string;
  type: string;
  source: 'Email' | 'Fax' | 'Web' | 'App';
  confidence: number;
  status: ReferralStatus;
  receivedAt: string;
  dentist: string;
  specialist: string;
}

const mockReferrals: Referral[] = [
  { id: '1', patientName: 'Alice Cooper', type: 'Endodontic Consultation', source: 'Email', confidence: 55, status: 'Pending', receivedAt: '2h ago', dentist: 'Dr. Smith', specialist: 'Valley Endodontics' },
  { id: '2', patientName: 'Bob Marley', type: 'Dental Implant', source: 'Fax', confidence: 45, status: 'Pending', receivedAt: '4h ago', dentist: 'Dr. Jones', specialist: 'Downtown Oral Surgery' },
  { id: '3', patientName: 'Charlie Brown', type: 'Emergency Extraction', source: 'App', confidence: 100, status: 'Accepted', receivedAt: '1d ago', dentist: 'Dr. Miller', specialist: 'Metro Orthodontics' },
  { id: '4', patientName: 'David Bowie', type: 'Invisalign Eval', source: 'Web', confidence: 88, status: 'Completed', receivedAt: '2d ago', dentist: 'Dr. White', specialist: 'Arizona Periodontics' },
  { id: '5', patientName: 'Eve Online', type: 'Periodontal Surgery', source: 'Email', confidence: 30, status: 'Scheduled', receivedAt: '1h ago', dentist: 'Dr. Black', specialist: 'Valley Endodontics' },
];

export default function ReferralsPage() {
  const pathname = usePathname();
  const isDentist = pathname.startsWith('/dentist');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ReferralStatus>('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: ReferralStatus[] = ['Pending', 'Accepted', 'Scheduled', 'In Progress', 'Completed', 'Archived'];

  const filteredReferrals = mockReferrals.filter(r => 
    r.status === activeTab && 
    (r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
     r.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-black';
    if (score >= 60) return 'text-gray-500';
    return 'text-red-600 font-black italic';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 90) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low Confidence';
  };

  return (
    <MainLayout title="Referrals">
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter italic">Referrals</h2>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              {isDentist 
                ? 'Track specialist progress and coordinate patient care'
                : 'Specialist intake pipeline and case processing workflow'}
            </p>
          </div>
          <button 
            onClick={() => router.push(isDentist ? '/dentist/referral' : '#')}
            className="wireframe-button bg-black text-white text-[10px] uppercase px-8 py-3 w-full sm:w-auto"
          >
            {isDentist ? 'New Referral' : 'Configure Referral Link'}
          </button>
        </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: isDentist ? 'Sent (24h)' : 'Pending (24h)', value: '12', trend: '+2' },
              { label: 'Accepted', value: '08', trend: '0' },
              { label: 'Scheduled', value: '45', trend: '+5' },
              { label: 'Total Pipeline', value: '65', trend: '+12' },
            ].map((stat) => (
              <div key={stat.label} className="wireframe-card p-4 space-y-1">
                <p className="text-[9px] font-bold uppercase text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tighter">{stat.value}</span>
                  <span className="text-[9px] font-bold uppercase text-gray-400">{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Referral Pipeline */}
          <div className="space-y-6">
            {/* Tabs Row */}
            <div className="border-b-2 border-black">
              <div className="flex overflow-x-auto no-scrollbar -mb-[2px]">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 sm:px-8 py-4 text-[11px] font-bold uppercase transition-all relative whitespace-nowrap ${
                      activeTab === tab 
                        ? 'text-black' 
                        : 'text-muted-foreground hover:text-black'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Filter Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-xl">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="SEARCH REFERRALS..." 
                  className="wireframe-input pl-10 py-2.5 text-[11px] w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="wireframe-button flex items-center justify-center gap-2 px-6 py-2.5 text-[11px] uppercase font-bold">
                <Filter size={14} />
                Filters
              </button>
            </div>

            {/* List Headers */}
            <div className={`hidden md:grid grid-cols-12 px-4 py-2 text-[9px] font-bold uppercase text-muted-foreground tracking-widest border-b border-black mt-4`}>
              <div className={isDentist ? "col-span-4" : "col-span-3"}>Patient / Case Type</div>
              <div className="col-span-2">Source / ID</div>
              <div className={isDentist ? "col-span-3" : "col-span-2"}>{isDentist ? 'Specialist Practice' : 'Referring Dentist'}</div>
              {!isDentist && <div className="col-span-2">AI Confidence</div>}
              <div className="col-span-2">{isDentist ? 'Last Update' : 'Received'}</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Referral List */}
            <div className="space-y-2">
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((referral) => (
                  <div 
                    key={referral.id} 
                    onClick={() => router.push(isDentist ? '/dentist/channels' : `/referrals/${referral.id}`)}
                    className="wireframe-card p-4 hover:bg-gray-50 cursor-pointer transition-all group"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                      <div className={isDentist ? "col-span-4" : "col-span-3"}>
                        <p className="font-bold uppercase text-xs">{referral.patientName}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{referral.type}</p>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border border-black flex items-center justify-center">
                            <span className="text-[8px] font-bold">{referral.source[0]}</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase">{referral.source}</span>
                        </div>
                        <p className="text-[8px] text-muted-foreground mt-1 uppercase tracking-tighter">REF-{referral.id}000X</p>
                      </div>
                      <div className={isDentist ? "col-span-3" : "col-span-2"}>
                        <p className="text-[10px] font-bold uppercase">{isDentist ? referral.specialist : referral.dentist}</p>
                        <p className="text-[8px] text-muted-foreground uppercase">{isDentist ? 'Specialist' : 'General Dentist'}</p>
                      </div>
                      {!isDentist && (
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <div className={`text-[10px] uppercase font-bold ${getConfidenceColor(referral.confidence)}`}>
                              {getConfidenceLabel(referral.confidence)} ({referral.confidence}%)
                            </div>
                            {referral.confidence < 60 && (
                              <AlertCircle size={12} className="text-red-600" />
                            )}
                          </div>
                        </div>
                      )}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock size={12} />
                          <span className="text-[10px] font-bold uppercase">{referral.receivedAt}</span>
                        </div>
                      </div>
                      <div className="col-span-1 text-right">
                        <button className="p-1 hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 border-2 border-black border-dashed text-center">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">No referrals found in this category.</p>
                </div>
              )}
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
