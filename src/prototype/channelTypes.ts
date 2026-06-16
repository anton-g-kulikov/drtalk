export type ChannelType = 'internal' | 'inter-practice' | 'patient' | 'public' | 'group';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  lastMessage: string;
  unreadCount?: number;
  memberCount: number;
  isVerified?: boolean;
  isExternal?: boolean;
}

export interface SharedDocument {
  id: string;
  channelId: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'zip' | 'doc';
  sentBy: string;
  sentAt: string;
  isArchived?: boolean;
}

export interface MessageItem {
  id: string;
  user: string;
  text: string;
  time: string;
  type: 'self' | 'other';
  transport?: 'App' | 'SMS' | 'Email';
  document?: SharedDocument;
}
