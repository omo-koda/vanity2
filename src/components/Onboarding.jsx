import React, { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Shield, Key, Eye, Zap, Layers } from 'lucide-react'

const steps = [
  {
    icon: Zap,
    title: 'Precision Vanity Generation',
    description: 'Forge custom blockchain addresses with high-entropy prefix and suffix patterns. 100% client-side execution ensures your private keys never touch the network.',
  },
  {
    icon: Layers,
    title: 'Multi-Chain Engine',
    description: 'One dashboard for everything. Support for Ethereum, Bitcoin, Solana, Sui, Cosmos, and Aptos with native curve and hash implementations.',
  },
  {
    icon: Shield,
    title: 'CloakSeed Protocol',
    description: "Military-grade plausible deniability. Map your BIP-39 seed to a secret 2048-word cipher. Hide your real wealth in plain sight.",
  },
]

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('vanity-onboarding-complete')
    if (!hasSeenOnboarding) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const CurrentIcon = steps[step].icon

  const handleDismiss = () => {
    localStorage.setItem('vanity-onboarding-complete', 'true')
    setVisible(false)
    onComplete?.()
  }

  return (
    <div className="fixed inset-0 bg-dark-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-lg w-full p-10 shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center mb-10">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 transition-all duration-300 rounded-full ${i === step ? 'w-10 bg-primary-500' : 'w-4 bg-gray-800'}`}
              />
            ))}
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-600 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-primary-500/20">
            <CurrentIcon size={48} className="text-primary-500" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{steps[step].title}</h3>
          <p className="text-gray-400 leading-relaxed text-lg px-4">{steps[step].description}</p>
        </div>

        <div className="flex gap-4">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-4 px-6 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-all font-bold flex items-center justify-center gap-2"
            >
              <ChevronLeft size={20} /> Back
            </button>
          )}

          <button
            onClick={() => {
              if (step < steps.length - 1) {
                setStep(s => s + 1)
              } else {
                handleDismiss()
              }
            }}
            className="flex-1 py-4 px-6 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center justify-center gap-2 active:scale-95"
          >
            {step < steps.length - 1 ? (
              <>Continue <ChevronRight size={20} /></>
            ) : (
              'Enter Dashboard'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
