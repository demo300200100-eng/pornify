import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Copy, 
  Check, 
  Zap, 
  DollarSign, 
  AlertCircle,
  ExternalLink,
  Sparkles,
  Loader2,
  Clock,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { CryptoVipSettings, VipPaymentOrder } from '../types/video';

interface RemoveAdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vipSettings: CryptoVipSettings;
  isAdFreeActive: boolean;
  onActivateAdFree?: (txHash?: string) => void;
  onUpgradeSuccess?: () => void;
  onDeactivateAdFree?: () => void;
  onCancelVip?: () => void;
  onOpenDashboard?: () => void;
}

export const RemoveAdsModal: React.FC<RemoveAdsModalProps> = ({
  isOpen,
  onClose,
  vipSettings,
  isAdFreeActive,
  onActivateAdFree,
  onUpgradeSuccess,
  onDeactivateAdFree,
  onCancelVip,
  onOpenDashboard,
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [txError, setTxError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pending order state
  const [pendingOrder, setPendingOrder] = useState<VipPaymentOrder | null>(() => {
    try {
      const raw = localStorage.getItem('streamio_pending_order');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Sync pending order from global list if updated by admin
  useEffect(() => {
    if (!isOpen) return;
    try {
      const rawOrders = localStorage.getItem('streamio_vip_orders');
      if (rawOrders && pendingOrder) {
        const orders: VipPaymentOrder[] = JSON.parse(rawOrders);
        const current = orders.find(o => o.id === pendingOrder.id || o.txHash === pendingOrder.txHash);
        if (current && current.status !== pendingOrder.status) {
          setPendingOrder(current);
          localStorage.setItem('streamio_pending_order', JSON.stringify(current));
          if (current.status === 'verified') {
            if (onActivateAdFree) onActivateAdFree(current.txHash);
            else if (onUpgradeSuccess) onUpgradeSuccess();
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen, pendingOrder, onActivateAdFree, onUpgradeSuccess]);

  if (!isOpen) return null;

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

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(vipSettings.walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2200);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(vipSettings.priceUsdt.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2200);
  };

  const handleSubmitTxForReview = (e: React.FormEvent) => {
    e.preventDefault();
    setTxError(null);

    const cleanTx = txHash.trim();

    // Strict validation: TXID cannot be empty
    if (!cleanTx) {
      setTxError('⚠️ Transaction Hash (TXID) is required. Please transfer USDT first and paste your transaction receipt hash.');
      return;
    }

    // Validation: Check reasonable length for crypto TXID (at least 20 characters)
    if (cleanTx.length < 20) {
      setTxError('⚠️ Invalid TXID length. A valid blockchain transaction hash is typically 64 characters.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Create pending order for admin review
      const newOrder: VipPaymentOrder = {
        id: 'ORD_' + Date.now(),
        txHash: cleanTx,
        amount: vipSettings.priceUsdt,
        network: vipSettings.walletNetwork,
        recipientWallet: vipSettings.walletAddress,
        createdAt: new Date().toISOString(),
        status: 'pending' // STRICTLY PENDING: Must be approved by Admin
      };

      try {
        const rawOrders = localStorage.getItem('streamio_vip_orders');
        const existingOrders: VipPaymentOrder[] = rawOrders ? JSON.parse(rawOrders) : [];
        existingOrders.unshift(newOrder);
        localStorage.setItem('streamio_vip_orders', JSON.stringify(existingOrders));
        localStorage.setItem('streamio_pending_order', JSON.stringify(newOrder));
      } catch (err) {
        console.error('Failed to save VIP order:', err);
      }

      setPendingOrder(newOrder);
      setIsSubmitting(false);
      setTxHash('');
    }, 1200);
  };

  const handleRefreshStatus = () => {
    try {
      const rawOrders = localStorage.getItem('streamio_vip_orders');
      if (rawOrders && pendingOrder) {
        const orders: VipPaymentOrder[] = JSON.parse(rawOrders);
        const found = orders.find(o => o.id === pendingOrder.id || o.txHash === pendingOrder.txHash);
        if (found) {
          setPendingOrder(found);
          localStorage.setItem('streamio_pending_order', JSON.stringify(found));
          if (found.status === 'verified') {
            if (onActivateAdFree) onActivateAdFree(found.txHash);
            else if (onUpgradeSuccess) onUpgradeSuccess();
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelPendingOrder = () => {
    setPendingOrder(null);
    localStorage.removeItem('streamio_pending_order');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans selection:bg-amber-500 selection:text-black">
      <div className="w-full max-w-lg bg-[#14141d] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1b1b28] via-[#222234] to-[#1b1b28] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 text-black">
              <Zap className="w-5 h-5 fill-black" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{vipSettings.planTitle || 'VIP Ad-Free Pass'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 font-mono">
                  {vipSettings.planDuration || 'LIFETIME'}
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Stream ultra 4K videos with zero advertisements.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. ACTIVE VIP STATE */}
        {isAdFreeActive ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xl font-black text-white">VIP Ad-Free Membership Active ✓</h4>
              <p className="text-xs text-emerald-400 font-semibold">
                You are currently enjoying a 100% ad-free experience across all videos and pages.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1a1a26] border border-white/10 text-xs text-gray-300 space-y-2 text-left">
              <div className="flex justify-between items-center text-gray-400">
                <span>Account Status:</span>
                <span className="text-emerald-400 font-bold font-mono">VIP Ad-Free Active</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Plan Tier:</span>
                <span className="text-amber-400 font-bold">{vipSettings.planDuration || 'Lifetime Access'}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Network:</span>
                <span className="text-gray-300 font-mono">{vipSettings.walletNetwork || 'USDT (TRC20)'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-lg shadow-amber-500/20 transition-all"
              >
                Continue Watching Ad-Free
              </button>
              {(onDeactivateAdFree || onCancelVip) && (
                <button
                  onClick={() => {
                    if (onDeactivateAdFree) onDeactivateAdFree();
                    else if (onCancelVip) onCancelVip();
                    onClose();
                  }}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-rose-950/40 text-gray-400 hover:text-rose-400 text-xs font-semibold transition-colors border border-white/5"
                  title="Restore ads on this device"
                >
                  Restore Ads
                </button>
              )}
            </div>
          </div>
        ) : pendingOrder && pendingOrder.status === 'pending' ? (
          /* 2. PENDING ADMIN VERIFICATION STATE */
          <div className="p-6 sm:p-8 space-y-5 text-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 animate-pulse">
              <Clock className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-lg font-black text-white">Payment Submitted & Pending Review ⏳</h4>
              <p className="text-xs text-amber-300 font-medium leading-relaxed">
                Your transaction hash (TXID) has been submitted to administration for verification.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1a1a26] border border-white/10 text-xs text-left space-y-2.5">
              <div className="flex justify-between items-center text-gray-400 border-b border-white/5 pb-2">
                <span>Verification Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold font-mono text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Pending Admin Review</span>
                </span>
              </div>

              <div className="flex justify-between items-center text-gray-400">
                <span>Required Amount:</span>
                <span className="text-amber-400 font-mono font-bold">{pendingOrder.amount} USDT</span>
              </div>

              <div className="flex justify-between items-center text-gray-400">
                <span>Deposit Network:</span>
                <span className="text-gray-300 font-mono">{pendingOrder.network}</span>
              </div>

              <div className="text-gray-400 pt-1">
                <span className="block mb-1">Submitted TXID:</span>
                <div className="p-2 rounded-lg bg-[#111118] text-amber-300 font-mono text-[11px] break-all border border-white/5 flex items-center justify-between gap-2">
                  <span className="truncate">{pendingOrder.txHash}</span>
                  <a
                    href={getExplorerUrl(pendingOrder.network, pendingOrder.txHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-amber-400 hover:underline flex items-center gap-1 text-[10px]"
                    title="View on Explorer"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#12121a] border border-amber-500/20 text-[11px] text-gray-300 text-left space-y-1">
              <p className="text-amber-400 font-bold">ℹ️ Note on Activation:</p>
              <p>
                Ads will remain visible until the administrator checks your blockchain transaction on <strong>{pendingOrder.network}</strong> and approves the order.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRefreshStatus}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Check Approval Status</span>
              </button>
              <button
                type="button"
                onClick={handleCancelPendingOrder}
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-colors border border-white/5"
              >
                Submit New TXID
              </button>
            </div>
          </div>
        ) : pendingOrder && pendingOrder.status === 'rejected' ? (
          /* 3. REJECTED STATE */
          <div className="p-6 sm:p-8 space-y-5 text-center">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
              <ShieldAlert className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-lg font-black text-white">Payment Verification Declined ✕</h4>
              <p className="text-xs text-rose-400 font-medium leading-relaxed">
                The submitted transaction hash was not confirmed by administration or the transfer amount did not match.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancelPendingOrder}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              Try Again with Valid Payment
            </button>
          </div>
        ) : (
          /* 4. CHECKOUT SUBMISSION FORM */
          <div className="p-5 sm:p-6 space-y-5">
            <form onSubmit={handleSubmitTxForReview} className="space-y-4">
              
              {/* Price & Network Badge */}
              <div className="p-4 rounded-2xl bg-[#1b1b28] border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-400 block uppercase font-bold tracking-wider">Required Amount:</span>
                  <div className="text-2xl font-black text-amber-400 font-mono flex items-center gap-1">
                    <span>{vipSettings.priceUsdt}</span>
                    <span className="text-sm font-bold text-gray-300">USDT</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-gray-400 block uppercase font-bold tracking-wider">Deposit Network:</span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black font-mono inline-block mt-0.5">
                    {vipSettings.walletNetwork || 'USDT (TRC20)'}
                  </span>
                </div>
              </div>

              {/* Wallet Address Box with 1-Click Copy */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-200">
                    USDT Deposit Wallet Address:
                  </label>
                  <span className="text-[11px] text-amber-400 font-mono font-semibold">
                    Network: {vipSettings.walletNetwork}
                  </span>
                </div>
                
                <div className="relative flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={vipSettings.walletAddress}
                    className="w-full bg-[#111118] text-amber-300 text-xs sm:text-sm font-mono rounded-xl pr-28 pl-4 py-3 border border-white/15 focus:outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className={`absolute right-1.5 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      copiedAddress
                        ? 'bg-emerald-500 text-black'
                        : 'bg-amber-500 hover:bg-amber-400 text-black'
                    }`}
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step-by-Step Payment Instructions */}
              <div className="p-3.5 rounded-xl bg-[#12121a] border border-white/5 text-[11px] text-gray-300 space-y-1.5 leading-relaxed text-left">
                <p className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>How to Complete Payment & Request VIP:</span>
                </p>
                <p>1. Send <strong>{vipSettings.priceUsdt} USDT</strong> ({vipSettings.walletNetwork}) to the deposit wallet address above.</p>
                <p>2. Copy your <strong>Transaction Hash (TXID)</strong> from your wallet / exchange receipt.</p>
                <p>3. Paste the TXID below and click <strong>"Submit Payment for Review"</strong>.</p>
              </div>

              {/* Required TX Hash Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-200 flex items-center gap-1">
                    <span>Transaction Hash / TXID</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  {txHash.trim().length >= 20 && (
                    <a
                      href={getExplorerUrl(vipSettings.walletNetwork, txHash.trim())}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>View on Explorer</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={txHash}
                  onChange={(e) => {
                    setTxHash(e.target.value);
                    if (txError) setTxError(null);
                  }}
                  placeholder="Paste your 64-character Transaction Hash (TXID)"
                  className="w-full bg-[#1b1b24] text-white text-xs sm:text-sm font-mono rounded-xl px-3.5 py-3 border border-white/10 focus:border-amber-500 focus:outline-none placeholder:text-gray-600"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  All transactions are verified manually by administration on the blockchain.
                </span>
              </div>

              {/* Error Message */}
              {txError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2 text-left animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{txError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-98 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/25'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Payment Order...</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>Submit Payment for Admin Review ➔</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
