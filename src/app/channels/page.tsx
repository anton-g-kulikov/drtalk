"use client";

import React, { useState } from 'react';
import { MainLayout } from "@/components/MainLayout";
import {
  Search, Hash, Lock, Users, Send,
  Paperclip, Smile, MoreHorizontal,
  Smartphone, Mail, AppWindow
} from 'lucide-react';

type ChannelType = 'internal' | 'inter-practice' | 'patient' | 'public';

interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  lastMessage: string;
  unreadCount?: number;
  memberCount: number;
}

const mockChannels: Channel[] = [
  { id: '1', name: 'clinical-team', type: 'internal', lastMessage: 'Reviewing tooth #14...', unreadCount: 2, memberCount: 12 },
  { id: '2', name: 'admin-billing', type: 'internal', lastMessage: 'March report ready.', memberCount: 4 },
  { id: '3', name: 'Dr. Jones (Specialist)', type: 'inter-practice', lastMessage: 'Referral accepted.', memberCount: 2 },
  { id: '4', name: 'Alice Cooper', type: 'patient', lastMessage: 'Appointment confirmed.', memberCount: 2 },
  { id: '5', name: 'general-updates', type: 'public', lastMessage: 'Welcome to the network!', memberCount: 124 },
];

export default function ChannelsPage() {
  const [activeChannel, setActiveChannel] = useState(mockChannels[0]);
  const [showChannelList, setShowChannelList] = useState(false);

  return (
    <MainLayout title="Channels" noPadding>
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="flex-1 flex overflow-hidden">

          {/* Channels List Sidebar */}
          <div className={`${showChannelList ? 'fixed inset-0 z-50' : 'hidden'} lg:relative lg:flex lg:w-80 border-r-2 border-black flex-col bg-white overflow-hidden`}>
            {showChannelList && (
              <button 
                onClick={() => setShowChannelList(false)}
                className="absolute right-4 top-4 p-2 lg:hidden z-10"
              >
                <MoreHorizontal size={24} className="rotate-90" />
              </button>
            )}
            <div className="p-4 border-b-2 border-black space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-tighter italic">Channels</h2>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="SEARCH CONVERSATIONS..."
                  className="wireframe-input pl-10 py-1.5 text-[10px]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Internal */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Internal Channels</p>
                  <button className="text-[8px] font-black uppercase underline hover:text-black">Create +</button>
                </div>
                <div className="space-y-1">
                  {mockChannels.filter(c => c.type === 'internal').map(c => (
                    <ChannelItem 
                      key={c.id} 
                      channel={c} 
                      isActive={activeChannel.id === c.id} 
                      onClick={() => {
                        setActiveChannel(c);
                        setShowChannelList(false);
                      }} 
                    />
                  ))}
                </div>
              </div>

              {/* Inter-practice */}
              <div className="p-4 border-t border-black border-dashed space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Connected Practices</p>
                  <button className="text-[8px] font-black uppercase underline hover:text-black">Connect</button>
                </div>
                <div className="space-y-1">
                  {mockChannels.filter(c => c.type === 'inter-practice').map(c => (
                    <ChannelItem 
                      key={c.id} 
                      channel={c} 
                      isActive={activeChannel.id === c.id} 
                      onClick={() => {
                        setActiveChannel(c);
                        setShowChannelList(false);
                      }} 
                    />
                  ))}
                </div>
              </div>

              {/* Patient */}
              <div className="p-4 border-t border-black border-dashed space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Patient Comm (SMS/Email)</p>
                </div>

                {/* Tip for Patient Channels */}
                <div className="p-3 bg-gray-50 border border-black border-dashed">
                  <p className="text-[7px] font-bold uppercase leading-relaxed text-muted-foreground italic">
                    Tip: Patient channels are automatically created once you process a referral and initiate external communication.
                  </p>
                </div>

                <div className="space-y-1">
                  {mockChannels.filter(c => c.type === 'patient').map(c => (
                    <ChannelItem 
                      key={c.id} 
                      channel={c} 
                      isActive={activeChannel.id === c.id} 
                      onClick={() => {
                        setActiveChannel(c);
                        setShowChannelList(false);
                      }} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {/* Chat Header */}
            <div className="h-16 bg-white border-b-2 border-black flex items-center justify-between px-4 sm:px-6 shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowChannelList(true)}
                  className="p-2 -ml-2 lg:hidden hover:bg-gray-100 transition-colors"
                >
                  <Hash size={20} />
                </button>
                <div className="w-8 h-8 border-2 border-black flex items-center justify-center shrink-0">
                  {activeChannel.type === 'internal' ? <Hash size={16} /> : <Users size={16} />}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold uppercase text-xs truncate">{activeChannel.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    <span className="text-[8px] text-muted-foreground uppercase font-bold">{activeChannel.memberCount} Members</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <button className="hidden sm:block text-[10px] font-bold uppercase underline">Participants</button>
                <button className="p-1 hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-all">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
              <Message
                user="Dr. Smith"
                text="Just finished the X-rays for Alice. Sending them over to the clinical-team channel now."
                time="10:24 AM"
                type="other"
              />
              <div className="flex justify-center">
                <span className="text-[8px] font-bold uppercase bg-gray-200 px-3 py-1 text-muted-foreground">Today</span>
              </div>
              <Message
                user="Me"
                text="Received. Looking at tooth #14 now. Looks like a clear case for retreatment."
                time="11:05 AM"
                type="self"
                transport="App"
              />
              <Message
                user="Alice Cooper"
                text="Is there any prep I need to do before my appointment?"
                time="11:15 AM"
                type="other"
                transport="SMS"
              />
              <Message
                user="Me"
                text="Just avoid eating 2 hours before the procedure. We will send a formal prep guide to your email shortly."
                time="11:20 AM"
                type="self"
                transport="Email"
              />
            </div>

            {/* Message Input */}
            <div className="p-4 sm:p-6 bg-white border-t-2 border-black">
              <div className="wireframe-card p-4 space-y-4">
                <textarea
                  placeholder={`MESSAGE #${activeChannel.name}...`}
                  className="w-full bg-transparent border-none focus:ring-0 text-xs uppercase resize-none h-12"
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-black border-dashed">
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <button className="hover:text-black transition-colors"><Paperclip size={18} /></button>
                    <button className="hover:text-black transition-colors"><Smile size={18} /></button>

                    {activeChannel.type === 'patient' ? (
                      <>
                        <div className="h-4 w-[1px] bg-black/20 mx-1" />
                        <div className="flex items-center gap-3">
                          <span className="text-[8px] font-black uppercase text-black">Delivery Method:</span>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer group">
                              <input type="radio" name="transport" defaultChecked className="hidden peer" />
                              <div className="w-3 h-3 border border-black flex items-center justify-center peer-checked:bg-black transition-all">
                                <div className="w-1 h-1 bg-white" />
                              </div>
                              <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 peer-checked:opacity-100">
                                <span className="text-[8px] font-black uppercase">Both (App + SMS)</span>
                              </div>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer group">
                              <input type="radio" name="transport" className="hidden peer" />
                              <div className="w-3 h-3 border border-black flex items-center justify-center peer-checked:bg-black transition-all">
                                <div className="w-1 h-1 bg-white" />
                              </div>
                              <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 peer-checked:opacity-100">
                                <span className="text-[8px] font-black uppercase">SMS</span>
                              </div>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer group">
                              <input type="radio" name="transport" className="hidden peer" />
                              <div className="w-3 h-3 border border-black flex items-center justify-center peer-checked:bg-black transition-all">
                                <div className="w-1 h-1 bg-white" />
                              </div>
                              <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 peer-checked:opacity-100">
                                <span className="text-[8px] font-black uppercase">Email</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-4 w-[1px] bg-black/20 mx-1" />
                        <div className="flex items-center gap-2">
                          <Lock size={12} className="text-black" />
                          <span className="text-[8px] font-bold uppercase text-black">Secure Internal Transmission</span>
                        </div>
                      </>
                    )}
                  </div>
                  <button className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-2 flex items-center justify-center gap-2 w-full sm:w-auto">
                    Send Message <Send size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function ChannelItem({ channel, isActive, onClick }: { channel: Channel, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-2 text-left transition-all group ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100'
        }`}
    >
      <div className={`w-6 h-6 border flex items-center justify-center shrink-0 ${isActive ? 'border-white' : 'border-black'}`}>
        {channel.type === 'internal' && <Hash size={12} />}
        {channel.type === 'inter-practice' && <Users size={12} />}
        {channel.type === 'patient' && <Smartphone size={12} />}
        {channel.type === 'public' && <Lock size={12} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <p className="text-[10px] font-bold uppercase truncate">{channel.name}</p>
          {channel.unreadCount && !isActive && (
            <span className="bg-black text-white text-[8px] px-1 rounded-full">{channel.unreadCount}</span>
          )}
        </div>
        <p className={`text-[8px] truncate uppercase font-medium ${isActive ? 'text-gray-400' : 'text-muted-foreground'}`}>
          {channel.lastMessage}
        </p>
      </div>
    </button>
  );
}

function Message({ user, text, time, type, transport }: { user: string, text: string, time: string, type: 'self' | 'other', transport?: 'App' | 'SMS' | 'Email' }) {
  const isSelf = type === 'self';

  return (
    <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} space-y-1`}>
      <div className="flex items-center gap-2">
        {!isSelf && <span className="text-[9px] font-black uppercase tracking-tighter">{user}</span>}
        <span className="text-[8px] text-muted-foreground uppercase font-bold">{time}</span>
        {isSelf && <span className="text-[9px] font-black uppercase tracking-tighter">You</span>}
      </div>
      <div className={`max-w-md wireframe-card p-3 text-xs uppercase leading-snug shadow-sm ${isSelf ? 'bg-black text-white' : 'bg-white text-black'
        }`}>
        {text}
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
