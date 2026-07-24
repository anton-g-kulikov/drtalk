import { ArrowUpRight, Search } from 'lucide-react';
import { getPrototypePageNumbers } from '@/prototype/pagination';

export type DentistSentReferralRow = {
  id: string;
  patientName: string;
  specialistDoctor: string;
  specialist: string;
  code: string;
  status: string;
  lastUpdate: string;
  urgency?: string;
};

type DentistSentReferralsSectionProps = {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  referrals: DentistSentReferralRow[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onReferralClick: (id: string) => void;
  onViewAll: () => void;
  allPatientsReceived?: boolean;
};

export function DentistSentReferralsSection({
  searchQuery,
  onSearchQueryChange,
  referrals,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onReferralClick,
  onViewAll,
  allPatientsReceived = false,
}: DentistSentReferralsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-2 text-black">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-black"></div>
          <h3 className="font-black uppercase text-sm tracking-widest italic">Patients Referred</h3>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="SEARCH PATIENTS..."
            className="wireframe-input pl-10 py-1.5 text-[9px] w-full sm:w-64"
          />
        </div>
      </div>

      <div className="space-y-3">
        {allPatientsReceived ? (
          <div className="wireframe-card p-6 text-center text-muted-foreground uppercase text-[10px] font-bold bg-gray-50 border-dashed border-2 border-black flex flex-col items-center justify-center gap-3">
            <span>All referred patients have been received</span>
            <button
              onClick={onViewAll}
              className="wireframe-button border-2 border-black bg-black text-white px-4 py-2 hover:bg-white hover:text-black transition-all font-black uppercase text-[10px]"
            >
              Go to Patients Section to Track Them
            </button>
          </div>
        ) : referrals.length === 0 ? (
          <div className="wireframe-card p-6 text-center text-muted-foreground uppercase text-[10px] font-bold bg-gray-50 border-dashed border-2 border-black">
            No referred patients found
          </div>
        ) : (
          referrals.map((referral) => (
            <div
              key={referral.id}
              className="wireframe-card p-4 hover:bg-gray-50 transition-all cursor-pointer text-black"
              onClick={() => onReferralClick(referral.id)}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black uppercase">{referral.patientName}</p>
                    {referral.urgency === 'Urgent' && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[8px] font-black uppercase px-1 py-0.5 rounded-sm shrink-0">Urgent</span>
                    )}
                    {referral.urgency === 'Emergency' && (
                      <span className="bg-red-100 text-red-900 border border-red-300 text-[8px] font-black uppercase px-1 py-0.5 rounded-sm shrink-0">Emergency</span>
                    )}
                  </div>
                  <p className="text-[8px] uppercase text-muted-foreground font-bold">{referral.code}</p>
                </div>
                <div className="md:col-span-4">
                  <p className="text-[10px] uppercase font-black">{referral.specialist}</p>
                  <p className="text-[9px] uppercase font-bold text-muted-foreground">Referred to: {referral.specialistDoctor}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="inline-block border border-black px-2 py-1 text-[8px] uppercase font-black">
                    {referral.status}
                  </span>
                </div>
                <div className="md:col-span-2 flex items-center justify-end gap-2 text-muted-foreground">
                  <span className="text-[9px] uppercase font-bold whitespace-pre-line text-right">{referral.lastUpdate}</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t-2 border-black pt-4 bg-white font-bold text-[10px] gap-4">
          <div className="flex items-center gap-3 text-muted-foreground uppercase font-black tracking-wider flex-wrap">
            <span>Page {currentPage} of {totalPages} ({totalItems} items)</span>
            <div className="flex items-center gap-1.5 text-black">
              <span className="font-normal lowercase">go to page:</span>
              <select
                value={currentPage}
                onChange={(event) => onPageChange(Number(event.target.value))}
                className="border-2 border-black bg-white px-1.5 py-0.5 font-black text-[9px] uppercase cursor-pointer hover:bg-black hover:text-white transition-all outline-none"
              >
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <option key={page} value={page} className="bg-white text-black">Page {page}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className="wireframe-button border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black shrink-0"
            >
              PREV
            </button>

            <div className="flex items-center gap-1">
              {getPrototypePageNumbers(currentPage, totalPages).map((page, index) => {
                if (page === '...') {
                  return <span key={`ellipsis-${index}`} className="w-6 h-6 flex items-center justify-center text-[9px] text-muted-foreground">...</span>;
                }
                return (
                  <button
                    key={`page-${page}`}
                    onClick={() => onPageChange(page)}
                    className={`w-6 h-6 flex items-center justify-center border-2 border-black transition-all text-[9px] ${
                      currentPage === page
                        ? 'bg-black text-white font-black'
                        : 'bg-white text-black hover:bg-black hover:text-white font-bold'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              className="wireframe-button border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black shrink-0"
            >
              NEXT
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onViewAll}
        className="text-[10px] font-black uppercase underline mt-2 block"
      >
        View all Referrals
      </button>
    </div>
  );
}
