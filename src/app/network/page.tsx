"use client";

import React, { useState } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { 
  Search, Filter, MapPin, 
  UserPlus, ExternalLink, ShieldCheck, 
  Building2, MessageCircle 
} from 'lucide-react';

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
  { id: '6', name: 'Sunshine Dental', type: 'Dentist', specialty: 'General Dentistry', location: 'Phoenix, AZ', status: 'Connected', verified: true },
  { id: '7', name: 'Desert Bloom Dental', type: 'Dentist', specialty: 'General Dentistry', location: 'Scottsdale, AZ', status: 'Nearby', verified: true },
  { id: '8', name: 'Mountain View Family Dental', type: 'Dentist', specialty: 'Cosmetic Dentistry', location: 'Tempe, AZ', status: 'Suggested', verified: false },
];

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'connected' | 'nearby'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNetwork = mockNetwork.filter(p => {
    if (activeTab === 'connected' && p.status !== 'Connected') return false;
    if (activeTab === 'nearby' && p.status !== 'Nearby') return false;
    const searchStr = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(searchStr) || 
           p.specialty.toLowerCase().includes(searchStr) ||
           p.type.toLowerCase().includes(searchStr);
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
            {/* Tabs */}
            <div className="flex border-b-2 border-black overflow-x-auto no-scrollbar">
              {['all', 'connected', 'nearby'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 sm:px-8 py-3 text-[10px] font-black uppercase transition-all relative whitespace-nowrap ${
                    activeTab === tab ? 'text-black' : 'text-muted-foreground hover:text-black'
                  }`}
                >
                  {tab === 'all' ? 'Directory' : tab === 'connected' ? 'My Network' : 'Nearby Practices'}
                  {activeTab === tab && (
                    <div className="absolute bottom-[-2px] left-0 right-0 h-[2.5px] bg-black" />
                  )}
                </button>
              ))}
            </div>

            {/* Grid of Practices */}
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
                    <button className="flex-1 wireframe-button bg-black text-white text-[9px] uppercase py-2 flex items-center justify-center gap-2">
                      {practice.type === 'Dentist' ? 'Connect' : 'Send Referral'}
                    </button>
                    <button className="wireframe-button p-2 hover:bg-white transition-all">
                      <MessageCircle size={14} />
                    </button>
                    <button className="wireframe-button p-2 hover:bg-white transition-all">
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Invite Placeholder */}
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
                <button className="text-[10px] font-black uppercase underline hover:text-black">
                  Send Invitation
                </button>
              </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
