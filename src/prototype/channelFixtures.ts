import { dentistPractices, generateMockData, specialistClinics } from '@/lib/mockGenerator';
import type { Channel, MessageItem, SharedDocument } from './channelTypes';

const mockData = generateMockData();

export const initialDocuments: SharedDocument[] = mockData.documents;
export const initialMessages: Record<string, MessageItem[]> = mockData.messages;

export const mockChannels: Channel[] = [
  { id: '1', name: 'team-members', type: 'internal', lastMessage: 'Reviewing tooth #14...', unreadCount: 2, memberCount: 12 },
  { id: '2', name: 'admin-billing', type: 'internal', lastMessage: 'March report ready.', memberCount: 4 },
  ...specialistClinics.map(clinic => ({
    id: clinic.id,
    name: clinic.name,
    type: 'inter-practice' as const,
    lastMessage: clinic.name === 'Valley Endodontics' ? 'Pano image uploaded for Alice Cooper.' : 'Practice connection active.',
    memberCount: 2
  })),
  { id: '4', name: 'Alice Cooper', type: 'patient', lastMessage: 'Got it, thank you!', memberCount: 2 },
  { id: '5', name: 'general-updates', type: 'public', lastMessage: 'Welcome to the network!', memberCount: 124 },
];

export interface GroupParticipant {
  id: string;
  name: string;
  practice: string;
  selected: boolean;
}

export const mockGroupParticipants: GroupParticipant[] = [
  { id: 'gp1', name: 'Dr. John Smith', practice: 'Sunshine Dental (Me)', selected: false },
  { id: 'gp2', name: 'Jane Doe', practice: 'Sunshine Dental (Me)', selected: false },
  { id: 'gp3', name: 'Dr. Clara Valley', practice: 'Valley Endodontics', selected: false },
  { id: 'gp4', name: 'Robert Chen', practice: 'Valley Endodontics', selected: false },
  { id: 'gp5', name: 'Dr. Marcus Jones', practice: 'Downtown Oral Surgery', selected: false },
  { id: 'gp6', name: 'Linda Brooks', practice: 'Downtown Oral Surgery', selected: false },
  { id: 'gp7', name: 'Dr. Angela Metro', practice: 'Metro Orthodontics', selected: false },
  { id: 'gp8', name: 'Dr. David Bowie', practice: 'Arizona Periodontics', selected: false },
];

export const mockAttachments = [
  { name: 'pano_xray_post_op.png', size: '3.1 MB', type: 'image' as const },
  { name: 'referral_slip_signed.pdf', size: '1.2 MB', type: 'pdf' as const },
  { name: 'ct_scan_maxilla.zip', size: '18.4 MB', type: 'zip' as const },
  { name: 'clinical_notes_cooper.pdf', size: '840 KB', type: 'pdf' as const }
];

export { dentistPractices, specialistClinics };
