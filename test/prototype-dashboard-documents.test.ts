import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { SharedDocument } from '@/prototype/channelTypes';
import {
  buildDashboardDocumentChannelTransfer,
  getDashboardDocumentPracticeName,
  type DashboardDocumentItem,
} from '@/prototype/dashboardDocuments';

const baseDoc: DashboardDocumentItem = {
  id: 'doc-ext-1',
  name: 'ALICE_COOPER_CBCT.pdf',
  sender: 'Dr. Taylor Reed',
  date: '06/30/2026',
  size: '4.2 MB',
  isExternal: true,
};

describe('prototype dashboard document helpers', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-06-30T14:05:00'));
  });

  it('normalizes dashboard document sender names by role', () => {
    expect(getDashboardDocumentPracticeName(baseDoc, 'specialist')).toBe('Sunshine Dental');
    expect(getDashboardDocumentPracticeName({ ...baseDoc, sender: 'Valley Endodontics' }, 'dentist')).toBe('Valley Endodontics');
    expect(getDashboardDocumentPracticeName({ ...baseDoc, sender: 'Beverly Specialist Group' }, 'dentist')).toBe('Beverly Hills Dental');
  });

  it('builds a specialist transfer that adds an external dentist channel and route target', () => {
    const addSharedDocument = vi.fn();

    const result = buildDashboardDocumentChannelTransfer({
      doc: baseDoc,
      role: 'specialist',
      network: [],
      channels: [],
      messages: {},
      addSharedDocument,
    });

    expect(result.practiceName).toBe('Sunshine Dental');
    expect(result.channelId).toMatch(/^ext_ch_/);
    expect(result.destinationHref).toBe('/channels?practice=Sunshine%20Dental&tab=documents');
    expect(result.network).toMatchObject([
      {
        name: 'Sunshine Dental',
        type: 'Dentist',
        specialty: 'General Dentistry',
        isExternal: true,
        verified: false,
      },
    ]);
    expect(result.channels).toMatchObject([
      {
        name: 'Sunshine Dental',
        type: 'inter-practice',
        isExternal: true,
        isVerified: false,
      },
    ]);
    expect(result.messages[result.channelId][0]).toMatchObject({
      user: 'Dr. Taylor Reed',
      text: 'Incoming document via secure email: ALICE_COOPER_CBCT.pdf',
      transport: 'Email',
    });
    expect(addSharedDocument).toHaveBeenCalledWith(expect.objectContaining<Partial<SharedDocument>>({
      id: 'doc-ext-1',
      channelId: result.channelId,
      name: 'ALICE_COOPER_CBCT.pdf',
      type: 'pdf',
      sentBy: 'Dr. Taylor Reed',
    }));
  });

  it('builds a dentist transfer that reuses an existing specialist channel', () => {
    const addSharedDocument = vi.fn();

    const result = buildDashboardDocumentChannelTransfer({
      doc: { ...baseDoc, name: 'scan.jpg', sender: 'Metro Specialist Team', size: '2.1 MB' },
      role: 'dentist',
      network: [
        {
          id: 'net-1',
          name: 'Metro Orthodontics',
          type: 'Specialist',
          specialty: 'Orthodontics',
          location: 'Phoenix, AZ',
          status: 'Connected',
          verified: true,
        },
      ],
      channels: [
        {
          id: 'sp-3',
          name: 'Metro Orthodontics',
          type: 'inter-practice',
          lastMessage: 'Practice connection active.',
          memberCount: 2,
        },
      ],
      messages: { 'sp-3': [] },
      addSharedDocument,
    });

    expect(result.practiceName).toBe('Metro Orthodontics');
    expect(result.channelId).toBe('sp-3');
    expect(result.destinationHref).toBe('/dentist/channels?practice=Metro%20Orthodontics&tab=documents');
    expect(result.network).toHaveLength(1);
    expect(result.channels).toHaveLength(1);
    expect(result.messages['sp-3'][0].document).toMatchObject({
      channelId: 'sp-3',
      type: 'image',
      name: 'scan.jpg',
    });
  });
});
