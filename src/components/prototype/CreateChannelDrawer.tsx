"use client";

import React, { useState, useEffect } from 'react';
import { X, Info, Calendar, Upload, Check } from 'lucide-react';
import { LearningChannel } from '@/types/learningHubTypes';

interface CreateChannelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (channel: Omit<LearningChannel, 'id' | 'posts' | 'membersCount'>) => void;
}

export default function CreateChannelDrawer({ isOpen, onClose, onCreate }: CreateChannelDrawerProps) {
  const [step, setStep] = useState<1 | 2>(1);
  
  // Step 1 states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'public' | 'private'>('public');
  const [isMonetized, setIsMonetized] = useState(false);
  const [subscriptionCost, setSubscriptionCost] = useState('');
  const [ceCreditsEnabled, setCeCreditsEnabled] = useState(false);
  const [ceCreditHours, setCeCreditHours] = useState('2');
  const [onlyHostsCanPost, setOnlyHostsCanPost] = useState(true);
  const [category, setCategory] = useState('Case of the month');
  const [otherCategory, setOtherCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Step 2 states
  const [ownerBio, setOwnerBio] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [sponsorLogo, setSponsorLogo] = useState<string | null>(null);
  const [sponsor1Pager, setSponsor1Pager] = useState<string | null>(null);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [connectingStripe, setConnectingStripe] = useState(false);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setName('');
      setDescription('');
      setType('public');
      setIsMonetized(false);
      setSubscriptionCost('');
      setCeCreditsEnabled(false);
      setCeCreditHours('2');
      setOnlyHostsCanPost(true);
      setCategory('Case of the month');
      setOtherCategory('');
      setStartDate('');
      setEndDate('');
      setOwnerBio('');
      setThumbnail(null);
      setSponsorLogo(null);
      setSponsor1Pager(null);
      setStripeConnected(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Pricing calculations
  const costVal = parseFloat(subscriptionCost) || 0;
  const platformFee = costVal ? parseFloat((costVal * 0.14).toFixed(2)) : 0;
  // Stripe fee = 2.9% + $0.30 + 0.5% billing (which roughly matches the screenshot's $0.73 for $10)
  const stripeFee = costVal ? parseFloat((costVal * 0.029 + 0.30 + costVal * 0.005).toFixed(2)) : 0;
  const totalMonthlyCharge = costVal ? parseFloat((costVal + platformFee + stripeFee).toFixed(2)) : 0;

  const isStep1Valid = name.trim().length > 0 && 
    description.trim().length > 0 && 
    description.trim().length <= 200 &&
    (!isMonetized || costVal > 0) &&
    (!ceCreditsEnabled || (parseFloat(ceCreditHours) >= 0.5 && parseFloat(ceCreditHours) <= 100));

  const handleNext = () => {
    if (isStep1Valid) {
      setStep(2);
    }
  };

  const handleCreate = () => {
    onCreate({
      name,
      description,
      type,
      category: category === 'Other' && otherCategory ? otherCategory : category,
      otherCategory: category === 'Other' ? otherCategory : undefined,
      ownerBio,
      coverUrl: thumbnail || undefined,
      isMonetized,
      subscriptionCost: costVal,
      totalCharge: totalMonthlyCharge,
      platformFee,
      stripeFee,
      ceCreditsEnabled,
      ceCreditHours: ceCreditsEnabled ? parseFloat(ceCreditHours) : undefined,
      onlyHostsCanPost,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      stripeConnected: isMonetized ? stripeConnected : undefined
    });
    onClose();
  };

  const simulateStripeConnect = () => {
    setConnectingStripe(true);
    setTimeout(() => {
      setStripeConnected(true);
      setConnectingStripe(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white border-l-2 border-black h-screen flex flex-col z-10 animate-slide-in">
        {/* Header */}
        <div className="p-4 border-b-2 border-black flex items-center justify-between bg-black text-white">
          <div>
            <h3 className="font-black uppercase text-xs tracking-wider">New education channel</h3>
            <p className="text-[9px] uppercase opacity-75">Create a new public or private education channel.</p>
          </div>
          <button onClick={onClose} className="p-1 border border-white hover:bg-white hover:text-black transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 1 ? (
            <>
              {/* Channel Name */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider block">Channel Name</label>
                <input
                  type="text"
                  placeholder="Enter channel name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="wireframe-input text-xs font-bold"
                  maxLength={80}
                />
                <div className="text-right text-[8px] text-muted-foreground uppercase">{name.length}/80</div>
              </div>

              {/* Channel Description */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider block">Channel Description</label>
                <textarea
                  placeholder="Enter a Channel Description. This is what all channels will see as a preview before joining"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="wireframe-input text-xs font-bold h-20 resize-none"
                  maxLength={200}
                />
                <div className="text-right text-[8px] text-muted-foreground uppercase">{description.length}/200</div>
              </div>

              {/* Channel Type */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider block">Choose Channel Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('public')}
                    className={`wireframe-button text-[9px] uppercase py-2 ${type === 'public' ? 'bg-black text-white' : 'bg-white text-black'}`}
                  >
                    Public channel
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('private')}
                    className={`wireframe-button text-[9px] uppercase py-2 ${type === 'private' ? 'bg-black text-white' : 'bg-white text-black'}`}
                  >
                    Private channel
                  </button>
                </div>
              </div>

              {/* Monetization Toggle */}
              <div className="border-t border-black border-dashed pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black uppercase tracking-wider">Monetize your channel</span>
                    <TooltipText text="Enable monetization to earn from your channel through subscriptions.">
                      <Info size={10} className="cursor-help" />
                    </TooltipText>
                  </div>
                  <input
                    type="checkbox"
                    checked={isMonetized}
                    onChange={(e) => setIsMonetized(e.target.checked)}
                    className="accent-black h-4 w-4 border-2 border-black"
                  />
                </div>

                {isMonetized && (
                  <div className="space-y-2 pl-4 border-l-2 border-black/25">
                    <label className="text-[9px] font-black uppercase tracking-wider block">Set channel subscription price</label>
                    <input
                      type="number"
                      placeholder="Enter monthly subscription fee"
                      value={subscriptionCost}
                      onChange={(e) => setSubscriptionCost(e.target.value)}
                      className="wireframe-input text-xs font-bold"
                      min="0"
                    />
                    
                    <div className="space-y-1 text-[8px] uppercase font-bold text-muted-foreground pt-1">
                      <div className="flex justify-between">
                        <span>drTalk platform fee (14%):</span>
                        <span>${platformFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stripe processing fee:</span>
                        <span>${stripeFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-black/10 pt-1 text-black font-black text-[9px]">
                        <span>Monthly Total:</span>
                        <span>${totalMonthlyCharge.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CE Credits Toggle */}
              <div className="border-t border-black border-dashed pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-wider">CE Credits</span>
                  <input
                    type="checkbox"
                    checked={ceCreditsEnabled}
                    onChange={(e) => setCeCreditsEnabled(e.target.checked)}
                    className="accent-black h-4 w-4 border-2 border-black"
                  />
                </div>

                {ceCreditsEnabled && (
                  <div className="space-y-2 pl-4 border-l-2 border-black/25">
                    <label className="text-[9px] font-black uppercase tracking-wider block">CE Credit Hours</label>
                    <input
                      type="number"
                      placeholder="Enter hours"
                      value={ceCreditHours}
                      onChange={(e) => setCeCreditHours(e.target.value)}
                      className="wireframe-input text-xs font-bold"
                      min="0.5"
                      max="100"
                      step="0.5"
                    />
                    <p className="text-[7px] text-muted-foreground uppercase font-medium">Enter hours between 0.5 and 100.</p>
                  </div>
                )}
              </div>

              {/* Posting Permissions */}
              <div className="border-t border-black border-dashed pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider">Only hosts can post topics</span>
                  <TooltipText text="Control who can create new topics. When enabled, only hosts and co-hosts can post.">
                    <Info size={10} className="cursor-help" />
                  </TooltipText>
                </div>
                <input
                  type="checkbox"
                  checked={onlyHostsCanPost}
                  onChange={(e) => setOnlyHostsCanPost(e.target.checked)}
                  className="accent-black h-4 w-4 border-2 border-black"
                />
              </div>

              {/* Content Category */}
              <div className="border-t border-black border-dashed pt-4 space-y-2">
                <label className="text-[9px] font-black uppercase tracking-wider block">Choose content category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="wireframe-input text-xs font-bold uppercase bg-white cursor-pointer"
                >
                  <option value="Case of the month">Case of the month</option>
                  <option value="Case study">Case study</option>
                  <option value="Study group">Study group</option>
                  <option value="Virtual MRP">Virtual MRP</option>
                  <option value="Other">Other</option>
                </select>

                {category === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter category name"
                    value={otherCategory}
                    onChange={(e) => setOtherCategory(e.target.value)}
                    className="wireframe-input text-xs font-bold mt-2"
                    maxLength={50}
                  />
                )}
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-2 border-t border-black border-dashed pt-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase tracking-wider block">Start Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="wireframe-input text-[10px] font-bold pr-8"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase tracking-wider block">End Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="wireframe-input text-[10px] font-bold pr-8"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Channel Owner Bio */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider block">Channel Owner Bio - (optional)</label>
                <textarea
                  placeholder="Type here..."
                  value={ownerBio}
                  onChange={(e) => setOwnerBio(e.target.value)}
                  className="wireframe-input text-xs font-bold h-20 resize-none"
                  maxLength={200}
                />
              </div>

              {/* Channel Thumbnail */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider block">Channel Thumbnail - (optional)</label>
                <MockFileUploader
                  label="Upload Thumbnail"
                  onUpload={(url) => setThumbnail(url)}
                  value={thumbnail}
                />
              </div>

              {/* Sponsor Logo */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider block">Sponsor Logo - (optional)</label>
                <MockFileUploader
                  label="Upload Sponsor Logo"
                  onUpload={(url) => setSponsorLogo(url)}
                  value={sponsorLogo}
                />
              </div>

              {/* Sponsor 1-Pager */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider block">Sponsor 1-Pager - (optional)</label>
                <MockFileUploader
                  label="Upload Sponsor PDF"
                  onUpload={(url) => setSponsor1Pager(url)}
                  value={sponsor1Pager}
                />
              </div>

              {/* Stripe Connect Section */}
              {isMonetized && (
                <div className="wireframe-card border-dashed p-4 space-y-3 bg-gray-50">
                  <h4 className="text-[10px] font-black uppercase tracking-wider">Stripe onboarding</h4>
                  <p className="text-[8px] uppercase leading-relaxed text-muted-foreground font-bold">
                    We use Stripe to make sure you get paid on time and to keep your bank details secure.
                  </p>
                  {stripeConnected ? (
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-green-700 bg-green-50 p-2 border border-green-700">
                      <Check size={16} /> Stripe Connected Successfully
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={connectingStripe}
                      onClick={simulateStripeConnect}
                      className="w-full wireframe-button bg-black text-white text-[10px] uppercase py-2 flex items-center justify-center gap-2"
                    >
                      {connectingStripe ? 'Connecting to Stripe...' : 'Connect with Stripe'}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t-2 border-black flex gap-2 bg-gray-50">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 wireframe-button bg-white text-black text-[10px] uppercase py-2.5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStep1Valid}
                className="flex-1 wireframe-button bg-black text-white text-[10px] uppercase py-2.5 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 wireframe-button bg-white text-black text-[10px] uppercase py-2.5"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={isMonetized && !stripeConnected}
                className="flex-1 wireframe-button bg-black text-white text-[10px] uppercase py-2.5 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
              >
                Create Channel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline Sub-Components
function TooltipText({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 p-2 bg-black text-white text-[7px] uppercase font-bold leading-normal rounded-xs shadow-md z-50">
          {text}
        </div>
      )}
    </div>
  );
}

function MockFileUploader({ label, onUpload, value }: { label: string; onUpload: (url: string) => void; value: string | null }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      onUpload(`/assets/mock_${Date.now()}.png`);
      setUploading(false);
    }, 1000);
  };

  return (
    <div className="wireframe-card border-dashed p-3 flex flex-col items-center justify-center gap-2 bg-white">
      {value ? (
        <div className="text-center space-y-1">
          <div className="text-[8px] font-black uppercase text-green-700 bg-green-50 px-2 py-1 border border-green-500">File Selected</div>
          <button type="button" onClick={() => onUpload('')} className="text-[7px] uppercase font-bold underline hover:text-red-500">Remove</button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={handleUpload}
          className="text-[9px] uppercase font-black flex items-center gap-1.5 hover:underline"
        >
          <Upload size={12} /> {uploading ? 'Uploading...' : label}
        </button>
      )}
    </div>
  );
}
