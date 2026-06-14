"use client";

import { ChevronDown } from 'lucide-react';

export type SendDocumentReferralOption = {
  id: string;
  code: string;
  patientName: string;
  specialist: string;
};

type SendDocumentReferralSelectorProps = {
  searchQuery: string;
  isOpen: boolean;
  referrals: SendDocumentReferralOption[];
  onSearchQueryChange: (value: string) => void;
  onOpenChange: (isOpen: boolean) => void;
  onSelectReferral: (referralId: string) => void;
};

export function SendDocumentReferralSelector({
  searchQuery,
  isOpen,
  referrals,
  onSearchQueryChange,
  onOpenChange,
  onSelectReferral,
}: SendDocumentReferralSelectorProps) {
  return (
    <div className="relative">
      <span className="text-[10px] font-black uppercase block mb-1.5 text-black">
        Associated Referral
      </span>
      <div className="relative">
        <input
          type="text"
          placeholder="Search or select referral..."
          value={searchQuery}
          onChange={(event) => {
            onSearchQueryChange(event.target.value);
            onOpenChange(true);
          }}
          onFocus={() => onOpenChange(true)}
          className="wireframe-input py-2 px-3 pr-10 text-xs font-bold text-black border-black bg-white w-full h-10 focus:ring-0 focus:outline-none uppercase"
        />
        <button
          type="button"
          onClick={() => onOpenChange(!isOpen)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black"
          aria-label="Toggle referral selector"
        >
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => onOpenChange(false)} />
          <div className="absolute left-0 right-0 mt-1 z-50 bg-white border-2 border-black max-h-48 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-[9px]">
            <div
              onClick={() => onSelectReferral('')}
              className="p-2 hover:bg-black hover:text-white cursor-pointer font-black border-b border-black/10 bg-zinc-50 text-black"
            >
              NONE / NEW REFERRAL
            </div>
            {referrals.map((referral) => (
              <div
                key={referral.id}
                onClick={() => onSelectReferral(referral.id)}
                className="p-2 hover:bg-black hover:text-white cursor-pointer font-bold border-b border-black/10 bg-white text-black"
              >
                <div className="flex justify-between items-center">
                  <span>{referral.code} - {referral.patientName}</span>
                  <span className="text-[7px] px-1 font-black bg-black text-white">{referral.specialist}</span>
                </div>
              </div>
            ))}
            {referrals.length === 0 && (
              <div className="p-2 text-zinc-400 font-bold bg-white text-center">No referrals found</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
