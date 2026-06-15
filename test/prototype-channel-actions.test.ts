import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { Channel, MessageItem, SharedDocument } from '@/prototype/channelTypes';
import type { CaseChannel } from '@/prototype/channelModel';
import {
  buildChannelGroupCreation,
  buildChannelMessageSend,
  resolveActiveChannelFromQuery,
} from '@/prototype/channelActions';
import type { UnifiedReferral } from '@/lib/referrals';

const channels: Channel[] = [
  { id: '6', name: 'Sunshine Dental', type: 'inter-practice', lastMessage: 'Practice connection active.', memberCount: 2 },
  { id: '7', name: 'Downtown Oral Surgery', type: 'inter-practice', lastMessage: 'Practice connection active.', memberCount: 2 },
  { id: 'team', name: 'team-members', type: 'internal', lastMessage: 'Reviewing tooth #14.', memberCount: 12 },
];

const caseChannels: CaseChannel[] = [
  {
    id: 'case_1',
    name: 'ALICE COOPER',
    patientName: 'Alice Cooper',
    referralId: '1',
    practiceId: '6',
    isArchived: false,
    lastMessage: 'Referral status: Scheduled',
  },
];

const referrals: UnifiedReferral[] = [
  {
    id: '1',
    patientName: 'Alice Cooper',
    type: 'Endodontic',
    source: 'App',
    completion: 30,
    status: 'Archived',
    receivedAt: '06/30/2026',
    dentist: 'Dr. Smith',
    specialist: 'Valley Endodontics',
    practice: 'Sunshine Dental',
  },
];

describe('prototype channel actions', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-06-30T14:05:00'));
  });

  it('builds group channel creation with selected participants and welcome message', () => {
    const result = buildChannelGroupCreation({
      groupName: 'Case Review',
      participants: [
        { id: 'p1', name: 'Dr. Reed', role: 'Dentist', selected: true },
        { id: 'p2', name: 'Dr. Kim', role: 'Specialist', selected: false },
      ],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.channel).toMatchObject({
      name: 'Case Review',
      type: 'group',
      memberCount: 2,
    });
    expect(result.message.text).toContain('Case Review');
    expect(result.message.text).toContain('Dr. Reed');
  });

  it('rejects empty group names and empty participant sets', () => {
    expect(buildChannelGroupCreation({ groupName: '', participants: [] })).toEqual({
      ok: false,
      error: 'Please enter a group chat name.',
    });
    expect(buildChannelGroupCreation({
      groupName: 'Case Review',
      participants: [{ id: 'p1', name: 'Dr. Reed', role: 'Dentist', selected: false }],
    })).toEqual({
      ok: false,
      error: 'Please select at least one participant.',
    });
  });

  it('builds message sends with optional attached document and parent last-message updates', () => {
    const result = buildChannelMessageSend({
      activeChannel: caseChannels[0] as unknown as Channel,
      channels,
      caseChannels,
      messages: {},
      documents: [],
      inputText: 'Please review this scan.',
      attachedDoc: { name: 'SCAN.PDF', size: '1.2 MB', type: 'pdf' },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.documents).toMatchObject<Partial<SharedDocument>[]>([
      { channelId: 'case_1', name: 'SCAN.PDF', sentBy: 'Me' },
    ]);
    expect(result.messages.case_1[0]).toMatchObject<Partial<MessageItem>>({
      text: 'Please review this scan.',
      type: 'self',
      transport: 'App',
    });
    expect(result.channels.find((channel) => channel.id === '6')?.lastMessage).toBe('Shared document: SCAN.PDF');
  });

  it('resolves practice and case query params into active channel state', () => {
    const result = resolveActiveChannelFromQuery({
      practiceParam: 'Sunshine Dental',
      caseIdParam: 'case_1',
      tabParam: 'documents',
      channels,
      referrals,
      isDentist: false,
    });

    expect(result?.activeChannel).toMatchObject({
      id: 'case_1',
      name: 'ALICE COOPER',
    });
    expect(result?.parentChannel?.id).toBe('6');
    expect(result?.targetTab).toBe('documents');
    expect(result?.reactivateReferralId).toBe('1');
  });
});
