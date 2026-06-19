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

import { 
  initialDocuments, 
  initialMessages, 
  mockChannels,
} from '@/prototype/channelFixtures';
import {
  buildSendDocumentShare,
  buildSendDocumentToast,
  type SendDocumentFileType,
} from '@/prototype/sendDocumentFlow';
import { getInitialDentistDocs, dentistPractices } from '@/lib/mockGenerator';
import {
  getChannels,
  saveChannels,
  getMessages,
  saveMessages,
  type Channel
} from '@/lib/referrals';

export default function SpecialistSendDocumentPage() {
  const router = useRouter();

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
  const [sendMode, setSendMode] = useState<'connected' | 'custom'>('connected');
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [practiceSearchQuery, setPracticeSearchQuery] = useState('');
  const [isPracticeDropdownOpen, setIsPracticeDropdownOpen] = useState(false);
  const [customRecipient, setCustomRecipient] = useState('');
  const [customDeliveryType, setCustomDeliveryType] = useState<'email' | 'fax'>('email');

  const isCustomEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isCustomFaxValid = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    return clean.length >= 7 && /^[0-9+\-\(\)\s]+$/.test(val.trim());
  };
  const isCustomRecipientValid = customDeliveryType === 'email'
    ? isCustomEmailValid(customRecipient)
    : isCustomFaxValid(customRecipient);

  const [attachedFiles, setAttachedFiles] = useState<{ id: string, name: string, size: string, type: SendDocumentFileType }[]>([]);
  const [customDocName, setCustomDocName] = useState('');
  const [customDocType, setCustomDocType] = useState<SendDocumentFileType>('pdf');
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
      type: 'image' as const
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
    if (sendMode === 'connected' && selectedPractices.length === 0) return;
    if (sendMode === 'custom' && !customRecipient.trim()) return;

    const currentChannels = getChannels(false);
    const currentMessages = getMessages();
    const nextChannels = [...currentChannels];

    const sourcePractices = sendMode === 'custom'
      ? [`${customRecipient.trim()} (${customDeliveryType === 'email' ? 'Secure Email' : 'Secure Fax'})`]
      : selectedPractices;

    const resolvedPractices = sourcePractices.map((practiceName) => {
      const isCustomEmail = practiceName.toLowerCase().endsWith('(secure email)');
      const isCustomFax = practiceName.toLowerCase().endsWith('(secure fax)');
      
      if (isCustomEmail || isCustomFax) {
        const rawName = practiceName.replace(/\s*\(secure email\)\s*/i, '').replace(/\s*\(secure fax\)\s*/i, '');
        let existing = nextChannels.find(c => c.name.toLowerCase() === rawName.toLowerCase());
        if (!existing) {
          existing = {
            id: `ext_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: rawName,
            type: 'inter-practice',
            isExternal: true,
            isVerified: false,
            lastMessage: 'Connection active via Secure Document Delivery.',
            memberCount: 2,
          };
          nextChannels.push(existing);
        }
        return existing.name;
      }
      return practiceName;
    });

    const share = buildSendDocumentShare({
      role: 'specialist',
      selectedPractices: resolvedPractices,
      channels: nextChannels,
      existingMessages: currentMessages,
      files: attachedFiles,
      fallbackDocument: {
        name: customDocName || 'SHARED_DOCUMENT.PDF',
        size: customDocSize,
        type: customDocType,
      },
      patient: {
        firstName: patientFirstName,
        lastName: patientLastName,
        dob: patientDob,
      },
      note: uploadMessage,
    });

    saveChannels(false, nextChannels);
    saveMessages(share.messages);

    initialDocuments.push(...share.sharedDocuments);
    Object.entries(share.messages).forEach(([channelId, messages]) => {
      initialMessages[channelId] = messages;
    });
    const toastOutcome = buildSendDocumentToast('specialist', resolvedPractices, share.sharedDocuments.length);
    
    // Clear states
    setCustomDocName('');
    setAttachedFiles([]);
    setPatientFirstName('');
    setPatientLastName('');
    setPatientDob('');
    setUploadMessage('');
    setSelectedPractices([]);
    setCustomRecipient('');

    // Trigger toast
    showToast(toastOutcome.message, {
      label: 'VIEW CHAT',
      onClick: () => {
        router.push(toastOutcome.destinationHref);
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
            {/* Delivery Mode Toggle */}
            <div className="flex border-2 border-black">
              <button
                type="button"
                onClick={() => {
                  setSendMode('connected');
                  setCustomRecipient('');
                }}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider transition-all ${
                  sendMode === 'connected' ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-50'
                }`}
              >
                Connected Practices
              </button>
              <button
                type="button"
                onClick={() => {
                  setSendMode('custom');
                  setSelectedPractices([]);
                }}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider transition-all border-l-2 border-black ${
                  sendMode === 'custom' ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-50'
                }`}
              >
                New Secure Email / eFax
              </button>
            </div>

            {sendMode === 'connected' ? (
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
            ) : (
              <div className="space-y-3 p-3 border-2 border-black bg-zinc-50 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label htmlFor="custom-recipient" className="text-[10px] font-black uppercase block text-black">
                      Recipient Email / Fax Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="custom-recipient"
                      type="text"
                      placeholder="ENTER EMAIL OR FAX NUMBER..."
                      value={customRecipient}
                      onChange={(e) => setCustomRecipient(e.target.value)}
                      className={`wireframe-input py-2 px-3 text-[10px] font-bold text-black border-black bg-white w-full focus:outline-none h-[38px] border-2 ${
                        customRecipient.trim() && !isCustomRecipientValid ? 'border-red-500 bg-red-50/30' : ''
                      }`}
                    />
                    {customRecipient.trim() && !isCustomRecipientValid && (
                      <p className="text-[9px] text-red-600 font-bold uppercase mt-1">
                        {customDeliveryType === 'email'
                          ? 'Please enter a valid email address (e.g. doctor@domain.com)'
                          : 'Please enter a valid fax number (at least 7 digits, e.g. (555) 000-0000)'}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="custom-delivery-type" className="text-[10px] font-black uppercase block text-black">
                      Delivery Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="custom-delivery-type"
                      value={customDeliveryType}
                      onChange={(e) => setCustomDeliveryType(e.target.value as 'email' | 'fax')}
                      className="wireframe-input py-2 px-3 text-[10px] font-bold text-black border-black bg-white w-full focus:outline-none h-[38px] border-2"
                    >
                      <option value="email">SECURE EMAIL ✉</option>
                      <option value="fax">SECURE FAX 📠</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

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
              disabled={(sendMode === 'connected' ? selectedPractices.length === 0 : !isCustomRecipientValid) || (attachedFiles.length === 0 && !customDocName.trim())}
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
