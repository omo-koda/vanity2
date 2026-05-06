import React, { useState } from 'react'
import { Wallet, Key, Download, RefreshCw, Copy, Check, Eye, EyeOff } from 'lucide-react'
import { generateSeedPhrase, getAllDerivations, validateMnemonic } from '../utils/hdWallet'
import { CHAINS } from '../utils/chains'

export default function HDWallet() {
  const [mnemonic, setMnemonic] = useState('')
  const [derivations, setDerivations] = useState(null)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [copied, setCopied] = useState(null)

  const handleGenerate = async () => {
    const m = await generateSeedPhrase()
    setMnemonic(m)
    const seed = await import('bip39').then(b => b.mnemonicToSeedSync(m))
    const d = getAllDerivations(seed)
    setDerivations(d)
  }

  const handleImport = async (val) => {
    setMnemonic(val)
    if (validateMnemonic(val)) {
      const seed = await import('bip39').then(b => b.mnemonicToSeedSync(val))
      const d = getAllDerivations(seed)
      setDerivations(d)
    } else {
      setDerivations(null)
    }
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="section-card">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Wallet size={20} className="text-primary-500" />
              HD Wallet Deriver (BIP-39/44)
            </h2>
            <p className="text-sm text-gray-500 mt-1">Generate or import seed phrases to derive cross-chain wallets.</p>
          </div>
          <button onClick={handleGenerate} className="btn-secondary">
            <RefreshCw size={16} />
            Generate New
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Secret Recovery Phrase (24 words)</label>
              <button onClick={() => setShowMnemonic(!showMnemonic)} className="text-gray-500 hover:text-white flex items-center gap-1 text-xs">
                {showMnemonic ? <EyeOff size={14} /> : <Eye size={14} />}
                {showMnemonic ? 'Hide' : 'Show'}
              </button>
            </div>
            <textarea
              value={mnemonic}
              onChange={(e) => handleImport(e.target.value)}
              placeholder="Enter your 12 or 24-word seed phrase..."
              className={`w-full bg-gray-950 border border-gray-800 rounded-xl p-6 font-mono text-sm outline-none focus:border-primary-500 transition-all ${!showMnemonic && mnemonic ? 'blur-md select-none' : ''}`}
              rows={3}
            />
            {mnemonic && !validateMnemonic(mnemonic) && (
              <p className="text-red-500 text-xs mt-2">Invalid BIP-39 mnemonic phrase</p>
            )}
          </div>
        </div>
      </div>

      {derivations && (
        <div className="animate-fadeIn space-y-4">
          <h3 className="text-xs font-bold uppercase text-gray-500 tracking-widest ml-1">Derived Network Wallets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(derivations).map(([id, d]) => (
              <div key={id} className="section-card hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{CHAINS[id].icon}</span>
                  <div>
                    <h4 className="font-bold text-white leading-none">{CHAINS[id].name}</h4>
                    <span className="text-[10px] text-gray-500 font-mono">{d.path}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] uppercase text-gray-500 font-bold">
                      <span>Public Address</span>
                      <button onClick={() => copyToClipboard(d.address, `${id}-addr`)} className="hover:text-primary-500 transition-colors">
                        {copied === `${id}-addr` ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <div className="text-[11px] font-mono bg-black/40 p-2 rounded border border-gray-800 break-all text-gray-300">
                      {d.address}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] uppercase text-gray-500 font-bold">
                      <span>Private Key</span>
                      <button onClick={() => copyToClipboard(d.privateKey, `${id}-priv`)} className="hover:text-primary-500 transition-colors">
                        {copied === `${id}-priv` ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <div className="text-[11px] font-mono bg-black/40 p-2 rounded border border-gray-800 break-all text-gray-300 filter blur-[3px] hover:blur-none transition-all cursor-pointer">
                      {d.privateKey}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-secondary w-full py-4 border-dashed">
            <Download size={18} />
            Export Multi-Chain Wallet Manifest (JSON)
          </button>
        </div>
      )}
    </div>
  )
}
