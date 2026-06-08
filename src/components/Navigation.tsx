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
      { icon: FileText, label: 'Referrals', href: '/dentist/referrals' },
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
    <div className={`w-64 h-full border-r-2 border-black flex flex-col bg-white ${onClose ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex'}`}>
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
          {/* Commented out Trial widget and subscription options from debug menu for Dentist profile */}
          {/* 
          <button
            onClick={endTrial}
            className="w-full text-left px-3 py-1.5 text-[9px] font-bold uppercase hover:bg-black hover:text-white transition-all border border-transparent hover:border-black"
          >
            End Trial
          </button>
          <button
            onClick={resetSubscription}
            className="w-full text-left px-3 py-1.5 text-[9px] font-bold uppercase hover:bg-black hover:text-white transition-all border border-transparent hover:border-black"
          >
            Reset Subscription
          </button>
          */}
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
          {userRole === 'individual' ? 'Individual Learner' : (isDentist ? 'Dentist Track' : 'Specialist Track')} / Prototype 1.1
        </p>
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
  const accountName = isDentist ? 'Dr. Taylor Reed, DDS' : 'Dr. John Doe, Endodontist';
  const accountEmail = isDentist ? 'taylor@sunshine.dental' : 'john.doe@valleyendo.com';
  const roleLabel = userRole === 'individual' ? 'Individual Learner' : (isDentist ? 'Practice Owner' : 'Practice Admin');

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
        <div className="hidden md:flex gap-4 border-r-2 border-black pr-6 mr-2">
          <div className="text-[10px] font-bold uppercase text-muted-foreground cursor-pointer hover:text-black transition-colors">Support</div>
        </div>

        <div
          className="flex items-center gap-3 cursor-pointer group relative"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold uppercase truncate">{accountName}</p>
            <p className="text-[8px] text-muted-foreground uppercase truncate">{roleLabel}</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold group-hover:bg-black group-hover:text-white transition-all">
            {isDentist ? 'TR' : 'JD'}
          </div>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-black border-dashed mb-2">
                <p className="text-[10px] font-bold uppercase">{accountName}</p>
                <p className="text-[8px] text-muted-foreground uppercase tracking-tighter">{accountEmail}</p>
              </div>
              {[
                { label: 'View Profile', href: isDentist ? '/dentist/settings' : '/settings' },
                { icon: Settings, label: isDentist ? 'Practice Profile' : 'Practice Settings', href: isDentist ? '/dentist/settings' : '/settings' },
                { label: 'Billing & Usage', href: isDentist ? '/dentist/settings#billing' : '/settings#billing' },
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

