"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout } from "@/components/MainLayout";
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { 
  Search, Filter, MapPin, 
  UserPlus, ExternalLink, ShieldCheck, 
  Building2, MessageCircle,
  ArrowUpRight, CheckCircle2, TrendingUp, Users, ChevronDown,
  Download, Printer
} from 'lucide-react';
import { InviteModal } from '@/components/InviteModal';
import { getNetwork, NetworkPractice } from '@/lib/referrals';

const mockAnalytics = {
  'day': {
    totalReceived: 8,
    totalScheduled: 5,
    totalReleased: 4,
    conversionRate: 62,
    breakdown: [
      { id: '6', name: 'Sunshine Dental', received: 3, scheduled: 2, released: 1, conversion: 66 },
      { id: '7', name: 'Desert Bloom Dental', received: 4, scheduled: 2, released: 2, conversion: 50 },
      { id: '8', name: 'Mountain View Family Dental', received: 1, scheduled: 1, released: 1, conversion: 100 }
    ]
  },
  'week': {
    totalReceived: 38,
    totalScheduled: 28,
    totalReleased: 22,
    conversionRate: 73,
    breakdown: [
      { id: '6', name: 'Sunshine Dental', received: 12, scheduled: 9, released: 7, conversion: 75 },
      { id: '7', name: 'Desert Bloom Dental', received: 18, scheduled: 13, released: 11, conversion: 72 },
      { id: '8', name: 'Mountain View Family Dental', received: 8, scheduled: 6, released: 4, conversion: 75 }
    ]
  },
  'month': {
    totalReceived: 142,
    totalScheduled: 115,
    totalReleased: 98,
    conversionRate: 81,
    breakdown: [
      { id: '6', name: 'Sunshine Dental', received: 45, scheduled: 38, released: 32, conversion: 84 },
      { id: '7', name: 'Desert Bloom Dental', received: 62, scheduled: 52, released: 45, conversion: 83 },
      { id: '8', name: 'Mountain View Family Dental', received: 35, scheduled: 25, released: 21, conversion: 71 }
    ]
  },
  'quarter': {
    totalReceived: 450,
    totalScheduled: 375,
    totalReleased: 310,
    conversionRate: 83,
    breakdown: [
      { id: '6', name: 'Sunshine Dental', received: 140, scheduled: 120, released: 95, conversion: 85 },
      { id: '7', name: 'Desert Bloom Dental', received: 210, scheduled: 175, released: 145, conversion: 83 },
      { id: '8', name: 'Mountain View Family Dental', received: 100, scheduled: 80, released: 70, conversion: 80 }
    ]
  },
  'year': {
    totalReceived: 840,
    totalScheduled: 710,
    totalReleased: 580,
    conversionRate: 85,
    breakdown: [
      { id: '6', name: 'Sunshine Dental', received: 260, scheduled: 235, released: 190, conversion: 90 },
      { id: '7', name: 'Desert Bloom Dental', received: 410, scheduled: 340, released: 280, conversion: 83 },
      { id: '8', name: 'Mountain View Family Dental', received: 170, scheduled: 135, released: 110, conversion: 79 }
    ]
  },
  'last_year': {
    totalReceived: 1650,
    totalScheduled: 1420,
    totalReleased: 1210,
    conversionRate: 86,
    breakdown: [
      { id: '6', name: 'Sunshine Dental', received: 520, scheduled: 480, released: 410, conversion: 92 },
      { id: '7', name: 'Desert Bloom Dental', received: 780, scheduled: 650, released: 550, conversion: 83 },
      { id: '8', name: 'Mountain View Family Dental', received: 350, scheduled: 290, released: 250, conversion: 82 }
    ]
  }
};

function NetworkAnalytics() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'quarter' | 'year' | 'last_year'>('month');
  const data = mockAnalytics[timeRange];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <h3 className="text-xl font-black uppercase italic tracking-tighter">Network Performance</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="wireframe-input py-2 pl-4 pr-10 text-[10px] font-black uppercase appearance-none bg-white cursor-pointer hover:bg-gray-50 focus:outline-none h-10 border-2 border-black"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="last_year">Last Year</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown size={14} className="text-black" />
            </div>
          </div>
          <button 
            type="button"
            onClick={() => alert("Downloading network report as CSV...")}
            className="wireframe-button h-10 w-10 p-0 border-2 border-black bg-white hover:bg-black hover:text-white transition-all flex items-center justify-center text-black" 
            title="Download CSV"
          >
            <Download size={20} />
          </button>
          <button 
            type="button"
            onClick={() => window.print()}
            className="wireframe-button h-10 w-10 p-0 border-2 border-black bg-white hover:bg-black hover:text-white transition-all flex items-center justify-center text-black" 
            title="Print PDF"
          >
            <Printer size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="wireframe-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Total Referrals Received</span>
            <ArrowUpRight size={16} className="text-black" />
          </div>
          <div className="text-4xl font-black">{data.totalReceived}</div>
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
          <h4 className="font-bold uppercase text-sm">Referring Dentist Breakdown</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-black text-[10px] uppercase bg-white">
                <th className="p-4 font-black">Practice Name</th>
                <th className="p-4 font-black text-right">Received</th>
                <th className="p-4 font-black text-right">Scheduled</th>
                <th className="p-4 font-black">Conversion</th>
                <th className="p-4 font-black text-right">Released</th>
              </tr>
            </thead>
            <tbody>
              {data.breakdown.map((row, idx) => (
                <tr key={row.id} className={`text-sm ${idx !== data.breakdown.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-gray-50 transition-colors bg-white`}>
                  <td className="p-4 font-bold">{row.name}</td>
                  <td className="p-4 text-right font-medium">{row.received}</td>
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

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'connected' | 'directory'>('analytics');
  const [directoryFilter, setDirectoryFilter] = useState<'all' | 'nearby'>('nearby');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [networkList, setNetworkList] = useState<NetworkPractice[]>([]);

  useEffect(() => {
    setNetworkList(getNetwork());
  }, []);

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

  const filteredNetwork = networkList.filter(p => {
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchStr) ||
                          p.specialty.toLowerCase().includes(searchStr);
    if (!matchesSearch) return false;

    if (activeTab === 'connected') {
      // My Network: show all Connected practices regardless of type
      return p.status === 'Connected';
    }
    if (activeTab === 'directory') {
      // Connect&Grow: show non-connected, on-platform suggestions only
      if (p.isExternal) return false;
      if (p.status === 'Connected') return false;
      if (directoryFilter === 'nearby' && p.status !== 'Nearby') return false;
      return true;
    }
    return true;
  });


  return (
    <MainLayout title="Practice Network">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter italic">Practice Network</h2>
                <CommentMarker id="practice-network" title="Practice Network" description="Directory of trusted clinical partners." />
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Connect, Collaborate, and Refer with Trusted Partners</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="SEARCH DIRECTORY..." 
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
                      All Practices
                    </button>
                    <button 
                      onClick={() => setDirectoryFilter('nearby')}
                      className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-wider border-2 border-black transition-all ${
                        directoryFilter === 'nearby' 
                          ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                          : 'bg-white text-black hover:bg-gray-50'
                      }`}
                    >
                      Suggested (Nearby)
                    </button>
                  </div>
                )}

                {activeTab === 'connected' ? (() => {
                  const onPlatform = filteredNetwork.filter(p => !p.isExternal);
                  const external   = filteredNetwork.filter(p => p.isExternal);
                  const PracticeCard = ({ practice }: { practice: NetworkPractice }) => (
                    <div
                      key={practice.id}
                      className={`wireframe-card group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all overflow-hidden flex flex-col h-full ${practice.isExternal ? 'border-dashed' : ''}`}
                    >
                      <div className="p-6 space-y-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div className={`w-12 h-12 border-2 border-black flex items-center justify-center transition-all ${practice.isExternal ? 'bg-gray-100 group-hover:bg-gray-200' : 'bg-gray-50 group-hover:bg-black group-hover:text-white'}`}>
                            <Building2 size={24} />
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 border border-black ${
                              practice.status === 'Connected' ? 'bg-black text-white' : 'bg-transparent text-black'
                            }`}>
                              {practice.status === 'Nearby' ? 'Suggested (Nearby)' : practice.status}
                            </span>
                            {practice.isExternal && (
                              <span className="text-[7px] font-black uppercase px-1.5 py-0.5 bg-white text-black border border-black whitespace-nowrap">
                                External / Fax / Email
                              </span>
                            )}
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
                        <Link
                          href={`/channels?practice=${encodeURIComponent(practice.name)}`}
                          className={`flex-1 wireframe-button text-[9px] uppercase py-2 flex items-center justify-center gap-2 transition-all font-black ${practice.isExternal ? 'bg-white text-black hover:bg-gray-100 border-2 border-black' : 'bg-black text-white hover:bg-zinc-800'}`}
                        >
                          <MessageCircle size={14} />
                          {practice.isExternal ? 'Send Secure Message' : 'Chat Now'}
                        </Link>
                        <button className="wireframe-button p-2 hover:bg-black hover:text-white transition-all flex items-center justify-center text-black">
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  );

                  return (
                    <div className="space-y-10">
                      {/* On-platform section */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 bg-black" />
                          <span className="text-[10px] font-black uppercase tracking-widest">On-Platform ({onPlatform.length})</span>
                          <div className="flex-1 border-t border-black/20" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {onPlatform.map(p => <PracticeCard key={p.id} practice={p} />)}
                          {/* Invite placeholder */}
                          <div className="wireframe-card border-dashed bg-gray-50/30 flex flex-col items-center justify-center p-8 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full border-2 border-black border-dashed flex items-center justify-center">
                              <UserPlus size={24} className="text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-bold uppercase text-xs tracking-tight">Invite a Colleague</h4>
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
                        </div>
                      </div>

                      {/* External section */}
                      {external.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 bg-gray-400 border border-black" />
                            <span className="text-[10px] font-black uppercase tracking-widest">External — Fax / Email ({external.length})</span>
                            <div className="flex-1 border-t border-black/20" />
                            <span className="text-[8px] font-bold uppercase text-muted-foreground">Off-platform · Secure Email transport</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {external.map(p => <PracticeCard key={p.id} practice={p} />)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })() : (
                  /* Connect&Grow flat grid */
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
                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 border border-black ${
                              practice.status === 'Connected' ? 'bg-black text-white' : 'bg-transparent text-black'
                            }`}>
                              {practice.status === 'Nearby' ? 'Suggested (Nearby)' : practice.status}
                            </span>
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
                          <button className="flex-1 wireframe-button bg-black text-white text-[9px] uppercase py-2 flex items-center justify-center gap-2">
                            Connect
                          </button>
                          <button className="wireframe-button p-2 hover:bg-black hover:text-white transition-all flex items-center justify-center text-black">
                            <ExternalLink size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

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
    </MainLayout>
  );
}
