"use client";

import React, { Suspense, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { CommentMarker } from "@/components/Comments/CommentMarker";
import {
  Search, Hash, Lock, Users, Send,
  Paperclip, Smile, MoreHorizontal,
  Smartphone, Mail, AppWindow,
  FileText, Image, X, Eye, Download, Plus
} from 'lucide-react';

type ChannelType = 'internal' | 'inter-practice' | 'patient' | 'public';

interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  lastMessage: string;
  unreadCount?: number;
  memberCount: number;
  isVerified?: boolean;
}

interface SharedDocument {
  id: string;
  channelId: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'zip' | 'doc';
  sentBy: string;
  sentAt: string;
}

interface MessageItem {
  id: string;
  user: string;
  text: string;
  time: string;
  type: 'self' | 'other';
  transport?: 'App' | 'SMS' | 'Email';
  document?: SharedDocument;
}

const mockChannels: Channel[] = [
  { id: '1', name: 'team-members', type: 'internal', lastMessage: 'Reviewing tooth #14...', unreadCount: 2, memberCount: 12 },
  { id: '2', name: 'admin-billing', type: 'internal', lastMessage: 'March report ready.', memberCount: 4 },
  { id: '3', name: 'Valley Endodontics', type: 'inter-practice', lastMessage: 'Pano image uploaded for Alice Cooper.', memberCount: 2 },
  { id: '7', name: 'Downtown Oral Surgery', type: 'inter-practice', lastMessage: 'Referral sent for Bob Marley.', memberCount: 2 },
  { id: '8', name: 'Metro Orthodontics', type: 'inter-practice', lastMessage: 'Referral sent for Charlie Brown.', memberCount: 2 },
  { id: '9', name: 'Arizona Periodontics', type: 'inter-practice', lastMessage: 'Referral sent for David Bowie.', memberCount: 2 },
  { id: '6', name: 'Beverly Hills Dental', type: 'inter-practice', lastMessage: 'Waiting for verification.', memberCount: 1, isVerified: false },
  { id: '4', name: 'Alice Cooper', type: 'patient', lastMessage: 'Appointment confirmed.', memberCount: 2 },
  { id: '5', name: 'general-updates', type: 'public', lastMessage: 'Welcome to the network!', memberCount: 124 },
];

const initialDocuments: SharedDocument[] = [
  { id: 'd1', channelId: '3', name: 'pano_alice_cooper.png', size: '2.4 MB', type: 'image', sentBy: 'Valley Endodontics', sentAt: 'Today, 10:24 AM' },
  { id: 'd2', channelId: '3', name: 'referral_form_signed.pdf', size: '1.1 MB', type: 'pdf', sentBy: 'Me', sentAt: 'Today, 11:05 AM' },
  { id: 'd7_1', channelId: '7', name: 'referral_bob_marley.pdf', size: '1.3 MB', type: 'pdf', sentBy: 'Me', sentAt: '05/11/2026, 06:20 AM' },
  { id: 'd7_2', channelId: '7', name: 'implant_scan_19.zip', size: '15.2 MB', type: 'zip', sentBy: 'Me', sentAt: '05/11/2026, 06:20 AM' },
  { id: 'd8_1', channelId: '8', name: 'referral_charlie_brown.pdf', size: '1.2 MB', type: 'pdf', sentBy: 'Me', sentAt: '05/10/2026, 10:20 AM' },
  { id: 'd9_1', channelId: '9', name: 'referral_david_bowie.pdf', size: '1.4 MB', type: 'pdf', sentBy: 'Me', sentAt: '05/09/2026, 10:20 AM' },
  { id: 'd3', channelId: '6', name: 'practice_credentials.pdf', size: '3.2 MB', type: 'pdf', sentBy: 'Beverly Hills Dental', sentAt: 'Yesterday, 04:15 PM' }
];

const initialMessages: Record<string, MessageItem[]> = {
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
    { id: 'm4_1', user: 'Alice Cooper', text: 'Is there any prep I need to do before my appointment?', time: '11:15 AM', type: 'other', transport: 'SMS' },
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

function ChannelsContent() {
  const pathname = usePathname();
  const isDentist = pathname.startsWith('/dentist');

  const searchParams = useSearchParams();
  const practiceParam = searchParams.get('practice');

  // State managed data
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [messages, setMessages] = useState<Record<string, MessageItem[]>>(initialMessages);
  const [documents, setDocuments] = useState<SharedDocument[]>(initialDocuments);
  const [activeTab, setActiveTab] = useState<'messages' | 'documents'>('messages');

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

  // Direct Upload State Form
  const [customDocName, setCustomDocName] = useState('');
  const [customDocType, setCustomDocType] = useState<'pdf' | 'image' | 'zip' | 'doc'>('pdf');
  const [customDocSize, setCustomDocSize] = useState('1.5 MB');

  // Filter channels based on role
  const displayedChannels = React.useMemo(() => {
    return channels.filter(c => {
      if (isDentist && c.type === 'patient') return false;
      return true;
    });
  }, [isDentist, channels]);

  const [activeChannel, setActiveChannel] = useState<Channel>(() => {
    const defaultChannels = mockChannels.filter(c => {
      if (pathname.startsWith('/dentist') && c.type === 'patient') return false;
      return true;
    });
    
    if (practiceParam) {
      const channel = defaultChannels.find(c => c.name.toLowerCase() === practiceParam.toLowerCase());
      if (channel) return channel;
    }
    return defaultChannels[0];
  });

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

  const handleDirectUpload = () => {
    if (!customDocName.trim()) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const docId = 'd_' + Math.random().toString(36).substring(2, 9);
    
    // Add extension if not present
    const formattedName = customDocName.toLowerCase().endsWith(`.${customDocType}`) 
      ? customDocName.toLowerCase() 
      : `${customDocName.toLowerCase()}.${customDocType}`;

    const newDoc: SharedDocument = {
      id: docId,
      channelId: activeChannel.id,
      name: formattedName,
      size: customDocSize || '1.5 MB',
      type: customDocType,
      sentBy: 'Me',
      sentAt: 'Today, ' + timeString
    };

    setDocuments(prev => [...prev, newDoc]);

    const newMessage: MessageItem = {
      id: 'm_' + Math.random().toString(36).substring(2, 9),
      user: 'Me',
      text: `Directly shared document: ${newDoc.name}`,
      time: timeString,
      type: 'self',
      transport: 'App',
      document: newDoc
    };

    setMessages(prev => ({
      ...prev,
      [activeChannel.id]: [...(prev[activeChannel.id] || []), newMessage]
    }));

    setChannels(prev => prev.map(c => {
      if (c.id === activeChannel.id) {
        return {
          ...c,
          lastMessage: `Shared document: ${newDoc.name}`
        };
      }
      return c;
    }));

    setCustomDocName('');
    setShowDirectUploadModal(false);
    triggerToast(`"${newDoc.name}" uploaded and shared!`);
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
                <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Internal Communication</p>
                <button className="text-[8px] font-black uppercase underline hover:text-black">Create +</button>
              </div>
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
            </div>

            {/* Inter-practice */}
            <div className="p-4 border-t border-black border-dashed space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Connected Practices</p>
                <button className="text-[8px] font-black uppercase underline hover:text-black">Connect</button>
              </div>
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
            </div>

            {/* Patient */}
            {!isDentist && (
              <div className="p-4 border-t border-black border-dashed space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Patient Comm (SMS/Email)</p>
                </div>

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
              </div>
            )}
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
              <button className="hidden sm:block text-[10px] font-bold uppercase underline">Participants</button>
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
                className={`text-[9px] font-black uppercase tracking-wider px-4 border-b-4 transition-all ${
                  activeTab === 'messages' 
                    ? 'border-black text-black font-black' 
                    : 'border-transparent text-muted-foreground hover:text-black'
                }`}
              >
                Messages
              </button>
              <button 
                onClick={() => setActiveTab('documents')}
                className={`text-[9px] font-black uppercase tracking-wider px-4 border-b-4 transition-all ${
                  activeTab === 'documents' 
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
                               item.type === 'image' ? <Image size={10} /> :
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
                             attachedDoc.type === 'image' ? <Image size={12} /> :
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
                               doc.type === 'image' ? <Image size={20} className="text-black" /> :
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-4 border-black p-6 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-in">
            <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-black">Send Document to {activeChannel.name}</h3>
              <button 
                onClick={() => {
                  setShowDirectUploadModal(false);
                  setCustomDocName('');
                }} 
                className="hover:text-black text-black"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Option 1: Quick Attach Mock Files */}
              <div>
                <label className="text-[8px] font-black uppercase text-muted-foreground tracking-wider block mb-2">
                  Option 1: Quick Select Mock Template
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {mockAttachments.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCustomDocName(item.name);
                        setCustomDocType(item.type);
                        setCustomDocSize(item.size);
                      }}
                      className={`p-2 border-2 text-left transition-all ${
                        customDocName === item.name 
                          ? 'border-black bg-black text-white' 
                          : 'border-black hover:bg-gray-100 bg-white text-black'
                      }`}
                    >
                      <p className="text-[8px] font-black uppercase truncate">{item.name}</p>
                      <p className="text-[6px] font-bold uppercase opacity-80 mt-0.5">{item.size} • {item.type.toUpperCase()}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[8px] font-bold text-gray-400 uppercase py-1">
                <div className="h-[1px] bg-black/10 flex-1" />
                <span className="px-2">OR</span>
                <div className="h-[1px] bg-black/10 flex-1" />
              </div>

              {/* Option 2: Custom Document Form */}
              <div className="space-y-3">
                <label className="text-[8px] font-black uppercase text-muted-foreground tracking-wider block">
                  Option 2: Input Custom File Details
                </label>
                
                <div>
                  <span className="text-[7px] font-black uppercase block mb-1 text-black">Document Name</span>
                  <input
                    type="text"
                    placeholder="E.G. SCAN_REPORT.PDF"
                    value={customDocName}
                    onChange={(e) => setCustomDocName(e.target.value)}
                    className="wireframe-input py-1.5 text-[9px] uppercase font-bold text-black border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[7px] font-black uppercase block mb-1 text-black">File Type</span>
                    <select
                      value={customDocType}
                      onChange={(e) => setCustomDocType(e.target.value as any)}
                      className="wireframe-input py-1 text-[9px] uppercase font-bold text-black border-black bg-white"
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="image">PNG Image</option>
                      <option value="zip">ZIP Archive</option>
                      <option value="doc">Word Doc</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[7px] font-black uppercase block mb-1 text-black">File Size</span>
                    <input
                      type="text"
                      placeholder="1.5 MB"
                      value={customDocSize}
                      onChange={(e) => setCustomDocSize(e.target.value)}
                      className="wireframe-input py-1 text-[9px] uppercase font-bold text-black border-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t-2 border-black">
              <button
                onClick={() => {
                  setShowDirectUploadModal(false);
                  setCustomDocName('');
                }}
                className="flex-1 wireframe-button bg-white text-black border-black text-[9px] uppercase py-2 hover:bg-gray-100 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDirectUpload}
                disabled={!customDocName.trim()}
                className="flex-1 wireframe-button bg-black text-white border-black text-[9px] uppercase py-2 font-bold disabled:opacity-50 hover:bg-white hover:text-black transition-all"
              >
                Send Document <Send size={10} />
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
        {text && <div>{text}</div>}
        
        {document && (
          <div className={`mt-3 p-3 border-2 flex items-center justify-between gap-4 transition-all ${
            isSelf ? 'border-white bg-black text-white' : 'border-black bg-white text-black'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 border-2 flex items-center justify-center shrink-0 ${
                isSelf ? 'border-white' : 'border-black'
              }`}>
                {document.type === 'pdf' ? <FileText size={16} /> :
                 document.type === 'image' ? <Image size={16} /> :
                 <Paperclip size={16} />}
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase truncate">{document.name}</p>
                <p className="text-[7px] uppercase font-bold opacity-60 mt-0.5">{document.size}</p>
              </div>
            </div>
            
            <span className="text-[6px] font-black uppercase tracking-wider px-1.5 py-0.5 border border-dashed select-none opacity-80 border-current">
              Attached Document
            </span>
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
