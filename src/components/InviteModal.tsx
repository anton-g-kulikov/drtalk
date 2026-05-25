import React, { useState } from 'react';
import { UserPlus as UserPlusIcon, Mail as MailIcon } from 'lucide-react';

export function InviteModal({
  isOpen,
  onClose,
  onSuccess,
  defaultRole = 'Team Member'
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
  defaultRole?: string;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(defaultRole);
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSuccess(email);
    setEmail('');
    setRole(defaultRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white border-4 border-black p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] space-y-8 animate-in zoom-in-95 duration-300">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-black rounded-full flex items-center justify-center mx-auto bg-gray-50">
            <UserPlusIcon size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Invite to Practice</h2>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
            Send an invitation to join your practice network.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <MailIcon size={12} /> Email Address
            </label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@practice.com"
              className="wireframe-input w-full py-4 px-4 text-sm bg-transparent border-2 border-black"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest">Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="wireframe-input w-full py-4 px-4 text-sm appearance-none bg-transparent border-2 border-black"
            >
              <option value="Owner">Practice Owner</option>
              <option value="Practice Admin">Practice Admin</option>
              <option value="Team Member">Team Member</option>
              <option value="Specialist">Specialist / Colleague</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-4">
            <button 
              type="submit"
              disabled={!email}
              className="wireframe-button bg-black text-white py-4 uppercase text-sm font-black tracking-widest disabled:opacity-30"
            >
              Send Invitation
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="text-[10px] font-black uppercase underline py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
