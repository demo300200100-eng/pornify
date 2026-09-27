import React, { useState } from 'react';
import { X, Zap, ShieldCheck, DollarSign, Sparkles } from 'lucide-react';
import { CryptoVipSettings } from '../types/video';

interface RemoveAdsWidgetProps {
  vipSettings: CryptoVipSettings;
  isAdFreeActive: boolean;
  onOpenModal: () => void;
}

export const RemoveAdsWidget: React.FC<RemoveAdsWidgetProps> = ({
  vipSettings,
  isAdFreeActive,
  onOpenModal,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!vipSettings.enabled || isDismissed) return null;

  // If already Ad-Free active, show a small discreet badge
  if (isAdFreeActive) {
    return (
      <div className="fixed bottom-4 left-4 sm:left-6 z-40 animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div
          onClick={onOpenModal}
          className="bg-[#12121a]/95 backdrop-blur-xl border border-emerald-500/40 hover:border-emerald-400 p-2.5 sm:p-3 rounded-2xl shadow-xl cursor-pointer transition-all flex items-center gap-2.5 text-xs text-emerald-300 font-bold select-none group"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="group-hover:underline">VIP Ad-Free Active ✓</span>
        </div>
      </div>
    );
  }

  // Floating Remove Ads Widget replacing the old VPN banner
  return (
    <div className="fixed bottom-4 left-4 sm:left-6 z-40 max-w-sm sm:max-w-md w-[calc(100%-2rem)] animate-in fade-in slide-in-from-bottom-5 duration-300 font-sans">
      <div
        onClick={onOpenModal}
        className="group relative bg-[#171724]/95 backdrop-blur-xl border border-amber-500/50 hover:border-amber-400 p-3.5 sm:p-4 rounded-2xl shadow-2xl hover:shadow-amber-500/25 cursor-pointer transition-all flex items-center gap-3.5 select-none"
      >
        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="absolute top-2 right-2 p-1 rounded-lg bg-black/40 text-gray-400 hover:text-white hover:bg-black/80 transition-colors z-10"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Pulsing VIP Icon */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 fill-black text-black" />
          </div>
          {/* Animated online pulse */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-[#171724] animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-[#171724]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>VIP AD-FREE PASS</span>
            </span>
          </div>

          <h5 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate mt-0.5">
            ⚡ Remove All Advertisements
          </h5>
          <p className="text-[11px] text-gray-300 truncate">
            Only <strong className="text-amber-400 font-mono">{vipSettings.priceUsdt} USDT</strong> for lifetime access
          </p>
        </div>

        {/* Action Button */}
        <button className="shrink-0 px-3.5 py-2 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-black font-black text-xs flex items-center gap-1 shadow-lg shadow-amber-500/25 transition-all active:scale-95">
          <span>{vipSettings.priceUsdt} USDT</span>
        </button>
      </div>
    </div>
  );
};
