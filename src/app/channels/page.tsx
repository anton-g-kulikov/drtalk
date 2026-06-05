"use client";

import React, { Suspense, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from "@/components/MainLayout";
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { useSubscription } from '@/components/SubscriptionContext';
import {
  Search, Hash, Lock, Users, Send,
  Paperclip, Smile, MoreHorizontal,
  Smartphone, Mail, AppWindow,
  FileText, ImageIcon, X, Eye, Download, Plus, Upload,
  ChevronDown, ChevronRight
} from 'lucide-react';

export type ChannelType = 'internal' | 'inter-practice' | 'patient' | 'public' | 'group';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  lastMessage: string;
  unreadCount?: number;
  memberCount: number;
  isVerified?: boolean;
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

export const mockChannels: Channel[] = [
  { id: '1', name: 'team-members', type: 'internal', lastMessage: 'Reviewing tooth #14...', unreadCount: 2, memberCount: 12 },
  { id: '2', name: 'admin-billing', type: 'internal', lastMessage: 'March report ready.', memberCount: 4 },
  { id: '3', name: 'Valley Endodontics', type: 'inter-practice', lastMessage: 'Pano image uploaded for Alice Cooper.', memberCount: 2 },
  { id: '7', name: 'Downtown Oral Surgery', type: 'inter-practice', lastMessage: 'Referral sent for Bob Marley.', memberCount: 2 },
  { id: '8', name: 'Metro Orthodontics', type: 'inter-practice', lastMessage: 'Referral sent for Charlie Brown.', memberCount: 2 },
  { id: '9', name: 'Arizona Periodontics', type: 'inter-practice', lastMessage: 'Referral sent for David Bowie.', memberCount: 2 },
  { id: '6', name: 'Beverly Hills Dental', type: 'inter-practice', lastMessage: 'Waiting for verification.', memberCount: 1, isVerified: false },
  { id: '4', name: 'Alice Cooper', type: 'patient', lastMessage: 'Got it, thank you!', memberCount: 2 },
  { id: '5', name: 'general-updates', type: 'public', lastMessage: 'Welcome to the network!', memberCount: 124 },
];

export const initialDocuments: SharedDocument[] = [
  { id: 'd1', channelId: '3', name: 'pano_alice_cooper.png', size: '2.4 MB', type: 'image', sentBy: 'Valley Endodontics', sentAt: 'Today, 10:24 AM' },
  { id: 'd2', channelId: '3', name: 'referral_form_signed.pdf', size: '1.1 MB', type: 'pdf', sentBy: 'Me', sentAt: 'Today, 11:05 AM' },
  { id: 'd7_1', channelId: '7', name: 'referral_bob_marley.pdf', size: '1.3 MB', type: 'pdf', sentBy: 'Me', sentAt: '05/11/2026, 06:20 AM' },
  { id: 'd7_2', channelId: '7', name: 'implant_scan_19.zip', size: '15.2 MB', type: 'zip', sentBy: 'Me', sentAt: '05/11/2026, 06:20 AM' },
  { id: 'd8_1', channelId: '8', name: 'referral_charlie_brown.pdf', size: '1.2 MB', type: 'pdf', sentBy: 'Me', sentAt: '05/10/2026, 10:20 AM' },
  { id: 'd9_1', channelId: '9', name: 'referral_david_bowie.pdf', size: '1.4 MB', type: 'pdf', sentBy: 'Me', sentAt: '05/09/2026, 10:20 AM' },
  { id: 'd3', channelId: '6', name: 'practice_credentials.pdf', size: '3.2 MB', type: 'pdf', sentBy: 'Beverly Hills Dental', sentAt: 'Yesterday, 04:15 PM' }
];

export const initialMessages: Record<string, MessageItem[]> = {
  '1': [
    { id: 'm1_1', user: 'Nurse Joy', text: 'Did anyone review the morning labs yet?', time: '09:15 AM', type: 'other' },
    { id: 'm1_2', user: 'Me', text: "I'm on it. Should be done in 10 minutes.", time: '09:20 AM', type: 'self', transport: 'App' },
    { id: 'm1_3', user: 'Dr. Smith', text: "Thanks, let know if there's anything urgent.", time: '09:25 AM', type: 'other' }
  ],
  '2': [
    { id: 'm2_1', user: 'Me', text: 'Drafting the March report now.', time: 'Yesterday', type: 'self', transport: 'App' },
    { id: 'm2_2', user: 'Admin', text: "Great, let's review it tomorrow.", time: 'Yesterday', type: 'other' }
  ],
  '3': [
    { id: 'm3_1', user: 'Valley Endodontics', text: 'Pano image uploaded for Alice Cooper. Let us know if you need more angles.', time: '10:24 AM', type: 'other', document: { id: 'd1', channelId: '3', name: 'pano_alice_cooper.png', size: '2.4 MB', type: 'image', sentBy: 'Valley Endodontics', sentAt: 'Today, 10:24 AM' } },
    { id: 'm3_2', user: 'Me', text: 'Received. Looks like a clear case for retreatment. Sending referral over now.', time: '11:05 AM', type: 'self', transport: 'App', document: { id: 'd2', channelId: '3', name: 'referral_form_signed.pdf', size: '1.1 MB', type: 'pdf', sentBy: 'Me', sentAt: 'Today, 11:05 AM' } }
  ],
  '7': [
    { id: 'm7_1', user: 'Me', text: 'Hello Dr. Jones, referring Bob Marley for a dental implant on #19. Attached are the referral form and patient records.', time: '06:20 AM', type: 'self', transport: 'App', document: { id: 'd7_1', channelId: '7', name: 'referral_bob_marley.pdf', size: '1.3 MB', type: 'pdf', sentBy: 'Me', sentAt: '05/11/2026, 06:20 AM' } },
    { id: 'm7_2', user: 'Downtown Oral Surgery', text: 'Thanks Taylor. We will schedule Bob soon and send over updates.', time: '07:15 AM', type: 'other' }
  ],
  '8': [
    { id: 'm8_1', user: 'Me', text: 'Hi Dr. Miller, sending over Charlie Brown for an emergency extraction of tooth #16. Please see attached records.', time: '10:20 AM', type: 'self', transport: 'App', document: { id: 'd8_1', channelId: '8', name: 'referral_charlie_brown.pdf', size: '1.2 MB', type: 'pdf', sentBy: 'Me', sentAt: '05/10/2026, 10:20 AM' } }
  ],
  '9': [
    { id: 'm9_1', user: 'Me', text: 'Hi Dr. White, referring David Bowie for an Invisalign evaluation. Attached is the complete case package.', time: '10:20 AM', type: 'self', transport: 'App', document: { id: 'd9_1', channelId: '9', name: 'referral_david_bowie.pdf', size: '1.4 MB', type: 'pdf', sentBy: 'Me', sentAt: '05/09/2026, 10:20 AM' } }
  ],
  '4': [
    { id: 'm4_0', user: 'Me', text: 'Welcome to Sunshine Dental! To help us communicate about your care, appointments, and important health information, may we contact you via SMS/text message? Standard messaging rates may apply.\n\nPlease reply with:\n• Full Name:\n• Date of Birth (MM/DD/YYYY):\n\nReply YES to consent to SMS communication, or NO to decline.', time: '11:15 AM', type: 'self', transport: 'SMS' },
    { id: 'm4_1', user: 'Alice Cooper', text: 'YES\nAlice Cooper\n02/04/1948', time: '11:15 AM', type: 'other', transport: 'SMS' },
    { id: 'm4_2', user: 'Me', text: 'Just avoid eating 2 hours before the procedure. We will send a formal prep guide to your email shortly.', time: '11:20 AM', type: 'self', transport: 'Email' },
    { id: 'm4_3', user: 'Alice Cooper', text: 'Got it, thank you!', time: '11:25 AM', type: 'other', transport: 'SMS' }
  ],
  '5': [
    { id: 'm5_1', user: 'System', text: 'Welcome to the drTalk network! Here you can find updates and connect with other providers.', time: 'Yesterday', type: 'other' },
    { id: 'm5_2', user: 'Admin', text: 'New clinical guidelines for 2024 have been posted in the resources section.', time: '08:00 AM', type: 'other' }
  ],
  '6': [
    { id: 'm6_1', user: 'Beverly Hills Dental', text: 'Waiting for verification.', time: 'Yesterday, 04:15 PM', type: 'other', document: { id: 'd3', channelId: '6', name: 'practice_credentials.pdf', size: '3.2 MB', type: 'pdf', sentBy: 'Beverly Hills Dental', sentAt: 'Yesterday, 04:15 PM' } }
  ]
};

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

function ChannelsContent() {
  const pathname = usePathname();
  const isDentist = pathname.startsWith('/dentist');
  const { isTrialEnded, setShowPaywall } = useSubscription();

  const searchParams = useSearchParams();
  const practiceParam = searchParams.get('practice');

  // State managed data
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [messages, setMessages] = useState<Record<string, MessageItem[]>>(initialMessages);
  const [documents, setDocuments] = useState<SharedDocument[]>(initialDocuments);
  const [activeTab, setActiveTab] = useState<'messages' | 'documents'>('messages');

  // Collapse states for sidebar sections
  const [internalCollapsed, setInternalCollapsed] = useState(true);
  const [connectedCollapsed, setConnectedCollapsed] = useState(true);
  const [patientCollapsed, setPatientCollapsed] = useState(true);
  const [groupCollapsed, setGroupCollapsed] = useState(true);

  // Group chat creation states
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupChatName, setGroupChatName] = useState('');
  const [groupParticipants, setGroupParticipants] = useState<GroupParticipant[]>(mockGroupParticipants);
  const [groupChatError, setGroupChatError] = useState<string | null>(null);

  // Input states
  const [inputText, setInputText] = useState('');
  const [attachedDoc, setAttachedDoc] = useState<{ name: string; size: string; type: 'pdf' | 'image' | 'zip' | 'doc' } | null>(null);

  // Search states for documents
  const [docSearchQuery, setDocSearchQuery] = useState('');

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

    const newChannelId = 'group_' + Math.random().toString(36).substring(2, 9);
    const newChannel: Channel = {
      id: newChannelId,
      name: groupChatName.trim(),
      type: 'group',
      lastMessage: 'Group chat created.',
      memberCount: selectedPeople.length + 1
    };

    setChannels(prev => [...prev, newChannel]);

    const welcomeMsg: MessageItem = {
      id: 'm_welcome_' + Math.random().toString(36).substring(2, 9),
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
      .filter(c => c.type === 'inter-practice')
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

  const [activeChannel, setActiveChannel] = useState<Channel>(() => {
    const defaultChannels = mockChannels;

    if (practiceParam) {
      const channel = defaultChannels.find(c => c.name.toLowerCase() === practiceParam.toLowerCase());
      if (channel) return channel;
    }
    return defaultChannels[0];
  });

  const channelReferrals = React.useMemo(() => {
    if (activeChannel.name.includes('Sunshine')) {
      return [{ id: 'D-1005', patientName: 'Sarah Jenkins', type: 'Endodontic' }];
    } else if (activeChannel.name.includes('Downtown')) {
      return [{ id: 'D-1002', patientName: 'Marco Reyes', type: 'Extraction' }];
    } else if (activeChannel.name.includes('Valley')) {
      return [{ id: 'D-1001', patientName: 'Alice Cooper', type: 'Endodontic' }];
    } else if (activeChannel.name.includes('Metro')) {
      return [{ id: 'D-1003', patientName: 'John Doe', type: 'Orthodontic' }];
    }
    return [];
  }, [activeChannel.name]);

  const [showChannelList, setShowChannelList] = useState(false);

  // Sync activeChannel if practiceParam changes after mount
  const [prevPracticeParam, setPrevPracticeParam] = useState(practiceParam);
  if (practiceParam !== prevPracticeParam) {
    setPrevPracticeParam(practiceParam);
    if (practiceParam) {
      const channel = displayedChannels.find(c => c.name.toLowerCase() === practiceParam.toLowerCase());
      if (channel && channel.id !== activeChannel.id) {
        setActiveChannel(channel);
        if (channel.type !== 'inter-practice') {
          setActiveTab('messages');
        }
      }
    }
  }

  const handleSelectChannel = (c: Channel) => {
    setActiveChannel(c);
    setShowChannelList(false);
    if (c.type !== 'inter-practice') {
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
      transport: activeChannel.type === 'patient' ? 'Email' : 'App',
      document: docObj
    };

    setMessages(prev => ({
      ...prev,
      [activeChannel.id]: [...(prev[activeChannel.id] || []), newMessage]
    }));

    // Update last message of the channel
    setChannels(prev => prev.map(c => {
      if (c.id === activeChannel.id) {
        return {
          ...c,
          lastMessage: attachedDoc ? `Shared document: ${attachedDoc.name}` : inputText
        };
      }
      return c;
    }));

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
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    let type: 'pdf' | 'image' | 'zip' | 'doc' = 'doc';
    if (extension === 'pdf') type = 'pdf';
    else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) type = 'image';
    else if (['zip', 'rar', 'tar', 'gz'].includes(extension)) type = 'zip';

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const formattedSize = parseFloat(sizeMB) > 0.1 ? `${sizeMB} MB` : `${(file.size / 1024).toFixed(0)} KB`;

    // Automatically fill form fields!
    setCustomDocName(file.name);
    setCustomDocType(type);
    setCustomDocSize(formattedSize);

    // Automatically attach to list!
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newFile: SharedDocument = {
      id: 'temp_' + Math.random().toString(36).substring(2, 9),
      channelId: activeChannel.id,
      name: file.name,
      size: formattedSize,
      type: type,
      sentBy: 'Me',
      sentAt: 'Today, ' + timeString
    };

    setAttachedFiles(prev => [...prev, newFile]);
    triggerToast(`Attached "${file.name}" successfully!`);

    // Clear input value so same file can be uploaded again
    e.target.value = '';
  };

  const handleDirectUpload = () => {
    if (isTrialEnded) {
      setShowPaywall(true);
      return;
    }
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Prepare documents to share. If we have attachedFiles, use those. 
    // Otherwise fallback to single custom file as backup
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

    // Convert to final SharedDocument array with unique IDs
    const finalDocs: SharedDocument[] = filesToShare.map(file => ({
      id: 'd_' + Math.random().toString(36).substring(2, 9),
      channelId: activeChannel.id,
      name: file.name,
      size: file.size,
      type: file.type,
      sentBy: 'Me',
      sentAt: 'Today, ' + timeString
    }));

    setDocuments(prev => [...prev, ...finalDocs]);

    // Create message objects
    const newMessages: MessageItem[] = finalDocs.map((newDoc, index) => {
      let messageText = `Directly shared document: ${newDoc.name}`;

      if (selectedReferral) {
        messageText += `\nAssociated Referral: ${selectedReferral}`;
      }

      // Associate patient information if provided (on the first document in the batch)
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

    setMessages(prev => ({
      ...prev,
      [activeChannel.id]: [...(prev[activeChannel.id] || []), ...newMessages]
    }));

    setChannels(prev => prev.map(c => {
      if (c.id === activeChannel.id) {
        return {
          ...c,
          lastMessage: `Shared ${finalDocs.length} document${finalDocs.length > 1 ? 's' : ''}: ${finalDocs[0].name}`
        };
      }
      return c;
    }));

    setAttachedFiles([]);
    setCustomDocName('');
    setPatientFirstName('');
    setPatientLastName('');
    setPatientDob('');
    setUploadMessage('');
    setSelectedReferral('');
    setShowDirectUploadModal(false);
    triggerToast(`Shared ${finalDocs.length} document${finalDocs.length > 1 ? 's' : ''} successfully!`);
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
  };

  const getDocSender = (sentBy: string) => {
    if (activeChannel.type !== 'inter-practice') {
      return sentBy;
    }
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
                className="wireframe-input pl-10 py-1.5 text-[10px]"
              />
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
                  {displayedChannels.filter(c => c.type === 'internal').map(c => (
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

            {/* Inter-practice */}
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
                  {displayedChannels.filter(c => c.type === 'inter-practice').map(c => (
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
                  {displayedChannels.filter(c => c.type === 'group').length === 0 ? (
                    <p className="text-[8px] text-muted-foreground italic uppercase">No group chats yet.</p>
                  ) : (
                    displayedChannels.filter(c => c.type === 'group').map(c => (
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
                    {displayedChannels.filter(c => c.type === 'patient').map(c => (
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
              <div className="w-8 h-8 border-2 border-black flex items-center justify-center shrink-0">
                {activeChannel.type === 'internal' ? <Hash size={16} /> : <Users size={16} />}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold uppercase text-xs truncate">{(activeChannel.id === '3' && !isDentist) ? 'Sunshine Dental' : activeChannel.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                  <span className="text-[8px] text-muted-foreground uppercase font-bold">{activeChannel.memberCount} Members</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
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
            </div>
          )}

          {/* Messages Area / Documents Tab */}
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
                            setShowDirectUploadModal(true);
                            setShowAttachmentDrawer(false);
                          }}
                          className="w-full flex items-center gap-2 p-2 bg-black text-white hover:bg-white hover:text-black border border-black text-left transition-all font-black text-[9px] uppercase group/btn"
                        >
                          <div className="w-5 h-5 border border-white group-hover/btn:border-black flex items-center justify-center shrink-0">
                            <Plus size={10} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-black uppercase truncate">Attach New Document</p>
                            <p className="text-[7px] opacity-85 uppercase">Upload from computer</p>
                          </div>
                        </button>

                        <div className="h-[1px] bg-black/10 my-2" />

                        {/* Existing list (No more than 5 docs) */}
                        {mockAttachments.slice(0, 5).map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setAttachedDoc({
                                name: item.name,
                                size: item.size,
                                type: item.type
                              });
                              setShowAttachmentDrawer(false);
                            }}
                            className="w-full flex items-center gap-2 p-2 hover:bg-black hover:text-white border border-transparent hover:border-black text-left transition-all text-black"
                          >
                            <div className="w-5 h-5 border border-black flex items-center justify-center shrink-0">
                              {item.type === 'pdf' ? <FileText size={10} /> :
                                item.type === 'image' ? <ImageIcon size={10} /> :
                                  <Paperclip size={10} />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] font-bold uppercase truncate">{item.name}</p>
                              <p className="text-[7px] text-muted-foreground uppercase">{item.size}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 pt-2 border-t border-black border-dashed">
                        <p className="text-[7px] font-bold uppercase text-muted-foreground italic text-center">
                          Click a document to attach it to your message.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="wireframe-card p-4 space-y-4">
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
                                <label className="flex items-center gap-1.5 cursor-pointer group">
                                  <input type="radio" name="transport" className="hidden peer" />
                                  <div className="w-3 h-3 border border-black flex items-center justify-center peer-checked:bg-black transition-all">
                                    <div className="w-1 h-1 bg-white" />
                                  </div>
                                  <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 peer-checked:opacity-100">
                                    <span className="text-[8px] font-black uppercase">Email</span>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="h-4 w-[1px] bg-black/20 mx-1" />
                            <div className="flex items-center gap-2">
                              <Lock size={12} className="text-black" />
                              <span className="text-[8px] font-bold uppercase text-black">Secure Internal Transmission</span>
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        onClick={handleSendMessage}
                        className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-2 flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-white hover:text-black transition-all"
                      >
                        Send Message <Send size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Dedicated Documents Tab View */
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
              {/* Toolbar */}
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
                      onClick={() => setShowDirectUploadModal(true)}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredDocuments.map((doc) => (
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
                  )}
                </div>
              </div>
            </div>
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
                }}
                className="hover:text-black text-black"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Field 1: Choice of connected practice (prefilled & disabled) */}
              <div>
                <span className="text-[10px] font-black uppercase block mb-1.5 text-black">
                  Connected Practice <span className="text-red-500">*</span>
                </span>
                <select
                  value={activeChannel.name}
                  disabled
                  className="wireframe-input py-2 px-3 text-xs font-bold text-black border-black bg-zinc-100 w-full h-10 cursor-not-allowed focus:ring-0 focus:outline-none opacity-80"
                >
                  <option value={activeChannel.name}>{activeChannel.name}</option>
                </select>
              </div>

              {/* Field 2: Choice of sent referral (optional) */}
              <div>
                <span className="text-[10px] font-black uppercase block mb-1.5 text-black">
                  Associated Referral (Optional)
                </span>
                <select
                  value={selectedReferral}
                  onChange={(e) => setSelectedReferral(e.target.value)}
                  className="wireframe-input py-2 px-3 text-xs font-bold text-black border-black bg-white w-full h-10 focus:ring-0 focus:outline-none"
                >
                  <option value="">NONE / NEW REFERRAL</option>
                  {channelReferrals.map((referral) => (
                    <option key={referral.id} value={referral.id}>
                      {referral.id} - {referral.patientName} ({referral.type})
                    </option>
                  ))}
                </select>
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
              <div className="relative border-2 border-dashed border-black p-4 bg-gray-50 hover:bg-black/5 cursor-pointer transition-all text-center flex flex-col items-center justify-center gap-1.5 min-h-[120px]">
                {/* Hidden native input */}
                <input
                  type="file"
                  id="modal-file-input"
                  className="hidden"
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
                onClick={() => {
                  setShowDirectUploadModal(false);
                  setCustomDocName('');
                  setAttachedFiles([]);
                  setPatientFirstName('');
                  setPatientLastName('');
                  setPatientDob('');
                  setUploadMessage('');
                  setSelectedReferral('');
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

function ChannelItem({ channel, isActive, onClick }: { channel: Channel, isActive: boolean, onClick: () => void }) {
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
            <p className="text-[10px] font-bold uppercase truncate">{displayName}</p>
            {channel.isVerified === false && (
              <span
                className={`text-[6px] px-1 font-black uppercase whitespace-nowrap cursor-help ${isActive ? 'bg-white text-black' : 'bg-gray-200 text-black'}`}
                title="Practice owner isn't verified yet"
              >
                UNVERIFIED
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
