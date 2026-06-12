"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from "@/components/MainLayout";
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { useSubscription } from '@/components/SubscriptionContext';
import {
  Search, Hash, Lock, Users, Send,
  Paperclip, Smile, MoreHorizontal,
  Smartphone, Mail, AppWindow,
  FileText, ImageIcon, X, Eye, Download, Plus, Upload,
  ChevronDown, ChevronRight, ArrowLeft
} from 'lucide-react';
import { getReferrals, updateReferralStatus, UnifiedReferral, initialReferrals, getReferralCode, getChannels, saveChannels, getNetwork, getMessages, saveMessages } from '@/lib/referrals';
import { generateMockData, dentistPractices, specialistClinics } from '@/lib/mockGenerator';

export type ChannelType = 'internal' | 'inter-practice' | 'patient' | 'public' | 'group';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  lastMessage: string;
  unreadCount?: number;
  memberCount: number;
  isVerified?: boolean;
  isExternal?: boolean;
}

export interface SharedDocument {
  id: string;
  channelId: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'zip' | 'doc';
  sentBy: string;
  sentAt: string;
}

export interface MessageItem {
  id: string;
  user: string;
  text: string;
  time: string;
  type: 'self' | 'other';
  transport?: 'App' | 'SMS' | 'Email';
  document?: SharedDocument;
}

const mockData = generateMockData();
export const initialDocuments: SharedDocument[] = mockData.documents;
export const initialMessages: Record<string, MessageItem[]> = mockData.messages;

export const mockChannels: Channel[] = [
  { id: '1', name: 'team-members', type: 'internal', lastMessage: 'Reviewing tooth #14...', unreadCount: 2, memberCount: 12 },
  { id: '2', name: 'admin-billing', type: 'internal', lastMessage: 'March report ready.', memberCount: 4 },
  ...specialistClinics.map(clinic => ({
    id: clinic.id,
    name: clinic.name,
    type: 'inter-practice' as const,
    lastMessage: clinic.name === 'Valley Endodontics' ? 'Pano image uploaded for Alice Cooper.' : 'Practice connection active.',
    memberCount: 2
  })),
  { id: '4', name: 'Alice Cooper', type: 'patient', lastMessage: 'Got it, thank you!', memberCount: 2 },
  { id: '5', name: 'general-updates', type: 'public', lastMessage: 'Welcome to the network!', memberCount: 124 },
];

const mockAttachments = [
  { name: 'pano_xray_post_op.png', size: '3.1 MB', type: 'image' as const },
  { name: 'referral_slip_signed.pdf', size: '1.2 MB', type: 'pdf' as const },
  { name: 'ct_scan_maxilla.zip', size: '18.4 MB', type: 'zip' as const },
  { name: 'clinical_notes_cooper.pdf', size: '840 KB', type: 'pdf' as const }
];

export interface GroupParticipant {
  id: string;
  name: string;
  practice: string;
  selected: boolean;
}

const mockGroupParticipants: GroupParticipant[] = [
  { id: 'gp1', name: 'Dr. John Smith', practice: 'Sunshine Dental (Me)', selected: false },
  { id: 'gp2', name: 'Jane Doe', practice: 'Sunshine Dental (Me)', selected: false },
  { id: 'gp3', name: 'Dr. Clara Valley', practice: 'Valley Endodontics', selected: false },
  { id: 'gp4', name: 'Robert Chen', practice: 'Valley Endodontics', selected: false },
  { id: 'gp5', name: 'Dr. Marcus Jones', practice: 'Downtown Oral Surgery', selected: false },
  { id: 'gp6', name: 'Linda Brooks', practice: 'Downtown Oral Surgery', selected: false },
  { id: 'gp7', name: 'Dr. Angela Metro', practice: 'Metro Orthodontics', selected: false },
  { id: 'gp8', name: 'Dr. David Bowie', practice: 'Arizona Periodontics', selected: false },
];

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
  const caseChannels = React.useMemo(() => {
    // Filter referrals based on user's role (Dentist vs Specialist)
    // Also ignore Draft referrals
    const filteredRefs = referrals.filter(ref => {
      const isDraft = ref.status === 'Draft';
      if (isDraft) return false;
      
      if (isDentist) {
        // Dentist side: show referrals sent by dentist
        return ref.id.startsWith('D-') || ref.id === '1';
      } else {
        // Specialist side: show referrals received by specialist
        return !ref.id.startsWith('D-');
      }
    });

    return filteredRefs.map(ref => {
      let practiceId = '3';
      if (isDentist) {
        const match = specialistClinics.find(c => c.name.toLowerCase() === (ref.specialist || '').toLowerCase());
        practiceId = match ? match.id : '3';
      } else {
        const match = dentistPractices.find(p => p.name.toLowerCase() === (ref.practice || '').toLowerCase());
        practiceId = match ? match.id : '6';
      }

      const code = getReferralCode(ref.id);
      return {
        id: `case_${ref.id}`,
        name: ref.patientName.toUpperCase(),
        patientName: ref.patientName,
        referralId: ref.id,
        practiceId,
        isArchived: ref.status === 'Archived',
        lastMessage: ref.status === 'Archived' ? 'Case archived.' : `Referral status: ${ref.status}`
      };
    });
  }, [referrals, isDentist]);

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

  const filteredInternalChannels = React.useMemo(() => {
    return channels
      .filter(c => c.type === 'internal')
      .filter(c => c.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()));
  }, [channels, sidebarSearchQuery]);

  const filteredPatientChannels = React.useMemo(() => {
    return channels
      .filter(c => c.type === 'patient')
      .filter(c => c.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()));
  }, [channels, sidebarSearchQuery]);

  const filteredGroupChannels = React.useMemo(() => {
    return channels
      .filter(c => c.type === 'group')
      .filter(c => c.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()));
  }, [channels, sidebarSearchQuery]);

  const filteredCaseChannels = React.useMemo(() => {
    return caseChannels.filter(cc => 
      cc.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
    );
  }, [caseChannels, sidebarSearchQuery]);

  const filteredPracticeChannels = React.useMemo(() => {
    return channels
      .filter(c => c.type === 'inter-practice')
      .filter(c => {
        const matchesPractice = c.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase());
        const hasMatchingCase = caseChannels.some(cc => 
          cc.practiceId === c.id && 
          !cc.isArchived && 
          cc.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
        );
        return matchesPractice || hasMatchingCase;
      });
  }, [channels, caseChannels, sidebarSearchQuery]);

  const filteredOnPlatformChannels = React.useMemo(
    () => filteredPracticeChannels.filter(c => !c.isExternal),
    [filteredPracticeChannels]
  );

  const filteredExternalChannels = React.useMemo(
    () => filteredPracticeChannels.filter(c => c.isExternal),
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
                name: ref.patientName.toUpperCase(),
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

  const [docPage, setDocPage] = useState(1);
  const DOCS_PER_PAGE = 6;

  useEffect(() => {
    setDocPage(1);
  }, [docSearchQuery, activeChannel.id]);

  const filteredDocuments = React.useMemo(() => {
    return documents
      .filter(d => d.channelId === activeChannel.id)
      .filter(d => d.name.toLowerCase().includes(docSearchQuery.toLowerCase()));
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
                                <FileText size={10} className={isCaseActive ? "text-white" : "text-black"} />
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
                {activeChannel.id.startsWith('case_') ? (
                  <FileText size={16} />
                ) : activeChannel.type === 'internal' ? (
                  <Hash size={16} />
                ) : (
                  <Users size={16} />
                )}
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
                        <div className="absolute bottom-24 left-4 right-4 sm:left-6 sm:right-auto bg-white border-2 border-black p-4 z-40 w-[280px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-in">
                          <div className="flex justify-between items-center pb-2 border-b border-black border-dashed mb-3">
                            <span className="text-[9px] font-black uppercase tracking-wider text-black">Select Document to Attach</span>
                            <button onClick={() => setShowAttachmentDrawer(false)} className="hover:text-black">
                              <X size={14} />
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {/* Attach New Document Button */}
                            <button
                              onClick={() => {
                                router.push(isDentist ? '/dentist/dashboard/send-document' : '/dashboard/send-document');
                                setShowAttachmentDrawer(false);
                              }}
                              className="w-full flex items-center gap-2 p-2 bg-black text-white hover:bg-white hover:text-black border border-black text-left transition-all font-black text-[9px] uppercase group/btn"
                            >
                              <div className="w-5 h-5 border border-white group-hover/btn:border-black flex items-center justify-center shrink-0">
                                <Plus size={12} />
                              </div>
                              <span>Attach New Document</span>
                            </button>

                            {/* Recent Documents Selection */}
                            <div className="pt-2 border-t border-black/10">
                              <p className="text-[7px] font-black uppercase text-muted-foreground mb-1.5 tracking-wider">Attach Recent scan/form</p>
                              <div className="space-y-1">
                                {mockAttachments.map((file, i) => (
                                  <button
                                    key={i}
                                    onClick={() => {
                                      setAttachedDoc({ name: file.name, size: file.size, type: file.type });
                                      setShowAttachmentDrawer(false);
                                      triggerToast(`Attached ${file.name}!`);
                                    }}
                                    className="w-full text-left p-1.5 hover:bg-zinc-100 border border-transparent hover:border-black/10 flex items-center gap-2 overflow-hidden transition-all text-black"
                                  >
                                    <FileText size={12} className="shrink-0 text-black/50" />
                                    <div className="truncate">
                                      <p className="text-[8px] font-bold uppercase truncate leading-tight">{file.name}</p>
                                      <p className="text-[7px] text-muted-foreground uppercase leading-none mt-0.5">{file.size} • {file.type.toUpperCase()}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
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
                          <div className="flex items-center justify-between p-2 mb-2 bg-gray-50 border-2 border-black animate-fade-in">
                            <div className="flex items-center gap-2 text-black">
                              <div className="w-6 h-6 border border-black flex items-center justify-center bg-black text-white shrink-0">
                                {attachedDoc.type === 'pdf' ? <FileText size={12} /> :
                                  attachedDoc.type === 'image' ? <ImageIcon size={12} /> :
                                    <Paperclip size={12} />}
                              </div>
                              <span className="text-[10px] font-bold uppercase">{attachedDoc.name} ({attachedDoc.size})</span>
                            </div>
                            <button
                              onClick={() => setAttachedDoc(null)}
                              className="p-1 hover:bg-black hover:text-white border border-black transition-colors text-black"
                            >
                              <X size={10} />
                            </button>
                          </div>
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
                <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 text-black">
                  <div className="p-4 border-b-2 border-black bg-white shrink-0">
                    <div className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black uppercase tracking-tighter italic text-black">Shared Documents</span>
                        <span className="text-[8px] font-bold uppercase px-2 py-0.5 bg-black text-white">
                          {filteredDocuments.length} Files
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative w-48 sm:w-64">
                          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="SEARCH DOCUMENTS..."
                            value={docSearchQuery}
                            onChange={(e) => setDocSearchQuery(e.target.value)}
                            className="wireframe-input pl-9 py-1.5 text-[9px] outline-none text-black font-bold uppercase"
                          />
                          {docSearchQuery && (
                            <button
                              onClick={() => setDocSearchQuery('')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-black text-gray-400"
                            >
                              <X size={10} />
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => router.push(isDentist ? '/dentist/dashboard/send-document' : '/dashboard/send-document')}
                          className="wireframe-button bg-black text-white text-[9px] uppercase px-4 py-1.5 flex items-center gap-1.5 font-black whitespace-nowrap hover:bg-white hover:text-black transition-all"
                        >
                          Send New Document <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Documents List */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="max-w-4xl mx-auto w-full space-y-4">
                      {filteredDocuments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 bg-white border-2 border-black border-dashed p-6 text-center">
                          <p className="text-[11px] font-bold uppercase text-muted-foreground italic mb-1">
                            {docSearchQuery ? 'No documents found matching your search' : 'No documents have been shared yet'}
                          </p>
                          <p className="text-[9px] text-muted-foreground uppercase">
                            {docSearchQuery ? 'Try checking your spelling or clearing the search query.' : 'Attach documents to messages or use the button above to upload.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {paginatedDocuments.map((doc) => (
                              <div
                                key={doc.id}
                                className="wireframe-card p-4 flex flex-col justify-between bg-white border-2 border-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-gray-50 shrink-0">
                                    {doc.type === 'pdf' ? <FileText size={20} className="text-black" /> :
                                      doc.type === 'image' ? <ImageIcon size={20} className="text-black" /> :
                                        <Paperclip size={20} className="text-black" />}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-[11px] font-black uppercase tracking-tight truncate text-black" title={doc.name}>
                                      {doc.name}
                                    </h4>
                                    <p className="text-[8px] uppercase font-bold text-muted-foreground mt-0.5">
                                      {doc.size} • {doc.type.toUpperCase()} File
                                    </p>
                                    <div className="mt-2 text-[8px] font-medium uppercase tracking-tight text-gray-500">
                                      Shared by <span className="font-bold text-black">{getDocSender(doc.sentBy)}</span> • {doc.sentAt}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-black border-dashed">
                                  <button
                                    onClick={() => setPreviewDocument(doc)}
                                    className="flex-1 wireframe-button bg-white text-black border-black text-[9px] uppercase py-1 flex items-center justify-center gap-1 hover:bg-black hover:text-white font-bold"
                                  >
                                    <Eye size={10} /> View
                                  </button>
                                  <button
                                    onClick={() => handleDownloadDocument(doc.name)}
                                    className="flex-1 wireframe-button bg-black text-white border-black text-[9px] uppercase py-1 flex items-center justify-center gap-1 hover:bg-white hover:text-black font-bold"
                                  >
                                    <Download size={10} /> Download
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                           {/* Pagination Controls */}
                           {totalDocPages > 1 && (
                             <div className="flex items-center justify-between border-2 border-black bg-white p-4">
                               <button
                                 disabled={docPage === 1}
                                 onClick={() => setDocPage(prev => Math.max(1, prev - 1))}
                                 className="wireframe-button px-4 py-2 text-[10px] uppercase font-black tracking-widest border-2 disabled:border-gray-300 disabled:text-gray-300 disabled:pointer-events-none border-black text-black hover:bg-black hover:text-white transition-colors bg-white"
                               >
                                 Previous Page
                               </button>
                               
                               <span className="text-[10px] font-black uppercase tracking-widest text-black">
                                 Page {docPage} of {totalDocPages}
                               </span>

                               <button
                                 disabled={docPage === totalDocPages}
                                 onClick={() => setDocPage(prev => Math.min(totalDocPages, prev + 1))}
                                 className="wireframe-button px-4 py-2 text-[10px] uppercase font-black tracking-widest border-2 disabled:border-gray-300 disabled:text-gray-300 disabled:pointer-events-none border-black text-black hover:bg-black hover:text-white transition-colors bg-white"
                               >
                                 Next Page
                               </button>
                             </div>
                           )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}      
        </div>
      </div>

      {/* Document View Preview Overlay */}
      {previewDocument && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-4 border-black p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col animate-slide-in">
            <div className="flex justify-between items-center pb-3 border-b-2 border-black mb-4">
              <div>
                <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-black text-white font-bold">Document Viewer</span>
                <h3 className="text-sm font-black uppercase tracking-tight mt-1 text-black">{previewDocument.name}</h3>
              </div>
              <button
                onClick={() => setPreviewDocument(null)}
                className="wireframe-button px-2.5 py-1 text-[9px] font-bold uppercase bg-white text-black border-black hover:bg-black hover:text-white"
              >
                Close View
              </button>
            </div>

            {/* Document Body preview */}
            <div className="flex-1 border-2 border-black bg-gray-50 p-4 flex items-center justify-center overflow-auto min-h-[300px]">
              {previewDocument.type === 'image' ? (
                /* Interactive Dental X-ray SVG */
                <div className="w-full max-w-md bg-black p-4 border-2 border-white flex flex-col items-center">
                  <div className="w-full flex justify-between text-[7px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-800 pb-1">
                    <span>PATIENT: ALICE COOPER</span>
                    <span>ID: DRT-9842</span>
                    <span>PANO X-RAY</span>
                  </div>

                  {/* SVG Pano drawing */}
                  <svg viewBox="0 0 400 200" className="w-full h-auto text-white">
                    {/* Jaw curve */}
                    <path d="M 40 160 Q 200 200 360 160" fill="none" stroke="#333" strokeWidth="6" strokeDasharray="5,5" />

                    {/* Upper teeth */}
                    <g transform="translate(0, 40)" fill="none" stroke="#eee" strokeWidth="2">
                      <path d="M 50 40 Q 60 5 70 40" />
                      <path d="M 75 40 Q 85 5 95 40" />
                      <path d="M 100 40 Q 110 5 120 40" />
                      <path d="M 125 40 Q 135 5 145 40" />
                      {/* Tooth 14 with pathology highlight */}
                      <g className="animate-pulse">
                        <path d="M 150 40 Q 160 5 170 40" stroke="#ff3333" strokeWidth="3" />
                        <circle cx="160" cy="15" r="8" fill="rgba(255, 0, 0, 0.2)" stroke="#ff3333" strokeWidth="1" />
                        <line x1="160" y1="15" x2="200" y2="-10" stroke="#ff3333" strokeWidth="1" strokeDasharray="2,2" />
                        <text x="205" y="-6" fill="#ff3333" fontSize="8" fontFamily="monospace" fontWeight="bold">TOOTH #14 APICAL LESION</text>
                      </g>
                      <path d="M 175 40 Q 185 5 195 40" />
                      <path d="M 205 40 Q 215 5 225 40" />
                      <path d="M 230 40 Q 240 5 250 40" />
                      <path d="M 255 40 Q 265 5 275 40" />
                      <path d="M 280 40 Q 290 5 300 40" />
                      <path d="M 305 40 Q 315 5 325 40" />
                      <path d="M 330 40 Q 340 5 350 40" />
                    </g>

                    {/* Lower teeth */}
                    <g transform="translate(0, 110)" fill="none" stroke="#eee" strokeWidth="2">
                      <path d="M 50 0 Q 60 35 70 0" />
                      <path d="M 75 0 Q 85 35 95 0" />
                      <path d="M 100 0 Q 110 35 120 0" />
                      <path d="M 125 0 Q 135 35 145 0" />
                      <path d="M 150 0 Q 160 35 170 0" />
                      <path d="M 175 0 Q 185 35 195 0" />
                      <path d="M 205 0 Q 215 35 225 0" />
                      <path d="M 230 0 Q 240 35 250 0" />
                      <path d="M 255 0 Q 265 35 275 0" />
                      <path d="M 280 0 Q 290 35 300 0" />
                      <path d="M 305 0 Q 315 35 325 0" />
                      <path d="M 330 0 Q 340 35 350 0" />
                    </g>
                  </svg>

                  <div className="w-full text-center text-[7px] text-gray-500 font-bold uppercase mt-3">
                    Valley Endodontics • Digital Radiograph System v4.1
                  </div>
                </div>
              ) : (
                /* PDF Document Layout */
                <div className="w-full max-w-md bg-white p-6 border-2 border-black text-black">
                  <div className="text-center pb-4 border-b-2 border-black mb-4">
                    <h4 className="text-xs font-black uppercase tracking-widest">DRTALK SECURE PATIENT REFERRAL</h4>
                    <p className="text-[7px] font-bold text-muted-foreground uppercase">CLINICAL DOCUMENTATION PORTAL</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[8px] uppercase mb-4">
                    <div className="space-y-1.5">
                      <p><span className="font-bold text-gray-500">FROM PRACTICE:</span> {activeChannel.name === 'Valley Endodontics' ? 'Beverly Hills Dental' : 'Valley Endodontics'}</p>
                      <p><span className="font-bold text-gray-500">TO PRACTICE:</span> {activeChannel.name}</p>
                      <p><span className="font-bold text-gray-500">PROVIDER NPI:</span> 1982736450</p>
                    </div>
                    <div className="space-y-1.5">
                      <p><span className="font-bold text-gray-500">PATIENT NAME:</span> Alice Cooper</p>
                      <p><span className="font-bold text-gray-500">DOB:</span> 12/04/1978</p>
                      <p><span className="font-bold text-gray-500">DATE CREATED:</span> {previewDocument.sentAt}</p>
                    </div>
                  </div>

                  <div className="border border-black p-3 space-y-2 mb-4 bg-gray-50">
                    <p className="text-[8px] font-black uppercase">REASON FOR REFERRAL:</p>
                    <p className="text-[8px] leading-relaxed italic text-gray-700">
                      &quot;Patient presents with lingering thermal sensitivity and percussion pain in upper left quadrant. Pano shows potential apical radiolucency on Tooth #14. Please evaluate for endodontic retreatment.&quot;
                    </p>
                  </div>

                  <div className="border border-black p-3 space-y-2 bg-gray-50">
                    <p className="text-[8px] font-black uppercase">REQUIRED PROCEDURES:</p>
                    <div className="flex gap-4 text-[8px] font-bold">
                      <label className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 border border-black bg-black flex items-center justify-center"><div className="w-1 h-1 bg-white" /></div>
                        <span>Evaluation</span>
                      </label>
                      <label className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 border border-black bg-black flex items-center justify-center"><div className="w-1 h-1 bg-white" /></div>
                        <span>Root Canal Retreatment</span>
                      </label>
                      <label className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 border border-black" />
                        <span>Apicoectomy</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-3 border-t border-black text-[7px] font-bold text-gray-500 uppercase">
                    <span>DIGITALLY SIGNED VIA DRTALK SECURE AUTH</span>
                    <span>STATUS: VALIDATED PHI</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-[8px] font-bold text-muted-foreground uppercase">
                File details: {previewDocument.size} • {previewDocument.type.toUpperCase()} Format • Secure Storage ID: {previewDocument.id}
              </span>
              <button
                onClick={() => {
                  setPreviewDocument(null);
                  triggerToast(`Downloading "${previewDocument.name}"...`);
                }}
                className="wireframe-button bg-black text-white text-[9px] uppercase px-4 py-1.5 flex items-center gap-1.5 font-bold"
              >
                <Download size={10} /> Download File
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

function ChannelItem({
  channel,
  isActive,
  onClick,
  isExpanded,
  hasSubChannels
}: {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
  isExpanded?: boolean;
  hasSubChannels?: boolean;
}) {
  const pathname = usePathname();
  const isDentist = pathname.startsWith('/dentist');
  const displayName = (channel.id === '3' && !isDentist) ? 'Sunshine Dental' : channel.name;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-2 text-left transition-all group ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100'
        }`}
    >
      <div className={`w-6 h-6 border flex items-center justify-center shrink-0 ${isActive ? 'border-white' : 'border-black'}`}>
        {channel.type === 'internal' && <Hash size={12} />}
        {channel.type === 'inter-practice' && <Users size={12} />}
        {channel.type === 'patient' && <Smartphone size={12} />}
        {channel.type === 'public' && <Lock size={12} />}
        {channel.type === 'group' && <Users size={12} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 min-w-0">
            {hasSubChannels && (
              <span className={`shrink-0 ${isActive ? 'text-white' : 'text-muted-foreground'}`}>
                {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              </span>
            )}
            <p className="text-[10px] font-bold uppercase truncate">{displayName}</p>
            {channel.isVerified === false && (
              <span
                className={`text-[6px] px-1 font-black uppercase whitespace-nowrap cursor-help ${isActive ? 'bg-white text-black' : 'bg-gray-200 text-black'}`}
                title="Practice owner isn't verified yet"
              >
                UNVERIFIED
              </span>
            )}
            {channel.isExternal && (
              <span
                className={`text-[6px] px-1 font-black uppercase whitespace-nowrap cursor-help ${isActive ? 'bg-white text-black' : 'bg-gray-200 text-black border border-black'}`}
                title="Practice is not on the platform; messages are delivered via secure email"
              >
                SECURE EMAIL
              </span>
            )}
          </div>
          {channel.unreadCount && !isActive && (
            <span className="bg-black text-white text-[8px] px-1 rounded-full">{channel.unreadCount}</span>
          )}
        </div>
        <p className={`text-[8px] truncate font-medium ${isActive ? 'text-gray-400' : 'text-muted-foreground'}`}>
          {channel.lastMessage}
        </p>
      </div>
    </button>
  );
}

function Message({
  user,
  text,
  time,
  type,
  transport,
  document
}: {
  user: string;
  text: string;
  time: string;
  type: 'self' | 'other';
  transport?: 'App' | 'SMS' | 'Email';
  document?: SharedDocument;
}) {
  const isSelf = type === 'self';

  return (
    <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} space-y-1`}>
      <div className="flex items-center gap-2">
        {!isSelf && <span className="text-[9px] font-black uppercase tracking-tighter">{user}</span>}
        <span className="text-[8px] text-muted-foreground uppercase font-bold">{time}</span>
        {isSelf && <span className="text-[9px] font-black uppercase tracking-tighter">You</span>}
      </div>
      <div className={`max-w-md wireframe-card p-3 text-xs leading-snug shadow-sm ${isSelf ? 'bg-black text-white' : 'bg-white text-black'
        }`}>
        {text && <div className="whitespace-pre-wrap">{text}</div>}

        {document && (
          <div className={`mt-3 p-3 border-2 flex items-center justify-between gap-4 transition-all ${isSelf ? 'border-white bg-black text-white' : 'border-black bg-white text-black'
            }`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 border-2 flex items-center justify-center shrink-0 ${isSelf ? 'border-white' : 'border-black'
                }`}>
                {document.type === 'pdf' ? <FileText size={16} /> :
                  document.type === 'image' ? <ImageIcon size={16} /> :
                    <Paperclip size={16} />}
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase truncate">{document.name}</p>
                <p className="text-[7px] uppercase font-bold opacity-60 mt-0.5">{document.size}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Downloading: ${document.name}`);
                }}
                className={`text-[8px] font-black uppercase tracking-wider px-2.5 py-1.5 border-2 transition-all flex items-center gap-1 font-bold ${
                  isSelf 
                    ? 'border-white bg-white text-black hover:bg-black hover:text-white' 
                    : 'border-black bg-black text-white hover:bg-white hover:text-black'
                }`}
                title={`Download ${document.name}`}
              >
                <Download size={10} /> Download
              </button>
            </div>
          </div>
        )}

        {transport && (
          <div className={`mt-2 pt-2 border-t border-dashed flex items-center gap-1 opacity-50 ${isSelf ? 'border-white/30' : 'border-black/30'}`}>
            {transport === 'App' && <AppWindow size={10} />}
            {transport === 'SMS' && <Smartphone size={10} />}
            {transport === 'Email' && <Mail size={10} />}
            <span className="text-[7px] font-bold uppercase">Sent via {transport}</span>
          </div>
        )}
      </div>
    </div>
  );
}
