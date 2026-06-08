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
  { id: '1', patientName: 'Alice Cooper', type: 'Endodontic Consultation', source: 'Email', completion: 55, status: 'Scheduled', receivedAt: '08:20 AM\n05/11/2026', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', practice: 'Valley Endodontics', urgency: 'Routine', sender: 'Dr. Taylor Reed' },
  { id: '2', patientName: 'Bob Marley', type: 'Dental Implant', source: 'Fax', completion: 45, status: 'Received', receivedAt: '06:20 AM\n05/11/2026', dentist: 'Dr. Jones', specialist: 'Downtown Oral Surgery', practice: 'unknown', urgency: 'Urgent' },
  { id: '3', patientName: 'Charlie Brown', type: 'Emergency Extraction', source: 'App', completion: 100, status: 'Scheduled', receivedAt: '10:20 AM\n05/10/2026', dentist: 'Dr. Miller', specialist: 'Metro Orthodontics', practice: 'Miller & Associates', urgency: 'Emergency' },
  { id: '4', patientName: 'David Bowie', type: 'Invisalign Eval', source: 'Web', completion: 88, status: 'Completed', receivedAt: '10:20 AM\n05/09/2026', dentist: 'Dr. White', specialist: 'Arizona Periodontics', practice: 'White Dental Group', urgency: 'Routine' },
  { id: '5', patientName: 'Eve Online', type: 'Periodontal Surgery', source: 'Email', completion: 30, status: 'Scheduled', receivedAt: '09:20 AM\n05/11/2026', dentist: 'Dr. Black', specialist: 'Valley Endodontics', practice: 'Black Family Dental', urgency: 'Routine' },
  
  // Dentist dashboard referrals
  { id: 'D-1002', patientName: 'Marco Reyes', type: 'Extraction Evaluation', source: 'Fax', completion: 45, status: 'Sent', receivedAt: '08:20 AM\n05/11/2026', lastUpdate: '08:20 AM\n05/11/2026', nextStep: 'Waiting for specialist review', dentist: 'Dr. Taylor Reed', specialist: 'Downtown Oral Surgery', practice: 'unknown', urgency: 'Urgent', sender: 'Dr. Taylor Reed' },
  { id: 'D-1003', patientName: 'Nina Patel', type: 'Periodontal Surgery', source: 'Web', completion: 80, status: 'Scheduled', receivedAt: '10:20 AM\n05/10/2026', lastUpdate: '10:20 AM\n05/10/2026', nextStep: 'Appointment confirmed for Tuesday', dentist: 'Dr. Taylor Reed', specialist: 'Arizona Periodontics', practice: 'White Dental Group', urgency: 'Emergency', sender: 'Dr. Taylor Reed' },
  { id: 'D-1004', patientName: 'Sarah Jenkins', type: 'Consultation', source: 'App', completion: 20, status: 'Draft', receivedAt: '03:14 PM\n05/11/2026', lastUpdate: '03:14 PM\n05/11/2026', nextStep: 'Draft saved', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', practice: 'Valley Endodontics', urgency: 'Routine', sender: 'Dr. Taylor Reed' },
  { id: 'D-1005', patientName: 'Sarah Jenkins', type: 'Endodontic Consultation', source: 'Email', completion: 60, status: 'Sent', receivedAt: '10:05 AM\n05/11/2026', lastUpdate: '10:05 AM\n05/11/2026', nextStep: 'Waiting for specialist review', dentist: 'Dr. Taylor Reed', specialist: 'Valley Endodontics', practice: 'Valley Endodontics', urgency: 'Routine', sender: 'Dr. Taylor Reed' }
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
