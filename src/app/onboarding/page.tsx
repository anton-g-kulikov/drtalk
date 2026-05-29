"use client";

import React, { useState } from 'react';
import { 
  ChevronRight as ChevronRightIcon, 
  ArrowLeft as ArrowLeftIcon, 
  CheckCircle2 as CheckCircle2Icon, 
  ShieldCheck as ShieldCheckIcon, 
  Users as UsersIcon, 
  Building2 as Building2Icon,
  AlertTriangle as AlertTriangleIcon,
  UserCircle as UserCircleIcon,
  Stethoscope as StethoscopeIcon,
  Shield as ShieldIcon,
  GraduationCap as GraduationCapIcon,
  Search as SearchIcon,
  Plus as PlusIcon
} from 'lucide-react';
import { CommentMarker } from '@/components/Comments/CommentMarker';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useVerification, UserRole } from '@/components/VerificationContext';

type OnboardingStep = 
  | 'AUTH' 
  | 'VERIFY' 
  | 'USER_ROLE'
  | 'ROLE_SELECTION' 
  | 'PRACTICE_DETAILS' 
  | 'JOIN_PRACTICE'
  | 'PRACTICE_INVITE' 
  | 'SUCCESS';

function OnboardingContent() {
  const searchParams = useSearchParams();
  const isIndividualFlow = searchParams.get('type') === 'individual';
  const [step, setStep] = useState<OnboardingStep>('AUTH');
  const [isLogin, setIsLogin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(isIndividualFlow ? 'individual' : 'owner');
  const [practiceType, setPracticeType] = useState('Dentist');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [practiceName, setPracticeName] = useState(searchParams.get('practice') || '');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [selectedState, setSelectedState] = useState('CA');
  const [isPracticeDetailsLoading, setIsPracticeDetailsLoading] = useState(false);
  const [showNpiTooltip, setShowNpiTooltip] = useState(false);

  const handlePracticeNameClick = () => {
    if (isPracticeDetailsLoading || city) return;
    setIsPracticeDetailsLoading(true);
    setPracticeName("Valley Endodontics");
    setTimeout(() => {
      setCity("Beverly Hills");
      setSelectedState("CA");
      setZipCode("90210");
      setFullAddress("123 Dental Way, Ste 100");
      setPhone("(310) 555-0199");
      setPracticeType("Endodontist");
      setIsPracticeDetailsLoading(false);
      setShowNpiTooltip(true);
      setTimeout(() => setShowNpiTooltip(false), 4000);
    }, 1200);
  };




  const [invites, setInvites] = useState<{email: string, role: string}[]>([
    { email: '', role: 'admin' },
    { email: '', role: 'team' }
  ]);

  
  const addInvite = () => {
    if (invites.length < 10) {
      setInvites([...invites, { email: '', role: 'team' }]);
    }
  };

  const updateInvite = (index: number, field: 'email' | 'role', value: string) => {
    const newInvites = [...invites];
    newInvites[index][field] = value;
    setInvites(newInvites);
  };
  const router = useRouter();
  const { verify } = useVerification();

  const practiceTypes = [
    'Dentist',
    'Pediatric Dentist',
    'Orthodontist',
    'Endodontist',
    'Oral & Maxillofacial Surgeon',
    'Periodontist',
    'Prosthodontist',
    'Dental Anesthesiologist',
    'Oral Pathologist',
    'Dental Partner',
    'Dental Laboratory'
  ];

  const dentistTypes = ['Dentist', 'Pediatric Dentist', 'Orthodontist'];

  const nextStep = (next: OnboardingStep) => setStep(next);

  const renderStep = () => {
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

      case 'USER_ROLE':
        return (
          <div className="w-full max-w-lg animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-10">
              <div className="flex items-center gap-4">
                <button onClick={() => nextStep('PRACTICE_DETAILS')} className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <ArrowLeftIcon size={16} />
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
                  { id: 'team', label: 'Team Member', desc: 'I provide direct patient care (Dental Assistant, Hygienist, etc).' }
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
                        const hasOwnerInvite = invites.some(i => i.role === 'owner');
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

      case 'ROLE_SELECTION':
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
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      {renderStep()}
      
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-bold uppercase tracking-widest">Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
