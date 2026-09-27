import React, { useState } from 'react';
import { X, ExternalLink, Bell, Zap } from 'lucide-react';
import { AdUnit } from '../types/video';

interface SocialBarAdProps {
  ad: AdUnit;
  onAdClick?: (adId: string) => void;
}

export const SocialBarAd: React.FC<SocialBarAdProps> = ({ ad, onAdClick }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!ad || !ad.active || !isVisible) return null;

  const handleClick = () => {
    if (onAdClick) onAdClick(ad.id);
    if (ad.targetUrl) {
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 sm:left-6 z-40 max-w-sm sm:max-w-md w-[calc(100%-2rem)] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div 
        onClick={handleClick}
        className="group relative bg-[#171724]/95 backdrop-blur-xl border border-amber-500/40 hover:border-amber-400 p-3 sm:p-4 rounded-2xl shadow-2xl hover:shadow-amber-500/20 cursor-pointer transition-all flex items-center gap-3.5 select-none"
      >
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="absolute top-2 right-2 p-1 rounded-lg bg-black/40 text-gray-400 hover:text-white hover:bg-black/80 transition-colors z-10"
          title="Close Ad"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Thumbnail or Pulsing Icon */}
        <div className="relative shrink-0">
          {ad.imageUrl ? (
            <img
              src={ad.imageUrl}
              alt={ad.headline || ad.name}
              className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-md group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-black shadow-md">
              <Zap className="w-6 h-6 fill-black" />
            </div>
          )}
          {/* Pulsing online badge */}
          <span className="absolute -top-1 -left-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#171724] animate-ping" />
          <span className="absolute -top-1 -left-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#171724]" />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 px-1.5 py-0.2 rounded font-mono">
              Notification #{ad.unitCodeId || 'SocialBar'}
            </span>
          </div>
          <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate mt-0.5">
            {ad.headline || ad.name}
          </h5>
          <p className="text-[11px] text-gray-300 truncate">
            {ad.description || 'Tap to view exclusive offer'}
          </p>
        </div>

        {/* CTA Button */}
        <button className="shrink-0 px-3.5 py-2 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-black font-black text-xs flex items-center gap-1 shadow-md shadow-amber-500/20 transition-all active:scale-95">
          <span>{ad.ctaText || 'Open'}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
