"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { SendDocumentPatientFields } from '@/components/prototype/SendDocumentPatientFields';
import { SendDocumentPracticeSelector } from '@/components/prototype/SendDocumentPracticeSelector';
import { SendDocumentReferralSelector } from '@/components/prototype/SendDocumentReferralSelector';
import { SendDocumentUploadSection } from '@/components/prototype/SendDocumentUploadSection';
import { useRouter } from 'next/navigation';
import {
  FileText, Send, ArrowLeft
} from 'lucide-react';

import { useSubscription } from '@/components/SubscriptionContext';
import {
  initialDocuments,
  initialMessages,
  mockChannels,
} from '@/prototype/channelFixtures';
import {
  buildSendDocumentShare,
  buildSendDocumentToast,
  type SendDocumentAttachedFile,
  type SendDocumentFileType,
} from '@/prototype/sendDocumentFlow';
import { getReferrals, getReferralCode, UnifiedReferral, getChannels, saveChannels, getMessages, saveMessages } from '@/lib/referrals';

export default function DentistSendDocumentPage() {
  const router = useRouter();
  const { isTrialEnded, setShowPaywall } = useSubscription();

  const [referralsList, setReferralsList] = useState<UnifiedReferral[]>([]);

  useEffect(() => {
    setReferralsList(getReferrals());
  }, []);

  const sentReferrals = useMemo(() => {
    return referralsList.filter(r => r.id.startsWith('D-') || r.id === '1' || r.dentist.includes('Reed') || r.dentist.includes('Taylor'));
  }, [referralsList]);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastAction, setToastAction] = useState<{ label: string; onClick: () => void } | null>(null);

  const triggerToast = (msg: string, action?: { label: string; onClick: () => void }) => {
    setToastMessage(msg);
    setToastAction(action || null);
    setTimeout(() => {
      setToastMessage(null);
      setToastAction(null);
    }, 6000);
  };

  // Connected practices from channels
  const connectedPractices = useMemo(() => {
    return mockChannels.filter(c => c.type === 'inter-practice');
  }, []);

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

  const [selectedReferral, setSelectedReferral] = useState('');
  const [referralSearchQuery, setReferralSearchQuery] = useState('NONE / NEW REFERRAL');
  const [isReferralDropdownOpen, setIsReferralDropdownOpen] = useState(false);

  const [customDocName, setCustomDocName] = useState('');
  const [customDocType, setCustomDocType] = useState<SendDocumentFileType>('pdf');
  const [customDocSize, setCustomDocSize] = useState('1.5 MB');
  const [attachedFiles, setAttachedFiles] = useState<SendDocumentAttachedFile[]>([]);
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  // When selected practices are changed, we filter the referrals list for those practices
  const filteredReferralsForDoc = useMemo(() => {
    if (selectedPractices.length === 0) return sentReferrals;
    return sentReferrals.filter(r => selectedPractices.includes(r.specialist));
  }, [selectedPractices, sentReferrals]);

  const filteredReferralsList = useMemo(() => {
    if (!referralSearchQuery || referralSearchQuery === 'NONE / NEW REFERRAL') {
      return filteredReferralsForDoc;
    }
    const query = referralSearchQuery.toLowerCase().trim();
    return filteredReferralsForDoc.filter(r => {
      const code = getReferralCode(r.id).toLowerCase();
      const name = r.patientName.toLowerCase();
      return code.includes(query) || name.includes(query);
    });
  }, [filteredReferralsForDoc, referralSearchQuery]);

  const closeReferralDropdown = () => {
    setIsReferralDropdownOpen(false);
    if (selectedReferral) {
      const ref = sentReferrals.find(r => r.id === selectedReferral);
      if (ref) {
        setReferralSearchQuery(`${getReferralCode(ref.id)} - ${ref.patientName}`);
      }
    } else {
      setReferralSearchQuery('NONE / NEW REFERRAL');
    }
  };

  const handleSelectReferral = (refId: string) => {
    setSelectedReferral(refId);
    if (refId) {
      const ref = sentReferrals.find(r => r.id === refId);
      if (ref) {
        // Automatically add practice to selectedPractices if not present
        if (!selectedPractices.includes(ref.specialist)) {
          setSelectedPractices(prev => [...prev, ref.specialist]);
        }
        
        const parts = ref.patientName.trim().split(/\s+/);
        const first = parts[0] || '';
        const last = parts.slice(1).join(' ') || '';
        
        let dob = '';
        if (ref.id === '1' || ref.patientName.toLowerCase() === 'alice cooper') dob = '12/04/1978';
        else if (ref.id === 'D-1002' || ref.patientName.toLowerCase() === 'marco reyes') dob = '05/14/1988';
        else if (ref.id === 'D-1003' || ref.patientName.toLowerCase() === 'nina patel') dob = '10/20/1990';
        else if (ref.id === 'D-1005' || ref.id === 'D-1004' || ref.patientName.toLowerCase() === 'sarah jenkins') dob = '11/22/1992';
        else if (ref.patientName.toLowerCase() === 'john doe') dob = '08/08/1985';
        else if (ref.patientName.toLowerCase() === 'james dean') dob = '02/08/1931';
        else if (ref.patientName.toLowerCase() === 'humphrey bogart') dob = '12/25/1899';
        else if (ref.patientName.toLowerCase() === 'audrey hepburn') dob = '05/04/1929';
        else dob = '01/01/1990';

        setPatientFirstName(first);
        setPatientLastName(last);
        setPatientDob(dob);
        setReferralSearchQuery(`${getReferralCode(ref.id)} - ${ref.patientName}`);
      }
    } else {
      setPatientFirstName('');
      setPatientLastName('');
      setPatientDob('');
      setReferralSearchQuery('NONE / NEW REFERRAL');
    }
  };

  const handleRealFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    let type: SendDocumentFileType = 'doc';
    if (extension === 'pdf') type = 'pdf';
    else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) type = 'image';
    else if (['zip', 'rar', 'tar', 'gz'].includes(extension)) type = 'zip';

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const formattedSize = parseFloat(sizeMB) > 0.1 ? `${sizeMB} MB` : `${(file.size / 1024).toFixed(0)} KB`;

    setCustomDocName(file.name);
    setCustomDocType(type);
    setCustomDocSize(formattedSize);

    const newFile = {
      id: 'temp_' + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: formattedSize,
      type: type,
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

    const newFile = {
      id: 'temp_' + Math.random().toString(36).substring(2, 9),
      name: choice.name,
      size: choice.size,
      type: choice.type,
    };
    setAttachedFiles(prev => [...prev, newFile]);
    triggerToast(`Mock attached "${choice.name}" successfully!`);
  };

  const handleSendDocumentSubmit = () => {
    if (isTrialEnded) {
      setShowPaywall(true);
      return;
    }
    if (sendMode === 'connected' && selectedPractices.length === 0) {
      triggerToast("Please select at least one connected practice.");
      return;
    }
    if (sendMode === 'custom' && !customRecipient.trim()) {
      triggerToast("Please enter an email or fax number.");
      return;
    }

    const currentChannels = getChannels(true);
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
      role: 'dentist',
      selectedPractices: resolvedPractices,
      channels: nextChannels,
      existingMessages: currentMessages,
      files: attachedFiles,
      fallbackDocument: {
        name: customDocName,
        size: customDocSize || '1.5 MB',
        type: customDocType,
      },
      selectedReferral,
      patient: {
        firstName: patientFirstName,
        lastName: patientLastName,
        dob: patientDob,
      },
      note: uploadMessage,
    });

    if (share.sharedDocuments.length === 0) {
      triggerToast("Please attach or select at least one document.");
      return;
    }

    saveChannels(true, nextChannels);
    saveMessages(share.messages);

    initialDocuments.push(...share.sharedDocuments);
    Object.entries(share.messages).forEach(([channelId, messages]) => {
      initialMessages[channelId] = messages;
    });

    const toastOutcome = buildSendDocumentToast(
      'dentist',
      resolvedPractices,
      share.sharedDocuments.length / resolvedPractices.length
    );

    setAttachedFiles([]);
    setCustomDocName('');
    setPatientFirstName('');
    setPatientLastName('');
    setPatientDob('');
    setUploadMessage('');
    setSelectedPractices([]);
    setSelectedReferral('');
    setCustomRecipient('');

    triggerToast(
      toastOutcome.message,
      {
        label: "View Chat",
        onClick: () => {
          router.push(toastOutcome.destinationHref);
        }
      }
    );
  };

  return (
    <MainLayout title="Send Document">
      <div className="max-w-xl mx-auto space-y-6 pb-20">
        
        {/* Back link */}
        <div>
          <button
            onClick={() => router.push('/dentist/dashboard')}
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
                Network
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

            <SendDocumentReferralSelector
              searchQuery={referralSearchQuery}
              isOpen={isReferralDropdownOpen}
              referrals={filteredReferralsList.map((ref) => ({
                id: ref.id,
                code: getReferralCode(ref.id),
                patientName: ref.patientName,
                specialist: ref.specialist,
              }))}
              onSearchQueryChange={setReferralSearchQuery}
              onOpenChange={(open) => {
                if (!open) {
                  closeReferralDropdown();
                } else {
                  setIsReferralDropdownOpen(true);
                }
              }}
              onSelectReferral={(referralId) => {
                handleSelectReferral(referralId);
                setIsReferralDropdownOpen(false);
              }}
            />

            <SendDocumentUploadSection
              inputId="dentist-file-input"
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
              onClick={() => router.push('/dentist/dashboard')}
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
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-black text-white border-2 border-white p-4 max-w-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-300 flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-tight">{toastMessage}</p>
          <div className="flex gap-3 justify-end items-center">
            {toastAction && (
              <button
                onClick={() => {
                  toastAction.onClick();
                  setToastMessage(null);
                  setToastAction(null);
                }}
                className="text-[9px] font-black uppercase underline hover:text-gray-300"
              >
                {toastAction.label}
              </button>
            )}
            <button
              onClick={() => {
                setToastMessage(null);
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
