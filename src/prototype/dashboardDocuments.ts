import type { Channel, NetworkPractice } from '@/lib/referrals';
import type { MessageItem, SharedDocument } from '@/prototype/channelTypes';

export type DashboardRole = 'specialist' | 'dentist';

export interface DashboardDocumentItem {
  id: string;
  name: string;
  sender: string;
  date: string;
  size: string;
  fromChannel?: boolean;
  channelName?: string;
  channelType?: 'practice' | 'case';
  caseId?: string;
  isExternal?: boolean;
  transport?: 'Email' | 'Fax' | 'App';
  isUnrecognized?: boolean;
}

export interface DashboardDocumentChannelTransfer {
  practiceName: string;
  channelId: string;
  network: NetworkPractice[];
  channels: Channel[];
  messages: Record<string, MessageItem[]>;
  sharedDocument: SharedDocument;
  destinationHref: string;
}

const specialistSenderAliases = [
  { matches: ['Sunshine', 'Smith', 'Reed'], practiceName: 'Sunshine Dental' },
  { matches: ['Desert Bloom'], practiceName: 'Desert Bloom Dental' },
  { matches: ['Oakridge'], practiceName: 'Oakridge Dental' },
  { matches: ['Black'], practiceName: 'Black Family Dental' },
  { matches: ['Miller'], practiceName: 'Miller & Associates' },
  { matches: ['Westside'], practiceName: 'Westside Pediatric Dentistry' },
];

const dentistSenderAliases = [
  { matches: ['Valley', 'Endo'], practiceName: 'Valley Endodontics' },
  { matches: ['Downtown'], practiceName: 'Downtown Oral Surgery' },
  { matches: ['Metro'], practiceName: 'Metro Orthodontics' },
  { matches: ['Arizona'], practiceName: 'Arizona Periodontics' },
  { matches: ['Beverly'], practiceName: 'Beverly Hills Dental' },
];

export function getDashboardDocumentPracticeName(
  doc: DashboardDocumentItem,
  role: DashboardRole
): string {
  const aliases = role === 'specialist' ? specialistSenderAliases : dentistSenderAliases;
  const match = aliases.find((alias) =>
    alias.matches.some((token) => doc.sender.includes(token))
  );

  if (match) return match.practiceName;
  return doc.sender.replace(' (Specialist)', '').replace(' (Dentist)', '');
}

function createPrototypeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

function getDocumentType(name: string): SharedDocument['type'] {
  const lowerName = name.toLowerCase();
  return lowerName.endsWith('.png') || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')
    ? 'image'
    : 'pdf';
}

function getRoleDefaults(role: DashboardRole): {
  isDentist: boolean;
  networkType: string;
  specialty: string;
  destinationBase: string;
} {
  if (role === 'dentist') {
    return {
      isDentist: true,
      networkType: 'Specialist',
      specialty: 'Endodontics',
      destinationBase: '/dentist/channels',
    };
  }

  return {
    isDentist: false,
    networkType: 'Dentist',
    specialty: 'General Dentistry',
    destinationBase: '/channels',
  };
}

export function buildDashboardDocumentChannelTransfer({
  doc,
  role,
  network,
  channels,
  messages,
  addSharedDocument,
}: {
  doc: DashboardDocumentItem;
  role: DashboardRole;
  network: NetworkPractice[];
  channels: Channel[];
  messages: Record<string, MessageItem[]>;
  addSharedDocument?: (sharedDocument: SharedDocument) => void;
}): DashboardDocumentChannelTransfer {
  const practiceName = getDashboardDocumentPracticeName(doc, role);
  const roleDefaults = getRoleDefaults(role);

  const networkExists = network.some((practice) =>
    practice.name.toLowerCase() === practiceName.toLowerCase()
  );
  const nextNetwork = networkExists
    ? network.map((practice) =>
        practice.name.toLowerCase() === practiceName.toLowerCase() && doc.isExternal
          ? { ...practice, isExternal: true }
          : practice
      )
    : [
        ...network,
        {
          id: createPrototypeId('ext'),
          name: practiceName,
          type: roleDefaults.networkType,
          specialty: roleDefaults.specialty,
          location: 'Phoenix, AZ',
          status: 'Connected' as const,
          verified: false,
          isExternal: true,
        },
      ];

  const existingChannel = channels.find((channel) =>
    channel.name.toLowerCase() === practiceName.toLowerCase()
  );
  const channelId = existingChannel?.id ?? createPrototypeId('ext_ch');
  const nextChannels = existingChannel
    ? channels.map((channel) =>
        channel.id === channelId && doc.isExternal
          ? { ...channel, isExternal: true, isVerified: false }
          : channel
      )
    : [
        ...channels,
        {
          id: channelId,
          name: practiceName,
          type: 'inter-practice' as const,
          lastMessage: `Practice channel created. Shared document: ${doc.name}`,
          memberCount: 2,
          isVerified: false,
          isExternal: true,
        },
      ];

  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sharedDocument: SharedDocument = {
    id: doc.id,
    channelId,
    name: doc.name,
    size: doc.size,
    type: getDocumentType(doc.name),
    sentBy: doc.sender,
    sentAt: `Today, ${timeString}`,
  };
  addSharedDocument?.(sharedDocument);

  const nextMessages = {
    ...messages,
    [channelId]: [
      ...(messages[channelId] ?? []),
      {
        id: createPrototypeId('m'),
        user: doc.sender,
        text: `Incoming document via secure email: ${doc.name}`,
        time: timeString,
        type: 'other' as const,
        transport: 'Email' as const,
        document: sharedDocument,
      },
    ],
  };

  return {
    practiceName,
    channelId,
    network: nextNetwork,
    channels: nextChannels,
    messages: nextMessages,
    sharedDocument,
    destinationHref: `${roleDefaults.destinationBase}?practice=${encodeURIComponent(practiceName)}&tab=documents`,
  };
}

