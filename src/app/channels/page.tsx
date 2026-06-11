"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from "@/components/MainLayout";
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { useSubscription } from '@/components/SubscriptionContext';
import { AttachedDocumentPreview, ChannelAttachmentDrawer } from '@/components/prototype/ChannelAttachmentControls';
import { ChannelDocumentsPane } from '@/components/prototype/ChannelDocumentsPane';
import { ChannelDocumentPreviewOverlay } from '@/components/prototype/ChannelDocumentPreviewOverlay';
import { ChannelItem, Message } from '@/components/prototype/ChannelPrimitives';
import {
  buildCaseChannels,
  filterCaseChannels,
  filterChannelsByType,
  filterPracticeChannels,
  splitPracticeChannels,
} from '@/prototype/channelModel';
import {
  initialDocuments,
  initialMessages,
  mockAttachments,
  mockChannels,
  mockGroupParticipants,
  type GroupParticipant,
} from '@/prototype/channelFixtures';
import type { Channel, ChannelType, MessageItem, SharedDocument } from '@/prototype/channelTypes';
import {
  Search, Hash, Lock, Users, Send,
  Paperclip, Smile, MoreHorizontal,
  Mail,
  FileText, X, Plus, Upload,
  ChevronDown, ChevronRight, ArrowLeft
} from 'lucide-react';
import { getReferrals, updateReferralStatus, UnifiedReferral, initialReferrals, getReferralCode, getChannels, saveChannels, getNetwork, getMessages, saveMessages } from '@/lib/referrals';
import { dentistPractices, specialistClinics } from '@/prototype/channelFixtures';

// Helper function defined outside the React component to satisfy the React Compiler's strict purity/immutability checks.
function getRandomId(prefix: string): string {
  return prefix + Math.random().toString(36).substring(2, 9);
}

function ChannelsContent() {
  const pathname = usePathname();
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

  const filteredOnPlatformChannels = React.useMemo(
    () => splitPracticeChannels(filteredPracticeChannels).onPlatform,
    [filteredPracticeChannels]
  );

  const filteredExternalChannels = React.useMemo(
    () => splitPracticeChannels(filteredPracticeChannels).external,
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
  const [showDirectUploadModal, setShowDirectUploadModal] = useState(false);
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

  // Direct Upload State Form
  const [customDocName, setCustomDocName] = useState('');
  const [customDocType, setCustomDocType] = useState<'pdf' | 'image' | 'zip' | 'doc'>('pdf');
  const [customDocSize, setCustomDocSize] = useState('1.5 MB');
  const [attachedFiles, setAttachedFiles] = useState<SharedDocument[]>([]);
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedReferral, setSelectedReferral] = useState('');
  const [referralSearchQuery, setReferralSearchQuery] = useState('NONE / NEW REFERRAL');
  const [isReferralDropdownOpen, setIsReferralDropdownOpen] = useState(false);
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);
  const [practiceSearchQuery, setPracticeSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isPracticeDropdownOpen, setIsPracticeDropdownOpen] = useState(false);

  useEffect(() => {
    if (activeChannel) {
      setSelectedPractices([activeChannel.name]);
    }
  }, [activeChannel]);

  const handleSelectReferral = (refId: string) => {
    setSelectedReferral(refId);
    if (refId) {
      const ref = referrals.find(r => r.id === refId);
      if (ref) {
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

  const closeReferralDropdown = () => {
    setIsReferralDropdownOpen(false);
    if (selectedReferral) {
      const ref = referrals.find(r => r.id === selectedReferral);
      if (ref) {
        setReferralSearchQuery(`${getReferralCode(ref.id)} - ${ref.patientName}`);
      }
    } else {
      setReferralSearchQuery('NONE / NEW REFERRAL');
    }
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


  const channelReferrals = React.useMemo(() => {
    if (activeChannel.name.includes('Sunshine')) {
      return [{ id: 'D-1005', patientName: 'Sarah Jenkins', type: 'Endodontic' }];
    } else if (activeChannel.name.includes('Downtown')) {
      return [{ id: 'D-1002', patientName: 'Marco Reyes', type: 'Extraction' }];
    } else if (activeChannel.name.includes('Valley')) {
      return [{ id: '1', patientName: 'Alice Cooper', type: 'Endodontic' }];
    } else if (activeChannel.name.includes('Metro')) {
      return [{ id: 'D-1003', patientName: 'John Doe', type: 'Orthodontic' }];
    }
  }, [activeChannel.name]);

  const filteredReferralsList = React.useMemo(() => {
    if (!referralSearchQuery || referralSearchQuery === 'NONE / NEW REFERRAL') {
      return channelReferrals || [];
    }
    const query = referralSearchQuery.toLowerCase().trim();
    return (channelReferrals || []).filter(r => {
      const code = getReferralCode(r.id).toLowerCase();
      const name = r.patientName.toLowerCase();
      return code.includes(query) || name.includes(query);
    });
  }, [channelReferrals, referralSearchQuery]);

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
                name: `${getReferralCode(ref.id)}: ${ref.patientName.toUpperCase()}`,
                type: 'inter-practice',
                lastMessage: `Referral status: ${ref.status}`,
                memberCount: parentChannel.memberCount
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

  const updateLastAttachedFile = (updatedFields: Partial<SharedDocument>) => {
    setAttachedFiles(prev => {
      if (prev.length === 0) return prev;
      const copy = [...prev];
      copy[copy.length - 1] = {
        ...copy[copy.length - 1],
        ...updatedFields
      };
      return copy;
    });
  };

  const handleRealFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachedFiles: SharedDocument[] = [];
    const limit = Math.min(files.length, 10 - attachedFiles.length);

    for (let k = 0; k < limit; k++) {
      const file = files[k];
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      let type: 'pdf' | 'image' | 'zip' | 'doc' = 'doc';
      if (extension === 'pdf') type = 'pdf';
      else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) type = 'image';
      else if (['zip', 'rar', 'tar', 'gz'].includes(extension)) type = 'zip';

      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const formattedSize = parseFloat(sizeMB) > 0.1 ? `${sizeMB} MB` : `${(file.size / 1024).toFixed(0)} KB`;

      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      newAttachedFiles.push({
        id: 'temp_' + Math.random().toString(36).substring(2, 9),
        channelId: activeChannel.id,
        name: file.name,
        size: formattedSize,
        type: type,
        sentBy: 'Me',
        sentAt: 'Today, ' + timeString
      });
    }

    if (newAttachedFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...newAttachedFiles]);
      triggerToast(`Attached ${newAttachedFiles.length} file(s) successfully!`);
    }

    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newAttachedFiles: SharedDocument[] = [];
      const limit = Math.min(files.length, 10 - attachedFiles.length);

      for (let k = 0; k < limit; k++) {
        const file = files[k];
        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        let type: 'pdf' | 'image' | 'zip' | 'doc' = 'doc';
        if (extension === 'pdf') type = 'pdf';
        else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) type = 'image';
        else if (['zip', 'rar', 'tar', 'gz'].includes(extension)) type = 'zip';

        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        const formattedSize = parseFloat(sizeMB) > 0.1 ? `${sizeMB} MB` : `${(file.size / 1024).toFixed(0)} KB`;

        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        newAttachedFiles.push({
          id: 'temp_' + Math.random().toString(36).substring(2, 9),
          channelId: activeChannel.id,
          name: file.name,
          size: formattedSize,
          type: type,
          sentBy: 'Me',
          sentAt: 'Today, ' + timeString
        });
      }

      if (newAttachedFiles.length > 0) {
        setAttachedFiles(prev => [...prev, ...newAttachedFiles]);
        triggerToast(`Attached ${newAttachedFiles.length} file(s) successfully!`);
      }
    }
  };

  const handleDirectUpload = () => {
    if (isTrialEnded) {
      setShowPaywall(true);
      return;
    }
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let filesToShare: Omit<SharedDocument, 'id'>[] = [];
    if (attachedFiles.length > 0) {
      filesToShare = attachedFiles;
    } else if (customDocName.trim()) {
      const formattedName = customDocName.toLowerCase().endsWith(`.${customDocType}`)
        ? customDocName.toLowerCase()
        : `${customDocName.toLowerCase()}.${customDocType}`;
      filesToShare = [{
        channelId: activeChannel.id,
        name: formattedName,
        size: customDocSize || '1.5 MB',
        type: customDocType,
        sentBy: 'Me',
        sentAt: 'Today, ' + timeString
      }];
    }

    if (filesToShare.length === 0) return;

    if (selectedPractices.length === 0) {
      triggerToast("Please select at least one recipient.");
      return;
    }

    let allNewDocs: SharedDocument[] = [];
    let updatedMessagesMap = { ...messages };

    selectedPractices.forEach(pName => {
      let matchedChannel = channels.find(c => c.name.toLowerCase() === pName.toLowerCase());
      let pId = '';
      if (matchedChannel) {
        pId = matchedChannel.id;
      } else {
        pId = 'ext_ch_' + Math.random().toString(36).substring(2, 9);
        const newCh: Channel = {
          id: pId,
          name: pName,
          type: 'inter-practice' as const,
          lastMessage: '',
          memberCount: 2,
          isVerified: false,
          isExternal: true
        };
        setChannels(prev => [...prev, newCh]);
        matchedChannel = newCh;
      }

      const finalDocs: SharedDocument[] = filesToShare.map(file => ({
        id: 'd_' + Math.random().toString(36).substring(2, 9),
        channelId: pId,
        name: file.name,
        size: file.size,
        type: file.type,
        sentBy: 'Me',
        sentAt: 'Today, ' + timeString
      }));

      allNewDocs.push(...finalDocs);

      const channelMessages: MessageItem[] = finalDocs.map((newDoc, index) => {
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
          transport: matchedChannel?.isExternal ? 'Email' as const : 'App' as const,
          document: newDoc
        };
      });

      updatedMessagesMap[pId] = [...(updatedMessagesMap[pId] || []), ...channelMessages];

      setChannels(prev => prev.map(c => {
        if (c.id === pId) {
          return {
            ...c,
            lastMessage: `Shared ${finalDocs.length} document${finalDocs.length > 1 ? 's' : ''}: ${finalDocs[0].name}`
          };
        }
        return c;
      }));
    });

    setDocuments(prev => [...prev, ...allNewDocs]);
    setMessages(updatedMessagesMap);

    if (activeChannel.id.startsWith('case_')) {
      const refId = activeChannel.id.replace('case_', '');
      const ref = referrals.find(r => r.id === refId);
      if (ref && ref.status === 'Archived') {
        const updatedRefs = updateReferralStatus(refId, 'Scheduled');
        setReferrals(updatedRefs);
      }
    }

    setAttachedFiles([]);
    setCustomDocName('');
    setPatientFirstName('');
    setPatientLastName('');
    setPatientDob('');
    setUploadMessage('');
    setSelectedReferral('');
    setSelectedPractices([activeChannel.name]);
    setShowDirectUploadModal(false);
    triggerToast(`Shared ${allNewDocs.length} document(s) successfully!`);
  };

  const handleDownloadDocument = (name: string) => {
    triggerToast(`Downloading "${name}"...`);
  };

  const filteredDocuments = React.useMemo(() => {
    return documents
      .filter(d => d.channelId === activeChannel.id)
      .filter(d => d.name.toLowerCase().includes(docSearchQuery.toLowerCase()));
  }, [documents, activeChannel.id, docSearchQuery]);

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

        {/* Channels List Sidebar */}
        <div className={`${showChannelList ? 'fixed inset-0 z-50' : 'hidden'} lg:relative lg:flex lg:w-80 border-r-2 border-black flex-col bg-white overflow-hidden`}>
          {showChannelList && (
            <button
              onClick={() => setShowChannelList(false)}
              className="absolute right-4 top-4 p-2 lg:hidden z-10"
            >
              <MoreHorizontal size={24} className="rotate-90" />
            </button>
          )}
          <div className="p-4 border-b-2 border-black space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold uppercase tracking-tighter italic">Communication</h2>
              <CommentMarker id="channels-list" title="Channels Page" description="The list of communication channels." />
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="SEARCH CONVERSATIONS..."
                value={sidebarSearchQuery}
                onChange={(e) => setSidebarSearchQuery(e.target.value)}
                className="wireframe-input pl-10 py-1.5 text-[10px] w-full"
              />
              {sidebarSearchQuery && (
                <button
                  onClick={() => setSidebarSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Internal */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setInternalCollapsed(!internalCollapsed)}
                  className="flex items-center gap-1 hover:text-black text-muted-foreground transition-colors text-left"
                >
                  {internalCollapsed ? (
                    <ChevronRight size={10} className="shrink-0" />
                  ) : (
                    <ChevronDown size={10} className="shrink-0" />
                  )}
                  <span className="text-[8px] font-black uppercase tracking-widest">Internal Communication</span>
                  {internalCollapsed && internalUnreadCount > 0 && (
                    <span className="bg-black text-white text-[7px] font-black px-1.5 rounded-full ml-1 shrink-0">
                      {internalUnreadCount}
                    </span>
                  )}
                </button>
                <button className="text-[8px] font-black uppercase underline hover:text-black">Create +</button>
              </div>
              {!internalCollapsed && (
                <div className="space-y-1">
                  {filteredInternalChannels.map(c => (
                    <ChannelItem
                      key={c.id}
                      channel={c}
                      isActive={activeChannel.id === c.id}
                      onClick={() => handleSelectChannel(c)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* On-platform Inter-practice */}
            <div className="p-4 border-t border-black border-dashed space-y-3">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setConnectedCollapsed(!connectedCollapsed)}
                  className="flex items-center gap-1 hover:text-black text-muted-foreground transition-colors text-left"
                >
                  {connectedCollapsed ? (
                    <ChevronRight size={10} className="shrink-0" />
                  ) : (
                    <ChevronDown size={10} className="shrink-0" />
                  )}
                  <span className="text-[8px] font-black uppercase tracking-widest">Connected Practices</span>
                  {connectedCollapsed && connectedUnreadCount > 0 && (
                    <span className="bg-black text-white text-[7px] font-black px-1.5 rounded-full ml-1 shrink-0">
                      {connectedUnreadCount}
                    </span>
                  )}
                </button>
                <Link 
                  href={`${isDentist ? '/dentist' : ''}/network?tab=directory`}
                  className="text-[8px] font-black uppercase underline hover:text-black"
                >
                  Connect
                </Link>
              </div>
              {!connectedCollapsed && (
                <div className="space-y-1">
                  {filteredOnPlatformChannels.length === 0 ? (
                    <p className="text-[8px] text-muted-foreground italic uppercase">No on-platform connections yet.</p>
                  ) : (
                    filteredOnPlatformChannels.map(c => {
                      const practiceCases = filteredCaseChannels.filter(cc => cc.practiceId === c.id && !cc.isArchived);
                      return (
                        <div key={c.id} className="space-y-0.5">
                          <ChannelItem
                            channel={c}
                            isActive={activeChannel.id === c.id}
                            onClick={() => handleSelectChannel(c)}
                            isExpanded={!!expandedPractices[c.id]}
                            hasSubChannels={practiceCases.length > 0}
                          />
                          {expandedPractices[c.id] && practiceCases.map(cc => {
                            const isCaseActive = activeChannel.id === cc.id;
                            return (
                              <button
                                key={cc.id}
                                onClick={() => {
                                  const caseChannelObj: Channel = {
                                    id: cc.id,
                                    name: cc.name,
                                    type: 'inter-practice',
                                    lastMessage: cc.lastMessage,
                                    memberCount: c.memberCount
                                  };
                                  handleSelectChannel(caseChannelObj);
                                }}
                                className={`w-full flex items-center gap-2 py-1.5 pl-10 text-left transition-all ${
                                  isCaseActive 
                                    ? 'bg-black text-white font-black' 
                                    : 'hover:bg-gray-100 text-muted-foreground hover:text-black font-bold'
                                }`}
                              >
                                <span className={isCaseActive ? "text-white font-black text-[11px]" : "text-black font-black text-[11px]"}>#</span>
                                <span className="text-[10px] uppercase tracking-tight">{cc.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* External — Secure Email */}
            <div className="p-4 border-t border-black border-dashed space-y-3">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setExternalCollapsed(!externalCollapsed)}
                  className="flex items-center gap-1 hover:text-black text-muted-foreground transition-colors text-left"
                >
                  {externalCollapsed ? (
                    <ChevronRight size={10} className="shrink-0" />
                  ) : (
                    <ChevronDown size={10} className="shrink-0" />
                  )}
                  <span className="text-[8px] font-black uppercase tracking-widest">External — Secure Email</span>
                  {externalCollapsed && externalUnreadCount > 0 && (
                    <span className="bg-black text-white text-[7px] font-black px-1.5 rounded-full ml-1 shrink-0">
                      {externalUnreadCount}
                    </span>
                  )}
                </button>
              </div>
              {!externalCollapsed && (
                <div className="space-y-1">
                  {filteredExternalChannels.length === 0 ? (
                    <p className="text-[8px] text-muted-foreground italic uppercase">No external connections yet.</p>
                  ) : (
                    filteredExternalChannels.map(c => (
                      <ChannelItem
                        key={c.id}
                        channel={c}
                        isActive={activeChannel.id === c.id}
                        onClick={() => handleSelectChannel(c)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Group Chats */}
            <div className="p-4 border-t border-black border-dashed space-y-3">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setGroupCollapsed(!groupCollapsed)}
                  className="flex items-center gap-1 hover:text-black text-muted-foreground transition-colors text-left"
                >
                  {groupCollapsed ? (
                    <ChevronRight size={10} className="shrink-0" />
                  ) : (
                    <ChevronDown size={10} className="shrink-0" />
                  )}
                  <span className="text-[8px] font-black uppercase tracking-widest">Group Chats</span>
                  {groupCollapsed && groupUnreadCount > 0 && (
                    <span className="bg-black text-white text-[7px] font-black px-1.5 rounded-full ml-1 shrink-0">
                      {groupUnreadCount}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setShowCreateGroupModal(true)}
                  className="text-[8px] font-black uppercase underline hover:text-black"
                >
                  Create +
                </button>
              </div>
              {!groupCollapsed && (
                <div className="space-y-1">
                  {filteredGroupChannels.length === 0 ? (
                    <p className="text-[8px] text-muted-foreground italic uppercase">No group chats yet.</p>
                  ) : (
                    filteredGroupChannels.map(c => (
                      <ChannelItem
                        key={c.id}
                        channel={c}
                        isActive={activeChannel.id === c.id}
                        onClick={() => handleSelectChannel(c)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Patient */}
            <div className="p-4 border-t border-black border-dashed space-y-3">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setPatientCollapsed(!patientCollapsed)}
                  className="flex items-center gap-1 hover:text-black text-muted-foreground transition-colors text-left"
                >
                  {patientCollapsed ? (
                    <ChevronRight size={10} className="shrink-0" />
                  ) : (
                    <ChevronDown size={10} className="shrink-0" />
                  )}
                  <span className="text-[8px] font-black uppercase tracking-widest">Patient Comm (SMS/Email)</span>
                  {patientCollapsed && patientUnreadCount > 0 && (
                    <span className="bg-black text-white text-[7px] font-black px-1.5 rounded-full ml-1 shrink-0">
                      {patientUnreadCount}
                    </span>
                  )}
                </button>
              </div>

              {!patientCollapsed && (
                <>
                  {/* Tip for Patient Channels */}
                  <div className="p-3 bg-gray-50 border border-black border-dashed">
                    <p className="text-[7px] font-bold uppercase leading-relaxed text-muted-foreground italic">
                      Tip: Patient channels are automatically created once you process a referral and initiate external communication.
                    </p>
                  </div>

                  <div className="space-y-1">
                    {filteredPatientChannels.map(c => (
                      <ChannelItem
                        key={c.id}
                        channel={c}
                        isActive={activeChannel.id === c.id}
                        onClick={() => handleSelectChannel(c)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-gray-50 relative">
          {/* Chat Header */}
          <div className="h-16 bg-white border-b-2 border-black flex items-center justify-between px-4 sm:px-6 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChannelList(true)}
                className="p-2 -ml-2 lg:hidden hover:bg-gray-100 transition-colors"
              >
                <Hash size={20} />
              </button>
              {activeChannel.id.startsWith('case_') && (
                <button
                  onClick={() => {
                    const parentId = caseChannels.find(cc => cc.id === activeChannel.id)?.practiceId || '3';
                    const parentChan = channels.find(c => c.id === parentId) || channels[0];
                    setActiveChannel(parentChan);
                  }}
                  className="mr-1 p-1 hover:bg-gray-100 border border-black/20 text-black"
                  title="Back to practice dashboard"
                >
                  <ArrowLeft size={14} />
                </button>
              )}
              <div className="w-8 h-8 border-2 border-black flex items-center justify-center shrink-0 text-black">
                {activeChannel.type === 'internal' ? <Hash size={16} /> : <Users size={16} />}
              </div>
              <div className="min-w-0">
                <h3 className="font-black uppercase text-xs truncate text-black">
                  {activeChannel.id.startsWith('case_') ? activeChannel.name : ((activeChannel.id === '3' && !isDentist) ? 'Sunshine Dental' : activeChannel.name)}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                  <span className="text-[8px] text-muted-foreground uppercase font-black">
                    {activeChannel.id.startsWith('case_') ? 'Case Sub-Channel' : `${activeChannel.memberCount} Members`}
                  </span>
                  {activeChannel.isExternal && (
                    <span className="text-[7px] font-black uppercase px-1.5 py-0.5 border border-black bg-gray-100 whitespace-nowrap">
                      External &bull; Secure Email
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-black">
              {activeChannel.id.startsWith('case_') && (
                <button
                  onClick={() => {
                    const refId = activeChannel.id.replace('case_', '');
                    const updated = updateReferralStatus(refId, 'Archived');
                    setReferrals(updated);
                    triggerToast(`Archived channel for ${activeChannel.name}!`);
                    const parentId = caseChannels.find(cc => cc.id === activeChannel.id)?.practiceId || '3';
                    const parentChan = channels.find(c => c.id === parentId) || channels[0];
                    setActiveChannel(parentChan);
                  }}
                  className="wireframe-button border-2 border-black px-3 py-1.5 hover:bg-black hover:text-white transition-all text-[9px] uppercase font-black bg-white text-black"
                >
                  Archive Channel
                </button>
              )}
              <button onClick={() => setShowParticipantsModal(true)} className="hidden sm:block text-[10px] font-bold uppercase underline">Participants</button>
              <button className="p-1 hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-all">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Connected Practice Tab Switcher */}
          {activeChannel.type === 'inter-practice' && (
            <div className="h-10 bg-white border-b-2 border-black flex px-6 shrink-0 gap-4">
              <button
                onClick={() => setActiveTab('messages')}
                className={`text-[9px] font-black uppercase tracking-wider px-4 border-b-4 transition-all ${activeTab === 'messages'
                  ? 'border-black text-black font-black'
                  : 'border-transparent text-muted-foreground hover:text-black'
                  }`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`text-[9px] font-black uppercase tracking-wider px-4 border-b-4 transition-all ${activeTab === 'documents'
                  ? 'border-black text-black font-black'
                  : 'border-transparent text-muted-foreground hover:text-black'
                  }`}
              >
                Documents
              </button>
              {!activeChannel.id.startsWith('case_') && (
                <button
                  onClick={() => setActiveTab('archived')}
                  className={`text-[9px] font-black uppercase tracking-wider px-4 border-b-4 transition-all ${activeTab === 'archived'
                    ? 'border-black text-black font-black'
                    : 'border-transparent text-muted-foreground hover:text-black'
                    }`}
                >
                  Archived Conversations
                </button>
              )}
            </div>
          )}

          {/* Messages Area / Documents Tab */}
          {activeTab === 'archived' && activeChannel.type === 'inter-practice' && !activeChannel.id.startsWith('case_') ? (
            <div className="flex-1 overflow-y-auto p-8 bg-zinc-50">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="wireframe-card p-6 bg-white border-2 border-black space-y-6">
                  <div className="border-b-2 border-black pb-3">
                    <h3 className="text-sm font-black uppercase tracking-widest italic text-black">Archived Conversations</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Re-activate any per-case channel to resume communication</p>
                  </div>
                  
                  {caseChannels.filter(cc => cc.practiceId === activeChannel.id && cc.isArchived).length === 0 ? (
                    <div className="p-8 border-2 border-black border-dashed text-center text-muted-foreground uppercase text-[10px] font-bold">
                      No archived conversations for this practice.
                    </div>
                  ) : (
                    <div className="divide-y divide-black/10">
                      {caseChannels.filter(cc => cc.practiceId === activeChannel.id && cc.isArchived).map(cc => (
                        <div key={cc.id} className="py-4 flex items-center justify-between text-black">
                          <div>
                            <p className="font-bold text-xs uppercase text-black">{cc.name}</p>
                            <p className="text-[8px] text-muted-foreground uppercase font-bold mt-0.5">Case ID: {cc.id.replace('case_', '')}</p>
                          </div>
                          <button
                            onClick={() => {
                              const refId = cc.id.replace('case_', '');
                              const updated = updateReferralStatus(refId, 'Scheduled');
                              setReferrals(updated);
                              triggerToast(`Re-activated channel for ${cc.patientName}!`);
                              const caseChannelObj: Channel = {
                                  id: cc.id,
                                  name: cc.name,
                                  type: 'inter-practice',
                                  lastMessage: cc.lastMessage,
                                  memberCount: activeChannel.memberCount
                              };
                              setActiveChannel(caseChannelObj);
                              setActiveTab('messages');
                            }}
                            className="wireframe-button text-[9px] font-black uppercase px-4 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-all"
                          >
                            Re-activate
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Existing Chat/Document Views
            <>
              {activeTab === 'messages' ? (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="max-w-4xl mx-auto w-full space-y-6">
                      {(messages[activeChannel.id] || []).map((msg) => {
                        const mapped = getMessageRoleAndUser(msg);
                        return (
                          <Message
                            key={msg.id}
                            user={mapped.user}
                            text={msg.text}
                            time={msg.time}
                            type={mapped.type}
                            transport={msg.transport}
                            document={msg.document ? {
                              ...msg.document,
                              sentBy: getDocSender(msg.document.sentBy)
                            } : undefined}
                          />
                        );
                      })}
                      {activeChannel.isVerified === false && (
                        <div className="flex justify-center p-4">
                          <div className="bg-gray-100 border border-black border-dashed p-4 max-w-sm text-center">
                            <p className="text-[10px] font-bold uppercase italic text-muted-foreground">
                              Note: This practice is unverified. Patient PHI sharing is restricted until the practice owner completes verification.
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-center">
                        <span className="text-[8px] font-bold uppercase bg-gray-200 px-3 py-1 text-muted-foreground">End of history</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 sm:p-6 bg-white border-t-2 border-black relative shrink-0">
                    <div className="max-w-4xl mx-auto w-full relative">
                      {/* Custom Attachment Picker Drawer */}
                      {showAttachmentDrawer && (
                        <ChannelAttachmentDrawer
                          attachments={mockAttachments}
                          onAttachNew={() => {
                            setShowDirectUploadModal(true);
                            setShowAttachmentDrawer(false);
                          }}
                          onAttachRecent={(file) => {
                            setAttachedDoc({ name: file.name, size: file.size, type: file.type });
                            setShowAttachmentDrawer(false);
                            triggerToast(`Attached ${file.name}!`);
                          }}
                          onClose={() => setShowAttachmentDrawer(false)}
                        />
                      )}

                      <div className="wireframe-card p-4 space-y-4">
                        {activeChannel.isExternal && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/10 border border-black/30 text-black text-[9px] font-black uppercase">
                            <Mail size={12} className="text-black shrink-0" />
                            <span>Counterpart is not on drTalk. Messages and files will be delivered via Secure Email.</span>
                          </div>
                        )}
                        {/* Document Attachment Preview */}
                        {attachedDoc && (
                          <AttachedDocumentPreview
                            document={attachedDoc}
                            onRemove={() => setAttachedDoc(null)}
                          />
                        )}

                        <textarea
                          placeholder={`MESSAGE #${activeChannel.name}...`}
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="w-full bg-transparent border-none focus:ring-0 text-xs resize-none h-12 outline-none text-black"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-black border-dashed">
                          <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                            <button
                              onClick={() => setShowAttachmentDrawer(!showAttachmentDrawer)}
                              className={`hover:text-black transition-colors p-1 ${showAttachmentDrawer ? 'bg-black text-white' : ''}`}
                              title="Attach Document"
                            >
                              <Paperclip size={18} />
                            </button>
                            <button className="hover:text-black transition-colors"><Smile size={18} /></button>

                            {activeChannel.type === 'patient' ? (
                              <>
                                <div className="h-4 w-[1px] bg-black/20 mx-1" />
                                <div className="flex items-center gap-3">
                                  <span className="text-[8px] font-black uppercase text-black">Delivery Method:</span>
                                  <div className="flex gap-4">
                                    <label className="flex items-center gap-1.5 cursor-pointer group">
                                      <input type="radio" name="transport" defaultChecked className="hidden peer" />
                                      <div className="w-3 h-3 border border-black flex items-center justify-center peer-checked:bg-black transition-all">
                                        <div className="w-1 h-1 bg-white" />
                                      </div>
                                      <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 peer-checked:opacity-100">
                                        <span className="text-[8px] font-black uppercase">Both (Email + SMS)</span>
                                      </div>
                                    </label>
                                    <label className="flex items-center gap-1.5 cursor-pointer group">
                                      <input type="radio" name="transport" className="hidden peer" />
                                      <div className="w-3 h-3 border border-black flex items-center justify-center peer-checked:bg-black transition-all">
                                        <div className="w-1 h-1 bg-white" />
                                      </div>
                                      <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 peer-checked:opacity-100">
                                        <span className="text-[8px] font-black uppercase">SMS</span>
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              </>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleSendMessage}
                              disabled={!inputText.trim() && !attachedDoc}
                              className="wireframe-button bg-black text-white text-[10px] uppercase font-bold px-6 py-2.5 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white hover:bg-white hover:text-black transition-colors"
                            >
                              Send Message <Send size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Documents Tab
                <ChannelDocumentsPane
                  documents={filteredDocuments}
                  searchQuery={docSearchQuery}
                  onSearchQueryChange={setDocSearchQuery}
                  onClearSearch={() => setDocSearchQuery('')}
                  onSendNewDocument={() => setShowDirectUploadModal(true)}
                  onViewDocument={setPreviewDocument}
                  onDownloadDocument={(document) => handleDownloadDocument(document.name)}
                  formatSender={getDocSender}
                />
              )}
            </>
          )}      
        </div>
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-black">
          <div className="bg-white border-4 border-black p-8 max-w-lg w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-slide-in">
            <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
                <Users size={16} /> Create Group Chat
              </h3>
              <button 
                onClick={() => {
                  setShowCreateGroupModal(false);
                  setGroupChatName('');
                  setGroupParticipants(mockGroupParticipants);
                  setGroupChatError(null);
                }} 
                className="hover:text-black text-black"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1 mb-4">
              <label className="text-[8px] font-black uppercase tracking-wider text-muted-foreground">Group Chat Name</label>
              <input
                type="text"
                placeholder="ENTER GROUP CHAT NAME..."
                value={groupChatName}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                  setGroupChatError(null);
                }}
                className="wireframe-input w-full p-2 border-2 border-black text-[10px] text-black"
              />
            </div>

            <label className="text-[8px] font-black uppercase tracking-wider text-muted-foreground block mb-2">Select Participants</label>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-6 pr-2">
              {Object.entries(
                groupParticipants.reduce((acc, p) => {
                  if (!acc[p.practice]) acc[p.practice] = [];
                  acc[p.practice].push(p);
                  return acc;
                }, {} as Record<string, typeof groupParticipants>)
              ).map(([practiceName, members]) => (
                <div key={practiceName} className="space-y-1.5">
                  <div className="flex justify-between items-end border-b border-black border-dashed pb-1">
                    <h4 className="text-[8px] font-black uppercase text-muted-foreground tracking-wider">
                      {practiceName}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const practiceMembers = members.map(m => m.id);
                        const allGroupSelected = members.every(m => m.selected);
                        setGroupParticipants(prev =>
                          prev.map(p =>
                            practiceMembers.includes(p.id)
                              ? { ...p, selected: !allGroupSelected }
                              : p
                          )
                        );
                        setGroupChatError(null);
                      }}
                      className="flex items-center gap-1.5 text-[8px] font-black uppercase text-muted-foreground hover:text-black transition-colors"
                    >
                      <div className={`w-3.5 h-3.5 border border-black flex items-center justify-center shrink-0 ${members.every(m => m.selected) ? 'bg-black' : 'bg-white'}`}>
                        {members.every(m => m.selected) && <div className="w-1.5 h-1.5 bg-white" />}
                      </div>
                      <span>Select All</span>
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {members.map(p => (
                      <label key={p.id} className="flex items-center justify-between p-2 border border-black hover:bg-gray-50 cursor-pointer transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className={`w-3.5 h-3.5 border border-black flex items-center justify-center ${p.selected ? 'bg-black' : 'bg-white'}`}>
                            {p.selected && <div className="w-1.5 h-1.5 bg-white" />}
                          </div>
                          <span className="text-[9px] font-bold uppercase text-black">{p.name}</span>
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={p.selected}
                          onChange={() => toggleGroupParticipant(p.id)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {groupChatError && (
              <div className="mb-4 bg-black text-white border-2 border-black p-3 text-center animate-fade-in shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-[9px] font-black uppercase tracking-widest">{groupChatError}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t-2 border-black">
              <button
                onClick={() => {
                  setShowCreateGroupModal(false);
                  setGroupChatName('');
                  setGroupParticipants(mockGroupParticipants);
                  setGroupChatError(null);
                }}
                className="wireframe-button border-black hover:bg-black hover:text-white text-[10px] uppercase py-2 px-4 font-black transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroupChat}
                className="wireframe-button bg-black text-white border-black text-[10px] uppercase py-2 px-6 font-black hover:bg-white hover:text-black transition-all"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participants Management Modal */}
      {showParticipantsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-black">
          <div className="bg-white border-4 border-black p-6 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-in">
            <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2">
                <Users size={16} /> Manage Participants
              </h3>
              <button onClick={() => setShowParticipantsModal(false)} className="hover:text-black text-black">
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-2 max-h-[60vh] overflow-y-auto mb-6">
              {participants.map(p => (
                <label key={p.id} className="flex items-center justify-between p-2 border-2 border-black hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 border-2 border-black flex items-center justify-center ${p.selected ? 'bg-black' : 'bg-white'}`}>
                      {p.selected && <div className="w-2 h-2 bg-white" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase">{p.name}</p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase">{p.role}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={p.selected}
                    onChange={() => toggleParticipant(p.id)}
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t-2 border-black">
              <button
                onClick={() => setShowParticipantsModal(false)}
                className="wireframe-button bg-black text-white border-black text-[10px] uppercase py-2 px-6 font-bold hover:bg-white hover:text-black transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
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
