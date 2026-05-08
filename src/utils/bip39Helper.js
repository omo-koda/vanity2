/**
 * BIP-39 Helper: Full wallet derivation + multi-chain support
 * Standard BIP-39 English wordlist + BIP-32/44 hierarchy
 */

import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { Wallet } from 'ethers';
import { payments, networks } from 'bitcoinjs-lib';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { hmac } from '@noble/hashes/hmac';
import { sha512 } from '@noble/hashes/sha512';
import { generateAddressForChain } from './chainCrypto';
import { CHAINS } from './chains';

// Use the canonical BIP-39 English wordlist from the bip39 package
const BIP39_WORDLIST = bip39.wordlists.EN;
const HARDENED_OFFSET = 0x80000000;

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function uint32ToBigEndian(value) {
  return new Uint8Array([
    (value >> 24) & 0xff,
    (value >> 16) & 0xff,
    (value >> 8) & 0xff,
    value & 0xff,
  ]);
}

function hmacSha512(key, data) {
  const keyBytes = typeof key === 'string' ? new TextEncoder().encode(key) : key;
  return hmac(sha512, data, keyBytes);
}

function deriveEd25519Path(seed, path) {
  const segments = path.split('/');
  if (segments[0] !== 'm') {
    throw new Error('Unsupported derivation path');
  }

  let I = hmacSha512('ed25519 seed', seed);
  let key = I.slice(0, 32);
  let chainCode = I.slice(32);

  for (const segment of segments.slice(1)) {
    if (!segment.endsWith("'")) {
      throw new Error('Ed25519 derivation only supports hardened segments');
    }

    const index = parseInt(segment.slice(0, -1), 10);
    if (Number.isNaN(index)) {
      throw new Error('Invalid derivation path segment');
    }

    const data = new Uint8Array(1 + key.length + 4);
    data[0] = 0x00;
    data.set(key, 1);
    data.set(uint32ToBigEndian(HARDENED_OFFSET + index), 1 + key.length);

    I = hmacSha512(chainCode, data);
    key = I.slice(0, 32);
    chainCode = I.slice(32);
  }

  return key;
}

function mnemonicToSeedBytes(mnemonic) {
  return new Uint8Array(bip39.mnemonicToSeedSync(mnemonic));
}

function getEntropyLength(wordCount) {
  const validLengths = [12, 15, 18, 21, 24];
  if (!validLengths.includes(wordCount)) {
    throw new Error('Invalid BIP-39 word count. Use 12, 15, 18, 21, or 24.');
  }
  return (wordCount / 3) * 4;
}

/**
 * Generate random entropy + BIP-39 seed phrase
 * @param {number} wordCount - 12, 15, 18, 21, or 24 words
 * @returns {Object} { entropy, seedPhrase, entropy }
 */
export function generateRandomSeed(wordCount = 12) {
  // BIP-39: 12 words = 128 bits, 24 words = 256 bits
  const byteLength = getEntropyLength(wordCount);
  const entropy = crypto.getRandomValues(new Uint8Array(byteLength));
  const seedPhrase = bip39.entropyToMnemonic(entropy);
  return {
    entropy: bytesToHex(entropy),
    seedPhrase,
    wordCount,
  };
}

/**
 * Validate BIP-39 phrase (includes checksum verification)
 */
export function validateSeedPhrase(phrase) {
  if (!phrase || typeof phrase !== 'string') return false;
  const words = phrase.trim().split(/\s+/);
  if (![12, 15, 18, 21, 24].includes(words.length)) return false;
  return bip39.validateMnemonic(phrase.trim());
}

/**
 * Derive Ethereum wallet from seed phrase (BIP-44 m/44'/60'/0'/0/0)
 */
export function deriveEthereumWallet(seedPhrase) {
  try {
    const wallet = Wallet.fromPhrase(seedPhrase);
    return {
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
      mnemonic: seedPhrase,
    };
  } catch (err) {
    throw new Error(`Invalid seed phrase: ${err.message}`);
  }
}

/**
 * Derive Bitcoin wallet (BIP-84 m/84'/0'/0'/0/0)
 */
export function deriveBitcoinWallet(seedPhrase) {
  try {
    const seed = bip39.mnemonicToSeedSync(seedPhrase);
    const node = bip32.BIP32.fromSeed(seed, networks.bitcoin);
    const derived = node.derivePath(`${CHAINS.bitcoin.bip44}/0/0`);
    const { address } = payments.p2wpkh({ pubkey: derived.publicKey, network: networks.bitcoin });
    return {
      address,
      publicKey: derived.publicKey.toString('hex'),
      derivationPath: `${CHAINS.bitcoin.bip44}/0/0`,
    };
  } catch (err) {
    throw new Error(`Bitcoin derivation failed: ${err.message}`);
  }
}

/**
 * Derive Solana wallet (BIP-44 m/44'/501'/0'/0'/0')
 */
export function deriveSolanaWallet(seedPhrase) {
  try {
    const seed = mnemonicToSeedBytes(seedPhrase);
    const privateKey = deriveEd25519Path(seed, `${CHAINS.solana.bip44}/0'`);
    const keypair = nacl.sign.keyPair.fromSeed(privateKey);
    return {
      address: bs58.encode(keypair.publicKey),
      publicKey: Array.from(keypair.publicKey).map(b => b.toString(16).padStart(2, '0')).join(''),
      derivationPath: `${CHAINS.solana.bip44}/0'`,
    };
  } catch (err) {
    throw new Error(`Solana derivation failed: ${err.message}`);
  }
}

export async function deriveSuiWallet(seedPhrase) {
  const seed = mnemonicToSeedBytes(seedPhrase);
  const privateKey = deriveEd25519Path(seed, `${CHAINS.sui.bip44}/0'`);
  const { address, publicKey } = await generateAddressForChain(CHAINS.sui, privateKey);
  return {
    address,
    publicKey,
    derivationPath: `${CHAINS.sui.bip44}/0'`,
  };
}

export async function deriveCosmosWallet(seedPhrase) {
  const seed = bip39.mnemonicToSeedSync(seedPhrase);
  const node = bip32.BIP32.fromSeed(seed, networks.bitcoin);
  const derived = node.derivePath(`${CHAINS.cosmos.bip44}/0/0`);
  const { address, publicKey } = await generateAddressForChain(CHAINS.cosmos, derived.privateKey);
  return {
    address,
    publicKey,
    derivationPath: `${CHAINS.cosmos.bip44}/0/0`,
  };
}

export async function deriveAptosWallet(seedPhrase) {
  const seed = mnemonicToSeedBytes(seedPhrase);
  const privateKey = deriveEd25519Path(seed, `${CHAINS.aptos.bip44}/0'`);
  const { address, publicKey } = await generateAddressForChain(CHAINS.aptos, privateKey);
  return {
    address,
    publicKey,
    derivationPath: `${CHAINS.aptos.bip44}/0'`,
  };
}

/**
 * Get all addresses from seed phrase
 */
export async function getAllAddresses(seedPhrase) {
  return {
    ethereum: deriveEthereumWallet(seedPhrase),
    bitcoin: deriveBitcoinWallet(seedPhrase),
    solana: deriveSolanaWallet(seedPhrase),
    sui: await deriveSuiWallet(seedPhrase),
    cosmos: await deriveCosmosWallet(seedPhrase),
    aptos: await deriveAptosWallet(seedPhrase),
  };
}

/**
 * Verify word is in BIP-39 list
 */
export function isValidBip39Word(word) {
  return BIP39_WORDLIST.includes(word.toLowerCase());
}

/**
 * Get BIP-39 wordlist
 */
export function getBip39Wordlist() {
  return BIP39_WORDLIST;
}

/**
 * Suggest completions for word prefix
 */
export function suggestWords(prefix, limit = 5) {
  const lower = prefix.toLowerCase();
  return BIP39_WORDLIST
    .filter(w => w.startsWith(lower))
    .slice(0, limit);
}

export default {
  generateRandomSeed,
  validateSeedPhrase,
  deriveEthereumWallet,
  deriveBitcoinWallet,
  deriveSolanaWallet,
  getAllAddresses,
  isValidBip39Word,
  getBip39Wordlist,
  suggestWords
};
