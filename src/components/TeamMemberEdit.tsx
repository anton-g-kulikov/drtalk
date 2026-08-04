"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft as ArrowLeftIcon, 
  ShieldCheck as ShieldCheckIcon, 
  Users as UsersIcon,
  CheckCircle2 as CheckCircle2Icon,
  ShieldAlert as ShieldAlertIcon,
  UserCheck as UserCheckIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useVerification } from '@/components/VerificationContext';
import { MainLayout } from "@/components/MainLayout";
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { 
  TeamMember, 
  MemberRole, 
  PhiStatus, 
  getStoredTeamMembers, 
  saveStoredTeamMembers, 
  getMemberDisplayName 
} from '@/lib/teamStore';

export function TeamMemberEdit({ memberId, backPath }: { memberId: string, backPath: string }) {
  const router = useRouter();
  const { isVerified } = useVerification();
  const [member, setMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    const list = getStoredTeamMembers();
    const found = list.find(m => m.id === memberId);
    if (found) {
      setMember(found);
    }
  }, [memberId]);

  const getPhiStatus = (m: TeamMember): PhiStatus => {
    if (!isVerified) return 'Pending';
    if (m.role === 'Owner') return 'Verified';
    return m.hasPhiAccess ? 'Granted' : 'Restricted';
  };

  const handleTogglePhi = () => {
    if (!member || member.role === 'Owner') return;
    setMember({ ...member, hasPhiAccess: !member.hasPhiAccess });
  };

  const handleToggleDoctor = () => {
    if (!member) return;
    setMember({ ...member, isDoctor: !member.isDoctor });
  };

  const handleSetRole = (role: MemberRole) => {
    if (!member || member.role === 'Owner') return;
    setMember({ 
      ...member, 
      role,
      hasPhiAccess: role === 'Team Member' ? true : member.hasPhiAccess
    });
  };

  const handleSave = () => {
    if (!member) return;
    const currentList = getStoredTeamMembers();
    const updated = currentList.map(m => m.id === member.id ? member : m);
    saveStoredTeamMembers(updated);
    router.push(backPath);
  };

  if (!member) return null;

  const displayName = getMemberDisplayName(member);

  return (
    <MainLayout title={`Edit Member: ${displayName}`}>
      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="space-y-4">
            <button
              onClick={() => router.push(backPath)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-colors w-fit px-2 py-1 border-2 border-transparent hover:border-black"
            >
              <ArrowLeftIcon size={14} />
              Back to Team Management
            </button>
            
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter italic leading-none">{displayName}</h1>
              <CommentMarker 
                id="team-member-page" 
                title="Team Member Settings" 
                description="Practice owners can independently manage roles, doctor status, and PHI access for each team member." 
              />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{member.email}</p>
          </div>
          <div className="text-right pb-1">
            <p className="text-[10px] font-black uppercase text-muted-foreground italic">Member since {member.joinedAt}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Role Management */}
          <div className="wireframe-card p-6 space-y-6 border-black border-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-black text-white">
                <UsersIcon size={16} />
              </div>
              <h3 className="font-black uppercase text-sm tracking-tight">Team Role</h3>
            </div>

            <div className="space-y-4">
              {member.role === 'Owner' ? (
                <div className="w-full text-left p-4 border-2 border-black bg-black text-white flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Owner</p>
                    <p className="text-[9px] uppercase mt-1 text-gray-300">
                      Full control & ownership.
                    </p>
                  </div>
                  <CheckCircle2Icon size={16} />
                </div>
              ) : (
                (['Practice Admin', 'Team Member'] as MemberRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleSetRole(role)}
                    className={`w-full text-left p-4 border-2 transition-all group flex items-center justify-between ${
                      member.role === role 
                        ? 'border-black bg-black text-white' 
                        : 'border-black border-dashed hover:border-solid hover:bg-gray-50 text-black opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest">{role}</p>
                      <p className={`text-[9px] uppercase mt-1 ${member.role === role ? 'text-gray-300' : 'text-muted-foreground'}`}>
                        {role === 'Practice Admin' && 'Billing, scheduling & intake.'}
                        {role === 'Team Member' && 'Patient care & clinical notes.'}
                      </p>
                    </div>
                    {member.role === role && <CheckCircle2Icon size={16} />}
                  </button>
                ))
              )}
            </div>
            {member.role === 'Owner' && (
              <p className="text-[9px] uppercase font-bold text-muted-foreground italic">
                * Ownership can only be transferred using the main team menu.
              </p>
            )}
          </div>

          {/* Doctor Status Management */}
          <div className="wireframe-card p-6 space-y-6 border-black border-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-black text-white">
                <UserCheckIcon size={16} />
              </div>
              <h3 className="font-black uppercase text-sm tracking-tight">Doctor Status</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="pt-1">
                  <div 
                    onClick={handleToggleDoctor}
                    className={`w-12 h-6 border-2 border-black relative cursor-pointer transition-colors ${
                      member.isDoctor ? 'bg-black' : 'bg-white'
                    }`}
                  >
                    <div className={`absolute top-0.5 bottom-0.5 w-4 transition-all ${
                      member.isDoctor ? 'right-0.5 bg-white' : 'left-0.5 bg-black'
                    }`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {member.isDoctor ? 'DOCTOR (DR. PREFIX)' : 'STAFF MEMBER'}
                  </p>
                  <p className="text-[9px] uppercase text-muted-foreground leading-relaxed font-bold">
                    Marking as doctor adds 'Dr.' prefix and includes member in referral receiving doctor selections.
                  </p>
                </div>
              </div>

              <div className="p-4 border-2 border-black border-dashed bg-gray-50 space-y-2">
                <p className="text-[9px] font-black uppercase">Current Display Name:</p>
                <p className="text-xs font-black uppercase text-black">{displayName}</p>
              </div>
            </div>
          </div>

          {/* PHI Access Management */}
          <div className="wireframe-card p-6 space-y-6 border-black border-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-black text-white">
                <ShieldCheckIcon size={16} />
              </div>
              <h3 className="font-black uppercase text-sm tracking-tight">PHI Access Control</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="pt-1">
                  <div 
                    onClick={handleTogglePhi}
                    className={`w-12 h-6 border-2 border-black relative cursor-pointer transition-colors ${
                      member.hasPhiAccess ? 'bg-black' : 'bg-white'
                    } ${member.role === 'Owner' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`absolute top-0.5 bottom-0.5 w-4 transition-all ${
                      member.hasPhiAccess ? 'right-0.5 bg-white' : 'left-0.5 bg-black'
                    }`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {member.hasPhiAccess ? 'ACCESS GRANTED' : 'ACCESS RESTRICTED'}
                  </p>
                  <p className="text-[9px] uppercase text-muted-foreground leading-relaxed font-bold">
                    Allow this member to view Protected Health Information (PHI) including patient charts, messages, and referrals.
                  </p>
                </div>
              </div>

              <div className="p-4 border-2 border-black border-dashed bg-gray-50 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldAlertIcon size={14} />
                  <p className="text-[9px] font-black uppercase tracking-widest">Current Status: {getPhiStatus(member)}</p>
                </div>
                <p className="text-[9px] uppercase text-muted-foreground leading-relaxed font-bold italic">
                  {!isVerified 
                    ? 'Global restriction in effect. PHI will remain hidden until practice verification is complete.'
                    : member.role === 'Owner'
                      ? 'Practice owners have mandatory PHI access for clinical accountability.'
                      : member.hasPhiAccess 
                        ? 'Member can process referrals and view patient data.' 
                        : 'Member is restricted from viewing all patient-identifiable data.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Section */}
        <div className="flex justify-end pt-6 border-t-2 border-black border-dashed">
          <button 
            onClick={handleSave}
            className="wireframe-button bg-black text-white px-12 py-4 uppercase text-xs font-black tracking-[0.2em] hover:opacity-90 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            Save Changes
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
