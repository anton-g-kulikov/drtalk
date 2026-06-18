import { describe, expect, it } from 'vitest';
import {
  getChannels,
  getMessages,
  getNetwork,
  getReferralCode,
  getReferrals,
  isInRange,
} from '@/lib/referrals';
import {
  initialDocuments,
  initialMessages,
  mockChannels,
} from '@/prototype/channelFixtures';
import {
  buildCaseChannels,
  filterChannelsByType,
  filterPracticeChannels,
  splitPracticeChannels,
} from '@/prototype/channelModel';
import type { Channel } from '@/prototype/channelTypes';
import { getPrototypePageNumbers } from '@/prototype/pagination';

describe('shared prototype state use cases', () => {
  it('seeds referrals from fixtures when localStorage is empty or stale', () => {
    expect(getReferrals().length).toBeGreaterThan(1000);

    localStorage.setItem('drtalk_referrals', JSON.stringify([{ id: 'old' }]));
    expect(getReferrals().length).toBeGreaterThan(1000);
  });

  it('keeps referral labels and date ranges stable for dashboard metrics', () => {
    expect(getReferralCode('D-12')).toBe('REF-D12');
    expect(getReferralCode('7')).toBe('REF-7000X');
    expect(isInRange('06/30/2026', 'day')).toBe(true);
    expect(isInRange('01/01/2025', 'last_year')).toBe(true);
  });

  it('falls back to usable network, channel, and message defaults', () => {
    expect(getNetwork().some(practice => practice.name === 'Valley Endodontics')).toBe(true);
    expect(getChannels(true).some(channel => channel.type === 'inter-practice')).toBe(true);
    expect(Object.keys(getMessages()).length).toBeGreaterThan(0);
  });

  it('exposes shared channel fixtures without importing a route page', () => {
    expect(mockChannels.some(channel => channel.name === 'team-members')).toBe(true);
    expect(initialDocuments.length).toBeGreaterThan(0);
    expect(Object.keys(initialMessages).length).toBeGreaterThan(0);
  });

  it('builds role-specific case channels from referrals', () => {
    const referrals = [
      {
        id: 'D-1',
        patientName: 'Dentist Patient',
        type: 'Endodontics',
        source: 'Dentist',
        completion: 100,
        status: 'Sent' as const,
        receivedAt: '06/30/2026',
        dentist: 'Dr. Reed',
        specialist: 'Valley Endodontics',
      },
      {
        id: '2',
        patientName: 'Specialist Patient',
        type: 'Endodontics',
        source: 'Specialist',
        completion: 100,
        status: 'Archived' as const,
        receivedAt: '06/30/2026',
        dentist: 'Dr. Smith',
        specialist: 'Valley Endodontics',
        practice: 'Desert Bloom Dental',
      },
      {
        id: 'D-3',
        patientName: 'Draft Patient',
        type: 'Endodontics',
        source: 'Dentist',
        completion: 25,
        status: 'Draft' as const,
        receivedAt: '06/30/2026',
        dentist: 'Dr. Reed',
        specialist: 'Valley Endodontics',
      },
    ];

    const dentistCases = buildCaseChannels({
      referrals,
      isDentist: true,
      dentistPractices: [{ id: 'dn-1', name: 'Sunshine Dental' }],
      specialistClinics: [{ id: 'sp-1', name: 'Valley Endodontics' }],
    });
    const specialistCases = buildCaseChannels({
      referrals,
      isDentist: false,
      dentistPractices: [{ id: 'dn-1', name: 'Desert Bloom Dental' }],
      specialistClinics: [{ id: 'sp-1', name: 'Valley Endodontics' }],
    });

    expect(dentistCases).toHaveLength(1);
    expect(dentistCases[0]).toMatchObject({
      id: 'case_D-1',
      name: 'REF-D1: DENTIST PATIENT',
      practiceId: 'sp-1',
      isArchived: false,
    });
    expect(specialistCases).toHaveLength(1);
    expect(specialistCases[0]).toMatchObject({
      id: 'case_2',
      practiceId: 'dn-1',
      isArchived: true,
      lastMessage: 'Case archived.',
    });

    expect(buildCaseChannels({
      referrals,
      isDentist: true,
      dentistPractices: [{ id: 'dn-1', name: 'Sunshine Dental' }],
      specialistClinics: [{ id: 'sp-1', name: 'Valley Endodontics' }],
      hidePending: true,
    })).toHaveLength(0);
  });

  it('filters channel sidebar groups by type, practice, and visible case matches', () => {
    const channels: Channel[] = [
      { id: 'internal-1', name: 'team-members', type: 'internal', lastMessage: 'Team', memberCount: 3 },
      { id: 'practice-1', name: 'Valley Endodontics', type: 'inter-practice', lastMessage: 'Connected', memberCount: 2 },
      { id: 'practice-2', name: 'External Practice', type: 'inter-practice', lastMessage: 'Secure email', memberCount: 2, isExternal: true },
    ];
    const caseChannels = [
      {
        id: 'case_1',
        name: 'REF-1000X: ALICE COOPER',
        patientName: 'Alice Cooper',
        referralId: '1',
        practiceId: 'practice-1',
        isArchived: false,
        lastMessage: 'Referral status: Sent',
      },
      {
        id: 'case_2',
        name: 'REF-2000X: ARCHIVED PATIENT',
        patientName: 'Archived Patient',
        referralId: '2',
        practiceId: 'practice-2',
        isArchived: true,
        lastMessage: 'Case archived.',
      },
    ];

    expect(filterChannelsByType(channels, 'internal', 'team')).toHaveLength(1);
    expect(filterPracticeChannels(channels, caseChannels, 'alice')).toEqual([channels[1]]);
    expect(filterPracticeChannels(channels, caseChannels, 'archived')).toEqual([]);
    expect(splitPracticeChannels([channels[1], channels[2]])).toEqual({
      onPlatform: [channels[1]],
      external: [channels[2]],
    });
  });

  it('keeps shared prototype pagination windows stable across pages', () => {
    expect(getPrototypePageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPrototypePageNumbers(2, 10)).toEqual([1, 2, 3, 4, 5, '...', 10]);
    expect(getPrototypePageNumbers(9, 10)).toEqual([1, '...', 6, 7, 8, 9, 10]);
    expect(getPrototypePageNumbers(6, 12)).toEqual([1, '...', 5, 6, 7, '...', 12]);
  });
});
