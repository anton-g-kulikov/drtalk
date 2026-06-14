"use client";

import { ChevronDown } from 'lucide-react';

export type SendDocumentPracticeOption = {
  id: string;
  name: string;
  isVerified?: boolean;
};

type SendDocumentPracticeSelectorProps = {
  selectedPractices: string[];
  searchQuery: string;
  isOpen: boolean;
  practices: SendDocumentPracticeOption[];
  onSearchQueryChange: (value: string) => void;
  onOpenChange: (isOpen: boolean) => void;
  onSelectPractice: (practiceName: string) => void;
  onRemovePractice: (practiceName: string) => void;
};

export function SendDocumentPracticeSelector({
  selectedPractices,
  searchQuery,
  isOpen,
  practices,
  onSearchQueryChange,
  onOpenChange,
  onSelectPractice,
  onRemovePractice,
}: SendDocumentPracticeSelectorProps) {
  return (
    <div className="relative">
      <span className="text-[10px] font-black uppercase block mb-1 text-black">
        Connected Practices (Select Multiple) <span className="text-red-500">*</span>
      </span>
      <div className="border-2 border-black bg-white p-2 min-h-[40px] text-xs">
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {selectedPractices.map((practiceName) => (
            <span key={practiceName} className="px-2 py-0.5 font-bold uppercase text-[8px] border border-black flex items-center gap-1 bg-black text-white">
              {practiceName}
              <button
                type="button"
                onClick={() => onRemovePractice(practiceName)}
                className="font-bold ml-1 text-[9px] hover:text-red-500"
                aria-label={`Remove ${practiceName}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type to search and add practices..."
            value={searchQuery}
            onChange={(event) => {
              onSearchQueryChange(event.target.value);
              onOpenChange(true);
            }}
            onFocus={() => onOpenChange(true)}
            className="w-full bg-transparent outline-none border-none p-0 focus:ring-0 text-[10px] uppercase font-bold text-black placeholder:text-zinc-400 h-5"
          />
          <button
            type="button"
            onClick={() => onOpenChange(!isOpen)}
            className="text-black"
            aria-label="Toggle practice selector"
          >
            <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => onOpenChange(false)} />
          <div className="absolute left-0 right-0 mt-1 z-50 bg-white border-2 border-black max-h-48 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-[9px]">
            {practices.map((practice) => (
              <div
                key={practice.id}
                onClick={() => onSelectPractice(practice.name)}
                className="p-2 hover:bg-black hover:text-white cursor-pointer font-bold border-b border-black/10 flex justify-between items-center bg-white text-black"
              >
                <span>{practice.name}</span>
                {practice.isVerified === false && (
                  <span className="text-[6px] px-1 font-black bg-zinc-200 text-black">
                    UNVERIFIED
                  </span>
                )}
              </div>
            ))}
            {practices.length === 0 && (
              <div className="p-2 text-zinc-400 font-bold bg-white text-center">No practices found</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
