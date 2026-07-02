import React, { useState } from 'react';
import Link from 'next/link';
import { UserCheck, MapPin, X, Check } from 'lucide-react';
import type { ConnectionRequest } from '@/lib/referrals';

type ConnectionRequestBannerProps = {
  requests: ConnectionRequest[];
  onAccept: (request: ConnectionRequest) => void;
  onDecline: (requestId: string) => void;
  onCancel?: (requestId: string) => void;
  /** Visual mode: 'sidebar' = compact widget, 'inline' = full-width panel */
  mode?: 'sidebar' | 'inline';
  role?: 'dentist' | 'specialist';
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function ConnectionRequestBanner({
  requests,
  onAccept,
  onDecline,
  onCancel,
  mode = 'sidebar',
  role = 'specialist',
}: ConnectionRequestBannerProps) {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  if (requests.length === 0) return null;

  const receivedRequests = requests.filter((r) => r.direction !== 'outgoing');
  const sentRequests = requests.filter((r) => r.direction === 'outgoing');
  const displayedRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header with Segmented Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 border-b-2 border-black pb-2 text-black">
        <div className="flex items-center gap-2 flex-1">
          <UserCheck size={18} className="shrink-0" />
          <h3 className="font-bold uppercase text-xs tracking-widest">
            Connection Requests
          </h3>
        </div>
        <div className="flex border-2 border-black divide-x-2 divide-black text-[8px] font-black uppercase bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('received')}
            className={`px-3 py-1.5 transition-all ${activeTab === 'received' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            Received ({receivedRequests.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sent')}
            className={`px-3 py-1.5 transition-all ${activeTab === 'sent' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>
      </div>

      {/* Request list */}
      <div className={`wireframe-card p-0 divide-y-2 divide-black bg-white overflow-hidden text-black ${mode === 'inline' ? 'border-2 border-black' : ''}`}>
        {displayedRequests.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground uppercase text-[9px] font-bold">
            No pending {activeTab} connection requests
          </div>
        ) : (
          displayedRequests.map((req) =>
            mode === 'inline' ? (
              /* ── Wide / inline layout: info left, timestamp+buttons right column ── */
              <div
                key={req.id}
                className="p-4 flex items-start gap-4 hover:bg-gray-50/80 transition-colors"
              >
                {/* Practice info */}
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="truncate">
                    <Link
                      href={role === 'dentist' ? `/dentist/network/practice/${req.fromPracticeId}` : `/network/practice/${req.fromPracticeId}`}
                      className="text-[10px] font-bold uppercase leading-tight hover:underline cursor-pointer text-black"
                    >
                      {req.fromPracticeName}
                    </Link>
                  </div>
                  <span className="text-[7px] font-bold px-1.5 py-0.5 border border-black uppercase text-muted-foreground inline-block">
                    {req.fromSpecialty}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                    <MapPin size={9} className="shrink-0" />
                    <p className="text-[8px] uppercase">{req.fromLocation}</p>
                  </div>
                </div>

                {/* Right column: timestamp top, buttons below */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[7px] text-muted-foreground uppercase font-bold whitespace-nowrap">
                    {timeAgo(req.sentAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    {activeTab === 'received' ? (
                      <>
                        <button
                          onClick={() => onAccept(req)}
                          className="wireframe-button text-[8px] font-black uppercase px-4 py-2 bg-black text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-1 whitespace-nowrap"
                          aria-label={`Accept connection from ${req.fromPracticeName}`}
                        >
                          <Check size={10} />
                          Accept
                        </button>
                        <button
                          onClick={() => onDecline(req.id)}
                          className="wireframe-button text-[8px] font-black uppercase px-4 py-2 bg-white text-black hover:bg-gray-100 border border-black transition-all flex items-center justify-center gap-1 whitespace-nowrap"
                          aria-label={`Decline connection from ${req.fromPracticeName}`}
                        >
                          <X size={10} />
                          Decline
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onCancel?.(req.id)}
                        className="wireframe-button text-[8px] font-black uppercase px-4 py-2 bg-white text-red-600 hover:bg-red-50 border border-black transition-all flex items-center justify-center gap-1 whitespace-nowrap"
                        aria-label={`Cancel connection request to ${req.fromPracticeName}`}
                      >
                        <X size={10} />
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              </div>

            ) : (
              /* ── Sidebar / compact layout: buttons below ── */
              <div
                key={req.id}
                className="p-4 flex flex-col gap-3 hover:bg-gray-50/80 transition-colors"
              >
                {/* Practice info */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="truncate flex-1">
                      <Link
                        href={role === 'dentist' ? `/dentist/network/practice/${req.fromPracticeId}` : `/network/practice/${req.fromPracticeId}`}
                        className="text-[10px] font-bold uppercase leading-tight hover:underline cursor-pointer text-black"
                      >
                        {req.fromPracticeName}
                      </Link>
                    </div>
                    <span className="text-[7px] text-muted-foreground uppercase font-bold shrink-0 whitespace-nowrap">
                      {timeAgo(req.sentAt)}
                    </span>
                  </div>
                  <span className="text-[7px] font-bold px-1.5 py-0.5 border border-black uppercase text-muted-foreground inline-block">
                    {req.fromSpecialty}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                    <MapPin size={9} className="shrink-0" />
                    <p className="text-[8px] uppercase">{req.fromLocation}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {activeTab === 'received' ? (
                    <>
                      <button
                        onClick={() => onAccept(req)}
                        className="flex-1 wireframe-button text-[8px] font-black uppercase py-1.5 bg-black text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-1"
                        aria-label={`Accept connection from ${req.fromPracticeName}`}
                      >
                        <Check size={10} />
                        Accept
                      </button>
                      <button
                        onClick={() => onDecline(req.id)}
                        className="flex-1 wireframe-button text-[8px] font-black uppercase py-1.5 bg-white text-black hover:bg-gray-100 border border-black transition-all flex items-center justify-center gap-1"
                        aria-label={`Decline connection from ${req.fromPracticeName}`}
                      >
                        <X size={10} />
                        Decline
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onCancel?.(req.id)}
                      className="flex-1 wireframe-button text-[8px] font-black uppercase py-1.5 bg-white text-red-600 hover:bg-red-50 border border-black transition-all flex items-center justify-center gap-1"
                      aria-label={`Cancel connection request to ${req.fromPracticeName}`}
                    >
                      <X size={10} />
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
