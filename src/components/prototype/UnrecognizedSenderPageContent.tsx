'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, ChevronDown, FileText } from 'lucide-react';
import { DocumentViewerTab } from '@/components/prototype/DocumentViewerTab';
import { getNetwork, type NetworkPractice } from '@/lib/referrals';

export type UnrecognizedItemType = 'referral' | 'document' | 'spam';

export interface UnrecognizedDocData {
  id: string;
  name: string;
  size: string;
  transport: 'Email' | 'Fax' | 'App';
  sender?: string;
  date?: string;
}

interface UnrecognizedSenderPageContentProps {
  doc: UnrecognizedDocData;
  onConfirm: (values: { senderPractice: string; patientName: string; itemType: UnrecognizedItemType }) => void;
  onCancel: () => void;
}

/** Try to pull a patient name out of an ALL_CAPS filename like
 *  EFAX_REFERRAL_JANE_DOE.PDF → "Jane Doe" */
function guessPatientName(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, '');
  const tokens = withoutExt.split(/[_\-\s]+/);
  const stopWords = new Set([
    'EFAX', 'FAX', 'SECURE', 'EMAIL', 'REFERRAL', 'ATTACHMENT',
    'UNVERIFIED', 'UNKNOWN', 'PATIENT', 'RECORDS', 'UNIDENTIFIED',
    'INCOMING', 'NO', 'PRACTICE', 'ID', 'SCAN', 'CBCT', 'PANO',
    'PDF', 'ZIP', 'DOCUMENT', 'FILE',
  ]);
  const nameParts = tokens.filter(t => t.length > 1 && !stopWords.has(t.toUpperCase()));
  if (nameParts.length >= 2) {
    return nameParts
      .slice(0, 2)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ');
  }
  return '';
}

export function UnrecognizedSenderPageContent({ doc, onConfirm, onCancel }: UnrecognizedSenderPageContentProps) {
  const [senderPractice, setSenderPractice] = useState('');
  const [practiceSearch, setPracticeSearch] = useState('');
  const [showPracticeDropdown, setShowPracticeDropdown] = useState(false);
  const [connectedPractices, setConnectedPractices] = useState<NetworkPractice[]>([]);
  const [patientName, setPatientName] = useState('');
  const [itemType, setItemType] = useState<UnrecognizedItemType>('referral');
  const [submitted, setSubmitted] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  useEffect(() => {
    setPatientName(guessPatientName(doc.name));
  }, [doc.name]);

  useEffect(() => {
    const connected = getNetwork()
      .filter((practice) => practice.status === 'Connected')
      .reduce<NetworkPractice[]>((acc, practice) => {
        if (acc.some((existing) => existing.name.toLowerCase() === practice.name.toLowerCase())) return acc;
        acc.push(practice);
        return acc;
      }, []);
    setConnectedPractices(connected);
  }, []);

  const canSubmit = itemType === 'spam' || senderPractice.trim().length > 0;
  const normalizedSearch = practiceSearch.trim().toLowerCase();
  const visiblePractices = connectedPractices.filter((practice) =>
    practice.name.toLowerCase().includes(normalizedSearch)
  );
  const exactMatch = connectedPractices.some(
    (practice) => practice.name.toLowerCase() === senderPractice.trim().toLowerCase()
  );
  const canCreateFromSearch = practiceSearch.trim().length > 1 && !connectedPractices.some(
    (practice) => practice.name.toLowerCase() === normalizedSearch
  );

  const handleConfirm = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => {
      onConfirm({ senderPractice: senderPractice.trim(), patientName: patientName.trim(), itemType });
    }, 900);
  };

  const triggerDownload = () => {
    setDownloadToast(`Downloading "${doc.name}"…`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-black text-white">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-black uppercase tracking-tight">Unrecognized Sender</h1>
              <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-zinc-900 text-white border border-black tracking-wider">
                Action Required
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
              Review the attached document and provide missing sender details to categorize this item
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase text-black hover:text-zinc-600 transition-colors shrink-0"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>
      </div>

      {/* Received info strip */}
      <div className="flex items-center gap-6 px-4 py-3 bg-zinc-50 border-2 border-dashed border-black">
        <div className="flex items-center gap-2">
          <AlertTriangle size={12} className="text-black" />
          <span className="text-[9px] font-black uppercase">Received via {doc.transport}</span>
        </div>
        <span className="text-[8px] font-bold uppercase text-zinc-500">Sender not identified</span>
        {doc.date && <span className="text-[8px] font-bold uppercase text-zinc-500">{doc.date}</span>}
        <div className="flex items-center gap-2 ml-auto">
          <FileText size={12} className="text-black shrink-0" />
          <span className="text-[9px] font-black uppercase truncate max-w-[220px]">{doc.name}</span>
          <span className="text-[8px] font-bold uppercase text-zinc-500">{doc.size}</span>
        </div>
      </div>

      {/* Main content: document + form side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

        {/* Left: Document viewer */}
        <div className="wireframe-card p-0 overflow-hidden bg-white">
          <DocumentViewerTab
            documentName={doc.name}
            documentSize={doc.size}
            documentType={doc.name.split('.').pop() || 'pdf'}
            sentBy={`Unknown (${doc.transport})`}
            sentAt={doc.date}
            onDownload={triggerDownload}
          />
        </div>

        {/* Right: Categorize form */}
        <div className="wireframe-card p-0 bg-white overflow-hidden">
          {/* Form header */}
          <div className="px-6 py-4 border-b-2 border-black bg-zinc-50 flex items-center gap-2">
            <div className="w-2 h-2 bg-black" />
            <span className="text-[10px] font-black uppercase tracking-widest">Categorize &amp; Route</span>
            {!canSubmit && (
              <span className="ml-auto text-[7px] px-1.5 py-0.5 border border-black font-black uppercase text-black">
                Pending
              </span>
            )}
          </div>

          <div className="p-6 space-y-6">

            {/* Sender practice */}
            <div className={`space-y-1.5 transition-opacity duration-200 ${itemType === 'spam' ? 'opacity-40 pointer-events-none' : ''}`}>
              <label className="text-[9px] font-black uppercase tracking-wider block text-black">
                Sender Practice <span className="text-black">*</span>
              </label>
              <div className="space-y-2 border-2 border-black p-3 bg-gray-50/50 relative">
                <div className="border-2 border-black bg-white p-2 min-h-[40px] text-xs">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled={itemType === 'spam'}
                      value={practiceSearch}
                      onChange={(event) => {
                        const next = event.target.value;
                        setPracticeSearch(next);
                        if (!next.trim()) {
                          setSenderPractice('');
                        } else {
                          setSenderPractice(next);
                        }
                        setShowPracticeDropdown(true);
                      }}
                      onFocus={() => setShowPracticeDropdown(true)}
                      placeholder="TYPE TO SEARCH AND ADD PRACTICE..."
                      className="w-full bg-transparent outline-none border-none p-0 focus:ring-0 text-[10px] uppercase font-bold text-black placeholder:text-zinc-400 h-5"
                    />
                    <button
                      type="button"
                      disabled={itemType === 'spam'}
                      aria-label="Toggle practice dropdown"
                      onClick={() => setShowPracticeDropdown(!showPracticeDropdown)}
                      className="text-black text-left"
                    >
                      <ChevronDown size={14} className={`transition-transform duration-200 ${showPracticeDropdown ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {showPracticeDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowPracticeDropdown(false)} />
                    <div className="absolute left-3 right-3 top-[100%] z-50 bg-white border-2 border-black max-h-52 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-[9px]">
                      {visiblePractices.map((practice) => (
                        <button
                          key={practice.id}
                          type="button"
                          onClick={() => {
                            setSenderPractice(practice.name);
                            setPracticeSearch(practice.name);
                            setShowPracticeDropdown(false);
                          }}
                          className="w-full p-2 hover:bg-black hover:text-white cursor-pointer font-bold border-b border-black/10 flex justify-between items-center bg-white text-black text-left"
                        >
                          <span>{practice.name}</span>
                          <span className="text-[7px] text-zinc-500">{practice.specialty}</span>
                        </button>
                      ))}
                      {canCreateFromSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            const newPractice = practiceSearch.trim();
                            setSenderPractice(newPractice);
                            setPracticeSearch(newPractice);
                            setShowPracticeDropdown(false);
                          }}
                          className="w-full p-2 hover:bg-black hover:text-white cursor-pointer font-bold border-b border-black/10 bg-white text-black text-left"
                        >
                          Create new practice: {practiceSearch.trim()}
                        </button>
                      )}
                      {visiblePractices.length === 0 && !canCreateFromSearch && (
                        <div className="p-2 text-zinc-400 font-bold bg-white text-center">No practices found</div>
                      )}
                    </div>
                  </>
                )}

                {senderPractice && (
                  <div className="p-2 bg-black text-white text-[10px] font-black uppercase tracking-tight flex justify-between items-center">
                    <span>Selected: {senderPractice}</span>
                    {!exactMatch && <span className="text-[8px] opacity-70">New</span>}
                  </div>
                )}
              </div>
              <p className="text-[8px] text-muted-foreground uppercase font-bold">
                Enter the name of the sending practice to create or link a channel
              </p>
            </div>

            {/* Patient name */}
            <div className={`space-y-1.5 transition-opacity duration-200 ${itemType === 'spam' ? 'opacity-40 pointer-events-none' : ''}`}>
              <label className="text-[9px] font-black uppercase tracking-wider block text-black">
                Patient Name
              </label>
              <input
                type="text"
                disabled={itemType === 'spam'}
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="PATIENT NAME (IF APPLICABLE)..."
                className="wireframe-input w-full p-3 text-xs uppercase text-black border-2 border-black outline-none focus:ring-0"
              />
            </div>

            {/* Item type */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-wider block text-black">
                Categorize As
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => setItemType('referral')}
                  className={`p-3 border-2 text-left transition-all ${
                    itemType === 'referral'
                      ? 'border-black bg-black text-white'
                      : 'border-black bg-white text-black hover:bg-zinc-50'
                  }`}
                >
                  <p className="font-black uppercase text-[10px]">Referral Case</p>
                  <p className={`text-[8px] uppercase mt-0.5 ${itemType === 'referral' ? 'opacity-70' : 'text-muted-foreground'}`}>
                    Creates a per-case channel
                  </p>
                </button>
                <button
                  onClick={() => setItemType('document')}
                  className={`p-3 border-2 text-left transition-all ${
                    itemType === 'document'
                      ? 'border-black bg-black text-white'
                      : 'border-black bg-white text-black hover:bg-zinc-50'
                  }`}
                >
                  <p className="font-black uppercase text-[10px]">Document</p>
                  <p className={`text-[8px] uppercase mt-0.5 ${itemType === 'document' ? 'opacity-70' : 'text-muted-foreground'}`}>
                    Routes to practice channel
                  </p>
                </button>
                <button
                  onClick={() => setItemType('spam')}
                  className={`p-3 border-2 text-left transition-all ${
                    itemType === 'spam'
                      ? 'border-black bg-black text-white'
                      : 'border-black bg-white text-black hover:bg-zinc-50'
                  }`}
                >
                  <p className="font-black uppercase text-[10px]">Spam / Dismiss</p>
                  <p className={`text-[8px] uppercase mt-0.5 ${itemType === 'spam' ? 'opacity-70' : 'text-muted-foreground'}`}>
                    Permanently dismisses this item
                  </p>
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleConfirm}
                disabled={!canSubmit || submitted}
                className={`flex-1 text-[10px] font-black uppercase py-3.5 transition-all flex items-center justify-center gap-2 border-2 ${
                  submitted
                    ? 'bg-black text-white border-black cursor-default'
                    : canSubmit
                    ? 'bg-black text-white border-black hover:bg-zinc-800'
                    : 'bg-zinc-100 text-zinc-400 border-zinc-300 cursor-not-allowed'
                }`}
              >
                {submitted ? (
                  <>
                    <CheckCircle2 size={14} />
                    Categorized!
                  </>
                ) : (
                  'Confirm & Categorize'
                )}
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-white text-black border-2 border-black text-[10px] font-black uppercase py-3.5 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Download toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-2 text-[9px] font-black uppercase tracking-widest border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
          {downloadToast}
        </div>
      )}
    </div>
  );
}
