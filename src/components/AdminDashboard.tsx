import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  PlusCircle, 
  Sliders, 
  Video, 
  FolderPlus, 
  Trash2, 
  Edit3, 
  Check, 
  BarChart3, 
  Download, 
  Upload, 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  FileText, 
  Shield, 
  HelpCircle, 
  MessageSquare, 
  Globe, 
  Eye, 
  Send,
  Lock,
  ThumbsUp,
  Megaphone,
  DollarSign,
  Code,
  Copy,
  ExternalLink,
  Power,
  Zap,
  QrCode,
  Sparkles,
  Gift
} from 'lucide-react';
import { 
  VideoCategory, 
  VideoItem, 
  VideoComment, 
  SiteSettings, 
  AdUnit, 
  AdFormat, 
  AdPlacement,
  CryptoVipSettings,
  VipPaymentOrder 
} from '../types/video';
import { parseVideoUrl } from '../utils/videoParser';
import { PRESET_COVERS, DEFAULT_SITE_SETTINGS, DEFAULT_CRYPTO_VIP } from '../data/initialVideos';
import { INITIAL_AD_UNITS } from '../data/initialAds';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  videos: VideoItem[];
  categories: VideoCategory[];
  comments: VideoComment[];
  ads: AdUnit[];
  siteSettings: SiteSettings;
  onSaveVideo: (video: VideoItem) => void;
  onDeleteVideo: (videoId: string) => void;
  onAddCategory: (category: VideoCategory) => void;
  onEditCategory?: (category: VideoCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  onSaveComment?: (comment: VideoComment) => void;
  onDeleteComment?: (commentId: string) => void;
  onAddComment?: (comment: VideoComment) => void;
  onSaveAd: (ad: AdUnit) => void;
  onDeleteAd: (adId: string) => void;
  onToggleAdActive: (adId: string) => void;
  onResetAdsDefaults?: () => void;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
  onResetDefaults: () => void;
  onImportData?: (
    importedVideos: VideoItem[], 
    importedCategories?: VideoCategory[], 
    importedComments?: VideoComment[],
    importedSettings?: SiteSettings,
    importedAds?: AdUnit[]
  ) => void;
  initialTab?: 'add' | 'list' | 'categories' | 'ads' | 'comments' | 'settings' | 'stats';
  editingVideoData?: VideoItem | null;
  onClearEditingVideo?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  videos,
  categories,
  comments,
  ads,
  siteSettings,
  onSaveVideo,
  onDeleteVideo,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onSaveComment,
  onDeleteComment,
  onAddComment,
  onSaveAd,
  onDeleteAd,
  onToggleAdActive,
  onResetAdsDefaults,
  onUpdateSiteSettings,
  onResetDefaults,
  onImportData,
  initialTab = 'add',
  editingVideoData = null,
  onClearEditingVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'list' | 'categories' | 'ads' | 'comments' | 'settings' | 'stats'>(initialTab);

  // Video Form State
  const [videoId, setVideoId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [category, setCategory] = useState('tech');
  const [tagsInput, setTagsInput] = useState('');
  const [duration, setDuration] = useState('18:24');
  const [featured, setFeatured] = useState(false);
  const [badge, setBadge] = useState('TRENDING #1');
  const [genre, setGenre] = useState('Tech • 4K');
  const [resolution, setResolution] = useState('4K Ultra HD');
  const [viewsCount, setViewsCount] = useState<number>(145000);
  const [likesCount, setLikesCount] = useState<number>(12800);

  // Category Management State
  const [newCatName, setNewCatName] = useState('');
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [editingCategory, setEditingCategory] = useState<VideoCategory | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatNameEn, setEditCatNameEn] = useState('');

  // Site Settings & Legal Pages State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [legalPreviewTab, setLegalPreviewTab] = useState<'terms' | 'privacy' | 'help'>('terms');

  // Crypto VIP Remove Ads Settings State
  const [vipForm, setVipForm] = useState<CryptoVipSettings>(siteSettings.cryptoVip || DEFAULT_CRYPTO_VIP);

  // Comments Management State
  const [commentFilterVideoId, setCommentFilterVideoId] = useState<string>('all');
  const [commentSearch, setCommentSearch] = useState('');
  const [editingComment, setEditingComment] = useState<VideoComment | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [newCommentVideoId, setNewCommentVideoId] = useState<string>('');
  const [newCommentAuthor, setNewCommentAuthor] = useState('Admin');
  const [newCommentText, setNewCommentText] = useState('');

  // Ads Management State
  const [editingAd, setEditingAd] = useState<AdUnit | null>(null);
  const [adName, setAdName] = useState('');
  const [adUnitCodeId, setAdUnitCodeId] = useState('');
  const [adFormat, setAdFormat] = useState<AdFormat>('native_banner');
  const [adPlacement, setAdPlacement] = useState<AdPlacement>('in_grid_feed');
  const [adType, setAdType] = useState<'image_link' | 'html_code' | 'script' | 'smartlink'>('image_link');
  const [adHeadline, setAdHeadline] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adTargetUrl, setAdTargetUrl] = useState('https://google.com');
  const [adCtaText, setAdCtaText] = useState('Get Offer');
  const [adCodeSnippet, setAdCodeSnippet] = useState('');
  const [adActive, setAdActive] = useState(true);
  const [showNewAdModal, setShowNewAdModal] = useState(false);
  const [codeModalAd, setCodeModalAd] = useState<AdUnit | null>(null);
  const [adSubTab, setAdSubTab] = useState<'units' | 'crypto_vip'>('units');

  // Stats State
  const [useCustomStats, setUseCustomStats] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('streamio_use_custom_stats');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [customViews, setCustomViews] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('streamio_custom_views');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 40972;
  });

  const [customLikes, setCustomLikes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('streamio_custom_likes');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 1701;
  });

  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem('streamio_admin_pin') || '1234';
    } catch {
      return '1234';
    }
  });

  const [isEditingStats, setIsEditingStats] = useState(false);

  // Search & Notifications
  const [listSearch, setListSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  // In-App Deletion Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'video' | 'category' | 'comment' | 'ad' | 'reset';
    id: string;
    title: string;
  } | null>(null);

  // VIP Orders Queue State
  const [vipOrders, setVipOrders] = useState<VipPaymentOrder[]>(() => {
    try {
      const raw = localStorage.getItem('streamio_vip_orders');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const handleApproveOrder = (orderId: string) => {
    const updated = vipOrders.map(o => o.id === orderId ? { ...o, status: 'verified' as const, verifiedAt: new Date().toISOString() } : o);
    setVipOrders(updated);
    localStorage.setItem('streamio_vip_orders', JSON.stringify(updated));
    
    // Update active pass & pending order
    const approved = updated.find(o => o.id === orderId);
    if (approved) {
      localStorage.setItem('streamio_pending_order', JSON.stringify(approved));
      localStorage.setItem('streamio_vip_ad_free', 'true');
    }
    showToast('Payment verified & VIP Ad-Free pass activated ✓');
  };

  const handleRejectOrder = (orderId: string) => {
    const updated = vipOrders.map(o => o.id === orderId ? { ...o, status: 'rejected' as const } : o);
    setVipOrders(updated);
    localStorage.setItem('streamio_vip_orders', JSON.stringify(updated));

    const rejected = updated.find(o => o.id === orderId);
    if (rejected) {
      localStorage.setItem('streamio_pending_order', JSON.stringify(rejected));
    }
    showToast('Payment order declined & marked rejected', 'error');
  };

  const handleDeleteOrder = (orderId: string) => {
    const updated = vipOrders.filter(o => o.id !== orderId);
    setVipOrders(updated);
    localStorage.setItem('streamio_vip_orders', JSON.stringify(updated));
    showToast('Payment record removed');
  };

  const getExplorerUrl = (network: string, hash: string) => {
    const net = (network || '').toUpperCase();
    if (net.includes('TRC') || net.includes('TRON')) {
      return `https://tronscan.org/#/transaction/${hash}`;
    }
    if (net.includes('BEP') || net.includes('BSC') || net.includes('BINANCE')) {
      return `https://bscscan.com/tx/${hash}`;
    }
    if (net.includes('POLYGON') || net.includes('MATIC')) {
      return `https://polygonscan.com/tx/${hash}`;
    }
    if (net.includes('ERC') || net.includes('ETH')) {
      return `https://etherscan.io/tx/${hash}`;
    }
    if (net.includes('TON')) {
      return `https://tonviewer.com/transaction/${hash}`;
    }
    return `https://tronscan.org/#/transaction/${hash}`;
  };

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3200);
  };

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setSettingsForm(siteSettings);
    if (siteSettings.cryptoVip) {
      setVipForm(siteSettings.cryptoVip);
    }
  }, [siteSettings]);

  useEffect(() => {
    if (videos.length > 0 && !newCommentVideoId) {
      setNewCommentVideoId(videos[0].id);
    }
  }, [videos, newCommentVideoId]);

  useEffect(() => {
    if (editingVideoData) {
      setVideoId(editingVideoData.id);
      setTitle(editingVideoData.title);
      setDescription(editingVideoData.description);
      setVideoUrl(editingVideoData.videoUrl);
      setCoverUrl(editingVideoData.coverUrl);
      setCategory(editingVideoData.category);
      setTagsInput(editingVideoData.tags.join(', '));
      setDuration(editingVideoData.duration);
      setFeatured(!!editingVideoData.featured);
      setBadge(editingVideoData.badge || 'TRENDING #1');
      setGenre(editingVideoData.genre || 'Tech • 4K');
      setResolution(editingVideoData.resolution || '4K Ultra HD');
      setViewsCount(editingVideoData.views);
      setLikesCount(editingVideoData.likes);
      setActiveTab('add');
    }
  }, [editingVideoData]);

  if (!isOpen) return null;

  const handleStartEditVideo = (item: VideoItem) => {
    setVideoId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setVideoUrl(item.videoUrl);
    setCoverUrl(item.coverUrl);
    setCategory(item.category);
    setTagsInput(item.tags.join(', '));
    setDuration(item.duration);
    setFeatured(!!item.featured);
    setBadge(item.badge || 'TRENDING #1');
    setGenre(item.genre || 'Tech • 4K');
    setResolution(item.resolution || '4K Ultra HD');
    setViewsCount(item.views);
    setLikesCount(item.likes);
    setActiveTab('add');
  };

  const parsedUrl = parseVideoUrl(videoUrl);

  const resetForm = () => {
    setVideoId('');
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setCoverUrl('');
    setCategory(categories[1]?.id || categories[0]?.id || 'tech');
    setTagsInput('');
    setDuration('15:30');
    setFeatured(false);
    setBadge('TRENDING #1');
    setGenre('Tech • 4K');
    setResolution('4K Ultra HD');
    setViewsCount(Math.floor(Math.random() * 80000) + 15000);
    setLikesCount(Math.floor(Math.random() * 5000) + 1000);
    if (onClearEditingVideo) onClearEditingVideo();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCoverUrl(reader.result);
          showToast('Cover image uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      showToast('Please enter both a video title and a valid stream URL', 'error');
      return;
    }

    let finalCover = coverUrl.trim();
    if (!finalCover) {
      if (parsedUrl.suggestedCover) finalCover = parsedUrl.suggestedCover;
      else finalCover = PRESET_COVERS[0];
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const videoToSave: VideoItem = {
      id: videoId || `video-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || `Featured ultra HD stream on ${settingsForm.siteName}.`,
      videoUrl: videoUrl.trim(),
      coverUrl: finalCover,
      category: category || 'tech',
      tags: tagsArray.length > 0 ? tagsArray : [settingsForm.siteName, 'Video', '4K'],
      duration: duration.trim() || '15:00',
      views: viewsCount || 25000,
      likes: likesCount || 1800,
      featured: featured,
      badge: badge,
      genre: genre,
      resolution: resolution,
      createdAt: editingVideoData ? editingVideoData.createdAt : new Date().toISOString(),
      videoType: parsedUrl.type,
    };

    onSaveVideo(videoToSave);
    showToast(videoId ? 'Video details updated successfully!' : 'Video published successfully!');
    resetForm();
    setActiveTab('list');
  };

  const handleAddCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      showToast('Please enter category name', 'error');
      return;
    }

    const id = newCatName.toLowerCase().replace(/\s+/g, '-').slice(0, 15);
    onAddCategory({
      id: `cat-${id}-${Date.now()}`,
      name: newCatName.trim(),
      nameEn: newCatNameEn.trim() || newCatName.trim(),
      iconName: 'Sparkles',
    });

    setNewCatName('');
    setNewCatNameEn('');
    showToast('New category added successfully!');
  };

  const handleSaveEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCatName.trim()) return;

    if (onEditCategory) {
      onEditCategory({
        ...editingCategory,
        name: editCatName.trim(),
        nameEn: editCatNameEn.trim() || editCatName.trim(),
      });
      showToast(`Category "${editCatName.trim()}" updated successfully!`);
    }
    setEditingCategory(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm.siteName.trim()) {
      showToast('Please enter site name', 'error');
      return;
    }
    onUpdateSiteSettings(settingsForm);
    showToast(`Site settings and brand name "${settingsForm.siteName}" saved! ✓`);
  };

  const handleSaveCryptoVipSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipForm.walletAddress.trim()) {
      showToast('Please enter a valid USDT deposit wallet address', 'error');
      return;
    }

    const updatedVip: CryptoVipSettings = {
      ...vipForm,
      vipCodes: [],
    };

    const updatedSettings: SiteSettings = {
      ...settingsForm,
      cryptoVip: updatedVip,
    };

    setSettingsForm(updatedSettings);
    onUpdateSiteSettings(updatedSettings);
    showToast(`USDT VIP Ad Removal settings (${vipForm.priceUsdt} USDT) saved and activated! ✓`);
  };

  const handleAddAdminComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !newCommentVideoId) {
      showToast('Please select a video and enter comment text', 'error');
      return;
    }
    if (onAddComment) {
      const newComment: VideoComment = {
        id: `comm-admin-${Date.now()}`,
        videoId: newCommentVideoId,
        author: newCommentAuthor.trim() || 'Admin',
        handle: `@${(newCommentAuthor.trim() || 'admin').toLowerCase().replace(/\s+/g, '_')}`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        text: newCommentText.trim(),
        timestamp: 'Just now (Admin)',
        likes: 1,
        isLiked: false,
      };
      onAddComment(newComment);
      setNewCommentText('');
      showToast('Comment posted successfully!');
    }
  };

  const handleSaveEditedComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment || !editCommentText.trim()) return;
    if (onSaveComment) {
      onSaveComment({
        ...editingComment,
        text: editCommentText.trim(),
      });
      showToast('Comment text updated successfully!');
    }
    setEditingComment(null);
  };

  // AD MANAGEMENT HANDLERS
  const handleOpenEditAd = (ad: AdUnit) => {
    setEditingAd(ad);
    setAdName(ad.name);
    setAdUnitCodeId(ad.unitCodeId || `${Math.floor(10000000 + Math.random() * 90000000)}`);
    setAdFormat(ad.format);
    setAdPlacement(ad.placement);
    setAdType(ad.type);
    setAdHeadline(ad.headline || '');
    setAdDescription(ad.description || '');
    setAdImageUrl(ad.imageUrl || '');
    setAdTargetUrl(ad.targetUrl || 'https://google.com');
    setAdCtaText(ad.ctaText || 'Get Offer');
    setAdCodeSnippet(ad.codeSnippet || '');
    setAdActive(ad.active);
    setShowNewAdModal(true);
  };

  const handleOpenCreateAd = () => {
    setEditingAd(null);
    setAdName(`AdUnit_${ads.length + 1}`);
    setAdUnitCodeId(`${Math.floor(31440000 + Math.random() * 90000)}`);
    setAdFormat('native_banner');
    setAdPlacement('in_grid_feed');
    setAdType('image_link');
    setAdHeadline('🔥 Exclusive Sponsor Offer');
    setAdDescription('High converting promotional link and special partner deals.');
    setAdImageUrl('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80');
    setAdTargetUrl('https://google.com');
    setAdCtaText('Claim Deal');
    setAdCodeSnippet('');
    setAdActive(true);
    setShowNewAdModal(true);
  };

  const handleSaveAdForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adName.trim()) {
      showToast('Please enter an ad unit name', 'error');
      return;
    }

    const savedAd: AdUnit = {
      id: editingAd ? editingAd.id : `ad-unit-${Date.now()}`,
      unitCodeId: adUnitCodeId || `${Math.floor(31440000 + Math.random() * 90000)}`,
      name: adName.trim(),
      format: adFormat,
      placement: adPlacement,
      active: adActive,
      type: adType,
      headline: adHeadline.trim(),
      description: adDescription.trim(),
      imageUrl: adImageUrl.trim(),
      targetUrl: adTargetUrl.trim(),
      ctaText: adCtaText.trim() || 'Learn More',
      codeSnippet: adCodeSnippet.trim(),
      impressions: editingAd?.impressions || 1200,
      clicks: editingAd?.clicks || 85,
      createdAt: editingAd?.createdAt || new Date().toISOString(),
    };

    onSaveAd(savedAd);
    setShowNewAdModal(false);
    setEditingAd(null);
    showToast(editingAd ? 'Ad unit updated successfully!' : 'New ad unit created and activated!');
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmation) return;

    if (deleteConfirmation.type === 'video') {
      onDeleteVideo(deleteConfirmation.id);
      showToast(`Video "${deleteConfirmation.title}" deleted permanently`);
    } else if (deleteConfirmation.type === 'category') {
      onDeleteCategory(deleteConfirmation.id);
      showToast(`Category "${deleteConfirmation.title}" deleted`);
    } else if (deleteConfirmation.type === 'comment') {
      if (onDeleteComment) onDeleteComment(deleteConfirmation.id);
      showToast('Comment deleted');
    } else if (deleteConfirmation.type === 'ad') {
      onDeleteAd(deleteConfirmation.id);
      showToast(`Ad unit "${deleteConfirmation.title}" removed`);
    } else if (deleteConfirmation.type === 'reset') {
      onResetDefaults();
      showToast('Default videos and configuration restored!');
    }

    setDeleteConfirmation(null);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedData = JSON.parse(content);

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          if (onImportData) {
            onImportData(parsedData);
          } else {
            parsedData.forEach((v) => onSaveVideo(v));
          }
          showToast(`Successfully imported ${parsedData.length} videos!`);
        } else if (parsedData.videos && Array.isArray(parsedData.videos)) {
          if (onImportData) {
            onImportData(parsedData.videos, parsedData.categories, parsedData.comments, parsedData.settings, parsedData.ads);
          } else {
            parsedData.videos.forEach((v: VideoItem) => onSaveVideo(v));
          }
          if (parsedData.settings) {
            onUpdateSiteSettings(parsedData.settings);
          }
          showToast('Data and settings imported successfully!');
        } else {
          showToast('Invalid JSON file format.', 'error');
        }
      } catch (err) {
        showToast('Error reading JSON: ' + (err as Error).message, 'error');
      }
    };
    reader.readAsText(file);
  };

  const filteredList = videos.filter((v) =>
    v.title.toLowerCase().includes(listSearch.toLowerCase()) ||
    v.category.toLowerCase().includes(listSearch.toLowerCase()) ||
    v.tags.some((t) => t.toLowerCase().includes(listSearch.toLowerCase()))
  );

  const filteredComments = comments.filter((c) => {
    const matchesVideo = commentFilterVideoId === 'all' || c.videoId === commentFilterVideoId;
    const matchesSearch = !commentSearch.trim() || 
      c.text.toLowerCase().includes(commentSearch.toLowerCase()) ||
      c.author.toLowerCase().includes(commentSearch.toLowerCase());
    return matchesVideo && matchesSearch;
  });

  const calculatedViews = videos.reduce((acc, v) => acc + v.views, 0);
  const calculatedLikes = videos.reduce((acc, v) => acc + v.likes, 0);
  const totalViews = useCustomStats ? customViews : calculatedViews;
  const totalLikes = useCustomStats ? customLikes : calculatedLikes;

  const totalAdImpressions = ads.reduce((acc, a) => acc + (a.impressions || 0), 0);
  const totalAdClicks = ads.reduce((acc, a) => acc + (a.clicks || 0), 0);
  const activeAdsCount = ads.filter((a) => a.active).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 font-sans">
      <div className="w-full max-w-6xl bg-[#121217] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#171720] via-[#1f1f2a] to-[#171720] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 text-black">
              <Sliders className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>Admin Dashboard — {settingsForm.siteName}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 font-mono">
                  PRO ADMIN
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Full management: Ad Network, USDT Crypto VIP Ad-Free, Videos, Categories, Comments, and Site Settings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-600 text-gray-400 hover:text-white transition-all border border-white/10"
            title="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success / Alert Toast Banner */}
        {toastMessage && (
          <div className={`px-6 py-2.5 flex items-center gap-2 text-xs sm:text-sm font-bold border-b transition-all ${
            toastMessage.type === 'error'
              ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
              : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
          }`}>
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 pt-3 bg-[#0d0d12] border-b border-white/10 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'add'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{videoId ? 'Edit Video' : 'Add Video'}</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'list'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Manage Videos ({videos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          {/* AD & CRYPTO MONETIZATION MANAGEMENT TAB */}
          <button
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'ads'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span className="flex items-center gap-1.5">
              <span>Ads & VIP USDT</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">
                {activeAdsCount}/{ads.length}
              </span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'comments'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Comments ({comments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Site & Legal</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'stats'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Stats & Analytics</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#121217]">
          
          {/* TAB 1: ADD / EDIT VIDEO */}
          {activeTab === 'add' && (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">
                    {videoId ? `Editing Video: ${title}` : 'Publish New 4K Stream / Video'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Supports MP4, HLS (.m3u8), YouTube, Vimeo, and iframe embeds
                  </p>
                </div>
                {videoId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Video Title <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 4K Ultra Cinematic Odyssey"
                    className="w-full bg-[#181820] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-gray-600"
                  />
                </div>

                {/* Video URL */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Stream / Video URL <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://... direct .mp4, m3u8, or youtube.com/watch?v=..."
                    className="w-full bg-[#181820] text-amber-300 font-mono text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-gray-600"
                  />
                  {parsedUrl.type && (
                    <span className="inline-block mt-1 text-[11px] text-emerald-400 font-mono">
                      ✓ Detected format: {parsedUrl.type.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Category <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#181820] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                  >
                    {categories.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameEn || c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 18:24 or 1h 45m"
                    className="w-full bg-[#181820] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Cover Image URL */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-300">
                      Thumbnail Cover Image URL
                    </label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Local Image</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or upload"
                    className="w-full bg-[#181820] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Preset Covers Selector */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                    Or select a 4K stock preset cover:
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {PRESET_COVERS.slice(0, 6).map((url, i) => (
                      <div
                        key={i}
                        onClick={() => setCoverUrl(url)}
                        className={`aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 ${
                          coverUrl === url ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Description & Synopsis
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed description of the stream, cast, storyline..."
                    className="w-full bg-[#181820] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Cinema, 4K, Cyberpunk, Gaming, Trailer"
                    className="w-full bg-[#181820] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Featured Hero Toggle */}
                <div className="md:col-span-2 p-4 rounded-xl bg-[#181820] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white block">Pin to Hero Banner (Featured #1)</span>
                    <span className="text-xs text-gray-400">Displays this video prominently at the very top of the homepage</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm transition-all shadow-xl shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>{videoId ? 'Save Video Changes' : 'Publish Video Now'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: MANAGE VIDEOS LIST */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={listSearch}
                    onChange={(e) => setListSearch(e.target.value)}
                    placeholder="Search videos by title or tag..."
                    className="w-full bg-[#181820] text-white text-xs sm:text-sm rounded-xl pl-9 pr-4 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setActiveTab('add');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Video</span>
                </button>
              </div>

              <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#181820]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#1e1e28] text-gray-400 font-bold uppercase text-[11px] border-b border-white/10">
                    <tr>
                      <th className="p-3.5">Video</th>
                      <th className="p-3.5 hidden md:table-cell">Category</th>
                      <th className="p-3.5 hidden sm:table-cell">Duration</th>
                      <th className="p-3.5 hidden lg:table-cell">Views</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredList.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.coverUrl}
                              alt={item.title}
                              className="w-16 h-10 object-cover rounded-lg bg-black shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-white truncate max-w-xs sm:max-w-sm">
                                {item.title}
                              </h4>
                              <span className="text-[11px] text-gray-400 font-mono">
                                ID: {item.id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 hidden md:table-cell text-gray-300 capitalize">
                          {item.category}
                        </td>
                        <td className="p-3.5 hidden sm:table-cell text-gray-400 font-mono">
                          {item.duration}
                        </td>
                        <td className="p-3.5 hidden lg:table-cell text-gray-300 font-mono">
                          {item.views.toLocaleString()}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                handleStartEditVideo(item);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500 hover:text-black text-gray-300 transition-colors"
                              title="Edit Video"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmation({ type: 'video', id: item.id, title: item.title })}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600 text-gray-300 hover:text-white transition-colors"
                              title="Delete Video"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Add category form */}
              <form onSubmit={handleAddCustomCategory} className="p-5 rounded-2xl bg-[#181820] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-amber-500" />
                  <span>Add New Category</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Category Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Cyberpunk"
                      className="w-full bg-[#111116] text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      English Display Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={newCatNameEn}
                      onChange={(e) => setNewCatNameEn(e.target.value)}
                      placeholder="e.g. Cyberpunk"
                      className="w-full bg-[#111116] text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
                >
                  Add Category
                </button>
              </form>

              {/* Categories list */}
              <div className="p-5 rounded-2xl bg-[#181820] border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Existing Categories ({categories.length})
                </h4>

                <div className="divide-y divide-white/5">
                  {categories.map((cat) => (
                    <div key={cat.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-white">{cat.nameEn || cat.name}</span>
                        <span className="text-xs text-gray-500 font-mono ml-2">({cat.id})</span>
                      </div>

                      {cat.id !== 'all' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory(cat);
                              setEditCatName(cat.name);
                              setEditCatNameEn(cat.nameEn || cat.name);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500 hover:text-black text-gray-300 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmation({ type: 'category', id: cat.id, title: cat.nameEn || cat.name })}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600 text-gray-300 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADS & USDT CRYPTO VIP REMOVE ADS */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              
              {/* Subtabs for Ads vs VIP USDT */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <button
                  onClick={() => setAdSubTab('units')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    adSubTab === 'units'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Ad Units & Banners ({ads.length})</span>
                </button>
                <button
                  onClick={() => setAdSubTab('crypto_vip')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    adSubTab === 'crypto_vip'
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>USDT Crypto VIP Ad Removal System</span>
                </button>
              </div>

              {/* SUBTAB 1: AD UNITS LIST */}
              {adSubTab === 'units' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">Active Ad Units & Banners</h3>
                      <p className="text-xs text-gray-400">
                        10+ standard formats ready: 728x90, 300x250, Native Cards, 160x600, Popunder, Social Bar
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {onResetAdsDefaults && (
                        <button
                          onClick={onResetAdsDefaults}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold flex items-center gap-1.5"
                          title="Restore default ad units"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset Default Ads</span>
                        </button>
                      )}
                      <button
                        onClick={handleOpenCreateAd}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Create Ad Unit</span>
                      </button>
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#181820]">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-[#1e1e28] text-gray-400 font-bold uppercase text-[11px] border-b border-white/10">
                        <tr>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Unit Name / ID</th>
                          <th className="p-3.5">Format</th>
                          <th className="p-3.5 hidden md:table-cell">Placement</th>
                          <th className="p-3.5 hidden sm:table-cell">Impressions / Clicks</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {ads.map((ad) => (
                          <tr key={ad.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5">
                              <button
                                onClick={() => onToggleAdActive(ad.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 transition-all ${
                                  ad.active
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${ad.active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                <span>{ad.active ? 'Active' : 'Paused'}</span>
                              </button>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-white">{ad.name}</div>
                              <div className="text-[11px] text-amber-400/80 font-mono">ID: {ad.unitCodeId || ad.id}</div>
                            </td>
                            <td className="p-3.5 font-mono text-xs text-gray-300">
                              {ad.format}
                            </td>
                            <td className="p-3.5 hidden md:table-cell text-xs text-gray-400">
                              {ad.placement}
                            </td>
                            <td className="p-3.5 hidden sm:table-cell text-xs font-mono text-gray-300">
                              <div>👁️ {(ad.impressions || 0).toLocaleString()}</div>
                              <div className="text-gray-400">🖱️ {(ad.clicks || 0).toLocaleString()}</div>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditAd(ad)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500 hover:text-black text-gray-300 transition-colors"
                                  title="Edit Ad Unit"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmation({ type: 'ad', id: ad.id, title: ad.name })}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600 text-gray-300 hover:text-white transition-colors"
                                  title="Delete Ad Unit"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: USDT CRYPTO VIP AD REMOVAL SETTINGS */}
              {adSubTab === 'crypto_vip' && (
                <div className="space-y-8 max-w-3xl mx-auto">
                  <form onSubmit={handleSaveCryptoVipSettings} className="space-y-6">
                  
                  {/* How it works info box */}
                  <div className="p-4 rounded-2xl bg-[#181824] border border-amber-500/30 space-y-2">
                    <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>How VIP Ad Removal Works:</span>
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      When a user pays the required USDT amount or applies an active promo code on their device, all advertisements are removed <strong>ONLY for that paying user</strong>. All other regular visitors continue to see all advertisements normally.
                    </p>
                  </div>

                  {/* VIP Switch */}
                  <div className="p-4 rounded-2xl bg-[#181820] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-white block">Enable USDT VIP Ad-Free System</span>
                      <span className="text-xs text-gray-400">Shows the Remove Ads buttons and floating checkout widget</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={vipForm.enabled}
                      onChange={(e) => setVipForm({ ...vipForm, enabled: e.target.checked })}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Price in USDT */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        Price in USDT <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        required
                        value={vipForm.priceUsdt}
                        onChange={(e) => setVipForm({ ...vipForm, priceUsdt: parseFloat(e.target.value) || 5 })}
                        className="w-full bg-[#181820] text-amber-300 font-mono text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Network */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        USDT Blockchain Network <span className="text-amber-400">*</span>
                      </label>
                      <select
                        value={vipForm.walletNetwork}
                        onChange={(e) => setVipForm({ ...vipForm, walletNetwork: e.target.value })}
                        className="w-full bg-[#181820] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="USDT (TRC20)">USDT (TRC20) - Low Fee / Tron</option>
                        <option value="USDT (BEP20)">USDT (BEP20) - BNB Smart Chain</option>
                        <option value="USDT (Polygon)">USDT (Polygon) - Polygon POS</option>
                        <option value="USDT (ERC20)">USDT (ERC20) - Ethereum</option>
                      </select>
                    </div>

                    {/* Wallet Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        Your Deposit Wallet Address <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={vipForm.walletAddress}
                        onChange={(e) => setVipForm({ ...vipForm, walletAddress: e.target.value.trim() })}
                        placeholder="e.g. TYDzsYUEWv8x8KjYt6vGg24GqHkQxK3m9L"
                        className="w-full bg-[#181820] text-amber-300 font-mono text-xs sm:text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Plan Title */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        Plan Title
                      </label>
                      <input
                        type="text"
                        value={vipForm.planTitle || 'VIP Ad-Free Pass'}
                        onChange={(e) => setVipForm({ ...vipForm, planTitle: e.target.value })}
                        className="w-full bg-[#181820] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Plan Duration */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        Plan Duration
                      </label>
                      <input
                        type="text"
                        value={vipForm.planDuration || 'Lifetime Access'}
                        onChange={(e) => setVipForm({ ...vipForm, planDuration: e.target.value })}
                        placeholder="e.g. Lifetime Access, 1 Month, 1 Year"
                        className="w-full bg-[#181820] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm transition-all shadow-xl shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span>Save VIP Ad Removal Settings</span>
                    </button>
                  </div>
                </form>

                {/* VIP Orders & Blockchain Payment Queue */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-amber-400" />
                        <span>VIP USDT Payment Orders & Blockchain Receipts ({vipOrders.length})</span>
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Real-time log of user crypto transfers, TXID receipts, and activation statuses.
                      </p>
                    </div>

                    {vipOrders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setVipOrders([]);
                          localStorage.removeItem('streamio_vip_orders');
                          showToast('Cleared all order history');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-rose-950/40 text-gray-400 hover:text-rose-400 text-xs font-semibold transition-colors"
                      >
                        Clear History
                      </button>
                    )}
                  </div>

                  {vipOrders.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-[#181820] border border-white/5 text-center text-gray-400 text-xs space-y-2">
                      <Zap className="w-8 h-8 mx-auto text-gray-600" />
                      <p className="font-semibold text-gray-300">No crypto payments submitted yet.</p>
                      <p className="text-gray-500 max-w-sm mx-auto">
                        When users make USDT payments and submit their TXIDs, they will appear here with instant blockchain explorer lookup.
                      </p>
                    </div>
                  ) : (
                    <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#181820]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#1e1e28] text-gray-400 font-bold uppercase text-[10px] border-b border-white/10">
                          <tr>
                            <th className="p-3">Status</th>
                            <th className="p-3">Amount & Network</th>
                            <th className="p-3">Transaction Hash (TXID)</th>
                            <th className="p-3 hidden sm:table-cell">Date</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {vipOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-3">
                                {order.status === 'verified' ? (
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Verified</span>
                                  </span>
                                ) : order.status === 'rejected' ? (
                                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black uppercase inline-flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>Rejected</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase inline-flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    <span>Pending</span>
                                  </span>
                                )}
                              </td>

                              <td className="p-3">
                                <div className="font-mono font-bold text-amber-400">
                                  {order.amount} USDT
                                </div>
                                <div className="text-[10px] text-gray-400">
                                  {order.network}
                                </div>
                              </td>

                              <td className="p-3 max-w-xs truncate font-mono text-[11px] text-gray-300">
                                <a
                                  href={getExplorerUrl(order.network, order.txHash)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-amber-400 hover:underline inline-flex items-center gap-1"
                                  title="View Transaction on Blockchain Explorer"
                                >
                                  <span>{order.txHash.slice(0, 10)}...{order.txHash.slice(-8)}</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              </td>

                              <td className="p-3 hidden sm:table-cell text-gray-400 text-[11px]">
                                {new Date(order.createdAt).toLocaleString()}
                              </td>

                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {order.status !== 'verified' && (
                                    <button
                                      type="button"
                                      onClick={() => handleApproveOrder(order.id)}
                                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black transition-colors"
                                      title="Approve & Mark Verified"
                                    >
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    </button>
                                  )}
                                  {order.status !== 'rejected' && (
                                    <button
                                      type="button"
                                      onClick={() => handleRejectOrder(order.id)}
                                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                                      title="Reject Order"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600 text-gray-400 hover:text-white transition-colors"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            </div>
          )}

          {/* TAB 5: COMMENTS MANAGEMENT */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              
              {/* Add Comment as Admin */}
              <form onSubmit={handleAddAdminComment} className="p-5 rounded-2xl bg-[#181820] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-amber-500" />
                  <span>Post Official Admin Comment</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Target Video</label>
                    <select
                      value={newCommentVideoId}
                      onChange={(e) => setNewCommentVideoId(e.target.value)}
                      className="w-full bg-[#111116] text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none"
                    >
                      {videos.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.title.slice(0, 35)}...
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Author Name</label>
                    <input
                      type="text"
                      value={newCommentAuthor}
                      onChange={(e) => setNewCommentAuthor(e.target.value)}
                      className="w-full bg-[#111116] text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Comment Text</label>
                    <input
                      type="text"
                      required
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Type your official comment..."
                      className="w-full bg-[#111116] text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/20"
                >
                  Post Comment
                </button>
              </form>

              {/* Comments Table */}
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#181820]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#1e1e28] text-gray-400 font-bold uppercase text-[11px] border-b border-white/10">
                    <tr>
                      <th className="p-3.5">Author</th>
                      <th className="p-3.5">Comment</th>
                      <th className="p-3.5 hidden md:table-cell">Video</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredComments.map((c) => (
                      <tr key={c.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-bold text-white whitespace-nowrap">
                          {c.author}
                        </td>
                        <td className="p-3.5 text-gray-300 max-w-md">
                          {c.text}
                        </td>
                        <td className="p-3.5 hidden md:table-cell text-xs text-gray-400 font-mono">
                          {videos.find(v => v.id === c.videoId)?.title.slice(0, 25) || c.videoId}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setDeleteConfirmation({ type: 'comment', id: c.id, title: `Comment by ${c.author}` })}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600 text-gray-300 hover:text-white transition-colors"
                            title="Delete Comment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SITE SETTINGS & LEGAL */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl mx-auto">
              
              <div className="p-5 rounded-2xl bg-[#181820] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-500" />
                  <span>General Brand & Site Settings</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      Site Brand Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.siteName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                      className="w-full bg-[#111116] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      Site Tagline
                    </label>
                    <input
                      type="text"
                      value={settingsForm.siteTagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteTagline: e.target.value })}
                      className="w-full bg-[#111116] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#14141a] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Allow Visitor Comments</span>
                      <span className="text-[11px] text-gray-400">Enables interactive discussions below video player</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsForm.allowComments}
                      onChange={(e) => setSettingsForm({ ...settingsForm, allowComments: e.target.checked })}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#14141a] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Global Advertisements Switch</span>
                      <span className="text-[11px] text-gray-400">Master toggle to display or hide all site ads</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsForm.enableAds !== false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, enableAds: e.target.checked })}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Legal Pages Editor */}
              <div className="p-5 rounded-2xl bg-[#181820] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>Legal Documents & FAQ</span>
                  </h3>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setLegalPreviewTab('terms')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${legalPreviewTab === 'terms' ? 'bg-amber-500 text-black' : 'text-gray-400'}`}
                    >
                      Terms of Service
                    </button>
                    <button
                      type="button"
                      onClick={() => setLegalPreviewTab('privacy')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${legalPreviewTab === 'privacy' ? 'bg-amber-500 text-black' : 'text-gray-400'}`}
                    >
                      Privacy Policy
                    </button>
                    <button
                      type="button"
                      onClick={() => setLegalPreviewTab('help')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${legalPreviewTab === 'help' ? 'bg-amber-500 text-black' : 'text-gray-400'}`}
                    >
                      Help & FAQ
                    </button>
                  </div>
                </div>

                {legalPreviewTab === 'terms' && (
                  <textarea
                    rows={6}
                    value={settingsForm.termsOfService}
                    onChange={(e) => setSettingsForm({ ...settingsForm, termsOfService: e.target.value })}
                    className="w-full bg-[#111116] text-white text-xs font-mono rounded-xl p-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                  />
                )}
                {legalPreviewTab === 'privacy' && (
                  <textarea
                    rows={6}
                    value={settingsForm.privacyPolicy}
                    onChange={(e) => setSettingsForm({ ...settingsForm, privacyPolicy: e.target.value })}
                    className="w-full bg-[#111116] text-white text-xs font-mono rounded-xl p-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                  />
                )}
                {legalPreviewTab === 'help' && (
                  <textarea
                    rows={6}
                    value={settingsForm.helpCenter}
                    onChange={(e) => setSettingsForm({ ...settingsForm, helpCenter: e.target.value })}
                    className="w-full bg-[#111116] text-white text-xs font-mono rounded-xl p-3 border border-white/10 focus:border-amber-500 focus:outline-none"
                  />
                )}
              </div>

              {/* Data Import / Export */}
              <div className="p-5 rounded-2xl bg-[#181820] border border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-white block">Backup & Restore Site Data</span>
                  <span className="text-[11px] text-gray-400">Export complete JSON backup or restore past videos</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const data = JSON.stringify({ videos, categories, comments, settings: siteSettings, ads }, null, 2);
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `backup_${siteSettings.siteName.toLowerCase()}_${Date.now()}.json`;
                      a.click();
                      showToast('JSON Backup downloaded!');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => importFileRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import JSON</span>
                  </button>
                  <input
                    type="file"
                    ref={importFileRef}
                    onChange={handleImportJson}
                    accept=".json"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmation({ type: 'reset', id: 'reset', title: 'Factory Defaults' })}
                    className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-500/30 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm transition-all shadow-xl shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Save Site & Legal Settings</span>
              </button>
            </form>
          )}

          {/* TAB 7: STATS & ANALYTICS */}
          {activeTab === 'stats' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#181820] border border-white/10">
                  <span className="text-[11px] text-gray-400 font-bold block uppercase">Total Views</span>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
                    {totalViews.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#181820] border border-white/10">
                  <span className="text-[11px] text-gray-400 font-bold block uppercase">Total Likes</span>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-1">
                    {totalLikes.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#181820] border border-white/10">
                  <span className="text-[11px] text-gray-400 font-bold block uppercase">Ad Impressions</span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1">
                    {totalAdImpressions.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#181820] border border-white/10">
                  <span className="text-[11px] text-gray-400 font-bold block uppercase">Ad Clicks</span>
                  <div className="text-xl sm:text-2xl font-black text-teal-400 font-mono mt-1">
                    {totalAdClicks.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Custom stats editor */}
              <div className="p-5 rounded-2xl bg-[#181820] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Custom Analytics Overrides</h4>
                    <p className="text-xs text-gray-400">Override total views & likes counts for marketing display</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={useCustomStats}
                    onChange={(e) => {
                      setUseCustomStats(e.target.checked);
                      localStorage.setItem('streamio_use_custom_stats', e.target.checked ? 'true' : 'false');
                    }}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                {useCustomStats && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Custom Views Count</label>
                      <input
                        type="number"
                        value={customViews}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          setCustomViews(val);
                          localStorage.setItem('streamio_custom_views', val.toString());
                        }}
                        className="w-full bg-[#111116] text-white text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Custom Likes Count</label>
                      <input
                        type="number"
                        value={customLikes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          setCustomLikes(val);
                          localStorage.setItem('streamio_custom_likes', val.toString());
                        }}
                        className="w-full bg-[#111116] text-white text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* CREATE / EDIT AD MODAL */}
      {showNewAdModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="w-full max-w-xl bg-[#161620] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-black text-white">
                {editingAd ? `Edit Ad Unit: ${adName}` : 'Create New Ad Unit'}
              </h3>
              <button
                onClick={() => setShowNewAdModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdForm} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Ad Unit Name</label>
                  <input
                    type="text"
                    required
                    value={adName}
                    onChange={(e) => setAdName(e.target.value)}
                    placeholder="e.g. Leaderboard_Top"
                    className="w-full bg-[#111116] text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Unit Code ID</label>
                  <input
                    type="text"
                    value={adUnitCodeId}
                    onChange={(e) => setAdUnitCodeId(e.target.value)}
                    placeholder="e.g. 31440895"
                    className="w-full bg-[#111116] text-amber-300 font-mono text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Format</label>
                  <select
                    value={adFormat}
                    onChange={(e) => setAdFormat(e.target.value as AdFormat)}
                    className="w-full bg-[#111116] text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none font-mono"
                  >
                    <option value="native_banner">Native Card (300x250 Grid)</option>
                    <option value="banner_728x90">Leaderboard 728x90</option>
                    <option value="banner_300x250">Medium Rectangle 300x250</option>
                    <option value="banner_160x600">Skyscraper 160x600</option>
                    <option value="banner_160x300">Skyscraper Half 160x300</option>
                    <option value="banner_468x60">Banner 468x60</option>
                    <option value="banner_320x50">Mobile Leaderboard 320x50</option>
                    <option value="social_bar">Social Bar (Floating Bottom)</option>
                    <option value="popunder">Popunder (On Click)</option>
                    <option value="smartlink">Smartlink</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Placement Location</label>
                  <select
                    value={adPlacement}
                    onChange={(e) => setAdPlacement(e.target.value as AdPlacement)}
                    className="w-full bg-[#111116] text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none font-mono"
                  >
                    <option value="in_grid_feed">In Grid Feed (Between Videos)</option>
                    <option value="top_header">Top Header (Leaderboard)</option>
                    <option value="hero_bottom">Below Hero Featured Banner</option>
                    <option value="player_under">Below Video Player</option>
                    <option value="player_sidebar">Player Sidebar</option>
                    <option value="sidebar_left">Sidebar Left</option>
                    <option value="sidebar_right">Sidebar Right</option>
                    <option value="social_bar_bottom">Social Bar Floating Bottom</option>
                    <option value="popunder_click">Global Click Popunder</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-1">Headline Text</label>
                  <input
                    type="text"
                    value={adHeadline}
                    onChange={(e) => setAdHeadline(e.target.value)}
                    placeholder="Catchy ad title..."
                    className="w-full bg-[#111116] text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-1">Destination Target URL</label>
                  <input
                    type="url"
                    value={adTargetUrl}
                    onChange={(e) => setAdTargetUrl(e.target.value)}
                    placeholder="https://sponsor-website.com"
                    className="w-full bg-[#111116] text-amber-300 font-mono text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-1">Banner Image URL</label>
                  <input
                    type="url"
                    value={adImageUrl}
                    onChange={(e) => setAdImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#111116] text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#111116] border border-white/10">
                <span className="text-xs font-bold text-white">Active Status</span>
                <input
                  type="checkbox"
                  checked={adActive}
                  onChange={(e) => setAdActive(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-lg shadow-amber-500/20"
                >
                  {editingAd ? 'Save Ad Changes' : 'Create & Activate Ad'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewAdModal(false)}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DELETION MODAL */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#161620] border border-rose-500/40 rounded-3xl p-5 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-white">Confirm Deletion</h4>
              <p className="text-xs text-gray-400 mt-1">
                Are you sure you want to remove <strong>"{deleteConfirmation.title}"</strong>?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/25 transition-all"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
