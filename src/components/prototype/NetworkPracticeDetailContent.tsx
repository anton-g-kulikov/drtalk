'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Globe, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { MainLayout } from '@/components/MainLayout';
import { getNetwork, saveNetwork, type NetworkPractice } from '@/lib/referrals';

type NetworkPracticeDetailContentProps = {
  practiceId: string;
  role: 'dentist' | 'specialist';
  onBack: () => void;
};

export function NetworkPracticeDetailContent({
  practiceId,
  role,
  onBack,
}: NetworkPracticeDetailContentProps) {
  const router = useRouter();
  const [practice, setPractice] = useState<NetworkPractice | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const list = getNetwork();
    const found = list.find((p) => p.id === practiceId);
    if (found) {
      setPractice(found);
    }
  }, [practiceId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleConnect = () => {
    if (!practice) return;
    const list = getNetwork();
    const updated = list.map((p) => {
      if (p.id === practice.id) {
        return { ...p, status: 'Connected' as const };
      }
      return p;
    });
    saveNetwork(updated);
    setPractice({ ...practice, status: 'Connected' });
    showToast(`Connection request accepted! Channel created with ${practice.name}`);
  };

  const handleDentistPrimaryAction = () => {
    if (!practice) return;
    if (practice.status === 'Connected') {
      router.push(`/dentist/referral?practice=${encodeURIComponent(practice.name)}`);
      return;
    }
    handleConnect();
  };

  if (!practice) {
    return (
      <MainLayout title="Practice Profile">
        <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
          <p className="text-sm font-black uppercase text-zinc-500">Practice not found</p>
          <button onClick={onBack} className="text-[10px] font-black uppercase underline hover:text-black">
            Go Back
          </button>
        </div>
      </MainLayout>
    );
  }

  const isConnected = practice.status === 'Connected';
  const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(practice.location + ' ' + practice.name)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <MainLayout title={`${practice.name} - Profile`}>
      <div className="max-w-5xl mx-auto space-y-6 text-black">
        {/* Back button */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase text-black hover:text-zinc-600 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Network
          </button>
          <span className="text-[8px] font-black uppercase px-2.5 py-1 bg-black text-white border-2 border-black tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {practice.type} Profile
          </span>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left info column */}
          <div className="md:col-span-7 space-y-6">
            <div className="wireframe-card p-8 bg-white space-y-6">
              <div className="flex items-start gap-4 justify-between border-b-2 border-black pb-6">
                <div className="space-y-3">
                  <div className="w-16 h-16 border-4 border-black flex items-center justify-center bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Building2 size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black uppercase tracking-tight leading-none">{practice.name}</h2>
                      {practice.verified && <ShieldCheck size={20} className="text-black shrink-0" />}
                    </div>
                    <p className="text-xs font-black uppercase text-zinc-500 mt-1">{practice.specialty}</p>
                  </div>
                </div>

                <span className={`text-[8px] font-black uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isConnected ? 'bg-black text-white' : 'bg-transparent text-black'}`}>
                  {practice.status}
                </span>
              </div>

              {/* Detail fields */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-black shrink-0" />
                  <div>
                    <p className="text-[8px] font-black uppercase text-zinc-400">Address / Location</p>
                    <p className="text-xs font-bold uppercase">{practice.location}</p>
                  </div>
                </div>

                {practice.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-black shrink-0" />
                    <div>
                      <p className="text-[8px] font-black uppercase text-zinc-400">Telephone</p>
                      <p className="text-xs font-bold uppercase">{practice.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-black shrink-0" />
                  <div>
                    <p className="text-[8px] font-black uppercase text-zinc-400">Website</p>
                    <a
                      href={`https://www.${practice.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold lowercase hover:underline break-all text-black"
                    >
                      www.{practice.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t-2 border-black pt-6 flex flex-col sm:flex-row gap-3">
                {role === 'dentist' ? (
                  isConnected ? (
                    <>
                      <button
                        onClick={handleDentistPrimaryAction}
                        className="flex-1 wireframe-button bg-black text-white text-[10px] uppercase py-3 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        Send Referral
                      </button>
                      <button
                        onClick={() => router.push(`/dentist/channels?practice=${encodeURIComponent(practice.name)}`)}
                        className="flex-1 wireframe-button bg-white text-black text-[10px] uppercase py-3 flex items-center justify-center gap-2 hover:bg-zinc-50 border-2 border-black transition-all font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <MessageCircle size={14} />
                        {practice.isExternal ? 'Send Secure Message' : 'Chat Now'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleConnect}
                      className="flex-1 wireframe-button bg-black text-white text-[10px] uppercase py-3 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Connect
                    </button>
                  )
                ) : (
                  isConnected ? (
                    <button
                      onClick={() => router.push(`/channels?practice=${encodeURIComponent(practice.name)}`)}
                      className="flex-1 wireframe-button bg-black text-white text-[10px] uppercase py-3 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <MessageCircle size={14} />
                      {practice.isExternal ? 'Send Secure Message' : 'Chat Now'}
                    </button>
                  ) : (
                    <button
                      onClick={handleConnect}
                      className="flex-1 wireframe-button bg-black text-white text-[10px] uppercase py-3 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      Connect
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Map column */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-black">Location Map</h4>
            <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden aspect-square w-full relative">
              <iframe
                title="Practice Location Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={mapsUrl}
              />
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-black text-white border-2 border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-300">
          <p className="text-[10px] font-black uppercase tracking-tight">{toastMessage}</p>
        </div>
      )}
    </MainLayout>
  );
}
