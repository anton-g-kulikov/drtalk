"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, Send } from 'lucide-react';
import { getChannels, type Channel } from '@/lib/referrals';

type ForwardDocumentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentSize: string;
  isDentist: boolean;
  isMessage?: boolean;
  onConfirmForward: (
    targets: { name: string; isCustom?: boolean; customType?: 'email' | 'fax' }[],
    note: string
  ) => void;
};

export function ForwardDocumentModal({
  isOpen,
  onClose,
  documentName,
  documentSize,
  isDentist,
  isMessage = false,
  onConfirmForward,
}: ForwardDocumentModalProps) {
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [practiceSearchQuery, setPracticeSearchQuery] = useState('');
  const [isPracticeDropdownOpen, setIsPracticeDropdownOpen] = useState(false);
  const [note, setNote] = useState('');

  // Load channels from active channels
  const [practices, setPractices] = useState<Channel[]>([]);

  useEffect(() => {
    if (isOpen) {
      const activeChannels = getChannels(isDentist);
      const allActive = activeChannels.filter(c => !c.isArchived);
      setPractices(allActive);
      // Reset state
      setSelectedPractices([]);
      setPracticeSearchQuery('');
      setNote('');
    }
  }, [isOpen, isDentist, isMessage]);

  if (!isOpen) return null;

  const filteredPractices = practices
    .filter(p => p.name.toLowerCase().includes(practiceSearchQuery.toLowerCase()))
    .filter(p => !selectedPractices.includes(p.name));

  const canSubmit = selectedPractices.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const targets = selectedPractices.map(name => ({ name }));
    onConfirmForward(targets, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white border-4 border-black max-w-md w-full p-6 space-y-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200 text-black">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-black pb-2">
          <h4 className="font-black uppercase text-sm tracking-tight italic text-black">
            {isMessage ? 'Forward Message' : 'Forward Document'}
          </h4>
          <button
            onClick={onClose}
            className="text-xs font-black uppercase hover:underline text-black"
          >
            Close
          </button>
        </div>

        {/* Document/Message details */}
        <div className="space-y-1">
          <p className="text-[8px] font-bold text-muted-foreground uppercase text-black">
            {isMessage ? 'Message Content' : 'Document to Forward'}
          </p>
          <div className="p-3 border-2 border-black bg-zinc-50 font-mono text-[10px] break-all text-black flex justify-between items-center">
            <span>{documentName}</span>
            {!isMessage && documentSize && (
              <span className="shrink-0 text-[8px] bg-zinc-200 border border-zinc-400 px-1 font-bold text-zinc-600 ml-2">
                {documentSize}
              </span>
            )}
          </div>
        </div>

        {/* Recipients input */}
        <div className="relative">
          <label className="text-[9px] font-black uppercase block mb-1 text-black">
            Select Channel(s) <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-black bg-white p-2 min-h-[40px] text-xs">
            <div className="flex flex-wrap gap-1.5 mb-1">
              {selectedPractices.map((practiceName) => (
                <span key={practiceName} className="px-2 py-0.5 font-bold uppercase text-[8px] border border-black flex items-center gap-1 bg-black text-white">
                  {practiceName}
                  <button
                    type="button"
                    onClick={() => setSelectedPractices(prev => prev.filter(p => p !== practiceName))}
                    className="font-bold ml-1 text-[9px] hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="SEARCH AND ADD CHANNELS..."
                value={practiceSearchQuery}
                onChange={(event) => {
                  setPracticeSearchQuery(event.target.value);
                  setIsPracticeDropdownOpen(true);
                }}
                onFocus={() => setIsPracticeDropdownOpen(true)}
                className="w-full bg-transparent outline-none border-none p-0 focus:ring-0 text-[9px] uppercase font-bold text-black placeholder:text-zinc-400 h-5"
              />
              <button
                type="button"
                onClick={() => setIsPracticeDropdownOpen(!isPracticeDropdownOpen)}
                className="text-black"
              >
                <ChevronDown size={12} className={`transition-transform duration-200 ${isPracticeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {isPracticeDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsPracticeDropdownOpen(false)} />
              <div className="absolute left-0 right-0 mt-1 z-50 bg-white border-2 border-black max-h-40 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-[9px]">
                {filteredPractices.map((practice) => (
                  <div
                    key={practice.id}
                    onClick={() => {
                      setSelectedPractices(prev => [...prev, practice.name]);
                      setPracticeSearchQuery('');
                      setIsPracticeDropdownOpen(false);
                    }}
                    className="p-2 hover:bg-black hover:text-white cursor-pointer font-bold border-b border-black/10 flex justify-between items-center bg-white text-black"
                  >
                    <span>{practice.name}</span>
                    {practice.isExternal && (
                      <span className="text-[6px] px-1 font-black bg-zinc-200 text-black">
                        EXTERNAL
                      </span>
                    )}
                  </div>
                ))}
                {filteredPractices.length === 0 && (
                  <div className="p-2 text-zinc-400 font-bold bg-white text-center">No channels found</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Message Note */}
        <div className="space-y-1">
          <label htmlFor="forward-note" className="text-[9px] font-black uppercase block text-black">
            Add Note / Message (Optional)
          </label>
          <textarea
            id="forward-note"
            rows={3}
            placeholder="ADD A NOTE TO ACCOMPANY THIS DOCUMENT..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="wireframe-input w-full p-2 text-[9px] font-bold uppercase text-black border-2 border-black focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="wireframe-button flex-1 bg-black text-white text-[10px] font-black uppercase py-2.5 hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <Send size={10} /> Forward
          </button>
          <button
            onClick={onClose}
            className="wireframe-button flex-1 bg-white text-black border-2 border-black text-[10px] font-black uppercase py-2.5 hover:bg-zinc-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
