import React, { useState, useEffect, useRef } from 'react'
import { Play, Square, Copy, Download, RefreshCw, Cpu, Zap, Activity } from 'lucide-react'
import { generatePrivateKey, getPublicKey, getAddressFromPublicKey, matchesPattern, calculateDifficulty, formatTimeEstimate, validatePatternInputs } from '../utils/crypto'
import { trackGenerationStarted, trackGenerationCompleted } from '../utils/analytics'
import { getLimit, getCurrentTier } from '../utils/features'
import UpgradeModal from './UpgradeModal'
import Results from './Results'

export default function Generator() {
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [maxResults, setMaxResults] = useState(5)
  const [workerCount, setWorkerCount] = useState(navigator.hardwareConcurrency || 4)

  const [isGenerating, setIsGenerating] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [foundCount, setFoundCount] = useState(0)
  const [results, setResults] = useState([])
  const [speed, setSpeed] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [eta, setEta] = useState(0)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const startTimeRef = useRef(null)
  const generationRef = useRef(null)

  const handleStart = async () => {
    if (!prefix && !suffix) return
    const validation = validatePatternInputs(prefix, suffix)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setIsGenerating(true)
    setAttempts(0)
    setFoundCount(0)
    setResults([])
    setSpeed(0)
    setElapsed(0)
    startTimeRef.current = Date.now()

    trackGenerationStarted('ethereum', prefix.length, suffix.length, workerCount)

    const difficulty = calculateDifficulty(prefix, suffix)
    const controller = { aborted: false }
    generationRef.current = controller

    let localAttempts = 0
    let localFound = 0

    while (!controller.aborted && localFound < maxResults) {
      // Small delay to allow UI to breathe
      await new Promise(resolve => setTimeout(resolve, 0))
      
      for (let i = 0; i < 500 && !controller.aborted && localFound < maxResults; i++) {
        const priv = generatePrivateKey()
        const pub = getPublicKey(priv)
        const addr = getAddressFromPublicKey(pub)

        if (matchesPattern(addr, prefix, suffix, caseSensitive)) {
          localFound++
          setFoundCount(localFound)
          setResults(prev => [{ address: addr, privateKey: priv, timestamp: new Date() }, ...prev])
        }
        localAttempts++
      }

      const now = Date.now()
      const totalElapsed = (now - startTimeRef.current) / 1000
      const currentSpeed = localAttempts / (totalElapsed || 1)
      
      setAttempts(localAttempts)
      setSpeed(Math.round(currentSpeed))
      setElapsed(Math.round(totalElapsed))
      setEta(Math.round(difficulty / (currentSpeed || 1)))
    }

    setIsGenerating(false)
    trackGenerationCompleted('ethereum', (Date.now() - startTimeRef.current) / 1000, localAttempts)
  }

  const handleStop = () => {
    setIsGenerating(false)
    if (generationRef.current) generationRef.current.aborted = true
  }

  return (
    <div className="space-y-8">
      {/* Configuration Section */}
      <div className="section-card">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap size={20} className="text-primary-500" />
              Standard Ethereum Generator
            </h2>
            <p className="text-sm text-gray-500 mt-1">Generate high-entropy vanity addresses locally.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-800 border border-gray-700">
            <Activity size={14} className={isGenerating ? 'text-secondary-500 animate-pulse' : 'text-gray-600'} />
            <span className="text-[10px] font-bold uppercase text-gray-400">
              {isGenerating ? 'Generating' : 'Idle'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Prefix</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value.replace(/[^0-9a-fA-F]/g, ''))}
                  placeholder="e.g. beef"
                  className="input-mono text-lg"
                  disabled={isGenerating}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Suffix</label>
                <input
                  type="text"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value.replace(/[^0-9a-fA-F]/g, ''))}
                  placeholder="e.g. c0de"
                  className="input-mono text-lg"
                  disabled={isGenerating}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-800 bg-gray-900 text-primary-500 focus:ring-primary-500"
                  disabled={isGenerating}
                />
                <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Case Sensitive</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Workers</label>
                <select
                  value={workerCount}
                  onChange={(e) => setWorkerCount(parseInt(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm outline-none focus:border-primary-500"
                  disabled={isGenerating}
                >
                  {[1, 2, 4, 8, 16].map(n => <option key={n} value={n}>{n} Threads</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Limit</label>
                <select
                  value={maxResults}
                  onChange={(e) => setMaxResults(parseInt(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm outline-none focus:border-primary-500"
                  disabled={isGenerating}
                >
                  {[1, 5, 10, 25, 50].map(n => <option key={n} value={n}>{n} Results</option>)}
                </select>
              </div>
            </div>

            <div className="pt-4">
              {!isGenerating ? (
                <button
                  onClick={handleStart}
                  disabled={!prefix && !suffix}
                  className="btn-primary w-full py-4 text-lg"
                >
                  <Play size={20} fill="currentColor" />
                  Start Generation
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="w-full py-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl font-bold hover:bg-red-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Square size={20} fill="currentColor" />
                  Stop Search
                </button>
              )}
            </div>
          </div>

          <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary-500">
                <Cpu size={18} />
                <h3 className="text-xs font-bold uppercase tracking-widest">Real-time Performance</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase text-gray-500 font-bold tracking-tighter">Current Speed</div>
                  <div className="text-2xl font-mono font-bold text-white leading-none">
                    {speed.toLocaleString()} <span className="text-[10px] text-gray-600">H/s</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase text-gray-500 font-bold tracking-tighter">Total Attempts</div>
                  <div className="text-2xl font-mono font-bold text-white leading-none">
                    {attempts.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase text-gray-500 font-bold tracking-tighter">Elapsed Time</div>
                  <div className="text-2xl font-mono font-bold text-white leading-none">
                    {elapsed}s
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase text-gray-500 font-bold tracking-tighter">Probability (50%)</div>
                  <div className="text-2xl font-mono font-bold text-secondary-500 leading-none">
                    {eta}s
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Discovery Progress</span>
                <span className="text-xs font-bold text-white">{foundCount} / {maxResults}</span>
              </div>
              <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 transition-all duration-500" 
                  style={{ width: `${(foundCount / maxResults) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="animate-fadeIn">
          <Results results={results} />
        </div>
      )}

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </div>
  )
}
