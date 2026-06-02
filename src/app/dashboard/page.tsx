"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout";
import {
  AlertCircle, MessageSquare, ArrowUpRight,
  TrendingUp, Users, FileText, Send, Upload, X, UserPlus, Archive
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useVerification } from '@/components/VerificationContext';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { InviteModal } from '@/components/InviteModal';

import { 
  initialDocuments, 
  initialMessages, 
  mockChannels, 
  SharedDocument, 
  MessageItem 
} from '@/app/channels/page';

// Helper functions defined outside the React component to satisfy the React Compiler's strict purity/immutability checks.
function getNewId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

function getFormattedDateTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('en-US');
}

function getFormattedTimeOnly(): string {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function getFormattedDateOnly(): string {
  return new Date().toLocaleDateString('en-US');
}

function addSharedDocumentToDb(newDoc: SharedDocument) {
  initialDocuments.push(newDoc);
}

function addMessageToDb(channelId: string, newMsg: MessageItem) {
  if (!initialMessages[channelId]) {
    initialMessages[channelId] = [];
  }
  initialMessages[channelId].push(newMsg);
}

export default function DashboardPage() {
  const router = useRouter();
  const { isVerified, setShowVerification, hasPracticeOwner } = useVerification();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState('Team Member');

  const handleReferralClick = (id: string) => {
    if (!isVerified) {
      router.push('/verify');
    } else {
      router.push(`/referrals/${id}`);
    }
  };

  interface DocumentItem {
    id: string;
    name: string;
    sender: string;
    date: string;
    size: string;
    fromChannel?: boolean;
    channelName?: string;
  }

  interface ReferralItem {
    id: string;
    patient: string;
    type: string;
    source: string;
    date: string;
    status: 'new_processing' | 'new_docs';
    detail: string;
    urgency?: 'Routine' | 'Urgent' | 'Emergency';
  }

  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: 'doc-1', name: 'PANO_IMAGE_ALICE_COOPER.JPG', sender: 'Dr. Smith (Dentist)', date: '10:05 AM 05/18/2026', size: '2.4 MB', fromChannel: true, channelName: 'Sunshine Dental' },
    { id: 'doc-2', name: 'REFERRAL_FORM_JOHN_DOE.PDF', sender: 'Dr. Jane Doe (Dentist)', date: '09:15 AM 05/18/2026', size: '1.2 MB', fromChannel: false },
    { id: 'doc-3', name: 'CBCT_SCAN_BOB_MARLEY.DCM', sender: 'Dr. Robert Miller', date: '04:30 PM 05/17/2026', size: '15.8 MB', fromChannel: true, channelName: 'Westside Pediatric Dentistry' }
  ]);

  const [archivedDocuments, setArchivedDocuments] = useState<DocumentItem[]>([]);
  const [activeInboxTab, setActiveInboxTab] = useState<'inbox' | 'archived'>('inbox');

  // Sync with localStorage
  useEffect(() => {
    const savedDocs = localStorage.getItem('drtalk_specialist_docs');
    const savedArchived = localStorage.getItem('drtalk_specialist_archived_docs');
    if (savedDocs) {
      try {
        setDocuments(JSON.parse(savedDocs));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedArchived) {
      try {
        setArchivedDocuments(JSON.parse(savedArchived));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveDocumentsToStorage = (newDocs: DocumentItem[]) => {
    setDocuments(newDocs);
    localStorage.setItem('drtalk_specialist_docs', JSON.stringify(newDocs));
  };

  const saveArchivedToStorage = (newArchived: DocumentItem[]) => {
    setArchivedDocuments(newArchived);
    localStorage.setItem('drtalk_specialist_archived_docs', JSON.stringify(newArchived));
  };

  const handleArchiveDocument = (doc: DocumentItem) => {
    const updatedDocs = documents.filter(d => d.id !== doc.id);
    saveDocumentsToStorage(updatedDocs);
    const updatedArchived = [doc, ...archivedDocuments];
    saveArchivedToStorage(updatedArchived);
    showToast(`Archived ${doc.name}!`);
  };

  const [referrals, setReferrals] = useState<ReferralItem[]>([
    { id: '1', patient: 'Charlie Brown', type: 'Endodontic', source: 'Dr. Smith', date: '05/18/2026', status: 'new_processing', detail: 'Missing Attachment', urgency: 'Emergency' },
    { id: '5', patient: 'Eve Online', type: 'Periodontal', source: 'Dr. Miller', date: '05/17/2026', status: 'new_processing', detail: 'Incomplete Data (30%)', urgency: 'Routine' },
    { id: '2', patient: 'Bob Marley', type: 'Extraction', source: 'Dr. Smith', date: '05/18/2026', status: 'new_docs', detail: 'Incomplete Data (45%)', urgency: 'Urgent' }
  ]);

  const [activeModal, setActiveModal] = useState<'convert' | 'attach' | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [convertPatientName, setConvertPatientName] = useState('');
  const [convertReferralType, setConvertReferralType] = useState('Extraction');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const handleConvertDocument = (doc: DocumentItem) => {
    setSelectedDocument(doc);
    setConvertReferralType('Extraction');
    
    let guessedName = 'NEW PATIENT';
    if (doc.name.includes('ALICE_COOPER')) {
      guessedName = 'Alice Cooper';
    } else if (doc.name.includes('JOHN_DOE')) {
      guessedName = 'John Doe';
    } else if (doc.name.includes('BOB_MARLEY')) {
      guessedName = 'Bob Marley';
    }
    setConvertPatientName(guessedName);
    setActiveModal('convert');
  };

  const handleConfirmConvert = () => {
    if (!selectedDocument) return;
    
    const newReferral: ReferralItem = {
      id: getNewId('ref'),
      patient: convertPatientName || 'NEW PATIENT',
      type: convertReferralType,
      source: selectedDocument.sender,
      date: getFormattedDateOnly(),
      status: 'new_processing',
      detail: `Converted from: ${selectedDocument.name}`,
      urgency: 'Routine'
    };

    setReferrals(prev => [newReferral, ...prev]);
    
    // Archive or remove from active docs
    const updatedDocs = documents.filter(d => d.id !== selectedDocument.id);
    saveDocumentsToStorage(updatedDocs);
    
    setActiveModal(null);
    setSelectedDocument(null);
    
    showToast(`Converted ${selectedDocument.name} to referral for ${newReferral.patient}!`);
  };


  const handleAttachDocument = (doc: DocumentItem) => {
    setSelectedDocument(doc);
    setActiveModal('attach');
  };

  const handleConfirmAttach = (referralId: string) => {
    if (!selectedDocument) return;

    setReferrals(prev => prev.map(ref => {
      if (ref.id === referralId) {
        return {
          ...ref,
          status: 'new_docs',
          detail: `Doc attached: ${selectedDocument.name}`
        };
      }
      return ref;
    }));

    const updatedDocs = documents.filter(d => d.id !== selectedDocument.id);
    saveDocumentsToStorage(updatedDocs);
    setActiveModal(null);
    
    const targetRef = referrals.find(r => r.id === referralId);
    showToast(`Attached ${selectedDocument.name} to ${targetRef?.patient || 'referral'}.`);
    setSelectedDocument(null);
  };

  const showToast = (message: string, action?: { label: string; onClick: () => void }) => {
    setToast({ message, type: 'success' });
    if (action) setToastAction(action);
    setTimeout(() => {
      setToast(null);
      setToastAction(null);
    }, 5000);
  };

  const newProcessingReferrals = referrals.filter(r => r.status === 'new_processing');
  const newDocsReferrals = referrals.filter(r => r.status === 'new_docs');

  // Send Document Modal & Form State
  const [isSendDocOpen, setIsSendDocOpen] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<{ id: string, name: string, size: string, type: string }[]>([]);
  const [customDocName, setCustomDocName] = useState('');
  const [customDocType, setCustomDocType] = useState('pdf');
  const [customDocSize, setCustomDocSize] = useState('2.4 MB');
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  // Toast Action Link state
  const [toastAction, setToastAction] = useState<{ label: string; onClick: () => void } | null>(null);

  const connectedPractices = [
    { id: '1', name: 'Sunshine Dental' },
    { id: '2', name: 'Oakridge Dental' },
    { id: '3', name: 'Westside Pediatric Dentistry', isVerified: false }
  ];

  const handleAttachMockScan = () => {
    const mockFile = {
      id: 'mock-' + Date.now(),
      name: 'PANO_IMAGE_BOB_MARLEY.JPG',
      size: '4.8 MB',
      type: 'image'
    };
    setAttachedFiles([mockFile]);
    setCustomDocName(mockFile.name);
    setCustomDocType(mockFile.type);
    setCustomDocSize(mockFile.size);

    // Pre-fill Bob Marley patient details
    setPatientFirstName('Bob');
    setPatientLastName('Marley');
    setPatientDob('02/06/1945');
    setUploadMessage('Sharing updated panoramic X-ray for the planned extraction.');
  };

  const handleRealFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const mockFile = {
        id: 'real-' + Date.now(),
        name: file.name.toUpperCase(),
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: file.type.includes('image') ? 'image' as const : 'pdf' as const
      };
      setAttachedFiles(prev => [...prev, mockFile]);
      setCustomDocName(mockFile.name);
      setCustomDocType(mockFile.type);
      setCustomDocSize(mockFile.size);

      // Extract details if file name has cues
      const nameUpper = file.name.toUpperCase();
      if (nameUpper.includes('BOB') || nameUpper.includes('MARLEY')) {
        setPatientFirstName('Bob');
        setPatientLastName('Marley');
        setPatientDob('02/06/1945');
      } else if (nameUpper.includes('CHARLIE') || nameUpper.includes('BROWN')) {
        setPatientFirstName('Charlie');
        setPatientLastName('Brown');
        setPatientDob('10/30/1948');
      }
    }
  };

  const handleSendDocumentSubmit = () => {
    if (!selectedPractice) return;
    
    const docName = customDocName || 'SHARED_DOCUMENT.PDF';
    const targetChannel = mockChannels.find(c => {
      // Valley Endodontics (us) communicates with Sunshine Dental on channel 3
      if (selectedPractice === 'Sunshine Dental') {
        return c.id === '3';
      }
      return c.name.toLowerCase().includes(selectedPractice.toLowerCase());
    });

    const channelId = targetChannel ? targetChannel.id : '3';
    
    // 1. Construct Shared Document item
    const newDoc: SharedDocument = {
      id: getNewId('shared'),
      channelId,
      name: docName,
      size: customDocSize,
      type: customDocType as 'pdf' | 'image' | 'zip' | 'doc',
      sentBy: 'Valley Endodontics (Specialist)',
      sentAt: getFormattedDateTime()
    };

    // 2. Add to active shared docs
    addSharedDocumentToDb(newDoc);

    // 3. Add Message item to communication logs
    const patientSnippet = patientFirstName || patientLastName 
      ? `\nPatient: ${patientFirstName} ${patientLastName}${patientDob ? ` (DOB: ${patientDob})` : ''}` 
      : '';
    const noteSnippet = uploadMessage ? `\nNote: ${uploadMessage}` : '';

    const newMsg: MessageItem = {
      id: getNewId('msg'),
      user: 'Valley Endodontics',
      text: `Shared a document: ${docName}${patientSnippet}${noteSnippet}`,
      time: getFormattedTimeOnly(),
      type: 'self',
      transport: 'App',
      document: newDoc
    };

    addMessageToDb(channelId, newMsg);
    
    setIsSendDocOpen(false);
    
    // Clear states
    setCustomDocName('');
    setAttachedFiles([]);
    setPatientFirstName('');
    setPatientLastName('');
    setPatientDob('');
    setUploadMessage('');

    // Trigger beautiful toast
    showToast(`Shared document with ${selectedPractice}!`, {
      label: 'VIEW CHAT',
      onClick: () => {
        router.push(`/channels?practice=${encodeURIComponent(selectedPractice)}`);
      }
    });
  };

  return (
    <MainLayout title="Practice Dashboard">
      <div className="max-w-6xl mx-auto space-y-8 pb-20">

        {/* Status Banners */}
        <div className="space-y-4">
          
          {/* Verification Alert */}
          {!isVerified && (
            <div className="wireframe-card border-black bg-gray-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center shrink-0 bg-white">
                  <AlertCircle className="text-black" size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black uppercase text-sm tracking-tight leading-none text-black">Verification Required</h3>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed max-w-xl">
                    Practice owner verification is required to process referrals and access PHI.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/verify')}
                className="wireframe-button bg-black text-white text-[10px] uppercase px-8 py-3 whitespace-nowrap"
              >
                Verify Identity Now
              </button>
            </div>
          )}

          {/* Practice Owner Nudge */}
          {isVerified && !hasPracticeOwner && (
            <div className="wireframe-card border-black bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500 border-dashed">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center shrink-0 bg-gray-50">
                  <Users className="text-black" size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black uppercase text-sm tracking-tight leading-none text-black">Practice Owner Required</h3>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed max-w-xl">
                    This practice does not have a verified owner yet. Please invite a doctor to verify their identity and unlock full clinical capabilities.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setInviteRole('Owner');
                  setIsInviteModalOpen(true);
                }}
                className="text-[10px] font-black uppercase border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all whitespace-nowrap"
              >
                Invite Practice Owner
              </button>
            </div>
          )}
        </div>

        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter italic">Dashboard</h2>
              <CommentMarker id="dashboard-practice" title="Practice Dashboard" description="The main overview for the practice workspace." />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              Receive referrals, process cases, coordinate with dentists, and manage patient communication.
            </p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button
              onClick={() => setIsSendDocOpen(true)}
              className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-3 flex items-center justify-center gap-2 flex-1 sm:flex-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black transition-all"
            >
              Send Document <FileText size={14} />
            </button>
          </div>
        </div>


        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Acceptance Rate', value: '82%', trend: '+4%', icon: TrendingUp },
            { label: 'Referrals', value: '18', trend: '+2', icon: FileText },
            { label: 'Dentist Partners', value: '12', trend: '+1', icon: Users },
            { label: 'Patient Messages', value: '05', trend: '-2', icon: MessageSquare },
          ].map((stat) => (
            <div key={stat.label} className="wireframe-card p-5 space-y-2 bg-white">
              <div className="flex justify-between items-start">
                <p className="text-[9px] font-black uppercase text-muted-foreground">{stat.label}</p>
                <stat.icon size={16} className="text-muted-foreground" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tighter">{stat.value}</span>
                <span className="text-[9px] font-bold text-black uppercase">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Action Area */}
          <div className="lg:col-span-8 space-y-8">

            {/* Inbox Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b-4 border-black pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-black"></div>
                  <h3 className="font-black uppercase text-sm tracking-widest italic">Inbox</h3>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 bg-black text-white uppercase">
                  {documents.length + referrals.length} items
                </span>
              </div>

              {/* Documents Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-1">
                  <div className="flex items-center gap-4">
                    <h4 className="font-black uppercase text-xs tracking-wider">
                      Documents
                    </h4>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setActiveInboxTab('inbox')} 
                        className="flex items-center gap-1.5 focus:outline-none group"
                      >
                        <div className={`w-2.5 h-2.5 ${activeInboxTab === 'inbox' ? 'bg-black' : 'border border-black bg-white group-hover:bg-zinc-100'}`}></div>
                        <span className={`text-[9px] font-black uppercase tracking-wider transition-colors ${activeInboxTab === 'inbox' ? 'text-black' : 'text-zinc-400 group-hover:text-zinc-600'}`}>Inbox ({documents.length})</span>
                      </button>
                      <button 
                        onClick={() => setActiveInboxTab('archived')} 
                        className="flex items-center gap-1.5 focus:outline-none group"
                      >
                        <div className={`w-2.5 h-2.5 ${activeInboxTab === 'archived' ? 'bg-black' : 'border border-black bg-white group-hover:bg-zinc-100'}`}></div>
                        <span className={`text-[9px] font-black uppercase tracking-wider transition-colors ${activeInboxTab === 'archived' ? 'text-black' : 'text-zinc-400 group-hover:text-zinc-600'}`}>Archived ({archivedDocuments.length})</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {activeInboxTab === 'inbox' ? (
                  documents.length === 0 ? (
                    <div className="wireframe-card p-6 text-center text-muted-foreground uppercase text-[10px] font-bold bg-gray-50 border-dashed border-2 border-black">
                      No documents in inbox
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="wireframe-card p-4 bg-white border-2 border-black space-y-3 hover:bg-zinc-50/50 transition-all">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-zinc-100 shrink-0">
                                <FileText size={20} className="text-black" />
                              </div>
                              <div>
                                <p 
                                  onClick={() => router.push(`/documents/${doc.id}?role=specialist`)}
                                  className="font-black uppercase text-xs tracking-tight hover:underline cursor-pointer text-black"
                                >
                                  {doc.name}
                                </p>
                                <div className="flex gap-2 items-center text-[9px] font-bold uppercase text-muted-foreground">
                                  <span>From: {doc.sender}</span>
                                  <span>•</span>
                                  <span>{doc.size}</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-[8px] font-bold uppercase text-muted-foreground">{doc.date}</span>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-black/10 items-center justify-between">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleConvertDocument(doc)}
                                className="wireframe-button text-[9px] font-black uppercase px-3 py-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-all"
                              >
                                Convert to Referral
                              </button>
                              <button 
                                onClick={() => handleAttachDocument(doc)}
                                className="wireframe-button text-[9px] font-black uppercase px-3 py-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-all"
                              >
                                Attach to existing referral
                              </button>
                            </div>

                            {doc.fromChannel ? (
                              <button 
                                onClick={() => {
                                  const practiceName = doc.sender.toLowerCase().includes('smith') || doc.sender.toLowerCase().includes('sunshine')
                                    ? 'Sunshine Dental'
                                    : doc.sender.toLowerCase().includes('jane') || doc.sender.toLowerCase().includes('oakridge')
                                    ? 'Oakridge Dental'
                                    : doc.sender.toLowerCase().includes('miller') || doc.sender.toLowerCase().includes('robert')
                                    ? 'Westside Pediatric Dentistry'
                                    : 'Sunshine Dental';
                                  router.push(`/channels?practice=${encodeURIComponent(practiceName)}`);
                                }}
                                className="wireframe-button text-[9px] font-black uppercase px-4 py-1.5 bg-black text-white hover:bg-zinc-800 transition-colors flex items-center gap-1"
                              >
                                View & Discuss in Channel <ArrowUpRight size={12} />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleArchiveDocument(doc)}
                                className="wireframe-button text-[9px] font-black uppercase px-4 py-1.5 bg-zinc-100 border-2 border-black text-black hover:bg-black hover:text-white transition-colors flex items-center gap-1"
                              >
                                Archive <Archive size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  archivedDocuments.length === 0 ? (
                    <div className="wireframe-card p-6 text-center text-muted-foreground uppercase text-[10px] font-bold bg-gray-50 border-dashed border-2 border-black">
                      No archived documents
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {archivedDocuments.map((doc) => (
                        <div key={doc.id} className="wireframe-card p-4 bg-white border-2 border-black space-y-3 hover:bg-zinc-50/50 transition-all opacity-80">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-zinc-100 shrink-0">
                                <FileText size={20} className="text-black" />
                              </div>
                              <div>
                                <p 
                                  onClick={() => router.push(`/documents/${doc.id}?role=specialist`)}
                                  className="font-black uppercase text-xs tracking-tight hover:underline cursor-pointer text-black"
                                >
                                  {doc.name}
                                </p>
                                <div className="flex gap-2 items-center text-[9px] font-bold uppercase text-muted-foreground">
                                  <span>From: {doc.sender}</span>
                                  <span>•</span>
                                  <span>{doc.size}</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-[8px] font-bold uppercase text-muted-foreground">{doc.date}</span>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-black/10 items-center justify-between">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleConvertDocument(doc)}
                                className="wireframe-button text-[9px] font-black uppercase px-3 py-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-all"
                              >
                                Convert to Referral
                              </button>
                              <button 
                                onClick={() => handleAttachDocument(doc)}
                                className="wireframe-button text-[9px] font-black uppercase px-3 py-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-all"
                              >
                                Attach to existing referral
                              </button>
                            </div>
                            <span className="text-[9px] font-black uppercase px-3 py-1 bg-zinc-200 border border-zinc-400 text-zinc-600">
                              Archived
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>

              {/* Referrals Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b-2 border-black pb-1">
                  <h4 className="font-black uppercase text-xs tracking-wider flex items-center gap-2">
                    <span>Referrals</span>
                    <span className="text-[9px] font-bold text-muted-foreground">({referrals.length})</span>
                  </h4>
                </div>

                {/* Sub-section: New Referrals Requiring Processing */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-l-4 border-black pl-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-black">New referrals requiring processing</span>
                  </div>
                  
                  {newProcessingReferrals.length === 0 ? (
                    <div className="wireframe-card p-4 text-center text-muted-foreground uppercase text-[9px] font-bold bg-gray-50 border-dashed border-2 border-black">
                      No new referrals requiring processing
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {newProcessingReferrals.map((ref) => (
                        <div 
                          key={ref.id} 
                          onClick={() => handleReferralClick(ref.id)}
                          className="wireframe-card p-4 flex items-center justify-between bg-white border-2 border-black hover:bg-black hover:text-white cursor-pointer group transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="inline-block w-1.5 h-1.5 bg-black group-hover:bg-white rounded-full"></span>
                              <p className="font-bold uppercase text-xs">{ref.patient}</p>
                            </div>
                            <p className="text-[10px] uppercase font-bold opacity-70 group-hover:opacity-100">{ref.detail}</p>
                            <p className="text-[8px] uppercase font-bold text-muted-foreground group-hover:text-zinc-300">From: {ref.source} • Received {ref.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {ref.urgency && (
                              <span className={`text-[8px] uppercase font-bold px-2 py-0.5 border ${
                                ref.urgency === 'Emergency' 
                                  ? 'bg-red-100 text-red-900 border-red-300 group-hover:bg-red-950 group-hover:text-red-200 group-hover:border-red-800' 
                                  : ref.urgency === 'Urgent' 
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 group-hover:bg-amber-950 group-hover:text-amber-200 group-hover:border-amber-800' 
                                  : 'bg-zinc-100 text-zinc-800 border-zinc-300 group-hover:bg-zinc-800 group-hover:text-zinc-300 group-hover:border-zinc-700'
                              }`}>
                                {ref.urgency}
                              </span>
                            )}
                            <span className="text-[8px] uppercase font-bold text-muted-foreground group-hover:text-zinc-300 border border-black/20 group-hover:border-white/20 px-2 py-0.5">{ref.type}</span>
                            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sub-section: Referrals with Newly Received Documents */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-l-4 border-black pl-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-black">Referrals with newly received documents</span>
                  </div>
                  
                  {newDocsReferrals.length === 0 ? (
                    <div className="wireframe-card p-4 text-center text-muted-foreground uppercase text-[9px] font-bold bg-gray-50 border-dashed border-2 border-black">
                      No referrals with newly received documents
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {newDocsReferrals.map((ref) => (
                        <div 
                          key={ref.id} 
                          onClick={() => handleReferralClick(ref.id)}
                          className="wireframe-card p-4 flex items-center justify-between bg-white border-2 border-black hover:bg-black hover:text-white cursor-pointer group transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="inline-block w-1.5 h-1.5 bg-black group-hover:bg-white rounded-full"></span>
                              <p className="font-bold uppercase text-xs">{ref.patient}</p>
                            </div>
                            <p className="text-[10px] uppercase font-bold opacity-70 group-hover:opacity-100">{ref.detail}</p>
                            <p className="text-[8px] uppercase font-bold text-muted-foreground group-hover:text-zinc-300">From: {ref.source} • Updated {ref.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {ref.urgency && (
                              <span className={`text-[8px] uppercase font-bold px-2 py-0.5 border ${
                                ref.urgency === 'Emergency' 
                                  ? 'bg-red-100 text-red-900 border-red-300 group-hover:bg-red-950 group-hover:text-red-200 group-hover:border-red-800' 
                                  : ref.urgency === 'Urgent' 
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 group-hover:bg-amber-950 group-hover:text-amber-200 group-hover:border-amber-800' 
                                  : 'bg-zinc-100 text-zinc-800 border-zinc-300 group-hover:bg-zinc-800 group-hover:text-zinc-300 group-hover:border-zinc-700'
                              }`}>
                                {ref.urgency}
                              </span>
                            )}
                            <span className="text-[8px] uppercase font-bold text-muted-foreground group-hover:text-zinc-300 border border-black/20 group-hover:border-white/20 px-2 py-0.5">{ref.type}</span>
                            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => router.push('/referrals')}
                className="text-[10px] font-black uppercase underline block"
              >
                View all Referrals
              </button>
            </div>
          </div>

          {/* Quick Actions / Side Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h3 className="font-bold uppercase text-xs tracking-widest border-b-2 border-black pb-2">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <ActionCard 
                  label="Invite Dentist" 
                  desc="Grow your referral network" 
                  onClick={() => {
                    setInviteRole('Specialist');
                    setIsInviteModalOpen(true);
                  }}
                />
                <ActionCard 
                  label="TEAM, ROLES & ACCESS CONTROL" 
                  desc="Manage team permissions and patient communication safeguards." 
                  onClick={() => router.push('/dashboard/settings/team')}
                />
                <ActionCard 
                  label="Learning Resource" 
                  desc="Create a public or paid education channel" 
                />
              </div>
            </div>
            <SubscriptionBanner />
          </div>

        </div>

        {/* Convert to Referral Modal */}
        {activeModal === 'convert' && selectedDocument && (
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
                  {selectedDocument.name}
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
        {activeModal === 'attach' && selectedDocument && (
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
                  {selectedDocument.name}
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

      {/* Send Document Modal */}
      {isSendDocOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-black">
          <div className="bg-white border-4 border-black p-6 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
                <FileText size={16} /> Send Document
              </h3>
              <button
                onClick={() => {
                  setIsSendDocOpen(false);
                  setCustomDocName('');
                  setAttachedFiles([]);
                  setSelectedPractice('');
                  setPatientFirstName('');
                  setPatientLastName('');
                  setPatientDob('');
                  setUploadMessage('');
                }}
                className="hover:text-black text-black"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Field 1: Choice of connected practice */}
              <div>
                <span className="text-[10px] font-black uppercase block mb-1.5 text-black">
                  Connected Practice <span className="text-red-500">*</span>
                </span>
                <select
                  value={selectedPractice}
                  onChange={(e) => setSelectedPractice(e.target.value)}
                  className="wireframe-input py-2 px-3 text-xs font-bold text-black border-black bg-white w-full h-10 focus:ring-0 focus:outline-none"
                >
                  <option value="">SELECT PRACTICE...</option>
                  {connectedPractices.map((practice) => (
                    <option key={practice.id} value={practice.name}>
                      {practice.name} {practice.isVerified === false ? '(UNVERIFIED)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Attached Files List */}
              {attachedFiles.length > 0 && (
                <div className="space-y-2 border-b border-black border-dashed pb-3">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
                    Attached Files ({attachedFiles.length})
                  </span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {attachedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 border-2 border-black bg-zinc-50">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText size={12} className="shrink-0 text-black" />
                          <div className="truncate">
                            <p className="text-[10px] font-black uppercase truncate">{file.name}</p>
                            <p className="text-[8px] font-bold uppercase text-muted-foreground">{file.size} • {file.type.toUpperCase()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setAttachedFiles(prev => {
                              const remaining = prev.filter(f => f.id !== file.id);
                              if (remaining.length === 0) {
                                setCustomDocName('');
                              } else {
                                const last = remaining[remaining.length - 1];
                                setCustomDocName(last.name);
                                setCustomDocType(last.type);
                                setCustomDocSize(last.size);
                              }
                              return remaining;
                            });
                          }}
                          className="text-black hover:text-red-600 p-0.5 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Drag and Drop / Click Zone */}
              <div className="relative border-2 border-dashed border-black p-4 bg-gray-50 hover:bg-black/5 cursor-pointer transition-all text-center flex flex-col items-center justify-center gap-1.5 min-h-[120px]">
                <input
                  type="file"
                  id="dashboard-file-input"
                  className="hidden"
                  onChange={handleRealFileSelect}
                />

                <div
                  onClick={() => document.getElementById('dashboard-file-input')?.click()}
                  className="absolute inset-0 z-0"
                />

                <Upload size={20} className="text-black z-10" />
                <span className="text-xs font-black uppercase tracking-wider text-black z-10">
                  Attach Document
                </span>
                <span className="text-[8px] font-bold text-muted-foreground uppercase z-10">
                  Click to browse files or drag and drop here
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAttachMockScan();
                  }}
                  className="relative z-10 mt-1 px-4 py-1.5 bg-black text-white hover:bg-gray-800 text-[8px] uppercase font-black tracking-widest border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
                >
                  Quick attach mock scan
                </button>
              </div>

              {/* Patient Association Fields */}
              <div className="border-t border-black pt-3 space-y-3">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
                  Patient Information
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase block mb-1.5 text-black">Patient first name</span>
                    <input
                      type="text"
                      placeholder="Enter patient first name"
                      value={patientFirstName}
                      onChange={(e) => setPatientFirstName(e.target.value)}
                      className="wireframe-input py-2 px-3 text-xs font-bold text-black border-black bg-white w-full focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase block mb-1.5 text-black">Patient last name</span>
                    <input
                      type="text"
                      placeholder="Enter patient last name"
                      value={patientLastName}
                      onChange={(e) => setPatientLastName(e.target.value)}
                      className="wireframe-input py-2 px-3 text-xs font-bold text-black border-black bg-white w-full focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase block mb-1.5 text-black">Date of birth</span>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="MM/DD/YYYY"
                      value={patientDob}
                      onChange={(e) => setPatientDob(e.target.value)}
                      className="wireframe-input py-2 px-3 pr-10 text-xs font-bold text-black border-black bg-white w-full focus:ring-0 focus:outline-none"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase block mb-1.5 text-black">Message</span>
                  <textarea
                    placeholder="Enter message"
                    value={uploadMessage}
                    rows={2}
                    onChange={(e) => setUploadMessage(e.target.value)}
                    className="wireframe-input py-2 px-3 text-xs font-bold text-black border-black bg-white w-full resize-none focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t-2 border-black">
              <button
                onClick={() => {
                  setIsSendDocOpen(false);
                  setCustomDocName('');
                  setAttachedFiles([]);
                  setSelectedPractice('');
                  setPatientFirstName('');
                  setPatientLastName('');
                  setPatientDob('');
                  setUploadMessage('');
                }}
                className="flex-1 wireframe-button bg-white text-black border-black text-[10px] uppercase py-2.5 hover:bg-gray-100 font-bold flex items-center justify-center gap-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSendDocumentSubmit}
                disabled={!selectedPractice || (attachedFiles.length === 0 && !customDocName.trim())}
                className="flex-1 wireframe-button bg-black text-white border-black text-[10px] uppercase py-2.5 font-bold disabled:opacity-50 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
              >
                <Send size={10} /> Send Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-black text-white border-2 border-white p-4 max-w-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-300 flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-tight">{toast.message}</p>
          <div className="flex gap-3 justify-end items-center">
            {toastAction && (
              <button
                onClick={() => {
                  toastAction.onClick();
                  setToast(null);
                  setToastAction(null);
                }}
                className="text-[9px] font-black uppercase bg-white text-black px-1.5 py-0.5 hover:bg-zinc-200 transition-all border border-white"
              >
                {toastAction.label}
              </button>
            )}
            <button 
              onClick={() => {
                setToast(null);
                setToastAction(null);
              }}
              className="text-[9px] font-black uppercase underline hover:text-zinc-300"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      </div>
      <InviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        defaultRole={inviteRole}
        onSuccess={(email) => {
          showToast(`Invitation sent to ${email}`);
        }}
      />
    </MainLayout>
  );
}

function ActionCard({ label, desc, onClick }: { label: string, desc: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="wireframe-card p-4 bg-white hover:bg-black hover:text-white cursor-pointer transition-all group"
    >
      <h4 className="font-bold uppercase text-[10px] tracking-tight">{label}</h4>
      <p className="text-[8px] uppercase opacity-70 group-hover:opacity-100">{desc}</p>
    </div>
  );
}
