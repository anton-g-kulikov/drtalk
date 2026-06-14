"use client";

import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { SendDocumentPatientFields } from '@/components/prototype/SendDocumentPatientFields';
import { SendDocumentPracticeSelector } from '@/components/prototype/SendDocumentPracticeSelector';
import { SendDocumentUploadSection } from '@/components/prototype/SendDocumentUploadSection';
import {
  FileText, Send, ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useVerification } from '@/components/VerificationContext';
import { 
  initialDocuments, 
  initialMessages, 
  mockChannels,
} from '@/prototype/channelFixtures';
import type { MessageItem, SharedDocument } from '@/prototype/channelTypes';
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
            <SendDocumentPracticeSelector
              selectedPractices={selectedPractices}
              searchQuery={practiceSearchQuery}
              isOpen={isPracticeDropdownOpen}
              practices={connectedPractices
                .filter(p => p.name.toLowerCase().includes(practiceSearchQuery.toLowerCase()))
                .filter(p => !selectedPractices.includes(p.name))}
              onSearchQueryChange={setPracticeSearchQuery}
              onOpenChange={setIsPracticeDropdownOpen}
              onRemovePractice={(practiceName) => setSelectedPractices(prev => prev.filter(p => p !== practiceName))}
              onSelectPractice={(practiceName) => {
                setSelectedPractices(prev => [...prev, practiceName]);
                setPracticeSearchQuery('');
                setIsPracticeDropdownOpen(false);
              }}
            />

            <SendDocumentUploadSection
              inputId="dashboard-file-input"
              attachedFiles={attachedFiles}
              onFileSelect={handleRealFileSelect}
              onRemoveFile={(fileId) => {
                setAttachedFiles(prev => {
                  const remaining = prev.filter(f => f.id !== fileId);
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
              onAttachMockScan={handleAttachMockScan}
            />

            <SendDocumentPatientFields
              patientFirstName={patientFirstName}
              patientLastName={patientLastName}
              patientDob={patientDob}
              uploadMessage={uploadMessage}
              onPatientFirstNameChange={setPatientFirstName}
              onPatientLastNameChange={setPatientLastName}
              onPatientDobChange={setPatientDob}
              onUploadMessageChange={setUploadMessage}
            />
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
