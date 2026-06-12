"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useRouter } from 'next/navigation';
import {
  FileText, Send, Upload, X, ChevronDown, ArrowLeft, Plus
} from 'lucide-react';

import { useSubscription } from '@/components/SubscriptionContext';
import {
  initialDocuments,
  initialMessages,
  mockChannels,
  SharedDocument,
  MessageItem
} from '@/app/channels/page';
import { getReferrals, initialReferrals, getReferralCode, UnifiedReferral } from '@/lib/referrals';

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
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [practiceSearchQuery, setPracticeSearchQuery] = useState('');
  const [isPracticeDropdownOpen, setIsPracticeDropdownOpen] = useState(false);

  const [selectedReferral, setSelectedReferral] = useState('');
  const [referralSearchQuery, setReferralSearchQuery] = useState('NONE / NEW REFERRAL');
  const [isReferralDropdownOpen, setIsReferralDropdownOpen] = useState(false);

  const [customDocName, setCustomDocName] = useState('');
  const [customDocType, setCustomDocType] = useState<'pdf' | 'image' | 'zip' | 'doc'>('pdf');
  const [customDocSize, setCustomDocSize] = useState('1.5 MB');
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
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
    if (selectedPractices.length === 0) {
      triggerToast("Please select at least one connected practice.");
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
        name: formattedName.toUpperCase(),
        size: customDocSize || '1.5 MB',
        type: customDocType,
      }];
    }

    if (filesToShare.length === 0) {
      triggerToast("Please attach or select at least one document.");
      return;
    }

    selectedPractices.forEach(practiceName => {
      const matchedChannel = mockChannels.find(c => c.name === practiceName);
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

      initialDocuments.push(...finalDocs);

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

      if (!initialMessages[channelId]) {
        initialMessages[channelId] = [];
      }
      initialMessages[channelId].push(...newMessages);
    });

    const displayPracticeName = selectedPractices.length === 1 ? selectedPractices[0] : `${selectedPractices.length} practices`;
    const docsCount = filesToShare.length;

    setAttachedFiles([]);
    setCustomDocName('');
    setPatientFirstName('');
    setPatientLastName('');
    setPatientDob('');
    setUploadMessage('');
    setSelectedPractices([]);
    setSelectedReferral('');

    triggerToast(
      `Shared ${docsCount} document${docsCount > 1 ? 's' : ''} with ${displayPracticeName}!`,
      {
        label: "View Chat",
        onClick: () => {
          if (selectedPractices.length === 1) {
            router.push(`/dentist/channels?practice=${encodeURIComponent(selectedPractices[0])}`);
          } else {
            router.push('/dentist/channels');
          }
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
                        </div>
                      ))}
                    {connectedPractices.filter(p => p.name.toLowerCase().includes(practiceSearchQuery.toLowerCase())).filter(p => !selectedPractices.includes(p.name)).length === 0 && (
                      <div className="p-2 text-zinc-400 font-bold bg-white text-center">No practices found</div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Field 2: Associated Referral */}
            <div className="relative">
              <span className="text-[10px] font-black uppercase block mb-1.5 text-black">
                Associated Referral
              </span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search or select referral..."
                  value={referralSearchQuery}
                  onChange={(e) => {
                    setReferralSearchQuery(e.target.value);
                    setIsReferralDropdownOpen(true);
                  }}
                  onFocus={() => setIsReferralDropdownOpen(true)}
                  className="wireframe-input py-2 px-3 pr-10 text-xs font-bold text-black border-black bg-white w-full h-10 focus:ring-0 focus:outline-none uppercase"
                />
                <button
                  type="button"
                  onClick={() => setIsReferralDropdownOpen(!isReferralDropdownOpen)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black"
                >
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isReferralDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {isReferralDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeReferralDropdown} />
                  <div className="absolute left-0 right-0 mt-1 z-50 bg-white border-2 border-black max-h-48 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-[9px]">
                    <div
                      onClick={() => {
                        handleSelectReferral('');
                        setIsReferralDropdownOpen(false);
                      }}
                      className={`p-2 hover:bg-black hover:text-white cursor-pointer font-black border-b border-black/10 bg-zinc-50 text-black`}
                    >
                      NONE / NEW REFERRAL
                    </div>
                    {filteredReferralsList.map((ref) => (
                      <div
                        key={ref.id}
                        onClick={() => {
                          handleSelectReferral(ref.id);
                          setIsReferralDropdownOpen(false);
                        }}
                        className={`p-2 hover:bg-black hover:text-white cursor-pointer font-bold border-b border-black/10 bg-white text-black`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{getReferralCode(ref.id)} - {ref.patientName}</span>
                          <span className="text-[7px] px-1 font-black bg-black text-white">{ref.specialist}</span>
                        </div>
                      </div>
                    ))}
                    {filteredReferralsList.length === 0 && (
                      <div className="p-2 text-zinc-400 font-bold bg-white text-center">No referrals found</div>
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
                id="dentist-file-input"
                className="hidden"
                onChange={handleRealFileSelect}
              />

              <div
                onClick={() => document.getElementById('dentist-file-input')?.click()}
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
              onClick={() => router.push('/dentist/dashboard')}
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
