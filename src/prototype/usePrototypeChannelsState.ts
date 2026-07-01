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
  unarchiveReferral,
  type UnifiedReferral,
  initialReferrals,
} from '@/lib/referrals';
import {
  buildChannelGroupCreation,
  buildChannelInternalCreation,
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

const getDirectoryUsers = (isDentist: boolean) => {
  const ownPracticeName = isDentist ? 'Sunshine Dental (Me)' : 'Valley Endodontics';

  return [
    // Own Practice Users (exactly the 4 active users in the logged-in practice)
    { id: 'gp_emma', name: 'Dr. Emma Smith', role: 'Owner', practice: ownPracticeName },
    { id: 'gp_alice', name: 'Alice Johnson', role: 'Practice Admin', practice: ownPracticeName },
    { id: 'gp_bob', name: 'Bob Wilson', role: 'Team Member', practice: ownPracticeName },
    { id: 'gp_carol', name: 'Carol Danvers', role: 'Team Member', practice: ownPracticeName },

    // Connected Practice Users
    { id: 'gp3', name: 'Dr. Clara Valley', role: 'Owner', practice: isDentist ? 'Valley Endodontics' : 'Valley Endodontics (External)' },
    { id: 'gp4', name: 'Robert Chen', role: 'Practice Admin', practice: isDentist ? 'Valley Endodontics' : 'Valley Endodontics (External)' },

    { id: 'gp1', name: 'Dr. John Smith', role: 'Owner', practice: 'Sunshine Dental' },
    { id: 'gp2', name: 'Jane Doe', role: 'Team Member', practice: 'Sunshine Dental' },
    { id: 'gpExtra1', name: 'Mike Johnson', role: 'Team Member', practice: 'Sunshine Dental' },
    { id: 'gpExtra2', name: 'Sarah Wilson', role: 'Practice Admin', practice: 'Sunshine Dental' },

    { id: 'gp_oak1', name: 'Dr. Patricia Oakridge', role: 'Owner', practice: 'Oakridge Dental' },
    { id: 'gp_oak2', name: 'Frank Oakridge', role: 'Practice Admin', practice: 'Oakridge Dental' },

    { id: 'gp_db1', name: 'Dr. Sarah Bloom', role: 'Owner', practice: 'Desert Bloom Dental' },
    { id: 'gp_db2', name: 'Alice Bloom', role: 'Team Member', practice: 'Desert Bloom Dental' },

    // Other clinics
    { id: 'gp5', name: 'Dr. Marcus Jones', role: 'Owner', practice: 'Downtown Oral Surgery' },
    { id: 'gp6', name: 'Linda Brooks', role: 'Practice Admin', practice: 'Downtown Oral Surgery' },
    { id: 'gp7', name: 'Dr. Angela Metro', role: 'Owner', practice: 'Metro Orthodontics' },
    { id: 'gp8', name: 'Dr. David Bowie', role: 'Owner', practice: 'Arizona Periodontics' },
  ];
};

function getInitialParticipantsForChannel(
  channel: Channel,
  isDentist: boolean,
  referralsList?: UnifiedReferral[],
  channelsList?: Channel[]
): { id: string; name: string; role: string; practice: string; selected: boolean }[] {
  const ownPractice = isDentist ? 'Sunshine Dental (Me)' : 'Valley Endodontics';
  const referrals = (referralsList && referralsList.length > 0) ? referralsList : getReferrals();
  const channels = (channelsList && channelsList.length > 0) ? channelsList : getChannels(isDentist);
  const directory = getDirectoryUsers(isDentist);

  if (channel.type === 'internal' || channel.type === 'public') {
    return directory
      .filter((u) => u.practice === ownPractice)
      .map((u) => ({ ...u, selected: true }));
  }

  if (channel.type === 'group') {
    return directory.map((u) => ({
      ...u,
      selected: u.id === 'gp_emma' || u.id === 'gp_alice' || u.id === 'gp_bob',
    }));
  }

  let otherPractice = '';
  if (channel.id.startsWith('case_')) {
    const refId = channel.id.replace('case_', '');
    const referral = referrals.find((r) => r.id === refId);
    if (referral) {
      otherPractice = isDentist ? referral.specialist || '' : referral.practice || '';
    }
  } else if (channel.parentId) {
    const parent = channels.find((c) => c.id === channel.parentId);
    if (parent) {
      otherPractice = parent.name;
    } else {
      otherPractice = 'Valley Endodontics';
    }
  } else {
    otherPractice = channel.name;
  }

  const normalize = (p: string) => p.toLowerCase().replace(/\s*\(me\)\s*/g, '').trim();
  const normOwn = normalize(ownPractice);
  const normOther = normalize(otherPractice);

  return directory
    .filter((u) => {
      const normUserPractice = normalize(u.practice);
      if (normUserPractice === normOwn) {
        return u.id.startsWith('gp_');
      }
      return normUserPractice === normOther;
    })
    .map((u) => ({ ...u, selected: true }));
}

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
  const [channelParticipants, setChannelParticipants] = useState<Record<string, { id: string; name: string; role: string; practice: string; selected: boolean }[]>>({});
  const [baseChannels, setChannels] = useState<Channel[]>([]);
  const channels = useMemo(() => {
    return baseChannels.map((c) => {
      const participantsList = channelParticipants[c.id] || getInitialParticipantsForChannel(c, isDentist, referrals, baseChannels);
      const activeCount = participantsList.filter((p) => p.selected).length;
      return {
        ...c,
        memberCount: activeCount,
      };
    });
  }, [baseChannels, channelParticipants, isDentist, referrals]);
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
  const [isGroupNameManuallyEdited, setIsGroupNameManuallyEdited] = useState(false);
  const [groupParticipants, setGroupParticipants] = useState<GroupParticipant[]>([]);
  const [groupChatError, setGroupChatError] = useState<string | null>(null);
  const [showCreateInternalModal, setShowCreateInternalModal] = useState(false);
  const [internalParticipants, setInternalParticipants] = useState<GroupParticipant[]>([]);
  const [internalChannelName, setInternalChannelName] = useState('');
  const [internalChannelError, setInternalChannelError] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [attachedDoc, setAttachedDoc] = useState<AttachedDocDraft | null>(null);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAttachmentDrawer, setShowAttachmentDrawer] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<SharedDocument | null>(null);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participants, setParticipants] = useState<{ id: string; name: string; role: string; practice: string; selected: boolean }[]>([]);
  const [showChannelList, setShowChannelList] = useState(false);
  const [docPage, setDocPage] = useState(1);
  const [isViewingArchivedDocs, setIsViewingArchivedDocs] = useState(false);

  const [showCreateSubChannelModal, setShowCreateSubChannelModal] = useState(false);
  const [subChannelParticipants, setSubChannelParticipants] = useState<GroupParticipant[]>([]);
  const [subChannelName, setSubChannelName] = useState('');
  const [subChannelParentPractice, setSubChannelParentPractice] = useState<Channel | null>(null);
  const [subChannelError, setSubChannelError] = useState<string | null>(null);

  const [replyingToMessage, setReplyingToMessage] = useState<MessageItem | null>(null);
  const [pinnedMessages, setPinnedMessages] = useState<string[]>([]);
  const [messageToForward, setMessageToForward] = useState<MessageItem | null>(null);
  const [isForwardMessageModalOpen, setIsForwardMessageModalOpen] = useState(false);

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
    const directory = getDirectoryUsers(isDentist);
    setGroupParticipants(
      directory.map((u) => ({
        id: u.id,
        name: u.name,
        practice: u.practice,
        selected: false,
      }))
    );
  }, [isDentist]);

  useEffect(() => {
    if (showCreateInternalModal) {
      const ownPracticeName = isDentist ? 'Sunshine Dental (Me)' : 'Valley Endodontics';
      const directory = getDirectoryUsers(isDentist);
      setInternalParticipants(
        directory
          .filter((u) => u.practice === ownPracticeName)
          .map((u) => ({
            id: u.id,
            name: u.name,
            practice: u.practice,
            selected: true,
          }))
      );
    }
  }, [showCreateInternalModal, isDentist]);

  useEffect(() => {
    if (showCreateSubChannelModal && subChannelParentPractice) {
      const ownPracticeName = isDentist ? 'Sunshine Dental (Me)' : 'Valley Endodontics';
      const otherPracticeName = subChannelParentPractice.name;
      const directory = getDirectoryUsers(isDentist);
      
      const normalize = (p: string) => p.toLowerCase().replace(/\s*\(me\)\s*/g, '').trim();
      const normOwn = normalize(ownPracticeName);
      const normOther = normalize(otherPracticeName);

      setSubChannelParticipants(
        directory
          .filter((u) => {
            const normUserPractice = normalize(u.practice);
            if (normUserPractice === normOwn) {
              return u.id.startsWith('gp_');
            }
            return normUserPractice === normOther;
          })
          .map((u) => ({
            id: u.id,
            name: u.name,
            practice: u.practice,
            selected: true,
          }))
      );
    }
  }, [showCreateSubChannelModal, subChannelParentPractice, isDentist]);

  const storageKey = isDentist ? 'drtalk_channel_participants_dentist_v7' : 'drtalk_channel_participants_specialist_v7';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('drtalk_channel_participants_dentist');
      localStorage.removeItem('drtalk_channel_participants_specialist');
      localStorage.removeItem('drtalk_channel_participants_dentist_v2');
      localStorage.removeItem('drtalk_channel_participants_specialist_v2');
      localStorage.removeItem('drtalk_channel_participants_dentist_v3');
      localStorage.removeItem('drtalk_channel_participants_specialist_v3');
      localStorage.removeItem('drtalk_channel_participants_dentist_v4');
      localStorage.removeItem('drtalk_channel_participants_specialist_v4');
      localStorage.removeItem('drtalk_channel_participants_dentist_v5');
      localStorage.removeItem('drtalk_channel_participants_specialist_v5');
      localStorage.removeItem('drtalk_channel_participants_dentist_v6');
      localStorage.removeItem('drtalk_channel_participants_specialist_v6');
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          setChannelParticipants(JSON.parse(stored));
        } catch (e) {
          // ignore
        }
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (Object.keys(channelParticipants).length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(channelParticipants));
    }
  }, [channelParticipants, storageKey]);

  useEffect(() => {
    if (!activeChannel) return;
    const existing = channelParticipants[activeChannel.id];
    if (existing) {
      setParticipants(existing);
    } else {
      const initial = getInitialParticipantsForChannel(activeChannel, isDentist, referrals, baseChannels);
      setParticipants(initial);
      setChannelParticipants(prev => {
        if (prev[activeChannel.id]) return prev;
        return {
          ...prev,
          [activeChannel.id]: initial
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChannel.id, isDentist, referrals, baseChannels]);


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
      setPatientCollapsed(true);
      setGroupCollapsed(true);
      setInternalCollapsed(true);
    } else if (resolution.expandSection === 'patient') {
      setPatientCollapsed(false);
      setConnectedCollapsed(true);
      setExternalCollapsed(true);
      setGroupCollapsed(true);
      setInternalCollapsed(true);
    } else if (resolution.expandSection === 'group') {
      setGroupCollapsed(false);
      setConnectedCollapsed(true);
      setExternalCollapsed(true);
      setPatientCollapsed(true);
      setInternalCollapsed(true);
    } else if (resolution.expandSection === 'internal') {
      setInternalCollapsed(false);
      setConnectedCollapsed(true);
      setExternalCollapsed(true);
      setPatientCollapsed(true);
      setGroupCollapsed(true);
    } else {
      setConnectedCollapsed(false);
      setExternalCollapsed(true);
      setPatientCollapsed(true);
      setGroupCollapsed(true);
      setInternalCollapsed(true);
    }

    if (resolution.parentChannel) {
      setExpandedPractices((prev) => {
        if (prev[resolution.parentChannel.id]) return prev;
        return { ...prev, [resolution.parentChannel.id]: true };
      });
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
    setIsViewingArchivedDocs(false);
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

    const initialParticipants = getDirectoryUsers(isDentist).map((u) => {
      const selectedInModal = groupParticipants.some((gp) => gp.id === u.id && gp.selected);
      return {
        ...u,
        selected: selectedInModal,
      };
    });
    setChannelParticipants((prev) => ({
      ...prev,
      [result.channel.id]: initialParticipants,
    }));

    setGroupChatName('');
    setGroupParticipants(
      getDirectoryUsers(isDentist).map((u) => ({
        id: u.id,
        name: u.name,
        practice: u.practice,
        selected: false,
      }))
    );
    setGroupChatError(null);
    setIsGroupNameManuallyEdited(false);
    setShowCreateGroupModal(false);
    setGroupCollapsed(false);
    setActiveChannel(result.channel);
    setActiveTab('messages');
    triggerToast('Direct message created successfully!');
  };

  const handleCreateInternalChannel = () => {
    const result = buildChannelInternalCreation({
      channelName: internalChannelName,
      existingChannels: channels,
    });

    if (!result.ok) {
      setInternalChannelError(result.error);
      return;
    }

    const ownPracticeName = isDentist ? 'Sunshine Dental (Me)' : 'Valley Endodontics';
    const directory = getDirectoryUsers(isDentist);
    const initialParticipants = directory
      .filter((u) => u.practice === ownPracticeName)
      .map((u) => {
        const selectedInModal = internalParticipants.some((gp) => gp.id === u.id && gp.selected);
        return {
          ...u,
          selected: selectedInModal,
        };
      });

    setChannelParticipants((prev) => ({
      ...prev,
      [result.channel.id]: initialParticipants,
    }));

    setChannels((prev) => [...prev, result.channel]);
    setMessages((prev) => ({ ...prev, [result.channel.id]: [result.message] }));
    setInternalChannelName('');
    setInternalChannelError(null);
    setShowCreateInternalModal(false);
    setInternalCollapsed(false);
    setActiveChannel(result.channel);
    setActiveTab('messages');
    triggerToast(`Channel #${result.channel.name} created successfully!`);
  };

  const onCancelCreateInternal = () => {
    setInternalChannelName('');
    setInternalChannelError(null);
    setShowCreateInternalModal(false);
  };

  const handleCreateSubChannel = () => {
    if (!subChannelName.trim() || !subChannelParentPractice) return;

    const formattedName = subChannelName.trim().toLowerCase().replace(/\s+/g, '-');
    const isDuplicate = channels.some(
      (c) => c.parentId === subChannelParentPractice.id && c.name.toLowerCase() === formattedName
    );

    if (isDuplicate) {
      setSubChannelError('A sub-channel with this name already exists.');
      return;
    }

    const newChannelId = `sub_${Date.now()}`;
    const newSubChannel: Channel = {
      id: newChannelId,
      name: formattedName,
      type: 'inter-practice',
      lastMessage: 'Sub-channel created.',
      memberCount: subChannelParentPractice.memberCount,
      parentId: subChannelParentPractice.id,
      isExternal: subChannelParentPractice.isExternal,
    };

    const welcomeMsg: MessageItem = {
      id: `msg_sys_${Date.now()}`,
      user: 'System',
      text: `Sub-channel #${formattedName} created successfully under ${subChannelParentPractice.name}.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'other',
    };

    const ownPracticeName = isDentist ? 'Sunshine Dental (Me)' : 'Valley Endodontics';
    const otherPracticeName = subChannelParentPractice.name;
    const directory = getDirectoryUsers(isDentist);
    const normalize = (p: string) => p.toLowerCase().replace(/\s*\(me\)\s*/g, '').trim();
    const normOwn = normalize(ownPracticeName);
    const normOther = normalize(otherPracticeName);

    const initialParticipants = directory
      .filter((u) => {
        const normUserPractice = normalize(u.practice);
        if (normUserPractice === normOwn) {
          return u.id.startsWith('gp_');
        }
        return normUserPractice === normOther;
      })
      .map((u) => {
        const selectedInModal = subChannelParticipants.some((gp) => gp.id === u.id && gp.selected);
        return {
          ...u,
          selected: selectedInModal,
        };
      });

    setChannelParticipants((prev) => ({
      ...prev,
      [newChannelId]: initialParticipants,
    }));

    setChannels((prev) => [...prev, newSubChannel]);
    setMessages((prev) => ({ ...prev, [newChannelId]: [welcomeMsg] }));

    setExpandedPractices((prev) => ({ ...prev, [subChannelParentPractice.id]: true }));
    setActiveChannel(newSubChannel);
    setActiveTab('messages');

    setSubChannelName('');
    setSubChannelError(null);
    setSubChannelParentPractice(null);
    setShowCreateSubChannelModal(false);
    triggerToast(`Sub-channel #${formattedName} created!`);
  };

  const handleOpenCreateSubChannel = (parentPractice: Channel) => {
    setSubChannelParentPractice(parentPractice);
    setSubChannelName('');
    setSubChannelError(null);
    setShowCreateSubChannelModal(true);
  };

  const handleCancelCreateSubChannel = () => {
    setSubChannelName('');
    setSubChannelError(null);
    setSubChannelParentPractice(null);
    setShowCreateSubChannelModal(false);
  };

  const handleReplyMessage = (messageId: string) => {
    const channelMsgs = messages[activeChannel.id] || [];
    const msg = channelMsgs.find((m) => m.id === messageId);
    if (msg) {
      setReplyingToMessage(msg);
    }
  };

  const handleForwardMessage = (messageId: string) => {
    const channelMsgs = messages[activeChannel.id] || [];
    const msg = channelMsgs.find((m) => m.id === messageId);
    if (msg) {
      setMessageToForward(msg);
      setIsForwardMessageModalOpen(true);
    }
  };

  const handlePinMessage = (messageId: string) => {
    setPinnedMessages((prev) => {
      const isAlreadyPinned = prev.includes(messageId);
      if (isAlreadyPinned) {
        triggerToast('Message unpinned');
        return prev.filter((id) => id !== messageId);
      } else {
        triggerToast('Message pinned to channel');
        return [...prev, messageId];
      }
    });
  };

  const handleCopyMessage = (messageId: string) => {
    const channelMsgs = messages[activeChannel.id] || [];
    const msg = channelMsgs.find((m) => m.id === messageId);
    if (msg) {
      navigator.clipboard.writeText(msg.text);
      triggerToast('Message copied to clipboard');
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => {
      const channelMsgs = prev[activeChannel.id] || [];
      const updatedMsgs = channelMsgs.filter((m) => m.id !== messageId);
      return {
        ...prev,
        [activeChannel.id]: updatedMsgs,
      };
    });
    triggerToast('Message deleted');
  };

  const handleSendMessage = () => {
    if (isTrialEnded) {
      onPaywall();
      return;
    }
    if (!inputText.trim() && !attachedDoc) return;

    let textToSend = inputText;
    if (replyingToMessage) {
      textToSend = `> Replying to ${replyingToMessage.user === 'Me' ? 'You' : replyingToMessage.user}: "${replyingToMessage.text.substring(0, 60)}${replyingToMessage.text.length > 60 ? '...' : ''}"\n\n${inputText}`;
      setReplyingToMessage(null);
    }

    const result = buildChannelMessageSend({
      activeChannel,
      channels,
      caseChannels,
      referrals,
      messages,
      documents,
      inputText: textToSend,
      attachedDoc,
    });
    if (!result.ok) return;

    setDocuments(result.documents);
    setMessages(result.messages);
    setChannels(result.channels);

    if (result.reactivatedReferralId) {
      const updatedRefs = unarchiveReferral(result.reactivatedReferralId);
      setReferrals(updatedRefs);
    }

    setInputText('');
    setAttachedDoc(null);
    triggerToast(attachedDoc ? 'Message sent with document!' : 'Message sent!');
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) => {
      const channelMsgs = prev[activeChannel.id] || [];
      const updatedMsgs = channelMsgs.map((msg) => {
        if (msg.id !== messageId) return msg;

        const currentReactions = { ...(msg.reactions || {}) };
        const users = currentReactions[emoji] ? [...currentReactions[emoji]] : [];

        if (users.includes('You')) {
          currentReactions[emoji] = users.filter((u) => u !== 'You');
        } else {
          currentReactions[emoji] = [...users, 'You'];
        }

        // Clean up empty reaction arrays
        if (currentReactions[emoji].length === 0) {
          delete currentReactions[emoji];
        }

        return {
          ...msg,
          reactions: currentReactions,
        };
      });

      return {
        ...prev,
        [activeChannel.id]: updatedMsgs,
      };
    });
  };

  useEffect(() => {
    setDocPage(1);
  }, [docSearchQuery, activeChannel.id]);

  const filteredDocuments = useMemo(() => {
    const seen = new Set<string>();
    return documents
      .filter((documentItem) => documentItem.channelId === activeChannel.id)
      .filter((documentItem) => isViewingArchivedDocs ? !!documentItem.isArchived : !documentItem.isArchived)
      .filter((documentItem) => documentItem.name.toLowerCase().includes(docSearchQuery.toLowerCase()))
      .filter((documentItem) => {
        if (seen.has(documentItem.id)) return false;
        seen.add(documentItem.id);
        return true;
      });
  }, [documents, activeChannel.id, docSearchQuery, isViewingArchivedDocs]);

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
    showCreateInternalModal,
    internalParticipants,
    subChannelParticipants,
    internalChannelName,
    internalChannelError,
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
    onGroupChatNameChange: (name: string) => {
      setGroupChatName(name);
      setIsGroupNameManuallyEdited(name.trim() !== '');
    },
    setGroupCollapsed,
    setGroupParticipants,
    onToggleInternalParticipant: (id: string) => {
      setInternalParticipants((prev) =>
        prev.map((participant) =>
          participant.id === id ? { ...participant, selected: !participant.selected } : participant
        )
      );
    },
    onToggleInternalPractice: (participantIds: string[], shouldSelect: boolean) => {
      setInternalParticipants((prev) =>
        prev.map((participant) =>
          participantIds.includes(participant.id)
            ? { ...participant, selected: shouldSelect }
            : participant
        )
      );
    },
    onToggleSubChannelParticipant: (id: string) => {
      setSubChannelParticipants((prev) =>
        prev.map((participant) =>
          participant.id === id ? { ...participant, selected: !participant.selected } : participant
        )
      );
    },
    onToggleSubChannelPractice: (participantIds: string[], shouldSelect: boolean) => {
      setSubChannelParticipants((prev) =>
        prev.map((participant) =>
          participantIds.includes(participant.id)
            ? { ...participant, selected: shouldSelect }
            : participant
        )
      );
    },
    setInputText,
    setInternalCollapsed,
    setPatientCollapsed,
    setPreviewDocument,
    setReferrals,
    setShowAttachmentDrawer,
    setShowChannelList,
    setShowCreateGroupModal,
    setShowCreateInternalModal,
    setInternalChannelName,
    setInternalChannelError,
    setShowParticipantsModal,
    setSidebarSearchQuery,
    handleCreateGroupChat,
    handleCreateInternalChannel,
    onCancelCreateInternal,
    handleSelectChannel,
    handleSendMessage,
    handleToggleReaction,
    formatDocumentSender,
    formatMessage,
    isViewingArchivedDocs,
    setIsViewingArchivedDocs,
    onArchiveDocument: (documentItem: SharedDocument) => {
      setDocuments(prev => prev.map(d => d.id === documentItem.id ? { ...d, isArchived: true } : d));
      triggerToast(`Archived "${documentItem.name}"`);
    },
    onUnarchiveDocument: (documentItem: SharedDocument) => {
      setDocuments(prev => prev.map(d => d.id === documentItem.id ? { ...d, isArchived: false } : d));
      triggerToast(`Restored "${documentItem.name}"`);
    },
    onCancelCreateGroup: () => {
      setShowCreateGroupModal(false);
      setGroupChatName('');
      setGroupParticipants(
        getDirectoryUsers(isDentist).map((u) => ({
          id: u.id,
          name: u.name,
          practice: u.practice,
          selected: false,
        }))
      );
      setGroupChatError(null);
      setIsGroupNameManuallyEdited(false);
    },
    onAttachNew: () => {
      onNavigate(isDentist ? '/dentist/dashboard/send-document' : '/dashboard/send-document');
      setShowAttachmentDrawer(false);
    },
    onSendNewDocument: () => onNavigate(isDentist ? '/dentist/dashboard/send-document' : '/dashboard/send-document'),
    onArchiveCase: () => {
      if (activeChannel.type === 'internal' || activeChannel.type === 'group') {
        const updatedChannels = baseChannels.map((c) =>
          c.id === activeChannel.id ? { ...c, isArchived: true } : c
        );
        setChannels(updatedChannels);
        triggerToast(`Archived ${activeChannel.type === 'group' ? 'direct message' : 'internal channel'} "${activeChannel.name}"!`);
        const nextChannel = updatedChannels.find((c) => c.type === activeChannel.type && !c.isArchived) ||
                            updatedChannels.find((c) => !c.isArchived);
        if (nextChannel) {
          setActiveChannel(nextChannel);
        }
        return;
      }
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
      if (!archivedCase) {
        const archivedChan = baseChannels.find((c) => c.id === conversationId && (c.type === 'internal' || c.type === 'group'));
        if (archivedChan) {
          const updatedChannels = baseChannels.map((c) =>
            c.id === conversationId ? { ...c, isArchived: false } : c
          );
          setChannels(updatedChannels);
          triggerToast(`Re-activated ${archivedChan.type === 'group' ? 'direct message' : 'internal channel'} "${archivedChan.name}"!`);
          setActiveChannel({ ...archivedChan, isArchived: false });
          setActiveTab('messages');
        }
        return;
      }

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

    onToggleParticipant: (id: string) => {
      setParticipants((prev) => {
        const next = prev.map((participant) =>
          participant.id === id ? { ...participant, selected: !participant.selected } : participant
        );

        setChannelParticipants((cp) => ({
          ...cp,
          [activeChannel.id]: next,
        }));

        const activeMembersCount = next.filter((m) => m.selected).length;

        setChannels((currentChannels) =>
          currentChannels.map((c) =>
            c.id === activeChannel.id ? { ...c, memberCount: activeMembersCount } : c
          )
        );

        setActiveChannel((currentActive) => {
          if (currentActive && currentActive.id === activeChannel.id) {
            return { ...currentActive, memberCount: activeMembersCount };
          }
          return currentActive;
        });

        return next;
      });
    },
    onToggleGroupParticipant: (id: string) => {
      setGroupParticipants((prev) => {
        const next = prev.map((participant) =>
          participant.id === id ? { ...participant, selected: !participant.selected } : participant
        );

        if (!isGroupNameManuallyEdited) {
          const selected = next.filter((p) => p.selected);
          const getFirstName = (fullName: string) => {
            const clean = fullName.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, '').trim();
            return clean.split(' ')[0];
          };
          const autoName = selected.map((p) => getFirstName(p.name)).join(', ');
          setGroupChatName(autoName);
        }

        return next;
      });
      setGroupChatError(null);
    },
    onToggleGroupPractice: (participantIds: string[], shouldSelect: boolean) => {
      setGroupParticipants((prev) => {
        const next = prev.map((participant) =>
          participantIds.includes(participant.id)
            ? { ...participant, selected: shouldSelect }
            : participant
        );

        if (!isGroupNameManuallyEdited) {
          const selected = next.filter((p) => p.selected);
          const getFirstName = (fullName: string) => {
            const clean = fullName.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, '').trim();
            return clean.split(' ')[0];
          };
          const autoName = selected.map((p) => getFirstName(p.name)).join(', ');
          setGroupChatName(autoName);
        }

        return next;
      });
      setGroupChatError(null);
    },
    showCreateSubChannelModal,
    subChannelName,
    subChannelParentPractice,
    subChannelError,
    setSubChannelName,
    handleCreateSubChannel,
    handleOpenCreateSubChannel,
    handleCancelCreateSubChannel,
    replyingToMessage,
    setReplyingToMessage,
    pinnedMessages,
    handleReplyMessage,
    handleForwardMessage,
    handlePinMessage,
    handleCopyMessage,
    handleDeleteMessage,
    messageToForward,
    setMessageToForward,
    isForwardMessageModalOpen,
    setIsForwardMessageModalOpen,
  };
}
