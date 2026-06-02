"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { 
  FileText, ArrowLeft, ArrowUpRight, Archive, Download, 
  HelpCircle, HardDrive, User, Calendar, ShieldCheck
} from 'lucide-react';

interface DocumentItem {
  id: string;
  name: string;
  sender: string;
  date: string;
  size: string;
  fromChannel?: boolean;
  channelName?: string;
}

interface DocumentDetailClientProps {
  id: string;
}

function DocumentDetailClientContent({ id }: DocumentDetailClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const role = searchParams.get('role') || 'specialist'; // 'specialist' or 'dentist'

  const [documentItem, setDocumentItem] = useState<DocumentItem | null>(null);
  const [isArchived, setIsArchived] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // States for specialist convert / attach actions
  const [activeModal, setActiveModal] = useState<'convert' | 'attach' | null>(null);
  const [convertPatientName, setConvertPatientName] = useState('');
  const [convertReferralType, setConvertReferralType] = useState('Extraction');

  // Hardcoded referals to attach to (copied from dashboard mock data)
  const [referrals, setReferrals] = useState([
    { id: '1', patient: 'Charlie Brown', type: 'Endodontic', source: 'Dr. Smith', date: '05/18/2026', status: 'new_processing', detail: 'Missing Attachment' },
    { id: '5', patient: 'Eve Online', type: 'Periodontal', source: 'Dr. Miller', date: '05/17/2026', status: 'new_processing', detail: 'Incomplete Data (30%)' },
    { id: '2', patient: 'Bob Marley', type: 'Extraction', source: 'Dr. Smith', date: '05/18/2026', status: 'new_docs', detail: 'Incomplete Data (45%)' }
  ]);

  useEffect(() => {
    // Determine local storage keys based on role
    const activeKey = role === 'dentist' ? 'drtalk_dentist_docs' : 'drtalk_specialist_docs';
    const archivedKey = role === 'dentist' ? 'drtalk_dentist_archived_docs' : 'drtalk_specialist_archived_docs';

    const savedDocs = localStorage.getItem(activeKey);
    const savedArchived = localStorage.getItem(archivedKey);

    let doc: DocumentItem | undefined;

    // 1. Look in active documents
    if (savedDocs) {
      try {
        const parsed = JSON.parse(savedDocs) as DocumentItem[];
        doc = parsed.find(d => d.id === id);
      } catch (e) {
        console.error(e);
      }
    }

    // Default fallbacks if not in localStorage yet
    if (!doc) {
      const fallbackDocs: DocumentItem[] = role === 'dentist' ? [
        { id: 'doc-dentist-1', name: 'PANO_REPLY_ALICE_COOPER.PNG', sender: 'Valley Endodontics', date: 'Today, 10:24 AM', size: '2.4 MB', channelName: 'Valley Endodontics', fromChannel: true },
        { id: 'doc-dentist-2', name: 'TREATMENT_PLAN_REVISION.PDF', sender: 'Downtown Oral Surgery', date: 'Yesterday, 02:15 PM', size: '1.8 MB', channelName: 'Downtown Oral Surgery', fromChannel: false },
        { id: 'doc-dentist-3', name: 'CBCT_MANDIBULAR_RECONSTRUCTION.ZIP', sender: 'Arizona Periodontics', date: '05/10/2026, 04:30 PM', size: '12.4 MB', channelName: 'Arizona Periodontics', fromChannel: true }
      ] : [
        { id: 'doc-1', name: 'PANO_IMAGE_ALICE_COOPER.JPG', sender: 'Dr. Smith (Dentist)', date: '10:05 AM 05/18/2026', size: '2.4 MB', fromChannel: true, channelName: 'Sunshine Dental' },
        { id: 'doc-2', name: 'REFERRAL_FORM_JOHN_DOE.PDF', sender: 'Dr. Jane Doe (Dentist)', date: '09:15 AM 05/18/2026', size: '1.2 MB', fromChannel: false },
        { id: 'doc-3', name: 'CBCT_SCAN_BOB_MARLEY.DCM', sender: 'Dr. Robert Miller', date: '04:30 PM 05/17/2026', size: '15.8 MB', fromChannel: true, channelName: 'Westside Pediatric Dentistry' }
      ];
      doc = fallbackDocs.find(d => d.id === id);
    }

    // 2. Look in archived documents if not found in active
    if (!doc && savedArchived) {
      try {
        const parsedArchived = JSON.parse(savedArchived) as DocumentItem[];
        doc = parsedArchived.find(d => d.id === id);
        if (doc) {
          setIsArchived(true);
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (doc) {
      setDocumentItem(doc);
      
      // Prefill guessed patient name
      let guessedName = 'NEW PATIENT';
      if (doc.name.includes('ALICE_COOPER')) guessedName = 'Alice Cooper';
      else if (doc.name.includes('JOHN_DOE')) guessedName = 'John Doe';
      else if (doc.name.includes('BOB_MARLEY')) guessedName = 'Bob Marley';
      setConvertPatientName(guessedName);
    }
  }, [id, role]);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleArchive = () => {
    if (!documentItem) return;

    const activeKey = role === 'dentist' ? 'drtalk_dentist_docs' : 'drtalk_specialist_docs';
    const archivedKey = role === 'dentist' ? 'drtalk_dentist_archived_docs' : 'drtalk_specialist_archived_docs';

    // Remove from active list
    const savedDocs = localStorage.getItem(activeKey);
    let activeDocs: DocumentItem[] = [];
    if (savedDocs) {
      try {
        activeDocs = JSON.parse(savedDocs) as DocumentItem[];
      } catch (e) {
        console.error(e);
      }
    }
    const filteredDocs = activeDocs.filter(d => d.id !== id);
    localStorage.setItem(activeKey, JSON.stringify(filteredDocs));

    // Add to archived list
    const savedArchived = localStorage.getItem(archivedKey);
    let archivedDocs: DocumentItem[] = [];
    if (savedArchived) {
      try {
        archivedDocs = JSON.parse(savedArchived) as DocumentItem[];
      } catch (e) {
        console.error(e);
      }
    }
    if (!archivedDocs.some(d => d.id === id)) {
      archivedDocs = [documentItem, ...archivedDocs];
      localStorage.setItem(archivedKey, JSON.stringify(archivedDocs));
    }

    setIsArchived(true);
    showToastMsg(`Document ${documentItem.name} archived!`);
  };

  // Convert/Attach logic for specialist
  const handleConfirmConvert = () => {
    if (!documentItem) return;

    const activeKey = 'drtalk_specialist_docs';
    const savedDocs = localStorage.getItem(activeKey);
    let activeDocs: DocumentItem[] = [];
    if (savedDocs) {
      try {
        activeDocs = JSON.parse(savedDocs) as DocumentItem[];
      } catch (e) {
        console.error(e);
      }
    }
    const filteredDocs = activeDocs.filter(d => d.id !== id);
    localStorage.setItem(activeKey, JSON.stringify(filteredDocs));

    setActiveModal(null);
    showToastMsg(`Converted ${documentItem.name} to referral for ${convertPatientName || 'NEW PATIENT'}!`);
    
    // Redirect back after a short delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const handleConfirmAttach = (referralId: string) => {
    if (!documentItem) return;

    const activeKey = 'drtalk_specialist_docs';
    const savedDocs = localStorage.getItem(activeKey);
    let activeDocs: DocumentItem[] = [];
    if (savedDocs) {
      try {
        activeDocs = JSON.parse(savedDocs) as DocumentItem[];
      } catch (e) {
        console.error(e);
      }
    }
    const filteredDocs = activeDocs.filter(d => d.id !== id);
    localStorage.setItem(activeKey, JSON.stringify(filteredDocs));

    setActiveModal(null);
    const targetRef = referrals.find(r => r.id === referralId);
    showToastMsg(`Attached ${documentItem.name} to referral for ${targetRef?.patient || 'referral'}!`);

    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  if (!documentItem) {
    return (
      <MainLayout title="Document Details">
        <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
          <HelpCircle size={48} className="mx-auto text-zinc-400" />
          <h2 className="font-black uppercase text-lg">Document Not Found</h2>
          <p className="text-[10px] text-muted-foreground uppercase font-bold">
            The requested document could not be loaded or was removed.
          </p>
          <button 
            onClick={() => router.back()} 
            className="wireframe-button text-[10px] font-black uppercase px-4 py-2 border-2 border-black hover:bg-black hover:text-white"
          >
            Go Back
          </button>
        </div>
      </MainLayout>
    );
  }

  // Determine Mock File Visualization
  const renderVisualization = () => {
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
              onClick={() => showToastMsg(`Initializing DICOM 3D Volume Viewer...`)}
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

  return (
    <MainLayout title="Document Preview">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white border-2 border-white px-4 py-3 font-bold uppercase text-[9px] tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fade-in flex items-center gap-2">
          <span>{toast}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        
        {/* Back Link */}
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider hover:underline"
          >
            <ArrowLeft size={12} /> Back to dashboard
          </button>
        </div>

        {/* Document Header Card */}
        <div className="wireframe-card p-6 bg-white border-4 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-zinc-100 shrink-0">
              <FileText size={24} className="text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black uppercase tracking-tight">{documentItem.name}</h2>
                {isArchived && (
                  <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-zinc-200 border border-zinc-400 text-zinc-600">
                    Archived
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 items-center text-[9px] font-bold uppercase text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><User size={10} /> FROM: {documentItem.sender}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Calendar size={10} /> RECEIVED: {documentItem.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><HardDrive size={10} /> SIZE: {documentItem.size}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => showToastMsg(`Downloading secure file: ${documentItem.name}`)}
            className="wireframe-button text-[10px] font-black uppercase px-4 py-2 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all flex items-center gap-1"
          >
            Download File <Download size={12} />
          </button>
        </div>

        {/* Visual Mockup File Container */}
        <div className="shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {renderVisualization()}
        </div>

        {/* Action buttons matching the card precisely */}
        <div className="wireframe-card p-5 bg-white border-2 border-black space-y-4">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block border-b border-dashed border-black/10 pb-1">
            Available PHI & Case Workflows
          </span>
          
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {role === 'specialist' && (
                <>
                  <button 
                    disabled={isArchived}
                    onClick={() => setActiveModal('convert')}
                    className="wireframe-button text-[10px] font-black uppercase px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Convert to Referral
                  </button>
                  <button 
                    disabled={isArchived}
                    onClick={() => setActiveModal('attach')}
                    className="wireframe-button text-[10px] font-black uppercase px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Attach to existing referral
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-2">
              {isArchived ? (
                <span className="text-[10px] font-black uppercase px-4 py-2 bg-zinc-200 border border-zinc-400 text-zinc-600">
                  Archived from inbox
                </span>
              ) : documentItem.fromChannel ? (
                <button 
                  onClick={() => {
                    const practiceName = documentItem.sender.toLowerCase().includes('smith') || documentItem.sender.toLowerCase().includes('sunshine')
                      ? 'Sunshine Dental'
                      : documentItem.sender.toLowerCase().includes('jane') || documentItem.sender.toLowerCase().includes('oakridge')
                      ? 'Oakridge Dental'
                      : documentItem.sender.toLowerCase().includes('miller') || documentItem.sender.toLowerCase().includes('robert')
                      ? 'Westside Pediatric Dentistry'
                      : 'Sunshine Dental';
                    const route = role === 'dentist' ? `/dentist/channels?practice=${encodeURIComponent(documentItem.channelName || '')}` : `/channels?practice=${encodeURIComponent(practiceName)}`;
                    router.push(route);
                  }}
                  className="wireframe-button text-[10px] font-black uppercase px-5 py-2 bg-black text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                >
                  View & Discuss in Channel <ArrowUpRight size={14} />
                </button>
              ) : (
                <button 
                  onClick={handleArchive}
                  className="wireframe-button text-[10px] font-black uppercase px-5 py-2 bg-zinc-100 border-2 border-black text-black hover:bg-black hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Archive <Archive size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Convert to Referral Modal */}
      {activeModal === 'convert' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border-4 border-black max-w-md w-full p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200 text-black">
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <h4 className="font-black uppercase text-sm tracking-tight italic text-black">Convert Document to Referral</h4>
              <button 
                onClick={() => setActiveModal(null)} 
                className="text-xs font-black uppercase hover:underline text-black"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-1">
              <p className="text-[8px] font-bold text-muted-foreground uppercase text-black">Source Document</p>
              <div className="p-3 border-2 border-black bg-zinc-50 font-mono text-[10px] break-all text-black">
                {documentItem.name}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase block text-black">Patient Name</label>
                <input 
                  type="text" 
                  value={convertPatientName}
                  onChange={(e) => setConvertPatientName(e.target.value)}
                  className="wireframe-input w-full p-2 text-xs uppercase text-black"
                  placeholder="PATIENT NAME..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase block text-black">Referral Type</label>
                <select 
                  value={convertReferralType}
                  onChange={(e) => setConvertReferralType(e.target.value)}
                  className="wireframe-input w-full p-2 text-xs uppercase bg-white cursor-pointer text-black"
                >
                  <option value="Extraction">Extraction</option>
                  <option value="Periodontal">Periodontal</option>
                  <option value="Endodontic">Endodontic</option>
                  <option value="Implants">Implants</option>
                  <option value="Orthodontic">Orthodontic</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={handleConfirmConvert}
                className="wireframe-button flex-1 bg-black text-white text-[10px] font-black uppercase py-3 hover:bg-zinc-800 transition-colors"
              >
                Create Referral
              </button>
              <button 
                onClick={() => setActiveModal(null)}
                className="wireframe-button flex-1 bg-white text-black border-2 border-black text-[10px] font-black uppercase py-3 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attach to Referral Modal */}
      {activeModal === 'attach' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border-4 border-black max-w-md w-full p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200 text-black">
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <h4 className="font-black uppercase text-sm tracking-tight italic text-black">Attach to Existing Referral</h4>
              <button 
                onClick={() => setActiveModal(null)} 
                className="text-xs font-black uppercase hover:underline text-black"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-1">
              <p className="text-[8px] font-bold text-muted-foreground uppercase text-black">Document to Attach</p>
              <div className="p-3 border-2 border-black bg-zinc-50 font-mono text-[10px] break-all text-black">
                {documentItem.name}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase block text-black">Select Target Referral</label>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 border border-black/10 p-2 text-black">
                {referrals.map((ref) => (
                  <div 
                    key={ref.id}
                    onClick={() => handleConfirmAttach(ref.id)}
                    className="p-3 border-2 border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-black uppercase text-xs">{ref.patient}</p>
                      <span className="text-[8px] font-bold uppercase opacity-80 border border-black/20 px-1">{ref.type}</span>
                    </div>
                    <p className="text-[8px] uppercase opacity-70">From: {ref.source} • {ref.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setActiveModal(null)}
              className="wireframe-button w-full bg-white text-black border-2 border-black text-[10px] font-black uppercase py-3 hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </MainLayout>
  );
}

export default function DocumentDetailClient(props: DocumentDetailClientProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs uppercase font-bold text-muted-foreground animate-pulse">Loading Secured PHI Preview...</div>}>
      <DocumentDetailClientContent {...props} />
    </Suspense>
  );
}
