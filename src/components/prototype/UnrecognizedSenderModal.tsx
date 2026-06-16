'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X, FileText, CheckCircle2 } from 'lucide-react';

export type UnrecognizedItemType = 'referral' | 'document';

export interface UnrecognizedSenderFormValues {
  senderPractice: string;
  patientName: string;
  itemType: UnrecognizedItemType;
}

interface UnrecognizedSenderModalProps {
  documentName: string;
  documentSize: string;
  transport: 'Email' | 'Fax' | 'App';
  onClose: () => void;
  onConfirm: (values: UnrecognizedSenderFormValues) => void;
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

export function UnrecognizedSenderModal({
  documentName,
  documentSize,
  transport,
  onClose,
  onConfirm,
}: UnrecognizedSenderModalProps) {
  const [senderPractice, setSenderPractice] = useState('');
  const [patientName, setPatientName] = useState('');
  const [itemType, setItemType] = useState<UnrecognizedItemType>('referral');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setPatientName(guessPatientName(documentName));
  }, [documentName]);

  const canSubmit = senderPractice.trim().length > 0;

  const handleConfirm = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => {
      onConfirm({ senderPractice: senderPractice.trim(), patientName: patientName.trim(), itemType });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border-4 border-black max-w-lg w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200 text-black overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-black text-white">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="shrink-0" />
            <div>
              <h4 className="font-black uppercase text-sm tracking-tight">Unrecognized Sender</h4>
              <p className="text-[9px] font-bold uppercase opacity-60 tracking-wider">
                Please provide missing details to categorize this item
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-60 transition-opacity"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Document preview */}
          <div className="border-2 border-dashed border-black bg-zinc-50 p-4 flex gap-4 items-start">
            <div className="w-12 h-14 border-2 border-black bg-white flex flex-col items-center justify-center shrink-0">
              <FileText size={22} className="text-black" />
              <span className="text-[7px] font-black uppercase text-black mt-0.5">
                {documentName.split('.').pop()}
              </span>
            </div>
            <div className="space-y-1 min-w-0">
              <p className="font-black uppercase text-xs text-black break-all leading-tight">{documentName}</p>
              <p className="text-[9px] font-bold uppercase text-zinc-500">{documentSize}</p>
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-black text-white text-[8px] font-black uppercase tracking-wider">
                <AlertTriangle size={9} />
                Received via {transport} — Sender not identified
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">

            {/* Sender practice */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider block text-black">
                Sender Practice <span className="text-black">*</span>
              </label>
              <input
                type="text"
                value={senderPractice}
                onChange={e => setSenderPractice(e.target.value)}
                placeholder="PRACTICE NAME..."
                className="wireframe-input w-full p-2.5 text-xs uppercase text-black border-2 border-black outline-none"
              />
              <p className="text-[8px] text-muted-foreground uppercase font-bold">
                Enter the name of the sending practice to create or link a channel
              </p>
            </div>

            {/* Patient name */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider block text-black">
                Patient Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="PATIENT NAME (IF APPLICABLE)..."
                className="wireframe-input w-full p-2.5 text-xs uppercase text-black border-2 border-black outline-none"
              />
            </div>

            {/* Item type */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-wider block text-black">
                Categorize As
              </label>
              <div className="grid grid-cols-2 gap-2">
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
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleConfirm}
              disabled={!canSubmit || submitted}
              className={`wireframe-button flex-1 text-[10px] font-black uppercase py-3 transition-all flex items-center justify-center gap-2 border-2 ${
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
              onClick={onClose}
              className="wireframe-button flex-1 bg-white text-black border-2 border-black text-[10px] font-black uppercase py-3 hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
