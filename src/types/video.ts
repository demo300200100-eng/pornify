export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  coverUrl: string;
  category: string;
  tags: string[];
  duration: string;
  views: number;
  likes: number;
  dislikes?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isBookmarked?: boolean;
  featured?: boolean;
  createdAt: string;
  videoType?: 'youtube' | 'vimeo' | 'mp4' | 'iframe' | 'unknown';
  rating?: number;
  reviewsCount?: string;
  badge?: string;
  genre?: string;
  resolution?: string;
  commentsCount?: number;
  channelId?: string;
  channelName?: string;
  channelHandle?: string;
  channelAvatar?: string;
  channelVerified?: boolean;
}

export interface VideoCategory {
  id: string;
  name: string;
  nameEn: string;
  iconName: string;
  color?: string;
  description?: string;
}

export interface VideoComment {
  id: string;
  videoId: string;
  author: string;
  handle?: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export type AdFormat = 
  | 'banner_728x90' 
  | 'banner_300x250' 
  | 'banner_468x60' 
  | 'banner_160x600' 
  | 'banner_160x300' 
  | 'banner_320x50' 
  | 'native_banner' 
  | 'social_bar' 
  | 'popunder' 
  | 'smartlink';

export type AdPlacement = 
  | 'top_header'
  | 'hero_bottom'
  | 'in_grid_feed'
  | 'player_under'
  | 'player_sidebar'
  | 'sidebar_left'
  | 'sidebar_right'
  | 'social_bar_bottom'
  | 'popunder_click'
  | 'footer_top';

export interface AdUnit {
  id: string;
  unitCodeId?: string;
  name: string;
  format: AdFormat;
  placement: AdPlacement;
  active: boolean;
  type: 'image_link' | 'html_code' | 'script' | 'smartlink';
  imageUrl?: string;
  targetUrl?: string;
  headline?: string;
  description?: string;
  ctaText?: string;
  codeSnippet?: string;
  impressions?: number;
  clicks?: number;
  createdAt: string;
}

export interface VipPaymentOrder {
  id: string;
  txHash: string;
  amount: number;
  network: string;
  recipientWallet: string;
  createdAt: string;
  status: 'verified' | 'pending' | 'rejected';
  deviceId?: string;
  verifiedAt?: string;
  userNote?: string;
}

export interface CryptoVipSettings {
  enabled: boolean;
  priceUsdt: number;
  walletAddress: string;
  walletNetwork: 'USDT (TRC20)' | 'USDT (BEP20)' | 'USDT (ERC20)' | 'USDT (Polygon)' | 'USDT (TON)' | string;
  planTitle: string;
  planDuration: string;
  vipCodes?: string[];
  instructionNotes?: string;
  autoVerifyTx?: boolean;
  requireTxHash?: boolean;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  termsOfService: string;
  privacyPolicy: string;
  helpCenter: string;
  allowComments: boolean;
  enableAds?: boolean;
  cryptoVip?: CryptoVipSettings;
}

export type PlatformViewMode = 'home' | 'trending' | 'categories' | 'library';
