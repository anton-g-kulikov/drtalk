import type { DashboardDocumentItem } from '@/prototype/dashboardDocuments';

export type DashboardDocumentStorageConfig = {
  activeKey: string;
  archivedKey: string;
  getActiveDefaults: () => DashboardDocumentItem[];
  getArchivedDefaults: () => DashboardDocumentItem[];
  minimumItems?: number;
};

export type DashboardDocumentStorageState = {
  active: DashboardDocumentItem[];
  archived: DashboardDocumentItem[];
};

function readStoredDocuments(
  key: string,
  getDefaults: () => DashboardDocumentItem[],
  minimumItems: number
): DashboardDocumentItem[] {
  const defaults = getDefaults();

  if (typeof window === 'undefined') {
    return defaults;
  }

  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length >= minimumItems) {
      return parsed;
    }
  } catch {
    // Fall through to prototype defaults.
  }

  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
}

export function loadDashboardDocumentStorage(
  config: DashboardDocumentStorageConfig
): DashboardDocumentStorageState {
  const minimumItems = config.minimumItems ?? 5;
  return {
    active: readStoredDocuments(config.activeKey, config.getActiveDefaults, minimumItems),
    archived: readStoredDocuments(config.archivedKey, config.getArchivedDefaults, minimumItems),
  };
}

export function saveDashboardDocumentsToStorage(
  key: string,
  documents: DashboardDocumentItem[]
): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(documents));
}
