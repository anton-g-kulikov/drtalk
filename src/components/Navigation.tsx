'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, MessageSquare, Settings, GraduationCap } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Referrals', href: '/referrals' },
    { icon: MessageSquare, label: 'Channels', href: '/channels' },
    { icon: GraduationCap, label: 'Academy', href: '/academy' },
    { icon: Users, label: 'Network', href: '/network' },
  ];

  const pathname = usePathname();

  return (
    <div className="w-64 h-full border-r-2 border-black flex flex-col">
      <div className="h-16 border-b-2 border-black flex items-center px-6">
        <h2 className="font-bold text-xl uppercase tracking-tighter italic">drTalk</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.filter(item => item.label !== 'Academy').map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
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

        {/* Academy Section */}
        {navItems.filter(item => item.label === 'Academy').map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
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
      <div className="p-4 border-t-2 border-black space-y-4">
        <Link
          href="/settings"
          className={`w-full flex items-center gap-3 p-3 text-xs uppercase font-bold transition-all ${
            pathname === '/settings' 
              ? 'bg-black text-white' 
              : 'hover:bg-gray-100'
          }`}
        >
          <Settings size={18} />
          Settings
        </Link>
        <p className="text-[10px] font-bold uppercase text-muted-foreground text-left px-3">Version 1.0.0</p>
      </div>
    </div>
  );
};

export const Header = ({ title }: { title?: string }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="h-16 border-b-2 border-black flex items-center justify-between px-8 bg-white relative z-40">
      <div className="flex items-center gap-4">
        <div className="flex flex-col -space-y-1">
          <h1 className="font-black uppercase tracking-tight text-sm">Sunshine Dental Practice</h1>
          {title && (
            <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">{title}</p>
          )}
        </div>
        <div className="bg-black text-white text-[10px] px-2 py-0.5 font-bold uppercase">Verified</div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex gap-4 border-r-2 border-black pr-6 mr-2">
          <div className="text-[10px] font-bold uppercase text-muted-foreground cursor-pointer hover:text-black transition-colors">Support</div>
          <div className="text-[10px] font-bold uppercase text-muted-foreground cursor-pointer hover:text-black transition-colors">Docs</div>
        </div>
        
        <div 
          className="flex items-center gap-3 cursor-pointer group relative"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold uppercase truncate">John Doe, DDS</p>
            <p className="text-[8px] text-muted-foreground uppercase truncate">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold group-hover:bg-black group-hover:text-white transition-all">
            JD
          </div>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-black border-dashed mb-2">
                <p className="text-[10px] font-bold uppercase">John Doe, DDS</p>
                <p className="text-[8px] text-muted-foreground uppercase tracking-tighter">john.doe@sunshine.dental</p>
              </div>
              {[
                { label: 'View Profile', href: '/settings' },
                { icon: Settings, label: 'Practice Settings', href: '/settings' },
                { label: 'Billing & Usage', href: '/settings' },
                { label: 'Sign Out', href: '/', color: 'text-red-600' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => window.location.href = item.href}
                  className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-all ${item.color || 'text-black'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
