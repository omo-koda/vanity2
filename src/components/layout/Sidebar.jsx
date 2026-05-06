import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Hash, 
  Layers, 
  ShieldCheck, 
  Radar, 
  Wallet, 
  Settings, 
  Lock,
  Zap,
  Box
} from 'lucide-react';
import { getCurrentTier, TIER_LABELS } from '../../utils/features';

const navItems = [
  { path: '/', label: 'Vanity Generator', icon: Hash },
  { path: '/multi-chain', label: 'Multi-Chain Gen', icon: Layers },
  { path: '/create2', label: 'CREATE2 Vanity', icon: Box },
  { path: '/cloakseed', label: 'CloakSeed', icon: ShieldCheck },
  { path: '/radar', label: 'Poison Radar', icon: Radar },
  { path: '/hd-wallet', label: 'HD Wallet', icon: Wallet },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const tier = getCurrentTier();

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-dark-900 border-r border-gray-800 flex flex-col z-50">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
          <Zap size={20} className="text-white fill-current" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">VanityCloak</h1>
            <span className="bg-primary-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">V2</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-primary-500 font-bold">
            {TIER_LABELS[tier]} Edition
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              isActive ? 'nav-item-active' : 'nav-item'
            }
          >
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Lock */}
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={() => window.location.reload()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 hover:bg-red-900/20 text-gray-400 hover:text-red-500 border border-gray-800 transition-all group"
        >
          <Lock size={18} className="group-hover:scale-110" />
          <span className="text-sm font-semibold">Secure Lock</span>
        </button>
      </div>
    </aside>
  );
}
