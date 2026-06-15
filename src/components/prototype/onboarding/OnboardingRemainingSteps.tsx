"use client";

import React from 'react';
import {
  ArrowLeft as ArrowLeftIcon,
  Building2 as Building2Icon,
  ChevronRight as ChevronRightIcon,
  GraduationCap as GraduationCapIcon,
  Plus as PlusIcon,
  Shield as ShieldIcon,
  Users as UsersIcon,
} from 'lucide-react';
import { CommentMarker } from '@/components/Comments/CommentMarker';
import type { UserRole } from '@/components/VerificationContext';
import type { OnboardingStep } from '@/components/prototype/OnboardingStepView';

type InviteDraft = { email: string; role: string };
type RouterLike = { push: (href: string) => void };

export function OnboardingAuthStep({
  isIndividualFlow,
  isLogin,
  setIsLogin,
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  nextStep,
  verify,
  router,
}: {
  isIndividualFlow: boolean;
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  nextStep: (next: OnboardingStep) => void;
  verify: (role: UserRole) => void;
  router: RouterLike;
}) {
  const handleExistingAccountAuth = () => {
    verify(isIndividualFlow ? 'individual' : 'owner');
    const isDentistEmail = email.toLowerCase().includes('dentist');
    router.push(isIndividualFlow ? '/academy' : (isDentistEmail ? '/dentist/dashboard' : '/dashboard'));
  };

  const features = isIndividualFlow
    ? [
        { icon: GraduationCapIcon, title: 'Expert Courses', desc: 'Learn at your own pace' },
        { icon: ShieldIcon, title: 'CE Credits', desc: 'Earn verified credits' },
        { icon: PlusIcon, title: 'Resource Library', desc: 'Guides, videos & templates' },
      ]
    : [
        { icon: Building2Icon, title: 'Setup Practice', desc: 'Go live today' },
        { icon: UsersIcon, title: 'Track every Referral', desc: 'Real-time visibility' },
        { icon: PlusIcon, title: 'Connect and coordinate', desc: 'Seamless care' },
      ];

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch animate-in fade-in duration-500">
      <section className="wireframe-card p-8 sm:p-10 bg-black text-white flex flex-col justify-between">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-[10px] uppercase font-black tracking-widest text-white/60">
              {isIndividualFlow ? 'drTalk Learning Hub' : 'drTalk Referral Network'}
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-tight">
              {isIndividualFlow
                ? 'Gain instant access to premier learning resources'
                : 'Modernize your referal process and practice communication'}
            </h2>
            <p className="text-[11px] uppercase leading-relaxed font-bold text-white/70">
              {isIndividualFlow
                ? 'Elevate your professional knowledge with expert dental courses and materials.'
                : 'No more phone tag, voice mails, emails and fax'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {features.map((feature) => (
              <div key={feature.title} className="border border-white/20 p-4 space-y-3 flex flex-col justify-between">
                <feature.icon size={20} className="text-white/80" />
                <div>
                  <p className="text-[9px] uppercase font-black">{feature.title}</p>
                  <p className="text-[8px] uppercase font-bold text-white/50">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/20 border-dashed">
          <p className="text-[9px] uppercase font-bold text-white/40 italic">
            {isIndividualFlow ? 'Learn. Share. Elevate your profession.' : 'Connect. Coordinate. Elevate your practice.'}
          </p>
        </div>
      </section>

      <section className="wireframe-card p-8 sm:p-10 flex flex-col justify-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none">
            {isLogin ? 'Welcome Back' : (isIndividualFlow ? 'Create Learning Account' : 'Create Account')}
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            {isLogin
              ? 'Log in to your practice workspace'
              : (isIndividualFlow ? 'Create your free individual learning hub account' : 'Join the referral network today')}
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase">Email Address</label>
            <input type="email" placeholder="doctor@practice.com" className="wireframe-input" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase">Password</label>
            <input type="password" placeholder="••••••••" className="wireframe-input" />
          </div>
          {!isLogin && (
            <div className="flex gap-4">
              <div className="space-y-1 flex-1">
                <label className="text-[10px] font-bold uppercase">First Name</label>
                <input type="text" className="wireframe-input" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
              </div>
              <div className="space-y-1 flex-1">
                <label className="text-[10px] font-bold uppercase">Last Name</label>
                <input type="text" className="wireframe-input" value={lastName} onChange={(event) => setLastName(event.target.value)} />
              </div>
            </div>
          )}
          {!isLogin && (
            <p className="text-[10px] text-muted-foreground leading-relaxed text-center pb-2">
              By creating account, you agree to drtalk’s <span className="text-black underline cursor-pointer font-bold">Terms and Conditions of Use</span>, <span className="text-black underline cursor-pointer font-bold">Business Associates Agreement</span>, and <span className="text-black underline cursor-pointer font-bold">Copyright Policy</span>
            </p>
          )}
          <button
            onClick={() => {
              if (isLogin) {
                handleExistingAccountAuth();
              } else {
                nextStep('VERIFY');
              }
            }}
            className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm font-black tracking-widest"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-black/10" />
            <span className="flex-shrink mx-4 text-[9px] font-black uppercase text-muted-foreground/60 tracking-widest">or</span>
            <div className="flex-grow border-t border-black/10" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button onClick={handleExistingAccountAuth} className="wireframe-button border-2 border-black py-3 text-[9px] uppercase font-black flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all bg-white text-black">
              {isLogin ? 'Log in with Google' : 'Sign up with Google'}
            </button>
            <button onClick={handleExistingAccountAuth} className="wireframe-button border-2 border-black py-3 text-[9px] uppercase font-black flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all bg-white text-black">
              {isLogin ? 'Log in with Microsoft' : 'Sign up with Microsoft'}
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] uppercase font-black tracking-tighter">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <span className="text-black cursor-pointer underline ml-1" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </section>
    </div>
  );
}

export function OnboardingPracticeDetailsStep({
  practiceType,
  setPracticeType,
  practiceName,
  setPracticeName,
  phone,
  setPhone,
  city,
  setCity,
  zipCode,
  setZipCode,
  fullAddress,
  setFullAddress,
  selectedState,
  setSelectedState,
  wantsFax,
  setWantsFax,
  faxNumber,
  setFaxNumber,
  isPracticeDetailsLoading,
  showNpiTooltip,
  handlePracticeNameClick,
  practiceTypes,
  nextStep,
}: {
  practiceType: string;
  setPracticeType: React.Dispatch<React.SetStateAction<string>>;
  practiceName: string;
  setPracticeName: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  zipCode: string;
  setZipCode: React.Dispatch<React.SetStateAction<string>>;
  fullAddress: string;
  setFullAddress: React.Dispatch<React.SetStateAction<string>>;
  selectedState: string;
  setSelectedState: React.Dispatch<React.SetStateAction<string>>;
  wantsFax: boolean;
  setWantsFax: React.Dispatch<React.SetStateAction<boolean>>;
  faxNumber: string;
  setFaxNumber: React.Dispatch<React.SetStateAction<string>>;
  isPracticeDetailsLoading: boolean;
  showNpiTooltip: boolean;
  handlePracticeNameClick: () => void;
  practiceTypes: string[];
  nextStep: (next: OnboardingStep) => void;
}) {
  const fieldClass = `wireframe-input py-4 px-4 text-sm transition-all duration-500 ${isPracticeDetailsLoading ? 'opacity-50' : ''}`;

  return (
    <div className="space-y-10 w-full max-w-2xl px-4">
      <div className="flex items-center gap-6">
        <button onClick={() => nextStep('ROLE_SELECTION')} className="w-12 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">PRACTICE DETAILS</h1>
      </div>
      <div className="space-y-6">
        <div className="space-y-1 relative">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase tracking-widest">PRACTICE NAME</label>
            {isPracticeDetailsLoading && <span className="text-[9px] font-bold text-gray-500 animate-pulse uppercase">Searching NPI Registry...</span>}
            {showNpiTooltip && <span className="text-[9px] font-black text-green-600 uppercase tracking-wider animate-bounce">NPI registry match auto-filled</span>}
          </div>
          <input type="text" placeholder="e.g., Valley Dental Care" className="wireframe-input py-4 px-4 text-sm cursor-pointer border-2 hover:border-black transition-all" value={practiceName} onChange={(event) => setPracticeName(event.target.value)} onClick={handlePracticeNameClick} onFocus={handlePracticeNameClick} />
          <p className="text-[9px] uppercase font-bold text-gray-400 mt-1">Click above to simulate an automatic NPI registry lookup & pre-fill.</p>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest">PRACTICE TYPE</label>
          <div className="relative">
            <select value={practiceType} onChange={(event) => setPracticeType(event.target.value)} className="wireframe-input appearance-none bg-transparent py-4 px-4 text-sm w-full pr-8">
              {practiceTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronRightIcon size={12} className="rotate-90" /></div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_120px] gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest">CITY</label>
            <input type="text" placeholder="e.g., New York" className={fieldClass} value={city} onChange={(event) => setCity(event.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest">STATE</label>
            <select value={selectedState} onChange={(event) => setSelectedState(event.target.value)} className={fieldClass}>
              <option>CA</option><option>NY</option><option>TX</option><option>FL</option><option>WA</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_120px] gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest">ADDRESS</label>
            <input type="text" placeholder="e.g., 123 Main St, Suite 100" className={fieldClass} value={fullAddress} onChange={(event) => setFullAddress(event.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest">ZIP</label>
            <input type="text" placeholder="10001" className={fieldClass} value={zipCode} onChange={(event) => setZipCode(event.target.value)} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest">PHONE NUMBER</label>
          <input type="tel" placeholder="e.g., (555) 000-0000" className={fieldClass} value={phone} onChange={(event) => setPhone(event.target.value)} />
        </div>

        <div className="space-y-4 pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="w-3.5 h-3.5 border-2 border-black rounded-none appearance-none checked:bg-black transition-all cursor-pointer" checked={wantsFax} onChange={(event) => setWantsFax(event.target.checked)} />
            <span className="text-[10px] font-black uppercase tracking-widest text-black">We want to receive fax messages on drtalk platform</span>
          </label>
          {wantsFax && (
            <div className="space-y-1 animate-in fade-in duration-300">
              <label className="text-[10px] font-black uppercase tracking-widest">CURRENT FAX NUMBER</label>
              <input type="tel" placeholder="e.g., (555) 000-0000" className={fieldClass} value={faxNumber} onChange={(event) => setFaxNumber(event.target.value)} />
              <p className="text-[9px] uppercase font-bold text-gray-400 mt-1">Leave blank to get eFax number assigned automatically</p>
            </div>
          )}
        </div>

        <button onClick={() => nextStep('USER_ROLE')} className="wireframe-button w-full bg-black text-white py-5 uppercase text-sm font-black tracking-[0.2em] mt-4 flex items-center justify-center gap-2">
          NEXT STEP <ChevronRightIcon size={18} />
        </button>
      </div>
    </div>
  );
}

export function OnboardingJoinPracticeStep({ nextStep }: { nextStep: (next: OnboardingStep) => void }) {
  return (
    <div className="space-y-10 w-full max-w-2xl px-4">
      <div className="flex items-center gap-6">
        <button onClick={() => nextStep('ROLE_SELECTION')} className="w-12 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
          <ArrowLeftIcon size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">JOIN EXISTING PRACTICE</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">REQUEST ACCESS TO YOUR TEAM</p>
        </div>
      </div>
      <div className="space-y-12">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">OPTION 1: ENTER INVITE CODE</label>
            <input type="text" placeholder="X-782-K9L" className="wireframe-input py-6 text-center text-2xl font-black tracking-[0.5em] uppercase" />
          </div>
          <button onClick={() => nextStep('SUCCESS')} className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm font-black tracking-widest">JOIN WITH CODE</button>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute w-full border-t border-black border-dashed" />
          <span className="relative bg-white px-4 text-xs font-black uppercase italic">OR</span>
        </div>
        <div className="space-y-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">OPTION 2: FIND YOUR PRACTICE & REQUEST ACCESS</p>
          <div className="grid grid-cols-[120px_1fr] gap-6">
            <select className="wireframe-input appearance-none bg-transparent py-4 px-4 text-sm w-full pr-8"><option>CA</option><option>NY</option><option>TX</option><option>FL</option><option>WA</option></select>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest">PRACTICE NAME</label>
                <CommentMarker id="join-practice-search" title="Practice Search" description="Start typing your practice name. We'll suggest matches from the drTalk database after 3 letters." />
              </div>
              <input type="text" placeholder="Search practice name..." className="wireframe-input py-4 px-4 text-sm" />
            </div>
          </div>
          <button onClick={() => nextStep('SUCCESS')} className="wireframe-button w-full border-2 border-black py-4 uppercase text-sm font-black tracking-widest hover:bg-black hover:text-white transition-all">REQUEST ACCESS</button>
        </div>
      </div>
    </div>
  );
}

export function OnboardingPracticeInviteStep({
  invites,
  addInvite,
  updateInvite,
  nextStep,
}: {
  invites: InviteDraft[];
  addInvite: () => void;
  updateInvite: (index: number, field: 'email' | 'role', value: string) => void;
  nextStep: (next: OnboardingStep) => void;
}) {
  return (
    <div className="space-y-8 w-full max-w-lg">
      <div className="flex items-center gap-4">
        <button onClick={() => nextStep('USER_ROLE')} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
          <ArrowLeftIcon size={16} />
        </button>
        <h1 className="text-2xl font-bold uppercase tracking-tighter">Invite Your Team</h1>
      </div>
      <div className="space-y-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Invite team members or practice admins to your practice</p>
        <div className="space-y-6">
          <div className="flex gap-4 px-1">
            <label className="flex-1 text-[10px] font-black uppercase tracking-widest">Email</label>
            <label className="w-32 text-[10px] font-black uppercase tracking-widest">Role Type</label>
          </div>
          <div className="space-y-4">
            {invites.map((invite, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input type="email" placeholder="colleague@practice.com" className="wireframe-input flex-1 py-4 px-4 text-sm" value={invite.email} onChange={(event) => updateInvite(index, 'email', event.target.value)} />
                <select value={invite.role} onChange={(event) => updateInvite(index, 'role', event.target.value)} className="wireframe-input w-32 appearance-none bg-transparent py-4 px-4 text-[10px] font-black uppercase tracking-widest text-center">
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                  <option value="team">Team Member</option>
                </select>
              </div>
            ))}
          </div>
        </div>
        {invites.length < 10 && <button onClick={addInvite} className="text-[10px] font-black underline uppercase tracking-widest">+ Add Another</button>}
        <div className="pt-8 space-y-4">
          <button onClick={() => nextStep('SUCCESS')} className="wireframe-button w-full bg-black text-white py-3 uppercase text-sm">Complete Setup</button>
          <button onClick={() => nextStep('SUCCESS')} className="w-full text-[10px] font-bold uppercase text-muted-foreground hover:text-black">Skip for now</button>
        </div>
      </div>
    </div>
  );
}
