import React, { useEffect, useRef } from 'react';
import { ExternalLink, Sparkles, Zap, Flame, ShieldCheck, Play } from 'lucide-react';
import { AdUnit } from '../types/video';

interface AdBannerRendererProps {
  ad: AdUnit;
  onAdClick?: (adId: string) => void;
  className?: string;
  compact?: boolean;
}

// Helper to determine if codeSnippet is just a raw URL or HTML/Script
function isRawUrl(str?: string): boolean {
  if (!str) return false;
  const trimmed = str.trim();
  return (trimmed.startsWith('http://') || trimmed.startsWith('https://')) && !trimmed.includes('<') && !trimmed.includes(' ');
}

// Preset visual themes when custom image is not provided
const FALLBACK_THEMES = [
  {
    bg: 'from-amber-950/70 via-[#181824] to-[#121218]',
    border: 'border-amber-500/40 hover:border-amber-400',
    badge: 'HOT SPONSOR',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    title: 'Stream 4K Ultra HD Without Buffering',
    desc: 'Instant access to premium high-speed streaming servers and exclusive VIP releases.',
    cta: 'Watch in 4K'
  },
  {
    bg: 'from-indigo-950/70 via-[#181824] to-[#121218]',
    border: 'border-indigo-500/40 hover:border-indigo-400',
    badge: 'RECOMMENDED',
    img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    title: 'Top Rated Interactive 4K Games & Streams',
    desc: 'Join millions of active players online with high speed low latency connections.',
    cta: 'Play Now Free'
  },
  {
    bg: 'from-rose-950/70 via-[#181824] to-[#121218]',
    border: 'border-rose-500/40 hover:border-rose-400',
    badge: 'SPECIAL DEAL',
    img: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    title: 'Unlock VIP Premium Access & Instant Rewards',
    desc: 'Special member discounts, 100% anonymous browsing and ultra fast downloads.',
    cta: 'Claim VIP Pass'
  }
];

export const AdBannerRenderer: React.FC<AdBannerRendererProps> = ({
  ad,
  onAdClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const rawUrlInCode = isRawUrl(ad.codeSnippet);
  const effectiveTargetUrl = rawUrlInCode ? ad.codeSnippet?.trim() : (ad.targetUrl || 'https://google.com');

  const themeIndex = (ad.unitCodeId ? parseInt(ad.unitCodeId.slice(-1), 10) : 0) % FALLBACK_THEMES.length;
  const theme = FALLBACK_THEMES[isNaN(themeIndex) ? 0 : themeIndex];

  const effectiveHeadline = ad.headline?.trim() || theme.title;
  const effectiveDesc = ad.description?.trim() || theme.desc;
  const effectiveCta = ad.ctaText?.trim() || theme.cta;
  const effectiveImage = ad.imageUrl?.trim() || theme.img;

  useEffect(() => {
    // If ad is actual html_code or script snippet with tags
    if ((ad.type === 'html_code' || ad.type === 'script') && !rawUrlInCode) {
      if (containerRef.current && ad.codeSnippet) {
        containerRef.current.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.innerHTML = ad.codeSnippet;
        
        // Execute any embedded <script> tags
        const scripts = wrapper.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          const newScript = document.createElement('script');
          if (scripts[i].src) {
            newScript.src = scripts[i].src;
          } else {
            newScript.innerHTML = scripts[i].innerHTML;
          }
          document.body.appendChild(newScript);
        }
        
        containerRef.current.appendChild(wrapper);
      }
    }
  }, [ad.codeSnippet, ad.type, rawUrlInCode]);

  if (!ad.active) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (onAdClick) onAdClick(ad.id);
    if (effectiveTargetUrl) {
      window.open(effectiveTargetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // If HTML/Script with actual code snippet tags
  if ((ad.type === 'html_code' || ad.type === 'script') && !rawUrlInCode && ad.codeSnippet?.includes('<')) {
    return (
      <div 
        onClick={handleClick}
        className={`relative overflow-hidden rounded-2xl border border-amber-500/30 bg-[#121218] p-3 text-center my-3 transition-all hover:border-amber-400 shadow-xl cursor-pointer select-none ${className}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
          <span className="text-[9px] font-bold text-amber-400/80 uppercase tracking-widest font-mono select-none flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>ADVERTISEMENT • #{ad.unitCodeId || ad.name}</span>
          </span>
          <ExternalLink className="w-3 h-3 text-gray-500" />
        </div>
        <div ref={containerRef} className="flex items-center justify-center min-h-[60px]" />
      </div>
    );
  }

  // Format: 728x90 (Top Leaderboard / Bottom Leaderboard)
  if (ad.format === 'banner_728x90') {
    return (
      <div 
        onClick={handleClick}
        className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r ${theme.bg} ${theme.border} border p-3.5 sm:p-4 cursor-pointer transition-all shadow-xl hover:shadow-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 select-none ${className}`}
      >
        {/* Sponsored Badge */}
        <span className="absolute top-1.5 right-2.5 text-[9px] font-black tracking-widest text-amber-400/90 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
          SPONSOR #{ad.unitCodeId || '728x90'}
        </span>

        <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
          <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden bg-black shrink-0 relative border border-white/10 shadow-md">
            <img src={effectiveImage} alt={effectiveHeadline} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-0.5 right-1 text-[8px] font-bold text-amber-300 font-mono">4K</div>
          </div>

          <div className="min-w-0 pr-12 sm:pr-0">
            <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">
              {effectiveHeadline}
            </h4>
            <p className="text-[11px] sm:text-xs text-gray-300 line-clamp-1 mt-0.5">
              {effectiveDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button className="px-4 py-2 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95">
            <span>{effectiveCta}</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    );
  }

  // Format: 300x250 (Medium Rectangle - In Sidebar or In Grid)
  if (ad.format === 'banner_300x250') {
    return (
      <div
        onClick={handleClick}
        className={`group relative overflow-hidden rounded-2xl bg-[#15151f] border border-amber-500/30 hover:border-amber-400 p-4 cursor-pointer transition-all shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between select-none min-h-[220px] ${className}`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-black tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            ADVERTISEMENT #{ad.unitCodeId || '300x250'}
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-400 transition-colors" />
        </div>

        <div className="w-full h-28 rounded-xl overflow-hidden bg-black mb-3 border border-white/10 relative">
          <img src={effectiveImage} alt={effectiveHeadline} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute bottom-1.5 left-2 text-[10px] font-black text-amber-400 font-mono">
            {theme.badge}
          </span>
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
            {effectiveHeadline}
          </h4>
          <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">
            {effectiveDesc}
          </p>
        </div>

        <button className="mt-3 w-full py-2 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all">
          <span>{effectiveCta}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // Format: 160x600 or 160x300 (Skyscrapers)
  if (ad.format === 'banner_160x600' || ad.format === 'banner_160x300') {
    return (
      <div
        onClick={handleClick}
        className={`group relative overflow-hidden rounded-2xl bg-[#14141d] border border-amber-500/30 hover:border-amber-400 p-3 cursor-pointer transition-all shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between text-center select-none ${
          ad.format === 'banner_160x600' ? 'min-h-[450px]' : 'min-h-[260px]'
        } ${className}`}
      >
        <span className="text-[9px] font-black tracking-widest text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20 mb-2">
          SPONSOR
        </span>

        <div className="w-full flex-1 rounded-xl overflow-hidden bg-black mb-2 border border-white/10 relative min-h-[120px]">
          <img src={effectiveImage} alt={effectiveHeadline} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </div>

        <div>
          <h5 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
            {effectiveHeadline}
          </h5>
          <p className="text-[10px] text-gray-400 line-clamp-2 mt-1">
            {effectiveDesc}
          </p>
        </div>

        <button className="mt-2.5 w-full py-1.5 rounded-lg bg-amber-500 group-hover:bg-amber-400 text-black font-bold text-[11px] flex items-center justify-center gap-1 transition-all">
          <span>{effectiveCta}</span>
        </button>
      </div>
    );
  }

  // Format: 468x60 / 320x50 (Banner Bar)
  if (ad.format === 'banner_468x60' || ad.format === 'banner_320x50') {
    return (
      <div
        onClick={handleClick}
        className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${theme.bg} ${theme.border} border px-3.5 py-2.5 cursor-pointer transition-all shadow-lg hover:shadow-amber-500/10 flex items-center justify-between gap-3 select-none ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-10 h-8 sm:w-12 sm:h-9 rounded-lg overflow-hidden bg-black shrink-0 border border-white/10 relative">
            <img src={effectiveImage} alt={effectiveHeadline} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black text-amber-400 bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/30 uppercase shrink-0 font-mono">
                AD #{ad.unitCodeId || 'Promo'}
              </span>
              <div className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                {effectiveHeadline}
              </div>
            </div>
            <div className="text-[10px] text-gray-300 truncate mt-0.5">
              {effectiveDesc}
            </div>
          </div>
        </div>

        <button className="px-3.5 py-1.5 rounded-lg bg-amber-500 group-hover:bg-amber-400 text-black text-xs font-black shrink-0 flex items-center gap-1 shadow-sm">
          <span>{effectiveCta}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // Format: Native Banner / Smartlink (Rendered in feed or hero bottom)
  return (
    <div
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161622] via-[#1a1a27] to-[#121219] border border-amber-500/30 hover:border-amber-400 p-4 sm:p-5 cursor-pointer transition-all shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between select-none ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-black tracking-wider text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-mono">
            PROMOTED #{ad.unitCodeId || ad.name}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-mono">SPONSOR</span>
      </div>

      <div className="w-full aspect-video rounded-xl overflow-hidden bg-black mb-3 border border-white/10 relative">
        <img src={effectiveImage} alt={effectiveHeadline} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-300 font-mono flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>4K ULTRA HD</span>
          </span>
          <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded font-black font-mono">VIP</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
          {effectiveHeadline}
        </h4>
        <p className="text-xs text-gray-300 line-clamp-2 mt-1.5 leading-relaxed">
          {effectiveDesc}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <span className="text-[11px] text-gray-400 group-hover:text-gray-300">Instant direct access</span>
        <button className="px-4 py-2 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-black font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all">
          <span>{effectiveCta}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
