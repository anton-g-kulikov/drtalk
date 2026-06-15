import { describe, expect, it } from 'vitest';
import {
  archiveDocumentDetailItem,
  getDocumentStorageKeys,
  loadDocumentDetailState,
  removeSpecialistDocumentFromInbox,
  type PrototypeDocumentItem,
} from '@/prototype/documentDetailState';

describe('prototype document detail state helpers', () => {
  it('loads active, fallback, and archived detail documents with patient-name guesses', () => {
    const customDocument: PrototypeDocumentItem = {
      id: 'doc-custom',
      name: 'REFERRAL_FORM_JOHN_DOE.PDF',
      sender: 'Dr. Jane Doe',
      date: 'Today',
      size: '1.2 MB',
    };
    const { activeKey, archivedKey } = getDocumentStorageKeys('specialist');
    localStorage.setItem(activeKey, JSON.stringify([customDocument]));
    localStorage.setItem(archivedKey, JSON.stringify([{ ...customDocument, id: 'doc-archived' }]));

    expect(loadDocumentDetailState('doc-custom', 'specialist')).toMatchObject({
      documentItem: customDocument,
      isArchived: false,
      guessedPatientName: 'John Doe',
    });
    expect(loadDocumentDetailState('doc-1', 'specialist')).toMatchObject({
      isArchived: false,
      guessedPatientName: 'Alice Cooper',
    });
    expect(loadDocumentDetailState('doc-archived', 'specialist')).toMatchObject({
      isArchived: true,
    });
  });

  it('archives a document once and removes converted specialist documents from the inbox', () => {
    const documentItem: PrototypeDocumentItem = {
      id: 'doc-custom',
      name: 'CBCT_SCAN_BOB_MARLEY.DCM',
      sender: 'Dr. Miller',
      date: 'Today',
      size: '15.8 MB',
    };
    const { activeKey, archivedKey } = getDocumentStorageKeys('specialist');
    localStorage.setItem(activeKey, JSON.stringify([documentItem]));
    localStorage.setItem(archivedKey, JSON.stringify([]));

    archiveDocumentDetailItem({ id: documentItem.id, role: 'specialist', documentItem });
    archiveDocumentDetailItem({ id: documentItem.id, role: 'specialist', documentItem });

    expect(JSON.parse(localStorage.getItem(activeKey) || '[]')).toEqual([]);
    expect(JSON.parse(localStorage.getItem(archivedKey) || '[]')).toEqual([documentItem]);

    localStorage.setItem(activeKey, JSON.stringify([documentItem]));
    removeSpecialistDocumentFromInbox(documentItem.id);
    expect(JSON.parse(localStorage.getItem(activeKey) || '[]')).toEqual([]);
  });
});
