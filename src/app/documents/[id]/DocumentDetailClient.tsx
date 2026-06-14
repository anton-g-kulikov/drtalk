"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { DocumentDetailPreview } from '@/components/prototype/DocumentDetailPreview';
import { DocumentDetailActionModals } from '@/components/prototype/DocumentDetailActionModals';
import { 
  FileText, ArrowLeft, ArrowUpRight, Archive, Download, 
  HelpCircle, HardDrive, User, Calendar
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
  const [attachSearchQuery, setAttachSearchQuery] = useState('');

  // Hardcoded referals to attach to (copied from dashboard mock data)
  const [referrals, setReferrals] = useState([
    { id: '1', patient: 'Charlie Brown', type: 'Endodontic', source: 'Dr. Smith', date: '05/18/2026', status: 'new_processing', detail: 'Missing Attachment' },
    { id: '5', patient: 'Eve Online', type: 'Periodontal', source: 'Dr. Miller', date: '05/17/2026', status: 'new_processing', detail: 'Missing: Signed Form, Med History' },
    { id: '2', patient: 'Bob Marley', type: 'Extraction', source: 'Dr. Smith', date: '05/18/2026', status: 'new_docs', detail: 'Missing: Panoramic Radiograph' }
  ]);

  const filteredAttachReferrals = referrals.filter(ref => 
    ref.patient.toLowerCase().includes(attachSearchQuery.toLowerCase()) ||
    ref.source.toLowerCase().includes(attachSearchQuery.toLowerCase()) ||
    (ref.detail && ref.detail.toLowerCase().includes(attachSearchQuery.toLowerCase()))
  );

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

    let shouldArchive = false;
    // 2. Look in archived documents if not found in active
    if (!doc && savedArchived) {
      try {
        const parsedArchived = JSON.parse(savedArchived) as DocumentItem[];
        doc = parsedArchived.find(d => d.id === id);
        if (doc) {
          shouldArchive = true;
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (doc) {
      const finalDoc = doc;
      const finalShouldArchive = shouldArchive;
      
      // Prefill guessed patient name
      let guessedName = 'NEW PATIENT';
      if (doc.name.includes('ALICE_COOPER')) guessedName = 'Alice Cooper';
      else if (doc.name.includes('JOHN_DOE')) guessedName = 'John Doe';
      else if (doc.name.includes('BOB_MARLEY')) guessedName = 'Bob Marley';
      
      setTimeout(() => {
        setDocumentItem(finalDoc);
        setConvertPatientName(guessedName);
        if (finalShouldArchive) {
          setIsArchived(true);
        }
      }, 0);
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
          <DocumentDetailPreview documentItem={documentItem} onToast={showToastMsg} />
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
                    onClick={() => { setAttachSearchQuery(''); setActiveModal('attach'); }}
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
                    const route = role === 'dentist' ? `/dentist/channels?practice=${encodeURIComponent(documentItem.channelName || '')}&tab=documents` : `/channels?practice=${encodeURIComponent(practiceName)}&tab=documents`;
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

      <DocumentDetailActionModals
        activeModal={activeModal}
        documentName={documentItem.name}
        convertPatientName={convertPatientName}
        setConvertPatientName={setConvertPatientName}
        attachSearchQuery={attachSearchQuery}
        setAttachSearchQuery={setAttachSearchQuery}
        filteredAttachReferrals={filteredAttachReferrals}
        onClose={() => setActiveModal(null)}
        onConfirmConvert={handleConfirmConvert}
        onConfirmAttach={handleConfirmAttach}
      />

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
