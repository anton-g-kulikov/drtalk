"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout";
import {
  FileText, Send, Upload, X, ChevronDown, ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useVerification } from '@/components/VerificationContext';
import { 
  initialDocuments, 
  initialMessages, 
  mockChannels, 
  SharedDocument, 
  MessageItem 
} from '@/app/channels/page';
import { dentistPractices } from '@/lib/mockGenerator';

// Helper functions
function getNewId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

function getFormattedDateTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('en-US');
}

function getFormattedTimeOnly(): string {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function SpecialistSendDocumentPage() {
  const router = useRouter();
  const { isVerified } = useVerification();

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [toastAction, setToastAction] = useState<{ label: string; onClick: () => void } | null>(null);

  const showToast = (message: string, action?: { label: string; onClick: () => void }) => {
    setToast({ message, type: 'success' });
    if (action) setToastAction(action);
    setTimeout(() => {
      setToast(null);
      setToastAction(null);
    }, 5000);
  };

  // Form State
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [practiceSearchQuery, setPracticeSearchQuery] = useState('');
  const [isPracticeDropdownOpen, setIsPracticeDropdownOpen] = useState(false);

  const [attachedFiles, setAttachedFiles] = useState<{ id: string, name: string, size: string, type: string }[]>([]);
  const [customDocName, setCustomDocName] = useState('');
  const [customDocType, setCustomDocType] = useState('pdf');
  const [customDocSize, setCustomDocSize] = useState('2.4 MB');
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  const connectedPractices = dentistPractices;

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
    if (selectedPractices.length === 0) return;
    
    const docName = customDocName || 'SHARED_DOCUMENT.PDF';

    selectedPractices.forEach(practiceName => {
      const targetChannel = mockChannels.find(c => {
        if (practiceName === 'Sunshine Dental') {
          return c.id === '3';
        }
        return c.name.toLowerCase().includes(practiceName.toLowerCase());
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
      initialDocuments.push(newDoc);

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

      if (!initialMessages[channelId]) {
        initialMessages[channelId] = [];
      }
      initialMessages[channelId].push(newMsg);
    });

    const displayPracticeName = selectedPractices.length === 1 ? selectedPractices[0] : `${selectedPractices.length} practices`;
    
    // Clear states
    setCustomDocName('');
    setAttachedFiles([]);
    setPatientFirstName('');
    setPatientLastName('');
    setPatientDob('');
    setUploadMessage('');
    setSelectedPractices([]);

    // Trigger toast
    showToast(`Shared document with ${displayPracticeName}!`, {
      label: 'VIEW CHAT',
      onClick: () => {
        if (selectedPractices.length === 1) {
          router.push(`/channels?practice=${encodeURIComponent(selectedPractices[0])}`);
        } else {
          router.push('/channels');
        }
      }
    });
  };

  return (
    <MainLayout title="Send Document">
      <div className="max-w-xl mx-auto space-y-6 pb-20">
        
        {/* Back link */}
        <div>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-black hover:underline"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>

        <div className="bg-white p-6 text-black">
          <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
              <FileText size={16} /> Send Document
            </h3>
          </div>

          <div className="space-y-4">
            {/* Field 1: Connected Practice Multi-Select */}
            <div className="relative">
              <span className="text-[10px] font-black uppercase block mb-1 text-black">
                Connected Practices (Select Multiple) <span className="text-red-500">*</span>
              </span>
              <div className="border-2 border-black bg-white p-2 min-h-[40px] text-xs">
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {selectedPractices.map(pName => (
                    <span key={pName} className="px-2 py-0.5 font-bold uppercase text-[8px] border border-black flex items-center gap-1 bg-black text-white">
                      {pName}
                      <button
                        type="button"
                        onClick={() => setSelectedPractices(prev => prev.filter(p => p !== pName))}
                        className="font-bold ml-1 text-[9px] hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type to search and add practices..."
                    value={practiceSearchQuery}
                    onChange={(e) => {
                      setPracticeSearchQuery(e.target.value);
                      setIsPracticeDropdownOpen(true);
                    }}
                    onFocus={() => setIsPracticeDropdownOpen(true)}
                    className="w-full bg-transparent outline-none border-none p-0 focus:ring-0 text-[10px] uppercase font-bold text-black placeholder:text-zinc-400 h-5"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPracticeDropdownOpen(!isPracticeDropdownOpen)}
                    className="text-black"
                  >
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isPracticeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {isPracticeDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsPracticeDropdownOpen(false)} />
                  <div className="absolute left-0 right-0 mt-1 z-50 bg-white border-2 border-black max-h-48 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-[9px]">
                    {connectedPractices
                      .filter(p => p.name.toLowerCase().includes(practiceSearchQuery.toLowerCase()))
                      .filter(p => !selectedPractices.includes(p.name))
                      .map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedPractices(prev => [...prev, p.name]);
                            setPracticeSearchQuery('');
                            setIsPracticeDropdownOpen(false);
                          }}
                          className="p-2 hover:bg-black hover:text-white cursor-pointer font-bold border-b border-black/10 flex justify-between items-center bg-white text-black"
                        >
                          <span>{p.name}</span>
                          {(p as any).isVerified === false && (
                            <span className="text-[6px] px-1 font-black bg-zinc-200 text-black">
                              UNVERIFIED
                            </span>
                          )}
                        </div>
                      ))}
                    {connectedPractices.filter(p => p.name.toLowerCase().includes(practiceSearchQuery.toLowerCase())).filter(p => !selectedPractices.includes(p.name)).length === 0 && (
                      <div className="p-2 text-zinc-400 font-bold bg-white text-center">No practices found</div>
                    )}
                  </div>
                </>
              )}
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
              onClick={() => router.push('/dashboard')}
              className="flex-1 wireframe-button bg-white text-black border-black text-[10px] uppercase py-2.5 hover:bg-gray-100 font-bold flex items-center justify-center gap-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSendDocumentSubmit}
              disabled={selectedPractices.length === 0 || (attachedFiles.length === 0 && !customDocName.trim())}
              className="flex-1 wireframe-button bg-black text-white border-black text-[10px] uppercase py-2.5 font-bold disabled:opacity-50 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <Send size={10} /> Send Document
            </button>
          </div>
        </div>
      </div>

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
                className="text-[9px] font-black uppercase underline hover:text-gray-300"
              >
                {toastAction.label}
              </button>
            )}
            <button
              onClick={() => {
                setToast(null);
                setToastAction(null);
              }}
              className="text-[9px] font-black uppercase hover:text-gray-300"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
