"use client";

import React from 'react';
import { Lock, ShieldAlert, ArrowLeft } from 'lucide-react';

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName?: string;
  reason?: string;
}

export default function AccessDeniedModal({ isOpen, onClose, channelName, reason }: AccessDeniedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white border-2 border-black p-6 text-center space-y-5 z-10 animate-in fade-in zoom-in-95 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Lock Icon Badge */}
        <div className="w-14 h-14 border-2 border-black bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <Lock size={26} strokeWidth={2.5} />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-base font-black uppercase tracking-tight text-gray-900">Access Denied</h3>
          <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed px-2">
            {reason || `You no longer have access to ${channelName ? `"${channelName}"` : 'this content'}. This could be due to a subscription change or membership update. Please check with the channel host or return to browse available channels.`}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-black border-dashed">
          <button
            onClick={onClose}
            className="w-full wireframe-button bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase py-2.5 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={12} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
