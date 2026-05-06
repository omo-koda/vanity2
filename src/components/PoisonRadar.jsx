import React, { useState } from 'react'
import { CHAINS } from '../utils/chains'
import { analyzeAddress, formatPoisonReport } from '../utils/poisonRadar'
import { Radar, Search, ShieldAlert, ShieldCheck, AlertTriangle, Activity } from 'lucide-react'

export default function PoisonRadar() {
  const [chain, setChain] = useState('ethereum')
  const [address, setAddress] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)

  const handleScan = async () => {
    if (!address) return
    setIsScanning(true)
    setError(null)
    setReport(null)

    try {
      const result = await analyzeAddress(address, CHAINS[chain])
      setReport(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Scanner Control Card */}
      <div className="section-card">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Radar size={20} className="text-primary-500" />
              On-Chain Poison Radar
            </h2>
            <p className="text-sm text-gray-500 mt-1">Scan for dust attacks and suspicious transaction patterns.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-800 border border-gray-700">
            <Activity size={14} className={isScanning ? 'text-primary-500 animate-spin' : 'text-gray-600'} />
            <span className="text-[10px] font-bold uppercase text-gray-400">
              {isScanning ? 'Scanning' : 'Ready'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Network</label>
            <select
              value={chain}
              onChange={e => setChain(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm outline-none focus:border-primary-500"
              disabled={isScanning}
            >
              {Object.entries(CHAINS).map(([id, c]) => (
                <option key={id} value={id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Target Address</label>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Paste address to analyze..."
                className="input-mono pr-12"
                disabled={isScanning}
              />
              <button
                onClick={handleScan}
                disabled={isScanning || !address}
                className="absolute right-2 top-2 p-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {isScanning && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 animate-pulse font-mono">Analyzing block history...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-3">
          <ShieldAlert size={20} />
          <span>Error: {error}</span>
        </div>
      )}

      {report && (
        <div className="animate-fadeIn grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 section-card flex flex-col items-center justify-center text-center">
            {report.risk === 'high' ? (
              <ShieldAlert size={64} className="text-red-500 mb-4" />
            ) : report.risk === 'medium' ? (
              <AlertTriangle size={64} className="text-yellow-500 mb-4" />
            ) : (
              <ShieldCheck size={64} className="text-secondary-500 mb-4" />
            )}
            
            <h3 className={`text-2xl font-bold uppercase tracking-tighter ${
              report.risk === 'high' ? 'text-red-500' : report.risk === 'medium' ? 'text-yellow-500' : 'text-secondary-500'
            }`}>
              {report.risk} Risk detected
            </h3>
            <p className="text-sm text-gray-500 mt-2">{report.message}</p>
          </div>

          <div className="lg:col-span-2 section-card">
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-widest mb-6">Suspicious Pattern Breakdown</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-950 border border-gray-800 rounded-lg">
                <div className="text-gray-500 text-xs mb-1">Dust Transfers</div>
                <div className="text-2xl font-mono font-bold text-white">{report.suspiciousPatterns?.dust || 0}</div>
              </div>
              <div className="p-4 bg-gray-950 border border-gray-800 rounded-lg">
                <div className="text-gray-500 text-xs mb-1">Zero-Value TXs</div>
                <div className="text-2xl font-mono font-bold text-white">{report.suspiciousPatterns?.zeroValue || 0}</div>
              </div>
              <div className="p-4 bg-gray-950 border border-gray-800 rounded-lg">
                <div className="text-gray-500 text-xs mb-1">Contract Hooks</div>
                <div className="text-2xl font-mono font-bold text-white">{report.suspiciousPatterns?.unknownContracts || 0}</div>
              </div>
              <div className="p-4 bg-gray-950 border border-gray-800 rounded-lg">
                <div className="text-gray-500 text-xs mb-1">Spam Pulse</div>
                <div className="text-2xl font-mono font-bold text-white">{report.suspiciousPatterns?.rapidFire ? 'DETECTED' : 'NONE'}</div>
              </div>
            </div>

            {report.warnings?.length > 0 && (
              <div className="mt-6 space-y-2">
                {report.warnings.map((w, i) => (
                  <div key={i} className="text-xs text-yellow-500 flex items-center gap-2">
                    <AlertTriangle size={12} />
                    {w}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Card */}
      {!report && !isScanning && (
        <div className="p-8 border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center text-center opacity-50">
          <Radar size={48} className="text-gray-700 mb-4" />
          <h3 className="text-lg font-bold text-gray-600">No Address Analyzed</h3>
          <p className="text-sm text-gray-700 max-w-sm">Enter a blockchain address above to perform a deep inspection of transaction history for poisoning attempts.</p>
        </div>
      )}
    </div>
  )
}
