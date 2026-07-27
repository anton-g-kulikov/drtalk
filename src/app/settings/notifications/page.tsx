"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft, Bell, Clock, ShieldAlert, Users, Mail, Phone, FileText, CreditCard } from 'lucide-react';
import { CommentMarker } from "@/components/Comments/CommentMarker";

export default function NotificationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const isDentist = pathname.includes('/dentist');
  
  // Practice Referral Notification States
  const [staffInApp, setStaffInApp] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_pref_staff_inapp');
      return stored !== 'false';
    }
    return true;
  });
  const [staffEmail, setStaffEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_pref_staff_email');
      return stored !== 'false';
    }
    return true;
  });
  const [patientEmail, setPatientEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_pref_patient_email');
      return stored !== 'false';
    }
    return true;
  });
  const [patientSMS, setPatientSMS] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_pref_patient_sms');
      return stored !== 'false';
    }
    return true;
  });
  // Safety Delay
  const [delayEnabled, setDelayEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_pref_delay_enabled');
      return stored !== 'false';
    }
    return true;
  });
  const [delayMinutes, setDelayMinutes] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_pref_delay_minutes');
      return stored ? Number(stored) : 5;
    }
    return 5;
  });

  // Practice Admin & Billing Settings
  const [adminReportEnabled, setAdminReportEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_pref_admin_report');
      return stored !== 'false';
    }
    return true;
  });
  const [adminReportFrequency, setAdminReportFrequency] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_pref_admin_freq');
      return stored || 'daily';
    }
    return 'daily';
  });
  const [billingEmailsEnabled, setBillingEmailsEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_pref_billing_emails');
      return stored !== 'false';
    }
    return true;
  });

  // Internal routing channel selector
  const [selectedInternalChannel, setSelectedInternalChannel] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_pref_internal_channel');
      return stored || 'team-members';
    }
    return 'team-members';
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Immediate Save Handlers
  const handleTogglePatientEmail = (val: boolean) => {
    setPatientEmail(val);
    localStorage.setItem('drtalk_pref_patient_email', String(val));
    showToast(`Patient Email Alerts ${val ? 'enabled' : 'disabled'}`);
  };

  const handleTogglePatientSMS = (val: boolean) => {
    setPatientSMS(val);
    localStorage.setItem('drtalk_pref_patient_sms', String(val));
    showToast(`Patient SMS Alerts ${val ? 'enabled' : 'disabled'}`);
  };

  const handleToggleDelay = (val: boolean) => {
    setDelayEnabled(val);
    localStorage.setItem('drtalk_pref_delay_enabled', String(val));
    showToast(`Safety Delay Hold ${val ? 'enabled' : 'disabled'}`);
  };

  const handleSelectDelayMinutes = (val: number) => {
    setDelayMinutes(val);
    localStorage.setItem('drtalk_pref_delay_minutes', String(val));
    showToast(`Safety Delay duration updated to ${val} minutes`);
  };

  const handleToggleStaffInApp = (val: boolean) => {
    setStaffInApp(val);
    localStorage.setItem('drtalk_pref_staff_inapp', String(val));
    showToast(`Internal Channel Alerts ${val ? 'enabled' : 'disabled'}`);
  };

  const handleSelectInternalChannel = (val: string) => {
    setSelectedInternalChannel(val);
    localStorage.setItem('drtalk_pref_internal_channel', val);
    showToast(`Notification channel updated to #${val}`);
  };

  const handleToggleStaffEmail = (val: boolean) => {
    setStaffEmail(val);
    localStorage.setItem('drtalk_pref_staff_email', String(val));
    showToast(`Staff Email Summary ${val ? 'enabled' : 'disabled'}`);
  };

  const handleToggleAdminReport = (val: boolean) => {
    setAdminReportEnabled(val);
    localStorage.setItem('drtalk_pref_admin_report', String(val));
    showToast(`New User Reports ${val ? 'enabled' : 'disabled'}`);
  };

  const handleSelectAdminFrequency = (val: string) => {
    setAdminReportFrequency(val);
    localStorage.setItem('drtalk_pref_admin_freq', val);
    showToast(`Summary report frequency set to ${val}`);
  };

  const handleToggleBilling = (val: boolean) => {
    setBillingEmailsEnabled(val);
    localStorage.setItem('drtalk_pref_billing_emails', String(val));
    showToast(`Billing Alerts ${val ? 'enabled' : 'disabled'}`);
  };

  return (
    <MainLayout title="Notifications">
      <div className="max-w-3xl mx-auto space-y-8 pb-12">
        {/* Header Section */}
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
              Notifications
            </h2>
            <CommentMarker 
              id={isDentist ? "notifications-dentist" : "notifications-main"} 
              title={isDentist ? "Dentist Notifications" : "Specialist Notifications"} 
              description={isDentist ? "Configure referral submission alerts for patients." : "Configure intake alerts and processing delays."} 
            />
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            Manage how patients and your internal staff receive updates.
          </p>
        </div>

        {/* Unified clean settings sheet */}
        <div className="border-2 border-black bg-white p-8 divide-y-2 divide-black">
          
          {/* Section 1: Patient Communication & Safety Delay */}
          <div className="py-6 first:pt-0 space-y-6">
            <div className="flex items-center gap-2.5">
              <Users size={18} />
              <h3 className="font-bold uppercase tracking-tight text-xs">
                1. Patient Communication & Safety Delay
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div>
                  <p className="text-[10px] font-bold uppercase">
                    {isDentist ? 'Referral Sent Notifications' : 'Referral Accepted Notifications'}
                  </p>
                  <p className="text-[9px] text-muted-foreground uppercase">
                    {isDentist 
                      ? 'Notify patients instantly when your office submits a new referral.' 
                      : 'Notify patients when your staff accepts and processes their referral.'}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={patientEmail} 
                      onChange={(e) => handleTogglePatientEmail(e.target.checked)} 
                      className="border-black rounded-none w-4 h-4 accent-black" 
                    />
                    <span className="text-[9px] font-bold uppercase flex items-center gap-1"><Mail size={10} /> Email</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={patientSMS} 
                      onChange={(e) => handleTogglePatientSMS(e.target.checked)} 
                      className="border-black rounded-none w-4 h-4 accent-black" 
                    />
                    <span className="text-[9px] font-bold uppercase flex items-center gap-1"><Phone size={10} /> SMS Text</span>
                  </label>
                </div>
              </div>

              {/* Safety Hold (Specialists only) */}
              {!isDentist && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-black border-dashed">
                  <div>
                    <p className="text-[10px] font-bold uppercase">Alert hold period (Safeguard)</p>
                    <p className="text-[9px] text-muted-foreground uppercase">
                      Pauses patient alerts for set minutes, allowing staff to recall accidental processing.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={delayEnabled} 
                        onChange={(e) => handleToggleDelay(e.target.checked)}
                        className="border-black rounded-none w-4 h-4 accent-black"
                      />
                      <span className="text-[9px] font-bold uppercase">Delay Alerts</span>
                    </label>
                    
                    {delayEnabled && (
                      <select 
                        value={delayMinutes} 
                        onChange={(e) => handleSelectDelayMinutes(Number(e.target.value))}
                        className="border-2 border-black p-1 text-[9px] font-bold uppercase bg-white outline-none cursor-pointer"
                      >
                        <option value={5}>5 Min</option>
                        <option value={10}>10 Min</option>
                        <option value={15}>15 Min</option>
                      </select>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Team Notifications */}
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <Bell size={18} />
              <h3 className="font-bold uppercase tracking-tight text-xs">
                2. Team Notifications
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1">
              <div>
                <p className="text-[10px] font-bold uppercase">New Referral Alerts</p>
                <p className="text-[9px] text-muted-foreground uppercase">
                  Select default channels for notifying staff about new inbox cases.
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0 items-start sm:items-end">
                {/* Line 1: Internal Channel + Channel Selector */}
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={staffInApp} 
                      onChange={(e) => handleToggleStaffInApp(e.target.checked)} 
                      className="border-black rounded-none w-4 h-4 accent-black" 
                    />
                    <span className="text-[9px] font-bold uppercase">Internal Channel</span>
                  </label>
                  {staffInApp && (
                    <select 
                      value={selectedInternalChannel} 
                      onChange={(e) => handleSelectInternalChannel(e.target.value)}
                      className="border-2 border-black px-1 py-0.5 text-[9px] font-bold uppercase bg-white outline-none cursor-pointer h-6 animate-in fade-in zoom-in-95 duration-150"
                    >
                      <option value="team-members">#team-members</option>
                      <option value="admin-billing">#admin-billing</option>
                    </select>
                  )}
                </div>

                {/* Line 2: Email Summary */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={staffEmail} 
                    onChange={(e) => handleToggleStaffEmail(e.target.checked)} 
                    className="border-black rounded-none w-4 h-4 accent-black" 
                  />
                  <span className="text-[9px] font-bold uppercase">Email Summary</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Administrative Reports & Billing */}
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <CreditCard size={18} />
              <h3 className="font-bold uppercase tracking-tight text-xs">
                3. Administrative Reports & Billing
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              {/* Admin New User Reports */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase">New User Summary Reports</p>
                  <p className="text-[9px] text-muted-foreground uppercase">
                    Daily or weekly email digests sent to admins when staff join.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <input 
                    type="checkbox" 
                    checked={adminReportEnabled} 
                    onChange={(e) => handleToggleAdminReport(e.target.checked)} 
                    className="border-black rounded-none w-4 h-4 accent-black" 
                  />
                  {adminReportEnabled && (
                    <select 
                      value={adminReportFrequency} 
                      onChange={(e) => handleSelectAdminFrequency(e.target.value)}
                      className="border-2 border-black p-1 text-[9px] font-bold uppercase bg-white outline-none cursor-pointer"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Billing Failures and Invoices */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase">Billing & Subscription Alerts</p>
                  <p className="text-[9px] text-muted-foreground uppercase">
                    Invoices and credit card payment warnings.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={billingEmailsEnabled} 
                    onChange={(e) => handleToggleBilling(e.target.checked)} 
                  />
                  <div className="w-9 h-5 bg-white border-2 border-black relative transition-colors peer-checked:bg-black after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-black peer-checked:after:bg-white after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-[14px]"></div>
                </label>
              </div>
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


