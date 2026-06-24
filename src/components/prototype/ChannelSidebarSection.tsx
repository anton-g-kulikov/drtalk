"use client";

import type { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

type ChannelSidebarSectionProps = {
  title: string;
  isCollapsed: boolean;
  unreadCount?: number;
  onToggle: () => void;
  action?: ReactNode;
  withTopBorder?: boolean;
  children: ReactNode;
};

export function ChannelSidebarSection({
  title,
  isCollapsed,
  unreadCount = 0,
  onToggle,
  action,
  withTopBorder = true,
  children,
}: ChannelSidebarSectionProps) {
  return (
    <div className={`p-4 space-y-3 ${withTopBorder ? 'border-t border-black border-dashed' : ''}`}>
      <div className="flex justify-between items-center">
        <button
          onClick={onToggle}
          className="flex items-center gap-1 hover:text-black text-muted-foreground transition-colors text-left"
        >
          {isCollapsed ? (
            <ChevronRight size={10} className="shrink-0" />
          ) : (
            <ChevronDown size={10} className="shrink-0" />
          )}
          <span className="text-[8px] font-black uppercase tracking-widest">{title}</span>
          {unreadCount > 0 && (
            <span className="bg-black text-white text-[7px] font-black px-1.5 rounded-full ml-1 shrink-0">
              {unreadCount}
            </span>
          )}
        </button>
        {action}
      </div>
      {!isCollapsed && children}
    </div>
  );
}
