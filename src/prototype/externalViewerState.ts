"use client";

import {
  getMessages,
  getReferrals,
  saveMessages,
  updateReferralStatus,
  type ReferralStatus,
  type UnifiedReferral,
} from '@/lib/referrals';
import type { MessageItem, SharedDocument } from '@/prototype/channelTypes';

export type ExternalViewerDocument = SharedDocument;

export type ExternalViewerState = {
  referral: UnifiedReferral;
  messages: MessageItem[];
  documents: ExternalViewerDocument[];
  activeDocument: ExternalViewerDocument;
};

export type ExternalViewerStatus = Extract<ReferralStatus, 'Received' | 'Scheduled' | 'Released' | 'Archived'>;

export function buildExternalViewerDocuments(referral: UnifiedReferral): ExternalViewerDocument[] {
  const patientToken = referral.patientName.replace(/\s+/g, '_').toUpperCase();
  const sender = referral.sender || referral.dentist;
  const sentAt = referral.receivedAt.replace('\n', ', ');

  return [
    {
      id: `d_case_${referral.id}_1`,
      channelId: `case_${referral.id}`,
      name: `REFERRAL_FORM_${patientToken}.PDF`,
      size: '1.2 MB',
      type: 'pdf',
      sentBy: sender,
      sentAt,
    },
    {
      id: `d_case_${referral.id}_2`,
      channelId: `case_${referral.id}`,
      name: `PANO_XRAY_${patientToken}.PNG`,
      size: '3.4 MB',
      type: 'image',
      sentBy: sender,
      sentAt,
    },
  ];
}

export function buildExternalViewerFallbackMessage(referral: UnifiedReferral): MessageItem {
  return {
    id: 'm_system_1',
    user: referral.sender || referral.dentist,
    text: `Hi Valley Endodontics, referring patient ${referral.patientName} for ${referral.type}. Attached is the referral form.`,
    time: '08:20 AM',
    type: 'other',
    transport: 'Email',
  };
}

export function loadExternalViewerState(id: string): ExternalViewerState | null {
  const referral = getReferrals().find((item) => item.id === id);
  if (!referral) return null;

  const channelId = `case_${referral.id}`;
  const messages = (getMessages()[channelId] || [buildExternalViewerFallbackMessage(referral)]) as MessageItem[];
  const documents = buildExternalViewerDocuments(referral);

  markExternalViewerReadReceipt(referral);

  return {
    referral,
    messages,
    documents,
    activeDocument: documents[0],
  };
}

export function markExternalViewerReadReceipt(referral: UnifiedReferral) {
  if (typeof window === 'undefined') return;

  const isSpecialist = !referral.id.startsWith('D-');
  const senderKey = isSpecialist ? 'drtalk_specialist_docs' : 'drtalk_dentist_docs';
  const dashboardDocsRaw = localStorage.getItem(senderKey);
  if (!dashboardDocsRaw) return;

  try {
    const patientToken = referral.patientName.replace(/\s+/g, '_').toUpperCase();
    const dashboardDocs = JSON.parse(dashboardDocsRaw);
    if (!Array.isArray(dashboardDocs)) return;

    const updatedDashboardDocs = dashboardDocs.map((documentItem) => {
      if (
        documentItem.id === `d_case_${referral.id}_1` ||
        documentItem.caseId === referral.id ||
        documentItem.name?.includes(patientToken)
      ) {
        return { ...documentItem, date: `${String(documentItem.date || '').split(' ')[0]} Viewed` };
      }
      return documentItem;
    });

    localStorage.setItem(senderKey, JSON.stringify(updatedDashboardDocs));
  } catch (error) {
    console.error(error);
  }
}

export function updateExternalViewerStatus({
  referral,
  messages,
  newStatus,
  appointmentDate,
}: {
  referral: UnifiedReferral;
  messages: MessageItem[];
  newStatus: ExternalViewerStatus;
  appointmentDate?: string;
}): { referral: UnifiedReferral; messages: MessageItem[] } {
  const updatedRefs = updateReferralStatus(referral.id, newStatus);
  const refreshed = updatedRefs.find((item) => item.id === referral.id) || referral;
  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const systemMessage: MessageItem = {
    id: `m_sys_${Math.random().toString(36).substring(2, 9)}`,
    user: 'System',
    text: `Referral status updated to: ${newStatus.toUpperCase()}${appointmentDate ? ` (Appointment set for ${appointmentDate})` : ''}`,
    time: timeString,
    type: 'other',
    transport: 'Email',
  };
  const updatedMessages = [...messages, systemMessage];
  saveExternalViewerMessages(referral.id, updatedMessages);

  return {
    referral: refreshed,
    messages: updatedMessages,
  };
}

export function buildExternalViewerReply({
  referral,
  inputText,
  attachedReport,
}: {
  referral: UnifiedReferral;
  inputText: string;
  attachedReport: string | null;
}): MessageItem | null {
  if (!inputText.trim() && !attachedReport) return null;

  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let textBody = inputText.trim();
  let document: SharedDocument | undefined;

  if (attachedReport) {
    document = {
      id: `d_reply_${Math.random().toString(36).substring(2, 9)}`,
      channelId: `case_${referral.id}`,
      name: attachedReport,
      size: '1.4 MB',
      type: attachedReport.toLowerCase().endsWith('.png') ? 'image' : 'pdf',
      sentBy: referral.specialist,
      sentAt: `Today, ${timeString}`,
    };
    textBody += `${textBody ? '\n' : ''}[Attached File: ${attachedReport}]`;
  }

  return {
    id: `m_reply_${Math.random().toString(36).substring(2, 9)}`,
    user: referral.specialist,
    text: textBody,
    time: timeString,
    type: 'other',
    transport: 'Email',
    document,
  };
}

export function saveExternalViewerMessages(referralId: string, messages: MessageItem[]) {
  const allMessages = getMessages();
  allMessages[`case_${referralId}`] = messages;
  saveMessages(allMessages);
}
