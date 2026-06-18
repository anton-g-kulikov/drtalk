"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { Clock, MoreVertical, Copy, ChevronDown, Check } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { getReferrals, UnifiedReferral, initialReferrals, getReferralCode, isInRange } from '@/lib/referrals';
import { getPrototypePageNumbers } from '@/prototype/pagination';
import { ReferralPipelineControls, ReferralTimeRange } from '@/components/prototype/ReferralPipelineControls';

import { ReferralStatus } from '@/lib/referrals';

import { useVerification } from '@/components/VerificationContext';

export default function ReferralsPage() {
  const [mockReferrals, setMockReferrals] = useState<UnifiedReferral[]>(initialReferrals);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, fieldName: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

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
  const [timeRange, setTimeRange] = useState<ReferralTimeRange>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedPracticeFilter, setSelectedPracticeFilter] = useState<string>('All');
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);

  useEffect(() => {
    const handleFocus = () => {
      setMockReferrals(getReferrals());
    };
    window.addEventListener('focus', handleFocus);
    setMockReferrals(getReferrals());
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [activeTab]);

  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, timeRange, searchQuery, selectedUrgency, selectedSource, selectedPracticeFilter, showIncompleteOnly]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['Received', 'Accepted', 'Scheduled', 'Released', 'Archived'].includes(tabParam)) {
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

  const practiceOptions = React.useMemo(() => (
    Array.from(
      new Set(
        mockReferrals
          .map((r) => (isDentist ? r.specialist : r.practice))
          .filter((p): p is string => !!p && p !== 'unknown')
      )
    )
  ), [mockReferrals, isDentist]);

  const filteredReferrals = mockReferrals.filter(r => {
    if (isDentist) {
      const isFromSunshine = r.id.startsWith('D-') || r.id === '1' || (r.practice && r.practice.toLowerCase() === 'sunshine dental') || (r.dentist && (r.dentist.includes('Reed') || r.dentist.includes('Taylor')));
      if (!isFromSunshine) return false;
    } else {
      if (r.id.startsWith('D-')) return false;
    }

    const matchesTab = (() => {
      if (isDentist) {
        if (activeTab === 'Archived') {
          return r.archivedByDentist === true;
        }
        if (r.archivedByDentist === true) return false;
        
        const dStatus = r.dentistStatus || r.status;
        if (activeTab === 'Received') {
          return dStatus === 'Received' || dStatus === 'Sent';
        }
        return dStatus === activeTab;
      } else {
        if (activeTab === 'Archived') {
          return r.archivedBySpecialist === true;
        }
        if (r.archivedBySpecialist === true) return false;

        if (activeTab === 'Received') {
          return r.status === 'Received' || r.status === 'Sent';
        }
        return r.status === activeTab;
      }
    })();
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
    
    const matchesTimeRange = isInRange(r.receivedAt, timeRange);

    return matchesTab && matchesQuery && matchesUrgency && matchesSource && matchesCompletion && matchesPractice && matchesTimeRange;
  });

  const ITEMS_PER_PAGE = 10;
  const totalReferralPages = Math.ceil(filteredReferrals.length / ITEMS_PER_PAGE);
  const paginatedReferrals = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReferrals.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReferrals, currentPage]);

  return (
    <MainLayout title={isDentist ? "Patients" : "Referrals"}>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter italic">{isDentist ? "Patients" : "Referrals"}</h2>
              <CommentMarker id="referrals-list" title="Referrals Page" description="The list of all practice referrals." />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              {isDentist 
                ? 'TRACK PATIENTS PROGRESS AND COORDINATE PATIENT CARE'
                : 'Specialist intake pipeline and case processing workflow'}
            </p>
          </div>
          {!isDentist ? (
            <div className="flex flex-col items-end gap-2 text-right">
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Direct Intake Email:</span>
                <span className="text-[10px] font-black uppercase tracking-tight">valleyendodontics@drtalk.com</span>
                <button 
                  onClick={() => handleCopy('valleyendodontics@drtalk.com', 'email')}
                  className="p-1.5 border border-black hover:bg-black hover:text-white transition-all ml-1 flex items-center justify-center min-w-[28px] min-h-[28px]"
                  title="Copy Intake Email"
                >
                  {copiedField === 'email' ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Public Referral URL:</span>
                <span 
                  onClick={() => router.push('/referral?practice=Valley Endodontics')}
                  className="text-[10px] font-bold uppercase underline cursor-pointer hover:text-black transition-colors tracking-tight"
                >
                  drtalk.com/valleyendodontics
                </span>
                <button 
                  onClick={() => handleCopy('https://drtalk.com/valleyendodontics', 'url')}
                  className="p-1.5 border border-black hover:bg-black hover:text-white transition-all ml-1 flex items-center justify-center min-w-[28px] min-h-[28px]"
                  title="Copy Public URL"
                >
                  {copiedField === 'url' ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
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
            <ReferralPipelineControls
              isDentist={isDentist}
              activeTab={activeTab}
              timeRange={timeRange}
              searchQuery={searchQuery}
              showFilters={showFilters}
              selectedUrgency={selectedUrgency}
              selectedSource={selectedSource}
              selectedPracticeFilter={selectedPracticeFilter}
              showIncompleteOnly={showIncompleteOnly}
              practiceOptions={practiceOptions}
              onActiveTabChange={setActiveTab}
              onTimeRangeChange={setTimeRange}
              onSearchQueryChange={setSearchQuery}
              onShowFiltersChange={setShowFilters}
              onUrgencyChange={setSelectedUrgency}
              onSourceChange={setSelectedSource}
              onPracticeChange={setSelectedPracticeFilter}
              onIncompleteOnlyChange={setShowIncompleteOnly}
              onClearFilters={() => {
                setSelectedUrgency('All');
                setSelectedSource('All');
                setShowIncompleteOnly(false);
                setSelectedPracticeFilter('All');
              }}
            />

            {/* List Headers */}
            <div className={`hidden md:grid grid-cols-12 px-4 py-2 text-[9px] font-bold uppercase text-muted-foreground tracking-widest border-b border-black mt-4`}>
              <div className={isDentist ? 'col-span-3' : 'col-span-2'}>Patient</div>
              <div className="col-span-2">Urgency</div>
              {!isDentist && <div className="col-span-2">Source / ID</div>}
              <div className={isDentist ? 'col-span-5' : 'col-span-2'}>{isDentist ? 'Referred To' : 'Referring Practice'}</div>
              {!isDentist && <div className="col-span-2">Referred To</div>}
              <div className="col-span-1">{isDentist ? 'Last Update' : 'Received'}</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Referral List */}
            <div className="space-y-2">
              {paginatedReferrals.length > 0 ? (
                paginatedReferrals.map((referral) => (
                  <div 
                    key={referral.id} 
                    onClick={() => handleReferralClick(referral.id)}
                    className="wireframe-card p-4 hover:bg-gray-50 cursor-pointer transition-all group"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                      <div className={isDentist ? 'col-span-3' : 'col-span-2'}>
                        {isDentist ? (
                          <>
                            <p className="font-bold uppercase text-xs">{referral.patientName}</p>
                            <p className="text-[9px] uppercase font-bold text-muted-foreground">by {referral.dentist}</p>
                          </>
                        ) : (
                          <p className="font-bold uppercase text-xs">{referral.patientName}</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <span className={`inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded-sm border ${
                          referral.urgency === 'Emergency' ? 'bg-red-100 text-red-900 border-red-300' :
                          referral.urgency === 'Urgent' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                          'bg-zinc-100 text-zinc-800 border-zinc-300'
                        }`}>
                          {referral.urgency || 'Routine'}
                        </span>
                      </div>
                      {!isDentist && (
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border border-black flex items-center justify-center">
                              <span className="text-[8px] font-bold">{referral.source[0]}</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase">{referral.source}</span>
                          </div>
                          <p className="text-[8px] text-muted-foreground mt-1 uppercase tracking-tighter">{getReferralCode(referral.id)}</p>
                        </div>
                      )}
                      {/* Referring Practice / Referred To Practice */}
                      <div className={isDentist ? 'col-span-5' : 'col-span-2'}>
                        {isDentist ? (
                          <div className="grid grid-cols-2 gap-x-4">
                            <div>
                              <p className="text-[9px] font-black uppercase text-black/40 tracking-widest">Practice</p>
                              <p className="text-[10px] font-bold uppercase">{referral.specialist}</p>
                            </div>
                            {referral.specialistDoctor && (
                              <div>
                                <p className="text-[9px] font-black uppercase text-black/40 tracking-widest">Specialist</p>
                                <p className="text-[10px] font-bold uppercase">{referral.specialistDoctor}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            <p className="text-[10px] font-bold uppercase">{referral.practice || referral.dentist}</p>
                            {referral.dentist && referral.practice && (
                              <p className="text-[8px] font-black uppercase text-black/50 mt-0.5">
                                Ref. by {referral.dentist}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      {/* Specialist side only: Referred To Doctor column */}
                      {!isDentist && (
                        <div className="col-span-2">
                          {referral.specialistDoctor ? (
                            <>
                              <p className="text-[9px] font-black uppercase text-black/40 tracking-widest">Doctor</p>
                              <p className="text-[10px] font-bold uppercase">{referral.specialistDoctor}</p>
                            </>
                          ) : (
                            <p className="text-[8px] uppercase font-bold text-black/30">—</p>
                          )}
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
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">{isDentist ? "No patients found in this category." : "No referrals found in this category."}</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalReferralPages > 1 && (
              <div className="flex items-center justify-between border-2 border-black bg-white p-4 mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="wireframe-button px-4 py-2 text-[10px] uppercase font-black tracking-widest border-2 disabled:border-gray-300 disabled:text-gray-300 disabled:pointer-events-none border-black text-black hover:bg-black hover:text-white transition-colors bg-white"
                >
                  Previous Page
                </button>
                
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-black">
                    Page {currentPage} of {totalReferralPages}
                  </span>
                  <div className="flex items-center gap-1.5 text-black border-l border-black/20 pl-4">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Jump to:</span>
                    <div className="relative">
                      <select
                        value={currentPage}
                        onChange={(e) => setCurrentPage(Number(e.target.value))}
                        className="border-2 border-black bg-white pl-2 pr-6 py-0.5 font-black text-[9px] uppercase cursor-pointer hover:bg-black hover:text-white transition-all outline-none appearance-none"
                      >
                        {Array.from({ length: totalReferralPages }, (_, i) => i + 1).map(page => (
                          <option key={page} value={page} className="bg-white text-black">Page {page}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-black">
                        <ChevronDown size={10} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="wireframe-button border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black shrink-0"
                  >
                    PREV
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {getPrototypePageNumbers(currentPage, totalReferralPages).map((p, idx) => {
                      if (p === '...') {
                        return <span key={`ellipsis-${idx}`} className="w-6 h-6 flex items-center justify-center text-[9px] text-muted-foreground">...</span>;
                      }
                      return (
                        <button
                          key={`page-${p}`}
                          onClick={() => setCurrentPage(Number(p))}
                          className={`w-6 h-6 flex items-center justify-center border-2 border-black transition-all text-[9px] ${
                            currentPage === p 
                              ? 'bg-black text-white font-black' 
                              : 'bg-white text-black hover:bg-black hover:text-white font-bold'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentPage === totalReferralPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalReferralPages, prev + 1))}
                    className="wireframe-button border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black shrink-0"
                  >
                    NEXT
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </MainLayout>
  );
}

