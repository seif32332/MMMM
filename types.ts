import { en } from './i18n/en';

export enum UserPrimaryRole {
  FOUNDER = 'FOUNDER',
  INVESTOR = 'INVESTOR',
  COMPANY = 'COMPANY',
  TRADER = 'TRADER',
  JOB_SEEKER = 'JOB_SEEKER',
}

export type UserStatus = 'online' | 'offline';

export interface CompanyMembership {
    companyId: string;
    companyName: string;
    companySlug: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

export interface User {
  id: string;
  email: string;
  emailVerified?: boolean;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  profile?: Profile;
  systemRole?: 'USER' | 'ADMIN' | 'MODERATOR';
  status?: UserStatus;
  lastSeen?: string;
  companyMemberships?: CompanyMembership[];
}

export interface OnboardingPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
}

export interface Profile {
  headline?: string;
  bio?: string;
  location?: string;
  primaryRole: UserPrimaryRole;
  onboardingDetails?: Record<string, any>;
  onboardingPreferences?: OnboardingPreferences;
  profileCompleted?: boolean;
  followersCount?: number;
  followingCount?: number;
}

export interface Post {
  id: string;
  author: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'username'>;
  body: string;
  createdAt: string;
  commentsCount: number;
  reactionsCount: number;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Message {
  id: string; // tempId during optimistic update, serverId after ack
  tempId?: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  participants: (Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'username' | 'status'>)[];
  lastMessage?: {
    body: string;
    createdAt: string;
  };
  unreadCount: number;
}

export interface Company {
    id: string;
    slug: string;
    name: string;
    logoUrl?: string;
    industry?: string;
    location?: string;
    website?: string;
    description?: string;
    ownerId: string;
}


export interface Deal {
    id: string;
    title: string;
    summary: string;
    industry: string;
    stage: string; // idea, mvp, seed, series_a
    amountMin: number;
    amountMax: number;
    country: string;
    owner: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'username'>;
    companyId?: string;
    createdAt: string;
}

export interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    employmentType: 'full_time' | 'part_time' | 'contract';
    company: Pick<Company, 'id' | 'name' | 'slug' | 'logoUrl' | 'ownerId'>;
    createdAt: string;
}

// --- Matching Engine Types ---

export type SuggestionType = 'USER' | 'DEAL' | 'JOB';
export type SuggestionData = User | Deal | Job;
export interface Suggestion {
    type: SuggestionType;
    id: string;
    data: SuggestionData;
    score: number;
    reason: string;
}


// --- Wallet & Funding System Types ---

export enum TxKind {
  TOPUP_GATEWAY = 'TOPUP_GATEWAY',
  TOPUP_BANK = 'TOPUP_BANK',
  ALLOCATE_TO_DEAL = 'ALLOCATE_TO_DEAL',
  DEAL_REFUND = 'DEAL_REFUND',
  WITHDRAW = 'WITHDRAW'
}
export enum TxStatus { PENDING = 'PENDING', SUCCEEDED = 'SUCCEEDED', FAILED = 'FAILED', REVERSED = 'REVERSED' }
export enum Currency { SAR = 'SAR', USD = 'USD', EUR = 'EUR' }

export interface Wallet {
  id: string;
  userId: string;
  currency: Currency;
  balance: bigint;    // in "cents"
  available: bigint;  // balance - locked
  locked: bigint;
  transactions: WalletTx[];
}

export interface WalletTx {
  id: string;
  walletId: string;
  kind: TxKind;
  status: TxStatus;
  amount: bigint; // Positive for credit, negative for debit
  currency: Currency;
  reference?: string; // Bank/Gateway reference
  meta?: Record<string, any>;
  createdAt: string;
}

export interface DealAllocation {
  id: string;
  walletId: string;
  dealId: string;
  amount: bigint;
  status: 'LOCKED' | 'FUNDED' | 'CANCELLED' | 'EXPIRED';
  createdAt: string;
}

export interface Investment {
  id: string;
  dealId: string;
  userId: string;
  amount: number;
  status: 'PLEDGED' | 'FUNDED' | 'REFUNDED';
  createdAt: string;
}


// --- WebSocket Event Types ---
export type WsEvent =
  | { type: 'message:new'; payload: Message }
  | { type: 'message:ack'; payload: { tempId: string; serverId: string; createdAt: string; conversationId: string; } }
  | { type: 'delivery:update'; payload: { conversationId: string; messageId: string; status: 'DELIVERED' | 'READ'; readAt: string } }
  | { type: 'presence:update'; payload: { userId: string; status: UserStatus; lastSeen: string } }
  | { type: 'typing:update'; payload: { conversationId: string; userId: string; isTyping: boolean } };


// --- API & Form Types ---
export interface Paginated<T> {
  items: T[];
  nextCursor?: string | null;
}

export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'multiselect' | 'tags';

export interface FormField {
  name: string;
  labelKey: TranslationKey;
  type: FormFieldType;
  placeholderKey?: TranslationKey;
  options?: { value: string; labelKey: TranslationKey }[];
}

export interface FormDefinition {
  fields: FormField[];
}

export type TranslationKey = keyof typeof en;