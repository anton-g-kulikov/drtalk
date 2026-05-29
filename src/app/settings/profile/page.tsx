"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft, User } from 'lucide-react';
import { CommentMarker } from "@/components/Comments/CommentMarker";

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const isDentist = pathname.includes('/dentist');

  // Form states initialized with realistic values
  const [practiceName, setPracticeName] = useState(isDentist ? "Valley Dental Care" : "Valley Endodontics");
  const [practiceType, setPracticeType] = useState(isDentist ? "Dentist" : "Endodontist");
  const [city, setCity] = useState("Beverly Hills");
  const [selectedState, setSelectedState] = useState("CA");
  const [zipCode, setZipCode] = useState("90210");
  const [fullAddress, setFullAddress] = useState("123 Dental Way, Ste 100");
  const [phone, setPhone] = useState("(310) 555-0199");

  // Notification / Toast states
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Practice Profile changes saved successfully.");
  };

  const practiceTypes = [
    'Dentist',
    'Pediatric Dentist',
    'Orthodontist',
    'Endodontist',
    'Oral & Maxillofacial Surgeon',
    'Periodontist',
    'Prosthodontist',
    'Dental Anesthesiologist',
    'Oral Pathologist',
    'Dental Partner',
    'Dental Laboratory'
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
