"use client";

import React, { useState } from 'react';
import { MainLayout } from "@/components/MainLayout";
import { 
  GraduationCap, Star, 
  PlayCircle, Users, 
  Award, ArrowRight, PlusCircle 
} from 'lucide-react';

interface HubChannel {
  id: string;
  title: string;
  host: string;
  description: string;
  type: 'CE' | 'Mentorship' | 'Technology' | 'Study Group';
  price: 'Free' | string;
  rating: number;
  members: string;
}

const mockLearningHub: HubChannel[] = [
  { 
    id: '1', 
    title: 'Advanced Implantology', 
    host: 'Dr. Michael Pikos', 
    description: 'Master class on soft tissue grafting and complex implant cases.', 
    type: 'Mentorship', 
    price: '$49/mo', 
    rating: 5.0, 
    members: '1.2k' 
  },
  { 
    id: '2', 
    title: 'Digital Dentistry 101', 
    host: 'Medit Academy', 
    description: 'Scanning techniques, CAD/CAM workflows, and 3D printing integration.', 
    type: 'Technology', 
    price: 'Free', 
    rating: 4.8, 
    members: '3.4k' 
  },
  { 
    id: '3', 
    title: 'Ethics in Oral Surgery', 
    host: 'ADA Education', 
    description: 'Earn 2.0 CE credits while discussing recent case studies and ethical dilemmas.', 
    type: 'CE', 
    price: '$25', 
    rating: 4.9, 
    members: '850' 
  },
  { 
    id: '4', 
    title: 'Phoenix Endo Study Group', 
    host: 'Local Network', 
    description: 'Monthly virtual meetings to review challenging endodontic cases.', 
    type: 'Study Group', 
    price: 'Free', 
    rating: 4.7, 
    members: '42' 
  },
];

export default function LearningHubPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'ce' | 'mentorship' | 'tech'>('all');

  return (
    <MainLayout title="Learning Hub">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <div className="wireframe-card bg-black text-white p-6 sm:p-12 space-y-6 relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tighter italic leading-none">
              Grow and monetize your audience on Education channels.
            </h2>
            <p className="text-[10px] sm:text-xs uppercase leading-relaxed opacity-80 font-medium">
              Public materials are open to everyone. Any drTalk account can create resources, host a channel, or publish CE content.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-black px-8 py-3 text-[10px] font-black uppercase hover:bg-gray-200 transition-all w-full sm:w-auto">
                Create Resource
              </button>
              <button className="border-2 border-white px-8 py-3 text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all w-full sm:w-auto">
                Browse Public Materials
              </button>
            </div>
          </div>
          <GraduationCap size={200} className="absolute right-[-40px] sm:right-[-20px] bottom-[-60px] sm:bottom-[-40px] opacity-10 rotate-12" />
        </div>

        {/* Discovery Hub */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold uppercase tracking-tighter">Learning Channels</h3>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest italic">Shared by dentists, specialists, educators, and vendors</p>
            </div>
            <div className="flex border-2 border-black p-1 bg-white overflow-x-auto no-scrollbar">
              {['all', 'ce', 'mentorship', 'tech'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 sm:px-6 py-2 text-[9px] font-black uppercase transition-all whitespace-nowrap ${
                    activeTab === tab ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockLearningHub.map((channel) => (
              <div 
                key={channel.id} 
                className="wireframe-card group hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all bg-white flex flex-col md:flex-row"
              >
                <div className="w-full md:w-48 bg-gray-50 border-b-2 md:border-b-0 md:border-r-2 border-black flex items-center justify-center p-8">
                  {channel.type === 'CE' && <Award size={48} />}
                  {channel.type === 'Mentorship' && <Star size={48} />}
                  {channel.type === 'Technology' && <PlayCircle size={48} />}
                  {channel.type === 'Study Group' && <Users size={48} />}
                </div>
                
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black uppercase text-sm tracking-tight">{channel.title}</h4>
                        <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 border border-black bg-gray-50">
                          {channel.type}
                        </span>
                      </div>
                      <p className="text-[9px] font-bold uppercase text-muted-foreground">Hosted by {channel.host}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black uppercase tracking-tighter">{channel.price}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={10} className="fill-black" />
                        <span className="text-[8px] font-bold">{channel.rating}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] uppercase leading-relaxed font-medium opacity-80">
                    {channel.description}
                  </p>

                  <div className="pt-4 flex items-center justify-between border-t border-black border-dashed">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users size={12} />
                      <span className="text-[9px] font-bold uppercase">{channel.members} Enrolled</span>
                    </div>
                    <button className="text-[10px] font-black uppercase flex items-center gap-2 group-hover:underline">
                      Join Channel <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="wireframe-card p-8 bg-black text-white space-y-4">
            <PlusCircle size={24} />
            <h4 className="font-bold uppercase text-xs tracking-widest border-b border-white/40 pb-2">Create</h4>
            <p className="text-[10px] uppercase leading-relaxed font-medium text-white/75">
              Publish a resource, start a public channel, or build a paid learning product from any account role.
            </p>
            <button className="text-[9px] font-black uppercase underline">Start Resource</button>
          </div>
          <div className="wireframe-card p-8 bg-gray-50 space-y-4">
            <h4 className="font-bold uppercase text-xs tracking-widest border-b border-black pb-2">Mentorship</h4>
            <p className="text-[10px] uppercase leading-relaxed font-medium">
              Direct access to board-certified specialists for case reviews and clinical guidance.
            </p>
            <button className="text-[9px] font-black uppercase underline">View All Mentors</button>
          </div>
          <div className="wireframe-card p-8 bg-gray-50 space-y-4">
            <h4 className="font-bold uppercase text-xs tracking-widest border-b border-black pb-2">Vendors</h4>
            <p className="text-[10px] uppercase leading-relaxed font-medium">
              Latest technology updates, digital workflows, and instant support from equipment specialists.
            </p>
            <button className="text-[9px] font-black uppercase underline">Partner Directory</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
