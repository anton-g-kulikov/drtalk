"use client";

import {
  ArrowLeft as ArrowLeftIcon,
  CheckCircle2 as CheckCircle2Icon,
  ChevronRight as ChevronRightIcon,
  Fingerprint as FingerprintIcon,
  Lock as LockIcon,
  ShieldCheck as ShieldCheckIcon,
} from 'lucide-react';
import type { UserRole } from '@/components/VerificationContext';

export type VerificationNpiResult = {
  name: string;
  specialty: string;
  address: string;
  npi: string;
};

type VerificationIntroStepProps = {
  onStart: () => void;
  onCancel: () => void;
};

export function VerificationIntroStep({ onStart, onCancel }: VerificationIntroStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 border-4 border-black rounded-full flex items-center justify-center mx-auto bg-gray-50">
          <LockIcon size={40} />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Identity Verification</h1>
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest max-w-sm mx-auto leading-relaxed">
          Practice owner verification is required to process referrals and access PHI.
        </p>
      </div>

      <div className="space-y-4">
        <div className="wireframe-card p-6 bg-gray-50 space-y-4">
          <div className="flex gap-4 items-start">
            <ShieldCheckIcon size={24} className="shrink-0" />
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-tight">HIPAA COMPLIANCE</p>
              <p className="text-[10px] text-muted-foreground uppercase leading-relaxed font-bold">
                This one-time verification ensures that sensitive patient data is only handled by authorized medical professionals.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-[9px] uppercase font-bold text-muted-foreground leading-relaxed italic text-center px-4">
            Once verified, all team members in your practice will be granted PHI access. Granular user settings can be managed later in Settings.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={onStart}
            className="wireframe-button bg-black text-white py-4 uppercase text-sm font-black tracking-widest flex items-center justify-center gap-2"
          >
            Start Verification <ChevronRightIcon size={18} />
          </button>
          <button
            onClick={onCancel}
            className="text-[10px] font-black uppercase underline py-2 text-muted-foreground hover:text-black"
          >
            I&apos;ll do this later
          </button>
        </div>
      </div>
    </div>
  );
}

type VerificationRoleStepProps = {
  selectedRole: UserRole;
  onBack: () => void;
  onRoleChange: (role: UserRole) => void;
  onContinue: () => void;
};

export function VerificationRoleStep({ selectedRole, onBack, onRoleChange, onContinue }: VerificationRoleStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
          <ArrowLeftIcon size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tighter italic leading-none">Choose Your Role</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-bold">Requirement for practice setup</p>
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
            onClick={() => onRoleChange(role.id as UserRole)}
            className={`wireframe-card w-full p-6 text-left transition-all ${
              selectedRole === role.id
                ? 'bg-black text-white'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <p className="font-black uppercase text-sm tracking-tight mb-1">{role.label}</p>
            <p className={`text-[10px] uppercase font-bold leading-relaxed ${
              selectedRole === role.id ? 'text-gray-400' : 'text-muted-foreground'
            }`}>
              {role.desc}
            </p>
          </button>
        ))}

        <div className="pt-4">
          <button
            onClick={onContinue}
            className="wireframe-button bg-black text-white py-4 uppercase text-sm font-black tracking-widest w-full"
          >
            Continue <ChevronRightIcon size={18} className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

type VerificationNpiStepProps = {
  npi: string;
  npiResult: VerificationNpiResult | null;
  onBack: () => void;
  onNpiChange: (value: string) => void;
  onSearch: () => void;
  onManualDetails: () => void;
  onContinue: () => void;
};

export function VerificationNpiStep({
  npi,
  npiResult,
  onBack,
  onNpiChange,
  onSearch,
  onManualDetails,
  onContinue,
}: VerificationNpiStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
          <ArrowLeftIcon size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">NPI VALIDATION</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1 tracking-widest">STEP 1 OF 2: CONFIRM CREDENTIALS</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest">NATIONAL PROVIDER IDENTIFIER</label>
          <input
            type="text"
            placeholder="10-DIGIT NPI"
            className="wireframe-input w-full py-4 px-4 text-sm font-mono tracking-widest"
            value={npi}
            onChange={(event) => onNpiChange(event.target.value)}
          />
          <p className="text-[9px] font-bold uppercase text-muted-foreground mt-3 leading-relaxed">
            OPTIONAL: ENTERING YOUR NPI WILL HELP US PRE-FILL YOUR PROFESSIONAL DETAILS.
          </p>
        </div>

        {npiResult && (
          <div className="wireframe-card p-6 border-2 border-black bg-white space-y-4 animate-in zoom-in-95 duration-300">
            <p className="text-[10px] font-black uppercase tracking-widest border-b border-black pb-2">Registry Match Found</p>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <p className="text-[8px] text-muted-foreground uppercase font-black">PROVIDER NAME</p>
                <p className="text-sm font-black uppercase tracking-tight">{npiResult.name}</p>
              </div>
              <div>
                <p className="text-[8px] text-muted-foreground uppercase font-black">SPECIALTY</p>
                <p className="text-[10px] font-black uppercase tracking-tight">{npiResult.specialty}</p>
              </div>
              <div>
                <p className="text-[8px] text-muted-foreground uppercase font-black">PRIMARY ADDRESS</p>
                <p className="text-[10px] font-bold uppercase tracking-tight">{npiResult.address}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 pt-4">
          <button
            onClick={npiResult ? onContinue : onSearch}
            disabled={!npi && !npiResult}
            className="wireframe-button bg-black text-white py-5 uppercase text-sm font-black tracking-[0.2em] w-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {npiResult ? 'CONFIRM & CONTINUE' : 'LOOK UP AND FILL IN'}
          </button>

          <div className="text-center">
            <button
              onClick={onManualDetails}
              className="text-[10px] font-black uppercase underline text-muted-foreground hover:text-black transition-all tracking-widest"
            >
              PROVIDE DETAILS MANUALLY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type VerificationManualDetailsStepProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function VerificationManualDetailsStep({ onBack, onContinue }: VerificationManualDetailsStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
          <ArrowLeftIcon size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tighter">Medical Credentials</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-bold">Step 1.5 of 2: Manual Licensing</p>
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-[10px] uppercase font-bold text-muted-foreground leading-relaxed">
          Since you&apos;ve skipped the NPI lookup, please provide your medical licensing details for manual verification.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Medical License #</label>
            <input
              type="text"
              placeholder="E.G. 12345678"
              className="wireframe-input w-full py-3 px-4 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">License State</label>
            <select className="wireframe-input w-full py-3 px-4 text-sm appearance-none bg-transparent">
              <option>CA</option>
              <option>NY</option>
              <option>TX</option>
              <option>FL</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Professional Title</label>
          <input
            type="text"
            placeholder="E.G. ENDODONTIST"
            className="wireframe-input w-full py-3 px-4 text-sm"
          />
        </div>

        <div className="wireframe-card p-4 bg-gray-50 border-dashed">
          <p className="text-[9px] uppercase font-bold text-muted-foreground italic leading-relaxed">
            Note: Providing a valid NPI is the fastest way to verify. You can still go back and search for yours.
          </p>
        </div>

        <button
          onClick={onContinue}
          className="wireframe-button bg-black text-white py-4 uppercase text-sm font-black tracking-widest w-full mt-4"
        >
          Continue to Identity Check
        </button>
      </div>
    </div>
  );
}

type VerificationPersonaStepProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function VerificationPersonaStep({ onBack, onContinue }: VerificationPersonaStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
          <ArrowLeftIcon size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tighter">Identity Verification</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-bold">Step 2 of 2: Secure Persona ID</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="wireframe-card p-10 border-dashed border-2 flex flex-col items-center justify-center text-center space-y-6 bg-gray-50">
          <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <FingerprintIcon size={32} />
          </div>
          <div className="space-y-2">
            <p className="font-black uppercase tracking-tighter italic">Identity Verification Provider</p>
            <p className="text-[10px] uppercase text-muted-foreground font-bold max-w-[200px] leading-relaxed">
              Persona will verify your government ID and facial biometrics to secure your practice ownership.
            </p>
          </div>
          <div className="w-full h-[2px] bg-black opacity-10"></div>
          <div className="flex items-center gap-2">
            <LockIcon size={12} className="text-muted-foreground" />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">SECURE ENCRYPTED CONNECTION</span>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="wireframe-button bg-black text-white py-4 uppercase text-sm font-black tracking-widest w-full"
        >
          Launch Persona Verification
        </button>
      </div>
    </div>
  );
}

type VerificationSuccessStepProps = {
  selectedRole: UserRole;
  onComplete: (role: UserRole) => void;
};

export function VerificationSuccessStep({ selectedRole, onComplete }: VerificationSuccessStepProps) {
  return (
    <div className="space-y-10 text-center animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center mx-auto bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CheckCircle2Icon size={56} />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">VERIFIED</h1>
        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
          Your identity has been confirmed.<br />PHI access is now active for your practice.
        </p>
      </div>

      <div className="wireframe-card p-6 bg-gray-50 text-left space-y-4">
        <p className="text-[10px] font-black uppercase border-b border-black pb-2">Enabled Privileges</p>
        <ul className="space-y-2">
          {[
            'Access to Patient Health Information (PHI)',
            'Direct intake from external referral links',
            'PHI delegation to team members',
            'Secure patient messaging (SMS/Email)',
          ].map((item) => (
            <li key={item} className="flex gap-2 items-center text-[10px] font-bold uppercase">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onComplete(selectedRole)}
        className="wireframe-button bg-black text-white py-5 uppercase text-sm font-black tracking-[0.2em] w-full"
      >
        Continue to Practice
      </button>
    </div>
  );
}
