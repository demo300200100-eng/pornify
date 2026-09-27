import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreVertical, 
  Play, 
  Bookmark, 
  Trash2, 
  Edit3, 
  VolumeX, 
  AlertTriangle 
} from 'lucide-react';
import { VideoItem } from '../types/video';
import { parseVideoUrl, formatViews } from '../utils/videoParser';

interface VideoCardProps {
  video: VideoItem;
  onPlay: (video: VideoItem) => void;
  onToggleBookmark?: (videoId: string, e: React.MouseEvent) => void;
  onEditVideo?: (video: VideoItem) => void;
  onDeleteVideo?: (videoId: string) => void;
  isAdmin?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPlay,
  onToggleBookmark,
  onEditVideo,
  onDeleteVideo,
  isAdmin = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const parsed = parseVideoUrl(video.videoUrl);

  // Auto-play preview when mouse enters card
  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setIsPlayingPreview(true);
    }, 200);
  };

  // Stop auto-play preview when mouse leaves card
  const handleMouseLeave = () => {
    setIsPlayingPreview(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  return (
    <>
      <div
        onClick={() => onPlay(video)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
        className="group flex flex-col cursor-pointer select-none font-sans"
      >
        {/* Thumbnail & Auto-play Preview Container */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#18181e] mb-3 border border-white/5 group-hover:border-amber-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-500/10">
          
          {/* Static Cover Image */}
          <img
            src={video.coverUrl}
            alt={video.title}
            loading="lazy"
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }}
            className={`w-full h-full object-cover transition-all duration-300 ${
              isPlayingPreview ? 'opacity-0 scale-105' : 'opacity-100 group-hover:scale-103'
            }`}
          />

          {/* Dynamic Hover Autoplay Video Stream */}
          {isPlayingPreview && (
            <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden z-10 transition-opacity duration-300 pointer-events-none">
              {parsed.type === 'mp4' && (
                <video
                  ref={videoRef}
                  src={parsed.directUrl || video.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                  disableRemotePlayback
                  preload="metadata"
                  className="w-full h-full object-cover pointer-events-none"
                />
              )}

              {parsed.type === 'youtube' && parsed.previewEmbedUrl && (
                <iframe
                  src={parsed.previewEmbedUrl}
                  title={video.title}
                  className="w-full h-full pointer-events-none scale-105"
                  allow="autoplay; encrypted-media"
                  tabIndex={-1}
                />
              )}

              {parsed.type === 'vimeo' && parsed.previewEmbedUrl && (
                <iframe
                  src={parsed.previewEmbedUrl}
                  title={video.title}
                  className="w-full h-full pointer-events-none scale-105"
                  allow="autoplay; fullscreen"
                  tabIndex={-1}
                />
              )}

              {parsed.type !== 'mp4' && parsed.type !== 'youtube' && parsed.type !== 'vimeo' && (
                <video
                  src={parsed.directUrl || video.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                  disableRemotePlayback
                  className="w-full h-full object-cover pointer-events-none"
                />
              )}

              {/* Simple subtle mute preview icon */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-black/75 text-[10px] text-gray-300">
                <VolumeX className="w-3 h-3 text-amber-400" />
              </div>
            </div>
          )}

          {/* Hover Dark Overlay with Play Icon */}
          {!isPlayingPreview && (
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/30 scale-90 group-hover:scale-100 transition-transform">
                <Play className="w-5 h-5 fill-black ml-0.5" />
              </div>
            </div>
          )}

          {/* Featured Badge */}
          {video.featured && !isPlayingPreview && (
            <div className="absolute top-2.5 left-2.5">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
                Featured
              </span>
            </div>
          )}

          {/* Duration Badge */}
          <div className="absolute bottom-2.5 right-2.5 z-20">
            <span className="px-2 py-0.5 rounded bg-black/85 backdrop-blur-sm text-[11px] font-semibold text-gray-200 font-mono tracking-tight border border-white/5">
              {video.duration}
            </span>
          </div>
        </div>

        {/* Card Body Details */}
        <div className="flex flex-col flex-1 justify-between">
          
          {/* Title & Actions Row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-sm sm:text-base text-gray-100 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
              {video.title}
            </h3>

            {/* If Admin: show dropdown menu with Edit & Delete */}
            {isAdmin ? (
              <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Admin Options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-7 w-48 bg-[#1a1a22] rounded-xl border border-white/10 shadow-2xl p-1.5 z-30 space-y-1">
                    {onToggleBookmark && (
                      <button
                        onClick={(e) => {
                          setShowMenu(false);
                          onToggleBookmark(video.id, e);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-gray-400" />
                        <span>{video.isBookmarked ? 'Remove from My List' : 'Add to My List'}</span>
                      </button>
                    )}

                    {onEditVideo && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onEditVideo(video);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit in Dashboard</span>
                      </button>
                    )}

                    {onDeleteVideo && (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setShowDeleteModal(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>Delete Video</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* For normal visitors: Only quick Watchlist bookmark button! NO edit, NO delete! */
              onToggleBookmark && (
                <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => onToggleBookmark(video.id, e)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      video.isBookmarked
                        ? 'text-amber-400 bg-amber-500/15'
                        : 'text-gray-500 hover:text-gray-200 hover:bg-white/10'
                    }`}
                    title={video.isBookmarked ? 'In Watchlist' : 'Add to Watchlist'}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              )
            )}
          </div>

          {/* Metadata Row: Category & Views */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <span className="font-semibold text-gray-300">
              {video.category}
            </span>
            <span>•</span>
            <span>{formatViews(video.views)} views</span>
            {video.resolution && (
              <>
                <span>•</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white/5 rounded border border-white/5">
                  {video.resolution}
                </span>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal (Admin Only) */}
      {showDeleteModal && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans"
        >
          <div className="w-full max-w-sm bg-[#16161e] border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Video</h3>
                <p className="text-xs text-gray-400">This action cannot be undone</p>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl text-xs text-gray-300 font-medium line-clamp-2">
              "{video.title}"
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  if (onDeleteVideo) onDeleteVideo(video.id);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
