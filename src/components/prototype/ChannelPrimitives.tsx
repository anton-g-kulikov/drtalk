"use client";

import { usePathname } from 'next/navigation';
import {
  AppWindow,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Hash,
  ImageIcon,
  Lock,
  Mail,
  Paperclip,
  Smartphone,
  Users,
} from 'lucide-react';
import type { Channel, SharedDocument } from '@/prototype/channelTypes';

type ChannelItemProps = {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
  isExpanded?: boolean;
  hasSubChannels?: boolean;
};

export function ChannelItem({
  channel,
  isActive,
  onClick,
  isExpanded,
  hasSubChannels
}: ChannelItemProps) {
  const pathname = usePathname();
  const isDentist = pathname.startsWith('/dentist');
  const displayName = (channel.id === '3' && !isDentist) ? 'Sunshine Dental' : channel.name;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-2 text-left transition-all group ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
    >
      <div className={`w-6 h-6 border flex items-center justify-center shrink-0 ${isActive ? 'border-white' : 'border-black'}`}>
        {channel.type === 'internal' && <Hash size={12} />}
        {channel.type === 'inter-practice' && <Users size={12} />}
        {channel.type === 'patient' && <Smartphone size={12} />}
        {channel.type === 'public' && <Lock size={12} />}
        {channel.type === 'group' && <Users size={12} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 min-w-0">
            {hasSubChannels && (
              <span className={`shrink-0 ${isActive ? 'text-white' : 'text-muted-foreground'}`}>
                {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              </span>
            )}
            <p className="text-[10px] font-bold uppercase truncate">{displayName}</p>
            {channel.isVerified === false && (
              <span
                className={`text-[6px] px-1 font-black uppercase whitespace-nowrap cursor-help ${isActive ? 'bg-white text-black' : 'bg-gray-200 text-black'}`}
                title="Practice owner isn't verified yet"
              >
                UNVERIFIED
              </span>
            )}
            {channel.isExternal && (
              <span
                className={`text-[6px] px-1 font-black uppercase whitespace-nowrap cursor-help ${isActive ? 'bg-white text-black' : 'bg-gray-200 text-black border border-black'}`}
                title="Practice is not on the platform; messages are delivered via secure email"
              >
                SECURE EMAIL
              </span>
            )}
          </div>
          {channel.unreadCount && !isActive && (
            <span className="bg-black text-white text-[8px] px-1 rounded-full">{channel.unreadCount}</span>
          )}
        </div>
        <p className={`text-[8px] truncate font-medium ${isActive ? 'text-gray-400' : 'text-muted-foreground'}`}>
          {channel.lastMessage}
        </p>
      </div>
    </button>
  );
}

type MessageProps = {
  user: string;
  text: string;
  time: string;
  type: 'self' | 'other';
  transport?: 'App' | 'SMS' | 'Email';
  document?: SharedDocument;
};

export function Message({
  user,
  text,
  time,
  type,
  transport,
  document
}: MessageProps) {
  const isSelf = type === 'self';

  return (
    <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} space-y-1`}>
      <div className="flex items-center gap-2">
        {!isSelf && <span className="text-[9px] font-black uppercase tracking-tighter">{user}</span>}
        <span className="text-[8px] text-muted-foreground uppercase font-bold">{time}</span>
        {isSelf && <span className="text-[9px] font-black uppercase tracking-tighter">You</span>}
      </div>
      <div className={`max-w-md wireframe-card p-3 text-xs leading-snug shadow-sm ${isSelf ? 'bg-black text-white' : 'bg-white text-black'}`}>
        {text && <div className="whitespace-pre-wrap">{text}</div>}

        {document && (
          <div className={`mt-3 p-3 border-2 flex items-center justify-between gap-4 transition-all ${isSelf ? 'border-white bg-black text-white' : 'border-black bg-white text-black'}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 border-2 flex items-center justify-center shrink-0 ${isSelf ? 'border-white' : 'border-black'}`}>
                {document.type === 'pdf' ? <FileText size={16} /> :
                  document.type === 'image' ? <ImageIcon size={16} /> :
                    <Paperclip size={16} />}
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase truncate">{document.name}</p>
                <p className="text-[7px] uppercase font-bold opacity-60 mt-0.5">{document.size}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  alert(`Downloading: ${document.name}`);
                }}
                className={`text-[8px] font-black uppercase tracking-wider px-2.5 py-1.5 border-2 transition-all flex items-center gap-1 font-bold ${
                  isSelf
                    ? 'border-white bg-white text-black hover:bg-black hover:text-white'
                    : 'border-black bg-black text-white hover:bg-white hover:text-black'
                }`}
                title={`Download ${document.name}`}
              >
                <Download size={10} /> Download
              </button>
            </div>
          </div>
        )}

        {transport && (
          <div className={`mt-2 pt-2 border-t border-dashed flex items-center gap-1 opacity-50 ${isSelf ? 'border-white/30' : 'border-black/30'}`}>
            {transport === 'App' && <AppWindow size={10} />}
            {transport === 'SMS' && <Smartphone size={10} />}
            {transport === 'Email' && <Mail size={10} />}
            <span className="text-[7px] font-bold uppercase">Sent via {transport}</span>
          </div>
        )}
      </div>
    </div>
  );
}
