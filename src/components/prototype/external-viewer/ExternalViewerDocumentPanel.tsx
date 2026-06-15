"use client";

import { Download } from 'lucide-react';
import type { UnifiedReferral } from '@/lib/referrals';
import type { ExternalViewerDocument } from '@/prototype/externalViewerState';

type ExternalViewerDocumentPanelProps = {
  referral: UnifiedReferral;
  documents: ExternalViewerDocument[];
  activeDocument: ExternalViewerDocument | null;
  onActiveDocumentChange: (documentItem: ExternalViewerDocument) => void;
  onToast: (message: string) => void;
};

export function ExternalViewerDocumentPanel({
  referral,
  documents,
  activeDocument,
  onActiveDocumentChange,
  onToast,
}: ExternalViewerDocumentPanelProps) {
  const patientToken = referral.patientName.replace(/\s+/g, '_').toUpperCase();

  return (
    <div className="wireframe-card bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col min-h-[400px]">
      <div className="p-4 border-b-2 border-black bg-gray-50 flex items-center justify-between flex-wrap gap-2">
        <span className="text-[10px] font-black uppercase text-black">Documents Provided ({documents.length})</span>
        <div className="flex gap-2">
          {documents.map((documentItem) => (
            <button
              key={documentItem.id}
              onClick={() => onActiveDocumentChange(documentItem)}
              className={`px-3 py-1 text-[9px] font-black uppercase border-2 border-black transition-all ${
                activeDocument?.id === documentItem.id ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-zinc-100'
              }`}
            >
              {documentItem.name.replace(`_${patientToken}`, '')}
            </button>
          ))}
        </div>
      </div>

      {activeDocument ? (
        <div className="flex-1 p-6 flex flex-col justify-between bg-zinc-50 border-b border-black">
          <div className="flex-1 flex items-center justify-center min-h-[300px]">
            {activeDocument.type === 'image' ? (
              <div className="w-full max-w-md bg-black p-4 border-2 border-white flex flex-col items-center">
                <div className="w-full flex justify-between text-[7px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-800 pb-1">
                  <span>PATIENT: {referral.patientName.toUpperCase()}</span>
                  <span>CBCT SCAN</span>
                  <span>T-#14 RADIOGRAPHY</span>
                </div>

                <svg viewBox="0 0 400 200" className="w-full h-auto text-white">
                  <path d="M 40 160 Q 200 200 360 160" fill="none" stroke="#333" strokeWidth="6" strokeDasharray="5,5" />
                  <g transform="translate(0, 40)" fill="none" stroke="#eee" strokeWidth="2">
                    <path d="M 50 40 Q 60 5 70 40" />
                    <path d="M 75 40 Q 85 5 95 40" />
                    <path d="M 100 40 Q 110 5 120 40" />
                    <path d="M 125 40 Q 135 5 145 40" />
                    <g className="animate-pulse">
                      <path d="M 150 40 Q 160 5 170 40" stroke="#ff3333" strokeWidth="3" />
                      <circle cx="160" cy="15" r="8" fill="rgba(255, 0, 0, 0.2)" stroke="#ff3333" strokeWidth="1" />
                      <line x1="160" y1="15" x2="200" y2="-10" stroke="#ff3333" strokeWidth="1" strokeDasharray="2,2" />
                      <text x="205" y="-6" fill="#ff3333" fontSize="8" fontFamily="monospace" fontWeight="bold">TOOTH #14 DECAY</text>
                    </g>
                    <path d="M 175 40 Q 185 5 195 40" />
                    <path d="M 205 40 Q 215 5 225 40" />
                    <path d="M 230 40 Q 240 5 250 40" />
                  </g>
                </svg>

                <div className="w-full text-center text-[7px] text-gray-500 font-bold uppercase mt-3">
                  Digital Clinical Radiograph Imaging System
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md bg-white p-6 border-2 border-black text-black">
                <div className="text-center pb-4 border-b-2 border-black mb-4">
                  <h4 className="text-xs font-black uppercase tracking-widest">DRTALK SECURE REF</h4>
                  <p className="text-[7px] font-bold text-muted-foreground uppercase">CLINICAL ATTACHMENT</p>
                </div>

                <div className="space-y-4 text-[8px] uppercase">
                  <div>
                    <p className="font-bold text-gray-400">Reason for Referral:</p>
                    <p className="font-bold text-black mt-1 leading-relaxed border border-black/10 p-2 bg-zinc-50">
                      &quot;Patient presents with localized thermal sensitivity and periapical lesion on Tooth #14. Please evaluate for endodontic root canal therapy or retreatment.&quot;
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold text-gray-400">Sender:</p>
                      <p className="font-bold text-black">{referral.dentist} ({referral.practice || 'Dentist'})</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-400">Recipient:</p>
                      <p className="font-bold text-black">{referral.specialist}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 text-[9px] uppercase font-bold text-muted-foreground">
            <span>Name: {activeDocument.name} • {activeDocument.size}</span>
            <button
              onClick={() => onToast(`Downloading secure file: ${activeDocument.name}`)}
              className="wireframe-button bg-black text-white px-4 py-1.5 text-[9px] font-black uppercase flex items-center gap-1.5"
            >
              <Download size={12} /> Download Original Document
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 text-muted-foreground uppercase text-[10px] font-bold">
          Select a document above to view
        </div>
      )}
    </div>
  );
}
