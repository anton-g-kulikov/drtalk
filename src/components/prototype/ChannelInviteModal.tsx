"use client";

import React, { useState } from 'react';
import { X, Share2, Copy, Check, Mail, Send } from 'lucide-react';
import { LearningChannel } from '@/types/learningHubTypes';

interface ChannelInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: LearningChannel | null;
}

export default function ChannelInviteModal({ isOpen, onClose, channel }: ChannelInviteModalProps) {
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [sentMessage, setSentMessage] = useState(false);

  if (!isOpen || !channel) return null;

  const inviteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/academy?channel=${channel.id}`
    : `https://drtalk.com/academy?channel=${channel.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSentMessage(true);
    setTimeout(() => {
      setEmailInput('');
      setSentMessage(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white border-2 border-black p-6 space-y-5 z-10 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 border border-black bg-blue-50">
              <Share2 size={16} />
            </div>
            <div>
              <h3 className="font-black uppercase text-xs tracking-wider">Invite Colleagues</h3>
              <p className="text-[9px] uppercase text-muted-foreground font-bold">Share "{channel.name}"</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 border border-black hover:bg-black hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Copy Share Link */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-wider block text-muted-foreground">Channel Share Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="wireframe-input text-[10px] font-mono font-bold flex-1 bg-gray-50"
            />
            <button
              onClick={handleCopy}
              className="wireframe-button bg-black text-white text-[9px] uppercase py-2 px-3 flex items-center gap-1 shrink-0"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {channel.joinCode && (
          <div className="border border-black bg-yellow-50 p-3 space-y-1">
            <span className="text-[8px] font-black uppercase text-yellow-800 tracking-wider block">Access Code Required</span>
            <p className="text-[10px] font-mono font-black uppercase">Code: {channel.joinCode}</p>
          </div>
        )}

        {/* Email / Direct Invite Form */}
        <form onSubmit={handleSendEmail} className="space-y-3 border-t border-black border-dashed pt-4">
          <label className="text-[9px] font-black uppercase tracking-wider block text-muted-foreground">Send Direct Email Invite</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="colleague@dentalpractice.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="wireframe-input text-xs font-bold w-full pl-8"
                required
              />
              <Mail size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <button
              type="submit"
              className="wireframe-button bg-black text-white text-[9px] uppercase py-2 px-4 flex items-center gap-1"
            >
              <Send size={12} /> Send
            </button>
          </div>

          {sentMessage && (
            <p className="text-[9px] font-bold text-green-700 uppercase bg-green-50 p-2 border border-green-500">
              Invite sent successfully to {emailInput}!
            </p>
          )}
        </form>

        <div className="flex justify-end pt-2 border-t border-black">
          <button
            onClick={onClose}
            className="wireframe-button text-[9px] uppercase py-1.5 px-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
