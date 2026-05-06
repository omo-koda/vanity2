import React, { useState } from 'react'
import { Box, Calculator, Copy, Check, Zap, Info, Terminal } from 'lucide-react'
import { calculateCreate2Address, calculateCreateAddress, getSampleBytecode } from '../utils/create2'

export default function Create2Calculator() {
  const [tab, setTab] = useState('create2')
  const [copied, setCopied] = useState(false)
  const [create2Form, setCreate2Form] = useState({
    deployer: '',
    salt: '',
    bytecode: getSampleBytecode(),
  })
  const [createForm, setCreateForm] = useState({
    deployer: '',
    nonce: '0',
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleCreate2 = () => {
    try {
      setError(null)
      const address = calculateCreate2Address(
        create2Form.deployer,
        create2Form.salt,
        create2Form.bytecode
      )
      setResult({ address, type: 'CREATE2' })
    } catch (e) {
      setError(e.message)
    }
  }

  const handleCreate = () => {
    try {
      setError(null)
      const address = calculateCreateAddress(
        createForm.deployer,
        createForm.nonce
      )
      setResult({ address, type: 'CREATE' })
    } catch (e) {
      setError(e.message)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="section-card">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calculator size={20} className="text-primary-500" />
              Contract Address Predictor
            </h2>
            <p className="text-sm text-gray-500 mt-1">Calculate deterministic deployment addresses before sending TXs.</p>
          </div>
          
          <div className="flex p-1 bg-gray-950 border border-gray-800 rounded-lg">
            <button
              onClick={() => { setTab('create2'); setResult(null); }}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                tab === 'create2' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              CREATE2
            </button>
            <button
              onClick={() => { setTab('create'); setResult(null); }}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                tab === 'create' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              CREATE
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-3">
            <Info size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {tab === 'create2' ? (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Deployer Address</label>
                  <input
                    type="text"
                    value={create2Form.deployer}
                    onChange={(e) => setCreate2Form({ ...create2Form, deployer: e.target.value })}
                    placeholder="0x..."
                    className="input-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Salt (Hex)</label>
                  <input
                    type="text"
                    value={create2Form.salt}
                    onChange={(e) => setCreate2Form({ ...create2Form, salt: e.target.value })}
                    placeholder="0x..."
                    className="input-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Init Bytecode</label>
                  <textarea
                    value={create2Form.bytecode}
                    onChange={(e) => setCreate2Form({ ...create2Form, bytecode: e.target.value })}
                    className="input-mono h-32 text-[11px] leading-tight"
                  />
                </div>
                <button onClick={handleCreate2} className="btn-primary w-full py-4">
                  <Zap size={18} fill="currentColor" />
                  Calculate Address
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Deployer Address</label>
                  <input
                    type="text"
                    value={createForm.deployer}
                    onChange={(e) => setCreateForm({ ...createForm, deployer: e.target.value })}
                    placeholder="0x..."
                    className="input-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Nonce</label>
                  <input
                    type="number"
                    value={createForm.nonce}
                    onChange={(e) => setCreateForm({ ...createForm, nonce: e.target.value })}
                    className="input-mono"
                  />
                </div>
                <button onClick={handleCreate} className="btn-primary w-full py-4">
                  <Zap size={18} fill="currentColor" />
                  Derive CREATE Address
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col gap-6">
             <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 flex-1">
               <div className="flex items-center gap-2 mb-4 text-gray-500">
                 <Terminal size={16} />
                 <h3 className="text-[10px] font-bold uppercase tracking-widest">Technical Brief</h3>
               </div>
               <div className="space-y-4 text-xs text-gray-400 leading-relaxed">
                 {tab === 'create2' ? (
                   <p>
                     <span className="text-primary-500 font-bold">CREATE2</span> allows you to deploy a contract to the same address on multiple chains. 
                     The address is calculated based on the deployer, a user-provided salt, and the hash of the contract's creation code.
                   </p>
                 ) : (
                   <p>
                     <span className="text-secondary-500 font-bold">CREATE</span> is the traditional method. 
                     The address is determined solely by the sender's address and their transaction nonce.
                   </p>
                 )}
                 <div className="p-3 bg-black rounded border border-gray-900 font-mono text-[10px]">
                   {tab === 'create2' 
                     ? "keccak256(0xff ++ deployer ++ salt ++ keccak256(bytecode))"
                     : "keccak256(rlp([deployer, nonce]))"}
                 </div>
               </div>
             </div>

             {result && (
               <div className="bg-primary-500/5 border border-primary-500/20 rounded-xl p-6 animate-fadeIn">
                 <div className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-2">Predicted {result.type} Address</div>
                 <div className="flex items-center gap-4">
                   <div className="flex-1 font-mono text-lg text-white break-all leading-tight">
                     {result.address}
                   </div>
                   <button 
                     onClick={() => copyToClipboard(result.address)}
                     className={`p-3 rounded-xl transition-all ${copied ? 'bg-secondary-500 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
                   >
                     {copied ? <Check size={20} /> : <Copy size={20} />}
                   </button>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
