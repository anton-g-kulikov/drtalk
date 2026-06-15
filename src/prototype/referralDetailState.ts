"use client";

import {
  getMessages,
  saveMessages,
  updateReferralStatus,
  type ReferralStatus,
  type UnifiedReferral,
} from '@/lib/referrals';

export type ReferralActivityLog = {
  user: string;
  text: string;
  time: string;
  isDark?: boolean;
};

const PROTOTYPE_NOW = new Date('2026-06-30T18:00:00+02:00');

export function getReferralActivityStorageKey(referralId: string) {
  return `drtalk_activity_logs_${referralId}`;
}

export function buildInitialReferralActivityLogs(referral: UnifiedReferral): ReferralActivityLog[] {
  const receivedTime = referral.receivedAt || '08:20 AM\n06/30/2026';
  const datePart = receivedTime.includes('\n') ? receivedTime.split('\n')[1] : '06/30/2026';

  return [
    {
      user: 'System',
      text: `Referral received from ${referral.practice || referral.dentist} and auto-extracted via Digital Intake Pipeline.`,
      time: receivedTime,
    },
    {
      user: 'Administrator',
      text: `Clinical records requested from ${referral.dentist}'s office. Pending response.`,
      time: `09:20 AM\n${datePart}`,
      isDark: true,
    },
  ];
}

export function loadReferralActivityLogs(referral: UnifiedReferral): ReferralActivityLog[] {
  if (typeof window === 'undefined') return buildInitialReferralActivityLogs(referral);

  const key = getReferralActivityStorageKey(referral.id);
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Fall through to usable prototype defaults.
    }
  }

  const initialLogs = buildInitialReferralActivityLogs(referral);
  localStorage.setItem(key, JSON.stringify(initialLogs));
  return initialLogs;
}

export function saveReferralActivityLogs(referralId: string, logs: ReferralActivityLog[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getReferralActivityStorageKey(referralId), JSON.stringify(logs));
}

export function buildReferralActivityTimestamp() {
  const timeStr = PROTOTYPE_NOW.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = PROTOTYPE_NOW.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });
  return `${timeStr}\n${dateStr}`;
}

export function transitionReferralDetailStatus({
  referral,
  newStatus,
  currentLogs,
}: {
  referral: UnifiedReferral;
  newStatus: ReferralStatus;
  currentLogs: ReferralActivityLog[];
}) {
  const updatedReferrals = updateReferralStatus(referral.id, newStatus);
  const isExternalReferral = referral.id.startsWith('ext-');
  const statusMessage = newStatus === 'Accepted' && isExternalReferral
    ? `Referral status transitioned to ACCEPTED. Automated secure email sent to referring office (${referral.practice || referral.dentist}).`
    : `Referral status transitioned to ${newStatus.toUpperCase()}.`;
  const updatedLogs = [
    ...currentLogs,
    {
      user: 'System',
      text: statusMessage,
      time: buildReferralActivityTimestamp(),
    },
  ];

  saveReferralActivityLogs(referral.id, updatedLogs);

  if (newStatus === 'Accepted') {
    saveReferralAcceptedMessage(referral, isExternalReferral);
  }

  return {
    referrals: updatedReferrals,
    activityLogs: updatedLogs,
  };
}

export function saveReferralAcceptedMessage(referral: UnifiedReferral, isExternalReferral = referral.id.startsWith('ext-')) {
  const allMessages = getMessages();
  const channelId = `case_${referral.id}`;
  const welcomeMessageText = 'REFERRAL ACCEPTED. WE ARE REVIEWING THE CLINICAL RECORDS AND WILL COORDINATE APPOINTMENT SCHEDULING SHORTLY.';

  if (!allMessages[channelId]) {
    allMessages[channelId] = [];
  }

  const hasWelcome = allMessages[channelId].some((message) => message.text === welcomeMessageText);
  if (hasWelcome) return;

  allMessages[channelId].push({
    id: `m_auto_${Date.now()}`,
    user: referral.specialist || 'Valley Endodontics',
    text: welcomeMessageText,
    time: PROTOTYPE_NOW.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'other',
    ...(isExternalReferral ? { transport: 'Email' } : {}),
  });
  saveMessages(allMessages);
}

export function appendReferralComment({
  referralId,
  commentText,
  currentLogs,
}: {
  referralId: string;
  commentText: string;
  currentLogs: ReferralActivityLog[];
}): ReferralActivityLog[] {
  if (!commentText.trim()) return currentLogs;

  const updatedLogs = [
    ...currentLogs,
    {
      user: 'Administrator',
      text: commentText,
      time: buildReferralActivityTimestamp(),
      isDark: true,
    },
  ];
  saveReferralActivityLogs(referralId, updatedLogs);
  return updatedLogs;
}
