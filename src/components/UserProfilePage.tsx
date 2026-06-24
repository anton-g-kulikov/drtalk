"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, User, Paperclip, Trash2, X } from 'lucide-react';
import { MainLayout } from "@/components/MainLayout";
import { CommentMarker } from "@/components/Comments/CommentMarker";

interface UserProfile {
  firstName: string;
  lastName: string;
  displayName: string;
  mobile: string;
  smsNotifications: boolean;
  email: string;
  avatarUrl: string | null;
}

export function UserProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const isDentist = pathname.includes('/dentist');
  const storageKey = isDentist ? 'drtalk_profile_dentist' : 'drtalk_profile_specialist';

  // State
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    displayName: '',
    mobile: '',
    smsNotifications: false,
    email: '',
    avatarUrl: null
  });

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize profile
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimeout(() => {
          setProfile(parsed);
        }, 0);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Set defaults matching screenshots and layout
      setTimeout(() => {
        setProfile({
          firstName: isDentist ? 'Taylor' : 'John',
          lastName: isDentist ? 'Reed' : 'Doe',
          displayName: isDentist ? 'Dr. Taylor Reed, DDS' : 'Dr. John Doe, Endodontist',
          mobile: '',
          smsNotifications: false,
          email: isDentist ? 'taylor@sunshine.dental' : 'john.doe@valleyendo.com',
          avatarUrl: null
        });
      }, 0);
    }
  }, [storageKey, isDentist]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-generate display name if first or last name changes and displayName hasn't been heavily customized
      if (field === 'firstName' || field === 'lastName') {
        const prefix = isDentist ? 'Dr. ' : 'Dr. ';
        const suffix = isDentist ? ', DDS' : ', Endodontist';
        updated.displayName = `${prefix}${updated.firstName} ${updated.lastName}${suffix}`;
      }
      return updated;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(storageKey, JSON.stringify(profile));
    // Dispatch event to notify Header
    window.dispatchEvent(new Event('drtalk-profile-updated'));
    showToast("Profile details updated successfully.");
  };

  // Avatar initials helper
  const getInitials = () => {
    if (profile.firstName || profile.lastName) {
      return `${profile.firstName[0] || ''}${profile.lastName[0] || ''}`.toUpperCase();
    }
    if (profile.displayName) {
      const parts = profile.displayName.split(' ');
      if (parts.length > 1) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return profile.displayName.substring(0, 2).toUpperCase();
    }
    return isDentist ? 'TR' : 'JD';
  };

  // Convert uploaded image to black and white
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 256;
          canvas.height = 256;
          
          // Draw crop to center square
          const size = Math.min(img.width, img.height);
          const x = (img.width - size) / 2;
          const y = (img.height - size) / 2;
          
          ctx.drawImage(img, x, y, size, size, 0, 0, 256, 256);
          
          // Convert to Grayscale
          const imgData = ctx.getImageData(0, 0, 256, 256);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const brightness = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
            data[i] = brightness;     // R
            data[i + 1] = brightness; // G
            data[i + 2] = brightness; // B
          }
          ctx.putImageData(imgData, 0, 0);
          
          const bAndWDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          handleInputChange('avatarUrl', bAndWDataUrl);
          setIsPhotoModalOpen(false);
          showToast("Profile photo uploaded and styled to B&W.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = () => {
    handleInputChange('avatarUrl', null);
    setIsPhotoModalOpen(false);
    showToast("Profile photo deleted.");
  };

  return (
    <MainLayout title="User Profile">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        {/* Navigation & Header */}
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-colors w-fit px-2 py-1 border-2 border-transparent hover:border-black"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter text-black italic">
              User Profile
            </h2>
            <CommentMarker
              id="user-profile-settings"
              title="Personal Profile Settings"
              description="Manage your personal profile details, notification preferences, and upload your profile picture."
            />
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            Manage your personal profile details and security contacts
          </p>
        </div>

        {/* Profile Card */}
        <div className="wireframe-card p-6 space-y-6 w-full bg-white">
          <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b-2 border-black border-dashed">
            {/* Avatar container */}
            <div 
              onClick={() => setIsPhotoModalOpen(true)}
              className="w-24 h-24 rounded-full border-4 border-black flex items-center justify-center overflow-hidden cursor-pointer bg-white select-none hover:bg-gray-100 transition-colors group relative"
            >
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt="Profile picture" 
                  className="w-full h-full object-cover filter grayscale" 
                  draggable={false}
                />
              ) : (
                <span className="text-2xl font-black text-black">{getInitials()}</span>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-[10px] text-white font-bold uppercase">Change</span>
              </div>
            </div>
            
            <div className="text-center md:text-left space-y-1">
              <h3 className="text-lg font-black uppercase">{profile.displayName || 'No Name Set'}</h3>
              <p className="text-xs text-muted-foreground uppercase font-bold">{isDentist ? 'Practice Owner' : 'Practice Admin'}</p>
              <button 
                onClick={() => setIsPhotoModalOpen(true)}
                className="text-[10px] font-black uppercase underline hover:text-muted-foreground block mt-2 mx-auto md:mx-0"
              >
                Update Photo
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest"><span className="text-red-500">*</span>First Name</label>
                <input
                  type="text"
                  required
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="wireframe-input py-3 px-4 text-sm font-bold border-2 border-black w-full focus:bg-black focus:text-white transition-colors"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest"><span className="text-red-500">*</span>Last Name</label>
                <input
                  type="text"
                  required
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="wireframe-input py-3 px-4 text-sm font-bold border-2 border-black w-full focus:bg-black focus:text-white transition-colors"
                />
              </div>

              {/* Display Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest"><span className="text-red-500">*</span>Display Name</label>
                <input
                  type="text"
                  required
                  value={profile.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className="wireframe-input py-3 px-4 text-sm font-bold border-2 border-black w-full focus:bg-black focus:text-white transition-colors"
                />
              </div>

              {/* Mobile for SMS */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest">Mobile For SMS Reminder</label>
                <input
                  type="tel"
                  placeholder="(555) 555-5555"
                  value={profile.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="wireframe-input py-3 px-4 text-sm font-bold border-2 border-black w-full focus:bg-black focus:text-white transition-colors"
                />
              </div>

              {/* SMS Reminder Notifications Checkbox */}
              <div className="flex items-center gap-3 md:pt-6">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  checked={profile.smsNotifications}
                  onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                  className="w-5 h-5 border-2 border-black checked:bg-black checked:border-black cursor-pointer"
                />
                <label htmlFor="smsNotifications" className="text-[10px] font-black uppercase tracking-widest cursor-pointer select-none">
                  SMS Reminder Notifications
                </label>
              </div>

              {/* Email */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest"><span className="text-red-500">*</span>Email</label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="wireframe-input py-3 px-4 text-sm font-bold border-2 border-black w-full focus:bg-black focus:text-white transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-black border-dashed gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="border-2 border-black text-black px-8 py-3 text-xs font-bold uppercase hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 text-xs font-bold uppercase hover:bg-gray-800 transition-colors border-2 border-black"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Profile Photo Upload Overlay Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute right-4 top-4 p-1 hover:bg-gray-100 transition-colors text-black"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black uppercase text-black mb-6 border-b-2 border-black pb-2">Update profile picture</h3>
            
            <div className="flex flex-col gap-4">
              <p className="text-[10px] text-muted-foreground uppercase font-bold leading-relaxed">
                Upload a picture of yourself. Images are automatically rendered in black & white for prototype styling.
              </p>

              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 border-2 border-black px-4 py-3 text-[10px] font-black uppercase hover:bg-black hover:text-white transition-all bg-white text-black"
                >
                  <Paperclip size={14} /> Upload
                </button>
                <button
                  onClick={handleDeletePhoto}
                  disabled={!profile.avatarUrl}
                  className="flex items-center gap-2 border-2 border-black px-4 py-3 text-[10px] font-black uppercase hover:bg-red-500 hover:text-white hover:border-red-500 transition-all bg-white text-black disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black disabled:hover:border-black"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>

              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Modern Wireframe Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-[130] bg-black text-white border-2 border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-300">
          <p className="text-[10px] font-black uppercase tracking-tight flex items-center gap-2">
            <span>✓</span> {toastMessage}
          </p>
        </div>
      )}
    </MainLayout>
  );
}
