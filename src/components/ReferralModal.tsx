import React, { useState } from 'react';
import { FileText, Plus, X, Upload, Check } from 'lucide-react';

export function ReferralModal({
  isOpen,
  onClose,
  onSuccess,
  practiceName
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (patientName: string) => void;
  practiceName: string;
}) {
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'Emergency'>('Routine');
  const [notes, setNotes] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [step, setStep] = useState<'form' | 'success'>('form');

  if (!isOpen) return null;

  const handleAddMockFile = () => {
    const mockFiles = ['pano_xray.png', 'clinical_notes.pdf', 'consent_form.pdf'];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setAttachedFiles(prev => [...prev, `${Date.now().toString().slice(-4)}_${randomFile}`]);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;
    setStep('success');
  };

  const handleDone = () => {
    onSuccess(patientName);
    // Reset states
    setPatientName('');
    setDob('');
    setPhone('');
    setUrgency('Routine');
    setNotes('');
    setAttachedFiles([]);
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/95 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border-4 border-black p-8 sm:p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] space-y-6 my-8 animate-in zoom-in-95 duration-300">
        
        {step === 'form' ? (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 border-4 border-black flex items-center justify-center mx-auto bg-gray-50">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">New Referral</h2>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
                Send secure patient referral to <span className="text-black font-black">{practiceName}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest">Patient Name</label>
                <input 
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="John Doe"
                  className="wireframe-input w-full py-2.5 px-3.5 text-xs bg-transparent border-2 border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest">Date of Birth</label>
                  <input 
                    type="text"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    placeholder="MM/DD/YYYY"
                    className="wireframe-input w-full py-2.5 px-3.5 text-xs bg-transparent border-2 border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="wireframe-input w-full py-2.5 px-3.5 text-xs bg-transparent border-2 border-black"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest">Urgency</label>
                <div className="flex gap-2">
                  {(['Routine', 'Urgent', 'Emergency'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      className={`flex-1 border-2 border-black py-2 text-[10px] font-bold uppercase transition-all ${
                        urgency === level ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest">Clinical Notes</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe reason for referral, specific teeth, or requirements..."
                  className="wireframe-input w-full py-2.5 px-3.5 text-xs bg-transparent border-2 border-black h-24 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest block">Attachments</label>
                <div 
                  onClick={handleAddMockFile}
                  className="border-2 border-black border-dashed p-4 text-center cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Upload size={14} />
                  <span className="text-[10px] font-bold uppercase">Click to Attach X-Ray or Document</span>
                </div>

                {attachedFiles.length > 0 && (
                  <div className="space-y-1.5 max-h-24 overflow-y-auto">
                    {attachedFiles.map((filename, i) => (
                      <div key={i} className="flex items-center justify-between border border-black p-2 bg-gray-50 text-[10px]">
                        <span className="font-medium truncate">{filename}</span>
                        <button type="button" onClick={() => handleRemoveFile(i)} className="text-red-600 hover:text-red-800">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2 pt-4">
                <button 
                  type="submit"
                  disabled={!patientName || !dob || !phone}
                  className="wireframe-button bg-black text-white py-3 uppercase text-xs font-black tracking-widest disabled:opacity-30"
                >
                  Submit Secure Referral
                </button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="text-[10px] font-black uppercase underline py-1.5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center space-y-6 py-6">
            <div className="w-16 h-16 border-4 border-black rounded-full flex items-center justify-center mx-auto bg-black text-white">
              <Check size={36} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">Referral Submitted!</h3>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
                Secure referral for <span className="text-black font-black">{patientName}</span> has been sent to <span className="text-black font-black">{practiceName}</span>.
              </p>
            </div>
            <button 
              onClick={handleDone}
              className="wireframe-button bg-black text-white w-full py-3 uppercase text-xs font-black tracking-widest"
            >
              Back to Directory
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
