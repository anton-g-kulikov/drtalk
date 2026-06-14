import { Search } from 'lucide-react';

export type DashboardAttachReferral = {
  id: string;
  patientName: string;
  detail: string;
};

type DashboardDocumentActionModalsProps = {
  mode: 'convert' | 'attach';
  documentName: string;
  convertPatientName: string;
  attachSearchQuery: string;
  attachReferrals: DashboardAttachReferral[];
  attachSearchPlaceholder: string;
  onPatientNameChange: (name: string) => void;
  onAttachSearchChange: (query: string) => void;
  onClose: () => void;
  onConfirmConvert: () => void;
  onConfirmAttach: (referralId: string) => void;
};

export function DashboardDocumentActionModals({
  mode,
  documentName,
  convertPatientName,
  attachSearchQuery,
  attachReferrals,
  attachSearchPlaceholder,
  onPatientNameChange,
  onAttachSearchChange,
  onClose,
  onConfirmConvert,
  onConfirmAttach,
}: DashboardDocumentActionModalsProps) {
  if (mode === 'convert') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white border-4 border-black max-w-md w-full p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200 text-black">
          <div className="flex justify-between items-center border-b-2 border-black pb-2">
            <h4 className="font-black uppercase text-sm tracking-tight italic text-black">Convert Document to Referral</h4>
            <button
              onClick={onClose}
              className="text-xs font-black uppercase hover:underline text-black"
            >
              Close
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-[8px] font-bold text-muted-foreground uppercase text-black">Source Document</p>
            <div className="p-3 border-2 border-black bg-zinc-50 font-mono text-[10px] break-all text-black">
              {documentName}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase block text-black">Patient Name</label>
              <input
                type="text"
                value={convertPatientName}
                onChange={(event) => onPatientNameChange(event.target.value)}
                className="wireframe-input w-full p-2 text-xs uppercase text-black"
                placeholder="PATIENT NAME..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onConfirmConvert}
              className="wireframe-button flex-1 bg-black text-white text-[10px] font-black uppercase py-3 hover:bg-zinc-800 transition-colors"
            >
              Create Referral
            </button>
            <button
              onClick={onClose}
              className="wireframe-button flex-1 bg-white text-black border-2 border-black text-[10px] font-black uppercase py-3 hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white border-4 border-black max-w-md w-full p-6 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200 text-black">
        <div className="flex justify-between items-center border-b-2 border-black pb-2">
          <h4 className="font-black uppercase text-sm tracking-tight italic text-black">Attach to Existing Referral</h4>
          <button
            onClick={onClose}
            className="text-xs font-black uppercase hover:underline text-black"
          >
            Close
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-[8px] font-bold text-muted-foreground uppercase text-black">Document to Attach</p>
          <div className="p-3 border-2 border-black bg-zinc-50 font-mono text-[10px] break-all text-black">
            {documentName}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[9px] font-black uppercase block text-black">Select Target Referral</label>

          <div className="relative">
            <input
              type="text"
              placeholder={attachSearchPlaceholder}
              value={attachSearchQuery}
              onChange={(event) => onAttachSearchChange(event.target.value)}
              className="wireframe-input w-full p-2 pl-8 text-xs uppercase text-black"
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            {attachSearchQuery && (
              <button
                onClick={() => onAttachSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase hover:underline text-black"
              >
                Clear
              </button>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1 border border-black/10 p-2 text-black">
            {attachReferrals.length === 0 ? (
              <p className="text-center text-[10px] uppercase font-bold text-muted-foreground py-6">No matching referrals found</p>
            ) : (
              attachReferrals.map((referral) => (
                <div
                  key={referral.id}
                  onClick={() => onConfirmAttach(referral.id)}
                  className="p-3 border-2 border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-all space-y-1"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-black uppercase text-xs">{referral.patientName}</p>
                  </div>
                  <p className="text-[8px] uppercase opacity-70">{referral.detail}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="wireframe-button w-full bg-white text-black border-2 border-black text-[10px] font-black uppercase py-3 hover:bg-zinc-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
