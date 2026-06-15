"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { useSubscription } from '@/components/SubscriptionContext';
import { ChannelContentPane } from '@/components/prototype/ChannelContentPane';
import { ChannelDocumentPreviewOverlay } from '@/components/prototype/ChannelDocumentPreviewOverlay';
import { ChannelGroupModal } from '@/components/prototype/ChannelGroupModal';
import { ChannelParticipantsModal } from '@/components/prototype/ChannelParticipantsModal';
import { ChannelCaseSummary, ChannelSidebar } from '@/components/prototype/ChannelSidebar';
import { getReferrals, updateReferralStatus, UnifiedReferral, initialReferrals, getChannels, saveChannels, getNetwork, getMessages, saveMessages } from '@/lib/referrals';
import {
  buildChannelGroupCreation,
  buildChannelMessageSend,
  resolveActiveChannelFromQuery,
  type ActiveChannelResolution,
} from '@/prototype/channelActions';
import {
  buildCaseChannels,
  filterCaseChannels,
  filterChannelsByType,
  filterPracticeChannels,
  splitPracticeChannels,
} from '@/prototype/channelModel';
import type { Channel, MessageItem, SharedDocument } from '@/prototype/channelTypes';
import {
  dentistPractices,
  initialDocuments,
  initialMessages,
  mockAttachments,
  mockChannels,
  mockGroupParticipants,
  specialistClinics,
  type GroupParticipant,
} from '@/prototype/channelFixtures';
import { buildCaseChannels } from '@/prototype/channelModel';
import { X, FileText, Upload, ChevronDown, Send } from 'lucide-react';

function ChannelsContent() {
  const pathname = usePathname();
  const router = useRouter();
  const isDentist = pathname.startsWith('/dentist');
  const { isTrialEnded, setShowPaywall } = useSubscription();

  const searchParams = useSearchParams();
  const practiceParam = searchParams.get('practice');
  const caseIdParam = searchParams.get('caseId');

  // Load unified referrals from localStorage
  const [referrals, setReferrals] = useState<UnifiedReferral[]>(initialReferrals);
  useEffect(() => {
    setTimeout(() => {
      setReferrals(getReferrals());
    }, 0);
  }, []);

  // Derive Case Channels dynamically from the referrals
  const caseChannels = React.useMemo(() => buildCaseChannels({
    referrals,
    isDentist,
    dentistPractices,
    specialistClinics,
    hidePending: true,
    includeCodeInName: false,
  }), [referrals, isDentist]);

  // State managed data
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel>(mockChannels[0]);
  const [messages, setMessages] = useState<Record<string, MessageItem[]>>({});
  useEffect(() => {
    setMessages(getMessages());
  }, []);

  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      saveMessages(messages);
    }
  }, [messages]);
  const [documents, setDocuments] = useState<SharedDocument[]>(initialDocuments);
  const [activeTab, setActiveTab] = useState<'messages' | 'documents' | 'archived'>('messages');

  useEffect(() => {
    setChannels(getChannels(isDentist));
  }, [isDentist]);

  useEffect(() => {
    if (channels.length > 0) {
      saveChannels(isDentist, channels);
    }
  }, [channels, isDentist]);

  // Collapse states for sidebar sections
  const [internalCollapsed, setInternalCollapsed] = useState(true);
  const [connectedCollapsed, setConnectedCollapsed] = useState(true);
  const [externalCollapsed, setExternalCollapsed] = useState(true);
  const [patientCollapsed, setPatientCollapsed] = useState(true);
  const [groupCollapsed, setGroupCollapsed] = useState(true);

  // Expanded state for connected practice case lists (collapsed by default to keep sidebar clean)
  const [expandedPractices, setExpandedPractices] = useState<Record<string, boolean>>({});

  // Group chat creation states
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupChatName, setGroupChatName] = useState('');
  const [groupParticipants, setGroupParticipants] = useState<GroupParticipant[]>(mockGroupParticipants);
  const [groupChatError, setGroupChatError] = useState<string | null>(null);

  // Input states
  const [inputText, setInputText] = useState('');
  const [attachedDoc, setAttachedDoc] = useState<{ name: string; size: string; type: 'pdf' | 'image' | 'zip' | 'doc' } | null>(null);

  // Search states for sidebar and documents
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');
  const [docSearchQuery, setDocSearchQuery] = useState('');

  const filteredInternalChannels = React.useMemo(
    () => filterChannelsByType(channels, 'internal', sidebarSearchQuery),
    [channels, sidebarSearchQuery]
  );

  const filteredPatientChannels = React.useMemo(
    () => filterChannelsByType(channels, 'patient', sidebarSearchQuery),
    [channels, sidebarSearchQuery]
  );

  const filteredGroupChannels = React.useMemo(
    () => filterChannelsByType(channels, 'group', sidebarSearchQuery),
    [channels, sidebarSearchQuery]
  );

  const filteredCaseChannels = React.useMemo(
    () => filterCaseChannels(caseChannels, sidebarSearchQuery),
    [caseChannels, sidebarSearchQuery]
  );

  const filteredPracticeChannels = React.useMemo(
    () => filterPracticeChannels(channels, caseChannels, sidebarSearchQuery),
    [channels, caseChannels, sidebarSearchQuery]
  );

  const { onPlatform: filteredOnPlatformChannels, external: filteredExternalChannels } = React.useMemo(
    () => splitPracticeChannels(filteredPracticeChannels),
    [filteredPracticeChannels]
  );

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Modals / Overlays
  const [showAttachmentDrawer, setShowAttachmentDrawer] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<SharedDocument | null>(null);

  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participants, setParticipants] = useState([
    { id: 'p1', name: 'Dr. John Smith', role: 'Dentist', selected: true },
    { id: 'p2', name: 'Jane Doe', role: 'Hygienist', selected: true },
    { id: 'p3', name: 'Mike Johnson', role: 'Assistant', selected: true },
    { id: 'p4', name: 'Sarah Wilson', role: 'Front Desk', selected: true },
  ]);

  const toggleParticipant = (id: string) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  const toggleGroupParticipant = (id: string) => {
    setGroupParticipants(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
    setGroupChatError(null);
  };

  const toggleGroupPractice = (participantIds: string[], shouldSelect: boolean) => {
    setGroupParticipants(prev =>
      prev.map(participant =>
        participantIds.includes(participant.id)
          ? { ...participant, selected: shouldSelect }
          : participant
      )
    );
    setGroupChatError(null);
  };

  const handleCreateGroupChat = () => {
    const result = buildChannelGroupCreation({
      groupName: groupChatName,
      participants: groupParticipants,
    });

    if (!result.ok) {
      setGroupChatError(result.error);
      return;
    }

    setChannels(prev => [...prev, result.channel]);
    setMessages(prev => ({
      ...prev,
      [result.channel.id]: [result.message]
    }));

    setGroupChatName('');
    setGroupParticipants(mockGroupParticipants);
    setGroupChatError(null);
    setShowCreateGroupModal(false);
    setGroupCollapsed(false);
    setActiveChannel(result.channel);
    setActiveTab('messages');
    triggerToast("Group chat created successfully!");
  };

  // Filter channels based on role
  const displayedChannels = React.useMemo(() => {
    return channels;
  }, [channels]);

  // Section unread sums
  const internalUnreadCount = React.useMemo(() => {
    return displayedChannels
      .filter(c => c.type === 'internal')
      .reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [displayedChannels]);

  const connectedUnreadCount = React.useMemo(() => {
    return displayedChannels
      .filter(c => c.type === 'inter-practice' && !c.isExternal)
      .reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [displayedChannels]);

  const externalUnreadCount = React.useMemo(() => {
    return displayedChannels
      .filter(c => c.type === 'inter-practice' && c.isExternal)
      .reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [displayedChannels]);

  const groupUnreadCount = React.useMemo(() => {
    return displayedChannels
      .filter(c => c.type === 'group')
      .reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [displayedChannels]);

  const patientUnreadCount = React.useMemo(() => {
    return displayedChannels
      .filter(c => c.type === 'patient')
      .reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [displayedChannels]);

  // Auto-expand parent practice when active channel is a case sub-channel
  useEffect(() => {
    if (activeChannel?.id?.startsWith('case_')) {
      const caseChan = caseChannels.find(cc => cc.id === activeChannel.id);
      if (caseChan?.practiceId) {
        setExpandedPractices(prev => {
          if (prev[caseChan.practiceId]) return prev;
          return {
            ...prev,
            [caseChan.practiceId]: true
          };
        });
      }
    }
  }, [activeChannel, caseChannels]);


  const [showChannelList, setShowChannelList] = useState(false);

  const applyActiveChannelResolution = (resolution: ActiveChannelResolution) => {
    if (resolution.expandSection === 'external') {
      setExternalCollapsed(false);
      setConnectedCollapsed(true);
    } else {
      setConnectedCollapsed(false);
    }

    setActiveChannel(resolution.activeChannel);
    setActiveTab(resolution.targetTab);
  };

  // Sync activeChannel if practiceParam and caseIdParam change
  useEffect(() => {
    const resolution = resolveActiveChannelFromQuery({
      practiceParam,
      caseIdParam,
      tabParam: searchParams.get('tab'),
      channels,
      referrals: getReferrals(),
      isDentist,
    });
    if (!resolution) return;

    if (resolution.reactivateReferralId) {
      setTimeout(() => {
        const updated = updateReferralStatus(resolution.reactivateReferralId!, 'Scheduled');
        setReferrals(updated);
        applyActiveChannelResolution(resolution);
      }, 0);
      return;
    }

    applyActiveChannelResolution(resolution);
  }, [practiceParam, caseIdParam, channels, isDentist, searchParams]);

  const handleSelectChannel = (c: Channel) => {
    setActiveChannel(c);
    setShowChannelList(false);
    const isParentInterPractice = c.type === 'inter-practice' && !c.id.startsWith('case_');
    if (isParentInterPractice) {
      setExpandedPractices(prev => ({
        ...prev,
        [c.id]: !prev[c.id]
      }));
    }
    if (!isParentInterPractice && activeTab === 'archived') {
      setActiveTab('messages');
    }
  };

  const handleSendMessage = () => {
    if (isTrialEnded) {
      setShowPaywall(true);
      return;
    }
    if (!inputText.trim() && !attachedDoc) return;

    const result = buildChannelMessageSend({
      activeChannel,
      channels,
      caseChannels,
      referrals,
      messages,
      documents,
      inputText,
      attachedDoc,
    });
    if (!result.ok) return;

    setDocuments(result.documents);
    setMessages(result.messages);
    setChannels(result.channels);

    if (result.reactivatedReferralId) {
      const updatedRefs = updateReferralStatus(result.reactivatedReferralId, 'Scheduled');
      setReferrals(updatedRefs);
    }

    setInputText('');
    setAttachedDoc(null);
    triggerToast(attachedDoc ? "Message sent with document!" : "Message sent!");
  };

  const handleDownloadDocument = (name: string) => {
    triggerToast(`Downloading "${name}"...`);
  };

  const [docPage, setDocPage] = useState(1);
  const DOCS_PER_PAGE = 6;

  useEffect(() => {
    setDocPage(1);
  }, [docSearchQuery, activeChannel.id]);

  const filteredDocuments = React.useMemo(() => {
    const seen = new Set<string>();
    return documents
      .filter(d => d.channelId === activeChannel.id)
      .filter(d => d.name.toLowerCase().includes(docSearchQuery.toLowerCase()))
      .filter(d => {
        if (seen.has(d.id)) return false;
        seen.add(d.id);
        return true;
      });
  }, [documents, activeChannel.id, docSearchQuery]);

  const paginatedDocuments = React.useMemo(() => {
    const startIndex = (docPage - 1) * DOCS_PER_PAGE;
    return filteredDocuments.slice(startIndex, startIndex + DOCS_PER_PAGE);
  }, [filteredDocuments, docPage]);

  const totalDocPages = Math.max(1, Math.ceil(filteredDocuments.length / DOCS_PER_PAGE));

  const getMessageRoleAndUser = (msg: MessageItem) => {
    if (activeChannel.type !== 'inter-practice') {
      return { type: msg.type, user: msg.user };
    }
    const isCaseChannel = activeChannel.id.startsWith('case_');
    if (isCaseChannel) {
      if (isDentist) {
        return {
          type: msg.type,
          user: msg.user === 'Valley Endodontics' ? 'Valley Endodontics' : msg.user
        };
      } else {
        if (msg.type === 'self') {
          return { type: 'other' as const, user: 'Sunshine Dental' };
        } else {
          return { type: 'self' as const, user: 'Me' };
        }
      }
    } else {
      if (isDentist) {
        const isSelf = msg.user === 'Me' || msg.user === 'Dr. Taylor Reed';
        return {
          type: isSelf ? ('self' as const) : ('other' as const),
          user: isSelf ? 'Me' : activeChannel.name
        };
      } else {
        const isSelf = msg.user === 'Me' || msg.user === 'Valley Endodontics';
        return {
          type: isSelf ? ('self' as const) : ('other' as const),
          user: isSelf ? 'Me' : activeChannel.name
        };
      }
    }
  };

  const getDocSender = (sentBy: string) => {
    if (activeChannel.type !== 'inter-practice') {
      return sentBy;
    }
    const isCaseChannel = activeChannel.id.startsWith('case_');
    if (isCaseChannel) {
      if (isDentist) {
        return sentBy;
      } else {
        if (sentBy === 'Me') {
          return 'Sunshine Dental';
        }
        if (sentBy === 'Valley Endodontics') {
          return 'Me';
        }
        return sentBy;
      }
    } else {
      if (isDentist) {
        const isSelf = sentBy === 'Me' || sentBy === 'Dr. Taylor Reed' || sentBy === 'Sunshine Dental';
        return isSelf ? 'Me' : activeChannel.name;
      } else {
        const isSelf = sentBy === 'Me' || sentBy === 'Valley Endodontics';
        return isSelf ? 'Me' : activeChannel.name;
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
      {/* Premium Toast Banner */}
      {toastMessage && (
        <div className="absolute top-20 right-6 z-50 bg-black text-white border-2 border-white px-4 py-2 font-bold uppercase text-[9px] tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fade-in">
          {toastMessage}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">

        <ChannelSidebar
          isDentist={isDentist}
          showChannelList={showChannelList}
          searchQuery={sidebarSearchQuery}
          activeChannelId={activeChannel.id}
          internalCollapsed={internalCollapsed}
          connectedCollapsed={connectedCollapsed}
          externalCollapsed={externalCollapsed}
          groupCollapsed={groupCollapsed}
          patientCollapsed={patientCollapsed}
          internalUnreadCount={internalUnreadCount}
          connectedUnreadCount={connectedUnreadCount}
          externalUnreadCount={externalUnreadCount}
          groupUnreadCount={groupUnreadCount}
          patientUnreadCount={patientUnreadCount}
          expandedPractices={expandedPractices}
          internalChannels={filteredInternalChannels}
          onPlatformChannels={filteredOnPlatformChannels}
          externalChannels={filteredExternalChannels}
          groupChannels={filteredGroupChannels}
          patientChannels={filteredPatientChannels}
          caseChannels={filteredCaseChannels}
          onCloseMobile={() => setShowChannelList(false)}
          onSearchQueryChange={setSidebarSearchQuery}
          onToggleInternal={() => setInternalCollapsed(!internalCollapsed)}
          onToggleConnected={() => setConnectedCollapsed(!connectedCollapsed)}
          onToggleExternal={() => setExternalCollapsed(!externalCollapsed)}
          onToggleGroup={() => setGroupCollapsed(!groupCollapsed)}
          onTogglePatient={() => setPatientCollapsed(!patientCollapsed)}
          onCreateGroup={() => setShowCreateGroupModal(true)}
          onSelectChannel={handleSelectChannel}
          onSelectCaseChannel={(caseChannel: ChannelCaseSummary, parentChannel: Channel) => {
            const caseChannelObj: Channel = {
              id: caseChannel.id,
              name: caseChannel.name,
              type: 'inter-practice',
              lastMessage: caseChannel.lastMessage,
              memberCount: parentChannel.memberCount,
              ...(caseChannel.isExternal ? { isExternal: true } : {}),
            };
            handleSelectChannel(caseChannelObj);
          }}
        />

        <ChannelContentPane
          activeChannel={activeChannel}
          isDentist={isDentist}
          activeTab={activeTab}
          messages={messages[activeChannel.id] || []}
          archivedConversations={caseChannels.filter(cc => cc.practiceId === activeChannel.id && cc.isArchived)}
          inputText={inputText}
          attachedDocument={attachedDoc}
          showAttachmentDrawer={showAttachmentDrawer}
          attachmentOptions={mockAttachments}
          documents={paginatedDocuments}
          totalDocumentCount={filteredDocuments.length}
          docSearchQuery={docSearchQuery}
          currentDocPage={docPage}
          totalDocPages={totalDocPages}
          onActiveTabChange={setActiveTab}
          onShowChannelList={() => setShowChannelList(true)}
          onBackToPractice={() => {
            const parentId = caseChannels.find(cc => cc.id === activeChannel.id)?.practiceId || '3';
            const parentChan = channels.find(c => c.id === parentId) || channels[0];
            setActiveChannel(parentChan);
          }}
          onArchiveCase={() => {
            const refId = activeChannel.id.replace('case_', '');
            const updated = updateReferralStatus(refId, 'Archived');
            setReferrals(updated);
            triggerToast(`Archived channel for ${activeChannel.name}!`);
            const parentId = caseChannels.find(cc => cc.id === activeChannel.id)?.practiceId || '3';
            const parentChan = channels.find(c => c.id === parentId) || channels[0];
            setActiveChannel(parentChan);
          }}
          onOpenParticipants={() => setShowParticipantsModal(true)}
          onReactivateArchived={(conversationId) => {
            const archivedCase = caseChannels.find(cc => cc.id === conversationId);
            if (!archivedCase) return;

            const refId = conversationId.replace('case_', '');
            const updated = updateReferralStatus(refId, 'Scheduled');
            setReferrals(updated);
            triggerToast(`Re-activated channel for ${archivedCase.patientName}!`);
            const caseChannelObj: Channel = {
              id: archivedCase.id,
              name: archivedCase.name,
              type: 'inter-practice',
              lastMessage: archivedCase.lastMessage,
              memberCount: activeChannel.memberCount,
            };
            setActiveChannel(caseChannelObj);
            setActiveTab('messages');
          }}
          onInputChange={setInputText}
          onToggleAttachmentDrawer={() => setShowAttachmentDrawer(!showAttachmentDrawer)}
          onAttachNew={() => {
            setShowDirectUploadModal(true);
            setShowAttachmentDrawer(false);
          }}
          onAttachRecent={(file) => {
            setAttachedDoc({ name: file.name, size: file.size, type: file.type });
            setShowAttachmentDrawer(false);
            triggerToast(`Attached ${file.name}!`);
          }}
          onCloseAttachmentDrawer={() => setShowAttachmentDrawer(false)}
          onRemoveAttachment={() => setAttachedDoc(null)}
          onSendMessage={handleSendMessage}
          onDocSearchQueryChange={setDocSearchQuery}
          onClearDocSearch={() => setDocSearchQuery('')}
          onSendNewDocument={() => setShowDirectUploadModal(true)}
          onViewDocument={setPreviewDocument}
          onDownloadDocument={(document) => handleDownloadDocument(document.name)}
          onDocPageChange={setDocPage}
          formatMessage={getMessageRoleAndUser}
          formatDocumentSender={getDocSender}
        />
      </div>

      {/* Document View Preview Overlay */}
      {previewDocument && (
        <ChannelDocumentPreviewOverlay
          document={previewDocument}
          activePracticeName={activeChannel.name}
          onClose={() => setPreviewDocument(null)}
          onDownload={(document) => {
            setPreviewDocument(null);
            triggerToast(`Downloading "${document.name}"...`);
          }}
        />
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
                      const isExt = match ? match.isExternal : !channels.some(c => c.name.toLowerCase() === pName.toLowerCase() && !c.isExternal);
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
                          const label = `${code} - ${referral.patientName}`;
                          return (
                            <div
                              key={referral.id}
                              onClick={() => {
                                handleSelectReferral(referral.id);
                                setIsReferralDropdownOpen(false);
                              }}
                              className={`p-2 text-xs font-bold hover:bg-black hover:text-white cursor-pointer border-b border-black/10 ${
                                selectedReferral === referral.id ? 'bg-zinc-100' : ''
                              }`}
                            >
                              {label}
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
                      channelId: activeChannel.id,
                      name: choice.name,
                      size: choice.size,
                      type: choice.type,
                      sentBy: 'Me',
                      sentAt: 'Today, ' + timeString
                    };
                    setAttachedFiles(prev => [...prev, newFile]);
                    triggerToast(`Mock attached "${choice.name}" successfully!`);
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
      {showCreateGroupModal && (
        <ChannelGroupModal
          groupChatName={groupChatName}
          participants={groupParticipants}
          error={groupChatError}
          onGroupChatNameChange={(name) => {
            setGroupChatName(name);
            setGroupChatError(null);
          }}
          onParticipantToggle={toggleGroupParticipant}
          onPracticeToggle={toggleGroupPractice}
          onCancel={() => {
            setShowCreateGroupModal(false);
            setGroupChatName('');
            setGroupParticipants(mockGroupParticipants);
            setGroupChatError(null);
          }}
          onCreate={handleCreateGroupChat}
        />
      )}

      {/* Participants Management Modal */}
      {showParticipantsModal && (
        <ChannelParticipantsModal
          participants={participants}
          onParticipantToggle={toggleParticipant}
          onClose={() => setShowParticipantsModal(false)}
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
