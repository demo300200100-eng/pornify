import React from 'react';
import { X, FileText, Shield, HelpCircle, Edit3 } from 'lucide-react';
import { SiteSettings } from '../types/video';

export type InfoModalTab = 'terms' | 'privacy' | 'help';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: InfoModalTab;
  onSelectTab: (tab: InfoModalTab) => void;
  settings: SiteSettings;
  isAdmin?: boolean;
  onOpenDashboardSettings?: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  settings,
  isAdmin = false,
  onOpenDashboardSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-[#14141c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#191924]">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onSelectTab('terms')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'terms'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Service</span>
            </button>

            <button
              onClick={() => onSelectTab('privacy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>

            <button
              onClick={() => onSelectTab('help')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'help'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help Center</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onOpenDashboardSettings && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDashboardSettings();
                }}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 text-xs font-semibold border border-amber-500/30"
                title="Edit content in dashboard"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-gray-300 text-sm leading-relaxed whitespace-pre-line">
          {activeTab === 'terms' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>Terms of Service — {settings.siteName}</span>
              </h2>
              <div className="p-4 rounded-xl bg-[#1a1a24] border border-white/5 font-sans leading-relaxed text-gray-300">
                {settings.termsOfService}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-500" />
                <span>Privacy Policy — {settings.siteName}</span>
              </h2>
              <div className="p-4 rounded-xl bg-[#1a1a24] border border-white/5 font-sans leading-relaxed text-gray-300">
                {settings.privacyPolicy}
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <span>Help Center & FAQ — {settings.siteName}</span>
              </h2>
              <div className="p-4 rounded-xl bg-[#1a1a24] border border-white/5 font-sans leading-relaxed text-gray-300">
                {settings.helpCenter}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-[#191924] text-xs text-gray-400">
          <span>{settings.siteName} • {settings.siteTagline}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
