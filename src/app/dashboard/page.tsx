"use client";

import React, { useState } from 'react';
import { MainLayout } from "@/components/MainLayout";
import {
  AlertCircle, MessageSquare, ArrowUpRight,
  TrendingUp, Users, FileText, Send
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useVerification } from '@/components/VerificationContext';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { CommentMarker } from "@/components/Comments/CommentMarker";

export default function DashboardPage() {
  const router = useRouter();
  const { isVerified, setShowVerification, hasPracticeOwner } = useVerification();

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
  }

  interface ReferralItem {
    id: string;
    patient: string;
    type: string;
    source: string;
    date: string;
    status: 'new_processing' | 'new_docs';
    detail: string;
  }

  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: 'doc-1', name: 'PANO_IMAGE_ALICE_COOPER.JPG', sender: 'Dr. Smith (Dentist)', date: '10:05 AM 05/18/2026', size: '2.4 MB' },
    { id: 'doc-2', name: 'REFERRAL_FORM_JOHN_DOE.PDF', sender: 'Dr. Jane Doe (Dentist)', date: '09:15 AM 05/18/2026', size: '1.2 MB' },
    { id: 'doc-3', name: 'CBCT_SCAN_BOB_MARLEY.DCM', sender: 'Dr. Robert Miller', date: '04:30 PM 05/17/2026', size: '15.8 MB' }
  ]);

  const [referrals, setReferrals] = useState<ReferralItem[]>([
    { id: '1', patient: 'Charlie Brown', type: 'Endodontic', source: 'Dr. Smith', date: '05/18/2026', status: 'new_processing', detail: 'Missing Attachment' },
    { id: '5', patient: 'Eve Online', type: 'Periodontal', source: 'Dr. Miller', date: '05/17/2026', status: 'new_processing', detail: 'Incomplete Data (30%)' },
    { id: '2', patient: 'Bob Marley', type: 'Extraction', source: 'Dr. Smith', date: '05/18/2026', status: 'new_docs', detail: 'Incomplete Data (45%)' }
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
      id: Date.now().toString(),
      patient: convertPatientName || 'NEW PATIENT',
      type: convertReferralType,
      source: selectedDocument.sender,
      date: new Date().toLocaleDateString('en-US'),
      status: 'new_processing',
      detail: `Converted from: ${selectedDocument.name}`
    };

    setReferrals(prev => [newReferral, ...prev]);
    setDocuments(prev => prev.filter(d => d.id !== selectedDocument.id));
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

    setDocuments(prev => prev.filter(d => d.id !== selectedDocument.id));
    setActiveModal(null);
    
    const targetRef = referrals.find(r => r.id === referralId);
    showToast(`Attached ${selectedDocument.name} to ${targetRef?.patient || 'referral'}.`);
    setSelectedDocument(null);
  };

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const newProcessingReferrals = referrals.filter(r => r.status === 'new_processing');
  const newDocsReferrals = referrals.filter(r => r.status === 'new_docs');

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
                onClick={() => router.push('/dashboard/settings/team')}
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
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter italic">Dashboard</h2>
              <CommentMarker id="dashboard-practice" title="Practice Dashboard" description="The main overview for the practice workspace." />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              Receive referrals, process cases, coordinate with dentists, and manage patient communication.
            </p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button
              onClick={() => router.push('/referrals')}
              className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-3 flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              Open Intake Queue <Send size={14} />
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
                  <h4 className="font-black uppercase text-xs tracking-wider flex items-center gap-2">
                    <span>Documents</span>
                    <span className="text-[9px] font-bold text-muted-foreground">({documents.length})</span>
                  </h4>
                </div>
                
                {documents.length === 0 ? (
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
                              <p className="font-black uppercase text-xs tracking-tight">{doc.name}</p>
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
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-black/10">
                          <button 
                            onClick={() => handleConvertDocument(doc)}
                            className="wireframe-button text-[9px] font-black uppercase px-3 py-1.5 bg-black text-white hover:bg-zinc-800 transition-colors"
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
                      </div>
                    ))}
                  </div>
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
                          <div className="flex items-center gap-4">
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
                          <div className="flex items-center gap-4">
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
                  onClick={() => router.push('/dashboard/invite')}
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

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-4 right-4 z-50 bg-black text-white border-2 border-white p-4 max-w-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-300 flex items-center justify-between gap-4">
            <p className="text-[10px] font-black uppercase tracking-tight">{toast.message}</p>
            <button 
              onClick={() => setToast(null)}
              className="text-[9px] font-black uppercase underline hover:text-zinc-300"
            >
              Dismiss
            </button>
          </div>
        )}

      </div>
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
