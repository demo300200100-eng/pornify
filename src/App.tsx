import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_VIDEOS,
  HERO_FEATURED_VIDEO,
  INITIAL_COMMENTS,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_CRYPTO_VIP
} from './data/initialVideos';
import { INITIAL_AD_UNITS } from './data/initialAds';
import { 
  VideoCategory, 
  VideoItem, 
  VideoComment, 
  SiteSettings, 
  AdUnit, 
  PlatformViewMode, 
  CryptoVipSettings 
} from './types/video';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { VideoCard } from './components/VideoCard';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { PublishModal } from './components/PublishModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Footer } from './components/Footer';
import { InfoModal, InfoModalTab } from './components/InfoModal';
import { AdBannerRenderer } from './components/AdBannerRenderer';
import { RemoveAdsWidget } from './components/RemoveAdsWidget';
import { RemoveAdsModal } from './components/RemoveAdsModal';
import { Check, ShieldCheck, Zap } from 'lucide-react';

const STORAGE_KEY_VIDEOS = 'streamio_videos_store';
const STORAGE_KEY_CATEGORIES = 'streamio_categories_store';
const STORAGE_KEY_WATCHLIST = 'streamio_watchlist_store';
const STORAGE_KEY_ADMIN_AUTH = 'streamio_admin_auth_store';
const STORAGE_KEY_SETTINGS = 'streamio_settings_store';
const STORAGE_KEY_COMMENTS = 'streamio_comments_store';
const STORAGE_KEY_ADS = 'streamio_ads_store';
const STORAGE_KEY_VIP_PASS = 'streamio_vip_ad_free';

function loadInitialSettings(): SiteSettings {
  const candidateKeys = [
    'streamio_settings_store',
    'pornify_settings_store',
    'streamio_site_settings',
  ];
  for (const k of candidateKeys) {
    try {
      const raw = localStorage.getItem(k);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_SITE_SETTINGS,
            cryptoVip: {
              ...DEFAULT_CRYPTO_VIP,
              ...(parsed.cryptoVip || {}),
            },
            enableAds: true,
            ...parsed,
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  return {
    ...DEFAULT_SITE_SETTINGS,
    cryptoVip: DEFAULT_CRYPTO_VIP,
    enableAds: true,
  };
}

function loadInitialAds(): AdUnit[] {
  const candidateKeys = [
    'streamio_ads_store',
    'pornify_ads_store',
    'streamio_ad_units_v1',
  ];
  for (const k of candidateKeys) {
    try {
      const raw = localStorage.getItem(k);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  return INITIAL_AD_UNITS;
}

function loadInitialComments(): VideoComment[] {
  const candidateKeys = [
    'streamio_comments_store',
    'pornify_comments_store',
    'streamio_comments_v1',
  ];
  for (const k of candidateKeys) {
    try {
      const raw = localStorage.getItem(k);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  return INITIAL_COMMENTS;
}

function loadInitialVideos(): VideoItem[] {
  const candidateKeys = [
    'streamio_videos_store',
    'streamio_videos_v6',
    'streamio_videos_v5',
    'streamio_videos',
  ];
  for (const k of candidateKeys) {
    try {
      const raw = localStorage.getItem(k);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  return INITIAL_VIDEOS;
}

function loadInitialCategories(): VideoCategory[] {
  const candidateKeys = [
    'streamio_categories_store',
    'streamio_categories_v6',
    'streamio_categories_v5',
    'streamio_categories',
  ];
  for (const k of candidateKeys) {
    try {
      const raw = localStorage.getItem(k);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const withoutAll = parsed.filter((c: VideoCategory) => c.id.toLowerCase() !== 'all');
          return [
            { id: 'all', name: 'All', nameEn: 'All', iconName: 'Sparkles' },
            ...withoutAll,
          ];
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  return INITIAL_CATEGORIES;
}

export default function App() {
  const [currentView, setCurrentView] = useState<PlatformViewMode>('home');

  // Admin Authentication State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) || localStorage.getItem('streamio_admin_auth_v6');
      return savedAuth === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Persistent Site Settings & USDT Crypto VIP Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(loadInitialSettings);

  // User VIP Status (Ad-Free Active)
  const [isAdFreeActive, setIsAdFreeActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_VIP_PASS) === 'true';
    } catch {
      return false;
    }
  });
  const [isRemoveAdsModalOpen, setIsRemoveAdsModalOpen] = useState(false);

  // Persistent Videos & Categories
  const [videos, setVideos] = useState<VideoItem[]>(loadInitialVideos);
  const [categories, setCategories] = useState<VideoCategory[]>(loadInitialCategories);

  // Persistent Comments & Discussions
  const [comments, setComments] = useState<VideoComment[]>(loadInitialComments);

  // Persistent Ad Units (10 units from screenshot + custom ads)
  const [ads, setAds] = useState<AdUnit[]>(loadInitialAds);

  // Watchlist
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WATCHLIST) || localStorage.getItem('streamio_watchlist_v6');
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
    return new Set(['featured-hero', 'vid-2']);
  });

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Modals
  const [activePlayingVideo, setActivePlayingVideo] = useState<VideoItem | null>(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'add' | 'list' | 'categories' | 'ads' | 'comments' | 'settings' | 'stats'>('add');
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Legal & Help Info Modal State
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalTab, setInfoModalTab] = useState<InfoModalTab>('terms');

  // Popunder click tracker
  const popunderTriggeredRef = useRef(false);

  // Sync to multiple persistent keys so data is never lost
  useEffect(() => {
    const serialized = JSON.stringify(videos);
    localStorage.setItem(STORAGE_KEY_VIDEOS, serialized);
    localStorage.setItem('streamio_videos_v6', serialized);
  }, [videos]);

  useEffect(() => {
    const serialized = JSON.stringify(categories);
    localStorage.setItem(STORAGE_KEY_CATEGORIES, serialized);
    localStorage.setItem('streamio_categories_v6', serialized);
  }, [categories]);

  useEffect(() => {
    const serialized = JSON.stringify(Array.from(watchlistIds));
    localStorage.setItem(STORAGE_KEY_WATCHLIST, serialized);
    localStorage.setItem('streamio_watchlist_v6', serialized);
  }, [watchlistIds]);

  useEffect(() => {
    const serialized = JSON.stringify(siteSettings);
    localStorage.setItem(STORAGE_KEY_SETTINGS, serialized);
    localStorage.setItem('pornify_settings_store', serialized);
    // Dynamically update document title
    document.title = `${siteSettings.siteName} | ${siteSettings.siteTagline}`;
  }, [siteSettings]);

  useEffect(() => {
    const serialized = JSON.stringify(comments);
    localStorage.setItem(STORAGE_KEY_COMMENTS, serialized);
    localStorage.setItem('pornify_comments_store', serialized);
  }, [comments]);

  useEffect(() => {
    const serialized = JSON.stringify(ads);
    localStorage.setItem(STORAGE_KEY_ADS, serialized);
    localStorage.setItem('pornify_ads_store', serialized);
  }, [ads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, isAdmin ? 'true' : 'false');
    localStorage.setItem('streamio_admin_auth_v6', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  // Are ads enabled? (Must be true in settings AND user is NOT VIP Ad-Free!)
  const isAdsEnabled = siteSettings.enableAds !== false && !isAdFreeActive;

  const activePopunder = useMemo(() => {
    return ads.find(a => a.active && (a.format === 'popunder' || a.placement === 'popunder_click'));
  }, [ads]);

  const handleGlobalClick = () => {
    if (isAdsEnabled && activePopunder && !popunderTriggeredRef.current) {
      popunderTriggeredRef.current = true;
      if (activePopunder.targetUrl) {
        window.open(activePopunder.targetUrl, '_blank', 'noopener,noreferrer');
        // Increment popunder clicks
        setAds(prev => prev.map(a => a.id === activePopunder.id ? { ...a, clicks: (a.clicks || 0) + 1 } : a));
      }
    }
  };

  // Listen to #admin hash for owner login
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        if (!isAdmin) {
          setIsAdminLoginOpen(true);
        } else {
          setIsDashboardOpen(true);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAdmin]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    showToast('Logged in successfully as Administrator ✓');
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    setIsDashboardOpen(false);
    showToast('Exited Admin mode (Viewing as visitor)');
  };

  // Toggle watchlist
  const handleToggleWatchlist = (videoId: string) => {
    setWatchlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(videoId)) {
        next.delete(videoId);
        showToast('Removed from your watchlist');
      } else {
        next.add(videoId);
        showToast('Added to your watchlist ✓');
      }
      return next;
    });
  };

  // Featured hero video
  const heroVideo = useMemo(() => {
    const featured = videos.find((v) => v.featured);
    return featured || HERO_FEATURED_VIDEO || videos[0];
  }, [videos]);

  // Filtered videos for main display
  const filteredVideos = useMemo(() => {
    let list = [...videos];

    const isAll = 
      !activeCategory || 
      activeCategory.toLowerCase() === 'all' || 
      activeCategory === 'الكل' || 
      activeCategory === '*';

    // Filter by category only when not 'all'
    if (!isAll) {
      if (activeCategory.toLowerCase() === 'trending') {
        list = [...videos].sort((a, b) => b.views - a.views);
      } else {
        list = videos.filter((v) => {
          if (!v.category) return false;
          return v.category.toLowerCase().trim() === activeCategory.toLowerCase().trim();
        });
      }
    }

    // View mode filters
    if (currentView === 'trending') {
      list = [...list].sort((a, b) => b.views - a.views);
    } else if (currentView === 'library') {
      list = list.filter((v) => watchlistIds.has(v.id));
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          (v.category && v.category.toLowerCase().includes(q)) ||
          v.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [videos, activeCategory, currentView, searchQuery, watchlistIds]);

  // Video Actions (Admin)
  const handleSaveVideo = (videoToSave: VideoItem) => {
    setVideos((prev) => {
      const exists = prev.some((v) => v.id === videoToSave.id);
      if (exists) {
        return prev.map((v) => (v.id === videoToSave.id ? videoToSave : v));
      }
      return [videoToSave, ...prev];
    });
    setEditingVideo(null);
    showToast('Video saved and published successfully!');
  };

  const handleDeleteVideo = (videoId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
    if (activePlayingVideo?.id === videoId) setActivePlayingVideo(null);
    showToast('Video deleted successfully');
  };

  const handleEditCategory = (updatedCat: VideoCategory) => {
    setCategories((prev) => prev.map((c) => (c.id === updatedCat.id ? updatedCat : c)));
    showToast(`Category "${updatedCat.nameEn || updatedCat.name}" updated`);
  };

  // Comment Actions
  const handleAddComment = (newComment: VideoComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    showToast('Comment deleted');
  };

  const handleSaveComment = (updatedComment: VideoComment) => {
    setComments((prev) => prev.map((c) => (c.id === updatedComment.id ? updatedComment : c)));
  };

  const handleToggleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          const likes = isLiked ? (c.likes || 0) + 1 : Math.max(0, (c.likes || 0) - 1);
          return { ...c, isLiked, likes };
        }
        return c;
      })
    );
  };

  // Ad Actions
  const handleSaveAd = (savedAd: AdUnit) => {
    setAds((prev) => {
      const exists = prev.some((a) => a.id === savedAd.id);
      if (exists) {
        return prev.map((a) => (a.id === savedAd.id ? savedAd : a));
      }
      return [savedAd, ...prev];
    });
  };

  const handleDeleteAd = (adId: string) => {
    setAds((prev) => prev.filter((a) => a.id !== adId));
  };

  const handleToggleAdActive = (adId: string) => {
    setAds((prev) =>
      prev.map((a) => {
        if (a.id === adId) {
          const nextState = !a.active;
          showToast(nextState ? `Unit "${a.name}" is now Active` : `Unit "${a.name}" is Paused`);
          return { ...a, active: nextState };
        }
        return a;
      })
    );
  };

  const handleAdClick = (adId: string) => {
    setAds((prev) =>
      prev.map((a) => (a.id === adId ? { ...a, clicks: (a.clicks || 0) + 1 } : a))
    );
  };

  const handleResetAdsDefaults = () => {
    setAds(INITIAL_AD_UNITS);
    localStorage.removeItem(STORAGE_KEY_ADS);
    localStorage.removeItem('pornify_ads_store');
  };

  // Site Settings Action
  const handleUpdateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
  };

  // VIP Crypto Ads Removal Actions
  const handleUpgradeVipSuccess = () => {
    setIsAdFreeActive(true);
    localStorage.setItem(STORAGE_KEY_VIP_PASS, 'true');
    showToast('🎉 VIP Activated! All ads have been permanently removed.');
  };

  const handleCancelVipPass = () => {
    setIsAdFreeActive(false);
    localStorage.removeItem(STORAGE_KEY_VIP_PASS);
    showToast('VIP pass disabled. Standard mode active.');
  };

  // Import Data
  const handleImportData = (
    importedVideos: VideoItem[], 
    importedCategories?: VideoCategory[],
    importedComments?: VideoComment[],
    importedSettings?: SiteSettings,
    importedAds?: AdUnit[]
  ) => {
    if (importedVideos && importedVideos.length > 0) {
      setVideos((prev) => {
        const idSet = new Set(prev.map(v => v.id));
        const newOnes = importedVideos.filter(v => !idSet.has(v.id));
        return [...newOnes, ...prev];
      });
    }
    if (importedCategories && importedCategories.length > 0) {
      setCategories((prev) => {
        const idSet = new Set(prev.map(c => c.id));
        const newOnes = importedCategories.filter(c => !idSet.has(c.id));
        return [...prev, ...newOnes];
      });
    }
    if (importedComments && importedComments.length > 0) {
      setComments((prev) => {
        const idSet = new Set(prev.map(c => c.id));
        const newOnes = importedComments.filter(c => !idSet.has(c.id));
        return [...newOnes, ...prev];
      });
    }
    if (importedAds && importedAds.length > 0) {
      setAds(importedAds);
    }
    if (importedSettings) {
      setSiteSettings(importedSettings);
    }
    showToast('Data and Ad Units imported successfully!');
  };

  const handleResetDefaults = () => {
    setVideos(INITIAL_VIDEOS);
    setCategories(INITIAL_CATEGORIES);
    setComments(INITIAL_COMMENTS);
    setAds(INITIAL_AD_UNITS);
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setWatchlistIds(new Set(['featured-hero', 'vid-2']));
    setIsAdFreeActive(false);
    localStorage.removeItem(STORAGE_KEY_VIDEOS);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_WATCHLIST);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    localStorage.removeItem(STORAGE_KEY_COMMENTS);
    localStorage.removeItem(STORAGE_KEY_ADS);
    localStorage.removeItem(STORAGE_KEY_VIP_PASS);
    showToast('System defaults and ad units restored successfully');
  };

  // Specific Active Ads for Placements (Only active if isAdsEnabled is TRUE)
  const topHeaderAd = useMemo(() => {
    if (!isAdsEnabled) return null;
    return ads.find(a => a.active && (a.placement === 'top_header' || a.format === 'banner_728x90' || a.format === 'banner_320x50'));
  }, [ads, isAdsEnabled]);

  const heroBottomAd = useMemo(() => {
    if (!isAdsEnabled) return null;
    return ads.find(a => a.active && (a.placement === 'hero_bottom' || a.format === 'smartlink'));
  }, [ads, isAdsEnabled]);

  const footerTopAd = useMemo(() => {
    if (!isAdsEnabled) return null;
    return ads.find(a => a.active && (a.placement === 'footer_top' || a.format === 'banner_468x60'));
  }, [ads, isAdsEnabled]);

  const inFeedAds = useMemo(() => {
    if (!isAdsEnabled) return [];
    return ads.filter(a => a.active && (a.placement === 'in_grid_feed' || a.format === 'native_banner' || a.format === 'banner_300x250'));
  }, [ads, isAdsEnabled]);

  const vipSettings = siteSettings.cryptoVip || DEFAULT_CRYPTO_VIP;

  return (
    <div 
      onClick={handleGlobalClick}
      className="min-h-screen bg-[#0b0b0f] text-gray-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black"
    >
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191922] border border-amber-500/50 shadow-2xl text-amber-300 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-amber-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Remove Ads (USDT) Widget in place of VPN notification */}
      {vipSettings.enabled !== false && (
        <RemoveAdsWidget
          vipSettings={vipSettings}
          isAdFreeActive={isAdFreeActive}
          onOpenModal={() => setIsRemoveAdsModalOpen(true)}
        />
      )}

      {/* Top Navbar Header */}
      <Header
        siteName={siteSettings.siteName}
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          if (v === 'home' || v === 'categories') {
            setActiveCategory('all');
            setSearchQuery('');
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        onOpenDashboard={() => {
          setDashboardTab('list');
          setIsDashboardOpen(true);
        }}
        watchlistCount={watchlistIds.size}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onLogoutAdmin={handleLogoutAdmin}
        onOpenRemoveAds={() => setIsRemoveAdsModalOpen(true)}
        isAdFreeActive={isAdFreeActive}
        vipSettings={vipSettings}
      />

      {/* VIP Status Banner if user paid and activated */}
      {isAdFreeActive && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-emerald-950/60 border-b border-emerald-500/20 py-1.5 px-4 text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span><strong>VIP Member:</strong> Ad-Free Experience is Active. Fast uninterrupted 4K streaming.</span>
          <button 
            onClick={() => setIsRemoveAdsModalOpen(true)}
            className="underline hover:text-white ml-2 text-[11px]"
          >
            Manage Pass
          </button>
        </div>
      )}

      {/* Top Header Leaderboard Ad (728x90 / 320x50) */}
      {isAdsEnabled && topHeaderAd && (
        <div className="max-w-[1700px] mx-auto px-4 lg:px-8 pt-4 w-full">
          <AdBannerRenderer ad={topHeaderAd} onAdClick={handleAdClick} />
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-[1700px] mx-auto px-4 lg:px-8 pt-4 w-full">
        
        {/* Hero Spotlight Banner */}
        {!searchQuery && currentView === 'home' && (!activeCategory || activeCategory.toLowerCase() === 'all' || activeCategory === 'الكل') && heroVideo && (
          <div className="space-y-4 mb-6">
            <HeroBanner
              video={heroVideo}
              onPlay={(v) => setActivePlayingVideo(v)}
              onToggleWatchlist={handleToggleWatchlist}
              isWatchlisted={watchlistIds.has(heroVideo.id)}
            />
            {/* Hero Bottom Promo Smartlink Ad */}
            {isAdsEnabled && heroBottomAd && (
              <AdBannerRenderer ad={heroBottomAd} onAdClick={handleAdClick} />
            )}
          </div>
        )}

        {/* Category Pills Bar & Section Header */}
        <FilterBar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={(id) => {
            const isAll = !id || id.toLowerCase() === 'all' || id === 'الكل' || id === '*';
            if (isAll) {
              setActiveCategory('all');
              setCurrentView('home');
              setSearchQuery('');
            } else if (id.toLowerCase() === 'trending') {
              setActiveCategory('trending');
              setCurrentView('trending');
            } else {
              setActiveCategory(id);
              setCurrentView('home');
            }
          }}
          sectionTitle={
            searchQuery
              ? `Search results for "${searchQuery}"`
              : currentView === 'trending'
              ? 'Trending Videos'
              : currentView === 'library'
              ? 'My Watchlist'
              : (!activeCategory || activeCategory.toLowerCase() === 'all' || activeCategory === 'الكل')
              ? 'All Videos'
              : `Category: ${categories.find(c => c.id.toLowerCase() === activeCategory.toLowerCase())?.nameEn || activeCategory}`
          }
          onSeeAll={() => {
            setActiveCategory('all');
            setCurrentView('home');
            setSearchQuery('');
          }}
        />

        {/* Video Cards Grid with Interleaved In-Feed Ads */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
            {filteredVideos.map((video, index) => {
              // Interleave native ad every 3 videos if ads are enabled and available
              const showAdAfter = isAdsEnabled && inFeedAds.length > 0 && (index + 1) % 3 === 0;
              const adToRender = showAdAfter 
                ? inFeedAds[Math.floor(index / 3) % inFeedAds.length] 
                : null;

              return (
                <React.Fragment key={video.id}>
                  <VideoCard
                    video={video}
                    onPlay={(v) => setActivePlayingVideo(v)}
                    onToggleBookmark={(id) => handleToggleWatchlist(id)}
                    onEditVideo={(v) => {
                      setEditingVideo(v);
                      setDashboardTab('add');
                      setIsDashboardOpen(true);
                    }}
                    onDeleteVideo={handleDeleteVideo}
                    isAdmin={isAdmin}
                  />

                  {/* Interleaved Ad Banner Card */}
                  {showAdAfter && adToRender && (
                    <div className="flex flex-col justify-between">
                      <AdBannerRenderer ad={adToRender} onAdClick={handleAdClick} className="h-full" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#121217] rounded-2xl border border-white/5 p-8">
            <p className="text-gray-400 text-sm mb-4">
              {currentView === 'library'
                ? 'Your watchlist is currently empty. Tap the bookmark icon on any video to add it here.'
                : 'No videos found matching your search.'}
            </p>
            {isAdmin && (
              <button
                onClick={() => {
                  setDashboardTab('add');
                  setIsDashboardOpen(true);
                }}
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
              >
                + Add New Video Now
              </button>
            )}
          </div>
        )}

        {/* Above Footer Banner Ad */}
        {isAdsEnabled && footerTopAd && (
          <div className="pt-10">
            <AdBannerRenderer ad={footerTopAd} onAdClick={handleAdClick} />
          </div>
        )}

      </main>

      {/* Video Player Modal with Integrated In-Player & Sidebar Ads */}
      {activePlayingVideo && (
        <VideoPlayerModal
          video={activePlayingVideo}
          onClose={() => setActivePlayingVideo(null)}
          onSelectRelated={(v) => setActivePlayingVideo(v)}
          allVideos={videos}
          onToggleWatchlist={handleToggleWatchlist}
          isWatchlisted={watchlistIds.has(activePlayingVideo.id)}
          comments={comments}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onToggleLikeComment={handleToggleLikeComment}
          isAdmin={isAdmin}
          allowComments={siteSettings.allowComments}
          ads={ads}
          enableAds={isAdsEnabled}
          onAdClick={handleAdClick}
          onOpenRemoveAds={() => setIsRemoveAdsModalOpen(true)}
        />
      )}

      {/* Quick Add Video Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublish={handleSaveVideo}
        categories={categories}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* The Complete Admin Control Panel (Including Ads & Crypto USDT VIP Management) */}
      <AdminDashboard
        isOpen={isDashboardOpen}
        onClose={() => {
          setIsDashboardOpen(false);
          setEditingVideo(null);
        }}
        videos={videos}
        categories={categories}
        comments={comments}
        ads={ads}
        siteSettings={siteSettings}
        onSaveVideo={handleSaveVideo}
        onDeleteVideo={handleDeleteVideo}
        onAddCategory={(cat) => {
          setCategories((prev) => [...prev, cat]);
          showToast('Category added successfully!');
        }}
        onEditCategory={handleEditCategory}
        onDeleteCategory={(catId) => {
          if (catId === 'all') {
            showToast('Cannot delete the primary "All" category');
            return;
          }
          setCategories((prev) => {
            const updated = prev.filter((c) => c.id !== catId);
            return updated.length > 0 ? updated : [{ id: 'all', name: 'All', nameEn: 'All', iconName: 'Sparkles' }];
          });
          if (activeCategory === catId) {
            setActiveCategory('all');
          }
          showToast('Category deleted successfully');
        }}
        onSaveComment={handleSaveComment}
        onDeleteComment={handleDeleteComment}
        onAddComment={handleAddComment}
        onSaveAd={handleSaveAd}
        onDeleteAd={handleDeleteAd}
        onToggleAdActive={handleToggleAdActive}
        onResetAdsDefaults={handleResetAdsDefaults}
        onUpdateSiteSettings={handleUpdateSiteSettings}
        onResetDefaults={handleResetDefaults}
        onImportData={handleImportData}
        initialTab={dashboardTab}
        editingVideoData={editingVideo}
        onClearEditingVideo={() => setEditingVideo(null)}
      />

      {/* Crypto USDT Remove Ads Modal */}
      <RemoveAdsModal
        isOpen={isRemoveAdsModalOpen}
        onClose={() => setIsRemoveAdsModalOpen(false)}
        vipSettings={vipSettings}
        isAdFreeActive={isAdFreeActive}
        onUpgradeSuccess={handleUpgradeVipSuccess}
        onCancelVip={handleCancelVipPass}
        onOpenDashboard={isAdmin ? () => {
          setIsRemoveAdsModalOpen(false);
          setDashboardTab('ads');
          setIsDashboardOpen(true);
        } : undefined}
      />

      {/* Legal & Info Modal (Terms of Service, Privacy Policy, Help Center) */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        activeTab={infoModalTab}
        onSelectTab={setInfoModalTab}
        settings={siteSettings}
        isAdmin={isAdmin}
        onOpenDashboardSettings={() => {
          setDashboardTab('settings');
          setIsDashboardOpen(true);
        }}
      />

      {/* Footer */}
      <Footer 
        siteName={siteSettings.siteName}
        siteTagline={siteSettings.siteTagline}
        isAdmin={isAdmin}
        onOpenDashboard={() => {
          if (isAdmin) {
            setDashboardTab('ads');
            setIsDashboardOpen(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }} 
        onOpenTerms={() => {
          setInfoModalTab('terms');
          setIsInfoModalOpen(true);
        }}
        onOpenPrivacy={() => {
          setInfoModalTab('privacy');
          setIsInfoModalOpen(true);
        }}
        onOpenHelp={() => {
          setInfoModalTab('help');
          setIsInfoModalOpen(true);
        }}
      />

    </div>
  );
}
