'use client';
// Navigation components
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, GraduationCap, LayoutDashboard, MessageSquare, Settings, Users, Menu, X, Bug, Building2 as Building2Icon } from 'lucide-react';
import { useVerification } from './VerificationContext';
import { useSubscription } from './SubscriptionContext';

export const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname();
  const { userRole, reset: resetVerification, setNoOwnerYet, verify } = useVerification();
  const { endTrial, resetSubscription } = useSubscription();
  const isDentist = pathname.startsWith('/dentist');
  const navItems = isDentist
    ? [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dentist/dashboard' },
      { icon: FileText, label: 'Patients', href: '/dentist/referrals' },
      { icon: MessageSquare, label: 'Communication', href: '/dentist/channels' },
      { icon: Users, label: 'Network', href: '/dentist/network' },
      { icon: GraduationCap, label: 'Learning Hub', href: '/dentist/academy' },
    ]
    : [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
      { icon: FileText, label: 'Referrals', href: '/referrals' },
      { icon: MessageSquare, label: 'Communication', href: '/channels' },
      { icon: GraduationCap, label: 'Learning Hub', href: '/academy' },
      { icon: Users, label: 'Network', href: '/network' },
    ];

  const filteredNavItems = userRole === 'individual'
    ? navItems.filter(item => item.label === 'Learning Hub')
    : navItems;

  return (
    <div className={`w-64 h-screen border-r-2 border-black flex flex-col bg-white ${onClose ? 'fixed inset-y-0 left-0 z-50' : 'fixed inset-y-0 left-0 z-30 hidden lg:flex'}`}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 lg:hidden"
        >
          <X size={24} />
        </button>
      )}
      <div className="h-16 border-b-2 border-black flex items-center px-6">
        <h2 className="font-bold text-xl uppercase tracking-tighter italic">drTalk</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.filter(item => item.label !== 'Learning Hub').map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`w-full flex items-center gap-3 p-3 text-xs uppercase font-bold transition-all ${isActive
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100'
                }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="py-2">
          <div className="border-t border-black border-dashed" />
        </div>

        {/* Learning Hub Section */}
        {filteredNavItems.filter(item => item.label === 'Learning Hub').map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`w-full flex items-center gap-3 p-3 text-xs uppercase font-bold transition-all ${isActive
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100'
                }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom sections */}
      <div className="mt-auto flex flex-col">
        {/* Switch Prototype Menu */}
        <div className="px-4 py-2 border-t border-black border-dashed">
          <div className="flex items-center gap-2 px-3 mb-2">
            <Building2Icon size={12} />
            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Switch Prototype</p>
          </div>
          <div className="space-y-1">
            <Link
              href="/dentist/dashboard"
              onClick={() => {
                if (userRole === 'individual') verify('owner');
                if (onClose) onClose();
              }}
              className={`w-full flex items-center px-3 py-1.5 text-[9px] font-bold uppercase transition-all border border-transparent hover:border-black ${isDentist && userRole !== 'individual' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              Dentist Practice
            </Link>
            <Link
              href="/dashboard"
              onClick={() => {
                if (userRole === 'individual') verify('owner');
                if (onClose) onClose();
              }}
              className={`w-full flex items-center px-3 py-1.5 text-[9px] font-bold uppercase transition-all border border-transparent hover:border-black ${!isDentist && userRole !== 'individual' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              Specialist Practice
            </Link>
            <Link
              href="/academy"
              onClick={() => {
                verify('individual');
                if (onClose) onClose();
              }}
              className={`w-full flex items-center px-3 py-1.5 text-[9px] font-bold uppercase transition-all border border-transparent hover:border-black ${userRole === 'individual' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              Individual Learner
            </Link>
          </div>
        </div>

        {/* Debug Controls */}
        <div className="px-4 py-2 border-t border-black border-dashed opacity-20 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 px-3 mb-2">
            <Bug size={12} />
            <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Debug Menu</p>
          </div>
          <div className="space-y-1">
              <button
                onClick={setNoOwnerYet}
                className="w-full text-left px-3 py-1.5 text-[9px] font-bold uppercase hover:bg-black hover:text-white transition-all border border-transparent hover:border-black"
              >
                No Owner Yet
              </button>
              <button
                onClick={resetVerification}
                className="w-full text-left px-3 py-1.5 text-[9px] font-bold uppercase hover:bg-black hover:text-white transition-all border border-transparent hover:border-black"
              >
                Reset Verification
              </button>
              <button
                onClick={() => {
                  // Clear all localStorage entries related to the prototype
                  localStorage.clear();
                  // Reload page to apply reset
                  window.location.reload();
                }}
                className="w-full text-left px-3 py-1.5 text-[9px] font-bold uppercase hover:bg-black hover:text-white transition-all border border-transparent hover:border-black"
              >
                Reset Prototype
              </button>
          </div>
        </div>

        <div className="p-4 border-t-2 border-black space-y-2">
          <Link
            href={isDentist ? '/dentist/settings' : '/settings'}
            onClick={onClose}
            className={`w-full flex items-center gap-3 p-3 text-xs uppercase font-bold transition-all ${pathname === (isDentist ? '/dentist/settings' : '/settings')
                ? 'bg-black text-white'
                : 'hover:bg-gray-100'
              } ${userRole === 'individual' ? 'hidden' : ''}`}
          >
            <Settings size={18} />
            Practice
          </Link>
          <p className="text-[10px] font-bold uppercase text-muted-foreground text-left px-3">
            {userRole === 'individual' ? 'Individual Learner' : (isDentist ? 'Dentist Track' : 'Specialist Track')} / Prototype 1.5
          </p>
        </div>
      </div>
    </div>
  );
};

export const Header = ({ title, onMenuClick }: { title?: string, onMenuClick?: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const isDentist = pathname.startsWith('/dentist');
  const { userRole } = useVerification();
  const workspaceName = userRole === 'individual' ? 'My Account' : (isDentist ? 'Sunshine Dental' : 'Valley Endodontics');
  
  const [accountName, setAccountName] = React.useState(isDentist ? 'Dr. Taylor Reed, DDS' : 'Dr. John Doe, Endodontist');
  const [accountEmail, setAccountEmail] = React.useState(isDentist ? 'taylor@sunshine.dental' : 'john.doe@valleyendo.com');
  const [roleLabel, setRoleLabel] = React.useState(userRole === 'individual' ? 'Individual Learner' : (isDentist ? 'Practice Owner' : 'Practice Admin'));
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [initials, setInitials] = React.useState(isDentist ? 'TR' : 'JD');

  React.useEffect(() => {
    const loadProfile = () => {
      const stored = localStorage.getItem(isDentist ? 'drtalk_profile_dentist' : 'drtalk_profile_specialist');
      if (stored) {
        try {
          const profile = JSON.parse(stored);
          const name = profile.displayName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || (isDentist ? 'Dr. Taylor Reed, DDS' : 'Dr. John Doe, Endodontist');
          setAccountName(name);
          setAccountEmail(profile.email || (isDentist ? 'taylor@sunshine.dental' : 'john.doe@valleyendo.com'));
          setAvatarUrl(profile.avatarUrl || null);
          
          if (profile.jobTitle && profile.jobTitle !== 'Select job title') {
            setRoleLabel(profile.jobTitle);
          } else {
            setRoleLabel(userRole === 'individual' ? 'Individual Learner' : (isDentist ? 'Practice Owner' : 'Practice Admin'));
          }

          const first = profile.firstName || '';
          const last = profile.lastName || '';
          if (first || last) {
            setInitials(`${first[0] || ''}${last[0] || ''}`.toUpperCase() || '??');
          } else if (profile.displayName) {
            const parts = profile.displayName.split(' ');
            if (parts.length > 1) {
              setInitials(`${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase());
            } else {
              setInitials(profile.displayName.substring(0, 2).toUpperCase());
            }
          } else {
            setInitials(isDentist ? 'TR' : 'JD');
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setAccountName(isDentist ? 'Dr. Taylor Reed, DDS' : 'Dr. John Doe, Endodontist');
        setAccountEmail(isDentist ? 'taylor@sunshine.dental' : 'john.doe@valleyendo.com');
        setRoleLabel(userRole === 'individual' ? 'Individual Learner' : (isDentist ? 'Practice Owner' : 'Practice Admin'));
        setAvatarUrl(null);
        setInitials(isDentist ? 'TR' : 'JD');
      }
    };

    loadProfile();
    window.addEventListener('drtalk-profile-updated', loadProfile);
    return () => {
      window.removeEventListener('drtalk-profile-updated', loadProfile);
    };
  }, [isDentist, userRole]);

  return (
    <header className="h-16 border-b-2 border-black flex items-center justify-between px-4 sm:px-8 bg-white relative z-40">
      <div className="flex items-center gap-2 sm:gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 lg:hidden hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="flex flex-col -space-y-1">
          <h1 className="font-black uppercase tracking-tight text-sm">{workspaceName}</h1>
          {title && (
            <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">{title}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-6">


        <div
          className="flex items-center gap-3 cursor-pointer group relative"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold uppercase truncate">{accountName}</p>
            <p className="text-[8px] text-muted-foreground uppercase truncate">{roleLabel}</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center overflow-hidden text-xs font-bold group-hover:bg-black group-hover:text-white transition-all bg-white">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover filter grayscale" />
            ) : (
              initials
            )}
          </div>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-black border-dashed mb-2">
                <p className="text-[10px] font-bold uppercase">{accountName}</p>
                <p className="text-[8px] text-muted-foreground uppercase tracking-tighter">{accountEmail}</p>
              </div>
              {[
                { label: 'View Profile', href: isDentist ? '/dentist/settings/profile/user' : '/settings/profile/user' },
                { icon: Settings, label: isDentist ? 'Practice Profile' : 'Practice Settings', href: isDentist ? '/dentist/settings' : '/settings' },
                { label: 'Subscription', href: isDentist ? '/dentist/settings#subscription' : '/settings#subscription' },
                { label: 'Sign Out', href: '/', color: 'text-black' },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className={`block w-full text-left px-4 py-2 text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-all ${item.color || 'text-black'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

