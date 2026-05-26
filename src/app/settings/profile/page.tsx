"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft, User, Copy, Check, Info, Mail, Phone, Globe, Edit2, Lock } from 'lucide-react';
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { useSubscription } from '@/components/SubscriptionContext';

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const isDentist = pathname.includes('/dentist');
  const { plan, setShowPaywall } = useSubscription();
  const hasProAccess = plan === 'Pro' || plan === 'BusinessPlus';

  // Form states initialized with realistic values
  const [practiceName, setPracticeName] = useState(isDentist ? "Valley Dental Care" : "Valley Endodontics");
  const [practiceType, setPracticeType] = useState(isDentist ? "Dentist" : "Endodontist");
  const [city, setCity] = useState("Beverly Hills");
  const [selectedState, setSelectedState] = useState("CA");
  const [zipCode, setZipCode] = useState("90210");
  const [fullAddress, setFullAddress] = useState("123 Dental Way, Ste 100");
  const [phone, setPhone] = useState("(310) 555-0199");

  // Predefined/Read-only system fields
  const inboxEmail = "referrals@valleydental.drtalk.com";
  const efaxNumber = "+1 (310) 555-0155";
  const publicUrl = "https://drtalk.com/valleydental/submit";

  // Notification / Toast states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCopy = (value: string, fieldName: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(fieldName);
    showToast(`${fieldName} copied to clipboard!`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Practice Profile changes saved successfully.");
  };

  const practiceTypes = [
    'Dentist',
    'Dental Laboratory',
    'Dental Radiology',
    'Endodontist',
    'Oral & Maxillofacial Surgeon',
    'Orthodontist',
    'Pediatric Dentist',
    'Periodontist',
    'Prosthodontist',
    'Oral Pathologist',
    'Dental Anaesthesiology',
    'Dental Partner'
  ];

  return (
    <MainLayout title="Practice Profile">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

        {/* Navigation & Header */}
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-colors w-fit px-2 py-1 border-2 border-transparent hover:border-black"
          >
            <ArrowLeft size={14} />
            Back to Settings
          </button>

          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter text-black italic">
              Practice Profile
            </h2>
            <CommentMarker
              id="settings-profile-marker"
              title="Practice Profile Settings"
              description="Manage practice profile information, address, and copy predefined system intake channels."
            />
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            Correct practice details and manage your secure referral integration channels
          </p>
        </div>

        <div className="space-y-8">

          {/* System Predefined / Copyable Channels Card */}
          {!isDentist && (
            <div className="wireframe-card p-6 space-y-6 bg-gray-50 w-full">
              <div className="flex items-center gap-3 border-b-2 border-black pb-4">
                <Info size={20} />
                <div>
                  <h3 className="font-bold uppercase tracking-tight text-sm">System Channels</h3>
                  <p className="text-[9px] text-muted-foreground uppercase">Referral intake credentials</p>
                </div>
              </div>

              <div className="space-y-6 divide-y-2 divide-black divide-dashed">
                
                {/* Inbox Email */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center pb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Mail size={14} className="shrink-0" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Inbox Email</span>
                    </div>
                    <span className="inline-block text-[8px] font-bold text-gray-500 uppercase tracking-widest bg-gray-200 px-1.5 py-0.5 rounded">Automatic Intake</span>
                  </div>
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between gap-4 py-1">
                      <span className="text-sm font-mono font-bold select-all text-black break-all pb-0.5 border-b border-black">
                        {inboxEmail}
                      </span>
                      <button 
                        type="button"
                        onClick={() => handleCopy(inboxEmail, "Inbox Email")}
                        className="wireframe-button text-[9px] uppercase tracking-widest px-3 py-1.5 flex items-center gap-1 shrink-0 bg-white"
                        title="Copy Inbox Email"
                      >
                        {copiedField === "Inbox Email" ? <Check size={12} className="text-green-600 animate-pulse" /> : <Copy size={12} />}
                        <span>{copiedField === "Inbox Email" ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground leading-normal">
                      Faxes and emails forwarded here convert to secure digital referrals automatically.
                    </p>
                  </div>
                </div>

                {/* eFax Number */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center pt-6 pb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} className="shrink-0" />
                      <span className="text-[10px] font-black uppercase tracking-widest">eFax Number</span>
                    </div>
                    <span className="inline-block text-[8px] font-bold text-gray-500 uppercase tracking-widest bg-gray-200 px-1.5 py-0.5 rounded">
                      {hasProAccess ? 'Predefined' : '🔒 Pro Feature'}
                    </span>
                  </div>
                  <div className="lg:col-span-2 space-y-3">
                    {hasProAccess ? (
                      <div className="flex items-center justify-between gap-4 py-1">
                        <span className="text-sm font-mono font-bold select-all text-black break-all pb-0.5 border-b border-black">
                          {efaxNumber}
                        </span>
                        <button 
                          type="button"
                          onClick={() => handleCopy(efaxNumber, "eFax Number")}
                          className="wireframe-button text-[9px] uppercase tracking-widest px-3 py-1.5 flex items-center gap-1 shrink-0 bg-white"
                          title="Copy eFax Number"
                        >
                          {copiedField === "eFax Number" ? <Check size={12} className="text-green-600 animate-pulse" /> : <Copy size={12} />}
                          <span>{copiedField === "eFax Number" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4 py-1">
                        <span className="text-sm font-mono font-bold text-gray-400 select-none blur-[2px] overflow-hidden whitespace-nowrap">
                          +1 (310) 555-XXXX
                        </span>
                        <button 
                          type="button"
                          onClick={() => setShowPaywall(true)}
                          className="wireframe-button text-[9px] uppercase tracking-widest px-3 py-1.5 flex items-center gap-1 shrink-0 bg-black text-white hover:bg-white hover:text-black border-2 border-black"
                          title="Upgrade to Pro to unlock eFax"
                        >
                          <Lock size={12} />
                          <span>Upgrade</span>
                        </button>
                      </div>
                    )}
                    <p className="text-[9px] uppercase font-bold text-muted-foreground leading-normal">
                      Give this dedicated eFax line to non-drTalk practices to receive direct digital integrations.
                    </p>
                  </div>
                </div>

                {/* Public URL */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center pt-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Globe size={14} className="shrink-0" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Public Referral Link</span>
                    </div>
                    <span className="inline-block text-[8px] font-bold text-gray-500 uppercase tracking-widest bg-gray-200 px-1.5 py-0.5 rounded">Active</span>
                  </div>
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between gap-4 py-1">
                      <span className="text-sm font-mono font-bold select-all text-black break-all pb-0.5 border-b border-black">
                        {publicUrl}
                      </span>
                      <button 
                        type="button"
                        onClick={() => handleCopy(publicUrl, "Public Referral Link")}
                        className="wireframe-button text-[9px] uppercase tracking-widest px-3 py-1.5 flex items-center gap-1 shrink-0 bg-white"
                        title="Copy Public URL"
                      >
                        {copiedField === "Public Referral Link" ? <Check size={12} className="text-green-600 animate-pulse" /> : <Copy size={12} />}
                        <span>{copiedField === "Public Referral Link" ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground leading-normal">
                      Embed this link on your public website so referring practices can submit securely without an account.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Main Edit Form */}
          <form onSubmit={handleSave} className="wireframe-card p-6 space-y-6 w-full">
            <div className="flex items-center gap-3 border-b-2 border-black pb-4">
              <User size={20} />
              <div>
                <h3 className="font-bold uppercase tracking-tight text-sm">Practice Details</h3>
                <p className="text-[9px] text-muted-foreground uppercase">Update the general profile information for your office</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column Fields */}
              <div className="space-y-4">
                {/* Practice Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest">Practice Name</label>
                  <input
                    type="text"
                    value={practiceName}
                    onChange={(e) => setPracticeName(e.target.value)}
                    className="wireframe-input py-3 px-4 text-sm font-bold border-2 border-black hover:border-black focus:bg-black focus:text-white transition-colors"
                  />
                </div>

                {/* Practice Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest">Practice Type</label>
                  <div className="relative">
                    <select
                      value={practiceType}
                      onChange={(e) => setPracticeType(e.target.value)}
                      className="wireframe-input appearance-none bg-transparent py-3 px-4 text-sm font-bold border-2 border-black pr-10 focus:bg-black focus:text-white"
                    >
                      {practiceTypes.map(type => (
                        <option key={type} className="text-black bg-white" value={type}>{type}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="wireframe-input py-3 px-4 text-sm font-bold border-2 border-black hover:border-black focus:bg-black focus:text-white transition-colors"
                  />
                </div>
              </div>

              {/* Right Column Fields */}
              <div className="space-y-4">
                {/* City & State Row */}
                <div className="grid grid-cols-[1fr_120px] gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="wireframe-input py-3 px-4 text-sm font-bold border-2 border-black hover:border-black focus:bg-black focus:text-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest">State</label>
                    <div className="relative">
                      <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="wireframe-input appearance-none bg-transparent py-3 px-4 text-sm font-bold border-2 border-black pr-10 focus:bg-black focus:text-white"
                      >
                        <option className="text-black bg-white">CA</option>
                        <option className="text-black bg-white">NY</option>
                        <option className="text-black bg-white">TX</option>
                        <option className="text-black bg-white">FL</option>
                        <option className="text-black bg-white">WA</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address & ZIP Row */}
                <div className="grid grid-cols-[1fr_120px] gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest">Address</label>
                    <input
                      type="text"
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      className="wireframe-input py-3 px-4 text-sm font-bold border-2 border-black hover:border-black focus:bg-black focus:text-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest">ZIP</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="wireframe-input py-3 px-4 text-sm font-bold border-2 border-black hover:border-black focus:bg-black focus:text-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-black border-dashed">
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 text-xs font-bold uppercase hover:bg-gray-800 transition-colors border-2 border-black"
              >
                Save Changes
              </button>
            </div>
          </form>

        </div>

      </div>

      {/* Modern Wireframe Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-black text-white border-2 border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-300">
          <p className="text-[10px] font-black uppercase tracking-tight flex items-center gap-2">
            <span>✓</span> {toastMessage}
          </p>
        </div>
      )}
    </MainLayout>
  );
}
