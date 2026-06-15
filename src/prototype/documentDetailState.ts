"use client";

export type PrototypeDocumentRole = 'specialist' | 'dentist';

export interface PrototypeDocumentItem {
  id: string;
  name: string;
  sender: string;
  date: string;
  size: string;
  fromChannel?: boolean;
  channelName?: string;
}

export type PrototypeDocumentLoadResult = {
  documentItem: PrototypeDocumentItem;
  isArchived: boolean;
  guessedPatientName: string;
};

export function getDocumentStorageKeys(role: PrototypeDocumentRole) {
  return {
    activeKey: role === 'dentist' ? 'drtalk_dentist_docs' : 'drtalk_specialist_docs',
    archivedKey: role === 'dentist' ? 'drtalk_dentist_archived_docs' : 'drtalk_specialist_archived_docs',
  };
}

export function getDocumentFallbacks(role: PrototypeDocumentRole): PrototypeDocumentItem[] {
  if (role === 'dentist') {
    return [
      { id: 'doc-dentist-1', name: 'PANO_REPLY_ALICE_COOPER.PNG', sender: 'Valley Endodontics', date: 'Today, 10:24 AM', size: '2.4 MB', channelName: 'Valley Endodontics', fromChannel: true },
      { id: 'doc-dentist-2', name: 'TREATMENT_PLAN_REVISION.PDF', sender: 'Downtown Oral Surgery', date: 'Yesterday, 02:15 PM', size: '1.8 MB', channelName: 'Downtown Oral Surgery', fromChannel: false },
      { id: 'doc-dentist-3', name: 'CBCT_MANDIBULAR_RECONSTRUCTION.ZIP', sender: 'Arizona Periodontics', date: '05/10/2026, 04:30 PM', size: '12.4 MB', channelName: 'Arizona Periodontics', fromChannel: true },
    ];
  }

  return [
    { id: 'doc-1', name: 'PANO_IMAGE_ALICE_COOPER.JPG', sender: 'Dr. Smith (Dentist)', date: '10:05 AM 05/18/2026', size: '2.4 MB', fromChannel: true, channelName: 'Sunshine Dental' },
    { id: 'doc-2', name: 'REFERRAL_FORM_JOHN_DOE.PDF', sender: 'Dr. Jane Doe (Dentist)', date: '09:15 AM 05/18/2026', size: '1.2 MB', fromChannel: false },
    { id: 'doc-3', name: 'CBCT_SCAN_BOB_MARLEY.DCM', sender: 'Dr. Robert Miller', date: '04:30 PM 05/17/2026', size: '15.8 MB', fromChannel: true, channelName: 'Westside Pediatric Dentistry' },
  ];
}

export function loadDocumentList(storageKey: string): PrototypeDocumentItem[] {
  if (typeof window === 'undefined') return [];

  const saved = localStorage.getItem(storageKey);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function saveDocumentList(storageKey: string, documents: PrototypeDocumentItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey, JSON.stringify(documents));
}

export function guessDocumentPatientName(documentName: string): string {
  if (documentName.includes('ALICE_COOPER')) return 'Alice Cooper';
  if (documentName.includes('JOHN_DOE')) return 'John Doe';
  if (documentName.includes('BOB_MARLEY')) return 'Bob Marley';
  return 'NEW PATIENT';
}

export function loadDocumentDetailState(id: string, role: PrototypeDocumentRole): PrototypeDocumentLoadResult | null {
  const { activeKey, archivedKey } = getDocumentStorageKeys(role);

  const activeDocument = loadDocumentList(activeKey).find((documentItem) => documentItem.id === id);
  const fallbackDocument = getDocumentFallbacks(role).find((documentItem) => documentItem.id === id);
  const archivedDocument = loadDocumentList(archivedKey).find((documentItem) => documentItem.id === id);
  const documentItem = activeDocument || fallbackDocument || archivedDocument;

  if (!documentItem) return null;

  return {
    documentItem,
    isArchived: !activeDocument && !fallbackDocument && Boolean(archivedDocument),
    guessedPatientName: guessDocumentPatientName(documentItem.name),
  };
}

export function archiveDocumentDetailItem({
  id,
  role,
  documentItem,
}: {
  id: string;
  role: PrototypeDocumentRole;
  documentItem: PrototypeDocumentItem;
}) {
  const { activeKey, archivedKey } = getDocumentStorageKeys(role);
  const activeDocs = loadDocumentList(activeKey).filter((item) => item.id !== id);
  const archivedDocs = loadDocumentList(archivedKey);
  const nextArchivedDocs = archivedDocs.some((item) => item.id === id)
    ? archivedDocs
    : [documentItem, ...archivedDocs];

  saveDocumentList(activeKey, activeDocs);
  saveDocumentList(archivedKey, nextArchivedDocs);
}

export function removeSpecialistDocumentFromInbox(id: string) {
  const { activeKey } = getDocumentStorageKeys('specialist');
  saveDocumentList(
    activeKey,
    loadDocumentList(activeKey).filter((documentItem) => documentItem.id !== id),
  );
}
