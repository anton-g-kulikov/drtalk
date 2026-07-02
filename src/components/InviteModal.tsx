import React, { useState, useEffect } from 'react';
import { UserPlus as UserPlusIcon, Mail as MailIcon, Phone as PhoneIcon } from 'lucide-react';

export function InviteModal({
  isOpen,
  onClose,
  onSuccess,
  defaultRole = 'Team Member',
  mode = 'colleague'
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (contact: string, practiceName?: string) => void;
  defaultRole?: string;
  mode?: 'colleague' | 'clinic';
}) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [practiceName, setPracticeName] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'sms'>('email');
  const [inviteText, setInviteText] = useState('');
  const [isInviteTextManuallyEdited, setIsInviteTextManuallyEdited] = useState(false);

  const getInviteDefaultText = (method: 'email' | 'sms', targetClinic: string) => {
    const target = targetClinic ? ` ${targetClinic}` : '';
    if (method === 'email') {
      return `Hi! We'd love to connect with your clinic${target} on drTalk to securely refer patients and collaborate. Join us here: https://drtalk.com/invite`;
    } else {
      return `Hi! Connect with us on drTalk${target} to securely refer patients. Sign up: https://drtalk.com/invite`;
    }
  };

  useEffect(() => {
    if (!isInviteTextManuallyEdited) {
      setInviteText(getInviteDefaultText(deliveryMethod, practiceName));
    }
  }, [deliveryMethod, practiceName, isInviteTextManuallyEdited]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contactInfo = deliveryMethod === 'email' ? email : phone;
    if (!contactInfo) return;
    onSuccess(contactInfo, mode === 'clinic' ? practiceName : undefined);
    setEmail('');
    setPhone('');
    setRole(defaultRole);
    setPracticeName('');
    setIsInviteTextManuallyEdited(false);
    onClose();
  };

  const isClinic = mode === 'clinic';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/95 backdrop-blur-sm p-4 text-black">
      <div className="w-full max-w-md bg-white border-4 border-black p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] space-y-8 animate-in zoom-in-95 duration-300">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-black rounded-full flex items-center justify-center mx-auto bg-gray-50">
            <UserPlusIcon size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
            {isClinic ? 'Invite a Clinic' : 'Invite to Practice'}
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
            {isClinic 
              ? 'Invite a clinical partner to connect and refer on drTalk.'
              : 'Send an invitation to join your practice network.'}
          </p>
        </div>

        {/* Delivery Method Tabs */}
        <div className="flex border-2 border-black divide-x-2 divide-black">
          <button
            type="button"
            onClick={() => setDeliveryMethod('email')}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${deliveryMethod === 'email' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
          >
            Email Invitation
          </button>
          <button
            type="button"
            onClick={() => setDeliveryMethod('sms')}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all ${deliveryMethod === 'sms' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
          >
            Text Message (SMS)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isClinic && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest block">
                Practice / Clinic Name
              </label>
              <input 
                type="text"
                required
                value={practiceName}
                onChange={(e) => setPracticeName(e.target.value)}
                placeholder="e.g. Oakwood Family Dental"
                className="wireframe-input w-full py-4 px-4 text-sm bg-transparent border-2 border-black"
              />
            </div>
          )}

          {deliveryMethod === 'email' ? (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <MailIcon size={12} /> {isClinic ? 'Contact Email' : 'Email Address'}
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isClinic ? "referrals@practice.com" : "colleague@practice.com"}
                className="wireframe-input w-full py-4 px-4 text-sm bg-transparent border-2 border-black"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <PhoneIcon size={12} /> {isClinic ? 'Contact Phone Number' : 'Phone Number'}
              </label>
              <input 
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(602) 555-0199"
                className="wireframe-input w-full py-4 px-4 text-sm bg-transparent border-2 border-black"
              />
            </div>
          )}

          {!isClinic && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest">Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="wireframe-input w-full py-4 px-4 text-sm appearance-none bg-transparent border-2 border-black"
              >
                <option value="Practice Admin">Practice Admin</option>
                <option value="Team Member">Team Member</option>
              </select>
            </div>
          )}

          {/* Editable preview text area */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest block">
              Invitation Message Preview
            </label>
            <textarea
              value={inviteText}
              onChange={(e) => {
                setInviteText(e.target.value);
                setIsInviteTextManuallyEdited(true);
              }}
              rows={4}
              className="wireframe-input w-full p-4 text-xs font-bold bg-transparent border-2 border-black resize-none focus:outline-none"
              placeholder="Type your message..."
            />
          </div>

          <div className="grid grid-cols-1 gap-3 pt-4">
            <button 
              type="submit"
              disabled={
                (deliveryMethod === 'email' && !email) || 
                (deliveryMethod === 'sms' && !phone) || 
                (isClinic && !practiceName)
              }
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
