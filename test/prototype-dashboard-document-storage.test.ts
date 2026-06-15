import { beforeEach, describe, expect, it } from 'vitest';
import {
  loadDashboardDocumentStorage,
  saveDashboardDocumentsToStorage,
  type DashboardDocumentStorageConfig,
} from '@/prototype/dashboardDocumentStorage';
import type { DashboardDocumentItem } from '@/prototype/dashboardDocuments';

const activeDefaults: DashboardDocumentItem[] = [
  { id: 'doc-1', name: 'ALICE.PDF', sender: 'Sunshine Dental', date: 'Today', size: '1 MB' },
  { id: 'doc-2', name: 'BOB.PDF', sender: 'Desert Bloom Dental', date: 'Today', size: '2 MB' },
  { id: 'doc-3', name: 'CASE.PNG', sender: 'Oakridge Dental', date: 'Today', size: '3 MB' },
  { id: 'doc-4', name: 'SCAN.PDF', sender: 'Black Family Dental', date: 'Today', size: '4 MB' },
  { id: 'doc-5', name: 'XRAY.PDF', sender: 'Miller & Associates', date: 'Today', size: '5 MB' },
];

const archivedDefaults: DashboardDocumentItem[] = activeDefaults.map((doc) => ({
  ...doc,
  id: `archived-${doc.id}`,
}));

const config: DashboardDocumentStorageConfig = {
  activeKey: 'test_active_docs',
  archivedKey: 'test_archived_docs',
  getActiveDefaults: () => activeDefaults,
  getArchivedDefaults: () => archivedDefaults,
  minimumItems: 5,
};

describe('prototype dashboard document storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('seeds active and archived documents when storage is empty', () => {
    const result = loadDashboardDocumentStorage(config);

    expect(result.active).toEqual(activeDefaults);
    expect(result.archived).toEqual(archivedDefaults);
    expect(JSON.parse(localStorage.getItem(config.activeKey) || '[]')).toEqual(activeDefaults);
    expect(JSON.parse(localStorage.getItem(config.archivedKey) || '[]')).toEqual(archivedDefaults);
  });

  it('keeps valid stored active and archived documents', () => {
    const storedActive = [...activeDefaults, { ...activeDefaults[0], id: 'doc-6' }];
    const storedArchived = [...archivedDefaults, { ...archivedDefaults[0], id: 'archived-doc-6' }];
    localStorage.setItem(config.activeKey, JSON.stringify(storedActive));
    localStorage.setItem(config.archivedKey, JSON.stringify(storedArchived));

    expect(loadDashboardDocumentStorage(config)).toEqual({
      active: storedActive,
      archived: storedArchived,
    });
  });

  it('falls back to defaults when stored lists are stale or malformed', () => {
    localStorage.setItem(config.activeKey, JSON.stringify([{ id: 'too-small' }]));
    localStorage.setItem(config.archivedKey, '{bad json');

    const result = loadDashboardDocumentStorage(config);

    expect(result.active).toEqual(activeDefaults);
    expect(result.archived).toEqual(archivedDefaults);
  });

  it('saves active document edits under the configured key', () => {
    const updated = activeDefaults.slice(0, 4);

    saveDashboardDocumentsToStorage(config.activeKey, updated);

    expect(JSON.parse(localStorage.getItem(config.activeKey) || '[]')).toEqual(updated);
  });
});
