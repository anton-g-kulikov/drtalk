export type NetworkRole = 'specialist' | 'dentist';
export type NetworkTab = 'analytics' | 'connected' | 'directory';
export type NetworkTimeRange = 'day' | 'week' | 'month' | 'quarter' | 'year';

export type AnalyticsRow = {
  id: string;
  name: string;
  primary: number;
  scheduled: number;
  released: number;
  conversion: number;
};

export type AnalyticsData = {
  totalPrimary: number;
  totalScheduled: number;
  totalReleased: number;
  conversionRate: number;
  breakdown: AnalyticsRow[];
};

export type NetworkRoleConfig = {
  role: NetworkRole;
  layoutTitle: string;
  heading: string;
  markerId: string;
  markerTitle: string;
  markerDescription: string;
  subtitle: string;
  searchPlaceholder: string;
  analyticsPrimaryLabel: string;
  analyticsBreakdownTitle: string;
  analyticsBreakdownPrimaryLabel: string;
  analyticsConversionLabel: string;
  analyticsBreakdownConversionLabel: string;
  directoryAllLabel: string;
  inviteTitle: string;
  inviteCopy: string;
  inviteDefaultRole: string;
};

export const specialistAnalytics: Record<NetworkTimeRange, AnalyticsData> = {
  day: { totalPrimary: 8, totalScheduled: 5, totalReleased: 4, conversionRate: 62, breakdown: [
    { id: '6', name: 'Sunshine Dental', primary: 3, scheduled: 2, released: 1, conversion: 66 },
    { id: '7', name: 'Desert Bloom Dental', primary: 4, scheduled: 2, released: 2, conversion: 50 },
    { id: '8', name: 'Mountain View Family Dental', primary: 1, scheduled: 1, released: 1, conversion: 100 },
  ] },
  week: { totalPrimary: 38, totalScheduled: 28, totalReleased: 22, conversionRate: 73, breakdown: [
    { id: '6', name: 'Sunshine Dental', primary: 12, scheduled: 9, released: 7, conversion: 75 },
    { id: '7', name: 'Desert Bloom Dental', primary: 18, scheduled: 13, released: 11, conversion: 72 },
    { id: '8', name: 'Mountain View Family Dental', primary: 8, scheduled: 6, released: 4, conversion: 75 },
  ] },
  month: { totalPrimary: 142, totalScheduled: 115, totalReleased: 98, conversionRate: 81, breakdown: [
    { id: '6', name: 'Sunshine Dental', primary: 45, scheduled: 38, released: 32, conversion: 84 },
    { id: '7', name: 'Desert Bloom Dental', primary: 62, scheduled: 52, released: 45, conversion: 83 },
    { id: '8', name: 'Mountain View Family Dental', primary: 35, scheduled: 25, released: 21, conversion: 71 },
  ] },
  quarter: { totalPrimary: 450, totalScheduled: 375, totalReleased: 310, conversionRate: 83, breakdown: [
    { id: '6', name: 'Sunshine Dental', primary: 140, scheduled: 120, released: 95, conversion: 85 },
    { id: '7', name: 'Desert Bloom Dental', primary: 210, scheduled: 175, released: 145, conversion: 83 },
    { id: '8', name: 'Mountain View Family Dental', primary: 100, scheduled: 80, released: 70, conversion: 80 },
  ] },
  year: { totalPrimary: 840, totalScheduled: 710, totalReleased: 580, conversionRate: 85, breakdown: [
    { id: '6', name: 'Sunshine Dental', primary: 260, scheduled: 235, released: 190, conversion: 90 },
    { id: '7', name: 'Desert Bloom Dental', primary: 410, scheduled: 340, released: 280, conversion: 83 },
    { id: '8', name: 'Mountain View Family Dental', primary: 170, scheduled: 135, released: 110, conversion: 79 },
  ] },
};

export const dentistAnalytics: Record<NetworkTimeRange, AnalyticsData> = {
  day: { totalPrimary: 8, totalScheduled: 5, totalReleased: 4, conversionRate: 62, breakdown: [
    { id: '1', name: 'Valley Endodontics', primary: 3, scheduled: 2, released: 1, conversion: 66 },
    { id: '2', name: 'Downtown Oral Surgery', primary: 4, scheduled: 2, released: 2, conversion: 50 },
    { id: '3', name: 'Arizona Periodontics', primary: 1, scheduled: 1, released: 1, conversion: 100 },
  ] },
  week: { totalPrimary: 38, totalScheduled: 28, totalReleased: 22, conversionRate: 73, breakdown: [
    { id: '1', name: 'Valley Endodontics', primary: 12, scheduled: 9, released: 7, conversion: 75 },
    { id: '2', name: 'Downtown Oral Surgery', primary: 18, scheduled: 13, released: 11, conversion: 72 },
    { id: '3', name: 'Arizona Periodontics', primary: 8, scheduled: 6, released: 4, conversion: 75 },
  ] },
  month: { totalPrimary: 142, totalScheduled: 115, totalReleased: 98, conversionRate: 81, breakdown: [
    { id: '1', name: 'Valley Endodontics', primary: 45, scheduled: 38, released: 32, conversion: 84 },
    { id: '2', name: 'Downtown Oral Surgery', primary: 62, scheduled: 52, released: 45, conversion: 83 },
    { id: '3', name: 'Arizona Periodontics', primary: 35, scheduled: 25, released: 21, conversion: 71 },
  ] },
  quarter: { totalPrimary: 450, totalScheduled: 375, totalReleased: 310, conversionRate: 83, breakdown: [
    { id: '1', name: 'Valley Endodontics', primary: 140, scheduled: 120, released: 95, conversion: 85 },
    { id: '2', name: 'Downtown Oral Surgery', primary: 210, scheduled: 175, released: 145, conversion: 83 },
    { id: '3', name: 'Arizona Periodontics', primary: 100, scheduled: 80, released: 70, conversion: 80 },
  ] },
  year: { totalPrimary: 840, totalScheduled: 710, totalReleased: 580, conversionRate: 85, breakdown: [
    { id: '1', name: 'Valley Endodontics', primary: 260, scheduled: 235, released: 190, conversion: 90 },
    { id: '2', name: 'Downtown Oral Surgery', primary: 410, scheduled: 340, released: 280, conversion: 83 },
    { id: '3', name: 'Arizona Periodontics', primary: 170, scheduled: 135, released: 110, conversion: 79 },
  ] },
};

export const networkRoleConfigs: Record<NetworkRole, NetworkRoleConfig> = {
  specialist: {
    role: 'specialist',
    layoutTitle: 'Practice Network',
    heading: 'Practice Network',
    markerId: 'practice-network',
    markerTitle: 'Practice Network',
    markerDescription: 'Directory of trusted clinical partners.',
    subtitle: 'Connect, Collaborate, and Refer with Trusted Partners',
    searchPlaceholder: 'SEARCH DIRECTORY...',
    analyticsPrimaryLabel: 'Total Referrals Received',
    analyticsBreakdownTitle: 'Referring Dentist Breakdown',
    analyticsBreakdownPrimaryLabel: 'Received',
    analyticsConversionLabel: 'Received to Scheduled CR',
    analyticsBreakdownConversionLabel: 'Received to Scheduled',
    directoryAllLabel: 'All Practices',
    inviteTitle: 'Invite a Colleague',
    inviteCopy: 'Is your favorite specialist not on drTalk yet? Invite them to join your network.',
    inviteDefaultRole: 'Specialist',
  },
  dentist: {
    role: 'dentist',
    layoutTitle: 'Specialist Network',
    heading: 'Specialist Network',
    markerId: 'dentist-network',
    markerTitle: 'Specialist Network',
    markerDescription: 'Find and connect with clinical specialists.',
    subtitle: 'Discover trusted specialists to refer your patients to',
    searchPlaceholder: 'SEARCH SPECIALISTS...',
    analyticsPrimaryLabel: 'Total Referrals Sent',
    analyticsBreakdownTitle: 'Specialist Breakdown',
    analyticsBreakdownPrimaryLabel: 'Sent',
    analyticsConversionLabel: 'Sent to Scheduled CR',
    analyticsBreakdownConversionLabel: 'Sent to Scheduled',
    directoryAllLabel: 'All Specialists',
    inviteTitle: 'Invite a Specialist',
    inviteCopy: 'Is your favorite specialist not on drTalk yet? Invite them to join your network.',
    inviteDefaultRole: 'Specialist',
  },
};
