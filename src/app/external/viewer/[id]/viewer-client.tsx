"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FileText, ImageIcon, Download, Send, Paperclip, 
  Check, CheckCircle2, ShieldCheck, Mail, ArrowLeft, Building2, Calendar, Clock, AlertCircle
} from 'lucide-react';
import { 
  getReferrals, 
  saveReferrals, 
  updateReferralStatus, 
  UnifiedReferral, 
  getReferralCode, 
  getMessages, 
  saveMessages 
} from '@/lib/referrals';

export default function ExternalViewerClient() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [referral, setReferral] = useState<UnifiedReferral | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [activeDocument, setActiveDocument] = useState<any>(null);
  const [attachedReport, setAttachedReport] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showStatusSuccess, setShowStatusSuccess] = useState(false);

  // Load data and simulate read receipts
  useEffect(() => {
    const refs = getReferrals();
    const foundRef = refs.find(r => r.id === id);
    if (foundRef) {
      setReferral(foundRef);
      
      // Load messages for this case channel
      const allMsgs = getMessages();
      const channelId = `case_${foundRef.id}`;
      const caseMsgs = allMsgs[channelId] || [
        {
          id: 'm_system_1',
          user: foundRef.sender || foundRef.dentist,
          text: `Hi Valley Endodontics, referring patient ${foundRef.patientName} for ${foundRef.type}. Attached is the referral form.`,
          time: '08:20 AM',
          type: 'other',
          transport: 'Email'
        }
      ];
      setMessages(caseMsgs);

      // Setup default active document
      const docName = `REFERRAL_FORM_${foundRef.patientName.replace(/\s+/g, '_').toUpperCase()}.PDF`;
      const docType = 'pdf';
      const docSize = '1.2 MB';
      
      const defaultDoc = {
        id: `d_case_${foundRef.id}_1`,
        name: docName,
        size: docSize,
        type: docType,
        sentBy: foundRef.sender || foundRef.dentist,
        sentAt: foundRef.receivedAt.replace('\n', ', ')
      };
      
      const docName2 = `PANO_XRAY_${foundRef.patientName.replace(/\s+/g, '_').toUpperCase()}.PNG`;
      const additionalDoc = {
        id: `d_case_${foundRef.id}_2`,
        name: docName2,
        size: '3.4 MB',
        type: 'image',
        sentBy: foundRef.sender || foundRef.dentist,
        sentAt: foundRef.receivedAt.replace('\n', ', ')
      };

      setActiveDocument(defaultDoc);

      // Simulate a read receipt! Mark sender messages in this channel as "Viewed"
      // In a real system, we'd notify the API. Here we write to logs and save
      const isSpecialist = !foundRef.id.startsWith('D-');
      const senderKey = isSpecialist ? 'drtalk_specialist_docs' : 'drtalk_dentist_docs';
      const dashboardDocsRaw = localStorage.getItem(senderKey);
      if (dashboardDocsRaw) {
        try {
          const dashboardDocs = JSON.parse(dashboardDocsRaw);
          // Update status of matching document in sender's dashboard
          const updatedDashboardDocs = dashboardDocs.map((d: any) => {
            if (d.id === `d_case_${foundRef.id}_1` || d.caseId === foundRef.id || d.name.includes(foundRef.patientName.replace(/\s+/g, '_').toUpperCase())) {
              return { ...d, date: `${d.date.split(' ')[0]} Viewed` };
            }
            return d;
          });
          localStorage.setItem(senderKey, JSON.stringify(updatedDashboardDocs));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [id]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateStatus = (newStatus: 'Received' | 'Scheduled' | 'Completed' | 'Archived') => {
    if (!referral) return;
    
    // Update state & localStorage
    const updatedRefs = updateReferralStatus(referral.id, newStatus);
    const refreshed = updatedRefs.find(r => r.id === referral.id);
    if (refreshed) {
      setReferral(refreshed);
    }
    
    // Add system message to the chat indicating the status change
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const systemMsg = {
      id: 'm_sys_' + Math.random().toString(36).substring(2, 9),
      user: 'System',
      text: `Referral status updated to: ${newStatus.toUpperCase()}${appointmentDate ? ` (Appointment set for ${appointmentDate})` : ''}`,
      time: timeString,
      type: 'other',
      transport: 'Email'
    };

    const updatedMsgs = [...messages, systemMsg];
    setMessages(updatedMsgs);

    const allMsgs = getMessages();
    allMsgs[`case_${referral.id}`] = updatedMsgs;
    saveMessages(allMsgs);

    setShowStatusSuccess(true);
    setTimeout(() => setShowStatusSuccess(false), 4000);
    triggerToast(`Referral status successfully updated to ${newStatus}!`);
  };

  const handleSendReply = () => {
    if (!inputText.trim() && !attachedReport && !appointmentDate) return;
    if (!referral) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let textBody = inputText.trim();

    let docObj: any = null;
    if (attachedReport) {
      docObj = {
        id: 'd_reply_' + Math.random().toString(36).substring(2, 9),
        channelId: `case_${referral.id}`,
        name: attachedReport,
        size: '1.4 MB',
        type: attachedReport.toLowerCase().endsWith('.png') ? 'image' : 'pdf',
        sentBy: referral.specialist,
        sentAt: 'Today, ' + timeString
      };
      textBody += `\n[Attached File: ${attachedReport}]`;
    }

    const newMsg = {
      id: 'm_reply_' + Math.random().toString(36).substring(2, 9),
      user: referral.specialist, // Specialist clinic replies
      text: textBody,
      time: timeString,
      type: 'other', // From perspective of drTalk sender, this is 'other'
      transport: 'Email',
      document: docObj
    };

    const updatedMsgs = [...messages, newMsg];
    setMessages(updatedMsgs);

    const allMsgs = getMessages();
    allMsgs[`case_${referral.id}`] = updatedMsgs;
    saveMessages(allMsgs);

    setInputText('');
    setAttachedReport(null);
    triggerToast("Secure message reply sent back to practice!");
  };

  if (!referral) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="wireframe-card p-8 bg-white border-2 border-black max-w-sm w-full text-center space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle size={32} className="mx-auto text-black" />
          <h2 className="text-lg font-black uppercase">Secure Link Expired</h2>
          <p className="text-[10px] text-muted-foreground uppercase leading-relaxed">
            This secure verification link has expired or is invalid. Please contact the sending practice to request a new secure access link.
          </p>
          <button onClick={() => router.push('/')} className="wireframe-button w-full bg-black text-white py-2 text-[10px] uppercase font-black">
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  const senderPractice = referral.id.startsWith('D-') ? referral.practice : referral.specialist;
  const receiverPractice = referral.id.startsWith('D-') ? referral.specialist : referral.practice;
  
  const mockDocs = [
    {
      id: `d_case_${referral.id}_1`,
      name: `REFERRAL_FORM_${referral.patientName.replace(/\s+/g, '_').toUpperCase()}.PDF`,
      size: '1.2 MB',
      type: 'pdf',
      sentBy: referral.sender || referral.dentist,
      sentAt: referral.receivedAt.replace('\n', ', ')
    },
    {
      id: `d_case_${referral.id}_2`,
      name: `PANO_XRAY_${referral.patientName.replace(/\s+/g, '_').toUpperCase()}.PNG`,
      size: '3.4 MB',
      type: 'image',
      sentBy: referral.sender || referral.dentist,
      sentAt: referral.receivedAt.replace('\n', ', ')
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans flex flex-col">
      {/* Header */}
      <header className="bg-black text-white py-4 px-6 border-b-4 border-black flex justify-between items-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 border border-white bg-white/10">
            <ShieldCheck size={20} className="text-green-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              drTalk Secure Portal <span className="text-[8px] bg-white text-black px-1.5 py-0.5 border border-black font-black">PHI SECURED</span>
            </h1>
            <p className="text-[8px] text-zinc-400 uppercase font-black mt-0.5">End-to-End Encrypted Verification & Communication</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-white/70">Case Ref: {getReferralCode(referral.id)}</p>
          <p className="text-[7px] text-zinc-400 uppercase font-bold">Link expires in 48 hours</p>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        
        {/* Left Side: Document View & Action panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Patient Overview Card */}
          <div className="wireframe-card p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-3">
              <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-black text-white">Patient Record</span>
              <h2 className="text-2xl font-black uppercase tracking-tight italic">{referral.patientName}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[9px] uppercase font-bold text-muted-foreground">
                <div>
                  <p className="text-gray-400 text-[8px] font-black">Urgency Level</p>
                  <p className={`text-black font-black mt-0.5 ${referral.urgency === 'Emergency' ? 'text-red-600' : referral.urgency === 'Urgent' ? 'text-amber-600' : ''}`}>
                    {referral.urgency || 'Routine'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-[8px] font-black">Referring Office</p>
                  <p className="text-black mt-0.5">{referral.practice || referral.dentist}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[8px] font-black">Referring Doctor</p>
                  <p className="text-black mt-0.5">{referral.dentist}</p>
                </div>
              </div>
            </div>

            {/* Pipeline status bar */}
            <div className="border-t md:border-t-0 md:border-l border-black border-dashed pt-4 md:pt-0 md:pl-6 flex flex-col justify-center min-w-[200px] space-y-2.5">
              <span className="text-[8px] font-black uppercase text-gray-500">Pipeline Coordination</span>
              
              <div className="flex justify-between items-center text-[9px] font-black uppercase">
                <button
                  onClick={() => handleUpdateStatus('Received')}
                  className={`flex-1 py-1 text-center border-2 border-black transition-all ${
                    referral.status === 'Received' ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]' : 'bg-white text-black hover:bg-zinc-100'
                  }`}
                >
                  Review
                </button>
                <div className="w-2 h-0.5 bg-black" />
                <button
                  onClick={() => handleUpdateStatus('Scheduled')}
                  className={`flex-1 py-1 text-center border-2 border-black transition-all ${
                    referral.status === 'Scheduled' ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]' : 'bg-white text-black hover:bg-zinc-100'
                  }`}
                >
                  Schedule
                </button>
                <div className="w-2 h-0.5 bg-black" />
                <button
                  onClick={() => handleUpdateStatus('Completed')}
                  className={`flex-1 py-1 text-center border-2 border-black transition-all ${
                    referral.status === 'Completed' ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]' : 'bg-white text-black hover:bg-zinc-100'
                  }`}
                >
                  Complete
                </button>
              </div>

              {referral.status === 'Scheduled' && (
                <div className="animate-fade-in flex gap-2 items-center bg-zinc-50 border border-black p-1.5">
                  <span className="text-[7px] font-black uppercase">Appt Date:</span>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="border border-black bg-white text-[8px] font-bold p-0.5 w-full uppercase outline-none focus:ring-0"
                  />
                  <button onClick={() => handleUpdateStatus('Scheduled')} className="p-1 bg-black text-white border border-black hover:bg-zinc-800">
                    <Check size={8} />
                  </button>
                </div>
              )}

              {referral.status === 'Completed' && (
                <div className="animate-fade-in flex flex-col gap-1 bg-zinc-50 border border-black p-1.5">
                  <span className="text-[7px] font-black uppercase">Attach Post-Op Report:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAttachedReport('POST_OP_REPORT_COMPLETED.PDF')}
                      className={`flex-1 text-[7px] py-1 border border-black font-black uppercase ${
                        attachedReport ? 'bg-black text-white' : 'bg-white text-black'
                      }`}
                    >
                      {attachedReport ? 'Report Attached' : 'Attach Mock Report'}
                    </button>
                    {attachedReport && (
                      <button onClick={handleSendReply} className="p-1 bg-black text-white border border-black hover:bg-zinc-800 text-[8px] px-2 font-black uppercase">
                        Send
                      </button>
                    )}
                  </div>
                </div>
              )}

              {showStatusSuccess && (
                <p className="text-[8px] font-bold uppercase text-green-700 text-center animate-pulse">
                  ✓ Pipeline updated in referring dentist&apos;s portal!
                </p>
              )}
            </div>
          </div>

          {/* Secure Document List & Main Previewer */}
          <div className="wireframe-card bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col min-h-[400px]">
            <div className="p-4 border-b-2 border-black bg-gray-50 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] font-black uppercase text-black">Documents Provided ({mockDocs.length})</span>
              <div className="flex gap-2">
                {mockDocs.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => setActiveDocument(doc)}
                    className={`px-3 py-1 text-[9px] font-black uppercase border-2 border-black transition-all ${
                      activeDocument?.id === doc.id ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-zinc-100'
                    }`}
                  >
                    {doc.name.replace(`_${referral.patientName.replace(/\s+/g, '_').toUpperCase()}`, '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Previewer */}
            {activeDocument ? (
              <div className="flex-1 p-6 flex flex-col justify-between bg-zinc-50 border-b border-black">
                <div className="flex-1 flex items-center justify-center min-h-[300px]">
                  {activeDocument.type === 'image' ? (
                    <div className="w-full max-w-md bg-black p-4 border-2 border-white flex flex-col items-center">
                      <div className="w-full flex justify-between text-[7px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-800 pb-1">
                        <span>PATIENT: {referral.patientName.toUpperCase()}</span>
                        <span>CBCT SCAN</span>
                        <span>T-#14 RADIOGRAPHY</span>
                      </div>
                      
                      {/* SVG Pano drawing */}
                      <svg viewBox="0 0 400 200" className="w-full h-auto text-white">
                        <path d="M 40 160 Q 200 200 360 160" fill="none" stroke="#333" strokeWidth="6" strokeDasharray="5,5" />
                        <g transform="translate(0, 40)" fill="none" stroke="#eee" strokeWidth="2">
                          <path d="M 50 40 Q 60 5 70 40" />
                          <path d="M 75 40 Q 85 5 95 40" />
                          <path d="M 100 40 Q 110 5 120 40" />
                          <path d="M 125 40 Q 135 5 145 40" />
                          <g className="animate-pulse">
                            <path d="M 150 40 Q 160 5 170 40" stroke="#ff3333" strokeWidth="3" />
                            <circle cx="160" cy="15" r="8" fill="rgba(255, 0, 0, 0.2)" stroke="#ff3333" strokeWidth="1" />
                            <line x1="160" y1="15" x2="200" y2="-10" stroke="#ff3333" strokeWidth="1" strokeDasharray="2,2" />
                            <text x="205" y="-6" fill="#ff3333" fontSize="8" fontFamily="monospace" fontWeight="bold">TOOTH #14 DECAY</text>
                          </g>
                          <path d="M 175 40 Q 185 5 195 40" />
                          <path d="M 205 40 Q 215 5 225 40" />
                          <path d="M 230 40 Q 240 5 250 40" />
                        </g>
                      </svg>
                      
                      <div className="w-full text-center text-[7px] text-gray-500 font-bold uppercase mt-3">
                        Digital Clinical Radiograph Imaging System
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-md bg-white p-6 border-2 border-black text-black">
                      <div className="text-center pb-4 border-b-2 border-black mb-4">
                        <h4 className="text-xs font-black uppercase tracking-widest">DRTALK SECURE REF</h4>
                        <p className="text-[7px] font-bold text-muted-foreground uppercase">CLINICAL ATTACHMENT</p>
                      </div>

                      <div className="space-y-4 text-[8px] uppercase">
                        <div>
                          <p className="font-bold text-gray-400">Reason for Referral:</p>
                          <p className="font-bold text-black mt-1 leading-relaxed border border-black/10 p-2 bg-zinc-50">
                            &quot;Patient presents with localized thermal sensitivity and periapical lesion on Tooth #14. Please evaluate for endodontic root canal therapy or retreatment.&quot;
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-bold text-gray-400">Sender:</p>
                            <p className="font-bold text-black">{referral.dentist} ({referral.practice || 'Dentist'})</p>
                          </div>
                          <div>
                            <p className="font-bold text-gray-400">Recipient:</p>
                            <p className="font-bold text-black">{referral.specialist}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-4 text-[9px] uppercase font-bold text-muted-foreground">
                  <span>Name: {activeDocument.name} • {activeDocument.size}</span>
                  <button
                    onClick={() => triggerToast(`Downloading secure file: ${activeDocument.name}`)}
                    className="wireframe-button bg-black text-white px-4 py-1.5 text-[9px] font-black uppercase flex items-center gap-1.5"
                  >
                    <Download size={12} /> Download Original Document
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 text-muted-foreground uppercase text-[10px] font-bold">
                Select a document above to view
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Chat Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="wireframe-card bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col max-h-[600px]">
            {/* Chat Header */}
            <div className="p-4 border-b-2 border-black bg-black text-white flex items-center gap-2">
              <Mail size={16} className="text-white" />
              <div>
                <h3 className="text-xs font-black uppercase">Secure Case Discussion</h3>
                <p className="text-[7px] text-zinc-400 uppercase font-bold mt-0.5">Replies delivered via Secure Email to sender</p>
              </div>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 min-h-[300px]">
              {messages.map((msg: any) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col max-w-[85%] ${
                    msg.user === referral.specialist ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <span className="text-[8px] font-black uppercase text-gray-400 mb-1">
                    {msg.user}
                  </span>
                  
                  <div className={`p-3 border-2 border-black text-xs font-medium leading-relaxed ${
                    msg.user === referral.specialist 
                      ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]' 
                      : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]'
                  }`}>
                    {msg.text.split('\n').map((line: string, idx: number) => (
                      <p key={idx}>{line}</p>
                    ))}
                    
                    {msg.document && (
                      <div className={`mt-2 p-2 border flex items-center justify-between gap-4 text-[9px] font-black uppercase ${
                        msg.user === referral.specialist ? 'border-white/20 bg-white/5' : 'border-black/10 bg-zinc-50'
                      }`}>
                        <span className="truncate">{msg.document.name}</span>
                        <button
                          onClick={() => triggerToast(`Downloading secure file: ${msg.document.name}`)}
                          className="shrink-0 hover:underline flex items-center gap-1"
                        >
                          <Download size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[7px] font-bold text-gray-400 mt-1 uppercase flex items-center gap-1">
                    {msg.time} • Sent via {msg.transport || 'Email'}
                  </span>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div className="p-4 border-t-2 border-black bg-white space-y-3">
              {attachedReport && (
                <div className="flex items-center justify-between p-1.5 bg-zinc-100 border border-black text-[8px] font-black uppercase animate-fade-in">
                  <span>Attached: {attachedReport}</span>
                  <button onClick={() => setAttachedReport(null)} className="hover:text-red-500 font-black px-1 text-[10px]">×</button>
                </div>
              )}
              
              <textarea
                placeholder="Compose secure reply back to referring practice..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full text-xs border border-black p-2 bg-white text-black outline-none focus:ring-0 resize-none h-16 font-bold"
              />
              
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setAttachedReport('POST_OP_IMAGING_REPLY.PNG')}
                  className="p-2 border border-black hover:bg-zinc-50 flex items-center justify-center"
                  title="Attach Scan"
                >
                  <Paperclip size={12} className="text-black" />
                </button>
                
                <button
                  onClick={handleSendReply}
                  disabled={!inputText.trim() && !attachedReport}
                  className="wireframe-button bg-black text-white hover:bg-zinc-800 disabled:opacity-50 text-[10px] font-black uppercase px-6 py-2 flex items-center gap-1.5"
                >
                  Send Reply <Send size={10} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-black text-white border-2 border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-300">
          <p className="text-[10px] font-black uppercase tracking-tight">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
