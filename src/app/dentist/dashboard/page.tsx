"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useRouter } from 'next/navigation';
import {
  AlertCircle, MessageSquare, ArrowUpRight,
  TrendingUp, Users, FileText, Send, Search, Clock, Plus, GraduationCap,
  Upload, X, Eye, Paperclip, Lock, Archive, Calendar
} from 'lucide-react';

import { useVerification } from '@/components/VerificationContext';
import { useSubscription } from '@/components/SubscriptionContext';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import {
  initialDocuments,
  initialMessages,
  mockChannels,
  SharedDocument,
  MessageItem
} from '@/app/channels/page';
import { getReferrals, UnifiedReferral, initialReferrals, getReferralCode, isInRange } from '@/lib/referrals';

// Helper functions defined outside the React component to satisfy the React Compiler's strict purity/immutability checks.
function addSharedDocumentsToDb(newDocs: SharedDocument[]) {
  initialDocuments.push(...newDocs);
}

function addMessagesToDb(channelId: string, newMsgs: MessageItem[]) {
  if (!initialMessages[channelId]) {
    initialMessages[channelId] = [];
  }
  initialMessages[channelId].push(...newMsgs);
}

// Referral type compatibility
export type SentReferral = UnifiedReferral;

import { CommentMarker } from "@/components/Comments/CommentMarker";
import { InviteModal } from '@/components/InviteModal';

export default function DentistDashboardPage() {
  const { isTrialEnded, setShowPaywall } = useSubscription();
  const [referralsList, setReferralsList] = useState<UnifiedReferral[]>(initialReferrals);
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year' | 'last_year'>('month');

  useEffect(() => {
    setTimeout(() => {
      setReferralsList(getReferrals());
    }, 0);
  }, []);

  const sentReferrals: SentReferral[] = referralsList.filter(r => r.id.startsWith('D-') || r.id === '1' || r.dentist.includes('Reed') || r.dentist.includes('Taylor'));
  
  const referralsSentCount = sentReferrals.filter(r => (r.status === 'Sent' || r.status === 'Received') && isInRange(r.receivedAt, timeRange)).length;
  const referralsScheduledCount = sentReferrals.filter(r => r.status === 'Scheduled' && isInRange(r.receivedAt, timeRange)).length;
  const specialtyCareCompleteCount = sentReferrals.filter(r => r.status === 'Completed' && isInRange(r.receivedAt, timeRange)).length;

  interface DocumentItem {
    id: string;
    name: string;
    sender: string;
    date: string;
    size: string;
    channelName: string;
    fromChannel?: boolean;
  }

  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: 'doc-dentist-1', name: 'PANO_REPLY_ALICE_COOPER.PNG', sender: 'Valley Endodontics', date: 'Today, 10:24 AM', size: '2.4 MB', channelName: 'Valley Endodontics', fromChannel: true },
    { id: 'doc-dentist-2', name: 'TREATMENT_PLAN_REVISION.PDF', sender: 'Downtown Oral Surgery', date: 'Yesterday, 02:15 PM', size: '1.8 MB', channelName: 'Downtown Oral Surgery', fromChannel: false },
    { id: 'doc-dentist-3', name: 'CBCT_MANDIBULAR_RECONSTRUCTION.ZIP', sender: 'Arizona Periodontics', date: '05/10/2026, 04:30 PM', size: '12.4 MB', channelName: 'Arizona Periodontics', fromChannel: true }
  ]);

  const [archivedDocuments, setArchivedDocuments] = useState<DocumentItem[]>([]);
  const [activeInboxTab, setActiveInboxTab] = useState<'inbox' | 'archived'>('inbox');

  // Sync with localStorage
  useEffect(() => {
    const savedDocs = localStorage.getItem('drtalk_dentist_docs');
    const savedArchived = localStorage.getItem('drtalk_dentist_archived_docs');
    if (savedDocs) {
      try {
        const docs = JSON.parse(savedDocs);
        setTimeout(() => setDocuments(docs), 0);
      } catch (e) {
        console.error(e);
      }
    }
    if (savedArchived) {
      try {
        const archived = JSON.parse(savedArchived);
        setTimeout(() => setArchivedDocuments(archived), 0);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveDocumentsToStorage = (newDocs: DocumentItem[]) => {
    setDocuments(newDocs);
    localStorage.setItem('drtalk_dentist_docs', JSON.stringify(newDocs));
  };

  const saveArchivedToStorage = (newArchived: DocumentItem[]) => {
    setArchivedDocuments(newArchived);
    localStorage.setItem('drtalk_dentist_archived_docs', JSON.stringify(newArchived));
  };

  const handleArchiveDocument = (doc: DocumentItem) => {
    const updatedDocs = documents.filter(d => d.id !== doc.id);
    saveDocumentsToStorage(updatedDocs);
    const updatedArchived = [doc, ...archivedDocuments];
    saveArchivedToStorage(updatedArchived);
    triggerToast(`Archived ${doc.name}!`);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { isVerified, hasPracticeOwner } = useVerification();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState('Team Member');

  // Send Document Modal State
  const [isSendDocOpen, setIsSendDocOpen] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState('');
  const [selectedReferral, setSelectedReferral] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastAction, setToastAction] = useState<{ label: string; onClick: () => void } | null>(null);

  // Direct Upload State Form
  const [customDocName, setCustomDocName] = useState('');
  const [customDocType, setCustomDocType] = useState<'pdf' | 'image' | 'zip' | 'doc'>('pdf');
  const [customDocSize, setCustomDocSize] = useState('1.5 MB');
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  const triggerToast = (msg: string, action?: { label: string; onClick: () => void }) => {
    setToastMessage(msg);
    setToastAction(action || null);
    setTimeout(() => {
      setToastMessage(null);
      setToastAction(null);
    }, 6000);
  };

  const connectedPractices = React.useMemo(() => {
    return mockChannels.filter(c => c.type === 'inter-practice');
  }, []);

  const filteredReferralsForDoc = React.useMemo(() => {
    if (!selectedPractice) return sentReferrals;
    return sentReferrals.filter(r => r.specialist === selectedPractice);
  }, [selectedPractice, sentReferrals]);

  const handleSelectReferral = (refId: string) => {
    setSelectedReferral(refId);
    if (refId) {
      const ref = sentReferrals.find(r => r.id === refId);
      if (ref) {
        setSelectedPractice(ref.specialist);
      }
    }
  };

  const handleSelectPractice = (practiceName: string) => {
    setSelectedPractice(practiceName);
    if (practiceName && selectedReferral) {
      const ref = sentReferrals.find(r => r.id === selectedReferral);
      if (ref && ref.specialist !== practiceName) {
        setSelectedReferral('');
      }
    }
  };

  const handleRealFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    let type: 'pdf' | 'image' | 'zip' | 'doc' = 'doc';
    if (extension === 'pdf') type = 'pdf';
    else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) type = 'image';
    else if (['zip', 'rar', 'tar', 'gz'].includes(extension)) type = 'zip';

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const formattedSize = parseFloat(sizeMB) > 0.1 ? `${sizeMB} MB` : `${(file.size / 1024).toFixed(0)} KB`;

    setCustomDocName(file.name);
    setCustomDocType(type);
    setCustomDocSize(formattedSize);

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newFile = {
      id: 'temp_' + Math.random().toString(36).substring(2, 9),
      channelId: '',
      name: file.name,
      size: formattedSize,
      type: type,
      sentBy: 'Me',
      sentAt: 'Today, ' + timeString
    };

    setAttachedFiles(prev => [...prev, newFile]);
    triggerToast(`Attached "${file.name}" successfully!`);
    e.target.value = '';
  };

  const handleAttachMockScan = () => {
    const mockFiles = [
      {
        name: 'SURGERY_REPORT_COOPER.PDF',
        type: 'pdf' as const,
        size: '2.1 MB',
        patient: { first: 'Alice', last: 'Cooper', dob: '12/04/1978', msg: 'Hi, here is the surgery report post-evaluation.' }
      },
      {
        name: 'PANO_XRAY_REVISION.PNG',
        type: 'image' as const,
        size: '4.8 MB',
        patient: { first: 'Marco', last: 'Reyes', dob: '05/14/1988', msg: 'Hi, sending over the post-op panoramic radiograph.' }
      },
      {
        name: 'CT_SCAN_MANDIBLE.ZIP',
        type: 'zip' as const,
        size: '12.4 MB',
        patient: { first: 'Nina', last: 'Patel', dob: '10/20/1990', msg: 'Full mandibular CBCT volume.' }
      },
      {
        name: 'CLINICAL_SUMMARY_VALLEY.PDF',
        type: 'pdf' as const,
        size: '1.1 MB',
        patient: { first: 'John', last: 'Doe', dob: '08/08/1985', msg: 'Valley Endodontics clinical notes.' }
      }
    ];

    let choice = mockFiles[attachedFiles.length % mockFiles.length];
    if (selectedReferral) {
      const ref = sentReferrals.find(r => r.id === selectedReferral);
      if (ref) {
        const parts = ref.patientName.split(' ');
        const matched = mockFiles.find(f => f.patient.last.toLowerCase() === parts[1]?.toLowerCase());
        if (matched) {
          choice = matched;
        } else {
          choice = {
            ...choice,
            patient: {
              first: parts[0] || '',
              last: parts[1] || '',
              dob: ref.id === '1' ? '12/04/1978' : ref.id === 'D-1002' ? '05/14/1988' : '10/20/1990',
              msg: `Document regarding referral ${ref.id} for ${ref.patientName}.`
            }
          };
        }
      }
    }

    setCustomDocName(choice.name);
    setCustomDocType(choice.type);
    setCustomDocSize(choice.size);
    setPatientFirstName(choice.patient.first);
    setPatientLastName(choice.patient.last);
    setPatientDob(choice.patient.dob);
    setUploadMessage(choice.patient.msg);

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newFile = {
      id: 'temp_' + Math.random().toString(36).substring(2, 9),
      channelId: '',
      name: choice.name,
      size: choice.size,
      type: choice.type,
      sentBy: 'Me',
      sentAt: 'Today, ' + timeString
    };
    setAttachedFiles(prev => [...prev, newFile]);
    triggerToast(`Mock attached "${choice.name}" successfully!`);
  };

  const handleSendDocumentSubmit = () => {
    if (isTrialEnded) {
      setShowPaywall(true);
      return;
    }
    if (!selectedPractice) {
      triggerToast("Please select a connected practice.");
      return;
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let filesToShare: any[] = [];

    if (attachedFiles.length > 0) {
      filesToShare = attachedFiles;
    } else if (customDocName.trim()) {
      const formattedName = customDocName.toLowerCase().endsWith(`.${customDocType}`)
        ? customDocName.toLowerCase()
        : `${customDocName.toLowerCase()}.${customDocType}`;
      filesToShare = [{
        name: formattedName,
        size: customDocSize || '1.5 MB',
        type: customDocType,
      }];
    }

    if (filesToShare.length === 0) {
      triggerToast("Please attach or select at least one document.");
      return;
    }

    const matchedChannel = mockChannels.find(c => c.name === selectedPractice);
    const channelId = matchedChannel ? matchedChannel.id : '3';

    const finalDocs: SharedDocument[] = filesToShare.map(file => ({
      id: 'd_' + Math.random().toString(36).substring(2, 9),
      channelId: channelId,
      name: file.name,
      size: file.size,
      type: file.type,
      sentBy: 'Me',
      sentAt: 'Today, ' + timeString
    }));

    addSharedDocumentsToDb(finalDocs);

    const newMessages: MessageItem[] = finalDocs.map((newDoc, index) => {
      let messageText = `Directly shared document: ${newDoc.name}`;

      if (selectedReferral) {
        messageText += `\nAssociated Referral: ${selectedReferral}`;
      }

      if (index === 0) {
        if (patientFirstName || patientLastName) {
          const patientName = `${patientFirstName} ${patientLastName}`.trim();
          messageText += `\nAssociated Patient: ${patientName}`;
          if (patientDob) messageText += ` (DOB: ${patientDob})`;
        }
        if (uploadMessage.trim()) {
          messageText += `\nMessage: ${uploadMessage.trim()}`;
        }
      }

      return {
        id: 'm_' + Math.random().toString(36).substring(2, 9),
        user: 'Me',
        text: messageText,
        time: timeString,
        type: 'self',
        transport: 'App',
        document: newDoc
      };
    });

    addMessagesToDb(channelId, newMessages);

    const practiceName = selectedPractice;

    setAttachedFiles([]);
    setCustomDocName('');
    setPatientFirstName('');
    setPatientLastName('');
    setPatientDob('');
    setUploadMessage('');
    setSelectedPractice('');
    setSelectedReferral('');
    setIsSendDocOpen(false);

    triggerToast(
      `Shared ${finalDocs.length} document${finalDocs.length > 1 ? 's' : ''} with ${practiceName}!`,
      {
        label: "View Chat",
        onClick: () => router.push(`/dentist/channels?practice=${encodeURIComponent(practiceName)}`)
      }
    );
  };

  const filteredReferrals = sentReferrals.filter((referral) =>
    referral.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    referral.specialist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    referral.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout title="Dentist Dashboard">
      <div className="max-w-6xl mx-auto space-y-8">

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
                    Practice owner verification is required to refer patients and access PHI.
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
                className="wireframe-button bg-black text-white text-[10px] uppercase px-8 py-3 whitespace-nowrap"
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
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">Dashboard</h2>
              <CommentMarker id="dashboard-dentist" title="Dentist Dashboard" description="The main overview for dentist practices." />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              REFER PATIENTS, Track Patient’s Progress, And completion of specialty care
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => router.push('/dentist/referral')}
              className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-3 flex items-center justify-center gap-2 flex-1 sm:flex-none hover:bg-zinc-800 transition-colors"
            >
              Send a Referral <Plus size={14} />
            </button>
            <button
              onClick={() => {
                if (isTrialEnded) {
                  setShowPaywall(true);
                } else {
                  setIsSendDocOpen(true);
                }
              }}
              className="wireframe-button bg-white text-black border-black text-[10px] uppercase px-6 py-3 flex items-center justify-center gap-2 flex-1 sm:flex-none hover:bg-zinc-100 transition-colors"
            >
              Send Document <FileText size={14} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Referrals Sent', value: '09', icon: FileText, path: '/dentist/referrals?tab=Received' },
            { label: 'Referrals scheduled', value: '04', icon: Calendar, path: '/dentist/referrals?tab=Scheduled' },
            { 
              label: 'Specialty Care Complete', 
              value: (sentReferrals.filter(r => r.status === 'Completed').length).toString().padStart(2, '0'), 
              icon: FileText,
              path: '/dentist/referrals?tab=Completed'
            },
            { label: '# drtalk connections', value: '15', icon: Users, path: '/dentist/network' },
          ].map((stat) => (
            <div 
              key={stat.label} 
              onClick={() => router.push(stat.path)}
              className="wireframe-card p-5 bg-white flex items-center gap-4 hover:bg-zinc-50 cursor-pointer transition-colors"
            >
              <stat.icon size={32} className="text-black shrink-0" />
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-muted-foreground">{stat.label}</p>
                <span className="text-3xl font-bold tracking-tighter block leading-none">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Action Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Documents Inbox */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-black"></div>
                  <h3 className="font-black uppercase text-sm tracking-widest italic">Documents</h3>
                </div>
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

                {activeInboxTab === 'inbox' ? (
                  documents.length === 0 ? (
                    <div className="wireframe-card p-6 text-center text-muted-foreground uppercase text-[10px] font-bold bg-gray-50 border-dashed border-2 border-black">
                      No new documents in inbox
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
                                <div className="flex items-center gap-2">
                                  <p
                                    onClick={() => router.push(`/documents/${doc.id}?role=dentist`)}
                                    className="font-black uppercase text-xs tracking-tight hover:underline cursor-pointer text-black"
                                  >
                                    {doc.name}
                                  </p>
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" title="New document" />
                                </div>
                                <div className="flex gap-2 items-center text-[9px] font-bold uppercase text-muted-foreground">
                                  <span>Practice: {doc.sender}</span>
                                  <span>•</span>
                                  <span>{doc.size}</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-[8px] font-bold uppercase text-muted-foreground">{doc.date}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-black/10 justify-between items-center">
                            {doc.fromChannel ? (
                              <>
                                <span className="text-[8px] uppercase font-bold text-muted-foreground italic">
                                  Discuss and view this document in the inter-practice channel
                                </span>
                                <button
                                  onClick={() => router.push(`/dentist/channels?practice=${encodeURIComponent(doc.channelName)}`)}
                                  className="wireframe-button text-[9px] font-black uppercase px-4 py-1.5 bg-black text-white hover:bg-zinc-800 transition-colors flex items-center gap-1"
                                >
                                  View & Discuss in Channel <ArrowUpRight size={12} />
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="text-[8px] uppercase font-bold text-muted-foreground italic">
                                  This document is not associated with an active communication channel
                                </span>
                                <button
                                  onClick={() => handleArchiveDocument(doc)}
                                  className="wireframe-button text-[9px] font-black uppercase px-4 py-1.5 bg-zinc-100 border-2 border-black text-black hover:bg-black hover:text-white transition-colors flex items-center gap-1"
                                >
                                  Archive <Archive size={12} />
                                </button>
                              </>
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
                                  onClick={() => router.push(`/documents/${doc.id}?role=dentist`)}
                                  className="font-black uppercase text-xs tracking-tight hover:underline cursor-pointer text-black"
                                >
                                  {doc.name}
                                </p>
                                <div className="flex gap-2 items-center text-[9px] font-bold uppercase text-muted-foreground">
                                  <span>Practice: {doc.sender}</span>
                                  <span>•</span>
                                  <span>{doc.size}</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-[8px] font-bold uppercase text-muted-foreground">{doc.date}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-black/10 justify-between items-center">
                            <span className="text-[8px] uppercase font-bold text-muted-foreground italic">
                               This document has been archived from your active inbox
                            </span>
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

            {/* Recent Referrals Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-black"></div>
                  <h3 className="font-black uppercase text-sm tracking-widest italic">Referrals Sent</h3>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="SEARCH REFERRALS..."
                    className="wireframe-input pl-10 py-1.5 text-[9px] w-full sm:w-64"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredReferrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="wireframe-card p-4 hover:bg-gray-50 transition-all cursor-pointer"
                    onClick={() => router.push(`/dentist/channels?practice=${encodeURIComponent(referral.specialist)}&caseId=case_${referral.id}`)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-4">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black uppercase">Patient: {referral.patientName}</p>
                          {referral.urgency === 'Urgent' && (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[8px] font-black uppercase px-1 py-0.5 rounded-sm shrink-0">Urgent</span>
                          )}
                          {referral.urgency === 'Emergency' && (
                            <span className="bg-red-100 text-red-900 border border-red-300 text-[8px] font-black uppercase px-1 py-0.5 rounded-sm shrink-0">Emergency</span>
                          )}
                        </div>
                        <p className="text-[9px] uppercase font-bold text-muted-foreground">Sender: {referral.sender}</p>
                      </div>
                      <div className="md:col-span-4">
                        <p className="text-[10px] uppercase font-black">{referral.specialist}</p>
                        <p className="text-[8px] uppercase text-muted-foreground font-bold">{getReferralCode(referral.id)}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="inline-block border border-black px-2 py-1 text-[8px] uppercase font-black">
                          {referral.status}
                        </span>
                      </div>
                      <div className="md:col-span-2 flex items-center justify-end gap-2 text-muted-foreground">
                        <span className="text-[9px] uppercase font-bold whitespace-pre-line text-right">{referral.lastUpdate}</span>
                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push('/dentist/referrals')}
                className="text-[10px] font-black uppercase underline"
              >
                View all Referrals
              </button>
            </div>
          </div>

          {/* Side Column */}
          <div className="lg:col-span-4 space-y-8">

            {/* Specialist Conversations */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                <MessageSquare size={18} />
                <h3 className="font-bold uppercase text-xs tracking-widest">Specialist Conversations</h3>
              </div>
              <div className="wireframe-card p-0 divide-y-2 divide-black bg-white overflow-hidden">
                {[
                  { id: 1, name: 'Valley Endodontics', msg: 'Regarding Alice Cooper: pano received.', initials: 'VE' },
                  { id: 2, name: 'Downtown Oral Surgery', msg: 'Requesting pano image for Marco Reyes.', initials: 'DO' }
                ].map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/dentist/channels?practice=${encodeURIComponent(item.name)}`)}
                  >
                    <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-white font-bold text-[10px] shrink-0">{item.initials}</div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="text-[9px] font-bold uppercase truncate">{item.name}</p>
                        <span className="text-[7px] text-muted-foreground uppercase shrink-0 whitespace-pre-line text-right">10:05 AM{"\n"}05/11/2026</span>
                      </div>
                      <p className="text-[9px] uppercase truncate opacity-70 italic">
                        {item.msg}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="font-bold uppercase text-xs tracking-widest border-b-2 border-black pb-2">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <ActionCard
                  label="Find Specialist"
                  desc="Browse the drTalk network"
                  onClick={() => router.push('/dentist/network')}
                />
                <ActionCard
                  label="Practice Setup"
                  desc="Manage your dentist profile"
                  onClick={() => router.push('/dentist/settings')}
                />
              </div>
            </div>

            {/* Learning Hub */}
            <div className="wireframe-card p-5 space-y-4 bg-gray-50">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} />
                <h3 className="text-xs uppercase font-black">Learning Hub</h3>
              </div>
              <p className="text-[9px] uppercase font-bold text-muted-foreground leading-relaxed">
                Browse clinical guides and practice growth resources.
              </p>
              <button
                onClick={() => router.push('/dentist/academy')}
                className="wireframe-button w-full bg-black text-white text-[10px] uppercase py-3"
              >
                Open Learning Hub
              </button>
            </div>
            {/* Commented out Trial widget for Dentist profile */}
            {/* <SubscriptionBanner /> */}
          </div>

        </div>
      </div>

      {/* Premium Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-black text-white border-2 border-white px-4 py-3 font-bold uppercase text-[9px] tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fade-in flex items-center gap-3">
          <span>{toastMessage}</span>
          {toastAction && (
            <button
              onClick={toastAction.onClick}
              className="bg-white text-black px-2 py-0.5 font-black uppercase text-[8px] hover:bg-zinc-200 transition-colors"
            >
              {toastAction.label}
            </button>
          )}
        </div>
      )}

      {/* Send Document Modal */}
      {isSendDocOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
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
                  setSelectedReferral('');
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
                  onChange={(e) => handleSelectPractice(e.target.value)}
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

              {/* Field 2: Choice of sent referral (optional) */}
              <div>
                <span className="text-[10px] font-black uppercase block mb-1.5 text-black">
                  Associated Referral (Optional)
                </span>
                <select
                  value={selectedReferral}
                  onChange={(e) => handleSelectReferral(e.target.value)}
                  className="wireframe-input py-2 px-3 text-xs font-bold text-black border-black bg-white w-full h-10 focus:ring-0 focus:outline-none"
                >
                  <option value="">NONE / NEW REFERRAL</option>
                  {filteredReferralsForDoc.map((referral) => (
                    <option key={referral.id} value={referral.id}>
                      {getReferralCode(referral.id)} - {referral.patientName}
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
                  setSelectedReferral('');
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
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        defaultRole={inviteRole}
        onSuccess={(email) => {
          triggerToast(`Invitation sent to ${email}`);
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
