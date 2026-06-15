import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { Channel } from '@/prototype/channelTypes';
import {
  buildSendDocumentShare,
  buildSendDocumentToast,
  type SendDocumentAttachedFile,
} from '@/prototype/sendDocumentFlow';

const channels: Channel[] = [
  { id: '3', name: 'Sunshine Dental', type: 'inter-practice', lastMessage: 'Active.', memberCount: 2 },
  { id: 'sp-1', name: 'Valley Endodontics', type: 'inter-practice', lastMessage: 'Active.', memberCount: 2 },
];

describe('prototype send-document flow helpers', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-06-30T14:05:00'));
  });

  it('builds specialist shared documents and messages for multiple practices', () => {
    const result = buildSendDocumentShare({
      role: 'specialist',
      selectedPractices: ['Sunshine Dental', 'Unknown Dental'],
      channels,
      existingMessages: {},
      files: [],
      fallbackDocument: {
        name: 'PANO_IMAGE_BOB_MARLEY.JPG',
        size: '4.8 MB',
        type: 'image',
      },
      patient: {
        firstName: 'Bob',
        lastName: 'Marley',
        dob: '02/06/1945',
      },
      note: 'Sharing updated panoramic X-ray.',
    });

    expect(result.sharedDocuments).toHaveLength(2);
    expect(result.messages['3'][0].text).toContain('Shared a document: PANO_IMAGE_BOB_MARLEY.JPG');
    expect(result.messages['3'][0].text).toContain('Patient: Bob Marley (DOB: 02/06/1945)');
    expect(result.messages['3'][0].text).toContain('Note: Sharing updated panoramic X-ray.');
    expect(result.messages['3'][0].user).toBe('Valley Endodontics');
    expect(result.messages['3'][0].document?.sentBy).toBe('Valley Endodontics (Specialist)');
    expect(result.messages['3']).toHaveLength(2);
  });

  it('builds dentist shared documents and referral-aware messages', () => {
    const files: SendDocumentAttachedFile[] = [
      { id: 'file-1', name: 'SURGERY_REPORT_COOPER.PDF', size: '2.1 MB', type: 'pdf' },
      { id: 'file-2', name: 'PANO_XRAY_REVISION.PNG', size: '4.8 MB', type: 'image' },
    ];

    const result = buildSendDocumentShare({
      role: 'dentist',
      selectedPractices: ['Valley Endodontics'],
      channels,
      existingMessages: { 'sp-1': [] },
      files,
      fallbackDocument: {
        name: '',
        size: '1.5 MB',
        type: 'pdf',
      },
      selectedReferral: 'D-1001',
      patient: {
        firstName: 'Alice',
        lastName: 'Cooper',
        dob: '12/04/1978',
      },
      note: 'Post-evaluation notes.',
    });

    expect(result.sharedDocuments).toHaveLength(2);
    expect(result.messages['sp-1']).toHaveLength(2);
    expect(result.messages['sp-1'][0].text).toContain('Directly shared document: SURGERY_REPORT_COOPER.PDF');
    expect(result.messages['sp-1'][0].text).toContain('Associated Referral: D-1001');
    expect(result.messages['sp-1'][0].text).toContain('Associated Patient: Alice Cooper (DOB: 12/04/1978)');
    expect(result.messages['sp-1'][1].text).not.toContain('Associated Patient');
  });

  it('describes route and toast outcomes by role and practice count', () => {
    expect(buildSendDocumentToast('specialist', ['Sunshine Dental'], 1)).toEqual({
      message: 'Shared document with Sunshine Dental!',
      destinationHref: '/channels?practice=Sunshine%20Dental',
    });
    expect(buildSendDocumentToast('dentist', ['Valley Endodontics', 'Downtown Oral Surgery'], 2)).toEqual({
      message: 'Shared 2 documents with 2 practices!',
      destinationHref: '/dentist/channels',
    });
  });
});
