import React, { useState } from 'react'
import { Settings as SettingsIcon, Shield, Trash2, Globe, Cpu, ChevronRight } from 'lucide-react'
import { getCurrentTier, TIER_LABELS } from '../utils/features'

export default function Settings() {
  const [settings, setSettings] = useState({
    autoStopOnFind: true,
    showPrivateKeys: false,
    enableNotifications: false,
    theme: 'dark'
  })

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      <div className="section-card">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon size={20} className="text-primary-500" />
          <h2 className="text-xl font-bold text-white">Application Settings</h2>
        </div>

        <div className="divide-y divide-gray-800">
          <SettingItem 
            title="Auto-stop" 
            desc="Pause generation when target results are met."
            checked={settings.autoStopOnFind}
            onChange={() => toggleSetting('autoStopOnFind')}
          />
          <SettingItem 
            title="Reveal Keys" 
            desc="Always show private keys in results without clicking."
            checked={settings.showPrivateKeys}
            onChange={() => toggleSetting('showPrivateKeys')}
          />
          <SettingItem 
            title="Notifications" 
            desc="Browser alerts when a vanity address is discovered."
            checked={settings.enableNotifications}
            onChange={() => toggleSetting('enableNotifications')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="section-card">
          <div className="flex items-center gap-2 mb-6 text-primary-500">
            <Cpu size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Environment</h3>
          </div>
          <div className="space-y-4">
            <StatRow label="CPU Threads" value={navigator.hardwareConcurrency || '8'} />
            <StatRow label="SharedBuffer" value={typeof SharedArrayBuffer !== 'undefined' ? 'Enabled' : 'Disabled'} />
            <StatRow label="Crypto Core" value="noble/secp256k1 v1.7" />
            <StatRow label="Build Engine" value="Vite 5.4.21" />
          </div>
        </div>

        <div className="section-card">
          <div className="flex items-center gap-2 mb-6 text-secondary-500">
            <Shield size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Subscription</h3>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-950 border border-gray-800">
            <div>
              <div className="text-sm font-bold text-white">{TIER_LABELS[getCurrentTier()]} Tier</div>
              <div className="text-[10px] text-gray-500">Lifetime access enabled</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary-500/10 flex items-center justify-center">
              <Shield size={20} className="text-secondary-500" />
            </div>
          </div>
          <button className="mt-4 w-full text-xs text-primary-500 hover:text-primary-400 font-bold flex items-center justify-center gap-1 group">
            Manage Subscription <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="section-card border-red-500/20 bg-red-500/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-red-500">Danger Zone</h3>
            <p className="text-xs text-gray-500">Clear all local settings, profiles, and cached ciphers.</p>
          </div>
          <button 
            onClick={() => { if(confirm('Wipe all local data?')) { localStorage.clear(); window.location.reload(); } }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-xs font-bold transition-all"
          >
            <Trash2 size={14} />
            Wipe Cache
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingItem({ title, desc, checked, onChange }) {
  return (
    <div className="py-4 flex items-center justify-between group">
      <div>
        <div className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{title}</div>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 peer-checked:after:bg-white"></div>
      </label>
    </div>
  )
}

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-gray-500">{label}</span>
      <span className="text-white font-mono">{value}</span>
    </div>
  )
}
