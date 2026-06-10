"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout } from "@/components/MainLayout";
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { 
  Search, Filter, MapPin, 
  UserPlus, ExternalLink, ShieldCheck, 
  Building2, MessageCircle,
  ArrowUpRight, CheckCircle2, TrendingUp, Users, ChevronDown
} from 'lucide-react';
import { InviteModal } from '@/components/InviteModal';
import { ReferralModal } from '@/components/ReferralModal';

interface NetworkPractice {
  id: string;
  name: string;
  type: string;
  specialty: string;
  location: string;
  status: 'Connected' | 'Nearby' | 'Suggested';
  verified: boolean;
}

const mockNetwork: NetworkPractice[] = [
  { id: '1', name: 'Valley Endodontics', type: 'Specialist', specialty: 'Endodontics', location: 'Phoenix, AZ', status: 'Connected', verified: true },
  { id: '2', name: 'Downtown Oral Surgery', type: 'Specialist', specialty: 'Oral Surgery', location: 'Phoenix, AZ', status: 'Connected', verified: true },
  { id: '3', name: 'Arizona Periodontics', type: 'Specialist', specialty: 'Periodontics', location: 'Scottsdale, AZ', status: 'Nearby', verified: true },
  { id: '4', name: 'Desert Dental Implants', type: 'Specialist', specialty: 'Implantology', location: 'Tempe, AZ', status: 'Suggested', verified: false },
  { id: '5', name: 'Skyline Orthodontics', type: 'Specialist', specialty: 'Orthodontics', location: 'Phoenix, AZ', status: 'Nearby', verified: true },
  { id: '9', name: 'Phoenix Children\'s Dentistry', type: 'Specialist', specialty: 'Pediatric Dentistry', location: 'Phoenix, AZ', status: 'Suggested', verified: true },
];

const mockAnalytics = {
  'month': {
    totalSent: 142,
    totalScheduled: 115,
    totalReleased: 98,
    conversionRate: 81,
    breakdown: [
      { id: '1', name: 'Valley Endodontics', sent: 45, scheduled: 38, released: 32, conversion: 84 },
      { id: '2', name: 'Downtown Oral Surgery', sent: 62, scheduled: 52, released: 45, conversion: 83 },
      { id: '3', name: 'Arizona Periodontics', sent: 35, scheduled: 25, released: 21, conversion: 71 }
    ]
  },
  'quarter': {
    totalSent: 450,
    totalScheduled: 375,
    totalReleased: 310,
    conversionRate: 83,
    breakdown: [
      { id: '1', name: 'Valley Endodontics', sent: 140, scheduled: 120, released: 95, conversion: 85 },
      { id: '2', name: 'Downtown Oral Surgery', sent: 210, scheduled: 175, released: 145, conversion: 83 },
      { id: '3', name: 'Arizona Periodontics', sent: 100, scheduled: 80, released: 70, conversion: 80 }
    ]
  },
  'year': {
    totalSent: 840,
    totalScheduled: 710,
    totalReleased: 580,
    conversionRate: 85,
    breakdown: [
      { id: '1', name: 'Valley Endodontics', sent: 260, scheduled: 235, released: 190, conversion: 90 },
      { id: '2', name: 'Downtown Oral Surgery', sent: 410, scheduled: 340, released: 280, conversion: 83 },
      { id: '3', name: 'Arizona Periodontics', sent: 170, scheduled: 135, released: 110, conversion: 79 }
    ]
  },
  'last_year': {
    totalSent: 1650,
    totalScheduled: 1420,
    totalReleased: 1210,
    conversionRate: 86,
    breakdown: [
      { id: '1', name: 'Valley Endodontics', sent: 520, scheduled: 480, released: 410, conversion: 92 },
      { id: '2', name: 'Downtown Oral Surgery', sent: 780, scheduled: 650, released: 550, conversion: 83 },
      { id: '3', name: 'Arizona Periodontics', sent: 350, scheduled: 290, released: 250, conversion: 82 }
    ]
  }
};

function NetworkAnalytics() {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year' | 'last_year'>('month');
  const data = mockAnalytics[timeRange];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <h3 className="text-xl font-black uppercase italic tracking-tighter">Network Performance</h3>
        <div className="relative">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="wireframe-input py-2 pl-4 pr-10 text-[10px] font-black uppercase appearance-none bg-white cursor-pointer hover:bg-gray-50 focus:outline-none"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="last_year">Last Year</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown size={14} className="text-black" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="wireframe-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Total Referrals Sent</span>
            <ArrowUpRight size={16} className="text-black" />
          </div>
          <div className="text-4xl font-black">{data.totalSent}</div>
        </div>
        
        <div className="wireframe-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Scheduled</span>
            <CheckCircle2 size={16} className="text-black" />
          </div>
          <div className="text-4xl font-black">{data.totalScheduled}</div>
        </div>

        <div className="wireframe-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Conversion Rate</span>
            <TrendingUp size={16} className="text-black" />
          </div>
          <div className="text-4xl font-black">{data.conversionRate}%</div>
        </div>

        <div className="wireframe-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Released</span>
            <Users size={16} className="text-black" />
          </div>
          <div className="text-4xl font-black">{data.totalReleased}</div>
        </div>
      </div>

      <div className="wireframe-card overflow-hidden">
        <div className="p-4 border-b-2 border-black bg-gray-50 flex items-center justify-between">
          <h4 className="font-bold uppercase text-sm">Specialist Breakdown</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-black text-[10px] uppercase bg-white">
                <th className="p-4 font-black">Practice Name</th>
                <th className="p-4 font-black text-right">Sent</th>
                <th className="p-4 font-black text-right">Scheduled</th>
                <th className="p-4 font-black">Conversion</th>
                <th className="p-4 font-black text-right">Released</th>
              </tr>
            </thead>
            <tbody>
              {data.breakdown.map((row, idx) => (
                <tr key={row.id} className={`text-sm ${idx !== data.breakdown.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-gray-50 transition-colors bg-white`}>
                  <td className="p-4 font-bold">{row.name}</td>
                  <td className="p-4 text-right font-medium">{row.sent}</td>
                  <td className="p-4 text-right font-medium">{row.scheduled}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-none border border-black overflow-hidden flex-1 max-w-[120px]">
                        <div className="h-full bg-black" style={{ width: `${row.conversion}%` }} />
                      </div>
                      <span className="text-[10px] font-bold">{row.conversion}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium">{row.released}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DentistNetworkPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'connected' | 'directory'>('analytics');
  const [directoryFilter, setDirectoryFilter] = useState<'all' | 'nearby'>('nearby');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [selectedPracticeForReferral, setSelectedPracticeForReferral] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'directory' || tabParam === 'connected' || tabParam === 'analytics') {
        const timer = setTimeout(() => {
          setActiveTab(tabParam as any);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const filteredNetwork = mockNetwork.filter(p => {
    if (p.type !== 'Specialist') return false;
    if (activeTab === 'connected' && p.status !== 'Connected') return false;
    if (activeTab === 'directory') {
      if (p.status === 'Connected') return false;
      if (directoryFilter === 'nearby' && p.status !== 'Nearby') return false;
    }
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.specialty.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <MainLayout title="Specialist Network">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">Specialist Network</h2>
                <CommentMarker id="dentist-network" title="Specialist Network" description="Find and connect with clinical specialists." />
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Discover trusted specialists to refer your patients to</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="SEARCH SPECIALISTS..." 
                  className="wireframe-input pl-10 py-2.5 text-[10px] w-full md:w-64 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="wireframe-button px-4 py-2.5 sm:py-0 flex items-center justify-center">
                <Filter size={16} />
              </button>
            </div>
          </div>

          {/* Network Content */}
          <div className="space-y-6">
            {/* Tabs Row */}
            <div className="border-b-2 border-black">
              <div className="flex overflow-x-auto no-scrollbar -mb-[2px]">
                {['analytics', 'connected', 'directory'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 sm:px-8 py-4 text-[11px] font-bold uppercase transition-all relative whitespace-nowrap ${
                      activeTab === tab 
                        ? 'bg-black text-white' 
                        : 'text-muted-foreground hover:text-black hover:bg-zinc-50'
                    }`}
                  >
                    {tab === 'analytics' ? 'Analytics' : tab === 'connected' ? 'My Network' : 'Connect&Grow'}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'analytics' ? (
              <NetworkAnalytics />
            ) : (
              <div className="space-y-6">
                {activeTab === 'directory' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setDirectoryFilter('all')}
                      className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-wider border-2 border-black transition-all ${
                        directoryFilter === 'all' 
                          ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                          : 'bg-white text-black hover:bg-gray-50'
                      }`}
                    >
                      All Specialists
                    </button>
                    <button 
                      onClick={() => setDirectoryFilter('nearby')}
                      className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-wider border-2 border-black transition-all ${
                        directoryFilter === 'nearby' 
                          ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                          : 'bg-white text-black hover:bg-gray-50'
                      }`}
                    >
                      Nearby
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNetwork.map((practice) => (
                    <div 
                      key={practice.id} 
                      className="wireframe-card group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all overflow-hidden flex flex-col h-full"
                    >
                      <div className="p-6 space-y-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-gray-50 group-hover:bg-black group-hover:text-white transition-all">
                            <Building2 size={24} />
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 border border-black ${
                              practice.status === 'Connected' ? 'bg-black text-white' : 'bg-transparent text-black'
                            }`}>
                              {practice.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black uppercase text-sm tracking-tight">{practice.name}</h3>
                            {practice.verified && <ShieldCheck size={14} className="text-black" />}
                          </div>
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">{practice.specialty} — {practice.type}</p>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin size={12} />
                          <span className="text-[9px] font-bold uppercase">{practice.location}</span>
                        </div>
                      </div>

                      <div className="p-4 border-t-2 border-black flex gap-2 bg-gray-50/50">
                        {practice.status === 'Connected' ? (
                          <>
                            <button 
                              onClick={() => {
                                setSelectedPracticeForReferral(practice.name);
                                setIsReferralModalOpen(true);
                              }}
                              className="flex-1 wireframe-button bg-black text-white text-[9px] uppercase py-2 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all font-black"
                            >
                              Send Referral
                            </button>
                            <Link 
                              href={`/dentist/channels?practice=${encodeURIComponent(practice.name)}`}
                              className="flex-1 wireframe-button bg-white text-black text-[9px] uppercase py-2 flex items-center justify-center gap-2 hover:bg-zinc-50 border-2 border-black transition-all font-black"
                            >
                              <MessageCircle size={14} />
                              Chat Now
                            </Link>
                          </>
                        ) : (
                          <button 
                            onClick={() => {
                              if (activeTab === 'directory') {
                                showToast(`Connection request sent to ${practice.name}`);
                              } else {
                                setSelectedPracticeForReferral(practice.name);
                                setIsReferralModalOpen(true);
                              }
                            }}
                            className="flex-1 wireframe-button bg-black text-white text-[9px] uppercase py-2 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all font-black"
                          >
                            {activeTab === 'directory' ? 'Connect' : 'Refer & Connect'}
                          </button>
                        )}
                        <button className="wireframe-button p-2 hover:bg-black hover:text-white transition-all flex items-center justify-center text-black">
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Invite Placeholder */}
                  {activeTab === 'connected' && (
                    <div className="wireframe-card border-dashed bg-gray-50/30 flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full border-2 border-black border-dashed flex items-center justify-center">
                        <UserPlus size={24} className="text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold uppercase text-xs tracking-tight">Invite a Specialist</h4>
                        <p className="text-[8px] uppercase text-muted-foreground leading-relaxed">
                          Is your favorite specialist not on drTalk yet? Invite them to join your network.
                        </p>
                      </div>
                      <button 
                        onClick={() => setIsInviteModalOpen(true)}
                        className="text-[10px] font-black uppercase underline hover:text-black"
                      >
                        Send Invitation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-black text-white border-2 border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-300">
          <p className="text-[10px] font-black uppercase tracking-tight">{toastMessage}</p>
        </div>
      )}

      <InviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        defaultRole="Specialist"
        onSuccess={(email) => {
          showToast(`Invitation sent to ${email}`);
        }}
      />

      <ReferralModal 
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
        practiceName={selectedPracticeForReferral}
        onSuccess={(patientName) => {
          showToast(`Referral for ${patientName} submitted successfully!`);
        }}
      />
    </MainLayout>
  );
}
