"use client";

type SendDocumentPatientFieldsProps = {
  patientFirstName: string;
  patientLastName: string;
  patientDob: string;
  uploadMessage: string;
  onPatientFirstNameChange: (value: string) => void;
  onPatientLastNameChange: (value: string) => void;
  onPatientDobChange: (value: string) => void;
  onUploadMessageChange: (value: string) => void;
};

export function SendDocumentPatientFields({
  patientFirstName,
  patientLastName,
  patientDob,
  uploadMessage,
  onPatientFirstNameChange,
  onPatientLastNameChange,
  onPatientDobChange,
  onUploadMessageChange,
}: SendDocumentPatientFieldsProps) {
  return (
    <div className="border-t border-black pt-3 space-y-3">
      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
        Patient Information
      </span>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[10px] font-black uppercase block mb-1.5 text-black">Patient first name</span>
          <input
            type="text"
            placeholder="Enter patient first name"
            value={patientFirstName}
            onChange={(event) => onPatientFirstNameChange(event.target.value)}
            className="wireframe-input py-2 px-3 text-xs font-bold text-black border-black bg-white w-full focus:ring-0 focus:outline-none"
          />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase block mb-1.5 text-black">Patient last name</span>
          <input
            type="text"
            placeholder="Enter patient last name"
            value={patientLastName}
            onChange={(event) => onPatientLastNameChange(event.target.value)}
            className="wireframe-input py-2 px-3 text-xs font-bold text-black border-black bg-white w-full focus:ring-0 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <span className="text-[10px] font-black uppercase block mb-1.5 text-black">Date of birth</span>
        <div className="relative">
          <input
            type="text"
            placeholder="MM/DD/YYYY"
            value={patientDob}
            onChange={(event) => onPatientDobChange(event.target.value)}
            className="wireframe-input py-2 px-3 pr-10 text-xs font-bold text-black border-black bg-white w-full focus:ring-0 focus:outline-none"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <span className="text-[10px] font-black uppercase block mb-1.5 text-black">Message</span>
        <textarea
          placeholder="Enter message"
          value={uploadMessage}
          rows={2}
          onChange={(event) => onUploadMessageChange(event.target.value)}
          className="wireframe-input py-2 px-3 text-xs font-bold text-black border-black bg-white w-full resize-none focus:ring-0 focus:outline-none"
        />
      </div>
    </div>
  );
}
