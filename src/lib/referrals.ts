"use client";

export type ReferralStatus = 'Received' | 'Sent' | 'Scheduled' | 'Completed' | 'Archived' | 'Draft';

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
  practice?: string;
  urgency?: 'Routine' | 'Urgent' | 'Emergency';
  sender?: string;
}

import { generateMockData } from './mockGenerator';

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
    if (Array.isArray(parsed)) {
      if (parsed.length < 1100 || parsed.length > 1200 || (parsed.length > 0 && !parsed[0].receivedAt.includes('06/30/2026'))) {
        localStorage.setItem('drtalk_referrals', JSON.stringify(initialReferrals));
        return initialReferrals;
      }
      return parsed.map((r: any) => ({
        ...r,
        specialist: r.specialist || r.practice || 'Valley Endodontics'
      }));
    }
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
  const updated = referrals.map(r => r.id === id ? { ...r, status } : r);
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
