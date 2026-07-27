"use client";

import React, { useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft, Copy, Check, Info, Mail, Phone, Globe, Lock, Upload, FileText, Trash2, Download, Loader2 } from 'lucide-react';
import { CommentMarker } from "@/components/Comments/CommentMarker";
import { useSubscription } from '@/components/SubscriptionContext';

export default function ReferralIntakePage() {
  const router = useRouter();
  const pathname = usePathname();
  const isDentist = pathname.includes('/dentist');
  const { plan, setShowPaywall } = useSubscription();
  const hasProAccess = plan === 'Pro' || plan === 'BusinessPlus';

  // Predefined/Read-only system fields
  const inboxEmail = "referrals@valleydental.drtalk.com";
  const efaxNumber = "+1 (310) 555-0155";
  const publicUrl = "https://drtalk.com/valleydental/submit";

  // Notification / Toast states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // External routing toggles with persistence
  const [secureEmailNonUsers, setSecureEmailNonUsers] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_intake_secure_email');
      return stored !== 'false';
    }
    return true;
  });
  const [faxBackExternal, setFaxBackExternal] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_intake_fax_back');
      return stored !== 'false';
    }
    return true;
  });

  // Upload template states
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; uploadedAt: string } | null>({
    name: "valley_dental_referral_sheet_v2.pdf",
    size: "1.4 MB",
    uploadedAt: "2026-05-20"
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleToggleSecureEmail = (val: boolean) => {
    setSecureEmailNonUsers(val);
    localStorage.setItem('drtalk_intake_secure_email', String(val));
    showToast(`Secure Email Link ${val ? 'enabled' : 'disabled'}`);
  };

  const handleToggleFaxBack = (val: boolean) => {
    setFaxBackExternal(val);
    localStorage.setItem('drtalk_intake_fax_back', String(val));
    showToast(`Fax-Back Confirmation ${val ? 'enabled' : 'disabled'}`);
  };

  const handleCopy = (value: string, fieldName: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(fieldName);
    showToast(`${fieldName} copied to clipboard!`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        startSimulatedUpload(file);
      } else {
        showToast("Error: Only PDF documents are supported.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        startSimulatedUpload(file);
      } else {
        showToast("Error: Only PDF documents are supported.");
      }
    }
  };

  const startSimulatedUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    const totalSizeStr = (file.size / (1024 * 1024)).toFixed(1) + " MB";

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const today = new Date().toISOString().split('T')[0];
            setUploadedFile({
              name: file.name,
              size: totalSizeStr,
              uploadedAt: today
            });
            setIsUploading(false);
            showToast("Referral template uploaded successfully.");
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleDeleteTemplate = () => {
    setUploadedFile(null);
    showToast("Referral template document deleted.");
  };

  const handleDownloadTemplate = () => {
    if (uploadedFile) {
      showToast(`Downloading template: ${uploadedFile.name}...`);
    }
  };

  return (
    <MainLayout title="Referral Intake">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

        {/* Navigation & Header */}
        <div className="space-y-4">
          <button
            onClick={() => router.push(isDentist ? '/dentist/settings' : '/settings')}
            className="flex items-center gap-2 text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-colors w-fit px-2 py-1 border-2 border-transparent hover:border-black"
          >
            <ArrowLeft size={14} />
            Back to Settings
          </button>

          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter text-black italic">
              Referral Intake
            </h2>
            <CommentMarker
              id="settings-intake-marker"
              title="Referral Intake Settings"
              description="Manage and copy your inbound referral channels including email, eFax, and public referral links."
            />
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            Manage your secure referral integration channels
          </p>
        </div>

        <div className="space-y-8">
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

          {/* External Routing (Non-User Senders) */}
          <div className="wireframe-card p-6 space-y-6 bg-white w-full">
            <div className="flex items-center gap-3 border-b-2 border-black pb-4">
              <FileText size={20} />
              <div>
                <h3 className="font-bold uppercase tracking-tight text-sm">Non-User Senders & External Routing</h3>
                <p className="text-[9px] text-muted-foreground uppercase">Configure responses for external practitioners</p>
              </div>
            </div>

            <div className="space-y-6 divide-y-2 divide-black divide-dashed">
              {/* Secure Email Link */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center pb-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest">Secure Email Link</p>
                  <span className="inline-block text-[8px] font-bold text-gray-500 uppercase tracking-widest bg-gray-200 px-1.5 py-0.5 rounded">Encrypted</span>
                </div>
                <div className="lg:col-span-2 flex items-center justify-between gap-4">
                  <p className="text-[9px] uppercase font-bold text-muted-foreground leading-normal max-w-lg">
                    Deliver incoming processed referrals to external recipients via an encrypted link requiring verification codes.
                  </p>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={secureEmailNonUsers} 
                      onChange={(e) => handleToggleSecureEmail(e.target.checked)} 
                    />
                    <div className="w-9 h-5 bg-white border-2 border-black relative transition-colors peer-checked:bg-black after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-black peer-checked:after:bg-white after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-[14px]"></div>
                  </label>
                </div>
              </div>

              {/* Fax-Back Transport */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center pt-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest">Fax-Back Confirmation</p>
                  <span className="inline-block text-[8px] font-bold text-gray-500 uppercase tracking-widest bg-gray-200 px-1.5 py-0.5 rounded">Receipts</span>
                </div>
                <div className="lg:col-span-2 flex items-center justify-between gap-4">
                  <p className="text-[9px] uppercase font-bold text-muted-foreground leading-normal max-w-lg">
                    Automatically fax a receipt confirmation back to external practices when their intake referral is processed.
                  </p>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={faxBackExternal} 
                      onChange={(e) => handleToggleFaxBack(e.target.checked)} 
                    />
                    <div className="w-9 h-5 bg-white border-2 border-black relative transition-colors peer-checked:bg-black after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-black peer-checked:after:bg-white after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-[14px]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Sheet Template Upload Card */}
          <div className="wireframe-card p-6 space-y-6 bg-white w-full">
            <div className="flex items-center gap-3 border-b-2 border-black pb-4">
              <Upload size={20} />
              <div>
                <h3 className="font-bold uppercase tracking-tight text-sm">Referral Sheet Template</h3>
                <p className="text-[9px] text-muted-foreground uppercase">Upload printable referral sheet (PDF)</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold text-muted-foreground leading-normal">
                Upload your practice&apos;s custom PDF referral sheet. Referring offices can easily view and download this template directly from your public referral submission page.
              </p>

              {uploadedFile && !isUploading ? (
                /* Active Uploaded File Card */
                <div className="border-2 border-black p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase truncate tracking-tight">{uploadedFile.name}</p>
                      <p className="text-[8px] text-muted-foreground uppercase font-mono mt-0.5">
                        {uploadedFile.size} • Uploaded on {uploadedFile.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="wireframe-button text-[9px] uppercase tracking-widest px-3 py-1.5 flex items-center gap-1.5 bg-white border-2 border-black"
                      title="Download template PDF"
                    >
                      <Download size={12} />
                      <span>Download</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteTemplate}
                      className="wireframe-button text-[9px] uppercase tracking-widest px-3 py-1.5 flex items-center gap-1.5 bg-white border-2 border-red-600 text-red-600 hover:bg-red-50"
                      title="Delete template PDF"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ) : isUploading ? (
                /* Upload Progress State */
                <div className="border-2 border-black p-6 flex flex-col items-center justify-center gap-4 bg-gray-50">
                  <Loader2 size={24} className="animate-spin text-black" />
                  <div className="text-center w-full max-w-xs">
                    <p className="text-[10px] font-black uppercase tracking-wider mb-2">Uploading Referral Sheet...</p>
                    <div className="w-full bg-gray-200 border-2 border-black h-4 overflow-hidden relative">
                      <div 
                        className="bg-black h-full transition-all duration-150" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-[9px] font-mono mt-1 font-bold">{uploadProgress}%</p>
                  </div>
                </div>
              ) : (
                /* Upload Drag Dropzone */
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-none p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    dragActive 
                      ? "border-black bg-gray-100 scale-[0.99]" 
                      : "border-gray-400 hover:border-black hover:bg-gray-50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-white mb-3">
                    <Upload size={20} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-tight">
                    Drag and drop your referral sheet PDF
                  </p>
                  <p className="text-[9px] uppercase font-bold text-muted-foreground mt-1.5">
                    or click to browse from files (Max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>
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
