"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ExternalViewerChatPanel } from '@/components/prototype/external-viewer/ExternalViewerChatPanel';
import { ExternalViewerDocumentPanel } from '@/components/prototype/external-viewer/ExternalViewerDocumentPanel';
import { ExternalViewerHeader } from '@/components/prototype/external-viewer/ExternalViewerHeader';
import { ExternalViewerInvalidLink } from '@/components/prototype/external-viewer/ExternalViewerInvalidLink';
import { ExternalViewerPatientStatus } from '@/components/prototype/external-viewer/ExternalViewerPatientStatus';
import { getReferralCode, type UnifiedReferral } from '@/lib/referrals';
import type { MessageItem } from '@/prototype/channelTypes';
import {
  buildExternalViewerReply,
  loadExternalViewerState,
  saveExternalViewerMessages,
  updateExternalViewerStatus,
  type ExternalViewerDocument,
  type ExternalViewerStatus,
} from '@/prototype/externalViewerState';

export default function ExternalViewerClient() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [referral, setReferral] = useState<UnifiedReferral | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [documents, setDocuments] = useState<ExternalViewerDocument[]>([]);
  const [activeDocument, setActiveDocument] = useState<ExternalViewerDocument | null>(null);
  const [inputText, setInputText] = useState('');
  const [attachedReport, setAttachedReport] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showStatusSuccess, setShowStatusSuccess] = useState(false);

  useEffect(() => {
    const viewerState = loadExternalViewerState(id);
    if (!viewerState) return;

    setReferral(viewerState.referral);
    setMessages(viewerState.messages);
    setDocuments(viewerState.documents);
    setActiveDocument(viewerState.activeDocument);
  }, [id]);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateStatus = (newStatus: ExternalViewerStatus) => {
    if (!referral) return;

    const result = updateExternalViewerStatus({
      referral,
      messages,
      newStatus,
      appointmentDate,
    });
    setReferral(result.referral);
    setMessages(result.messages);
    setShowStatusSuccess(true);
    setTimeout(() => setShowStatusSuccess(false), 4000);
    triggerToast(`Referral status successfully updated to ${newStatus}!`);
  };

  const handleSendReply = () => {
    if (!referral) return;

    const reply = buildExternalViewerReply({
      referral,
      inputText,
      attachedReport,
    });
    if (!reply) return;

    const updatedMessages = [...messages, reply];
    setMessages(updatedMessages);
    saveExternalViewerMessages(referral.id, updatedMessages);
    setInputText('');
    setAttachedReport(null);
    triggerToast('Secure message reply sent back to practice!');
  };

  if (!referral) {
    return <ExternalViewerInvalidLink onGoHome={() => router.push('/')} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans flex flex-col">
      <ExternalViewerHeader referralCode={getReferralCode(referral.id)} />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <ExternalViewerPatientStatus
            referral={referral}
            appointmentDate={appointmentDate}
            attachedReport={attachedReport}
            showStatusSuccess={showStatusSuccess}
            onAppointmentDateChange={setAppointmentDate}
            onAttachReport={setAttachedReport}
            onSendReply={handleSendReply}
            onUpdateStatus={handleUpdateStatus}
          />

          <ExternalViewerDocumentPanel
            referral={referral}
            documents={documents}
            activeDocument={activeDocument}
            onActiveDocumentChange={setActiveDocument}
            onToast={triggerToast}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <ExternalViewerChatPanel
            referral={referral}
            messages={messages}
            inputText={inputText}
            attachedReport={attachedReport}
            onInputTextChange={setInputText}
            onAttachReport={setAttachedReport}
            onSendReply={handleSendReply}
            onToast={triggerToast}
          />
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-black text-white border-2 border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-300">
          <p className="text-[10px] font-black uppercase tracking-tight">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
