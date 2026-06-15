"use client";

import { ShieldCheck } from 'lucide-react';

type ExternalViewerHeaderProps = {
  referralCode: string;
};

export function ExternalViewerHeader({ referralCode }: ExternalViewerHeaderProps) {
  return (
    <header className="bg-black text-white py-4 px-6 border-b-4 border-black flex justify-between items-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-3">
        <div className="p-1.5 border border-white bg-white/10">
          <ShieldCheck size={20} className="text-green-400 animate-pulse" />
        </div>
        <div>
          <h1 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            drTalk Secure Portal <span className="text-[8px] bg-white text-black px-1.5 py-0.5 border border-black font-black">PHI SECURED</span>
          </h1>
          <p className="text-[8px] text-zinc-400 uppercase font-black mt-0.5">End-to-End Encrypted Verification & Communication</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-[10px] font-black uppercase text-white/70">Case Ref: {referralCode}</p>
        <p className="text-[7px] text-zinc-400 uppercase font-bold">Link expires in 48 hours</p>
      </div>
    </header>
  );
}
