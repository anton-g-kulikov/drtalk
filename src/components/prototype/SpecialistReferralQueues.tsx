import { ArrowUpRight } from 'lucide-react';

export type SpecialistReferralQueueItem = {
  id: string;
  patient: string;
  source: string;
  dentist?: string;
  date: string;
  detail: string;
  urgency?: 'Routine' | 'Urgent' | 'Emergency';
  isExternal?: boolean;
  transport?: 'Email' | 'Fax' | 'App';
};

type SpecialistReferralQueuesProps = {
  totalCount: number;
  processingReferrals: SpecialistReferralQueueItem[];
  documentReferrals: SpecialistReferralQueueItem[];
  onReferralClick: (id: string) => void;
  onViewAll: () => void;
};

function ReferralQueueSection({
  title,
  emptyLabel,
  dateLabel,
  referrals,
  onReferralClick,
}: {
  title: string;
  emptyLabel: string;
  dateLabel: string;
  referrals: SpecialistReferralQueueItem[];
  onReferralClick: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-l-4 border-black pl-2">
        <span className="text-[9px] font-black uppercase tracking-wider text-black">{title}</span>
      </div>

      {referrals.length === 0 ? (
        <div className="wireframe-card p-4 text-center text-muted-foreground uppercase text-[9px] font-bold bg-gray-50 border-dashed border-2 border-black">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-2">
          {referrals.map((referral) => (
            <div
              key={referral.id}
              onClick={() => onReferralClick(referral.id)}
              className="wireframe-card p-4 flex items-center justify-between bg-white border-2 border-black hover:bg-black hover:text-white cursor-pointer group transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold uppercase text-xs">{referral.patient}</p>
                  {referral.isExternal && (
                    <span className="text-[7px] bg-white text-black px-1.5 py-0.5 border border-black font-black uppercase shrink-0 group-hover:bg-gray-100">
                      EXTERNAL &bull; {referral.transport || 'EMAIL'}
                    </span>
                  )}
                </div>
                <p className="text-[10px] uppercase font-bold opacity-70 group-hover:opacity-100">{referral.detail}</p>
                <p className="text-[8px] uppercase font-bold text-muted-foreground group-hover:text-zinc-300">
                  From: {referral.source}{referral.dentist ? ` • Ref. by ${referral.dentist}` : ''} • {dateLabel} {referral.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {referral.urgency && (
                  <span className={`text-[8px] uppercase font-bold px-2 py-0.5 border ${
                    referral.urgency === 'Emergency'
                      ? 'bg-red-100 text-red-900 border-red-300 group-hover:bg-red-950 group-hover:text-red-200 group-hover:border-red-800'
                      : referral.urgency === 'Urgent'
                        ? 'bg-amber-100 text-amber-900 border-amber-300 group-hover:bg-amber-950 group-hover:text-amber-200 group-hover:border-amber-800'
                        : 'bg-zinc-100 text-zinc-800 border-zinc-300 group-hover:bg-zinc-800 group-hover:text-zinc-300 group-hover:border-zinc-700'
                  }`}>
                    {referral.urgency}
                  </span>
                )}
                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SpecialistReferralQueues({
  totalCount,
  processingReferrals,
  documentReferrals,
  onReferralClick,
  onViewAll,
}: SpecialistReferralQueuesProps) {
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b-4 border-black pb-2">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-black"></div>
            <h3 className="font-black uppercase text-sm tracking-widest italic">Referrals</h3>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 bg-black text-white uppercase">
            {totalCount} items
          </span>
        </div>

        <ReferralQueueSection
          title="New referrals requiring processing"
          emptyLabel="No new referrals requiring processing"
          dateLabel="Received"
          referrals={processingReferrals}
          onReferralClick={onReferralClick}
        />

        <ReferralQueueSection
          title="Referrals with newly received documents"
          emptyLabel="No referrals with newly received documents"
          dateLabel="Updated"
          referrals={documentReferrals}
          onReferralClick={onReferralClick}
        />
      </div>

      <button
        onClick={onViewAll}
        className="text-[10px] font-black uppercase underline block"
      >
        View all Referrals
      </button>
    </>
  );
}
