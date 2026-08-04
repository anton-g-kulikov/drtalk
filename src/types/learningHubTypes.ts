export interface LearningComment {
  id: string;
  author: string;
  authorRole?: string;
  text: string;
  timestamp: string;
}

export interface LearningTopic {
  id: string;
  author: string;
  authorRole?: string;
  title: string;
  content: string;
  views: number;
  likes: string[]; // User roles/names who liked
  comments: LearningComment[];
  timestamp: string;
  attachments?: { name: string; size: string; type: string }[];
  topicSponsor?: { name: string; logoUrl?: string };
}

export interface LearningChannel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  category: string;
  otherCategory?: string;
  ownerBio?: string;
  coverUrl?: string;
  sponsorName?: string;
  sponsorLogoUrl?: string;
  joinCode?: string;
  hostRevenueShare?: number; // e.g. 0.70
  platformRevenueShare?: number; // e.g. 0.30
  isMonetized: boolean;
  subscriptionCost: number;
  totalCharge: number;
  platformFee: number;
  stripeFee: number;
  ceCreditsEnabled: boolean;
  ceCreditHours?: number;
  onlyHostsCanPost: boolean;
  startDate?: string;
  endDate?: string;
  posts: LearningTopic[];
  membersCount: number;
  isJoined?: boolean;
  stripeConnected?: boolean;
  creatorId?: string;
}
