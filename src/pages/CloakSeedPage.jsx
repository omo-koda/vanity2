import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Key, ShieldAlert, Ghost, Zap, AlertTriangle } from 'lucide-react';
import useCloak from '../hooks/useCloak';
import { generatePanicPhrase } from '../utils/ciphers';

export default function CloakSeedPage() {
  const cloak = useCloak();
  const [panicMode, setPanicMode] = useState(false);
  const [panicPhrase, setPanicPhrase] = useState(null);

  const handleGeneratePanic = () => {
    if (cloak.cipher) {
      const p = generatePanicPhrase(cloak.cipher.words);
      setPanicPhrase(p);
      setPanicMode(true);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="section-card">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck size={20} className="text-primary-500" />
              CloakSeed Cipher Dashboard
            </h2>
            <p className="text-sm text-gray-500 mt-1">Hide your real seed phrase behind a 2048-word decoy cipher.</p>
          </div>
          <div className="flex gap-2">
            {!cloak.cipher ? (
              <button 
                onClick={() => cloak.setCipherFromTheme('animals')}
                className="btn-primary"
              >
                <Zap size={16} />
                Load Default Theme
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary-500/10 border border-secondary-500/20">
                <ShieldCheck size={14} className="text-secondary-500" />
                <span className="text-[10px] font-bold uppercase text-secondary-500 tracking-widest">Cipher Loaded</span>
              </div>
            )}
          </div>
        </div>

        {!cloak.cipher && (
          <div className="bg-gray-950 border border-dashed border-gray-800 rounded-xl p-12 text-center">
            <ShieldCheck size={48} className="text-gray-800 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-600 mb-2">No Active Cipher</h3>
            <p className="text-sm text-gray-700 max-w-md mx-auto mb-6">You must load or create a 2048-word cipher mapping before you can cloak or restore phrases.</p>
            <div className="flex justify-center gap-4">
               <button onClick={() => cloak.setCipherFromTheme('fantasy')} className="btn-secondary">Fantasy</button>
               <button onClick={() => cloak.setCipherFromTheme('food')} className="btn-secondary">Food</button>
               <button onClick={() => cloak.setCipherFromTheme('colors')} className="btn-secondary">Colors</button>
            </div>
          </div>
        )}

        {cloak.cipher && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <button 
                 onClick={() => cloak.generateNewCloak()}
                 className="w-full p-6 bg-primary-500/5 hover:bg-primary-500/10 border border-primary-500/20 rounded-2xl flex flex-col items-center text-center transition-all group"
               >
                 <RefreshCw size={32} className="text-primary-500 mb-3 group-hover:rotate-180 transition-transform duration-500" />
                 <span className="text-lg font-bold text-white">Generate New Cloak</span>
                 <span className="text-xs text-gray-500">Create a fresh wallet hidden by your cipher.</span>
               </button>
            </div>
            
            <div className="space-y-4">
               <button 
                 onClick={handleGeneratePanic}
                 className="w-full p-6 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col items-center text-center transition-all group"
               >
                 <Ghost size={32} className="text-red-500 mb-3 group-hover:scale-110 transition-transform" />
                 <span className="text-lg font-bold text-white uppercase tracking-tighter">Panic Phrase</span>
                 <span className="text-xs text-gray-500 text-red-400/60">Generate a believable decoy cloak for duress.</span>
               </button>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Sections */}
      {panicMode && panicPhrase && (
        <div className="section-card border-red-500/30 bg-red-950/10 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle size={20} className="text-red-500" />
            <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Emergency Decoy Generated</h3>
          </div>
          <div className="space-y-4">
             <div>
               <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block tracking-widest">Believable Decoy Phrase</label>
               <div className="p-4 bg-black border border-red-900/50 rounded-xl font-mono text-sm text-red-400 leading-relaxed">
                 {panicPhrase.cloakPhrase}
               </div>
             </div>
             <div className="p-4 rounded-lg bg-red-500/10 text-[10px] text-red-400 font-medium">
               This phrase derives a valid wallet that is completely empty. Use this to protect your real funds in emergency situations.
             </div>
             <button onClick={() => setPanicMode(false)} className="text-xs text-gray-500 hover:text-white transition-colors">Dismiss Decoy</button>
          </div>
        </div>
      )}

      {cloak.realSeed && (
        <div className="section-card border-secondary-500/30 animate-fadeIn">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
               <Key size={20} className="text-secondary-500" />
               <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Active Cloak Data</h3>
             </div>
             <button onClick={() => window.location.reload()} className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
               <RefreshCw size={12} /> Wipe Session
             </button>
           </div>

           <div className="space-y-6">
             <div>
               <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block tracking-widest">Your Cloak (Save This)</label>
               <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl font-mono text-sm text-primary-500 leading-relaxed break-all">
                 {cloak.cloakPhrase}
               </div>
             </div>
             
             <div>
               <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block tracking-widest text-red-500">Real Seed (Hidden)</label>
               <div className="p-4 bg-black border border-red-900/50 rounded-xl font-mono text-sm text-gray-700 blur-[5px] hover:blur-none transition-all cursor-pointer">
                 {cloak.realSeed}
               </div>
               <p className="text-[10px] text-gray-600 mt-2">Hover to reveal real seed. Never screenshot this.</p>
             </div>
           </div>
        </div>
      )}

      {/* Legend Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<ShieldCheck className="text-primary-500" />} 
          title="Cipher Mapping" 
          desc="Your personal mapping of 2048 words. Essential for recovery." 
        />
        <FeatureCard 
          icon={<Zap className="text-secondary-500" />} 
          title="Instant Restore" 
          desc="Reverse your cloak phrase to real keys in milliseconds." 
        />
        <FeatureCard 
          icon={<Ghost className="text-red-500" />} 
          title="Ghost Mode" 
          desc="Built-in plausible deniability with decoy phrase support." 
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="section-card hover:border-gray-700 transition-colors">
      <div className="mb-4">{icon}</div>
      <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-tight">{title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </div>
  )
}
