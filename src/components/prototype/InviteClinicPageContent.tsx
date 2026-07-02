"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { UserPlus as UserPlusIcon, Mail as MailIcon, Phone as PhoneIcon, ArrowLeft } from 'lucide-react';

export function InviteClinicPageContent({ role }: { role: 'dentist' | 'specialist' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [practiceName, setPracticeName] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'sms'>('email');
  const [inviteText, setInviteText] = useState('');
  const [isInviteTextManuallyEdited, setIsInviteTextManuallyEdited] = useState(false);

  const getInviteDefaultText = (method: 'email' | 'sms', targetClinic: string) => {
    const target = targetClinic ? ` ${targetClinic}` : '';
    if (method === 'email') {
      return `Hi! We'd love to connect with your clinic${target} on drTalk to securely refer patients and collaborate. Join us here: https://drtalk.com/invite`;
    } else {
      return `Hi! Connect with us on drTalk${target} to securely refer patients. Sign up: https://drtalk.com/invite`;
    }
  };

  useEffect(() => {
    if (!isInviteTextManuallyEdited) {
      setInviteText(getInviteDefaultText(deliveryMethod, practiceName));
    }
  }, [deliveryMethod, practiceName, isInviteTextManuallyEdited]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contactInfo = deliveryMethod === 'email' ? email : phone;
    if (!contactInfo || !practiceName) return;

    // Build redirect path with toast parameter
    const basePath = role === 'dentist' ? '/dentist/network' : '/network';
    const message = `Invitation sent to ${practiceName || contactInfo}`;
    router.push(`${basePath}?tab=directory&toast=${encodeURIComponent(message)}`);
  };

  const basePath = role === 'dentist' ? '/dentist/network' : '/network';

  return (
    <MainLayout title="Invite Clinic">
      <div className="max-w-xl mx-auto space-y-6 pb-20 text-black">
        {/* Back Button */}
        <button
          onClick={() => router.push(`${basePath}?tab=directory`)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider hover:underline"
        >
          <ArrowLeft size={14} /> Back to Network
        </button>

        {/* Form Card */}
        <div className="bg-white border-4 border-black p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-black rounded-full flex items-center justify-center mx-auto bg-gray-50">
              <UserPlusIcon size={32} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
              Invite a Clinic
            </h2>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
              Invite a clinical partner to connect and refer on drTalk.
            </p>
          </div>

          {/* Delivery Method Tabs */}
          <div className="flex border-2 border-black divide-x-2 divide-black">
            <button
              type="button"
              onClick={() => setDeliveryMethod('email')}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${deliveryMethod === 'email' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
            >
              Email Invitation
            </button>
            <button
              type="button"
              onClick={() => setDeliveryMethod('sms')}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${deliveryMethod === 'sms' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
            >
              Text Message (SMS)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest block">
                Practice / Clinic Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                required
                value={practiceName}
                onChange={(e) => setPracticeName(e.target.value)}
                placeholder="e.g. Oakwood Family Dental"
                className="wireframe-input w-full py-4 px-4 text-sm bg-transparent border-2 border-black"
              />
            </div>

            {deliveryMethod === 'email' ? (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <MailIcon size={12} /> Contact Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="referrals@practice.com"
                  className="wireframe-input w-full py-4 px-4 text-sm bg-transparent border-2 border-black"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <PhoneIcon size={12} /> Contact Phone Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(602) 555-0199"
                  className="wireframe-input w-full py-4 px-4 text-sm bg-transparent border-2 border-black"
                />
              </div>
            )}

            {/* Editable preview text area */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest block">
                Invitation Message Preview
              </label>
              <textarea
                value={inviteText}
                onChange={(e) => {
                  setInviteText(e.target.value);
                  setIsInviteTextManuallyEdited(true);
                }}
                rows={4}
                className="wireframe-input w-full p-4 text-xs font-bold bg-transparent border-2 border-black resize-none focus:outline-none"
                placeholder="Type your message..."
              />
            </div>

            <div className="grid grid-cols-1 gap-3 pt-4">
              <button 
                type="submit"
                disabled={
                  (deliveryMethod === 'email' && !email) || 
                  (deliveryMethod === 'sms' && !phone) || 
                  !practiceName
                }
                className="wireframe-button bg-black text-white py-4 uppercase text-sm font-black tracking-widest disabled:opacity-30"
              >
                Send Invitation
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
