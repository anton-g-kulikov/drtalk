"use client";

import { AlertCircle } from 'lucide-react';

type ExternalViewerInvalidLinkProps = {
  onGoHome: () => void;
};

export function ExternalViewerInvalidLink({ onGoHome }: ExternalViewerInvalidLinkProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="wireframe-card p-8 bg-white border-2 border-black max-w-sm w-full text-center space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <AlertCircle size={32} className="mx-auto text-black" />
        <h2 className="text-lg font-black uppercase">Secure Link Expired</h2>
        <p className="text-[10px] text-muted-foreground uppercase leading-relaxed">
          This secure verification link has expired or is invalid. Please contact the sending practice to request a new secure access link.
        </p>
        <button onClick={onGoHome} className="wireframe-button w-full bg-black text-white py-2 text-[10px] uppercase font-black">
          Go to Login Page
        </button>
      </div>
    </div>
  );
}
