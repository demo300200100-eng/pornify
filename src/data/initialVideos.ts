import { VideoCategory, VideoItem, VideoComment, SiteSettings, CryptoVipSettings } from '../types/video';

export const DEFAULT_CRYPTO_VIP: CryptoVipSettings = {
  enabled: true,
  priceUsdt: 5,
  walletAddress: 'TYDzsYUEWv8x8KjYt6vGg24GqHkQxK3m9L',
  walletNetwork: 'USDT (TRC20)',
  planTitle: 'VIP Ad-Free Pass',
  planDuration: 'Lifetime Access',
  instructionNotes: 'Send the exact amount to the USDT wallet address below, then enter your TXID and click "Verify Payment" to activate VIP Ad-Free streaming.',
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'Pornify',
  siteTagline: 'Next-Gen 4K Dark Video Streaming Platform',
  allowComments: true,
  enableAds: true,
  cryptoVip: DEFAULT_CRYPTO_VIP,
  termsOfService: `1. Acceptance of Terms
By accessing or using the Pornify platform, you agree to be bound by these Terms of Service, all applicable laws, and regulations. If you do not agree with any part of these terms, you are prohibited from using or accessing this site.

2. Content and Permissible Use
Pornify is designed for ultra-high-definition streaming, content discovery, and educational and entertainment distribution. Users agree not to:
- Upload or distribute harmful, abusive, defamatory, or unlawful materials.
- Attempt to circumvent any security protections, rate limits, or intellectual property rights.
- Use automated scripts, scrapers, or bots without explicit written consent from the site administration.

3. Intellectual Property and Copyright (DMCA)
All video content, trademarks, logos, audio tracks, and graphic elements hosted or displayed on Pornify are the property of their respective creators and copyright owners. We respect intellectual property rights and promptly respond to verified notices of copyright infringement under applicable copyright acts.

4. User Accounts and Content Submissions
If you register an account, publish comments, or submit video links:
- You are responsible for maintaining the confidentiality of your credentials.
- You affirm that you hold all necessary rights and licenses for any submissions you provide.
- Pornify reserves the right to remove any content or comments that violate our community standards without prior notice.

5. Disclaimer of Warranties
Pornify is provided on an "as is" and "as available" basis without any warranties of any kind, whether express or implied, including fitness for a particular purpose or non-infringement.

6. Modifications to Terms
We reserve the right to revise or update these Terms of Service at any time. Continued use of the platform constitutes your agreement to the modified terms.`,

  privacyPolicy: `1. Information We Collect
We are committed to protecting your privacy. When using Pornify, we may collect:
- Technical Information: Browser type, operating system, device characteristics, and screen resolution for player optimization.
- Usage Data: Aggregated video playback metrics, viewing duration, and interaction preferences (such as bookmarks and volume settings saved locally in your browser storage).
- User Submitted Data: Comments, handles, and custom profiles submitted voluntarily during participation.

2. Use of Local Storage and Cookies
Pornify utilizes modern HTML5 Local Storage to preserve your preferences (such as your custom Watchlist, volume levels, and admin authentication state) seamlessly across browser sessions without tracking you across third-party websites.

3. Data Sharing and Third Parties
We do not sell, trade, or rent personal identification information to outside parties. Video embeds or player sources (such as YouTube, Vimeo, or direct cloud buckets) operate under their respective privacy protocols.

4. Data Security
We implement strict security practices, encrypted SSL/TLS data transmission, and granular access controls to safeguard your data against unauthorized access, alteration, or disclosure.

5. User Rights and Data Control
You have full control over your local data. You may clear your local watchlist, bookmarks, and stored settings at any time directly through your browser settings or via the platform's reset controls.

6. Contact Us
For any privacy inquiries, data deletion requests, or questions regarding this Privacy Policy, please reach out through the Help Center.`,

  helpCenter: `Welcome to the Pornify Help Center & FAQ. Find answers to common questions about 4K playback, keyboard controls, playlist management, and platform features.

1. Video Playback & 4K Quality
• How do I get 4K Ultra HD playback?
Pornify automatically detects your network speed and screen resolution. When available, streams default to the highest resolution (up to 4K Ultra HD 60fps).
• What video formats are supported?
Our universal engine supports YouTube, Vimeo, direct MP4/HLS streams, and iframe sources.

2. Player Keyboard Shortcuts
• Spacebar / K: Play or Pause
• Arrow Right / Left: Skip forward 5s / rewind 5s
• F: Toggle Fullscreen mode
• M: Mute or Unmute audio
• Escape: Close player modal or exit cinema view

3. Managing Your Watchlist
Click the Bookmark icon on any video card or inside the video player to add it to "My List". Your list is saved securely in your browser and accessible anytime from the top navigation bar.

4. Commenting and Community Guidelines
You can participate in discussions on any video by submitting your thoughts in the Comments & Discussions section below the player. Be respectful and constructive.

5. Administrator Controls
Platform administrators can access the Admin Dashboard by pressing Alt + A or clicking the Admin Dashboard button in the header and footer to add, edit, or delete videos, categories, comments, ads, and crypto VIP settings in real time.`,
};

export const INITIAL_CATEGORIES: VideoCategory[] = [
  { id: 'all', name: 'All', nameEn: 'All', iconName: 'Sparkles' },
  { id: 'trending', name: 'Trending', nameEn: 'Trending', iconName: 'Flame' },
  { id: 'gaming', name: 'Gaming', nameEn: 'Gaming', iconName: 'Gamepad2' },
  { id: 'music', name: 'Music', nameEn: 'Music', iconName: 'Music' },
  { id: 'tech', name: 'Tech', nameEn: 'Tech', iconName: 'Cpu' },
  { id: 'podcasts', name: 'Podcasts', nameEn: 'Podcasts', iconName: 'Mic' },
  { id: 'education', name: 'Education', nameEn: 'Education', iconName: 'GraduationCap' },
  { id: 'documentary', name: 'Documentary', nameEn: 'Documentary', iconName: 'Film' },
];

export const INITIAL_COMMENTS: VideoComment[] = [
  {
    id: 'comm-1',
    videoId: 'featured-hero',
    author: 'Alex Mercer',
    handle: '@alex_cinema',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    text: 'The visual effects and color grading on this 4K stream are completely mindblowing! Best finale yet.',
    timestamp: '2 hours ago',
    likes: 42,
    isLiked: false,
  },
  {
    id: 'comm-2',
    videoId: 'featured-hero',
    author: 'Sarah Jenkins',
    handle: '@sarah_j',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    text: 'That plot twist at 1:45:00 was unexpected! Can\'t wait for next season.',
    timestamp: '5 hours ago',
    likes: 19,
    isLiked: true,
  },
  {
    id: 'comm-3',
    videoId: 'vid-1',
    author: 'Mark Davis',
    handle: '@keyboard_guru',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    text: 'That aluminum CNC machining sound is so satisfying. Amazing build guide!',
    timestamp: '1 day ago',
    likes: 15,
    isLiked: false,
  },
  {
    id: 'comm-4',
    videoId: 'vid-2',
    author: 'Elena Rossi',
    handle: '@wanderlust_elena',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    text: 'The mountain pass drone shots are pure poetry. Respect for doing this solo in winter!',
    timestamp: '2 days ago',
    likes: 28,
    isLiked: true,
  },
];

export const HERO_FEATURED_VIDEO: VideoItem = {
  id: 'featured-hero',
  title: 'Chronicles of the Neon Odyssey: Season Finale',
  description: 'The final battle for the mainframe approaches. Aethel and the resistance fighters uncover a devastating truth about the central core.',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=85',
  category: 'documentary',
  tags: ['Sci-Fi', 'Cinema', '4K', 'Season Finale', 'Cyberpunk'],
  duration: '2h 14m',
  views: 2450000,
  likes: 184000,
  isLiked: true,
  isBookmarked: true,
  featured: true,
  channelId: 'chan-hero',
  channelName: 'Pornify Originals',
  channelHandle: '@pornify_studios',
  channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  channelVerified: true,
  createdAt: new Date().toISOString(),
  videoType: 'mp4',
  rating: 4.9,
  reviewsCount: '128k reviews',
  badge: 'TRENDING #1',
  genre: 'Sci-Fi • 2h 14m',
  resolution: '4K Ultra HD',
};

export const INITIAL_VIDEOS: VideoItem[] = [
  HERO_FEATURED_VIDEO,
  {
    id: 'vid-1',
    title: 'Building a Custom Mechanical Keyboard from Scratch',
    description: 'Precision machining custom aluminum casing, hand soldering switches, and custom firmware programming for the ultimate typing sound profile.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    coverUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
    category: 'tech',
    tags: ['Tech', 'Hardware', 'DIY', 'Mechanical', 'Custom'],
    duration: '18:24',
    views: 245000,
    likes: 18400,
    isLiked: false,
    channelId: 'chan-1',
    channelName: 'TechCraft Studio',
    channelHandle: '@techcraft',
    channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    channelVerified: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    videoType: 'mp4',
    resolution: '4K',
  },
  {
    id: 'vid-2',
    title: 'Lost in the Wilderness: 7 Days Solo Backpacking in the Alps',
    description: 'Surviving sub-zero alpine conditions, glacier crossings, and cinematic drone captures over untouched mountain peaks in Switzerland.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    category: 'documentary',
    tags: ['Wilderness', 'Alps', 'Nature', 'Solo Hiking', '4K'],
    duration: '42:10',
    views: 1200000,
    likes: 98000,
    isLiked: true,
    channelId: 'chan-2',
    channelName: 'Wild Horizons',
    channelHandle: '@wildhorizons',
    channelAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    channelVerified: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    videoType: 'mp4',
    resolution: '4K',
  },
  {
    id: 'vid-3',
    title: 'VALORANT World Championship 2024 - Grand Finals Highlights',
    description: 'The two best teams in the world clash in a nail-biting best-of-5 final match in front of 20,000 arena fans.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    category: 'gaming',
    tags: ['VALORANT', 'Esports', 'Gaming', 'Championship'],
    duration: '04:55:12',
    views: 3400000,
    likes: 215000,
    isLiked: false,
    channelId: 'chan-3',
    channelName: 'VCL Esports',
    channelHandle: '@vcl_esports',
    channelAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80',
    channelVerified: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    videoType: 'mp4',
    resolution: '1080p60',
  },
  {
    id: 'vid-4',
    title: 'The Future of Artificial Intelligence with Dr. Elena Rostova',
    description: 'A deep-dive conversation exploring AGI milestones, ethical frameworks, quantum neural processing, and human-computer symbiosis.',
    videoUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    coverUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    category: 'podcasts',
    tags: ['AI', 'Podcast', 'Neural', 'Tech', 'Interview'],
    duration: '1:15:30',
    views: 89000,
    likes: 7200,
    isLiked: false,
    channelId: 'chan-4',
    channelName: 'Neural Deep-Dive',
    channelHandle: '@neural_dive',
    channelAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    channelVerified: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    videoType: 'youtube',
    resolution: '4K',
  },
  {
    id: 'vid-5',
    title: 'Mastering French Pastries: The Secret to Perfect Croissants',
    description: 'Michelin-starred pastry chef demonstrates the exact butter lamination technique, proofing temperatures, and baking tricks.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    coverUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
    category: 'education',
    tags: ['Cooking', 'Pastry', 'Chef', 'Masterclass', 'France'],
    duration: '24:15',
    views: 610000,
    likes: 45000,
    isLiked: true,
    channelId: 'chan-5',
    channelName: 'Le Cordon Chef',
    channelHandle: '@cordon_chef',
    channelAvatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
    channelVerified: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    videoType: 'mp4',
    resolution: '4K',
  },
  {
    id: 'vid-6',
    title: 'Testing the World\'s Fastest 2000HP Electric Hypercar',
    description: 'Taking the Rimac Nevera and Evija to their absolute aerodynamic limits across a decommissioned salt flats landing strip.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    coverUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    category: 'tech',
    tags: ['Hypercar', 'Electric', 'Speed', 'Automotive', '0-60'],
    duration: '14:05',
    views: 1800000,
    likes: 135000,
    isLiked: true,
    channelId: 'chan-6',
    channelName: 'Apex Speed Garage',
    channelHandle: '@apex_speed',
    channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    channelVerified: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    videoType: 'mp4',
    resolution: '4K',
  }
];

export const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80'
];
