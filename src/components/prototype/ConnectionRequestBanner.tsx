"use client";

import React from 'react';
import { UserCheck, MapPin, X, Check } from 'lucide-react';
import type { ConnectionRequest } from '@/lib/referrals';

type ConnectionRequestBannerProps = {
  requests: ConnectionRequest[];
  onAccept: (request: ConnectionRequest) => void;
  onDecline: (requestId: string) => void;
  /** Visual mode: 'sidebar' = compact widget, 'inline' = full-width panel */
  mode?: 'sidebar' | 'inline';
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
  mode = 'sidebar',
}: ConnectionRequestBannerProps) {
  if (requests.length === 0) return null;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 border-b-2 border-black pb-2">
        <UserCheck size={18} className="shrink-0" />
        <h3 className="font-bold uppercase text-xs tracking-widest flex-1">
          Connection Requests
        </h3>
        <span className="text-[8px] font-black uppercase tracking-wider bg-black text-white px-1.5 py-0.5 rounded-full">
          {requests.length}
        </span>
      </div>

      {/* Request list */}
      <div className={`wireframe-card p-0 divide-y-2 divide-black bg-white overflow-hidden ${mode === 'inline' ? 'border-2 border-black' : ''}`}>
        {requests.map((req) =>
          mode === 'inline' ? (
            /* ── Wide / inline layout: info left, timestamp+buttons right column ── */
            <div
              key={req.id}
              className="p-4 flex items-start gap-4 hover:bg-gray-50/80 transition-colors"
            >
              {/* Practice info */}
              <div className="flex-1 space-y-1 min-w-0">
                <p className="text-[10px] font-bold uppercase leading-tight truncate">
                  {req.fromPracticeName}
                </p>
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
                  <p className="text-[10px] font-bold uppercase leading-tight truncate">
                    {req.fromPracticeName}
                  </p>
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
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
