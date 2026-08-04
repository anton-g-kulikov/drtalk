export type MemberRole = 'Owner' | 'Practice Admin' | 'Team Member';
export type PhiStatus = 'Verified' | 'Granted' | 'Pending' | 'Restricted';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  hasPhiAccess: boolean;
  joinedAt: string;
  specialty?: string;
  isDoctor: boolean;
}

export const INITIAL_TEAM: TeamMember[] = [
  { id: '1', name: 'Dr. Emma Smith', email: 'emma.smith@sunshinedental.com', role: 'Owner', hasPhiAccess: true, joinedAt: 'Mar 2024', specialty: 'Endodontics', isDoctor: true },
  { id: '2', name: 'Alice Johnson', email: 'alice.j@sunshinedental.com', role: 'Practice Admin', hasPhiAccess: false, joinedAt: 'Mar 2024', isDoctor: false },
  { id: '3', name: 'Bob Wilson', email: 'bob.wilson@sunshinedental.com', role: 'Team Member', hasPhiAccess: true, joinedAt: 'Apr 2024', specialty: 'Oral Surgery', isDoctor: false },
  { id: '4', name: 'Carol Danvers', email: 'carol.d@sunshinedental.com', role: 'Team Member', hasPhiAccess: true, joinedAt: 'May 2024', specialty: 'Periodontics', isDoctor: false },
];

export function getCleanName(fullName: string): string {
  if (!fullName) return '';
  return fullName.replace(/^Dr\.\s*/i, '').trim();
}

export function getMemberDisplayName(member: { name: string; isDoctor: boolean }): string {
  const baseName = getCleanName(member.name);
  return member.isDoctor ? `Dr. ${baseName}` : baseName;
}

export function getStoredTeamMembers(): TeamMember[] {
  if (typeof window === 'undefined') return INITIAL_TEAM;
  const stored = localStorage.getItem('drtalk_team_members');
  if (!stored) {
    localStorage.setItem('drtalk_team_members', JSON.stringify(INITIAL_TEAM));
    return INITIAL_TEAM;
  }
  try {
    const parsed = JSON.parse(stored);
    // Ensure backwards compatibility if isDoctor field missing
    return parsed.map((m: any) => ({
      ...m,
      isDoctor: typeof m.isDoctor === 'boolean' ? m.isDoctor : m.name.startsWith('Dr.')
    }));
  } catch (e) {
    return INITIAL_TEAM;
  }
}

export function saveStoredTeamMembers(members: TeamMember[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('drtalk_team_members', JSON.stringify(members));
  window.dispatchEvent(new Event('drtalk-team-updated'));
}

export function getDoctorList(): string[] {
  const members = getStoredTeamMembers();
  return members
    .filter(m => m.isDoctor)
    .map(m => getMemberDisplayName(m));
}
