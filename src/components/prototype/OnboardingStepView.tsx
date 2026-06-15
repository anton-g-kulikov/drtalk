"use client";

import React from 'react';
import {
  ChevronRight as ChevronRightIcon,
  ArrowLeft as ArrowLeftIcon,
  Users as UsersIcon,
  Building2 as Building2Icon,
  Shield as ShieldIcon,
  GraduationCap as GraduationCapIcon,
  Plus as PlusIcon,
} from 'lucide-react';
import { CommentMarker } from '@/components/Comments/CommentMarker';
import type { UserRole } from '@/components/VerificationContext';
import {
  OnboardingRoleSelectionStep,
  OnboardingSuccessStep,
  OnboardingUserRoleStep,
  OnboardingVerifyStep,
} from '@/components/prototype/onboarding/OnboardingSimpleSteps';

export type OnboardingStep =
  | 'AUTH'
  | 'VERIFY'
  | 'USER_ROLE'
  | 'ROLE_SELECTION'
  | 'PRACTICE_DETAILS'
  | 'JOIN_PRACTICE'
  | 'PRACTICE_INVITE'
  | 'SUCCESS';

type InviteDraft = { email: string; role: string };

type OnboardingStepViewProps = {
  step: OnboardingStep;
  isIndividualFlow: boolean;
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  userRole: UserRole;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
  practiceType: string;
  setPracticeType: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
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
  invites: InviteDraft[];
  setInvites: React.Dispatch<React.SetStateAction<InviteDraft[]>>;
  addInvite: () => void;
  updateInvite: (index: number, field: 'email' | 'role', value: string) => void;
  practiceTypes: string[];
  dentistTypes: string[];
  nextStep: (next: OnboardingStep) => void;
  verify: (role: UserRole) => void;
  router: { push: (href: string) => void };
};

export function OnboardingStepView(props: OnboardingStepViewProps) {
  const {
    step,
    isIndividualFlow,
    isLogin,
    setIsLogin,
    userRole,
    setUserRole,
    practiceType,
    setPracticeType,
    email,
    setEmail,
    firstName,
    setFirstName,
    lastName,
    setLastName,
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
    invites,
    setInvites,
    addInvite,
    updateInvite,
    practiceTypes,
    dentistTypes,
    nextStep,
    verify,
    router,
  } = props;

  switch (step) {
  case 'AUTH':
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
              {(isIndividualFlow 
                ? [
                    { icon: GraduationCapIcon, title: 'Expert Courses', desc: 'Learn at your own pace' },
                    { icon: ShieldIcon, title: 'CE Credits', desc: 'Earn verified credits' },
                    { icon: PlusIcon, title: 'Resource Library', desc: 'Guides, videos & templates' },
                  ]
                : [
                    { icon: Building2Icon, title: 'Setup Practice', desc: 'Go live today' },
                    { icon: UsersIcon, title: 'Track every Referral', desc: 'Real-time visibility' },
                    { icon: PlusIcon, title: 'Connect and coordinate', desc: 'Seamless care' },
                  ]
              ).map((feature) => (
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
              <input 
                type="email" 
                placeholder="doctor@practice.com" 
                className="wireframe-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase">Password</label>
              <input type="password" placeholder="••••••••" className="wireframe-input" />
            </div>
            {!isLogin && (
              <div className="flex gap-4">
                <div className="space-y-1 flex-1">
                  <label className="text-[10px] font-bold uppercase">First Name</label>
                  <input 
                    type="text" 
                    className="wireframe-input" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <label className="text-[10px] font-bold uppercase">Last Name</label>
                  <input 
                    type="text" 
                    className="wireframe-input" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            )}
            {!isLogin && (
              <p className="text-[10px] text-muted-foreground leading-relaxed text-center pb-2">
                By creating account, you agree to drtalk’s{' '}
                <span className="text-black underline cursor-pointer font-bold">Terms and Conditions of Use</span>,{' '}
                <span className="text-black underline cursor-pointer font-bold">Business Associates Agreement</span>, and{' '}
                <span className="text-black underline cursor-pointer font-bold">Copyright Policy</span>
              </p>
            )}
            <button 
              onClick={() => {
                if (isLogin) {
                  verify(isIndividualFlow ? 'individual' : 'owner');
                  const isDentistEmail = email.toLowerCase().includes('dentist');
                  router.push(isIndividualFlow ? '/academy' : (isDentistEmail ? '/dentist/dashboard' : '/dashboard'));
                } else {
                  nextStep('VERIFY');
                }
              }}
              className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm font-black tracking-widest"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-black/10"></div>
              <span className="flex-shrink mx-4 text-[9px] font-black uppercase text-muted-foreground/60 tracking-widest">or</span>
              <div className="flex-grow border-t border-black/10"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  verify(isIndividualFlow ? 'individual' : 'owner');
                  const isDentistEmail = email.toLowerCase().includes('dentist');
                  router.push(isIndividualFlow ? '/academy' : (isDentistEmail ? '/dentist/dashboard' : '/dashboard'));
                }}
                className="wireframe-button border-2 border-black py-3 text-[9px] uppercase font-black flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all bg-white text-black"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                {isLogin ? 'Log in with Google' : 'Sign up with Google'}
              </button>
              <button
                onClick={() => {
                  verify(isIndividualFlow ? 'individual' : 'owner');
                  const isDentistEmail = email.toLowerCase().includes('dentist');
                  router.push(isIndividualFlow ? '/academy' : (isDentistEmail ? '/dentist/dashboard' : '/dashboard'));
                }}
                className="wireframe-button border-2 border-black py-3 text-[9px] uppercase font-black flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all bg-white text-black"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 23 23" fill="currentColor">
                  <rect x="0" y="0" width="11" height="11" fill="#F25022" />
                  <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
                  <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
                  <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
                </svg>
                {isLogin ? 'Log in with Microsoft' : 'Sign up with Microsoft'}
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] uppercase font-black tracking-tighter">
            {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
            <span 
              className="text-black cursor-pointer underline ml-1" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </section>
      </div>
    );

  case 'VERIFY':
    return (
      <OnboardingVerifyStep
        isIndividualFlow={isIndividualFlow}
        setUserRole={setUserRole}
        nextStep={nextStep}
      />
    );

  case 'USER_ROLE':
    return (
      <OnboardingUserRoleStep
        userRole={userRole}
        setUserRole={setUserRole}
        invites={invites}
        setInvites={setInvites}
        nextStep={nextStep}
      />
    );

  case 'ROLE_SELECTION':
    return (
      <OnboardingRoleSelectionStep nextStep={nextStep} />
    );

  case 'PRACTICE_DETAILS':
    return (
      <div className="space-y-10 w-full max-w-2xl px-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => nextStep('ROLE_SELECTION')} 
            className="w-12 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
          >
            <ArrowLeftIcon size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">PRACTICE DETAILS</h1>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Practice Name first */}
          <div className="space-y-1 relative">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest">PRACTICE NAME</label>
              {isPracticeDetailsLoading && (
                <span className="text-[9px] font-bold text-gray-500 animate-pulse uppercase">🔍 Searching NPI Registry...</span>
              )}
              {showNpiTooltip && (
                <span className="text-[9px] font-black text-green-600 uppercase tracking-wider animate-bounce">✓ NPI registry match auto-filled</span>
              )}
            </div>
            <input 
              type="text" 
              placeholder="e.g., Valley Dental Care" 
              className="wireframe-input py-4 px-4 text-sm cursor-pointer border-2 hover:border-black transition-all" 
              value={practiceName}
              onChange={(e) => setPracticeName(e.target.value)}
              onClick={handlePracticeNameClick}
              onFocus={handlePracticeNameClick}
            />
            <p className="text-[9px] uppercase font-bold text-gray-400 mt-1">
              💡 Click above to simulate an automatic NPI registry lookup & pre-fill.
            </p>
          </div>

          {/* Practice Type second */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest">PRACTICE TYPE</label>
            <div className="relative">
              <select 
                value={practiceType}
                onChange={(e) => setPracticeType(e.target.value)}
                className="wireframe-input appearance-none bg-transparent py-4 px-4 text-sm w-full pr-8"
              >
                {practiceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronRightIcon size={12} className="rotate-90" />
              </div>
            </div>
          </div>

          {/* City & State Row */}
          <div className="grid grid-cols-[1fr_120px] gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest">CITY</label>
              <input 
                type="text" 
                placeholder="e.g., New York" 
                className={`wireframe-input py-4 px-4 text-sm transition-all duration-500 ${isPracticeDetailsLoading ? 'opacity-50' : ''}`} 
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest">STATE</label>
              <div className="relative">
                <select 
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className={`wireframe-input appearance-none bg-transparent py-4 px-4 text-sm w-full pr-8 transition-all duration-500 ${isPracticeDetailsLoading ? 'opacity-50' : ''}`}
                >
                  <option>CA</option>
                  <option>NY</option>
                  <option>TX</option>
                  <option>FL</option>
                  <option>WA</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRightIcon size={12} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Address & ZIP Row */}
          <div className="grid grid-cols-[1fr_120px] gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest">ADDRESS</label>
              <input 
                type="text" 
                placeholder="e.g., 123 Main St, Suite 100" 
                className={`wireframe-input py-4 px-4 text-sm transition-all duration-500 ${isPracticeDetailsLoading ? 'opacity-50' : ''}`} 
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest">ZIP</label>
              <input 
                type="text" 
                placeholder="10001" 
                className={`wireframe-input py-4 px-4 text-sm transition-all duration-500 ${isPracticeDetailsLoading ? 'opacity-50' : ''}`} 
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
          </div>

          {/* Phone Row */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest">PHONE NUMBER</label>
            <input 
              type="tel" 
              placeholder="e.g., (555) 000-0000" 
              className={`wireframe-input py-4 px-4 text-sm transition-all duration-500 ${isPracticeDetailsLoading ? 'opacity-50' : ''}`} 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Fax Option */}
          <div className="space-y-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                className="w-3.5 h-3.5 border-2 border-black rounded-none appearance-none checked:bg-black transition-all cursor-pointer"
                checked={wantsFax}
                onChange={(e) => setWantsFax(e.target.checked)}
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-black">
                We want to receive fax messages on drtalk platform
              </span>
            </label>

            {wantsFax && (
              <div className="space-y-1 animate-in fade-in duration-300">
                <label className="text-[10px] font-black uppercase tracking-widest">CURRENT FAX NUMBER</label>
                <input 
                  type="tel" 
                  placeholder="e.g., (555) 000-0000" 
                  className={`wireframe-input py-4 px-4 text-sm transition-all duration-500 ${isPracticeDetailsLoading ? 'opacity-50' : ''}`} 
                  value={faxNumber}
                  onChange={(e) => setFaxNumber(e.target.value)}
                />
                <p className="text-[9px] uppercase font-bold text-gray-400 mt-1">
                  💡 Leave blank to get eFax number assigned automatically
                </p>
              </div>
            )}
          </div>

          <button 
            onClick={() => nextStep('USER_ROLE')}
            className="wireframe-button w-full bg-black text-white py-5 uppercase text-sm font-black tracking-[0.2em] mt-4 flex items-center justify-center gap-2"
          >
            NEXT STEP <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>
    );

  case 'JOIN_PRACTICE':
    return (
      <div className="space-y-10 w-full max-w-2xl px-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => nextStep('ROLE_SELECTION')} 
            className="w-12 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
          >
            <ArrowLeftIcon size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">JOIN EXISTING PRACTICE</h1>
            <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">REQUEST ACCESS TO YOUR TEAM</p>
          </div>
        </div>

        <div className="space-y-12">
          {/* Option 1: Invite Code */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">OPTION 1: ENTER INVITE CODE</label>
              <input type="text" placeholder="X-782-K9L" className="wireframe-input py-6 text-center text-2xl font-black tracking-[0.5em] uppercase" />
            </div>
            <button 
              onClick={() => nextStep('SUCCESS')}
              className="wireframe-button w-full bg-black text-white py-4 uppercase text-sm font-black tracking-widest"
            >
              JOIN WITH CODE
            </button>
          </div>

          {/* Separator */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-full border-t border-black border-dashed"></div>
            <span className="relative bg-white px-4 text-xs font-black uppercase italic">OR</span>
          </div>

          {/* Option 2: Search & Request */}
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">OPTION 2: FIND YOUR PRACTICE & REQUEST ACCESS</p>
            <div className="grid grid-cols-[120px_1fr] gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest">STATE</label>
                <div className="relative">
                  <select className="wireframe-input appearance-none bg-transparent py-4 px-4 text-sm w-full pr-8">
                    <option>CA</option>
                    <option>NY</option>
                    <option>TX</option>
                    <option>FL</option>
                    <option>WA</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronRightIcon size={12} className="rotate-90" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest">PRACTICE NAME</label>
                  <CommentMarker 
                    id="join-practice-search"
                    title="Practice Search"
                    description="Start typing your practice name. We'll suggest matches from the drTalk database after 3 letters."
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Search practice name..." 
                  className="wireframe-input py-4 px-4 text-sm" 
                />
              </div>
            </div>
            <button 
              onClick={() => nextStep('SUCCESS')}
              className="wireframe-button w-full border-2 border-black py-4 uppercase text-sm font-black tracking-widest hover:bg-black hover:text-white transition-all"
            >
              REQUEST ACCESS
            </button>
          </div>
        </div>
      </div>
    );


  case 'PRACTICE_INVITE':
    return (
      <div className="space-y-8 w-full max-w-lg">
        <div className="flex items-center gap-4">
          <button onClick={() => nextStep('USER_ROLE')} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all">
            <ArrowLeftIcon size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tighter">Invite Your Team</h1>
          </div>
        </div>
        <div className="space-y-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Invite team members or practice admins to your practice</p>
          
          <div className="space-y-6">
            {/* Column Headers */}
            <div className="flex gap-4 px-1">
              <label className="flex-1 text-[10px] font-black uppercase tracking-widest">Email</label>
              <label className="w-32 text-[10px] font-black uppercase tracking-widest">Role Type</label>
            </div>

            <div className="space-y-4">
              {invites.map((invite, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input 
                      type="email" 
                      placeholder="colleague@practice.com" 
                      className="wireframe-input w-full py-4 px-4 text-sm" 
                      value={invite.email}
                      onChange={(e) => updateInvite(index, 'email', e.target.value)}
                    />
                  </div>
                  <div className="w-32 relative">
                    <select 
                      value={invite.role}
                      onChange={(e) => updateInvite(index, 'role', e.target.value)}
                      className="wireframe-input w-full appearance-none bg-transparent py-4 px-4 text-[10px] font-black uppercase tracking-widest text-center pr-8"
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="team">Team Member</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronRightIcon size={12} className="rotate-90" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {invites.length < 10 && (
            <button 
              onClick={addInvite}
              className="text-[10px] font-black underline uppercase tracking-widest"
            >
              + Add Another
            </button>
          )}
          
          <div className="pt-8 space-y-4">
            <button 
              onClick={() => nextStep('SUCCESS')}
              className="wireframe-button w-full bg-black text-white py-3 uppercase text-sm"
            >
              Complete Setup
            </button>
            <button 
              onClick={() => nextStep('SUCCESS')}
              className="w-full text-[10px] font-bold uppercase text-muted-foreground hover:text-black"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    );

  case 'SUCCESS':
    return (
      <OnboardingSuccessStep
        userRole={userRole}
        practiceType={practiceType}
        dentistTypes={dentistTypes}
        verify={verify}
        router={router}
      />
    );
}
}
