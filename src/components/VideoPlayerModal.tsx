import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  Tv, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  RotateCw, 
  Bookmark, 
  MessageSquare, 
  Send, 
  HelpCircle,
  ThumbsUp,
  Trash2,
  Zap
} from 'lucide-react';
import { VideoItem, VideoComment, AdUnit } from '../types/video';
import { parseVideoUrl, formatViews, formatTimeAgo } from '../utils/videoParser';
import { AdBannerRenderer } from './AdBannerRenderer';

interface VideoPlayerModalProps {
  video: VideoItem;
  onClose: () => void;
  onSelectRelated: (video: VideoItem) => void;
  allVideos: VideoItem[];
  onToggleWatchlist: (videoId: string) => void;
  isWatchlisted: boolean;
  comments?: VideoComment[];
  onAddComment?: (comment: VideoComment) => void;
  onDeleteComment?: (commentId: string) => void;
  onToggleLikeComment?: (commentId: string) => void;
  isAdmin?: boolean;
  allowComments?: boolean;
  ads?: AdUnit[];
  enableAds?: boolean;
  onAdClick?: (adId: string) => void;
  onOpenRemoveAds?: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  onClose,
  onSelectRelated,
  allVideos,
  onToggleWatchlist,
  isWatchlisted,
  comments = [],
  onAddComment,
  onDeleteComment,
  onToggleLikeComment,
  isAdmin = false,
  allowComments = true,
  ads = [],
  enableAds = true,
  onAdClick,
  onOpenRemoveAds,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [toastText, setToastText] = useState<string | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Filter comments for this video
  const videoComments = useMemo(() => {
    return comments.filter((c) => c.videoId === video.id);
  }, [comments, video.id]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const parsedVideo = parseVideoUrl(video.videoUrl);

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 2200);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowright':
          e.preventDefault();
          seekBy(5);
          break;
        case 'arrowleft':
          e.preventDefault();
          seekBy(-5);
          break;
        case 'escape':
          if (!document.fullscreenElement) {
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, isFullscreen, duration, currentTime]);

  // Autohide controls timer
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  // Custom Player Controls Methods
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seekBy = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + seconds));
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume > 0 ? volume : 0.8;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    showToast(`Playback speed: ${rate}x`);
  };

  const toggleFullscreen = () => {
    if (!stageRef.current) return;
    if (!document.fullscreenElement) {
      stageRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleToggleLoop = () => {
    setIsLooping((prev) => !prev);
    if (videoRef.current) {
      videoRef.current.loop = !isLooping;
    }
    showToast(!isLooping ? 'Loop: ON' : 'Loop: OFF');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment: VideoComment = {
      id: `comm-${Date.now()}`,
      videoId: video.id,
      author: 'User',
      handle: '@viewer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text: commentText.trim(),
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };
    if (onAddComment) {
      onAddComment(newComment);
    }
    setCommentText('');
    showToast('Comment posted successfully ✓');
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Related videos
  const relatedVideos = allVideos
    .filter((v) => v.id !== video.id)
    .slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-xl flex flex-col font-sans">
      
      {/* Toast Alert */}
      {toastText && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#191924] border border-amber-500/50 text-amber-300 font-bold text-xs shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <span>{toastText}</span>
        </div>
      )}

      {/* Top Floating Player Bar */}
      <div className="sticky top-0 z-40 bg-[#0e0e14]/90 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
          <span className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md md:max-w-xl">
            {video.title}
          </span>
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Cinema Mode Toggle */}
          <button
            onClick={() => setIsCinemaMode(!isCinemaMode)}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isCinemaMode
                ? 'bg-amber-500 text-black border-amber-400 font-bold'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
            }`}
            title="Toggle Cinema Mode"
          >
            <Tv className="w-4 h-4" />
            <span className="hidden sm:inline">{isCinemaMode ? 'Normal View' : 'Cinema Mode'}</span>
          </button>

          {/* Keyboard Shortcuts Help */}
          <button
            onClick={() => setShowKeyboardHelp(true)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all border border-white/10"
            title="Keyboard Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-rose-600 text-gray-300 hover:text-white transition-all border border-white/10"
            title="Close Player (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 w-full mx-auto px-4 py-4 sm:py-6 transition-all ${isCinemaMode ? 'max-w-full' : 'max-w-[1550px]'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (Player & Info) */}
          <div className={`${isCinemaMode ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-4`}>
            
            {/* The In-App Video Viewport Stage */}
            <div
              ref={stageRef}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }}
              onMouseMove={handleMouseMove}
              className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl group select-none"
            >
              {/* PRIMARY PROPRIETARY PLAYER (Direct URL, MP4, Streams, CDN) */}
              {parsedVideo.type !== 'youtube' && parsedVideo.type !== 'vimeo' && parsedVideo.type !== 'iframe' && (
                <>
                  <video
                    ref={videoRef}
                    src={parsedVideo.directUrl || video.videoUrl}
                    autoPlay
                    playsInline
                    loop={isLooping}
                    controls={false}
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    disableRemotePlayback
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }}
                    onTimeUpdate={() => {
                      if (videoRef.current) {
                        setCurrentTime(videoRef.current.currentTime);
                        setDuration(videoRef.current.duration || 0);
                      }
                    }}
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        setDuration(videoRef.current.duration || 0);
                      }
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full h-full object-contain bg-black"
                  />

                  {/* Transparent Click Shield Over Video */}
                  <div
                    onClick={togglePlay}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }}
                    className="absolute inset-0 z-10 cursor-pointer"
                  />

                  {/* Center Play/Pause Flash Overlay */}
                  {!isPlaying && (
                    <div 
                      onClick={togglePlay}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer z-20 pointer-events-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-2xl scale-95 hover:scale-105 transition-transform pointer-events-auto">
                        <Play className="w-8 h-8 fill-black ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Custom Controls Bar Overlaid at Bottom */}
                  <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-3 sm:p-4 z-30 transition-opacity duration-300 space-y-2 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    
                    {/* Scrub Progress Bar */}
                    <div className="relative flex items-center group/scrub cursor-pointer">
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        step={0.1}
                        value={currentTime}
                        onChange={handleSeekChange}
                        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500 group-hover/scrub:h-2.5 transition-all"
                      />
                    </div>

                    {/* Bottom Controls Row */}
                    <div className="flex items-center justify-between gap-3 text-white text-xs">
                      
                      {/* Left: Play, Rewind, Fast Forward, Volume & Time */}
                      <div className="flex items-center gap-3">
                        {/* Play/Pause */}
                        <button
                          onClick={togglePlay}
                          className="p-1.5 rounded-lg bg-amber-500 text-black hover:bg-amber-400 font-bold transition-all active:scale-90"
                          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                        </button>

                        {/* Rewind 10s */}
                        <button
                          onClick={() => seekBy(-10)}
                          className="p-1 text-gray-300 hover:text-amber-400 transition-colors"
                          title="Rewind 10s"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>

                        {/* Forward 10s */}
                        <button
                          onClick={() => seekBy(10)}
                          className="p-1 text-gray-300 hover:text-amber-400 transition-colors"
                          title="Forward 10s"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>

                        {/* Volume / Mute */}
                        <div className="flex items-center gap-1.5 group/vol">
                          <button
                            onClick={toggleMute}
                            className="p-1 text-gray-300 hover:text-white"
                            title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                          >
                            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
                          />
                        </div>

                        {/* Time display */}
                        <div className="text-[11px] font-mono text-gray-300">
                          <span className="text-amber-400">{formatSeconds(currentTime)}</span>
                          <span className="mx-1 text-gray-500">/</span>
                          <span>{formatSeconds(duration)}</span>
                        </div>
                      </div>

                      {/* Right: Loop, Speed, Fullscreen */}
                      <div className="flex items-center gap-2.5">
                        {/* Loop button */}
                        <button
                          onClick={handleToggleLoop}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                            isLooping 
                              ? 'bg-amber-500 text-black border-amber-400 font-bold' 
                              : 'bg-black/60 text-gray-400 border-white/10 hover:text-white'
                          }`}
                          title="Toggle Loop"
                        >
                          Loop
                        </button>

                        {/* Playback speed */}
                        <select
                          value={playbackRate}
                          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                          className="bg-black/60 text-gray-300 hover:text-white text-[11px] font-mono rounded px-1.5 py-0.5 border border-white/10 focus:outline-none"
                          title="Playback Speed"
                        >
                          <option value="0.5">0.5x</option>
                          <option value="0.75">0.75x</option>
                          <option value="1">1x Normal</option>
                          <option value="1.25">1.25x</option>
                          <option value="1.5">1.5x</option>
                          <option value="2">2x</option>
                        </select>

                        {/* Fullscreen */}
                        <button
                          onClick={toggleFullscreen}
                          className="p-1 text-gray-300 hover:text-amber-400 transition-colors"
                          title="Fullscreen (F)"
                        >
                          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                      </div>

                    </div>
                  </div>
                </>
              )}

              {/* YouTube In-App Player */}
              {parsedVideo.type === 'youtube' && (
                <iframe
                  src={parsedVideo.embedUrl}
                  title={video.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}

              {/* Vimeo In-App Player */}
              {parsedVideo.type === 'vimeo' && (
                <iframe
                  src={parsedVideo.embedUrl}
                  title={video.title}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )}

              {/* Iframe / Embed Player */}
              {parsedVideo.type === 'iframe' && (
                <iframe
                  src={parsedVideo.embedUrl}
                  title={video.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}

              {/* Keyboard Help Modal */}
              {showKeyboardHelp && (
                <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md p-6 flex flex-col justify-center items-center text-center font-sans">
                  <div className="bg-[#1c1c24] border border-white/15 p-6 rounded-2xl max-w-sm w-full space-y-3 shadow-2xl text-left">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h4 className="font-bold text-sm text-white">Keyboard Shortcuts</h4>
                      <button onClick={() => setShowKeyboardHelp(false)} className="text-gray-400 hover:text-white">✕</button>
                    </div>
                    <div className="space-y-2 text-xs text-gray-300">
                      <div className="flex justify-between"><span>Space</span><span className="font-mono text-amber-400">Play / Pause</span></div>
                      <div className="flex justify-between"><span>M</span><span className="font-mono text-amber-400">Mute / Unmute</span></div>
                      <div className="flex justify-between"><span>F</span><span className="font-mono text-amber-400">Fullscreen</span></div>
                      <div className="flex justify-between"><span>Left / Right Arrows</span><span className="font-mono text-amber-400">Seek 5s</span></div>
                      <div className="flex justify-between"><span>Esc</span><span className="font-mono text-amber-400">Close Player</span></div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Video Metadata Panel */}
            <div className="bg-[#14141a] rounded-2xl p-5 sm:p-6 border border-white/10 space-y-5">
              
              {/* Title & Stats */}
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {video.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span className="text-amber-400 font-semibold">{formatViews(video.views + 1)} views</span>
                  <span>•</span>
                  <span>{formatTimeAgo(video.createdAt)}</span>
                  <span>•</span>
                  <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase text-gray-300 font-mono">
                    Category #{video.category}
                  </span>
                  {video.resolution && (
                    <span className="px-2 py-0.5 rounded bg-white/5 text-gray-400 font-mono text-[11px]">
                      {video.resolution}
                    </span>
                  )}
                  {video.badge && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                      {video.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Bar (Duration and Watchlist) */}
              <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-[#1b1b22] border border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span>Duration:</span>
                  <span className="font-mono text-amber-400 font-bold">{video.duration}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleWatchlist(video.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      isWatchlisted
                        ? 'bg-amber-500 text-black border-amber-400 font-bold'
                        : 'bg-white/10 hover:bg-white/15 text-gray-200 border-white/10'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{isWatchlisted ? 'In Watchlist ✓' : '+ Add to Watchlist'}</span>
                  </button>
                </div>
              </div>

              {/* Synopsis Description */}
              <div className="bg-[#18181e] p-4 rounded-xl text-xs sm:text-sm text-gray-300 leading-relaxed space-y-2">
                <p>{video.description}</p>
                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {video.tags.map((t, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded bg-white/5 text-amber-300/80 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Under-Player Ad Banner */}
              {enableAds && ads.filter((a) => a.active && (a.placement === 'player_under' || a.format === 'banner_468x60' || a.format === 'banner_728x90')).slice(0, 1).map((ad) => (
                <div key={ad.id} className="pt-2 space-y-1.5">
                  {onOpenRemoveAds && (
                    <div className="flex justify-end">
                      <button
                        onClick={onOpenRemoveAds}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold transition-colors bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20"
                      >
                        <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>Remove Ads (USDT VIP)</span>
                      </button>
                    </div>
                  )}
                  <AdBannerRenderer ad={ad} onAdClick={onAdClick} />
                </div>
              ))}

              {/* Comments & Discussions */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-500" />
                    <span>Comments & Discussions ({videoComments.length})</span>
                  </h3>
                  {!allowComments && (
                    <span className="text-[11px] text-amber-400/80 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      Comments are disabled
                    </span>
                  )}
                </div>

                {/* Add comment */}
                {allowComments ? (
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment on this video..."
                      className="flex-1 bg-[#1b1b24] text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 border border-white/10 focus:outline-none focus:border-amber-500 placeholder:text-gray-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post</span>
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-gray-400 italic bg-[#161620] p-3 rounded-xl border border-white/5">
                    Commenting has been temporarily paused by site administration.
                  </p>
                )}

                {/* Comments List */}
                <div className="space-y-3">
                  {videoComments.length > 0 ? (
                    videoComments.map((comm) => (
                      <div key={comm.id} className="p-3.5 rounded-xl bg-[#181820] border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={comm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                              alt={comm.author}
                              className="w-6 h-6 rounded-full object-cover border border-white/10"
                            />
                            <span className="font-bold text-xs text-gray-200">{comm.author}</span>
                            {comm.handle && (
                              <span className="text-[11px] text-gray-400 font-mono">{comm.handle}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-gray-400">{comm.timestamp}</span>
                            {isAdmin && onDeleteComment && (
                              <button
                                onClick={() => onDeleteComment(comm.id)}
                                className="p-1 rounded text-gray-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                                title="Delete comment (Admin)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-gray-300 leading-normal pl-8">{comm.text}</p>

                        <div className="pl-8 flex items-center gap-3 pt-1">
                          <button
                            onClick={() => onToggleLikeComment && onToggleLikeComment(comm.id)}
                            className={`flex items-center gap-1 text-[11px] transition-colors ${
                              comm.isLiked ? 'text-amber-400 font-bold' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{comm.likes || 0}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-gray-400 bg-[#14141c] rounded-xl border border-white/5">
                      No comments yet. Be the first to share your thoughts!
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column (Related Videos & Sidebar Ads) */}
          {!isCinemaMode && (
            <div className="lg:col-span-4 space-y-4">
              
              {/* Sidebar Ad Unit (e.g. 300x250) */}
              {enableAds && ads.filter((a) => a.active && (a.placement === 'player_sidebar' || a.format === 'banner_300x250')).slice(0, 1).map((ad) => (
                <div key={ad.id} className="mb-2">
                  <AdBannerRenderer ad={ad} onAdClick={onAdClick} />
                </div>
              ))}

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                  <span>Related Videos</span>
                </h3>
                <span className="text-[10px] text-gray-400 font-mono">
                  {relatedVideos.length} videos
                </span>
              </div>

              <div className="space-y-3">
                {relatedVideos.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectRelated(item)}
                    className="flex gap-3 p-2 rounded-xl bg-[#14141a] hover:bg-[#1f1f2a] border border-white/5 hover:border-amber-500/30 cursor-pointer transition-all group"
                  >
                    <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[10px] font-mono text-gray-300">
                        {item.duration}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <h4 className="text-xs font-bold text-gray-200 group-hover:text-amber-400 transition-colors line-clamp-2 leading-tight">
                        {item.title}
                      </h4>
                      <div className="text-[11px] text-gray-400">
                        <span>{formatViews(item.views)} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
