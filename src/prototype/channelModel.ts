import type { UnifiedReferral } from '@/lib/referrals';
import { getReferralCode } from '@/lib/referrals';
import type { Channel } from './channelTypes';

export type CaseChannel = {
  id: string;
  name: string;
  patientName: string;
  referralId: string;
  practiceId: string;
  isArchived: boolean;
  isExternal?: boolean;
  lastMessage: string;
  unreadCount?: number;
};

type PracticeDirectoryEntry = {
  id: string;
  name: string;
};

export function buildCaseChannels({
  referrals,
  isDentist,
  dentistPractices,
  specialistClinics,
  hidePending,
  includeCodeInName,
}: {
  referrals: UnifiedReferral[];
  isDentist: boolean;
  dentistPractices: PracticeDirectoryEntry[];
  specialistClinics: PracticeDirectoryEntry[];
  hidePending?: boolean;
  includeCodeInName?: boolean;
}): CaseChannel[] {
  const filteredRefs = referrals.filter((ref) => {
    if (ref.status === 'Draft') return false;

    const archived = isDentist
      ? (ref.archivedByDentist === true || ref.dentistStatus === 'Archived')
      : (ref.archivedBySpecialist === true || ref.status === 'Archived');

    if (hidePending && !archived && (ref.status === 'Received' || ref.status === 'Sent')) return false;

    if (isDentist) {
      return ref.id.startsWith('D-') || 
             ref.id === '1' || 
             (ref.practice && ref.practice.toLowerCase() === 'sunshine dental') || 
             (ref.dentist && (ref.dentist.includes('Reed') || ref.dentist.includes('Taylor')));
    }

    return !ref.id.startsWith('D-');
  });

  return filteredRefs.map((ref) => {
    const code = getReferralCode(ref.id);
    let practiceId = '3';
    if (isDentist) {
      const match = specialistClinics.find((clinic) =>
        clinic.name.toLowerCase() === (ref.specialist || '').toLowerCase()
      );
      practiceId = match ? match.id : '3';
    } else {
      const match = dentistPractices.find((practice) =>
        practice.name.toLowerCase() === (ref.practice || '').toLowerCase()
      );
      practiceId = match ? match.id : '6';
    }

    const archived = isDentist
      ? (ref.archivedByDentist === true || ref.dentistStatus === 'Archived')
      : (ref.archivedBySpecialist === true || ref.status === 'Archived');
    const activeStatus = isDentist ? (ref.dentistStatus || ref.status) : ref.status;

    return {
      id: `case_${ref.id}`,
      name: includeCodeInName === false ? ref.patientName.toUpperCase() : `${code}: ${ref.patientName.toUpperCase()}`,
      patientName: ref.patientName,
      referralId: ref.id,
      practiceId,
      isArchived: archived,
      isExternal: ref.id.startsWith('ext-'),
      lastMessage: archived ? 'Case archived.' : `Referral status: ${activeStatus}`,
      unreadCount: ref.unreadCount,
    };
  });
}

export function filterChannelsByType(
  channels: Channel[],
  type: Channel['type'],
  query: string
): Channel[] {
  const normalizedQuery = query.toLowerCase();
  return channels
    .filter((channel) => channel.type === type)
    .filter((channel) => !channel.isArchived)
    .filter((channel) => channel.name.toLowerCase().includes(normalizedQuery));
}

export function filterCaseChannels(caseChannels: CaseChannel[], query: string): CaseChannel[] {
  const normalizedQuery = query.toLowerCase();
  return caseChannels.filter((caseChannel) =>
    caseChannel.name.toLowerCase().includes(normalizedQuery)
  );
}

export function filterPracticeChannels(
  channels: Channel[],
  caseChannels: CaseChannel[],
  query: string
): Channel[] {
  const normalizedQuery = query.toLowerCase();
  return channels
    .filter((channel) => channel.type === 'inter-practice')
    .filter((channel) => {
      const matchesPractice = channel.name.toLowerCase().includes(normalizedQuery);
      const hasMatchingCase = caseChannels.some((caseChannel) =>
        caseChannel.practiceId === channel.id &&
        !caseChannel.isArchived &&
        caseChannel.name.toLowerCase().includes(normalizedQuery)
      );
      return matchesPractice || hasMatchingCase;
    });
}

export function splitPracticeChannels(channels: Channel[]): {
  onPlatform: Channel[];
  external: Channel[];
} {
  return {
    onPlatform: channels.filter((channel) => !channel.isExternal),
    external: channels.filter((channel) => channel.isExternal),
  };
}
