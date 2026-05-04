"use client";

import React, { useState } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { 
  ArrowLeft as ArrowLeftIcon, 
  ShieldCheck as ShieldCheckIcon, 
  Users as UsersIcon,
  MoreVertical as MoreVerticalIcon,
  ShieldAlert as ShieldAlertIcon,
  CheckCircle2 as CheckCircle2Icon,
  UserPlus as UserPlusIcon,
  ArrowRightLeft as ArrowRightLeftIcon,
  Lock as LockIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useVerification } from '@/components/VerificationContext';

type MemberRole = 'Owner' | 'Administrative' | 'Clinical';
type PhiStatus = 'Verified' | 'Granted' | 'Pending' | 'Restricted';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  phiStatus: PhiStatus;
  joinedAt: string;
}

const mockTeam: TeamMember[] = [
  { id: '1', name: 'Dr. Emma Smith', email: 'emma.smith@sunshinedental.com', role: 'Owner', phiStatus: 'Verified', joinedAt: 'Mar 2024' },
  { id: '2', name: 'Alice Johnson', email: 'alice.j@sunshinedental.com', role: 'Administrative', phiStatus: 'Restricted', joinedAt: 'Mar 2024' },
  { id: '3', name: 'Bob Wilson', email: 'bob.wilson@sunshinedental.com', role: 'Clinical', phiStatus: 'Granted', joinedAt: 'Apr 2024' },
  { id: '4', name: 'Carol Danvers', email: 'carol.d@sunshinedental.com', role: 'Clinical', phiStatus: 'Pending', joinedAt: 'May 2024' },
];

export default function TeamManagementPage() {
  const router = useRouter();
  const { isVerified } = useVerification();
  const [team, setTeam] = useState<TeamMember[]>(mockTeam);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [newOwnerId, setNewOwnerId] = useState<string>('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
    
    // Simulate ownership transfer
    const updatedTeam = team.map(m => {
      if (m.id === newOwnerId) return { ...m, role: 'Owner' as MemberRole, phiStatus: 'Pending' as PhiStatus }; // New owner must re-verify
      if (m.role === 'Owner') return { ...m, role: 'Clinical' as MemberRole, phiStatus: 'Granted' as PhiStatus }; // Old owner becomes clinical
      return m;
    });
    
    setTeam(updatedTeam);
    setShowTransferModal(false);
    setNewOwnerId('');
  };

  const clinicalStaff = team.filter(m => m.role === 'Clinical');

  return (
    <MainLayout title="TEAM, ROLES & ACCESS CONTROL">
      <div className="max-w-5xl mx-auto space-y-10" onClick={() => setOpenMenuId(null)}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/settings')} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
                <ArrowLeftIcon size={16} />
              </button>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">TEAM, ROLES & ACCESS CONTROL</h1>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest ml-12">
              Manage practice ownership, clinical permissions, and PHI access safeguards.
            </p>
          </div>
          <button className="wireframe-button bg-black text-white text-[10px] uppercase px-8 py-4 flex items-center gap-2 font-black tracking-widest">
            <UserPlusIcon size={16} /> Invite Member
          </button>
        </div>

        {/* PHI Status Banner */}
        <div className="wireframe-card p-6 bg-gray-50 border-black flex items-center justify-between gap-6 border-2 border-dashed">
          <div className="flex items-start gap-4">
            <ShieldCheckIcon size={24} />
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest">Global PHI Status: {isVerified ? 'ACTIVE' : 'RESTRICTED'}</p>
              <p className="text-[10px] text-muted-foreground uppercase leading-relaxed font-bold max-w-xl">
                {isVerified 
                  ? 'The practice owner is verified. All clinical personnel have been granted access to patient health information.'
                  : 'Verification required. PHI access is currently restricted for all team members until the practice owner completes identity validation.'}
              </p>
            </div>
          </div>
          {!isVerified && (
            <button className="text-[10px] font-black uppercase underline">Verify Now</button>
          )}
        </div>

        {/* Team Table */}
        <div className="space-y-4">
          <div className="grid grid-cols-12 px-4 py-2 text-[9px] font-black uppercase text-muted-foreground tracking-widest border-b-2 border-black">
            <div className="col-span-4">Name / Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-3">PHI Access</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          <div className="space-y-3">
            {team.map((member) => (
              <div key={member.id} className="wireframe-card p-5 bg-white flex flex-col sm:grid sm:grid-cols-12 items-center gap-4 transition-all">
                <div className="col-span-4 w-full">
                  <p className="font-black uppercase text-xs tracking-tight">{member.name}</p>
                  <p className="text-[10px] text-muted-foreground lowercase truncate">{member.email}</p>
                </div>
                <div className="col-span-2 w-full">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 border-2 border-black ${member.role === 'Owner' ? 'bg-black text-white' : 'bg-white'}`}>
                    {member.role}
                  </span>
                </div>
                <div className="col-span-3 w-full flex items-center">
                  {getPhiBadge(member.phiStatus)}
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
                        <button className="w-full text-left px-4 py-3 text-[10px] font-black uppercase hover:bg-black hover:text-white flex items-center gap-2">
                          Edit Member
                        </button>
                        <button className="w-full text-left px-4 py-3 text-[10px] font-black uppercase hover:bg-black hover:text-white flex items-center gap-2 text-red-600">
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
                  Select a clinical team member to become the new practice lead.
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
                    <option value="">Choose clinical staff...</option>
                    {clinicalStaff.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.specialty || 'Clinical'})</option>
                    ))}
                  </select>
                </div>

                <div className="wireframe-card p-6 bg-gray-50 border-dashed space-y-4">
                  <div className="flex gap-4 items-start">
                    <LockIcon size={20} className="shrink-0" />
                    <p className="text-[9px] uppercase font-bold text-muted-foreground leading-relaxed">
                      IMPORTANT: The new owner must undergo personal verification to restore PHI access. You will be reassigned as clinical staff.
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

      </div>
    </MainLayout>
  );
}
