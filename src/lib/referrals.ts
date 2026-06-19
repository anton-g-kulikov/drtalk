"use client";

export type ReferralStatus = 'Received' | 'Sent' | 'Accepted' | 'Scheduled' | 'Released' | 'Completed' | 'Archived' | 'Draft';

export interface UnifiedReferral {
  id: string;
  patientName: string;
  type: string;
  source: string;
  completion: number;
  status: ReferralStatus;
  receivedAt: string;
  lastUpdate?: string;
  nextStep?: string;
  dentist: string;
  specialist: string;
  specialistDoctor?: string;
  practice?: string;
  urgency?: 'Routine' | 'Urgent' | 'Emergency';
  sender?: string;
  assignedTo?: string;
  archivedByDentist?: boolean;
  archivedBySpecialist?: boolean;
  dentistStatus?: ReferralStatus;
}

import { generateMockData, dentistPractices, specialistClinics } from './mockGenerator';

const mockData = generateMockData();
export const initialReferrals: UnifiedReferral[] = mockData.referrals.length > 0 
  ? mockData.referrals 
  : [];

export function getReferrals(): UnifiedReferral[] {
  if (typeof window === 'undefined') return initialReferrals;
  const stored = localStorage.getItem('drtalk_referrals');
  
  // Initialize or overwrite if it's the old/small mock list or baseline date changed
  if (!stored) {
    localStorage.setItem('drtalk_referrals', JSON.stringify(initialReferrals));
    return initialReferrals;
  }
  try {
    const parsed = JSON.parse(stored);
    const hasReleasedMocks = Array.isArray(parsed) && parsed.some(r => r.id === 'D-9001');
    if (Array.isArray(parsed) && parsed.length >= 1000 && hasReleasedMocks) {
      return parsed.map((r: any) => ({
        ...r,
        specialist: r.specialist || r.practice || 'Valley Endodontics'
      }));
    }
    localStorage.setItem('drtalk_referrals', JSON.stringify(initialReferrals));
    return initialReferrals;
  } catch (e) {
    return initialReferrals;
  }
}

export function saveReferrals(referrals: UnifiedReferral[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('drtalk_referrals', JSON.stringify(referrals));
}

export function updateReferralStatus(id: string, status: ReferralStatus): UnifiedReferral[] {
  const referrals = getReferrals();
  const updated = referrals.map(r => {
    if (r.id === id) {
      const updateObj: Partial<UnifiedReferral> = { status };
      if (status === 'Archived') {
        updateObj.archivedBySpecialist = true;
      } else {
        updateObj.archivedBySpecialist = false;
      }
      return { ...r, ...updateObj };
    }
    return r;
  });
  saveReferrals(updated);
  return updated;
}

export function updateDentistReferralStatus(id: string, status: ReferralStatus): UnifiedReferral[] {
  const referrals = getReferrals();
  const updated = referrals.map(r => {
    if (r.id === id) {
      const updateObj: Partial<UnifiedReferral> = {};
      if (status === 'Archived') {
        updateObj.archivedByDentist = true;
        updateObj.dentistStatus = 'Archived';
      } else {
        updateObj.archivedByDentist = false;
        updateObj.dentistStatus = status;
      }
      return { ...r, ...updateObj };
    }
    return r;
  });
  saveReferrals(updated);
  return updated;
}

export function unarchiveReferral(id: string): UnifiedReferral[] {
  const referrals = getReferrals();
  const updated = referrals.map(r => {
    if (r.id === id) {
      const updateObj: Partial<UnifiedReferral> = {
        archivedBySpecialist: false,
        archivedByDentist: false,
      };
      if (r.status === 'Archived') {
        updateObj.status = 'Released';
      }
      if (r.dentistStatus === 'Archived') {
        updateObj.dentistStatus = 'Released';
      }
      return { ...r, ...updateObj };
    }
    return r;
  });
  saveReferrals(updated);
  return updated;
}

export function updateReferralAssignee(id: string, assignedTo?: string): UnifiedReferral[] {
  const referrals = getReferrals();
  const updated = referrals.map(r => r.id === id ? { ...r, assignedTo } : r);
  saveReferrals(updated);
  return updated;
}

export function getReferralCode(id: string): string {
  if (id.startsWith('D-')) {
    return `REF-${id.replace('-', '')}`;
  }
  return `REF-${id}000X`;
}

export function isInRange(receivedAt: string, range: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'last_year'): boolean {
  // Use current date: Jun 30, 2026
  const currentDate = new Date('2026-06-30T18:00:00+02:00');
  
  const dateStr = receivedAt.includes('\n') ? receivedAt.split('\n')[1] : receivedAt;
  const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return false;
  
  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  const refDate = new Date(year, month - 1, day);
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // June is 5
  
  if (range === 'day') {
    return refDate.getFullYear() === currentYear &&
           refDate.getMonth() === currentMonth &&
           refDate.getDate() === currentDate.getDate();
  }
  if (range === 'week') {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = currentDate.getDay();
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return refDate >= startOfWeek && refDate <= endOfWeek;
  }
  if (range === 'month') {
    return refDate.getFullYear() === currentYear && refDate.getMonth() === currentMonth;
  }
  if (range === 'quarter') {
    const currentQuarter = Math.floor(currentMonth / 3);
    const refQuarter = Math.floor(refDate.getMonth() / 3);
    return refDate.getFullYear() === currentYear && refQuarter === currentQuarter;
  }
  if (range === 'year') {
    return refDate.getFullYear() === currentYear;
  }
  if (range === 'last_year') {
    return refDate.getFullYear() === currentYear - 1;
  }
  return false;
}

// Persisted Network and Channels definitions
export interface NetworkPractice {
  id: string;
  name: string;
  type: string;
  specialty: string;
  location: string;
  status: 'Connected' | 'Nearby' | 'Suggested';
  verified: boolean;
  isExternal?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  type: 'internal' | 'inter-practice' | 'patient' | 'public' | 'group';
  lastMessage: string;
  unreadCount?: number;
  memberCount: number;
  isVerified?: boolean;
  isExternal?: boolean;
}

export const initialNetwork: NetworkPractice[] = [
  // ── On-platform Specialist neighbours (dentist-side sees these) ───────────
  { id: 'sp-1', name: 'Valley Endodontics', type: 'Specialist', specialty: 'Endodontics', location: 'Phoenix, AZ', status: 'Connected', verified: true },
  { id: 'sp-2', name: 'Downtown Oral Surgery', type: 'Specialist', specialty: 'Oral Surgery', location: 'Phoenix, AZ', status: 'Connected', verified: true },
  { id: 'sp-3', name: 'Arizona Periodontics', type: 'Specialist', specialty: 'Periodontics', location: 'Scottsdale, AZ', status: 'Nearby', verified: true },
  { id: 'sp-4', name: 'Desert Dental Implants', type: 'Specialist', specialty: 'Implantology', location: 'Tempe, AZ', status: 'Suggested', verified: false },
  { id: 'sp-5', name: 'Skyline Orthodontics', type: 'Specialist', specialty: 'Orthodontics', location: 'Phoenix, AZ', status: 'Nearby', verified: true },

  // ── 16 On-platform Dentist connections (specialist-side "My Network") ─────
  { id: 'dn-1',  name: 'Sunshine Dental',                type: 'Dentist', specialty: 'General Dentistry',   location: 'Phoenix, AZ',    status: 'Connected', verified: true },
  { id: 'dn-2',  name: 'Desert Bloom Dental',            type: 'Dentist', specialty: 'General Dentistry',   location: 'Scottsdale, AZ', status: 'Connected', verified: true },
  { id: 'dn-3',  name: 'Mountain View Family Dental',    type: 'Dentist', specialty: 'Cosmetic Dentistry',  location: 'Tempe, AZ',      status: 'Connected', verified: true },
  { id: 'dn-4',  name: 'Oakridge Dental',                type: 'Dentist', specialty: 'General Dentistry',   location: 'Phoenix, AZ',    status: 'Connected', verified: true },
  { id: 'dn-5',  name: 'Black Family Dental',            type: 'Dentist', specialty: 'General Dentistry',   location: 'Mesa, AZ',       status: 'Connected', verified: true },
  { id: 'dn-6',  name: 'White Dental Group',             type: 'Dentist', specialty: 'General Dentistry',   location: 'Chandler, AZ',   status: 'Connected', verified: true },
  { id: 'dn-7',  name: 'Miller & Associates',            type: 'Dentist', specialty: 'Family Dentistry',    location: 'Gilbert, AZ',    status: 'Connected', verified: true },
  { id: 'dn-8',  name: 'Westside Pediatric Dentistry',  type: 'Dentist', specialty: 'Pediatric Dentistry', location: 'Glendale, AZ',   status: 'Connected', verified: true },
  { id: 'dn-9',  name: 'Aspen Crest Dental',            type: 'Dentist', specialty: 'General Dentistry',   location: 'Peoria, AZ',     status: 'Connected', verified: true },
  { id: 'dn-10', name: 'Boulder Valley Dental',          type: 'Dentist', specialty: 'Cosmetic Dentistry',  location: 'Tempe, AZ',      status: 'Connected', verified: true },
  { id: 'dn-11', name: 'Canyon Creek Dental',            type: 'Dentist', specialty: 'General Dentistry',   location: 'Scottsdale, AZ', status: 'Connected', verified: false },
  { id: 'dn-12', name: 'Foothills Family Dentistry',    type: 'Dentist', specialty: 'Family Dentistry',    location: 'Ahwatukee, AZ',  status: 'Connected', verified: true },
  { id: 'dn-13', name: 'Glacier Peak Dental',           type: 'Dentist', specialty: 'General Dentistry',   location: 'Phoenix, AZ',    status: 'Nearby',    verified: true },
  { id: 'dn-14', name: 'Harbor Light Dental',           type: 'Dentist', specialty: 'Cosmetic Dentistry',  location: 'Tempe, AZ',      status: 'Nearby',    verified: true },
  { id: 'dn-15', name: 'Meadowbrook Dental',            type: 'Dentist', specialty: 'General Dentistry',   location: 'Mesa, AZ',       status: 'Nearby',    verified: false },
  { id: 'dn-16', name: 'Summit Ridge Dental',           type: 'Dentist', specialty: 'General Dentistry',   location: 'Chandler, AZ',   status: 'Suggested', verified: false },

  // ── 15 External contacts (off-platform, connected via e-fax / secure email) ─
  { id: 'ext-1',  name: 'Pinecrest Dental Group',       type: 'Dentist',    specialty: 'General Dentistry',  location: 'Phoenix, AZ',    status: 'Connected', verified: false, isExternal: true },
  { id: 'ext-2',  name: 'Oakwood Family Dental',        type: 'Dentist',    specialty: 'General Dentistry',  location: 'Scottsdale, AZ', status: 'Connected', verified: false, isExternal: true },
  { id: 'ext-3',  name: 'Riverfront Dental Care',       type: 'Dentist',    specialty: 'Cosmetic Dentistry', location: 'Tempe, AZ',      status: 'Connected', verified: false, isExternal: true },
  { id: 'ext-4',  name: 'Heritage Dental Partners',     type: 'Dentist',    specialty: 'Family Dentistry',   location: 'Gilbert, AZ',    status: 'Connected', verified: false, isExternal: true },
  { id: 'ext-5',  name: 'Sunrise Smiles Dental',        type: 'Dentist',    specialty: 'General Dentistry',  location: 'Mesa, AZ',       status: 'Connected', verified: false, isExternal: true },
  { id: 'ext-6',  name: 'Desert Rose Dentistry',        type: 'Dentist',    specialty: 'Cosmetic Dentistry', location: 'Peoria, AZ',     status: 'Connected', verified: false, isExternal: true },
  { id: 'ext-7',  name: 'Copper State Dental',          type: 'Dentist',    specialty: 'General Dentistry',  location: 'Glendale, AZ',   status: 'Connected', verified: false, isExternal: true },
  { id: 'ext-8',  name: 'Cactus Park Dental',           type: 'Dentist',    specialty: 'Family Dentistry',   location: 'Phoenix, AZ',    status: 'Connected', verified: false, isExternal: true },
  { id: 'ext-9',  name: 'Red Rock Dental Studio',       type: 'Dentist',    specialty: 'General Dentistry',  location: 'Sedona, AZ',     status: 'Connected', verified: false, isExternal: true },
  { id: 'ext-10', name: 'Grand Canyon Dental Group',    type: 'Dentist',    specialty: 'General Dentistry',  location: 'Flagstaff, AZ',  status: 'Connected', verified: false, isExternal: true },
  { id: 'ext-11', name: 'Apex Endodontics',             type: 'Specialist', specialty: 'Endodontics',        location: 'Phoenix, AZ',    status: 'Connected', verified: false, isExternal: true },
  { id: 'ext-12', name: 'Metro Oral Surgery',           type: 'Specialist', specialty: 'Oral Surgery',       location: 'Scottsdale, AZ', status: 'Connected', verified: false, isExternal: true },
  { id: 'ext-13', name: 'Summit Periodontics',          type: 'Specialist', specialty: 'Periodontics',       location: 'Tempe, AZ',      status: 'Connected', verified: false, isExternal: true },
  { id: 'ext-14', name: 'Desert Ridge Implants',        type: 'Specialist', specialty: 'Implantology',       location: 'Chandler, AZ',   status: 'Connected', verified: false, isExternal: true },
  { id: 'ext-15', name: 'Valley Orthodontic Center',    type: 'Specialist', specialty: 'Orthodontics',       location: 'Mesa, AZ',       status: 'Connected', verified: false, isExternal: true },
];

export function getNetwork(): NetworkPractice[] {
  if (typeof window === 'undefined') return initialNetwork;
  const stored = localStorage.getItem('drtalk_network');
  if (!stored) {
    localStorage.setItem('drtalk_network', JSON.stringify(initialNetwork));
    return initialNetwork;
  }
  try {
    const parsed = JSON.parse(stored);
    // Refresh if stale (old list had < 28 entries or no external contacts)
    if (Array.isArray(parsed) && (parsed.length < 28 || !parsed.some((p: NetworkPractice) => p.isExternal))) {
      localStorage.setItem('drtalk_network', JSON.stringify(initialNetwork));
      return initialNetwork;
    }
    return parsed;
  } catch (e) {
    return initialNetwork;
  }
}


export function saveNetwork(network: NetworkPractice[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('drtalk_network', JSON.stringify(network));
}


export function getChannels(isDentist: boolean): Channel[] {
  if (typeof window === 'undefined') return [];
  const key = isDentist ? 'drtalk_channels_dentist' : 'drtalk_channels_specialist';
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const parsed: Channel[] = JSON.parse(stored);
      // Cache-bust: if any known-external practice is still marked as on-platform,
      // or if Oakwood Family Dental (id '25') is missing (newly added), re-seed
      const missingAlice = !parsed.some(c => c.name.toLowerCase() === 'alice cooper');
      if (!isDentist) {
        const knownExternal = ['pinecrest dental group', 'oakwood family dental', 'riverfront dental care',
          'heritage dental partners', 'sunrise smiles dental', 'desert rose dentistry',
          'copper state dental', 'cactus park dental', 'red rock dental studio', 'grand canyon dental group'];
        const missingOakwood = !parsed.some(c => c.id === '25');
        const needsReset = missingOakwood || missingAlice || parsed.some(c =>
          c.type === 'inter-practice' &&
          !c.isExternal &&
          knownExternal.includes(c.name.toLowerCase())
        );
        if (!needsReset) return parsed;
        // Fall through to re-seed
        localStorage.removeItem(key);
      } else {
        if (missingAlice) {
          localStorage.removeItem(key);
        } else {
          return parsed;
        }
      }
    } catch (e) {
      // ignore parsing errors and fallback
    }
  }

  let defaults: Channel[] = [];
  if (isDentist) {
    defaults = [
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
  } else {
    // Practice names that are external (off-platform) contacts
    const externalPracticeNames = new Set([
      'pinecrest dental group', 'oakwood family dental', 'riverfront dental care',
      'heritage dental partners', 'sunrise smiles dental', 'desert rose dentistry',
      'copper state dental', 'cactus park dental', 'red rock dental studio',
      'grand canyon dental group',
    ]);
    defaults = [
      { id: '1', name: 'team-members', type: 'internal', lastMessage: 'Reviewing tooth #14...', unreadCount: 2, memberCount: 12 },
      { id: '2', name: 'admin-billing', type: 'internal', lastMessage: 'March report ready.', memberCount: 4 },
      ...dentistPractices.map(practice => ({
        id: practice.id,
        name: practice.name,
        type: 'inter-practice' as const,
        lastMessage: 'Practice connection active.',
        memberCount: 2,
        ...(externalPracticeNames.has(practice.name.toLowerCase()) ? { isExternal: true, isVerified: false } : {}),
      })),
      { id: '4', name: 'Alice Cooper', type: 'patient', lastMessage: 'Got it, thank you!', memberCount: 2 },
      { id: '5', name: 'general-updates', type: 'public', lastMessage: 'Welcome to the network!', memberCount: 124 },
    ];
  }
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
}

export function saveChannels(isDentist: boolean, channels: Channel[]) {
  if (typeof window === 'undefined') return;
  const key = isDentist ? 'drtalk_channels_dentist' : 'drtalk_channels_specialist';
  localStorage.setItem(key, JSON.stringify(channels));
}

export function getMessages(): Record<string, any[]> {
  if (typeof window === 'undefined') return mockData.messages;
  const stored = localStorage.getItem('drtalk_messages');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed['case_D-9001']) {
        return parsed;
      }
    } catch (e) {
      // ignore
    }
  }
  localStorage.setItem('drtalk_messages', JSON.stringify(mockData.messages));
  return mockData.messages;
}

export function saveMessages(messages: Record<string, any[]>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('drtalk_messages', JSON.stringify(messages));
}
