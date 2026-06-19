import type { UnifiedReferral } from '@/lib/referrals';
import type { CaseChannel } from '@/prototype/channelModel';
import type { Channel, MessageItem, SharedDocument } from '@/prototype/channelTypes';
import type { GroupParticipant } from '@/prototype/channelFixtures';

type AttachedDocDraft = {
  name: string;
  size: string;
  type: SharedDocument['type'];
};

function createPrototypeId(prefix: string): string {
  return `${prefix}${Math.random().toString(36).substring(2, 9)}`;
}

function getTimeString(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export type ChannelGroupCreationResult =
  | { ok: false; error: string }
  | { ok: true; channel: Channel; message: MessageItem };

export function buildChannelGroupCreation({
  groupName,
  participants,
}: {
  groupName: string;
  participants: GroupParticipant[];
}): ChannelGroupCreationResult {
  const trimmedName = groupName.trim();
  if (!trimmedName) {
    return { ok: false, error: 'Please enter a group chat name.' };
  }

  const selectedPeople = participants.filter((participant) => participant.selected);
  if (selectedPeople.length === 0) {
    return { ok: false, error: 'Please select at least one participant.' };
  }

  const channelId = createPrototypeId('group_');
  return {
    ok: true,
    channel: {
      id: channelId,
      name: trimmedName,
      type: 'group',
      lastMessage: 'Group chat created.',
      memberCount: selectedPeople.length + 1,
    },
    message: {
      id: createPrototypeId('m_welcome_'),
      user: 'System',
      text: `Group chat "${trimmedName}" created with ${selectedPeople.map((person) => person.name).join(', ')}.`,
      time: getTimeString(),
      type: 'other',
    },
  };
}

export type ChannelMessageSendResult =
  | { ok: false }
  | {
      ok: true;
      channels: Channel[];
      messages: Record<string, MessageItem[]>;
      documents: SharedDocument[];
      message: MessageItem;
      attachedDocument?: SharedDocument;
      reactivatedReferralId?: string;
    };

export function buildChannelMessageSend({
  activeChannel,
  channels,
  caseChannels,
  referrals = [],
  messages,
  documents,
  inputText,
  attachedDoc,
}: {
  activeChannel: Channel;
  channels: Channel[];
  caseChannels: CaseChannel[];
  referrals?: UnifiedReferral[];
  messages: Record<string, MessageItem[]>;
  documents: SharedDocument[];
  inputText: string;
  attachedDoc: AttachedDocDraft | null;
}): ChannelMessageSendResult {
  if (!inputText.trim() && !attachedDoc) {
    return { ok: false };
  }

  const timeString = getTimeString();
  const attachedDocument: SharedDocument | undefined = attachedDoc
    ? {
        id: createPrototypeId('d_'),
        channelId: activeChannel.id,
        name: attachedDoc.name,
        size: attachedDoc.size,
        type: attachedDoc.type,
        sentBy: 'Me',
        sentAt: `Today, ${timeString}`,
      }
    : undefined;

  const message: MessageItem = {
    id: createPrototypeId('m_'),
    user: 'Me',
    text: inputText,
    time: timeString,
    type: 'self',
    transport: activeChannel.type === 'patient' || activeChannel.isExternal ? 'Email' : 'App',
    document: attachedDocument,
  };

  const nextChannels = channels.map((channel) => {
    const isParent = !activeChannel.id.startsWith('case_') && channel.id === activeChannel.id;
    const parentCase = caseChannels.find((caseChannel) => caseChannel.id === activeChannel.id);
    const isCaseParent = activeChannel.id.startsWith('case_') && channel.id === parentCase?.practiceId;
    if (!isParent && !isCaseParent) return channel;

    return {
      ...channel,
      lastMessage: attachedDoc ? `Shared document: ${attachedDoc.name}` : inputText,
    };
  });

  const reactivatedReferral = activeChannel.id.startsWith('case_')
    ? referrals.find((referral) => referral.id === activeChannel.id.replace('case_', '') && (referral.status === 'Archived' || referral.archivedBySpecialist || referral.archivedByDentist))
    : undefined;

  return {
    ok: true,
    channels: nextChannels,
    documents: attachedDocument ? [...documents, attachedDocument] : documents,
    messages: {
      ...messages,
      [activeChannel.id]: [...(messages[activeChannel.id] || []), message],
    },
    message,
    attachedDocument,
    reactivatedReferralId: reactivatedReferral?.id,
  };
}

export type ActiveChannelResolution = {
  parentChannel: Channel;
  activeChannel: Channel;
  targetTab: 'messages' | 'documents' | 'archived';
  expandSection: 'connected' | 'external' | 'patient' | 'group' | 'internal';
  reactivateReferralId?: string;
};

function getPracticeIdForReferral(referral: UnifiedReferral, isDentist: boolean): string {
  if (isDentist) {
    const specialistName = (referral.specialist || '').toLowerCase();
    if (specialistName.includes('downtown')) return '7';
    if (specialistName.includes('metro')) return '8';
    if (specialistName.includes('arizona')) return '9';
    if (specialistName.includes('beverly')) return '6';
    return '3';
  }

  const practice = (referral.practice || '').toLowerCase();
  const dentist = (referral.dentist || '').toLowerCase();
  if (
    practice.includes('sunshine') ||
    dentist.includes('smith') ||
    dentist.includes('reed') ||
    referral.id === '1' ||
    referral.id === '6' ||
    referral.id === '9'
  ) {
    return '6';
  }
  if (practice.includes('desert') || dentist.includes('jones') || referral.id === '2') {
    return '7';
  }
  return '3';
}

function findReferralFromCaseParam(referrals: UnifiedReferral[], caseIdParam: string): UnifiedReferral | undefined {
  return referrals.find((referral) =>
    `case_${referral.id}` === caseIdParam ||
    referral.id === caseIdParam ||
    referral.patientName.toLowerCase() === caseIdParam.replace('case_', '').toLowerCase()
  );
}

export function resolveActiveChannelFromQuery({
  practiceParam,
  caseIdParam,
  tabParam,
  channels,
  referrals,
  isDentist,
}: {
  practiceParam: string | null;
  caseIdParam: string | null;
  tabParam: string | null;
  channels: Channel[];
  referrals: UnifiedReferral[];
  isDentist: boolean;
}): ActiveChannelResolution | null {
  if (!practiceParam && !caseIdParam) return null;

  let parentChannel: Channel | undefined;
  if (practiceParam) {
    parentChannel = channels.find((channel) =>
      channel.name.toLowerCase() === practiceParam.toLowerCase() || channel.id === practiceParam
    );
    if (!parentChannel) {
      const patientExists = referrals.some(r => r.patientName.toLowerCase() === practiceParam.toLowerCase());
      if (patientExists) {
        parentChannel = {
          id: '4',
          name: practiceParam,
          type: 'patient',
          lastMessage: 'Got it, thank you!',
          memberCount: 2
        };
      }
    }
  }

  let referral: UnifiedReferral | undefined;
  if (!parentChannel && caseIdParam) {
    referral = findReferralFromCaseParam(referrals, caseIdParam);
    if (referral) {
      const practiceId = getPracticeIdForReferral(referral, isDentist);
      parentChannel = channels.find((channel) => channel.id === practiceId);
    }
  } else if (caseIdParam) {
    referral = findReferralFromCaseParam(referrals, caseIdParam);
  }

  if (!parentChannel) return null;

  const targetTab = tabParam === 'documents' || tabParam === 'archived' || tabParam === 'messages'
    ? tabParam
    : 'messages';

  if (caseIdParam && referral) {
    return {
      parentChannel,
      activeChannel: {
        id: `case_${referral.id}`,
        name: referral.patientName.toUpperCase(),
        type: 'inter-practice',
        lastMessage: `Referral status: ${referral.status}`,
        memberCount: parentChannel.memberCount,
        ...(referral.id.startsWith('ext-') ? { isExternal: true } : {}),
      },
      targetTab,
      expandSection: parentChannel.isExternal ? 'external' : 'connected',
      reactivateReferralId: referral.status === 'Archived' ? referral.id : undefined,
    };
  }

  const resolveSection = (): ActiveChannelResolution['expandSection'] => {
    if (parentChannel.type === 'patient') return 'patient';
    if (parentChannel.type === 'group') return 'group';
    if (parentChannel.type === 'internal') return 'internal';
    return parentChannel.isExternal ? 'external' : 'connected';
  };

  return {
    parentChannel,
    activeChannel: parentChannel,
    targetTab,
    expandSection: resolveSection(),
  };
}
