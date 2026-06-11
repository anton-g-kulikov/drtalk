import { Download } from 'lucide-react';
import type { SharedDocument } from '@/prototype/channelTypes';

type ChannelDocumentPreviewOverlayProps = {
  document: SharedDocument;
  activePracticeName: string;
  onClose: () => void;
  onDownload: (document: SharedDocument) => void;
};

export function ChannelDocumentPreviewOverlay({
  document,
  activePracticeName,
  onClose,
  onDownload,
}: ChannelDocumentPreviewOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border-4 border-black p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col animate-slide-in">
        <div className="flex justify-between items-center pb-3 border-b-2 border-black mb-4">
          <div>
            <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-black text-white font-bold">Document Viewer</span>
            <h3 className="text-sm font-black uppercase tracking-tight mt-1 text-black">{document.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="wireframe-button px-2.5 py-1 text-[9px] font-bold uppercase bg-white text-black border-black hover:bg-black hover:text-white"
          >
            Close View
          </button>
        </div>

        <div className="flex-1 border-2 border-black bg-gray-50 p-4 flex items-center justify-center overflow-auto min-h-[300px]">
          {document.type === 'image' ? (
            <div className="w-full max-w-md bg-black p-4 border-2 border-white flex flex-col items-center">
              <div className="w-full flex justify-between text-[7px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-800 pb-1">
                <span>PATIENT: ALICE COOPER</span>
                <span>ID: DRT-9842</span>
                <span>PANO X-RAY</span>
              </div>

              <svg viewBox="0 0 400 200" className="w-full h-auto text-white">
                <path d="M 40 160 Q 200 200 360 160" fill="none" stroke="#333" strokeWidth="6" strokeDasharray="5,5" />

                <g transform="translate(0, 40)" fill="none" stroke="#eee" strokeWidth="2">
                  <path d="M 50 40 Q 60 5 70 40" />
                  <path d="M 75 40 Q 85 5 95 40" />
                  <path d="M 100 40 Q 110 5 120 40" />
                  <path d="M 125 40 Q 135 5 145 40" />
                  <g className="animate-pulse">
                    <path d="M 150 40 Q 160 5 170 40" stroke="#ff3333" strokeWidth="3" />
                    <circle cx="160" cy="15" r="8" fill="rgba(255, 0, 0, 0.2)" stroke="#ff3333" strokeWidth="1" />
                    <line x1="160" y1="15" x2="200" y2="-10" stroke="#ff3333" strokeWidth="1" strokeDasharray="2,2" />
                    <text x="205" y="-6" fill="#ff3333" fontSize="8" fontFamily="monospace" fontWeight="bold">TOOTH #14 APICAL LESION</text>
                  </g>
                  <path d="M 175 40 Q 185 5 195 40" />
                  <path d="M 205 40 Q 215 5 225 40" />
                  <path d="M 230 40 Q 240 5 250 40" />
                  <path d="M 255 40 Q 265 5 275 40" />
                  <path d="M 280 40 Q 290 5 300 40" />
                  <path d="M 305 40 Q 315 5 325 40" />
                  <path d="M 330 40 Q 340 5 350 40" />
                </g>

                <g transform="translate(0, 110)" fill="none" stroke="#eee" strokeWidth="2">
                  <path d="M 50 0 Q 60 35 70 0" />
                  <path d="M 75 0 Q 85 35 95 0" />
                  <path d="M 100 0 Q 110 35 120 0" />
                  <path d="M 125 0 Q 135 35 145 0" />
                  <path d="M 150 0 Q 160 35 170 0" />
                  <path d="M 175 0 Q 185 35 195 0" />
                  <path d="M 205 0 Q 215 35 225 0" />
                  <path d="M 230 0 Q 240 35 250 0" />
                  <path d="M 255 0 Q 265 35 275 0" />
                  <path d="M 280 0 Q 290 35 300 0" />
                  <path d="M 305 0 Q 315 35 325 0" />
                  <path d="M 330 0 Q 340 35 350 0" />
                </g>
              </svg>

              <div className="w-full text-center text-[7px] text-gray-500 font-bold uppercase mt-3">
                Valley Endodontics • Digital Radiograph System v4.1
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md bg-white p-6 border-2 border-black text-black">
              <div className="text-center pb-4 border-b-2 border-black mb-4">
                <h4 className="text-xs font-black uppercase tracking-widest">DRTALK SECURE PATIENT REFERRAL</h4>
                <p className="text-[7px] font-bold text-muted-foreground uppercase">CLINICAL DOCUMENTATION PORTAL</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[8px] uppercase mb-4">
                <div className="space-y-1.5">
                  <p><span className="font-bold text-gray-500">FROM PRACTICE:</span> {activePracticeName === 'Valley Endodontics' ? 'Beverly Hills Dental' : 'Valley Endodontics'}</p>
                  <p><span className="font-bold text-gray-500">TO PRACTICE:</span> {activePracticeName}</p>
                  <p><span className="font-bold text-gray-500">PROVIDER NPI:</span> 1982736450</p>
                </div>
                <div className="space-y-1.5">
                  <p><span className="font-bold text-gray-500">PATIENT NAME:</span> Alice Cooper</p>
                  <p><span className="font-bold text-gray-500">DOB:</span> 12/04/1978</p>
                  <p><span className="font-bold text-gray-500">DATE CREATED:</span> {document.sentAt}</p>
                </div>
              </div>

              <div className="border border-black p-3 space-y-2 mb-4 bg-gray-50">
                <p className="text-[8px] font-black uppercase">REASON FOR REFERRAL:</p>
                <p className="text-[8px] leading-relaxed italic text-gray-700">
                  &quot;Patient presents with lingering thermal sensitivity and percussion pain in upper left quadrant. Pano shows potential apical radiolucency on Tooth #14. Please evaluate for endodontic retreatment.&quot;
                </p>
              </div>

              <div className="border border-black p-3 space-y-2 bg-gray-50">
                <p className="text-[8px] font-black uppercase">REQUIRED PROCEDURES:</p>
                <div className="flex gap-4 text-[8px] font-bold">
                  <label className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 border border-black bg-black flex items-center justify-center"><div className="w-1 h-1 bg-white" /></div>
                    <span>Evaluation</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 border border-black bg-black flex items-center justify-center"><div className="w-1 h-1 bg-white" /></div>
                    <span>Root Canal Retreatment</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 border border-black" />
                    <span>Apicoectomy</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-3 border-t border-black text-[7px] font-bold text-gray-500 uppercase">
                <span>DIGITALLY SIGNED VIA DRTALK SECURE AUTH</span>
                <span>STATUS: VALIDATED PHI</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-[8px] font-bold text-muted-foreground uppercase">
            File details: {document.size} • {document.type.toUpperCase()} Format • Secure Storage ID: {document.id}
          </span>
          <button
            onClick={() => onDownload(document)}
            className="wireframe-button bg-black text-white text-[9px] uppercase px-4 py-1.5 flex items-center gap-1.5 font-bold"
          >
            <Download size={10} /> Download File
          </button>
        </div>
      </div>
    </div>
  );
}
