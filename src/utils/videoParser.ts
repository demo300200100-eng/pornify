export interface ParsedVideoInfo {
  type: 'youtube' | 'vimeo' | 'mp4' | 'iframe' | 'unknown';
  embedUrl: string;
  directUrl?: string;
  suggestedCover?: string;
  isValid: boolean;
  youtubeId?: string;
  vimeoId?: string;
  previewEmbedUrl?: string;
}

export function parseVideoUrl(url: string): ParsedVideoInfo {
  if (!url || typeof url !== 'string') {
    return { type: 'unknown', embedUrl: '', isValid: false };
  }

  const cleanUrl = url.trim();

  // 1. YouTube detection (watch, youtu.be, shorts, embed)
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const ytMatch = cleanUrl.match(ytRegex);

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      previewEmbedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}&playsinline=1`,
      suggestedCover: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      youtubeId: videoId,
      isValid: true,
    };
  }

  // 2. Vimeo detection
  const vimeoRegex = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/;
  const vimeoMatch = cleanUrl.match(vimeoRegex);

  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&color=f59e0b&title=0&byline=0&portrait=0`,
      previewEmbedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&background=1&autopause=0`,
      suggestedCover: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80`,
      vimeoId: videoId,
      isValid: true,
    };
  }

  // 3. Dailymotion detection
  const dmRegex = /(?:dailymotion\.com\/(?:video|embed\/video)\/|dai\.ly\/)([a-zA-Z0-9]+)/;
  const dmMatch = cleanUrl.match(dmRegex);
  if (dmMatch && dmMatch[1]) {
    const dmId = dmMatch[1];
    return {
      type: 'iframe',
      embedUrl: `https://www.dailymotion.com/embed/video/${dmId}?autoplay=1`,
      previewEmbedUrl: `https://www.dailymotion.com/embed/video/${dmId}?autoplay=1&mute=1&controls=0`,
      isValid: true,
    };
  }

  // 4. Explicit embed/iframe pages
  const isExplicitEmbedPage = /(?:embed|player|iframe)\b/i.test(cleanUrl) && !/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(cleanUrl);

  if (isExplicitEmbedPage) {
    return {
      type: 'iframe',
      embedUrl: cleanUrl,
      previewEmbedUrl: cleanUrl,
      isValid: true,
    };
  }

  // 5. Direct video files & streams (MP4, webm, blob, CDN, direct HTTP links)
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('blob:') || cleanUrl.startsWith('data:video/')) {
    return {
      type: 'mp4',
      embedUrl: cleanUrl,
      directUrl: cleanUrl,
      previewEmbedUrl: cleanUrl,
      isValid: true,
    };
  }

  return {
    type: 'unknown',
    embedUrl: cleanUrl,
    isValid: false,
  };
}

export function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

export function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recently';
  }
}
