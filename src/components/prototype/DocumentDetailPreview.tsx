"use client";

import React from 'react';
import { FileText, HardDrive, ShieldCheck } from 'lucide-react';

export interface DocumentDetailPreviewItem {
  name: string;
  sender: string;
  date: string;
  size: string;
}

type DocumentDetailPreviewProps = {
  documentItem: DocumentDetailPreviewItem;
  onToast: (message: string) => void;
}

export function DocumentDetailPreview({ documentItem, onToast }: DocumentDetailPreviewProps) {
  const isImage = documentItem.name.toLowerCase().endsWith('.jpg') || documentItem.name.toLowerCase().endsWith('.png');
  const isPdf = documentItem.name.toLowerCase().endsWith('.pdf');
  const isDcm = documentItem.name.toLowerCase().endsWith('.dcm');
  const isZip = documentItem.name.toLowerCase().endsWith('.zip');

  if (isImage) {
    return (
      <div className="w-full aspect-[16/9] border-4 border-black bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden text-green-500 font-mono text-[9px] uppercase">
        {/* Mock X-Ray Radiograph Grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="border border-green-500/30 p-4 rounded-lg flex flex-col items-center gap-2 max-w-lg w-full bg-black/40 z-10">
          <span className="font-bold text-xs tracking-wider text-green-400 animate-pulse">PANORAMIC RADIOGRAPH PREVIEW</span>
          <div className="w-full h-32 border-2 border-green-500/20 rounded flex items-center justify-center relative bg-zinc-900 overflow-hidden">
            {/* Dental arches visualization mockup */}
            <svg className="w-64 h-24 text-green-500 opacity-60" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="0.5">
              <path d="M 10,35 Q 50,5 90,35" strokeDasharray="1,1" />
              <path d="M 15,30 Q 50,8 85,30" />
              {/* Mock Teeth lines */}
              {Array.from({ length: 16 }).map((_, i) => (
                <line 
                  key={i} 
                  x1={20 + i * 4} 
                  y1={18 + (Math.sin(i / 2) * 2)} 
                  x2={20 + i * 4} 
                  y2={26 - (Math.sin(i / 2) * 2)} 
                  strokeWidth="0.75"
                />
              ))}
            </svg>
            <div className="absolute top-2 left-2 text-[7px] text-green-400">R</div>
            <div className="absolute top-2 right-2 text-[7px] text-green-400">L</div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full text-[8px] border-t border-green-500/20 pt-2 text-green-400/80">
            <div>PATIENT: ALICE COOPER</div>
            <div>DATE: 05/18/2026</div>
            <div>SCAN TYPE: DIGITAL PANO</div>
            <div>RESOLUTION: 2400 X 1200</div>
          </div>
        </div>

        <div className="absolute bottom-2 right-4 text-[7px] text-zinc-500">
          drTalk Secure Medical Scan Viewer v1.0
        </div>
      </div>
    );
  }

  if (isPdf) {
    return (
      <div className="w-full min-h-[360px] border-4 border-black bg-white flex flex-col justify-between p-8 relative uppercase text-black font-sans">
        <div className="space-y-6">
          <div className="flex justify-between items-start border-b-2 border-black pb-4">
            <div>
              <h3 className="font-black text-sm tracking-tight">CLINICAL DOCUMENT REVIEW</h3>
              <p className="text-[8px] font-bold text-muted-foreground">DOCUMENT SECURED BY DRTALK SAFE-PHI</p>
            </div>
            <ShieldCheck size={28} className="text-black" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-[10px] bg-zinc-50 p-4 border border-black/10">
            <div>
              <span className="font-bold text-muted-foreground block text-[8px]">SENDER</span>
              <span className="font-black">{documentItem.sender}</span>
            </div>
            <div>
              <span className="font-bold text-muted-foreground block text-[8px]">DATE RECEIVED</span>
              <span className="font-black">{documentItem.date}</span>
            </div>
            <div>
              <span className="font-bold text-muted-foreground block text-[8px]">FILE TYPE</span>
              <span className="font-black">PDF DOCUMENT (.PDF)</span>
            </div>
            <div>
              <span className="font-bold text-muted-foreground block text-[8px]">FILE SIZE</span>
              <span className="font-black">{documentItem.size}</span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="font-black text-[10px] block border-b border-black/10 pb-1">DOCUMENT EXCERPTS</span>
            <div className="space-y-2 font-mono text-[9px] text-zinc-600 bg-zinc-50/50 p-3 rounded border border-dashed border-black/10">
              <p className="leading-relaxed">
                &gt; [PATIENT REFERRAL CASE SUMMARY]
              </p>
              <p className="leading-relaxed">
                &gt; DIAGNOSIS: TOOTH #14 - PREVIOUS INCOMPLETE ENDODONTIC THERAPY. PERSISTENT APICAL PERIODONTITIS WITH INTACT CORONAL RESTORATION.
              </p>
              <p className="leading-relaxed">
                &gt; PLAN: RE-TREATMENT ADVISABLE TO RESOLVE PERSISTENT DRAINAGE SYMPTOMS.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 pt-4 flex justify-between items-center text-[8px] text-muted-foreground font-mono">
          <span>SECURE PHI IDENTIFIER: DRT-90218-PDF</span>
          <span>PAGE 1 OF 1</span>
        </div>
      </div>
    );
  }

  if (isDcm || isZip) {
    return (
      <div className="w-full aspect-[16/9] border-4 border-black bg-zinc-900 flex flex-col items-center justify-center p-6 relative overflow-hidden text-zinc-400 font-mono text-[9px] uppercase">
        <div className="absolute inset-0 bg-zinc-950/20 [background-size:20px_20px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"></div>
        
        <div className="border border-zinc-700/30 p-6 rounded flex flex-col items-center gap-4 max-w-sm w-full bg-zinc-950/80 z-10 text-center">
          <HardDrive size={32} className="text-zinc-500 animate-pulse" />
          <div className="space-y-1">
            <span className="font-black text-xs text-white tracking-wider block">DICOM CBCT VOLUME DATA</span>
            <span className="text-[8px] text-zinc-500 block">MULTI-SLICE 3D MANDIBULAR DENSE SCAN</span>
          </div>
          
          <div className="w-full grid grid-cols-3 gap-1 border border-zinc-800 p-1 bg-zinc-900">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-square bg-zinc-950 border border-zinc-800 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border border-dashed border-zinc-800/40"></div>
                </div>
                <span className="absolute bottom-1 right-1 text-[6px] text-zinc-600">SL {12 + i * 8}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onToast(`Initializing DICOM 3D Volume Viewer...`)}
            className="w-full py-2 bg-white text-black text-[9px] font-black uppercase tracking-wider hover:bg-zinc-200 transition-colors"
          >
            LAUNCH 3D VOLUME SLICER
          </button>
        </div>

        <div className="absolute bottom-2 left-4 text-[7px] text-zinc-600">
          SECURE HEALTH DATA ARCHIVE STORAGE
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-[16/9] border-4 border-black bg-zinc-50 flex flex-col items-center justify-center p-6 text-center">
      <FileText size={40} className="text-black mb-2" />
      <span className="font-black uppercase text-xs block">{documentItem.name}</span>
      <span className="text-[9px] font-bold text-muted-foreground uppercase mt-1">{documentItem.size} • DOCUMENT</span>
    </div>
  );
};
