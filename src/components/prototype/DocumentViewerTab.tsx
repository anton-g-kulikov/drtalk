'use client';

import { Download, FileText, ZoomIn, ZoomOut, RotateCw, Image as ImageIcon, Archive } from 'lucide-react';
import { useState } from 'react';

interface DocumentViewerTabProps {
  documentName: string;
  documentSize: string;
  documentType: string;
  sentBy?: string;
  sentAt?: string;
  onDownload?: () => void;
}

export function DocumentViewerTab({
  documentName,
  documentSize,
  documentType,
  sentBy,
  sentAt,
  onDownload,
}: DocumentViewerTabProps) {
  const [zoom, setZoom] = useState(100);

  const ext = documentName.split('.').pop()?.toUpperCase() || documentType.toUpperCase();
  const isPdf = ext === 'PDF';
  const isImage = ext === 'PNG' || ext === 'JPG' || ext === 'JPEG';
  const isZip = ext === 'ZIP';
  const isDcm = ext === 'DCM';

  return (
    <div className="flex flex-col h-full min-h-[520px]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-black bg-zinc-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <FileText size={14} className="text-black" />
            <span className="text-[10px] font-black uppercase tracking-wider text-black truncate max-w-[280px]">
              {documentName}
            </span>
          </div>
          <span className="text-[8px] font-bold uppercase text-zinc-500 border border-zinc-300 px-1.5 py-0.5">
            {ext} • {documentSize}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {(isPdf || isImage) && (
            <>
              <button
                onClick={() => setZoom(z => Math.max(50, z - 25))}
                className="p-1 border border-black hover:bg-black hover:text-white transition-colors"
                title="Zoom out"
              >
                <ZoomOut size={12} />
              </button>
              <span className="text-[9px] font-black uppercase w-10 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(200, z + 25))}
                className="p-1 border border-black hover:bg-black hover:text-white transition-colors"
                title="Zoom in"
              >
                <ZoomIn size={12} />
              </button>
              <div className="w-px h-4 bg-black/20 mx-1" />
              <button
                className="p-1 border border-black hover:bg-black hover:text-white transition-colors"
                title="Rotate"
              >
                <RotateCw size={12} />
              </button>
              <div className="w-px h-4 bg-black/20 mx-1" />
            </>
          )}
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-wider hover:bg-zinc-800 transition-colors border-2 border-black"
          >
            <Download size={11} />
            Download
          </button>
        </div>
      </div>

      {/* Meta info strip */}
      {(sentBy || sentAt) && (
        <div className="px-4 py-2 bg-white border-b border-black/10 flex items-center gap-4 shrink-0">
          {sentBy && (
            <span className="text-[8px] font-bold uppercase text-zinc-500">
              <span className="text-zinc-400">From: </span>{sentBy}
            </span>
          )}
          {sentAt && (
            <span className="text-[8px] font-bold uppercase text-zinc-500">
              <span className="text-zinc-400">Received: </span>{sentAt}
            </span>
          )}
        </div>
      )}

      {/* Document preview area */}
      <div className="flex-1 bg-zinc-100 overflow-auto flex items-start justify-center p-6">
        <div
          className="bg-white border border-zinc-300 shadow-sm transition-transform origin-top"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', minWidth: 560 }}
        >
          {isPdf && <PdfMockPreview name={documentName} />}
          {isImage && <ImageMockPreview name={documentName} />}
          {isZip && <ZipMockPreview name={documentName} size={documentSize} />}
          {isDcm && <DicomMockPreview name={documentName} />}
          {!isPdf && !isImage && !isZip && !isDcm && (
            <GenericDocMockPreview name={documentName} ext={ext} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Mock preview components ─── */

function PdfMockPreview({ name }: { name: string }) {
  const isReferral = name.toUpperCase().includes('REFERRAL');
  const isClinical = name.toUpperCase().includes('CLINICAL') || name.toUpperCase().includes('HISTORY');
  const isConsent = name.toUpperCase().includes('CONSENT');

  return (
    <div className="w-[560px] min-h-[720px] p-10 font-mono text-[10px] leading-relaxed">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
        <div>
          <p className="font-black text-sm uppercase tracking-tight">
            {isReferral ? 'REFERRAL FORM' : isClinical ? 'CLINICAL HISTORY' : isConsent ? 'PATIENT CONSENT' : 'DOCUMENT'}
          </p>
          <p className="text-zinc-500 text-[9px] uppercase mt-0.5">Valley Endodontics — Secure Document</p>
        </div>
        <div className="text-right text-[9px] text-zinc-500 uppercase">
          <p>Ref #: {name.replace(/\.[^.]+$/, '').slice(-8).toUpperCase()}</p>
          <p>Date: 06/30/2026</p>
          <p className="mt-0.5 font-bold text-black">[CONFIDENTIAL]</p>
        </div>
      </div>

      {/* Content blocks */}
      <div className="space-y-5">
        {isReferral && (
          <>
            <SectionBlock title="Patient Information">
              <FieldRow label="Full Name" value="Julia Thomas" />
              <FieldRow label="Date of Birth" value="May 14, 1985" />
              <FieldRow label="Phone" value="(555) 012-3456" />
              <FieldRow label="Insurance" value="BlueCross PPO — ID #BCB-1948-TH" />
            </SectionBlock>
            <SectionBlock title="Referring Practice">
              <FieldRow label="Practice" value="Miller & Associates" />
              <FieldRow label="Dentist" value="Dr. Robinson" />
              <FieldRow label="Phone" value="(602) 555-9900" />
            </SectionBlock>
            <SectionBlock title="Clinical Notes">
              <p className="text-[9px] leading-relaxed text-zinc-700 italic">
                Patient presenting with persistent pain in upper left molar (Tooth #14). 
                Periapical radiograph indicates possible periapical pathology. Recommend 
                endodontic evaluation for retreatment of prior root canal. Patient has been 
                informed and consents to specialist consultation.
              </p>
            </SectionBlock>
            <SectionBlock title="Signature">
              <div className="border-b border-zinc-300 w-48 mt-4 mb-1" />
              <p className="text-[8px] text-zinc-500 uppercase">Dr. Robinson — License #AZ-1291</p>
            </SectionBlock>
          </>
        )}
        {isClinical && (
          <>
            <SectionBlock title="Medical History">
              <FieldRow label="Allergies" value="None known" />
              <FieldRow label="Medications" value="Lisinopril 10mg daily" />
              <FieldRow label="Conditions" value="Hypertension (controlled)" />
            </SectionBlock>
            <SectionBlock title="Dental History">
              <FieldRow label="Last Visit" value="12/15/2025" />
              <FieldRow label="Prior Procedures" value="Root Canal — Tooth #14 (2021)" />
              <FieldRow label="Radiographs" value="Periapical — 06/28/2026" />
            </SectionBlock>
          </>
        )}
        {!isReferral && !isClinical && !isConsent && (
          <SectionBlock title="Document Contents">
            <p className="text-[9px] text-zinc-600 italic leading-relaxed">
              This document contains clinical information related to the referral case.
              Please review carefully before processing.
            </p>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-2 bg-zinc-100 rounded mt-2" style={{ width: `${60 + (i % 3) * 15}%` }} />
            ))}
          </SectionBlock>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-4 border-t border-zinc-200 text-[8px] text-zinc-400 uppercase flex justify-between">
        <span>SECURE DOCUMENT — drTalk PLATFORM</span>
        <span>PAGE 1 OF 1</span>
      </div>
    </div>
  );
}

function ImageMockPreview({ name }: { name: string }) {
  const isPano = name.toUpperCase().includes('PANO');
  const isCbct = name.toUpperCase().includes('CBCT');
  const isXray = name.toUpperCase().includes('XRAY') || name.toUpperCase().includes('X-RAY');

  return (
    <div className="w-[560px]">
      <div className="bg-zinc-900 flex items-center justify-center" style={{ height: 380 }}>
        {isPano ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-8">
            <p className="text-zinc-500 text-[8px] uppercase font-bold tracking-widest">Panoramic Radiograph</p>
            {/* Simulated panoramic */}
            <div className="w-full h-32 bg-zinc-800 rounded relative overflow-hidden border border-zinc-700">
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center mx-1">
                    <div className="w-3 bg-zinc-600 rounded-t" style={{ height: 24 + Math.sin(i * 0.8) * 10 }} />
                    <div className="w-3.5 bg-zinc-500 rounded-b" style={{ height: 16 + Math.cos(i * 0.6) * 6 }} />
                  </div>
                ))}
              </div>
              {/* Highlight tooth 14 */}
              <div className="absolute top-1/4 left-[28%] w-4 h-8 border-2 border-amber-400/60 rounded" />
            </div>
            <p className="text-zinc-600 text-[7px] uppercase tracking-wider">Tooth #14 highlighted — periapical region</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <ImageIcon size={40} className="text-zinc-600" />
            <p className="text-zinc-500 text-[9px] uppercase font-bold">
              {isCbct ? 'CBCT Scan Preview' : isXray ? 'Radiograph Preview' : 'Image Preview'}
            </p>
            <p className="text-zinc-600 text-[8px]">High-resolution clinical image</p>
          </div>
        )}
      </div>
      <div className="px-4 py-3 bg-zinc-800 border-t border-zinc-700">
        <p className="text-[8px] text-zinc-400 uppercase font-bold">{name}</p>
      </div>
    </div>
  );
}

function ZipMockPreview({ name, size }: { name: string; size: string }) {
  const files = [
    { name: 'CBCT_AXIAL_SLICE_001.DCM', size: '4.1 MB' },
    { name: 'CBCT_AXIAL_SLICE_002.DCM', size: '4.0 MB' },
    { name: 'CBCT_CORONAL_SLICE_001.DCM', size: '3.9 MB' },
    { name: 'CBCT_3D_RECONSTRUCTION.DCM', size: '5.2 MB' },
  ];
  return (
    <div className="w-[560px] p-8">
      <div className="flex items-center gap-3 mb-5">
        <Archive size={28} className="text-black" />
        <div>
          <p className="font-black text-xs uppercase">{name}</p>
          <p className="text-[8px] text-zinc-500 uppercase">{size} • ZIP Archive</p>
        </div>
      </div>
      <div className="border-2 border-black">
        <div className="px-3 py-1.5 border-b border-black bg-zinc-50">
          <span className="text-[8px] font-black uppercase">Archive Contents ({files.length} files)</span>
        </div>
        {files.map((f, i) => (
          <div key={i} className={`flex items-center justify-between px-3 py-2 ${i < files.length - 1 ? 'border-b border-black/10' : ''}`}>
            <div className="flex items-center gap-2">
              <FileText size={12} className="text-zinc-500" />
              <span className="text-[9px] font-bold uppercase">{f.name}</span>
            </div>
            <span className="text-[8px] text-zinc-500">{f.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DicomMockPreview({ name }: { name: string }) {
  return (
    <div className="w-[560px]">
      <div className="bg-black flex items-center justify-center" style={{ height: 400 }}>
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <p className="text-zinc-500 text-[8px] uppercase font-bold tracking-widest">DICOM — Clinical Imaging</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-28 h-28 bg-zinc-900 border border-zinc-700 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
                <div className="relative">
                  {i === 0 && <div className="w-16 h-14 border border-zinc-600 rounded-full" />}
                  {i === 1 && <div className="w-10 h-16 border border-zinc-600 rounded-sm" />}
                  {i === 2 && <div className="w-14 h-10 border border-zinc-600" />}
                  {i === 3 && <div className="w-12 h-12 border border-zinc-600 rounded-lg" />}
                </div>
                <span className="absolute bottom-1 right-1 text-[6px] text-zinc-600 font-mono">S{i + 1}</span>
              </div>
            ))}
          </div>
          <p className="text-zinc-600 text-[7px] uppercase mt-1">Multi-planar reconstruction — Mandibular region</p>
        </div>
      </div>
      <div className="px-4 py-2 bg-zinc-900 border-t border-zinc-800">
        <p className="text-[8px] text-zinc-500 font-mono">{name}</p>
      </div>
    </div>
  );
}

function GenericDocMockPreview({ name, ext }: { name: string; ext: string }) {
  return (
    <div className="w-[560px] p-10 flex flex-col items-center justify-center gap-4 min-h-[360px]">
      <FileText size={40} className="text-zinc-400" />
      <p className="font-black text-xs uppercase text-center">{name}</p>
      <span className="text-[8px] text-zinc-500 uppercase border border-zinc-200 px-2 py-0.5">{ext} Document</span>
      <p className="text-[9px] text-zinc-400 text-center max-w-xs">
        Preview not available for this file type. Download to view the full document.
      </p>
    </div>
  );
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-2 border-b border-zinc-100 pb-1">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2">
      <span className="text-[8px] uppercase font-bold text-zinc-400">{label}:</span>
      <span className="text-[9px] font-bold uppercase">{value}</span>
    </div>
  );
}
