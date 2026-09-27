import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('streamio_admin_pin') || '1234';

    if (pin.trim() === storedPin || pin.trim().toLowerCase() === 'admin') {
      setError('');
      setPin('');
      onLoginSuccess();
      onClose();
    } else {
      setError('Incorrect security PIN. (Default: 1234 or admin)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-[#15151c] border border-amber-500/30 rounded-2xl shadow-2xl p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Lock className="w-4 h-4" />
            </div>
            <span>Site Owner Access</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          Enter administrator PIN to unlock dashboard, add, edit and delete content. (Completely hidden from visitors)
        </p>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Security PIN
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Enter PIN (Default: 1234)"
                className="w-full bg-[#1c1c26] text-white text-sm rounded-xl pl-4 pr-10 py-2.5 border border-white/15 focus:border-amber-500 focus:outline-none placeholder:text-gray-500 font-mono tracking-widest text-center"
              />
              <KeyRound className="w-4 h-4 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              * Default system PIN: <span className="text-amber-400 font-mono font-bold">1234</span> or <span className="text-amber-400 font-mono font-bold">admin</span>
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95"
            >
              Login as Admin
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
