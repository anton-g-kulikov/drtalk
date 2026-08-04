"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft as ArrowLeftIcon, 
  ShieldCheck as ShieldCheckIcon, 
  Users as UsersIcon,
  MoreVertical as MoreVerticalIcon,
  ShieldAlert as ShieldAlertIcon,
  CheckCircle2 as CheckCircle2Icon,
  UserPlus as UserPlusIcon,
  ArrowRightLeft as ArrowRightLeftIcon,
  Lock as LockIcon,
  Key as KeyIcon,
  UserCheck as UserCheckIcon
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useVerification } from '@/components/VerificationContext';
import { MainLayout } from "@/components/MainLayout";
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { InviteModal } from "@/components/InviteModal";
import { 
  TeamMember, 
  MemberRole, 
  PhiStatus, 
  getStoredTeamMembers, 
  saveStoredTeamMembers, 
  getMemberDisplayName,
  getCleanName 
} from '@/lib/teamStore';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface JoinRequest {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  requestedAt: string;
}

const mockRequests: JoinRequest[] = [
  { id: 'r1', name: 'Dr. Sarah Connor', email: 's.connor@gmail.com', role: 'Team Member', requestedAt: '08:20 AM\n05/11/2026' },
  { id: 'r2', name: 'James T. Kirk', email: 'kirk@enterprise.com', role: 'Practice Admin', requestedAt: '05:20 AM\n05/11/2026' },
];

export function TeamManagement({ backPath }: { backPath: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isVerified, reset } = useVerification();
  const [team, setTeam] = useState<TeamMember[]>(getStoredTeamMembers);
  const [requests, setRequests] = useState<JoinRequest[]>(mockRequests);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [newOwnerId, setNewOwnerId] = useState<string>('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States for interactive approval modal
  const [approvingRequest, setApprovingRequest] = useState<JoinRequest | null>(null);
  const [approvingRole, setApprovingRole] = useState<MemberRole>('Team Member');
  const [approvingPhi, setApprovingPhi] = useState<boolean>(true);
  const [approvingIsDoctor, setApprovingIsDoctor] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdate = () => setTeam(getStoredTeamMembers());
    window.addEventListener('drtalk-team-updated', handleUpdate);
    return () => window.removeEventListener('drtalk-team-updated', handleUpdate);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const startApprovalProcess = (request: JoinRequest) => {
    setApprovingRequest(request);
    setApprovingRole(request.role);
    setApprovingPhi(request.role === 'Team Member');
    setApprovingIsDoctor(request.name.toLowerCase().startsWith('dr.'));
  };

  const handleConfirmApproval = () => {
    if (!approvingRequest) return;
    const newMember: TeamMember = {
      id: generateId(),
      name: approvingRequest.name,
      email: approvingRequest.email,
      role: approvingRole,
      hasPhiAccess: approvingPhi,
      joinedAt: 'May 2024',
      isDoctor: approvingIsDoctor
    };
    const updated = [...team, newMember];
    setTeam(updated);
    saveStoredTeamMembers(updated);
    setRequests(requests.filter(r => r.id !== approvingRequest.id));
    setApprovingRequest(null);
    showToast(`Approved ${getMemberDisplayName(newMember)} as ${approvingRole}`);
  };

  const handleToggleDoctor = (memberId: string) => {
    const updated = team.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          isDoctor: !m.isDoctor
        };
      }
      return m;
    });
    setTeam(updated);
    saveStoredTeamMembers(updated);
    const target = updated.find(m => m.id === memberId);
    if (target) {
      showToast(`Updated doctor status for ${getMemberDisplayName(target)}`);
    }
  };

  const denyRequest = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  const getPhiStatus = (member: TeamMember): PhiStatus => {
    if (!isVerified) return 'Pending';
    if (member.role === 'Owner') return 'Verified';
    return member.hasPhiAccess ? 'Granted' : 'Restricted';
  };

  const getPhiBadge = (status: PhiStatus) => {
    switch (status) {
      case 'Verified':
        return <span className="flex items-center gap-1 text-[8px] font-black uppercase text-black border border-black px-2 py-0.5 bg-gray-50"><CheckCircle2Icon size={10} /> Verified Owner</span>;
      case 'Granted':
        return <span className="flex items-center gap-1 text-[8px] font-black uppercase text-black"><ShieldCheckIcon size={10} /> PHI Granted</span>;
      case 'Pending':
        return <span className="flex items-center gap-1 text-[8px] font-black uppercase text-muted-foreground italic"><ShieldAlertIcon size={10} /> PHI Pending</span>;
      case 'Restricted':
        return <span className="flex items-center gap-1 text-[8px] font-black uppercase text-muted-foreground opacity-50"><LockIcon size={10} /> PHI Restricted</span>;
    }
  };

  const confirmTransfer = () => {
    if (!newOwnerId) return;
    
    const updatedTeam = team.map(m => {
      if (m.id === newOwnerId) return { ...m, role: 'Owner' as MemberRole };
      if (m.role === 'Owner') return { ...m, role: 'Team Member' as MemberRole };
      return m;
    });
    
    setTeam(updatedTeam);
    saveStoredTeamMembers(updatedTeam);
    setShowTransferModal(false);
    setNewOwnerId('');
    reset();
  };

  const teamMembers = team.filter(m => m.role === 'Team Member');

  return (
    <MainLayout title="TEAM, ROLES & ACCESS CONTROL">
      <div className="max-w-5xl mx-auto space-y-10" onClick={() => setOpenMenuId(null)}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="space-y-4">
            <button
              onClick={() => router.push(backPath)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-colors w-fit px-2 py-1 border-2 border-transparent hover:border-black"
            >
              <ArrowLeftIcon size={14} />
              Back to Settings
            </button>
            
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter italic leading-none">TEAM, ROLES & ACCESS CONTROL</h1>
              <CommentMarker id="team-management" title="Team Management" description="Manage practice ownership and team permissions." />
            </div>
            
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              Manage practice ownership, team member permissions, doctor titles, and PHI access safeguards.
            </p>
          </div>
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="wireframe-button bg-black text-white text-[10px] uppercase px-8 py-4 flex items-center gap-2 font-black tracking-widest"
          >
            <UserPlusIcon size={16} /> Invite Member
          </button>
        </div>

        {/* PHI Status Banner - Only show when NOT verified */}
        {!isVerified && (
          <div className="wireframe-card p-6 bg-gray-50 border-black flex items-center justify-between gap-6 border-2 border-dashed animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-start gap-4">
              <ShieldCheckIcon size={24} />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest">Global PHI Status: RESTRICTED</p>
                <p className="text-[10px] text-muted-foreground uppercase leading-relaxed font-bold max-w-xl">
                  Verification required. PHI access is currently restricted for all team members until the practice owner completes identity validation.
                </p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/verify')}
              className="text-[10px] font-black uppercase underline hover:text-muted-foreground transition-colors"
            >
              Verify Now
            </button>
          </div>
        )}

        {/* Join Requests Section */}
        {requests.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <UsersIcon size={20} />
              <h2 className="text-xl font-black uppercase tracking-tighter italic leading-none">Pending Join Requests</h2>
              <span className="bg-black text-white text-[10px] px-2 py-0.5 font-bold rounded-full">{requests.length}</span>
              <CommentMarker 
                id="join-request-logic"
                title="Join Request Permissions"
                description="We suggest granting practice admins the ability to confirm the joining of admin role type users, while all team members should be confirmed only by the practice owner, as this grants them access to PHI."
              />
            </div>
            
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="wireframe-card p-5 bg-white flex flex-col sm:grid sm:grid-cols-12 items-center gap-4 border-black border-2 border-dashed">
                  <div className="col-span-4 w-full">
                    <p className="font-black uppercase text-xs tracking-tight">{request.name}</p>
                    <p className="text-[10px] text-muted-foreground lowercase truncate">{request.email}</p>
                  </div>
                  <div className="col-span-2 w-full">
                    <span className="text-[10px] font-black uppercase px-2 py-1 border-2 border-black bg-white">
                      {request.role}
                    </span>
                  </div>
                  <div className="col-span-3 w-full">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground italic whitespace-pre-line text-right">Requested {request.requestedAt}</p>
                  </div>
                  <div className="col-span-3 w-full flex justify-end gap-3">
                    <button 
                      onClick={() => startApprovalProcess(request)}
                      className="text-[10px] font-black uppercase bg-black text-white px-4 py-2 hover:opacity-80 transition-opacity"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => denyRequest(request.id)}
                      className="text-[10px] font-black uppercase border-2 border-black px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="py-4">
              <div className="border-t-2 border-black border-dashed opacity-20" />
            </div>
          </div>
        )}

        {/* Team Table */}
        <div className="space-y-4">
          <div className="grid grid-cols-12 px-4 py-2 text-[9px] font-black uppercase text-muted-foreground tracking-widest border-b-2 border-black">
            <div className="col-span-3">Name / Email</div>
            <div className="col-span-2">Doctor</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">PHI Access</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          <div className="space-y-3">
            {team.map((member) => (
              <div key={member.id} className="wireframe-card p-5 bg-white flex flex-col sm:grid sm:grid-cols-12 items-center gap-4 transition-all">
                <div className="col-span-3 w-full">
                  <p className="font-black uppercase text-xs tracking-tight">{getMemberDisplayName(member)}</p>
                  <p className="text-[10px] text-muted-foreground lowercase truncate">{member.email}</p>
                </div>

                {/* Doctor Switch Column */}
                <div className="col-span-2 w-full flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleDoctor(member.id);
                    }}
                    className={`w-10 h-5 border-2 border-black relative cursor-pointer transition-colors ${
                      member.isDoctor ? 'bg-black' : 'bg-white'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 bottom-0.5 w-3.5 transition-all ${
                        member.isDoctor ? 'right-0.5 bg-white' : 'left-0.5 bg-black'
                      }`}
                    />
                  </button>
                  <span className="text-[9px] font-black uppercase tracking-wider">
                    {member.isDoctor ? 'Doctor' : 'Staff'}
                  </span>
                </div>

                <div className="col-span-2 w-full">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 border-2 border-black ${member.role === 'Owner' ? 'bg-black text-white' : 'bg-white'}`}>
                    {member.role}
                  </span>
                </div>
                <div className="col-span-2 w-full flex items-center">
                  {getPhiBadge(getPhiStatus(member))}
                </div>
                <div className="col-span-2 w-full">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">{member.joinedAt}</p>
                </div>
                <div className="col-span-1 w-full text-right flex justify-end relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === member.id ? null : member.id);
                    }}
                    className="p-1.5 border-2 border-black hover:bg-black hover:text-white transition-all"
                  >
                    <MoreVerticalIcon size={14} />
                  </button>
                  
                  {openMenuId === member.id && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border-4 border-black z-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-top-2 duration-200">
                      <div className="py-1">
                        {member.role === 'Owner' && (
                          <button 
                            onClick={() => setShowTransferModal(true)}
                            className="w-full text-left px-4 py-3 text-[10px] font-black uppercase hover:bg-black hover:text-white flex items-center gap-2 border-b-2 border-black"
                          >
                            <ArrowRightLeftIcon size={14} /> Transfer Ownership
                          </button>
                        )}
                        <button 
                          onClick={() => router.push(`${pathname}/${member.id}`)}
                          className="w-full text-left px-4 py-3 text-[10px] font-black uppercase hover:bg-black hover:text-white flex items-center gap-2"
                        >
                          Edit Member
                        </button>
                        <button 
                          onClick={() => {
                            setOpenMenuId(null);
                            showToast(`Password reset link & temporary password sent to ${member.email}`);
                          }}
                          className="w-full text-left px-4 py-3 text-[10px] font-black uppercase hover:bg-black hover:text-white flex items-center gap-2 border-t-2 border-black"
                        >
                          <KeyIcon size={14} /> Reset Password
                        </button>
                        <button className="w-full text-left px-4 py-3 text-[10px] font-black uppercase hover:bg-black hover:text-white flex items-center gap-2 text-black border-t-2 border-black">
                          Remove Member
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transfer Ownership Modal */}
        {showTransferModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/95 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white border-4 border-black p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] space-y-8 animate-in zoom-in-95 duration-300">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-black rounded-full flex items-center justify-center mx-auto bg-gray-50">
                  <ArrowRightLeftIcon size={32} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Transfer Ownership</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
                  Select a team member to become the new practice lead.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest">Select New Owner</label>
                  <select 
                    value={newOwnerId}
                    onChange={(e) => setNewOwnerId(e.target.value)}
                    className="wireframe-input w-full py-4 px-4 text-sm appearance-none bg-transparent"
                  >
                    <option value="">Choose team member...</option>
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.id}>{getMemberDisplayName(m)} ({m.specialty || 'Team Member'})</option>
                    ))}
                  </select>
                </div>

                <div className="wireframe-card p-6 bg-gray-50 border-dashed space-y-4">
                  <div className="flex gap-4 items-start">
                    <LockIcon size={20} className="shrink-0" />
                    <p className="text-[9px] uppercase font-bold text-muted-foreground leading-relaxed">
                      IMPORTANT: The new owner must undergo personal verification to restore PHI access. You will be reassigned as a team member.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-4">
                  <button 
                    disabled={!newOwnerId}
                    onClick={confirmTransfer}
                    className="wireframe-button bg-black text-white py-4 uppercase text-sm font-black tracking-widest disabled:opacity-30"
                  >
                    Confirm Transfer
                  </button>
                  <button 
                    onClick={() => {
                      setShowTransferModal(false);
                      setNewOwnerId('');
                    }}
                    className="text-[10px] font-black uppercase underline py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approve Team Member Modal */}
        {approvingRequest && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/95 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-4xl bg-white border-4 border-black p-8 sm:p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] space-y-8 animate-in zoom-in-95 duration-300">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter text-black italic">
                  Approve Member: {approvingRequest.name}
                </h2>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  {approvingRequest.email}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
                {/* Role Management */}
                <div className="wireframe-card p-6 space-y-6 border-black border-2 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-black text-white">
                      <UsersIcon size={16} />
                    </div>
                    <h3 className="font-black uppercase text-sm tracking-tight">Team Role</h3>
                  </div>

                  <div className="space-y-4">
                    {(['Practice Admin', 'Team Member'] as MemberRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setApprovingRole(role);
                          setApprovingPhi(role === 'Team Member' ? true : approvingPhi);
                        }}
                        className={`w-full text-left p-4 border-2 transition-all group flex items-center justify-between ${
                          approvingRole === role 
                            ? 'border-black bg-black text-white' 
                            : 'border-black border-dashed hover:border-solid hover:bg-gray-50 text-black opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest">{role}</p>
                          <p className={`text-[9px] uppercase mt-1 ${approvingRole === role ? 'text-gray-300' : 'text-muted-foreground'}`}>
                            {role === 'Practice Admin' && 'Billing, scheduling & intake.'}
                            {role === 'Team Member' && 'Patient care & clinical notes.'}
                          </p>
                        </div>
                        {approvingRole === role && <CheckCircle2Icon size={16} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Doctor Toggle */}
                <div className="wireframe-card p-6 space-y-6 border-black border-2 bg-white">
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
                          onClick={() => setApprovingIsDoctor(prev => !prev)}
                          className={`w-12 h-6 border-2 border-black relative cursor-pointer transition-colors ${
                            approvingIsDoctor ? 'bg-black' : 'bg-white'
                          }`}
                        >
                          <div className={`absolute top-0.5 bottom-0.5 w-4 transition-all ${
                            approvingIsDoctor ? 'right-0.5 bg-white' : 'left-0.5 bg-black'
                          }`} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest">
                          {approvingIsDoctor ? 'DOCTOR (DR. PREFIX)' : 'STAFF MEMBER'}
                        </p>
                        <p className="text-[9px] uppercase text-muted-foreground leading-relaxed font-bold">
                          Mark as doctor to display Dr. prefix and show in referral receiving doctor selections.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PHI Access Management */}
                <div className="wireframe-card p-6 space-y-6 border-black border-2 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-black text-white">
                      <ShieldCheckIcon size={16} />
                    </div>
                    <h3 className="font-black uppercase text-sm tracking-tight">PHI Access</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        <div 
                          onClick={() => setApprovingPhi(prev => !prev)}
                          className={`w-12 h-6 border-2 border-black relative cursor-pointer transition-colors ${
                            approvingPhi ? 'bg-black' : 'bg-white'
                          }`}
                        >
                          <div className={`absolute top-0.5 bottom-0.5 w-4 transition-all ${
                            approvingPhi ? 'right-0.5 bg-white' : 'left-0.5 bg-black'
                          }`} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest">
                          {approvingPhi ? 'ACCESS GRANTED' : 'ACCESS RESTRICTED'}
                        </p>
                        <p className="text-[9px] uppercase text-muted-foreground leading-relaxed font-bold">
                          Allow access to PHI, patient charts & referrals.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t-2 border-black border-dashed">
                <button 
                  onClick={() => setApprovingRequest(null)}
                  className="wireframe-button border-2 border-black bg-white text-black px-8 py-3 uppercase text-xs font-black tracking-widest hover:bg-gray-50 transition-all order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmApproval}
                  className="wireframe-button bg-black text-white px-8 py-3 uppercase text-xs font-black tracking-widest hover:opacity-90 transition-all order-1 sm:order-2"
                >
                  Approve &amp; Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-black text-white border-2 border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-300">
          <p className="text-[10px] font-black uppercase tracking-tight">{toastMessage}</p>
        </div>
      )}

      <InviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        defaultRole="Team Member"
        onSuccess={(email) => {
          showToast(`Invitation sent to ${email}`);
        }}
      />
    </MainLayout>
  );
}
