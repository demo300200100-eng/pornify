import React from 'react';
import { Play } from 'lucide-react';

interface FooterProps {
  onOpenDashboard: () => void;
  isAdmin?: boolean;
  siteName?: string;
  siteTagline?: string;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
  onOpenHelp?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenDashboard, 
  isAdmin = false,
  siteName = 'Pornify',
  siteTagline = 'Next-Gen 4K Dark Video Streaming Platform',
  onOpenTerms,
  onOpenPrivacy,
  onOpenHelp,
}) => {
  return (
    <footer className="w-full bg-[#0a0a0d] border-t border-white/[0.06] pt-10 pb-8 mt-20 text-gray-400 text-xs font-sans">
      <div className="max-w-[1700px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
              <Play className="w-4 h-4 fill-black text-black ml-0.5" />
            </div>
            <span className="text-lg font-black text-white uppercase">
              {siteName.toLowerCase() === 'pornify' ? (
                <>
                  Porn<span className="text-amber-500">ify</span>
                </>
              ) : (
                siteName
              )}
            </span>
            <span className="text-gray-500 ml-2">{siteTagline}</span>
          </div>

          <div className="flex items-center gap-6 text-gray-400">
            {isAdmin && (
              <button 
                onClick={onOpenDashboard} 
                className="text-amber-400 hover:text-amber-300 transition-colors font-semibold"
              >
                Admin Dashboard
              </button>
            )}
            <button 
              onClick={onOpenTerms} 
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              Terms of Service
            </button>
            <button 
              onClick={onOpenPrivacy} 
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              Privacy Policy
            </button>
            <button 
              onClick={onOpenHelp} 
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              Help Center
            </button>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-gray-500 text-[11px]">
          <p>
            <span 
              onClick={onOpenDashboard} 
              className="cursor-default select-none hover:text-gray-400 transition-colors"
              title={siteName}
            >
              ©
            </span>{' '}
            {new Date().getFullYear()} {siteName} Inc. All rights reserved.
          </p>
          <p>Built for ultra-fast playback, 4K streaming and high performance.</p>
        </div>
      </div>
    </footer>
  );
};
