import type { Channel, MessageItem, SharedDocument } from '@/prototype/channelTypes';
import { getChannels, saveChannels, getMessages, saveMessages } from '@/lib/referrals';
import { initialDocuments, initialMessages } from '@/prototype/channelFixtures';

export type SendDocumentRole = 'specialist' | 'dentist';

export type SendDocumentFileType = SharedDocument['type'];

export interface SendDocumentAttachedFile {
  id: string;
  name: string;
  size: string;
  type: SendDocumentFileType;
}

export interface SendDocumentFallbackDocument {
  name: string;
  size: string;
  type: SendDocumentFileType;
}

export interface SendDocumentPatientDetails {
  firstName: string;
  lastName: string;
  dob: string;
}

export interface SendDocumentShareResult {
  sharedDocuments: SharedDocument[];
  messages: Record<string, MessageItem[]>;
}

function createPrototypeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

function getRoleCopy(role: SendDocumentRole): {
  sender: string;
  messageUser: string;
  singleMessagePrefix: string;
  routeBase: string;
} {
  if (role === 'dentist') {
    return {
      sender: 'Me',
      messageUser: 'Me',
      singleMessagePrefix: 'Directly shared document',
      routeBase: '/dentist/channels',
    };
  }

  return {
    sender: 'Valley Endodontics (Specialist)',
    messageUser: 'Valley Endodontics',
    singleMessagePrefix: 'Shared a document',
    routeBase: '/channels',
  };
}

function getChannelId(practiceName: string, channels: Channel[]): string {
  const exactMatch = channels.find((channel) => channel.name === practiceName);
  if (exactMatch) return exactMatch.id;

  if (practiceName === 'Sunshine Dental') {
    const sunshineChannel = channels.find((channel) => channel.id === '3');
    if (sunshineChannel) return sunshineChannel.id;
  }

  const fuzzyMatch = channels.find((channel) =>
    channel.name.toLowerCase().includes(practiceName.toLowerCase())
  );

  return fuzzyMatch?.id ?? '3';
}

function getFilesToShare(
  files: SendDocumentAttachedFile[],
  fallbackDocument: SendDocumentFallbackDocument
): SendDocumentAttachedFile[] {
  if (files.length > 0) return files;
  if (!fallbackDocument.name.trim()) return [];

  const normalizedName = fallbackDocument.name.toLowerCase().endsWith(`.${fallbackDocument.type}`)
    ? fallbackDocument.name
    : `${fallbackDocument.name}.${fallbackDocument.type}`;

  return [
    {
      id: createPrototypeId('fallback'),
      name: normalizedName.toUpperCase(),
      size: fallbackDocument.size,
      type: fallbackDocument.type,
    },
  ];
}

function getPatientSnippet(role: SendDocumentRole, patient: SendDocumentPatientDetails): string {
  const patientName = `${patient.firstName} ${patient.lastName}`.trim();
  if (!patientName) return '';

  if (role === 'dentist') {
    return `\nAssociated Patient: ${patientName}${patient.dob ? ` (DOB: ${patient.dob})` : ''}`;
  }

  return `\nPatient: ${patientName}${patient.dob ? ` (DOB: ${patient.dob})` : ''}`;
}

function buildMessageText({
  role,
  documentName,
  selectedReferral,
  patient,
  note,
  includePatientDetails,
}: {
  role: SendDocumentRole;
  documentName: string;
  selectedReferral?: string;
  patient: SendDocumentPatientDetails;
  note: string;
  includePatientDetails: boolean;
}): string {
  const copy = getRoleCopy(role);
  let text = `${copy.singleMessagePrefix}: ${documentName}`;

  if (role === 'dentist' && selectedReferral) {
    text += `\nAssociated Referral: ${selectedReferral}`;
  }

  if (includePatientDetails) {
    text += getPatientSnippet(role, patient);
    if (note.trim()) {
      text += role === 'dentist' ? `\nMessage: ${note.trim()}` : `\nNote: ${note.trim()}`;
    }
  }

  return text;
}

export function buildSendDocumentShare({
  role,
  selectedPractices,
  channels,
  existingMessages,
  files,
  fallbackDocument,
  selectedReferral,
  patient,
  note,
}: {
  role: SendDocumentRole;
  selectedPractices: string[];
  channels: Channel[];
  existingMessages: Record<string, MessageItem[]>;
  files: SendDocumentAttachedFile[];
  fallbackDocument: SendDocumentFallbackDocument;
  selectedReferral?: string;
  patient: SendDocumentPatientDetails;
  note: string;
}): SendDocumentShareResult {
  const copy = getRoleCopy(role);
  const filesToShare = getFilesToShare(files, fallbackDocument);
  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sentAt = role === 'dentist'
    ? `Today, ${timeString}`
    : `${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} ${new Date().toLocaleDateString('en-US')}`;
  const nextMessages: Record<string, MessageItem[]> = { ...existingMessages };
  const sharedDocuments: SharedDocument[] = [];

  selectedPractices.forEach((practiceName) => {
    const channelId = getChannelId(practiceName, channels);
    const documentsForPractice = filesToShare.map((file) => ({
      id: createPrototypeId(role === 'dentist' ? 'd' : 'shared'),
      channelId,
      name: file.name,
      size: file.size,
      type: file.type,
      sentBy: copy.sender,
      sentAt,
    }));

    sharedDocuments.push(...documentsForPractice);
    nextMessages[channelId] = [
      ...(nextMessages[channelId] ?? []),
      ...documentsForPractice.map((document, index) => ({
        id: createPrototypeId(role === 'dentist' ? 'm' : 'msg'),
        user: copy.messageUser,
        text: buildMessageText({
          role,
          documentName: document.name,
          selectedReferral,
          patient,
          note,
          includePatientDetails: index === 0,
        }),
        time: timeString,
        type: 'self' as const,
        transport: 'App' as const,
        document,
      })),
    ];
  });

  return {
    sharedDocuments,
    messages: nextMessages,
  };
}

export function buildSendDocumentToast(
  role: SendDocumentRole,
  selectedPractices: string[],
  documentCount: number
): { message: string; destinationHref: string } {
  const copy = getRoleCopy(role);
  const displayPracticeName = selectedPractices.length === 1
    ? selectedPractices[0]
    : `${selectedPractices.length} practices`;
  const destinationHref = selectedPractices.length === 1
    ? `${copy.routeBase}?practice=${encodeURIComponent(selectedPractices[0])}`
    : copy.routeBase;

  if (role === 'dentist') {
    return {
      message: `Shared ${documentCount} document${documentCount > 1 ? 's' : ''} with ${displayPracticeName}!`,
      destinationHref,
    };
  }

  return {
    message: `Shared document with ${displayPracticeName}!`,
    destinationHref,
  };
}

export function forwardDocument({
  role,
  document,
  targets,
  note,
}: {
  role: SendDocumentRole;
  document: { name: string; size: string };
  targets: { name: string; isCustom?: boolean; customType?: 'email' | 'fax' }[];
  note: string;
}) {
  const isDentist = role === 'dentist';
  const nextChannels = [...getChannels(isDentist)];
  const currentMessages = getMessages();
  
  const resolvedPractices = targets.map((target) => {
    if (target.isCustom) {
      const rawName = target.name.replace(/\s*\(secure email\)\s*/i, '').replace(/\s*\(secure fax\)\s*/i, '');
      let existing = nextChannels.find(c => c.name.toLowerCase() === rawName.toLowerCase());
      if (!existing) {
        existing = {
          id: `ext_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: rawName,
          type: 'inter-practice',
          isExternal: true,
          isVerified: false,
          lastMessage: 'Connection active via Secure Document Delivery.',
          memberCount: 2,
        };
        nextChannels.push(existing);
      }
      return existing.name;
    }
    return target.name;
  });
  
  const docType = document.name.toLowerCase().endsWith('.png') ||
                  document.name.toLowerCase().endsWith('.jpg') ||
                  document.name.toLowerCase().endsWith('.jpeg') ? 'image' as const : 'pdf' as const;
                  
  const share = buildSendDocumentShare({
    role,
    selectedPractices: resolvedPractices,
    channels: nextChannels,
    existingMessages: currentMessages,
    files: [],
    fallbackDocument: {
      name: document.name,
      size: document.size,
      type: docType,
    },
    patient: {
      firstName: '',
      lastName: '',
      dob: '',
    },
    note: note.trim(),
  });
  
  saveChannels(isDentist, nextChannels);
  saveMessages(share.messages);
  initialDocuments.push(...share.sharedDocuments);
  Object.entries(share.messages).forEach(([channelId, messages]) => {
    initialMessages[channelId] = messages;
  });
  
  return buildSendDocumentToast(role, resolvedPractices, share.sharedDocuments.length);
}
