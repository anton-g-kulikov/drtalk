"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, MessageSquare, ArrowUpRight, 
  TrendingUp, Users, FileText, Send, Search, Clock, Plus, GraduationCap,
  Upload, X, Eye, Paperclip, Image, Lock
} from 'lucide-react';

import { useVerification } from '@/components/VerificationContext';
import { 
  initialDocuments, 
  initialMessages, 
  mockChannels, 
  SharedDocument, 
  MessageItem 
} from '@/app/channels/page';

type SentReferralStatus = 'Draft' | 'Sent' | 'Accepted' | 'Scheduled' | 'In Progress' | 'Completed';

interface SentReferral {
  id: string;
  patientName: string;
  specialist: string;
  type: string;
  status: SentReferralStatus;
  lastUpdate: string;
  nextStep: string;
}

const sentReferrals: SentReferral[] = [
  {
    id: 'D-1001',
    patientName: 'Alice Cooper',
    specialist: 'Valley Endodontics',
    type: 'Endodontic Consultation',
    status: 'Accepted',
    lastUpdate: '10:05 AM\n05/11/2026',
    nextStep: 'Specialist scheduling patient',
  },
  {
    id: 'D-1002',
    patientName: 'Marco Reyes',
    specialist: 'Downtown Oral Surgery',
    type: 'Extraction Evaluation',
    status: 'Sent',
    lastUpdate: '08:20 AM\n05/11/2026',
    nextStep: 'Waiting for specialist review',
  },
  {
    id: 'D-1003',
    patientName: 'Nina Patel',
    specialist: 'Arizona Periodontics',
    type: 'Periodontal Surgery',
    status: 'Scheduled',
    lastUpdate: '10:20 AM\n05/10/2026',
    nextStep: 'Appointment confirmed for Tuesday',
  },
  {
    id: 'D-1004',
    patientName: 'John Doe',
    specialist: 'Metro Orthodontics',
    type: 'Braces Consultation',
    status: 'Completed',
    lastUpdate: '10:20 AM\n05/08/2026',
    nextStep: 'Case closed. Outcome report received.',
  },
];

import { CommentMarker } from "@/components/Comments/CommentMarker";

export default function DentistDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { isVerified, hasPracticeOwner } = useVerification();

  // Send Document Modal State
  const [isSendDocOpen, setIsSendDocOpen] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState('');
  const [selectedReferral, setSelectedReferral] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastAction, setToastAction] = useState<{ label: string; onClick: () => void } | null>(null);
  
  // Direct Upload State Form
  const [customDocName, setCustomDocName] = useState('');
  const [customDocType, setCustomDocType] = useState<'pdf' | 'image' | 'zip' | 'doc'>('pdf');
  const [customDocSize, setCustomDocSize] = useState('1.5 MB');
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  const triggerToast = (msg: string, action?: { label: string; onClick: () => void }) => {
    setToastMessage(msg);
    setToastAction(action || null);
    setTimeout(() => {
      setToastMessage(null);
      setToastAction(null);
    }, 6000);
  };

  const connectedPractices = React.useMemo(() => {
    return mockChannels.filter(c => c.type === 'inter-practice');
  }, []);

  const filteredReferralsForDoc = React.useMemo(() => {
    if (!selectedPractice) return sentReferrals;
    return sentReferrals.filter(r => r.specialist === selectedPractice);
  }, [selectedPractice]);

  const handleSelectReferral = (refId: string) => {
    setSelectedReferral(refId);
    if (refId) {
      const ref = sentReferrals.find(r => r.id === refId);
      if (ref) {
        setSelectedPractice(ref.specialist);
      }
    }
  };

  const handleSelectPractice = (practiceName: string) => {
    setSelectedPractice(practiceName);
    if (practiceName && selectedReferral) {
      const ref = sentReferrals.find(r => r.id === selectedReferral);
      if (ref && ref.specialist !== practiceName) {
        setSelectedReferral('');
      }
    }
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

    setCustomDocName(file.name);
    setCustomDocType(type);
    setCustomDocSize(formattedSize);

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newFile = {
      id: 'temp_' + Math.random().toString(36).substring(2, 9),
      channelId: '',
      name: file.name,
      size: formattedSize,
      type: type,
      sentBy: 'Me',
      sentAt: 'Today, ' + timeString
    };

    setAttachedFiles(prev => [...prev, newFile]);
    triggerToast(`Attached "${file.name}" successfully!`);
    e.target.value = '';
  };

  const handleAttachMockScan = () => {
    const mockFiles = [
      {
        name: 'SURGERY_REPORT_COOPER.PDF',
        type: 'pdf' as const,
        size: '2.1 MB',
        patient: { first: 'Alice', last: 'Cooper', dob: '12/04/1978', msg: 'Hi, here is the surgery report post-evaluation.' }
      },
      {
        name: 'PANO_XRAY_REVISION.PNG',
        type: 'image' as const,
        size: '4.8 MB',
        patient: { first: 'Marco', last: 'Reyes', dob: '05/14/1988', msg: 'Hi, sending over the post-op panoramic radiograph.' }
      },
      {
        name: 'CT_SCAN_MANDIBLE.ZIP',
        type: 'zip' as const,
        size: '12.4 MB',
        patient: { first: 'Nina', last: 'Patel', dob: '10/20/1990', msg: 'Full mandibular CBCT volume.' }
      },
      {
        name: 'CLINICAL_SUMMARY_VALLEY.PDF',
        type: 'pdf' as const,
        size: '1.1 MB',
        patient: { first: 'John', last: 'Doe', dob: '08/08/1985', msg: 'Valley Endodontics clinical notes.' }
      }
    ];

    let choice = mockFiles[attachedFiles.length % mockFiles.length];
    if (selectedReferral) {
      const ref = sentReferrals.find(r => r.id === selectedReferral);
      if (ref) {
        const parts = ref.patientName.split(' ');
        const matched = mockFiles.find(f => f.patient.last.toLowerCase() === parts[1]?.toLowerCase());
        if (matched) {
          choice = matched;
        } else {
          choice = {
            ...choice,
            patient: {
              first: parts[0] || '',
              last: parts[1] || '',
              dob: ref.id === 'D-1001' ? '12/04/1978' : ref.id === 'D-1002' ? '05/14/1988' : '10/20/1990',
              msg: `Document regarding referral ${ref.id} for ${ref.patientName}.`
            }
          };
        }
      }
    }

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
      channelId: '',
      name: choice.name,
      size: choice.size,
      type: choice.type,
      sentBy: 'Me',
      sentAt: 'Today, ' + timeString
    };
    setAttachedFiles(prev => [...prev, newFile]);
    triggerToast(`Mock attached "${choice.name}" successfully!`);
  };

  const handleSendDocumentSubmit = () => {
    if (!selectedPractice) {
      triggerToast("Please select a connected practice.");
      return;
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let filesToShare: any[] = [];

    if (attachedFiles.length > 0) {
      filesToShare = attachedFiles;
    } else if (customDocName.trim()) {
      const formattedName = customDocName.toLowerCase().endsWith(`.${customDocType}`)
        ? customDocName.toLowerCase()
        : `${customDocName.toLowerCase()}.${customDocType}`;
      filesToShare = [{
        name: formattedName,
        size: customDocSize || '1.5 MB',
        type: customDocType,
      }];
    }

    if (filesToShare.length === 0) {
      triggerToast("Please attach or select at least one document.");
      return;
    }

    const matchedChannel = mockChannels.find(c => c.name === selectedPractice);
    const channelId = matchedChannel ? matchedChannel.id : '3';

    const finalDocs: SharedDocument[] = filesToShare.map(file => ({
      id: 'd_' + Math.random().toString(36).substring(2, 9),
      channelId: channelId,
      name: file.name,
      size: file.size,
      type: file.type,
      sentBy: 'Me',
      sentAt: 'Today, ' + timeString
    }));

    initialDocuments.push(...finalDocs);

    const newMessages: MessageItem[] = finalDocs.map((newDoc, index) => {
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
        transport: 'App',
        document: newDoc
      };
    });

    if (!initialMessages[channelId]) {
      initialMessages[channelId] = [];
    }
    initialMessages[channelId].push(...newMessages);

    const practiceName = selectedPractice;

    setAttachedFiles([]);
    setCustomDocName('');
    setPatientFirstName('');
    setPatientLastName('');
    setPatientDob('');
    setUploadMessage('');
    setSelectedPractice('');
    setSelectedReferral('');
    setIsSendDocOpen(false);

    triggerToast(
      `Shared ${finalDocs.length} document${finalDocs.length > 1 ? 's' : ''} with ${practiceName}!`,
      {
        label: "View Chat",
        onClick: () => router.push(`/dentist/channels?practice=${encodeURIComponent(practiceName)}`)
      }
    );
  };

  const filteredReferrals = sentReferrals.filter((referral) =>
    referral.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    referral.specialist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    referral.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout title="Dentist Dashboard">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Status Banners */}
        <div className="space-y-4">
          
          {/* Verification Alert */}
          {!isVerified && (
            <div className="wireframe-card border-black bg-gray-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center shrink-0 bg-white">
                  <AlertCircle className="text-black" size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black uppercase text-sm tracking-tight leading-none text-black">Verification Required</h3>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed max-w-xl">
                    Practice owner verification is required to refer patients and access PHI.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/verify')}
                className="wireframe-button bg-black text-white text-[10px] uppercase px-8 py-3 whitespace-nowrap"
              >
                Verify Identity Now
              </button>
            </div>
          )}

          {/* Practice Owner Nudge */}
          {isVerified && !hasPracticeOwner && (
            <div className="wireframe-card border-black bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500 border-dashed">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center shrink-0 bg-gray-50">
                  <Users className="text-black" size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black uppercase text-sm tracking-tight leading-none text-black">Practice Owner Required</h3>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed max-w-xl">
                    This practice does not have a verified owner yet. Please invite a doctor to verify their identity and unlock full clinical capabilities.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/dentist/settings')}
                className="wireframe-button bg-black text-white text-[10px] uppercase px-8 py-3 whitespace-nowrap"
              >
                Invite Practice Owner
              </button>
            </div>
          )}
        </div>
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">Dashboard</h2>
              <CommentMarker id="dashboard-dentist" title="Dentist Dashboard" description="The main overview for dentist practices." />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              Refer patients, track specialist progress, and coordinate care across your network.
            </p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button 
              onClick={() => router.push('/dentist/referral')}
              className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-3 flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              Send a Referral <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Referrals', value: '09', trend: '+2', icon: FileText },
            { label: 'Awaiting Review', value: '02', trend: '-1', icon: Clock },
            { label: 'Accepted Cases', value: '05', trend: '+1', icon: TrendingUp },
            { label: 'Specialist Messages', value: '03', trend: '+3', icon: MessageSquare },
          ].map((stat) => (
            <div key={stat.label} className="wireframe-card p-5 space-y-2 bg-white">
              <div className="flex justify-between items-start">
                <p className="text-[9px] font-black uppercase text-muted-foreground">{stat.label}</p>
                <stat.icon size={16} className="text-muted-foreground" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tighter">{stat.value}</span>
                <span className="text-[9px] font-bold text-black uppercase">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Action Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Requires Attention Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                <AlertCircle size={18} className="text-black" />
                <h3 className="font-bold uppercase text-xs tracking-widest">Requires Attention (2)</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: '1005', patient: 'Sarah Jenkins', reason: 'Unfinished Draft', type: 'Endodontic', specialist: 'Valley Endodontics' },
                  { id: '1002', patient: 'Marco Reyes', reason: 'Missing Pano Image', type: 'Extraction', specialist: 'Downtown Oral Surgery' },
                ].map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      if (item.reason === 'Unfinished Draft') {
                        router.push('/dentist/referral');
                      } else {
                        router.push(`/dentist/channels?practice=${encodeURIComponent(item.specialist)}`);
                      }
                    }}
                    className="wireframe-card p-4 flex items-center justify-between bg-white hover:bg-zinc-100 cursor-pointer border-black group transition-all"
                  >
                    <div className="space-y-1">
                      <p className="font-bold uppercase text-xs">{item.patient}</p>
                      <p className="text-[10px] uppercase text-black font-bold">{item.reason}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[8px] uppercase font-bold text-muted-foreground">{item.type}</span>
                      <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral Status Tracker */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-2">
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  <h3 className="font-bold uppercase text-xs tracking-widest">Recent Referrals</h3>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="SEARCH REFERRALS..."
                    className="wireframe-input pl-10 py-1.5 text-[9px] w-full sm:w-64"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredReferrals.map((referral) => (
                  <div 
                    key={referral.id} 
                    className="wireframe-card p-4 hover:bg-gray-50 transition-all cursor-pointer" 
                    onClick={() => router.push(`/dentist/channels?practice=${encodeURIComponent(referral.specialist)}`)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-4">
                        <p className="text-xs font-black uppercase">{referral.patientName}</p>
                        <p className="text-[9px] uppercase font-bold text-muted-foreground">{referral.type}</p>
                      </div>
                      <div className="md:col-span-4">
                        <p className="text-[10px] uppercase font-black">{referral.specialist}</p>
                        <p className="text-[8px] uppercase text-muted-foreground font-bold">{referral.id}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="inline-block border border-black px-2 py-1 text-[8px] uppercase font-black">
                          {referral.status}
                        </span>
                      </div>
                      <div className="md:col-span-2 flex items-center justify-end gap-2 text-muted-foreground">
                        <span className="text-[9px] uppercase font-bold whitespace-pre-line text-right">{referral.lastUpdate}</span>
                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => router.push('/dentist/referrals')}
                className="text-[10px] font-black uppercase underline"
              >
                View all Referrals
              </button>
            </div>
          </div>

          {/* Side Column */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="font-bold uppercase text-xs tracking-widest border-b-2 border-black pb-2">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <ActionCard 
                  label="Send a Referral" 
                  desc="Initiate a patient transfer" 
                  onClick={() => router.push('/dentist/referral')}
                />
                <ActionCard 
                  label="Find Specialist" 
                  desc="Browse the drTalk network" 
                  onClick={() => router.push('/dentist/network')}
                />
                <ActionCard 
                  label="Practice Setup" 
                  desc="Manage your dentist profile" 
                  onClick={() => router.push('/dentist/settings')}
                />
              </div>
            </div>

            {/* Specialist Conversations */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                <MessageSquare size={18} />
                <h3 className="font-bold uppercase text-xs tracking-widest">Specialist Conversations</h3>
              </div>
              <div className="wireframe-card p-0 divide-y-2 divide-black bg-white overflow-hidden">
                {[
                  { id: 1, name: 'Valley Endodontics', msg: 'Regarding Alice Cooper: pano received.', initials: 'VE' },
                  { id: 2, name: 'Downtown Oral Surgery', msg: 'Requesting pano image for Marco Reyes.', initials: 'DO' }
                ].map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 flex gap-3 hover:bg-gray-50 cursor-pointer transition-colors" 
                    onClick={() => router.push(`/dentist/channels?practice=${encodeURIComponent(item.name)}`)}
                  >
                    <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-white font-bold text-[10px] shrink-0">{item.initials}</div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="text-[9px] font-bold uppercase truncate">{item.name}</p>
                        <span className="text-[7px] text-muted-foreground uppercase shrink-0 whitespace-pre-line text-right">10:05 AM{"\n"}05/11/2026</span>
                      </div>
                      <p className="text-[9px] uppercase truncate opacity-70 italic">
                        {item.msg}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Hub */}
            <div className="wireframe-card p-5 space-y-4 bg-gray-50">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} />
                <h3 className="text-xs uppercase font-black">Learning Hub</h3>
              </div>
              <p className="text-[9px] uppercase font-bold text-muted-foreground leading-relaxed">
                Browse clinical guides and practice growth resources.
              </p>
              <button
                onClick={() => router.push('/dentist/academy')}
                className="wireframe-button w-full bg-black text-white text-[10px] uppercase py-3"
              >
                Open Learning Hub
              </button>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

function ActionCard({ label, desc, onClick }: { label: string, desc: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="wireframe-card p-4 bg-white hover:bg-black hover:text-white cursor-pointer transition-all group"
    >
      <h4 className="font-bold uppercase text-[10px] tracking-tight">{label}</h4>
      <p className="text-[8px] uppercase opacity-70 group-hover:opacity-100">{desc}</p>
    </div>
  );
}
