"use client";

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { useSubscription } from '@/components/SubscriptionContext';
import { ChannelContentPane } from '@/components/prototype/ChannelContentPane';
import { ChannelDocumentPreviewOverlay } from '@/components/prototype/ChannelDocumentPreviewOverlay';
import { ChannelGroupModal } from '@/components/prototype/ChannelGroupModal';
import { ChannelParticipantsModal } from '@/components/prototype/ChannelParticipantsModal';
import { ChannelCaseSummary, ChannelSidebar } from '@/components/prototype/ChannelSidebar';
import type { Channel, MessageItem } from '@/prototype/channelTypes';
import { usePrototypeChannelsState } from '@/prototype/usePrototypeChannelsState';
import { getReferrals, updateReferralStatus, UnifiedReferral, initialReferrals, getNetwork, getReferralCode } from '@/lib/referrals';
import { X, FileText, Upload, ChevronDown, Send } from 'lucide-react';

function ChannelsContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDentist = pathname.startsWith('/dentist');
  const { isTrialEnded, setShowPaywall } = useSubscription();

  const channelsState = usePrototypeChannelsState({
    isDentist,
    practiceParam: searchParams.get('practice'),
    caseIdParam: searchParams.get('caseId'),
    tabParam: searchParams.get('tab'),
    isTrialEnded,
    onPaywall: () => setShowPaywall(true),
    onNavigate: (href) => router.push(href),
  });

  const handleSelectCaseChannel = (caseChannel: ChannelCaseSummary, parentChannel: Channel) => {
    channelsState.handleSelectChannel({
      id: caseChannel.id,
      name: caseChannel.name,
      type: 'inter-practice',
      lastMessage: caseChannel.lastMessage,
      memberCount: parentChannel.memberCount,
      ...(caseChannel.isExternal ? { isExternal: true } : {}),
    });
  };

  const [showDirectUploadModal, setShowDirectUploadModal] = useState(false);
  const [customDocName, setCustomDocName] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedReferral, setSelectedReferral] = useState('');
  const [referralSearchQuery, setReferralSearchQuery] = useState('NONE / NEW REFERRAL');
  const [isReferralDropdownOpen, setIsReferralDropdownOpen] = useState(false);
  const [practiceSearchQuery, setPracticeSearchQuery] = useState('');
  const [isPracticeDropdownOpen, setIsPracticeDropdownOpen] = useState(false);
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [customDocType, setCustomDocType] = useState<'pdf' | 'image' | 'zip' | 'doc'>('pdf');
  const [customDocSize, setCustomDocSize] = useState('0 KB');

  // Sync selected practices to the active channel name if it's external or inter-practice
  useEffect(() => {
    if (showDirectUploadModal && channelsState.activeChannel) {
      const activeName = channelsState.activeChannel.name;
      if (activeName && activeName !== 'team-members') {
        setSelectedPractices([activeName]);
      }
    }
  }, [showDirectUploadModal, channelsState.activeChannel]);

  const closeReferralDropdown = () => setIsReferralDropdownOpen(false);

  const handleSelectReferral = (id: string) => {
    setSelectedReferral(id);
    if (!id) {
      setReferralSearchQuery('NONE / NEW REFERRAL');
      setPatientFirstName('');
      setPatientLastName('');
      setPatientDob('');
      return;
    }
    const ref = channelsState.referrals.find(r => r.id === id);
    if (ref) {
      setReferralSearchQuery(`${getReferralCode(ref.id)} - ${ref.patientName}`);
      const parts = ref.patientName.split(' ');
      setPatientFirstName(parts[0] || '');
      setPatientLastName(parts.slice(1).join(' ') || '');
      
      let dob = '01/01/1990';
      const patientLower = ref.patientName.toLowerCase();
      if (ref.id === '1' || patientLower === 'alice cooper') dob = '12/04/1978';
      else if (ref.id === 'D-1002' || patientLower === 'marco reyes') dob = '05/14/1988';
      else if (ref.id === 'D-1003' || patientLower === 'nina patel') dob = '10/20/1990';
      else if (ref.id === 'D-1005' || ref.id === 'D-1004' || patientLower === 'sarah jenkins') dob = '11/22/1992';
      else if (patientLower === 'john doe') dob = '08/08/1985';
      else if (patientLower === 'james dean') dob = '02/08/1931';
      else if (patientLower === 'humphrey bogart') dob = '12/25/1899';
      else if (patientLower === 'audrey hepburn') dob = '05/04/1929';
      setPatientDob(dob);
    }
  };

  const filteredReferralsList = useMemo(() => {
    const term = referralSearchQuery.toLowerCase();
    if (term === 'none / new referral') return channelsState.referrals;
    return channelsState.referrals.filter(r => 
      r.patientName.toLowerCase().includes(term) ||
      getReferralCode(r.id).toLowerCase().includes(term)
    );
  }, [channelsState.referrals, referralSearchQuery]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const newFiles = files.map(file => {
        const type = file.type.includes('image') ? 'image' as const : file.name.endsWith('.zip') ? 'zip' as const : 'pdf' as const;
        const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
        return {
          id: file.name.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Math.random().toString(36).substring(2, 9),
          channelId: channelsState.activeChannel.id,
          name: file.name.toUpperCase(),
          size: sizeStr,
          type,
          sentBy: 'Me',
          sentAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      });
      setAttachedFiles(prev => [...prev, ...newFiles]);
      if (newFiles.length > 0) {
        const last = newFiles[newFiles.length - 1];
        setCustomDocName(last.name);
        setCustomDocType(last.type);
        setCustomDocSize(last.size);
      }
      channelsState.triggerToast(`Attached ${files.length} file(s)`);
    }
  };

  const handleRealFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newFiles = files.map(file => {
        const type = file.type.includes('image') ? 'image' as const : file.name.endsWith('.zip') ? 'zip' as const : 'pdf' as const;
        const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
        return {
          id: file.name.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Math.random().toString(36).substring(2, 9),
          channelId: channelsState.activeChannel.id,
          name: file.name.toUpperCase(),
          size: sizeStr,
          type,
          sentBy: 'Me',
          sentAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      });
      setAttachedFiles(prev => [...prev, ...newFiles]);
      if (newFiles.length > 0) {
        const last = newFiles[newFiles.length - 1];
        setCustomDocName(last.name);
        setCustomDocType(last.type);
        setCustomDocSize(last.size);
      }
      channelsState.triggerToast(`Attached ${files.length} file(s)`);
    }
  };

  const handleDirectUpload = () => {
    if (attachedFiles.length === 0 && !customDocName.trim()) return;

    // Build files array to add
    const filesToSend = attachedFiles.length > 0 ? attachedFiles : [{
      id: customDocName.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Math.random().toString(36).substring(2, 9),
      channelId: channelsState.activeChannel.id,
      name: customDocName.toUpperCase(),
      size: customDocSize,
      type: customDocType,
      sentBy: 'Me',
      sentAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];

    // Add files to documents list
    filesToSend.forEach(file => {
      // 1. Add to documents
      channelsState.setDocuments(prev => {
        const exists = prev.some(d => d.name === file.name && d.channelId === file.channelId);
        if (exists) return prev;
        return [{
          id: file.id,
          channelId: file.channelId,
          name: file.name,
          size: file.size,
          type: file.type,
          sentBy: 'Me',
          sentAt: 'Today'
        }, ...prev];
      });

      // 2. Add message to channel
      const msgText = uploadMessage.trim() 
        ? `${uploadMessage.trim()}\nAttached document: ${file.name}` 
        : `Attached document: ${file.name}`;
      
      const newMsg: MessageItem = {
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        user: 'Me',
        text: msgText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'self' as const,
        document: {
          id: file.id,
          channelId: file.channelId,
          name: file.name,
          size: file.size,
          type: file.type,
          sentBy: 'Me',
          sentAt: 'Today'
        }
      };

      channelsState.setMessages(prev => {
        const channelMsgs = prev[file.channelId] || [];
        return {
          ...prev,
          [file.channelId]: [...channelMsgs, newMsg]
        };
      });
    });

    // Reset fields
    setShowDirectUploadModal(false);
    setCustomDocName('');
    setAttachedFiles([]);
    setPatientFirstName('');
    setPatientLastName('');
    setPatientDob('');
    setUploadMessage('');
    setSelectedReferral('');
    setReferralSearchQuery('NONE / NEW REFERRAL');
    setIsReferralDropdownOpen(false);
    channelsState.triggerToast(`Successfully sent ${filesToSend.length} document(s)!`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
      {channelsState.toastMessage && (
        <div className="absolute top-20 right-6 z-50 bg-black text-white border-2 border-white px-4 py-2 font-bold uppercase text-[9px] tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fade-in">
          {channelsState.toastMessage}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <ChannelSidebar
          isDentist={isDentist}
          showChannelList={channelsState.showChannelList}
          searchQuery={channelsState.sidebarSearchQuery}
          activeChannelId={channelsState.activeChannel.id}
          internalCollapsed={channelsState.internalCollapsed}
          connectedCollapsed={channelsState.connectedCollapsed}
          externalCollapsed={channelsState.externalCollapsed}
          groupCollapsed={channelsState.groupCollapsed}
          patientCollapsed={channelsState.patientCollapsed}
          internalUnreadCount={channelsState.internalUnreadCount}
          connectedUnreadCount={channelsState.connectedUnreadCount}
          externalUnreadCount={channelsState.externalUnreadCount}
          groupUnreadCount={channelsState.groupUnreadCount}
          patientUnreadCount={channelsState.patientUnreadCount}
          expandedPractices={channelsState.expandedPractices}
          internalChannels={channelsState.filteredInternalChannels}
          onPlatformChannels={channelsState.filteredOnPlatformChannels}
          externalChannels={channelsState.filteredExternalChannels}
          groupChannels={channelsState.filteredGroupChannels}
          patientChannels={channelsState.filteredPatientChannels}
          caseChannels={channelsState.filteredCaseChannels}
          onCloseMobile={() => channelsState.setShowChannelList(false)}
          onSearchQueryChange={channelsState.setSidebarSearchQuery}
          onToggleInternal={() => channelsState.setInternalCollapsed(!channelsState.internalCollapsed)}
          onToggleConnected={() => channelsState.setConnectedCollapsed(!channelsState.connectedCollapsed)}
          onToggleExternal={() => channelsState.setExternalCollapsed(!channelsState.externalCollapsed)}
          onToggleGroup={() => channelsState.setGroupCollapsed(!channelsState.groupCollapsed)}
          onTogglePatient={() => channelsState.setPatientCollapsed(!channelsState.patientCollapsed)}
          onCreateGroup={() => channelsState.setShowCreateGroupModal(true)}
          onSelectChannel={channelsState.handleSelectChannel}
          onSelectCaseChannel={handleSelectCaseChannel}
        />

        <ChannelContentPane
          activeChannel={channelsState.activeChannel}
          isDentist={isDentist}
          activeTab={channelsState.activeTab}
          messages={channelsState.messages[channelsState.activeChannel.id] || []}
          archivedConversations={
            channelsState.activeChannel.type === 'internal'
              ? channelsState.channels
                  .filter((c) => c.type === 'internal' && c.isArchived)
                  .map((c) => ({
                    id: c.id,
                    name: c.name,
                    patientName: '',
                    practiceId: '',
                    referralId: '',
                    isArchived: true,
                    lastMessage: c.lastMessage || '',
                  }))
              : channelsState.caseChannels.filter((caseChannel) => caseChannel.practiceId === channelsState.activeChannel.id && caseChannel.isArchived)
          }
          inputText={channelsState.inputText}
          attachedDocument={channelsState.attachedDoc}
          showAttachmentDrawer={channelsState.showAttachmentDrawer}
          attachmentOptions={channelsState.mockAttachments}
          documents={channelsState.paginatedDocuments}
          totalDocumentCount={channelsState.filteredDocuments.length}
          docSearchQuery={channelsState.docSearchQuery}
          currentDocPage={channelsState.docPage}
          totalDocPages={channelsState.totalDocPages}
          isViewingArchivedDocs={channelsState.isViewingArchivedDocs}
          onActiveTabChange={(tab) => {
            channelsState.setActiveTab(tab);
            if (tab !== 'documents') {
              channelsState.setIsViewingArchivedDocs(false);
            }
          }}
          onShowChannelList={() => channelsState.setShowChannelList(true)}
          onBackToPractice={channelsState.onBackToPractice}
          onArchiveCase={channelsState.onArchiveCase}
          onOpenParticipants={() => channelsState.setShowParticipantsModal(true)}
          onReactivateArchived={channelsState.onReactivateArchived}
          onInputChange={channelsState.setInputText}
          onToggleAttachmentDrawer={() => channelsState.setShowAttachmentDrawer(!channelsState.showAttachmentDrawer)}
          onAttachNew={() => {
            setShowDirectUploadModal(true);
            channelsState.setShowAttachmentDrawer(false);
          }}
          onAttachRecent={(file) => {
            channelsState.setAttachedDoc({ name: file.name, size: file.size, type: file.type });
            channelsState.setShowAttachmentDrawer(false);
            channelsState.triggerToast(`Attached ${file.name}!`);
          }}
          onCloseAttachmentDrawer={() => channelsState.setShowAttachmentDrawer(false)}
          onRemoveAttachment={() => channelsState.setAttachedDoc(null)}
          onSendMessage={channelsState.handleSendMessage}
          onDocSearchQueryChange={channelsState.setDocSearchQuery}
          onClearDocSearch={() => channelsState.setDocSearchQuery('')}
          onSendNewDocument={() => setShowDirectUploadModal(true)}
          onViewDocument={channelsState.setPreviewDocument}
          onDownloadDocument={(document) => channelsState.triggerToast(`Downloading "${document.name}"...`)}
          onDocPageChange={channelsState.setDocPage}
          formatMessage={channelsState.formatMessage}
          formatDocumentSender={channelsState.formatDocumentSender}
          referralStatus={
            (() => {
              if (!channelsState.activeChannel?.id?.startsWith('case_')) return undefined;
              const refId = channelsState.activeChannel.id.replace('case_', '');
              const ref = channelsState.referrals.find((r) => r.id === refId);
              return ref ? (isDentist ? (ref.dentistStatus || ref.status) : ref.status) : undefined;
            })()
          }
          onArchiveDocument={channelsState.onArchiveDocument}
          onUnarchiveDocument={channelsState.onUnarchiveDocument}
          onViewArchivedDocuments={() => channelsState.setIsViewingArchivedDocs(!channelsState.isViewingArchivedDocs)}
        />
      </div>

      {channelsState.previewDocument && (
        <ChannelDocumentPreviewOverlay
          document={channelsState.previewDocument}
          activePracticeName={channelsState.activeChannel.name}
          onClose={() => channelsState.setPreviewDocument(null)}
          onDownload={(document) => {
            channelsState.setPreviewDocument(null);
            channelsState.triggerToast(`Downloading "${document.name}"...`);
          }}
        />
      )}
            {/* Direct Document Upload / Send Modal */}
      {showDirectUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-black">
          <div className="bg-white border-4 border-black p-6 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
                <FileText size={16} /> Send Document
              </h3>
              <button
                onClick={() => {
                  setShowDirectUploadModal(false);
                  setCustomDocName('');
                  setAttachedFiles([]);
                  setPatientFirstName('');
                  setPatientLastName('');
                  setPatientDob('');
                  setUploadMessage('');
                  setSelectedReferral('');
                  setReferralSearchQuery('NONE / NEW REFERRAL');
                  setIsReferralDropdownOpen(false);
                }}
                className="hover:text-black text-black"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Field 1: Recipients (Select Multiple) */}
              <div className="relative">
                <span className="text-[10px] font-black uppercase block mb-1 text-black">
                  Recipients (Select Multiple) <span className="text-red-500">*</span>
                </span>
                <div className="border-2 border-black bg-white p-2 min-h-[40px] text-xs">
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {selectedPractices.map(pName => {
                      const match = getNetwork().find(n => n.name.toLowerCase() === pName.toLowerCase());
                      const isExt = match ? match.isExternal : !channelsState.channels.some(c => c.name.toLowerCase() === pName.toLowerCase() && !c.isExternal);
                      return (
                        <span key={pName} className={`px-2 py-0.5 font-bold uppercase text-[8px] border border-black flex items-center gap-1 ${isExt ? 'bg-white text-black border border-black' : 'bg-black text-white'}`}>
                          {pName} {isExt ? '✉' : ''}
                          <button
                            type="button"
                            onClick={() => setSelectedPractices(prev => prev.filter(p => p !== pName))}
                            className="font-bold ml-1 text-[9px] hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
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
                  </div>
                </div>

                {isPracticeDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsPracticeDropdownOpen(false)} />
                    <div className="absolute left-0 right-0 mt-1 z-50 bg-white border-2 border-black max-h-48 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-[9px]">
                      {getNetwork()
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
                            className="p-2 hover:bg-black hover:text-white cursor-pointer font-bold border-b border-black/10 flex justify-between items-center bg-white"
                          >
                            <span>{p.name}</span>
                            <span className={`text-[6px] px-1 font-black ${p.isExternal ? 'bg-white text-black border border-black' : 'bg-black text-white'}`}>
                              {p.isExternal ? 'Secure Email' : 'drTalk App'}
                            </span>
                          </div>
                        ))}
                      {practiceSearchQuery.trim() && !getNetwork().some(p => p.name.toLowerCase() === practiceSearchQuery.trim().toLowerCase()) && (
                        <div
                          onClick={() => {
                            const customName = practiceSearchQuery.trim();
                            setSelectedPractices(prev => [...prev, customName]);
                            setPracticeSearchQuery('');
                            setIsPracticeDropdownOpen(false);
                          }}
                          className="p-2 hover:bg-black hover:text-white cursor-pointer font-black border-b border-black/10 bg-zinc-50"
                        >
                          Add &quot;{practiceSearchQuery.trim().toUpperCase()}&quot; (External ✉)
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Field 2: Choice of sent referral */}
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
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={closeReferralDropdown} 
                    />
                    <div className="absolute left-0 right-0 mt-1 z-50 bg-white border-2 border-black max-h-60 overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase">
                      <div
                        onClick={() => {
                          handleSelectReferral('');
                          setReferralSearchQuery('NONE / NEW REFERRAL');
                          setIsReferralDropdownOpen(false);
                        }}
                        className="p-2 text-xs font-bold hover:bg-black hover:text-white cursor-pointer border-b border-black/10"
                      >
                        NONE / NEW REFERRAL
                      </div>
                      {filteredReferralsList.length === 0 ? (
                        <div className="p-2 text-xs font-bold text-muted-foreground italic text-center">
                          No matching referrals
                        </div>
                      ) : (
                        filteredReferralsList.map((referral) => {
                          const code = getReferralCode(referral.id);
                          return (
                            <div
                              key={referral.id}
                              onClick={() => {
                                handleSelectReferral(referral.id);
                                setIsReferralDropdownOpen(false);
                              }}
                              className={`p-2 text-xs font-bold hover:bg-black hover:text-white cursor-pointer border-b border-black/10 flex justify-between items-center ${
                                selectedReferral === referral.id ? 'bg-zinc-100' : ''
                              }`}
                            >
                              <span className="flex items-baseline gap-1.5">
                                <span className="font-black">{referral.patientName}</span>
                                <span className="text-[8px] opacity-60 font-medium">({code})</span>
                              </span>
                            </div>
                          );
                        })
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

              {/* Premium Drag and Drop / Click Zone */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed p-4 transition-all text-center flex flex-col items-center justify-center gap-1.5 min-h-[120px] ${
                  isDragging ? 'border-black bg-black/5' : 'border-black bg-gray-50 hover:bg-black/5 cursor-pointer'
                }`}
              >
                {/* Hidden native input */}
                <input
                  type="file"
                  id="modal-file-input"
                  className="hidden"
                  multiple
                  onChange={handleRealFileSelect}
                />

                {/* Visual click trigger for native upload */}
                <div
                  onClick={() => document.getElementById('modal-file-input')?.click()}
                  className="absolute inset-0 z-0"
                />

                <Upload size={20} className="text-black z-10" />
                <span className="text-xs font-black uppercase tracking-wider text-black z-10">
                  Attach Document
                </span>
                <span className="text-[8px] font-bold text-muted-foreground uppercase z-10">
                  Click to browse files or drag and drop here
                </span>

                {/* Mock upload trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    const mockFiles = [
                      {
                        name: 'SURGERY_REPORT_COOPER.PDF',
                        type: 'pdf' as const,
                        size: '2.1 MB',
                        patient: { first: 'John', last: 'Cooper', dob: '05/14/1988', msg: 'Hi, here is the surgery report for John Cooper post-extraction.' }
                      },
                      {
                        name: 'PANO_XRAY_REVISION.PNG',
                        type: 'image' as const,
                        size: '4.8 MB',
                        patient: { first: 'Sarah', last: 'Jenkins', dob: '11/22/1992', msg: 'Hi, sending over the post-op panoramic radiograph for Sarah.' }
                      },
                      {
                        name: 'CT_SCAN_MANDIBLE.ZIP',
                        type: 'zip' as const,
                        size: '12.4 MB',
                        patient: { first: 'Robert', last: 'Chen', dob: '08/03/1975', msg: 'Full mandibular CBCT volume for Robert Chen.' }
                      },
                      {
                        name: 'CLINICAL_SUMMARY_VALLEY.PDF',
                        type: 'pdf' as const,
                        size: '1.1 MB',
                        patient: { first: 'Emily', last: 'Taylor', dob: '03/30/2001', msg: 'Valley Endodontics clinical notes for Emily Taylor.' }
                      }
                    ];

                    const choice = mockFiles[attachedFiles.length % mockFiles.length];

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
                      channelId: channelsState.activeChannel.id,
                      name: choice.name,
                      size: choice.size,
                      type: choice.type,
                      sentBy: 'Me',
                      sentAt: 'Today, ' + timeString
                    };
                    setAttachedFiles(prev => [...prev, newFile]);
                    channelsState.triggerToast(`Mock attached "${choice.name}" successfully!`);
                  }}
                  className="relative z-10 mt-1 px-4 py-1.5 bg-black text-white hover:bg-gray-800 text-[8px] uppercase font-black tracking-widest border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
                >
                  Quick attach mock scan
                </button>
              </div>

              {/* Premium Patient Association Fields */}
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
                      disabled={!!selectedReferral}
                      className={`wireframe-input py-2 px-3 text-xs font-bold text-black border-black bg-white w-full focus:ring-0 focus:outline-none ${selectedReferral ? 'bg-zinc-100 cursor-not-allowed opacity-80' : ''}`}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase block mb-1.5 text-black">Patient last name</span>
                    <input
                      type="text"
                      placeholder="Enter patient last name"
                      value={patientLastName}
                      onChange={(e) => setPatientLastName(e.target.value)}
                      disabled={!!selectedReferral}
                      className={`wireframe-input py-2 px-3 text-xs font-bold text-black border-black bg-white w-full focus:ring-0 focus:outline-none ${selectedReferral ? 'bg-zinc-100 cursor-not-allowed opacity-80' : ''}`}
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
                      disabled={!!selectedReferral}
                      className={`wireframe-input py-2 px-3 pr-10 text-xs font-bold text-black border-black bg-white w-full focus:ring-0 focus:outline-none ${selectedReferral ? 'bg-zinc-100 cursor-not-allowed opacity-80' : ''}`}
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
                  setShowDirectUploadModal(false);
                  setCustomDocName('');
                  setAttachedFiles([]);
                  setPatientFirstName('');
                  setPatientLastName('');
                  setPatientDob('');
                  setUploadMessage('');
                  setSelectedReferral('');
                  setReferralSearchQuery('NONE / NEW REFERRAL');
                  setIsReferralDropdownOpen(false);
                }}
                className="flex-1 wireframe-button bg-white text-black border-black text-[10px] uppercase py-2.5 hover:bg-gray-100 font-bold flex items-center justify-center gap-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDirectUpload}
                disabled={attachedFiles.length === 0 && !customDocName.trim()}
                className="flex-1 wireframe-button bg-black text-white border-black text-[10px] uppercase py-2.5 font-bold disabled:opacity-50 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
              >
                <Send size={10} /> Send Document
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Create Group Chat Modal */}
      {channelsState.showCreateGroupModal && (
        <ChannelGroupModal
          groupChatName={channelsState.groupChatName}
          participants={channelsState.groupParticipants}
          error={channelsState.groupChatError}
          onGroupChatNameChange={(name) => {
            channelsState.setGroupChatName(name);
            channelsState.setGroupChatError(null);
          }}
          onParticipantToggle={channelsState.onToggleGroupParticipant}
          onPracticeToggle={channelsState.onToggleGroupPractice}
          onCancel={channelsState.onCancelCreateGroup}
          onCreate={channelsState.handleCreateGroupChat}
        />
      )}

      {channelsState.showParticipantsModal && (
        <ChannelParticipantsModal
          participants={channelsState.participants}
          onParticipantToggle={channelsState.onToggleParticipant}
          onClose={() => channelsState.setShowParticipantsModal(false)}
          channelId={channelsState.activeChannel.id}
          isDentist={isDentist}
        />
      )}
    </div>
  );
}

export default function ChannelsPage() {
  return (
    <MainLayout title="Communication" noPadding>
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center bg-white">
          <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Loading channels...</p>
        </div>
      }>
        <ChannelsContent />
      </Suspense>
    </MainLayout>
  );
}
