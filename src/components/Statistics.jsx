import React from 'react'
import { Info, Gauge, ShieldCheck, Zap } from 'lucide-react'

export default function Statistics() {
  return (
    <div className="space-y-6">
      <div className="section-card border-primary-500/10 bg-primary-500/5">
        <div className="flex items-center gap-2 mb-4 text-primary-500">
          <Gauge size={18} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Difficulty Matrix</h3>
        </div>
        <div className="space-y-3">
          <DifficultyRow label="1-3 Chars" time="Seconds" color="text-secondary-500" />
          <DifficultyRow label="4-5 Chars" time="Minutes" color="text-yellow-500" />
          <DifficultyRow label="6-7 Chars" time="Hours" color="text-orange-500" />
          <DifficultyRow label="8+ Chars" time="Days/Weeks" color="text-red-500" />
        </div>
      </div>

      <div className="section-card">
        <div className="flex items-center gap-2 mb-4 text-gray-400">
          <Zap size={18} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Speed Optimization</h3>
        </div>
        <ul className="space-y-2 text-xs text-gray-500">
          <li className="flex items-start gap-2">
            <span className="text-secondary-500">✓</span> 
            <span>Disable <strong>Case Sensitivity</strong> for 2x speed boost.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary-500">✓</span> 
            <span>Use <strong>Chrome</strong> for maximum V8 crypto performance.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary-500">✓</span> 
            <span>Set <strong>Worker Threads</strong> to match your CPU cores.</span>
          </li>
        </ul>
      </div>

      <div className="section-card bg-gray-900/10">
        <div className="flex items-center gap-2 mb-4 text-secondary-500">
          <ShieldCheck size={18} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Safety Protocol</h3>
        </div>
        <div className="p-3 bg-black/40 rounded-lg border border-gray-800 text-[10px] text-gray-400 leading-relaxed font-mono">
          "Private keys are like physical keys. If someone copies them, they own your house. Store your results in a password manager or offline vault immediately after generation."
        </div>
      </div>
    </div>
  )
}

function DifficultyRow({ label, time, color }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-gray-400 font-medium">{label}</span>
      <span className={`font-bold ${color}`}>{time}</span>
    </div>
  )
}
