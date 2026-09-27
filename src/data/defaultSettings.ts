import { SiteSettings, VideoComment } from '../types/video';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'Pornify',
  siteTagline: 'Next-Gen 4K Dark Video Streaming Platform',
  termsOfService: `1. Acceptance of Terms
By accessing and using Pornify, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.

2. Permitted Use
Pornify is designed for high-performance online video streaming. You are granted a personal, non-exclusive license to stream content available on the platform for non-commercial entertainment purposes.

3. Intellectual Property & Streaming Rights
All video streams, thumbnails, trademarks, and design elements are protected by copyright. Re-broadcasting, unauthorized copying, or reverse-engineering platform streaming protocols is strictly prohibited.

4. Community & Comments Policy
User comments and discussions must remain respectful. Spam, harassment, abusive language, or unsolicited promotions will be removed by platform moderators without prior notice.

5. Modifications to Service
Pornify reserves the right to modify, suspend, or discontinue any feature or content at any time.`,
  
  privacyPolicy: `1. Information We Collect
Pornify prioritizes user privacy. We do not require registration for public streaming and do not collect sensitive personal data or track browsing history across external websites.

2. Local Browser Storage
Your custom watchlist ("My List"), audio volume preferences, and viewing session states are saved locally on your device via browser LocalStorage for your convenience.

3. Cookies & Performance
We only utilize essential functional session cookies required to maintain streaming buffer performance, cinema mode toggles, and responsive UI states.

4. Third-Party Embeds
When viewing videos hosted via third-party providers (such as YouTube or Vimeo), those services may process data in accordance with their respective privacy policies.

5. Data Security
We employ industry-standard encryption protocols (HTTPS/TLS) to ensure all data transfers remain encrypted and secure.`,

  helpCenter: `Frequently Asked Questions (FAQ)

Q: How do I add a video to "My List"?
A: Click or tap the Bookmark icon on any video card or inside the video player to save it to your personal watchlist instantly.

Q: What video formats and resolutions does Pornify support?
A: The platform supports ultra-fast 4K Ultra HD playback, 1080p Full HD, direct MP4/WebM video files, and high-definition embeds.

Q: How can I adjust playback speed or volume?
A: Inside the video player, use the built-in control bar to change speed (0.5x to 2x), adjust volume, skip 10 seconds forward or backward, or toggle cinema/fullscreen mode.

Q: How can I report an issue or broken video?
A: You can post a comment directly under the affected video, and platform administrators will review and update the stream promptly.`,

  allowComments: true,
};

export const INITIAL_COMMENTS: VideoComment[] = [
  {
    id: 'comm-1',
    videoId: 'featured-hero',
    author: 'Alex Morgan',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    text: 'Super smooth streaming quality, great 4K playback!',
    timestamp: '2 hours ago',
    likes: 14,
  },
  {
    id: 'comm-2',
    videoId: 'featured-hero',
    author: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    text: 'Incredible audio mastering and visual clarity. Thanks for sharing.',
    timestamp: '1 day ago',
    likes: 9,
  },
  {
    id: 'comm-3',
    videoId: 'vid-1',
    author: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    text: 'The machining work on that casing is pure art. Fantastic sound profile!',
    timestamp: '3 days ago',
    likes: 22,
  },
  {
    id: 'comm-4',
    videoId: 'vid-2',
    author: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    text: 'Neon lighting and sound design in this project are next level.',
    timestamp: '4 days ago',
    likes: 18,
  }
];
