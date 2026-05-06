import React from 'react';
import { Shield, Activity } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'Vanity Generator';
    if (path === '/multi-chain') return 'Multi-Chain Generation';
    if (path === '/create2') return 'CREATE2 Vanity Calculator';
    if (path === '/cloakseed') return 'CloakSeed Cipher';
    if (path === '/radar') return 'Poison Radar';
    if (path === '/hd-wallet') return 'HD Wallet Derivation';
    if (path === '/settings') return 'Settings & Profiles';
    return 'Dashboard';
  };

  return (
    <header className="h-16 border-b border-gray-800 bg-dark-950/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <span className="text-gray-500 text-sm">Dashboard</span>
        <span className="text-gray-700">/</span>
        <span className="text-white font-medium">{getBreadcrumb()}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-500/10 border border-secondary-500/20">
          <Shield size={14} className="text-secondary-500" />
          <span className="text-xs font-bold text-secondary-500 uppercase tracking-tighter">Local Secure</span>
          <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 animate-pulse" />
        </div>

        <div className="flex items-center gap-2 text-gray-500">
          <Activity size={16} />
          <span className="text-xs font-medium">System Live</span>
        </div>
      </div>
    </header>
  );
}
