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

export const initialReferrals: UnifiedReferral[] = [
  // Specialist intake referrals
  { id: '1', patientName: 'Alice Cooper', type: 'Endodontic Consultation', source: 'Email', completion: 55, status: 'Scheduled', receivedAt: '08:20 AM\n06/05/2026', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', practice: 'Valley Endodontics', urgency: 'Routine', sender: 'Dr. Taylor Reed' },
  { id: '2', patientName: 'Bob Marley', type: 'Dental Implant', source: 'Fax', completion: 45, status: 'Received', receivedAt: '06:20 AM\n06/08/2026', dentist: 'Dr. Jones', specialist: 'Downtown Oral Surgery', practice: 'unknown', urgency: 'Urgent' },
  { id: '3', patientName: 'Charlie Brown', type: 'Emergency Extraction', source: 'App', completion: 100, status: 'Scheduled', receivedAt: '10:20 AM\n06/07/2026', dentist: 'Dr. Miller', specialist: 'Metro Orthodontics', practice: 'Miller & Associates', urgency: 'Emergency' },
  { id: '5', patientName: 'Eve Online', type: 'Periodontal Surgery', source: 'Email', completion: 30, status: 'Scheduled', receivedAt: '09:20 AM\n05/11/2026', dentist: 'Dr. Black', specialist: 'Valley Endodontics', practice: 'Black Family Dental', urgency: 'Routine' },
  { id: '6', patientName: 'Frank Sinatra', type: 'Endodontic Root Canal', source: 'Web', completion: 95, status: 'Completed', receivedAt: '02:15 PM\n05/20/2026', dentist: 'Dr. Smith', specialist: 'Valley Endodontics', practice: 'Sunshine Dental', urgency: 'Routine' },
  { id: '4', patientName: 'David Bowie', type: 'Invisalign Eval', source: 'Web', completion: 88, status: 'Completed', receivedAt: '10:20 AM\n02/09/2026', dentist: 'Dr. White', specialist: 'Arizona Periodontics', practice: 'White Dental Group', urgency: 'Routine' },
  { id: '7', patientName: 'Grace Kelly', type: 'Apexification', source: 'App', completion: 100, status: 'Completed', receivedAt: '11:30 AM\n02/14/2026', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', practice: 'Valley Endodontics', urgency: 'Routine' },
  { id: '8', patientName: 'Elvis Presley', type: 'Endodontic Retreat', source: 'Fax', completion: 100, status: 'Completed', receivedAt: '09:10 AM\n10/12/2025', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', practice: 'Valley Endodontics', urgency: 'Routine' },
  { id: '9', patientName: 'Marilyn Monroe', type: 'Consultation', source: 'Email', completion: 45, status: 'Received', receivedAt: '03:40 PM\n11/05/2025', dentist: 'Dr. Smith', specialist: 'Valley Endodontics', practice: 'Sunshine Dental', urgency: 'Urgent' },
  
  // Dentist dashboard referrals
  { id: 'D-1002', patientName: 'Marco Reyes', type: 'Extraction Evaluation', source: 'Fax', completion: 45, status: 'Sent', receivedAt: '08:20 AM\n06/08/2026', lastUpdate: '08:20 AM\n06/08/2026', nextStep: 'Waiting for specialist review', dentist: 'Dr. Taylor Reed', specialist: 'Downtown Oral Surgery', practice: 'unknown', urgency: 'Urgent', sender: 'Dr. Taylor Reed' },
  { id: 'D-1003', patientName: 'Nina Patel', type: 'Periodontal Surgery', source: 'Web', completion: 80, status: 'Scheduled', receivedAt: '10:20 AM\n06/07/2026', lastUpdate: '10:20 AM\n06/07/2026', nextStep: 'Appointment confirmed for Tuesday', dentist: 'Dr. Taylor Reed', specialist: 'Arizona Periodontics', practice: 'White Dental Group', urgency: 'Emergency', sender: 'Dr. Taylor Reed' },
  { id: 'D-1005', patientName: 'Sarah Jenkins', type: 'Endodontic Consultation', source: 'Email', completion: 60, status: 'Sent', receivedAt: '10:05 AM\n05/11/2026', lastUpdate: '10:05 AM\n05/11/2026', nextStep: 'Waiting for specialist review', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', practice: 'Valley Endodontics', urgency: 'Routine', sender: 'Dr. Taylor Reed' },
  { id: 'D-1006', patientName: 'James Dean', type: 'Dental Implant', source: 'Web', completion: 100, status: 'Completed', receivedAt: '01:30 PM\n05/15/2026', lastUpdate: '01:30 PM\n05/15/2026', nextStep: 'Treatment complete', dentist: 'Dr. Taylor Reed', specialist: 'Downtown Oral Surgery', practice: 'unknown', urgency: 'Routine', sender: 'Dr. Taylor Reed' },
  { id: 'D-1004', patientName: 'Sarah Jenkins', type: 'Consultation', source: 'App', completion: 20, status: 'Draft', receivedAt: '03:14 PM\n02/11/2026', lastUpdate: '03:14 PM\n02/11/2026', nextStep: 'Draft saved', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', practice: 'Valley Endodontics', urgency: 'Routine', sender: 'Dr. Taylor Reed' },
  { id: 'D-1007', patientName: 'Humphrey Bogart', type: 'Root Canal', source: 'Email', completion: 100, status: 'Completed', receivedAt: '09:00 AM\n02/20/2026', lastUpdate: '09:00 AM\n02/20/2026', nextStep: 'Follow-up done', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', practice: 'Valley Endodontics', urgency: 'Routine', sender: 'Dr. Taylor Reed' },
  { id: 'D-1008', patientName: 'Audrey Hepburn', type: 'Consultation', source: 'App', completion: 100, status: 'Completed', receivedAt: '11:00 AM\n10/10/2025', lastUpdate: '11:00 AM\n10/10/2025', nextStep: 'Case closed', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', practice: 'Valley Endodontics', urgency: 'Routine', sender: 'Dr. Taylor Reed' }
];

export function getReferrals(): UnifiedReferral[] {
  if (typeof window === 'undefined') return initialReferrals;
  const stored = localStorage.getItem('drtalk_referrals');
  if (!stored) {
    localStorage.setItem('drtalk_referrals', JSON.stringify(initialReferrals));
    return initialReferrals;
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
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
  // Use current date: Jun 9, 2026
  const currentDate = new Date('2026-06-09T10:42:38+02:00');
  
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
