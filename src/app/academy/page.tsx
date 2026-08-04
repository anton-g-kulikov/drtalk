"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { 
  GraduationCap, Star, PlayCircle, Users, Award, ArrowRight, Plus, 
  Search, ArrowLeft, ThumbsUp, MessageSquare, Paperclip, Lock, Globe,
  Download, User, ShieldAlert, Check, Share2, MoreVertical, Bold,
  Italic, Underline, Strikethrough, List, ListOrdered, Smile, Link as LinkIcon,
  Info, KeyRound, Building2, Sparkles, DollarSign
} from 'lucide-react';
import { useVerification } from '@/components/VerificationContext';
import { useRouter } from 'next/navigation';
import { LearningChannel, LearningTopic, LearningComment } from '@/types/learningHubTypes';
import CreateChannelDrawer from '@/components/prototype/CreateChannelDrawer';
import StripeCheckoutModal from '@/components/prototype/StripeCheckoutModal';
import StripeConnectScreen from '@/components/prototype/StripeConnectScreen';
import JoinCodeModal from '@/components/prototype/JoinCodeModal';
import ChannelInviteModal from '@/components/prototype/ChannelInviteModal';
import AccessDeniedModal from '@/components/prototype/AccessDeniedModal';

// Default initial learning channels
const INITIAL_CHANNELS: LearningChannel[] = [
  {
    id: 'csa_1',
    name: "CSA Champion's Circle",
    description: 'Exclusive discussion group for practice leaders and administrators.',
    type: 'private',
    category: 'Practice Admin Disc...',
    ownerBio: 'CSA Dental Network - Leading practice management and staffing insights.',
    sponsorName: 'Dental Designs',
    sponsorLogoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=120&auto=format&fit=crop&q=80',
    joinCode: 'CSA2026',
    isMonetized: false,
    subscriptionCost: 0,
    platformFee: 0,
    stripeFee: 0,
    totalCharge: 0,
    ceCreditsEnabled: false,
    onlyHostsCanPost: false,
    membersCount: 49,
    isJoined: true,
    posts: [
      {
        id: 't_csa_1',
        author: 'Stephanie Grauberger',
        authorRole: 'Host',
        title: 'Staffing Shortages and Retention',
        content: 'Strategies for retaining clinical team members in high-demand markets. Sharing our onboarding framework.',
        views: 16,
        likes: ['Dr. John Doe'],
        timestamp: '11/19/2025 12:00 AM',
        comments: []
      }
    ]
  },
  {
    id: '1',
    name: 'Advanced Implantology',
    description: 'Master class on soft tissue grafting and complex implant cases.',
    type: 'public',
    category: 'Study group',
    ownerBio: 'Dr. Michael Pikos - Expert in clinical implant training.',
    isMonetized: true,
    subscriptionCost: 49.00,
    platformFee: 6.86,
    stripeFee: 1.97,
    totalCharge: 57.83,
    ceCreditsEnabled: true,
    ceCreditHours: 12,
    onlyHostsCanPost: true,
    startDate: '2026-08-01',
    endDate: '2026-12-31',
    membersCount: 1200,
    isJoined: false,
    stripeConnected: true,
    posts: [
      {
        id: 't1_1',
        author: 'Dr. Michael Pikos',
        authorRole: 'Host',
        title: 'Soft Tissue Grafting Case Review',
        content: 'Sharing our clinical results for the bilateral grafting procedure performed last Tuesday. Patients recovery is on track.',
        views: 148,
        likes: ['Dr. John Doe'],
        timestamp: '2 days ago',
        attachments: [
          { name: 'bilateral_graft_xray.png', size: '2.4 MB', type: 'image' },
          { name: 'clinical_notes_pikos.pdf', size: '540 KB', type: 'pdf' }
        ],
        comments: [
          {
            id: 'tc_1',
            author: 'Dr. John Doe',
            authorRole: 'Member',
            text: 'Amazing density. Did you use PRF for this case?',
            timestamp: '1 day ago'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Digital Dentistry 101',
    description: 'Scanning techniques, CAD/CAM workflows, and 3D printing integration.',
    type: 'public',
    category: 'Virtual MRP',
    ownerBio: 'Medit Academy Team - Pushing the boundaries of digital workflows.',
    isMonetized: false,
    subscriptionCost: 0,
    platformFee: 0,
    stripeFee: 0,
    totalCharge: 0,
    ceCreditsEnabled: false,
    onlyHostsCanPost: false,
    membersCount: 3400,
    isJoined: false,
    posts: [
      {
        id: 't2_1',
        author: 'Medit Academy',
        authorRole: 'Host',
        title: 'Getting started with scanner calibration',
        content: 'Make sure you calibrate your Medit scanner at least once a week or after major temperature shifts to ensure 10-micron accuracy.',
        views: 314,
        likes: [],
        timestamp: '3 days ago',
        comments: [
          {
            id: 'tc_2',
            author: 'Dr. Sarah Lin',
            authorRole: 'Member',
            text: 'Very helpful, calibration solved our misalignment issues in bridge designs!',
            timestamp: '2 days ago'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Ethics in Oral Surgery',
    description: 'Earn 2.0 CE credits while discussing recent case studies and ethical dilemmas.',
    type: 'public',
    category: 'Case study',
    ownerBio: 'ADA Education Council.',
    isMonetized: true,
    subscriptionCost: 25.00,
    platformFee: 3.50,
    stripeFee: 1.15,
    totalCharge: 29.65,
    ceCreditsEnabled: true,
    ceCreditHours: 2.0,
    onlyHostsCanPost: true,
    membersCount: 850,
    isJoined: false,
    stripeConnected: true,
    posts: [
      {
        id: 't3_1',
        author: 'ADA Education',
        authorRole: 'Host',
        title: 'Case Study: Informed Consent Dilemmas',
        content: 'Reviewing a patient scenario where the treatment plan changed mid-surgery due to structural concerns. When is verbal consent sufficient?',
        views: 92,
        likes: [],
        timestamp: '5 days ago',
        comments: []
      }
    ]
  },
  {
    id: '4',
    name: 'Phoenix Endo Study Group',
    description: 'Monthly virtual meetings to review challenging endodontic cases.',
    type: 'private',
    category: 'Study group',
    ownerBio: 'Phoenix Dental Society.',
    isMonetized: false,
    subscriptionCost: 0,
    platformFee: 0,
    stripeFee: 0,
    totalCharge: 0,
    ceCreditsEnabled: false,
    onlyHostsCanPost: false,
    membersCount: 42,
    isJoined: false,
    posts: []
  }
];

export default function LearningHubPage() {
  const { userRole } = useVerification();
  const router = useRouter();

  // Core channels list state
  const [channels, setChannels] = useState<LearningChannel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  
  // Navigation / Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Case of the month' | 'Case study' | 'Study group' | 'Virtual MRP' | 'Other'>('All');
  
  // Right side active tab
  const [activeTab, setActiveTab] = useState<'discussions' | 'attachments' | 'details'>('discussions');
  
  // Focused topic details
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  
  // Comment, post entry states
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  
  // Dialog & Modal visibility states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [checkoutChannel, setCheckoutChannel] = useState<LearningChannel | null>(null);
  const [isJoinCodeOpen, setIsJoinCodeOpen] = useState(false);
  const [inviteChannel, setInviteChannel] = useState<LearningChannel | null>(null);
  const [accessDeniedState, setAccessDeniedState] = useState<{ isOpen: boolean; channelName?: string; reason?: string }>({ isOpen: false });
  const [topicSponsorName, setTopicSponsorName] = useState('');
  const [showTopicSponsorInput, setShowTopicSponsorInput] = useState(false);
  const [activeContextMenuId, setActiveContextMenuId] = useState<string | null>(null);
  
  // Load and save state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_learning_channels');
      let loadedChannels = INITIAL_CHANNELS;
      if (stored) {
        try {
          loadedChannels = JSON.parse(stored);
        } catch {
          loadedChannels = INITIAL_CHANNELS;
        }
      } else {
        localStorage.setItem('drtalk_learning_channels', JSON.stringify(INITIAL_CHANNELS));
      }
      setChannels(loadedChannels);
      
      // Auto-select first channel on load if none selected
      if (loadedChannels.length > 0) {
        const hosted = loadedChannels.filter(c => c.creatorId === 'my_practice');
        const joined = loadedChannels.filter(c => c.isJoined && c.creatorId !== 'my_practice');
        if (userRole !== 'individual' && hosted.length > 0) {
          setSelectedChannelId(hosted[0].id);
        } else if (joined.length > 0) {
          setSelectedChannelId(joined[0].id);
        }
      }
    }
  }, [userRole]);

  const saveChannels = (updated: LearningChannel[]) => {
    setChannels(updated);
    localStorage.setItem('drtalk_learning_channels', JSON.stringify(updated));
  };

  const selectedChannel = useMemo(() => {
    return channels.find(c => c.id === selectedChannelId) || null;
  }, [channels, selectedChannelId]);

  const selectedPost = useMemo(() => {
    if (!selectedChannel || !selectedPostId) return null;
    return selectedChannel.posts.find(p => p.id === selectedPostId) || null;
  }, [selectedChannel, selectedPostId]);

  // Calculations for categorized lists
  const filteredChannels = useMemo(() => {
    return channels.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [channels, searchQuery, activeCategory]);

  const hostedChannels = useMemo(() => filteredChannels.filter(c => c.creatorId === 'my_practice'), [filteredChannels]);
  const joinedChannels = useMemo(() => filteredChannels.filter(c => c.isJoined && c.creatorId !== 'my_practice'), [filteredChannels]);
  const discoverChannels = useMemo(() => filteredChannels.filter(c => !c.isJoined && c.creatorId !== 'my_practice'), [filteredChannels]);

  // Handlers
  const handleCreateChannel = (data: Omit<LearningChannel, 'id' | 'posts' | 'membersCount'>) => {
    const newChan: LearningChannel = {
      ...data,
      id: `chan_${Date.now()}`,
      posts: [],
      membersCount: 1,
      isJoined: true, // Creator joins automatically
      creatorId: 'my_practice'
    };
    const updated = [...channels, newChan];
    saveChannels(updated);
    setSelectedChannelId(newChan.id);
    setSelectedPostId(null);
    setActiveTab('discussions');
  };

  const handleJoinChannelClick = (channel: LearningChannel) => {
    if (channel.isMonetized && !channel.isJoined) {
      setCheckoutChannel(channel);
    } else {
      // Free or already joined
      const updated = channels.map(c => {
        if (c.id === channel.id) {
          return { ...c, isJoined: true, membersCount: c.membersCount + 1 };
        }
        return c;
      });
      saveChannels(updated);
      setSelectedChannelId(channel.id);
      setSelectedPostId(null);
      setActiveTab('discussions');
    }
  };

  const handleStripeCheckoutSuccess = () => {
    if (!checkoutChannel) return;
    const updated = channels.map(c => {
      if (c.id === checkoutChannel.id) {
        return { ...c, isJoined: true, membersCount: c.membersCount + 1 };
      }
      return c;
    });
    saveChannels(updated);
    setSelectedChannelId(checkoutChannel.id);
    setSelectedPostId(null);
    setActiveTab('discussions');
    setCheckoutChannel(null);
  };

  const handleLeaveChannel = () => {
    if (!selectedChannel) return;
    const updated = channels.map(c => {
      if (c.id === selectedChannel.id) {
        return { ...c, isJoined: false, membersCount: Math.max(0, c.membersCount - 1) };
      }
      return c;
    });
    saveChannels(updated);
    setSelectedPostId(null);
  };

  const handleConnectStripe = () => {
    if (!selectedChannel) return;
    const updated = channels.map(c => {
      if (c.id === selectedChannel.id) {
        return { ...c, stripeConnected: true };
      }
      return c;
    });
    saveChannels(updated);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel || !newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: LearningTopic = {
      id: `post_${Date.now()}`,
      author: userRole === 'owner' ? 'My Practice' : 'User Account',
      authorRole: 'Host',
      title: newPostTitle,
      content: newPostContent,
      views: 1,
      likes: [],
      timestamp: 'Just now',
      comments: [],
      topicSponsor: topicSponsorName.trim() ? { name: topicSponsorName.trim() } : undefined
    };

    const updated = channels.map(c => {
      if (c.id === selectedChannel.id) {
        return { ...c, posts: [newPost, ...c.posts] };
      }
      return c;
    });

    saveChannels(updated);
    setNewPostTitle('');
    setNewPostContent('');
    setTopicSponsorName('');
    setShowTopicSponsorInput(false);
  };

  const handleJoinByCodeSuccess = (channelId: string) => {
    const updated = channels.map(c => {
      if (c.id === channelId) {
        return { ...c, isJoined: true, membersCount: c.membersCount + 1 };
      }
      return c;
    });
    saveChannels(updated);
    setSelectedChannelId(channelId);
    setSelectedPostId(null);
    setActiveTab('discussions');
  };

  const handleLikePost = (postId: string) => {
    if (!selectedChannel) return;
    
    const updated = channels.map(c => {
      if (c.id === selectedChannel.id) {
        const posts = c.posts.map(p => {
          if (p.id === postId) {
            const hasLiked = p.likes.includes('You');
            const likes = hasLiked 
              ? p.likes.filter(l => l !== 'You')
              : [...p.likes, 'You'];
            return { ...p, likes };
          }
          return p;
        });
        return { ...c, posts };
      }
      return c;
    });
    saveChannels(updated);
  };

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel || !selectedPostId || !newCommentText.trim()) return;

    const newComment: LearningComment = {
      id: `comment_${Date.now()}`,
      author: 'You',
      authorRole: 'Member',
      text: newCommentText,
      timestamp: 'Just now'
    };

    const updated = channels.map(c => {
      if (c.id === selectedChannel.id) {
        const posts = c.posts.map(p => {
          if (p.id === selectedPostId) {
            return { ...p, comments: [...p.comments, newComment] };
          }
          return p;
        });
        return { ...c, posts };
      }
      return c;
    });

    saveChannels(updated);
    setNewCommentText('');
  };

  const isHost = userRole === 'owner' || userRole === 'admin';

  return (
    <MainLayout title="Learning Hub">
      <div className="flex h-[calc(100vh-80px)] border-2 border-black -m-4 sm:-m-6 md:-m-10 bg-white">
        
        {/* Left Panel: Channels List & Search */}
        <div className="w-80 border-r-2 border-black flex flex-col h-full bg-white shrink-0">
          {/* Header & Search */}
          <div className="p-4 border-b-2 border-black space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                Learning Hub
                <CommentMarker id="learning-hub-nav" title="Learning Channels" description="Explore educational workspaces." />
              </h3>
              {isHost && (
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="p-1 border-2 border-black hover:bg-black hover:text-white transition-colors"
                  title="Create Channel"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              )}
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-[10px] uppercase font-bold pr-8 wireframe-input"
              />
              <Search size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category selection */}
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value as any)}
              className="w-full text-[9px] uppercase font-black wireframe-input cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Case of the month">Case of the month</option>
              <option value="Case study">Case study</option>
              <option value="Study group">Study group</option>
              <option value="Virtual MRP">Virtual MRP</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y-2 divide-black">
            
            {/* My hosted channels */}
            {userRole !== 'individual' && hostedChannels.length > 0 && (
              <div className="p-2 space-y-1">
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1">My hosted channels</p>
                {hostedChannels.map(chan => (
                  <button
                    key={chan.id}
                    onClick={() => {
                      setSelectedChannelId(chan.id);
                      setSelectedPostId(null);
                      setActiveTab('discussions');
                    }}
                    className={`w-full flex items-center justify-between p-2 text-left text-[10px] uppercase font-black transition-all ${
                      selectedChannelId === chan.id ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1">
                        <span className="truncate">{chan.name}</span>
                        {chan.ceCreditsEnabled && (
                          <span className={`text-[6px] px-1 font-black leading-none ${
                            selectedChannelId === chan.id ? 'bg-white text-black' : 'bg-black text-white'
                          }`}>
                            CE {chan.ceCreditHours} hrs
                          </span>
                        )}
                      </div>
                      <p className={`text-[7px] truncate font-medium mt-0.5 ${
                        selectedChannelId === chan.id ? 'text-gray-400' : 'text-muted-foreground'
                      }`}>
                        {chan.description}
                      </p>
                    </div>
                    {chan.isMonetized && (
                      <span className={`text-[7px] font-black border px-1 ${
                        selectedChannelId === chan.id ? 'border-white text-white' : 'border-black text-black'
                      }`}>
                        PAID
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Subscribed channels */}
            {joinedChannels.length > 0 && (
              <div className="p-2 space-y-1">
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1">Subscribed channels</p>
                {joinedChannels.map(chan => (
                  <button
                    key={chan.id}
                    onClick={() => {
                      setSelectedChannelId(chan.id);
                      setSelectedPostId(null);
                      setActiveTab('discussions');
                    }}
                    className={`w-full flex items-center justify-between p-2 text-left text-[10px] uppercase font-black transition-all ${
                      selectedChannelId === chan.id ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1">
                        <span className="truncate">{chan.name}</span>
                        {chan.ceCreditsEnabled && (
                          <span className={`text-[6px] px-1 font-black leading-none ${
                            selectedChannelId === chan.id ? 'bg-white text-black' : 'bg-black text-white'
                          }`}>
                            CE {chan.ceCreditHours} hrs
                          </span>
                        )}
                      </div>
                      <p className={`text-[7px] truncate font-medium mt-0.5 ${
                        selectedChannelId === chan.id ? 'text-gray-400' : 'text-muted-foreground'
                      }`}>
                        {chan.description}
                      </p>
                    </div>
                    {chan.isMonetized && (
                      <span className={`text-[7px] font-black border px-1 ${
                        selectedChannelId === chan.id ? 'border-white text-white' : 'border-black text-black'
                      }`}>
                        PAID
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Discover channels */}
            {discoverChannels.length > 0 && (
              <div className="p-2 space-y-1">
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1">Discover channels</p>
                {discoverChannels.map(chan => (
                  <button
                    key={chan.id}
                    onClick={() => {
                      setSelectedChannelId(chan.id);
                      setSelectedPostId(null);
                      setActiveTab('discussions');
                    }}
                    className={`w-full flex items-center justify-between p-2 text-left text-[10px] uppercase font-black transition-all ${
                      selectedChannelId === chan.id ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <span className="truncate">{chan.name}</span>
                      <p className={`text-[7px] truncate font-medium mt-0.5 ${
                        selectedChannelId === chan.id ? 'text-gray-400' : 'text-muted-foreground'
                      }`}>
                        {chan.description}
                      </p>
                    </div>
                    <span className={`text-[7px] font-black border px-1 shrink-0 ${
                      selectedChannelId === chan.id 
                        ? 'border-white text-white bg-transparent' 
                        : 'border-black text-black bg-gray-50'
                    }`}>
                      {chan.isMonetized ? `$${chan.subscriptionCost.toFixed(0)}/MO` : 'FREE'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {hostedChannels.length === 0 && joinedChannels.length === 0 && discoverChannels.length === 0 && (
              <div className="p-8 text-center text-xs uppercase font-bold text-muted-foreground">
                No channels found
              </div>
            )}
          </div>

          {/* Join channel via code banner (Slide 2) */}
          <div className="p-3 border-t-2 border-black bg-amber-50 shrink-0">
            <button
              onClick={() => setIsJoinCodeOpen(true)}
              className="w-full wireframe-button bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-950 text-[10px] font-black uppercase py-2.5 px-3 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <span className="flex items-center gap-2">
                <GraduationCap size={15} className="text-amber-800" />
                Join channel via code
              </span>
              <Info size={13} className="opacity-70" />
            </button>
          </div>
        </div>

        {/* Right Panel: Content Area */}
        <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-y-auto">
          {selectedChannel ? (
            <>
              {/* Channel Header Details */}
              <div className="p-6 bg-white border-b-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-black uppercase tracking-tight">{selectedChannel.name}</h2>
                    <span className="text-[7px] font-bold border-2 border-black px-1.5 py-0.5 bg-gray-50 uppercase">
                      {selectedChannel.category}
                    </span>
                    
                    {/* Channel Sponsor Badge (Slide 7) */}
                    {(selectedChannel.sponsorName || selectedChannel.sponsorLogoUrl) && (
                      <div className="flex items-center gap-1 bg-gray-100 border border-black px-2 py-0.5 text-[8px] font-black uppercase">
                        <span className="text-[7px] text-muted-foreground">Channel Sponsor</span>
                        {selectedChannel.sponsorLogoUrl ? (
                          <img src={selectedChannel.sponsorLogoUrl} alt={selectedChannel.sponsorName || 'Sponsor'} className="h-4 w-auto object-contain rounded-xs" />
                        ) : (
                          <span className="font-black text-black">{selectedChannel.sponsorName}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">
                    Hosted by {selectedChannel.ownerBio?.split('-')[0] || 'Practice Owner'} • {selectedChannel.membersCount} subscribers
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Invite Button (Slide 6) */}
                  <button
                    onClick={() => setInviteChannel(selectedChannel)}
                    className="wireframe-button border-black hover:bg-black hover:text-white text-[9px] uppercase py-2 px-3 flex items-center gap-1.5 font-bold"
                    title="Invite to Channel"
                  >
                    <Share2 size={12} /> Invite
                  </button>

                  {selectedChannel.isJoined ? (
                    <button
                      onClick={handleLeaveChannel}
                      className="wireframe-button border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-[9px] uppercase py-2 px-4"
                    >
                      Unsubscribe
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinChannelClick(selectedChannel)}
                      className="wireframe-button bg-black text-white text-[9px] uppercase py-2 px-4"
                    >
                      {selectedChannel.isMonetized ? `Subscribe - $${selectedChannel.totalCharge}/mo` : 'Join Channel'}
                    </button>
                  )}
                </div>
              </div>

              {/* Channel Tabs */}
              {selectedChannel.isJoined && (
                <div className="flex bg-white border-b-2 border-black p-1">
                  <button
                    onClick={() => { setActiveTab('discussions'); setSelectedPostId(null); }}
                    className={`px-4 py-2 text-[9px] font-black uppercase transition-all ${
                      activeTab === 'discussions' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    Discussions
                  </button>
                  <button
                    onClick={() => { setActiveTab('attachments'); }}
                    className={`px-4 py-2 text-[9px] font-black uppercase transition-all ${
                      activeTab === 'attachments' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    Attachments
                  </button>
                  <button
                    onClick={() => { setActiveTab('details'); }}
                    className={`px-4 py-2 text-[9px] font-black uppercase transition-all ${
                      activeTab === 'details' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    Channel Details
                  </button>
                </div>
              )}

              {/* Main Panel Content Switching */}
              {!selectedChannel.isJoined ? (
                /* Pre-Joining Splash Screen */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto space-y-6">
                  <div className="w-16 h-16 border-2 border-black flex items-center justify-center rounded-full bg-white">
                    {selectedChannel.isMonetized ? <Lock size={28} /> : <Globe size={28} />}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-md font-black uppercase tracking-tight">Join this Educational Channel</h3>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed">
                      {selectedChannel.description}
                    </p>
                  </div>

                  {selectedChannel.ceCreditsEnabled && (
                    <div className="flex items-center gap-2 border-2 border-black bg-white px-3 py-1.5 text-[9px] font-black uppercase">
                      <Award size={14} /> Earns {selectedChannel.ceCreditHours} hours CE Credit
                    </div>
                  )}

                  <div className="border border-black p-4 bg-white text-left w-full space-y-2">
                    <h4 className="text-[8px] font-black uppercase text-muted-foreground tracking-wider">Channel details</h4>
                    <p className="text-[9px] font-bold uppercase"><span className="text-muted-foreground">Host Bio:</span> {selectedChannel.ownerBio || 'No Bio Provided'}</p>
                    <p className="text-[9px] font-bold uppercase"><span className="text-muted-foreground">Cost:</span> {selectedChannel.isMonetized ? `$${selectedChannel.subscriptionCost.toFixed(2)}/month` : 'Free Access'}</p>
                  </div>

                  <button
                    onClick={() => handleJoinChannelClick(selectedChannel)}
                    className="w-full wireframe-button bg-black text-white text-[10px] uppercase py-3 flex items-center justify-center gap-2"
                  >
                    {selectedChannel.isMonetized ? `Pay and Subscribe ($${selectedChannel.totalCharge}/mo)` : 'Join for Free'}
                  </button>
                </div>
              ) : selectedChannel.isMonetized && !selectedChannel.stripeConnected && isHost ? (
                /* Stripe Connect Screen for Owners */
                <StripeConnectScreen channelName={selectedChannel.name} onConnect={handleConnectStripe} />
              ) : (
                /* Subscribed Active Content Views */
                <div className="flex-1 p-6 space-y-6">
                  
                  {activeTab === 'discussions' && (
                    <>
                      {selectedPostId && selectedPost ? (
                        /* Single Topic Discussion Detail View */
                        <div className="space-y-6 max-w-2xl mx-auto">
                          
                          {/* Back Link */}
                          <button
                            onClick={() => setSelectedPostId(null)}
                            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider hover:underline"
                          >
                            <ArrowLeft size={14} /> Back to Discussions
                          </button>

                          {/* Post Card */}
                          <div className="wireframe-card bg-white p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 border border-black bg-gray-50 flex items-center justify-center font-black uppercase text-xs">
                                  {selectedPost.author.slice(0,2)}
                                </div>
                                <div>
                                  <h4 className="text-[10px] font-black uppercase">{selectedPost.author}</h4>
                                  <p className="text-[8px] text-muted-foreground uppercase font-bold">{selectedPost.timestamp}</p>
                                </div>
                              </div>
                              <span className="text-[7px] border border-black bg-gray-50 px-1 font-bold uppercase">{selectedPost.views} Views</span>
                            </div>

                            <div className="space-y-2">
                              <h3 className="text-xs font-black uppercase tracking-tight">{selectedPost.title}</h3>
                              <p className="text-[10px] uppercase leading-relaxed font-bold opacity-80">{selectedPost.content}</p>
                            </div>

                            {/* Attachments list */}
                            {selectedPost.attachments && selectedPost.attachments.length > 0 && (
                              <div className="border-t border-black border-dashed pt-3 mt-3 space-y-2">
                                <p className="text-[8px] font-black uppercase text-muted-foreground tracking-wider">Attachments</p>
                                {selectedPost.attachments.map((file, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-gray-50 border border-black p-2 text-[8px] font-bold uppercase">
                                    <span className="truncate">{file.name} ({file.size})</span>
                                    <button className="p-1 border border-black hover:bg-black hover:text-white transition-colors">
                                      <Download size={10} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Actions bar */}
                            <div className="border-t border-black border-dashed pt-3 flex items-center gap-4">
                              <button
                                onClick={() => handleLikePost(selectedPost.id)}
                                className={`flex items-center gap-1 text-[9px] uppercase font-bold ${
                                  selectedPost.likes.includes('You') ? 'text-black font-black' : 'text-muted-foreground'
                                }`}
                              >
                                <ThumbsUp size={12} /> Like {selectedPost.likes.length > 0 && `(${selectedPost.likes.length})`}
                              </button>
                            </div>
                          </div>

                          {/* Comments List */}
                          <div className="space-y-4">
                            <h4 className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                              Comments ({selectedPost.comments.length})
                            </h4>

                            <div className="space-y-3">
                              {selectedPost.comments.map(comment => (
                                <div key={comment.id} className="wireframe-card bg-white p-4 space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase">{comment.author}</span>
                                    <span className="text-[7px] text-muted-foreground font-bold uppercase">{comment.timestamp}</span>
                                  </div>
                                  <p className="text-[10px] uppercase font-bold leading-relaxed">{comment.text}</p>
                                </div>
                              ))}

                              {selectedPost.comments.length === 0 && (
                                <p className="text-[9px] uppercase font-bold text-muted-foreground text-center py-4">No comments yet. Write the first one below!</p>
                              )}
                            </div>

                            {/* Write comment composer */}
                            <form onSubmit={handleCreateComment} className="wireframe-card bg-white p-4 space-y-3">
                              <label className="text-[8px] font-black uppercase text-muted-foreground tracking-wider block">Write a comment</label>
                              <textarea
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                placeholder="Type your comment..."
                                className="wireframe-input text-xs font-bold h-16 resize-none"
                                required
                              />
                              <div className="flex justify-end">
                                <button type="submit" className="wireframe-button bg-black text-white text-[9px] uppercase py-1.5 px-4">
                                  Comment
                                </button>
                              </div>
                            </form>
                          </div>

                        </div>
                      ) : (
                        /* Feed of Topics */
                        <div className="space-y-6 max-w-2xl mx-auto">
                          
                          {/* Main Topics stream */}
                          <div className="space-y-4">
                            {selectedChannel.posts.map(topic => (
                              <div
                                key={topic.id}
                                className="wireframe-card bg-white p-5 space-y-4 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 border border-black bg-gray-50 flex items-center justify-center font-black uppercase text-xs">
                                      {topic.author.slice(0,2)}
                                    </div>
                                    <div>
                                      <h4 className="text-[10px] font-black uppercase">{topic.author}</h4>
                                      <p className="text-[8px] text-muted-foreground uppercase font-bold">{topic.timestamp}</p>
                                    </div>
                                  </div>
                                  <span className="text-[7px] border border-black bg-gray-50 px-1 font-bold uppercase">{topic.views} Views</span>
                                </div>

                                <div className="space-y-1">
                                  <h3 className="text-xs font-black uppercase tracking-tight">{topic.title}</h3>
                                  <p className="text-[10px] uppercase leading-relaxed font-bold opacity-80 line-clamp-3">{topic.content}</p>
                                </div>

                                <div className="border-t border-black border-dashed pt-3 flex items-center justify-between">
                                  <button
                                    onClick={() => handleLikePost(topic.id)}
                                    className={`flex items-center gap-1.5 text-[9px] uppercase font-bold ${
                                      topic.likes.includes('You') ? 'text-black font-black' : 'text-muted-foreground'
                                    }`}
                                  >
                                    <ThumbsUp size={12} /> Like {topic.likes.length > 0 && `(${topic.likes.length})`}
                                  </button>

                                  <button
                                    onClick={() => setSelectedPostId(topic.id)}
                                    className="flex items-center gap-1.5 text-[9px] uppercase font-black hover:underline"
                                  >
                                    <MessageSquare size={12} /> Comments ({topic.comments.length})
                                  </button>
                                </div>
                              </div>
                            ))}

                            {selectedChannel.posts.length === 0 && (
                              <div className="wireframe-card border-dashed p-8 text-center text-xs uppercase font-bold text-muted-foreground">
                                No topics in this channel yet
                              </div>
                            )}
                          </div>

                          {/* New Topic Composer (Slide 8 rich text toolbar & tools) */}
                          {(!selectedChannel.onlyHostsCanPost || isHost) ? (
                            <form onSubmit={handleCreatePost} className="wireframe-card bg-white p-5 space-y-4">
                              <h3 className="text-[9px] font-black uppercase tracking-wider border-b border-black pb-1">Create new topic</h3>
                              
                              <div className="space-y-1">
                                <label className="text-[8px] font-black uppercase tracking-wider block text-muted-foreground">Subject</label>
                                <input
                                  type="text"
                                  placeholder="Topic title..."
                                  value={newPostTitle}
                                  onChange={(e) => setNewPostTitle(e.target.value)}
                                  className="wireframe-input text-xs font-bold"
                                  required
                                />
                              </div>

                              {/* Rich Text Formatting Toolbar (Slide 8) */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <label className="text-[8px] font-black uppercase tracking-wider block text-muted-foreground">Body Content</label>
                                  {/* Formatting options toolbar */}
                                  <div className="flex items-center gap-1 border border-black p-1 bg-gray-50">
                                    <button type="button" className="p-1 hover:bg-black hover:text-white transition-colors" title="Bold"><Bold size={11} /></button>
                                    <button type="button" className="p-1 hover:bg-black hover:text-white transition-colors" title="Italic"><Italic size={11} /></button>
                                    <button type="button" className="p-1 hover:bg-black hover:text-white transition-colors" title="Underline"><Underline size={11} /></button>
                                    <button type="button" className="p-1 hover:bg-black hover:text-white transition-colors" title="Strikethrough"><Strikethrough size={11} /></button>
                                    <span className="w-px h-3 bg-black/30 mx-0.5" />
                                    <button type="button" className="p-1 hover:bg-black hover:text-white transition-colors" title="Insert Link"><LinkIcon size={11} /></button>
                                    <button type="button" className="p-1 hover:bg-black hover:text-white transition-colors" title="Bullet List"><List size={11} /></button>
                                    <button type="button" className="p-1 hover:bg-black hover:text-white transition-colors" title="Numbered List"><ListOrdered size={11} /></button>
                                  </div>
                                </div>

                                <textarea
                                  placeholder="Type here..."
                                  value={newPostContent}
                                  onChange={(e) => setNewPostContent(e.target.value)}
                                  className="wireframe-input text-xs font-bold h-24 resize-none"
                                  required
                                />
                              </div>

                              {/* Topic Sponsor input toggle */}
                              {showTopicSponsorInput && (
                                <div className="space-y-1 bg-purple-50 p-2.5 border border-purple-900">
                                  <label className="text-[8px] font-black uppercase tracking-wider block text-purple-900">Topic Sponsor Name</label>
                                  <input
                                    type="text"
                                    placeholder="Enter topic sponsor (e.g. Medit, Straumann)"
                                    value={topicSponsorName}
                                    onChange={(e) => setTopicSponsorName(e.target.value)}
                                    className="wireframe-input text-xs font-bold bg-white"
                                  />
                                </div>
                              )}

                              {/* Bottom tools toolbar (Slide 8) */}
                              <div className="flex justify-between items-center pt-2 border-t border-black/10">
                                <div className="flex items-center gap-2">
                                  <button type="button" className="p-1.5 border border-black hover:bg-black hover:text-white transition-colors" title="Emoji">
                                    <Smile size={13} />
                                  </button>
                                  <button type="button" className="p-1.5 border border-black hover:bg-black hover:text-white transition-colors" title="Attach Files">
                                    <Paperclip size={13} />
                                  </button>
                                  <button type="button" className="p-1.5 border border-black hover:bg-black hover:text-white transition-colors" title="Add Link">
                                    <LinkIcon size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setShowTopicSponsorInput(!showTopicSponsorInput)}
                                    className={`text-[8px] font-black uppercase px-2 py-1 border border-black transition-colors ${
                                      showTopicSponsorInput ? 'bg-purple-900 text-white' : 'hover:bg-black hover:text-white'
                                    }`}
                                  >
                                    + Add topic sponsor
                                  </button>
                                </div>

                                <button type="submit" className="wireframe-button bg-black text-white text-[9px] uppercase py-2 px-6 font-black">
                                  Create Topic
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="wireframe-card border-dashed p-4 flex items-center justify-center gap-2 bg-yellow-50/50 border-yellow-700 text-yellow-800 text-[8px] font-black uppercase">
                              <ShieldAlert size={14} /> Only hosts and co-hosts can create topics in this channel
                            </div>
                          )}

                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'attachments' && (
                    <div className="space-y-4 max-w-2xl mx-auto">
                      <h3 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">All Attachments</h3>
                      
                      <div className="space-y-2">
                        {selectedChannel.posts.flatMap(p => p.attachments || []).map((file, idx) => (
                          <div key={idx} className="wireframe-card bg-white p-4 flex justify-between items-center text-[10px] font-black uppercase">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 border border-black bg-gray-50 flex items-center justify-center">
                                <Paperclip size={14} />
                              </div>
                              <div>
                                <h4>{file.name}</h4>
                                <p className="text-[8px] text-muted-foreground font-bold">{file.size}</p>
                              </div>
                            </div>
                            <button className="wireframe-button text-[8px] uppercase py-1 px-3">
                              Download
                            </button>
                          </div>
                        ))}

                        {selectedChannel.posts.flatMap(p => p.attachments || []).length === 0 && (
                          <p className="text-[9px] uppercase font-bold text-muted-foreground text-center py-8">No attachments found in this channel.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'details' && (
                    <div className="space-y-4 max-w-2xl mx-auto">
                      <div className="wireframe-card bg-white p-6 space-y-4">
                        <h3 className="text-xs font-black uppercase border-b border-black pb-2">About This Channel</h3>
                        
                        <div className="space-y-3 text-[10px] font-bold uppercase leading-relaxed">
                          <p><span className="text-muted-foreground">Description:</span> {selectedChannel.description}</p>
                          <p><span className="text-muted-foreground">Category:</span> {selectedChannel.category}</p>
                          <p><span className="text-muted-foreground">Type:</span> {selectedChannel.type} access</p>
                          <p><span className="text-muted-foreground">Subscribers:</span> {selectedChannel.membersCount}</p>
                          <p><span className="text-muted-foreground">Host Bio:</span> {selectedChannel.ownerBio || 'No Host Bio'}</p>
                          {selectedChannel.startDate && <p><span className="text-muted-foreground">Start Date:</span> {selectedChannel.startDate}</p>}
                          {selectedChannel.endDate && <p><span className="text-muted-foreground">End Date:</span> {selectedChannel.endDate}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </>
          ) : (
            /* Splash view when no channel is selected */
            (hostedChannels.length === 0 && joinedChannels.length === 0) ? (
              userRole === 'individual' ? (
                <div className="flex-1 p-8 max-w-4xl mx-auto space-y-8 w-full flex flex-col justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 border-2 border-black flex items-center justify-center rounded-full bg-white mx-auto">
                      <GraduationCap size={32} className="text-black" />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight italic">Welcome to the Learning Hub</h2>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed max-w-md mx-auto">
                      You have not subscribed to any learning channels yet. Discover public or paid channels below to join discussions, earn CE credits, and learn from experts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {discoverChannels.map(chan => (
                      <div key={chan.id} className="wireframe-card bg-white p-5 flex flex-col justify-between space-y-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start">
                            <h4 className="text-[10px] font-black uppercase truncate pr-2">{chan.name}</h4>
                            <span className="text-[7px] border border-black bg-gray-50 px-1 font-bold uppercase shrink-0">
                              {chan.isMonetized ? `$${chan.subscriptionCost.toFixed(0)}/MO` : 'FREE'}
                            </span>
                          </div>
                          <p className="text-[9px] uppercase font-bold text-muted-foreground line-clamp-2 leading-relaxed">
                            {chan.description}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-black border-dashed">
                          {chan.ceCreditsEnabled ? (
                            <span className="text-[7px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                              <Award size={10} /> {chan.ceCreditHours} hrs CE
                            </span>
                          ) : (
                            <span />
                          )}
                          <button
                            onClick={() => handleJoinChannelClick(chan)}
                            className="wireframe-button bg-black text-white text-[8px] uppercase py-1 px-3"
                          >
                            Join Channel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 p-8 max-w-4xl mx-auto space-y-8 w-full flex flex-col justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 border-2 border-black flex items-center justify-center rounded-full bg-white mx-auto">
                      <GraduationCap size={32} className="text-black" />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight italic">Learning Hub for Practices</h2>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed max-w-md mx-auto">
                      Grow your audience, publish clinical case reviews, and offer paid Continuing Education (CE) channels. You haven't joined or created any channels yet.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="wireframe-card bg-white p-5 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h4 className="text-[9px] font-black uppercase border-b border-black pb-1">1. Host & Publish</h4>
                        <p className="text-[8px] uppercase font-bold text-muted-foreground leading-relaxed">
                          Create public or private educational channels. Share surgical steps, tech reviews, or local study club materials.
                        </p>
                      </div>
                    </div>
                    <div className="wireframe-card bg-white p-5 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h4 className="text-[9px] font-black uppercase border-b border-black pb-1">2. Offer CE Credits</h4>
                        <p className="text-[8px] uppercase font-bold text-muted-foreground leading-relaxed">
                          Define custom credit hours for your lectures or articles. Automatically track user participation to reward CE hours.
                        </p>
                      </div>
                    </div>
                    <div className="wireframe-card bg-white p-5 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h4 className="text-[9px] font-black uppercase border-b border-black pb-1">3. Monetize Channels</h4>
                        <p className="text-[8px] uppercase font-bold text-muted-foreground leading-relaxed">
                          Set subscription pricing and link your Stripe account. Subscriptions are direct, safe, and automated.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 border-t border-black border-dashed pt-6">
                    <button
                      onClick={() => setIsCreateOpen(true)}
                      className="wireframe-button bg-black text-white text-[10px] uppercase py-3 px-8 font-black hover:bg-white hover:text-black transition-all"
                    >
                      Create Your First Channel
                    </button>
                    <p className="text-[8px] uppercase font-bold text-muted-foreground">
                      or choose one of the recommended channels in the sidebar to subscribe as a learner.
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 border-2 border-black flex items-center justify-center rounded-full bg-white">
                  <GraduationCap size={42} className="text-black" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-black uppercase tracking-tight italic">Welcome to the Learning Hub</h2>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed">
                    Select a channel from the sidebar or discover new ones to view discussions and learning resources.
                  </p>
                </div>
                
                <div className="w-full border-t border-black border-dashed pt-4">
                  <p className="text-[8px] font-black uppercase text-muted-foreground tracking-wider mb-2">Selected role profile</p>
                  <div className="bg-white border-2 border-black p-3 text-[9px] uppercase font-black flex items-center justify-between">
                    <span>Current Role: {userRole || 'Loading...'}</span>
                    {isHost ? (
                      <span className="text-green-700 bg-green-50 px-1 border border-green-500">Can Publish</span>
                    ) : (
                      <span className="text-blue-700 bg-blue-50 px-1 border border-blue-500">Learner View</span>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Slide Drawers & Modals */}
      <CreateChannelDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateChannel}
      />

      <StripeCheckoutModal
        isOpen={checkoutChannel !== null}
        onClose={() => setCheckoutChannel(null)}
        channel={checkoutChannel}
        onSuccess={handleStripeCheckoutSuccess}
      />

      <JoinCodeModal
        isOpen={isJoinCodeOpen}
        onClose={() => setIsJoinCodeOpen(false)}
        channels={channels}
        onJoinSuccess={handleJoinByCodeSuccess}
      />

      <ChannelInviteModal
        isOpen={inviteChannel !== null}
        onClose={() => setInviteChannel(null)}
        channel={inviteChannel}
      />

      <AccessDeniedModal
        isOpen={accessDeniedState.isOpen}
        onClose={() => setAccessDeniedState({ isOpen: false })}
        channelName={accessDeniedState.channelName}
        reason={accessDeniedState.reason}
      />
    </MainLayout>
  );
}
