import React from 'react';
import { Play, Plus, Info, Star, Check } from 'lucide-react';
import { VideoItem } from '../types/video';

interface HeroBannerProps {
  video: VideoItem;
  onPlay: (video: VideoItem) => void;
  onToggleWatchlist: (videoId: string) => void;
  isWatchlisted?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  video,
  onPlay,
  onToggleWatchlist,
  isWatchlisted = false,
}) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-8 group border border-white/5 bg-[#0e0e12]">
      {/* Background Image with Cinematic Darkness Vignette */}
      <div className="relative h-[380px] sm:h-[460px] md:h-[520px] w-full overflow-hidden">
        <img
          src={video.coverUrl}
          alt={video.title}
          className="w-full h-full object-cover object-center brightness-75 group-hover:scale-102 transition-transform duration-700"
        />

        {/* Cinematic gradient overlays matching screenshot */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0f] via-[#0b0b0f]/70 to-transparent"></div>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-12 z-10 max-w-4xl">
        <div className="space-y-4">
          
          {/* Metadata Badges line from screenshot */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 rounded text-xs font-black uppercase bg-amber-500 text-black tracking-wide">
              {video.badge || 'TRENDING #1'}
            </span>
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-white/10 backdrop-blur-md text-gray-200 border border-white/10">
              {video.resolution || '4K Ultra HD'}
            </span>
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-white/10 backdrop-blur-md text-gray-200 border border-white/10">
              {video.genre || 'Sci-Fi • 2h 14m'}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-white/10 px-2.5 py-1 rounded border border-white/10">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{video.rating || 4.9}</span>
              <span className="text-gray-400 font-normal">({video.reviewsCount || '128k reviews'})</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            {video.title}
          </h1>

          {/* Synopsis Description */}
          <p className="text-gray-300 text-sm sm:text-base line-clamp-3 max-w-2xl leading-relaxed">
            {video.description}
          </p>

          {/* Action Buttons from screenshot */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {/* Watch Now Button */}
            <button
              onClick={() => onPlay(video)}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm sm:text-base transition-all shadow-lg shadow-amber-500/25 active:scale-95"
            >
              <Play className="w-4 h-4 fill-black text-black ml-0.5" />
              <span>Watch Now</span>
            </button>

            {/* Add to Watchlist Button */}
            <button
              onClick={() => onToggleWatchlist(video.id)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition-all border ${
                isWatchlisted
                  ? 'bg-white/20 border-white/30 text-white'
                  : 'bg-white/10 hover:bg-white/15 border-white/10 text-gray-200'
              }`}
            >
              {isWatchlisted ? <Check className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4" />}
              <span>{isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>

            {/* Info Button */}
            <button
              onClick={() => onPlay(video)}
              className="p-3 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10 transition-colors"
              title="More Information"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
