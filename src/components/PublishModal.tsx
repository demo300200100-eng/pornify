import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Video, 
  Check, 
  Tag
} from 'lucide-react';
import { VideoItem, VideoCategory } from '../types/video';
import { parseVideoUrl } from '../utils/videoParser';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (video: VideoItem) => void;
  categories: VideoCategory[];
}

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
];

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  categories,
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [category, setCategory] = useState(categories[1]?.id || categories[0]?.id || 'tech');
  const [tagsInput, setTagsInput] = useState('');
  const [duration, setDuration] = useState('14:20');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const parsed = parseVideoUrl(videoUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim() || !title.trim()) {
      setErrorMessage('Please enter both video URL and title.');
      return;
    }

    let finalCover = coverUrl.trim();
    if (!finalCover) {
      if (parsed.suggestedCover) finalCover = parsed.suggestedCover;
      else finalCover = PRESET_COVERS[0];
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const newVideo: VideoItem = {
      id: `streamio-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Exclusive video on STREAMIO.',
      videoUrl: videoUrl.trim(),
      coverUrl: finalCover,
      category: category || 'tech',
      tags: tagsArray.length > 0 ? tagsArray : ['STREAMIO', 'Video'],
      duration: duration.trim() || '15:00',
      views: 120,
      likes: 12,
      createdAt: new Date().toISOString(),
      videoType: parsed.type,
      resolution: '4K Ultra HD',
    };

    onPublish(newVideo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl bg-[#14141a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#191922]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20">
              <Upload className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add New Video</h2>
              <p className="text-xs text-gray-400">Supports direct MP4 links, YouTube, Vimeo and embeds</p>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold">
              {errorMessage}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Video URL *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://... direct MP4, YouTube or Vimeo URL"
                className="w-full bg-[#1b1b24] text-white text-xs sm:text-sm rounded-lg pl-3 pr-9 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none"
              />
              <Video className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            {videoUrl && (
              <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Detected player type: {parsed.type.toUpperCase()}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Video Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exploring Deep Space in 4K Ultra HD"
              className="w-full bg-[#1b1b24] text-white text-xs sm:text-sm rounded-lg px-3 py-2.5 border border-white/10 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1b1b24] text-white text-xs sm:text-sm rounded-lg px-3 py-2.5 border border-white/10 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameEn || c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="18:24"
                className="w-full bg-[#1b1b24] text-white text-xs sm:text-sm rounded-lg px-3 py-2.5 border border-white/10 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Cover Image URL (Optional)
            </label>
            <div className="relative mb-2">
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://... high quality thumbnail image"
                className="w-full bg-[#1b1b24] text-white text-xs sm:text-sm rounded-lg px-3 py-2.5 border border-white/10 focus:outline-none"
              />
            </div>
            
            {/* Quick cover presets */}
            <div className="flex gap-2 items-center overflow-x-auto pb-1">
              <span className="text-[11px] text-gray-400 shrink-0">Presets:</span>
              {PRESET_COVERS.map((preset, idx) => (
                <img
                  key={idx}
                  src={preset}
                  alt={`preset-${idx}`}
                  onClick={() => setCoverUrl(preset)}
                  className={`w-12 h-8 rounded object-cover cursor-pointer border hover:opacity-100 transition-opacity ${
                    coverUrl === preset ? 'border-amber-500 scale-105' : 'border-white/10 opacity-60'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Tags (comma separated)</label>
            <div className="relative">
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Sci-Fi, 4K, Cinema, Tech"
                className="w-full bg-[#1b1b24] text-white text-xs sm:text-sm rounded-lg pl-3 pr-9 py-2.5 border border-white/10 focus:outline-none"
              />
              <Tag className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short synopsis or overview of this video..."
              className="w-full bg-[#1b1b24] text-white text-xs sm:text-sm rounded-lg p-3 border border-white/10 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors shadow-md shadow-amber-500/20 active:scale-95"
            >
              Publish Video
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
