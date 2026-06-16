"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  getChannels,
  getMessages,
  getReferrals,
  saveChannels,
  saveMessages,
  updateReferralStatus,
  updateDentistReferralStatus,
  type UnifiedReferral,
  initialReferrals,
} from '@/lib/referrals';
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
  mockAttachments,
  mockChannels,
  mockGroupParticipants,
  specialistClinics,
  type GroupParticipant,
} from '@/prototype/channelFixtures';

type AttachedDocDraft = {
  name: string;
  size: string;
  type: SharedDocument['type'];
};

type UsePrototypeChannelsStateArgs = {
  isDentist: boolean;
  practiceParam: string | null;
  caseIdParam: string | null;
  tabParam: string | null;
  isTrialEnded: boolean;
  onPaywall: () => void;
  onNavigate: (href: string) => void;
};

const DOCS_PER_PAGE = 6;

export function usePrototypeChannelsState({
  isDentist,
  practiceParam,
  caseIdParam,
  tabParam,
  isTrialEnded,
  onPaywall,
  onNavigate,
}: UsePrototypeChannelsStateArgs) {
  const [referrals, setReferrals] = useState<UnifiedReferral[]>(initialReferrals);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel>(mockChannels[0]);
  const [messages, setMessages] = useState<Record<string, MessageItem[]>>({});
  const [documents, setDocuments] = useState<SharedDocument[]>(initialDocuments);
  const [activeTab, setActiveTab] = useState<'messages' | 'documents' | 'archived'>('messages');
  const [internalCollapsed, setInternalCollapsed] = useState(true);
  const [connectedCollapsed, setConnectedCollapsed] = useState(true);
  const [externalCollapsed, setExternalCollapsed] = useState(true);
  const [patientCollapsed, setPatientCollapsed] = useState(true);
  const [groupCollapsed, setGroupCollapsed] = useState(true);
  const [expandedPractices, setExpandedPractices] = useState<Record<string, boolean>>({});
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupChatName, setGroupChatName] = useState('');
  const [groupParticipants, setGroupParticipants] = useState<GroupParticipant[]>(mockGroupParticipants);
  const [groupChatError, setGroupChatError] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [attachedDoc, setAttachedDoc] = useState<AttachedDocDraft | null>(null);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAttachmentDrawer, setShowAttachmentDrawer] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<SharedDocument | null>(null);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participants, setParticipants] = useState([
    { id: 'p1', name: 'Dr. John Smith', role: 'Dentist', selected: true },
    { id: 'p2', name: 'Jane Doe', role: 'Hygienist', selected: true },
    { id: 'p3', name: 'Mike Johnson', role: 'Assistant', selected: true },
    { id: 'p4', name: 'Sarah Wilson', role: 'Front Desk', selected: true },
  ]);
  const [showChannelList, setShowChannelList] = useState(false);
  const [docPage, setDocPage] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      setReferrals(getReferrals());
    }, 0);
  }, []);

  useEffect(() => {
    setMessages(getMessages());
  }, []);

  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    setChannels(getChannels(isDentist));
  }, [isDentist]);

  useEffect(() => {
    if (channels.length > 0) {
      saveChannels(isDentist, channels);
    }
  }, [channels, isDentist]);

  const caseChannels = useMemo(() => buildCaseChannels({
    referrals,
    isDentist,
    dentistPractices,
    specialistClinics,
    hidePending: true,
    includeCodeInName: false,
  }), [referrals, isDentist]);

  const filteredInternalChannels = useMemo(
    () => filterChannelsByType(channels, 'internal', sidebarSearchQuery),
    [channels, sidebarSearchQuery],
  );
  const filteredPatientChannels = useMemo(
    () => filterChannelsByType(channels, 'patient', sidebarSearchQuery),
    [channels, sidebarSearchQuery],
  );
  const filteredGroupChannels = useMemo(
    () => filterChannelsByType(channels, 'group', sidebarSearchQuery),
    [channels, sidebarSearchQuery],
  );
  const filteredCaseChannels = useMemo(
    () => filterCaseChannels(caseChannels, sidebarSearchQuery),
    [caseChannels, sidebarSearchQuery],
  );
  const filteredPracticeChannels = useMemo(
    () => filterPracticeChannels(channels, caseChannels, sidebarSearchQuery),
    [channels, caseChannels, sidebarSearchQuery],
  );
  const { onPlatform: filteredOnPlatformChannels, external: filteredExternalChannels } = useMemo(
    () => splitPracticeChannels(filteredPracticeChannels),
    [filteredPracticeChannels],
  );

  const displayedChannels = channels;
  const internalUnreadCount = useMemo(
    () => displayedChannels.filter((channel) => channel.type === 'internal').reduce((sum, channel) => sum + (channel.unreadCount || 0), 0),
    [displayedChannels],
  );
  const connectedUnreadCount = useMemo(
    () => displayedChannels.filter((channel) => channel.type === 'inter-practice' && !channel.isExternal).reduce((sum, channel) => sum + (channel.unreadCount || 0), 0),
    [displayedChannels],
  );
  const externalUnreadCount = useMemo(
    () => displayedChannels.filter((channel) => channel.type === 'inter-practice' && channel.isExternal).reduce((sum, channel) => sum + (channel.unreadCount || 0), 0),
    [displayedChannels],
  );
  const groupUnreadCount = useMemo(
    () => displayedChannels.filter((channel) => channel.type === 'group').reduce((sum, channel) => sum + (channel.unreadCount || 0), 0),
    [displayedChannels],
  );
  const patientUnreadCount = useMemo(
    () => displayedChannels.filter((channel) => channel.type === 'patient').reduce((sum, channel) => sum + (channel.unreadCount || 0), 0),
    [displayedChannels],
  );

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (activeChannel?.id?.startsWith('case_')) {
      const caseChannel = caseChannels.find((item) => item.id === activeChannel.id);
      if (caseChannel?.practiceId) {
        setExpandedPractices((prev) => {
          if (prev[caseChannel.practiceId]) return prev;
          return { ...prev, [caseChannel.practiceId]: true };
        });
      }
    }
  }, [activeChannel, caseChannels]);

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

  useEffect(() => {
    const resolution = resolveActiveChannelFromQuery({
      practiceParam,
      caseIdParam,
      tabParam,
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
  }, [practiceParam, caseIdParam, tabParam, channels, isDentist]);

  const handleSelectChannel = (channel: Channel) => {
    setActiveChannel(channel);
    setShowChannelList(false);
    const isParentInterPractice = channel.type === 'inter-practice' && !channel.id.startsWith('case_');
    if (isParentInterPractice) {
      setExpandedPractices((prev) => ({
        ...prev,
        [channel.id]: !prev[channel.id],
      }));
    }
    if (!isParentInterPractice && activeTab === 'archived') {
      setActiveTab('messages');
    }
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

    setChannels((prev) => [...prev, result.channel]);
    setMessages((prev) => ({ ...prev, [result.channel.id]: [result.message] }));
    setGroupChatName('');
    setGroupParticipants(mockGroupParticipants);
    setGroupChatError(null);
    setShowCreateGroupModal(false);
    setGroupCollapsed(false);
    setActiveChannel(result.channel);
    setActiveTab('messages');
    triggerToast('Group chat created successfully!');
  };

  const handleSendMessage = () => {
    if (isTrialEnded) {
      onPaywall();
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
    triggerToast(attachedDoc ? 'Message sent with document!' : 'Message sent!');
  };

  useEffect(() => {
    setDocPage(1);
  }, [docSearchQuery, activeChannel.id]);

  const filteredDocuments = useMemo(() => {
    const seen = new Set<string>();
    return documents
      .filter((documentItem) => documentItem.channelId === activeChannel.id)
      .filter((documentItem) => documentItem.name.toLowerCase().includes(docSearchQuery.toLowerCase()))
      .filter((documentItem) => {
        if (seen.has(documentItem.id)) return false;
        seen.add(documentItem.id);
        return true;
      });
  }, [documents, activeChannel.id, docSearchQuery]);

  const paginatedDocuments = useMemo(() => {
    const startIndex = (docPage - 1) * DOCS_PER_PAGE;
    return filteredDocuments.slice(startIndex, startIndex + DOCS_PER_PAGE);
  }, [filteredDocuments, docPage]);

  const totalDocPages = Math.max(1, Math.ceil(filteredDocuments.length / DOCS_PER_PAGE));

  const formatMessage = (message: MessageItem) => {
    if (activeChannel.type !== 'inter-practice') {
      return { type: message.type, user: message.user };
    }
    const isCaseChannel = activeChannel.id.startsWith('case_');
    if (isCaseChannel) {
      if (isDentist) {
        return {
          type: message.type,
          user: message.user === 'Valley Endodontics' ? 'Valley Endodontics' : message.user,
        };
      }
      if (message.type === 'self') {
        return { type: 'other' as const, user: 'Sunshine Dental' };
      }
      return { type: 'self' as const, user: 'Me' };
    }
    if (isDentist) {
      const isSelf = message.user === 'Me' || message.user === 'Dr. Taylor Reed';
      return { type: isSelf ? ('self' as const) : ('other' as const), user: isSelf ? 'Me' : activeChannel.name };
    }
    const isSelf = message.user === 'Me' || message.user === 'Valley Endodontics';
    return { type: isSelf ? ('self' as const) : ('other' as const), user: isSelf ? 'Me' : activeChannel.name };
  };

  const formatDocumentSender = (sentBy: string) => {
    if (activeChannel.type !== 'inter-practice') {
      return sentBy;
    }
    const isCaseChannel = activeChannel.id.startsWith('case_');
    if (isCaseChannel) {
      if (isDentist) return sentBy;
      if (sentBy === 'Me') return 'Sunshine Dental';
      if (sentBy === 'Valley Endodontics') return 'Me';
      return sentBy;
    }
    if (isDentist) {
      const isSelf = sentBy === 'Me' || sentBy === 'Dr. Taylor Reed' || sentBy === 'Sunshine Dental';
      return isSelf ? 'Me' : activeChannel.name;
    }
    const isSelf = sentBy === 'Me' || sentBy === 'Valley Endodontics';
    return isSelf ? 'Me' : activeChannel.name;
  };

  return {
    activeChannel,
    activeTab,
    attachedDoc,
    channels,
    setChannels,
    documents,
    setDocuments,
    referrals,
    caseChannels,
    docPage,
    docSearchQuery,
    externalCollapsed,
    externalUnreadCount,
    expandedPractices,
    filteredCaseChannels,
    filteredDocuments,
    filteredExternalChannels,
    filteredGroupChannels,
    filteredInternalChannels,
    filteredOnPlatformChannels,
    filteredPatientChannels,
    groupChatError,
    groupChatName,
    groupCollapsed,
    groupParticipants,
    groupUnreadCount,
    inputText,
    internalCollapsed,
    internalUnreadCount,
    connectedCollapsed,
    connectedUnreadCount,
    messages,
    mockAttachments,
    paginatedDocuments,
    participants,
    patientCollapsed,
    patientUnreadCount,
    previewDocument,
    showAttachmentDrawer,
    showChannelList,
    showCreateGroupModal,
    showParticipantsModal,
    sidebarSearchQuery,
    toastMessage,
    totalDocPages,
    triggerToast,
    setActiveChannel,
    setMessages,
    setActiveTab,
    setAttachedDoc,
    setDocPage,
    setDocSearchQuery,
    setExternalCollapsed,
    setConnectedCollapsed,
    setGroupChatError,
    setGroupChatName,
    setGroupCollapsed,
    setGroupParticipants,
    setInputText,
    setInternalCollapsed,
    setPatientCollapsed,
    setPreviewDocument,
    setReferrals,
    setShowAttachmentDrawer,
    setShowChannelList,
    setShowCreateGroupModal,
    setShowParticipantsModal,
    setSidebarSearchQuery,
    handleCreateGroupChat,
    handleSelectChannel,
    handleSendMessage,
    formatDocumentSender,
    formatMessage,
    onCancelCreateGroup: () => {
      setShowCreateGroupModal(false);
      setGroupChatName('');
      setGroupParticipants(mockGroupParticipants);
      setGroupChatError(null);
    },
    onAttachNew: () => {
      onNavigate(isDentist ? '/dentist/dashboard/send-document' : '/dashboard/send-document');
      setShowAttachmentDrawer(false);
    },
    onSendNewDocument: () => onNavigate(isDentist ? '/dentist/dashboard/send-document' : '/dashboard/send-document'),
    onArchiveCase: () => {
      const referralId = activeChannel.id.replace('case_', '');
      const updated = isDentist
        ? updateDentistReferralStatus(referralId, 'Archived')
        : updateReferralStatus(referralId, 'Archived');
      setReferrals(updated);
      triggerToast(`Archived channel for ${activeChannel.name}!`);
      const parentId = caseChannels.find((caseChannel) => caseChannel.id === activeChannel.id)?.practiceId || '3';
      const parentChannel = channels.find((channel) => channel.id === parentId) || channels[0];
      setActiveChannel(parentChannel);
    },
    onBackToPractice: () => {
      const parentId = caseChannels.find((caseChannel) => caseChannel.id === activeChannel.id)?.practiceId || '3';
      const parentChannel = channels.find((channel) => channel.id === parentId) || channels[0];
      setActiveChannel(parentChannel);
    },
    onReactivateArchived: (conversationId: string) => {
      const archivedCase = caseChannels.find((caseChannel) => caseChannel.id === conversationId);
      if (!archivedCase) return;

      const referralId = conversationId.replace('case_', '');
      const updated = isDentist
        ? updateDentistReferralStatus(referralId, 'Scheduled')
        : updateReferralStatus(referralId, 'Scheduled');
      setReferrals(updated);
      triggerToast(`Re-activated channel for ${archivedCase.patientName}!`);
      setActiveChannel({
        id: archivedCase.id,
        name: archivedCase.name,
        type: 'inter-practice',
        lastMessage: archivedCase.lastMessage,
        memberCount: activeChannel.memberCount,
      });
      setActiveTab('messages');
    },
    onCompleteCare: () => {
      const referralId = activeChannel.id.replace('case_', '');
      const updated = updateDentistReferralStatus(referralId, 'Completed');
      setReferrals(updated);
      triggerToast(`Care completed for ${activeChannel.name}!`);
    },
    onToggleParticipant: (id: string) => {
      setParticipants((prev) => prev.map((participant) => participant.id === id ? { ...participant, selected: !participant.selected } : participant));
    },
    onToggleGroupParticipant: (id: string) => {
      setGroupParticipants((prev) => prev.map((participant) => participant.id === id ? { ...participant, selected: !participant.selected } : participant));
      setGroupChatError(null);
    },
    onToggleGroupPractice: (participantIds: string[], shouldSelect: boolean) => {
      setGroupParticipants((prev) =>
        prev.map((participant) =>
          participantIds.includes(participant.id)
            ? { ...participant, selected: shouldSelect }
            : participant,
        ),
      );
      setGroupChatError(null);
    },
  };
}
