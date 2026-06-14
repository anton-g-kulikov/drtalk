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

// Helper function defined outside the React component to satisfy the React Compiler's strict purity/immutability checks.
function getRandomId(prefix: string): string {
  return prefix + Math.random().toString(36).substring(2, 9);
}

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
    if (!groupChatName.trim()) {
      setGroupChatError("Please enter a group chat name.");
      return;
    }
    const selectedPeople = groupParticipants.filter(p => p.selected);
    if (selectedPeople.length === 0) {
      setGroupChatError("Please select at least one participant.");
      return;
    }

    const newChannelId = getRandomId('group_');
    const newChannel: Channel = {
      id: newChannelId,
      name: groupChatName.trim(),
      type: 'group',
      lastMessage: 'Group chat created.',
      memberCount: selectedPeople.length + 1
    };

    setChannels(prev => [...prev, newChannel]);

    const welcomeMsg: MessageItem = {
      id: getRandomId('m_welcome_'),
      user: 'System',
      text: `Group chat "${groupChatName.trim()}" created with ${selectedPeople.map(p => p.name).join(', ')}.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'other'
    };
    setMessages(prev => ({
      ...prev,
      [newChannelId]: [welcomeMsg]
    }));

    setGroupChatName('');
    setGroupParticipants(mockGroupParticipants);
    setGroupChatError(null);
    setShowCreateGroupModal(false);
    setGroupCollapsed(false);
    setActiveChannel(newChannel);
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

  // Sync activeChannel if practiceParam and caseIdParam change
  useEffect(() => {
    if (practiceParam || caseIdParam) {
      let parentChannel = null;

      // 1. Try to find the parent channel directly from practiceParam
      if (practiceParam) {
        parentChannel = channels.find(c => c.name.toLowerCase() === practiceParam.toLowerCase() || c.id === practiceParam);
      }

      // 2. If parentChannel not found but caseIdParam is provided, resolve it from referral
      if (!parentChannel && caseIdParam) {
        const allRefs = getReferrals();
        const ref = allRefs.find(r => `case_${r.id}` === caseIdParam || r.id === caseIdParam || r.patientName.toLowerCase() === caseIdParam.replace('case_', '').toLowerCase());
        if (ref) {
          let practiceId = '3';
          if (isDentist) {
            const specialistName = (ref.specialist || '').toLowerCase();
            if (specialistName.includes('downtown')) practiceId = '7';
            else if (specialistName.includes('metro')) practiceId = '8';
            else if (specialistName.includes('arizona')) practiceId = '9';
            else if (specialistName.includes('beverly')) practiceId = '6';
          } else {
            const practice = (ref.practice || '').toLowerCase();
            const dentist = (ref.dentist || '').toLowerCase();
            if (practice.includes('sunshine') || dentist.includes('smith') || dentist.includes('reed') || ref.id === '1' || ref.id === '6' || ref.id === '9') {
              practiceId = '6';
            } else if (practice.includes('desert') || dentist.includes('jones') || ref.id === '2') {
              practiceId = '7';
            }
          }
          parentChannel = channels.find(c => c.id === practiceId);
        }
      }

      if (parentChannel) {
        if (parentChannel.isExternal) {
          setExternalCollapsed(false);  // Expand External section
          setConnectedCollapsed(true);  // Keep Connected collapsed
        } else {
          setConnectedCollapsed(false); // Expand Connected Practices
        }
        const tabParam = searchParams.get('tab');
        const targetTab = (tabParam === 'documents' || tabParam === 'archived' || tabParam === 'messages') ? tabParam : 'messages';
        if (caseIdParam) {
          const allRefs = getReferrals();
          const ref = allRefs.find(r => `case_${r.id}` === caseIdParam || r.id === caseIdParam || r.patientName.toLowerCase() === caseIdParam.replace('case_', '').toLowerCase());
          if (ref) {
            // Auto-reactivate if archived
            const isArchived = ref.status === 'Archived';
            setTimeout(() => {
              if (isArchived) {
                const updated = updateReferralStatus(ref.id, 'Scheduled');
                setReferrals(updated);
              }
              const caseChannelObj: Channel = {
                id: `case_${ref.id}`,
                name: ref.patientName.toUpperCase(),
                type: 'inter-practice',
                lastMessage: `Referral status: ${ref.status}`,
                memberCount: parentChannel.memberCount,
                ...(ref.id.startsWith('ext-') ? { isExternal: true } : {})
              };
              setActiveChannel(caseChannelObj);
              setActiveTab(targetTab);
            }, 0);
            return;
          }
        }
        setActiveChannel(parentChannel);
        setActiveTab(targetTab);
      }
    }
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

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let docObj: SharedDocument | undefined = undefined;

    if (attachedDoc) {
      const docId = 'd_' + Math.random().toString(36).substring(2, 9);
      docObj = {
        id: docId,
        channelId: activeChannel.id,
        name: attachedDoc.name,
        size: attachedDoc.size,
        type: attachedDoc.type,
        sentBy: 'Me',
        sentAt: 'Today, ' + timeString
      };
      setDocuments(prev => [...prev, docObj!]);
    }

    const newMessage: MessageItem = {
      id: 'm_' + Math.random().toString(36).substring(2, 9),
      user: 'Me',
      text: inputText,
      time: timeString,
      type: 'self',
      transport: (activeChannel.type === 'patient' || activeChannel.isExternal) ? 'Email' : 'App',
      document: docObj
    };

    setMessages(prev => ({
      ...prev,
      [activeChannel.id]: [...(prev[activeChannel.id] || []), newMessage]
    }));

    // Update last message of the channel
    setChannels(prev => prev.map(c => {
      const isParent = !activeChannel.id.startsWith('case_') && c.id === activeChannel.id;
      const isCaseParent = activeChannel.id.startsWith('case_') && c.id === caseChannels.find(cc => cc.id === activeChannel.id)?.practiceId;
      if (isParent || isCaseParent) {
        return {
          ...c,
          lastMessage: attachedDoc ? `Shared document: ${attachedDoc.name}` : inputText
        };
      }
      return c;
    }));

    // Auto-reactivate case if archived
    if (activeChannel.id.startsWith('case_')) {
      const refId = activeChannel.id.replace('case_', '');
      const ref = referrals.find(r => r.id === refId);
      if (ref && ref.status === 'Archived') {
        const updatedRefs = updateReferralStatus(refId, 'Scheduled');
        setReferrals(updatedRefs);
      }
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
            router.push(isDentist ? '/dentist/dashboard/send-document' : '/dashboard/send-document');
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
          onSendNewDocument={() => router.push(isDentist ? '/dentist/dashboard/send-document' : '/dashboard/send-document')}
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
