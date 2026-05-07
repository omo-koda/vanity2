# ⟠ VanityCloakSeed

**Ethereum vanity address generator + stealth seed phrase cloaking — 100% client-side.**

[**Live Demo: vanity-cloakseed.vercel.app**](https://vanity-cloakseed.vercel.app/)

Two tools in one app: brute-force custom ETH addresses (`0xDEAD...`, `0xBINO...`) and hide your seed phrase in plain sight with cipher overlays.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node: 18+](https://img.shields.io/badge/Node-18+-green.svg)
![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# Opens http://localhost:5173
```

Features a **Professional Sidebar Dashboard** for instant access to all tools.

---

## 🔑 Vanity Address Generator

Brute-force Ethereum addresses matching a custom prefix and/or suffix.

### How It Works

1. Generate random 32-byte private key (CSPRNG)
2. Derive public key via secp256k1 elliptic curve
3. Hash with keccak256 → take last 20 bytes → EIP-55 checksum
4. Check if address matches your prefix/suffix pattern
5. Repeat until match found

### Features

- **Prefix + suffix matching** — e.g., `0xBINO...c0ffee`
- **Case-sensitive mode** — match exact casing (harder, slower)
- **Multi-worker support** — 1–16 parallel threads via Web Workers
- **Live stats** — speed (addr/s), attempts, ETA, progress bar
- **Difficulty estimator** — shows expected time before you start
- **Results panel** — copy address, reveal/hide private key, download keystore JSON

### Difficulty Guide

| Pattern Length | Difficulty | Expected Time |
|---|---|---|
| 1–2 chars | 🟢 Instant | < 1 second |
| 3–4 chars | 🟡 Easy | seconds |
| 5–6 chars | 🟠 Medium | minutes |
| 7+ chars | 🔴 Hard | hours/days |

### Multi-Chain Support

The crypto engine supports 6 chains:

| Chain | Curve | Hash | Address Format |
|---|---|---|---|
| ⟠ Ethereum | secp256k1 | keccak256 | `0x...` (40 hex) |
| ₿ Bitcoin | secp256k1 | sha256 | `1...` (base58) |
| ◎ Solana | ed25519 | sha256 | base58 |
| 〰 Sui | ed25519 | blake2b | `0x...` (64 hex) |
| ✦ Cosmos | secp256k1 | sha256 | `cosmos1...` |
| ⬟ Aptos | ed25519 | sha3 | `0x...` (64 hex) |

### CREATE2 Vanity

Predict and brute-force contract deployment addresses:

```
address = keccak256(0xff ++ deployer ++ salt ++ keccak256(bytecode))
```

Find a salt that gives your contract a vanity address before deploying.

### Poison Radar

Scan any ETH/BTC/SOL address for suspicious on-chain activity:
- Dust attack detection
- Zero-value transaction patterns
- Unknown contract interactions
- Rapid-fire spam detection
- Risk scoring: low / medium / high

---

## 🔐 CloakSeed

Hide your BIP-39 seed phrase using a personal cipher overlay.

### The Problem

If someone finds your written seed phrase, they steal your wallet instantly.

### The Solution

```
Real BIP-39 seed:    "abandon able zone arrow..."
Your cipher overlay: "fluff spark moon rabbit..."

You write down:      "fluff spark moon rabbit..."  ← Looks like random words
But it secretly maps: "abandon able zone arrow..." → Your real wallets
```

### Features

- **5 preloaded themes**: Animals 🦁, Colors 🎨, Food 🍕, Fantasy ⚔️, Nonsense 🎪
- **Custom cipher**: Import your own 2048-word list
- **Panic phrases**: Generate decoy cloaks that map to empty wallets
- **Encrypted export**: Download cipher as password-protected JSON
- **HD wallet derivation**: BIP-32/BIP-44 from single seed phrase
- **Multi-chain**: One seed → ETH, BTC, SOL, SUI, ATOM, APT addresses

---

## 🏗️ Architecture

### Tech Stack

- **React 18** + **Vite 5** — fast dev + optimized builds
- **Tailwind CSS** — dark-theme UI
- **@noble/secp256k1** — elliptic curve cryptography
- **@noble/hashes** — keccak256, sha256, blake2b, sha3
- **@noble/ed25519** — Solana/Sui/Aptos key derivation
- **bip39 / bip32** — seed phrase + HD wallet derivation
- **lucide-react** — icons

### Project Structure

```
src/
├── components/
│   ├── Generator.jsx          # Vanity address generator UI
│   ├── Results.jsx            # Found addresses + key viewer
│   ├── Statistics.jsx         # Difficulty guide + tips
│   ├── MultiChainGenerator.jsx # Multi-chain vanity generation
│   ├── HDWallet.jsx           # HD wallet derivation UI
│   ├── Create2Calculator.jsx  # CREATE2 address predictor
│   ├── PoisonRadar.jsx        # Address safety scanner
│   ├── ZKExport.jsx           # Zero-knowledge export
│   ├── ExportManager.jsx      # Keystore export
│   ├── ProfileManager.jsx     # Cipher profile management
│   ├── SecurityWarnings.jsx   # Security alerts
│   └── Settings.jsx           # App settings
├── hooks/
│   ├── useAddressGenerator.js # Multi-worker orchestrator
│   ├── useCloakSeed.js        # Seed cipher engine
│   └── useCloak.js            # Cloak state manager
├── workers/
│   └── generatorWorker.js     # Web Worker brute-force loop
├── utils/
│   ├── crypto.js              # secp256k1 + keccak256 core
│   ├── chainCrypto.js         # Multi-chain key derivation
│   ├── create2.js             # CREATE2 + CREATE address calc
│   ├── hdWallet.js            # BIP-32/BIP-44 derivation
│   ├── chains.js              # 6 chain configurations
│   ├── ciphers.js             # Cipher encoding/decoding
│   ├── wordlists.js           # 2048-word theme lists
│   ├── encryption.js          # Encrypted export/import
│   ├── poisonRadar.js         # On-chain scanner
│   ├── profiles.js            # Profile manager
│   └── bip39Helper.js         # Mnemonic helper
├── App.jsx                    # Router + tab navigation
├── index.css                  # Tailwind + component styles
└── main.jsx                   # React entry point
```

### Security

- **100% client-side** — no backend, no API calls, no telemetry
- **CSPRNG** — `crypto.getRandomValues()` for all randomness
- **No tracking** — zero analytics, zero cookies, zero logs
- **Offline capable** — works without internet after initial load
- **CSP headers** — strict Content Security Policy in `index.html`

---

## 📦 Build & Deploy

```bash
npm run build       # Production build → dist/
npm run preview     # Preview production build locally
```

Deploy `dist/` to any static host: **Vercel**, **Netlify**, **GitHub Pages**, or self-hosted.

---

## 🔒 Security Best Practices

- Generate addresses on an **airgapped device** when possible
- **Never share** your private key
- **Back up** private keys to hardware wallet or encrypted storage
- **Verify full addresses** — not just prefix/suffix (address poisoning defense)
- Use **Poison Radar** to scan addresses before sending funds

---

## 📄 License

MIT — free for personal and commercial use.

---

**Built for the crypto community** 🔐⟠
