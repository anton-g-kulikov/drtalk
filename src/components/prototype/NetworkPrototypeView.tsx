"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Download,
  Globe,
  Filter,
  MapPin,
  MessageCircle,
  Phone,
  Navigation,
  Printer,
  Search,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Users,
  MoreHorizontal,
} from 'lucide-react';
import { MainLayout } from '@/components/MainLayout';
import { CommentMarker } from '@/components/Comments/CommentMarker';
import { InviteModal } from '@/components/InviteModal';
import { getNetwork, saveNetwork, type NetworkPractice, getConnectionRequests, saveConnectionRequests, type ConnectionRequest, getFullAddress, getMockDistance } from '@/lib/referrals';
import { ConnectionRequestBanner } from '@/components/prototype/ConnectionRequestBanner';
import {
  dentistAnalytics,
  networkRoleConfigs,
  specialistAnalytics,
  GLOBAL_PRACTICE_TYPES,
  type NetworkRole,
  type NetworkRoleConfig,
  type NetworkTab,
  type NetworkTimeRange,
} from '@/prototype/networkFixtures';

function NetworkAnalytics({ config }: { config: NetworkRoleConfig }) {
  const [timeRange, setTimeRange] = useState<NetworkTimeRange>('month');
  const data = config.role === 'dentist' ? dentistAnalytics[timeRange] : specialistAnalytics[timeRange];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <h3 className="text-xl font-black uppercase italic tracking-tighter">Network Performance</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as NetworkTimeRange)}
              className="wireframe-input py-2 pl-4 pr-10 text-[10px] font-black uppercase appearance-none bg-white cursor-pointer hover:bg-gray-50 focus:outline-none h-10 border-2 border-black"
            >
              <option value="day">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown size={14} className="text-black" />
            </div>
          </div>
          <button type="button" onClick={() => alert('Downloading network report as CSV...')} className="wireframe-button h-10 w-10 p-0 border-2 border-black bg-white hover:bg-black hover:text-white transition-all flex items-center justify-center text-black" title="Download CSV">
            <Download size={20} />
          </button>
          <button type="button" onClick={() => window.print()} className="wireframe-button h-10 w-10 p-0 border-2 border-black bg-white hover:bg-black hover:text-white transition-all flex items-center justify-center text-black" title="Print PDF">
            <Printer size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label={config.analyticsPrimaryLabel} value={data.totalPrimary} icon={<ArrowUpRight size={16} className="text-black" />} trend={data.totalPrimary % 10 - 2} />
        <MetricCard label="Scheduled" value={data.totalScheduled} icon={<CheckCircle2 size={16} className="text-black" />} trend={data.totalScheduled % 8 - 1} />
        <MetricCard label={config.analyticsConversionLabel} value={`${data.conversionRate}%`} icon={<TrendingUp size={16} className="text-black" />} trend={data.conversionRate % 5 - 1} />
        <MetricCard label="Released" value={data.totalReleased} icon={<Users size={16} className="text-black" />} trend={data.totalReleased % 12 - 3} />
      </div>

      <div className="wireframe-card overflow-hidden">
        <div className="p-4 border-b-2 border-black bg-gray-50 flex items-center justify-between">
          <h4 className="font-bold uppercase text-sm">{config.analyticsBreakdownTitle}</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-black text-[10px] uppercase bg-white">
                <th className="p-4 font-black">Practice Name</th>
                <th className="p-4 font-black text-right">{config.analyticsBreakdownPrimaryLabel}</th>
                <th className="p-4 font-black text-right">Scheduled</th>
                <th className="p-4 font-black">{config.analyticsBreakdownConversionLabel}</th>
                <th className="p-4 font-black text-right">Released</th>
              </tr>
            </thead>
            <tbody>
              {data.breakdown.map((row, idx) => (
                <tr key={row.id} className={`text-sm ${idx !== data.breakdown.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-gray-50 transition-colors bg-white`}>
                  <td className="p-4 font-bold">{row.name}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1.5 font-medium">
                      <span>{row.primary}</span>
                      <span className={`flex items-center text-[9px] font-bold px-1 py-0.5 ${row.primary % 5 - 1 > 0 ? 'text-green-700 bg-green-50' : row.primary % 5 - 1 < 0 ? 'text-red-700 bg-red-50' : 'text-gray-600 bg-gray-100'}`}>
                        {row.primary % 5 - 1 > 0 ? <TrendingUp size={10} /> : row.primary % 5 - 1 < 0 ? <TrendingDown size={10} /> : null}
                        {Math.abs(row.primary % 5 - 1)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1.5 font-medium">
                      <span>{row.scheduled}</span>
                      <span className={`flex items-center text-[9px] font-bold px-1 py-0.5 ${row.scheduled % 6 - 2 > 0 ? 'text-green-700 bg-green-50' : row.scheduled % 6 - 2 < 0 ? 'text-red-700 bg-red-50' : 'text-gray-600 bg-gray-100'}`}>
                        {row.scheduled % 6 - 2 > 0 ? <TrendingUp size={10} /> : row.scheduled % 6 - 2 < 0 ? <TrendingDown size={10} /> : null}
                        {Math.abs(row.scheduled % 6 - 2)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-none border border-black overflow-hidden flex-1 max-w-[120px]">
                        <div className="h-full bg-black" style={{ width: `${row.conversion}%` }} />
                      </div>
                      <span className="text-[10px] font-bold">{row.conversion}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1.5 font-medium">
                      <span>{row.released}</span>
                      <span className={`flex items-center text-[9px] font-bold px-1 py-0.5 ${row.released % 7 - 3 > 0 ? 'text-green-700 bg-green-50' : row.released % 7 - 3 < 0 ? 'text-red-700 bg-red-50' : 'text-gray-600 bg-gray-100'}`}>
                        {row.released % 7 - 3 > 0 ? <TrendingUp size={10} /> : row.released % 7 - 3 < 0 ? <TrendingDown size={10} /> : null}
                        {Math.abs(row.released % 7 - 3)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, trend }: { label: string; value: React.ReactNode; icon: React.ReactNode; trend?: number }) {
  return (
    <div className="wireframe-card p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold uppercase text-muted-foreground">{label}</span>
        {icon}
      </div>
      <div className="flex items-center gap-2">
        <div className="text-4xl font-black">{value}</div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 ${trend > 0 ? 'text-green-700 bg-green-50' : trend < 0 ? 'text-red-700 bg-red-50' : 'text-gray-600 bg-gray-100'}`}>
            {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : null}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}

function PracticeCard({
  activeTab,
  config,
  practice,
  showToast,
  onDismiss,
  onRemoveConnection,
  isHighlighted,
}: {
  activeTab: NetworkTab;
  config: NetworkRoleConfig;
  practice: NetworkPractice;
  showToast: (message: string) => void;
  onDismiss?: () => void;
  onRemoveConnection?: () => void;
  isHighlighted?: boolean;
}) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!showMenu) return;
    const closeMenu = () => setShowMenu(false);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const handleDentistPrimaryAction = () => {
    if (practice.status === 'Connected' || activeTab !== 'directory') {
      router.push(`/dentist/referral?practice=${encodeURIComponent(practice.name)}`);
      return;
    }
    showToast(`Connection request sent to ${practice.name}`);
  };

  return (
    <div
      data-practice-id={practice.id}
      className={`wireframe-card group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all overflow-hidden flex flex-col h-full ${
        practice.isExternal && config.role === 'specialist' ? 'border-dashed' : ''
      } ${isHighlighted ? 'ring-2 ring-offset-2 ring-black animate-pulse' : ''}`}
    >
      <div
        onClick={() => {
          const path = config.role === 'dentist'
            ? `/dentist/network/practice/${practice.id}`
            : `/network/practice/${practice.id}`;
          router.push(path);
        }}
        className="p-6 space-y-4 flex-1 cursor-pointer hover:bg-zinc-50/50 transition-colors"
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col items-start gap-2">
            <div className={`w-12 h-12 border-2 border-black flex items-center justify-center transition-all ${practice.isExternal && config.role === 'specialist' ? 'bg-gray-100 group-hover:bg-gray-200' : 'bg-gray-50 group-hover:bg-black group-hover:text-white'}`}>
              <Building2 size={24} />
            </div>
            {practice.isExternal && (
              <span className="text-[7px] font-black uppercase px-1.5 py-0.5 bg-white text-black border border-black whitespace-nowrap">
                External / Fax / Email
              </span>
            )}
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {practice.status !== 'Connected' && (
              <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 border border-black bg-transparent text-black">
                  {practice.status === 'Nearby' ? 'Suggested (Nearby)' : practice.status}
                </span>
              </div>
            )}

            {practice.status === 'Connected' && onRemoveConnection && (
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1 hover:bg-zinc-100 border border-transparent hover:border-black transition-all flex items-center justify-center text-black"
                  title="Practice Actions"
                  aria-label="Practice Actions"
                >
                  <MoreHorizontal size={14} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1 z-10 bg-white border-2 border-black py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-32 text-[8px] font-black uppercase text-black">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        if (typeof window !== 'undefined' && window.confirm && !window.confirm(`Are you sure you want to remove the connection with ${practice.name}?`)) {
                          return;
                        }
                        onRemoveConnection();
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-black hover:text-white transition-all text-red-600 hover:text-white"
                    >
                      Remove Connection
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-black uppercase text-sm tracking-tight">{practice.name}</h3>
            {practice.verified && <ShieldCheck size={14} className="text-black" />}
          </div>
          <p className="text-[10px] font-bold uppercase text-muted-foreground">{practice.specialty}</p>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin size={12} className="shrink-0 mt-0.5" />
            <span className="text-[9px] font-bold uppercase leading-tight">
              {getFullAddress(practice.location)}
            </span>
          </div>
          {(activeTab === 'directory' || activeTab === 'connected') && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Navigation size={12} className="shrink-0" />
              <span className="text-[9px] font-bold uppercase">
                {getMockDistance(practice.id)} mi
              </span>
            </div>
          )}
          {practice.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone size={12} className="shrink-0" />
              <span className="text-[9px] font-bold uppercase">{practice.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground hover:text-black transition-colors" onClick={(e) => e.stopPropagation()}>
            <Globe size={12} className="shrink-0" />
            <a 
              href={`https://www.${practice.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-bold lowercase hover:underline break-all"
            >
              www.{practice.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
            </a>
          </div>
        </div>
      </div>

      <div className="p-4 border-t-2 border-black flex gap-2 bg-gray-50/50">
        {config.role === 'dentist' ? (
          practice.status === 'Connected' ? (
            <>
              <button onClick={handleDentistPrimaryAction} className="flex-1 wireframe-button bg-black text-white text-[9px] uppercase py-2 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all font-black">
                Send Referral
              </button>
              <Link href={`/dentist/channels?practice=${encodeURIComponent(practice.name)}`} className="flex-1 wireframe-button bg-white text-black text-[9px] uppercase py-2 flex items-center justify-center gap-2 hover:bg-zinc-50 border-2 border-black transition-all font-black">
                <MessageCircle size={14} />
                {practice.isExternal ? 'Send Secure Message' : 'Chat Now'}
              </Link>
            </>
          ) : (
            <>
              <button onClick={handleDentistPrimaryAction} className="flex-1 wireframe-button bg-black text-white text-[9px] uppercase py-2 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all font-black">
                {activeTab === 'directory' ? 'Connect' : 'Refer & Connect'}
              </button>
              {activeTab === 'directory' && (practice.status === 'Nearby' || practice.status === 'Suggested') && onDismiss && (
                <button onClick={onDismiss} className="wireframe-button bg-white text-black text-[9px] uppercase py-2 px-3 border-2 border-black hover:bg-gray-100 transition-all font-black">
                  Dismiss
                </button>
              )}
            </>
          )
        ) : (
          <>
            {activeTab === 'directory' && (practice.status === 'Nearby' || practice.status === 'Suggested') ? (
              <>
                <button
                  onClick={() => {
                    showToast(`Connection request sent to ${practice.name}`);
                  }}
                  className="flex-1 wireframe-button bg-black text-white text-[9px] uppercase py-2 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all font-black"
                >
                  Connect
                </button>
                {onDismiss && (
                  <button onClick={onDismiss} className="wireframe-button bg-white text-black text-[9px] uppercase py-2 px-3 border-2 border-black hover:bg-gray-100 transition-all font-black">
                    Dismiss
                  </button>
                )}
              </>
            ) : (
              <>
                <Link href={`/channels?practice=${encodeURIComponent(practice.name)}`} className={`flex-1 wireframe-button text-[9px] uppercase py-2 flex items-center justify-center gap-2 transition-all font-black ${practice.isExternal ? 'bg-white text-black hover:bg-gray-100 border-2 border-black' : 'bg-black text-white hover:bg-zinc-800'}`}>
                  <MessageCircle size={14} />
                  {practice.isExternal ? 'Send Secure Message' : 'Chat Now'}
                </Link>
                {activeTab === 'directory' && (practice.status === 'Nearby' || practice.status === 'Suggested') && onDismiss && (
                  <button onClick={onDismiss} className="wireframe-button bg-white text-black text-[9px] uppercase py-2 px-3 border-2 border-black hover:bg-gray-100 transition-all font-black">
                    Dismiss
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function InvitePlaceholder({ config, onInvite }: { config: NetworkRoleConfig; onInvite: () => void }) {
  return (
    <div className="wireframe-card border-dashed bg-gray-50/30 flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="w-16 h-16 rounded-full border-2 border-black border-dashed flex items-center justify-center">
        <UserPlus size={24} className="text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h4 className="font-bold uppercase text-xs tracking-tight">{config.inviteTitle}</h4>
        <p className="text-[8px] uppercase text-muted-foreground leading-relaxed">{config.inviteCopy}</p>
      </div>
      <button onClick={onInvite} className="text-[10px] font-black uppercase underline hover:text-black">
        Send Invitation
      </button>
    </div>
  );
}



export function NetworkPrototypeView({ role }: { role: NetworkRole }) {
  const router = useRouter();
  const config = networkRoleConfigs[role];
  const [activeTab, setActiveTab] = useState<NetworkTab>('analytics');
  const [directoryFilter, setDirectoryFilter] = useState<'all' | 'nearby'>('nearby');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [networkList, setNetworkList] = useState<NetworkPractice[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);

  const [selectedState, setSelectedState] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedRadius, setSelectedRadius] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [highlightPracticeId, setHighlightPracticeId] = useState<string | null>(null);

  useEffect(() => {
    setNetworkList(getNetwork());
    setConnectionRequests(getConnectionRequests());
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const highlightParam = params.get('highlight');
    const toastParam = params.get('toast');

    if (toastParam) {
      showToast(toastParam);
      // clean up URL to remove toast param
      const cleanSearch = window.location.search.replace(/[?&]toast=[^&]+/, '').replace(/^&/, '?');
      window.history.replaceState({}, '', window.location.pathname + cleanSearch);
    }

    if (tabParam === 'directory' || tabParam === 'connected' || tabParam === 'analytics') {
      const timer = setTimeout(() => setActiveTab(tabParam), 0);
      if (highlightParam) {
        // Show all practices so the highlighted card is always visible
        setDirectoryFilter('all');
        setHighlightPracticeId(highlightParam);
        setTimeout(() => setHighlightPracticeId(null), 2500);
      }
      return () => clearTimeout(timer);
    }
  }, []);

  const cities = React.useMemo(() => {
    const list = new Set<string>();
    networkList.forEach((p) => {
      if (p.location && p.location.includes(',')) {
        list.add(p.location.split(',')[0].trim());
      }
    });
    return Array.from(list).sort();
  }, [networkList]);

  const states = React.useMemo(() => {
    const list = new Set<string>();
    networkList.forEach((p) => {
      if (p.location && p.location.includes(',')) {
        list.add(p.location.split(',')[1].trim());
      }
    });
    return Array.from(list).sort();
  }, [networkList]);

  const types = GLOBAL_PRACTICE_TYPES;

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Scroll to the highlighted practice card after the grid renders
  useEffect(() => {
    if (!highlightPracticeId) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-practice-id="${highlightPracticeId}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150); // small delay lets the grid paint first
    return () => clearTimeout(timer);
  }, [highlightPracticeId]);

  const handleAcceptConnectionRequest = (request: ConnectionRequest) => {
    const updatedRequests = connectionRequests.filter(r => r.id !== request.id);
    setConnectionRequests(updatedRequests);
    saveConnectionRequests(updatedRequests);
    const newPractice: NetworkPractice = {
      id: request.fromPracticeId,
      name: request.fromPracticeName,
      type: 'Dentist',
      specialty: request.fromSpecialty,
      location: request.fromLocation,
      status: 'Connected',
      verified: true,
    };
    const updatedNetwork = [...networkList.filter(p => p.id !== request.fromPracticeId), newPractice];
    setNetworkList(updatedNetwork);
    saveNetwork(updatedNetwork);
    showToast(`Connected with ${request.fromPracticeName} — inter-practice channel created`);
  };

  const handleDeclineConnectionRequest = (requestId: string) => {
    const updatedRequests = connectionRequests.filter(r => r.id !== requestId);
    setConnectionRequests(updatedRequests);
    saveConnectionRequests(updatedRequests);
    showToast('Connection request declined');
  };

  const handleDismiss = (practiceId: string) => {
    const updated = networkList.map((p) => {
      if (p.id === practiceId) {
        return { ...p, dismissed: true };
      }
      return p;
    });
    setNetworkList(updated);
    saveNetwork(updated);
    showToast("Suggestion dismissed");
  };

  const handleRemoveConnection = (practiceId: string) => {
    const practice = networkList.find(p => p.id === practiceId);
    if (!practice) return;
    const updated = networkList.map((p) => {
      if (p.id === practiceId) {
        return { ...p, status: (p.isExternal ? 'Suggested' : 'Nearby') as any };
      }
      return p;
    });
    setNetworkList(updated);
    saveNetwork(updated);
    showToast(`Connection removed with ${practice.name}`);
  };

  const hasActiveFilters = selectedState !== 'All' || selectedCity !== 'All' || selectedRadius !== 'All' || selectedType !== 'All';

  const filteredNetwork = networkList.filter((practice) => {
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = practice.name.toLowerCase().includes(searchStr) || practice.specialty.toLowerCase().includes(searchStr);
    if (!matchesSearch) return false;

    // Apply filters if we're on the directory or connected tab
    if (activeTab === 'directory' || activeTab === 'connected') {
      if (selectedType !== 'All' && practice.type !== selectedType) return false;
      if (activeTab === 'directory' && config.role === 'dentist' && practice.type !== 'Specialist') return false;

      // State filter
      if (selectedState !== 'All') {
        const statePart = practice.location?.split(',')?.[1]?.trim() || '';
        if (statePart !== selectedState) return false;
      }

      // City filter
      if (selectedCity !== 'All') {
        const cityPart = practice.location?.split(',')?.[0]?.trim() || '';
        if (cityPart !== selectedCity) return false;
      }

      // Radius filter
      if (selectedRadius !== 'All') {
        const distance = getMockDistance(practice.id);
        const radiusVal = parseInt(selectedRadius, 10);
        if (distance > radiusVal) return false;
      }
    }

    if (activeTab === 'connected' && practice.status !== 'Connected') return false;
    if (activeTab === 'directory') {
      if (practice.status === 'Connected') return false;
      if (config.role === 'specialist' && practice.isExternal) return false;
      if (directoryFilter === 'nearby') {
        if (practice.dismissed) return false;
        if (practice.status !== 'Nearby' && practice.status !== 'Suggested') return false;
      }
    }
    return true;
  });

  const onPlatform = filteredNetwork.filter((practice) => !practice.isExternal);
  const external = filteredNetwork.filter((practice) => practice.isExternal);

  return (
    <MainLayout title={config.layoutTitle}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">{config.heading}</h2>
              <CommentMarker id={config.markerId} title={config.markerTitle} description={config.markerDescription} />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{config.subtitle}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            <button
              onClick={() => router.push(role === 'dentist' ? '/dentist/network/invite' : '/network/invite')}
              className="wireframe-button bg-black text-white text-[10px] uppercase px-6 py-2.5 flex items-center justify-center gap-2 w-full sm:w-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black border-2 border-black transition-all font-black"
            >
              Invite Clinic <UserPlus size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b-2 border-black">
            <div className="flex overflow-x-auto no-scrollbar -mb-[2px]">
              {(['analytics', 'connected', 'directory'] as NetworkTab[]).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 sm:px-8 py-4 text-[11px] font-bold uppercase transition-all relative whitespace-nowrap ${activeTab === tab ? 'bg-black text-white' : 'text-muted-foreground hover:text-black hover:bg-zinc-50'}`}>
                  {tab === 'analytics' ? 'Analytics' : tab === 'connected' ? 'My Network' : 'Connect&Grow'}
                </button>
              ))}
            </div>
          </div>

          {(activeTab === 'directory' || activeTab === 'connected') && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
                <div className="relative flex-1 max-w-xl">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={config.searchPlaceholder}
                    className="wireframe-input pl-10 py-2.5 text-[10px] w-full shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`wireframe-button flex items-center justify-center gap-2 px-6 py-2.5 text-[10px] uppercase font-bold transition-colors h-10 w-full md:w-auto border-2 border-black ${
                    showFilters || hasActiveFilters ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  <Filter size={14} /> Filters {hasActiveFilters && '•'}
                </button>
              </div>

              {showFilters && (
                <div className="wireframe-card p-5 border-2 border-black bg-zinc-50 flex flex-col md:flex-row gap-6 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                    {/* Type */}
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-wider text-muted-foreground block" htmlFor="network-type-filter">Practice Type</label>
                      <select
                        id="network-type-filter"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="wireframe-input py-1.5 px-3 text-[10px] uppercase w-full bg-white h-9 border border-black focus:outline-none"
                      >
                        <option value="All">All Types</option>
                        {types.map((ty) => (
                          <option key={ty} value={ty}>{ty}</option>
                        ))}
                      </select>
                    </div>

                    {/* Radius */}
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-wider text-muted-foreground block" htmlFor="network-radius-filter">Radius</label>
                      <select
                        id="network-radius-filter"
                        value={selectedRadius}
                        onChange={(e) => setSelectedRadius(e.target.value)}
                        className="wireframe-input py-1.5 px-3 text-[10px] uppercase w-full bg-white h-9 border border-black focus:outline-none"
                      >
                        <option value="All">All Distances</option>
                        <option value="5">Within 5 miles</option>
                        <option value="10">Within 10 miles</option>
                        <option value="25">Within 25 miles</option>
                        <option value="50">Within 50 miles</option>
                      </select>
                    </div>

                    {/* State */}
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-wider text-muted-foreground block" htmlFor="network-state-filter">State</label>
                      <select
                        id="network-state-filter"
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="wireframe-input py-1.5 px-3 text-[10px] uppercase w-full bg-white h-9 border border-black focus:outline-none"
                      >
                        <option value="All">All States</option>
                        {states.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase tracking-wider text-muted-foreground block" htmlFor="network-city-filter">City</label>
                      <select
                        id="network-city-filter"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="wireframe-input py-1.5 px-3 text-[10px] uppercase w-full bg-white h-9 border border-black focus:outline-none"
                      >
                        <option value="All">All Cities</option>
                        {cities.map((ct) => (
                          <option key={ct} value={ct}>{ct}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <div className="flex items-end shrink-0">
                      <button
                        onClick={() => {
                          setSelectedState('All');
                          setSelectedCity('All');
                          setSelectedRadius('All');
                          setSelectedType('All');
                        }}
                        className="wireframe-button px-4 py-2 text-[10px] uppercase font-bold border-red-200 text-red-600 hover:bg-red-50 h-9 shrink-0"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'analytics' ? (
            <NetworkAnalytics config={config} />
          ) : (
            <div className="space-y-6">
              {activeTab === 'directory' && (
                <div className="flex gap-2">
                  <button onClick={() => setDirectoryFilter('all')} className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-wider border-2 border-black transition-all ${directoryFilter === 'all' ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-gray-50'}`}>
                    {config.directoryAllLabel}
                  </button>
                  <button onClick={() => setDirectoryFilter('nearby')} className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-wider border-2 border-black transition-all ${directoryFilter === 'nearby' ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-gray-50'}`}>
                    Suggested (Nearby)
                  </button>
                </div>
              )}

              {config.role === 'specialist' && activeTab === 'connected' ? (
                <div className="space-y-10">
                  <ConnectionRequestBanner
                    requests={connectionRequests}
                    onAccept={handleAcceptConnectionRequest}
                    onDecline={handleDeclineConnectionRequest}
                    mode="inline"
                  />
                  <NetworkSection label={`On-Platform (${onPlatform.length})`}>
                    {onPlatform.map((practice) => (
                      <PracticeCard
                        key={practice.id}
                        activeTab={activeTab}
                        config={config}
                        practice={practice}
                        showToast={showToast}
                        onDismiss={() => handleDismiss(practice.id)}
                        onRemoveConnection={() => handleRemoveConnection(practice.id)}
                        isHighlighted={highlightPracticeId === practice.id}
                      />
                    ))}
                  </NetworkSection>
                  {external.length > 0 && (
                    <NetworkSection label={`External — Fax / Email (${external.length})`} trailing="Off-platform · Secure Email transport">
                      {external.map((practice) => (
                        <PracticeCard
                          key={practice.id}
                          activeTab={activeTab}
                          config={config}
                          practice={practice}
                          showToast={showToast}
                          onDismiss={() => handleDismiss(practice.id)}
                          onRemoveConnection={() => handleRemoveConnection(practice.id)}
                          isHighlighted={highlightPracticeId === practice.id}
                        />
                      ))}
                    </NetworkSection>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {activeTab === 'connected' && (
                    <ConnectionRequestBanner
                      requests={connectionRequests}
                      onAccept={handleAcceptConnectionRequest}
                      onDecline={handleDeclineConnectionRequest}
                      mode="inline"
                    />
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNetwork.map((practice) => (
                    <PracticeCard
                      key={practice.id}
                      activeTab={activeTab}
                      config={config}
                      practice={practice}
                      showToast={showToast}
                      onDismiss={() => handleDismiss(practice.id)}
                      onRemoveConnection={() => handleRemoveConnection(practice.id)}
                      isHighlighted={highlightPracticeId === practice.id}
                    />
                  ))}
                  {activeTab === 'directory' && <InvitePlaceholder config={config} onInvite={() => setIsInviteModalOpen(true)} />}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-black text-white border-2 border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-300">
          <p className="text-[10px] font-black uppercase tracking-tight">{toastMessage}</p>
        </div>
      )}

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        defaultRole={config.inviteDefaultRole}
        mode="clinic"
        onSuccess={(email, practiceName) => showToast(`Invitation sent to ${practiceName || email}`)}
      />
    </MainLayout>
  );
}

function NetworkSection({ children, label, trailing }: { children: React.ReactNode; label: string; trailing?: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 bg-black" />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        <div className="flex-1 border-t border-black/20" />
        {trailing && <span className="text-[8px] font-bold uppercase text-muted-foreground">{trailing}</span>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
    </div>
  );
}
