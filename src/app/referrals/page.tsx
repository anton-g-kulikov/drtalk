"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { Search, Filter, AlertCircle, Clock, MoreVertical, Copy } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { getReferrals, UnifiedReferral, initialReferrals, getReferralCode } from '@/lib/referrals';

import { ReferralStatus } from '@/lib/referrals';
type Referral = UnifiedReferral;

import { useVerification } from '@/components/VerificationContext';

export default function ReferralsPage() {
  const [mockReferrals, setMockReferrals] = useState<UnifiedReferral[]>(initialReferrals);
  useEffect(() => {
    setTimeout(() => {
      setMockReferrals(getReferrals());
    }, 0);
  }, []);
  const getCompletionColor = (score: number) => {
    if (score >= 90) return 'text-black';
    return 'text-black font-black italic opacity-60';
  };

  const getCompletionLabel = (score: number) => {
    return score >= 90 ? 'Complete' : 'Incomplete';
  };

  const { isVerified, setShowVerification } = useVerification();
  const pathname = usePathname();
  const isDentist = pathname.startsWith('/dentist');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ReferralStatus>('Received');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedPracticeFilter, setSelectedPracticeFilter] = useState<string>('All');
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['Received', 'Scheduled', 'Completed', 'Archived'].includes(tabParam)) {
        const timer = setTimeout(() => {
          setActiveTab(tabParam as ReferralStatus);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleReferralClick = (id: string) => {
    if (!isVerified) {
      router.push('/verify');
    } else {
      const referral = mockReferrals.find(r => r.id === id);
      if (isDentist && referral) {
        router.push(`/dentist/channels?practice=${encodeURIComponent(referral.specialist)}&caseId=case_${referral.id}`);
      } else {
        router.push(isDentist ? '/dentist/channels' : `/referrals/${id}`);
      }
    }
  };

  const tabs: ReferralStatus[] = ['Received', 'Scheduled', 'Completed', 'Archived'];

  const getTabLabel = (tab: ReferralStatus) => {
    if (isDentist) {
      switch (tab) {
        case 'Received': return 'SENT';
        case 'Scheduled': return 'SCHEDULED';
        case 'Completed': return 'COMPLETED';
        case 'Archived': return 'ARCHIVED';
        default: return (tab as string).toUpperCase();
      }
    } else {
      switch (tab) {
        case 'Received': return 'RECEIVED (REVIEW)';
        case 'Scheduled': return 'SCHEDULED';
        case 'Completed': return 'COMPLETED';
        case 'Archived': return 'ARCHIVED';
        default: return (tab as string).toUpperCase();
      }
    }
  };
  const filteredReferrals = mockReferrals.filter(r => {
    if (isDentist) {
      if (!r.id.startsWith('D-') && r.id !== '1') return false;
    } else {
      if (r.id.startsWith('D-')) return false;
    }

    const matchesTab = r.status === activeTab;
    const matchesQuery = r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = selectedUrgency === 'All' || r.urgency === selectedUrgency;
    const matchesSource = selectedSource === 'All' || r.source === selectedSource;
    
    let matchesCompletion = true;
    if (showIncompleteOnly) {
      matchesCompletion = getCompletionLabel(r.completion) === 'Incomplete';
    }

    const practiceName = isDentist ? r.specialist : r.practice;
    const matchesPractice = selectedPracticeFilter === 'All' || practiceName === selectedPracticeFilter;
    
    return matchesTab && matchesQuery && matchesUrgency && matchesSource && matchesCompletion && matchesPractice;
  });

  return (
    <MainLayout title="Referrals">
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter italic">Referrals</h2>
              <CommentMarker id="referrals-list" title="Referrals Page" description="The list of all practice referrals." />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              {isDentist 
                ? 'TRACK REFERRALS PROGRESS AND COORDINATE PATIENT CARE'
                : 'Specialist intake pipeline and case processing workflow'}
            </p>
          </div>
          {!isDentist ? (
            <div className="flex flex-col items-end gap-2 text-right">
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Direct Intake Email:</span>
                <span className="text-[10px] font-black uppercase tracking-tight">valleyendodontics@drtalk.com</span>
                <button className="p-1.5 border border-black hover:bg-black hover:text-white transition-all ml-1">
                  <Copy size={12} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Public Referral URL:</span>
                <span className="text-[10px] font-bold uppercase underline cursor-pointer hover:text-black transition-colors tracking-tight">drtalk.com/valleyendodontics</span>
                <button className="p-1.5 border border-black hover:bg-black hover:text-white transition-all ml-1">
                  <Copy size={12} />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => router.push('/dentist/referral')}
              className="wireframe-button bg-black text-white text-[10px] uppercase px-8 py-3 w-full sm:w-auto"
            >
              Send a Referral
            </button>
          )}
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
                        ? 'bg-black text-white' 
                        : 'text-muted-foreground hover:text-black hover:bg-zinc-50'
                    }`}
                  >
                    {getTabLabel(tab)}
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
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`wireframe-button flex items-center justify-center gap-2 px-6 py-2.5 text-[11px] uppercase font-bold transition-colors ${
                  showFilters || selectedUrgency !== 'All' || selectedSource !== 'All' || showIncompleteOnly || selectedPracticeFilter !== 'All'
                    ? 'bg-black text-white' 
                    : 'bg-white text-black'
                }`}
              >
                <Filter size={14} />
                Filters {(selectedUrgency !== 'All' || selectedSource !== 'All' || showIncompleteOnly || selectedPracticeFilter !== 'All') && '•'}
              </button>
            </div>

            {/* Collapsible Filters Row */}
            {showFilters && (
              <div className="wireframe-card p-5 border-2 border-black bg-zinc-50 flex flex-col lg:flex-row gap-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Urgency Filter */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block">Urgency</label>
                    <select
                      value={selectedUrgency}
                      onChange={(e) => setSelectedUrgency(e.target.value)}
                      className="wireframe-input py-2 px-3 text-[11px] font-bold text-black border-black bg-white w-full focus:outline-none"
                    >
                      <option value="All">ALL URGENCY LEVELS</option>
                      <option value="Routine">ROUTINE</option>
                      <option value="Urgent">URGENT</option>
                      <option value="Emergency">EMERGENCY</option>
                    </select>
                  </div>

                  {/* Channel / Source Filter */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block">Source / Channel</label>
                    <select
                      value={selectedSource}
                      onChange={(e) => setSelectedSource(e.target.value)}
                      className="wireframe-input py-2 px-3 text-[11px] font-bold text-black border-black bg-white w-full focus:outline-none"
                    >
                      <option value="All">ALL SOURCE CHANNELS</option>
                      <option value="Email">EMAIL</option>
                      <option value="Fax">FAX</option>
                      <option value="Web">WEB PORTAL</option>
                      <option value="App">MOBILE APP</option>
                    </select>
                  </div>

                  {/* Practice Filter */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block">
                      {isDentist ? 'Specialist Practice' : 'Referring Practice'}
                    </label>
                    <select
                      value={selectedPracticeFilter}
                      onChange={(e) => setSelectedPracticeFilter(e.target.value)}
                      className="wireframe-input py-2 px-3 text-[11px] font-bold text-black border-black bg-white w-full focus:outline-none"
                    >
                      <option value="All">ALL PRACTICES</option>
                      {Array.from(
                        new Set(
                          mockReferrals
                            .map((r) => (isDentist ? r.specialist : r.practice))
                            .filter((p): p is string => !!p && p !== 'unknown')
                        )
                      ).map((practice) => (
                        <option key={practice} value={practice}>
                          {practice.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Data Completion Filter */}
                  {!isDentist && (
                    <div className="space-y-1.5 flex items-end pb-1 select-none">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showIncompleteOnly}
                          onChange={(e) => setShowIncompleteOnly(e.target.checked)}
                          className="w-4 h-4 border-2 border-black rounded-none appearance-none checked:bg-black checked:before:content-['✓'] checked:before:text-white checked:before:text-[10px] checked:before:flex checked:before:items-center checked:before:justify-center cursor-pointer"
                        />
                        <span className="text-[10px] font-black uppercase tracking-wider text-black">
                          Show Incomplete Only
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Reset Action */}
                <div className="flex items-end shrink-0">
                  <button
                    onClick={() => {
                      setSelectedUrgency('All');
                      setSelectedSource('All');
                      setShowIncompleteOnly(false);
                      setSelectedPracticeFilter('All');
                    }}
                    className="wireframe-button border-2 border-black border-dashed hover:border-solid hover:bg-black hover:text-white transition-all py-2 px-6 text-[10px] uppercase font-black tracking-widest bg-white text-black h-10 w-full md:w-auto"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* List Headers */}
            <div className={`hidden md:grid grid-cols-12 px-4 py-2 text-[9px] font-bold uppercase text-muted-foreground tracking-widest border-b border-black mt-4`}>
              <div className={isDentist ? "col-span-3" : "col-span-2"}>Patient</div>
              <div className={isDentist ? "col-span-2" : "col-span-2"}>Urgency</div>
              <div className="col-span-2">Source / ID</div>
              <div className={isDentist ? "col-span-3" : "col-span-2"}>{isDentist ? 'Specialist Practice' : 'Referring Dentist'}</div>
              {!isDentist && <div className="col-span-2">Data Completion</div>}
              <div className="col-span-1">{isDentist ? 'Last Update' : 'Received'}</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Referral List */}
            <div className="space-y-2">
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((referral) => (
                  <div 
                    key={referral.id} 
                    onClick={() => handleReferralClick(referral.id)}
                    className="wireframe-card p-4 hover:bg-gray-50 cursor-pointer transition-all group"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                      <div className={isDentist ? "col-span-3" : "col-span-2"}>
                        {isDentist ? (
                          <>
                            <p className="font-bold uppercase text-xs">Patient: {referral.patientName}</p>
                            <p className="text-[9px] uppercase font-bold text-muted-foreground">Sender: {referral.dentist}</p>
                          </>
                        ) : (
                          <p className="font-bold uppercase text-xs">{referral.patientName}</p>
                        )}
                      </div>
                      <div className={isDentist ? "col-span-2" : "col-span-2"}>
                        <span className={`inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded-sm border ${
                          referral.urgency === 'Emergency' ? 'bg-red-100 text-red-900 border-red-300' :
                          referral.urgency === 'Urgent' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                          'bg-zinc-100 text-zinc-800 border-zinc-300'
                        }`}>
                          {referral.urgency || 'Routine'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border border-black flex items-center justify-center">
                            <span className="text-[8px] font-bold">{referral.source[0]}</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase">{referral.source}</span>
                        </div>
                        <p className="text-[8px] text-muted-foreground mt-1 uppercase tracking-tighter">{getReferralCode(referral.id)}</p>
                      </div>
                      <div className={isDentist ? "col-span-3" : "col-span-2"}>
                        <p className="text-[10px] font-bold uppercase">{isDentist ? referral.specialist : referral.dentist}</p>
                        {!isDentist && referral.practice && (
                          <p className="text-[8px] font-black uppercase text-black/50">{referral.practice}</p>
                        )}
                      </div>
                      {!isDentist && (
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <div className={`text-[10px] uppercase font-bold ${getCompletionColor(referral.completion)}`}>
                              {getCompletionLabel(referral.completion)}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-span-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock size={12} className="shrink-0" />
                          <span className="text-[10px] font-bold uppercase whitespace-pre-line leading-tight">{referral.receivedAt}</span>
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
