import React, { useState } from 'react'
import { Copy, Eye, EyeOff, Download, Check, ShieldAlert } from 'lucide-react'

export default function Results({ results }) {
  const [visibleKeys, setVisibleKeys] = useState({})
  const [copied, setCopied] = useState(null)

  const toggleKeyVisibility = (index) => {
    setVisibleKeys(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (results.length === 0) return null

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white uppercase tracking-tighter">Generated Wallets ({results.length})</h2>
        <div className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1">
          <ShieldAlert size={10} />
          Never Share Private Keys
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {results.map((result, idx) => (
          <div key={idx} className="bg-gray-950/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
            {/* Address Row */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Blockchain Address</div>
                <div className="font-mono text-sm text-primary-500 break-all leading-tight">
                  {result.address}
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(result.address, `addr-${idx}`)}
                className={`p-2 rounded-lg transition-all ${copied === `addr-${idx}` ? 'bg-secondary-500 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
              >
                {copied === `addr-${idx}` ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Key Row */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Private Key</div>
                <div className={`font-mono text-xs break-all transition-all duration-300 ${visibleKeys[idx] ? 'text-red-400' : 'text-gray-700 blur-[4px] select-none'}`}>
                  {result.privateKey}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleKeyVisibility(idx)}
                  className="p-2 bg-gray-900 text-gray-400 hover:text-white rounded-lg transition-all"
                >
                  {visibleKeys[idx] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => copyToClipboard(result.privateKey, `key-${idx}`)}
                  className={`p-2 rounded-lg transition-all ${copied === `key-${idx}` ? 'bg-secondary-500 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
                >
                  {copied === `key-${idx}` ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
