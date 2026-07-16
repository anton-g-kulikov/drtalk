"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MainLayout } from "@/components/MainLayout";
import { ArrowLeft, Bell, Clock, ShieldAlert } from 'lucide-react';
import { CommentMarker } from "@/components/Comments/CommentMarker";

export default function NotificationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const isDentist = pathname.includes('/dentist');
  const [drTalkUserEnabled, setDrTalkUserEnabled] = useState(true);
  const [drTalkUserInApp, setDrTalkUserInApp] = useState(true);
  const [drTalkUserEmail, setDrTalkUserEmail] = useState(true);
  
  const [nonUserEnabled, setNonUserEnabled] = useState(true);
  
  const [faxSenderEnabled, setFaxSenderEnabled] = useState(true);
  const [faxSenderFaxBack, setFaxSenderFaxBack] = useState(true);
  const [faxSenderSecureEmail, setFaxSenderSecureEmail] = useState(true);

  const [patientEnabled, setPatientEnabled] = useState(true);
  const [patientEmail, setPatientEmail] = useState(true);
  const [patientSMS, setPatientSMS] = useState(true);

  const [delayEnabled, setDelayEnabled] = useState(true);
  const [delayMinutes, setDelayMinutes] = useState(5);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  return (
    <MainLayout title={isDentist ? "Patient (Referral) Notifications" : "Referral Notifications"}>
      <div className="max-w-4xl mx-auto space-y-8">
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
              {isDentist ? "Patient (Referral) Notifications" : "Referral Notifications"}
            </h2>
            <CommentMarker 
              id={isDentist ? "notifications-dentist" : "notifications-main"} 
              title={isDentist ? "Dentist Notifications" : "Specialist Notifications"} 
              description={isDentist ? "Configure referral submission alerts for patients." : "Configure intake alerts and processing delays."} 
            />
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            {isDentist 
              ? 'Configure automated alerts for the referral submission hand-off'
              : 'Configure automated alerts for the referral intake pipeline'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-black p-6 space-y-6">
            <div className="flex items-center gap-3 border-b-2 border-black pb-4">
              <Bell size={24} />
              <div>
                <h3 className="font-bold uppercase tracking-tight">
                  Trigger: {isDentist ? '"Submit Referral"' : '"Process Referral"'}
                </h3>
                <p className="text-[10px] text-muted-foreground uppercase">
                  {isDentist 
                    ? 'System actions triggered when your practice sends a referral'
                    : 'System actions triggered when you process an incoming referral'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* Dentist (Sender) / Internal Section */}
              {!isDentist && (
                <div className="space-y-6">
                  <h4 className="font-bold uppercase text-sm border-b border-black border-dashed pb-2">
                    {isDentist ? 'Internal / Staff Notifications' : 'Dentist (Referral Sender) Notifications'}
                  </h4>
                  <div className="space-y-6">
                    
                    {/* DrTalk User / Internal Staff */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-2 border-black p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="text-xs font-bold uppercase">{isDentist ? 'Internal Staff' : 'DrTalk User'}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">
                            {isDentist ? 'Configure submission alerts for your team' : 'Configure transports for registered users'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={drTalkUserEnabled} onChange={(e) => setDrTalkUserEnabled(e.target.checked)} />
                          <div className="w-9 h-5 bg-white peer-focus:outline-none border-2 border-black peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-black peer-checked:after:bg-white after:border-2 after:border-black after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>
                      {drTalkUserEnabled && (
                        <div className="pl-4 space-y-2 border-l-2 border-black ml-4">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={drTalkUserInApp} onChange={(e) => setDrTalkUserInApp(e.target.checked)} className="border-black rounded-none accent-black w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase">In-App Message</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={drTalkUserEmail} onChange={(e) => setDrTalkUserEmail(e.target.checked)} className="border-black rounded-none accent-black w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase">Email</span>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Non-User */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-2 border-black p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="text-xs font-bold uppercase">Non-User</p>
                          <p className="text-[10px] text-muted-foreground uppercase">Secure Email Confirmation</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={nonUserEnabled} onChange={(e) => setNonUserEnabled(e.target.checked)} />
                          <div className="w-9 h-5 bg-white peer-focus:outline-none border-2 border-black peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-black peer-checked:after:bg-white after:border-2 after:border-black after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>
                    </div>

                    {/* Fax/Email Sender */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-2 border-black p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="text-xs font-bold uppercase">Fax/Email Sender</p>
                          <p className="text-[10px] text-muted-foreground uppercase">Configure transports for external senders</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={faxSenderEnabled} onChange={(e) => setFaxSenderEnabled(e.target.checked)} />
                          <div className="w-9 h-5 bg-white peer-focus:outline-none border-2 border-black peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-black peer-checked:after:bg-white after:border-2 after:border-black after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>
                      {faxSenderEnabled && (
                        <div className="pl-4 space-y-2 border-l-2 border-black ml-4">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={faxSenderFaxBack} onChange={(e) => setFaxSenderFaxBack(e.target.checked)} className="border-black rounded-none accent-black w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase">Fax-back</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={faxSenderSecureEmail} onChange={(e) => setFaxSenderSecureEmail(e.target.checked)} className="border-black rounded-none accent-black w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase">Secure Email</span>
                          </label>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* Patient Section */}
              <div className="space-y-6 pt-4">
                <h4 className="font-bold uppercase text-sm border-b border-black border-dashed pb-2">Patient Notifications</h4>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-2 border-black p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="text-xs font-bold uppercase">Patient</p>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          {isDentist 
                            ? 'Configure "Referral Sent" confirmation for the patient' 
                            : 'Configure "Referral Accepted" alert for the patient'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={patientEnabled} onChange={(e) => setPatientEnabled(e.target.checked)} />
                        <div className="w-9 h-5 bg-white peer-focus:outline-none border-2 border-black peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-black peer-checked:after:bg-white after:border-2 after:border-black after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </div>
                    {patientEnabled && (
                      <div className="pl-4 space-y-2 border-l-2 border-black ml-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={patientEmail} onChange={(e) => setPatientEmail(e.target.checked)} className="border-black rounded-none accent-black w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase">Email</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={patientSMS} onChange={(e) => setPatientSMS(e.target.checked)} className="border-black rounded-none accent-black w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase">SMS (Text Message)</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!isDentist && (
            <div className="wireframe-card p-6 space-y-6">
              <div className="flex items-center gap-3 border-b-2 border-black pb-4">
                <ShieldAlert size={24} />
                <div>
                  <h3 className="font-bold uppercase tracking-tight">Safety Mechanism</h3>
                  <p className="text-[10px] text-muted-foreground uppercase">Delay notifications to allow for corrections</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <p className="text-sm font-bold uppercase">Optional Delay Before Notifications</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase max-w-md">
                    Allows undo or correction after accidental processing. Notifications will be held for the specified duration.
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-3 border-2 border-black shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={delayEnabled} 
                      onChange={(e) => setDelayEnabled(e.target.checked)}
                      className="border-black rounded-none w-4 h-4 accent-black"
                    />
                    <span className="text-xs font-bold uppercase">Enable Delay</span>
                  </label>
                  
                  {delayEnabled && (
                    <div className="flex items-center gap-2 pl-4 border-l-2 border-black">
                      <select 
                        value={delayMinutes} 
                        onChange={(e) => setDelayMinutes(Number(e.target.value))}
                        className="border-2 border-black p-1 text-xs font-bold uppercase bg-white outline-none cursor-pointer"
                      >
                        <option value={5}>5 Min</option>
                        <option value={10}>10 Min</option>
                        <option value={15}>15 Min</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={() => showToast('Changes saved successfully.')}
            className="bg-black text-white px-6 py-3 text-xs font-bold uppercase hover:bg-gray-800 transition-colors border-2 border-black"
          >
            Save Changes
          </button>
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
