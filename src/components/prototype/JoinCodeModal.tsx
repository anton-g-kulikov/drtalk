"use client";

import React, { useState } from 'react';
import { X, KeyRound, Info, CheckCircle2 } from 'lucide-react';
import { LearningChannel } from '@/types/learningHubTypes';

interface JoinCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: LearningChannel[];
  onJoinSuccess: (channelId: string) => void;
}

export default function JoinCodeModal({ isOpen, onClose, channels, onJoinSuccess }: JoinCodeModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setError('Please enter a channel access code.');
      return;
    }

    // Match code against channels or default mock code
    const foundChannel = channels.find(
      c => c.joinCode?.toUpperCase() === cleanCode || cleanCode === 'DRTALK2026' || cleanCode === 'CSA2026'
    );

    if (foundChannel) {
      setSuccess(`Success! Joining "${foundChannel.name}"...`);
      setTimeout(() => {
        onJoinSuccess(foundChannel.id);
        setCode('');
        setSuccess('');
        onClose();
      }, 1000);
    } else {
      setError('Invalid channel code. Please check with your channel host or administrator.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white border-2 border-black p-6 space-y-5 z-10 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 border border-black bg-amber-100">
              <KeyRound size={16} />
            </div>
            <div>
              <h3 className="font-black uppercase text-xs tracking-wider">Join Channel via Code</h3>
              <p className="text-[9px] uppercase text-muted-foreground font-bold">Enter your private invite or access code</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 border border-black hover:bg-black hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-wider block">Access Code</label>
            <input
              type="text"
              placeholder="e.g. CSA2026 or DRTALK2026"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="wireframe-input text-xs font-mono font-bold tracking-widest uppercase"
              autoFocus
            />
            <p className="text-[8px] text-muted-foreground uppercase flex items-center gap-1">
              <Info size={10} /> Private channels require an authorization code from the host.
            </p>
          </div>

          {error && (
            <div className="p-2 border border-red-500 bg-red-50 text-red-700 text-[9px] font-bold uppercase">
              {error}
            </div>
          )}

          {success && (
            <div className="p-2 border border-green-500 bg-green-50 text-green-800 text-[9px] font-bold uppercase flex items-center gap-1.5">
              <CheckCircle2 size={12} /> {success}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-black border-dashed">
            <button
              type="button"
              onClick={onClose}
              className="wireframe-button text-[9px] uppercase py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="wireframe-button bg-black text-white text-[9px] uppercase py-2 px-5 font-black"
            >
              Submit Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
