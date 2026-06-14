"use client";

import { ChevronDown, Search } from 'lucide-react';

export type GuestReferralPracticeOption = {
  name: string;
  specialty: string;
  location: string;
};

type StateOption = {
  code: string;
  name: string;
};

type GuestReferralPracticeSelectorProps = {
  isInternal: boolean;
  practiceParam?: string | null;
  selectedState: string;
  practiceSearch: string;
  targetPractice: string;
  targetPractices: string[];
  showDropdown: boolean;
  states: StateOption[];
  filteredPractices: GuestReferralPracticeOption[];
  allPractices: GuestReferralPracticeOption[];
  onStateChange: (state: string) => void;
  onPracticeSearchChange: (value: string) => void;
  onTargetPracticeChange: (practice: string) => void;
  onTargetPracticesChange: (practices: string[]) => void;
  onShowDropdownChange: (show: boolean) => void;
};

export function GuestReferralPracticeSelector({
  isInternal,
  practiceParam,
  selectedState,
  practiceSearch,
  targetPractice,
  targetPractices,
  showDropdown,
  states,
  filteredPractices,
  allPractices,
  onStateChange,
  onPracticeSearchChange,
  onTargetPracticeChange,
  onTargetPracticesChange,
  onShowDropdownChange,
}: GuestReferralPracticeSelectorProps) {
  if (practiceParam) {
    return (
      <div className="p-3 border-2 border-black bg-gray-50 flex items-center justify-between">
        <p className="text-xl font-black uppercase italic tracking-tighter">{targetPractice}</p>
      </div>
    );
  }

  if (isInternal) {
    const visiblePractices = allPractices
      .filter((practice) => practice.name.toLowerCase().includes(practiceSearch.toLowerCase()))
      .filter((practice) => !targetPractices.includes(practice.name));

    return (
      <div className="space-y-4 border-2 border-black p-4 bg-gray-50/50 relative">
        <span className="text-[10px] font-black uppercase block mb-1 text-black">
          Connected Practices (Select Multiple) <span className="text-red-500">*</span>
        </span>
        <div className="border-2 border-black bg-white p-2 min-h-[40px] text-xs">
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {targetPractices.map((practiceName) => (
              <span key={practiceName} className="px-2 py-0.5 font-bold uppercase text-[8px] border border-black flex items-center gap-1 bg-black text-white">
                {practiceName}
                <button
                  type="button"
                  aria-label={`Remove ${practiceName}`}
                  onClick={() => onTargetPracticesChange(targetPractices.filter((practice) => practice !== practiceName))}
                  className="font-bold ml-1 text-[9px] hover:text-red-500"
                >
                  x
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type to search and add practices..."
              value={practiceSearch}
              onChange={(event) => {
                onPracticeSearchChange(event.target.value);
                onShowDropdownChange(true);
              }}
              onFocus={() => onShowDropdownChange(true)}
              className="w-full bg-transparent outline-none border-none p-0 focus:ring-0 text-[10px] uppercase font-bold text-black placeholder:text-zinc-400 h-5"
            />
            <button
              type="button"
              aria-label="Toggle practice dropdown"
              onClick={() => onShowDropdownChange(!showDropdown)}
              className="text-black"
            >
              <ChevronDown size={14} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => onShowDropdownChange(false)} />
            <div className="absolute left-4 right-4 mt-1 z-50 bg-white border-2 border-black max-h-48 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-[9px]">
              {visiblePractices.map((practice) => (
                <div
                  key={practice.name}
                  onClick={() => {
                    onTargetPracticesChange([...targetPractices, practice.name]);
                    onPracticeSearchChange('');
                    onShowDropdownChange(false);
                  }}
                  className="p-2 hover:bg-black hover:text-white cursor-pointer font-bold border-b border-black/10 flex justify-between items-center bg-white text-black"
                >
                  <span>{practice.name}</span>
                  <span className="text-[7px] text-zinc-500">{practice.specialty}</span>
                </div>
              ))}
              {visiblePractices.length === 0 && (
                <div className="p-2 text-zinc-400 font-bold bg-white text-center">No practices found</div>
              )}
            </div>
          </>
        )}

        {targetPractices.length > 0 && (
          <div className="p-2 bg-black text-white text-[10px] font-black uppercase tracking-tight flex justify-between items-center">
            <span>Selected: {targetPractices.join(', ')}</span>
            <button
              type="button"
              aria-label="Clear selected practices"
              onClick={() => {
                onTargetPracticesChange([]);
                onPracticeSearchChange('');
              }}
              className="text-white hover:text-red-400 font-bold"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 border-2 border-black p-4 bg-gray-50/50">
      <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Select receiving practice</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1 space-y-1">
          <label htmlFor="guest-referral-state" className="text-[8px] font-black uppercase">State</label>
          <select
            id="guest-referral-state"
            value={selectedState}
            onChange={(event) => onStateChange(event.target.value)}
            className="wireframe-input bg-white text-[10px] h-9"
          >
            <option value="">State...</option>
            {states.map((state) => (
              <option key={state.code} value={state.code}>{state.code}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2 space-y-1 relative">
          <label className="text-[8px] font-black uppercase">Search Practice Name</label>
          <div className="relative">
            <input
              type="text"
              placeholder={selectedState ? 'Type practice name...' : 'Choose state first'}
              disabled={!selectedState}
              value={practiceSearch}
              onChange={(event) => {
                onPracticeSearchChange(event.target.value);
                onTargetPracticeChange('');
                onShowDropdownChange(true);
              }}
              onFocus={() => onShowDropdownChange(true)}
              className="wireframe-input bg-white text-[10px] h-9 pl-7 pr-3"
            />
            <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>

          {showDropdown && selectedState && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border-2 border-black mt-1 max-h-40 overflow-y-auto divide-y divide-black/10">
              {filteredPractices.map((practice) => (
                <button
                  key={practice.name}
                  type="button"
                  onClick={() => {
                    onTargetPracticeChange(practice.name);
                    onPracticeSearchChange(practice.name);
                    onShowDropdownChange(false);
                  }}
                  className="w-full text-left p-2 hover:bg-gray-100 text-[10px] font-bold uppercase transition-colors"
                >
                  <p className="font-black text-black">{practice.name}</p>
                  <p className="text-[8px] text-muted-foreground">{practice.specialty} - {practice.location}</p>
                </button>
              ))}
              {filteredPractices.length === 0 && (
                <div className="p-2 text-zinc-400 font-bold bg-white text-center text-[10px] uppercase">No practices found</div>
              )}
            </div>
          )}
        </div>
      </div>
      {targetPractice && (
        <div className="p-2 bg-black text-white text-[10px] font-black uppercase tracking-tight flex justify-between items-center">
          <span>Selected: {targetPractice}</span>
          <button
            type="button"
            onClick={() => {
              onTargetPracticeChange('');
              onPracticeSearchChange('');
            }}
            className="text-white hover:text-red-400 font-bold"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
