import React, { useEffect, useRef } from 'react';
import { 
  Play, 
  Search, 
  Plus, 
  Sliders, 
  X,
  Flame,
  Layers,
  Bookmark,
  LogOut,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { PlatformViewMode, CryptoVipSettings } from '../types/video';

interface HeaderProps {
  siteName?: string;
  currentView: PlatformViewMode;
  onSelectView: (view: PlatformViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenPublishModal: () => void;
  onOpenDashboard: () => void;
  watchlistCount?: number;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onLogoutAdmin: () => void;
  onOpenRemoveAds?: () => void;
  isAdFreeActive?: boolean;
  vipSettings?: CryptoVipSettings;
}

export const Header: React.FC<HeaderProps> = ({
  siteName = 'Pornify',
  currentView,
  onSelectView,
  searchQuery,
  onSearchChange,
  onOpenPublishModal,
  onOpenDashboard,
  watchlistCount = 0,
  isAdmin,
  onOpenAdminLogin,
  onLogoutAdmin,
  onOpenRemoveAds,
  isAdFreeActive = false,
  vipSettings,
}) => {
  // Secret triple-click on brand logo to open owner login
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    onSelectView('home');

    // Count rapid clicks for owner discreet login
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onOpenAdminLogin();
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 700);
  };

  // Keyboard shortcut (Alt + A or Ctrl + Shift + A) to open admin login
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        if (isAdmin) {
          onOpenDashboard();
        } else {
          onOpenAdminLogin();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, onOpenDashboard, onOpenAdminLogin]);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0e0e12]/95 backdrop-blur-md border-b border-white/[0.07] px-4 lg:px-8 py-3.5 font-sans">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo & Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Brand Logo & Name (Clicking goes home, triple-clicking opens Admin Login) */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
            title={siteName}
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
              <Play className="w-5 h-5 fill-black text-black ml-0.5" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans flex items-center uppercase">
              {siteName.toLowerCase() === 'pornify' ? (
                <>
                  Porn<span className="text-amber-500">ify</span>
                </>
              ) : (
                siteName
              )}
            </span>
          </div>

          {/* Desktop Navigation Links (English) */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            <button
              onClick={() => onSelectView('home')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                currentView === 'home'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onSelectView('trending')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'trending'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Trending</span>
            </button>
            <button
              onClick={() => onSelectView('categories')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'categories'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-gray-400" />
              <span>Categories</span>
            </button>
            <button
              onClick={() => onSelectView('library')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'library'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>My List</span>
              {watchlistCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                  {watchlistCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Right Side: Search & Admin Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Search Input Bar */}
          <div className="relative w-36 sm:w-56 md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search videos..."
              className="w-full bg-[#18181e] text-gray-100 text-xs sm:text-sm rounded-lg pl-8 pr-8 py-2 border border-white/10 focus:border-amber-500 focus:outline-none transition-all placeholder:text-gray-500"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Remove Ads / VIP Badge (USDT Crypto system) */}
          {vipSettings?.enabled !== false && onOpenRemoveAds && (
            isAdFreeActive ? (
              <button
                onClick={onOpenRemoveAds}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all text-xs font-semibold shrink-0 shadow-sm"
                title="VIP Member - Ads Disabled"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>VIP Ad-Free</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            ) : (
              <button
                onClick={onOpenRemoveAds}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shrink-0 shadow-md shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-95 border border-emerald-400/30"
                title={`Remove all ads for only ${vipSettings?.priceUsdt ?? 5} USDT`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span className="hidden sm:inline">Remove Ads</span>
                <span className="sm:hidden font-mono">${vipSettings?.priceUsdt ?? 5}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-emerald-200 font-mono hidden md:inline">
                  {vipSettings?.priceUsdt ?? 5} USDT
                </span>
              </button>
            )
          )}

          {/* ADMIN ONLY CONTROLS (Only visible when owner is authenticated) */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              {/* Quick Add Video button */}
              <button
                onClick={onOpenPublishModal}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-amber-500 text-black hover:bg-amber-400 transition-colors shadow-sm active:scale-95 shrink-0"
                title="Add New Video"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Add Video</span>
                <span className="sm:hidden">Add</span>
              </button>

              {/* Admin Dashboard Button */}
              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1c1c24] text-amber-400 hover:text-amber-300 border border-amber-500/40 hover:bg-[#252532] transition-all text-xs sm:text-sm font-semibold shrink-0"
                title="Open Admin Dashboard"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Dashboard</span>
              </button>

              {/* Exit Admin / View as Visitor button */}
              <button
                onClick={onLogoutAdmin}
                className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition-colors border border-rose-500/30"
                title="Exit Admin (View as Visitor)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}

        </div>

      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto scrollbar-none pt-2.5 text-xs">
        <button
          onClick={() => onSelectView('home')}
          className={`px-3 py-1.5 rounded-lg shrink-0 font-semibold ${currentView === 'home' ? 'bg-amber-500 text-black font-bold' : 'text-gray-300 bg-white/5'}`}
        >
          Home
        </button>
        <button
          onClick={() => onSelectView('trending')}
          className={`px-3 py-1.5 rounded-lg shrink-0 font-semibold ${currentView === 'trending' ? 'bg-amber-500 text-black font-bold' : 'text-gray-300 bg-white/5'}`}
        >
          Trending
        </button>
        <button
          onClick={() => onSelectView('categories')}
          className={`px-3 py-1.5 rounded-lg shrink-0 font-semibold ${currentView === 'categories' ? 'bg-amber-500 text-black font-bold' : 'text-gray-300 bg-white/5'}`}
        >
          Categories
        </button>
        <button
          onClick={() => onSelectView('library')}
          className={`px-3 py-1.5 rounded-lg shrink-0 font-semibold ${currentView === 'library' ? 'bg-amber-500 text-black font-bold' : 'text-gray-300 bg-white/5'}`}
        >
          My List ({watchlistCount})
        </button>
      </div>
    </header>
  );
};
