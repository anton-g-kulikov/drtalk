"use client";

import React from 'react';
import {
  Building2 as Building2Icon,
  CheckCircle2 as CheckCircle2Icon,
  ChevronRight as ChevronRightIcon,
  Users as UsersIcon,
} from 'lucide-react';
import type { UserRole } from '@/components/VerificationContext';
import type { OnboardingStep } from '@/components/prototype/OnboardingStepView';

type StepNavigation = {
  nextStep: (next: OnboardingStep) => void;
};

type VerifyStepProps = StepNavigation & {
  isIndividualFlow: boolean;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
};

export function OnboardingVerifyStep({
  isIndividualFlow,
  setUserRole,
  nextStep,
}: VerifyStepProps) {
  return (
    <div className="space-y-6 w-full max-w-sm text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold uppercase tracking-tighter">Verify Email</h1>
        <p className="text-[10px] text-muted-foreground uppercase leading-relaxed">
          We sent a 6-digit code to your email.<br />Enter it below to continue.
        </p>
      </div>
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <input key={i} type="text" maxLength={1} className="w-10 h-12 border-2 border-black text-center font-bold text-xl focus:bg-black focus:text-white outline-none transition-all" />
        ))}
      </div>
      <button
        onClick={() => {
          if (isIndividualFlow) {
            setUserRole('individual');
            nextStep('SUCCESS');
          } else {
            nextStep('ROLE_SELECTION');
          }
        }}
        className="wireframe-button w-full bg-black text-white py-3 uppercase text-sm"
      >
        Verify & Continue
      </button>
      <p className="text-[10px] uppercase font-bold text-muted-foreground cursor-pointer hover:text-black">
        Resend Code
      </p>
    </div>
  );
}

export function OnboardingRoleSelectionStep({ nextStep }: StepNavigation) {
  return (
    <div className="space-y-12 w-full max-w-3xl px-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">WELCOME TO DRTALK</h1>
        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">CREATE A PRACTICE OR JOIN YOUR EXISTING TEAM.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          onClick={() => nextStep('PRACTICE_DETAILS')}
          className="wireframe-card hover:bg-black hover:text-white cursor-pointer transition-all group p-12 space-y-6 flex flex-col items-start min-h-[320px]"
        >
          <Building2Icon size={48} className="mb-2" />
          <div className="space-y-4">
            <h3 className="font-black uppercase text-2xl leading-tight tracking-tighter">CREATE PRACTICE</h3>
            <p className="text-xs uppercase leading-relaxed font-bold opacity-70">
              Set up a profile to receive referrals and coordinate patient communication.
            </p>
          </div>
        </div>
        <div
          onClick={() => nextStep('JOIN_PRACTICE')}
          className="wireframe-card border-dashed hover:bg-black hover:text-white cursor-pointer transition-all group p-12 space-y-6 flex flex-col items-start min-h-[320px]"
        >
          <UsersIcon size={48} className="mb-2" />
          <div className="space-y-4">
            <h3 className="font-black uppercase text-2xl leading-tight tracking-tighter">JOIN EXISTING PRACTICE</h3>
            <p className="text-xs uppercase leading-relaxed font-bold opacity-70">
              Enter with an invite code or request access from a practice administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

type UserRoleStepProps = StepNavigation & {
  userRole: UserRole;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
  invites: { email: string; role: string }[];
  setInvites: React.Dispatch<React.SetStateAction<{ email: string; role: string }[]>>;
};

export function OnboardingUserRoleStep({
  userRole,
  setUserRole,
  invites,
  setInvites,
  nextStep,
}: UserRoleStepProps) {
  return (
    <div className="w-full max-w-lg animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-10">
        <div className="flex items-center gap-4">
          <button onClick={() => nextStep('PRACTICE_DETAILS')} className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
            <ChevronRightIcon size={16} className="rotate-180" />
          </button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none italic">CHOOSE YOUR ROLE</h1>
            <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1 tracking-widest">REQUIREMENT FOR PRACTICE SETUP</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { id: 'owner', label: 'Practice Owner', desc: 'I am the licensed professional responsible for this practice.' },
            { id: 'admin', label: 'Practice Admin', desc: 'I manage office operations and scheduling.' },
            { id: 'team', label: 'Team Member', desc: 'I provide direct patient care (Dental Assistant, Hygienist, etc).' },
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => setUserRole(role.id as UserRole)}
              className={`wireframe-card w-full p-8 text-left transition-all flex flex-col gap-1 border-2 ${
                userRole === role.id
                  ? 'bg-black text-white border-black'
                  : 'bg-white hover:bg-gray-50 border-black'
              }`}
            >
              <p className="font-black uppercase text-base tracking-tight">{role.label}</p>
              <p className={`text-[10px] uppercase font-bold leading-relaxed ${
                userRole === role.id ? 'text-gray-400' : 'text-muted-foreground'
              }`}>
                {role.desc}
              </p>
            </button>
          ))}

          <div className="pt-6">
            <button
              onClick={() => {
                if (userRole !== 'owner') {
                  const hasOwnerInvite = invites.some((invite) => invite.role === 'owner');
                  if (!hasOwnerInvite) {
                    setInvites([{ email: '', role: 'owner' }, ...invites]);
                  }
                }
                nextStep('PRACTICE_INVITE');
              }}
              className="wireframe-button bg-black text-white py-5 uppercase text-sm font-black tracking-[0.2em] w-full flex items-center justify-center gap-2"
            >
              CONTINUE <ChevronRightIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type SuccessStepProps = {
  userRole: UserRole;
  practiceType: string;
  dentistTypes: string[];
  verify: (role: UserRole) => void;
  router: { push: (href: string) => void };
};

export function OnboardingSuccessStep({
  userRole,
  practiceType,
  dentistTypes,
  verify,
  router,
}: SuccessStepProps) {
  return (
    <div className="space-y-8 w-full max-w-sm text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-black flex items-center justify-center">
          <CheckCircle2Icon size={48} />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold uppercase tracking-tighter">Success!</h1>
        <p className="text-xs text-muted-foreground uppercase leading-relaxed">
          {userRole === 'individual'
            ? 'Your learning account is ready. You can now access the Learning Hub.'
            : 'Your practice account is set up. You can now collaborate and manage referrals.'}
        </p>
      </div>
      <button
        onClick={() => {
          verify(userRole);
          const isDentistType = dentistTypes.includes(practiceType);
          router.push(userRole === 'individual' ? '/academy' : (isDentistType ? '/dentist/dashboard' : '/dashboard'));
        }}
        className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm font-black tracking-widest"
      >
        Go to {userRole === 'individual' ? 'Learning Hub' : 'Dashboard'}
      </button>
    </div>
  );
}
