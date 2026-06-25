"use client";

import { ChevronDown, Filter, Search } from 'lucide-react';
import type { ReferralStatus } from '@/lib/referrals';

export type ReferralTimeRange = 'day' | 'week' | 'month' | 'quarter' | 'year';

export type ReferralSortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';

type ReferralPipelineControlsProps = {
  isDentist: boolean;
  activeTab: ReferralStatus;
  timeRange: ReferralTimeRange;
  searchQuery: string;
  showFilters: boolean;
  selectedUrgency: string;
  selectedSource: string;
  selectedPracticeFilter: string;
  showIncompleteOnly: boolean;
  practiceOptions: string[];
  sortBy?: ReferralSortOption;
  onActiveTabChange: (tab: ReferralStatus) => void;
  onTimeRangeChange: (range: ReferralTimeRange) => void;
  onSearchQueryChange: (query: string) => void;
  onShowFiltersChange: (show: boolean) => void;
  onUrgencyChange: (urgency: string) => void;
  onSourceChange: (source: string) => void;
  onPracticeChange: (practice: string) => void;
  onIncompleteOnlyChange: (showIncompleteOnly: boolean) => void;
  onClearFilters: () => void;
  onSortByChange?: (sortBy: ReferralSortOption) => void;
};

function getTabLabel(tab: ReferralStatus, isDentist: boolean) {
  if (isDentist) {
    if (tab === 'Received') return 'REFERRED';
    return tab.toUpperCase();
  }

  if (tab === 'Received') return 'RECEIVED (REVIEW)';
  return tab.toUpperCase();
}

export function ReferralPipelineControls({
  isDentist,
  activeTab,
  timeRange,
  searchQuery,
  showFilters,
  selectedUrgency,
  selectedSource,
  selectedPracticeFilter,
  showIncompleteOnly,
  practiceOptions,
  sortBy = 'date-desc',
  onActiveTabChange,
  onTimeRangeChange,
  onSearchQueryChange,
  onShowFiltersChange,
  onUrgencyChange,
  onSourceChange,
  onPracticeChange,
  onIncompleteOnlyChange,
  onClearFilters,
  onSortByChange = () => {},
}: ReferralPipelineControlsProps) {
  const hasActiveFilters = selectedUrgency !== 'All' || selectedSource !== 'All' || showIncompleteOnly || selectedPracticeFilter !== 'All';
  const tabs: ReferralStatus[] = ['Received', 'Accepted', 'Scheduled', 'Released', 'Archived'];

  return (
    <>
      <div className="border-b-2 border-black">
        <div className="flex overflow-x-auto no-scrollbar -mb-[2px]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onActiveTabChange(tab)}
              className={`px-4 sm:px-8 py-4 text-[11px] font-bold uppercase transition-all relative whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-black text-white'
                  : 'text-muted-foreground hover:text-black hover:bg-zinc-50'
              }`}
            >
              {getTabLabel(tab, isDentist)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={isDentist ? 'SEARCH PATIENTS...' : 'SEARCH REFERRALS...'}
            className="wireframe-input pl-10 py-2.5 text-[11px] w-full"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <div className="relative">
            <label className="sr-only" htmlFor="referral-time-range">Time Range</label>
            <select
              id="referral-time-range"
              value={timeRange}
              onChange={(event) => onTimeRangeChange(event.target.value as ReferralTimeRange)}
              className="wireframe-input py-2 pl-4 pr-10 text-[11px] font-black uppercase appearance-none bg-white cursor-pointer hover:bg-gray-50 focus:outline-none h-10 border-2 border-black"
            >
              <option value="day">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown size={14} className="text-black" />
            </div>
          </div>
          <div className="relative">
            <label className="sr-only" htmlFor="referral-sort-by">Sort By</label>
            <select
              id="referral-sort-by"
              value={sortBy}
              onChange={(event) => onSortByChange(event.target.value as ReferralSortOption)}
              className="wireframe-input py-2 pl-4 pr-10 text-[11px] font-black uppercase appearance-none bg-white cursor-pointer hover:bg-gray-50 focus:outline-none h-10 border-2 border-black"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="name-asc">Patient Name (A-Z)</option>
              <option value="name-desc">Patient Name (Z-A)</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown size={14} className="text-black" />
            </div>
          </div>
          <button
            onClick={() => onShowFiltersChange(!showFilters)}
            className={`wireframe-button flex items-center justify-center gap-2 px-6 py-2.5 text-[11px] uppercase font-bold transition-colors h-10 ${
              showFilters || hasActiveFilters
                ? 'bg-black text-white'
                : 'bg-white text-black'
            }`}
          >
            <Filter size={14} />
            Filters {hasActiveFilters && '•'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="wireframe-card p-5 border-2 border-black bg-zinc-50 flex flex-col lg:flex-row gap-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="referral-urgency-filter" className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block">Urgency</label>
              <select
                id="referral-urgency-filter"
                value={selectedUrgency}
                onChange={(event) => onUrgencyChange(event.target.value)}
                className="wireframe-input py-2 px-3 text-[11px] font-bold text-black border-black bg-white w-full focus:outline-none"
              >
                <option value="All">ALL URGENCY LEVELS</option>
                <option value="Routine">ROUTINE</option>
                <option value="Urgent">URGENT</option>
                <option value="Emergency">EMERGENCY</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="referral-source-filter" className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block">Source / Channel</label>
              <select
                id="referral-source-filter"
                value={selectedSource}
                onChange={(event) => onSourceChange(event.target.value)}
                className="wireframe-input py-2 px-3 text-[11px] font-bold text-black border-black bg-white w-full focus:outline-none"
              >
                <option value="All">ALL SOURCE CHANNELS</option>
                <option value="Email">EMAIL</option>
                <option value="Fax">FAX</option>
                <option value="Web">WEB PORTAL</option>
                <option value="App">MOBILE APP</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="referral-practice-filter" className="text-[9px] font-black uppercase tracking-wider text-muted-foreground block">
                {isDentist ? 'Specialist Practice' : 'Referring Practice'}
              </label>
              <select
                id="referral-practice-filter"
                value={selectedPracticeFilter}
                onChange={(event) => onPracticeChange(event.target.value)}
                className="wireframe-input py-2 px-3 text-[11px] font-bold text-black border-black bg-white w-full focus:outline-none"
              >
                <option value="All">ALL PRACTICES</option>
                {practiceOptions.map((practice) => (
                  <option key={practice} value={practice}>
                    {practice.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {!isDentist && (
              <div className="space-y-1.5 flex items-end pb-1 select-none">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showIncompleteOnly}
                    onChange={(event) => onIncompleteOnlyChange(event.target.checked)}
                    className="w-4 h-4 border-2 border-black rounded-none appearance-none checked:bg-black checked:before:content-['✓'] checked:before:text-white checked:before:text-[10px] checked:before:flex checked:before:items-center checked:before:justify-center cursor-pointer"
                  />
                  <span className="text-[10px] font-black uppercase tracking-wider text-black">
                    Show Incomplete Only
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="flex items-end shrink-0">
            <button
              onClick={onClearFilters}
              className="wireframe-button border-2 border-black border-dashed hover:border-solid hover:bg-black hover:text-white transition-all py-2 px-6 text-[10px] uppercase font-black tracking-widest bg-white text-black h-10 w-full md:w-auto"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}
