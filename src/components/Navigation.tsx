'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, GraduationCap, LayoutDashboard, MessageSquare, Settings, Users, Menu, X } from 'lucide-react';

export const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname();
  const isDentist = pathname.startsWith('/dentist');
  const navItems = isDentist
    ? [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dentist/dashboard' },
        { icon: FileText, label: 'Referrals', href: '/dentist/referrals' },
        { icon: MessageSquare, label: 'Channels', href: '/dentist/channels' },
        { icon: GraduationCap, label: 'Learning Hub', href: '/dentist/academy' },
      ]
    : [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: FileText, label: 'Referrals', href: '/referrals' },
        { icon: MessageSquare, label: 'Channels', href: '/channels' },
        { icon: GraduationCap, label: 'Learning Hub', href: '/academy' },
        { icon: Users, label: 'Network', href: '/network' },
      ];

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
        {navItems.filter(item => item.label !== 'Learning Hub').map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`w-full flex items-center gap-3 p-3 text-xs uppercase font-bold transition-all ${
                isActive 
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
        {navItems.filter(item => item.label === 'Learning Hub').map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`w-full flex items-center gap-3 p-3 text-xs uppercase font-bold transition-all ${
                isActive 
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
      <div className="p-4 border-t-2 border-black space-y-2">
        <Link
          href={isDentist ? '/dentist/settings' : '/settings'}
          onClick={onClose}
          className={`w-full flex items-center gap-3 p-3 text-xs uppercase font-bold transition-all ${
            pathname === (isDentist ? '/dentist/settings' : '/settings')
              ? 'bg-black text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          <Settings size={18} />
          Practice
        </Link>
        <p className="text-[10px] font-bold uppercase text-muted-foreground text-left px-3">
          {isDentist ? 'Dentist Track' : 'Specialist Track'} / Prototype 1.1
        </p>
      </div>
    </div>
  );
};

export const Header = ({ title, onMenuClick }: { title?: string, onMenuClick?: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const isDentist = pathname.startsWith('/dentist');
  const workspaceName = isDentist ? 'Sunshine Dental' : 'Valley Endodontics';
  const accountName = isDentist ? 'Dr. Taylor Reed, DDS' : 'Dr. John Doe, Endodontist';
  const accountEmail = isDentist ? 'taylor@sunshine.dental' : 'john.doe@valleyendo.com';
  const roleLabel = isDentist ? 'Dentist Account' : 'Practice Admin';
  const statusLabel = isDentist ? 'Dentist Practice' : 'Specialist Practice';

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
        <div className="bg-black text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 font-bold uppercase shrink-0">
          {statusLabel}
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden md:flex gap-4 border-r-2 border-black pr-6 mr-2">
          <div className="text-[10px] font-bold uppercase text-muted-foreground cursor-pointer hover:text-black transition-colors">Support</div>
          <div className="text-[10px] font-bold uppercase text-muted-foreground cursor-pointer hover:text-black transition-colors">Docs</div>
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
                ...(!isDentist ? [{ label: 'Billing & Usage', href: '/settings' }] : []),
                { label: 'Sign Out', href: '/', color: 'text-red-600' },
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
