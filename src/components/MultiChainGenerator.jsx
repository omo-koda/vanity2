import React, { useState, useRef } from 'react'
import { CHAINS } from '../utils/chains'
import { generateKeyForChain, generateAddressForChain, matchesPatternForChain } from '../utils/chainCrypto'
import { Play, Square, Cpu, Layers, Activity } from 'lucide-react'
import Results from './Results'

export default function MultiChainGenerator() {
  const [selectedChain, setSelectedChain] = useState('ethereum')
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [maxResults, setMaxResults] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [foundCount, setFoundCount] = useState(0)
  const [results, setResults] = useState([])
  const [stats, setStats] = useState({ attempts: 0, speed: 0, elapsed: 0 })
  
  const generationRef = useRef(null)
  const startTimeRef = useRef(null)

  const handleStart = async () => {
    setIsGenerating(true)
    setFoundCount(0)
    setResults([])
    setStats({ attempts: 0, speed: 0, elapsed: 0 })
    startTimeRef.current = Date.now()

    const controller = { aborted: false }
    generationRef.current = controller
    const chain = CHAINS[selectedChain]

    let localAttempts = 0
    let localFound = 0

    while (!controller.aborted && localFound < maxResults) {
      await new Promise(resolve => setTimeout(resolve, 0))
      
      for (let i = 0; i < 100 && !controller.aborted && localFound < maxResults; i++) {
        const keyData = await generateKeyForChain(chain)
        const addrData = await generateAddressForChain(chain, keyData.privateKey)

        if (matchesPatternForChain(addrData.address, chain, prefix, suffix)) {
          localFound++
          setFoundCount(localFound)
          setResults(prev => [{ ...addrData, timestamp: new Date(), chain: selectedChain }, ...prev])
        }
        localAttempts++
      }

      const elapsed = (Date.now() - startTimeRef.current) / 1000
      setStats({
        attempts: localAttempts,
        speed: Math.round(localAttempts / (elapsed || 1)),
        elapsed: Math.round(elapsed)
      })
    }
    setIsGenerating(false)
  }

  const handleStop = () => {
    setIsGenerating(false)
    if (generationRef.current) generationRef.current.aborted = true
  }

  return (
    <div className="space-y-8">
      <div className="section-card">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers size={20} className="text-primary-500" />
              Advanced Multi-Chain Engine
            </h2>
            <p className="text-sm text-gray-500 mt-1">Cross-chain vanity generation across 6 major networks.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-800 border border-gray-700">
            <Activity size={14} className={isGenerating ? 'text-secondary-500 animate-pulse' : 'text-gray-600'} />
            <span className="text-[10px] font-bold uppercase text-gray-400">
              {isGenerating ? 'Active' : 'Standby'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-3 tracking-widest">Select Blockchain</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(CHAINS).map(([id, chain]) => (
                  <button
                    key={id}
                    onClick={() => setSelectedChain(id)}
                    disabled={isGenerating}
                    className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      selectedChain === id 
                        ? 'bg-primary-500/10 border-primary-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.1)]' 
                        : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700'
                    }`}
                  >
                    <span className="text-xl">{chain.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{chain.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Prefix</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={e => setPrefix(e.target.value)}
                  className="input-mono"
                  disabled={isGenerating}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Suffix</label>
                <input
                  type="text"
                  value={suffix}
                  onChange={e => setSuffix(e.target.value)}
                  className="input-mono"
                  disabled={isGenerating}
                />
              </div>
            </div>

            <div className="pt-4">
              {!isGenerating ? (
                <button onClick={handleStart} className="btn-primary w-full py-4 text-lg">
                  <Play size={20} fill="currentColor" />
                  Launch Multi-Chain Search
                </button>
              ) : (
                <button onClick={handleStop} className="btn-secondary w-full py-4 text-red-500 border-red-500/30 hover:bg-red-500/10">
                  <Square size={20} fill="currentColor" />
                  Terminate Session
                </button>
              )}
            </div>
          </div>

          <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary-500">
                <Cpu size={18} />
                <h3 className="text-xs font-bold uppercase tracking-widest">Engine Diagnostics</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Hash Rate</div>
                  <div className="text-xl font-mono font-bold">{stats.speed.toLocaleString()} H/s</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Total Attempts</div>
                  <div className="text-xl font-mono font-bold">{stats.attempts.toLocaleString()}</div>
                </div>
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase text-gray-500 font-bold">Progress ({foundCount}/{maxResults})</span>
                    <span className="text-[10px] font-mono font-bold text-primary-500">{Math.round((foundCount/maxResults)*100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-500" 
                      style={{ width: `${(foundCount/maxResults)*100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-primary-500/5 border border-primary-500/10">
              <div className="text-[10px] uppercase text-primary-500 font-bold mb-1">Chain Metadata</div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Curve:</span>
                <span className="text-white font-mono">{CHAINS[selectedChain].curve}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-500">Hash:</span>
                <span className="text-white font-mono">{CHAINS[selectedChain].hash}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {results.length > 0 && <Results results={results} />}
    </div>
  )
}
