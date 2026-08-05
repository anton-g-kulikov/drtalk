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

  // Team Referral Alerts (Push and Email separately)
  const [referralPushAlerts, setReferralPushAlerts] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_pref_referral_push');
      return stored !== 'false';
    }
    return true;
  });
  const [referralEmailAlerts, setReferralEmailAlerts] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_pref_referral_email');
      return stored !== 'false';
    }
    return true;
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
  const [connectedPracticeEmail, setConnectedPracticeEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_pref_connected_practice_email');
      return stored !== 'false';
    }
    return true;
  });
  const [connectedPracticeFreq, setConnectedPracticeFreq] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drtalk_pref_connected_freq');
      return stored || 'daily';
    }
    return 'daily';
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

  const handleToggleReferralPush = (val: boolean) => {
    setReferralPushAlerts(val);
    localStorage.setItem('drtalk_pref_referral_push', String(val));
    const label = isDentist ? 'Released Patients Push Alerts' : 'New Referral Push Alerts';
    showToast(`${label} ${val ? 'enabled' : 'disabled'}`);
  };

  const handleToggleReferralEmail = (val: boolean) => {
    setReferralEmailAlerts(val);
    localStorage.setItem('drtalk_pref_referral_email', String(val));
    const label = isDentist ? 'Released Patients Email Alerts' : 'New Referral Email Alerts';
    showToast(`${label} ${val ? 'enabled' : 'disabled'}`);
  };

  const handleToggleAdminReport = (val: boolean) => {
    setAdminReportEnabled(val);
    localStorage.setItem('drtalk_pref_admin_report', String(val));
    showToast(`Join Requests Alerts ${val ? 'enabled' : 'disabled'}`);
  };

  const handleSelectAdminFrequency = (val: string) => {
    setAdminReportFrequency(val);
    localStorage.setItem('drtalk_pref_admin_freq', val);
    showToast(`Join requests email digest frequency set to ${val}`);
  };

  const handleToggleConnectedPractice = (val: boolean) => {
    setConnectedPracticeEmail(val);
    localStorage.setItem('drtalk_pref_connected_practice_email', String(val));
    showToast(`Connected Practice Request Alerts ${val ? 'enabled' : 'disabled'}`);
  };

  const handleSelectConnectedFrequency = (val: string) => {
    setConnectedPracticeFreq(val);
    localStorage.setItem('drtalk_pref_connected_freq', val);
    showToast(`Connected practice digest frequency set to ${val}`);
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
            Manage how patients and practice team members receive updates.
          </p>
        </div>

        {/* Unified clean settings sheet */}
        <div className="border-2 border-black bg-white p-8 divide-y-2 divide-black">

          {/* Section 1: Patient Communication (Dentist view only) */}
          {isDentist && (
            <div className="py-6 first:pt-0 space-y-6">
              <div className="flex items-center gap-2.5">
                <Users size={18} />
                <h3 className="font-bold uppercase tracking-tight text-xs">
                  1. Patient Communication
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  <div>
                    <p className="text-[10px] font-bold uppercase">
                      Referral Sent Notifications
                    </p>
                    <p className="text-[9px] text-muted-foreground uppercase">
                      Default setting to notify patients instantly when your office submits a new referral. Can also be managed case-by-case when sending each referral via the platform.
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
              </div>
            </div>
          )}

          {/* Section 2: Team Notifications */}
          <div className="py-6 first:pt-0 space-y-4">
            <div className="flex items-center gap-2.5">
              <Bell size={18} />
              <h3 className="font-bold uppercase tracking-tight text-xs">
                2. Team Notifications
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div>
                <p className="text-[10px] font-bold uppercase">
                  {isDentist ? 'Released Patients Alerts' : 'New Referral Alerts'}
                </p>
                <p className="text-[9px] text-muted-foreground uppercase">
                  {isDentist
                    ? 'Select how practice staff are notified when referred patients are released back to your care.'
                    : 'Select how practice staff are notified when new referral inbox cases arrive.'}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={referralPushAlerts}
                    onChange={(e) => handleToggleReferralPush(e.target.checked)}
                    className="border-black rounded-none w-4 h-4 accent-black"
                  />
                  <span className="text-[9px] font-bold uppercase flex items-center gap-1"><Bell size={10} /> Push</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={referralEmailAlerts}
                    onChange={(e) => handleToggleReferralEmail(e.target.checked)}
                    className="border-black rounded-none w-4 h-4 accent-black"
                  />
                  <span className="text-[9px] font-bold uppercase flex items-center gap-1"><Mail size={10} /> Email</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Administrative Messages & Billing */}
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <CreditCard size={18} />
              <h3 className="font-bold uppercase tracking-tight text-xs">
                {isDentist ? '3. Administrative Messages' : '3. Administrative Messages & Billing'}
              </h3>
            </div>

            <div className="space-y-4 pt-1">
              {/* Admin New User Requests & Join Requests */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold uppercase">Join Requests & New Users</p>
                    <span className="text-[8px] font-black uppercase bg-black text-white px-1.5 py-0.5">Owners & Admins</span>
                    <span className="text-[8px] font-bold uppercase bg-gray-100 text-black border border-black px-1.5 py-0.5">Email Only</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground uppercase">
                    Alerts and email digests when new staff request to join your practice.
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

              {/* Connected Practice Requests */}
              <div className="flex items-center justify-between gap-4 border-t border-black border-dashed pt-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold uppercase">Connected Practice Requests</p>
                    <span className="text-[8px] font-black uppercase bg-black text-white px-1.5 py-0.5">Owners & Admins</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground uppercase">
                    Receive email notifications when partner offices request to connect with your practice.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={connectedPracticeEmail}
                      onChange={(e) => handleToggleConnectedPractice(e.target.checked)}
                      className="border-black rounded-none w-4 h-4 accent-black"
                    />
                    <span className="text-[9px] font-bold uppercase"><Mail size={10} className="inline mr-1" /> Email</span>
                  </label>
                  {connectedPracticeEmail && (
                    <select
                      value={connectedPracticeFreq}
                      onChange={(e) => handleSelectConnectedFrequency(e.target.value)}
                      className="border-2 border-black p-1 text-[9px] font-bold uppercase bg-white outline-none cursor-pointer"
                    >
                      <option value="instant">Instant</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Billing Failures and Invoices (Specialists only) */}
              {!isDentist && (
                <div className="flex items-center justify-between gap-4 border-t border-black border-dashed pt-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-bold uppercase">Billing & Subscription Alerts</p>
                      <span className="text-[8px] font-black uppercase bg-black text-white px-1.5 py-0.5">Owners & Admins</span>
                    </div>
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
              )}
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


